import React, { useState, useEffect } from 'react';
import './styles/style.css';
import BillTable from './components/BillTable';
import UploadForm from './components/UploadForm';
import DashboardCards from './components/DashboardCards';
import EditBillModal from './components/EditBillModal';
import LoadingAnimation from './components/LoadingAnimation';
import { fetchBills, saveBills, processImages, updateBill, deleteBill } from './services/api';

function App() {
    const [bills, setBills] = useState([]);
    const [categories, setCategories] = useState({});
    const [totalSpent, setTotalSpent] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [currentBill, setCurrentBill] = useState(null);

    // Load bills on component mount
    useEffect(() => {
        const loadBills = async () => {
            const loadedBills = await fetchBills();
            setBills(loadedBills);
            calculateTotals(loadedBills);
        };

        loadBills();
    }, []);

    // Calculate totals by category
    const calculateTotals = (billsData) => {
        const cats = {};
        let total = 0;

        billsData.forEach(bill => {
            const amount = parseFloat(bill.amount || 0);
            const category = bill.category || 'Unknown';

            if (cats[category]) {
                cats[category] += amount;
            } else {
                cats[category] = amount;
            }

            total += amount;
        });

        setCategories(cats);
        setTotalSpent(total);
    };

    // Handle file upload
    const handleUpload = async (files) => {
        setIsLoading(true);

        try {
            // Process images with simulated OCR
            const processedBills = await processImages(files);

            // Update bills state with new data
            const updatedBills = [...bills, ...processedBills];
            setBills(updatedBills);

            // Save to "backend" (localStorage in this case)
            await saveBills(updatedBills);

            // Update totals
            calculateTotals(updatedBills);
        } catch (error) {
            console.error('Error processing bills:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Handle bill deletion
    const handleDeleteBill = async (billId) => {
        if (window.confirm('Are you sure you want to delete this bill?')) {
            try {
                await deleteBill(billId);
                const updatedBills = bills.filter(bill => bill.id !== billId);
                setBills(updatedBills);
                calculateTotals(updatedBills);
            } catch (error) {
                console.error('Error deleting bill:', error);
            }
        }
    };

    // Handle edit bill button click
    const handleEditBill = (bill) => {
        setCurrentBill(bill);
        setShowEditModal(true);
    };

    // Handle save edit
    const handleSaveEdit = async (editedBill) => {
        try {
            await updateBill(editedBill.id, editedBill);

            const updatedBills = bills.map(bill =>
                bill.id === editedBill.id ? editedBill : bill
            );

            setBills(updatedBills);
            calculateTotals(updatedBills);
            setShowEditModal(false);
        } catch (error) {
            console.error('Error updating bill:', error);
        }
    };

    return (
        <div className="container">
            <header>
                <div className="logo-container">
                    <div className="logo">📑</div>
                    <h1>SmartScan Bill OCR</h1>
                </div>
            </header>

            {/* Dashboard Cards */}
            <DashboardCards
                totalSpent={totalSpent}
                categories={categories}
            />

            {/* Upload Form */}
            <UploadForm onUpload={handleUpload} />

            {/* Loading Animation */}
            {isLoading && <LoadingAnimation />}

            {/* Bills Table */}
            <BillTable
                bills={bills}
                onDelete={handleDeleteBill}
                onEdit={handleEditBill}
            />

            {/* Edit Bill Modal */}
            {showEditModal && currentBill && (
                <EditBillModal
                    bill={currentBill}
                    onClose={() => setShowEditModal(false)}
                    onSave={handleSaveEdit}
                />
            )}
        </div>
    );
}

export default App;