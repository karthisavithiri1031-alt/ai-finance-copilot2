// routes/expenses.js
const { Router } = require('express');
const { getExpenses, createExpense, updateExpense, deleteExpense } = require('../controllers/expenseController');
const { requireAuth } = require('../middleware/authMiddleware');

const router = Router();
router.use(requireAuth);
router.get('/', getExpenses);
router.post('/', createExpense);
router.put('/:id', updateExpense);
router.delete('/:id', deleteExpense);

module.exports = router;
