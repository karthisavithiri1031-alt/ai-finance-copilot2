// controllers/insightController.js — AI insights, anomaly, predictions, subscriptions
const { generateInsights } = require('../ai-agents/insightAgent');
const { getPrediction } = require('../ai-agents/predictionAgent');
const { detectAnomalies, detectSubscriptions } = require('../services/anomalyService');

const getInsights = async (req, res) => {
  try {
    const text = await generateInsights(req.user.userId);
    res.json({ insight: text });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getPredictionData = async (req, res) => {
  try {
    const text = await getPrediction(req.user.userId);
    res.json({ prediction: text });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAnomalies = async (req, res) => {
  try {
    const data = await detectAnomalies(req.user.userId);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getSubscriptions = async (req, res) => {
  try {
    const data = await detectSubscriptions(req.user.userId);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getInsights, getPredictionData, getAnomalies, getSubscriptions };
