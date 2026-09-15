const rankingService = require('../services/rankingService');
const CheckHistory = require('../models/CheckHistory');
const { isValidUrl, normalizeDomain } = require('../services/domainUtils');

/**
 * Perform a ranking check for a business and website URL.
 */
exports.checkRanking = async (req, res) => {
  try {
    const { businessName, websiteUrl, location = '', depth = 50 } = req.body;

    // Backend Validation
    if (!businessName || typeof businessName !== 'string' || businessName.trim().length < 2) {
      return res.status(400).json({
        success: false,
        error: 'Please enter a valid business name (at least 2 characters).'
      });
    }

    if (!websiteUrl || !isValidUrl(websiteUrl)) {
      return res.status(400).json({
        success: false,
        error: 'Please enter a valid website URL (e.g. example.com or https://example.com).'
      });
    }

    const cleanBusinessName = businessName.trim();
    const cleanWebsiteUrl = websiteUrl.trim();
    const cleanDomain = normalizeDomain(cleanWebsiteUrl);
    const cleanQuery = cleanBusinessName;
    const searchDepth = Math.min(Math.max(parseInt(depth, 10) || 50, 10), 100);

    // Perform check via Ranking Service
    const checkResult = await rankingService.checkRanking({
      businessName: cleanBusinessName,
      websiteUrl: cleanWebsiteUrl,
      location,
      depth: searchDepth
    });

    // Check database for previous check history of the exact same domain & query
    let previousCheck = null;
    if (req.dbConnected) {
      try {
        previousCheck = await CheckHistory.findOne({
          domain: cleanDomain,
          searchQuery: cleanQuery
        }).sort({ checkedAt: -1 });
      } catch (err) {
        console.warn('MongoDB query warning:', err.message);
      }
    }

    let previousRanking = null;
    let rankingChange = null;

    if (previousCheck && previousCheck.found && checkResult.found) {
      previousRanking = previousCheck.ranking;
      // Note: lower rank number is better (e.g. 5 is better than 8, change = +3)
      rankingChange = previousCheck.ranking - checkResult.ranking;
    }

    // Save record to DB if MongoDB is active, else save to in-memory store
    const historyController = require('./historyController');
    let savedId = null;

    if (!req.dbConnected && previousCheck === null) {
      const memHistory = historyController.getInMemoryHistory();
      previousCheck = memHistory.find(i => i.domain === cleanDomain && i.searchQuery === cleanQuery);
      if (previousCheck && previousCheck.found && checkResult.found) {
        previousRanking = previousCheck.ranking;
        rankingChange = previousCheck.ranking - checkResult.ranking;
      }
    }

    const recordData = {
      businessName: cleanBusinessName,
      websiteUrl: cleanWebsiteUrl,
      domain: cleanDomain,
      searchQuery: cleanQuery,
      location: location ? location.trim() : '',
      depth: searchDepth,
      ranking: checkResult.ranking,
      found: checkResult.found,
      totalChecked: checkResult.totalChecked,
      previousRanking,
      rankingChange,
      provider: checkResult.provider,
      isDemo: checkResult.isDemo,
      results: checkResult.results,
      checkedAt: new Date()
    };

    if (req.dbConnected) {
      try {
        const historyRecord = new CheckHistory(recordData);
        const saved = await historyRecord.save();
        savedId = saved._id;
      } catch (err) {
        console.warn('Could not persist check history to MongoDB:', err.message);
        savedId = historyController.addInMemoryHistory(recordData);
      }
    } else {
      savedId = historyController.addInMemoryHistory(recordData);
    }

    return res.status(200).json({
      success: true,
      id: savedId,
      businessName: checkResult.businessName,
      websiteUrl: checkResult.websiteUrl,
      domain: checkResult.domain,
      searchQuery: checkResult.searchQuery,
      location: checkResult.location,
      depth: checkResult.depth,
      ranking: checkResult.ranking,
      found: checkResult.found,
      totalChecked: checkResult.totalChecked,
      previousRanking,
      rankingChange,
      provider: checkResult.provider,
      isDemo: checkResult.isDemo,
      results: checkResult.results,
      checkedAt: new Date()
    });
  } catch (error) {
    console.error('Error in checkRanking controller:', error);

    if (error.message.startsWith('CONFIG_ERROR') || error.message.startsWith('API_') || error.message.startsWith('NETWORK_ERROR')) {
      return res.status(400).json({
        success: false,
        error: error.message
      });
    }

    return res.status(500).json({
      success: false,
      error: error.message || 'An error occurred while checking search rankings. Please try again.'
    });
  }
};
