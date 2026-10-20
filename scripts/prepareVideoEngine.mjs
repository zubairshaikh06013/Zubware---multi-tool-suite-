import { mkdir, readFile, writeFile, copyFile, readdir } from 'node:fs/promises';
import path from 'node:path';
const target = 'public/video-engine/0.12.10';
await mkdir(target, { recursive: true });
// Keep every Pages asset below 25 MiB. Reassemble only when software mode is used.
const wasm = await readFile('node_modules/@ffmpeg/core/dist/esm/ffmpeg-core.wasm');
const partSize = 16 * 1024 * 1024;
const parts = [];
for (let start = 0; start < wasm.length; start += partSize) {
  const name = `core-${parts.length}.wasm`;
  await writeFile(path.join(target, name), wasm.subarray(start, start + partSize));
  parts.push(name);
}
await writeFile(path.join(target, 'manifest.json'), JSON.stringify({ parts, bytes: wasm.length }));
await copyFile('node_modules/@ffmpeg/core/dist/esm/ffmpeg-core.js', path.join(target, 'ffmpeg-core.js'));
for (const name of await readdir('node_modules/@ffmpeg/ffmpeg/dist/esm')) {
  if (name.endsWith('.js')) await copyFile(`node_modules/@ffmpeg/ffmpeg/dist/esm/${name}`, path.join(target, name));
}
await copyFile('node_modules/@ffmpeg/core/package.json', path.join(target, 'core-package.json'));
await copyFile('node_modules/@ffmpeg/ffmpeg/package.json', path.join(target, 'wrapper-package.json'));
console.log('Prepared local video engine:', wasm.length, 'bytes in', parts.length, 'parts');
