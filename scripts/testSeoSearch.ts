import assert from 'node:assert/strict';
import fs from 'node:fs';
import sharp from 'sharp';
import { renderStaticBlogMarkdown } from './generateSeoAndSitemap';
const html = renderStaticBlogMarkdown('[tool](/image-compressor) [absolute](https://www.zubware.com/qr-generator) [source](https://example.com) [unsafe](javascript:alert)');
assert.match(html, /<a href="\/image-compressor">tool<\/a>/);
assert.match(html, /<a href="https:\/\/www.zubware.com\/qr-generator">absolute<\/a>/);
assert.ok(!html.includes('nofollow'));
assert.ok(!html.includes('href="javascript:'));
const sitemap = fs.readFileSync('dist/sitemap.xml','utf8');
assert.ok([...sitemap.matchAll(/<loc>/g)].length > 0);
assert.ok(fs.statSync('dist/pagefind/pagefind.js').size > 0);
assert.ok(fs.readdirSync('dist/pagefind').some(f => f.endsWith('.pf_meta')));
console.log('Internal blog links, unsafe-link filtering and generated Pagefind assets passed.');

const manifest = JSON.parse(fs.readFileSync('public/manifest.json','utf8'));
for (const size of [192, 512]) {
  const icon = manifest.icons.find((i: { sizes: string }) => i.sizes === `${size}x${size}`);
  assert.ok(icon, `Missing ${size}px manifest icon`);
  const info = await sharp(`public${icon.src}`).metadata();
  assert.deepEqual([info.width,info.height], [size,size]);
}
const card = await sharp('public/social-card.png').metadata();
assert.deepEqual([card.width,card.height],[1200,630]);
const home = fs.readFileSync('dist/index.html','utf8');
assert.match(home, /property="og:image" content="https:\/\/www.zubware.com\/social-card.png"/);
assert.match(home, /property="og:image:width" content="1200"/);
console.log('Social card, declared dimensions and real PWA icon sizes passed.');
