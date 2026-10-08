const fs = require('fs');
const path = require('path');

const files = fs.readdirSync('dist/assets');
const indexFile = files.find(f => f.startsWith('index-') && f.endsWith('.js') && fs.statSync(path.join('dist/assets', f)).size > 500000);

if (!indexFile) {
  console.log('Main index JS chunk not found!');
  process.exit(1);
}

const code = fs.readFileSync(path.join('dist/assets', indexFile), 'utf8');

console.log('Main index JS chunk path:', indexFile);
console.log('Size:', (code.length / 1024).toFixed(2), 'KB');

// Check if specific FAQ/HowTo content only present in toolSeoData.ts is included in this index JS chunk
const seoSpecificKeywords = [
  'Can I split an image into equal grid tiles for Instagram or social media?',
  'Does combining images degrade the original photo resolution?',
  'Can I merge photos both horizontally side-by-side and vertically stacked?',
  'Standard empirical solenoid equation'
];

let foundSeoData = false;
seoSpecificKeywords.forEach(kw => {
  if (code.includes(kw)) {
    console.log(`- FOUND SEO KEYWORD IN MAIN BUNDLE: "${kw}"`);
    foundSeoData = true;
  } else {
    console.log(`- Clean (Keyword not found): "${kw}"`);
  }
});

console.log('Is toolSeoData present in main homepage bundle?', foundSeoData ? 'YES (NOT TREE-SHAKEN!)' : 'NO (FULLY TREE-SHAKEN / DEFERRED!)');
process.exit(0);
