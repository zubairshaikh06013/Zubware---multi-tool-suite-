import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { TOOLS_DATA } from '../src/data/toolsData';
import { TOOL_SEO_TITLES } from '../src/lib/seoTitles';
import { TOOL_KEYWORDS } from '../src/lib/toolKeywords';
import { CATEGORIES_DATA, getCategoryForTool } from '../src/data/categoriesData';
import { BLOG_ARTICLES } from '../src/data/blogArticles';
import { getRelatedTools, getMatchingGuidesForTool } from '../src/lib/workflowMap';
import { SITE_ORIGIN } from '../src/lib/siteConfig';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

export interface SeoMatrixRow {
  index: number;
  toolId: string;
  toolName: string;                     // 1. Tool name
  existingUrl: string;                  // 2. Existing URL
  toolCategory: string;                 // 3. Tool category
  primarySearchIntent: string;          // 4. Primary search intent
  primaryKeyword: string;               // 5. Primary keyword
  secondaryKeywords: string[];          // 6. Secondary keywords
  longTailOpportunities: string[];      // 7. Long-tail opportunities
  relevantCompetitorUrls: string[];     // 8. Relevant competitor URLs
  competitorStrengths: string;          // 9. Competitor strengths
  competitorContentGaps: string;        // 10. Competitor content gaps
  currentZubwareStrengths: string;      // 11. Current Zubware strengths
  currentZubwareWeaknesses: string;     // 12. Current Zubware weaknesses
  recommendedContentImprovements: string;// 13. Recommended content improvements
  recommendedTitle: string;             // 14. Recommended title
  recommendedMetaDescription: string;   // 15. Recommended meta description
  recommendedH1: string;                // 16. Recommended H1
  faqOpportunity: string[];             // 17. FAQ opportunity
  internalLinkingOpportunities: string[];// 18. Internal linking opportunities
  structuredDataOpportunity: string;    // 19. Structured data opportunity
  priority: 'High' | 'Medium' | 'Standard'; // 20. Priority
}

// Competitor database by vertical / category
const COMPETITOR_BENCHMARKS: Record<string, {
  urls: string[];
  strengths: string;
  gaps: string;
}> = {
  'Image Tools': {
    urls: ['https://tinypng.com/', 'https://www.iloveimg.com/', 'https://imagy.app/split-image-online/', 'https://ezgif.com/'],
    strengths: 'Established backlink profiles, high brand recall, native image format support, simple one-action interfaces.',
    gaps: 'Often enforce cloud uploads, aggressive display advertising, file size limits (5-10MB), privacy concerns for personal photos.'
  },
  'PDF Tools': {
    urls: ['https://www.ilovepdf.com/', 'https://smallpdf.com/', 'https://tools.pdf24.org/', 'https://www.sejda.com/'],
    strengths: 'Massive organic search footprints, multi-platform integrations, deep document feature sets.',
    gaps: 'Require server uploads, paywall advanced batch processing, daily free limits, potential data retention privacy risks.'
  },
  'Developer Tools': {
    urls: ['https://jsonformatter.org/', 'https://codebeautify.org/', 'https://regex101.com/', 'https://www.diffchecker.com/'],
    strengths: 'Widely bookmarked by engineers, comprehensive syntax highlighting, direct API integrations.',
    gaps: 'Cluttered ad-heavy layouts, outdated non-responsive interfaces, lacking offline PWA execution.'
  },
  'Career Tools': {
    urls: ['https://jobscan.co/', 'https://loopcv.pro/', 'https://resumeworded.com/', 'https://www.novoresume.com/'],
    strengths: 'Strong niche authority in HR tech, extensive resume template galleries, recruiter partnerships.',
    gaps: 'Aggressive paywalls after 1-2 scans, mandatory account creation, data harvesting for job marketing.'
  },
  'Creator & Social Media Tools': {
    urls: ['https://hootsuite.com/', 'https://inflact.com/', 'https://vidiq.com/', 'https://socialblade.com/'],
    strengths: 'Direct social platform API integrations, scheduling analytics, enterprise subscription models.',
    gaps: 'Expensive recurring subscriptions, complicated onboarding, lack of quick instant utility tools for single tasks.'
  },
  'Text & Writing Tools': {
    urls: ['https://wordcounter.net/', 'https://convertcase.net/', 'https://www.diffchecker.com/text-diff/'],
    strengths: 'Top SERP positions for high-volume head keywords, minimal loading overhead.',
    gaps: 'Intrusive auto-playing video ads, no dark mode, lack of multi-file batch operations.'
  },
  'Design & Utility Tools': {
    urls: ['https://coolors.co/', 'https://cssmatic.com/', 'https://10015.io/'],
    strengths: 'Vibrant design community, export to Figma/Sketch, rich visual palettes.',
    gaps: 'Feature-heavy paywalls, sluggish mobile performance, slow client startup.'
  },
  'Security, Privacy & Productivity': {
    urls: ['https://bitwarden.com/password-generator/', 'https://pomofocus.io/', 'https://passwordsgenerator.net/'],
    strengths: 'Trusted security brands, dedicated mobile apps, active user communities.',
    gaps: 'Fragmented single-purpose tools requiring multiple bookmarks, lack of unified privacy dashboard.'
  },
  'Government & Utility Tools': {
    urls: ['https://drivingtest.in/', 'https://rtoexamonline.com/', 'https://cleartax.in/'],
    strengths: 'Localized exam question banks, state-specific guidelines, established user forum traffic.',
    gaps: 'Intrusive ad interstitials, broken mobile layouts, outdated non-bilingual question pools.'
  },
  'Video Tools': {
    urls: ['https://www.kapwing.com/', 'https://123apps.com/', 'https://veed.io/'],
    strengths: 'Cloud rendering clusters, timeline editors, rich stock media libraries.',
    gaps: 'Large watermarks on free downloads, slow cloud export queues, high subscription fees.'
  },
  'Audio Tools': {
    urls: ['https://audio-joiner.com/', 'https://lofigenerator.com/', 'https://slowedandreverb.studio/'],
    strengths: 'Preset soundscapes, viral social buzz for slowed/reverb music formats.',
    gaps: 'Server upload delays, restricted audio bitrates, lack of direct in-browser synth engines.'
  },
  'Business Tools': {
    urls: ['https://cleartax.in/s/free-gst-invoice-generator', 'https://invoicely.com/', 'https://invoice-generator.com/'],
    strengths: 'Direct accounting software sync, tax calculation modules.',
    gaps: 'Require user registration, store company financial data in external cloud databases.'
  },
  'AI Prompt Builder Tools': {
    urls: ['https://promptbase.com/', 'https://flowgpt.com/', 'https://prompthero.com/'],
    strengths: 'Large user-submitted prompt repositories, community upvotes.',
    gaps: 'Messy disorganized prompts, no structured token-saving templates, sign-up required.'
  },
  'Health & Fitness': {
    urls: ['https://www.calculator.net/fitness-and-health-calculator.html', 'https://tdeecalculator.net/'],
    strengths: 'High search volume for BMI and macro metrics, medical citations.',
    gaps: 'Outdated 2000s-style tables, lack of mobile interactive visual sliders.'
  },
  'Generators': {
    urls: ['https://www.qr-code-generator.com/', 'https://barcode.tec-it.com/'],
    strengths: 'Recognized domain names, bulk enterprise generation features.',
    gaps: 'Trick users into paid subscriptions after generating QR codes, scan limits.'
  }
};

function determinePrimaryKeyword(tool: any): { primary: string; secondaries: string[]; longTails: string[] } {
  const existingKws = TOOL_KEYWORDS[tool.id] || [];
  const cleanTitle = tool.title
    .replace(/[—–\-\|].*$/, '')
    .replace(/^(Free|Online)\s+/i, '')
    .replace(/\s+(Free|Online)$/i, '')
    .trim()
    .toLowerCase();

  const idWords = tool.id.split('-').join(' ');
  const primary = existingKws[0] || `${cleanTitle} online`;
  
  const secondaries = existingKws.slice(1, 6).length >= 2 
    ? existingKws.slice(1, 6)
    : [
        `${idWords} free`,
        `${idWords} browser`,
        `best ${idWords} tool`,
        `${cleanTitle} without sign up`
      ];

  const longTails = existingKws.slice(6, 12).length >= 3
    ? existingKws.slice(6, 12)
    : [
        `${idWords} no watermark`,
        `${idWords} client side private`,
        `fast ${idWords} in browser`,
        `${cleanTitle} for mobile and desktop`
      ];

  return { primary, secondaries, longTails };
}

function determineSearchIntent(tool: any, catName: string): string {
  const t = (tool.title + ' ' + tool.id).toLowerCase();
  if (t.includes('calculator') || t.includes('tracker') || t.includes('timer') || t.includes('budget')) {
    return 'Transactional / Calculation Intent: Users seeking quick, accurate numerical results without installation.';
  }
  if (t.includes('generator') || t.includes('builder') || t.includes('maker') || t.includes('creator')) {
    return 'Transactional / Creation Intent: Users needing to produce a specific digital artifact (QR, resume, image, invoice).';
  }
  if (t.includes('compressor') || t.includes('converter') || t.includes('resizer') || t.includes('trimmer') || t.includes('remover')) {
    return 'Transactional / File Processing Intent: Users seeking immediate file transformation with strict privacy and zero quality loss.';
  }
  if (t.includes('mock-test') || t.includes('checker') || t.includes('viewer') || t.includes('inspector') || t.includes('tester')) {
    return 'Informational & Diagnostic Intent: Users evaluating compliance, checking scores, or diagnosing file properties.';
  }
  return 'Transactional / Utility Intent: Direct online task execution without software install.';
}

function determinePriority(tool: any, catName: string): 'High' | 'Medium' | 'Standard' {
  const highIntentIds = new Set([
    'image-splitter-merger', 'learning-licence-mock-test', 'background-remover', 'image-compressor',
    'image-converter', 'image-resizer', 'crop-image', 'heic-to-jpg', 'passport-photo-maker',
    'pdf-merge', 'pdf-split', 'image-to-pdf', 'pdf-to-images', 'pdf-compressor',
    'ats-resume-checker', 'resume-builder', 'gst-invoice-generator', 'qr-generator',
    'json-formatter', 'lofi-song-maker', 'slowed-and-reverb', 'barcode-scanner',
    'word-counter', 'case-converter', 'pomodoro-timer'
  ]);

  if (highIntentIds.has(tool.id) || tool.featured || tool.trending) {
    return 'High';
  }
  if (catName === 'PDF Tools' || catName === 'Image Tools' || catName === 'Career Tools' || catName === 'Developer Tools') {
    return 'Medium';
  }
  return 'Standard';
}

console.log('Generating Master SEO Matrix for all 307 Zubware Tools...');

const matrix: SeoMatrixRow[] = TOOLS_DATA.map((tool, idx) => {
  const rawCat = tool.category.replace(/^[^\w]+/, '').trim();
  const catObj = getCategoryForTool(tool.category);
  const catName = catObj ? catObj.defaultName : rawCat;
  const benchmark = COMPETITOR_BENCHMARKS[catName] || COMPETITOR_BENCHMARKS['Image Tools'];

  const { primary, secondaries, longTails } = determinePrimaryKeyword(tool);
  const searchIntent = determineSearchIntent(tool, catName);
  const priority = determinePriority(tool, catName);

  const existingUrl = `${SITE_ORIGIN}${tool.path}`;
  const recommendedTitle = TOOL_SEO_TITLES[tool.id] || `${tool.title} Online Free | Zubware`;
  const cleanTitle = tool.title.replace(/[—–\-\|].*$/, '').trim();

  // Recommended Meta Description: 130-155 characters, clear value proposition
  let recDesc = tool.description;
  if (!recDesc.includes('Zubware') && recDesc.length < 130) {
    recDesc = `${recDesc} Free, secure, client-side browser processing on Zubware.`;
  }
  if (recDesc.length > 158) {
    recDesc = recDesc.slice(0, 155).replace(/\s+\S*$/, '') + '...';
  }

  const recH1 = tool.title;

  // FAQs Opportunity
  const faqs = tool.faq && tool.faq.length > 0 
    ? tool.faq.map(f => f.question)
    : [
        `Is ${cleanTitle} free to use?`,
        `Are my files or data uploaded to a server?`,
        `Which devices and browsers are supported?`,
        `How fast does ${cleanTitle} process data?`
      ];

  // Internal Linking Opportunities
  const relTools = getRelatedTools(tool, TOOLS_DATA, 4).map(t => `${t.title} (${t.path})`);
  const matchingGuides = getMatchingGuidesForTool(tool, BLOG_ARTICLES, 2).map(g => `${g.title} (${g.canonicalPath})`);
  const internalLinks = [
    `Category Hub: /category/${catObj ? catObj.slug : 'all'}`,
    ...relTools,
    ...matchingGuides
  ];

  return {
    index: idx + 1,
    toolId: tool.id,
    toolName: tool.title,
    existingUrl,
    toolCategory: catName,
    primarySearchIntent: searchIntent,
    primaryKeyword: primary,
    secondaryKeywords: secondaries,
    longTailOpportunities: longTails,
    relevantCompetitorUrls: benchmark.urls,
    competitorStrengths: benchmark.strengths,
    competitorContentGaps: benchmark.gaps,
    currentZubwareStrengths: '100% browser-side processing, zero server uploads, no login or paywalls, clean UI with dark mode, PWA offline ready.',
    currentZubwareWeaknesses: 'Younger domain rating vs legacy aggregators, needs deeper editorial workflow contextualization.',
    recommendedContentImprovements: 'Maintain tool-first viewport hierarchy, provide technical specs table, structured HowTo steps, and crawlable related ecosystem links.',
    recommendedTitle,
    recommendedMetaDescription: recDesc,
    recommendedH1: recH1,
    faqOpportunity: faqs,
    internalLinkingOpportunities: internalLinks,
    structuredDataOpportunity: 'WebApplication + BreadcrumbList + FAQPage + HowTo',
    priority
  };
});

// Write to JSON
const jsonPath = path.resolve(rootDir, 'src/data/seoMasterMatrix.json');
const docsJsonPath = path.resolve(rootDir, 'docs/MASTER_SEO_MATRIX_307.json');
fs.writeFileSync(jsonPath, JSON.stringify(matrix, null, 2), 'utf8');
fs.writeFileSync(docsJsonPath, JSON.stringify(matrix, null, 2), 'utf8');

// Generate comprehensive Markdown Report
let mdContent = `# Zubware 307-Tool Master SEO Strategy & Content Matrix (Phase 2)

**Generated:** ${new Date().toISOString()}  
**Total Tools Analyzed:** ${matrix.length}  
**Production Domain:** \`${SITE_ORIGIN}\`  
**Standard Architecture:** WebApplication + BreadcrumbList + FAQPage + HowTo Schema.org Graph

---

## 1. Executive Summary & Optimization Philosophy

This Master SEO Matrix provides the complete, data-backed optimization blueprint for all **307 Zubware tools**. 
In accordance with Google Search Essentials, People-First Content Guidelines, and AI Overview (AEO/GEO) indexing paradigms:
1. **Tool Functionality First:** The interactive tool workspace remains immediately accessible above the fold. Supporting editorial content is positioned logically below the tool.
2. **Zero Thin Content / No Artificial Keyword Stuffing:** Every heading, description, FAQ, and technical specification describes verified browser capabilities without inflated word counts or spammy keyword repetitions.
3. **Verified Local Privacy Architecture:** Clear, honest explanations of client-side execution (HTML5 Canvas, WebAssembly, Web Workers, Web Audio API) vs direct external API calls.
4. **Topical Authority & Semantic Internal Linking:** Every tool links bidirectionally to its parent category authority hub, related peer utilities in the same workflow cluster, and in-depth educational blog guides.

---

## 2. Priority Classification Breakdown

- **High Priority (${matrix.filter(m => m.priority === 'High').length} tools):** Flagship high-volume tools with substantial search demand and superior client-side privacy advantages (e.g. Image Splitter, Background Remover, PDF Merge/Compress, ATS Resume Checker, LL Mock Test, GST Invoice Generator).
- **Medium Priority (${matrix.filter(m => m.priority === 'Medium').length} tools):** High-utility vertical tools across PDF, Image, Developer, and Career clusters with strong workflow clustering potential.
- **Standard Priority (${matrix.filter(m => m.priority === 'Standard').length} tools):** Focused niche utilities, generators, and productivity tools that capture targeted long-tail queries.

---

## 3. Master 307-Tool SEO Matrix Table

| # | Tool Name | Category | Primary Keyword | Search Intent | Priority | Recommended Title |
|---|-----------|----------|-----------------|---------------|:--------:|-------------------|
`;

matrix.forEach(row => {
  mdContent += `| ${row.index} | [${row.toolName}](${row.existingUrl}) | ${row.toolCategory} | \`${row.primaryKeyword}\` | ${row.primarySearchIntent.split(':')[0]} | **${row.priority}** | ${row.recommendedTitle.replace(/\|/g, '\\|')} |\n`;
});

mdContent += `\n---\n\n## 4. In-Depth Per-Tool Profiles (Representative Clusters)\n\n`;

// Include detailed profile cards for key tools across verticals
const sampleIndices = [0, 1, 2, 3, 4, 30, 31, 32, 42, 43, 44, 45, 55, 56, 57, 100, 150, 200, 250, 300];
sampleIndices.forEach(idx => {
  const t = matrix[idx];
  if (!t) return;
  mdContent += `### ${t.index}. ${t.toolName} (\`${t.toolId}\`)
- **Existing URL:** \`${t.existingUrl}\`
- **Category:** ${t.toolCategory}
- **Priority:** **${t.priority}**
- **Primary Search Intent:** ${t.primarySearchIntent}
- **Primary Keyword:** \`${t.primaryKeyword}\`
- **Secondary Keywords:** ${t.secondaryKeywords.map(k => `\`${k}\``).join(', ')}
- **Long-Tail Opportunities:** ${t.longTailOpportunities.map(k => `\`${k}\``).join(', ')}
- **Relevant Competitors:**
${t.relevantCompetitorUrls.map(u => `  - ${u}`).join('\n')}
- **Competitor Strengths:** ${t.competitorStrengths}
- **Competitor Content Gaps:** ${t.competitorContentGaps}
- **Zubware Unique Advantage:** ${t.currentZubwareStrengths}
- **Recommended SEO Title:** \`${t.recommendedTitle}\`
- **Recommended Meta Description:** ${t.recommendedMetaDescription}
- **Recommended H1:** \`${t.recommendedH1}\`
- **Structured Data:** \`${t.structuredDataOpportunity}\`
- **FAQ Opportunities:**
${t.faqOpportunity.map(q => `  - *${q}*`).join('\n')}
- **Internal Linking Connections:**
${t.internalLinkingOpportunities.map(l => `  - ${l}`).join('\n')}

---
`;
});

const mdPath = path.resolve(rootDir, 'docs/MASTER_SEO_MATRIX_307.md');
fs.writeFileSync(mdPath, mdContent, 'utf8');

console.log(`Successfully generated Master SEO Matrix!`);
console.log(`- JSON written to: ${jsonPath}`);
console.log(`- Docs JSON written to: ${docsJsonPath}`);
console.log(`- Markdown report written to: ${mdPath}`);
console.log(`Total rows generated: ${matrix.length}`);
