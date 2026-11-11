import assert from 'node:assert/strict';
import { build, loadConfigFromFile } from 'vite';
import { gzipSync } from 'node:zlib';

// Compare two real builds without writing probe code to source or dist.
async function snapshot(probe) {
  const loaded = await loadConfigFromFile({ command: 'build', mode: 'production' }, 'vite.config.ts');
  const config = loaded.config;
  const result = await build({
    ...config,
    configFile: false,
    logLevel: 'error',
    plugins: [
      ...config.plugins.filter(plugin => plugin?.name !== 'generate-tool-pages-and-sitemap'),
      { name: 'app-cache-probe', enforce: 'pre', transform(code, id) {
        if (probe && id.endsWith('/src/App.tsx')) return code + "\nconsole.debug('cache-stability-test');\n";
      } },
    ],
    build: { ...config.build, write: false },
  });
  const chunks = result.output.filter(item => item.type === 'chunk');
  const byFile = new Map(chunks.map(chunk => [chunk.fileName, chunk]));
  const entry = chunks.find(chunk => chunk.isEntry);
  const initial = new Set();
  function visit(file) {
    if (initial.has(file)) return;
    initial.add(file);
    for (const dependency of byFile.get(file)?.imports || []) visit(dependency);
  }
  visit(entry.fileName);
  return {
    entryFile: entry.fileName,
    initialGzip: [...initial].reduce((bytes, file) => bytes + gzipSync(byFile.get(file).code).length, 0),
    chunks: new Map(chunks.map(chunk => [chunk.facadeModuleId || chunk.name, { file: chunk.fileName, bytes: Buffer.byteLength(chunk.code) }])),
  };
}

const before = await snapshot(false);
const after = await snapshot(true);
assert.notEqual(before.entryFile, after.entryFile, 'The simulated app edit must change its emitted bundle');
for (const shared of ['tool-catalog', 'vendor-icons', 'vendor-react']) {
  assert.ok(before.chunks.has(shared), `Missing shared ${shared} chunk`);
  assert.equal(before.chunks.get(shared).file, after.chunks.get(shared).file, `${shared} cache URL must survive an unrelated app edit`);
}
const changed = [...before.chunks].filter(([key, value]) => value.file !== after.chunks.get(key)?.file);
assert.ok(changed.length < before.chunks.size / 2, 'An app edit must preserve most JavaScript cache URLs');
assert.ok(before.initialGzip <= 260000, `Initial shared JavaScript exceeds the 260 KB gzip budget: ${before.initialGzip}`);
console.log(`Cache edit probe: ${changed.length}/${before.chunks.size} JS URLs changed; ${changed.reduce((bytes, [,value]) => bytes + value.bytes, 0)} raw bytes changed; shared catalog/icons/React stable; initial gzip ${before.initialGzip} bytes.`);
