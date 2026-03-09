// services/predictionService.js — Spending forecast logic
const { query } = require('../database/index');

/**
 * Predict current month's total spending based on historical patterns.
 * Uses the daily average spend from the last 30 days and extrapolates.
 */
const predictMonthlySpending = async (userId) => {
  const result = await query(
    `SELECT amount, date FROM expenses
     WHERE user_id = $1 AND date >= NOW() - INTERVAL '60 days'
     ORDER BY date ASC`,
    [userId]
  );

  const expenses = result.rows;
  if (expenses.length === 0) return null;

  const total = expenses.reduce((sum, e) => sum + parseFloat(e.amount), 0);
  const dayCount = Math.max(1, expenses.length > 0
    ? Math.ceil((new Date() - new Date(expenses[0].date)) / (1000 * 60 * 60 * 24))
    : 30);

  const dailyAvg = total / dayCount;
  const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
  const prediction = (dailyAvg * daysInMonth).toFixed(2);

  // Group by category for breakdown
  const byCategory = expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + parseFloat(e.amount);
    return acc;
  }, {});

  return {
    prediction: parseFloat(prediction),
    dailyAverage: parseFloat(dailyAvg.toFixed(2)),
    topCategories: Object.entries(byCategory)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([cat, amt]) => ({ category: cat, amount: parseFloat(amt.toFixed(2)) })),
  };
};

module.exports = { predictMonthlySpending };
