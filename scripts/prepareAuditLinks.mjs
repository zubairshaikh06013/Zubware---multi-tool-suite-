import fs from 'node:fs';
import path from 'node:path';
const origin = 'https://www.zubware.com';
const target = process.env.SEO_AUDIT_SITE || 'http://127.0.0.1:4173';
const urls = [...fs.readFileSync('dist/sitemap.xml','utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
const links = new Set(urls);
for (const url of urls) {
  const html = fs.readFileSync(path.join('dist', new URL(url).pathname, 'index.html'), 'utf8');
  for (const [, href] of html.matchAll(/<a\b[^>]*href="([^"]+)"/g)) {
    const link = new URL(href.replace(/&amp;/g,'&'), url);
    if (/^https?:$/.test(link.protocol)) { link.hash=''; links.add(link.href); }
  }
}
fs.mkdirSync('reports',{recursive:true});
fs.writeFileSync('reports/audit-links.txt', [...links].sort().map(href => href.startsWith(origin + '/') ? target + href.slice(origin.length) : href).join('\n')+'\n');
console.log(`Prepared ${links.size} unique page links for Lychee.`);
