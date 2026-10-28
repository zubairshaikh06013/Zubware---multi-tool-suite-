import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import puppeteer from 'puppeteer-core';
import { PDFDocument } from 'pdf-lib';
const executablePath = process.env.CHROME_PATH || ['/usr/bin/google-chrome','/usr/bin/chromium'].find(fs.existsSync);
assert.ok(executablePath, 'Chrome is required');
const downloads = fs.mkdtempSync(path.join(os.tmpdir(),'zubware-qr-pdf-'));
const browser = await puppeteer.launch({ executablePath, headless: true, args:['--no-sandbox','--disable-dev-shm-usage'] });
try {
  const page = await browser.newPage();
  await page.setViewport({width:390,height:844});
  const seen = [];
  page.on('request', request=>seen.push(request.url()));
  const cdp = await page.createCDPSession();
  await cdp.send('Page.setDownloadBehavior',{behavior:'allow',downloadPath:downloads});
  await page.goto('http://127.0.0.1:4173/qr-generator',{waitUntil:'networkidle0'});
  await page.waitForFunction(()=>[...document.querySelectorAll('button')].some(b=>b.textContent.trim()==='PDF (A4)' && !b.disabled));
  assert.ok(!seen.some(url=>/\/jspdf[^/]*\.js/.test(url)), 'PDF engine loaded before export');
  await page.evaluate(()=>[...document.querySelectorAll('button')].find(b=>b.textContent.trim()==='PDF (A4)').click());
  const output = path.join(downloads,'qr-code-url.pdf');
  const deadline = Date.now()+30000;
  while (!fs.existsSync(output) && Date.now()<deadline) await new Promise(resolve=>setTimeout(resolve,100));
  assert.ok(fs.existsSync(output), 'QR PDF download did not complete');
  const pdf = await PDFDocument.load(fs.readFileSync(output));
  assert.equal(pdf.getPageCount(),1);
  const size = pdf.getPage(0).getSize();
  assert.ok(Math.abs(size.width-595.28)<1 && Math.abs(size.height-841.89)<1, 'Export must remain A4');
  assert.ok(seen.some(url=>/\/jspdf[^/]*\.js/.test(url)), 'Export did not load the optional engine');
  console.log('QR opens without jsPDF and still downloads a valid one-page A4 PDF.');
} finally {
  await browser.close();
  fs.rmSync(downloads,{recursive:true,force:true});
}
