import React, { useState, useRef } from 'react';
import JSZip from 'jszip';
import {
  Globe,
  Download,
  FileCode,
  FolderArchive,
  Eye,
  Settings,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Copy,
  Check,
  RefreshCw,
  ExternalLink,
  Code2,
  FileText,
  Layers,
  Image as ImageIcon,
  ShieldAlert,
  Sparkles,
  Search,
  Filter
} from 'lucide-react';

interface WebsiteDownloaderToolProps {
  onShowToast: (msg: string) => void;
  onNavigate?: (path: string) => void;
}

interface DiscoveredAsset {
  id: string;
  type: 'html' | 'css' | 'js' | 'image' | 'font' | 'favicon' | 'other';
  originalUrl: string;
  relativeZipPath: string;
  status: 'pending' | 'fetching' | 'success' | 'cors_blocked' | 'error' | 'inlined';
  sizeBytes?: number;
  content?: string | ArrayBuffer;
  selected: boolean;
  elementTag: string;
}

const SAMPLE_WEBSITES = [
  {
    name: 'W3C HTML5 Specification Sample',
    url: 'https://www.w3.org/StyleSheets/Core/Modernist',
    description: 'Permissive CORS W3C web resource for instant testing.'
  },
  {
    name: 'Wikipedia Article (CORS Friendly)',
    url: 'https://en.wikipedia.org/wiki/Main_Page',
    description: 'Public encyclopedia page with multiple styles and images.'
  },
  {
    name: 'Sample Starter Page (Internal Template)',
    url: 'sample-template',
    description: 'Pre-bundled modern HTML5 + CSS3 responsive template.'
  }
];

const DEFAULT_SAMPLE_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sample Modern Showcase</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.2.19/tailwind.min.css">
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; background: #0f172a; color: #f8fafc; }
    .hero-gradient { background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%); }
  </style>
</head>
<body class="p-8">
  <div class="max-w-3xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
    <div class="hero-gradient text-white p-6 rounded-2xl mb-6 text-center">
      <h1 class="text-3xl font-black mb-2">Welcome to Zubware Downloader</h1>
      <p class="text-indigo-100 text-sm">Download website assets, CSS, JavaScript, and HTML completely client-side.</p>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="p-4 bg-slate-800/80 rounded-xl border border-slate-700">
        <h3 class="font-bold text-indigo-400 mb-1">⚡ Fast & Local</h3>
        <p class="text-xs text-slate-300">Processes assets directly inside your browser memory without server hops.</p>
      </div>
      <div class="p-4 bg-slate-800/80 rounded-xl border border-slate-700">
        <h3 class="font-bold text-indigo-400 mb-1">📦 ZIP Packaging</h3>
        <p class="text-xs text-slate-300">All links rewritten to local relative paths for seamless offline viewing.</p>
      </div>
    </div>
    <div class="mt-6 text-center text-xs text-slate-500">
      Exported safely with Zubware in-browser website downloader.
    </div>
  </div>
</body>
</html>`;

export const WebsiteDownloaderTool: React.FC<WebsiteDownloaderToolProps> = ({ onShowToast }) => {
  // Input mode: 'url' or 'html'
  const [inputMode, setInputMode] = useState<'url' | 'html'>('url');
  const [targetUrl, setTargetUrl] = useState<string>('https://example.com');
  const [htmlInput, setHtmlInput] = useState<string>(DEFAULT_SAMPLE_HTML);
  const [baseUrlForHtml, setBaseUrlForHtml] = useState<string>('https://example.com');

  // Options
  const [rewritePaths, setRewritePaths] = useState<boolean>(true);
  const [includeReadme, setIncludeReadme] = useState<boolean>(true);
  const [includeImages, setIncludeImages] = useState<boolean>(true);
  const [includeStylesheets, setIncludeStylesheets] = useState<boolean>(true);
  const [includeScripts, setIncludeScripts] = useState<boolean>(true);
  const [includeFavicon, setIncludeFavicon] = useState<boolean>(true);

  // States
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [isDownloadingZip, setIsDownloadingZip] = useState<boolean>(false);
  const [discoveredAssets, setDiscoveredAssets] = useState<DiscoveredAsset[]>([]);
  const [parsedHtmlContent, setParsedHtmlContent] = useState<string>('');
  const [rewrittenHtmlContent, setRewrittenHtmlContent] = useState<string>('');
  const [scanStatusMessage, setScanStatusMessage] = useState<string>('');
  const [corsWarningVisible, setCorsWarningVisible] = useState<boolean>(false);
  const [corsErrorDetails, setCorsErrorDetails] = useState<string>('');

  // Active view tab: 'overview' | 'assets' | 'preview' | 'html_code' | 'cors_info'
  const [activeTab, setActiveTab] = useState<'overview' | 'assets' | 'preview' | 'html_code' | 'cors_info'>('overview');
  const [assetFilter, setAssetFilter] = useState<'all' | 'css' | 'js' | 'image' | 'font'>('all');
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  const previewIframeRef = useRef<HTMLIFrameElement>(null);

  // Helper to normalize and resolve absolute URL
  const resolveUrl = (relativeOrAbsolute: string, base: string): string => {
    try {
      const cleanRelative = relativeOrAbsolute.trim();
      if (cleanRelative.startsWith('//')) {
        return 'https:' + cleanRelative;
      }
      return new URL(cleanRelative, base).href;
    } catch {
      return relativeOrAbsolute;
    }
  };

  // Helper to generate a clean relative filename in ZIP
  const getZipRelativePath = (urlStr: string, type: DiscoveredAsset['type'], index: number): string => {
    try {
      const url = new URL(urlStr);
      const pathname = url.pathname;
      const originalName = pathname.split('/').pop() || '';
      const cleanName = originalName.split('?')[0].split('#')[0] || '';

      if (type === 'css') {
        const name = cleanName.endsWith('.css') ? cleanName : `style_${index + 1}.css`;
        return `assets/css/${name}`;
      }
      if (type === 'js') {
        const name = cleanName.endsWith('.js') ? cleanName : `script_${index + 1}.js`;
        return `assets/js/${name}`;
      }
      if (type === 'image' || type === 'favicon') {
        const ext = cleanName.match(/\.(png|jpg|jpeg|webp|gif|svg|ico|avif)$/i)?.[0] || '.png';
        const safeBase = cleanName.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_') || `image_${index + 1}`;
        return `assets/images/${safeBase}${ext}`;
      }
      if (type === 'font') {
        const ext = cleanName.match(/\.(woff2|woff|ttf|otf|eot)$/i)?.[0] || '.woff2';
        const safeBase = cleanName.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_') || `font_${index + 1}`;
        return `assets/fonts/${safeBase}${ext}`;
      }
      return `assets/other/file_${index + 1}`;
    } catch {
      return `assets/${type}/${type}_${index + 1}`;
    }
  };

  // Extract assets from HTML DOM
  const parseAndExtractAssets = (rawHtml: string, effectiveBaseUrl: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(rawHtml, 'text/html');

    const assets: DiscoveredAsset[] = [];
    const seenUrls = new Set<string>();

    // 1. Stylesheets (<link rel="stylesheet">)
    const stylesheetLinks = doc.querySelectorAll('link[rel="stylesheet"], link[rel="preload"][as="style"]');
    stylesheetLinks.forEach((link, idx) => {
      const href = link.getAttribute('href');
      if (href && !href.startsWith('data:')) {
        const absUrl = resolveUrl(href, effectiveBaseUrl);
        if (!seenUrls.has(absUrl)) {
          seenUrls.add(absUrl);
          assets.push({
            id: `css-${idx}-${Math.random().toString(36).substring(2, 7)}`,
            type: 'css',
            originalUrl: absUrl,
            relativeZipPath: getZipRelativePath(absUrl, 'css', idx),
            status: 'pending',
            selected: true,
            elementTag: 'link[rel=stylesheet]'
          });
        }
      }
    });

    // 2. JavaScript (<script src="...">)
    const scriptTags = doc.querySelectorAll('script[src]');
    scriptTags.forEach((script, idx) => {
      const src = script.getAttribute('src');
      if (src && !src.startsWith('data:')) {
        const absUrl = resolveUrl(src, effectiveBaseUrl);
        if (!seenUrls.has(absUrl)) {
          seenUrls.add(absUrl);
          assets.push({
            id: `js-${idx}-${Math.random().toString(36).substring(2, 7)}`,
            type: 'js',
            originalUrl: absUrl,
            relativeZipPath: getZipRelativePath(absUrl, 'js', idx),
            status: 'pending',
            selected: true,
            elementTag: 'script[src]'
          });
        }
      }
    });

    // 3. Images (<img>, <picture> <source>)
    const imgTags = doc.querySelectorAll('img[src], source[srcset]');
    imgTags.forEach((img, idx) => {
      const src = img.getAttribute('src') || img.getAttribute('srcset')?.split(' ')[0];
      if (src && !src.startsWith('data:')) {
        const absUrl = resolveUrl(src, effectiveBaseUrl);
        if (!seenUrls.has(absUrl)) {
          seenUrls.add(absUrl);
          assets.push({
            id: `img-${idx}-${Math.random().toString(36).substring(2, 7)}`,
            type: 'image',
            originalUrl: absUrl,
            relativeZipPath: getZipRelativePath(absUrl, 'image', idx),
            status: 'pending',
            selected: true,
            elementTag: 'img[src]'
          });
        }
      }
    });

    // 4. Favicons (<link rel="icon">, <link rel="apple-touch-icon">)
    const iconLinks = doc.querySelectorAll('link[rel="icon"], link[rel="shortcut icon"], link[rel="apple-touch-icon"]');
    iconLinks.forEach((icon, idx) => {
      const href = icon.getAttribute('href');
      if (href && !href.startsWith('data:')) {
        const absUrl = resolveUrl(href, effectiveBaseUrl);
        if (!seenUrls.has(absUrl)) {
          seenUrls.add(absUrl);
          assets.push({
            id: `fav-${idx}-${Math.random().toString(36).substring(2, 7)}`,
            type: 'favicon',
            originalUrl: absUrl,
            relativeZipPath: getZipRelativePath(absUrl, 'favicon', idx),
            status: 'pending',
            selected: true,
            elementTag: 'link[rel=icon]'
          });
        }
      }
    });

    // 5. Fonts (<link rel="preload" as="font">)
    const fontLinks = doc.querySelectorAll('link[as="font"]');
    fontLinks.forEach((font, idx) => {
      const href = font.getAttribute('href');
      if (href && !href.startsWith('data:')) {
        const absUrl = resolveUrl(href, effectiveBaseUrl);
        if (!seenUrls.has(absUrl)) {
          seenUrls.add(absUrl);
          assets.push({
            id: `font-${idx}-${Math.random().toString(36).substring(2, 7)}`,
            type: 'font',
            originalUrl: absUrl,
            relativeZipPath: getZipRelativePath(absUrl, 'font', idx),
            status: 'pending',
            selected: true,
            elementTag: 'link[as=font]'
          });
        }
      }
    });

    return { doc, assets };
  };

  // Perform URL scan and fetch
  const handleScanUrl = async () => {
    let url = targetUrl.trim();
    if (!url) {
      onShowToast('Please enter a valid website URL');
      return;
    }

    if (!/^https?:\/\//i.test(url)) {
      url = 'https://' + url;
      setTargetUrl(url);
    }

    setIsScanning(true);
    setCorsWarningVisible(false);
    setCorsErrorDetails('');
    setScanStatusMessage(`Connecting to ${url}...`);

    try {
      // Direct browser fetch
      const response = await fetch(url, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
      }

      const html = await response.text();
      setParsedHtmlContent(html);
      setScanStatusMessage('HTML fetched successfully! Parsing linked assets...');

      const { assets } = parseAndExtractAssets(html, url);
      setDiscoveredAssets(assets);
      setScanStatusMessage(`Discovered ${assets.length} linked resources (CSS, JS, Images, Fonts).`);
      onShowToast(`Analyzed successfully: ${assets.length} resources found.`);
      setActiveTab('overview');
    } catch (err: any) {
      console.warn('CORS or Network Fetch Exception:', err);
      setCorsWarningVisible(true);
      setCorsErrorDetails(err.message || 'Browser Cross-Origin Request (CORS) restriction blocked direct fetch.');
      setScanStatusMessage('Direct browser fetch blocked by target server CORS policy.');
      onShowToast('Direct URL fetch blocked by CORS. You can paste source HTML below.');
    } finally {
      setIsScanning(false);
    }
  };

  // Perform Direct HTML Scan
  const handleScanHtmlSource = () => {
    if (!htmlInput.trim()) {
      onShowToast('Please paste or upload HTML content to analyze');
      return;
    }

    setIsScanning(true);
    setCorsWarningVisible(false);
    setScanStatusMessage('Parsing provided HTML content...');

    try {
      const effectiveBase = baseUrlForHtml.trim() || 'https://example.com';
      setParsedHtmlContent(htmlInput);
      const { assets } = parseAndExtractAssets(htmlInput, effectiveBase);
      setDiscoveredAssets(assets);
      setScanStatusMessage(`Analyzed HTML: ${assets.length} linked resources detected.`);
      onShowToast(`Parsed HTML: ${assets.length} assets discovered.`);
      setActiveTab('overview');
    } catch (err: any) {
      onShowToast(`Error parsing HTML: ${err.message}`);
    } finally {
      setIsScanning(false);
    }
  };

  // Rewrite HTML links to relative ZIP paths
  const generateRewrittenHtml = (originalHtml: string, assets: DiscoveredAsset[], base: string): string => {
    if (!originalHtml) return '';
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(originalHtml, 'text/html');

      // Map from resolved absolute URL to local relative path
      const urlToRelativeMap = new Map<string, string>();
      assets.forEach((a) => {
        if (a.selected) {
          urlToRelativeMap.set(a.originalUrl, './' + a.relativeZipPath);
        }
      });

      if (rewritePaths) {
        // Rewrite Stylesheets
        doc.querySelectorAll('link[rel="stylesheet"]').forEach((link) => {
          const href = link.getAttribute('href');
          if (href) {
            const abs = resolveUrl(href, base);
            if (urlToRelativeMap.has(abs)) {
              link.setAttribute('href', urlToRelativeMap.get(abs)!);
            }
          }
        });

        // Rewrite Scripts
        doc.querySelectorAll('script[src]').forEach((script) => {
          const src = script.getAttribute('src');
          if (src) {
            const abs = resolveUrl(src, base);
            if (urlToRelativeMap.has(abs)) {
              script.setAttribute('src', urlToRelativeMap.get(abs)!);
            }
          }
        });

        // Rewrite Images
        doc.querySelectorAll('img[src]').forEach((img) => {
          const src = img.getAttribute('src');
          if (src) {
            const abs = resolveUrl(src, base);
            if (urlToRelativeMap.has(abs)) {
              img.setAttribute('src', urlToRelativeMap.get(abs)!);
            }
          }
        });

        // Rewrite Favicons
        doc.querySelectorAll('link[rel="icon"], link[rel="shortcut icon"], link[rel="apple-touch-icon"]').forEach((icon) => {
          const href = icon.getAttribute('href');
          if (href) {
            const abs = resolveUrl(href, base);
            if (urlToRelativeMap.has(abs)) {
              icon.setAttribute('href', urlToRelativeMap.get(abs)!);
            }
          }
        });
      }

      // Add a helpful meta generator tag
      const metaTag = doc.createElement('meta');
      metaTag.name = 'generator';
      metaTag.content = 'Zubware In-Browser Website Downloader';
      doc.head.prepend(metaTag);

      return '<!DOCTYPE html>\n' + doc.documentElement.outerHTML;
    } catch {
      return originalHtml;
    }
  };

  // Fetch all selected assets and compile into ZIP
  const handleDownloadZipPackage = async () => {
    const effectiveHtml = parsedHtmlContent || htmlInput;
    if (!effectiveHtml.trim()) {
      onShowToast('No website HTML to download. Please scan a URL or paste HTML first.');
      return;
    }

    setIsDownloadingZip(true);
    onShowToast('Starting client-side asset download & ZIP compilation...');

    const base = inputMode === 'url' ? targetUrl : baseUrlForHtml;
    const zip = new JSZip();

    let successCount = 0;
    let blockedCount = 0;
    let totalBytes = 0;

    // 1. Fetch assets in parallel batches
    const updatedAssets = [...discoveredAssets];

    for (let i = 0; i < updatedAssets.length; i++) {
      const asset = updatedAssets[i];
      if (!asset.selected) continue;

      // Filter by user options
      if (asset.type === 'css' && !includeStylesheets) continue;
      if (asset.type === 'js' && !includeScripts) continue;
      if (asset.type === 'image' && !includeImages) continue;
      if (asset.type === 'favicon' && !includeFavicon) continue;

      asset.status = 'fetching';
      setDiscoveredAssets([...updatedAssets]);

      try {
        const res = await fetch(asset.originalUrl, { mode: 'cors' });
        if (!res.ok) throw new Error(`Status ${res.status}`);

        if (asset.type === 'css' || asset.type === 'js' || asset.type === 'html') {
          const textData = await res.text();
          asset.content = textData;
          asset.sizeBytes = new Blob([textData]).size;
          asset.status = 'success';
          zip.file(asset.relativeZipPath, textData);
          totalBytes += asset.sizeBytes;
          successCount++;
        } else {
          const arrayBuffer = await res.arrayBuffer();
          asset.content = arrayBuffer;
          asset.sizeBytes = arrayBuffer.byteLength;
          asset.status = 'success';
          zip.file(asset.relativeZipPath, arrayBuffer);
          totalBytes += asset.sizeBytes;
          successCount++;
        }
      } catch (err) {
        console.warn(`Could not fetch asset ${asset.originalUrl}:`, err);
        asset.status = 'cors_blocked';
        blockedCount++;
      }
      setDiscoveredAssets([...updatedAssets]);
    }

    // 2. Generate updated index.html with rewritten paths
    const finalHtml = generateRewrittenHtml(effectiveHtml, updatedAssets, base);
    setRewrittenHtmlContent(finalHtml);
    zip.file('index.html', finalHtml);
    totalBytes += new Blob([finalHtml]).size;

    // 3. Add informative README.txt
    if (includeReadme) {
      const hostname = (() => {
        try {
          return new URL(base).hostname;
        } catch {
          return 'website';
        }
      })();

      const readmeContent = `=====================================================
Zubware Website Downloader — Package Summary
=====================================================
Target URL / Source: ${base}
Export Date: ${new Date().toISOString()}
Downloaded with: Zubware (100% Client-Side In-Browser Tool)

PACKAGE CONTENTS:
-----------------------------------------------------
- index.html (Main entry page with rewritten local asset links)
- assets/css/ (Downloaded CSS stylesheets)
- assets/js/ (Downloaded JavaScript files)
- assets/images/ (Downloaded images, icons, favicons)
- assets/fonts/ (Downloaded web fonts)

ASSET STATISTICS:
-----------------------------------------------------
Total Discovered Assets: ${updatedAssets.length}
Successfully Bundled: ${successCount} files
CORS Blocked / External: ${blockedCount} files (left as external URLs)
Approx. Total Size: ${(totalBytes / 1024).toFixed(1)} KB

INSTRUCTIONS:
-----------------------------------------------------
1. Extract all files from this ZIP archive to a folder on your computer.
2. Double-click "index.html" to open the offline website in any web browser.
3. All relative paths are configured for offline execution.

NOTE ON CORS & EXTERNAL ASSETS:
Due to modern browser security (Same-Origin Policy), assets whose servers 
explicitly forbid cross-origin downloads are maintained as online absolute 
links inside index.html so they still render when connected to the internet.
=====================================================`;
      zip.file('README.txt', readmeContent);
    }

    try {
      // 4. Generate and trigger download
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const downloadUrl = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      const safeDomain = (() => {
        try {
          return new URL(base).hostname.replace(/[^a-zA-Z0-9.-]/g, '_');
        } catch {
          return 'website';
        }
      })();

      a.href = downloadUrl;
      a.download = `${safeDomain}-website-download.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(downloadUrl);

      onShowToast(`ZIP downloaded! (${(zipBlob.size / 1024).toFixed(1)} KB)`);
    } catch (err: any) {
      onShowToast(`Error compiling ZIP: ${err.message}`);
    } finally {
      setIsDownloadingZip(false);
    }
  };

  // Copy HTML to clipboard
  const handleCopyHtml = () => {
    const contentToCopy = rewrittenHtmlContent || parsedHtmlContent || htmlInput;
    navigator.clipboard.writeText(contentToCopy);
    setCopiedCode(true);
    onShowToast('Copied HTML to clipboard!');
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Download raw single HTML file
  const handleDownloadSingleHtml = () => {
    const content = rewrittenHtmlContent || parsedHtmlContent || htmlInput;
    if (!content) return;
    const blob = new Blob([content], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `index-${Date.now()}.html`;
    a.click();
    URL.revokeObjectURL(url);
    onShowToast('Downloaded index.html!');
  };

  const filteredAssets = discoveredAssets.filter((a) => {
    if (assetFilter === 'all') return true;
    return a.type === assetFilter;
  });

  const successCount = discoveredAssets.filter((a) => a.status === 'success').length;
  const blockedCount = discoveredAssets.filter((a) => a.status === 'cors_blocked').length;

  return (
    <div className="p-4 sm:p-8 space-y-6 text-slate-900 dark:text-slate-100">
      {/* Top Banner / Heading */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400">
              <Globe className="w-6 h-6" />
            </span>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                Website Downloader & Asset Extractor
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                100% Client-Side In-Browser Website Downloader & ZIP Packager with Link Rewriting.
              </p>
            </div>
          </div>
        </div>

        {/* Input Mode Selector Tabs */}
        <div className="flex items-center bg-slate-200/70 dark:bg-slate-800/70 p-1 rounded-2xl shrink-0 self-start md:self-auto">
          <button
            onClick={() => setInputMode('url')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
              inputMode === 'url'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>URL Fetch Mode</span>
          </button>
          <button
            onClick={() => setInputMode('html')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
              inputMode === 'html'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>Direct HTML / Source Mode</span>
          </button>
        </div>
      </div>

      {/* Main Input Configuration Card */}
      <div className="glass-card p-5 sm:p-6 rounded-3xl space-y-5">
        {inputMode === 'url' ? (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">
                Target Website URL to Download
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Globe className="w-4 h-4" />
                  </div>
                  <input
                    type="url"
                    value={targetUrl}
                    onChange={(e) => setTargetUrl(e.target.value)}
                    placeholder="https://example.com"
                    className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono shadow-sm"
                  />
                </div>
                <button
                  onClick={handleScanUrl}
                  disabled={isScanning}
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm rounded-2xl transition-all shadow-md hover:shadow-indigo-500/20 flex items-center justify-center gap-2 shrink-0"
                >
                  {isScanning ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Scanning Site...</span>
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4" />
                      <span>Scan & Analyze Site</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Quick Demo Links */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">Quick Test Samples:</span>
              {SAMPLE_WEBSITES.map((sample, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    if (sample.url === 'sample-template') {
                      setInputMode('html');
                      setHtmlInput(DEFAULT_SAMPLE_HTML);
                      onShowToast('Loaded sample starter template in Source Mode');
                    } else {
                      setTargetUrl(sample.url);
                      onShowToast(`Selected ${sample.name}`);
                    }
                  }}
                  className="text-[11px] px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg text-slate-600 dark:text-slate-300 font-medium transition-colors border border-slate-200/60 dark:border-slate-700/60"
                >
                  {sample.name}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">
                  Paste Website HTML Source (from View-Source or DevTools)
                </label>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">
                  Original Base URL (for resolving relative links)
                </label>
                <input
                  type="url"
                  value={baseUrlForHtml}
                  onChange={(e) => setBaseUrlForHtml(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="relative">
              <textarea
                value={htmlInput}
                onChange={(e) => setHtmlInput(e.target.value)}
                rows={7}
                placeholder="<!DOCTYPE html><html><head>...</head><body>...</body></html>"
                className="w-full p-4 bg-slate-950 text-slate-200 border border-slate-800 rounded-2xl font-mono text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-inner"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={() => setHtmlInput(DEFAULT_SAMPLE_HTML)}
                className="text-xs text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
              >
                Reset to Sample HTML
              </button>
              <button
                onClick={handleScanHtmlSource}
                disabled={isScanning}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center gap-2"
              >
                {isScanning ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                <span>Parse & Extract Assets</span>
              </button>
            </div>
          </div>
        )}

        {/* Status Message or Scanner Log */}
        {scanStatusMessage && (
          <div className="p-3.5 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-800/60 text-xs text-indigo-900 dark:text-indigo-300 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
              <span className="font-medium">{scanStatusMessage}</span>
            </div>
          </div>
        )}

        {/* CORS Explanation & Direct Source Helper Alert */}
        {corsWarningVisible && (
          <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 space-y-3">
            <div className="flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-1 text-xs">
                <h4 className="font-bold text-sm text-amber-700 dark:text-amber-300">
                  Target Website Blocked by Browser CORS Policy (Same-Origin Policy)
                </h4>
                <p className="leading-relaxed">
                  Web browsers enforce strict security that prevents direct JavaScript cross-origin fetching unless the target server sends permissive headers (<code className="bg-amber-200/50 dark:bg-amber-900/50 px-1 py-0.5 rounded">Access-Control-Allow-Origin: *</code>).
                </p>
                <div className="pt-2 flex flex-wrap items-center gap-2">
                  <span className="font-bold">100% Working Solution:</span>
                  <button
                    onClick={() => {
                      setInputMode('html');
                      setBaseUrlForHtml(targetUrl);
                      setCorsWarningVisible(false);
                      onShowToast('Switched to Direct Source Mode. Paste page HTML above.');
                    }}
                    className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs transition-all shadow-sm flex items-center gap-1.5"
                  >
                    <FileCode className="w-3.5 h-3.5" />
                    <span>Switch to Direct HTML Mode (Paste View-Source)</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Packaging Configuration Options */}
        <div className="border-t border-slate-200/70 dark:border-slate-800/70 pt-4 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
            <Settings className="w-4 h-4" />
            <span>Download & ZIP Packaging Options</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
            <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-100/70 dark:bg-slate-800/50 cursor-pointer hover:bg-slate-200/70 dark:hover:bg-slate-800 transition-colors">
              <input
                type="checkbox"
                checked={rewritePaths}
                onChange={(e) => setRewritePaths(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
              />
              <span className="font-medium text-slate-700 dark:text-slate-300">Rewrite Local Paths</span>
            </label>

            <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-100/70 dark:bg-slate-800/50 cursor-pointer hover:bg-slate-200/70 dark:hover:bg-slate-800 transition-colors">
              <input
                type="checkbox"
                checked={includeStylesheets}
                onChange={(e) => setIncludeStylesheets(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
              />
              <span className="font-medium text-slate-700 dark:text-slate-300">Include CSS</span>
            </label>

            <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-100/70 dark:bg-slate-800/50 cursor-pointer hover:bg-slate-200/70 dark:hover:bg-slate-800 transition-colors">
              <input
                type="checkbox"
                checked={includeScripts}
                onChange={(e) => setIncludeScripts(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
              />
              <span className="font-medium text-slate-700 dark:text-slate-300">Include JS</span>
            </label>

            <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-100/70 dark:bg-slate-800/50 cursor-pointer hover:bg-slate-200/70 dark:hover:bg-slate-800 transition-colors">
              <input
                type="checkbox"
                checked={includeImages}
                onChange={(e) => setIncludeImages(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
              />
              <span className="font-medium text-slate-700 dark:text-slate-300">Include Images</span>
            </label>

            <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-100/70 dark:bg-slate-800/50 cursor-pointer hover:bg-slate-200/70 dark:hover:bg-slate-800 transition-colors">
              <input
                type="checkbox"
                checked={includeFavicon}
                onChange={(e) => setIncludeFavicon(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
              />
              <span className="font-medium text-slate-700 dark:text-slate-300">Include Favicons</span>
            </label>

            <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-100/70 dark:bg-slate-800/50 cursor-pointer hover:bg-slate-200/70 dark:hover:bg-slate-800 transition-colors">
              <input
                type="checkbox"
                checked={includeReadme}
                onChange={(e) => setIncludeReadme(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
              />
              <span className="font-medium text-slate-700 dark:text-slate-300">Add README Report</span>
            </label>
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            {discoveredAssets.length > 0 ? (
              <span>
                <strong>{discoveredAssets.length}</strong> total resources discovered ({discoveredAssets.filter((a) => a.selected).length} selected)
              </span>
            ) : (
              <span>Ready to analyze target webpage</span>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleDownloadSingleHtml}
              className="px-4 py-2.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5"
            >
              <FileCode className="w-4 h-4" />
              <span>Export HTML Only</span>
            </button>

            <button
              onClick={handleDownloadZipPackage}
              disabled={isDownloadingZip}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-lg hover:shadow-emerald-500/20 flex items-center gap-2"
            >
              {isDownloadingZip ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Packaging ZIP...</span>
                </>
              ) : (
                <>
                  <FolderArchive className="w-4 h-4" />
                  <span>Download Full Website ZIP</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center border-b border-slate-200 dark:border-slate-800 gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'overview'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Overview & Summary</span>
        </button>

        <button
          onClick={() => setActiveTab('assets')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'assets'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <FolderArchive className="w-4 h-4" />
          <span>Asset Inventory ({discoveredAssets.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('preview')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'preview'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Eye className="w-4 h-4" />
          <span>Live In-Browser Preview</span>
        </button>

        <button
          onClick={() => setActiveTab('html_code')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'html_code'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Code2 className="w-4 h-4" />
          <span>HTML Source Code</span>
        </button>

        <button
          onClick={() => setActiveTab('cors_info')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'cors_info'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>CORS & Privacy Guide</span>
        </button>
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="glass-card p-4 rounded-2xl">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Total Assets</span>
              <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                {discoveredAssets.length}
              </div>
              <span className="text-[11px] text-slate-400">Discovered in DOM</span>
            </div>

            <div className="glass-card p-4 rounded-2xl">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Stylesheets (CSS)</span>
              <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1">
                {discoveredAssets.filter((a) => a.type === 'css').length}
              </div>
              <span className="text-[11px] text-slate-400">External & embedded</span>
            </div>

            <div className="glass-card p-4 rounded-2xl">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Scripts (JS)</span>
              <div className="text-2xl font-black text-amber-500 mt-1">
                {discoveredAssets.filter((a) => a.type === 'js').length}
              </div>
              <span className="text-[11px] text-slate-400">Script tags</span>
            </div>

            <div className="glass-card p-4 rounded-2xl">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Images & Media</span>
              <div className="text-2xl font-black text-emerald-500 mt-1">
                {discoveredAssets.filter((a) => a.type === 'image' || a.type === 'favicon').length}
              </div>
              <span className="text-[11px] text-slate-400">PNG, JPG, SVG, ICO</span>
            </div>
          </div>

          {/* Planned ZIP Structure Tree */}
          <div className="glass-card p-5 sm:p-6 rounded-3xl space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FolderArchive className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              Generated ZIP Directory Structure Preview
            </h3>

            <div className="bg-slate-950 text-slate-200 p-4 rounded-2xl font-mono text-xs leading-relaxed overflow-x-auto">
              <div className="text-indigo-400 font-bold">📦 website-download.zip/</div>
              <div className="pl-4">
                <div>├── 📄 <span className="text-emerald-400 font-bold">index.html</span> <span className="text-slate-500">(Rewritten entrypoint with offline relative paths)</span></div>
                <div>├── 📄 <span className="text-amber-400 font-bold">README.txt</span> <span className="text-slate-500">(Metadata report & asset inventory)</span></div>
                <div>├── 📁 <span className="text-sky-400 font-bold">assets/</span></div>
                <div className="pl-6">
                  <div>├── 📁 <span className="text-indigo-400">css/</span> <span className="text-slate-500">({discoveredAssets.filter((a) => a.type === 'css').length} styles)</span></div>
                  <div>├── 📁 <span className="text-amber-400">js/</span> <span className="text-slate-500">({discoveredAssets.filter((a) => a.type === 'js').length} scripts)</span></div>
                  <div>├── 📁 <span className="text-emerald-400">images/</span> <span className="text-slate-500">({discoveredAssets.filter((a) => a.type === 'image' || a.type === 'favicon').length} images)</span></div>
                  <div>└── 📁 <span className="text-purple-400">fonts/</span> <span className="text-slate-500">({discoveredAssets.filter((a) => a.type === 'font').length} web fonts)</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Asset Inventory Table */}
      {activeTab === 'assets' && (
        <div className="glass-card p-5 sm:p-6 rounded-3xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs">
                {(['all', 'css', 'js', 'image', 'font'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setAssetFilter(filter)}
                    className={`px-3 py-1 rounded-lg uppercase font-bold text-[10px] transition-all ${
                      assetFilter === filter
                        ? 'bg-indigo-600 text-white'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const updated = discoveredAssets.map((a) => ({ ...a, selected: true }));
                  setDiscoveredAssets(updated);
                  onShowToast('Selected all assets');
                }}
                className="text-xs text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
              >
                Select All
              </button>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <button
                onClick={() => {
                  const updated = discoveredAssets.map((a) => ({ ...a, selected: false }));
                  setDiscoveredAssets(updated);
                  onShowToast('Deselected all assets');
                }}
                className="text-xs text-slate-500 dark:text-slate-400 font-bold hover:underline"
              >
                Deselect All
              </button>
            </div>
          </div>

          {filteredAssets.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs">
              No assets discovered matching this filter.
            </div>
          ) : (
            <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-2xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 uppercase font-bold text-[10px]">
                  <tr>
                    <th className="p-3.5 w-10">Select</th>
                    <th className="p-3.5">Type</th>
                    <th className="p-3.5">Original URL</th>
                    <th className="p-3.5">Local ZIP Path</th>
                    <th className="p-3.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-mono">
                  {filteredAssets.map((asset) => (
                    <tr key={asset.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="p-3.5">
                        <input
                          type="checkbox"
                          checked={asset.selected}
                          onChange={(e) => {
                            const updated = discoveredAssets.map((a) =>
                              a.id === asset.id ? { ...a, selected: e.target.checked } : a
                            );
                            setDiscoveredAssets(updated);
                          }}
                          className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                        />
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                            asset.type === 'css'
                              ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300'
                              : asset.type === 'js'
                              ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                              : asset.type === 'image' || asset.type === 'favicon'
                              ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                              : 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300'
                          }`}
                        >
                          {asset.type}
                        </span>
                      </td>
                      <td className="p-3.5 max-w-xs truncate text-slate-600 dark:text-slate-400">
                        <a
                          href={asset.originalUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="hover:text-indigo-600 dark:hover:text-indigo-400 inline-flex items-center gap-1"
                        >
                          <span className="truncate">{asset.originalUrl}</span>
                          <ExternalLink className="w-3 h-3 shrink-0 opacity-60" />
                        </a>
                      </td>
                      <td className="p-3.5 text-slate-700 dark:text-slate-300">
                        {asset.relativeZipPath}
                      </td>
                      <td className="p-3.5">
                        {asset.status === 'success' && (
                          <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Downloaded
                          </span>
                        )}
                        {asset.status === 'cors_blocked' && (
                          <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 text-[11px] font-bold">
                            <AlertTriangle className="w-3.5 h-3.5" /> CORS Restricted
                          </span>
                        )}
                        {asset.status === 'fetching' && (
                          <span className="inline-flex items-center gap-1 text-indigo-600 dark:text-indigo-400 text-[11px] font-bold">
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Fetching
                          </span>
                        )}
                        {asset.status === 'pending' && (
                          <span className="text-slate-400 text-[11px]">Ready</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Live In-Browser Sandbox Preview */}
      {activeTab === 'preview' && (
        <div className="glass-card p-5 sm:p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Eye className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              Sandboxed Render Preview
            </h3>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Rendered safely inside an isolated sandboxed iframe.
            </span>
          </div>

          <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-950 shadow-inner">
            <iframe
              ref={previewIframeRef}
              srcDoc={rewrittenHtmlContent || parsedHtmlContent || htmlInput}
              title="Website Preview"
              sandbox="allow-scripts"
              className="w-full h-[450px] border-0"
            />
          </div>
        </div>
      )}

      {/* Tab 4: HTML Source Code Inspector */}
      {activeTab === 'html_code' && (
        <div className="glass-card p-5 sm:p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Code2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              Rewritten HTML Code (index.html)
            </h3>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyHtml}
                className="px-3 py-1.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? 'Copied' : 'Copy HTML'}</span>
              </button>
            </div>
          </div>

          <pre className="p-4 bg-slate-950 text-slate-200 rounded-2xl font-mono text-xs overflow-x-auto max-h-[500px] border border-slate-800">
            <code>{rewrittenHtmlContent || parsedHtmlContent || htmlInput}</code>
          </pre>
        </div>
      )}

      {/* Tab 5: CORS & Privacy Guide */}
      {activeTab === 'cors_info' && (
        <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-6 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
            <span className="p-2.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
              <ShieldAlert className="w-6 h-6" />
            </span>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Understanding Browser Security (CORS) & Client-Side Privacy
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                How Zubware runs 100% locally inside your browser without backend proxy servers.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
              <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Zero Server Uploads & 100% Privacy
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Traditional website downloaders run proxy servers that secretly mirror your requests and collect data. Zubware processes everything in client-side Web Workers, memory, and JSZip — no third-party server ever sees what you are analyzing.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
              <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                Why does CORS block some URLs?
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Modern web browsers enforce Cross-Origin Resource Sharing (CORS) to protect user accounts from unauthorized scraping. If a target website does not send permissive CORS headers, your browser prevents client-side code from reading its response directly.
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 space-y-3">
            <h4 className="font-bold text-indigo-900 dark:text-indigo-300 text-sm">
              💡 How to Download ANY Website with Direct Source Mode:
            </h4>
            <ol className="list-decimal list-inside space-y-2 text-xs text-indigo-950 dark:text-indigo-200">
              <li>
                Open the target website in any browser tab, right-click, and select <strong>"View Page Source"</strong> (or press <kbd className="bg-indigo-200/50 dark:bg-indigo-900/50 px-1 rounded font-mono">Ctrl + U</kbd> / <kbd className="bg-indigo-200/50 dark:bg-indigo-900/50 px-1 rounded font-mono">Cmd + U</kbd>).
              </li>
              <li>
                Copy the entire HTML markup (<kbd className="bg-indigo-200/50 dark:bg-indigo-900/50 px-1 rounded font-mono">Ctrl + A</kbd> then <kbd className="bg-indigo-200/50 dark:bg-indigo-900/50 px-1 rounded font-mono">Ctrl + C</kbd>).
              </li>
              <li>
                Switch to <strong>"Direct HTML / Source Mode"</strong> in Zubware, paste the HTML code, provide the original URL, and click <strong>"Download Full Website ZIP"</strong>.
              </li>
              <li>
                Zubware will automatically parse the HTML, extract all CSS/JS/Image resources, rewrite all references into relative paths, and package them into an offline-ready ZIP archive!
              </li>
            </ol>
          </div>
        </div>
      )}
    </div>
  );
};
