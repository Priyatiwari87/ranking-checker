const CheckHistory = require('../models/CheckHistory');

/**
 * GET /api/analytics - Get summary dashboard analytics calculated ONLY from real stored checks.
 */
exports.getAnalytics = async (req, res) => {
  try {
    if (!req.dbConnected) {
      // Basic fallback if database is not active
      return res.status(200).json({
        success: true,
        metrics: {
          totalChecks: 0,
          successfulChecks: 0,
          notFound: 0,
          averageRank: null,
          bestRank: null,
          top3Count: 0,
          top10Count: 0
        },
        recentChecks: [],
        trendData: [],
        hasEnoughData: false,
        source: 'in_memory_empty'
      });
    }

    const [totalChecks, successfulChecks, notFound, foundDocs, recentChecks] = await Promise.all([
      CheckHistory.countDocuments({}),
      CheckHistory.countDocuments({ found: true }),
      CheckHistory.countDocuments({ found: false }),
      CheckHistory.find({ found: true, ranking: { $ne: null } }).select('ranking checkedAt domain searchQuery'),
      CheckHistory.find({}).sort({ checkedAt: -1 }).limit(10)
    ]);

    let averageRank = null;
    let bestRank = null;
    let top3Count = 0;
    let top10Count = 0;

    if (foundDocs.length > 0) {
      const sum = foundDocs.reduce((acc, doc) => acc + doc.ranking, 0);
      averageRank = Math.round((sum / foundDocs.length) * 10) / 10;
      bestRank = Math.min(...foundDocs.map(d => d.ranking));

      top3Count = foundDocs.filter(d => d.ranking <= 3).length;
      top10Count = foundDocs.filter(d => d.ranking <= 10).length;
    }

    // Historical ranking trends grouping by date for checks with results
    const trendAgg = await CheckHistory.aggregate([
      { $match: { found: true, ranking: { $ne: null } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$checkedAt' } },
          avgRank: { $avg: '$ranking' },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } },
      { $limit: 14 }
    ]);

    const trendData = trendAgg.map(t => ({
      date: t._id,
      avgRank: Math.round(t.avgRank * 10) / 10,
      checks: t.count
    }));

    return res.status(200).json({
      success: true,
      metrics: {
        totalChecks,
        successfulChecks,
        notFound,
        averageRank,
        bestRank,
        top3Count,
        top10Count
      },
      recentChecks,
      trendData,
      hasEnoughData: trendData.length >= 2,
      source: 'database'
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to compute analytics.'
    });
  }
};
