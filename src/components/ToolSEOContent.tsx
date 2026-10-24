import { toolProcessingNotice } from '../lib/toolProcessingNotice';
import { AgeCalculationExamples } from './seo/AgeCalculationExamples';
import React, { useState } from 'react';
import { ToolMeta, FAQItem } from '../types';
import { ChevronDown, ShieldCheck, Zap, HardDrive, CheckCircle2, ArrowRight, BookOpen } from 'lucide-react';
import { getLinkUrl, getToolCanonicalPath, getToolHowToHeading, getToolIntroParagraph, NETWORK_DEPENDENT_TOOL_IDS } from '../lib/paths';
import BLOG_ARTICLES from '../data/blogCatalog.json';
import { getRelatedTools, getMatchingGuidesForTool } from '../lib/workflowMap';
import { ToolIcon } from './common/ToolIcon';
import { getToolSeoData } from '../data/toolSeoData';
import { ImageToolsSEOSection } from './seo/ImageToolsSEOSections';
import { VideoBusinessSEOSection } from './seo/VideoBusinessSEOSections';
import { PdfToolsSEOSection } from './seo/PdfToolsSEOSections';
import { DesignUtilitySecuritySEOSection } from './seo/DesignUtilitySecuritySEOSections';

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
  const hasOptionalCloudflareAI = tool.id === 'background-remover';
  const seoData = getToolSeoData(tool.id);
  const toolFaqs = (tool.faq && tool.faq.length > 0) ? tool.faq : seoData.faq;
  const toolHowTo = (tool.howTo && tool.howTo.length > 0) ? tool.howTo : seoData.howTo;

  // Generate dynamic FAQs if not provided on tool object
  const defaultFaqs: FAQItem[] = [
    {
      question: `Is ${tool.navTitle} free to use?`,
      answer: `This Zubware tool is available to use in your browser. Availability of features and limits can vary by tool.`
    },
    {
      question: `How does ${tool.navTitle} handle data and privacy?`,
      answer: hasOptionalCloudflareAI
        ? 'Quick and Private Removal run locally. Smart AI Removal sends the selected photo to Cloudflare only after you consent and start.'
        : isNetworkTool
        ? `${tool.title} communicates directly with the specified external endpoints from your browser. Zubware does not store your payload data or requests on our servers.`
        : `Processing happens locally in your browser for this tool; files and data are not uploaded to Zubware servers.`
    },
    {
      question: `Which file formats and devices are supported by ${tool.navTitle}?`,
      answer: `${tool.title} works on Windows, macOS, Linux, iOS, and Android. It supports standard modern web file formats and runs in Chrome, Safari, Firefox, and Edge.`
    },
    {
      question: `How fast is processing with ${tool.navTitle}?`,
      answer: hasOptionalCloudflareAI
        ? 'Processing speed depends on the chosen mode, device and, for Smart AI, the network and Cloudflare availability.'
        : isNetworkTool
        ? `Processing speed depends on network latency and the response time of the target endpoint.`
        : `Processing is performed in your browser on your device's engine, eliminating server upload queues.`
    }
  ];

  const faqsToUse = toolFaqs && toolFaqs.length > 0 ? toolFaqs : defaultFaqs;

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

  const howToSteps = toolHowTo && toolHowTo.length > 0
    ? toolHowTo
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
            About this tool
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
              <Zap className="w-4 h-4 text-amber-500" /> What you can do
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
              <ShieldCheck className="w-4 h-4 text-emerald-500" /> How your data is processed
            </h3>
            <p>{toolProcessingNotice(tool.id)}</p>
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

      {/* 3.4 DEDICATED IN-DEPTH EVERGREEN GUIDES FOR PRIORITY IMAGE TOOLS */}
      <ImageToolsSEOSection tool={tool} onNavigate={onNavigate} />

      {/* 3.45 DEDICATED IN-DEPTH EVERGREEN GUIDES FOR PRIORITY VIDEO & BUSINESS TOOLS */}
      <VideoBusinessSEOSection tool={tool} onNavigate={onNavigate} />

      {/* 3.46 DEDICATED IN-DEPTH EVERGREEN GUIDES FOR PRIORITY PDF TOOLS (BATCH 4) */}
      <PdfToolsSEOSection tool={tool} onNavigate={onNavigate} />

      {/* 3.47 DEDICATED IN-DEPTH EVERGREEN GUIDES FOR DESIGN, UTILITY & SECURITY TOOLS (BATCH 5 & 6) */}
      <DesignUtilitySecuritySEOSection tool={tool} onNavigate={onNavigate} />

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
                Photo and signature requirements vary by exam, recruitment year, and application portal. Read the current official upload instructions for the required file format, dimensions, and KB range before choosing a preset. A small file alone does not guarantee acceptance.
              </p>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Choose <strong>By Target Size</strong> and enter your form's limit or try a <strong>20 KB</strong> or <strong>50 KB</strong> example. The tool adjusts quality and dimensions where possible, then shows the actual byte size. If a very small limit is not reached, try JPG or a larger permissible size.
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
                  <strong>PNG:</strong> Preserves transparency. Reaching a small size target may require reducing pixel dimensions; verify that text and edges remain readable.
                </li>
                <li>
                  <strong>WebP:</strong> Supports adjustable lossy compression and transparency. File-size savings depend on the image and chosen settings.
                </li>
              </ul>
            </div>

            <div className="glass-card p-6 rounded-2xl space-y-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="text-emerald-500">🔒</span> 100% Private Browser Execution (Zero Server Upload)
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                This tool processes the selected image in your browser. Keep a backup of the original and check readability before sharing the compressed copy.
              </p>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Zubware Image Compressor uses browser image decoding and <strong>HTML5 Canvas</strong> to create the output. The tool does not upload the selected images to Zubware servers. Keep a copy of the original image and inspect the exported file before submitting it.
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

      {/* Practical guidance for the QR generator's actual output. */}
      {tool.id === 'qr-generator' && (
        <section className="glass-panel p-6 sm:p-10 rounded-3xl space-y-8 border border-indigo-200/50 dark:border-indigo-900/40">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">Make a QR code that works where you use it</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card p-6 rounded-2xl space-y-3">
              <h3 className="text-lg font-bold">Restaurant menus, websites and shared documents</h3>
              <p className="text-sm leading-relaxed">Paste the full HTTPS address into URL / Text. Open the destination in a signed-out browser to check that visitors can access it. For a menu, use a stable page you control so you can update the menu at the same address without reprinting the QR.</p>
              <p className="text-sm leading-relaxed">A static QR keeps its original content and has no built-in expiry. It cannot repair an expired domain, deleted file or changed sharing permission. Zubware does not host your destination or add a tracking redirect.</p>
            </div>
            <div className="glass-card p-6 rounded-2xl space-y-3">
              <h3 className="text-lg font-bold">Guest Wi-Fi and WhatsApp enquiries</h3>
              <p className="text-sm leading-relaxed">For guest Wi-Fi, preserve the exact network name and password, including spaces. Anyone with the QR image can read those details. Use a guest network instead of publishing a private network password.</p>
              <p className="text-sm leading-relaxed">For customer enquiries, choose WhatsApp, enter the international phone number and add a message such as “I would like to ask about your menu.” The scan opens a chat for an active account; the visitor decides whether to send the message.</p>
            </div>
            <div className="glass-card p-6 rounded-2xl space-y-3">
              <h3 className="text-lg font-bold">Choose an export and check a print sample</h3>
              <ul className="text-sm space-y-2 list-disc pl-5">
                <li><strong>PNG:</strong> Use for websites, slides and apps that need an image. Increase Target QR width when you need more pixels.</li>
                <li><strong>SVG:</strong> Use for scalable QR artwork. Colors, shapes, the frame and your embedded raster logo are retained; the logo still has a finite resolution.</li>
                <li><strong>A4 PDF:</strong> Download a centered 120 mm wide QR image with the frame in its correct proportions. Check the printer scale before producing a batch.</li>
              </ul>
              <p className="text-sm leading-relaxed">Keep the blank border clear. Run the built-in test, then scan a downloaded file and a print sample on the intended material and under real lighting. Gloss, distance, blur and low contrast can change the result.</p>
            </div>
            <div className="glass-card p-6 rounded-2xl space-y-3">
              <h3 className="text-lg font-bold">Know what the checks and history mean</h3>
              <p className="text-sm leading-relaxed">The scan test compares the preview’s decoded content with your input. It does not certify a destination as safe, verify a UPI payee, connect to Wi-Fi or confirm compatibility with every phone. Use Review encoded content to catch a wrong number, link or payment amount.</p>
              <p className="text-sm leading-relaxed">Generation and testing run locally in your browser. History is off by default. Enabling it saves downloaded or copied payloads unencrypted on this browser, including any sensitive details. Use Clear All to remove them, and remember that anyone receiving a downloaded QR can decode its content.</p>
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
                Some application forms ask for one combined photo and signature image, while others require separate files. Check your application instructions before using this tool.
              </p>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                If a combined file is requested, check the required layout, dimensions, format, and maximum file size in the form instructions.
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
                <li><strong>Step 4:</strong> <strong>&ldquo;Vertical (300×460)&rdquo;</strong> example chunein ya apne form ke mutabiq dimensions adjust karein.</li>
                <li><strong>Step 5:</strong> Final pixels aur file size check karke <strong>Download Composite (JPG)</strong> par click karein.</li>
              </ul>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Har portal ki dimensions, format aur KB limit alag ho sakti hai; upload se pehle apne form ke rules dekhein.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card p-6 rounded-2xl space-y-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="text-indigo-600">📐</span> Vertical vs. Horizontal Modes &amp; Example Sizes
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Zubware provides flexible layout and proportion controls designed for diverse official formats:
              </p>
              <ul className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-2">
                <li>
                  <strong>Vertical Stacked Mode:</strong> Places the photo above the signature; the 300 × 350 px photo and 300 × 100 px signature are example sizes.
                </li>
                <li>
                  <strong>Horizontal Side-by-Side Mode:</strong> Places photo on the left and signature on the right, perfect for staff identity badges, club memberships, and driving credentials.
                </li>
                <li>
                  <strong>Quick Presets:</strong> One-click vertical output examples include 300 × 460 px, 240 × 390 px, and 400 × 670 px, plus a side-by-side card layout. Changing the gap or padding changes the output size.
                </li>
                <li>
                  <strong>Fine-Tuning Sliders:</strong> Customize photo and signature widths, gap (0–40 px), padding, and outer border (none, 1, 2, or 4 px) with a color picker.
                </li>
              </ul>
            </div>

            <div className="glass-card p-6 rounded-2xl space-y-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="text-emerald-500">🔒</span> JPG or PNG Output with Browser Processing
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Zubware exports unwatermarked JPG and PNG images. The result is not automatically compliant with every portal; check the image dimensions and approximate KB size shown above.
              </p>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Composition runs in your browser with HTML5 Canvas. This tool does not upload the selected images to Zubware servers. On a shared device, remove downloaded copies after use.
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
                  Compress JPG/PNG files toward a KB target and check the resulting quality.
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
              Practical Guide to Calculating Your Age
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              Age Calculator by Date of Birth: Calculate Your Exact Age Online
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
              Use Zubware&apos;s <strong>Age Calculator by Date of Birth</strong> to work out your age in completed years, months, and days. Enter your date of birth and choose a reference date to calculate your age today or on a past or future date. The calculator also displays elapsed time, your next birthday countdown, and other age-related estimates. Calculations are performed in your browser.
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
                Expressing age in <strong>completed years, months, and remaining days</strong> is often more useful than a decimal age. However, official forms and organisations may specify their own rules for calculating age or determining eligibility.
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
                A simple division of elapsed days by 365 gives an approximate decimal age, not a calendar-based age in years, months, and days. This calculator derives the displayed age from the dates entered:
              </p>
              <ol className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-1.5 list-decimal list-inside">
                <li>Find the last completed monthly anniversary of the birth date.</li>
                <li>If the birth day does not exist in that month, use its last valid day. For example, January 31 to February 28 counts as one month in a non-leap year.</li>
                <li>Split completed months into years and remaining months, then count calendar days from that anniversary to the reference date.</li>
                <li>February 29 birthdays use February 28 in non-leap years in this calculator. Follow the relevant authority's rules for official eligibility.</li>
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
                People born on February 29 have a birthday that appears only in leap years. How a February 29 birthday is treated in a non-leap year can depend on the purpose and applicable rules. For legal deadlines, exam eligibility, or official applications, follow the relevant authority’s published guidance.
              </p>
            </div>

            <div className="glass-card p-6 rounded-2xl space-y-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="text-indigo-600">🌍</span> Age Calculation Around the World
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                In everyday chronological age calculation, a person’s age increases on their birthday. Rules can differ for particular legal, administrative, or cultural purposes, so use the definition required by the relevant organisation when completing official paperwork.
              </p>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Some cultural age-counting traditions have used systems different from chronological age. This calculator uses the birth date and reference date you enter to calculate a calendar-based age; it does not determine which age-counting convention an organisation requires.
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
                <li>Date inputs designed to work with mobile browsers on iOS and Android.</li>
                <li>One-tap &ldquo;Set to Today&rdquo; shortcut to immediately recalculate current age.</li>
                <li>Clean, readable cards displaying years, months, and days without horizontal scrolling.</li>
                <li>No separate app installation is required to use the browser-based calculator.</li>
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

          <AgeCalculationExamples />

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

      {/* 3.6 DEDICATED LEARNING LICENCE MOCK TEST IN-DEPTH GUIDE (India-First & Exam Practice Curriculum) */}
      {tool.id === 'learning-licence-mock-test' && (
        <section className="glass-panel p-6 sm:p-10 rounded-3xl space-y-8 border border-emerald-200/50 dark:border-emerald-900/40">
          <div className="border-b border-slate-200/60 dark:border-slate-800/60 pb-4">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
              RTO Exam Preparation &amp; Road Safety Curriculum
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              Learning Licence Mock Test Online — RTO Test Questions &amp; Road Rules Guide
            </h2>
          </div>

          {/* Official Government Disclaimer Box */}
          <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 space-y-2">
            <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold text-sm">
              <span className="text-lg">⚠️</span>
              <span>Important Disclaimer: Zubware is an Independent Educational Practice Tool</span>
            </div>
            <p className="text-xs sm:text-sm text-amber-900/80 dark:text-amber-200/80 leading-relaxed">
              Zubware is <strong>not affiliated with, endorsed by, or connected to</strong> the Ministry of Road Transport and Highways (MoRTH), Parivahan Sewa, Sarathi portal, or any State Regional Transport Office (RTO). This tool is a <strong>free educational mock practice test</strong> designed solely to help candidates learn traffic signs and general road rules. Passing this practice test does not guarantee passing the official RTO examination, nor does it issue any official license. Official application submission, fee payment, slot booking, and computer tests must be conducted through official government portals (<a href="https://parivahan.gov.in" target="_blank" rel="noopener noreferrer" className="underline font-semibold hover:text-amber-950">parivahan.gov.in</a>) or your local RTO.
            </p>
          </div>

          {/* Exam Overview & Format */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card p-6 rounded-2xl space-y-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="text-emerald-600">🚦</span> What is a Learning Licence (LL) Mock Test?
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Before obtaining a permanent Driving Licence (DL) in India, applicants must first pass a computer-based <strong>Learner&rsquo;s Licence (LL / LLR) test</strong> administered by their local RTO or online via the Parivahan Sarathi system. The test evaluates your fundamental knowledge of the <strong>Motor Vehicles Act, traffic signals, road signs, and safe driving etiquette</strong>.
              </p>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Zubware&rsquo;s mock test mirrors this computer test environment with a curated 40+ question bank, randomized 15-question test sessions, an optional 15-minute timer, and instant performance analysis in both <strong>English and Hindi (हिंदी)</strong>.
              </p>
            </div>

            <div className="glass-card p-6 rounded-2xl space-y-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="text-emerald-600">📋</span> Computer Exam Structure &amp; Passing Criteria
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                While specific question numbers vary slightly across Indian states, standard RTO computerized exams follow this pattern:
              </p>
              <ul className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-1.5 list-disc list-inside">
                <li><strong>Number of Questions:</strong> Typically 15 to 20 multiple-choice questions (MCQs).</li>
                <li><strong>Passing Marks:</strong> Usually <strong>60%</strong> (9 correct out of 15, or 12 correct out of 20).</li>
                <li><strong>Time Allocation:</strong> Approximately 30 to 45 seconds per question (or 15–20 minutes total).</li>
                <li><strong>Format:</strong> Computer screen interface with multiple-choice options.</li>
                <li><strong>Syllabus Coverage:</strong> ~50% road safety regulations &amp; ~50% traffic signs identification.</li>
              </ul>
            </div>
          </div>

          {/* Traffic Signs Master Guide */}
          <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-6">
            <div className="border-b border-slate-200/60 dark:border-slate-800/60 pb-3">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                Visual Road Signs Syllabus
              </span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                The Three Categories of Indian Traffic Signs
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Every RTO exam candidate must be able to recognize and differentiate between mandatory, cautionary, and informatory road signs:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">1. Mandatory Signs</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-rose-50 dark:bg-rose-950/60 text-rose-600 font-bold">Circular</span>
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">Regulatory &amp; Legal Orders</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  These signs specify what you <strong>MUST or MUST NOT do</strong>. Violating a mandatory sign is a punishable offence under the Motor Vehicles Act.
                </p>
                <div className="text-[11px] text-slate-500 space-y-1 pt-1 border-t border-slate-100 dark:border-slate-800">
                  <p><strong>Examples:</strong> Stop (Octagonal), Give Way (Inverted Triangle), No Entry, One Way, Speed Limit (50/60/80), Horn Prohibited, No Overtaking.</p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">2. Cautionary Signs</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950/60 text-amber-600 font-bold">Triangular</span>
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">Warning &amp; Hazard Alerts</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  These signs warn drivers of <strong>upcoming hazards, road geometry changes, or special zones</strong> so you can slow down in advance.
                </p>
                <div className="text-[11px] text-slate-500 space-y-1 pt-1 border-t border-slate-100 dark:border-slate-800">
                  <p><strong>Examples:</strong> Narrow Bridge, School Ahead, Pedestrian Crossing, Sharp Left/Right Curve, Steep Ascent/Descent, Slippery Road, Roundabout Ahead.</p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">3. Informatory Signs</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-600 font-bold">Rectangular</span>
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">Facilities &amp; Directions</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  These signs guide drivers with <strong>useful information regarding distances, nearby facilities, and emergency services</strong>.
                </p>
                <div className="text-[11px] text-slate-500 space-y-1 pt-1 border-t border-slate-100 dark:border-slate-800">
                  <p><strong>Examples:</strong> Hospital Ahead, Petrol Pump, First Aid Post, Eating Place, Public Telephone, Parking Area, Resting Place.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Common Mistakes & Traps */}
          <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-4">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="text-rose-500">❌</span> Top 5 Common Traps in the RTO Computer Exam
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              Many learners fail on their first attempt due to tricky wording or confusing subtle differences between traffic signals:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5">
                <h4 className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wide">Trap 1: Flashing Red vs Flashing Yellow</h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  A <strong>Flashing Red Light</strong> requires a complete stop before the stop line, proceeding only when safe. A <strong>Flashing Yellow Light</strong> means slow down and proceed through the junction with extra caution without needing to stop completely.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5">
                <h4 className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wide">Trap 2: Overtaking on the Left Side</h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Overtaking from the left is normally prohibited. The <strong>only legal exception</strong> is when the vehicle in front is signaling and initiating a right turn, leaving sufficient clear space on the left.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5">
                <h4 className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wide">Trap 3: Roundabout Right of Way</h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Traffic that is <strong>already circulating inside the roundabout</strong> always has priority over vehicles waiting to enter the roundabout from approaching roads.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5">
                <h4 className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wide">Trap 4: Mandatory L-Plate Rules</h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Learners must paint or affix red &lsquo;L&rsquo; plates on a white background on <strong>both the front and rear</strong> of the vehicle, and must be accompanied by an instructor holding a valid permanent DL.
                </p>
              </div>
            </div>
          </div>

          {/* Practice vs Official Test Comparison Table */}
          <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-4">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Practice Test vs Official RTO Computer Test
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm text-slate-600 dark:text-slate-300 border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-bold">
                    <th className="py-3 px-4">Feature / Parameter</th>
                    <th className="py-3 px-4 text-emerald-600 dark:text-emerald-400">Zubware Mock Simulator</th>
                    <th className="py-3 px-4">Official RTO Examination</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  <tr>
                    <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">Purpose</td>
                    <td className="py-3 px-4">Study preparation, practice &amp; self-evaluation</td>
                    <td className="py-3 px-4">Statutory licensing evaluation</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">Language Support</td>
                    <td className="py-3 px-4">English &amp; Hindi (bilingual switch)</td>
                    <td className="py-3 px-4">English, Hindi &amp; state regional languages</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">Sign-Up &amp; Aadhaar Required</td>
                    <td className="py-3 px-4 font-bold text-emerald-600">None (100% Free &amp; Private)</td>
                    <td className="py-3 px-4">Aadhaar authentication / application login required</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">Question Review</td>
                    <td className="py-3 px-4">Instant review with correct answers highlighted</td>
                    <td className="py-3 px-4">Pass/Fail result screen at end of session</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">Retake Limits</td>
                    <td className="py-3 px-4">Unlimited free retries anytime</td>
                    <td className="py-3 px-4">Re-attempt fee and waiting period apply</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* State Guidelines Note */}
          <div className="glass-card p-6 rounded-2xl space-y-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>🏛️</span> State-Wise Guidelines &amp; Official Verification
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Whether you are preparing for RTO tests in <strong>Uttar Pradesh (UP), Bihar, Maharashtra, Rajasthan, Delhi, Madhya Pradesh, Gujarat, Haryana, West Bengal, Karnataka, or other Indian states</strong>, the underlying road safety rules and sign categories are governed nationally by the Indian Motor Vehicles Act. However, slot booking procedures, touch screen interfaces, and question languages can vary across states. We advise all applicants to download their state transport department&rsquo;s official question handbook on <a href="https://parivahan.gov.in" target="_blank" rel="noopener noreferrer" className="text-emerald-600 font-bold underline">parivahan.gov.in</a> before scheduling their test.
            </p>
          </div>

          {/* Related Tools for Indian Exam & License Applications */}
          <div className="glass-card p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <span>🔗</span> Tools for Driving Licence &amp; Government Form Applications
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
              <a
                href={getLinkUrl('/photo-signature-joiner')}
                onClick={(e) => { e.preventDefault(); onNavigate(getLinkUrl('/photo-signature-joiner')); }}
                className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 transition-all block text-xs group"
              >
                <span className="font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 block mb-1">
                  Photo &amp; Signature Joiner →
                </span>
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                  Combine photo and signature into a single file for online application portals.
                </span>
              </a>

              <a
                href={getLinkUrl('/signature-resizer')}
                onClick={(e) => { e.preventDefault(); onNavigate(getLinkUrl('/signature-resizer')); }}
                className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 transition-all block text-xs group"
              >
                <span className="font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 block mb-1">
                  Signature Resizer →
                </span>
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                  Resize and compress signatures under 20KB for recruitment and Parivahan forms.
                </span>
              </a>

              <a
                href={getLinkUrl('/passport-photo-maker')}
                onClick={(e) => { e.preventDefault(); onNavigate(getLinkUrl('/passport-photo-maker')); }}
                className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 transition-all block text-xs group"
              >
                <span className="font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 block mb-1">
                  Passport Photo Maker →
                </span>
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                  Create printable 3.5×4.5 cm passport-size photos with white backgrounds.
                </span>
              </a>

              <a
                href={getLinkUrl('/age-calculator')}
                onClick={(e) => { e.preventDefault(); onNavigate(getLinkUrl('/age-calculator')); }}
                className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 transition-all block text-xs group"
              >
                <span className="font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 block mb-1">
                  Age Calculator →
                </span>
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                  Check exact age eligibility (16 years for 50cc, 18 years for geared vehicles).
                </span>
              </a>
            </div>
          </div>
        </section>
      )}

      {/* 3.7 DEDICATED SCIENTIFIC CALCULATOR IN-DEPTH GUIDE (Global-First & Advanced Math Curriculum) */}
      {tool.id === 'scientific-calculator' && (
        <section className="glass-panel p-6 sm:p-10 rounded-3xl space-y-8 border border-indigo-200/50 dark:border-indigo-900/40">
          <div className="border-b border-slate-200/60 dark:border-slate-800/60 pb-4">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
              Advanced Mathematics &amp; Computational Guide
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              Online Scientific Calculator — Formulas, Functions &amp; Trigonometry Guide
            </h2>
          </div>

          {/* What is a Scientific Calculator vs Basic */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card p-6 rounded-2xl space-y-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="text-indigo-600">🧮</span> What is a Scientific Calculator?
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                A scientific calculator is an advanced mathematical computing tool designed to solve multi-step problems in <strong>algebra, trigonometry, physics, engineering, statistics, and calculus</strong>.
              </p>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Unlike standard four-function calculators that compute numbers strictly from left to right as keys are pressed, Zubware&rsquo;s Scientific Calculator evaluates complete mathematical expressions using the <strong>Shunting-Yard algorithm</strong>, guaranteeing strict adherence to algebraic operator precedence (<strong>PEMDAS / BODMAS</strong>).
              </p>
            </div>

            <div className="glass-card p-6 rounded-2xl space-y-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="text-indigo-600">⚡</span> Basic Calculator vs Scientific Calculator
              </h3>
              <ul className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-2 list-disc list-inside">
                <li><strong>Order of Operations:</strong> Basic calculators compute <code>2 + 3 × 4 = 20</code> (immediate execution). Scientific calculators correctly evaluate <code>2 + 3 × 4 = 14</code> by prioritizing multiplication.</li>
                <li><strong>Trigonometric Functions:</strong> Evaluates sine, cosine, tangent, and their inverses across Degree and Radian modes.</li>
                <li><strong>Logarithmic Powers:</strong> Handles base-10 common logs (log₁₀) and natural logs (ln with base e).</li>
                <li><strong>Nested Parentheses:</strong> Allows arbitrary nesting of expressions like <code>(5 + 3) / (4 - 2)</code>.</li>
                <li><strong>Memory &amp; History:</strong> Stores running totals in memory registers (MC, MR, M+, M-) and records up to 15 calculations in local browser storage.</li>
              </ul>
            </div>
          </div>

          {/* Trigonometry & Angle Modes Explained */}
          <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-6">
            <div className="border-b border-slate-200/60 dark:border-slate-800/60 pb-3">
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                Trigonometric Architecture
              </span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                Degrees (DEG) vs Radians (RAD): Angle Mode Guide
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Selecting the incorrect angle mode is the single most common cause of error in trigonometric calculations:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Degree Mode (DEG)</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-600 font-bold">Standard School Math</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  In Degree mode, a full circle represents <strong>360 degrees (360°)</strong>. This mode is standard in high school geometry, navigation, surveying, and everyday engineering.
                </p>
                <div className="text-xs font-mono bg-slate-50 dark:bg-slate-800 p-2.5 rounded-xl space-y-1 text-slate-800 dark:text-slate-200">
                  <p>• sin(30°) = 0.5</p>
                  <p>• cos(60°) = 0.5</p>
                  <p>• tan(45°) = 1</p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Radian Mode (RAD)</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-600 font-bold">Calculus &amp; Physics</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  In Radian mode, an angle is measured by the arc length subtended on a unit circle, where a full revolution is <strong>2π radians (≈ 6.28318 rad)</strong>. This mode is mandatory in calculus, differential equations, and harmonic motion.
                </p>
                <div className="text-xs font-mono bg-slate-50 dark:bg-slate-800 p-2.5 rounded-xl space-y-1 text-slate-800 dark:text-slate-200">
                  <p>• sin(π / 6) = 0.5 (since π/6 rad = 30°)</p>
                  <p>• cos(π) = -1 (since π rad = 180°)</p>
                  <p>• tan(π / 4) = 1 (since π/4 rad = 45°)</p>
                </div>
              </div>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 italic">
              💡 Tip: Click the &ldquo;RAD / DEG&rdquo; toggle button in the top-left of the calculator display to switch instantly between angle units.
            </p>
          </div>

          {/* Logarithms & Exponential Math */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card p-6 rounded-2xl space-y-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="text-indigo-600">📈</span> Common Log (log₁₀) vs Natural Log (ln)
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Logarithms answer the question: <em>&ldquo;To what power must the base be raised to obtain this number?&rdquo;</em>
              </p>
              <ul className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-2 list-disc list-inside">
                <li><strong>Common Logarithm (log₁₀):</strong> Base 10. Frequently used in chemistry (pH scale), acoustics (decibels), and earthquake intensity (Richter scale). Example: <code>log(100) = 2</code>, because 10² = 100.</li>
                <li><strong>Natural Logarithm (ln):</strong> Base <em>e</em> (Euler&rsquo;s number ≈ 2.71828). Essential for exponential growth, radioactive decay, continuous compounding, and calculus derivatives. Example: <code>ln(e) = 1</code>, <code>ln(e²) = 2</code>.</li>
              </ul>
            </div>

            <div className="glass-card p-6 rounded-2xl space-y-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="text-indigo-600">🔢</span> Powers, Roots &amp; Factorials
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Perform higher-order algebraic computations with single-button operations:
              </p>
              <ul className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-2 list-disc list-inside">
                <li><strong>Exponentiation (xʸ / ^):</strong> Raise any base to an arbitrary positive, negative, or fractional power. Example: <code>2^8 = 256</code>; <code>9^0.5 = 3</code>.</li>
                <li><strong>Square Root (√x):</strong> Compute principal non-negative square roots. Example: <code>sqrt(144) = 12</code>.</li>
                <li><strong>Factorial (n!):</strong> Computes the product of all positive integers up to <em>n</em>. Indispensable for permutations and combinations. Example: <code>5! = 5 × 4 × 3 × 2 × 1 = 120</code>.</li>
                <li><strong>Mathematical Constants:</strong> Built-in exact definitions for Pi (<code>π ≈ 3.14159265</code>) and Euler&rsquo;s number (<code>e ≈ 2.71828182</code>).</li>
              </ul>
            </div>
          </div>

          {/* Verified Worked Examples */}
          <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-4">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="text-emerald-500">✓</span> Mathematically Verified Benchmark Examples
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              Verify accuracy against these verified reference calculations:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Trigonometry</span>
                <p className="text-sm font-mono font-bold text-slate-900 dark:text-white">sin(30°) in DEG</p>
                <p className="text-base font-black text-emerald-600 font-mono">= 0.5</p>
                <p className="text-[11px] text-slate-500">Exact half-unit ratio.</p>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Logarithm</span>
                <p className="text-sm font-mono font-bold text-slate-900 dark:text-white">log(1000)</p>
                <p className="text-base font-black text-emerald-600 font-mono">= 3</p>
                <p className="text-[11px] text-slate-500">Base-10 cube (10³ = 1000).</p>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Factorial</span>
                <p className="text-sm font-mono font-bold text-slate-900 dark:text-white">6!</p>
                <p className="text-base font-black text-emerald-600 font-mono">= 720</p>
                <p className="text-[11px] text-slate-500">6 × 5 × 4 × 3 × 2 × 1.</p>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Order of Operations</span>
                <p className="text-sm font-mono font-bold text-slate-900 dark:text-white">2 + 3 × (4^2) - 10</p>
                <p className="text-base font-black text-emerald-600 font-mono">= 40</p>
                <p className="text-[11px] text-slate-500">2 + 3×16 - 10 = 2+48-10 = 40.</p>
              </div>
            </div>
          </div>

          {/* Keyboard Shortcuts Reference */}
          <div className="glass-card p-6 rounded-2xl space-y-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>⌨️</span> Desktop Keyboard Shortcuts
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              For rapid data entry on laptop and desktop computers, use your physical keyboard:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <code className="font-bold text-indigo-600">0 - 9</code>: Numbers
              </div>
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <code className="font-bold text-indigo-600">+ - * /</code>: Basic Operators
              </div>
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <code className="font-bold text-indigo-600">( ) ^ %</code>: Parens, Power &amp; Mod
              </div>
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <code className="font-bold text-indigo-600">Enter</code>: Calculate (=)
              </div>
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <code className="font-bold text-indigo-600">Backspace</code>: Delete Last Char
              </div>
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <code className="font-bold text-indigo-600">Esc</code>: Clear All (C)
              </div>
            </div>
          </div>

          {/* Related Math & Calculation Tools */}
          <div className="glass-card p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <span>🔗</span> Explore Related Mathematics &amp; Calculation Tools
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
              <a
                href={getLinkUrl('/percentage-calculator')}
                onClick={(e) => { e.preventDefault(); onNavigate(getLinkUrl('/percentage-calculator')); }}
                className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 transition-all block text-xs group"
              >
                <span className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 block mb-1">
                  Percentage Calculator →
                </span>
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                  Calculate percentage increase, markdown discounts, and relative proportions.
                </span>
              </a>

              <a
                href={getLinkUrl('/college-gpa-calculator')}
                onClick={(e) => { e.preventDefault(); onNavigate(getLinkUrl('/college-gpa-calculator')); }}
                className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 transition-all block text-xs group"
              >
                <span className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 block mb-1">
                  College GPA Calculator →
                </span>
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                  Compute weighted grade point averages and assess graduation academic honors.
                </span>
              </a>

              <a
                href={getLinkUrl('/age-calculator')}
                onClick={(e) => { e.preventDefault(); onNavigate(getLinkUrl('/age-calculator')); }}
                className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 transition-all block text-xs group"
              >
                <span className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 block mb-1">
                  Age Calculator →
                </span>
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                  Determine exact chronological age in completed years, months, and calendar days.
                </span>
              </a>

              <a
                href={getLinkUrl('/cement-calculator')}
                onClick={(e) => { e.preventDefault(); onNavigate(getLinkUrl('/cement-calculator')); }}
                className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 transition-all block text-xs group"
              >
                <span className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 block mb-1">
                  Cement Concrete Calculator →
                </span>
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                  Calculate cement, sand, gravel volume and standard mix ratios (M15, M20, M25).
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

      {/* 6. CRAWLABLE RELATED TOOLS INTERNAL LINKING */}
      {relatedTools.length > 0 && (
        <section className="glass-panel p-6 sm:p-10 rounded-3xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 pb-4 border-b border-slate-200/60 dark:border-slate-800/60">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                Continue your task
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
