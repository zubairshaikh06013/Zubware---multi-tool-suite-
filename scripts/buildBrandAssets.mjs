import sharp from 'sharp';
const card = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
<defs><linearGradient id="bg" x2="1" y2="1"><stop stop-color="#101a36"/><stop offset="1" stop-color="#312e81"/></linearGradient></defs>
<rect width="1200" height="630" fill="url(#bg)"/>
<circle cx="1110" cy="80" r="250" fill="#6366f1" opacity=".14"/>
<rect x="64" y="68" width="92" height="92" rx="24" fill="white"/>
<text x="184" y="134" font-family="sans-serif" font-weight="700" font-size="58" fill="white">Zubware</text>
<text x="64" y="285" font-family="sans-serif" font-weight="700" font-size="70" fill="white">Free tools.</text>
<text x="64" y="373" font-family="sans-serif" font-weight="700" font-size="70" fill="#c7d2fe">Everyday tasks, simplified.</text>
<text x="64" y="447" font-family="sans-serif" font-size="30" fill="#dbeafe">PDF  ·  Images  ·  Calculators  ·  Developer tools</text>
<rect x="64" y="507" width="370" height="58" rx="29" fill="#eef2ff"/>
<text x="95" y="546" font-family="sans-serif" font-weight="600" font-size="29" fill="#312e81">www.zubware.com</text>
</svg>`);
const mark = await sharp('public/favicon.svg').resize(80,80).png().toBuffer();
await sharp(card).composite([{input: mark,left:70,top:74}]).png().toFile('public/social-card.png');
console.log('Generated a 1200×630 social card from the existing brand mark.');
