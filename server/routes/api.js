const express = require('express');
const router = express.Router();
const rankingController = require('../controllers/rankingController');
const historyController = require('../controllers/historyController');
const analyticsController = require('../controllers/analyticsController');

// Ranking routes
router.post('/ranking/check', rankingController.checkRanking);

// History routes
router.get('/history', historyController.getHistory);
router.get('/history/:id', historyController.getHistoryById);
router.delete('/history/:id', historyController.deleteHistory);

// Analytics route
router.get('/analytics', analyticsController.getAnalytics);

module.exports = router;
