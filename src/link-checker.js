
const {SiteChecker} = require('broken-link-checker');

const siteChecker = new SiteChecker(options)
  .on('error', (error) => {})
  .on('robots', (robots, customData) => {})
  .on('html', (tree, robots, response, pageURL, customData) => {})
  .on('queue', () => {})
  .on('junk', (result, customData) => {})
  .on('link', (result, customData) => {})
  .on('page', (error, pageURL, customData) => {})
  .on('site', (error, siteURL, customData) => {})
  .on('end', () => {});

siteChecker.enqueue(siteURL, customData);