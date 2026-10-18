import assert from 'node:assert/strict';
import {
  UI_TRANSLATIONS, SUPPORTED_LANGUAGES, getTranslation,
  loadLanguage, isLanguageCode, getPreferredLanguage,
} from '../src/lib/i18n';

assert.deepEqual(Object.keys(UI_TRANSLATIONS), ['en']);
assert.equal(getTranslation('hi', 'home'), 'Home');
assert.equal(getTranslation('hi', 'unknown-key', 'Fallback'), 'Fallback');
const first = loadLanguage('hi');
assert.equal(loadLanguage('hi'), first, 'Concurrent requests share one language load');
await first;
assert.equal(getTranslation('hi', 'home'), 'होम');
assert.equal(getTranslation('en', 'home'), 'Home');
assert.equal(UI_TRANSLATIONS.ur, undefined, 'Hindi must not eagerly load Urdu');
await loadLanguage('ur');
assert.equal(getTranslation('ur', 'home'), 'ہوم');
assert.equal(isLanguageCode('toString'), false);
assert.equal(isLanguageCode('xx'), false);
await assert.rejects(loadLanguage('xx' as never), /Unsupported language/);

Object.defineProperty(globalThis, 'localStorage', {
  configurable: true, value: { getItem: () => 'ur' },
});
assert.equal(getPreferredLanguage(), 'ur');
Object.defineProperty(globalThis, 'localStorage', {
  configurable: true, value: { getItem: () => 'unsupported' },
});
assert.equal(getPreferredLanguage(), 'en');
Object.defineProperty(globalThis, 'localStorage', {
  configurable: true, value: { getItem: () => { throw new Error('Blocked'); } },
});
assert.equal(getPreferredLanguage(), 'en');
Reflect.deleteProperty(globalThis, 'localStorage');

for (const { code } of SUPPORTED_LANGUAGES) {
  await loadLanguage(code);
  assert.ok(UI_TRANSLATIONS[code]?.home, `${code} dictionary loads successfully`);
  assert.equal(getTranslation(code, 'unknown-key', 'Fallback'), 'Fallback');
}
console.log('On-demand languages, shared loads, English fallback, saved preference validation and all 12 dictionaries passed.');
