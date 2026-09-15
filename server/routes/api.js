const express = require('express');
const router = express.Router();
const rankingController = require('../controllers/rankingController');
const historyController = require('../controllers/historyController');
const analyticsController = require('../controllers/analyticsController');
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({ windowMs: 60000, max: 10 });

// Ranking routes
router.post('/ranking/check', limiter, rankingController.checkRanking);

// History routes
router.get('/history', historyController.getHistory);
router.get('/history/:id', historyController.getHistoryById);
router.delete('/history/:id', historyController.deleteHistory);

// Analytics route
router.get('/analytics', analyticsController.getAnalytics);

module.exports = router;
