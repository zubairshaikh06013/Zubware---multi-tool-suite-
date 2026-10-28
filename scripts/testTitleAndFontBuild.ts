import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {TOOLS_DATA} from '../src/data/toolsData';
import {getToolSeoTitle} from '../src/lib/seoTitles';
import {getToolCanonicalPath} from '../src/lib/paths';
import {BLOG_ARTICLES} from '../src/data/blogArticles';
import {CATEGORY_AUTHORITY_MAP} from '../src/data/categoryAuthorityData';

const authored = [
  ...TOOLS_DATA.map(t=>({route:getToolCanonicalPath(t),title:getToolSeoTitle(t)})),
  ...BLOG_ARTICLES.map(a=>({route:a.canonicalPath,title:a.metaTitle})),
  ...Object.values(CATEGORY_AUTHORITY_MAP).map(c=>({route:`/category/${c.slug}`,title:c.seoTitle})),
];
const seen = new Map<string,string>();
for (const {route,title} of authored) {
  assert.ok([...title].length<=60, `${route}: overly long title (${[...title].length}) ${title}`);
  assert.equal((title.match(/Zubware/g)||[]).length,1, `${route}: inconsistent brand suffix`);
  assert.ok(!seen.has(title), `Duplicate titles: ${seen.get(title)} and ${route}`);
  seen.set(title,route);
  const html=fs.readFileSync(path.join('dist',route,'index.html'),'utf8');
  const escape=(s:string)=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;');
  assert.ok(html.includes(`<title>${escape(title)}</title>`), `${route}: prerender title differs from client data`);
  assert.ok(html.includes(`property="og:title" content="${escape(title)}"`), `${route}: social title differs`);
  assert.ok(!html.includes('fonts.googleapis.com/css2?family=Plus'), `${route}: external brand stylesheet remains`);
}
const index=fs.readFileSync('dist/index.html','utf8');
const font=index.match(/href="(\/fonts\/plus-jakarta-sans-([a-f0-9]{12})\.woff2)" as="font"/) as RegExpMatchArray;
assert.ok(font,'Brand font must be preloaded');
const bytes=fs.readFileSync(path.join('dist',font[1]));
assert.equal(bytes.subarray(0,4).toString(),'wOF2');
assert.equal(createHash('sha256').update(bytes).digest('hex').slice(0,12),font[2]);
assert.ok(/@font-face[\s\S]*?font-display: optional/.test(index));
assert.ok(fs.readFileSync('public/fonts/PlusJakartaSans-OFL.txt','utf8').includes('SIL OPEN FONT LICENSE'));
assert.ok(fs.readFileSync('public/_headers','utf8').includes('/fonts/*.woff2\n  Cache-Control: public, max-age=31536000, immutable'));
console.log(`Verified ${authored.length} unique concise titles, metadata parity, optional same-origin font, content hash and license.`);
