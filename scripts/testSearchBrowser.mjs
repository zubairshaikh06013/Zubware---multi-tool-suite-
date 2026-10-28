import assert from 'node:assert/strict';
import puppeteer from 'puppeteer-core';
import { existsSync } from 'node:fs';
const executablePath = process.env.CHROME_PATH || ['/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser'].find(p => existsSync(p));
if (!executablePath) throw new Error('Chrome is required for the search browser check');
const browser = await puppeteer.launch({ executablePath, headless: true, args: ['--no-sandbox','--disable-dev-shm-usage'] });
try {
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844 });
  await page.goto('http://127.0.0.1:4173/qr-generator', { waitUntil: 'networkidle0' });
  const matches = await page.evaluate(async () => {
    const engine = await import('/pagefind/pagefind.js');
    const result = await engine.search('QR code');
    return Promise.all(result.results.slice(0, 5).map(r => r.data().then(d => d.url)));
  });
  assert.ok(matches.includes('/qr-generator'), JSON.stringify(matches));
  await page.click('button[aria-label="Open search dialog"]');
  // SearchModal is lazy-loaded: wait for the input before typing.
  await page.waitForSelector('#search-modal-title', { timeout: 20000 });
  await page.type('#search-modal-title', 'QR code');
  await page.waitForSelector('section[aria-label="Search tool content and guides"] a', { timeout: 20000 });
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, 'Mobile page must not overflow');
  await page.screenshot({ path: 'reports/search-mobile.png', fullPage: true });
  await page.click('section[aria-label="Search tool content and guides"] a');
  await page.waitForFunction(() => !document.querySelector('[role="dialog"]'));
  console.log('Pagefind QR result, mobile search modal and result navigation passed.');
} finally {
  await browser.close();
}
