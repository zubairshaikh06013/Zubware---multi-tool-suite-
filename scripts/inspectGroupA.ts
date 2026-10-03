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

const targetIds = [
  'image-compressor',
  'image-converter',
  'image-resizer',
  'image-to-pdf',
  'pdf-merge',
  'pdf-split',
  'pdf-to-images',
  'pdf-to-jpg',
  'decrease-pdf-size',
  'increase-pdf-size',
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
  'word-counter',
  'character-counter',
  'case-converter',
  'text-cleaner',
  'sort-lines',
  'social-media-post-formatter',
  'qr-generator',
  'barcode-generator',
  'emoji-combiner',
  'percentage-calculator',
  'age-calculator',
  'emi-calculator',
  'unit-converter',
  'resume-template-gallery',
  'resume-import',
  'resume-export',
  'resume-section-manager',
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
  'color-picker'
];

console.log('Inspecting exact 50 tools:');
const results: any[] = [];
for (const id of targetIds) {
  const comp = toolCompMap.get(id);
  const rawPath = comp ? compPathMap.get(comp) : '';
  let resolved = '';
  let lines = 0;
  let content = '';

  if (rawPath) {
    const p1 = path.join('./src', rawPath + '.tsx');
    const p2 = path.join('./src', rawPath.replace('./', '') + '.tsx');
    if (fs.existsSync(p1)) resolved = p1;
    else if (fs.existsSync(p2)) resolved = p2;
  }

  if (resolved && fs.existsSync(resolved)) {
    content = fs.readFileSync(resolved, 'utf-8');
    lines = content.split('\n').length;
  }

  results.push({
    id,
    comp,
    resolved,
    lines,
    isReExport: lines < 10,
    hasDownload: content.includes('download') || content.includes('Download') || content.includes('Blob'),
    hasCopy: content.includes('clipboard') || content.includes('copy') || content.includes('Copy'),
    hasReset: content.includes('reset') || content.includes('Reset') || content.includes('clear') || content.includes('Clear'),
  });
}

console.table(results.map(r => ({
  id: r.id,
  lines: r.lines,
  isReExport: r.isReExport,
  copy: r.hasCopy,
  download: r.hasDownload,
  reset: r.hasReset
})));

fs.writeFileSync('scripts/groupAStatus.json', JSON.stringify(results, null, 2));
