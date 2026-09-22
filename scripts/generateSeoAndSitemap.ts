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

const NETWORK_DEPENDENT_TOOL_IDS = new Set([
  'api-request-builder',
  'website-downloader',
  'http-header-viewer'
]);

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
    title: 'About Zubware — Free Online Multi-Tool Suite',
    description: 'Learn about Zubware and our mission to provide fast, private, browser-based web tools for PDF, images, video, developers, and productivity.'
  },
  {
    filename: 'privacy.html',
    title: 'Privacy Policy — Zubware',
    description: 'Read the Zubware Privacy Policy. Processing happens locally in your browser for offline tools; files are not uploaded to Zubware servers.'
  },
  {
    filename: 'terms.html',
    title: 'Terms of Service — Zubware',
    description: 'Read the Zubware Terms of Service governing the use of our free online utilities and web tools.'
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

function getToolHowToSteps(tool: ToolMeta): { name: string; text: string }[] {
  const isFileTool =
    tool.category.includes('PDF') ||
    tool.category.includes('Image') ||
    tool.category.includes('Video') ||
    tool.category.includes('Audio') ||
    (tool.features && tool.features.some(f => /upload|file|image|pdf|video|audio/i.test(f)));

  const isCalcOrConverter =
    tool.category.includes('Calculator') ||
    tool.category.includes('Converter') ||
    tool.category.includes('Financial') ||
    /calculator|converter/i.test(tool.title);

  if (isFileTool) {
    return [
      { name: 'Select or Upload Files', text: `Open ${tool.title} in your browser and select or drop your files into the workspace.` },
      { name: 'Configure Options', text: `Adjust options, parameters, or compression settings for ${tool.navTitle || tool.title}.` },
      { name: 'Process & Download', text: `Generate and download your processed result directly in your browser.` }
    ];
  } else if (isCalcOrConverter) {
    return [
      { name: 'Enter Your Values', text: `Input your starting numbers, values, or parameters into ${tool.title}.` },
      { name: 'Select Calculation Settings', text: `Choose desired units, options, or calculation modes.` },
      { name: 'View or Copy Results', text: `Get instant, calculated results computed directly in your browser.` }
    ];
  } else {
    return [
      { name: 'Input or Configure Data', text: `Enter your text, code, or parameters into ${tool.title}.` },
      { name: 'Process or Generate', text: `Execute the tool with your selected configuration options.` },
      { name: 'Copy or Save Output', text: `Copy the formatted output or download the resulting file.` }
    ];
  }
}

function getToolFaqs(tool: ToolMeta): { question: string; answer: string }[] {
  if (tool.faq && tool.faq.length > 0) {
    return tool.faq;
  }
  const isNetwork = NETWORK_DEPENDENT_TOOL_IDS.has(tool.id);
  return [
    {
      question: `Is ${tool.navTitle || tool.title} free to use?`,
      answer: `Yes, ${tool.title} is 100% free with unlimited usage, no watermark, and no registration required.`
    },
    {
      question: `How does ${tool.navTitle || tool.title} process data?`,
      answer: isNetwork
        ? `${tool.title} communicates directly with external endpoints from your browser. Data is not stored on Zubware servers.`
        : `Processing happens locally in your browser for this tool; files and inputs are not uploaded to Zubware servers.`
    },
    {
      question: `Which devices and browsers are supported?`,
      answer: `${tool.title} runs in any modern browser including Chrome, Firefox, Safari, and Edge on desktop and mobile devices.`
    }
  ];
}

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
  const cleanCategory = tool.category.replace(/^[^\w]+/, '').trim();
  const faqs = getToolFaqs(tool);
  const steps = getToolHowToSteps(tool);

  const schemas: any[] = [
    {
      '@type': 'WebSite',
      'name': 'Zubware',
      'url': DOMAIN
    },
    {
      '@type': 'Organization',
      'name': 'Zubware',
      'url': DOMAIN,
      'logo': `${DOMAIN}/icon.png`,
      'description': 'Zubware is a multi-tool suite offering 300+ free online browser-based tools for PDF, images, developers, and productivity.'
    },
    {
      '@type': 'WebApplication',
      'name': tool.title,
      'url': canonicalUrl,
      'operatingSystem': 'All',
      'applicationCategory': appCategory,
      'browserRequirements': 'Requires modern web browser with JavaScript support',
      'offers': {
        '@type': 'Offer',
        'price': '0',
        'priceCurrency': 'USD'
      },
      'featureList': tool.features?.join(', ') || 'Browser-Based Processing, Free',
      'description': tool.description
    },
    {
      '@type': 'BreadcrumbList',
      'itemListElement': [
        {
          '@type': 'ListItem',
          'position': 1,
          'name': 'Home',
          'item': DOMAIN
        },
        {
          '@type': 'ListItem',
          'position': 2,
          'name': cleanCategory,
          'item': `${DOMAIN}/categories.html`
        },
        {
          '@type': 'ListItem',
          'position': 3,
          'name': tool.navTitle || tool.title,
          'item': canonicalUrl
        }
      ]
    }
  ];

  if (faqs.length > 0) {
    schemas.push({
      '@type': 'FAQPage',
      'mainEntity': faqs.map(f => ({
        '@type': 'Question',
        'name': f.question,
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': f.answer
        }
      }))
    });
  }

  if (steps.length > 0) {
    schemas.push({
      '@type': 'HowTo',
      'name': `How to Use ${tool.navTitle || tool.title}`,
      'description': tool.description,
      'step': steps.map((s, idx) => ({
        '@type': 'HowToStep',
        'position': idx + 1,
        'name': s.name,
        'text': s.text
      }))
    });
  }

  return {
    '@context': 'https://schema.org',
    '@graph': schemas
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
        'logo': `${DOMAIN}/icon.png`,
        'description': 'Zubware is a multi-tool suite offering 300+ free online browser-based tools for PDF, images, developers, and productivity.'
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

function renderStaticToolContent(tool: ToolMeta, allTools: ToolMeta[]): string {
  const cleanCategory = tool.category.replace(/^[^\w]+/, '').trim();
  const isNetwork = NETWORK_DEPENDENT_TOOL_IDS.has(tool.id);
  const steps = getToolHowToSteps(tool);
  const faqs = getToolFaqs(tool);

  const relatedTools = allTools
    .filter(t => t.id !== tool.id && t.category === tool.category)
    .slice(0, 6);

  return `
    <main class="static-tool-seo" style="max-width: 56rem; margin-left: auto; margin-right: auto; padding: 2rem 1rem; color: #1e293b; font-family: ui-sans-serif, system-ui, sans-serif;">
      <header style="margin-bottom: 2rem;">
        <nav aria-label="Breadcrumb" style="font-size: 0.75rem; color: #64748b; margin-bottom: 0.75rem;">
          <a href="${DOMAIN}/" style="color: inherit; text-decoration: underline;">Home</a> &gt;
          <a href="${DOMAIN}/categories.html" style="color: inherit; text-decoration: underline;">${escapeHtml(cleanCategory)}</a> &gt;
          <span aria-current="page" style="font-weight: 600;">${escapeHtml(tool.navTitle || tool.title)}</span>
        </nav>
        <h1 style="font-size: 2rem; font-weight: 800; color: #0f172a; margin-top: 0.25rem; margin-bottom: 0.5rem; line-height: 1.2;">
          ${escapeHtml(tool.title)}
        </h1>
        <p style="font-size: 0.95rem; color: #475569; line-height: 1.6; margin-top: 0.5rem;">
          ${escapeHtml(tool.description)}
        </p>
      </header>

      <section style="margin-bottom: 2rem; padding: 1.5rem; background-color: #f8fafc; border-radius: 1rem; border: 1px solid #e2e8f0;">
        <h2 style="font-size: 1.25rem; font-weight: 700; color: #0f172a; margin-bottom: 0.75rem;">
          Overview & Capabilities
        </h2>
        <p style="font-size: 0.875rem; color: #334155; line-height: 1.6; margin-bottom: 1rem;">
          <strong>${escapeHtml(tool.title)}</strong> is a free, web-based online utility provided by Zubware. ${escapeHtml(tool.description)}
        </p>
        ${tool.features && tool.features.length > 0 ? `
        <h3 style="font-size: 0.8rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #475569; margin-bottom: 0.5rem;">
          Key Features
        </h3>
        <ul style="margin: 0 0 1rem 1.25rem; padding: 0; font-size: 0.875rem; color: #334155; line-height: 1.6;">
          ${tool.features.map(f => `<li style="margin-bottom: 0.25rem;">${escapeHtml(f)}</li>`).join('\n          ')}
        </ul>` : ''}
        <h3 style="font-size: 0.8rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #475569; margin-bottom: 0.25rem;">
          Execution & Privacy
        </h3>
        <p style="font-size: 0.875rem; color: #334155; line-height: 1.6; margin: 0;">
          ${isNetwork
            ? `This tool connects directly from your browser to the designated external endpoint. Zubware does not store your payload or request data on our servers.`
            : `Processing happens locally in your browser for this tool; files and inputs are not uploaded to Zubware servers.`}
        </p>
      </section>

      <section style="margin-bottom: 2rem;">
        <h2 style="font-size: 1.25rem; font-weight: 700; color: #0f172a; margin-bottom: 1rem;">
          How to Use ${escapeHtml(tool.navTitle || tool.title)}
        </h2>
        <ol style="margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 0.75rem;">
          ${steps.map((s, idx) => `
          <li style="padding: 1rem 1.25rem; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 0.75rem;">
            <h3 style="font-size: 0.95rem; font-weight: 700; color: #0f172a; margin: 0 0 0.25rem 0;">
              ${idx + 1}. ${escapeHtml(s.name)}
            </h3>
            <p style="font-size: 0.85rem; color: #475569; margin: 0; line-height: 1.5;">
              ${escapeHtml(s.text)}
            </p>
          </li>`).join('\n          ')}
        </ol>
      </section>

      ${faqs.length > 0 ? `
      <section style="margin-bottom: 2rem;">
        <h2 style="font-size: 1.25rem; font-weight: 700; color: #0f172a; margin-bottom: 1rem;">
          Frequently Asked Questions
        </h2>
        <div style="display: flex; flex-direction: column; gap: 0.75rem;">
          ${faqs.map(f => `
          <div style="padding: 1rem 1.25rem; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 0.75rem;">
            <h3 style="font-size: 0.95rem; font-weight: 700; color: #0f172a; margin: 0 0 0.25rem 0;">
              ${escapeHtml(f.question)}
            </h3>
            <p style="font-size: 0.85rem; color: #475569; margin: 0; line-height: 1.5;">
              ${escapeHtml(f.answer)}
            </p>
          </div>`).join('\n          ')}
        </div>
      </section>` : ''}

      ${relatedTools.length > 0 ? `
      <section style="margin-bottom: 2rem;">
        <h2 style="font-size: 1.25rem; font-weight: 700; color: #0f172a; margin-bottom: 1rem;">
          Related Tools
        </h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 0.75rem;">
          ${relatedTools.map(rel => `
          <a href="${DOMAIN}/${escapeHtml(rel.filename)}" style="display: block; padding: 0.875rem 1rem; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 0.75rem; text-decoration: none; color: inherit;">
            <div style="font-size: 0.9rem; font-weight: 700; color: #4f46e5; margin-bottom: 0.25rem;">
              ${escapeHtml(rel.title)}
            </div>
            <div style="font-size: 0.75rem; color: #64748b; line-height: 1.4; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;">
              ${escapeHtml(rel.description)}
            </div>
          </a>`).join('\n          ')}
        </div>
      </section>` : ''}
    </main>`;
}

function renderStaticPageContent(page: StaticPageMeta): string {
  return `
    <main style="max-width: 56rem; margin-left: auto; margin-right: auto; padding: 2.5rem 1rem; color: #1e293b; font-family: ui-sans-serif, system-ui, sans-serif;">
      <h1 style="font-size: 2.25rem; font-weight: 800; color: #0f172a; margin-bottom: 1rem; line-height: 1.2;">
        ${escapeHtml(page.title)}
      </h1>
      <p style="font-size: 1rem; color: #475569; line-height: 1.7; margin-bottom: 2rem;">
        ${escapeHtml(page.description)}
      </p>
      <div style="font-size: 0.875rem; color: #64748b;">
        <a href="${DOMAIN}/" style="color: #4f46e5; text-decoration: underline;">Return to Zubware Home</a>
      </div>
    </main>`;
}

function injectMetadataIntoHtml(
  templateHtml: string,
  options: {
    title: string;
    description: string;
    canonicalUrl: string;
    keywords?: string;
    jsonLdSchema: object;
    bodyContent?: string;
  }
): string {
  const { title, description, canonicalUrl, keywords, jsonLdSchema, bodyContent } = options;
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
  html = html.replace(
    /<meta\s+property="og:image"\s+content="[\s\S]*?"\s*\/?>/i,
    `<meta property="og:image" content="${DOMAIN}/icon.png" />`
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
  html = html.replace(
    /<meta\s+name="twitter:image"\s+content="[\s\S]*?"\s*\/?>/i,
    `<meta name="twitter:image" content="${DOMAIN}/icon.png" />`
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

  // 7. Inject lightweight semantic static content into body
  if (bodyContent) {
    html = html.replace(
      '<div id="root"></div>',
      `<div id="root">\n${bodyContent}\n    </div>`
    );
  }

  return html;
}

export function generateLlmsTxt(tools: ToolMeta[]): string {
  const categoryOrder = [
    '🖼️ Image Tools',
    '📄 PDF Tools',
    '⚡ Developer Tools',
    '🧮 Calculators',
    '🎥 Video Tools',
    '🎵 Audio Tools',
    '📝 Text Tools'
  ];

  const uniqueCategories = Array.from(new Set(tools.map(t => t.category)));
  const sortedCategories = [
    ...categoryOrder.filter(c => uniqueCategories.includes(c)),
    ...uniqueCategories.filter(c => !categoryOrder.includes(c))
  ];

  let output = `# Zubware — Online Multi-Tool Suite
> Zubware (https://zubware.com) is an online multi-tool suite offering 300+ free utilities for PDF documents, image processing, developer workflows, video and audio media, calculators, and daily productivity.

- Canonical Homepage: https://zubware.com
- Total Active Tools: ${tools.length}
- Access Model: Free to use, no mandatory account sign-up, no hidden subscriptions.
- Technical Architecture: Fast, browser-based execution for offline tools; direct browser requests for network testing tools.

## Execution & Privacy Guidelines
- Offline & Local Processing: Document manipulation, image editing, PDF splitting/merging, and data calculations are processed in the user's browser. Files are not uploaded to Zubware remote servers.
- Network Utilities: For API testing, HTTP inspection, and web scrapers, browser requests are dispatched directly to the user-specified destination without storing request payloads on Zubware servers.

## Comprehensive Directory of Tools by Category
`;

  for (const cat of sortedCategories) {
    const cleanCategory = cat.replace(/^[^\w]+/, '').trim();
    const catTools = tools.filter(t => t.category === cat);
    output += `\n### ${cleanCategory} (${catTools.length} tools)\n\n`;

    for (const tool of catTools) {
      const toolUrl = `${DOMAIN}/${tool.filename}`;
      const featureList = tool.features && tool.features.length > 0 ? ` | Key features: ${tool.features.join(', ')}` : '';
      const executionNote = NETWORK_DEPENDENT_TOOL_IDS.has(tool.id) ? ' [Direct API]' : ' [Browser-Side]';
      output += `- [${tool.title}](${toolUrl})${executionNote}: ${tool.description}${featureList}\n`;
    }
  }

  return output;
}

export function generateSeoHtmlAndSitemap(): { toolsCount: number; sitemapUrlsCount: number } {
  console.log('[Zubware SEO] Starting static HTML SEO injection, llms.txt generation, and dynamic sitemap generation...');

  if (!fs.existsSync(distDir)) {
    throw new Error(`Dist directory not found at ${distDir}. Run vite build first.`);
  }

  const indexPath = path.join(distDir, 'index.html');
  if (!fs.existsSync(indexPath)) {
    throw new Error(`dist/index.html template not found at ${indexPath}`);
  }

  const baseHtml = fs.readFileSync(indexPath, 'utf-8');

  // Track all unique URLs for sitemap (Total must be 313)
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
    const bodyContent = renderStaticPageContent(page);
    const html = injectMetadataIntoHtml(baseHtml, {
      title: page.title,
      description: page.description,
      canonicalUrl,
      jsonLdSchema: jsonLd,
      bodyContent
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
    const bodyContent = renderStaticToolContent(tool, TOOLS_DATA);

    const html = injectMetadataIntoHtml(baseHtml, {
      title,
      description: tool.description,
      canonicalUrl,
      keywords,
      jsonLdSchema: jsonLd,
      bodyContent
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

  // Write sitemap.xml to dist/ and public/
  fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemapXml, 'utf-8');
  if (fs.existsSync(publicDir)) {
    fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemapXml, 'utf-8');
  }

  // 4. Generate comprehensive llms.txt for machine readability
  const llmsTxtContent = generateLlmsTxt(TOOLS_DATA);
  fs.writeFileSync(path.join(distDir, 'llms.txt'), llmsTxtContent, 'utf-8');
  if (fs.existsSync(publicDir)) {
    fs.writeFileSync(path.join(publicDir, 'llms.txt'), llmsTxtContent, 'utf-8');
  }

  console.log(`[Zubware SEO] Successfully generated ${toolCount} tool HTML pages with semantic body content.`);
  console.log(`[Zubware SEO] Successfully generated ${STATIC_PAGES.length} static legal/info HTML pages.`);
  console.log(`[Zubware SEO] Generated sitemap.xml with ${sitemapUrls.length} total URLs.`);
  console.log(`[Zubware SEO] Generated comprehensive llms.txt with all ${TOOLS_DATA.length} tools.`);

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

