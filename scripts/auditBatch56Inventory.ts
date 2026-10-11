import { TOOLS_DATA } from '../src/data/toolsData';

const targetNames = [
  'Contrast Checker',
  'QR Business Card Generator',
  'Unit Converter',
  'Percentage Calculator',
  'EMI Calculator',
  'Discount Calculator',
  'Currency Calculator',
  'Loan & Mortgage Calculator',
  'ROI & Profit Margin Calculator',
  'Compound Interest & CAGR Calculator',
  'Countdown Calculator',
  'Online Stopwatch',
  'Countdown Timer',
  'Online Clock & World Clock',
  'Time Zone Converter',
  'Cement Concrete Calculator',
  'Random Letter Generator',
  'QR Code Safety Checker',
  'Typing Speed Test',
  'File Checksum Verifier',
  'Memorable Passphrase Generator',
  'Password Strength Checker',
  'AES Text Encrypt & Decrypt'
];

console.log('Total tools count in TOOLS_DATA:', TOOLS_DATA.length);

const matched = [];
for (const search of targetNames) {
  // Try exact match on navTitle, title, or search inside
  let found = TOOLS_DATA.find(t => t.navTitle.toLowerCase() === search.toLowerCase() || t.title.toLowerCase() === search.toLowerCase());
  if (!found) {
    found = TOOLS_DATA.find(t => t.title.toLowerCase().includes(search.toLowerCase()) || search.toLowerCase().includes(t.navTitle.toLowerCase()));
  }
  if (!found) {
    // keyword based search
    const words = search.toLowerCase().split(' ').filter(w => w !== '&');
    found = TOOLS_DATA.find(t => words.every(w => t.id.includes(w) || t.title.toLowerCase().includes(w) || t.navTitle.toLowerCase().includes(w)));
  }
  matched.push({ search, found: found ? { id: found.id, title: found.title, navTitle: found.navTitle, category: found.category } : null });
}

matched.forEach((m, i) => {
  if (m.found) {
    console.log(`${i + 1}. [${m.search}] -> ID: "${m.found.id}" | Title: "${m.found.title}" | Nav: "${m.found.navTitle}" | Category: "${m.found.category}"`);
  } else {
    console.log(`${i + 1}. [${m.search}] -> NOT FOUND`);
  }
});
