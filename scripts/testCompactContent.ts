import assert from 'node:assert/strict';
import fs from 'node:fs';
import { toolProcessingNotice } from '../src/lib/toolProcessingNotice';
import { TOOLS_DATA } from '../src/data/toolsData';
import { CATEGORIES_DATA } from '../src/data/categoriesData';
import { getToolCanonicalPath } from '../src/lib/paths';
import { BACKGROUND_REMOVAL_PRIVACY, HELP_FAQS } from '../src/data/siteTrustContent';
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

// These disclosures previously existed only after JavaScript loaded.
const escapeHtml = (text: string) => text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
const privacyHtml = fs.readFileSync('dist/privacy/index.html', 'utf8');
for (const paragraph of BACKGROUND_REMOVAL_PRIVACY) assert.ok(privacyHtml.includes(escapeHtml(paragraph)), 'Initial privacy HTML must explain the online photo upload');
const helpHtml = fs.readFileSync('dist/help/index.html', 'utf8');
for (const faq of HELP_FAQS) {
  assert.ok(helpHtml.includes(escapeHtml(faq.question)));
  assert.ok(helpHtml.includes(escapeHtml(faq.answer)));
}
assert.ok(!helpHtml.includes('rather than cloud upload quotas'));
console.log('Privacy and Help initial HTML retain the shared disclosures and limits.');
