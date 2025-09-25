const path = require('path');
const fs = require('fs');

module.exports = function serveStatic(req, res, folder = 'public') {
  let filePath = path.join(__dirname, folder, req.url);
  if (req.url === '/' || req.url === '') {
    filePath = path.join(__dirname, folder, 'index.html');
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.statusCode = 404;
      return res.end('File not found');
    }

    const ext = path.extname(filePath);
    const mimeTypes = {
      '.html': 'text/html',
      '.js': 'application/javascript',
      '.css': 'text/css',
      '.json': 'application/json',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.ico': 'image/x-icon',
    };
    res.setHeader('Content-Type', mimeTypes[ext] || 'text/plain');
    res.end(data);
  });
};
