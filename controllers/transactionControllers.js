
const transactionModel = require('../models/transactionModel');
const moment = require('moment');

const getAllTransactions = async (req, res) => {
  try {
    const { frequency, userid, selectedDate, type } = req.body;
    if (!frequency || !userid) {
      return res.status(400).json({ message: 'Frequency and User ID are required' });
    }

    let dateQuery = {};
    if (frequency === 'custom' && selectedDate && selectedDate.length === 2) {
      const startDate = moment(selectedDate[0]);
      const endDate = moment(selectedDate[1]);
      if (!startDate.isValid() || !endDate.isValid()) {
        return res.status(400).json({ message: 'Invalid date range provided' });
      }
      dateQuery = { $gte: startDate.toDate(), $lte: endDate.toDate() };
    } else {
      dateQuery = { $gt: moment().subtract(Number(frequency), 'd').toDate() };
    }

    const filter = { userid, date: dateQuery, ...(type !== 'all' && { type }) };
    const transactions = await transactionModel.find(filter);
    res.status(200).json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ message: 'Internal Server Error', error });
  }
};

const addTransactions = async (req, res) => {
  try {
    const newTransaction = new transactionModel(req.body);
    const savedTransaction = await newTransaction.save();
    res.status(201).json({ message: 'Transaction created', transaction: savedTransaction });
  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(500).json({ message: 'Internal Server Error', error });
  }
};

const editTransaction = async (req, res) => {
  try {
    const result = await transactionModel.findByIdAndUpdate(req.body.transactionId, req.body.payload, { new: true });
    if (!result) {
      return res.status(404).json({ message: "Transaction not found" });
    }
    res.status(200).send('Transaction edited successfully');
  } catch (error) {
    console.error('Error editing transaction:', error);
    res.status(500).json({ message: 'Failed to edit transaction', error });
  }
};

const deleteTransaction = async (req, res) => {
  try {
    const result = await transactionModel.findOneAndDelete({ _id: req.body.transactionId });
    if (!result) {
      return res.status(404).json({ message: "Transaction not found" });
    }
    res.status(200).send('Transaction deleted successfully');
  } catch (error) {
    console.error('Error deleting transaction:', error);
    res.status(500).json({ message: 'Failed to delete transaction', error });
  }
};

module.exports = { getAllTransactions, addTransactions, editTransaction, deleteTransaction };
