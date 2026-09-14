/**
 * Base abstract class for search providers.
 * All ranking search providers must extend this class and implement the `search` method.
 */
class BaseSearchProvider {
  constructor(name, isDemo = false) {
    this.name = name;
    this.isDemo = isDemo;
  }

  /**
   * Perform a search query for a business and return normalized organic results.
   * @param {string} query - The search query string (e.g. business name)
   * @param {object} options - Options including depth (e.g. 10, 20, 50, 100), location, etc.
   * @returns {Promise<Array<{position: number, title: string, url: string, snippet: string}>>}
   */
  async search(query, options = {}) {
    throw new Error('Method search() must be implemented by SearchProvider sub-class');
  }

  /**
   * Returns provider metadata info for client UI reporting.
   */
  getMetadata() {
    return {
      providerName: this.name,
      isDemo: this.isDemo
    };
  }
}

module.exports = BaseSearchProvider;
