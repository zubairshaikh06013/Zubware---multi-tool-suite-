import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createRequire } from 'node:module';
const root = new URL('../', import.meta.url);
const require = createRequire(new URL('../package.json', import.meta.url));
const ts = require('typescript');
const source = await readFile(new URL('src/App.tsx', root), 'utf8');
const start = source.indexOf("{activeTool.id === 'image-splitter-merger'");
const end = source.indexOf('</Suspense>', start);
if (start < 0 || end < start) throw new Error('Website tool renderer changed: update generator');
const jsx = source.slice(start, end).trim();
const ids = [...jsx.matchAll(/activeTool\.id === '([^']+)'/g)].map(m => m[1]);
const names = new Set([...jsx.matchAll(/<([A-Z]\w*)/g)].map(m => m[1]));
const declarations = source.split('\n').filter(line => {
  const match = line.match(/^const (\w+) = (?:lazy|lazyWithRetry)\(/);
  return match && names.has(match[1]);
}).map(line => line.replaceAll("'./components/", "'../../src/components/"));
if (declarations.length !== names.size) throw new Error('Missing tool component imports');
const dataSource = await readFile(new URL('src/data/toolsData.ts', root), 'utf8');
const tree = ts.createSourceFile('toolsData.ts', dataSource, ts.ScriptTarget.Latest, true);
let raw;
for (const stmt of tree.statements) {
  if (!ts.isVariableStatement(stmt)) continue;
  for (const decl of stmt.declarationList.declarations) {
    if (decl.name.getText(tree) === 'RAW_TOOLS_DATA') raw = JSON.parse(decl.initializer.getText(tree));
  }
}
if (!raw) throw new Error('Website catalogue missing');
const { getToolCanonicalPath } = await import('../src/lib/paths.ts');
const tools = raw.map(tool => ({
  id: tool.id, title: tool.navTitle || tool.title, description: tool.description,
  category: tool.category, path: getToolCanonicalPath(tool), features: tool.features,
  url: 'https://www.zubware.com' + getToolCanonicalPath(tool),
  embedded: ids.includes(tool.id), execution: 'interactive_browser', chatgptVerified: false,
}));
const absent = tools.filter(t => !t.embedded);
if (absent.length) throw new Error('Unmapped tools: ' + absent.map(t => t.id).join(', '));
await mkdir(new URL('generated/', import.meta.url), { recursive: true });
await writeFile(new URL('generated/catalog.json', import.meta.url), JSON.stringify(tools, null, 2) + '\n');
await writeFile(new URL('generated/ToolRenderer.tsx', import.meta.url), `// Generated from src/App.tsx. Do not edit.\nimport React, { lazy, Suspense } from 'react';\nimport { lazyWithRetry } from '../../src/lib/lazyWithRetry';\n${declarations.join('\n')}\nexport function ToolRenderer({activeTool, triggerToast, navigateTo}: {activeTool: {id:string}, triggerToast:(message:string)=>void, navigateTo:(path:string)=>void}) {return <Suspense fallback={<p role="status">Loading tool…</p>}>${jsx}</Suspense>;}\n`);
console.log(`Generated ${tools.length} tools across ${new Set(tools.map(t => t.category)).size} categories; ${names.size} shared components.`);
