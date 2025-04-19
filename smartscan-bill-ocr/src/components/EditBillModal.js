import React, { useState } from 'react';

function EditBillModal({ bill, onClose, onSave }) {
    const [formData, setFormData] = useState({
        id: bill.id,
        vendor: bill.vendor,
        date: bill.date,
        amount: bill.amount,
        category: bill.category,
        image: bill.image,
        imageUrl: bill.imageUrl,
        timestamp: bill.timestamp
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="modal-overlay active" id="edit-modal">
            <div className="modal">
                <div className="modal-header">
                    <h3 className="modal-title">Edit Bill</h3>
                    <button className="modal-close" onClick={onClose}>&times;</button>
                </div>
                <div className="modal-body">
                    <form id="edit-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="edit-vendor" className="form-label">Vendor</label>
                            <input
                                type="text"
                                id="edit-vendor"
                                name="vendor"
                                value={formData.vendor}
                                onChange={handleChange}
                                className="form-control"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="edit-date" className="form-label">Date</label>
                            <input
                                type="text"
                                id="edit-date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                className="form-control"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="edit-amount" className="form-label">Amount</label>
                            <input
                                type="number"
                                id="edit-amount"
                                name="amount"
                                step="0.01"
                                value={formData.amount}
                                onChange={handleChange}
                                className="form-control"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="edit-category" className="form-label">Category</label>
                            <select
                                id="edit-category"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="form-select"
                            >
                                <option value="Restaurant">Restaurant</option>
                                <option value="Supermarket">Supermarket</option>
                                <option value="Pharmacy">Pharmacy</option>
                                <option value="Utilities">Utilities</option>
                                <option value="Transportation">Transportation</option>
                                <option value="Electronics">Electronics</option>
                                <option value="Clothing">Clothing</option>
                                <option value="Entertainment">Entertainment</option>
                                <option value="Miscellaneous">Miscellaneous</option>
                            </select>
                        </div>
                    </form>
                </div>
                <div className="modal-footer">
                    <button className="btn" onClick={onClose}>Cancel</button>
                    <button className="btn btn-primary" onClick={handleSubmit}>Save Changes</button>
                </div>
            </div>
        </div>
    );
}

export default EditBillModal;