

const express = require('express');
const { addTransactions, getAllTransactions, editTransaction, deleteTransaction } = require('../controllers/transactionControllers');

const router = express.Router();

router.post('/add-transaction', addTransactions);
router.post('/edit-transaction', editTransaction);
router.post('/delete-transaction', deleteTransaction);
router.post('/get-transaction', getAllTransactions);

module.exports = router;
