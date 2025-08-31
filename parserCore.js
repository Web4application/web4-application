// parserCore.js
class ParserCore {
  normalizePerson(person, source) {
    return {
      name: person.name || '',
      firstName: person.firstName || '',
      lastName: person.lastName || '',
      profileUrl: person.profileUrl || '',
      imageUrl: person.imageUrl || '',
      sourcePlatform: source,
      extra: person.extra || {}
    };
  }
}

module.exports = ParserCore;
