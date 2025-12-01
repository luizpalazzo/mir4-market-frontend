// Servidor simples para servir arquivos estáticos (CommonJS)
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const DIST_DIR = path.join(__dirname, 'dist');

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject',
};

const server = http.createServer((req, res) => {
  // Normalizar a URL removendo query strings e fragmentos
  const urlPath = req.url.split('?')[0].split('#')[0];
  let filePath = path.join(DIST_DIR, urlPath === '/' ? 'index.html' : urlPath);

  // Verificar se o arquivo existe
  let fileExists = false;
  try {
    const stats = fs.statSync(filePath);
    if (stats.isFile()) {
      fileExists = true;
    } else if (stats.isDirectory()) {
      filePath = path.join(filePath, 'index.html');
      fileExists = fs.existsSync(filePath);
    }
  } catch (err) {
    fileExists = false;
  }

  // Se o arquivo não existe e não é uma rota de API, tentar index.html (SPA routing)
  if (!fileExists) {
    const ext = path.extname(urlPath);
    // Se tem extensão (arquivo estático), retornar 404
    if (ext && ext !== '.html') {
      res.writeHead(404, { 'Content-Type': 'text/html' });
      res.end('<h1>404 - Not Found</h1>');
      return;
    }
    // Caso contrário, servir index.html (SPA routing)
    filePath = path.join(DIST_DIR, 'index.html');
  }

  try {
    const content = fs.readFileSync(filePath);
    const ext = path.extname(filePath);
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);
  } catch (err) {
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end('<h1>404 - Not Found</h1>');
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
