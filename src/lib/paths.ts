export const BASE_URL = (typeof import.meta !== 'undefined' && import.meta.env?.BASE_URL) || '/';

export const BASE_PATH = BASE_URL === '/' ? '' : BASE_URL.replace(/\/$/, '');

/**
 * Returns a full clean href suitable for <a> tags.
 * Example: getLinkUrl('/image-compressor.html') => '/image-compressor'
 * Example: getLinkUrl('/about.html') => '/about'
 */
export function getLinkUrl(path?: string): string {
  if (!path || path === '/' || path === '/index.html') {
    return BASE_URL;
  }
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('mailto:')) {
    // If it's an internal absolute URL to zubware.com, strip trailing .html from web pages
    return path.replace(/(https?:\/\/(?:www\.)?zubware\.com\/[a-zA-Z0-9_-]+)\.html(\?.*)?$/g, '$1$2');
  }
  let cleanPath = path.startsWith('/') ? path : '/' + path;
  // Clean trailing .html from web routes (keep index.html as root, don't strip static assets)
  if (cleanPath.endsWith('.html') && cleanPath !== '/index.html' && cleanPath !== '/404.html') {
    cleanPath = cleanPath.slice(0, -5);
  }
  if (BASE_PATH && cleanPath.toLowerCase().startsWith(BASE_PATH.toLowerCase())) {
    return cleanPath;
  }
  return `${BASE_PATH}${cleanPath}`;
}

/**
 * Normalizes a full browser pathname into an internal route path.
 */
export function normalizePath(pathname?: string): string {
  if (!pathname) return '/';
  let p = pathname;
  if (BASE_PATH && p.toLowerCase().startsWith(BASE_PATH.toLowerCase())) {
    p = p.slice(BASE_PATH.length);
  }
  if (!p.startsWith('/')) {
    p = '/' + p;
  }
  // Strip trailing .html from route matching (except index.html)
  if (p.endsWith('.html') && p !== '/index.html' && p !== '/404.html') {
    p = p.slice(0, -5);
  }
  return p === '' ? '/' : p;
}

/**
 * Single source of truth for tool canonical paths.
 * Guarantees that tools with ID/slug mismatches (such as 'image-color-picker' -> '/color-picker')
 * always resolve to their correct, clean public canonical route without extensions.
 */
export function getToolCanonicalPath(toolOrId: { id?: string; filename?: string; path?: string } | string | null | undefined): string {
  if (!toolOrId) return '/';

  // If a string was provided (e.g. tool ID or path)
  if (typeof toolOrId === 'string') {
    const raw = toolOrId.trim().replace(/^\//, '').replace(/\.html$/, '');
    if (raw === 'image-color-picker') return '/color-picker';
    return `/${raw}`;
  }

  // Known tool ID override
  if (toolOrId.id === 'image-color-picker') {
    return '/color-picker';
  }

  // Derive from filename if present (e.g. 'color-picker.html' -> '/color-picker')
  if (toolOrId.filename && toolOrId.filename !== 'index.html') {
    const cleanFromFilename = toolOrId.filename.replace(/^\//, '').replace(/\.html$/, '');
    if (cleanFromFilename) return `/${cleanFromFilename}`;
  }

  // Derive from path if present (e.g. '/color-picker.html' -> '/color-picker')
  if (toolOrId.path && toolOrId.path !== '/' && toolOrId.path !== '/index.html') {
    const cleanFromPath = toolOrId.path.replace(/^\//, '').replace(/\.html$/, '');
    if (cleanFromPath) return `/${cleanFromPath}`;
  }

  // Fallback to id
  if (toolOrId.id) {
    if (toolOrId.id === 'image-color-picker') return '/color-picker';
    const cleanFromId = toolOrId.id.replace(/^\//, '').replace(/\.html$/, '');
    return `/${cleanFromId}`;
  }

  return '/';
}

/**
 * Returns the full canonical absolute URL for a tool.
 * Example: getToolCanonicalUrl('image-color-picker') => 'https://www.zubware.com/color-picker'
 */
export function getToolCanonicalUrl(toolOrId: { id?: string; filename?: string; path?: string } | string | null | undefined): string {
  const path = getToolCanonicalPath(toolOrId);
  return `https://www.zubware.com${path}`;
}

export const NETWORK_DEPENDENT_TOOL_IDS = new Set([
  'api-request-builder',
  'website-downloader',
  'http-header-viewer'
]);

/**
 * Returns intent-focused, search-optimized How-To headings for priority tools.
 */
export function getToolHowToHeading(tool: { id: string; title: string; navTitle?: string }): string {
  const specificHeadings: Record<string, string> = {
    'pdf-merge': 'How to Merge Multiple PDF Files Into One',
    'pdf-split': 'How to Split a PDF Into Separate Pages',
    'image-compressor': 'How to Compress Images to 20KB, 50KB, 100KB or 200KB',
    'image-resizer': 'How to Resize an Image Without Losing Its Aspect Ratio',
    'ats-resume-checker': 'How to Check if Your Resume Is ATS-Friendly',
    'json-validator': 'How to Validate JSON and Fix Syntax Errors',
    'qr-generator': 'How to Create a QR Code From a URL or Text',
    'image-color-picker': 'How to Sample HEX and RGB Colors From an Image',
    'image-splitter-merger': 'How to Split or Combine Images in Your Browser',
    'resume-builder': 'How to Build a Professional Resume Online',
    'gst-invoice-generator': 'How to Generate GST-Compliant Invoices Online',
    'learning-licence-mock-test': 'How to Practice for the Driving Learning Licence Exam Online'
  };

  return specificHeadings[tool.id] || `How to Use ${tool.navTitle || tool.title}`;
}

/**
 * Returns a high-quality, intent-answering first paragraph for tool pages.
 */
export function getToolIntroParagraph(tool: { id: string; title: string; navTitle?: string; description: string; category: string }): string {
  const isNetwork = NETWORK_DEPENDENT_TOOL_IDS.has(tool.id);

  const priorityIntros: Record<string, string> = {
    'pdf-merge':
      'Zubware PDF Merge combines multiple separate PDF documents into a single organized file directly in your browser. Whether you need to compile contracts, scanned receipts, academic assignments, or business reports, you can reorder pages by dragging and dropping multiple files simultaneously. All merging executes locally using client-side WebAssembly and pdf-lib, ensuring your confidential documents are never uploaded to remote servers.',
    'pdf-split':
      'Zubware PDF Split extracts specific pages, custom ranges, or separates every individual page from your PDF document into standalone files. Ideal for extracting signed agreement pages or downsizing large multi-chapter reports, it processes files locally in your browser memory with zero server uploads.',
    'image-compressor':
      'Zubware Image Compressor reduces the byte size of JPG, PNG, and WebP images to exact targets such as 20KB, 50KB, 100KB, or 200KB without noticeable quality loss. Designed for government exam application forms, passport submissions, and fast-loading web graphics, all compression algorithms run locally in your browser canvas without uploading images to any external server.',
    'image-resizer':
      'Zubware Image Resizer modifies image dimensions by exact pixels, percentage, or predefined social media and document presets while preserving original aspect ratios. Designed for photo portals, profile pictures, and banners, resizing happens instantly on your device via HTML5 canvas with zero server uploads.',
    'ats-resume-checker':
      'Zubware ATS Resume Checker inspects your resume against Applicant Tracking System criteria, identifying layout flaws, missing industry keywords, and formatting issues that cause rejection by corporate parsers. Get detailed scoring, section-by-section feedback, and keyword density analysis processed securely in your browser.',
    'json-validator':
      'Zubware JSON Validator verifies JSON syntax, highlights parse errors with exact line and column numbers, and formats messy code into readable indented structures. Ideal for API debugging and configuration audits, all validation and formatting execute locally in your browser with zero data retention.',
    'qr-generator':
      'Zubware QR Code Generator produces high-resolution vector and raster QR codes from URLs, contact vCards, Wi-Fi credentials, and plain text. Customize foreground and background colors, adjust error correction levels for high readability, and download print-ready PNG or SVG files generated instantly on your device.',
    'image-color-picker':
      'Zubware Color Picker extracts exact pixel color values from any photo, UI screenshot, or graphic with a real-time 9x magnifying loupe. You can inspect and copy colors across HEX, RGB, HSL, HSV, and CMYK formats, while clicked swatches are automatically saved to your session palette. All pixel sampling runs locally in browser memory.',
    'image-splitter-merger':
      'Zubware Image Splitter & Combiner slices images cleanly along any vertical or horizontal line, or merges two images into a seamless composite directly in your browser. With real-time seam positioning and auto-trim padding options, processing executes completely in client memory with zero server uploads.',
    'resume-builder':
      'Zubware Resume Builder creates professional, ATS-formatted resumes with real-time typography previews, structured work history sections, and one-click PDF export. All resume data is stored locally in your browser without requiring account creation.',
    'gst-invoice-generator':
      'Zubware GST Invoice Generator creates compliant tax invoices with automatic CGST, SGST, IGST calculations, HSN/SAC codes, and instant PDF download. Built for small business owners and freelancers, financial calculation and PDF rendering occur client-side.',
    'learning-licence-mock-test':
      'Zubware Learning Licence Mock Test simulates the official RTO computer exam with questions covering mandatory traffic signs, road regulations, and driving rules. Available in bilingual English and Hindi with an optional 15-minute timer and instant score review.'
  };

  if (priorityIntros[tool.id]) {
    return priorityIntros[tool.id];
  }

  const cleanCat = tool.category.replace(/^[^\w]+/, '').trim();
  const privacyNote = isNetwork
    ? 'Requests communicate directly from your browser to designated external endpoints without server logging.'
    : 'All processing takes place client-side in browser memory with zero server uploads.';

  return `${tool.title} provides dedicated online capabilities for ${cleanCat.toLowerCase()} workflows. ${tool.description} ${privacyNote}`;
}


