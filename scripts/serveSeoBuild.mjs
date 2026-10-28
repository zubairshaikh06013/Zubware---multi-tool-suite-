import express from 'express';
import path from 'node:path';
import fs from 'node:fs';
import { gzipSync } from 'node:zlib';
const app = express();
const root = path.resolve('dist');
const compressed = new Map();
app.get(/.*/, (req, res, next) => {
  let pathname;
  try { pathname = decodeURIComponent(req.path); } catch { return res.sendStatus(400); }
  const file = path.extname(pathname)
    ? path.resolve(root, `.${pathname}`)
    : path.resolve(root, `.${pathname}`, 'index.html');
  if (!file.startsWith(root + path.sep) || !fs.existsSync(file) || !fs.statSync(file).isFile()) return next();
  // Match a compressed production CDN rather than measuring raw multi-MB assets.
  if (/\.(?:html|js|css|json|svg|wasm)$/.test(file)) {
    res.vary('Accept-Encoding');
    if (/\bgzip\b/.test(req.headers['accept-encoding'] || '')) {
      if (!compressed.has(file)) compressed.set(file, gzipSync(fs.readFileSync(file)));
      res.type(path.extname(file));
      res.set('Content-Encoding', 'gzip');
      if (pathname.startsWith('/assets/')) res.set('Cache-Control', 'public, max-age=31536000, immutable');
      return res.send(compressed.get(file));
    }
  }
  res.sendFile(file);
});
app.use((_req, res) => res.status(404).send('Not found'));
app.listen(4173, '127.0.0.1', () => console.log('SEO build ready at http://127.0.0.1:4173'));
