import * as fs from 'fs';
import { TOOLS_DATA } from '../src/data/toolsData';
import { TOOL_SEO_DATA } from '../src/data/toolSeoData';
import { TOOL_SEO_TITLES } from '../src/lib/seoTitles';
import { getToolHowToHeading, getToolIntroParagraph } from '../src/lib/paths';

const targetIds = [
  'contrast-checker',
  'qr-business-card-generator',
  'unit-converter',
  'percentage-calculator',
  'emi-calculator',
  'discount-calculator',
  'currency-calculator',
  'loan-calculator',
  'roi-calculator',
  'compound-interest-calculator',
  'countdown-calculator',
  'online-stopwatch',
  'countdown-timer',
  'online-clock',
  'time-zone-converter',
  'cement-calculator',
  'random-letter-generator',
  'qr-code-safety-checker',
  'typing-speed-test',
  'file-checksum-verifier',
  'passphrase-generator',
  'password-strength-checker',
  'text-encrypt-decrypt'
];

console.log('Auditing 23 Target Tools:');
const results = targetIds.map(id => {
  const tool = TOOLS_DATA.find(t => t.id === id);
  const seoData = TOOL_SEO_DATA[id];
  const title = TOOL_SEO_TITLES[id];
  const heading = tool ? getToolHowToHeading(tool) : '';
  const intro = tool ? getToolIntroParagraph(tool) : '';

  return {
    id,
    hasTool: !!tool,
    seoTitle: title || 'MISSING',
    h1: tool?.title || 'MISSING',
    desc: tool?.description || 'MISSING',
    howToCount: seoData?.howTo?.length || 0,
    faqCount: seoData?.faq?.length || 0,
    heading,
    hasIntro: intro.length > 50
  };
});

results.forEach(r => {
  console.log(`[${r.id}] title: ${r.seoTitle.slice(0, 40)}... | howTo: ${r.howToCount} | faq: ${r.faqCount} | heading: "${r.heading}"`);
});
