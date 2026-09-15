const rankingService = require('../services/rankingService');
const CheckHistory = require('../models/CheckHistory');
const { isValidUrl, normalizeDomain } = require('../services/domainUtils');

/**
 * Perform a ranking check for a business and website URL.
 */
exports.checkRanking = async (req, res) => {
  try {
    const { businessName, websiteUrl, location = '', depth = 50 } = req.body;

    if (!businessName || typeof businessName !== 'string' || businessName.trim().length < 2) {
      return res.status(400).json({
        success: false,
        error: 'Please enter at least one valid keyword or business name (at least 2 characters).'
      });
    }

    if (!websiteUrl || !isValidUrl(websiteUrl)) {
      return res.status(400).json({
        success: false,
        error: 'Please enter a valid website URL (e.g. example.com or https://example.com).'
      });
    }

    const rawKeywords = businessName
      .split(/[\r\n,]+/)
      .map((k) => k.trim())
      .filter((k) => k.length >= 2);

    if (rawKeywords.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Please enter valid keywords.'
      });
    }

    // Limit to max 10 keywords per request
    const keywords = rawKeywords.slice(0, 10);
    const cleanWebsiteUrl = websiteUrl.trim();
    const cleanDomain = normalizeDomain(cleanWebsiteUrl);
    const searchDepth = Math.min(Math.max(parseInt(depth, 10) || 50, 10), 100);
    const historyController = require('./historyController');

    const runSingleCheck = async (cleanBusinessName) => {
      const cleanQuery = cleanBusinessName;
      const checkResult = await rankingService.checkRanking({
        businessName: cleanBusinessName,
        websiteUrl: cleanWebsiteUrl,
        location,
        depth: searchDepth
      });

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
        rankingChange = previousCheck.ranking - checkResult.ranking;
      }

      if (!req.dbConnected && previousCheck === null) {
        const memHistory = historyController.getInMemoryHistory();
        previousCheck = memHistory.find((i) => i.domain === cleanDomain && i.searchQuery === cleanQuery);
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

      let savedId = null;
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

      return {
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
      };
    };

    if (keywords.length === 1) {
      const singleResult = await runSingleCheck(keywords[0]);
      return res.status(200).json({
        success: true,
        isBatch: false,
        ...singleResult
      });
    }

    // Process multiple keywords concurrently
    const batchResults = await Promise.all(keywords.map((kw) => runSingleCheck(kw)));

    return res.status(200).json({
      success: true,
      isBatch: true,
      totalKeywords: keywords.length,
      websiteUrl: cleanWebsiteUrl,
      domain: cleanDomain,
      batchResults
    });
  } catch (error) {
    console.error('Error in checkRanking controller:', error);

    if (
      error.message.startsWith('CONFIG_ERROR') ||
      error.message.startsWith('API_') ||
      error.message.startsWith('NETWORK_ERROR')
    ) {
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
