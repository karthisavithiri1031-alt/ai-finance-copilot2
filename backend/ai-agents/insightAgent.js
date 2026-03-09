// ai-agents/insightAgent.js — AI-powered spending insight generator
const { query } = require('../database/index');

const generateInsights = async (userId) => {
  const result = await query(
    `SELECT category, SUM(amount) as total, COUNT(*) as count
     FROM expenses WHERE user_id = $1 AND date >= NOW() - INTERVAL '30 days'
     GROUP BY category ORDER BY total DESC`,
    [userId]
  );

  if (!result.rows.length) {
    return 'No expense data found for the past 30 days. Start tracking your spending to get insights!';
  }

  const topCategory = result.rows[0];
  const totalSpend = result.rows.reduce((s, r) => s + parseFloat(r.total), 0);

  const breakdown = result.rows.map(r =>
    `- **${r.category}**: $${parseFloat(r.total).toFixed(2)} (${Math.round((r.total / totalSpend) * 100)}%)`
  ).join('\n');

  return `## 💡 Your Spending Insights (Last 30 Days)\n\n**Total Spent:** $${totalSpend.toFixed(2)}\n\n**Top Category:** ${topCategory.category} ($${parseFloat(topCategory.total).toFixed(2)})\n\n### Breakdown:\n${breakdown}\n\n**Tip:** Consider reviewing your ${topCategory.category} expenses — that's where most of your money is going!`;
};

module.exports = { generateInsights };
