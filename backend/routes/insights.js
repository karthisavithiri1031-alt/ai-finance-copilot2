// routes/insights.js
const { Router } = require('express');
const { getInsights, getPredictionData, getAnomalies, getSubscriptions } = require('../controllers/insightController');
const { requireAuth } = require('../middleware/authMiddleware');

const router = Router();
router.use(requireAuth);
router.get('/insights', getInsights);
router.get('/prediction', getPredictionData);
router.get('/anomalies', getAnomalies);
router.get('/subscriptions', getSubscriptions);

module.exports = router;
