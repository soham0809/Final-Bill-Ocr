import React from 'react';

const API_BASE_URL = 'http://localhost:5000';

function BillTable({ bills, onDelete, onEdit }) {
    // Helper function to get the correct image URL
    const getImageUrl = (imageUrl) => {
        if (!imageUrl) return '/placeholder-image.jpg';
        if (imageUrl.startsWith('http')) return imageUrl;
        if (imageUrl.startsWith('/static')) return `${API_BASE_URL}${imageUrl}`;
        return imageUrl;
    };

    if (bills.length === 0) {
        return (
            <div className="card">
                <h2 className="card-title">
                    <span>
                        <span className="card-title-icon">📋</span> Your Bills
                    </span>
                </h2>
                <div className="empty-state">
                    <div className="empty-state-icon">📃</div>
                    <h3 className="empty-state-title">No bills yet</h3>
                    <p className="empty-state-text">
                        Upload some bill images to scan and track your expenses
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="card">
            <h2 className="card-title">
                <span>
                    <span className="card-title-icon">📋</span> Your Bills
                    <span className="bills-count">{bills.length}</span>
                </span>
            </h2>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Preview</th>
                            <th>Vendor</th>
                            <th>Date</th>
                            <th>Amount</th>
                            <th>Category</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bills.map(bill => (
                            <tr key={bill.id}>
                                <td>
                                    <div className="bill-preview">
                                        <img
                                            src={getImageUrl(bill.imageUrl)}
                                            alt="Bill Preview"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = '/placeholder-image.jpg';
                                            }}
                                        />
                                    </div>
                                </td>
                                <td>{bill.vendor}</td>
                                <td>{bill.date}</td>
                                <td className="amount-cell">{bill.amount}</td>
                                <td>
                                    <span className={`category-tag category-${bill.category}`}>
                                        {bill.category}
                                    </span>
                                </td>
                                <td className="action-cell">
                                    <button
                                        className="btn btn-primary edit-btn"
                                        onClick={() => onEdit(bill)}
                                    >
                                        <span className="btn-icon">✏️</span> Edit
                                    </button>
                                    <button
                                        className="btn btn-danger delete-btn"
                                        onClick={() => onDelete(bill.id)}
                                    >
                                        <span className="btn-icon">🗑️</span> Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default BillTable;