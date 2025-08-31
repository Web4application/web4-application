// adapters/linkedinAdapter.js
const ParserCore = require('../parserCore');
const SearchProspectsParser = require('../searchProspectsParser');

class LinkedInAdapter extends ParserCore {
  parse(input) {
    const parser = new SearchProspectsParser();
    const result = typeof input === 'string'
      ? parser.getPeopleListV2(input)
      : parser.getPeopleList(input);

    return result.people.map(p => this.normalizePerson({
      name: p.name,
      firstName: p.firstName,
      lastName: p.lastName,
      profileUrl: p.searchLink,
      imageUrl: p.logo
    }, 'LinkedIn'));
  }
}

module.exports = LinkedInAdapter;
