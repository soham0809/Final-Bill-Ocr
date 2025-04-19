/**
 * This file contains functions for interacting with the backend API
 * In a real implementation, these would make actual HTTP requests
 * but for now we'll simulate using localStorage
 */

const API_BASE_URL = 'http://localhost:5000/api';

// Load bills from backend
export const fetchBills = async () => {
    const response = await fetch(`${API_BASE_URL}/bills`);
    const data = await response.json();
    return data;
};

// Save bills to backend
export const saveBills = async (bills) => {
    const response = await fetch(`${API_BASE_URL}/bills`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(bills)
    });
    return await response.json();
};

// Process bill images with OCR
export const processImages = async (files) => {
    const formData = new FormData();
    Array.from(files).forEach(file => {
        formData.append('files[]', file);
    });

    const response = await fetch(`${API_BASE_URL}/bills`, {
        method: 'POST',
        body: formData
    });

    const data = await response.json();
    if (data.error) {
        throw new Error(data.error);
    }
    return data.processed_bills;
};

// Update a bill
export const updateBill = async (billId, billData) => {
    const response = await fetch(`${API_BASE_URL}/bills/${billId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(billData)
    });
    return await response.json();
};

// Delete a bill
export const deleteBill = async (billId) => {
    const response = await fetch(`${API_BASE_URL}/bills/${billId}`, {
        method: 'DELETE'
    });
    return await response.json();
};