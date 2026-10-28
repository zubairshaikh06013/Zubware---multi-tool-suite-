import assert from 'node:assert/strict';
import { loadToolSeoData, readToolSeoData } from '../src/lib/toolSeoClient';
const originalFetch = globalThis.fetch;
const originalDocument = Object.getOwnPropertyDescriptor(globalThis, 'document');
try {
  const initial = { id: 'initial-tool', faq: [{ question: 'Initial?', answer: 'Yes.' }], howTo: [] };
  Object.defineProperty(globalThis, 'document', { configurable: true, value: { getElementById: () => ({ textContent: JSON.stringify(initial) }) } });
  let calls = 0;
  globalThis.fetch = async () => { calls++; throw new Error('Initial hydration must not fetch'); };
  assert.equal((await loadToolSeoData('initial-tool')).faq?.[0].question, 'Initial?');
  assert.equal(calls, 0);
  assert.equal(readToolSeoData('other-tool'), undefined, 'Old inline data cannot hydrate another route');
  globalThis.fetch = async url => {
    calls++;
    assert.equal(url, '/tool-seo/other-tool.json');
    await new Promise(resolve => setTimeout(resolve, 1));
    return new Response(JSON.stringify({id: 'other-tool', faq: [{question:'Other?',answer:'Yes.'}]}));
  };
  const [a,b] = await Promise.all([loadToolSeoData('other-tool'), loadToolSeoData('other-tool')]);
  assert.equal(a,b); assert.equal(calls,1, 'Head and body must share one request');
  await loadToolSeoData('other-tool'); assert.equal(calls,1, 'Cached guides must not refetch');
  await assert.rejects(loadToolSeoData('../escape'));
  globalThis.fetch = async () => new Response(JSON.stringify({id:'wrong-tool', faq: []}));
  await assert.rejects(loadToolSeoData('retry-tool'), /Wrong tool/);
  globalThis.fetch = async () => new Response(JSON.stringify({id:'retry-tool', faq:[{question:2,answer:'bad'}]}));
  await assert.rejects(loadToolSeoData('retry-tool'), /Invalid tool FAQs/);
  globalThis.fetch = async () => new Response(JSON.stringify({id:'retry-tool', faq:[]}));
  assert.deepEqual((await loadToolSeoData('retry-tool')).faq, [], 'Failed requests must allow a retry');
  console.log('Guide hydration, route isolation, request deduplication, caching, validation and retry passed.');
} finally {
  globalThis.fetch = originalFetch;
  if (originalDocument) Object.defineProperty(globalThis,'document', originalDocument);
  else Reflect.deleteProperty(globalThis,'document');
}
