// controllers/budgetController.js — Budget CRUD
const { query } = require('../database/index');
const { getBudgetStatus } = require('../ai-agents/budgetAgent');

const getBudgets = async (req, res) => {
  try {
    const status = await getBudgetStatus(req.user.userId);
    res.json(status);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createBudget = async (req, res) => {
  try {
    const { category, limit_amount } = req.body;
    if (!category || !limit_amount) return res.status(400).json({ error: 'category and limit_amount required' });

    const result = await query(
      `INSERT INTO budgets (user_id, category, limit_amount) VALUES ($1,$2,$3)
       ON CONFLICT DO NOTHING RETURNING *`,
      [req.user.userId, category, limit_amount]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateBudget = async (req, res) => {
  try {
    const { id } = req.params;
    const { limit_amount } = req.body;
    const result = await query(
      `UPDATE budgets SET limit_amount = $1 WHERE id = $2 AND user_id = $3 RETURNING *`,
      [limit_amount, id, req.user.userId]
    );
    if (!result.rows.length) return res.status(404).json({ error: 'Budget not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteBudget = async (req, res) => {
  try {
    const { id } = req.params;
    await query(`DELETE FROM budgets WHERE id = $1 AND user_id = $2`, [id, req.user.userId]);
    res.json({ deleted: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getBudgets, createBudget, updateBudget, deleteBudget };
