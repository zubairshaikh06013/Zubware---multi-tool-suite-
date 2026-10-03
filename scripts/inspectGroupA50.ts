import fs from 'fs';
import path from 'path';

const appTsx = fs.readFileSync('./src/App.tsx', 'utf-8');

// Match activeTool.id === 'xyz' && <CompName
const appMatches = [...appTsx.matchAll(/activeTool\.id === '([^']+)'[^<]*<([A-Za-z0-9_]+)/g)];
const toolCompMap = new Map<string, string>();
for (const m of appMatches) {
  toolCompMap.set(m[1], m[2]);
}

// Match const CompName = (lazy|lazyWithRetry)(() => import('path')
const importMatches = [...appTsx.matchAll(/const ([A-Za-z0-9_]+) = (?:lazy|lazyWithRetry)\(\(\) => import\('([^']+)'\)/g)];
const compPathMap = new Map<string, string>();
for (const m of importMatches) {
  compPathMap.set(m[1], m[2]);
}

const target50 = [
  // Image (1-4)
  'image-compressor',
  'image-converter',
  'image-resizer',
  'image-to-pdf',
  // PDF (5-10)
  'pdf-merge',
  'pdf-split',
  'pdf-to-images',
  'pdf-to-jpg',
  'decrease-pdf-size',
  'increase-pdf-size',
  // Developer (11-22)
  'json-formatter',
  'json-validator',
  'json-minifier',
  'html-formatter',
  'css-formatter',
  'javascript-formatter',
  'xml-formatter',
  'base64-encoder-decoder',
  'url-encoder-decoder',
  'html-escape-unescape',
  'regex-tester',
  'uuid-generator',
  // Text (23-28)
  'word-counter',
  'character-counter',
  'case-converter',
  'text-cleaner',
  'sort-lines',
  'social-media-post-formatter',
  // Generators (29-31)
  'qr-generator',
  'barcode-generator',
  'emoji-combiner',
  // Calculators (32-35)
  'percentage-calculator',
  'age-calculator',
  'emi-calculator',
  'unit-converter',
  // Resume local (36-39)
  'resume-template-gallery',
  'resume-import',
  'resume-export',
  'resume-section-manager',
  // Algorithmic/Prompt/Utility (40-50)
  'youtube-hashtag-generator',
  'youtube-playlist-name-generator',
  'thumbnail-text-generator',
  'instagram-username-generator',
  'facebook-hashtag-generator',
  'twitter-bio-generator',
  'universal-hashtag-generator',
  'resume-prompt-builder',
  'cover-letter-prompt-builder',
  'email-prompt-builder',
  'image-color-picker' // registered as image-color-picker in TOOLS_DATA
];

console.log('Mapping 50 Group A Tools:');
const mapping: any[] = [];
for (const id of target50) {
  const comp = toolCompMap.get(id);
  const rawPath = comp ? compPathMap.get(comp) : '';
  let resolved = '';
  if (rawPath) {
    const p1 = path.join('./src', rawPath + '.tsx');
    const p2 = path.join('./src', rawPath.replace('./', '') + '.tsx');
    if (fs.existsSync(p1)) resolved = p1;
    else if (fs.existsSync(p2)) resolved = p2;
  }
  let lines = 0;
  if (resolved && fs.existsSync(resolved)) {
    lines = fs.readFileSync(resolved, 'utf-8').split('\n').length;
  }
  mapping.push({ id, comp, resolved, lines });
}
console.table(mapping);
fs.writeFileSync('scripts/groupA50Mapping.json', JSON.stringify(mapping, null, 2));
