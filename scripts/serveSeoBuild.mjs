import express from 'express';
import path from 'node:path';
import fs from 'node:fs';
const app = express();
const root = path.resolve('dist');
app.get(/.*/, (req, res, next) => {
  if (path.extname(req.path)) return next();
  const file = path.resolve(root, `.${req.path}`, 'index.html');
  if (!file.startsWith(root + path.sep) || !fs.existsSync(file)) return next();
  res.sendFile(file);
});
app.use(express.static(root, { redirect: false }));
app.use((_req, res) => res.status(404).send('Not found'));
app.listen(4173, '127.0.0.1', () => console.log('SEO build ready at http://127.0.0.1:4173'));
