import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';

const TransactionModal = ({ isOpen, onClose, onSave, transaction }) => {
    const [activeTab, setActiveTab] = useState('expense'); // 'income' or 'expense'
    const [formData, setFormData] = useState({
        amount: '',
        date: '',
        description: '',
        category: '',
        division: 'Personal',
        account: 'Cash',
        destinationAccount: '' // For transfer
    });

    useEffect(() => {
        if (transaction) {
            setActiveTab(transaction.type);
            setFormData({
                amount: transaction.amount,
                date: new Date(transaction.date).toISOString().slice(0, 16), // datetime-local format
                description: transaction.description,
                category: transaction.category,
                division: transaction.division,
                account: transaction.account,
                destinationAccount: ''
            });
        } else {
            // Reset for new
            setFormData({
                amount: '',
                date: new Date().toISOString().slice(0, 16),
                description: '',
                category: '',
                division: 'Personal',
                account: 'Cash',
                destinationAccount: ''
            });
            setActiveTab('expense');
        }
    }, [transaction, isOpen]);

    const categories = [
        'Fuel', 'Food', 'Movie', 'Loan', 'Medical', 'Salary', 'Shopping', 'Travel', 'Other'
    ];

    const accounts = ['Cash', 'Bank', 'UPI', 'Savings'];

    // Logic for Transfer
    const isTransfer = formData.category === 'Transfer';

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const payload = {
            ...formData,
            type: isTransfer ? 'transfer' : activeTab,
            // If transfer, we send sourceAccount as account, distinct from destination
            sourceAccount: formData.account
        };
        onSave(payload);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-secondary w-full max-w-md rounded-2xl shadow-2xl border border-gray-700 overflow-hidden">
                <div className="flex justify-between items-center p-4 border-b border-gray-700">
                    <h3 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                        {transaction ? 'Edit Transaction' : 'Add Transaction'}
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <FaTimes size={20} />
                    </button>
                </div>

                {/* Tabs */}
                {!transaction && (
                    <div className="flex border-b border-gray-700">
                        <button
                            className={`flex-1 py-3 font-medium transition-colors ${activeTab === 'income'
                                ? 'text-income border-b-2 border-income bg-green-500/10'
                                : 'text-gray-400 hover:text-gray-200'
                                }`}
                            onClick={() => { setActiveTab('income'); setFormData({ ...formData, category: '' }) }}
                        >
                            Income
                        </button>
                        <button
                            className={`flex-1 py-3 font-medium transition-colors ${activeTab === 'expense'
                                ? 'text-expense border-b-2 border-expense bg-red-500/10'
                                : 'text-gray-400 hover:text-gray-200'
                                }`}
                            onClick={() => setActiveTab('expense')}
                        >
                            Expense
                        </button>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Amount */}
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Amount</label>
                        <input
                            type="number"
                            name="amount"
                            required
                            value={formData.amount}
                            onChange={handleChange}
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-accent focus:outline-none"
                            placeholder="0.00"
                        />
                    </div>

                    {/* Date */}
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Date & Time</label>
                        <input
                            type="datetime-local"
                            name="date"
                            required
                            value={formData.date}
                            onChange={handleChange}
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-accent focus:outline-none"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Description</label>
                        <input
                            type="text"
                            name="description"
                            required
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-accent focus:outline-none"
                            placeholder="Detailed description"
                        />
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Category</label>
                        <select
                            name="category"
                            required
                            value={formData.category}
                            onChange={handleChange}
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-accent focus:outline-none"
                        >
                            <option value="">Select Category</option>
                            {/* Merge Transfer into categories only for Expense tab */}
                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                            {activeTab === 'expense' && <option value="Transfer">Transfer</option>}
                        </select>
                    </div>

                    {/* Division */}
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Division</label>
                        <div className="flex gap-4">
                            {['Office', 'Personal'].map(div => (
                                <label key={div} className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="division"
                                        value={div}
                                        checked={formData.division === div}
                                        onChange={handleChange}
                                        className="text-accent focus:ring-accent bg-gray-900 border-gray-700"
                                    />
                                    <span className="text-gray-300">{div}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Account */}
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">
                            {isTransfer ? 'From Account' : 'Account'}
                        </label>
                        <select
                            name="account"
                            required
                            value={formData.account}
                            onChange={handleChange}
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-accent focus:outline-none"
                        >
                            {accounts.map(acc => <option key={acc} value={acc}>{acc}</option>)}
                        </select>
                    </div>

                    {/* Destination Account (For Transfer) */}
                    {isTransfer && (
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">To Account</label>
                            <select
                                name="destinationAccount"
                                required={isTransfer}
                                value={formData.destinationAccount}
                                onChange={handleChange}
                                className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-accent focus:outline-none"
                            >
                                <option value="">Select Target Account</option>
                                {accounts.filter(acc => acc !== formData.account).map(acc => (
                                    <option key={acc} value={acc}>{acc}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    <button
                        type="submit"
                        className={`w-full py-3 rounded-lg font-bold text-white transition-all transform hover:scale-[1.02] ${activeTab === 'income'
                            ? 'bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg shadow-green-500/20'
                            : 'bg-gradient-to-r from-red-500 to-rose-600 shadow-lg shadow-red-500/20'
                            }`}
                    >
                        {transaction ? 'Update Transaction' : 'Save Transaction'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default TransactionModal;
