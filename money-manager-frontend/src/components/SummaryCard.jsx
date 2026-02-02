import React from 'react';
import { FaRupeeSign, FaArrowUp, FaArrowDown } from 'react-icons/fa';

const SummaryCard = ({ title, amount, type }) => {
    return (
        <div className="bg-secondary/50 backdrop-blur-md border border-gray-700 p-6 rounded-2xl shadow-lg flex items-center justify-between">
            <div>
                <p className="text-gray-400 text-sm font-medium uppercase tracking-wide mb-1">{title}</p>
                <h3 className={`text-2xl font-bold flex items-center gap-1 ${type === 'income' ? 'text-income' : type === 'expense' ? 'text-expense' : 'text-white'
                    }`}>
                    <FaRupeeSign size={20} /> {amount.toLocaleString()}
                </h3>
            </div>
            <div className={`p-3 rounded-full ${type === 'income' ? 'bg-income/10 text-income' : type === 'expense' ? 'bg-expense/10 text-expense' : 'bg-accent/10 text-accent'
                }`}>
                {type === 'income' ? <FaArrowUp size={24} /> : type === 'expense' ? <FaArrowDown size={24} /> : <FaRupeeSign size={24} />}
            </div>
        </div>
    );
};

export default SummaryCard;
