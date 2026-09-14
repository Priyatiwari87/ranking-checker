const BaseSearchProvider = require('./baseProvider');
const { normalizeDomain } = require('../domainUtils');

/**
 * Demo Search Provider.
 * Generates realistic search results for demonstration purposes.
 * Clearly labeled as "Demo Mode" in metadata and responses.
 * Placed target website at realistic rankings depending on query hash/demo seed.
 */
class DemoProvider extends BaseSearchProvider {
  constructor() {
    super('Demo Mode Provider (Simulated SERP)', true);
  }

  async search(query, options = {}) {
    const depth = options.depth || 50;
    const targetUrl = options.targetUrl ? normalizeDomain(options.targetUrl) : '';
    const businessName = query || 'Business';

    // Artificial tiny latency for realistic progress state testing (400ms)
    await new Promise((resolve) => setTimeout(resolve, 400));

    const results = [];
    const competitorPrefixes = [
      'Top Recommended', 'Best Local', 'Official', 'Prime', 'The Ultimate',
      'Elite', 'Global', 'Standard', 'City Hub', 'Express'
    ];
    const categoryKeywords = ['Services', 'Solutions', 'Spot', 'Hub', 'Store', 'Center', 'Point', 'Zone'];

    // Determine target ranking slot deterministically if targetUrl is provided
    let targetSlot = -1;
    if (targetUrl) {
      if (options.forceNotFound) {
        targetSlot = -1;
      } else {
        // Simple hash of targetUrl + query to keep results predictable for the same query
        let hash = 0;
        const combined = targetUrl + businessName.toLowerCase();
        for (let i = 0; i < combined.length; i++) {
          hash = (hash << 5) - hash + combined.charCodeAt(i);
          hash |= 0;
        }
        const absHash = Math.abs(hash);
        // Place within top 15 by default, or outside depth if hash ends in 9
        if (absHash % 10 === 9) {
          targetSlot = depth + 5; // Not found within depth
        } else {
          targetSlot = (absHash % 12) + 1; // Rank 1 to 12
        }
      }
    }

    for (let pos = 1; pos <= depth; pos++) {
      if (pos === targetSlot && targetUrl) {
        results.push({
          position: pos,
          title: `${businessName} - Official Website`,
          url: options.targetUrl.startsWith('http') ? options.targetUrl : `https://${targetUrl}`,
          snippet: `Official website of ${businessName}. Find reviews, contact information, hours, and location details.`
        });
      } else {
        const prefix = competitorPrefixes[(pos * 3) % competitorPrefixes.length];
        const cat = categoryKeywords[(pos * 7) % categoryKeywords.length];
        const compDomain = `competitor-${pos}-${businessName.toLowerCase().replace(/[^a-z0-9]/g, '') || 'biz'}.com`;

        results.push({
          position: pos,
          title: `${prefix} ${businessName} ${cat}`,
          url: `https://www.${compDomain}`,
          snippet: `Discover top details and options for ${businessName} in your local search area.`
        });
      }
    }

    return results;
  }
}

module.exports = DemoProvider;
