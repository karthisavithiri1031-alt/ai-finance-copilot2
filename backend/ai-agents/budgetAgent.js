// ai-agents/budgetAgent.js — Budget monitoring and alerting
const { query } = require('../database/index');

const getBudgetStatus = async (userId) => {
  const budgets = await query(
    `SELECT * FROM budgets WHERE user_id = $1`, [userId]
  );

  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  const statusList = await Promise.all(budgets.rows.map(async (b) => {
    const spent = await query(
      `SELECT COALESCE(SUM(amount), 0) as total FROM expenses
       WHERE user_id = $1 AND category = $2
       AND EXTRACT(MONTH FROM date) = $3 AND EXTRACT(YEAR FROM date) = $4`,
      [userId, b.category, month, year]
    );
    const total = parseFloat(spent.rows[0].total);
    const limit = parseFloat(b.limit_amount);
    const percentage = Math.round((total / limit) * 100);
    const exceeded = total > limit;

    return {
      id: b.id,
      category: b.category,
      limit,
      spent: total,
      percentage,
      exceeded,
      remaining: Math.max(0, limit - total),
    };
  }));

  return statusList;
};

module.exports = { getBudgetStatus };
