// Starts a local Vite server, or uses TEST_URL if set. CHROME_PATH points to a Chromium executable.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import puppeteer from 'puppeteer-core';
import { PDFDocument } from 'pdf-lib';
import JSZip from 'jszip';
const { createServer } = await import('vite');
const server = process.env.TEST_URL ? null : await createServer({ server: { host: '127.0.0.1', port: 3000, strictPort: true } });
await server?.listen();
const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'biodata-test-'));
const browser = await puppeteer.launch({ executablePath: process.env.CHROME_PATH, headless: true, pipe: true, args: ['--no-sandbox'] });
try {
  const page = await browser.newPage(); const errors = []; page.on('pageerror', e => errors.push(e.message));
  const client = await page.createCDPSession(); await client.send('Page.setDownloadBehavior', { behavior: 'allow', downloadPath: dir });
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 });
  await page.goto(`${process.env.TEST_URL || 'http://127.0.0.1:3000'}/marriage-biodata-maker`, { waitUntil: 'networkidle0' });
  await page.waitForSelector('#biodata-name');
  const button = label => page.locator(`button::-p-text(${label})`);
  const ready = async () => { await new Promise(r => setTimeout(r, 250)); return page.waitForFunction(() => [...document.querySelectorAll('button')].some(b => b.textContent.includes('PDF download') && !b.disabled)); };
  await ready();
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, 'mobile overflow');
  await button('PDF download').click(); await page.waitForSelector('[role="alert"]');
  assert.match(await page.$eval('[role="alert"]', e => e.textContent), /नाम/);
  await page.type('#biodata-name', 'Ayesha Shaikh'); await page.type('#biodata-education', 'B.Com');
  await page.type('#biodata-contact', 'Family contact: example@example.com'); await ready();
  await page.waitForFunction(() => document.fonts.check('400 16px "Biodata Devanagari"'));
  await button('Draft save').click();
  await page.reload({ waitUntil: 'networkidle0' }); await page.waitForSelector('#biodata-name');
  assert.equal(await page.$eval('#biodata-name', e => e.value), '');
  await button('Saved draft').click();
  assert.equal(await page.$eval('#biodata-name', e => e.value), 'Ayesha Shaikh'); await ready();
  async function file(name) {
    const full = path.join(dir, name);
    for (let n = 0; n < 100; n++) { try { return await fs.readFile(full); } catch { await new Promise(r => setTimeout(r, 100)); } }
    throw new Error(`Download missing: ${name}`);
  }
  await button('PDF download').click();
  const pdfBytes = await file('marriage-biodata.pdf'); const pdf = await PDFDocument.load(pdfBytes);
  assert.equal(pdf.getPageCount(), 1); assert.ok(Math.abs(pdf.getPage(0).getWidth() - 595.28) < 1);
  await ready(); await button('PNG download').click(); const png = await file('marriage-biodata.png');
  assert.equal(png.readUInt32BE(16), 1588); assert.equal(png.readUInt32BE(20), 2246);
  const firstPreview = await page.$eval('.biodata-maker canvas', c => c.toDataURL().split(',')[1]);
  assert.equal(png.toString('base64'), firstPreview, 'PNG must match preview exactly');
  // Real renderer: long fields, Unicode, photo, all templates and pagination geometry.
  const renderer = await page.evaluate(async () => {
    const { renderBiodata, emptyBiodata, biodataThemes } = await import('/src/lib/marriageBiodata.ts');
    const original = CanvasRenderingContext2D.prototype.fillText; const drawn = [];
    CanvasRenderingContext2D.prototype.fillText = function(text, x, y, ...rest) { drawn.push({ text, x, y }); return original.call(this, text, x, y, ...rest); };
    try {
      const image = document.createElement('canvas'); image.width = 100; image.height = 150;
      const ctx = image.getContext('2d'); ctx.fillStyle = '#f08080'; ctx.fillRect(0, 0, 100, 150);
      const data = { ...emptyBiodata, name: 'आयशा शेख', about: 'अपनी पढ़ाई और परिवार के बारे में जानकारी। '.repeat(30), contact: 'x'.repeat(300), partner: 'Kind and respectful. '.repeat(65) };
      const counts = [];
      for (let theme = 0; theme < biodataThemes.length; theme++) counts.push((await renderBiodata({ data, theme, language: 'hi', heading: '', photo: image.toDataURL() })).length);
      return { counts, bad: drawn.filter(d => d.y > 1075 || d.y < 0), nameDrawn: drawn.some(d => d.text === 'आयशा शेख'), longWordLines: drawn.filter(d => /^x+$/.test(d.text)).length };
    } finally { CanvasRenderingContext2D.prototype.fillText = original; }
  });
  assert.ok(renderer.counts.every(n => n > 1)); assert.deepEqual(renderer.bad, []); assert.ok(renderer.nameDrawn); assert.ok(renderer.longWordLines > 6);
  await page.focus('#biodata-about');
  await page.keyboard.sendCharacter('A family detail.\n'.repeat(70));
  await page.waitForFunction(() => document.querySelectorAll('.biodata-maker canvas').length > 1);
  await ready(); await button('PNG download').click();
  const zip = await JSZip.loadAsync(await file('marriage-biodata-pages.zip')); assert.ok(Object.keys(zip.files).length > 1);
  await page.screenshot({ path: path.join(dir, 'mobile.png'), fullPage: true });
  page.once('dialog', dialog => dialog.accept()); await button('सब मिटाएं').click();
  assert.equal(await page.$eval('#biodata-name', e => e.value), '');
  assert.equal(await page.evaluate(() => localStorage.getItem('zubware-marriage-biodata-v1')), null);
  await page.setViewport({ width: 1440, height: 1000 }); await page.type('#biodata-name', 'आयशा शेख'); await page.type('#biodata-education', 'बी.कॉम'); await ready();
  await page.screenshot({ path: path.join(dir, 'desktop.png'), fullPage: true });
  assert.deepEqual(errors, []);
  console.log(`Passed: mobile layout, required name, optional photo, Hindi font, draft save/restore/delete, A4 PDF, exact PNG preview, six templates, long-text pagination and multi-page ZIP. QA files: ${dir}`);
} finally { await browser.close(); await server?.close(); }
