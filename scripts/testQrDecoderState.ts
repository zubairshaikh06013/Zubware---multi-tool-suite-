import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

const source = ts.transpileModule(fs.readFileSync('src/components/tools/dev/QrCodeDecoderTool.tsx', 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.React } }).outputText;
function harness() {
  const states: any[] = [], refs: any[] = [], readers: any[] = [], images: any[] = [], cleanups: any[] = [], copies: any[] = [];
  let stateIndex = 0, refIndex = 0;
  const react = {
    createElement: (type: any, props: any, ...children: any[]) => ({ type, props: { ...props, children } }),
    useState: (initial: any) => { const i = stateIndex++; if (!(i in states)) states[i] = initial; return [states[i], (v: any) => states[i] = typeof v === 'function' ? v(states[i]) : v]; },
    useRef: (initial: any) => refs[refIndex++] ||= { current: initial },
    useEffect: (fn: any) => { const cleanup = fn(); if (cleanup) cleanups.push(cleanup); },
  };
  const exports: any = {};
  vm.runInNewContext(source, {
    exports, require: (name: string) => name === 'react' ? { ...react, default: react } : name === 'jsqr' ? { default: () => ({ data: 'decoded current image' }) } : {},
    FileReader: class { onload?: Function; readAsDataURL() { readers.push(this); } },
    Image: class { width = 10; height = 10; onload?: Function; set src(_: string) { images.push(this); } },
    document: { createElement: () => ({ getContext: () => ({ drawImage() {}, getImageData: () => ({ data: [], width: 10, height: 10 }) }) }) },
    navigator: { clipboard: { writeText: () => new Promise((resolve, reject) => copies.push({ resolve, reject })) } },
    setTimeout, clearTimeout,
  });
  const render = () => { stateIndex = refIndex = 0; return exports.QrCodeDecoderTool({ onShowToast() {} }); };
  const nodes = (n: any): any[] => Array.isArray(n) ? n.flatMap(nodes) : n && typeof n === 'object' ? [n, ...nodes(n.props?.children)] : [];
  const upload = (name: string, type = 'image/png') => nodes(render()).find(n => n.type === 'input').props.onChange({ target: { files: [{ name, type, size: 100 }], value: name } });
  const clear = () => nodes(render()).find(n => n.props?.['aria-label'] === 'Clear uploaded QR image').props.onClick();
  const copy = () => nodes(render()).find(n => n.type === 'button' && n.props.children.flat(Infinity).includes('Copy Decoded Text')).props.onClick();
  return { states, readers, images, upload, clear, copy, copies, cleanups };
}
const a = harness();
a.upload('first.png');
a.readers[0].onload({ target: { result: 'first image' } });
a.upload('second.png');
a.readers[1].onload({ target: { result: 'second image' } });
a.images[1].onload();
a.images[0].onerror();
assert.equal(a.states[2], null, 'An older image error must not overwrite a newer successful decode');
assert.equal(a.states[1], 'decoded current image');
const b = harness();
b.upload('pending.png');
b.readers[0].onload({ target: { result: 'pending image' } });
b.clear();
b.images[0].onload();
assert.equal(b.states[0], null);
assert.equal(b.states[1], null, 'Clear must cancel a pending decode');
const c = harness();
c.upload('pending.png');
c.upload('invalid.txt', 'text/plain');
c.readers[0].onload({ target: { result: 'stale image' } });
assert.equal(c.states[0], null, 'A rejected replacement must not restore an older image');
assert.ok(c.states[2].includes('image file'));
const d = harness();
d.upload('copy.png');
d.readers[0].onload({ target: { result: 'copy image' } });
d.images[0].onload();
d.copy();
d.clear();
d.copies[0].resolve();
await Promise.resolve();
assert.equal(d.states[3], false, 'A completed copy must not mark a cleared result as copied');
const e = harness();
e.upload('unmounted.png');
e.cleanups.forEach(fn => fn());
e.readers[0].onload({ target: { result: 'unmounted image' } });
assert.equal(e.states[0], null, 'Unmount must invalidate pending readers');
console.log('QR decoder rejects stale scans, Clear/unmount callbacks and stale copy feedback; validation remains intact.');
