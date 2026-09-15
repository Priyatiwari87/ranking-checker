const DemoProvider = require('./searchProviders/demoProvider');
const CustomScraperProvider = require('./searchProviders/customScraperProvider');
const { normalizeDomain, isDomainMatch } = require('./domainUtils');

/**
 * Ranking Service Factory & Orchestrator.
 * Selects configured provider and performs domain matching.
 */
class RankingService {
  constructor() {
    this.provider = this.getProviderFromEnv();
  }

  getProviderFromEnv() {
    const providerType = (process.env.SEARCH_PROVIDER || 'custom').toLowerCase();
    switch (providerType) {
      case 'demo':
        return new DemoProvider();
      case 'custom':
      case 'scraper':
      case 'google':
      default:
        return new CustomScraperProvider();
    }
  }

  /**
   * Main ranking check method.
   */
  async checkRanking({ businessName, websiteUrl, location = '', depth = 50 }) {
    const activeProvider = this.getProviderFromEnv();
    const searchOptions = {
      depth: parseInt(depth, 10) || 50,
      location: location.trim(),
      targetUrl: websiteUrl
    };

    const searchQuery = businessName.trim();
    const normalizedTargetDomain = normalizeDomain(websiteUrl);

    // Fetch search results from active provider
    const searchResults = await activeProvider.search(searchQuery, searchOptions);
    const providerMeta = activeProvider.getMetadata();

    // Match domain against results
    let ranking = null;
    let found = false;

    const formattedResults = searchResults.map((item) => {
      const isMatched = isDomainMatch(normalizedTargetDomain, item.url);
      if (isMatched && !found) {
        found = true;
        ranking = item.position;
      }
      return {
        position: item.position,
        title: item.title,
        url: item.url,
        snippet: item.snippet,
        matched: isMatched
      };
    });

    return {
      businessName,
      websiteUrl,
      domain: normalizedTargetDomain,
      searchQuery,
      location,
      depth: searchOptions.depth,
      ranking: found ? ranking : null,
      found,
      totalChecked: formattedResults.length,
      provider: providerMeta.providerName,
      isDemo: providerMeta.isDemo,
      results: formattedResults
    };
  }
}

module.exports = new RankingService();
