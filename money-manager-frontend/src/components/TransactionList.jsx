import React from 'react';
import { FaEdit, FaTrash, FaRupeeSign } from 'react-icons/fa';

const TransactionList = ({ transactions, onEdit, onDelete }) => {

    if (transactions.length === 0) {
        return <div className="text-center text-gray-500 py-10">No transactions found.</div>;
    }

    return (
        <div className="overflow-x-auto rounded-xl border border-gray-700">
            <table className="w-full text-left bg-secondary/30 backdrop-blur-sm">
                <thead>
                    <tr className="bg-gray-800 text-gray-400 text-xs uppercase tracking-wider">
                        <th className="px-6 py-4">Date</th>
                        <th className="px-6 py-4">Description</th>
                        <th className="px-6 py-4">Category</th>
                        <th className="px-6 py-4">Division</th>
                        <th className="px-6 py-4 text-right">Amount</th>
                        <th className="px-6 py-4 text-center">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                    {transactions.map((tx) => (
                        <tr key={tx._id} className="hover:bg-gray-800/50 transition-colors">
                            <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-300">
                                {new Date(tx.date).toLocaleDateString()}
                                <br />
                                <span className="text-xs text-gray-500">{new Date(tx.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </td>
                            <td className="px-6 py-4 text-sm text-white font-medium">{tx.description}</td>
                            <td className="px-6 py-4 text-sm text-gray-300">
                                <span className="px-2 py-1 rounded-full text-xs font-semibold bg-gray-800 border border-gray-600">
                                    {tx.category}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-300">{tx.division}</td>
                            <td className={`px-6 py-4 text-sm text-right font-bold ${tx.type === 'income' ? 'text-income' : 'text-expense'
                                }`}>
                                <div className="flex items-center justify-end gap-1">
                                    {tx.type === 'income' ? '+' : '-'} <FaRupeeSign size={10} /> {tx.amount.toLocaleString()}
                                </div>
                                <span className="text-xs text-gray-500 font-normal">{tx.account}</span>
                            </td>
                            <td className="px-6 py-4 text-center">
                                <button
                                    onClick={() => onEdit(tx)}
                                    className="text-accent hover:text-white p-2 transition-colors"
                                >
                                    <FaEdit />
                                </button>
                                {/* Optional: Enable delete if user wants, functionality is there */}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TransactionList;
