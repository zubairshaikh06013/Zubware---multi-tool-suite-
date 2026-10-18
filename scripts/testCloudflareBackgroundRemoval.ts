import assert from 'node:assert/strict';
import worker from '../workers/background-remover/src/index.js';
import { processCloudflareBackgroundRemoval } from '../src/lib/cloudflareBackgroundRemoval';

const makeRequest = (origin = 'https://www.zubware.com') => new Request('https://api.zubware.com/remove-background', {
  method: 'POST',
  headers: { Origin: origin, 'Content-Type': 'image/png', 'CF-Connecting-IP': '203.0.113.5' },
  body: new Uint8Array([137, 80, 78, 71])
});
let transformations = 0;
const env = {
  RATE_LIMITER: { limit: async () => ({ success: true }) },
  IMAGES: {
    input: () => ({
      transform: ({ segment }: {segment: string}) => {
        assert.equal(segment, 'foreground');
        transformations++;
        return { output: async () => ({ response: () => new Response(new Uint8Array([137, 80, 78, 71]), { headers: {'Content-Type': 'image/png'} }) }) };
      }
    })
  }
};

const rejected = await worker.fetch(makeRequest('https://untrusted.example'), env);
assert.equal(rejected.status, 403);
assert.equal(transformations, 0);

const limited = await worker.fetch(makeRequest(), { ...env, RATE_LIMITER: {limit: async () => ({success: false})} });
assert.equal(limited.status, 429);
assert.equal(limited.headers.get('Retry-After'), '60');
assert.equal(transformations, 0);

const missing = await worker.fetch(makeRequest(), { RATE_LIMITER: env.RATE_LIMITER });
assert.equal(missing.status, 503);
assert.equal(transformations, 0);

const ok = await worker.fetch(makeRequest(), env);
assert.equal(ok.status, 200);
assert.equal(ok.headers.get('Access-Control-Allow-Origin'), 'https://www.zubware.com');
assert.equal(ok.headers.get('Content-Type'), 'image/png');
assert.equal(transformations, 1);

const originalError = console.error;
console.error = () => {};
let error: Response;
try {
  error = await worker.fetch(makeRequest(), {
    ...env,
    IMAGES: { input: () => { throw new Error('9422'); } }
  });
} finally { console.error = originalError; }
assert.equal(error.status, 503);
assert.equal(transformations, 1);

assert.equal(typeof processCloudflareBackgroundRemoval, 'function');
console.log('Cloudflare AI request guards, rate limit, image result and quota fallback passed.');
