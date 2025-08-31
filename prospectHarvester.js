// prospectHarvester.js
const LinkedInAdapter = require('./adapters/linkedinAdapter');
const GoogleAdapter = require('./adapters/googleAdapter');
const GitHubAdapter = require('./adapters/githubAdapter');
const AngelListAdapter = require('./adapters/angellistAdapter');

class ProspectHarvester {
  constructor(config = {}) {
    this.adapters = {
      linkedin: new LinkedInAdapter(),
      google: new GoogleAdapter(),
      github: new GitHubAdapter(),
      angellist: new AngelListAdapter()
    };
    this.config = config;
  }

  /**
   * Harvest prospects from multiple sources
   * @param {Object} inputs - keyed by platform name
   * @returns {Array} unified people array
   */
  harvest(inputs) {
    let allResults = [];

    if (inputs.linkedin) {
      allResults.push(...this.adapters.linkedin.parse(inputs.linkedin));
    }
    if (inputs.google) {
      allResults.push(...this.adapters.google.parse(inputs.google));
    }
    if (inputs.github) {
      allResults.push(...this.adapters.github.parse(inputs.github));
    }
    if (inputs.angellist) {
      allResults.push(...this.adapters.angellist.parse(inputs.angellist));
    }

    return allResults;
  }
}

module.exports = ProspectHarvester;
