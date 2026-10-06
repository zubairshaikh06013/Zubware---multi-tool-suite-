import React, { useState } from 'react';
import { ToolMeta, FAQItem } from '../types';
import { ChevronDown, ShieldCheck, Zap, HardDrive, CheckCircle2, ArrowRight, BookOpen } from 'lucide-react';
import { getLinkUrl, getToolCanonicalPath, getToolHowToHeading, getToolIntroParagraph, NETWORK_DEPENDENT_TOOL_IDS } from '../lib/paths';
import { BLOG_ARTICLES } from '../data/blogArticles';
import { getRelatedTools, getMatchingGuidesForTool } from '../lib/workflowMap';
import { ToolIcon } from './common/ToolIcon';

interface ToolSEOContentProps {
  tool: ToolMeta;
  allTools: ToolMeta[];
  onNavigate: (path: string) => void;
}

export const ToolSEOContent: React.FC<ToolSEOContentProps> = ({
  tool,
  allTools,
  onNavigate
}) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const isNetworkTool = NETWORK_DEPENDENT_TOOL_IDS.has(tool.id);

  // Generate dynamic FAQs if not provided on tool object
  const defaultFaqs: FAQItem[] = [
    {
      question: `Is ${tool.navTitle} free to use?`,
      answer: `This Zubware tool is available to use in your browser. Availability of features and limits can vary by tool.`
    },
    {
      question: `How does ${tool.navTitle} handle data and privacy?`,
      answer: isNetworkTool
        ? `${tool.title} communicates directly with the specified external endpoints from your browser. Zubware does not store your payload data or requests on our servers.`
        : `Processing happens locally in your browser for this tool; files and data are not uploaded to Zubware servers.`
    },
    {
      question: `Which file formats and devices are supported by ${tool.navTitle}?`,
      answer: `${tool.title} works on Windows, macOS, Linux, iOS, and Android. It supports standard modern web file formats and runs in Chrome, Safari, Firefox, and Edge.`
    },
    {
      question: `How fast is processing with ${tool.navTitle}?`,
      answer: isNetworkTool
        ? `Processing speed depends on network latency and the response time of the target endpoint.`
        : `Processing is performed in your browser on your device's engine, eliminating server upload queues.`
    }
  ];

  const faqsToUse = tool.faq && tool.faq.length > 0 ? tool.faq : defaultFaqs;

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

  const howToSteps = tool.howTo && tool.howTo.length > 0
    ? tool.howTo
    : isFileTool
    ? [
        { title: 'Select or Drag Files', desc: `Open ${tool.title} in your browser and select or drop your files into the workspace.` },
        { title: 'Configure Settings', desc: `Adjust parameters, formats, dimensions, compression levels, or custom preferences.` },
        { title: 'Export & Download', desc: `Generate your processed output directly in your browser memory and save it to your device.` }
      ]
    : isCalcOrConverter
    ? [
        { title: 'Enter Your Values', desc: `Input your starting numbers, amounts, or parameters into ${tool.title}.` },
        { title: 'Select Options', desc: `Choose desired units, calculation modes, or conversion preferences.` },
        { title: 'View & Copy Results', desc: `Inspect real-time calculated results computed instantly in your browser.` }
      ]
    : [
        { title: 'Input or Configure Data', desc: `Enter or paste your text, code, or parameters into ${tool.title}.` },
        { title: 'Process or Generate', desc: `Execute the tool with your selected configuration options.` },
        { title: 'Copy or Save Output', desc: `Copy the formatted output or save the resulting file directly to your device.` }
      ];

  // Filter related tools with workflow clustering
  const relatedTools = getRelatedTools(tool, allTools, 6);

  // Find matching blog articles / guides
  const matchingGuides = getMatchingGuidesForTool(tool, BLOG_ARTICLES, 2);

  return (
    <div className="mt-12 space-y-12">
      
      {/* 1. ANSWER-FIRST SECTION (AEO - Generative AI & Search Engine Optimization) */}
      <section className="glass-panel p-6 sm:p-10 rounded-3xl space-y-6">
        <div className="border-b border-slate-200/60 dark:border-slate-800/60 pb-4">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
            Overview & Value Proposition
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            What is {tool.title}?
          </h2>
        </div>

        {/* Direct Answer Paragraph for AI Overviews / Snippets */}
        <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed bg-indigo-50/50 dark:bg-indigo-950/30 p-5 rounded-2xl border border-indigo-100 dark:border-indigo-900/50">
          {getToolIntroParagraph(tool)}
        </p>

        {/* Extended Description */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" /> Key Capability Highlights
            </h3>
            <ul className="space-y-2">
              {tool.features.map((feat, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" /> Privacy & Execution Architecture
            </h3>
            {isNetworkTool ? (
              <>
                <p>
                  {tool.navTitle} connects directly from your browser to the specified external endpoint.
                </p>
                <p>
                  Your requests and payloads are not recorded, intercepted, or stored on Zubware servers.
                </p>
              </>
            ) : (
              <>
                <p>
                  Processing happens locally in your browser for this tool; files and inputs are not uploaded to Zubware servers.
                </p>
                <p>
                  Execution is handled directly by your browser engine using modern Web APIs, avoiding server upload bottlenecks and latency.
                </p>
              </>
            )}
          </div>
        </div>
      </section>

      {/* 2. SPECIFICATIONS & SUPPORTED FORMATS */}
      <section className="glass-panel p-6 sm:p-8 rounded-3xl">
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mb-6">
          Technical Specifications & Supported Formats
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="glass-card p-4 rounded-2xl">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold block uppercase">Category</span>
            <span className="text-sm font-bold text-slate-900 dark:text-white mt-1 block">{tool.category.replace(/^[^\w]+/, '')}</span>
          </div>
          <div className="glass-card p-4 rounded-2xl">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold block uppercase">Execution Engine</span>
            <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-1 block">
              {isNetworkTool ? 'Browser (Direct API)' : 'Client Browser'}
            </span>
          </div>
          <div className="glass-card p-4 rounded-2xl">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold block uppercase">Cost / License</span>
            <span className="text-sm font-bold text-slate-900 dark:text-white mt-1 block">Free to Use</span>
          </div>
          <div className="glass-card p-4 rounded-2xl">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold block uppercase">Server Uploads</span>
            <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400 mt-1 block">
              {isNetworkTool ? 'Direct to API Host' : 'None (Browser-Side)'}
            </span>
          </div>
        </div>
      </section>

      {/* 3. STEP-BY-STEP HOW TO USE */}
      <section className="glass-panel p-6 sm:p-10 rounded-3xl">
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-6">
          {getToolHowToHeading(tool)}
        </h2>
        <ol className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {howToSteps.map((step, idx) => (
            <li key={idx} className="glass-card p-6 rounded-2xl relative">
              <span className="w-8 h-8 rounded-full bg-indigo-600 text-white font-black text-sm flex items-center justify-center mb-4">
                {idx + 1}
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">{step.title}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {step.desc}
              </p>
            </li>
          ))}
        </ol>
      </section>

      {/* 3.5 DEDICATED IMAGE COMPRESSOR IN-DEPTH GUIDE (Targeting High-Intent Regional & Global Queries) */}
      {tool.id === 'image-compressor' && (
        <section className="glass-panel p-6 sm:p-10 rounded-3xl space-y-8 border border-indigo-200/50 dark:border-indigo-900/40">
          <div className="border-b border-slate-200/60 dark:border-slate-800/60 pb-4">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
              Complete Practical Guide &amp; Portal Instructions
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              Photo Ka Size Kaise Kam Kare? (Reduce Photo Size to 20KB, 50KB or 100KB)
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card p-6 rounded-2xl space-y-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="text-indigo-600">🎯</span> Compress Images for Government &amp; Exam Portals
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Most major online portals in India—including <strong>SSC (CGL, CHSL, MTS), UPSC, State PSC, IBPS Bank PO, Railway RRB, NEET, JEE, and Passport Seva</strong>—strictly mandate that candidate photographs must be between <strong>20 KB to 50 KB</strong> and scanned signatures under <strong>20 KB (or 10 KB)</strong>. Uploading files exceeding these thresholds causes immediate form rejection.
              </p>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                With Zubware's <strong>By Target Size (KB)</strong> mode, you simply select the <strong>20 KB</strong> or <strong>50 KB</strong> preset. The engine automatically optimizes quality and resolution so your file fits precisely under the required upload ceiling.
              </p>
            </div>

            <div className="glass-card p-6 rounded-2xl space-y-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="text-indigo-600">📱</span> Mobile Mein Photo Ka Size Kaise Kam Kare?
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Aapko mobile mein photo compress karne ke liye kisi heavy application ya shady APK ko install karne ki zaroorat nahi hai. Seedhe apne mobile browser (Chrome, Safari, ya Firefox) mein Zubware open karein:
              </p>
              <ul className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-2 list-disc list-inside">
                <li><strong>Step 1:</strong> Phone gallery se apni passport photo ya document select karein.</li>
                <li><strong>Step 2:</strong> <strong>Target Size (20KB, 50KB ya 100KB)</strong> chunein.</li>
                <li><strong>Step 3:</strong> <strong>Compress</strong> par tap karein aur turant download karein.</li>
              </ul>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Poori processing aapke mobile device ke browser memory mein hoti hai; photo internet par kisi server par upload nahi hoti.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card p-6 rounded-2xl space-y-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="text-indigo-600">🖼️</span> Reduce JPG, PNG &amp; WebP Image Size
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Zubware provides smart compression tuned for each specific image format:
              </p>
              <ul className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-2">
                <li>
                  <strong>JPG / JPEG:</strong> Uses lossy discrete cosine transform (DCT) optimization to discard imperceptible color data. Ideal for portraits, camera photos, and exam forms.
                </li>
                <li>
                  <strong>PNG:</strong> Applies palette quantization and lossless DEFLATE compression to maintain crisp transparent logos and signatures without background artifacts.
                </li>
                <li>
                  <strong>WebP:</strong> Modern web standard that delivers 25%–35% smaller file sizes than comparable JPG files while retaining high visual fidelity.
                </li>
              </ul>
            </div>

            <div className="glass-card p-6 rounded-2xl space-y-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="text-emerald-500">🔒</span> 100% Private Browser Execution (Zero Server Upload)
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Traditional online image compression websites require uploading your personal documents, ID cards, and signatures to their remote cloud servers, posing significant privacy and security hazards.
              </p>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Zubware Image Compressor operates completely inside your local browser memory using <strong>HTML5 Canvas and WebAssembly</strong>. Your files are decoded, compressed, and encoded directly on your CPU/GPU, ensuring your sensitive data never leaves your device.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* 3.6 DEDICATED PDF COMPRESSOR IN-DEPTH GUIDE (Targeting High-Intent Regional & Global Queries) */}
      {tool.id === 'pdf-compressor' && (
        <section className="glass-panel p-6 sm:p-10 rounded-3xl space-y-8 border border-indigo-200/50 dark:border-indigo-900/40">
          <div className="border-b border-slate-200/60 dark:border-slate-800/60 pb-4">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
              Complete Practical Guide &amp; Document Instructions
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              PDF Ka Size Kaise Kam Kare? (How to Reduce PDF File Size Online)
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card p-6 rounded-2xl space-y-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="text-indigo-600">🎯</span> Compress PDFs for Exam Portals, Job Forms &amp; Admissions
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Many online application systems—such as government recruitment portals (UPSC, SSC, State PSC, IBPS, Railways), university admissions, and visa processing services—enforce strict document upload ceilings (typically <strong>1 MB, 2 MB, or 5 MB</strong>). Uploading a 15 MB scanned certificate or portfolio results in immediate submission errors.
              </p>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                With Zubware's <strong>Extreme Compression</strong> and <strong>Recommended (Medium)</strong> presets, you can swiftly reduce bloated PDF documents down to compliant thresholds while preserving crisp textual legibility for reviewing officials.
              </p>
            </div>

            <div className="glass-card p-6 rounded-2xl space-y-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="text-indigo-600">📱</span> Mobile Mein PDF Ka Size Kaise Kam Kare?
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Mobile par PDF file compress karne ke liye aapko kisi suspicious app ya subscription-based tool ki zaroorat nahi hai. Seedhe apne smartphone browser (Chrome ya Safari) mein Zubware open karein:
              </p>
              <ul className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-2 list-disc list-inside">
                <li><strong>Step 1:</strong> Apne phone storage ya Files app se PDF document select karein.</li>
                <li><strong>Step 2:</strong> <strong>Recommended</strong> (~50%-65% savings) ya <strong>Extreme</strong> (~70%-85% savings) preset chunein.</li>
                <li><strong>Step 3:</strong> <strong>Compress PDF Now</strong> tap karein aur optimized file turant download karein.</li>
              </ul>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Poori processing aapke mobile device ke local browser memory mein hoti hai; document internet par upload nahi hota.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card p-6 rounded-2xl space-y-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="text-indigo-600">🗜️</span> Understanding Compression Levels: Recommended, Extreme &amp; Light
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Zubware PDF Compressor gives you three calibrated compression profiles to suit different document needs:
              </p>
              <ul className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-2">
                <li>
                  <strong>Recommended (Medium):</strong> Delivers ~50% to 65% size reduction. Balances aggressive image optimization with high visual clarity—ideal for resumes, contracts, and email attachments.
                </li>
                <li>
                  <strong>Extreme (Maximum Savings):</strong> Delivers ~70% to 85% size reduction. Uses strong downsampling on large embedded photos and background scans—best for tight portal upload limits.
                </li>
                <li>
                  <strong>Light (High Quality):</strong> Delivers ~20% to 35% size reduction. Streamlines font subsets, removes redundant metadata, and keeps original high-resolution graphic details intact.
                </li>
              </ul>
            </div>

            <div className="glass-card p-6 rounded-2xl space-y-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="text-emerald-500">🔒</span> 100% Private In-Browser Execution (Zero Server Upload)
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Most commercial PDF utilities transfer your documents to remote cloud servers for rendering, raising serious privacy concerns for bank statements, tax forms, salary slips, and confidential contracts.
              </p>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Zubware PDF Compressor processes documents 100% locally inside your browser memory using <strong>client-side JavaScript &amp; WebAssembly</strong>. Your files are decoded and re-encoded on your device, ensuring complete confidentiality.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* 3.7 DEDICATED QR CODE GENERATOR IN-DEPTH GUIDE (Targeting High-Intent Regional & Global Queries) */}
      {tool.id === 'qr-generator' && (
        <section className="glass-panel p-6 sm:p-10 rounded-3xl space-y-8 border border-indigo-200/50 dark:border-indigo-900/40">
          <div className="border-b border-slate-200/60 dark:border-slate-800/60 pb-4">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
              Complete Practical Guide &amp; Usage Instructions
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              QR Code Kaise Banaye? (How to Create a QR Code Online)
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card p-6 rounded-2xl space-y-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="text-indigo-600">🌐</span> Create a QR Code From a URL or Website Link
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Whether you need a QR code for your business website, portfolio, Google Drive document, YouTube video, or restaurant menu, generating one takes seconds. Simply paste your complete web link (e.g., <code>https://example.com</code>) into the input box. The matrix updates in real time.
              </p>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Because these are direct static QR codes, your URL is encoded directly into the matrix without third-party redirect links. Your QR codes remain active forever and will never break or expire.
              </p>
            </div>

            <div className="glass-card p-6 rounded-2xl space-y-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="text-indigo-600">📱</span> QR Code Kaise Banaye? (Website Link &amp; Text Guide)
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Website link ya kisi bhi text ka QR code banana behad aasan hai:
              </p>
              <ul className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-2 list-disc list-inside">
                <li><strong>Step 1:</strong> Content tab mein apni website ka link ya plain text enter karein.</li>
                <li><strong>Step 2:</strong> Design tab mein custom colors ya center brand logo choose karein.</li>
                <li><strong>Step 3:</strong> Live preview ko apne mobile camera se scan karke verify karein.</li>
                <li><strong>Step 4:</strong> <strong>PNG</strong>, <strong>Vector SVG</strong>, ya <strong>Printable A4 PDF</strong> par click karke save karein.</li>
              </ul>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Poora process aapke browser memory mein hota hai; kisi account signup ya subscription ki bilkul zaroorat nahi hai.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card p-6 rounded-2xl space-y-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="text-indigo-600">🎨</span> High-Resolution PNG, Scalable SVG &amp; Print-Ready PDF
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Choose the exact format suited for your medium:
              </p>
              <ul className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-2">
                <li>
                  <strong>PNG Image:</strong> Crisp raster graphics perfect for social media posts, email signatures, presentation slides, and websites.
                </li>
                <li>
                  <strong>Vector SVG:</strong> Scalable mathematical vector format ideal for graphic designers, commercial printing, billboards, stickers, and packaging without pixelation.
                </li>
                <li>
                  <strong>A4 Print PDF:</strong> Pre-centered print sheet ready for physical display on office counters, tables, trade show booths, or posters.
                </li>
              </ul>
            </div>

            <div className="glass-card p-6 rounded-2xl space-y-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="text-emerald-500">🔒</span> 100% Client-Side Privacy (Zero Server Storage &amp; No Watermark)
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Many online QR generators store your sensitive links on remote servers, force account registration, inject watermarks, or deactivate your QR codes after 14 days unless you pay.
              </p>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Zubware operates 100% locally in your browser using HTML5 Canvas. Your URLs, passwords, Wi-Fi credentials, and contact details never leave your device. All generated QR codes are permanent, completely unwatermarked, and free forever.
              </p>
            </div>
          </div>

          {/* Internal links related cluster */}
          <div className="glass-card p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <span>🔗</span> Explore Related Generator Tools &amp; Security Guides
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
              <a
                href="/category/generators"
                className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 transition-all block text-xs group"
              >
                <span className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 block mb-1">
                  Online Generator Tools →
                </span>
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                  Browse all barcode, UUID, hash, and QR generators.
                </span>
              </a>
              <a
                href="/barcode-generator"
                className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 transition-all block text-xs group"
              >
                <span className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 block mb-1">
                  Free Barcode Generator →
                </span>
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                  Generate Code 128, EAN-13, and UPC-A linear barcodes.
                </span>
              </a>
              <a
                href="/qr-code-safety-checker"
                className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 transition-all block text-xs group"
              >
                <span className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 block mb-1">
                  QR Code Safety Checker →
                </span>
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                  Audit QR codes for phishing, malware, and redirect safety.
                </span>
              </a>
              <a
                href="/blog/qr-code-security-phishing-prevention"
                className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 transition-all block text-xs group"
              >
                <span className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 block mb-1">
                  QR Security &amp; Quishing Guide →
                </span>
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                  Learn how to identify malicious QR codes before scanning.
                </span>
              </a>
            </div>
          </div>
        </section>
      )}

      {/* 3.8 DEDICATED RESUME BUILDER IN-DEPTH GUIDE (Targeting High-Intent Regional & Global Queries) */}
      {tool.id === 'resume-builder' && (
        <section className="glass-panel p-6 sm:p-10 rounded-3xl space-y-8 border border-indigo-200/50 dark:border-indigo-900/40">
          <div className="border-b border-slate-200/60 dark:border-slate-800/60 pb-4">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
              Complete Career Guide &amp; Resume Instructions
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              Resume Kaise Banaye? (How to Build a Professional Resume Online)
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card p-6 rounded-2xl space-y-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="text-indigo-600">🎯</span> ATS-Friendly Resume Formatting That Passes Job Filters
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Over 75% of job applications are scanned by Applicant Tracking Systems (ATS) such as Workday, Taleo, Greenhouse, and Lever before ever reaching a human recruiter. Resumes with multi-layered text boxes, fancy background graphics, unreadable fonts, or non-standard tables often get scrambled or discarded.
              </p>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Zubware Resume Builder utilizes single-column and clean two-column layouts with standard font hierarchies, crisp section headings (Summary, Experience, Education, Skills), and clean bullet structure. The built-in <strong>ATS Checklist &amp; Action Verbs</strong> tab guides you to ensure all essential job application metrics are covered.
              </p>
            </div>

            <div className="glass-card p-6 rounded-2xl space-y-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="text-indigo-600">📱</span> Mobile Aur Computer Par Resume Kaise Banaye?
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Apne smartphone ya laptop par bina kisi paid app ya complicated software ke professional resume banana behad aasan hai:
              </p>
              <ul className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-2 list-disc list-inside">
                <li><strong>Step 1:</strong> Personal Information mein apna naam, targeted job role, phone, email aur location fill karein.</li>
                <li><strong>Step 2:</strong> Work Experience aur Education enter karein; strong action verbs ke sath apne achievements describe karein.</li>
                <li><strong>Step 3:</strong> <strong>Templates</strong> tab se Modern, Classic, ya ATS Clean layout select karein.</li>
                <li><strong>Step 4:</strong> <strong>Download PDF</strong> button par tap karein aur print-ready CV turant save karein.</li>
              </ul>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Poori processing aapke device ke browser memory mein hoti hai; na kisi registration ki zaroorat hai aur na koi hidden charge.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card p-6 rounded-2xl space-y-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="text-indigo-600">🎓</span> Resume Format For Freshers &amp; Career Starters
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                If you are a college graduate or career changer without years of corporate experience, your resume should emphasize education, practical projects, technical skills, and certifications rather than an empty employment history.
              </p>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                With Zubware's <strong>Order &amp; Sections</strong> manager, you can effortlessly move your Education, Academic Projects, and Core Skills above Work Experience. You can also click <strong>Load Sample</strong> to see how an optimized resume structure looks and edit it with your own details.
              </p>
            </div>

            <div className="glass-card p-6 rounded-2xl space-y-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="text-emerald-500">🔒</span> 100% Private In-Browser Auto-Save (Zero Server Upload)
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Many online resume services lock your download behind an unexpected subscription paywall, sell your contact details to recruitment agencies, or store your private career history on third-party servers.
              </p>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Zubware operates 100% locally in your device's browser memory. Your resume is automatically auto-saved in your browser's private local storage. You can create multiple resume versions, download unwatermarked PDFs, and export full JSON backups for lifetime offline ownership.
              </p>
            </div>
          </div>

          {/* Internal links related cluster */}
          <div className="glass-card p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <span>🔗</span> Explore Related Career &amp; Resume Optimization Tools
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
              <a
                href="/ats-resume-checker"
                className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 transition-all block text-xs group"
              >
                <span className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 block mb-1">
                  ATS Resume Checker →
                </span>
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                  Audit your resume against ATS criteria, keyword density, and formatting rules.
                </span>
              </a>
              <a
                href="/cover-letter-builder"
                className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 transition-all block text-xs group"
              >
                <span className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 block mb-1">
                  Cover Letter Builder →
                </span>
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                  Draft matching job application cover letters with structured sections.
                </span>
              </a>
              <a
                href="/cv-builder"
                className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 transition-all block text-xs group"
              >
                <span className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 block mb-1">
                  Free CV Maker →
                </span>
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                  Build multi-page academic, research, and executive Curriculum Vitae documents.
                </span>
              </a>
              <a
                href="/resume-keyword-optimizer"
                className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 transition-all block text-xs group"
              >
                <span className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 block mb-1">
                  Resume Keyword Optimizer →
                </span>
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                  Match your resume bullet points directly against specific job descriptions.
                </span>
              </a>
            </div>
          </div>
        </section>
      )}

      {/* 3.9 DEDICATED ATS RESUME CHECKER IN-DEPTH GUIDE (Targeting High-Intent Regional & Global Queries) */}
      {tool.id === 'ats-resume-checker' && (
        <section className="glass-panel p-6 sm:p-10 rounded-3xl space-y-8 border border-indigo-200/50 dark:border-indigo-900/40">
          <div className="border-b border-slate-200/60 dark:border-slate-800/60 pb-4">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
              Complete ATS Audit &amp; Optimization Guide
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              Resume ATS Score Kaise Check Kare? (How to Check Your ATS Compatibility Online)
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card p-6 rounded-2xl space-y-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="text-indigo-600">🤖</span> What Is an ATS Resume Checker?
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                An <strong>Applicant Tracking System (ATS)</strong> is recruitment software utilized by enterprise companies, startups, and recruitment agencies (such as Workday, Taleo, Greenhouse, iCIMS, and Lever) to organize, filter, and rank incoming job applicants. Before a human hiring manager reads your resume, the ATS scans the document for specific job qualifications, technical skills, and educational thresholds.
              </p>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                An ATS resume checker evaluates how well automated parsers can read your document, highlights missing core keywords from the job description, and identifies formatting pitfalls (such as missing contact details or sparse content density) that cause applications to be filtered out prematurely.
              </p>
            </div>

            <div className="glass-card p-6 rounded-2xl space-y-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="text-indigo-600">📊</span> What Does an ATS Resume Score Mean?
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Zubware calculates a transparent, multi-dimensional <strong>ATS Match Score (0–100%)</strong> by evaluating your resume against your targeted job posting across four weighted pillars:
              </p>
              <ul className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-1.5 list-disc list-inside">
                <li><strong>Technical Skills Match (45%):</strong> Compares required hard skills, tools, and technical competencies found in both documents.</li>
                <li><strong>Title &amp; Experience Alignment (25%):</strong> Evaluates how well your past job titles and experience scope match the target vacancy.</li>
                <li><strong>Soft Skills &amp; Leadership (15%):</strong> Detects essential interpersonal, communication, and management keywords.</li>
                <li><strong>Formatting &amp; Contact Safety (15%):</strong> Verifies legible email formatting, phone numbers, and sufficient text volume.</li>
              </ul>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                A score of 80%+ represents high keyword alignment, 60%–79% indicates moderate coverage, and below 60% highlights critical gaps needing tailoring.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card p-6 rounded-2xl space-y-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="text-indigo-600">📱</span> Resume ATS Score Kaise Check Kare? (Step-by-Step Guide)
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Apne mobile phone ya computer par resume ATS-friendly hai ya nahi check karna behad aasan hai:
              </p>
              <ul className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-2 list-disc list-inside">
                <li><strong>Step 1:</strong> <strong>Upload PDF / Text Resume</strong> par click karke apna resume select karein ya text paste karein.</li>
                <li><strong>Step 2:</strong> Target job vacancy ka title aur full requirements description paste karein.</li>
                <li><strong>Step 3:</strong> <strong>Scan ATS Match Compatibility</strong> button par tap karein.</li>
                <li><strong>Step 4:</strong> Apna ATS score, <strong>Matched Keywords</strong>, aur <strong>Missing Keywords</strong> review karein.</li>
                <li><strong>Step 5:</strong> Missing skills ko resume bullet points mein add karein aur <strong>Export ATS Match Report</strong> par click karein.</li>
              </ul>
            </div>

            <div className="glass-card p-6 rounded-2xl space-y-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="text-emerald-500">🔒</span> 100% In-Browser Privacy (Zero Server Upload)
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Your resume contains sensitive personally identifiable information (PII) including your full legal name, home address, personal phone number, email, and detailed employment record.
              </p>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Unlike commercial resume scanners that store your career history on remote cloud servers or sell candidate databases to third-party headhunters, <strong>Zubware ATS Resume Checker operates 100% locally inside your web browser</strong>. All PDF text parsing, keyword tokenization, and match calculations occur in device memory. No data is ever transmitted to Zubware servers.
              </p>
            </div>
          </div>

          {/* Internal links related cluster */}
          <div className="glass-card p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <span>🔗</span> Explore Related Career &amp; Application Tools
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
              <a
                href="/resume-builder"
                className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 transition-all block text-xs group"
              >
                <span className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 block mb-1">
                  Free Resume Builder →
                </span>
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                  Build an ATS-compliant resume with 20 templates and instant PDF download.
                </span>
              </a>
              <a
                href="/resume-keyword-optimizer"
                className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 transition-all block text-xs group"
              >
                <span className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 block mb-1">
                  Resume Keyword Optimizer →
                </span>
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                  Match individual resume bullet points against job description keywords.
                </span>
              </a>
              <a
                href="/cover-letter-builder"
                className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 transition-all block text-xs group"
              >
                <span className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 block mb-1">
                  Cover Letter Builder →
                </span>
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                  Draft tailored job cover letters matching your resume style.
                </span>
              </a>
              <a
                href="/cv-builder"
                className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 transition-all block text-xs group"
              >
                <span className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 block mb-1">
                  Free CV Maker →
                </span>
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                  Generate multi-page academic, research, and international CV formats.
                </span>
              </a>
            </div>
          </div>
        </section>
      )}

      {/* 3.10 DEDICATED SIGNATURE RESIZER IN-DEPTH GUIDE (Targeting Indian Recruitment, Exam & Job Portals) */}
      {tool.id === 'signature-resizer' && (
        <section className="glass-panel p-6 sm:p-10 rounded-3xl space-y-8 border border-indigo-200/50 dark:border-indigo-900/40">
          <div className="border-b border-slate-200/60 dark:border-slate-800/60 pb-4">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
              Comprehensive Examination &amp; Recruitment Portal Guide
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              Signature Resizer for Online Forms: SSC, UPSC, IBPS, NEET &amp; State PSCs
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card p-6 rounded-2xl space-y-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="text-indigo-600">📋</span> Official Exam Portal Dimension &amp; File Size Guidelines
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Indian government recruitment and entrance exam portals strictly enforce signature dimension and file size criteria. Uploading images outside these exact thresholds causes automated application rejection:
              </p>
              <ul className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-2 list-disc list-inside">
                <li><strong>SSC (CGL, CHSL, MTS, GD, Steno):</strong> 140 × 60 pixels, 10 KB to 20 KB, JPG format.</li>
                <li><strong>UPSC (Civil Services IAS, NDA, CDS):</strong> Minimum 350 × 350 pixels, 20 KB to 300 KB, clear white background.</li>
                <li><strong>IBPS &amp; SBI (PO, Clerk, SO):</strong> 140 × 60 pixels, 10 KB to 20 KB, black ink on white paper.</li>
                <li><strong>NTA NEET &amp; JEE Main:</strong> 4 cm × 2 cm (approx. 140 × 70 pixels), 4 KB to 30 KB, JPG/JPEG.</li>
                <li><strong>Railway RRB (ALP, NTPC, Group D):</strong> 140 × 60 pixels, 10 KB to 20 KB, JPG format.</li>
                <li><strong>State PSCs (UPPSC, BPSC, MPSC, TNPSC):</strong> Typically 140 × 60 px or 200 × 100 px, 10 KB to 50 KB.</li>
              </ul>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Use Zubware's instant presets to set these exact pixel dimensions in a single click.
              </p>
            </div>

            <div className="glass-card p-6 rounded-2xl space-y-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="text-indigo-600">📱</span> Signature Ka Size Kaise Kam Kare? (Under 20KB Guide)
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Mobile phone se kheenchi gayi signature photo ka size aamtaur par 1MB se 5MB tak hota hai. Exam portal ke liye use 10KB se 20KB mein convert karna behad aasan hai:
              </p>
              <ul className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-2 list-disc list-inside">
                <li><strong>Step 1:</strong> Apne phone camera se plain white paper par kiye signature ki photo upload karein.</li>
                <li><strong>Step 2:</strong> <strong>Exam Form (140 × 60 px)</strong> preset select karein ya custom px enter karein.</li>
                <li><strong>Step 3:</strong> <strong>&ldquo;Auto-crop empty edges&rdquo;</strong> ko check karein taaki faltu white margin cut jaye.</li>
                <li><strong>Step 4:</strong> Target File Size Limit mein <strong>&ldquo;&lt; 20 KB&rdquo;</strong> par click karein.</li>
                <li><strong>Step 5:</strong> <strong>Download</strong> par click karke portal-ready JPG file save karein.</li>
              </ul>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Poori process browser memory mein chalti hai; kisi registration ya software download ki zaroorat nahi hai.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card p-6 rounded-2xl space-y-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="text-indigo-600">⚙️</span> Auto-Crop, Unit Conversions (cm/mm/px) &amp; Adaptive Quality
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Zubware provides precision controls built specifically for real-world document preparation:
              </p>
              <ul className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-2">
                <li>
                  <strong>Auto-Crop Empty Margins:</strong> Automatically identifies the bounding coordinates of dark ink strokes and trims surrounding empty white paper, ensuring your signature fills the application box cleanly.
                </li>
                <li>
                  <strong>Unit Converter (px, cm, mm, in):</strong> Easily enter physical measurements from exam guidelines (such as 4 cm × 2 cm) without doing manual 96 DPI pixel calculations.
                </li>
                <li>
                  <strong>Target File Size Compression:</strong> Select &lt; 20 KB, &lt; 50 KB, or &lt; 100 KB caps. The engine iteratively adjusts JPEG discrete cosine transform quantization to guarantee your file stays under the upload ceiling.
                </li>
                <li>
                  <strong>Background &amp; Format:</strong> Choose solid white background with JPG output for exams, or transparent background with PNG output for digital PDF contract stamping.
                </li>
              </ul>
            </div>

            <div className="glass-card p-6 rounded-2xl space-y-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="text-emerald-500">🔒</span> 100% Client-Side Privacy (Zero Server Upload of Legal Signatures)
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                A handwritten legal signature is one of your most sensitive personal credentials. Uploading your signature to third-party image hosting sites or conversion servers creates serious risks of identity theft, document forgery, and unauthorized data scraping.
              </p>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Zubware Signature Resizer processes 100% of image rendering, cropping, and compression locally inside your web browser using HTML5 Canvas. Your signature file is never uploaded to, transmitted across, or stored on Zubware servers. All operations happen in your device&apos;s RAM.
              </p>
            </div>
          </div>

          {/* Internal links related cluster */}
          <div className="glass-card p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <span>🔗</span> Related Tools for Indian Exam Portals &amp; Document Verification
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
              <a
                href={getLinkUrl('/photo-signature-joiner')}
                onClick={(e) => { e.preventDefault(); onNavigate(getLinkUrl('/photo-signature-joiner')); }}
                className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 transition-all block text-xs group"
              >
                <span className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 block mb-1">
                  Photo &amp; Signature Joiner →
                </span>
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                  Combine candidate photo and signature into a single file for admit cards.
                </span>
              </a>

              <a
                href={getLinkUrl('/image-compressor')}
                onClick={(e) => { e.preventDefault(); onNavigate(getLinkUrl('/image-compressor')); }}
                className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 transition-all block text-xs group"
              >
                <span className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 block mb-1">
                  Image Compressor (20KB - 50KB) →
                </span>
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                  Reduce photo size to strict 20KB or 50KB limits for government forms.
                </span>
              </a>

              <a
                href={getLinkUrl('/photo-name-date-joiner')}
                onClick={(e) => { e.preventDefault(); onNavigate(getLinkUrl('/photo-name-date-joiner')); }}
                className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 transition-all block text-xs group"
              >
                <span className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 block mb-1">
                  Name &amp; Date on Photo Editor →
                </span>
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                  Add candidate name and date of photo (DOP) on passport pictures.
                </span>
              </a>

              <a
                href={getLinkUrl('/pdf-compressor')}
                onClick={(e) => { e.preventDefault(); onNavigate(getLinkUrl('/pdf-compressor')); }}
                className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 transition-all block text-xs group"
              >
                <span className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 block mb-1">
                  PDF Compressor (Under 100KB) →
                </span>
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                  Compress certificates and caste/income documents for portal uploads.
                </span>
              </a>
            </div>
          </div>
        </section>
      )}

      {/* 3.11 DEDICATED PHOTO & SIGNATURE JOINER IN-DEPTH GUIDE (Targeting Admit Cards, Vyapam, Police & Court Applications) */}
      {tool.id === 'photo-signature-joiner' && (
        <section className="glass-panel p-6 sm:p-10 rounded-3xl space-y-8 border border-indigo-200/50 dark:border-indigo-900/40">
          <div className="border-b border-slate-200/60 dark:border-slate-800/60 pb-4">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
              Candidate Application &amp; Admit Card Composite Tool
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              Photo and Signature Joiner for Online Examinations &amp; Recruitment Portals
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card p-6 rounded-2xl space-y-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="text-indigo-600">🎯</span> Why Portals Require Photo &amp; Signature in One Image File
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Several prominent recruitment boards across India—including <strong>MPPEB / Vyapam (MPESB), High Court recruitment cells, State Police selection boards, Postal circles, and various State Subordinate Services commissions</strong>—mandate that candidates upload a single consolidated JPG image featuring both their passport photograph and signature.
              </p>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                This requirement ensures the candidate&apos;s signature is permanently bound to their biometric face image, preventing identity tampering and ensuring clear rendering on test hall attendance sheets and official admit cards.
              </p>
            </div>

            <div className="glass-card p-6 rounded-2xl space-y-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="text-indigo-600">📱</span> Photo Aur Signature Ek Sath Kaise Jode? (Step-by-Step)
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Photo aur signature ko combine karne ke liye kisi heavy desktop software ya graphic designer ki zaroorat nahi hai:
              </p>
              <ul className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-2 list-disc list-inside">
                <li><strong>Step 1:</strong> <strong>&ldquo;1. Upload Photo&rdquo;</strong> mein apni recent passport size photo select karein.</li>
                <li><strong>Step 2:</strong> <strong>&ldquo;2. Upload Signature&rdquo;</strong> mein apna scanned signature select karein.</li>
                <li><strong>Step 3:</strong> <strong>&ldquo;Vertical (Stacked)&rdquo;</strong> mode chunein jisme photo upar aur signature neeche rehti hai.</li>
                <li><strong>Step 4:</strong> <strong>&ldquo;Exam Portal (300×460)&rdquo;</strong> preset chunein ya custom dimensions adjust karein.</li>
                <li><strong>Step 5:</strong> <strong>Download Composite (JPG)</strong> par click karke portal-ready file save karein.</li>
              </ul>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Composite image turant ban jati hai aur seedhe government application form mein upload karne ke liye ready hoti hai.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card p-6 rounded-2xl space-y-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="text-indigo-600">📐</span> Vertical vs. Horizontal Modes &amp; Standard Application Presets
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Zubware provides flexible layout and proportion controls designed for diverse official formats:
              </p>
              <ul className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-2">
                <li>
                  <strong>Vertical Stacked Mode:</strong> Places the passport photo on top (300 × 350 px) and the signature directly below (300 × 100 px), matching the exact proportions requested in official exam notifications.
                </li>
                <li>
                  <strong>Horizontal Side-by-Side Mode:</strong> Places photo on the left and signature on the right, perfect for staff identity badges, club memberships, and driving credentials.
                </li>
                <li>
                  <strong>Quick Presets:</strong> One-click presets include Exam Portal (300 × 460 px), Standard ID (240 × 390 px), High Res (400 × 670 px), and Side-by-Side Card.
                </li>
                <li>
                  <strong>Fine-Tuning Sliders:</strong> Customize individual photo/signature widths, gap spacing (0–40px), padding, and optional dividing borders (1px, 2px, 4px) with custom border color selection.
                </li>
              </ul>
            </div>

            <div className="glass-card p-6 rounded-2xl space-y-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="text-emerald-500">🔒</span> Form-Ready JPG Output with 100% Client-Side Privacy
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Government and exam portal verification scripts reject files containing watermarks, unsupported image codecs, or incorrect aspect ratios. Zubware generates clean, unwatermarked JPG and PNG composite files ready for immediate upload.
              </p>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Everything runs directly in your local browser memory via HTML5 Canvas. Your sensitive facial photographs and legal signatures are never uploaded to remote cloud servers or logged in external databases, guaranteeing total biometric confidentiality.
              </p>
            </div>
          </div>

          {/* Internal links related cluster */}
          <div className="glass-card p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <span>🔗</span> Explore Related Exam &amp; Document Processing Tools
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
              <a
                href={getLinkUrl('/signature-resizer')}
                onClick={(e) => { e.preventDefault(); onNavigate(getLinkUrl('/signature-resizer')); }}
                className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 transition-all block text-xs group"
              >
                <span className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 block mb-1">
                  Signature Resizer (10KB - 20KB) →
                </span>
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                  Crop margins and resize standalone signature images for SSC, UPSC &amp; IBPS.
                </span>
              </a>

              <a
                href={getLinkUrl('/photo-name-date-joiner')}
                onClick={(e) => { e.preventDefault(); onNavigate(getLinkUrl('/photo-name-date-joiner')); }}
                className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 transition-all block text-xs group"
              >
                <span className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 block mb-1">
                  Name &amp; Date on Photo →
                </span>
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                  Add candidate name and date of photograph (DOP) to passport pictures.
                </span>
              </a>

              <a
                href={getLinkUrl('/image-compressor')}
                onClick={(e) => { e.preventDefault(); onNavigate(getLinkUrl('/image-compressor')); }}
                className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 transition-all block text-xs group"
              >
                <span className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 block mb-1">
                  Image Compressor →
                </span>
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                  Compress JPG/PNG files to exact KB targets without quality loss.
                </span>
              </a>

              <a
                href={getLinkUrl('/category/image-tools')}
                onClick={(e) => { e.preventDefault(); onNavigate(getLinkUrl('/category/image-tools')); }}
                className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 transition-all block text-xs group"
              >
                <span className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 block mb-1">
                  Browse All Image Tools →
                </span>
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                  Explore 40+ client-side photo, canvas, and format conversion utilities.
                </span>
              </a>
            </div>
          </div>
        </section>
      )}

      {/* 3.12 DEDICATED AGE CALCULATOR FLAGSHIP GUIDE (Global Intent with Secondary Regional Intent) */}
      {tool.id === 'age-calculator' && (
        <section className="glass-panel p-6 sm:p-10 rounded-3xl space-y-10 border border-indigo-200/50 dark:border-indigo-900/40">
          {/* Header */}
          <div className="border-b border-slate-200/60 dark:border-slate-800/60 pb-5">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
              Complete Practical Guide &amp; Chronological Calculation Authority
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              Age Calculator by Date of Birth: Calculate Your Exact Age Online
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
              Zubware&apos;s <strong>Online Age Calculator by Date of Birth</strong> is a free, precision calendar tool that computes your exact chronological age in completed years, months, and days. Whether you want to know how many days you have lived, check your age on a past or future milestone, or determine your exact age as of an official cutoff date, this tool executes 100% locally in your browser with zero data tracking.
            </p>
          </div>

          {/* How to Calculate & How Old Am I Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card p-6 rounded-2xl space-y-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="text-indigo-600">⏱️</span> How to Calculate Your Age Online
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Calculating your exact age using our online tool requires just four simple steps:
              </p>
              <ul className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-2 list-disc list-inside">
                <li><strong>Step 1: Enter Date of Birth:</strong> Select your birth year, month, and day using the calendar input.</li>
                <li><strong>Step 2: Choose Reference Date:</strong> Keep the target date set to today to calculate current age, or choose any past or future date.</li>
                <li><strong>Step 3: Review Instant Results:</strong> View your exact age in years, months, and days, along with total completed weeks, days, and hours.</li>
                <li><strong>Step 4: Copy Age Card:</strong> Click &ldquo;Copy Age Card&rdquo; to copy your age summary, birth day of the week, and next birthday countdown.</li>
              </ul>
            </div>

            <div className="glass-card p-6 rounded-2xl space-y-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="text-indigo-600">❓</span> How Old Am I?
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                When people ask <em>&ldquo;How old am I?&rdquo;</em>, they usually expect a single integer (such as 25 or 34). However, your true chronological age is a continuously advancing interval measuring every elapsed calendar day, hour, and minute since your birth.
              </p>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Our calculator compares your exact birth date against the current local date on your device, providing both your conversational age (years) and your exact chronological age down to the day.
              </p>
            </div>
          </div>

          {/* Age in Years Months Days & Specific Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card p-6 rounded-2xl space-y-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="text-indigo-600">📅</span> Age in Years, Months and Days
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Expressing age as a decimal number—such as &ldquo;27.6 years&rdquo;—creates confusion because calendar months do not have equal lengths. A fractional year changes depending on whether February has 28 or 29 days and whether a month contains 30 or 31 days.
              </p>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Civil registries, passport offices, and insurance agencies worldwide rely on the standard format of <strong>completed years, elapsed months, and remaining days</strong>. This ensures unambiguous verification across every jurisdiction.
              </p>
            </div>

            <div className="glass-card p-6 rounded-2xl space-y-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="text-indigo-600">🎯</span> Calculate Your Age on a Specific Date
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                You are not limited to calculating your age today. By adjusting the <strong>&ldquo;Age at Date (Reference Date)&rdquo;</strong> field, you can calculate:
              </p>
              <ul className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-2">
                <li>
                  <strong>Future Milestones:</strong> Discover exactly how old you will be on your retirement date, milestone wedding anniversary, or when a child turns 18.
                </li>
                <li>
                  <strong>Past Milestones:</strong> Find your exact age on the day you graduated, bought your first home, or started your first job.
                </li>
                <li>
                  <strong>Cutoff Dates:</strong> Determine whether you meet strict age limits for examinations, scholarships, or athletic competitions as of a designated cutoff date.
                </li>
              </ul>
            </div>
          </div>

          {/* What is exact age & How age is calculated */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card p-6 rounded-2xl space-y-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="text-indigo-600">🔢</span> What Is My Exact Age?
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Your exact age extends far beyond whole years. Zubware provides a complete breakdown across multiple units of time:
              </p>
              <ul className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-1.5 list-disc list-inside">
                <li><strong>Total Completed Months:</strong> Full calendar months since birth.</li>
                <li><strong>Total Elapsed Weeks:</strong> Full 7-day calendar cycles.</li>
                <li><strong>Total Calendar Days:</strong> Every single sunrise and sunset lived.</li>
                <li><strong>Total Elapsed Hours:</strong> Hours lived (days × 24).</li>
                <li><strong>Total Minutes &amp; Seconds:</strong> Precise units of time elapsed.</li>
                <li><strong>Next Birthday Countdown:</strong> Days left until your next celebration.</li>
              </ul>
            </div>

            <div className="glass-card p-6 rounded-2xl space-y-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="text-indigo-600">🧮</span> How Age Is Calculated (The Mathematical Algorithm)
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Many basic calculators make the mistake of dividing total days by 365 or 365.25. This yields inaccurate results because a calendar year is not fixed. Zubware uses a calendar-aware borrowing algorithm:
              </p>
              <ol className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-1.5 list-decimal list-inside">
                <li>Calculate the year difference: <code>targetYear - birthYear</code>.</li>
                <li>Calculate the month difference: <code>targetMonth - birthMonth</code>.</li>
                <li>Calculate the day difference: <code>targetDay - birthDay</code>.</li>
                <li>If <code>targetDay &lt; birthDay</code>, borrow the exact day count from the preceding calendar month (including 29 days in a leap year February) and decrement months by 1.</li>
                <li>If <code>targetMonth &lt; birthMonth</code>, borrow 12 months from the year count and decrement years by 1.</li>
              </ol>
            </div>
          </div>

          {/* Leap Years & Feb 29 Birthdays + Countries */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card p-6 rounded-2xl space-y-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="text-indigo-600">🗓️</span> Leap Years and February 29 Birthdays
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                A standard Gregorian calendar year has 365 days, while a leap year contains 366 days, adding an extra day on February 29. A year is a leap year if it is divisible by 4, except for end-of-century years which must be divisible by 400 (e.g., 2000 was a leap year, but 1900 was not).
              </p>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                For individuals born on February 29 (known as &ldquo;leaplings&rdquo;), legal convention varies by country. In the United Kingdom and Hong Kong, a leapling legally reaches their next age milestone on March 1 in non-leap years. In Taiwan and New Zealand, the legal date is February 28. Our calculator evaluates exact elapsed calendar days without imposing a single legal doctrine.
              </p>
            </div>

            <div className="glass-card p-6 rounded-2xl space-y-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="text-indigo-600">🌍</span> Age Calculation Around the World
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Most countries follow the international standard system (codified in ISO 8601): a person is zero years old at birth, and their age increments by exactly one year on each annual anniversary of their birthday.
              </p>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                However, cultural traditions have historically used alternative systems. In traditional East Asian age reckoning, a newborn was considered one year old on the day of birth, and everyone gained an additional year on New Year&apos;s Day. Today, official government and legal institutions worldwide universally use chronological age as calculated by Zubware.
              </p>
            </div>
          </div>

          {/* School, Work & Applications + Government Forms */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card p-6 rounded-2xl space-y-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="text-indigo-600">🎓</span> Age Calculator for School, Work and Applications
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Knowing your exact age is essential for everyday administrative, academic, and professional milestones:
              </p>
              <ul className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-1.5 list-disc list-inside">
                <li><strong>School Admission:</strong> Verifying kindergarten and primary school cutoff requirements (e.g., must be 5 years old by September 1).</li>
                <li><strong>Employment &amp; Labor Laws:</strong> Ensuring candidates meet statutory minimum working ages (16 or 18 years).</li>
                <li><strong>Retirement Planning:</strong> Pinpointing the exact date you become eligible for pension or retirement accounts.</li>
                <li><strong>Driver Licensing:</strong> Verifying eligibility for learner permits and full licenses.</li>
                <li><strong>Life &amp; Health Insurance:</strong> Actuarial calculations frequently price premiums based on age as of the nearest or last birthday.</li>
              </ul>
            </div>

            <div className="glass-card p-6 rounded-2xl space-y-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="text-indigo-600">🏛️</span> Age for Government Forms &amp; Competitive Exams
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                For applicants in India and global recruitment processes, government application portals (such as UPSC, SSC CGL/CHSL, IBPS, Railways RRB, State PSCs, and Defense recruitments) mandate that candidates enter their exact age as of a specific cutoff date advertised in the official notification.
              </p>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                To calculate this, enter your birth date and set the &ldquo;Age at Date&rdquo; field to the cutoff date specified in the exam notification (e.g., August 1 or January 1). Always verify official age relaxation categories (OBC, SC, ST, EWS, Ex-Servicemen) directly in the recruitment brochure.
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 italic">
                Notice: Zubware is an independent tool and is not affiliated with any government or examination authority. Always verify your eligibility against the official published notification.
              </p>
            </div>
          </div>

          {/* Mobile UX & Simple Language Search */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card p-6 rounded-2xl space-y-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="text-indigo-600">📱</span> Fast, Responsive Mobile Age Calculator
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Most people search for an age calculator while filling out an application on their phone. Zubware is engineered specifically for mobile browsers:
              </p>
              <ul className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-1.5 list-disc list-inside">
                <li>Native iOS and Android calendar inputs with zero typing lag.</li>
                <li>One-tap &ldquo;Set to Today&rdquo; shortcut to immediately recalculate current age.</li>
                <li>Clean, readable cards displaying years, months, and days without horizontal scrolling.</li>
                <li>Zero app installation, zero sign-up requirements, and zero battery drain.</li>
              </ul>
            </div>

            <div className="glass-card p-6 rounded-2xl space-y-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="text-indigo-600">💬</span> Age Calculator in Simple Language (Aasan Bhasha Mein)
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Bahut se log search karte hain: <em>&ldquo;DOB se age kaise calculate kare?&rdquo;</em> ya <em>&ldquo;Meri age kitni hai?&rdquo;</em>. Process bilkul aasan hai:
              </p>
              <ul className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-1.5 list-disc list-inside">
                <li>Date of Birth box mein apni janam tithi (birth date) dalein.</li>
                <li>Aaj ki date default set hoti hai, ya exam cutoff date chunein.</li>
                <li>Screen par turant aapki exact age saal (years), mahine (months), aur din (days) mein dikh jayegi.</li>
                <li>Aapko agle birthday ke bache hue din bhi turant pata chal jayenge.</li>
              </ul>
            </div>
          </div>

          {/* Worked Historical Examples (Step 8) */}
          <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-4 border border-indigo-200/60 dark:border-indigo-900/60">
            <div className="border-b border-slate-200/60 dark:border-slate-800/60 pb-3">
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                Verified Calculations
              </span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                Worked Age Calculation Examples (Static Historical Benchmarks)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                These static reference examples demonstrate exact calendar arithmetic across standard years, uneven month intervals, and leap years:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                  Example 1: Milestone Anniversary
                </span>
                <div className="text-xs space-y-1 text-slate-600 dark:text-slate-300">
                  <p><strong>Date of Birth:</strong> January 1, 2000</p>
                  <p><strong>Reference Date:</strong> January 1, 2025</p>
                </div>
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <p className="text-sm font-black text-indigo-600 dark:text-indigo-400">
                    25 Years, 0 Months, 0 Days
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Exactly 9,132 days (including 6 leap days in 2000, 2004, 2008, 2012, 2016, 2020, and 2024).
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                  Example 2: Uneven Month Dates
                </span>
                <div className="text-xs space-y-1 text-slate-600 dark:text-slate-300">
                  <p><strong>Date of Birth:</strong> May 15, 1995</p>
                  <p><strong>Reference Date:</strong> October 20, 2024</p>
                </div>
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <p className="text-sm font-black text-indigo-600 dark:text-indigo-400">
                    29 Years, 5 Months, 5 Days
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Total: 10,751 elapsed calendar days | 1,535 full weeks.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                  Example 3: Leap Year Birthday
                </span>
                <div className="text-xs space-y-1 text-slate-600 dark:text-slate-300">
                  <p><strong>Date of Birth:</strong> February 29, 2004</p>
                  <p><strong>Reference Date:</strong> March 1, 2024</p>
                </div>
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <p className="text-sm font-black text-indigo-600 dark:text-indigo-400">
                    20 Years, 0 Months, 1 Day
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Exactly 7,306 calendar days lived since the 2004 leap day.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Internal Links Related Cluster */}
          <div className="glass-card p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <span>🔗</span> Explore Related Date, Time &amp; Calculation Tools
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
              <a
                href={getLinkUrl('/countdown-calculator')}
                onClick={(e) => { e.preventDefault(); onNavigate(getLinkUrl('/countdown-calculator')); }}
                className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 transition-all block text-xs group"
              >
                <span className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 block mb-1">
                  Countdown Calculator →
                </span>
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                  Track exact days, hours, and minutes remaining until future events or birthdays.
                </span>
              </a>

              <a
                href={getLinkUrl('/working-days-calculator')}
                onClick={(e) => { e.preventDefault(); onNavigate(getLinkUrl('/working-days-calculator')); }}
                className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 transition-all block text-xs group"
              >
                <span className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 block mb-1">
                  Working Days Calculator →
                </span>
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                  Calculate business days, work weeks, and exclude weekend dates between dates.
                </span>
              </a>

              <a
                href={getLinkUrl('/cat-age-calculator')}
                onClick={(e) => { e.preventDefault(); onNavigate(getLinkUrl('/cat-age-calculator')); }}
                className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 transition-all block text-xs group"
              >
                <span className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 block mb-1">
                  Cat Age Calculator →
                </span>
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                  Convert feline chronological years into human biological age equivalents.
                </span>
              </a>

              <a
                href={getLinkUrl('/percentage-calculator')}
                onClick={(e) => { e.preventDefault(); onNavigate(getLinkUrl('/percentage-calculator')); }}
                className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 transition-all block text-xs group"
              >
                <span className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 block mb-1">
                  Percentage Calculator →
                </span>
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                  Calculate percentage increase, differences, and fractions instantly.
                </span>
              </a>
            </div>
          </div>
        </section>
      )}

      {/* 4. FREQUENTLY ASKED QUESTIONS */}
      <section className="glass-panel p-6 sm:p-10 rounded-3xl">
        <div className="mb-6">
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Frequently Asked Questions about {tool.navTitle}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Common queries answered concisely and factually.
          </p>
        </div>

        <div className="space-y-3">
          {faqsToUse.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div key={idx} className="glass-card rounded-2xl overflow-hidden border border-slate-200/60 dark:border-slate-800/60">
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 text-xs sm:text-sm font-bold text-slate-900 dark:text-white hover:text-indigo-600 transition-colors"
                >
                  <span>{faq.question}</span>
                  <ChevronDown className={`w-4 h-4 shrink-0 transition-transform ${isOpen ? 'rotate-180 text-indigo-600' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800/60 leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. HIGH-INTENT SEARCH QUERIES & PRESETS (SEO, AEO & GEO DISCOVERY) */}
      {tool.tags && tool.tags.length > 0 && (
        <section className="glass-panel p-6 sm:p-8 rounded-3xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800/60 pb-3">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="text-rose-500">⚡</span> Popular Search Queries & Target Use Cases
            </h2>
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
              Verified Intent Keywords
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            People frequently search for and use <strong>{tool.title}</strong> for the following specific file requirements, government portal uploads, and format conversions:
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            {tool.tags
              .filter(tag => !['Free', 'Online', 'Tool', 'Image', 'PDF', 'Photo'].includes(tag))
              .slice(0, 16)
              .map((tag, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 shadow-2xs hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                {tag}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* 6. CRAWLABLE RELATED TOOLS INTERNAL LINKING */}
      {relatedTools.length > 0 && (
        <section className="glass-panel p-6 sm:p-10 rounded-3xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 pb-4 border-b border-slate-200/60 dark:border-slate-800/60">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                Internal Ecosystem Links
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
                Related {tool.category.replace(/^[^\w]+/, '').replace(/\s*Tools$/i, '')} Tools
              </h2>
            </div>
            <a
              href={getLinkUrl('/categories')}
              onClick={(e) => { e.preventDefault(); onNavigate(getLinkUrl('/categories')); }}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 mt-2 sm:mt-0"
            >
              Explore All Categories <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {relatedTools.map((relTool) => (
              <a
                key={relTool.id}
                href={getLinkUrl(relTool.path)}
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate(getLinkUrl(relTool.path));
                }}
                className="glass-card p-4 rounded-2xl flex items-start gap-3.5 hover:border-indigo-500/40 group transition-all"
              >
                <ToolIcon
                  toolId={relTool.id}
                  category={relTool.category}
                  size="md"
                  className="group-hover:scale-110 transition-transform shrink-0"
                />
                <div className="overflow-hidden">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">
                    {relTool.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 leading-snug">
                    {relTool.description}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* 7. RECOMMENDED PRACTICAL GUIDES & EDITORIAL AUTHORITY */}
      {matchingGuides.length > 0 && (
        <section className="glass-panel p-6 sm:p-10 rounded-3xl border border-indigo-200/60 dark:border-indigo-900/60 bg-gradient-to-br from-indigo-50/40 via-white to-transparent dark:from-indigo-950/20 dark:via-slate-900 dark:to-transparent">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 pb-4 border-b border-indigo-100 dark:border-slate-800">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" /> Best Practice Guides & Tutorials
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
                Learn More About {tool.navTitle || tool.title} Workflows
              </h2>
            </div>
            <a
              href={getLinkUrl('/blog')}
              onClick={(e) => { e.preventDefault(); onNavigate(getLinkUrl('/blog')); }}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 mt-2 sm:mt-0"
            >
              Browse All Guides <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {matchingGuides.map((guide) => (
              <a
                key={guide.slug}
                href={getLinkUrl(guide.canonicalPath)}
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate(getLinkUrl(guide.canonicalPath));
                }}
                className="glass-card p-5 rounded-2xl flex flex-col justify-between hover:border-indigo-500/50 group transition-all"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-800/50">
                      {guide.category}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">
                      {guide.readingTime}
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {guide.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {guide.excerpt}
                  </p>
                </div>
                <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-indigo-600 dark:text-indigo-400">
                  <span>Read In-Depth Guide</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </a>
            ))}
          </div>
        </section>
      )}

    </div>
  );
};
