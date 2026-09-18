import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { TOOLS_DATA } from '../src/data/toolsData';
import { getToolSeoTitle } from '../src/lib/seoTitles';
import { ToolMeta } from '../src/types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist');
const publicDir = path.resolve(rootDir, 'public');

const DOMAIN = 'https://zubware.com';

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

interface StaticPageMeta {
  filename: string;
  title: string;
  description: string;
}

const STATIC_PAGES: StaticPageMeta[] = [
  {
    filename: 'about.html',
    title: 'About Zubware — Free Online Multi-Tool Suite | Zubware',
    description: 'Learn about Zubware, our mission to provide fast, private, 100% client-side web tools for PDF, images, video, developers, and productivity.'
  },
  {
    filename: 'privacy.html',
    title: 'Privacy Policy — Zubware',
    description: 'Read the Zubware Privacy Policy. We respect your privacy — all document, image, and data processing happens locally in your browser with zero server uploads.'
  },
  {
    filename: 'terms.html',
    title: 'Terms of Service — Zubware',
    description: 'Read the Zubware Terms of Service governing the use of our free online utilities and client-side web tools.'
  },
  {
    filename: 'disclaimer.html',
    title: 'Disclaimer — Zubware',
    description: 'Legal disclaimer and limitations of liability for the free online web applications and tools provided by Zubware.'
  },
  {
    filename: 'contact.html',
    title: 'Contact Us — Zubware',
    description: 'Get in touch with the Zubware team for feedback, questions, partnership inquiries, and tool requests.'
  }
];

function buildToolJsonLd(tool: ToolMeta, canonicalUrl: string): object {
  const categoryMap: Record<string, string> = {
    '🖼️ Image Tools': 'MultimediaApplication',
    '📄 PDF Tools': 'PDFApplication',
    '⚡ Developer Tools': 'DeveloperApplication',
    '🧮 Calculators': 'BusinessApplication',
    '🎥 Video Tools': 'MultimediaApplication',
    '🎵 Audio Tools': 'MultimediaApplication',
    '📝 Text Tools': 'UtilitiesApplication'
  };

  const appCategory = categoryMap[tool.category] || 'UtilitiesApplication';

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        'name': 'Zubware',
        'url': DOMAIN
      },
      {
        '@type': 'Organization',
        'name': 'Zubware',
        'url': DOMAIN,
        'logo': `${DOMAIN}/icon.svg`,
        'description': 'Zubware is a modern multi-tool suite offering 300+ free online tools for PDF, images, developers, and productivity.'
      },
      {
        '@type': 'WebApplication',
        'name': tool.title,
        'url': canonicalUrl,
        'operatingSystem': 'All',
        'applicationCategory': appCategory,
        'browserRequirements': 'Requires HTML5 and JavaScript support',
        'offers': {
          '@type': 'Offer',
          'price': '0',
          'priceCurrency': 'USD'
        },
        'featureList': tool.features?.join(', ') || '100% Client-Side, Zero Server Uploads, Free',
        'description': tool.description
      }
    ]
  };
}

function buildStaticPageJsonLd(page: StaticPageMeta, canonicalUrl: string): object {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        'name': 'Zubware',
        'url': DOMAIN
      },
      {
        '@type': 'Organization',
        'name': 'Zubware',
        'url': DOMAIN,
        'logo': `${DOMAIN}/icon.svg`
      },
      {
        '@type': 'WebPage',
        'name': page.title,
        'url': canonicalUrl,
        'description': page.description
      }
    ]
  };
}

function injectMetadataIntoHtml(
  templateHtml: string,
  options: {
    title: string;
    description: string;
    canonicalUrl: string;
    keywords?: string;
    jsonLdSchema: object;
  }
): string {
  const { title, description, canonicalUrl, keywords, jsonLdSchema } = options;
  const escapedTitle = escapeHtml(title);
  const escapedDesc = escapeHtml(description);
  const escapedUrl = escapeHtml(canonicalUrl);

  let html = templateHtml;

  // 1. Replace <title>
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapedTitle}</title>`);

  // 2. Replace meta description
  html = html.replace(
    /<meta\s+name="description"\s+content="[\s\S]*?"\s*\/?>/i,
    `<meta name="description" content="${escapedDesc}" />`
  );

  // 3. Replace canonical
  html = html.replace(
    /<link\s+rel="canonical"\s+href="[\s\S]*?"\s*\/?>/i,
    `<link rel="canonical" href="${escapedUrl}" />`
  );

  // 4. Replace OpenGraph
  html = html.replace(
    /<meta\s+property="og:url"\s+content="[\s\S]*?"\s*\/?>/i,
    `<meta property="og:url" content="${escapedUrl}" />`
  );
  html = html.replace(
    /<meta\s+property="og:title"\s+content="[\s\S]*?"\s*\/?>/i,
    `<meta property="og:title" content="${escapedTitle}" />`
  );
  html = html.replace(
    /<meta\s+property="og:description"\s+content="[\s\S]*?"\s*\/?>/i,
    `<meta property="og:description" content="${escapedDesc}" />`
  );

  // 5. Replace Twitter
  html = html.replace(
    /<meta\s+name="twitter:title"\s+content="[\s\S]*?"\s*\/?>/i,
    `<meta name="twitter:title" content="${escapedTitle}" />`
  );
  html = html.replace(
    /<meta\s+name="twitter:description"\s+content="[\s\S]*?"\s*\/?>/i,
    `<meta name="twitter:description" content="${escapedDesc}" />`
  );

  // 6. Inject robots, keywords (if present), and JSON-LD schema right after canonical tag
  const keywordsTag = keywords ? `\n    <meta name="keywords" content="${escapeHtml(keywords)}" />` : '';
  const robotsTag = `\n    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />`;
  const schemaTag = `\n    <script id="json-ld-schema" type="application/ld+json">${JSON.stringify(jsonLdSchema)}</script>`;

  const injection = `${keywordsTag}${robotsTag}${schemaTag}`;
  html = html.replace(
    /(<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>)/i,
    `$1${injection}`
  );

  return html;
}

export function generateSeoHtmlAndSitemap(): { toolsCount: number; sitemapUrlsCount: number } {
  console.log('[Zubware SEO] Starting static HTML SEO injection and dynamic sitemap generation...');

  if (!fs.existsSync(distDir)) {
    throw new Error(`Dist directory not found at ${distDir}. Run vite build first.`);
  }

  const indexPath = path.join(distDir, 'index.html');
  if (!fs.existsSync(indexPath)) {
    throw new Error(`dist/index.html template not found at ${indexPath}`);
  }

  const baseHtml = fs.readFileSync(indexPath, 'utf-8');

  // Track all unique URLs for sitemap
  const sitemapUrls: Array<{ loc: string; priority: string; changefreq: string }> = [];

  // Add homepage
  sitemapUrls.push({
    loc: `${DOMAIN}/`,
    priority: '1.0',
    changefreq: 'daily'
  });

  // 1. Generate Static Pages (About, Privacy, Terms, Disclaimer, Contact)
  for (const page of STATIC_PAGES) {
    const canonicalUrl = `${DOMAIN}/${page.filename}`;
    const jsonLd = buildStaticPageJsonLd(page, canonicalUrl);
    const html = injectMetadataIntoHtml(baseHtml, {
      title: page.title,
      description: page.description,
      canonicalUrl,
      jsonLdSchema: jsonLd
    });

    fs.writeFileSync(path.join(distDir, page.filename), html, 'utf-8');

    sitemapUrls.push({
      loc: canonicalUrl,
      priority: '0.5',
      changefreq: 'monthly'
    });
  }

  // 2. Generate Tool Pages for all 307 active tools in TOOLS_DATA
  const seenFilenames = new Set<string>();
  let toolCount = 0;

  for (const tool of TOOLS_DATA) {
    if (!tool.filename || tool.filename === 'index.html') continue;
    if (seenFilenames.has(tool.filename)) continue;
    seenFilenames.add(tool.filename);

    const title = getToolSeoTitle(tool);
    const canonicalUrl = `${DOMAIN}/${tool.filename}`;
    const keywords = tool.tags && tool.tags.length > 0 ? tool.tags.join(', ') : undefined;
    const jsonLd = buildToolJsonLd(tool, canonicalUrl);

    const html = injectMetadataIntoHtml(baseHtml, {
      title,
      description: tool.description,
      canonicalUrl,
      keywords,
      jsonLdSchema: jsonLd
    });

    fs.writeFileSync(path.join(distDir, tool.filename), html, 'utf-8');
    toolCount++;

    sitemapUrls.push({
      loc: canonicalUrl,
      priority: '0.8',
      changefreq: 'weekly'
    });
  }

  // 3. Generate dynamic sitemap.xml
  const today = new Date().toISOString().split('T')[0];
  const sitemapEntries = sitemapUrls
    .map(
      (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
    )
    .join('\n');

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries}
</urlset>
`;

  // Write sitemap.xml to dist/ (for immediate deploy output) and public/ (for repo persistence)
  fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemapXml, 'utf-8');
  if (fs.existsSync(publicDir)) {
    fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemapXml, 'utf-8');
  }

  console.log(`[Zubware SEO] Successfully generated ${toolCount} tool HTML pages.`);
  console.log(`[Zubware SEO] Successfully generated ${STATIC_PAGES.length} static legal/info HTML pages.`);
  console.log(`[Zubware SEO] Generated sitemap.xml with ${sitemapUrls.length} total URLs.`);

  return {
    toolsCount: toolCount,
    sitemapUrlsCount: sitemapUrls.length
  };
}

// Execute directly when run as CLI script
if (process.argv[1] && process.argv[1].endsWith('generateSeoAndSitemap.ts')) {
  try {
    generateSeoHtmlAndSitemap();
  } catch (err) {
    console.error('[Zubware SEO] Error:', err);
    process.exit(1);
  }
}
