import assert from 'node:assert/strict';
import currentWorker from '../workers/background-remover/src/index.js';
import legacyWorker from '../cloudflare/background-remover/worker.js';
import { processCloudflareBackgroundRemoval, REMOTE_BACKGROUND_REMOVAL_ENABLED } from '../src/lib/cloudflareBackgroundRemoval';

assert.equal(REMOTE_BACKGROUND_REMOVAL_ENABLED, false);
const originalFetch = globalThis.fetch;
let calls = 0;
globalThis.fetch = async () => { calls++; throw new Error('Unexpected network call'); };
try {
  await assert.rejects(processCloudflareBackgroundRemoval({} as File), /Online removal is unavailable/);
  assert.equal(calls, 0, 'Disabled client must not make a request');
} finally { globalThis.fetch = originalFetch; }

for (const worker of [currentWorker, legacyWorker]) {
  for (const enabled of [undefined, 'false', 'TRUE', true]) {
    const request = new Request('https://api.zubware.com/remove-background', {
      method: 'POST', headers: { Origin: 'https://www.zubware.com', 'Content-Type': 'image/png' }, body: 'fixture'
    });
    request.arrayBuffer = async () => { throw new Error('Disabled Worker must not read upload'); };
    const env = new Proxy({ REMOTE_BACKGROUND_REMOVAL_ENABLED: enabled }, {
      get(target, key) {
        if (key === 'IMAGES' || key === 'RATE_LIMITER') throw new Error('Disabled Worker must not invoke services');
        return Reflect.get(target, key);
      }
    });
    const response = await worker.fetch(request, env);
    assert.equal(response.status, 503);
    assert.match(await response.text(), /Online removal is unavailable/);
    assert.equal(response.headers.get('Access-Control-Allow-Origin'), 'https://www.zubware.com');
  }
}
console.log('No-paid-API guards passed: no client network, upload reads or service calls while disabled.');
