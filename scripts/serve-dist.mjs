import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve('dist');
const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.xml': 'application/xml',
  '.txt': 'text/plain',
  '.json': 'application/json',
};
const headersText = await readFile('dist/_headers', 'utf8');
const headers = {};
for (const line of headersText.split(/\r?\n/)) {
  const match = line.match(/^  ([A-Za-z-]+): (.*)$/);
  if (match && match[1] !== 'Cache-Control' && match[1] !== 'Strict-Transport-Security')
    headers[match[1]] = match[2].replace('; upgrade-insecure-requests', '');
}
const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://127.0.0.1');
    const filePath = path.resolve(root, '.' + decodeURIComponent(url.pathname));
    if (!filePath.startsWith(root + path.sep) && filePath !== root) {
      res.writeHead(403);
      res.end();
      return;
    }
    let file = filePath;
    let status = 200;
    try {
      if ((await stat(file)).isDirectory()) file = path.join(file, 'index.html');
      await stat(file);
    } catch {
      file = path.join(root, '404.html');
      status = 404;
    }
    const body = await readFile(file);
    res.writeHead(status, {
      ...headers,
      'Content-Type': types[path.extname(file)] ?? 'application/octet-stream',
    });
    res.end(body);
  } catch {
    res.writeHead(400);
    res.end('Invalid request');
  }
}).listen(4322, '127.0.0.1', () =>
  console.log('Local build verification server: http://127.0.0.1:4322'),
);
for (const signal of ['SIGTERM', 'SIGINT'])
  process.on(signal, () => {
    server.closeAllConnections();
    server.close(() => process.exit(0));
  });
