import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

// Render twice, choose a form preset, then paste: the installed listener must
// use the current settings rather than the initial 1200×800 defaults.
const states: any[] = [];
const refs: any[] = [];
const callbacks: any[] = [];
const effectDeps: any[] = [];
const cleanups: any[] = [];
const pending: Array<() => void> = [];
const listeners = new Map<string, Function>();
let stateIndex = 0, refIndex = 0, callbackIndex = 0, effectIndex = 0;
const changed = (old: any[], next: any[]) => !old || old.length !== next.length || next.some((v, i) => !Object.is(v, old[i]));
const react = {
  createElement: (type: any, props: any, ...children: any[]) => ({ type, props: { ...props, children } }),
  useState: (initial: any) => { const i = stateIndex++; if (!(i in states)) states[i] = typeof initial === 'function' ? initial() : initial; return [states[i], (value: any) => { states[i] = typeof value === 'function' ? value(states[i]) : value; }]; },
  useRef: (initial: any) => refs[refIndex++] ||= { current: initial },
  useCallback: (fn: any, deps: any[]) => { const i = callbackIndex++; if (!callbacks[i] || changed(callbacks[i].deps, deps)) callbacks[i] = { fn, deps }; return callbacks[i].fn; },
  useEffect: (fn: any, deps: any[]) => { const i = effectIndex++; if (changed(effectDeps[i], deps)) { effectDeps[i] = deps; pending.push(() => { cleanups[i]?.(); cleanups[i] = fn(); }); } },
};
const exports: any = {};
const compiled = ts.transpileModule(fs.readFileSync('src/components/tools/image/ImageResizerTool.tsx', 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.React } }).outputText;
vm.runInNewContext(compiled, {
  exports, require: (name: string) => name === 'react' ? { ...react, default: react } : name.includes('fileSizeStandard') ? { formatDecimalBytes: String } : {},
  window: { addEventListener: (type: string, fn: Function) => listeners.set(type, fn), removeEventListener: (type: string, fn: Function) => { if (listeners.get(type) === fn) listeners.delete(type); } },
  URL: { createObjectURL: () => 'blob:test-photo', revokeObjectURL() {} },
  Image: class { naturalWidth = 640; naturalHeight = 480; onload?: () => void; set src(_: string) { queueMicrotask(() => this.onload?.()); } },
});
const render = () => { stateIndex = refIndex = callbackIndex = effectIndex = 0; const view = exports.ImageResizerTool({ onShowToast() {} }); while (pending.length) pending.shift()!(); return view; };
const nodes = (node: any): any[] => Array.isArray(node) ? node.flatMap(nodes) : node && typeof node === 'object' ? [node, ...nodes(node.props?.children)] : [];
const text = (node: any): string => typeof node === 'string' || typeof node === 'number' ? String(node) : Array.isArray(node) ? node.map(text).join(' ') : node?.props ? text(node.props.children) : '';
const click = (view: any, label: string) => { const button = nodes(view).find(node => node.type === 'button' && text(node).replace(/\s+/g, '').includes(label.replace(/\s+/g, ''))); assert.ok(button, label); button.props.onClick(); };
let view = render();
click(view, 'India Forms & Social Presets');
view = render();
click(view, 'Application Photo (200×230)');
render();
assert.equal(states[2], 200);
assert.equal(states[3], 230);
listeners.get('paste')!({ clipboardData: { items: [{ type: 'image/png', getAsFile: () => ({ name: 'photo.png', type: 'image/png' }) }] } });
await new Promise(resolve => setImmediate(resolve));
assert.equal(states[0].length, 1, 'Pasted image should be added');
assert.equal(states[1], 'preset');
assert.equal(states[2], 200, 'Paste must retain the chosen form width');
assert.equal(states[3], 230, 'Paste must retain the chosen form height');
view = render();
click(view, 'Photo between 20KB and 50KB');
view = render();
const input = (id: string) => nodes(view).find(n => n.type === 'input' && n.props.id === id);
assert.equal(input('photo-minimum-kb').props.value, 20);
assert.equal(input('photo-target-kb').props.value, 50);
click(view, 'Photo under 20KB');
view = render();
assert.equal(input('photo-minimum-kb').props.value, '', 'Maximum-only shortcut clears the previous minimum');
assert.equal(input('photo-target-kb').props.value, 20);
click(view, 'Photo between 20KB and 50KB');
view = render();
click(view, 'Clear');
view = render();
assert.equal(input('photo-minimum-kb').props.value, '');
assert.equal(input('photo-target-kb').props.value, '');
for (const cleanup of cleanups) cleanup?.();
assert.equal(listeners.size, 0, 'Paste listener must be removed on unmount');
console.log('Image Resizer paste preserves the current form preset and cleans up its listener.');
