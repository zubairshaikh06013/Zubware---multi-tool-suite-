import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateWebmFrames } from '../src/lib/video/validateWebm';
const element = (id: number[], payload: number[]) => [...id, 0x80 | payload.length, ...payload];
const tracks = element([0x16, 0x54, 0xae, 0x6b], element([0xae], [0xd7, 0x81, 1, 0x83, 0x81, 1]));
const cluster = (time: number, track: number) => [0x1f, 0x43, 0xb6, 0x75, 0xff,
  ...element([0xe7], [time >> 8, time & 255]),
  ...element([0xa3], [0x80 | track, 0, 0, 0x80, 1])];
const webm = (clusters: number[][]) => new Uint8Array([0x18, 0x53, 0x80, 0x67, 0xff, ...tracks, ...clusters.flat()]);
test('successive unknown-size MediaRecorder clusters are siblings', () => {
  validateWebmFrames(webm(Array.from({ length: 21 }, (_, n) => cluster(n * 100, 1))), 2);
});
test('a declared video track with only audio packets is rejected', () => {
  assert.throws(() => validateWebmFrames(webm([cluster(0, 2), cluster(2000, 2)]), 2), /without video frames/);
});
test('partial video coverage is rejected', () => {
  assert.throws(() => validateWebmFrames(webm([cluster(0, 1), cluster(100, 1)]), 20), /missing part/);
});
test('truncated container is rejected', () => {
  assert.throws(() => validateWebmFrames(new Uint8Array([0x18, 0x53]), 2), /Truncated/);
});
