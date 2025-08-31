const ParserCore = require('../parserCore');

class AngelListAdapter extends ParserCore {
  /**
   * Parse AngelList API results
   * @param {Object} angelListJson - JSON from AngelList's API (e.g., /users/search or /startups/search)
   * @returns {Array} Normalized people array
   */
  parse(angelListJson) {
    if (!angelListJson || !angelListJson.users) return [];

    return angelListJson.users.map(user => this.normalizePerson({
      name: user.name,
      firstName: user.name?.split(' ')[0] || '',
      lastName: user.name?.split(' ').slice(1).join(' ') || '',
      profileUrl: `https://angel.co/u/${user.slug}`,
      imageUrl: user.image || '',
      extra: {
        bio: user.bio,
        follower_count: user.follower_count,
        investor: user.investor
      }
    }, 'AngelList'));
  }
}

module.exports = AngelListAdapter;
