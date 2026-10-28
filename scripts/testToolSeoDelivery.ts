import assert from 'node:assert/strict';
import fs from 'node:fs';
import { gzipSync } from 'node:zlib';
import { getToolCanonicalPath } from '../src/lib/paths';
import { TOOLS_DATA } from '../src/data/toolsData';
import { getToolSeoData } from '../src/data/toolSeoData';

let largest = 0;
for (const tool of TOOLS_DATA) {
  const fallback = getToolSeoData(tool.id);
  const expected = { id: tool.id, faq: tool.faq || fallback.faq || [], howTo: tool.howTo || fallback.howTo || [] };
  const json = fs.readFileSync(`dist/tool-seo/${tool.id}.json`, 'utf8');
  const html = fs.readFileSync(`dist${getToolCanonicalPath(tool)}/index.html`, 'utf8');
  const inline = html.match(/<script id="tool-seo-data" type="application\/json">([\s\S]*?)<\/script>/)?.[1];
  assert.ok(inline, `${tool.id}: missing initial route data`);
  assert.deepEqual(JSON.parse(inline!), expected, `${tool.id}: incorrect initial guide`);
  assert.deepEqual(JSON.parse(json), expected, `${tool.id}: incorrect navigation guide`);
  assert.ok(!inline!.includes('<'), `${tool.id}: inline data must escape HTML delimiters`);
  // The static, crawler-readable guide must survive removal of every script.
  const visible = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
  for (const faq of expected.faq) {
    const escaped = faq.question.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
    assert.ok(visible.includes(escaped), `${tool.id}: missing prerendered FAQ ${faq.question}`);
  }
  largest = Math.max(largest, gzipSync(json).length);
}
const assets = fs.readdirSync('dist/assets');
assert.ok(!assets.some(name => /^toolSeoData-.*\.js$/.test(name)), 'Full FAQ catalog leaked into browser assets');
assert.ok(fs.readFileSync('dist/qr-code-decoder/index.html','utf8').includes('Read a QR code from a screenshot or saved image'));
assert.ok(fs.readFileSync('public/_headers','utf8').includes('/tool-seo/*\n  Cache-Control: public, max-age=0, must-revalidate\n  X-Robots-Tag: noindex'));
console.log(`Verified static FAQs, inline hydration and individual JSON for ${TOOLS_DATA.length} tools; largest guide ${largest} gzip bytes; no full-catalog browser bundle.`);
