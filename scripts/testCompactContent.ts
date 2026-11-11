import assert from 'node:assert/strict';
import fs from 'node:fs';
import { toolProcessingNotice } from '../src/lib/toolProcessingNotice';
import { TOOLS_DATA } from '../src/data/toolsData';
import { CATEGORIES_DATA } from '../src/data/categoriesData';
import { getToolCanonicalPath } from '../src/lib/paths';
const html = fs.readFileSync('dist/index.html','utf8').replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,'');
const hrefs=new Set([...html.matchAll(/href="([^"]+)"/g)].map(m=>m[1]));
assert.ok(hrefs.has('https://www.zubware.com/age-calculator'), 'Homepage must expose a crawlable age calculator link');
const linkedTools=TOOLS_DATA.filter(t=>hrefs.has(`https://www.zubware.com${getToolCanonicalPath(t)}`));
// Category previews plus the small task directory stay below 50 distinct tools.
assert.ok(linkedTools.length > 10 && linkedTools.length <= 50, `Homepage previews: ${linkedTools.length}`);
for (const slug of ['signature-resizer', 'image-resizer', 'photo-signature-joiner', 'pdf-compressor', 'barcode-generator', 'attendance-calculator']) {
  assert.ok(hrefs.has(`https://www.zubware.com/${slug}`), `Task directory must expose ${slug} without JavaScript`);
}
for(const category of CATEGORIES_DATA.filter(c=>c.slug!=='all')) assert.ok(hrefs.has(`https://www.zubware.com/category/${category.slug}`),category.slug);
assert.match(toolProcessingNotice('background-remover'),/Cloudflare.*consent/);
assert.match(toolProcessingNotice('subtitle-generator'),/microphone.*send audio/);
assert.match(toolProcessingNotice('api-request-builder'),/external service/);
assert.match(toolProcessingNotice('image-resizer'),/in your browser/);
const background=fs.readFileSync('dist/background-remover/index.html','utf8');
assert.ok(background.includes(toolProcessingNotice('background-remover')));
assert.ok(!html.includes('zero wait times'));
console.log(`Compact homepage: ${linkedTools.length} tool links, all category hubs preserved, processing notices verified.`);
