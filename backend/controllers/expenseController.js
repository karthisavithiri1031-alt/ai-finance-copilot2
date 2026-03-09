// controllers/expenseController.js — Full expense CRUD
const { query } = require('../database/index');

const getExpenses = async (req, res) => {
  try {
    const result = await query(
      `SELECT * FROM expenses WHERE user_id = $1 ORDER BY date DESC, created_at DESC LIMIT 100`,
      [req.user.userId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createExpense = async (req, res) => {
  try {
    const { amount, category, merchant, date, description = '', payment_method = 'card', currency = 'USD' } = req.body;
    if (!amount || !category || !date) return res.status(400).json({ error: 'amount, category and date are required' });

    const result = await query(
      `INSERT INTO expenses (user_id, amount, category, merchant, date, description, payment_method, currency)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [req.user.userId, amount, category, merchant || '', date, description, payment_method, currency]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const fields = req.body;
    const allowed = ['amount', 'category', 'merchant', 'date', 'description', 'payment_method'];
    const updates = [];
    const values = [];
    let i = 1;

    for (const key of allowed) {
      if (fields[key] !== undefined) {
        updates.push(`${key} = $${i++}`);
        values.push(fields[key]);
      }
    }
    if (!updates.length) return res.status(400).json({ error: 'No fields to update' });

    values.push(id, req.user.userId);
    const result = await query(
      `UPDATE expenses SET ${updates.join(', ')} WHERE id = $${i++} AND user_id = $${i} RETURNING *`,
      values
    );
    if (!result.rows.length) return res.status(404).json({ error: 'Expense not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query(
      `DELETE FROM expenses WHERE id = $1 AND user_id = $2 RETURNING id`,
      [id, req.user.userId]
    );
    if (!result.rows.length) return res.status(404).json({ error: 'Expense not found' });
    res.json({ deleted: true, id: result.rows[0].id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getExpenses, createExpense, updateExpense, deleteExpense };
