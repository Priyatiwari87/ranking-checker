const axios = require('axios');
const BaseSearchProvider = require('./baseProvider');

/**
 * SerpApi Search Provider Adapter.
 * Connects to SerpApi (https://serpapi.com) or compatible SERP REST APIs.
 * Requires `SEARCH_API_KEY` set in environment variables.
 */
class SerpApiProvider extends BaseSearchProvider {
  constructor() {
    super('SerpApi Google Search Provider', false);
    this.apiKey = process.env.SEARCH_API_KEY;
    this.baseUrl = process.env.SEARCH_API_URL || 'https://serpapi.com/search.json';
  }

  async search(query, options = {}) {
    if (!this.apiKey || this.apiKey === 'your_api_key' || this.apiKey === 'YOUR_SERPAPI_KEY') {
      throw new Error('CONFIG_ERROR: Real Search API key is missing. Please set SEARCH_API_KEY in server/.env or switch SEARCH_PROVIDER=demo.');
    }

    const depth = options.depth || 50;
    const location = options.location || '';

    try {
      const response = await axios.get(this.baseUrl, {
        params: {
          engine: 'google',
          q: query,
          location: location || undefined,
          num: Math.min(depth, 100),
          api_key: this.apiKey
        },
        timeout: 10000
      });

      const organicResults = response.data.organic_results || [];

      return organicResults.map((item, index) => ({
        position: item.position || index + 1,
        title: item.title || '',
        url: item.link || item.url || '',
        snippet: item.snippet || ''
      }));
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401 || error.response.status === 403) {
          throw new Error('API_AUTH_ERROR: Invalid or unauthorized Search API key.');
        }
        if (error.response.status === 429) {
          throw new Error('API_RATE_LIMIT: Search API rate limit exceeded.');
        }
        throw new Error(`API_ERROR: Search API responded with status ${error.response.status}`);
      }
      throw new Error(`NETWORK_ERROR: Failed to connect to Search API service (${error.message})`);
    }
  }
}

module.exports = SerpApiProvider;
