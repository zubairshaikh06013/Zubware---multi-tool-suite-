import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { TOOLS_DATA } from '../src/data/toolsData';
import { getToolCanonicalPath, getToolHowToHeading, getToolIntroParagraph } from '../src/lib/paths';

const escapeHtml = (value: string) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
for (const tool of TOOLS_DATA) {
  const filename = path.join('dist', getToolCanonicalPath(tool), 'index.html');
  const html = fs.readFileSync(filename, 'utf8').replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
  assert.ok(html.includes(escapeHtml(getToolIntroParagraph(tool))), `${tool.id}: built introduction differs from browser content`);
  assert.ok(html.includes(escapeHtml(getToolHowToHeading(tool))), `${tool.id}: built how-to heading differs from browser content`);
}
console.log(`Verified shared introductions and how-to headings on ${TOOLS_DATA.length} built tool pages.`);
