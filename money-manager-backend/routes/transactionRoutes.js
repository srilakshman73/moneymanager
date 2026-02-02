const express = require('express');
const router = express.Router();
const {
    getTransactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    getAnalytics
} = require('../controllers/transactionController');

router.route('/')
    .get(getTransactions)
    .post(addTransaction);

router.route('/:id')
    .put(updateTransaction)
    .delete(deleteTransaction);

router.route('/analytics/summary')
    .get(getAnalytics);

module.exports = router;
