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
const signatureHtml = fs.readFileSync('dist/signature-resizer/index.html', 'utf8').replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
assert.ok(signatureHtml.includes('There is no fixed conversion from KB to pixels.'), 'Signature size explanation must be available without JavaScript');
assert.ok(!signatureHtml.includes('exported file never exceeds the gateway ceiling'), 'Generated guide must not retain contradictory compression promises');
assert.equal((signatureHtml.match(/Resize a signature to 10 KB–20 KB for an online form/g) || []).length, 1, 'Render only one signature size guide');
assert.ok(signatureHtml.includes('A 20 KB maximum does not enforce a 10 KB minimum'), 'Signature guide must explain both file-size boundaries');
assert.ok(!fs.readFileSync('src/components/ToolSEOContent.tsx', 'utf8').includes('guarantee your file stays under the upload ceiling'), 'Do not promise guaranteed compression');
assert.ok(fs.readFileSync('public/_headers','utf8').includes('/tool-seo/*\n  Cache-Control: public, max-age=0, must-revalidate\n  X-Robots-Tag: noindex'));
console.log(`Verified static FAQs, inline hydration and individual JSON for ${TOOLS_DATA.length} tools; largest guide ${largest} gzip bytes; no full-catalog browser bundle.`);

const attendanceHtml = fs.readFileSync('dist/attendance-calculator/index.html', 'utf8').replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
assert.ok(attendanceHtml.includes('Semester plan'), 'Attendance worked examples must be available without JavaScript');
assert.ok(attendanceHtml.includes('/blog/how-many-classes-to-attend-for-75-percent'), 'Attendance tool must link to the formula guide');

const cashHtml = fs.readFileSync('dist/cash-denomination-calculator/index.html', 'utf8').replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
assert.ok(cashHtml.includes('Cash closing calculator: check counted cash against expected cash'));
assert.ok(cashHtml.includes('/blog/cash-closing-denomination-shortage-guide'));

const joinedHtml = fs.readFileSync('dist/photo-signature-joiner/index.html', 'utf8').replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
assert.ok(joinedHtml.includes('A 12 KB file is below that minimum'));
assert.ok(joinedHtml.includes('/blog/join-photo-signature-one-jpg-size-guide'));
assert.equal((joinedHtml.match(/Join photo and signature into one JPG with a KB range check/g) || []).length, 1);

const nameDateHtml = fs.readFileSync('dist/photo-name-date-joiner/index.html', 'utf8').replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
assert.ok(nameDateHtml.includes('output 600 × 840 px'));
assert.ok(nameDateHtml.includes('/blog/add-name-date-photo-size-guide'));
assert.ok(!nameDateHtml.includes('download your compliant photo instantly'));

const ageHtml = fs.readFileSync('dist/age-calculator/index.html', 'utf8').replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
assert.ok(ageHtml.includes('Compare age on three reference dates'));
assert.ok(ageHtml.includes('/blog/calculate-age-on-cutoff-date'));
assert.ok(fs.readFileSync('dist/age-calculator/index.html', 'utf8').includes('Age Calculator on Any Date'));
