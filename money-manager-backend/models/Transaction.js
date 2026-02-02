const mongoose = require('mongoose');

const transactionSchema = mongoose.Schema({
    type: {
        type: String,
        required: [true, 'Please add a transaction type'],
        enum: ['income', 'expense']
    },
    amount: {
        type: Number,
        required: [true, 'Please add an amount']
    },
    category: {
        type: String, // e.g., Fuel, Food, Movie, Loan, Medical, Salary, etc.
        required: [true, 'Please add a category']
    },
    description: {
        type: String,
        required: [true, 'Please add a description']
    },
    date: {
        type: Date,
        required: [true, 'Please add a date']
    },
    division: {
        type: String,
        required: [true, 'Please select a division'],
        enum: ['Office', 'Personal']
    },
    account: {
        type: String,
        required: [true, 'Please select an account'],
        enum: ['Cash', 'Bank', 'UPI', 'Savings']
    },
    // For transfers, we link the two transactions
    transferId: {
        type: String,
        default: null
    }
}, {
    timestamps: true // This gives us createdAt which we need for the 12-hour edit rule
});

module.exports = mongoose.model('Transaction', transactionSchema);
