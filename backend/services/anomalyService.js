// services/anomalyService.js — Detect unusual spending patterns
const { query } = require('../database/index');

/**
 * Detect anomalous transactions by comparing recent expenses
 * to historical averages per category.
 */
const detectAnomalies = async (userId) => {
  // Get all expenses from last 90 days
  const result = await query(
    `SELECT id, amount, category, merchant, date FROM expenses
     WHERE user_id = $1 AND date >= NOW() - INTERVAL '90 days'
     ORDER BY date DESC`,
    [userId]
  );

  const expenses = result.rows;
  if (expenses.length < 5) return [];

  // Compute average amount per category
  const categoryStats = expenses.reduce((acc, e) => {
    if (!acc[e.category]) acc[e.category] = { total: 0, count: 0 };
    acc[e.category].total += parseFloat(e.amount);
    acc[e.category].count += 1;
    return acc;
  }, {});

  // Flag any expense that is >3x the category average
  const anomalies = expenses.filter((e) => {
    const stats = categoryStats[e.category];
    const avg = stats.total / stats.count;
    return parseFloat(e.amount) > avg * 3 && parseFloat(e.amount) > 20;
  }).map((e) => {
    const stats = categoryStats[e.category];
    const avg = stats.total / stats.count;
    return {
      ...e,
      categoryAvg: parseFloat(avg.toFixed(2)),
      multiplier: parseFloat((parseFloat(e.amount) / avg).toFixed(1)),
    };
  });

  return anomalies;
};

/**
 * Detect recurring (subscription-like) payments.
 */
const detectSubscriptions = async (userId) => {
  const result = await query(
    `SELECT merchant, COUNT(*) as occurrences, AVG(amount) as avg_amount
     FROM expenses
     WHERE user_id = $1 AND date >= NOW() - INTERVAL '90 days'
     GROUP BY merchant
     HAVING COUNT(*) >= 2
     ORDER BY occurrences DESC`,
    [userId]
  );

  return result.rows.map((r) => ({
    merchant: r.merchant,
    occurrences: parseInt(r.occurrences),
    avg_amount: parseFloat(parseFloat(r.avg_amount).toFixed(2)),
  }));
};

module.exports = { detectAnomalies, detectSubscriptions };
