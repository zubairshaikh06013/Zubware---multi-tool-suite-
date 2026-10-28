import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { buildPageModuleHints, pageModuleHint, type BuildManifest } from './pageModuleHints';
import { TOOLS_DATA } from '../src/data/toolsData';

const manifest: BuildManifest = JSON.parse(fs.readFileSync('dist/.vite/manifest.json','utf8'));
const hints = buildPageModuleHints(fs.readFileSync('src/App.tsx','utf8'), TOOLS_DATA, manifest);
assert.ok(hints.size > 300, `Expected route hints across the tool suite, got ${hints.size}`);
for (const route of ['/qr-generator','/age-calculator','/image-compressor','/blog','/category/image-tools']) {
  const file = pageModuleHint(route,hints);
  assert.ok(file, `${route}: missing module hint`);
  const html = fs.readFileSync(path.join('dist',route,'index.html'),'utf8');
  assert.ok(html.includes(`href="${file}" data-route-preload`), `${route}: hint missing from built HTML`);
  assert.ok(fs.existsSync(path.join('dist',file!)), `${route}: missing hinted file`);
}
assert.equal(pageModuleHint('/not-a-real-tool', hints), undefined);
assert.equal(pageModuleHint('/', hints), undefined, 'Homepage must not preload unrelated tools');
const visited = new Set<string>();
function staticGraph(key: string) {
  if (visited.has(key)) return;
  visited.add(key);
  for (const dep of manifest[key]?.imports || []) staticGraph(dep);
}
staticGraph('src/components/tools/QrGeneratorTool.tsx');
assert.ok(![...visited].some(key => /jspdf/i.test(key)), 'QR must not fetch PDF engine before export');
assert.ok((manifest['src/components/tools/QrGeneratorTool.tsx'].dynamicImports || []).some(key=>/jspdf/i.test(key)), 'PDF engine must remain available on demand');
console.log(`Verified ${hints.size} route module hints, asset existence and QR PDF lazy loading.`);
