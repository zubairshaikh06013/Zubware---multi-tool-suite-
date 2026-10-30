import assert from 'node:assert/strict';
import fs from 'node:fs';
import puppeteer from 'puppeteer-core';
const executablePath = process.env.CHROME_PATH || ['/usr/bin/google-chrome','/usr/bin/chromium'].find(fs.existsSync);
assert.ok(executablePath, 'Chrome is required');
const browser = await puppeteer.launch({executablePath,headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
try {
  for (const slow of [false,true]) {
    const page = await browser.newPage();
    await page.setViewport({width:390,height:844});
    await page.setCacheEnabled(false);
    const requests=[];
    let releaseFont;
    const fontGate=new Promise(resolve=>{releaseFont=resolve;});
    page.on('request',r=>requests.push(r.url()));
    if (slow) {
      await page.setRequestInterception(true);
      page.on('request',r=>{
        if (r.url().includes('/fonts/') && r.url().endsWith('.woff2')) fontGate.then(()=>r.continue().catch(()=>{}));
        else r.continue().catch(()=>{});
      });
    }
    await page.evaluateOnNewDocument(()=>{
      window.__fontShifts=[];
      new PerformanceObserver(list=>{
        for(const shift of list.getEntries()) if(!shift.hadRecentInput) window.__fontShifts.push({value:shift.value,time:shift.startTime});
      }).observe({type:'layout-shift',buffered:true});
    });
    await page.goto('http://127.0.0.1:4173/age-calculator',{waitUntil:'domcontentloaded'});
    await page.waitForSelector('#age-birth-date', {visible:true});
    const before=await page.evaluate(()=>({height:document.querySelector('h1').getBoundingClientRect().height,top:document.querySelector('main .glass-panel').getBoundingClientRect().top}));
    // Capture geometry while the delayed font request is still held.
    if (slow) {
      assert.equal(await page.evaluate(()=>document.fonts.check('700 20px \"Plus Jakarta Sans\"')),false,'Slow-font measurement must precede font completion');
      await new Promise(resolve=>setTimeout(resolve,2500));
    }
    releaseFont();
    // Wait for the download after recording the fallback geometry.
    await page.evaluate(async()=>{await document.fonts.load('700 20px "Plus Jakarta Sans"');await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));});
    const after=await page.evaluate(()=>({height:document.querySelector('h1').getBoundingClientRect().height,top:document.querySelector('main .glass-panel').getBoundingClientRect().top}));
    assert.deepEqual(after,before, 'A completed font download must not move the heading or tool');
    assert.ok(requests.some(url=>/\/fonts\/plus-jakarta-sans-[a-f0-9]+\.woff2$/.test(url)), 'Brand font must be requested');
    assert.ok(!requests.some(url=>/fonts\.(googleapis|gstatic)\.com/.test(url)), 'Default page must not depend on external font hosts');
    const shifts=await page.evaluate(()=>window.__fontShifts);
    console.log(JSON.stringify({mode:slow?'delayed-font':'normal',headingHeight:after.height,toolTop:after.top,totalCLS:shifts.reduce((n,s)=>n+s.value,0)}));
    await page.close();
  }
} finally { await browser.close(); }
