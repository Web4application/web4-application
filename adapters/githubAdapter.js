const ParserCore = require('../parserCore');
const fetch = require('node-fetch'); // Only needed if you want to fetch from GitHub API directly

class GitHubAdapter extends ParserCore {
  /**
   * Parse GitHub user search API results
   * @param {Object} githubJson - JSON from GitHub's search/users endpoint
   * @returns {Array} Normalized people array
   */
  parse(githubJson) {
    if (!githubJson.items) return [];
    return githubJson.items.map(user => this.normalizePerson({
      name: user.login,
      profileUrl: user.html_url,
      imageUrl: user.avatar_url,
      extra: { score: user.score }
    }, 'GitHub'));
  }

  /**
   * Optional: Fetch and parse directly from GitHub API
   * @param {string} query - Search query (e.g., "location:Lagos language:JavaScript")
   * @param {string} token - GitHub personal access token (optional but recommended)
   */
  async fetchAndParse(query, token) {
    const headers = token ? { Authorization: `token ${token}` } : {};
    const res = await fetch(`https://api.github.com/search/users?q=${encodeURIComponent(query)}`, { headers });
    const data = await res.json();
    return this.parse(data);
  }
}

module.exports = GitHubAdapter;
