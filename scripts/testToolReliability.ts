import assert from 'node:assert/strict';
import { secureRandomIndex, passwordPool, generateRandomPassword, randomPasswordEntropy } from '../src/lib/secureRandom';
import { PASSPHRASE_WORDS } from '../src/data/passphraseWords';
import { encodeCanvasBlob } from '../src/lib/canvasEncoding';

// A rejected tail draw must not bias the final choice (2^32 is not divisible by 10).
const draws = [0xffffffff, 123];
assert.equal(secureRandomIndex(10, () => draws.shift()!), 3);
assert.equal(draws.length, 0);
assert.equal(secureRandomIndex(1, () => 0xffffffff), 0);
assert.throws(() => secureRandomIndex(0));
for (const invalid of [-1, 0x100000000, NaN, Infinity, 1.5]) {
  assert.throws(() => secureRandomIndex(10, () => invalid), /unsigned 32-bit integer/);
}
for (const invalidSize of [-1, 1.5, NaN, Infinity, 0x100000001]) {
  assert.throws(() => secureRandomIndex(invalidSize));
}
assert.equal(secureRandomIndex(0x100000000, () => 0xffffffff), 0xffffffff);
assert.equal(secureRandomIndex(10, () => 0), 0);
const options = { upper: true, lower: true, numbers: true, symbols: true, avoidSimilar: true, exclude: 'Ab2!' };
const pool = passwordPool(options);
for (const excluded of 'IOil01Ab2!') assert.ok(!pool.includes(excluded));
for (let i = 0; i < 30; i++) {
  const password = generateRandomPassword(24, pool);
  assert.equal(password.length, 24);
  assert.ok([...password].every(char => pool.includes(char)));
}
assert.equal(passwordPool({ ...options, upper: false, lower: false, numbers: false, symbols: false }), '');
assert.throws(() => generateRandomPassword(12, ''));
assert.equal(generateRandomPassword(16, 'aaaa'), 'a'.repeat(16));
const unicodePassword = generateRandomPassword(16, '🔒');
assert.equal(unicodePassword, '🔒'.repeat(16));
assert.equal(Array.from(unicodePassword).length, 16);
assert.throws(() => generateRandomPassword(0, 'abc'));
assert.throws(() => generateRandomPassword(257, 'abc'));
assert.equal(randomPasswordEntropy(20, 1), 0);
assert.equal(randomPasswordEntropy(20, 2), 20);
assert.equal(PASSPHRASE_WORDS.length, 7776);
assert.equal(new Set(PASSPHRASE_WORDS).size, 7776);
assert.ok(6 * Math.log2(PASSPHRASE_WORDS.length) > 77.5);
assert.ok(PASSPHRASE_WORDS.every(word => /^[a-z]+(?:-[a-z]+)*$/.test(word)));

// Exercise the browser's documented unsupported-codec fallback, null export and exceptions.
const fakeCanvas = (blob: Blob | null) => ({ toBlob: (cb: (value: Blob | null) => void) => cb(blob) }) as HTMLCanvasElement;
await assert.rejects(encodeCanvasBlob(fakeCanvas(new Blob(['png'], { type: 'image/png' })), 'image/avif'), /cannot export AVIF/);
await assert.rejects(encodeCanvasBlob(fakeCanvas(null), 'image/png'), /encoding failed/);
await assert.rejects(encodeCanvasBlob({ toBlob: () => { throw new Error('Canvas allocation failed'); } } as unknown as HTMLCanvasElement, 'image/png'), /allocation/);
const png = new Blob(['png'], { type: 'image/png' });
assert.equal(await encodeCanvasBlob(fakeCanvas(png), 'image/png'), png);
console.log('Secure generation, wordlist integrity and canvas export failure regressions passed.');

// Date-only calculations must not gain a century or lose a day across DST.
const { parseCalendarDate, calendarAge, calendarDay, calendarAnniversary } = await import('../src/lib/calendarAge');
const date = (value: string) => { const parsed = parseCalendarDate(value); assert.ok(parsed); return parsed; };
for (const invalid of ['', '2026-02-29', '2026-04-31', '0000-01-01', '2026-13-01', '2026-1-01']) assert.equal(parseCalendarDate(invalid), null);
assert.equal(date('0099-01-01').getFullYear(), 99);
assert.deepEqual(calendarAge(date('2024-02-29'), date('2025-02-28')), { years: 1, months: 0, days: 0, totalDays: 365 });
assert.deepEqual(calendarAge(date('2026-01-31'), date('2026-02-28')), { years: 0, months: 1, days: 0, totalDays: 28 });
assert.equal(calendarAge(date('2026-10-18'), date('2026-10-17')), null);
assert.equal(calendarAge(date('2026-10-18'), date('2026-10-18'))?.totalDays, 0);
assert.equal(calendarAge(date('2026-03-07'), date('2026-03-09'))?.totalDays, 2);
assert.equal(calendarDay(calendarAnniversary(date('0096-02-29'), 99)) - calendarDay(date('0099-02-27')), 1);
console.log('Calendar age, leap-day, month-end and early-year regressions passed.');

// Directory searches combine words with the selected tag without hiding tools by default.
const { filterDirectoryTools, directoryTags } = await import('../src/lib/toolDirectory');
const { TOOLS_DATA } = await import('../src/data/toolsData');
assert.equal(filterDirectoryTools(TOOLS_DATA, '   ').length, TOOLS_DATA.length);
assert.ok(filterDirectoryTools(TOOLS_DATA, '  PDF   MERGE ').some(tool => tool.id === 'pdf-merge'));
assert.ok(filterDirectoryTools(TOOLS_DATA, 'photo resize').length > 0);
assert.equal(filterDirectoryTools(TOOLS_DATA, 'nonexistent-utility-xyz').length, 0);
const tagged = filterDirectoryTools(TOOLS_DATA, '', 'PDF');
assert.ok(tagged.length > 0);
assert.ok(tagged.every(tool => tool.tags?.includes('PDF')));
assert.equal(filterDirectoryTools(TOOLS_DATA, 'nonexistent-utility-xyz', 'PDF').length, 0);
const tagFixture = directoryTags([{tags:['PDF','PDF','Image']}, {tags:['PDF']}]);
assert.deepEqual(tagFixture, [{tag:'PDF',count:2}, {tag:'Image',count:1}]);
assert.ok(directoryTags(TOOLS_DATA).every(({count}) => count <= TOOLS_DATA.length));
console.log('Directory search, combined filters and per-tool tag counts passed.');
