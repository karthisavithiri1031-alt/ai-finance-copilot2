// ai-agents/expenseAgent.js — Handles expense-related DB operations triggered by Gemini
const { query } = require('../database/index');

const createExpense = async (userId, args) => {
  const { amount, category, merchant, date, description = '', payment_method = 'card' } = args;
  const result = await query(
    `INSERT INTO expenses (user_id, amount, category, merchant, date, description, payment_method)
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [userId, amount, category, merchant, date, description, payment_method]
  );
  return result.rows[0];
};

const readExpenses = async (userId) => {
  const result = await query(
    `SELECT * FROM expenses WHERE user_id = $1 ORDER BY date DESC, created_at DESC`,
    [userId]
  );
  return result.rows;
};

const updateExpense = async (userId, args) => {
  // Update the most recent expense with provided fields
  const latest = await query(
    `SELECT id FROM expenses WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1`,
    [userId]
  );
  if (!latest.rows.length) return null;

  const id = latest.rows[0].id;
  const updates = [];
  const values = [];
  let i = 1;

  if (args.amount !== undefined) { updates.push(`amount = $${i++}`); values.push(args.amount); }
  if (args.category !== undefined) { updates.push(`category = $${i++}`); values.push(args.category); }
  if (args.merchant !== undefined) { updates.push(`merchant = $${i++}`); values.push(args.merchant); }
  if (args.description !== undefined) { updates.push(`description = $${i++}`); values.push(args.description); }

  if (!updates.length) return null;

  values.push(id, userId);
  const result = await query(
    `UPDATE expenses SET ${updates.join(', ')} WHERE id = $${i++} AND user_id = $${i} RETURNING *`,
    values
  );
  return result.rows[0];
};

const deleteExpense = async (userId) => {
  const latest = await query(
    `SELECT id FROM expenses WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1`,
    [userId]
  );
  if (!latest.rows.length) return null;
  const id = latest.rows[0].id;
  await query(`DELETE FROM expenses WHERE id = $1 AND user_id = $2`, [id, userId]);
  return { deleted: true, id };
};

module.exports = { createExpense, readExpenses, updateExpense, deleteExpense };
