const fs = require('fs');

const code = fs.readFileSync('src/data/toolsData.ts', 'utf8');

// Estimate faq matches
const faqMatches = code.match(/faq:\s*\[[\s\S]*?\n\s*\]/g) || [];
let faqBytes = 0;
faqMatches.forEach(f => faqBytes += f.length);

// Estimate howTo matches
const howToMatches = code.match(/howTo:\s*\[[\s\S]*?\n\s*\]/g) || [];
let howToBytes = 0;
howToMatches.forEach(h => howToBytes += h.length);

console.log('Total toolsData.ts file size:', code.length, 'bytes');
console.log('FAQ section size:', faqBytes, 'bytes', `(${(faqBytes/code.length*100).toFixed(1)}%)`);
console.log('HowTo section size:', howToBytes, 'bytes', `(${(howToBytes/code.length*100).toFixed(1)}%)`);
console.log('Combined FAQ + HowTo size:', faqBytes + howToBytes, 'bytes', `(${((faqBytes + howToBytes)/code.length*100).toFixed(1)}%)`);
