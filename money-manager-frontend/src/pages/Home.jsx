import React, { useState, useEffect } from 'react';
import { FaPlus } from 'react-icons/fa';
import api from '../services/api';
import TransactionList from '../components/TransactionList';
import TransactionModal from '../components/TransactionModal';
import FilterBar from '../components/FilterBar';
import SummaryCard from '../components/SummaryCard';

const Home = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentTransaction, setCurrentTransaction] = useState(null);

    // Filters
    const [filters, setFilters] = useState({
        startDate: '',
        endDate: '',
        category: '',
        division: ''
    });

    // Summary (Calculated from filtered transactions)
    const [summary, setSummary] = useState({ income: 0, expense: 0 });

    const fetchTransactions = async () => {
        try {
            setLoading(true);
            const params = {
                ...filters
            };
            // Remove empty filters
            Object.keys(params).forEach(key => params[key] === '' && delete params[key]);

            const response = await api.get('/transactions', { params });
            setTransactions(response.data);

            // Calculate summary locally for the view
            const inc = response.data.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
            const exp = response.data.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
            setSummary({ income: inc, expense: exp });

        } catch (error) {
            console.error("Error fetching transactions:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, [filters]);

    const handleSave = async (data) => {
        try {
            if (currentTransaction) {
                // Edit
                await api.put(`/transactions/${currentTransaction._id}`, data);
            } else {
                // Add
                await api.post('/transactions', data);
            }
            setIsModalOpen(false);
            setCurrentTransaction(null);
            fetchTransactions(); // Refresh
        } catch (error) {
            alert(error.response?.data?.message || 'Error saving transaction');
        }
    };

    const handleEdit = (transaction) => {
        // Front-end check for 12 hours check (optional UX, backend enforces it)
        const date = new Date(transaction.createdAt);
        const now = new Date();
        const diffHours = (now - date) / (1000 * 60 * 60);

        if (diffHours > 12) {
            alert("Editing is strictly blocked after 12 hours.");
            return;
        }

        setCurrentTransaction(transaction);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure?")) {
            try {
                await api.delete(`/transactions/${id}`);
                fetchTransactions();
            } catch (error) {
                console.error(error);
            }
        }
    };

    return (
        <div className="px-4 py-8 max-w-7xl mx-auto">

            {/* Summary Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <SummaryCard title="Total Income" amount={summary.income} type="income" />
                <SummaryCard title="Total Expense" amount={summary.expense} type="expense" />
                <SummaryCard title="Net Balance" amount={summary.income - summary.expense} type="neutral" />
            </div>

            {/* Actions & Filters */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <h2 className="text-2xl font-bold text-white">Latest Transactions</h2>
                <button
                    onClick={() => { setCurrentTransaction(null); setIsModalOpen(true); }}
                    className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-cyan-500/30 transition-all active:scale-95"
                >
                    <FaPlus /> Add New
                </button>
            </div>

            <FilterBar filters={filters} setFilters={setFilters} />

            {loading ? (
                <div className="text-center py-20 text-gray-500 animate-pulse">Loading transactions...</div>
            ) : (
                <TransactionList
                    transactions={transactions}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            )}

            <TransactionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                transaction={currentTransaction}
            />
        </div>
    );
};

export default Home;
