// adapters/googleAdapter.js
const ParserCore = require('../parserCore');

class GoogleAdapter extends ParserCore {
  parse(googleJson) {
    if (!googleJson.items) return [];
    return googleJson.items.map(item => this.normalizePerson({
      name: item.title,
      profileUrl: item.link,
      imageUrl: item.pagemap?.cse_image?.[0]?.src || '',
      extra: { snippet: item.snippet }
    }, 'Google'));
  }
}

module.exports = GoogleAdapter;
