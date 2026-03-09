// routes/chat.js
const { Router } = require('express');
const { chat } = require('../controllers/chatController');
const { requireAuth } = require('../middleware/authMiddleware');

const router = Router();
router.post('/', requireAuth, chat);

module.exports = router;
