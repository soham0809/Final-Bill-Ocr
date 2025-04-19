/**
 * This file contains functions for interacting with the backend API
 * In a real implementation, these would make actual HTTP requests
 * but for now we'll simulate using localStorage
 */

// Load bills from localStorage (simulates API GET request)
export const fetchBills = () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const bills = JSON.parse(localStorage.getItem('bills') || '[]');
            resolve(bills);
        }, 300); // Simulate network delay
    });
};

// Save bills to localStorage (simulates API POST request)
export const saveBills = (bills) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            localStorage.setItem('bills', JSON.stringify(bills));
            resolve({ success: true });
        }, 300);
    });
};

// Process bill images with OCR (simulates file upload and processing)
export const processImages = (files) => {
    return new Promise((resolve) => {
        // This function would normally send the images to a server for OCR processing
        // For demo purposes, we'll simulate with random data

        setTimeout(() => {
            const processedBills = Array.from(files).map(file => {
                // Generate a unique ID
                const id = Math.random().toString(36).substring(2, 15);

                // Create an object URL for the image
                const imageUrl = URL.createObjectURL(file);

                // Simulate random bill data
                const vendors = ['Walmart', 'Target', 'CVS Pharmacy', 'Shell', 'Apple Store', 'Restaurant XYZ'];
                const categories = ['Restaurant', 'Supermarket', 'Pharmacy', 'Utilities', 'Transportation', 'Electronics'];

                return {
                    id,
                    vendor: vendors[Math.floor(Math.random() * vendors.length)],
                    date: new Date().toLocaleDateString(),
                    amount: (Math.random() * 100).toFixed(2),
                    category: categories[Math.floor(Math.random() * categories.length)],
                    image: file.name,
                    imageUrl,
                    timestamp: new Date().toISOString()
                };
            });

            resolve(processedBills);
        }, 2000); // Simulate longer processing time
    });
};

// Update a bill (simulates API PUT request)
export const updateBill = (billId, billData) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const bills = JSON.parse(localStorage.getItem('bills') || '[]');
            const updatedBills = bills.map(bill =>
                bill.id === billId ? { ...bill, ...billData } : bill
            );
            localStorage.setItem('bills', JSON.stringify(updatedBills));
            resolve({ success: true });
        }, 300);
    });
};

// Delete a bill (simulates API DELETE request)
export const deleteBill = (billId) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const bills = JSON.parse(localStorage.getItem('bills') || '[]');
            const updatedBills = bills.filter(bill => bill.id !== billId);
            localStorage.setItem('bills', JSON.stringify(updatedBills));
            resolve({ success: true });
        }, 300);
    });
};