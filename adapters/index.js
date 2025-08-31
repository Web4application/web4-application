// index.js — Example usage
const LinkedInAdapter = require('./adapters/linkedinAdapter');
const GoogleAdapter = require('./adapters/googleAdapter');

// Example LinkedIn HTML or JSON
const linkedInHtml = /* LinkedIn HTML or JSON */;
const linkedInParser = new LinkedInAdapter();
const linkedInPeople = linkedInParser.parse(linkedInHtml);

// Example Google Programmable Search JSON
const googleJson = /* Google API JSON */;
const googleParser = new GoogleAdapter();
const googleResults = googleParser.parse(googleJson);

// Unified output
const allPeople = [...linkedInPeople, ...googleResults];
console.log(allPeople);
