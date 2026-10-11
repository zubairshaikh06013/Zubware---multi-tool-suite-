import fs from 'fs';
import { TOOLS_DATA } from '../src/data/toolsData';
import { TOOL_SEO_TITLES, getToolSeoTitle } from '../src/lib/seoTitles';
import { TOOL_SEO_DATA } from '../src/data/toolSeoData';
import { getToolHowToHeading, getToolIntroParagraph, getToolCanonicalPath } from '../src/lib/paths';

const matrix = JSON.parse(fs.readFileSync('src/data/seoMasterMatrix.json', 'utf8'));

console.log('Total tools in toolsData:', TOOLS_DATA.length);
console.log('Total tools in matrix:', matrix.length);
console.log('Total mapped in TOOL_SEO_TITLES:', Object.keys(TOOL_SEO_TITLES).length);
console.log('Total tools in TOOL_SEO_DATA:', Object.keys(TOOL_SEO_DATA).length);

// P0 Protected tools list from prompt
const P0_DEEP_OPTIMIZED = new Set([
  'image-compressor',
  'pdf-compressor',
  'qr-generator',
  'resume-builder',
  'ats-resume-checker',
  'signature-resizer',
  'photo-signature-joiner',
  'age-calculator'
]);

// Developer tools (all 51)
const devTools = TOOLS_DATA.filter(t => t.category.includes('Developer') || t.category.includes('⚡ Developer Tools'));
console.log('Developer tools count:', devTools.length);

// Batch 1 tools (40)
const BATCH_1_IDS = new Set([
  'image-splitter-merger', 'rotate-image', 'flip-image', 'blur-image', 'pixelate-image',
  'image-color-picker', 'image-info-viewer', 'background-color-changer', 'rounded-corners',
  'image-border', 'image-frame', 'image-collage', 'svg-optimizer', 'compression-comparison',
  'bulk-image-renamer-resizer', 'signature-resizer', 'photo-signature-joiner',
  'photo-name-date-joiner', 'text-to-handwriting', 'matching-parts-video-maker',
  'video-to-audio', 'video-to-gif', 'lofi-song-maker', 'lofi-maker', 'slowed-and-reverb',
  'business-name-generator', 'brand-name-generator', 'bond-yield-calculator',
  'car-gas-mileage-calculator', 'expense-tracker', 'monthly-budget-planner',
  'rotate-pdf', 'reorder-pdf-pages', 'pdf-watermark', 'pdf-metadata-viewer',
  'increase-pdf-size', 'decrease-pdf-size', 'add-page-numbers-pdf', 'text-to-pdf', 'pdf-compare'
]);

// Batch 2 tools (39)
const BATCH_2_IDS = new Set([
  'tip-calculator', 'number-to-words-converter', 'words-to-number-converter',
  'roman-numeral-converter', 'coin-flip', 'name-picker-wheel', 'dice-roller',
  'wavelength-calculator', 'mode-calculator', 'inductance-calculator', 'cat-age-calculator',
  'paint-calculator', 'density-calculator', 'screen-size-calculator', 'torque-calculator',
  'linear-regression-calculator', 'barcode-scanner', 'calendar-notes', 'clipboard-history',
  'daily-planner', 'habit-tracker', 'pomodoro-timer', 'secure-notes', 'todo-list',
  'weekly-planner', 'reading-time-calculator', 'remove-duplicate-lines', 'remove-empty-lines',
  'sort-lines', 'lorem-ipsum-generator', 'wide-text-generator', 'text-reverser',
  'remove-line-breaks', 'remove-extra-spaces', 'text-repeater', 'text-splitter',
  'text-joiner', 'email-extractor', 'random-text-generator'
]);

// Classification counters
let indiaFirstCount = 0;
let globalFirstCount = 0;
let bothCount = 0;

// Scan matrix or keywords for India intent
const indiaKeywordsRegex = /ssc|upsc|ibps|rto|vyapam|aadhaar|pan\b|cbse|vtu|gst|rupee|₹|inr|bihar|lakh|crore|govt|exam portal|driving licence|learning licence/i;

const classifications: Record<string, 'India' | 'Global' | 'Both'> = {};

for (const tool of TOOLS_DATA) {
  const m = matrix.find((x: any) => x.toolId === tool.id);
  const textToScan = `${tool.id} ${tool.title} ${tool.description} ${(tool.tags || []).join(' ')} ${m ? (m.primaryKeyword + ' ' + (m.secondaryKeywords || []).join(' ')) : ''}`;
  
  if (
    tool.id.includes('learning-licence') ||
    tool.id.includes('gst-') ||
    tool.id.includes('signature-resizer') ||
    tool.id.includes('photo-signature') ||
    tool.id.includes('photo-name-date') ||
    tool.id.includes('cgpa-calculator') ||
    tool.id.includes('exam-score') ||
    tool.id.includes('salary-hike') ||
    tool.id.includes('notice-period') ||
    tool.id.includes('ctc-calculator') ||
    tool.id.includes('gratuity') ||
    tool.id.includes('epf-') ||
    tool.id.includes('sip-') ||
    tool.id.includes('fd-calculator') ||
    tool.id.includes('rd-calculator')
  ) {
    classifications[tool.id] = 'India';
    indiaFirstCount++;
  } else if (
    tool.id.includes('compress') ||
    tool.id.includes('pdf-') ||
    tool.id.includes('image-') ||
    tool.id.includes('calculator') ||
    tool.id.includes('converter') ||
    tool.id.includes('generator') ||
    tool.id.includes('age-')
  ) {
    if (indiaKeywordsRegex.test(textToScan)) {
      classifications[tool.id] = 'Both';
      bothCount++;
    } else {
      classifications[tool.id] = 'Global';
      globalFirstCount++;
    }
  } else {
    classifications[tool.id] = 'Global';
    globalFirstCount++;
  }
}

console.log('\n--- CLASSIFICATION BREAKDOWN ---');
console.log('India-first:', indiaFirstCount);
console.log('Global-first:', globalFirstCount);
console.log('Both:', bothCount);
console.log('Total classified:', indiaFirstCount + globalFirstCount + bothCount);

// Check SEO title coverage and character length
let titleMissing = 0;
let titleTooLong = 0;
let titleTooShort = 0;

for (const tool of TOOLS_DATA) {
  const seoTitle = getToolSeoTitle(tool);
  if (!seoTitle) titleMissing++;
  else {
    if (seoTitle.length > 70) titleTooLong++;
    if (seoTitle.length < 30) titleTooShort++;
  }
}

console.log('\n--- TITLE METRICS ---');
console.log('Missing SEO titles:', titleMissing);
console.log('Titles > 70 chars:', titleTooLong);
console.log('Titles < 30 chars:', titleTooShort);

// Check description metrics
let descMissing = 0;
let descTooLong = 0;
let descTooShort = 0;

for (const tool of TOOLS_DATA) {
  const desc = tool.description || '';
  if (!desc) descMissing++;
  else {
    if (desc.length > 170) descTooLong++;
    if (desc.length < 80) descTooShort++;
  }
}

console.log('\n--- DESCRIPTION METRICS ---');
console.log('Missing descriptions:', descMissing);
console.log('Descriptions > 170 chars:', descTooLong);
console.log('Descriptions < 80 chars:', descTooShort);

// Check FAQ count in TOOL_SEO_DATA
let toolSeoMissing = 0;
let toolFaqCount = 0;
let toolHowToCount = 0;

for (const tool of TOOLS_DATA) {
  const s = TOOL_SEO_DATA[tool.id];
  if (!s) toolSeoMissing++;
  else {
    if (s.faq && s.faq.length > 0) toolFaqCount++;
    if (s.howTo && s.howTo.length > 0) toolHowToCount++;
  }
}

console.log('\n--- TOOL SEO DATA (HOWTO & FAQ) ---');
console.log('Tools missing TOOL_SEO_DATA:', toolSeoMissing);
console.log('Tools with FAQs in TOOL_SEO_DATA:', toolFaqCount, '/', TOOLS_DATA.length);
console.log('Tools with HowTo in TOOL_SEO_DATA:', toolHowToCount, '/', TOOLS_DATA.length);
