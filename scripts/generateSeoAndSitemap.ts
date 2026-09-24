import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { TOOLS_DATA, HOMEPAGE_FAQS } from '../src/data/toolsData';
import { BLOG_ARTICLES } from '../src/data/blogArticles';
import { CATEGORIES_DATA, getCategoryForTool } from '../src/data/categoriesData';
import { CATEGORY_AUTHORITY_MAP } from '../src/data/categoryAuthorityData';
import { getToolSeoTitle } from '../src/lib/seoTitles';
import { getRelatedTools, getMatchingGuidesForTool } from '../src/lib/workflowMap';
import { ToolMeta, BlogArticle } from '../src/types';
import { CategoryItem } from '../src/data/categoriesData';

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
  },
  {
    filename: 'help.html',
    title: 'Help Center & Documentation — Zubware',
    description: 'Find answers, usage tutorials, troubleshooting steps, and documentation for the Zubware multi-tool ecosystem.'
  },
  {
    filename: 'changelog.html',
    title: 'Changelog & Releases — Zubware',
    description: 'Browse the latest release notes, feature updates, performance improvements, and new tools on Zubware.'
  },
  {
    filename: 'feedback.html',
    title: 'Feedback & Tool Suggestions — Zubware',
    description: 'Submit your feedback, bug reports, and new utility ideas to help shape the future of Zubware.'
  },
  {
    filename: 'dashboard.html',
    title: 'User Dashboard — Zubware',
    description: 'Access your favorite tools, view recent activity, and monitor productivity metrics in your personal Zubware dashboard.'
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
      answer: `This Zubware tool is available to use in your browser. Availability of features and limits can vary by tool.`
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
  const toolCat = getCategoryForTool(tool.category);
  const catItemUrl = toolCat && toolCat.slug !== 'all' ? `${DOMAIN}/category/${toolCat.slug}.html` : `${DOMAIN}/categories.html`;
  const catItemName = toolCat && toolCat.slug !== 'all' ? toolCat.defaultName : cleanCategory;
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
      'description': 'Zubware is a multi-tool suite offering free online browser-based tools for PDF, images, developers, and productivity.'
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
          'name': catItemName,
          'item': catItemUrl
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
  const shortTitle = page.title.split('—')[0].trim();
  let pageType = 'WebPage';
  if (page.filename === 'about.html') pageType = 'AboutPage';
  else if (page.filename === 'contact.html') pageType = 'ContactPage';

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
        '@type': pageType,
        'name': page.title,
        'description': page.description,
        'url': canonicalUrl
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
            'name': shortTitle,
            'item': canonicalUrl
          }
        ]
      }
    ]
  };
}

function renderStaticToolContent(tool: ToolMeta, allTools: ToolMeta[]): string {
  const cleanCategory = tool.category.replace(/^[^\w]+/, '').trim();
  const toolCat = getCategoryForTool(tool.category);
  const catItemUrl = toolCat && toolCat.slug !== 'all' ? `${DOMAIN}/category/${toolCat.slug}.html` : `${DOMAIN}/categories.html`;
  const catItemName = toolCat && toolCat.slug !== 'all' ? toolCat.defaultName : cleanCategory;
  const isNetwork = NETWORK_DEPENDENT_TOOL_IDS.has(tool.id);
  const steps = getToolHowToSteps(tool);
  const faqs = getToolFaqs(tool);

  // Workflow aware related tools
  const relatedTools = getRelatedTools(tool, allTools, 6);

  // Matching guides
  const matchingGuides = getMatchingGuidesForTool(tool, BLOG_ARTICLES, 2);

  return `
    <main class="static-tool-seo" style="max-width: 56rem; margin-left: auto; margin-right: auto; padding: 2rem 1rem; color: #1e293b; font-family: ui-sans-serif, system-ui, sans-serif;">
      <header style="margin-bottom: 2rem;">
        <nav aria-label="Breadcrumb" style="font-size: 0.75rem; color: #64748b; margin-bottom: 0.75rem;">
          <a href="${DOMAIN}/" style="color: inherit; text-decoration: underline;">Home</a> &gt;
          <a href="${catItemUrl}" style="color: inherit; text-decoration: underline;">${escapeHtml(catItemName)}</a> &gt;
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
          Overview &amp; Capabilities
        </h2>
        <p style="font-size: 0.875rem; color: #334155; line-height: 1.6; margin-bottom: 1rem;">
          <strong>${escapeHtml(tool.title)}</strong> is an online utility provided by Zubware. ${escapeHtml(tool.description)}
        </p>
        ${tool.features && tool.features.length > 0 ? `
        <h3 style="font-size: 0.8rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #475569; margin-bottom: 0.5rem;">
          Key Features
        </h3>
        <ul style="margin: 0 0 1rem 1.25rem; padding: 0; font-size: 0.875rem; color: #334155; line-height: 1.6;">
          ${tool.features.map(f => `<li style="margin-bottom: 0.25rem;">${escapeHtml(f)}</li>`).join('\n          ')}
        </ul>` : ''}
        <h3 style="font-size: 0.8rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #475569; margin-bottom: 0.25rem;">
          Execution &amp; Privacy
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
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
          <h2 style="font-size: 1.25rem; font-weight: 700; color: #0f172a; margin: 0;">
            Related Free Tools
          </h2>
          <a href="${DOMAIN}/categories.html" style="font-size: 0.85rem; color: #4f46e5; font-weight: 600; text-decoration: underline;">
            Explore All Categories &rarr;
          </a>
        </div>
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

      ${matchingGuides.length > 0 ? `
      <section style="margin-top: 2rem; padding: 1.5rem; background-color: #eef2ff; border-radius: 1rem; border: 1px solid #c7d2fe;">
        <h2 style="font-size: 1.15rem; font-weight: 800; color: #312e81; margin-top: 0; margin-bottom: 0.5rem;">
          Helpful Guides &amp; Tutorials
        </h2>
        <p style="font-size: 0.85rem; color: #4338ca; margin-bottom: 1rem;">
          Deepen your understanding with our in-depth technical guides:
        </p>
        <div style="display: flex; flex-direction: column; gap: 0.75rem;">
          ${matchingGuides.map(guide => `
          <a href="${DOMAIN}${guide.canonicalPath}" style="display: block; padding: 1rem; background: #ffffff; border-radius: 0.75rem; text-decoration: none; border: 1px solid #e0e7ff;">
            <div style="font-size: 0.75rem; font-weight: 700; color: #4f46e5; text-transform: uppercase;">${escapeHtml(guide.category)}</div>
            <div style="font-size: 0.95rem; font-weight: 700; color: #0f172a; margin: 0.25rem 0;">${escapeHtml(guide.title)}</div>
            <div style="font-size: 0.8rem; color: #64748b;">${escapeHtml(guide.excerpt)}</div>
          </a>`).join('\n          ')}
        </div>
      </section>` : ''}
    </main>`;
}

function renderStaticPageContent(page: StaticPageMeta): string {
  const shortTitle = page.title.split('—')[0].trim();
  let specificBody = '';

  switch (page.filename) {
    case 'about.html':
      specificBody = `
        <section style="margin-bottom: 2rem;">
          <h2 style="font-size: 1.4rem; font-weight: 800; color: #0f172a; margin-bottom: 0.75rem;">Our Mission: Speed, Privacy &amp; Zero Barriers</h2>
          <p style="font-size: 0.95rem; color: #334155; line-height: 1.7; margin-bottom: 1rem;">
            Zubware is an open, privacy-focused multi-tool suite offering over ${TOOLS_DATA.length} free web utilities designed to solve daily technical, design, audio-visual, and documentation challenges. We believe essential computational tools should be instantly accessible to everyone on earth without paywalls, sign-up forms, or invasive tracking.
          </p>
          <h2 style="font-size: 1.4rem; font-weight: 800; color: #0f172a; margin-bottom: 0.75rem;">100% Client-Side Privacy Architecture</h2>
          <p style="font-size: 0.95rem; color: #334155; line-height: 1.7; margin-bottom: 1rem;">
            Unlike legacy online converters that transmit your private files, PDFs, and media assets to distant cloud servers, Zubware executes operations locally inside your web browser. Utilizing high-performance WebAssembly (WASM), HTML5 Canvas, and the native Web Cryptography API, your data never leaves your computer or phone.
          </p>
          <h2 style="font-size: 1.4rem; font-weight: 800; color: #0f172a; margin-bottom: 0.75rem;">Comprehensive Multi-Tool Ecosystem</h2>
          <p style="font-size: 0.95rem; color: #334155; line-height: 1.7; margin-bottom: 1.5rem;">
            Our tool suite spans 13 specialized domains, including PDF manipulation, media encoding, developer decoding, career resume formatting, and financial calculators.
          </p>
          <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
            <a href="${DOMAIN}/categories.html" style="padding: 0.75rem 1.5rem; background: #4f46e5; color: #ffffff; font-weight: 700; text-decoration: none; border-radius: 0.75rem;">Browse All Categories &rarr;</a>
            <a href="${DOMAIN}/blog" style="padding: 0.75rem 1.5rem; background: #ffffff; color: #4f46e5; font-weight: 700; text-decoration: none; border-radius: 0.75rem; border: 1px solid #c7d2fe;">Technical Guides &rarr;</a>
          </div>
        </section>`;
      break;

    case 'privacy.html':
      specificBody = `
        <section style="margin-bottom: 2rem;">
          <h2 style="font-size: 1.4rem; font-weight: 800; color: #0f172a; margin-bottom: 0.75rem;">1. Zero Remote Storage Principle</h2>
          <p style="font-size: 0.95rem; color: #334155; line-height: 1.7; margin-bottom: 1rem;">
            At Zubware, your privacy is protected by mathematics and local browser architecture, not mere marketing promises. When you compress an image, split a PDF, format a JSON string, or hash credentials, the entire computation is executed in your browser's local sandbox memory. No file data is uploaded to our servers.
          </p>
          <h2 style="font-size: 1.4rem; font-weight: 800; color: #0f172a; margin-bottom: 0.75rem;">2. Network Dependent Utilities</h2>
          <p style="font-size: 0.95rem; color: #334155; line-height: 1.7; margin-bottom: 1rem;">
            For specialized tools that test remote web services (such as HTTP Header Checkers or DNS lookups), requests are dispatched directly from your browser to the designated target host. Zubware does not log or persist your request payloads or headers.
          </p>
          <h2 style="font-size: 1.4rem; font-weight: 800; color: #0f172a; margin-bottom: 0.75rem;">3. Local Storage &amp; Cookies</h2>
          <p style="font-size: 0.95rem; color: #334155; line-height: 1.7; margin-bottom: 1.5rem;">
            We do not use tracking cookies to build user profiling databases. Local storage is strictly utilized for user interface state preferences, such as Dark Mode toggling and bookmarked favorite tools.
          </p>
          <p><a href="${DOMAIN}/terms.html" style="color: #4f46e5; font-weight: 700; text-decoration: underline;">Review Terms of Service &rarr;</a></p>
        </section>`;
      break;

    case 'terms.html':
      specificBody = `
        <section style="margin-bottom: 2rem;">
          <h2 style="font-size: 1.4rem; font-weight: 800; color: #0f172a; margin-bottom: 0.75rem;">1. Acceptance of Terms</h2>
          <p style="font-size: 0.95rem; color: #334155; line-height: 1.7; margin-bottom: 1rem;">
            By accessing or using Zubware (https://zubware.com), you agree to comply with and be bound by these Terms of Service. If you do not agree, please do not use our services.
          </p>
          <h2 style="font-size: 1.4rem; font-weight: 800; color: #0f172a; margin-bottom: 0.75rem;">2. Permitted Use &amp; Intellectual Property</h2>
          <p style="font-size: 0.95rem; color: #334155; line-height: 1.7; margin-bottom: 1rem;">
            Zubware grants you a personal, non-exclusive, worldwide, royalty-free license to use our web utilities for personal, educational, and commercial workflows. You retain 100% full ownership and copyright of any files or content processed through our utilities.
          </p>
          <h2 style="font-size: 1.4rem; font-weight: 800; color: #0f172a; margin-bottom: 0.75rem;">3. Service Availability &amp; Disclaimer</h2>
          <p style="font-size: 0.95rem; color: #334155; line-height: 1.7; margin-bottom: 1.5rem;">
            Zubware provides all utilities on an "as is" and "as available" basis without warranties of any kind. We do not guarantee uninterrupted availability or error-free calculations.
          </p>
          <p><a href="${DOMAIN}/privacy.html" style="color: #4f46e5; font-weight: 700; text-decoration: underline;">Review Privacy Policy &rarr;</a></p>
        </section>`;
      break;

    case 'disclaimer.html':
      specificBody = `
        <section style="margin-bottom: 2rem;">
          <h2 style="font-size: 1.4rem; font-weight: 800; color: #0f172a; margin-bottom: 0.75rem;">General Informational &amp; Utility Disclaimer</h2>
          <p style="font-size: 0.95rem; color: #334155; line-height: 1.7; margin-bottom: 1rem;">
            The calculations, format conversions, document transformations, and media outputs provided across Zubware are intended solely for general utility, productivity, and educational purposes.
          </p>
          <h2 style="font-size: 1.4rem; font-weight: 800; color: #0f172a; margin-bottom: 0.75rem;">Not Financial, Legal, or Medical Advice</h2>
          <p style="font-size: 0.95rem; color: #334155; line-height: 1.7; margin-bottom: 1.5rem;">
            Calculators (including loan estimators, tax approximations, and health metrics) provide estimates based on mathematical formulas and user inputs. They do not constitute certified professional financial, tax, legal, or medical advice. Always consult certified professionals for critical decisions.
          </p>
          <p><a href="${DOMAIN}/" style="color: #4f46e5; font-weight: 700; text-decoration: underline;">&larr; Return to Zubware Home</a></p>
        </section>`;
      break;

    case 'contact.html':
      specificBody = `
        <section style="margin-bottom: 2rem;">
          <h2 style="font-size: 1.4rem; font-weight: 800; color: #0f172a; margin-bottom: 0.75rem;">Get in Touch with Zubware</h2>
          <p style="font-size: 0.95rem; color: #334155; line-height: 1.7; margin-bottom: 1rem;">
            Have questions, feedback, partnership proposals, or requests for new utilities? The Zubware team welcomes your input and responds promptly.
          </p>
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 1rem; padding: 1.5rem; margin-bottom: 1.5rem;">
            <p style="font-size: 0.95rem; color: #1e293b; margin: 0 0 0.5rem 0;"><strong>Direct Inquiries:</strong> <a href="mailto:work95812@gmail.com" style="color: #4f46e5; text-decoration: underline;">work95812@gmail.com</a></p>
            <p style="font-size: 0.85rem; color: #64748b; margin: 0;">Typical turnaround time: 24 to 48 business hours.</p>
          </div>
          <p><a href="${DOMAIN}/feedback.html" style="color: #4f46e5; font-weight: 700; text-decoration: underline;">Submit Feature Request &rarr;</a></p>
        </section>`;
      break;

    case 'help.html':
      specificBody = `
        <section style="margin-bottom: 2rem;">
          <h2 style="font-size: 1.4rem; font-weight: 800; color: #0f172a; margin-bottom: 0.75rem;">Frequently Asked Questions &amp; Support</h2>
          <div style="display: flex; flex-direction: column; gap: 1rem; margin-bottom: 1.5rem;">
            <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 0.75rem; padding: 1.25rem;">
              <h3 style="font-size: 1rem; font-weight: 700; color: #0f172a; margin: 0 0 0.35rem 0;">Do I need to install plugins or software?</h3>
              <p style="font-size: 0.85rem; color: #475569; margin: 0; line-height: 1.5;">No. All 300+ tools run natively in your web browser on desktop, tablet, and mobile devices.</p>
            </div>
            <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 0.75rem; padding: 1.25rem;">
              <h3 style="font-size: 1rem; font-weight: 700; color: #0f172a; margin: 0 0 0.35rem 0;">Are there file size limits?</h3>
              <p style="font-size: 0.85rem; color: #475569; margin: 0; line-height: 1.5;">Because processing occurs locally in memory, file size limits depend on your device's available RAM rather than cloud upload quotas.</p>
            </div>
            <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 0.75rem; padding: 1.25rem;">
              <h3 style="font-size: 1rem; font-weight: 700; color: #0f172a; margin: 0 0 0.35rem 0;">Which browsers are supported?</h3>
              <p style="font-size: 0.85rem; color: #475569; margin: 0; line-height: 1.5;">Chrome, Firefox, Safari, Edge, and all modern Chromium-based browsers with WebAssembly and JavaScript enabled.</p>
            </div>
          </div>
          <p><a href="${DOMAIN}/blog" style="color: #4f46e5; font-weight: 700; text-decoration: underline;">Explore Detailed Guides &amp; Tutorials &rarr;</a></p>
        </section>`;
      break;

    case 'changelog.html':
      specificBody = `
        <section style="margin-bottom: 2rem;">
          <h2 style="font-size: 1.4rem; font-weight: 800; color: #0f172a; margin-bottom: 0.75rem;">Release Notes &amp; Platform Evolution</h2>
          <div style="display: flex; flex-direction: column; gap: 1rem; margin-bottom: 1.5rem;">
            <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 0.75rem; padding: 1.25rem;">
              <div style="font-size: 0.75rem; font-weight: 800; color: #4f46e5; margin-bottom: 0.25rem;">VERSION 2.0 • LATEST RELEASE</div>
              <h3 style="font-size: 1.1rem; font-weight: 700; color: #0f172a; margin: 0 0 0.5rem 0;">307 Active Web Tools &amp; Authority Architecture</h3>
              <p style="font-size: 0.85rem; color: #475569; margin: 0; line-height: 1.5;">Added 13 dedicated category authority hubs, 10 technical guides, machine-readable llms.txt index, enhanced schema structured data, and offline WASM image pipelines.</p>
            </div>
            <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 0.75rem; padding: 1.25rem;">
              <div style="font-size: 0.75rem; font-weight: 800; color: #64748b; margin-bottom: 0.25rem;">VERSION 1.5</div>
              <h3 style="font-size: 1.1rem; font-weight: 700; color: #0f172a; margin: 0 0 0.5rem 0;">Developer &amp; Career Tool Expansion</h3>
              <p style="font-size: 0.85rem; color: #475569; margin: 0; line-height: 1.5;">Introduced JWT decoders, SQL formatters, JSON diff utilities, ATS resume scanner, and cover letter generator.</p>
            </div>
          </div>
          <p><a href="${DOMAIN}/categories.html" style="color: #4f46e5; font-weight: 700; text-decoration: underline;">Explore Full Tool Directory &rarr;</a></p>
        </section>`;
      break;

    case 'feedback.html':
      specificBody = `
        <section style="margin-bottom: 2rem;">
          <h2 style="font-size: 1.4rem; font-weight: 800; color: #0f172a; margin-bottom: 0.75rem;">Community Feedback &amp; Suggestions</h2>
          <p style="font-size: 0.95rem; color: #334155; line-height: 1.7; margin-bottom: 1rem;">
            Zubware is continuously updated based on feedback from engineers, designers, creators, and students worldwide.
          </p>
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 1rem; padding: 1.5rem; margin-bottom: 1.5rem;">
            <h3 style="font-size: 1rem; font-weight: 700; color: #0f172a; margin: 0 0 0.5rem 0;">How to Request a New Tool:</h3>
            <ul style="margin: 0 0 1rem 1.25rem; font-size: 0.85rem; color: #475569; line-height: 1.6;">
              <li>Describe the specific problem or repetitive workflow you need solved.</li>
              <li>Specify expected input formats (e.g. PDF, CSV, PNG, WebP) and desired outputs.</li>
              <li>Confirm whether the utility requires browser-side offline computation or API access.</li>
            </ul>
            <p style="font-size: 0.9rem; color: #0f172a; margin: 0;">Email your suggestions to: <a href="mailto:work95812@gmail.com" style="color: #4f46e5; font-weight: 700; text-decoration: underline;">work95812@gmail.com</a></p>
          </div>
        </section>`;
      break;

    case 'dashboard.html':
      specificBody = `
        <section style="margin-bottom: 2rem;">
          <h2 style="font-size: 1.4rem; font-weight: 800; color: #0f172a; margin-bottom: 0.75rem;">Your Personal Productivity Hub</h2>
          <p style="font-size: 0.95rem; color: #334155; line-height: 1.7; margin-bottom: 1.5rem;">
            Bookmark your most frequent tools for instant access. Favorite tools are securely remembered in your browser's private local storage.
          </p>
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;">
            <a href="${DOMAIN}/image-compressor.html" style="padding: 1rem; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 0.75rem; text-decoration: none; color: inherit;">
              <div style="font-size: 1.25rem;">🗜️</div>
              <h3 style="font-size: 0.95rem; font-weight: 700; color: #0f172a; margin: 0.25rem 0;">Image Compressor</h3>
              <p style="font-size: 0.8rem; color: #64748b; margin: 0;">Compress PNG, JPG, and WebP images client-side.</p>
            </a>
            <a href="${DOMAIN}/pdf-merge.html" style="padding: 1rem; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 0.75rem; text-decoration: none; color: inherit;">
              <div style="font-size: 1.25rem;">📑</div>
              <h3 style="font-size: 0.95rem; font-weight: 700; color: #0f172a; margin: 0.25rem 0;">PDF Merger</h3>
              <p style="font-size: 0.8rem; color: #64748b; margin: 0;">Combine multiple PDF files into one document.</p>
            </a>
            <a href="${DOMAIN}/json-formatter.html" style="padding: 1rem; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 0.75rem; text-decoration: none; color: inherit;">
              <div style="font-size: 1.25rem;">✨</div>
              <h3 style="font-size: 0.95rem; font-weight: 700; color: #0f172a; margin: 0.25rem 0;">JSON Formatter</h3>
              <p style="font-size: 0.8rem; color: #64748b; margin: 0;">Validate, format, and inspect JSON payloads.</p>
            </a>
            <a href="${DOMAIN}/qr-generator.html" style="padding: 1rem; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 0.75rem; text-decoration: none; color: inherit;">
              <div style="font-size: 1.25rem;">📱</div>
              <h3 style="font-size: 0.95rem; font-weight: 700; color: #0f172a; margin: 0.25rem 0;">QR Code Generator</h3>
              <p style="font-size: 0.8rem; color: #64748b; margin: 0;">Create custom styled QR codes for links and text.</p>
            </a>
          </div>
          <p><a href="${DOMAIN}/categories.html" style="color: #4f46e5; font-weight: 700; text-decoration: underline;">Browse Complete Directory of 307 Tools &rarr;</a></p>
        </section>`;
      break;

    default:
      specificBody = `
        <div style="padding: 1.5rem; background-color: #f8fafc; border-radius: 1rem; border: 1px solid #e2e8f0; font-size: 0.875rem; color: #334155; line-height: 1.6;">
          <p>Welcome to Zubware. All interactive tools and calculators run natively on client-side WebAssembly, HTML5 Canvas, and modern Web APIs.</p>
          <p style="margin-top: 1rem;"><a href="${DOMAIN}/" style="color: #4f46e5; font-weight: 700; text-decoration: underline;">&larr; Return to Zubware Home</a></p>
        </div>`;
      break;
  }

  return `
    <main style="max-width: 56rem; margin-left: auto; margin-right: auto; padding: 2.5rem 1rem; color: #1e293b; font-family: ui-sans-serif, system-ui, sans-serif;">
      <nav aria-label="Breadcrumb" style="font-size: 0.75rem; color: #64748b; margin-bottom: 0.75rem;">
        <a href="${DOMAIN}/" style="color: inherit; text-decoration: underline;">Home</a> &gt;
        <span aria-current="page" style="font-weight: 600;">${escapeHtml(shortTitle)}</span>
      </nav>
      <h1 style="font-size: 2.25rem; font-weight: 800; color: #0f172a; margin-bottom: 0.5rem; line-height: 1.2;">
        ${escapeHtml(page.title)}
      </h1>
      <p style="font-size: 1rem; color: #475569; line-height: 1.6; margin-bottom: 1.5rem;">
        ${escapeHtml(page.description)}
      </p>
      ${specificBody}
    </main>`;
}

function buildBlogIndexJsonLd(canonicalUrl: string): object {
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
      'logo': `${DOMAIN}/icon.png`
    },
    {
      '@type': 'CollectionPage',
      'name': 'Guides, Tutorials & Best Practices — Zubware',
      'url': canonicalUrl,
      'description': 'Explore comprehensive guides on PDF compression, file optimization, image editing, and browser productivity workflows.'
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
          'name': 'Guides & Articles',
          'item': canonicalUrl
        }
      ]
    }
  ];

  return {
    '@context': 'https://schema.org',
    '@graph': schemas
  };
}

function renderBlogIndexContent(): string {
  return `
    <main style="max-width: 56rem; margin-left: auto; margin-right: auto; padding: 2.5rem 1rem; color: #1e293b; font-family: ui-sans-serif, system-ui, sans-serif;">
      <nav aria-label="Breadcrumb" style="font-size: 0.75rem; color: #64748b; margin-bottom: 0.75rem;">
        <a href="${DOMAIN}/" style="color: inherit; text-decoration: underline;">Home</a> &gt;
        <span aria-current="page" style="font-weight: 600;">Guides &amp; Articles</span>
      </nav>
      <h1 style="font-size: 2.25rem; font-weight: 800; color: #0f172a; margin-bottom: 0.5rem; line-height: 1.2;">
        Guides, Tutorials &amp; Best Practices
      </h1>
      <p style="font-size: 1rem; color: #475569; line-height: 1.6; margin-bottom: 2rem;">
        In-depth technical guides designed to help you optimize documents, convert media, and master browser-based productivity workflows without sacrificing quality or privacy.
      </p>
      <div style="display: flex; flex-direction: column; gap: 1.5rem;">
        ${BLOG_ARTICLES.map(article => `
        <article style="padding: 1.5rem; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 1rem;">
          <div style="font-size: 0.75rem; font-weight: 700; color: #4f46e5; text-transform: uppercase; margin-bottom: 0.5rem;">
            ${escapeHtml(article.category)} • ${escapeHtml(article.readingTime)}
          </div>
          <h2 style="font-size: 1.35rem; font-weight: 800; margin: 0 0 0.5rem 0;">
            <a href="${DOMAIN}${article.canonicalPath}" style="color: #0f172a; text-decoration: none;">${escapeHtml(article.title)}</a>
          </h2>
          <p style="font-size: 0.9rem; color: #475569; line-height: 1.6; margin-bottom: 1rem;">
            ${escapeHtml(article.excerpt)}
          </p>
          <a href="${DOMAIN}${article.canonicalPath}" style="font-size: 0.85rem; font-weight: 700; color: #4f46e5; text-decoration: none;">Read Complete Guide &rarr;</a>
        </article>
        `).join('\n')}
      </div>
    </main>`;
}

function buildBlogArticleJsonLd(article: BlogArticle, canonicalUrl: string): object {
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
      'logo': `${DOMAIN}/icon.png`
    },
    {
      '@type': 'Article',
      'headline': article.title,
      'description': article.description,
      'url': canonicalUrl,
      'mainEntityOfPage': {
        '@type': 'WebPage',
        '@id': canonicalUrl
      },
      'datePublished': article.publishedTime,
      'dateModified': article.modifiedTime,
      'author': {
        '@type': 'Organization',
        'name': article.author.name,
        'url': article.author.url || `${DOMAIN}/about.html`
      },
      'publisher': {
        '@type': 'Organization',
        'name': article.publisher.name,
        'url': article.publisher.url,
        'logo': {
          '@type': 'ImageObject',
          'url': `${DOMAIN}/icon.png`
        }
      },
      'articleSection': article.category,
      'keywords': article.tags && article.tags.length > 0 ? article.tags.join(', ') : undefined
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
          'name': 'Guides & Articles',
          'item': `${DOMAIN}/blog`
        },
        {
          '@type': 'ListItem',
          'position': 3,
          'name': article.title,
          'item': canonicalUrl
        }
      ]
    }
  ];

  if (article.howTo) {
    schemas.push({
      '@type': 'HowTo',
      'name': article.howTo.name,
      'description': article.howTo.description,
      'step': article.howTo.steps.map((s, idx) => ({
        '@type': 'HowToStep',
        'position': idx + 1,
        'name': s.name,
        'text': s.text
      }))
    });
  }

  if (article.faqs && article.faqs.length > 0) {
    schemas.push({
      '@type': 'FAQPage',
      'mainEntity': article.faqs.map(f => ({
        '@type': 'Question',
        'name': f.question,
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': f.answer
        }
      }))
    });
  }

  return {
    '@context': 'https://schema.org',
    '@graph': schemas
  };
}

function renderBlogArticleContent(article: BlogArticle): string {
  const steps = article.howTo?.steps || [];
  const faqs = article.faqs || [];
  const takeaways = article.takeaways || [];
  const sections = article.sections || [];

  // Related tools
  const relatedTools = (article.relatedToolIds || [])
    .map(id => TOOLS_DATA.find(t => t.id === id))
    .filter((t): t is ToolMeta => Boolean(t));

  return `
    <main style="max-width: 56rem; margin-left: auto; margin-right: auto; padding: 2rem 1rem; color: #1e293b; font-family: ui-sans-serif, system-ui, sans-serif; line-height: 1.7;">
      <nav aria-label="Breadcrumb" style="font-size: 0.75rem; color: #64748b; margin-bottom: 1rem;">
        <a href="${DOMAIN}/" style="color: inherit; text-decoration: underline;">Home</a> &gt;
        <a href="${DOMAIN}/blog" style="color: inherit; text-decoration: underline;">Guides &amp; Articles</a> &gt;
        <span aria-current="page" style="font-weight: 600;">${escapeHtml(article.title)}</span>
      </nav>

      <header style="margin-bottom: 2rem; border-bottom: 1px solid #e2e8f0; padding-bottom: 1.5rem;">
        <div style="display: inline-block; padding: 0.25rem 0.75rem; background-color: #eef2ff; color: #4f46e5; font-size: 0.75rem; font-weight: 800; border-radius: 9999px; margin-bottom: 0.75rem;">
          ${escapeHtml(article.category)} • ${escapeHtml(article.readingTime)}
        </div>
        <h1 style="font-size: 2.25rem; font-weight: 900; color: #0f172a; margin: 0.25rem 0 0.75rem 0; line-height: 1.25;">
          ${escapeHtml(article.title)}
        </h1>
        <p style="font-size: 1.05rem; color: #475569; margin: 0 0 1rem 0;">
          ${escapeHtml(article.excerpt)}
        </p>
        <div style="font-size: 0.8rem; color: #64748b; display: flex; gap: 1rem; flex-wrap: wrap;">
          <span><strong>Author:</strong> ${escapeHtml(article.author.name)}</span>
          <span>•</span>
          <span><strong>Updated:</strong> Sept 24, 2026</span>
          <span>•</span>
          <span><strong>Platform:</strong> Zubware Browser Suite</span>
        </div>
      </header>

      ${takeaways.length > 0 ? `
      <section style="margin-bottom: 2rem; padding: 1.5rem; background-color: #f8fafc; border-radius: 1rem; border: 1px solid #e2e8f0;">
        <h2 style="font-size: 1.15rem; font-weight: 800; color: #0f172a; margin-top: 0; margin-bottom: 0.75rem;">
          Key Takeaways &amp; Principles
        </h2>
        <ul style="margin: 0 0 0 1.25rem; padding: 0; font-size: 0.9rem; color: #334155; line-height: 1.6;">
          ${takeaways.map(t => `<li style="margin-bottom: 0.5rem;">${escapeHtml(t)}</li>`).join('\n          ')}
        </ul>
      </section>` : ''}

      ${sections.map(sec => `
      <section style="margin-bottom: 2rem;">
        <h2 style="font-size: 1.35rem; font-weight: 800; color: #0f172a; margin-bottom: 0.75rem;">
          ${escapeHtml(sec.title)}
        </h2>
        <div style="font-size: 0.95rem; color: #334155; line-height: 1.6; white-space: pre-line;">
          ${escapeHtml(sec.content)}
        </div>
      </section>`).join('\n')}

      ${steps.length > 0 ? `
      <section style="margin-bottom: 2rem;">
        <h2 style="font-size: 1.35rem; font-weight: 800; color: #0f172a; margin-bottom: 0.75rem;">
          Step-by-Step Instructions
        </h2>
        <ol style="margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 0.75rem;">
          ${steps.map((s, idx) => `
          <li style="padding: 1rem 1.25rem; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 0.75rem;">
            <h3 style="font-size: 0.95rem; font-weight: 700; color: #0f172a; margin: 0 0 0.25rem 0;">
              Step ${idx + 1}: ${escapeHtml(s.name)}
            </h3>
            <p style="font-size: 0.85rem; color: #475569; margin: 0; line-height: 1.5;">
              ${escapeHtml(s.text)}
            </p>
          </li>`).join('\n          ')}
        </ol>
      </section>` : ''}

      ${faqs.length > 0 ? `
      <section style="margin-bottom: 2rem;">
        <h2 style="font-size: 1.35rem; font-weight: 800; color: #0f172a; margin-bottom: 1rem;">
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
      <section style="margin-top: 2.5rem; padding-top: 1.5rem; border-top: 1px solid #e2e8f0;">
        <h2 style="font-size: 1.2rem; font-weight: 800; color: #0f172a; margin-bottom: 0.75rem;">
          Related Zubware Utilities
        </h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 0.75rem;">
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

// Generate categories.html content
function renderCategoriesPageContent(): string {
  const realCategories = CATEGORIES_DATA.filter(c => c.slug !== 'all');

  return `
    <main style="max-width: 72rem; margin-left: auto; margin-right: auto; padding: 2.5rem 1rem; color: #1e293b; font-family: ui-sans-serif, system-ui, sans-serif;">
      <nav aria-label="Breadcrumb" style="font-size: 0.75rem; color: #64748b; margin-bottom: 1rem;">
        <a href="${DOMAIN}/" style="color: inherit; text-decoration: underline;">Home</a> &gt;
        <span aria-current="page" style="font-weight: 600;">Tool Categories &amp; Directory</span>
      </nav>
      <header style="margin-bottom: 2.5rem;">
        <h1 style="font-size: 2.5rem; font-weight: 900; color: #0f172a; margin: 0 0 0.5rem 0;">
          Tool Categories &amp; Complete Directory
        </h1>
        <p style="font-size: 1rem; color: #475569; max-width: 48rem; line-height: 1.6;">
          Browse our complete suite of ${TOOLS_DATA.length}+ free online browser utilities organized across 13 specialized domains. No software downloads, zero accounts, and local browser processing.
        </p>
      </header>

      <section style="display: flex; flex-direction: column; gap: 3rem;">
        ${realCategories.map(cat => {
          const catTools = TOOLS_DATA.filter(t => cat.match(t.category));
          return `
          <div id="category-${cat.slug}" style="scroll-margin-top: 4rem;">
            <div style="display: flex; align-items: baseline; justify-content: space-between; border-bottom: 2px solid #e2e8f0; padding-bottom: 0.75rem; margin-bottom: 1.25rem;">
              <div style="display: flex; align-items: baseline; gap: 0.75rem;">
                <h2 style="font-size: 1.5rem; font-weight: 800; color: #0f172a; margin: 0;">
                  <span aria-hidden="true">${cat.icon}</span> ${escapeHtml(cat.defaultName)}
                </h2>
                <span style="font-size: 0.85rem; font-weight: 700; color: #4f46e5;">(${catTools.length} tools)</span>
              </div>
              <a href="${DOMAIN}/category/${cat.slug}.html" style="font-size: 0.85rem; font-weight: 700; color: #4f46e5; text-decoration: underline;">
                Explore ${escapeHtml(cat.defaultName)} Hub &rarr;
              </a>
            </div>
            <p style="font-size: 0.875rem; color: #64748b; margin-bottom: 1rem;">
              ${escapeHtml(cat.description)}
            </p>
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 1rem;">
              ${catTools.map(tool => `
              <a href="${DOMAIN}/${escapeHtml(tool.filename)}" style="display: block; padding: 1rem; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 0.75rem; text-decoration: none; color: inherit;">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem;">
                  <span style="font-size: 1.5rem;">${tool.icon}</span>
                  ${tool.badge ? `<span style="font-size: 0.7rem; font-weight: 700; background: #eef2ff; color: #4f46e5; padding: 0.2rem 0.5rem; border-radius: 9999px;">${escapeHtml(tool.badge)}</span>` : ''}
                </div>
                <h3 style="font-size: 0.95rem; font-weight: 700; color: #0f172a; margin: 0 0 0.35rem 0;">
                  ${escapeHtml(tool.title)}
                </h3>
                <p style="font-size: 0.75rem; color: #64748b; line-height: 1.4; margin: 0; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;">
                  ${escapeHtml(tool.description)}
                </p>
              </a>`).join('\n              ')}
            </div>
          </div>`;
        }).join('\n        ')}
      </section>
    </main>`;
}

// Generate rich category authority hub HTML
function renderCategoryHubPageContent(cat: CategoryItem, catTools: ToolMeta[]): string {
  const auth = CATEGORY_AUTHORITY_MAP[cat.slug] || {
    slug: cat.slug,
    h1: `${cat.defaultName} — Free Online Utilities`,
    seoTitle: `${cat.defaultName} — Free Online Utilities | Zubware`,
    metaDescription: cat.description,
    leadParagraph: cat.description,
    workflows: [],
    faqs: []
  };

  const matchingGuides = BLOG_ARTICLES.filter(
    (a) => a.category.toLowerCase().includes(cat.defaultName.toLowerCase().split(' ')[0]) || a.tags.some(t => t.toLowerCase().includes(cat.slug.replace('-tools', '')))
  ).slice(0, 3);

  const otherCategories = CATEGORIES_DATA.filter(c => c.slug !== 'all' && c.slug !== cat.slug);

  return `
    <main style="max-width: 72rem; margin-left: auto; margin-right: auto; padding: 2.5rem 1rem; color: #1e293b; font-family: ui-sans-serif, system-ui, sans-serif;">
      <!-- Breadcrumbs -->
      <nav aria-label="Breadcrumb" style="font-size: 0.75rem; color: #64748b; margin-bottom: 1.25rem;">
        <a href="${DOMAIN}/" style="color: inherit; text-decoration: underline;">Home</a> &gt;
        <a href="${DOMAIN}/categories.html" style="color: inherit; text-decoration: underline;">Categories Directory</a> &gt;
        <span aria-current="page" style="font-weight: 600;">${escapeHtml(cat.defaultName)}</span>
      </nav>

      <!-- Category Hero Header -->
      <header style="margin-bottom: 3rem; background: linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%); padding: 2.5rem; border-radius: 1.5rem; border: 1px solid #e0e7ff;">
        <div style="display: inline-flex; align-items: center; gap: 0.5rem; font-size: 0.8rem; font-weight: 800; color: #4f46e5; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.75rem;">
          <span style="font-size: 1.25rem;">${cat.icon}</span> Zubware Category Hub
        </div>
        <h1 style="font-size: 2.25rem; font-weight: 900; color: #0f172a; margin: 0 0 1rem 0; line-height: 1.2;">
          ${escapeHtml(auth.h1)}
        </h1>
        <p style="font-size: 1.05rem; color: #334155; max-width: 52rem; line-height: 1.7; margin: 0 0 1.25rem 0;">
          ${escapeHtml(auth.leadParagraph)}
        </p>
        <div style="display: flex; gap: 1rem; align-items: center; flex-wrap: wrap; font-size: 0.85rem; color: #475569; font-weight: 600;">
          <span style="background: #ffffff; padding: 0.4rem 0.85rem; border-radius: 9999px; border: 1px solid #c7d2fe; color: #4338ca;">
            ⚡ ${catTools.length} Active Tools
          </span>
          <span style="background: #ffffff; padding: 0.4rem 0.85rem; border-radius: 9999px; border: 1px solid #c7d2fe; color: #4338ca;">
            🔒 100% Client-Side Privacy
          </span>
          <span style="background: #ffffff; padding: 0.4rem 0.85rem; border-radius: 9999px; border: 1px solid #c7d2fe; color: #4338ca;">
            🆓 Free Forever • Zero Install
          </span>
        </div>
      </header>

      <!-- Key Workflows -->
      ${auth.workflows && auth.workflows.length > 0 ? `
      <section style="margin-bottom: 3.5rem;">
        <h2 style="font-size: 1.5rem; font-weight: 800; color: #0f172a; margin: 0 0 0.5rem 0;">
          Common Workflows &amp; Capabilities
        </h2>
        <p style="font-size: 0.9rem; color: #64748b; margin: 0 0 1.5rem 0;">
          Step-by-step solutions for everyday ${escapeHtml(cat.defaultName.toLowerCase())} challenges.
        </p>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.25rem;">
          ${auth.workflows.map((wf, idx) => `
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 1rem; padding: 1.5rem;">
            <div style="display: inline-block; font-size: 0.75rem; font-weight: 800; color: #4f46e5; background: #eef2ff; padding: 0.2rem 0.6rem; border-radius: 9999px; margin-bottom: 0.75rem;">
              Workflow 0${idx + 1}
            </div>
            <h3 style="font-size: 1.1rem; font-weight: 700; color: #0f172a; margin: 0 0 0.5rem 0;">
              ${escapeHtml(wf.title)}
            </h3>
            <p style="font-size: 0.85rem; color: #475569; line-height: 1.5; margin: 0 0 1rem 0;">
              ${escapeHtml(wf.description)}
            </p>
            ${wf.toolIds && wf.toolIds.length > 0 ? `
            <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
              ${wf.toolIds.map(tid => {
                const t = TOOLS_DATA.find(tool => tool.id === tid);
                if (!t) return '';
                return `<a href="${DOMAIN}/${escapeHtml(t.filename)}" style="font-size: 0.75rem; font-weight: 600; color: #4f46e5; background: #f8fafc; border: 1px solid #e2e8f0; padding: 0.3rem 0.6rem; border-radius: 0.5rem; text-decoration: none;">${escapeHtml(t.navTitle || t.title)} &rarr;</a>`;
              }).join('')}
            </div>` : ''}
          </div>`).join('\n          ')}
        </div>
      </section>` : ''}

      <!-- All Tools in Category Grid -->
      <section style="margin-bottom: 3.5rem;">
        <div style="border-bottom: 2px solid #e2e8f0; padding-bottom: 0.75rem; margin-bottom: 1.5rem; display: flex; align-items: baseline; justify-content: space-between;">
          <h2 style="font-size: 1.6rem; font-weight: 800; color: #0f172a; margin: 0;">
            All ${escapeHtml(cat.defaultName)} (${catTools.length} Utilities)
          </h2>
          <span style="font-size: 0.85rem; color: #64748b;">In-Browser Execution</span>
        </div>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.25rem;">
          ${catTools.map(tool => `
          <a href="${DOMAIN}/${escapeHtml(tool.filename)}" style="display: flex; flex-direction: column; justify-content: space-between; padding: 1.25rem; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 1rem; text-decoration: none; color: inherit; box-shadow: 0 1px 3px rgba(0,0,0,0.04); transition: transform 0.15s ease, border-color 0.15s ease;">
            <div>
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem;">
                <span style="font-size: 1.75rem;">${tool.icon}</span>
                ${tool.badge ? `<span style="font-size: 0.7rem; font-weight: 700; background: #eef2ff; color: #4f46e5; padding: 0.2rem 0.55rem; border-radius: 9999px;">${escapeHtml(tool.badge)}</span>` : ''}
              </div>
              <h3 style="font-size: 1.05rem; font-weight: 700; color: #0f172a; margin: 0 0 0.4rem 0;">
                ${escapeHtml(tool.title)}
              </h3>
              <p style="font-size: 0.8rem; color: #64748b; line-height: 1.5; margin: 0 0 1rem 0;">
                ${escapeHtml(tool.description)}
              </p>
            </div>
            <div style="border-top: 1px solid #f1f5f9; padding-top: 0.75rem; display: flex; align-items: center; justify-content: space-between;">
              <span style="font-size: 0.75rem; font-weight: 700; color: #4f46e5;">Open Tool &rarr;</span>
              <span style="font-size: 0.7rem; color: #94a3b8;">Browser Tool</span>
            </div>
          </a>`).join('\n          ')}
        </div>
      </section>

      <!-- Knowledge Base Guides -->
      ${matchingGuides.length > 0 ? `
      <section style="margin-bottom: 3.5rem; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 1.5rem; padding: 2rem;">
        <h2 style="font-size: 1.4rem; font-weight: 800; color: #0f172a; margin: 0 0 0.5rem 0;">
          Related Guides &amp; Tutorials
        </h2>
        <p style="font-size: 0.85rem; color: #64748b; margin: 0 0 1.25rem 0;">
          In-depth technical guides explaining best practices, performance tradeoffs, and privacy mechanics.
        </p>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem;">
          ${matchingGuides.map(guide => `
          <a href="${DOMAIN}${guide.canonicalPath}" style="display: block; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 0.75rem; padding: 1.25rem; text-decoration: none; color: inherit;">
            <span style="font-size: 0.7rem; font-weight: 700; color: #4f46e5; text-transform: uppercase;">${escapeHtml(guide.category)}</span>
            <h3 style="font-size: 1rem; font-weight: 700; color: #0f172a; margin: 0.35rem 0 0.5rem 0;">
              ${escapeHtml(guide.title)}
            </h3>
            <p style="font-size: 0.8rem; color: #64748b; line-height: 1.4; margin: 0;">
              ${escapeHtml(guide.description)}
            </p>
          </a>`).join('\n          ')}
        </div>
      </section>` : ''}

      <!-- Category FAQs -->
      ${auth.faqs && auth.faqs.length > 0 ? `
      <section style="margin-bottom: 3.5rem;">
        <h2 style="font-size: 1.4rem; font-weight: 800; color: #0f172a; margin: 0 0 1.25rem 0;">
          Frequently Asked Questions
        </h2>
        <div style="display: flex; flex-direction: column; gap: 0.75rem;">
          ${auth.faqs.map(faq => `
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 0.75rem; padding: 1.25rem;">
            <h3 style="font-size: 0.95rem; font-weight: 700; color: #0f172a; margin: 0 0 0.4rem 0;">
              ${escapeHtml(faq.question)}
            </h3>
            <p style="font-size: 0.85rem; color: #475569; line-height: 1.6; margin: 0;">
              ${escapeHtml(faq.answer)}
            </p>
          </div>`).join('\n          ')}
        </div>
      </section>` : ''}

      <!-- Explore Other Category Hubs -->
      <section style="border-top: 2px solid #e2e8f0; padding-top: 2.5rem;">
        <h2 style="font-size: 1.25rem; font-weight: 800; color: #0f172a; margin: 0 0 1rem 0;">
          Explore Other Tool Categories
        </h2>
        <div style="display: flex; flex-wrap: wrap; gap: 0.75rem;">
          <a href="${DOMAIN}/categories.html" style="font-size: 0.8rem; font-weight: 700; color: #4f46e5; background: #eef2ff; border: 1px solid #c7d2fe; padding: 0.5rem 1rem; border-radius: 0.75rem; text-decoration: none;">⚡ All Categories Directory</a>
          ${otherCategories.map(c => `
          <a href="${DOMAIN}/category/${c.slug}.html" style="font-size: 0.8rem; font-weight: 600; color: #334155; background: #ffffff; border: 1px solid #e2e8f0; padding: 0.5rem 1rem; border-radius: 0.75rem; text-decoration: none;">
            ${c.icon} ${escapeHtml(c.defaultName)}
          </a>`).join('\n          ')}
        </div>
      </section>
    </main>
  `;
}

// Category Hub JSON-LD Structured Data
function buildCategoryHubJsonLd(cat: CategoryItem, catTools: ToolMeta[], canonicalUrl: string): object {
  const auth = CATEGORY_AUTHORITY_MAP[cat.slug] || {
    slug: cat.slug,
    h1: `${cat.defaultName} — Free Online Utilities`,
    seoTitle: `${cat.defaultName} — Free Online Utilities | Zubware`,
    metaDescription: cat.description,
    leadParagraph: cat.description,
    workflows: [],
    faqs: []
  };

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
      'logo': `${DOMAIN}/icon.png`
    },
    {
      '@type': 'CollectionPage',
      'name': auth.seoTitle,
      'url': canonicalUrl,
      'description': auth.metaDescription,
      'mainEntity': {
        '@type': 'ItemList',
        'name': `${cat.defaultName} List`,
        'numberOfItems': catTools.length,
        'itemListElement': catTools.map((t, idx) => ({
          '@type': 'ListItem',
          'position': idx + 1,
          'name': t.title,
          'url': `${DOMAIN}/${t.filename}`
        }))
      }
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
          'name': 'Categories Directory',
          'item': `${DOMAIN}/categories.html`
        },
        {
          '@type': 'ListItem',
          'position': 3,
          'name': cat.defaultName,
          'item': canonicalUrl
        }
      ]
    }
  ];

  if (auth.faqs && auth.faqs.length > 0) {
    schemas.push({
      '@type': 'FAQPage',
      'mainEntity': auth.faqs.map(f => ({
        '@type': 'Question',
        'name': f.question,
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': f.answer
        }
      }))
    });
  }

  return {
    '@context': 'https://schema.org',
    '@graph': schemas
  };
}

// Generate rich homepage pre-rendered semantic HTML
function renderHomepageContent(): string {
  const realCategories = CATEGORIES_DATA.filter(c => c.slug !== 'all');

  return `
    <main style="max-width: 76rem; margin-left: auto; margin-right: auto; padding: 2.5rem 1rem; color: #1e293b; font-family: ui-sans-serif, system-ui, sans-serif;">
      <!-- Hero Value Proposition -->
      <section style="text-align: center; margin-bottom: 3.5rem;">
        <div style="display: inline-block; padding: 0.35rem 1rem; background-color: #eef2ff; color: #4f46e5; font-size: 0.8rem; font-weight: 800; border-radius: 9999px; margin-bottom: 1rem; border: 1px solid #c7d2fe;">
          300+ Free Online Browser Utilities • Fast &amp; Private Processing
        </div>
        <h1 style="font-size: 2.75rem; font-weight: 900; color: #0f172a; margin: 0 0 1rem 0; line-height: 1.2;">
          Instant, Private Browser Tools for Creators &amp; Professionals
        </h1>
        <p style="font-size: 1.15rem; color: #475569; max-width: 48rem; margin: 0 auto 2rem auto; line-height: 1.6;">
          Compress PDFs, convert images, decode JWTs, calculate financial loans, and format documents right inside your browser memory. No installations, zero wait times, and client-side data privacy.
        </p>
        <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
          <a href="${DOMAIN}/category/pdf-tools.html" style="padding: 0.75rem 1.5rem; background: #4f46e5; color: #ffffff; font-weight: 700; text-decoration: none; border-radius: 0.75rem;">Explore PDF Tools &rarr;</a>
          <a href="${DOMAIN}/category/image-tools.html" style="padding: 0.75rem 1.5rem; background: #ffffff; color: #4f46e5; font-weight: 700; text-decoration: none; border-radius: 0.75rem; border: 1px solid #c7d2fe;">Image Tools &rarr;</a>
          <a href="${DOMAIN}/categories.html" style="padding: 0.75rem 1.5rem; background: #f8fafc; color: #334155; font-weight: 700; text-decoration: none; border-radius: 0.75rem; border: 1px solid #e2e8f0;">Full Directory &rarr;</a>
          <a href="${DOMAIN}/blog" style="padding: 0.75rem 1.5rem; background: #f8fafc; color: #334155; font-weight: 700; text-decoration: none; border-radius: 0.75rem; border: 1px solid #e2e8f0;">Knowledge Base &rarr;</a>
        </div>
      </section>

      <!-- Complete Directory of Tools by Category -->
      <section style="display: flex; flex-direction: column; gap: 3rem; margin-bottom: 4rem;">
        <div style="text-align: center; margin-bottom: 1rem;">
          <h2 style="font-size: 2rem; font-weight: 900; color: #0f172a; margin: 0 0 0.5rem 0;">
            Browse All ${TOOLS_DATA.length} Free Online Tools
          </h2>
          <p style="font-size: 0.95rem; color: #64748b;">
            Discover specialized utilities organized by workflow domain.
          </p>
        </div>

        ${realCategories.map(cat => {
          const catTools = TOOLS_DATA.filter(t => cat.match(t.category));
          return `
          <div id="category-${cat.slug}" style="scroll-margin-top: 4rem;">
            <div style="display: flex; align-items: baseline; justify-content: space-between; border-bottom: 2px solid #e2e8f0; padding-bottom: 0.75rem; margin-bottom: 1.25rem;">
              <h3 style="font-size: 1.4rem; font-weight: 800; color: #0f172a; margin: 0;">
                <span aria-hidden="true">${cat.icon}</span> ${escapeHtml(cat.defaultName)}
                <span style="font-size: 0.85rem; font-weight: 700; color: #4f46e5; margin-left: 0.5rem;">(${catTools.length} tools)</span>
              </h3>
              <a href="${DOMAIN}/category/${cat.slug}.html" style="font-size: 0.8rem; color: #4f46e5; font-weight: 600; text-decoration: underline;">Explore ${escapeHtml(cat.defaultName)} Hub &rarr;</a>
            </div>
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 1rem;">
              ${catTools.map(tool => `
              <a href="${DOMAIN}/${escapeHtml(tool.filename)}" style="display: block; padding: 1rem; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 0.75rem; text-decoration: none; color: inherit;">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem;">
                  <span style="font-size: 1.4rem;">${tool.icon}</span>
                  ${tool.badge ? `<span style="font-size: 0.65rem; font-weight: 700; background: #eef2ff; color: #4f46e5; padding: 0.15rem 0.45rem; border-radius: 9999px;">${escapeHtml(tool.badge)}</span>` : ''}
                </div>
                <h4 style="font-size: 0.95rem; font-weight: 700; color: #0f172a; margin: 0 0 0.35rem 0;">
                  ${escapeHtml(tool.title)}
                </h4>
                <p style="font-size: 0.75rem; color: #64748b; line-height: 1.4; margin: 0; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;">
                  ${escapeHtml(tool.description)}
                </p>
              </a>`).join('\n              ')}
            </div>
          </div>`;
        }).join('\n        ')}
      </section>

      <!-- Knowledge Base & Guides -->
      <section style="margin-bottom: 4rem; padding: 2.5rem 1.5rem; background: #f8fafc; border-radius: 1.5rem; border: 1px solid #e2e8f0;">
        <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 0.5rem;">
          <div>
            <h2 style="font-size: 1.75rem; font-weight: 800; color: #0f172a; margin: 0 0 0.25rem 0;">
              Knowledge Base &amp; Practical Guides
            </h2>
            <p style="font-size: 0.9rem; color: #64748b; margin: 0;">
              In-depth engineering documentation and best practice articles.
            </p>
          </div>
          <a href="${DOMAIN}/blog" style="font-size: 0.85rem; font-weight: 700; color: #4f46e5; text-decoration: underline;">View All Guides &rarr;</a>
        </div>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1rem;">
          ${BLOG_ARTICLES.map(article => `
          <a href="${DOMAIN}${article.canonicalPath}" style="display: block; padding: 1.25rem; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 0.75rem; text-decoration: none; color: inherit;">
            <div style="font-size: 0.75rem; font-weight: 700; color: #4f46e5; text-transform: uppercase; margin-bottom: 0.35rem;">
              ${escapeHtml(article.category)} • ${escapeHtml(article.readingTime)}
            </div>
            <h3 style="font-size: 1rem; font-weight: 800; color: #0f172a; margin: 0 0 0.5rem 0; line-height: 1.3;">
              ${escapeHtml(article.title)}
            </h3>
            <p style="font-size: 0.8rem; color: #64748b; line-height: 1.4; margin: 0; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical;">
              ${escapeHtml(article.excerpt)}
            </p>
          </a>`).join('\n          ')}
        </div>
      </section>

      <!-- Technical Architecture & Privacy -->
      <section style="margin-bottom: 4rem; padding: 2rem; background: #ffffff; border-radius: 1.5rem; border: 1px solid #e2e8f0;">
        <h2 style="font-size: 1.5rem; font-weight: 800; color: #0f172a; margin-top: 0; margin-bottom: 0.75rem;">
          Privacy Architecture: 100% Client-Side Execution
        </h2>
        <p style="font-size: 0.95rem; color: #334155; line-height: 1.6;">
          Unlike traditional web services that upload your sensitive documents, personal photographs, and source code to remote cloud farms, Zubware processes your data locally on your device using compiled WebAssembly, modern HTML5 Canvas, and Web Cryptography APIs. Your files are never transmitted across the network or stored on external servers.
        </p>
      </section>

      <!-- Homepage FAQs -->
      <section style="margin-bottom: 3rem;">
        <h2 style="font-size: 1.75rem; font-weight: 800; color: #0f172a; margin-bottom: 1.25rem; text-align: center;">
          Frequently Asked Questions
        </h2>
        <div style="display: flex; flex-direction: column; gap: 0.75rem; max-width: 52rem; margin: 0 auto;">
          ${HOMEPAGE_FAQS.map(faq => `
          <div style="padding: 1.25rem; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 0.75rem;">
            <h3 style="font-size: 1rem; font-weight: 700; color: #0f172a; margin: 0 0 0.35rem 0;">
              ${escapeHtml(faq.question)}
            </h3>
            <p style="font-size: 0.875rem; color: #475569; margin: 0; line-height: 1.5;">
              ${escapeHtml(faq.answer)}
            </p>
          </div>`).join('\n          ')}
        </div>
      </section>
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
    ogType?: string;
  }
): string {
  const { title, description, canonicalUrl, keywords, jsonLdSchema, bodyContent, ogType } = options;
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
  if (ogType) {
    html = html.replace(
      /<meta\s+property="og:type"\s+content="[\s\S]*?"\s*\/?>/i,
      `<meta property="og:type" content="${escapeHtml(ogType)}" />`
    );
  }
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
  html = html.replace(/<meta\s+name="keywords"\s+content="[\s\S]*?"\s*\/?>\n?/gi, '');
  html = html.replace(/<meta\s+name="robots"\s+content="[\s\S]*?"\s*\/?>\n?/gi, '');
  html = html.replace(/<script\s+id="json-ld-schema"[\s\S]*?<\/script>\n?/gi, '');

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
      /<div id="root">[\s\S]*?(?=\s*<script\b|\s*<noscript\b|\s*<\/body>)/i,
      `<div id="root">\n${bodyContent}\n    </div>\n    `
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
> Zubware (https://zubware.com) is an online multi-tool suite offering ${tools.length}+ free utilities for PDF documents, image processing, developer workflows, video and audio media, calculators, and daily productivity.

- Canonical Homepage: https://zubware.com
- Total Active Tools: ${tools.length}
- Access Model: Free to use, no mandatory account sign-up, no hidden subscriptions.
- Technical Architecture: Fast, browser-based execution for offline tools; direct browser requests for network testing tools.

## Execution & Privacy Guidelines
- Offline & Local Processing: Document manipulation, image editing, PDF splitting/merging, and data calculations are processed in the user's browser. Files are not uploaded to Zubware remote servers.
- Network Utilities: For API testing, HTTP inspection, and web scrapers, browser requests are dispatched directly to the user-specified destination without storing request payloads on Zubware servers.

## Dedicated Category Authority Hubs
${CATEGORIES_DATA.filter(c => c.slug !== 'all').map(c => `- [${c.defaultName}](${DOMAIN}/category/${c.slug}.html): ${c.description}`).join('\n')}

## In-Depth Guides & Technical Documentation
`;

  for (const article of BLOG_ARTICLES) {
    output += `- [${article.title}](${DOMAIN}${article.canonicalPath}): ${article.description}\n`;
  }

  output += `\n## Comprehensive Directory of Tools by Category\n`;

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

export function generateSeoHtmlAndSitemap(): { toolsCount: number; categoryHubsCount?: number; articlesCount?: number; sitemapUrlsCount: number } {
  console.log('[Zubware SEO] Starting static HTML SEO injection, llms.txt generation, and dynamic sitemap generation...');

  if (!fs.existsSync(distDir)) {
    throw new Error(`Dist directory not found at ${distDir}. Run vite build first.`);
  }

  const indexPath = path.join(distDir, 'index.html');
  if (!fs.existsSync(indexPath)) {
    throw new Error(`dist/index.html template not found at ${indexPath}`);
  }

  const rawIndexTemplate = fs.readFileSync(indexPath, 'utf-8');
  // Strip any pre-existing pre-rendered content from inside <div id="root">
  let pristineBaseHtml = rawIndexTemplate.replace(
    /<div id="root">[\s\S]*?(?=\s*<script\b|\s*<noscript\b|\s*<\/body>)/i,
    '<div id="root"></div>'
  );
  pristineBaseHtml = pristineBaseHtml.replace(/\s*<script id="json-ld-schema"[\s\S]*?<\/script>/g, '');
  pristineBaseHtml = pristineBaseHtml.replace(/\s*<meta name="keywords" content="[^"]*"\s*\/?>/g, '');
  pristineBaseHtml = pristineBaseHtml.replace(/\s*<meta name="robots" content="[^"]*"\s*\/?>/g, '');

  // Track all unique URLs for sitemap
  const sitemapUrls: Array<{ loc: string; priority: string; changefreq: string }> = [];

  // Add homepage (pre-rendered rich semantic HTML)
  const homeJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        'name': 'Zubware',
        'url': `${DOMAIN}/`,
        'potentialAction': {
          '@type': 'SearchAction',
          'target': `${DOMAIN}/?q={search_term_string}`,
          'query-input': 'required name=search_term_string'
        }
      },
      {
        '@type': 'Organization',
        'name': 'Zubware',
        'url': `${DOMAIN}/`,
        'logo': `${DOMAIN}/icon.png`,
        'description': 'Zubware is a multi-tool suite offering 300+ free online browser-based tools for PDF, images, developers, and productivity.'
      },
      {
        '@type': 'FAQPage',
        'mainEntity': HOMEPAGE_FAQS.map(faq => ({
          '@type': 'Question',
          'name': faq.question,
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': faq.answer
          }
        }))
      }
    ]
  };

  const homepageHtml = injectMetadataIntoHtml(pristineBaseHtml, {
    title: 'Zubware — Free Online Multi-Tool Suite | Fast & Private',
    description: 'Access 300+ free online tools for PDF, images, video, developers, calculators, and productivity. Fast, browser-based processing with local privacy.',
    canonicalUrl: `${DOMAIN}/`,
    keywords: 'free online tools, pdf tools, image compressor, json formatter, calculators, web developer tools, client side processing, zubware',
    jsonLdSchema: homeJsonLd,
    bodyContent: renderHomepageContent()
  });

  fs.writeFileSync(path.join(distDir, 'index.html'), homepageHtml, 'utf-8');

  sitemapUrls.push({
    loc: `${DOMAIN}/`,
    priority: '1.0',
    changefreq: 'daily'
  });

  // 1. Generate Categories Directory Page (/categories.html)
  const categoriesCanonical = `${DOMAIN}/categories.html`;
  const categoriesJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        'name': 'Zubware',
        'url': DOMAIN
      },
      {
        '@type': 'CollectionPage',
        'name': 'Tool Categories & Directory — Zubware',
        'url': categoriesCanonical,
        'description': 'Explore hundreds of browser-based utilities organized by domain with zero installation and fast client-side processing.'
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
            'name': 'Categories Directory',
            'item': categoriesCanonical
          }
        ]
      }
    ]
  };

  const categoriesHtml = injectMetadataIntoHtml(pristineBaseHtml, {
    title: 'Tool Categories & Complete Directory — Zubware',
    description: 'Browse our complete directory of 300+ free online browser utilities organized across 13 specialized domains with zero installation.',
    canonicalUrl: categoriesCanonical,
    keywords: 'tool directory, web tool categories, pdf tools list, image utilities, developer tools catalog, free browser utilities',
    jsonLdSchema: categoriesJsonLd,
    bodyContent: renderCategoriesPageContent()
  });

  fs.writeFileSync(path.join(distDir, 'categories.html'), categoriesHtml, 'utf-8');

  sitemapUrls.push({
    loc: categoriesCanonical,
    priority: '0.9',
    changefreq: 'weekly'
  });

  // 1b. Generate 13 Dedicated Category Authority Hub Pages (/category/[slug].html and /category/[slug]/index.html)
  const categoryDistDir = path.join(distDir, 'category');
  if (!fs.existsSync(categoryDistDir)) {
    fs.mkdirSync(categoryDistDir, { recursive: true });
  }

  const realCategories = CATEGORIES_DATA.filter(c => c.slug !== 'all');
  let categoryHubCount = 0;
  for (const cat of realCategories) {
    const catTools = TOOLS_DATA.filter(t => cat.match(t.category));
    const authMeta = CATEGORY_AUTHORITY_MAP[cat.slug];
    const catCanonical = `${DOMAIN}/category/${cat.slug}.html`;
    const catTitle = authMeta?.seoTitle || `${cat.defaultName} — Free Online Utilities | Zubware`;
    const baseDesc = authMeta?.metaDescription || `${cat.description} Explore free browser utilities with zero installation.`;
    const catDesc = baseDesc.replace(/^([A-Za-z]+)\s+/i, `$1 ${catTools.length} `);
    const catJsonLd = buildCategoryHubJsonLd(cat, catTools, catCanonical);
    const catBody = renderCategoryHubPageContent(cat, catTools);

    const catHtml = injectMetadataIntoHtml(pristineBaseHtml, {
      title: catTitle,
      description: catDesc,
      canonicalUrl: catCanonical,
      keywords: `${cat.defaultName.toLowerCase()}, free online tools, browser utilities, zubware`,
      jsonLdSchema: catJsonLd,
      bodyContent: catBody
    });

    const catSpecificDir = path.join(categoryDistDir, cat.slug);
    if (!fs.existsSync(catSpecificDir)) {
      fs.mkdirSync(catSpecificDir, { recursive: true });
    }

    fs.writeFileSync(path.join(categoryDistDir, `${cat.slug}.html`), catHtml, 'utf-8');
    fs.writeFileSync(path.join(catSpecificDir, 'index.html'), catHtml, 'utf-8');
    categoryHubCount++;

    sitemapUrls.push({
      loc: catCanonical,
      priority: '0.9',
      changefreq: 'weekly'
    });
  }

  // 2. Generate Static Pages (About, Privacy, Terms, Disclaimer, Contact)
  for (const page of STATIC_PAGES) {
    const canonicalUrl = `${DOMAIN}/${page.filename}`;
    const jsonLd = buildStaticPageJsonLd(page, canonicalUrl);
    const bodyContent = renderStaticPageContent(page);
    const html = injectMetadataIntoHtml(pristineBaseHtml, {
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

  // 3. Generate Tool Pages for all 307 active tools in TOOLS_DATA
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

    const html = injectMetadataIntoHtml(pristineBaseHtml, {
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

  // 4. Generate Blog Index & Blog Article Pages
  const blogDistDir = path.join(distDir, 'blog');
  if (!fs.existsSync(blogDistDir)) {
    fs.mkdirSync(blogDistDir, { recursive: true });
  }

  // 4a. Blog Index (/blog)
  const blogIndexCanonical = `${DOMAIN}/blog`;
  const blogIndexTitle = 'Guides, Tutorials & Best Practices — Zubware';
  const blogIndexDesc = 'Explore comprehensive guides on PDF compression, file optimization, image editing, and browser productivity workflows.';
  const blogIndexJsonLd = buildBlogIndexJsonLd(blogIndexCanonical);
  const blogIndexBody = renderBlogIndexContent();

  const blogIndexHtml = injectMetadataIntoHtml(pristineBaseHtml, {
    title: blogIndexTitle,
    description: blogIndexDesc,
    canonicalUrl: blogIndexCanonical,
    keywords: 'zubware guides, pdf compression guide, online tool tutorials, file optimization, browser productivity',
    jsonLdSchema: blogIndexJsonLd,
    bodyContent: blogIndexBody
  });

  fs.writeFileSync(path.join(distDir, 'blog.html'), blogIndexHtml, 'utf-8');
  fs.writeFileSync(path.join(blogDistDir, 'index.html'), blogIndexHtml, 'utf-8');

  sitemapUrls.push({
    loc: blogIndexCanonical,
    priority: '0.8',
    changefreq: 'weekly'
  });

  // 4b. Blog Articles (/blog/[slug])
  let articleCount = 0;
  for (const article of BLOG_ARTICLES) {
    const articleCanonical = `${DOMAIN}${article.canonicalPath}`;
    const articleKeywords = article.tags && article.tags.length > 0 ? article.tags.join(', ') : undefined;
    const articleJsonLd = buildBlogArticleJsonLd(article, articleCanonical);
    const articleBody = renderBlogArticleContent(article);

    const articleHtml = injectMetadataIntoHtml(pristineBaseHtml, {
      title: article.metaTitle,
      description: article.description,
      canonicalUrl: articleCanonical,
      keywords: articleKeywords,
      jsonLdSchema: articleJsonLd,
      bodyContent: articleBody,
      ogType: 'article'
    });

    const articleSpecificDir = path.join(blogDistDir, article.slug);
    if (!fs.existsSync(articleSpecificDir)) {
      fs.mkdirSync(articleSpecificDir, { recursive: true });
    }

    fs.writeFileSync(path.join(blogDistDir, `${article.slug}.html`), articleHtml, 'utf-8');
    fs.writeFileSync(path.join(articleSpecificDir, 'index.html'), articleHtml, 'utf-8');
    articleCount++;

    sitemapUrls.push({
      loc: articleCanonical,
      priority: '0.8',
      changefreq: 'monthly'
    });
  }

  // 5. Generate dynamic sitemap.xml
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

  // 6. Generate comprehensive llms.txt for machine readability
  const llmsTxtContent = generateLlmsTxt(TOOLS_DATA);
  fs.writeFileSync(path.join(distDir, 'llms.txt'), llmsTxtContent, 'utf-8');
  if (fs.existsSync(publicDir)) {
    fs.writeFileSync(path.join(publicDir, 'llms.txt'), llmsTxtContent, 'utf-8');
  }

  console.log(`[Zubware SEO] Successfully generated ${toolCount} tool HTML pages with semantic body content.`);
  console.log(`[Zubware SEO] Successfully generated ${STATIC_PAGES.length} static legal/info HTML pages.`);
  console.log(`[Zubware SEO] Successfully generated Categories Directory page at /categories.html.`);
  console.log(`[Zubware SEO] Successfully generated ${categoryHubCount} Category Authority Hub HTML pages.`);
  console.log(`[Zubware SEO] Successfully generated Blog Index and ${articleCount} Blog Article HTML pages.`);
  console.log(`[Zubware SEO] Generated sitemap.xml with ${sitemapUrls.length} total canonical URLs.`);
  console.log(`[Zubware SEO] Generated comprehensive llms.txt with all ${TOOLS_DATA.length} tools and guides.`);

  return {
    toolsCount: toolCount,
    categoryHubsCount: categoryHubCount,
    articlesCount: articleCount,
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
