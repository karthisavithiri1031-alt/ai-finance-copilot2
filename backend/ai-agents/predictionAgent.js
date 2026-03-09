// ai-agents/predictionAgent.js — Monthly spending prediction
const { predictMonthlySpending } = require('../services/predictionService');

const getPrediction = async (userId) => {
  const data = await predictMonthlySpending(userId);
  if (!data) return 'Not enough data to make a prediction. Keep tracking expenses!';

  const categoryText = data.topCategories
    .map(c => `- **${c.category}**: $${c.amount}`)
    .join('\n');

  return `## 🔮 Monthly Spending Prediction\n\n**Projected Total:** $${data.prediction}\n**Daily Average:** $${data.dailyAverage}\n\n### Top Spending Areas:\n${categoryText}\n\n_Tip: Reducing daily spend by $5 could save you $150/month!_`;
};

module.exports = { getPrediction };
