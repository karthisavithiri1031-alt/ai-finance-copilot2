// routes/budgets.js
const { Router } = require('express');
const { getBudgets, createBudget, updateBudget, deleteBudget } = require('../controllers/budgetController');
const { requireAuth } = require('../middleware/authMiddleware');

const router = Router();
router.use(requireAuth);
router.get('/', getBudgets);
router.post('/', createBudget);
router.put('/:id', updateBudget);
router.delete('/:id', deleteBudget);

module.exports = router;
