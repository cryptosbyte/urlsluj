const serveStatic = require('../serveStatic');

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Slug,Url');

  serveStatic(req, res, 'pages'); // serves landing.html
};
