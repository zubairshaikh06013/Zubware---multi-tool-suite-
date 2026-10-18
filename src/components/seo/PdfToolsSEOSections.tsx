import React from 'react';
import { ToolMeta } from '../../types';
import { getLinkUrl } from '../../lib/paths';
import {
  FileText,
  Split,
  Merge,
  Image as ImageIcon,
  Trash2,
  FileCheck,
  Lock,
  Unlock,
  Sliders,
  FileSpreadsheet,
  FileCode,
  PenTool,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Layers,
  Printer,
  Download,
  Info,
  HelpCircle,
  Sparkles,
  Zap,
  Eye,
  FileSignature
} from 'lucide-react';

interface PdfToolsSEOSectionProps {
  tool: ToolMeta;
  onNavigate: (path: string) => void;
}

export const PdfToolsSEOSection: React.FC<PdfToolsSEOSectionProps> = ({ tool, onNavigate }) => {
  const handleNav = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    onNavigate(path);
  };

  switch (tool.id) {
    // =========================================================================
    // 1. PDF MERGE
    // =========================================================================
    case 'pdf-merge':
      return (
        <section aria-labelledby="pdf-merge-deep-guide" className="mt-12 space-y-10 border-t border-slate-200/80 pt-10 text-slate-700">
          <div className="rounded-2xl border border-sky-100 bg-gradient-to-br from-sky-50/70 via-white to-indigo-50/40 p-6 sm:p-8">
            <div className="flex items-center gap-3 text-sky-600 mb-4">
              <Merge className="h-6 w-6" />
              <span className="text-xs font-bold uppercase tracking-wider text-sky-700">Multi-Document Assembly Engine</span>
            </div>
            <h2 id="pdf-merge-deep-guide" className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              PDF Merge: Combine Multiple Documents into One Unified PDF
            </h2>
            <p className="mt-3 text-base sm:text-lg leading-relaxed text-slate-600">
              Zubware PDF Merge combines separate PDF files, scanned contracts, academic research papers, and corporate financial statements into a single sequentially ordered PDF directly inside your web browser. Powered by client-side WebAssembly and <code className="rounded bg-sky-100/80 px-1.5 py-0.5 text-xs font-mono font-semibold text-sky-800">pdf-lib</code>, your private records never travel across remote servers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2 text-indigo-600 font-semibold text-base mb-2">
                <Layers className="h-5 w-5" />
                <span>Drag &amp; Drop Reordering</span>
              </div>
              <p className="text-sm leading-relaxed text-slate-600">
                Arrange files into the exact sequence required. Move items up or down with responsive control handles, audit individual document page counts, and eliminate accidental misordering before merging.
              </p>
            </div>
            <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2 text-sky-600 font-semibold text-base mb-2">
                <ShieldCheck className="h-5 w-5" />
                <span>100% Vector Fidelity</span>
              </div>
              <p className="text-sm leading-relaxed text-slate-600">
                Unlike converters that flatten pages into low-resolution images, our engine extracts and stitches native object streams. Crisp vector typography, sharp line art, form fields, and hyperlinks remain intact.
              </p>
            </div>
            <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2 text-emerald-600 font-semibold text-base mb-2">
                <Zap className="h-5 w-5" />
                <span>Zero Server Uploads</span>
              </div>
              <p className="text-sm leading-relaxed text-slate-600">
                All document processing takes place in local browser RAM. Whether assembling confidential tax filings or sensitive NDAs, zero bytes are transmitted to external cloud infrastructure.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 space-y-6">
            <h3 className="text-xl font-bold text-slate-900">Practical Real-World Merging Workflows</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm text-slate-600">
              <div className="space-y-2">
                <h4 className="font-semibold text-slate-800 text-base">Corporate &amp; Legal Agreements</h4>
                <p>
                  Compile master service agreements (MSAs), statements of work (SOWs), non-disclosure agreements, and annexures into a solitary unified PDF ready for formal executive signature.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-slate-800 text-base">Tax Filings &amp; Financial Accounting</h4>
                <p>
                  Bundle yearly profit-and-loss statements, balance sheets, expense receipts, and government challans into an organized audit packet for tax advisors and regulatory compliance.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-slate-800 text-base">Academic Submissions &amp; Portfolios</h4>
                <p>
                  Join thesis dissertations with cover pages, scanned certificates, bibliographies, and project appendices without mismatched margins or font corruption.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-slate-800 text-base">Job Applications &amp; Resumes</h4>
                <p>
                  Combine your tailored resume, reference letters, university degree certificates, and portfolio samples into one professional dossier for ATS and recruiters.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-5 text-sm text-amber-900">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
              <div>
                <strong className="font-semibold text-amber-950">Encrypted PDFs &amp; Password Requirements:</strong>
                <p className="mt-1 text-amber-800 leading-relaxed">
                  If any uploaded PDF is password-protected, browser-based merging cannot extract its pages until encryption is lifted. Please unlock password-locked documents using our <a href={getLinkUrl('/unlock-pdf')} onClick={(e) => handleNav(e, '/unlock-pdf')} className="font-semibold underline hover:text-amber-950">Unlock PDF Tool</a> prior to merging.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-5">
            <h4 className="font-semibold text-slate-900 mb-3 text-sm">Related PDF Management Tools:</h4>
            <div className="flex flex-wrap gap-2 text-xs font-medium">
              <a href={getLinkUrl('/pdf-split')} onClick={(e) => handleNav(e, '/pdf-split')} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-slate-700 hover:border-sky-300 hover:text-sky-600 transition">
                <span>PDF Split</span> <ArrowRight className="h-3.5 w-3.5" />
              </a>
              <a href={getLinkUrl('/image-to-pdf')} onClick={(e) => handleNav(e, '/image-to-pdf')} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-slate-700 hover:border-sky-300 hover:text-sky-600 transition">
                <span>Image to PDF</span> <ArrowRight className="h-3.5 w-3.5" />
              </a>
              <a href={getLinkUrl('/protect-pdf')} onClick={(e) => handleNav(e, '/protect-pdf')} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-slate-700 hover:border-sky-300 hover:text-sky-600 transition">
                <span>Protect PDF</span> <ArrowRight className="h-3.5 w-3.5" />
              </a>
              <a href={getLinkUrl('/edit-pdf')} onClick={(e) => handleNav(e, '/edit-pdf')} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-slate-700 hover:border-sky-300 hover:text-sky-600 transition">
                <span>Online PDF Editor</span> <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </section>
      );

    // =========================================================================
    // 2. PDF SPLIT
    // =========================================================================
    case 'pdf-split':
      return (
        <section aria-labelledby="pdf-split-deep-guide" className="mt-12 space-y-10 border-t border-slate-200/80 pt-10 text-slate-700">
          <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50/70 via-white to-purple-50/40 p-6 sm:p-8">
            <div className="flex items-center gap-3 text-indigo-600 mb-4">
              <Split className="h-6 w-6" />
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">Precision Document Deconstruction</span>
            </div>
            <h2 id="pdf-split-deep-guide" className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              PDF Split: Separate, Extract &amp; Divide PDF Pages
            </h2>
            <p className="mt-3 text-base sm:text-lg leading-relaxed text-slate-600">
              Divide massive PDF documents into standalone chapters, isolated page ranges, or individual single-page files with complete visual control. Zubware PDF Split offers 3 specialized splitting modes engineered for office workers, students, legal teams, and administrators.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-sm">
              <h3 className="font-semibold text-slate-900 text-base mb-2">1. Extract All Pages</h3>
              <p className="text-sm leading-relaxed text-slate-600">
                Disassembles your entire multi-page document so that every single page becomes an independent PDF file. Automatically packaged into a clean, lightweight ZIP archive for instant one-click download.
              </p>
            </div>
            <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-sm">
              <h3 className="font-semibold text-slate-900 text-base mb-2">2. Custom Page Ranges</h3>
              <p className="text-sm leading-relaxed text-slate-600">
                Specify comma-delimited ranges such as <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-xs text-indigo-700">1-4, 7, 10-15</code>. Each defined range is saved into its own separate PDF document, preserving original page ordering.
              </p>
            </div>
            <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-sm">
              <h3 className="font-semibold text-slate-900 text-base mb-2">3. Interval Splitting</h3>
              <p className="text-sm leading-relaxed text-slate-600">
                Automate document partitioning by setting a fixed page interval (e.g., split every 2 pages or every 5 pages). Perfect for standardized multi-student exam papers and multi-vendor invoices.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 space-y-6">
            <h3 className="text-xl font-bold text-slate-900">Visual Page Selection &amp; Previews</h3>
            <p className="text-sm leading-relaxed text-slate-600">
              Never guess which page contains what data. Our tool renders interactive canvas thumbnails of every page directly in your browser memory. Inspect page headers, verify visual layouts, and select target ranges with absolute confidence before generating your split files.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-500 border-t border-slate-100 pt-4">
              <div>✓ Supports documents from 2 to 500+ pages</div>
              <div>✓ Preserves native embedded fonts and vector graphics</div>
              <div>✓ Client-side ZIP compilation via JSZip</div>
              <div>✓ Complete confidentiality with zero cloud logging</div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-5">
            <h4 className="font-semibold text-slate-900 mb-3 text-sm">Related PDF Tools:</h4>
            <div className="flex flex-wrap gap-2 text-xs font-medium">
              <a href={getLinkUrl('/pdf-merge')} onClick={(e) => handleNav(e, '/pdf-merge')} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-slate-700 hover:border-indigo-300 hover:text-indigo-600 transition">
                <span>PDF Merge</span> <ArrowRight className="h-3.5 w-3.5" />
              </a>
              <a href={getLinkUrl('/delete-pdf-pages')} onClick={(e) => handleNav(e, '/delete-pdf-pages')} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-slate-700 hover:border-indigo-300 hover:text-indigo-600 transition">
                <span>Delete PDF Pages</span> <ArrowRight className="h-3.5 w-3.5" />
              </a>
              <a href={getLinkUrl('/extract-pdf-pages')} onClick={(e) => handleNav(e, '/extract-pdf-pages')} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-slate-700 hover:border-indigo-300 hover:text-indigo-600 transition">
                <span>Extract PDF Pages</span> <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </section>
      );

    // =========================================================================
    // 3. IMAGE TO PDF
    // =========================================================================
    case 'image-to-pdf':
      return (
        <section aria-labelledby="image-to-pdf-deep-guide" className="mt-12 space-y-10 border-t border-slate-200/80 pt-10 text-slate-700">
          <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50/70 via-white to-teal-50/40 p-6 sm:p-8">
            <div className="flex items-center gap-3 text-emerald-600 mb-4">
              <ImageIcon className="h-6 w-6" />
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Document Rasterization &amp; Layout</span>
            </div>
            <h2 id="image-to-pdf-deep-guide" className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Image to PDF: Convert JPG, PNG &amp; WebP into Print-Ready PDF
            </h2>
            <p className="mt-3 text-base sm:text-lg leading-relaxed text-slate-600">
              Transform camera snapshots, scanned receipts, digital drawings, and screenshots into standardized, multi-page PDF documents. Choose standard ISO page sizes, adjust margin padding, reorder images intuitively, and export pristine vector-wrapped PDFs in seconds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-sm">
              <h3 className="font-semibold text-slate-900 text-base mb-2">Paper Size Standards</h3>
              <p className="text-sm leading-relaxed text-slate-600">
                Select between <strong>A4</strong> (standard international documentation), <strong>US Letter</strong> (North American standard), or <strong>Fit to Image</strong> (creates custom page dimensions matching the exact image aspect ratio without letterboxing).
              </p>
            </div>
            <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-sm">
              <h3 className="font-semibold text-slate-900 text-base mb-2">Margin &amp; Bleed Controls</h3>
              <p className="text-sm leading-relaxed text-slate-600">
                Configure edge spacing with three clean presets: <strong>None</strong> (full-bleed edge-to-edge rendering), <strong>Small (10pt)</strong> for standard office printing, or <strong>Large (20pt)</strong> for formal corporate presentation sheets.
              </p>
            </div>
            <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-sm">
              <h3 className="font-semibold text-slate-900 text-base mb-2">Multi-Format Batch Support</h3>
              <p className="text-sm leading-relaxed text-slate-600">
                Upload JPG, JPEG, PNG, and modern WebP images simultaneously. Reorder images in your queue with easy up/down controls, rotate orientations (Portrait vs. Landscape), and compile dozens of images into a single PDF.
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-5">
            <h4 className="font-semibold text-slate-900 mb-3 text-sm">Related Image &amp; PDF Tools:</h4>
            <div className="flex flex-wrap gap-2 text-xs font-medium">
              <a href={getLinkUrl('/pdf-to-images')} onClick={(e) => handleNav(e, '/pdf-to-images')} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-slate-700 hover:border-emerald-300 hover:text-emerald-600 transition">
                <span>PDF to Images</span> <ArrowRight className="h-3.5 w-3.5" />
              </a>
              <a href={getLinkUrl('/pdf-to-jpg')} onClick={(e) => handleNav(e, '/pdf-to-jpg')} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-slate-700 hover:border-emerald-300 hover:text-emerald-600 transition">
                <span>PDF to JPG Converter</span> <ArrowRight className="h-3.5 w-3.5" />
              </a>
              <a href={getLinkUrl('/pdf-merge')} onClick={(e) => handleNav(e, '/pdf-merge')} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-slate-700 hover:border-emerald-300 hover:text-emerald-600 transition">
                <span>PDF Merge</span> <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </section>
      );

    // =========================================================================
    // 4. PDF TO IMAGES
    // =========================================================================
    case 'pdf-to-images':
      return (
        <section aria-labelledby="pdf-to-images-deep-guide" className="mt-12 space-y-10 border-t border-slate-200/80 pt-10 text-slate-700">
          <div className="rounded-2xl border border-teal-100 bg-gradient-to-br from-teal-50/70 via-white to-sky-50/40 p-6 sm:p-8">
            <div className="flex items-center gap-3 text-teal-600 mb-4">
              <FileCheck className="h-6 w-6" />
              <span className="text-xs font-bold uppercase tracking-wider text-teal-700">High-DPI Raster Engine</span>
            </div>
            <h2 id="pdf-to-images-deep-guide" className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              PDF to Images: Extract &amp; Rasterize PDF Pages as PNG or JPG
            </h2>
            <p className="mt-3 text-base sm:text-lg leading-relaxed text-slate-600">
              Convert any PDF document into crisp, high-resolution raster images in browser memory. Whether creating PowerPoint presentation slides, web banner graphics, or archiving book pages, Zubware PDF to Images delivers true pixel-perfect rendering using modern canvas WebGL/Canvas2D acceleration.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-sm">
              <h3 className="font-semibold text-slate-900 text-base mb-2">PNG vs. JPG Formats</h3>
              <p className="text-sm leading-relaxed text-slate-600">
                Choose <strong>Lossless PNG</strong> for razor-sharp text, CAD blueprints, and high-contrast infographics, or <strong>Compressed JPG</strong> for photographic booklets and smaller file storage footprints.
              </p>
            </div>
            <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-sm">
              <h3 className="font-semibold text-slate-900 text-base mb-2">Resolution Scaling (DPI)</h3>
              <p className="text-sm leading-relaxed text-slate-600">
                Select between <strong>1x</strong> (standard web viewing ~72 DPI), <strong>2x</strong> (retina displays ~150 DPI), and <strong>3x</strong> (ultra-fine print quality ~300 DPI) for unmatched clarity when zooming into micro-text.
              </p>
            </div>
            <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-sm">
              <h3 className="font-semibold text-slate-900 text-base mb-2">Individual &amp; ZIP Download</h3>
              <p className="text-sm leading-relaxed text-slate-600">
                Download isolated single-page images as you browse thumbnails, or hit <em>Download All (ZIP)</em> to pack every rendered page into an organized archive with zero cloud waiting queues.
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-5">
            <h4 className="font-semibold text-slate-900 mb-3 text-sm">Related Conversion Tools:</h4>
            <div className="flex flex-wrap gap-2 text-xs font-medium">
              <a href={getLinkUrl('/pdf-to-jpg')} onClick={(e) => handleNav(e, '/pdf-to-jpg')} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-slate-700 hover:border-teal-300 hover:text-teal-600 transition">
                <span>PDF to JPG Converter</span> <ArrowRight className="h-3.5 w-3.5" />
              </a>
              <a href={getLinkUrl('/image-to-pdf')} onClick={(e) => handleNav(e, '/image-to-pdf')} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-slate-700 hover:border-teal-300 hover:text-teal-600 transition">
                <span>Image to PDF</span> <ArrowRight className="h-3.5 w-3.5" />
              </a>
              <a href={getLinkUrl('/pdf-to-text')} onClick={(e) => handleNav(e, '/pdf-to-text')} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-slate-700 hover:border-teal-300 hover:text-teal-600 transition">
                <span>PDF to Text Converter</span> <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </section>
      );

    // =========================================================================
    // 5. DELETE PDF PAGES
    // =========================================================================
    case 'delete-pdf-pages':
      return (
        <section aria-labelledby="delete-pdf-pages-deep-guide" className="mt-12 space-y-10 border-t border-slate-200/80 pt-10 text-slate-700">
          <div className="rounded-2xl border border-rose-100 bg-gradient-to-br from-rose-50/70 via-white to-pink-50/40 p-6 sm:p-8">
            <div className="flex items-center gap-3 text-rose-600 mb-4">
              <Trash2 className="h-6 w-6" />
              <span className="text-xs font-bold uppercase tracking-wider text-rose-700">Page Pruning &amp; Sanitization</span>
            </div>
            <h2 id="delete-pdf-pages-deep-guide" className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Delete PDF Pages: Remove Unwanted, Blank &amp; Confidential Pages
            </h2>
            <p className="mt-3 text-base sm:text-lg leading-relaxed text-slate-600">
              Clean up PDF documents by removing accidental blank scans, outdated policy terms, duplicate pages, or sensitive internal addendums. Zubware Delete PDF Pages reconstructs a lean, pristine PDF containing only the pages you want, executing entirely in client-side memory.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-sm">
              <h3 className="font-semibold text-slate-900 text-base mb-2">Visual Thumbnail Grid</h3>
              <p className="text-sm leading-relaxed text-slate-600">
                Browse high-fidelity preview thumbnails of every page in your document. Click any page card to toggle deletion with clear visual badging and live remaining page counters.
              </p>
            </div>
            <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-sm">
              <h3 className="font-semibold text-slate-900 text-base mb-2">Range &amp; Number Syntax</h3>
              <p className="text-sm leading-relaxed text-slate-600">
                Prefer keyboard entry? Input exact page numbers and ranges such as <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-xs text-rose-700">2, 5-8, 14</code> to instantly target bulk sections without manual clicking.
              </p>
            </div>
            <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-sm">
              <h3 className="font-semibold text-slate-900 text-base mb-2">True Object Cleanup</h3>
              <p className="text-sm leading-relaxed text-slate-600">
                Deleted pages are not merely hidden—they are completely omitted during document re-serialization, purging orphan font descriptors and embedded assets to reduce overall file weight.
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-5">
            <h4 className="font-semibold text-slate-900 mb-3 text-sm">Related PDF Organizing Tools:</h4>
            <div className="flex flex-wrap gap-2 text-xs font-medium">
              <a href={getLinkUrl('/extract-pdf-pages')} onClick={(e) => handleNav(e, '/extract-pdf-pages')} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-slate-700 hover:border-rose-300 hover:text-rose-600 transition">
                <span>Extract PDF Pages</span> <ArrowRight className="h-3.5 w-3.5" />
              </a>
              <a href={getLinkUrl('/pdf-split')} onClick={(e) => handleNav(e, '/pdf-split')} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-slate-700 hover:border-rose-300 hover:text-rose-600 transition">
                <span>PDF Split</span> <ArrowRight className="h-3.5 w-3.5" />
              </a>
              <a href={getLinkUrl('/pdf-merge')} onClick={(e) => handleNav(e, '/pdf-merge')} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-slate-700 hover:border-rose-300 hover:text-rose-600 transition">
                <span>PDF Merge</span> <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </section>
      );

    // =========================================================================
    // 6. EXTRACT PDF PAGES
    // =========================================================================
    case 'extract-pdf-pages':
      return (
        <section aria-labelledby="extract-pdf-pages-deep-guide" className="mt-12 space-y-10 border-t border-slate-200/80 pt-10 text-slate-700">
          <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50/70 via-white to-sky-50/40 p-6 sm:p-8">
            <div className="flex items-center gap-3 text-blue-600 mb-4">
              <FileText className="h-6 w-6" />
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700">Targeted Content Isolation</span>
            </div>
            <h2 id="extract-pdf-pages-deep-guide" className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Extract PDF Pages: Pull Specific Pages into a New PDF
            </h2>
            <p className="mt-3 text-base sm:text-lg leading-relaxed text-slate-600">
              Isolate key chapters, executive summaries, signed signature sheets, or specific diagrams from large PDF manuals. Zubware Extract PDF Pages creates a standalone document containing solely your chosen pages, preserving fonts, vector graphics, and metadata with zero server exposure.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-sm">
              <h3 className="font-semibold text-slate-900 text-base mb-2">Extraction vs. Splitting</h3>
              <p className="text-sm leading-relaxed text-slate-600">
                While splitting separates an entire document into multiple pieces, extraction pulls only your target pages into a singular, clean document while leaving unneeded sections behind.
              </p>
            </div>
            <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-sm">
              <h3 className="font-semibold text-slate-900 text-base mb-2">Intuitive Page Selection</h3>
              <p className="text-sm leading-relaxed text-slate-600">
                Click thumbnails directly or enter comma-separated values like <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-xs text-blue-700">1, 4-6, 11</code>. The output PDF compiles extracted pages in the exact chronological sequence specified.
              </p>
            </div>
            <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-sm">
              <h3 className="font-semibold text-slate-900 text-base mb-2">No Quality Degradation</h3>
              <p className="text-sm leading-relaxed text-slate-600">
                Text stays searchable, hyperlinks remain clickable, and high-resolution figures retain their original vector clarity. Zero re-compression or rasterization artifacts are introduced.
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-5">
            <h4 className="font-semibold text-slate-900 mb-3 text-sm">Related PDF Tools:</h4>
            <div className="flex flex-wrap gap-2 text-xs font-medium">
              <a href={getLinkUrl('/delete-pdf-pages')} onClick={(e) => handleNav(e, '/delete-pdf-pages')} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-slate-700 hover:border-blue-300 hover:text-blue-600 transition">
                <span>Delete PDF Pages</span> <ArrowRight className="h-3.5 w-3.5" />
              </a>
              <a href={getLinkUrl('/pdf-split')} onClick={(e) => handleNav(e, '/pdf-split')} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-slate-700 hover:border-blue-300 hover:text-blue-600 transition">
                <span>PDF Split</span> <ArrowRight className="h-3.5 w-3.5" />
              </a>
              <a href={getLinkUrl('/pdf-merge')} onClick={(e) => handleNav(e, '/pdf-merge')} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-slate-700 hover:border-blue-300 hover:text-blue-600 transition">
                <span>PDF Merge</span> <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </section>
      );

    // =========================================================================
    // 7. PROTECT PDF
    // =========================================================================
    case 'protect-pdf':
      return (
        <section aria-labelledby="protect-pdf-deep-guide" className="mt-12 space-y-10 border-t border-slate-200/80 pt-10 text-slate-700">
          <div className="rounded-2xl border border-amber-100 bg-gradient-to-br from-amber-50/70 via-white to-orange-50/40 p-6 sm:p-8">
            <div className="flex items-center gap-3 text-amber-600 mb-4">
              <Lock className="h-6 w-6" />
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700">Cryptographic Security &amp; Permissions</span>
            </div>
            <h2 id="protect-pdf-deep-guide" className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Protect PDF: Password Encryption &amp; Permission Restriction Online
            </h2>
            <p className="mt-3 text-base sm:text-lg leading-relaxed text-slate-600">
              Shield confidential financial statements, proprietary patents, legal briefs, and personal records against unauthorized viewing, printing, and copying. Powered by standard-compliant AES encryption directly in your browser, your passwords and sensitive files are never exposed to remote third parties.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-sm">
              <h3 className="font-semibold text-slate-900 text-base mb-2">User Password (Open Lock)</h3>
              <p className="text-sm leading-relaxed text-slate-600">
                Locks the PDF document so that unauthorized recipients cannot view or render its contents without typing the required passphrase. Works universally across Adobe Acrobat, Apple Preview, and web browsers.
              </p>
            </div>
            <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-sm">
              <h3 className="font-semibold text-slate-900 text-base mb-2">Owner Password &amp; Permissions</h3>
              <p className="text-sm leading-relaxed text-slate-600">
                Enforce operational restrictions on your documents. Prevent printing in high resolution, prohibit copying text and graphics to clipboard, and block unauthorized page modifications or form tampering.
              </p>
            </div>
            <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-sm">
              <h3 className="font-semibold text-slate-900 text-base mb-2">Client-Side Cipher Engine</h3>
              <p className="text-sm leading-relaxed text-slate-600">
                All cryptographic key derivation and AES encryption routines execute inside browser WebAssembly. Your unencrypted source documents and chosen passwords never touch a network socket.
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-5">
            <h4 className="font-semibold text-slate-900 mb-3 text-sm">Related PDF Security Tools:</h4>
            <div className="flex flex-wrap gap-2 text-xs font-medium">
              <a href={getLinkUrl('/unlock-pdf')} onClick={(e) => handleNav(e, '/unlock-pdf')} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-slate-700 hover:border-amber-300 hover:text-amber-600 transition">
                <span>Unlock PDF</span> <ArrowRight className="h-3.5 w-3.5" />
              </a>
              <a href={getLinkUrl('/pdf-signature')} onClick={(e) => handleNav(e, '/pdf-signature')} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-slate-700 hover:border-amber-300 hover:text-amber-600 transition">
                <span>Sign PDF Online</span> <ArrowRight className="h-3.5 w-3.5" />
              </a>
              <a href={getLinkUrl('/edit-pdf')} onClick={(e) => handleNav(e, '/edit-pdf')} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-slate-700 hover:border-amber-300 hover:text-amber-600 transition">
                <span>Online PDF Editor</span> <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </section>
      );

    // =========================================================================
    // 8. UNLOCK PDF
    // =========================================================================
    case 'unlock-pdf':
      return (
        <section aria-labelledby="unlock-pdf-deep-guide" className="mt-12 space-y-10 border-t border-slate-200/80 pt-10 text-slate-700">
          <div className="rounded-2xl border border-cyan-100 bg-gradient-to-br from-cyan-50/70 via-white to-blue-50/40 p-6 sm:p-8">
            <div className="flex items-center gap-3 text-cyan-600 mb-4">
              <Unlock className="h-6 w-6" />
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-700">Decryption &amp; Restriction Removal</span>
            </div>
            <h2 id="unlock-pdf-deep-guide" className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Unlock PDF: Remove Passwords &amp; Security Restrictions
            </h2>
            <p className="mt-3 text-base sm:text-lg leading-relaxed text-slate-600">
              Eliminate recurring password prompts from your personal e-statements, payslips, utility bills, and contracts. By entering your known password once, Zubware Unlock PDF decrypts the document in browser memory and outputs a clean, unencrypted PDF that opens friction-free anywhere.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-sm">
              <h3 className="font-semibold text-slate-900 text-base mb-2">Permanent Password Removal</h3>
              <p className="text-sm leading-relaxed text-slate-600">
                Strips internal security handler dictionaries and encryption keys from the PDF structure. The resulting output can be merged, printed, annotated, and shared without entering passphrases repeatedly.
              </p>
            </div>
            <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-sm">
              <h3 className="font-semibold text-slate-900 text-base mb-2">Authorized Owner Utility</h3>
              <p className="text-sm leading-relaxed text-slate-600">
                This tool is engineered for authorized document owners to streamline routine workflows. It decrypts files using legitimate credentials; it does not crack or brute-force unknown passwords.
              </p>
            </div>
            <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-sm">
              <h3 className="font-semibold text-slate-900 text-base mb-2">Total Financial Privacy</h3>
              <p className="text-sm leading-relaxed text-slate-600">
                Personal payslips and bank statements carry highly confidential data. Because decryption executes 100% locally on your machine, your private financial records and passwords never touch a server.
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-5">
            <h4 className="font-semibold text-slate-900 mb-3 text-sm">Related PDF Security Tools:</h4>
            <div className="flex flex-wrap gap-2 text-xs font-medium">
              <a href={getLinkUrl('/protect-pdf')} onClick={(e) => handleNav(e, '/protect-pdf')} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-slate-700 hover:border-cyan-300 hover:text-cyan-600 transition">
                <span>Protect PDF</span> <ArrowRight className="h-3.5 w-3.5" />
              </a>
              <a href={getLinkUrl('/pdf-merge')} onClick={(e) => handleNav(e, '/pdf-merge')} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-slate-700 hover:border-cyan-300 hover:text-cyan-600 transition">
                <span>PDF Merge</span> <ArrowRight className="h-3.5 w-3.5" />
              </a>
              <a href={getLinkUrl('/pdf-size-adjuster')} onClick={(e) => handleNav(e, '/pdf-size-adjuster')} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-slate-700 hover:border-cyan-300 hover:text-cyan-600 transition">
                <span>PDF Size Adjuster</span> <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </section>
      );

    // =========================================================================
    // 9. PDF SIZE ADJUSTER
    // =========================================================================
    case 'pdf-size-adjuster':
      return (
        <section aria-labelledby="pdf-size-adjuster-deep-guide" className="mt-12 space-y-10 border-t border-slate-200/80 pt-10 text-slate-700">
          <div className="rounded-2xl border border-purple-100 bg-gradient-to-br from-purple-50/70 via-white to-indigo-50/40 p-6 sm:p-8">
            <div className="flex items-center gap-3 text-purple-600 mb-4">
              <Sliders className="h-6 w-6" />
              <span className="text-xs font-bold uppercase tracking-wider text-purple-700">Exact Byte &amp; Portal Upload Optimization</span>
            </div>
            <h2 id="pdf-size-adjuster-deep-guide" className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              PDF Size Adjuster: Precision Target KB/MB Adjustment for Upload Portals
            </h2>
            <p className="mt-3 text-base sm:text-lg leading-relaxed text-slate-600">
              Government recruitment portals (UPSC, SSC, IBPS, State PSCs), university admission gateways, and visa applications frequently mandate strict file size boundaries—rejecting documents that are either <em>too large</em> (over 200KB) or <em>too small</em> (under 100KB). Zubware PDF Size Adjuster solves both problems with mathematical byte accuracy in your browser.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-xl border border-slate-200/90 bg-white p-6 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-indigo-600 font-semibold text-lg">
                <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-bold text-indigo-800">EXPANSION MODE</span>
                <span>Increasing PDF File Size</span>
              </div>
              <p className="text-sm leading-relaxed text-slate-600">
                When an application portal rejects your certificate for being below the minimum size (e.g., must be between 100KB and 300KB), this mode adds standard-compliant PDF-internal private data streams (<code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-xs text-indigo-700">PieceInfo</code>). <strong>Crucially, it does NOT blur text, degrade visual clarity, or alter page layout.</strong> Your document remains 100% vector-crisp and legible.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200/90 bg-white p-6 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-sky-600 font-semibold text-lg">
                <span className="rounded-full bg-sky-100 px-2.5 py-0.5 text-xs font-bold text-sky-800">REDUCTION MODE</span>
                <span>Compressing PDF File Size</span>
              </div>
              <p className="text-sm leading-relaxed text-slate-600">
                When your scanned PDF exceeds strict file caps (e.g., max 500KB or 2MB), this mode optimizes object streams, purges duplicate font subsets, and applies smart stream compression. It shrinks file weight while preserving essential text sharpness and document readability.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 space-y-4">
            <h3 className="text-xl font-bold text-slate-900">How Target Sizing Operates Under the Hood</h3>
            <p className="text-sm leading-relaxed text-slate-600">
              Unlike generic tools that force you into arbitrary low/medium/high presets, Zubware PDF Size Adjuster lets you specify exact target figures (e.g., exactly 250 KB or 1.5 MB). The calculation engine computes precise decimal bytes (1 KB = 1,000 bytes) and iteratively tailors output stream buffers to reach your target upload window safely, capped at an optimal 50 MB browser memory limit.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-5">
            <h4 className="font-semibold text-slate-900 mb-3 text-sm">Related Portal Application Tools:</h4>
            <div className="flex flex-wrap gap-2 text-xs font-medium">
              <a href={getLinkUrl('/signature-resizer')} onClick={(e) => handleNav(e, '/signature-resizer')} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-slate-700 hover:border-purple-300 hover:text-purple-600 transition">
                <span>Signature Resizer</span> <ArrowRight className="h-3.5 w-3.5" />
              </a>
              <a href={getLinkUrl('/photo-signature-joiner')} onClick={(e) => handleNav(e, '/photo-signature-joiner')} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-slate-700 hover:border-purple-300 hover:text-purple-600 transition">
                <span>Photo &amp; Signature Joiner</span> <ArrowRight className="h-3.5 w-3.5" />
              </a>
              <a href={getLinkUrl('/pdf-merge')} onClick={(e) => handleNav(e, '/pdf-merge')} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-slate-700 hover:border-purple-300 hover:text-purple-600 transition">
                <span>PDF Merge</span> <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </section>
      );

    // =========================================================================
    // 10. PDF TO JPG CONVERTER
    // =========================================================================
    case 'pdf-to-jpg':
      return (
        <section aria-labelledby="pdf-to-jpg-deep-guide" className="mt-12 space-y-10 border-t border-slate-200/80 pt-10 text-slate-700">
          <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50/70 via-white to-sky-50/40 p-6 sm:p-8">
            <div className="flex items-center gap-3 text-blue-600 mb-4">
              <ImageIcon className="h-6 w-6" />
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700">Dedicated JPEG Conversion Engine</span>
            </div>
            <h2 id="pdf-to-jpg-deep-guide" className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              PDF to JPG: Convert PDF Pages into High-Quality JPEG Images
            </h2>
            <p className="mt-3 text-base sm:text-lg leading-relaxed text-slate-600">
              Convert PDF reports, product catalogs, brochures, and artwork into universally compatible JPG image files. Zubware PDF to JPG gives you direct control over rendering resolution, JPEG compression quality, and batch export packaging with zero server uploads.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-sm">
              <h3 className="font-semibold text-slate-900 text-base mb-2">Quality Presets</h3>
              <p className="text-sm leading-relaxed text-slate-600">
                Choose between <strong>High (100%)</strong> for maximum photo fidelity and crisp text readability, <strong>Medium (80%)</strong> for balanced web sharing, or <strong>Low (60%)</strong> for lightweight email attachments.
              </p>
            </div>
            <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-sm">
              <h3 className="font-semibold text-slate-900 text-base mb-2">Multi-Scale DPI Rendering</h3>
              <p className="text-sm leading-relaxed text-slate-600">
                Scale your output canvas by <strong>1x</strong> (standard 72 DPI display), <strong>2x</strong> (retina 150 DPI), or <strong>3x</strong> (300 DPI print quality) to prevent pixelation on ultra-high-definition monitors.
              </p>
            </div>
            <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-sm">
              <h3 className="font-semibold text-slate-900 text-base mb-2">Automated Background Filling</h3>
              <p className="text-sm leading-relaxed text-slate-600">
                Unlike poorly configured converters that render transparent PDF layers as solid black, our canvas pipeline automatically fills background canvas bounds with clean solid white for natural image viewing.
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-5">
            <h4 className="font-semibold text-slate-900 mb-3 text-sm">Related Image &amp; PDF Tools:</h4>
            <div className="flex flex-wrap gap-2 text-xs font-medium">
              <a href={getLinkUrl('/pdf-to-images')} onClick={(e) => handleNav(e, '/pdf-to-images')} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-slate-700 hover:border-blue-300 hover:text-blue-600 transition">
                <span>PDF to Images (PNG/JPG)</span> <ArrowRight className="h-3.5 w-3.5" />
              </a>
              <a href={getLinkUrl('/image-to-pdf')} onClick={(e) => handleNav(e, '/image-to-pdf')} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-slate-700 hover:border-blue-300 hover:text-blue-600 transition">
                <span>Image to PDF</span> <ArrowRight className="h-3.5 w-3.5" />
              </a>
              <a href={getLinkUrl('/pdf-to-word')} onClick={(e) => handleNav(e, '/pdf-to-word')} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-slate-700 hover:border-blue-300 hover:text-blue-600 transition">
                <span>PDF to Word</span> <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </section>
      );

    // =========================================================================
    // 11. ONLINE PDF EDITOR
    // =========================================================================
    case 'edit-pdf':
      return (
        <section aria-labelledby="edit-pdf-deep-guide" className="mt-12 space-y-10 border-t border-slate-200/80 pt-10 text-slate-700">
          <div className="rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50/70 via-white to-purple-50/40 p-6 sm:p-8">
            <div className="flex items-center gap-3 text-violet-600 mb-4">
              <PenTool className="h-6 w-6" />
              <span className="text-xs font-bold uppercase tracking-wider text-violet-700">Interactive Document Markup &amp; Annotation</span>
            </div>
            <h2 id="edit-pdf-deep-guide" className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Online PDF Editor: Add Text, Freehand Drawings &amp; Annotations Free
            </h2>
            <p className="mt-3 text-base sm:text-lg leading-relaxed text-slate-600">
              Fill out non-interactive PDF application forms, annotate blueprints, sign documents, and add textual feedback directly in your browser. Zubware Online PDF Editor provides an intuitive client-side canvas workspace that permanently flattens your edits into the PDF with zero software installations and zero watermarks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-sm">
              <h3 className="font-semibold text-slate-900 text-base mb-2">Add Text Overlays</h3>
              <p className="text-sm leading-relaxed text-slate-600">
                Click anywhere on any page to type text. Adjust font sizes (10pt to 32pt), select colors (black, blue, red, green), and reposition text blocks to fill out unfillable scanned forms seamlessly.
              </p>
            </div>
            <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-sm">
              <h3 className="font-semibold text-slate-900 text-base mb-2">Freehand Drawing &amp; Pen</h3>
              <p className="text-sm leading-relaxed text-slate-600">
                Draw circles around key clauses, underline important terms, sketch arrows, and write handwritten notes with smooth mouse and touchscreen pen support, customizable stroke weights, and colors.
              </p>
            </div>
            <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-sm">
              <h3 className="font-semibold text-slate-900 text-base mb-2">Permanent Stream Flattening</h3>
              <p className="text-sm leading-relaxed text-slate-600">
                Edits are not temporary HTML overlays. When you click download, <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-xs text-violet-700">pdf-lib</code> burns text and drawings directly into the PDF content stream so they display correctly on every PDF viewer.
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-5">
            <h4 className="font-semibold text-slate-900 mb-3 text-sm">Related PDF Editing Tools:</h4>
            <div className="flex flex-wrap gap-2 text-xs font-medium">
              <a href={getLinkUrl('/pdf-signature')} onClick={(e) => handleNav(e, '/pdf-signature')} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-slate-700 hover:border-violet-300 hover:text-violet-600 transition">
                <span>Sign PDF Online</span> <ArrowRight className="h-3.5 w-3.5" />
              </a>
              <a href={getLinkUrl('/protect-pdf')} onClick={(e) => handleNav(e, '/protect-pdf')} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-slate-700 hover:border-violet-300 hover:text-violet-600 transition">
                <span>Protect PDF</span> <ArrowRight className="h-3.5 w-3.5" />
              </a>
              <a href={getLinkUrl('/pdf-merge')} onClick={(e) => handleNav(e, '/pdf-merge')} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-slate-700 hover:border-violet-300 hover:text-violet-600 transition">
                <span>PDF Merge</span> <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </section>
      );

    // =========================================================================
    // 12. PDF TO WORD CONVERTER
    // =========================================================================
    case 'pdf-to-word':
      return (
        <section aria-labelledby="pdf-to-word-deep-guide" className="mt-12 space-y-10 border-t border-slate-200/80 pt-10 text-slate-700">
          <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50/70 via-white to-indigo-50/40 p-6 sm:p-8">
            <div className="flex items-center gap-3 text-blue-600 mb-4">
              <FileCode className="h-6 w-6" />
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700">OpenXML Document Reconstruction</span>
            </div>
            <h2 id="pdf-to-word-deep-guide" className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              PDF to Word: Convert PDF into Editable Microsoft Word (.DOCX)
            </h2>
            <p className="mt-3 text-base sm:text-lg leading-relaxed text-slate-600">
              Extract formatted text, headings, and paragraphs from PDF documents and compile them into a genuine OpenXML Microsoft Word (<code className="rounded bg-blue-100/80 px-1.5 py-0.5 text-xs font-mono font-semibold text-blue-800">.docx</code>) document. Zubware PDF to Word extracts digital content client-side, builds Word XML packages with JSZip, and lets you edit contracts and resumes in Word or Google Docs immediately.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-sm">
              <h3 className="font-semibold text-slate-900 text-base mb-2">Native OpenXML Packaging</h3>
              <p className="text-sm leading-relaxed text-slate-600">
                Generates legitimate <code className="font-mono text-xs text-blue-700">.docx</code> files compliant with Microsoft Word standards, including proper XML namespaces, paragraph structures, and document body tags. Opens natively in MS Word, LibreOffice, and Google Docs.
              </p>
            </div>
            <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-sm">
              <h3 className="font-semibold text-slate-900 text-base mb-2">Interactive HTML Preview</h3>
              <p className="text-sm leading-relaxed text-slate-600">
                Inspect converted page contents inside our interactive reading pane before exporting. Review paragraph groupings and page breaks in real time to verify text accuracy.
              </p>
            </div>
            <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-sm">
              <h3 className="font-semibold text-slate-900 text-base mb-2">Scanned Documents &amp; OCR Notice</h3>
              <p className="text-sm leading-relaxed text-slate-600">
                This tool extracts digital, selectable vector text. For scanned, photo-only documents where text is rasterized into pictures, use our <a href={getLinkUrl('/pdf-to-text')} onClick={(e) => handleNav(e, '/pdf-to-text')} className="font-semibold text-blue-700 underline">PDF to Text OCR Tool</a> to extract text via neural recognition.
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-5">
            <h4 className="font-semibold text-slate-900 mb-3 text-sm">Related Office Productivity Tools:</h4>
            <div className="flex flex-wrap gap-2 text-xs font-medium">
              <a href={getLinkUrl('/word-to-pdf')} onClick={(e) => handleNav(e, '/word-to-pdf')} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-slate-700 hover:border-blue-300 hover:text-blue-600 transition">
                <span>Word to PDF Converter</span> <ArrowRight className="h-3.5 w-3.5" />
              </a>
              <a href={getLinkUrl('/pdf-to-text')} onClick={(e) => handleNav(e, '/pdf-to-text')} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-slate-700 hover:border-blue-300 hover:text-blue-600 transition">
                <span>PDF to Text Converter</span> <ArrowRight className="h-3.5 w-3.5" />
              </a>
              <a href={getLinkUrl('/pdf-to-excel')} onClick={(e) => handleNav(e, '/pdf-to-excel')} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-slate-700 hover:border-blue-300 hover:text-blue-600 transition">
                <span>PDF to Excel Converter</span> <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </section>
      );

    // =========================================================================
    // 13. WORD TO PDF CONVERTER
    // =========================================================================
    case 'word-to-pdf':
      return (
        <section aria-labelledby="word-to-pdf-deep-guide" className="mt-12 space-y-10 border-t border-slate-200/80 pt-10 text-slate-700">
          <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50/70 via-white to-blue-50/40 p-6 sm:p-8">
            <div className="flex items-center gap-3 text-indigo-600 mb-4">
              <FileText className="h-6 w-6" />
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">OpenXML Parsing &amp; Vector Rendering</span>
            </div>
            <h2 id="word-to-pdf-deep-guide" className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Word to PDF: Convert DOCX Documents into Professional PDF
            </h2>
            <p className="mt-3 text-base sm:text-lg leading-relaxed text-slate-600">
              Convert Microsoft Word (<code className="rounded bg-indigo-100/80 px-1.5 py-0.5 text-xs font-mono font-semibold text-indigo-800">.docx</code>) documents into clean, standardized vector PDF files directly in your web browser. Zubware Word to PDF unzips document XML, maps headings, lists, tables, and paragraphs, and renders crisp vector PDF files ready for printing and email distribution.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-sm">
              <h3 className="font-semibold text-slate-900 text-base mb-2">Structure &amp; Hierarchy Parsing</h3>
              <p className="text-sm leading-relaxed text-slate-600">
                Recognizes Heading 1, 2, 3 styles, standard body paragraphs, bulleted item lists, and multi-cell tabular data (<code className="font-mono text-xs text-indigo-700">w:tbl</code>) to recreate document flow accurately.
              </p>
            </div>
            <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-sm">
              <h3 className="font-semibold text-slate-900 text-base mb-2">Paper Geometry Controls</h3>
              <p className="text-sm leading-relaxed text-slate-600">
                Customize your target document dimensions between <strong>A4</strong> and <strong>US Letter</strong>, adjust base typographic font sizing (9pt to 14pt), and set margin padding (10mm to 25mm) for precise print formatting.
              </p>
            </div>
            <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-sm">
              <h3 className="font-semibold text-slate-900 text-base mb-2">Accepted File Standards</h3>
              <p className="text-sm leading-relaxed text-slate-600">
                Built specifically for modern <code className="font-mono text-xs text-indigo-700">.docx</code> OpenXML formats (Office 2007 to present). For legacy 1997-2003 binary <code className="font-mono text-xs text-slate-500">.doc</code> files, save them as <code className="font-mono text-xs text-indigo-700">.docx</code> in Word first before converting.
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-5">
            <h4 className="font-semibold text-slate-900 mb-3 text-sm">Related Office Productivity Tools:</h4>
            <div className="flex flex-wrap gap-2 text-xs font-medium">
              <a href={getLinkUrl('/pdf-to-word')} onClick={(e) => handleNav(e, '/pdf-to-word')} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-slate-700 hover:border-indigo-300 hover:text-indigo-600 transition">
                <span>PDF to Word Converter</span> <ArrowRight className="h-3.5 w-3.5" />
              </a>
              <a href={getLinkUrl('/pdf-merge')} onClick={(e) => handleNav(e, '/pdf-merge')} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-slate-700 hover:border-indigo-300 hover:text-indigo-600 transition">
                <span>PDF Merge</span> <ArrowRight className="h-3.5 w-3.5" />
              </a>
              <a href={getLinkUrl('/edit-pdf')} onClick={(e) => handleNav(e, '/edit-pdf')} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-slate-700 hover:border-indigo-300 hover:text-indigo-600 transition">
                <span>Online PDF Editor</span> <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </section>
      );

    // =========================================================================
    // 14. PDF TO TEXT CONVERTER
    // =========================================================================
    case 'pdf-to-text':
      return (
        <section aria-labelledby="pdf-to-text-deep-guide" className="mt-12 space-y-10 border-t border-slate-200/80 pt-10 text-slate-700">
          <div className="rounded-2xl border border-amber-100 bg-gradient-to-br from-amber-50/70 via-white to-yellow-50/40 p-6 sm:p-8">
            <div className="flex items-center gap-3 text-amber-600 mb-4">
              <FileText className="h-6 w-6" />
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700">Dual-Mode Extraction &amp; OCR Engine</span>
            </div>
            <h2 id="pdf-to-text-deep-guide" className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              PDF to Text: Extract Digital Text &amp; Scanned Documents with OCR
            </h2>
            <p className="mt-3 text-base sm:text-lg leading-relaxed text-slate-600">
              Extract plain text from research papers, ebooks, invoices, and historical archives. Zubware PDF to Text features a dual-engine architecture: ultra-fast digital vector text parsing via <code className="rounded bg-amber-100/80 px-1.5 py-0.5 text-xs font-mono font-semibold text-amber-800">pdfjs-dist</code>, and client-side neural optical character recognition (OCR) via <code className="rounded bg-amber-100/80 px-1.5 py-0.5 text-xs font-mono font-semibold text-amber-800">Tesseract.js</code> for scanned, image-only documents.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-xl border border-slate-200/90 bg-white p-6 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-amber-600 font-semibold text-lg">
                <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-800">DIGITAL MODE</span>
                <span>Selectable Vector Text Extraction</span>
              </div>
              <p className="text-sm leading-relaxed text-slate-600">
                Reads embedded Unicode font tables directly from modern PDF files. Operates instantaneously across hundreds of pages, extracting raw strings with zero typos and organizing output cleanly by page markers.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200/90 bg-white p-6 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-teal-600 font-semibold text-lg">
                <span className="rounded-full bg-teal-100 px-2.5 py-0.5 text-xs font-bold text-teal-800">OCR SCAN MODE</span>
                <span>Neural Scanned Image OCR</span>
              </div>
              <p className="text-sm leading-relaxed text-slate-600">
                When documents consist of scanned flat photos where text cannot be selected, our Tesseract WebAssembly engine rasterizes pages to high-resolution canvas buffers and transcribes printed characters across multiple supported languages without cloud uploads.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 space-y-4">
            <h3 className="text-xl font-bold text-slate-900">One-Click Copy &amp; Clean Text Formatting</h3>
            <p className="text-sm leading-relaxed text-slate-600">
              Review extracted plain text in a clean monospace reading pane. Copy entire documents to clipboard with a single button press, or download an organized <code className="font-mono text-xs text-amber-700">.txt</code> file ready for natural language processing, data analysis, or LLM indexing.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-5">
            <h4 className="font-semibold text-slate-900 mb-3 text-sm">Related Data Extraction Tools:</h4>
            <div className="flex flex-wrap gap-2 text-xs font-medium">
              <a href={getLinkUrl('/pdf-to-excel')} onClick={(e) => handleNav(e, '/pdf-to-excel')} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-slate-700 hover:border-amber-300 hover:text-amber-600 transition">
                <span>PDF to Excel Converter</span> <ArrowRight className="h-3.5 w-3.5" />
              </a>
              <a href={getLinkUrl('/pdf-to-word')} onClick={(e) => handleNav(e, '/pdf-to-word')} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-slate-700 hover:border-amber-300 hover:text-amber-600 transition">
                <span>PDF to Word Converter</span> <ArrowRight className="h-3.5 w-3.5" />
              </a>
              <a href={getLinkUrl('/handwriting-to-text')} onClick={(e) => handleNav(e, '/handwriting-to-text')} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-slate-700 hover:border-amber-300 hover:text-amber-600 transition">
                <span>Handwriting to Text OCR</span> <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </section>
      );

    // =========================================================================
    // 15. PDF TO EXCEL CONVERTER
    // =========================================================================
    case 'pdf-to-excel':
      return (
        <section aria-labelledby="pdf-to-excel-deep-guide" className="mt-12 space-y-10 border-t border-slate-200/80 pt-10 text-slate-700">
          <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50/70 via-white to-teal-50/40 p-6 sm:p-8">
            <div className="flex items-center gap-3 text-emerald-600 mb-4">
              <FileSpreadsheet className="h-6 w-6" />
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Tabular Data Reconstruction</span>
            </div>
            <h2 id="pdf-to-excel-deep-guide" className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              PDF to Excel: Extract Tables to Microsoft Excel (.XLSX) &amp; CSV
            </h2>
            <p className="mt-3 text-base sm:text-lg leading-relaxed text-slate-600">
              For PDFs with selectable text, Zubware estimates rows and cells from text positions, lets you correct the grid, then exports <code className="rounded bg-emerald-100/80 px-1.5 py-0.5 text-xs font-mono font-semibold text-emerald-800">.xlsx</code> or <code className="rounded bg-emerald-100/80 px-1.5 py-0.5 text-xs font-mono font-semibold text-emerald-800">.csv</code> in your browser. Scanned pages need OCR first. Complex statements, merged cells and uneven spacing may require manual editing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-sm">
              <h3 className="font-semibold text-slate-900 text-base mb-2">Geometric Coordinate Bucketing</h3>
              <p className="text-sm leading-relaxed text-slate-600">
                Reads text fragments and their (X, Y) page coordinates. Groups nearby Y positions into rows and uses horizontal gaps to split cells. This is an estimate, so inspect the result before export.
              </p>
            </div>
            <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-sm">
              <h3 className="font-semibold text-slate-900 text-base mb-2">Interactive In-Browser Grid Editor</h3>
              <p className="text-sm leading-relaxed text-slate-600">
                Preview your reconstructed spreadsheet before downloading. Fix cell text, insert missing rows, or remove unnecessary header noise directly within our responsive table interface.
              </p>
            </div>
            <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-sm">
              <h3 className="font-semibold text-slate-900 text-base mb-2">Dual XLSX &amp; CSV Export</h3>
              <p className="text-sm leading-relaxed text-slate-600">
                Download an OpenXML <code className="font-mono text-xs text-emerald-700">.xlsx</code> workbook with text cells, or a comma-separated <code className="font-mono text-xs text-emerald-700">.csv</code> file. PDF formulas and original spreadsheet formatting are not reconstructed.
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-5">
            <h4 className="font-semibold text-slate-900 mb-3 text-sm">Related Business &amp; Financial Tools:</h4>
            <div className="flex flex-wrap gap-2 text-xs font-medium">
              <a href={getLinkUrl('/pdf-to-text')} onClick={(e) => handleNav(e, '/pdf-to-text')} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-slate-700 hover:border-emerald-300 hover:text-emerald-600 transition">
                <span>PDF to Text Converter</span> <ArrowRight className="h-3.5 w-3.5" />
              </a>
              <a href={getLinkUrl('/gst-invoice-generator')} onClick={(e) => handleNav(e, '/gst-invoice-generator')} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-slate-700 hover:border-emerald-300 hover:text-emerald-600 transition">
                <span>GST Invoice Generator</span> <ArrowRight className="h-3.5 w-3.5" />
              </a>
              <a href={getLinkUrl('/pdf-to-word')} onClick={(e) => handleNav(e, '/pdf-to-word')} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-slate-700 hover:border-emerald-300 hover:text-emerald-600 transition">
                <span>PDF to Word Converter</span> <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </section>
      );

    // =========================================================================
    // 16. SIGN PDF ONLINE
    // =========================================================================
    case 'pdf-signature':
      return (
        <section aria-labelledby="pdf-signature-deep-guide" className="mt-12 space-y-10 border-t border-slate-200/80 pt-10 text-slate-700">
          <div className="rounded-2xl border border-slate-300 bg-gradient-to-br from-slate-100/80 via-white to-blue-50/40 p-6 sm:p-8">
            <div className="flex items-center gap-3 text-slate-700 mb-4">
              <FileSignature className="h-6 w-6" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-800">Electronic Contract Signature Studio</span>
            </div>
            <h2 id="pdf-signature-deep-guide" className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Sign PDF Online: Draw, Type &amp; Embed Electronic Signatures
            </h2>
            <p className="mt-3 text-base sm:text-lg leading-relaxed text-slate-600">
              Sign employment agreements, NDAs, lease contracts, and permission slips without printing a single sheet of paper. Zubware Sign PDF Online provides a fast, privacy-focused electronic signing workflow with 3 signature creation methods and interactive page placement, executing entirely in client-side memory.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-sm">
              <h3 className="font-semibold text-slate-900 text-base mb-2">1. Draw Autograph</h3>
              <p className="text-sm leading-relaxed text-slate-600">
                Draw your natural handwritten signature with mouse or touchscreen finger/stylus support on an HTML5 canvas featuring smooth bezier curve smoothing and crisp anti-aliasing.
              </p>
            </div>
            <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-sm">
              <h3 className="font-semibold text-slate-900 text-base mb-2">2. Type Cursive Signature</h3>
              <p className="text-sm leading-relaxed text-slate-600">
                Type your full legal name to generate an elegant, realistic cursive signature in seconds. Ideal for quick approvals when signing on desktop workstations without touchscreens.
              </p>
            </div>
            <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-sm">
              <h3 className="font-semibold text-slate-900 text-base mb-2">3. Upload Signature Image</h3>
              <p className="text-sm leading-relaxed text-slate-600">
                Already have a scanned transparent PNG of your signature or official company stamp? Upload it directly into the tool for seamless placement on any document line.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 space-y-4">
            <h3 className="text-xl font-bold text-slate-900">Interactive Page Positioning &amp; Legal Context</h3>
            <p className="text-sm leading-relaxed text-slate-600">
              Navigate to any page of multi-page agreements, position your signature precisely using interactive coordinate sliders (horizontal and vertical percentage offsets), and scale dimensions to match designated signature boxes. Once positioned, <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-xs text-slate-800">pdf-lib</code> embeds the signature image directly into the PDF byte stream.
            </p>
            <div className="rounded-lg border border-slate-100 bg-slate-50 p-4 text-xs text-slate-500">
              <strong>Legal Note:</strong> Zubware creates valid electronic signatures (e-signatures) suitable for everyday commercial agreements, vendor orders, and employment approvals. For specialized governmental transactions requiring cryptographic hardware tokens (such as DSC/token-based digital certificates or PKI cryptographic stamping), utilize dedicated regional e-governance hardware portals.
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-5">
            <h4 className="font-semibold text-slate-900 mb-3 text-sm">Related PDF &amp; Document Tools:</h4>
            <div className="flex flex-wrap gap-2 text-xs font-medium">
              <a href={getLinkUrl('/edit-pdf')} onClick={(e) => handleNav(e, '/edit-pdf')} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-slate-700 hover:border-slate-300 hover:text-slate-900 transition">
                <span>Online PDF Editor</span> <ArrowRight className="h-3.5 w-3.5" />
              </a>
              <a href={getLinkUrl('/protect-pdf')} onClick={(e) => handleNav(e, '/protect-pdf')} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-slate-700 hover:border-slate-300 hover:text-slate-900 transition">
                <span>Protect PDF</span> <ArrowRight className="h-3.5 w-3.5" />
              </a>
              <a href={getLinkUrl('/signature-maker')} onClick={(e) => handleNav(e, '/signature-maker')} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-slate-700 hover:border-slate-300 hover:text-slate-900 transition">
                <span>Online Signature Maker</span> <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </section>
      );

    default:
      return null;
  }
};
