#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const ProspectHarvester = require('./prospectHarvester');
const args = require('minimist')(process.argv.slice(2), {
  string: [
    'linkedin', 'google', 'github', 'angellist',
    'googleKey', 'googleCx', 'githubToken', 'angellistToken', 'query', 'output'
  ],
  alias: {
    l: 'linkedin', g: 'google', G: 'github', a: 'angellist',
    q: 'query', o: 'output'
  }
});

function loadData(filePath) {
  if (!filePath) return null;
  const absPath = path.resolve(filePath);
  const raw = fs.readFileSync(absPath, 'utf8');
  try { return JSON.parse(raw); } catch { return raw; }
}

async function fetchGoogle(query, key, cx) {
  const url = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(query)}&key=${key}&cx=${cx}`;
  const res = await fetch(url);
  return res.json();
}

async function fetchGitHub(query, token) {
  const headers = token ? { Authorization: `token ${token}` } : {};
  const res = await fetch(`https://api.github.com/search/users?q=${encodeURIComponent(query)}`, { headers });
  return res.json();
}

async function fetchAngelList(query, token) {
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const res = await fetch(`https://api.angel.co/1/search?query=${encodeURIComponent(query)}&type=User`, { headers });
  return res.json();
}

(async () => {
  const inputs = {
    linkedin: loadData(args.linkedin),
    google: args.googleKey && args.googleCx && args.query
      ? await fetchGoogle(args.query, args.googleKey, args.googleCx)
      : loadData(args.google),
    github: args.githubToken && args.query
      ? await fetchGitHub(args.query, args.githubToken)
      : loadData(args.github),
    angellist: args.angellistToken && args.query
      ? await fetchAngelList(args.query, args.angellistToken)
      : loadData(args.angellist)
  };

  const harvester = new ProspectHarvester();
  const results = harvester.harvest(inputs);

  if (args.output) {
    fs.writeFileSync(path.resolve(args.output), JSON.stringify(results, null, 2));
    console.log(`✅ Combined prospects saved to ${args.output}`);
  } else {
    console.log(JSON.stringify(results, null, 2));
  }
})();
