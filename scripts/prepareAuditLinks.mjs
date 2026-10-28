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
const internal = [...links].filter(href => new URL(href).origin === origin).sort().map(href => target + href.slice(origin.length));
const external = [...links].filter(href => new URL(href).origin !== origin).sort();
fs.writeFileSync('reports/audit-internal-links.txt', internal.join('\n')+'\n');
fs.writeFileSync('reports/audit-external-links.txt', external.join('\n')+'\n');
console.log(`Prepared ${links.size} unique page links for Lychee.`);
