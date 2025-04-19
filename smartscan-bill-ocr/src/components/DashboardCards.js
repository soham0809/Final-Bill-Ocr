import React from 'react';

function DashboardCards({ totalSpent, categories }) {
    // Function to get the appropriate emoji for each category
    const getCategoryEmoji = (category) => {
        switch (category) {
            case 'Restaurant': return '🍽️';
            case 'Supermarket': return '🛒';
            case 'Pharmacy': return '💊';
            case 'Utilities': return '💡';
            case 'Transportation': return '🚗';
            case 'Electronics': return '📱';
            case 'Clothing': return '👕';
            case 'Entertainment': return '🎬';
            default: return '📝';
        }
    };

    return (
        <div className="dashboard">
            <div className="dashboard-card">
                <div className="dashboard-icon">📊</div>
                <div className="dashboard-value">
                    {parseFloat(totalSpent).toFixed(2)}
                </div>
                <div className="dashboard-label">Total Spent</div>
            </div>

            {Object.entries(categories).map(([category, amount]) => (
                <div className="dashboard-card" key={category}>
                    <div className="dashboard-icon">
                        {getCategoryEmoji(category)}
                    </div>
                    <div className="dashboard-value">{parseFloat(amount).toFixed(2)}</div>
                    <div className="dashboard-label">{category}</div>
                </div>
            ))}
        </div>
    );
}

export default DashboardCards;