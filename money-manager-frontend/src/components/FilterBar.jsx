import React from 'react';
import { FaFilter } from 'react-icons/fa';

const FilterBar = ({ filters, setFilters }) => {
    const handleChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    return (
        <div className="bg-secondary/50 backdrop-blur-sm p-4 rounded-xl border border-gray-700 mb-6 flex flex-wrap gap-4 items-end">
            <div className="flex items-center gap-2 text-accent mb-1 w-full sm:w-auto">
                <FaFilter /> <span className="font-semibold">Filters</span>
            </div>

            <div className="flex-1 min-w-[150px]">
                <label className="block text-xs text-gray-500 mb-1">Start Date</label>
                <input
                    type="date"
                    name="startDate"
                    value={filters.startDate}
                    onChange={handleChange}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-accent"
                />
            </div>

            <div className="flex-1 min-w-[150px]">
                <label className="block text-xs text-gray-500 mb-1">End Date</label>
                <input
                    type="date"
                    name="endDate"
                    value={filters.endDate}
                    onChange={handleChange}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-accent"
                />
            </div>

            <div className="flex-1 min-w-[120px]">
                <label className="block text-xs text-gray-500 mb-1">Category</label>
                <select
                    name="category"
                    value={filters.category}
                    onChange={handleChange}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-accent"
                >
                    <option value="">All Categories</option>
                    {['Fuel', 'Food', 'Movie', 'Loan', 'Medical', 'Salary', 'Shopping', 'Transfer', 'Other'].map(c => (
                        <option key={c} value={c}>{c}</option>
                    ))}
                </select>
            </div>

            <div className="flex-1 min-w-[120px]">
                <label className="block text-xs text-gray-500 mb-1">Division</label>
                <select
                    name="division"
                    value={filters.division}
                    onChange={handleChange}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-accent"
                >
                    <option value="">All Divisions</option>
                    <option value="Office">Office</option>
                    <option value="Personal">Personal</option>
                </select>
            </div>
        </div>
    );
};

export default FilterBar;
