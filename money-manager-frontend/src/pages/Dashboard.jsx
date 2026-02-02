import React, { useState, useEffect } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import api from '../services/api';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const Dashboard = () => {
    const [timeRange, setTimeRange] = useState('weekly');
    const [chartData, setChartData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, [timeRange]);

    const fetchData = async () => {
        setLoading(true);
        try {
            // Calculate date range based on dropdown
            const end = new Date();
            let start = new Date();

            if (timeRange === 'weekly') {
                start.setDate(end.getDate() - 7);
            } else if (timeRange === 'monthly') {
                start.setMonth(end.getMonth() - 1);
            } else if (timeRange === 'yearly') {
                start.setFullYear(end.getFullYear() - 1);
            }

            const response = await api.get('/transactions', {
                params: {
                    startDate: start.toISOString(),
                    endDate: end.toISOString()
                }
            });

            const transactions = response.data;
            processChartData(transactions, start, end);

        } catch (error) {
            console.error("Error fetching analytics:", error);
        } finally {
            setLoading(false);
        }
    };

    const processChartData = (transactions, start, end) => {
        let labels = [];
        let incomeData = [];
        let expenseData = [];

        if (timeRange === 'weekly') {
            // Last 7 days
            for (let i = 6; i >= 0; i--) {
                const d = new Date();
                d.setDate(d.getDate() - i);
                labels.push(d.toLocaleDateString('en-US', { weekday: 'short' }));

                // Filter transactions for this day
                const txs = transactions.filter(t => new Date(t.date).toDateString() === d.toDateString());
                incomeData.push(txs.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0));
                expenseData.push(txs.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0));
            }
        } else if (timeRange === 'monthly') {
            // Last 30 days, grouped by 5 days interval or just days? Let's do weeks for clarity
            // Or simplification: just show 4 weeks
            for (let i = 3; i >= 0; i--) {
                // Logic for weeks is complex, let's do last 30 days? A bit crowded.
                // Let's do last 4 weeks.
                labels.push(`Week ${4 - i}`);
                incomeData.push(0); // Placeholder if too complex
                expenseData.push(0);
            }
            // Actually, let's just do by category for Monthly? No, requirement says "Monthly income vs expense"
            // Let's do a simple aggregation by Week number relative to start.

            // Re-think: Group by week
            // Map transactions to weeks.
            // Simpler approach for hackathon: List 4 weeks.
            const oneWeek = 7 * 24 * 60 * 60 * 1000;
            const buckets = [0, 0, 0, 0]; // Income
            const bucketsExp = [0, 0, 0, 0]; // Expense

            transactions.forEach(t => {
                const diff = new Date(t.date) - start;
                const weekIndex = Math.floor(diff / oneWeek);
                if (weekIndex >= 0 && weekIndex < 4) {
                    if (t.type === 'income') buckets[weekIndex] += t.amount;
                    else bucketsExp[weekIndex] += t.amount;
                }
            });
            labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
            incomeData = buckets;
            expenseData = bucketsExp;

        } else if (timeRange === 'yearly') {
            // Last 12 months
            for (let i = 11; i >= 0; i--) {
                const d = new Date();
                d.setMonth(d.getMonth() - i);
                const monthName = d.toLocaleDateString('en-US', { month: 'short' });
                labels.push(monthName);

                const txs = transactions.filter(t => {
                    const tDate = new Date(t.date);
                    return tDate.getMonth() === d.getMonth() && tDate.getFullYear() === d.getFullYear();
                });

                incomeData.push(txs.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0));
                expenseData.push(txs.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0));
            }
        }

        setChartData({
            labels,
            datasets: [
                {
                    label: 'Income',
                    data: incomeData,
                    backgroundColor: '#22c55e',
                    borderRadius: 4
                },
                {
                    label: 'Expense',
                    data: expenseData,
                    backgroundColor: '#ef4444',
                    borderRadius: 4
                }
            ]
        });
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
                labels: { color: '#9ca3af' }
            },
            title: {
                display: true,
                text: `${timeRange.charAt(0).toUpperCase() + timeRange.slice(1)} Income vs Expense`,
                color: '#fff'
            },
        },
        scales: {
            y: {
                ticks: { color: '#9ca3af' },
                grid: { color: '#374151' }
            },
            x: {
                ticks: { color: '#9ca3af' },
                grid: { display: false }
            }
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-white">Analytics Dashboard</h2>
                <select
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value)}
                    className="bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-accent"
                >
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                </select>
            </div>

            <div className="bg-secondary/50 backdrop-blur-md p-6 rounded-2xl border border-gray-700 shadow-xl">
                {loading || !chartData ? (
                    <div className="h-96 flex items-center justify-center text-gray-500">Loading chart data...</div>
                ) : (
                    <Bar options={options} data={chartData} />
                )}
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Could add Pie chart for categories here if needed, but requirements met */}
            </div>
        </div>
    );
};

export default Dashboard;
