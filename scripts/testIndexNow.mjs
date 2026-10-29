import assert from 'node:assert/strict';
import { test } from 'node:test';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { changedUrls, submitManifest, submitBatch, ORIGIN } from './indexNow.mjs';

test('New-key verification, throttling and temporary service errors retry; permanent errors fail', async () => {
  const statuses = [403, 429, 503, 200];
  let calls = 0;
  let waits = 0;
  const receipt = await submitBatch([`${ORIGIN}/a`], async () => {
    const status = statuses[calls++];
    return new Response(status === 403 ? '{"errorCode":"SiteVerificationNotCompleted"}' : '', {status});
  }, async ms => { assert.equal(ms, 30000); waits++; });
  assert.equal(receipt.status, 200);
  assert.equal(calls, 4);
  assert.equal(waits, 3);
  await assert.rejects(submitBatch([`${ORIGIN}/a`], async () => new Response('InvalidKey', {status:403}), async () => assert.fail('Invalid key must not retry')), /403/);
});

test('First submission, unchanged, edited, added and deleted URLs', () => {
  const previous = { pages: { [`${ORIGIN}/a`]: 'a', [`${ORIGIN}/b`]: 'b', [`${ORIGIN}/removed`]: 'r' } };
  const current = { pages: { [`${ORIGIN}/a`]: 'a', [`${ORIGIN}/b`]: 'updated', [`${ORIGIN}/new`]: 'n' } };
  assert.equal(changedUrls(current).length, 3);
  assert.deepEqual(changedUrls(current, current), []);
  assert.deepEqual(changedUrls(current, previous), [`${ORIGIN}/b`, `${ORIGIN}/new`, `${ORIGIN}/removed`]);
  assert.throws(() => changedUrls({pages:{'https://other.example/a':'a'}}), /Invalid/);
});

test('Accepted responses save state; rejected requests preserve old state; unchanged pages are skipped', async () => {
  const cwd = process.cwd();
  const originalFetch = globalThis.fetch;
  const tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'zubware-indexnow-'));
  const current = {version: 1, revision:'test-revision', pages:{[`${ORIGIN}/a`]:'new'}};
  const previous = {version: 1, revision:'old', pages:{[`${ORIGIN}/a`]:'old'}};
  let status = 422;
  let posts = 0;
  globalThis.fetch = async (url, options) => {
    if (String(url).includes('.txt')) return new Response('9f10749edcf342c78b50d6be9836a21d');
    if (String(url).includes('indexnow-manifest.json')) return Response.json(current);
    assert.equal(url, 'https://api.indexnow.org/indexnow');
    assert.equal(options.method, 'POST');
    assert.deepEqual(JSON.parse(options.body).urlList, [`${ORIGIN}/a`]);
    posts++;
    return new Response('', {status});
  };
  try {
    process.chdir(tmp);
    await fs.mkdir('reports');
    await fs.mkdir('.indexnow-state');
    await fs.writeFile('reports/indexnow-manifest.json', JSON.stringify(current));
    await fs.writeFile('.indexnow-state/manifest.json', JSON.stringify(previous));
    await assert.rejects(submitManifest(), /422/);
    assert.deepEqual(JSON.parse(await fs.readFile('.indexnow-state/manifest.json', 'utf8')), previous);
    status = 202;
    await submitManifest();
    assert.deepEqual(JSON.parse(await fs.readFile('.indexnow-state/manifest.json', 'utf8')), current);
    await submitManifest();
    assert.equal(posts, 2, 'unchanged pages must not be submitted again');
  } finally {
    process.chdir(cwd);
    globalThis.fetch = originalFetch;
    await fs.rm(tmp, {recursive:true, force:true});
  }
});
