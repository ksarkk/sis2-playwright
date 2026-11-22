const http = require('node:http');
const fs = require('node:fs');
const page = fs.readFileSync(require('node:path').join(__dirname, 'app/index.html'));
http.createServer((req, res) => {
  if (req.url !== '/') return res.writeHead(404).end();
  res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'}).end(page);
}).listen(4173, '127.0.0.1');
