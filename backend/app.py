from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import easyocr
import cv2
import numpy as np
import re
import json
from datetime import datetime
import uuid

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

UPLOAD_FOLDER = 'static/uploads'
DATA_FILE = 'static/data/bills.json'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Ensure directories exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs('static/data', exist_ok=True)

def init_bills_db():
    if not os.path.exists(DATA_FILE):
        with open(DATA_FILE, 'w') as f:
            json.dump([], f)

def load_bills():
    try:
        with open(DATA_FILE, 'r') as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        return []

def save_bills(bills):
    with open(DATA_FILE, 'w') as f:
        json.dump(bills, f, indent=4)

@app.route('/api/bills', methods=['GET'])
def get_bills():
    init_bills_db()
    bills = load_bills()
    return jsonify(bills)

@app.route('/api/bills', methods=['POST'])
def upload_bills():
    if 'files[]' not in request.files:
        return jsonify({'error': 'No files provided'}), 400
    
    files = request.files.getlist('files[]')
    if not files or files[0].filename == '':
        return jsonify({'error': 'No files selected'}), 400
    
    processed_bills = []
    bills = load_bills()
    
    for file in files:
        if file:
            # Generate a unique filename to avoid overwriting
            file_ext = os.path.splitext(file.filename)[1]
            unique_filename = f"{uuid.uuid4().hex}{file_ext}"
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)
            file.save(filepath)
            
            # Process the bill image
            bill_data = process_bill(filepath, unique_filename)
            
            if bill_data:
                bill_data['id'] = str(uuid.uuid4())
                bill_data['timestamp'] = datetime.now().isoformat()
                bill_data['imageUrl'] = f"/static/uploads/{unique_filename}"  # Add imageUrl for React frontend
                bills.append(bill_data)
                processed_bills.append(bill_data)
    
    # Save updated bills
    save_bills(bills)
    
    return jsonify({
        'success': True,
        'processed_bills': processed_bills
    })

def process_bill(filepath, filename):
    try:
        # OCR processing
        reader = easyocr.Reader(['en'], gpu=False)
        result = reader.readtext(filepath)
        
        texts = [item[1] for item in result]
        
        # Extract total amount
        total_amount = extract_amount(texts)
        
        # Category detection
        bill_category = detect_category(texts)
        
        # Extract vendor and date
        vendor = texts[0] if texts else "Unknown"
        date = extract_date(texts)
        
        return {
            'vendor': vendor,
            'date': date,
            'amount': total_amount if total_amount else "0.00",
            'category': bill_category,
            'image': filename
        }
    except Exception as e:
        print(f"Error processing bill: {e}")
        return None

def extract_amount(texts):
    keywords = ['total', 'amount', 'net total', 'grand total', 'sum', 'balance', 'payment']
    
    for i, text in enumerate(texts):
        lowered = text.lower()
        
        if any(key in lowered for key in keywords):
            # Fix common OCR misreads
            corrected_text = text.replace('8', '$') if '8' in text and '$' not in text else text
            
            # Look for currency symbols
            found = re.findall(r'(?:₹|\$|€|£|rs\.?|r)\s*\d+(?:[\.,]\d{1,2})?', corrected_text, re.IGNORECASE)
            if found:
                return re.sub(r'[^\d.]', '', found[-1])
            
            # Try to find just numbers that might be totals
            found = re.findall(r'\d+[\.,]\d{2}', corrected_text)
            if found:
                return found[-1]
            
            # Try next line if nothing found
            if i + 1 < len(texts):
                next_line = texts[i + 1]
                corrected_next = next_line.replace('8', '$') if '8' in next_line and '$' not in next_line else next_line
                
                found = re.findall(r'(?:₹|\$|€|£|rs\.?|r)\s*\d+(?:[\.,]\d{1,2})?', corrected_next, re.IGNORECASE)
                if found:
                    return re.sub(r'[^\d.]', '', found[-1])
                
                found = re.findall(r'\d+[\.,]\d{2}', corrected_next)
                if found:
                    return found[-1]
    
    # If nothing found with keywords, try to find the largest number with decimal points
    amounts = []
    for text in texts:
        found = re.findall(r'\d+[\.,]\d{2}', text)
        amounts.extend([float(f.replace(',', '.')) for f in found])
    
    if amounts:
        return str(max(amounts))
    
    return None

def detect_category(texts):
    categories = {
        "Restaurant": ["food", "item", "table", "waiter", "restaurant", "dish", "menu", "chef", "appetizer", "dessert"],
        "Supermarket": ["groceries", "vegetable", "supermarket", "mart", "qty", "mrp", "produce", "dairy", "frozen"],
        "Pharmacy": ["medicine", "pharmacy", "tablet", "capsule", "dose", "prescription", "drug", "health"],
        "Utilities": ["electricity", "water", "gas", "bill", "utility", "consumption", "meter", "service"],
        "Transportation": ["fuel", "gas", "petrol", "diesel", "ticket", "fare", "toll", "travel"],
        "Electronics": ["device", "gadget", "electronics", "computer", "phone", "warranty", "tech"],
        "Clothing": ["apparel", "clothing", "shirt", "pants", "dress", "size", "wear", "fashion"],
        "Entertainment": ["movie", "ticket", "show", "event", "concert", "admission"]
    }
    
    category_scores = {cat: 0 for cat in categories}
    
    for cat, keys in categories.items():
        for text in texts:
            lower_text = text.lower()
            for key in keys:
                if key in lower_text:
                    category_scores[cat] += 1
    
    if max(category_scores.values()) > 0:
        return max(category_scores, key=category_scores.get)
    
    return "Miscellaneous"

def extract_date(texts):
    date_patterns = [
        r'(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})',  # DD/MM/YYYY, MM/DD/YYYY
        r'(\d{2,4}[/-]\d{1,2}[/-]\d{1,2})',  # YYYY/MM/DD
        r'(\d{1,2}[-.]\d{1,2}[-.]\d{2,4})',  # DD.MM.YYYY
        r'(\d{2,4}[-.]\d{1,2}[-.]\d{1,2})',  # YYYY.MM.DD
        r'(\w{3,9}\s+\d{1,2},?\s+\d{2,4})',  # Month DD, YYYY
        r'(\d{1,2}\s+\w{3,9}\s+\d{2,4})'     # DD Month YYYY
    ]
    
    for text in texts:
        for pattern in date_patterns:
            match = re.search(pattern, text)
            if match:
                return match.group(1)
    
    return "Unknown"

@app.route('/api/bills/<bill_id>', methods=['DELETE'])
def delete_bill(bill_id):
    bills = load_bills()
    bills = [bill for bill in bills if bill.get('id') != bill_id]
    save_bills(bills)
    return jsonify({'success': True})

@app.route('/api/bills/<bill_id>', methods=['PUT'])
def update_bill(bill_id):
    data = request.get_json()
    bills = load_bills()
    
    for bill in bills:
        if bill.get('id') == bill_id:
            bill.update(data)
            break
    
    save_bills(bills)
    return jsonify({'success': True})

if __name__ == '__main__':
    app.run(debug=True, port=5000) 