import * as fs from 'fs';
import * as path from 'path';
import { TOOLS_DATA } from '../src/data/toolsData';
import { BLOG_ARTICLES } from '../src/data/blogArticles';
import { CATEGORIES_DATA } from '../src/data/categoriesData';

const DOMAIN = 'https://www.zubware.com';

// 1. Compile canonical URLs inventory
const canonicalUrls = new Set<string>();
const pathToEntity = new Map<string, { type: string; id: string }>();

// Homepage
canonicalUrls.add('/');
pathToEntity.set('/', { type: 'home', id: 'home' });

// Static pages
const staticPages = [
  '/categories',
  '/blog',
  '/dashboard',
  '/about',
  '/contact',
  '/privacy',
  '/terms',
  '/disclaimer',
  '/help',
  '/changelog',
  '/feedback'
];
for (const sp of staticPages) {
  canonicalUrls.add(sp);
  pathToEntity.set(sp, { type: 'static', id: sp });
}

// 13 Category Authority Hubs
for (const cat of CATEGORIES_DATA) {
  if (cat.slug === 'all') continue;
  const cPath = `/category/${cat.slug}`;
  canonicalUrls.add(cPath);
  pathToEntity.set(cPath, { type: 'category', id: cat.slug });
}

// 42 Blog Articles
for (const art of BLOG_ARTICLES) {
  const bPath = `/blog/${art.slug}`;
  canonicalUrls.add(bPath);
  pathToEntity.set(bPath, { type: 'blog', id: art.slug });
}

// 308 Tools
for (const tool of TOOLS_DATA) {
  const tPath = tool.path.startsWith('/') ? tool.path : '/' + tool.path;
  canonicalUrls.add(tPath);
  pathToEntity.set(tPath, { type: 'tool', id: tool.id });
}

console.log('--- CANONICAL INVENTORY ---');
console.log('Total Canonical URLs in Inventory:', canonicalUrls.size);
console.log('Tools:', TOOLS_DATA.length);
console.log('Blog Articles:', BLOG_ARTICLES.length);
console.log('Category Hubs:', CATEGORIES_DATA.filter((c) => c.slug !== 'all').length);
console.log('Static Pages:', staticPages.length + 1);

// 2. Parse all generated HTML files in dist/ to extract real graph edges
const distDir = path.resolve('dist');
if (!fs.existsSync(distDir)) {
  console.error('dist/ does not exist. Please run static generation first.');
  process.exit(1);
}

// Build adjacency list: node -> Set<targetNode>
const graph = new Map<string, Set<string>>();
for (const url of canonicalUrls) {
  graph.set(url, new Set<string>());
}

// Collect all HTML files
function collectHtmlFiles(dir: string): string[] {
  let results: string[] = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat && stat.isDirectory()) {
      results = results.concat(collectHtmlFiles(full));
    } else if (file.endsWith('.html')) {
      results.push(full);
    }
  }
  return results;
}

const htmlFiles = collectHtmlFiles(distDir);
console.log(`Found ${htmlFiles.length} HTML files in dist/`);

// Map HTML file to canonical URL
function getCanonicalForHtmlFile(filePath: string): string | null {
  const rel = path.relative(distDir, filePath).replace(/\\/g, '/');
  if (rel === 'index.html') return '/';

  // Check if content has <link rel="canonical" href="https://www.zubware.com..."
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const match = content.match(/<link rel=["']canonical["'] href=["']https:\/\/www\.zubware\.com([^"']*)["']/);
    if (match) {
      let p = match[1];
      if (!p || p === '') p = '/';
      return p;
    }
  } catch (e) {}

  // Fallback to filename mapping
  if (rel.endsWith('/index.html')) {
    return '/' + rel.slice(0, -'/index.html'.length);
  }
  return '/' + rel.replace(/\.html$/, '');
}

const brokenLinks: { source: string; target: string; file: string }[] = [];
const legacyHtmlLinks: { source: string; target: string; file: string }[] = [];

// For each HTML file, extract all <a href="...">
const scannedPages = new Set<string>();

for (const f of htmlFiles) {
  const sourceCanonical = getCanonicalForHtmlFile(f);
  if (!sourceCanonical) continue;
  scannedPages.add(sourceCanonical);

  const content = fs.readFileSync(f, 'utf8');
  const hrefMatches = [...content.matchAll(/<a\s+[^>]*?href=["']([^"']*)["'][^>]*?>/gi)];

  for (const m of hrefMatches) {
    let rawHref = m[1].trim();
    if (
      !rawHref ||
      rawHref.startsWith('#') ||
      rawHref.startsWith('mailto:') ||
      rawHref.startsWith('tel:') ||
      rawHref.startsWith('javascript:')
    ) {
      continue;
    }

    // Check if external
    if (rawHref.startsWith('http://') || rawHref.startsWith('https://')) {
      if (!rawHref.startsWith(DOMAIN)) {
        continue; // external link
      }
      rawHref = rawHref.slice(DOMAIN.length);
    }

    // Remove hash and query
    let cleanHref = rawHref.split('#')[0].split('?')[0];
    if (!cleanHref) cleanHref = '/';

    // Normalize trailing slash (except root)
    if (cleanHref.length > 1 && cleanHref.endsWith('/')) {
      cleanHref = cleanHref.slice(0, -1);
    }

    // Check for legacy .html
    if (cleanHref.endsWith('.html')) {
      legacyHtmlLinks.push({ source: sourceCanonical, target: cleanHref, file: f });
      cleanHref = cleanHref.slice(0, -5);
    }

    if (!cleanHref.startsWith('/')) {
      cleanHref = '/' + cleanHref;
    }

    // Check if canonical URL exists
    if (!canonicalUrls.has(cleanHref)) {
      brokenLinks.push({ source: sourceCanonical, target: cleanHref, file: f });
    } else {
      if (!graph.has(sourceCanonical)) {
        graph.set(sourceCanonical, new Set<string>());
      }
      graph.get(sourceCanonical)!.add(cleanHref);
    }
  }
}

console.log('\n--- GRAPH ANALYSIS RESULTS ---');
console.log('Total Canonical Pages in Graph:', canonicalUrls.size);
console.log('Total Scanned Canonical Pages from HTML:', scannedPages.size);

// Calculate In-Degree (Incoming links) for each canonical page
const inDegree = new Map<string, number>();
for (const url of canonicalUrls) {
  inDegree.set(url, 0);
}

for (const [source, targets] of graph.entries()) {
  for (const target of targets) {
    if (target !== source) {
      // Ignore self-links in in-degree
      inDegree.set(target, (inDegree.get(target) || 0) + 1);
    }
  }
}

// Find Orphan Pages (0 incoming internal links)
const orphans: string[] = [];
for (const [url, count] of inDegree.entries()) {
  if (count === 0 && url !== '/') {
    // Homepage is the root, doesn't need incoming links to not be an orphan
    orphans.push(url);
  }
}

console.log(`\nOrphan Pages (0 incoming links): ${orphans.length}`);
if (orphans.length > 0) {
  console.log('Orphans list:', orphans);
}

// Calculate Click Depth via BFS from Homepage '/'
const clickDepth = new Map<string, number>();
for (const url of canonicalUrls) {
  clickDepth.set(url, Infinity);
}
clickDepth.set('/', 0);

const queue: string[] = ['/'];
while (queue.length > 0) {
  const current = queue.shift()!;
  const currentDepth = clickDepth.get(current)!;
  const neighbors = graph.get(current) || new Set<string>();

  for (const neighbor of neighbors) {
    if (clickDepth.get(neighbor)! > currentDepth + 1) {
      clickDepth.set(neighbor, currentDepth + 1);
      queue.push(neighbor);
    }
  }
}

const depthDistribution = {
  depth0: 0,
  depth1: 0,
  depth2: 0,
  depth3: 0,
  depth4Plus: 0,
  unreachable: 0
};

const unreachableList: string[] = [];
for (const [url, depth] of clickDepth.entries()) {
  if (depth === 0) depthDistribution.depth0++;
  else if (depth === 1) depthDistribution.depth1++;
  else if (depth === 2) depthDistribution.depth2++;
  else if (depth === 3) depthDistribution.depth3++;
  else if (depth < Infinity) depthDistribution.depth4Plus++;
  else {
    depthDistribution.unreachable++;
    unreachableList.push(url);
  }
}

console.log('\n--- CLICK DEPTH DISTRIBUTION FROM HOMEPAGE ---');
console.log('Depth 0 (Home):', depthDistribution.depth0);
console.log('Depth 1 (1 click):', depthDistribution.depth1);
console.log('Depth 2 (2 clicks):', depthDistribution.depth2);
console.log('Depth 3 (3 clicks):', depthDistribution.depth3);
console.log('Depth 4+ (4 or more clicks):', depthDistribution.depth4Plus);
console.log('Unreachable from Home:', depthDistribution.unreachable);

if (unreachableList.length > 0) {
  console.log('Unreachable list (sample):', unreachableList.slice(0, 20));
}

console.log('\n--- BROKEN & LEGACY LINKS ---');
console.log(`Broken Internal Links: ${brokenLinks.length}`);
if (brokenLinks.length > 0) {
  console.log('Sample broken links (first 10):', brokenLinks.slice(0, 10));
}

console.log(`Legacy .html Internal Links: ${legacyHtmlLinks.length}`);
if (legacyHtmlLinks.length > 0) {
  console.log('Sample legacy .html links (first 10):', legacyHtmlLinks.slice(0, 10));
}

// In-degree stats
let minInDegree = Infinity;
let maxInDegree = 0;
let totalInDegree = 0;
let lowInDegreePages: { url: string; count: number }[] = [];

for (const [url, count] of inDegree.entries()) {
  if (count < minInDegree) minInDegree = count;
  if (count > maxInDegree) maxInDegree = count;
  totalInDegree += count;
  if (count < 3 && url !== '/') {
    lowInDegreePages.push({ url, count });
  }
}

console.log('\n--- IN-DEGREE STATISTICS ---');
console.log(`Min In-Degree: ${minInDegree}`);
console.log(`Max In-Degree: ${maxInDegree}`);
console.log(`Average In-Degree: ${(totalInDegree / canonicalUrls.size).toFixed(1)}`);
console.log(`Pages with < 3 incoming links: ${lowInDegreePages.length}`);
if (lowInDegreePages.length > 0) {
  console.log('Low in-degree sample (up to 15):', lowInDegreePages.slice(0, 15));
}
