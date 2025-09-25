const path = require('path');
const serveStatic = require('../serveStatic');

module.exports = (req, res) => {
  // Allow CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Slug,Url');

  // Serve static files from /public
  serveStatic(req, res, 'pages'); // serves landing.html
};