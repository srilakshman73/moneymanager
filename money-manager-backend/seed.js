const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Transaction = require('./models/Transaction');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const seedData = [
    {
        type: 'income',
        amount: 50000,
        category: 'Salary',
        description: 'Monthly Salary',
        date: new Date('2023-10-01'),
        division: 'Personal',
        account: 'Bank'
    },
    {
        type: 'expense',
        amount: 2000,
        category: 'Food',
        description: 'Grocery Shopping',
        date: new Date('2023-10-05'),
        division: 'Personal',
        account: 'Cash'
    },
    {
        type: 'expense',
        amount: 1500,
        category: 'Fuel',
        description: 'Car Patrol',
        date: new Date('2023-10-07'),
        division: 'Office',
        account: 'UPI'
    },
    {
        type: 'income',
        amount: 10000,
        category: 'Freelance',
        description: 'Web Design Project',
        date: new Date('2023-10-10'),
        division: 'Personal',
        account: 'Savings'
    },
    {
        type: 'expense',
        amount: 500,
        category: 'Medical',
        description: 'Medicine',
        date: new Date(),
        division: 'Personal',
        account: 'Cash'
    }
];

const importData = async () => {
    try {
        await Transaction.deleteMany();
        await Transaction.insertMany(seedData);
        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

importData();
