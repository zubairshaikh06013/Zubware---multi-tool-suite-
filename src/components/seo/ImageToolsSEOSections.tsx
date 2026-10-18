import React from 'react';
import { ToolMeta } from '../../types';
import { getLinkUrl } from '../../lib/paths';
import {
  ShieldCheck,
  Zap,
  Sparkles,
  Camera,
  Layers,
  Sliders,
  Maximize2,
  FileText,
  Printer,
  PenTool,
  CheckCircle2,
  ArrowRight,
  Download,
  Eye,
  Globe,
  Lock,
  Smartphone,
  Cpu
} from 'lucide-react';

interface ImageToolsSEOSectionProps {
  tool: ToolMeta;
  onNavigate: (path: string) => void;
}

export const ImageToolsSEOSection: React.FC<ImageToolsSEOSectionProps> = ({ tool, onNavigate }) => {
  const handleNav = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    onNavigate(getLinkUrl(path));
  };

  switch (tool.id) {
    case 'background-remover':
      return (
        <section className="glass-panel p-6 sm:p-10 rounded-3xl space-y-8 border border-indigo-200/50 dark:border-indigo-900/40">
          <div className="border-b border-slate-200/60 dark:border-slate-800/60 pb-4">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
              AI Vision &amp; Transparent Cutout Guide
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              Remove Background from Image Online: Free AI Transparent Cutout Tool
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card p-6 rounded-2xl space-y-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                Automatic Neural Network Segmentation
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Zubware Background Remover uses browser-based machine learning to estimate the foreground subject. Hair, fur, glass, thin objects and low-contrast edges can be imperfect; inspect the cutout before using it.
              </p>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Export transparent 32-bit PNG files with true alpha channels, ready for seamless layering over marketing banners, product listings, or presentation slides.
              </p>
            </div>

            <div className="glass-card p-6 rounded-2xl space-y-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Camera className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                E-Commerce Catalogs &amp; ID Photos
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Prepare transparent cutouts for product photos, presentations or graphics. Processing time depends on your device, model download and image size. Preview background colors help inspection; the downloaded PNG remains transparent.
              </p>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                For product listings, exams or identity photos, check the destination requirements for background color, size and framing. This tool does not certify compliance or guarantee acceptance.
              </p>
            </div>
          </div>

          {/* Interactive Backdrop Inspection Modes */}
          <div className="glass-card p-6 rounded-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Eye className="w-4 h-4 text-emerald-500" /> Interactive Preview Backdrops &amp; Quality Check
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Before downloading your cutout, switch between multiple preview backdrops to inspect edge cleanliness and detect remaining background halos:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="text-xs font-bold text-slate-900 dark:text-white block">Checkerboard</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">Verifies true alpha transparency</span>
              </div>
              <div className="p-3 rounded-xl bg-white border border-slate-300 text-slate-900">
                <span className="text-xs font-bold block">Pure White</span>
                <span className="text-[11px] text-slate-600">Checks edges on a light background</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-white">
                <span className="text-xs font-bold block">Solid Black</span>
                <span className="text-[11px] text-slate-400">Highlights fringe light artifacts</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-200 dark:bg-slate-700 border border-slate-300 dark:border-slate-600">
                <span className="text-xs font-bold text-slate-900 dark:text-white block">Neutral Grey</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">Standard studio grading backdrop</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card p-6 rounded-2xl space-y-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Lock className="w-5 h-5 text-emerald-500" /> On-device AI Processing
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Quick Removal and Private Removal process the selected photo on your device. The browser may download model resources before it can start.
              </p>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                The available modes do not upload your photo for background removal. Ordinary website and model-download requests still use the network. Online Smart AI Removal is currently unavailable.
              </p>
            </div>

            <div className="glass-card p-6 rounded-2xl space-y-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-500" /> Tips for Cleaner Cutouts
              </h3>
              <ul className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-2 list-disc list-inside">
                <li><strong>High Contrast:</strong> Ensure strong contrast between your subject and the backdrop (e.g. dark clothes against light walls).</li>
                <li><strong>Clear Focus:</strong> Sharp, in-focus subjects produce cleaner silhouette contours than blurry or motion-smeared shots.</li>
                <li><strong>Even Lighting:</strong> Avoid harsh unilateral shadows that obscure subject boundaries.</li>
                <li><strong>File Formats:</strong> Upload JPG, PNG, or WebP images up to 20MB directly from your phone gallery or desktop.</li>
              </ul>
            </div>
          </div>

          {/* Related Image Tools */}
          <div className="glass-card p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <span>🔗</span> Related Image Workflow Tools
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
              <a
                href={getLinkUrl('/background-color-changer')}
                onClick={(e) => handleNav(e, '/background-color-changer')}
                className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 transition-all block text-xs group"
              >
                <span className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 block mb-1">
                  Background Color Changer →
                </span>
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                  Add solid white, blue, or vibrant gradient backgrounds behind cutouts.
                </span>
              </a>
              <a
                href={getLinkUrl('/image-compressor')}
                onClick={(e) => handleNav(e, '/image-compressor')}
                className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 transition-all block text-xs group"
              >
                <span className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 block mb-1">
                  Image Compressor →
                </span>
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                  Try reducing file size; check output quality and transparency.
                </span>
              </a>
              <a
                href={getLinkUrl('/passport-photo-maker')}
                onClick={(e) => handleNav(e, '/passport-photo-maker')}
                className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 transition-all block text-xs group"
              >
                <span className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 block mb-1">
                  Passport Photo Maker →
                </span>
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                  Prepare photo dimensions and check the destination’s official rules.
                </span>
              </a>
              <a
                href={getLinkUrl('/crop-image')}
                onClick={(e) => handleNav(e, '/crop-image')}
                className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 transition-all block text-xs group"
              >
                <span className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 block mb-1">
                  Crop Image →
                </span>
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                  Trim and center your cutout to 1:1 square, 4:3, or 16:9 ratios.
                </span>
              </a>
            </div>
          </div>
        </section>
      );

    case 'image-converter':
      return (
        <section className="glass-panel p-6 sm:p-10 rounded-3xl space-y-8 border border-indigo-200/50 dark:border-indigo-900/40">
          <div className="border-b border-slate-200/60 dark:border-slate-800/60 pb-4">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
              Format Matrix &amp; Compression Architecture
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              Online Image Converter: Convert Between JPG, PNG, WebP, SVG &amp; ICO
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card p-6 rounded-2xl space-y-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                Comprehensive Web Format Support
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Zubware Image Converter exports <strong>JPG, PNG, WebP, BMP and single-size ICO files</strong>. It can read SVG inputs and rasterize them; it does not trace photos into SVG vectors. AVIF output appears only in browsers with a supported encoder. Conversion runs in browser memory; available memory and browser support limit file size and format availability.
              </p>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                No daily conversion caps, watermarks, or file size paywalls. Upload single pictures or convert multiple files simultaneously with shared quality controls.
              </p>
            </div>

            <div className="glass-card p-6 rounded-2xl space-y-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sliders className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                Alpha Transparency &amp; Matte Background Fill
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                When converting transparent PNG or WebP graphics into formats that lack alpha channel support (such as JPEG or BMP), legacy tools often render transparent areas as unsightly black boxes.
              </p>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Zubware provides an integrated background matte color picker. Choose pure white (#ffffff), off-white, or any custom hex color to cleanly composite transparent areas during JPEG export.
              </p>
            </div>
          </div>

          {/* Format Comparison Table */}
          <div className="glass-card p-6 rounded-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-500" /> Image Format Comparison Guide
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold uppercase">
                    <th className="py-2.5 px-3">Format</th>
                    <th className="py-2.5 px-3">Compression</th>
                    <th className="py-2.5 px-3">Transparency</th>
                    <th className="py-2.5 px-3">Best Used For</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-indigo-600">WebP</td>
                    <td className="py-2.5 px-3">Lossy &amp; Lossless</td>
                    <td className="py-2.5 px-3 text-emerald-600 font-semibold">Yes (Alpha)</td>
                    <td className="py-2.5 px-3">Modern websites, Core Web Vitals, fast mobile page loading</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-indigo-600">JPG / JPEG</td>
                    <td className="py-2.5 px-3">Lossy (DCT)</td>
                    <td className="py-2.5 px-3 text-rose-500 font-semibold">No</td>
                    <td className="py-2.5 px-3">Camera photos, portraits, exam portals, email attachments</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-indigo-600">PNG</td>
                    <td className="py-2.5 px-3">Lossless (DEFLATE)</td>
                    <td className="py-2.5 px-3 text-emerald-600 font-semibold">Yes (Alpha)</td>
                    <td className="py-2.5 px-3">Logos, digital signatures, line art, UI screenshots with text</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-indigo-600">ICO</td>
                    <td className="py-2.5 px-3">Multi-Resolution Bitmap</td>
                    <td className="py-2.5 px-3 text-emerald-600 font-semibold">Yes</td>
                    <td className="py-2.5 px-3">Browser tab favicons, Windows desktop shortcuts, PWA icons</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-indigo-600">SVG</td>
                    <td className="py-2.5 px-3">Scalable Vector (XML)</td>
                    <td className="py-2.5 px-3 text-emerald-600 font-semibold">Yes</td>
                    <td className="py-2.5 px-3">Icons, vector illustrations, infinite-resolution brand logos</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <span>🔗</span> Related Conversion Tools
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
              <a
                href={getLinkUrl('/batch-image-converter')}
                onClick={(e) => handleNav(e, '/batch-image-converter')}
                className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 transition-all block text-xs group"
              >
                <span className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 block mb-1">
                  Batch Image Converter →
                </span>
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                  Convert dozens of photos simultaneously to WebP, JPG, or PNG.
                </span>
              </a>
              <a
                href={getLinkUrl('/heic-to-jpg')}
                onClick={(e) => handleNav(e, '/heic-to-jpg')}
                className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 transition-all block text-xs group"
              >
                <span className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 block mb-1">
                  HEIC to JPG Converter →
                </span>
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                  Convert Apple iPhone HEIC and HEIF photos to universal JPG.
                </span>
              </a>
              <a
                href={getLinkUrl('/favicon-generator')}
                onClick={(e) => handleNav(e, '/favicon-generator')}
                className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 transition-all block text-xs group"
              >
                <span className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 block mb-1">
                  Favicon Generator →
                </span>
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                  Create binary favicon.ico and mobile Apple Touch icon packages.
                </span>
              </a>
              <a
                href={getLinkUrl('/svg-optimizer')}
                onClick={(e) => handleNav(e, '/svg-optimizer')}
                className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 transition-all block text-xs group"
              >
                <span className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 block mb-1">
                  SVG Optimizer →
                </span>
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                  Minify and clean vector SVG files by removing editor metadata.
                </span>
              </a>
            </div>
          </div>
        </section>
      );

    case 'image-resizer':
      return (
        <section className="glass-panel p-6 sm:p-10 rounded-3xl space-y-8 border border-indigo-200/50 dark:border-indigo-900/40">
          <div className="border-b border-slate-200/60 dark:border-slate-800/60 pb-4">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
              Dimension Standards &amp; Social Presets
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              Free Online Image Resizer: Resize Photos by Pixels, Percentage &amp; Presets
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card p-6 rounded-2xl space-y-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Maximize2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                Pixel Precision &amp; Aspect Ratio Locking
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Zubware Image Resizer gives you exact control over photo dimensions. Enter custom width and height in pixels (px) with an intelligent aspect ratio lock that prevents awkward image stretching or squishing. Need to scale down an entire gallery quickly? Switch to <strong>Percentage Scale</strong> mode to reduce dimensions by 25%, 50%, or 75% with a single click.
              </p>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Powered by high-quality browser canvas downsampling with bicubic interpolation, resized images maintain sharp edges, vibrant contrast, and clear textual legibility.
              </p>
            </div>

            <div className="glass-card p-6 rounded-2xl space-y-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                Social Media &amp; Portal Presets
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Stop looking up social media dimensions every time you post. Zubware features instant presets for:
              </p>
              <ul className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-1.5 list-disc list-inside">
                <li><strong>Instagram Square:</strong> 1080 &times; 1080 px (1:1 feed post)</li>
                <li><strong>Instagram Story / Reels:</strong> 1080 &times; 1920 px (9:16 vertical)</li>
                <li><strong>YouTube Thumbnail:</strong> 1280 &times; 720 px (16:9 HD widescreen)</li>
                <li><strong>LinkedIn Post:</strong> 1200 &times; 627 px (professional banner)</li>
                <li><strong>Twitter / X Header:</strong> 1500 &times; 500 px (profile banner)</li>
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card p-6 rounded-2xl space-y-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" /> Exam Portals &amp; ID Card Resizing
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Indian government recruitment and entrance exam portals (including SSC CGL/CHSL, UPSC, IBPS Bank PO, State PSCs, and NTA NEET/JEE) mandate strict candidate photo dimensions such as <strong>100 &times; 120 px, 140 &times; 160 px, or 350 &times; 350 px</strong>.
              </p>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Easily unlock the aspect ratio, enter the exact mandatory pixel dimensions, adjust output JPEG quality, and download a compliant file ready for instant form submission.
              </p>
            </div>

            <div className="glass-card p-6 rounded-2xl space-y-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-500" /> Private In-Memory Processing
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Your personal family photographs, event pictures, and identity cards are never sent to external servers or logged in remote cloud databases. All decoding, pixel resampling, and encoding run 100% locally in your device's browser memory.
              </p>
            </div>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <span>🔗</span> Explore Related Tools
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
              <a
                href={getLinkUrl('/crop-image')}
                onClick={(e) => handleNav(e, '/crop-image')}
                className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 transition-all block text-xs group"
              >
                <span className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 block mb-1">
                  Crop Image →
                </span>
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                  Crop photos to 1:1, 4:3, 16:9, or custom bounds before resizing.
                </span>
              </a>
              <a
                href={getLinkUrl('/image-compressor')}
                onClick={(e) => handleNav(e, '/image-compressor')}
                className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 transition-all block text-xs group"
              >
                <span className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 block mb-1">
                  Image Compressor →
                </span>
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                  Cap file size to 20KB or 50KB while retaining exact dimensions.
                </span>
              </a>
              <a
                href={getLinkUrl('/signature-resizer')}
                onClick={(e) => handleNav(e, '/signature-resizer')}
                className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 transition-all block text-xs group"
              >
                <span className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 block mb-1">
                  Signature Resizer →
                </span>
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                  Resize and compress signatures for government job applications.
                </span>
              </a>
              <a
                href={getLinkUrl('/bulk-image-renamer-resizer')}
                onClick={(e) => handleNav(e, '/bulk-image-renamer-resizer')}
                className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 transition-all block text-xs group"
              >
                <span className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 block mb-1">
                  Bulk Resizer &amp; Renamer →
                </span>
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                  Batch resize dozens of photos with automated sequence naming.
                </span>
              </a>
            </div>
          </div>
        </section>
      );

    case 'crop-image':
      return (
        <section className="glass-panel p-6 sm:p-10 rounded-3xl space-y-8 border border-indigo-200/50 dark:border-indigo-900/40">
          <div className="border-b border-slate-200/60 dark:border-slate-800/60 pb-4">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
              Composition &amp; Aspect Ratio Guidelines
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              Crop Image Online: Free Photo Cropper with Aspect Ratio Presets
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card p-6 rounded-2xl space-y-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sliders className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                Aspect Ratio Presets for Every Channel
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Cropping is the fastest way to improve visual composition, eliminate distracting background clutter, and adapt photos for specific social platforms. Zubware Crop Image offers one-click aspect ratio presets:
              </p>
              <ul className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-1.5 list-disc list-inside">
                <li><strong>1:1 Square:</strong> Perfect for WhatsApp DP, Instagram grid, and profile avatars.</li>
                <li><strong>4:3 Standard:</strong> Classic photography format and presentation slides.</li>
                <li><strong>16:9 Widescreen:</strong> Standard YouTube thumbnails, blog heroes, and TV monitors.</li>
                <li><strong>9:16 Vertical:</strong> Full-screen mobile format for TikTok, Reels, and YouTube Shorts.</li>
                <li><strong>A4 Document:</strong> Compliant ratio for printable sheets, resumes, and reports.</li>
                <li><strong>Freeform:</strong> Drag any corner handle for arbitrary pixel cropping.</li>
              </ul>
            </div>

            <div className="glass-card p-6 rounded-2xl space-y-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Camera className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                Interactive Zoom &amp; 90° Rotation
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Take full control over framing with smooth <strong>50% to 200% zoom controls</strong>. Center in on subtle details, face portraits, or product tags without losing pixel sharpness.
              </p>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Fix crooked horizon lines or sideways mobile captures instantly using 90-degree clockwise and counter-clockwise rotation buttons before finalizing your crop boundary.
              </p>
            </div>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <span>🔗</span> Related Tools for Graphic Cropping
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
              <a
                href={getLinkUrl('/image-resizer')}
                onClick={(e) => handleNav(e, '/image-resizer')}
                className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 transition-all block text-xs group"
              >
                <span className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 block mb-1">
                  Image Resizer →
                </span>
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                  Scale pixel dimensions or percentages after cropping.
                </span>
              </a>
              <a
                href={getLinkUrl('/rotate-image')}
                onClick={(e) => handleNav(e, '/rotate-image')}
                className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 transition-all block text-xs group"
              >
                <span className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 block mb-1">
                  Rotate Image →
                </span>
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                  Rotate images by 90°, 180°, or arbitrary degree angles.
                </span>
              </a>
              <a
                href={getLinkUrl('/rounded-corners')}
                onClick={(e) => handleNav(e, '/rounded-corners')}
                className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 transition-all block text-xs group"
              >
                <span className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 block mb-1">
                  Rounded Corners →
                </span>
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                  Round photo borders or create circular avatars from square crops.
                </span>
              </a>
              <a
                href={getLinkUrl('/passport-photo-maker')}
                onClick={(e) => handleNav(e, '/passport-photo-maker')}
                className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 transition-all block text-xs group"
              >
                <span className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 block mb-1">
                  Passport Photo Maker →
                </span>
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                  Crop portraits to exact 35x45mm or 2x2" biometric specifications.
                </span>
              </a>
            </div>
          </div>
        </section>
      );

    case 'image-watermark':
      return (
        <section className="glass-panel p-6 sm:p-10 rounded-3xl space-y-8 border border-indigo-200/50 dark:border-indigo-900/40">
          <div className="border-b border-slate-200/60 dark:border-slate-800/60 pb-4">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
              Copyright Protection &amp; Brand Stamping
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              Add Watermark to Images Online: Protect Photos with Text &amp; Logo Stamps
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card p-6 rounded-2xl space-y-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <PenTool className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                Text Autographs &amp; Brand Logos
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Safeguard your creative photography, digital artwork, and commercial assets against unauthorized web scraping and social media re-uploading. Zubware supports two flexible watermarking methods:
              </p>
              <ul className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-2">
                <li>
                  <strong>Text Watermarks:</strong> Add your copyright notice (&copy;), creator name, website URL, or social handle. Customize font family (sans-serif, serif, monospace, cursive), size, color, and optional drop shadow for readability against complex backdrops.
                </li>
                <li>
                  <strong>PNG Logo Watermarks:</strong> Stamp your transparent brand logo or watermark graphic. Adjust scale, position, and opacity for subtle, professional branding.
                </li>
              </ul>
            </div>

            <div className="glass-card p-6 rounded-2xl space-y-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                9-Point Alignment &amp; Tiled Repeat
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Position your watermark exactly where you want it. Select from 9 standardized alignment anchors (Top-Left, Top-Center, Top-Right, Center, Bottom-Right, etc.) with custom margin padding.
              </p>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                For complete protection against crop-and-steal theft, enable <strong>Tiled Repeat Pattern</strong>. This stamps your watermark diagonally across the entire image canvas with customizable opacity and rotation angles, making unauthorized removal virtually impossible.
              </p>
            </div>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <span>🔗</span> Related Tools for Media Protection
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
              <a
                href={getLinkUrl('/signature-maker')}
                onClick={(e) => handleNav(e, '/signature-maker')}
                className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 transition-all block text-xs group"
              >
                <span className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 block mb-1">
                  Online Signature Maker →
                </span>
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                  Create transparent digital signatures to use as personal photo watermarks.
                </span>
              </a>
              <a
                href={getLinkUrl('/exif-remover')}
                onClick={(e) => handleNav(e, '/exif-remover')}
                className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 transition-all block text-xs group"
              >
                <span className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 block mb-1">
                  EXIF Remover →
                </span>
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                  Strip GPS coordinates and camera serial numbers before publishing.
                </span>
              </a>
              <a
                href={getLinkUrl('/image-resizer')}
                onClick={(e) => handleNav(e, '/image-resizer')}
                className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 transition-all block text-xs group"
              >
                <span className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 block mb-1">
                  Image Resizer →
                </span>
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                  Resize watermarked portfolio images for web previews.
                </span>
              </a>
              <a
                href={getLinkUrl('/image-frame')}
                onClick={(e) => handleNav(e, '/image-frame')}
                className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 transition-all block text-xs group"
              >
                <span className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 block mb-1">
                  Photo Frame Maker →
                </span>
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                  Add decorative border frames and Polaroid styling to photos.
                </span>
              </a>
            </div>
          </div>
        </section>
      );

    case 'exif-remover':
      return (
        <section className="glass-panel p-6 sm:p-10 rounded-3xl space-y-8 border border-indigo-200/50 dark:border-indigo-900/40">
          <div className="border-b border-slate-200/60 dark:border-slate-800/60 pb-4">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
              Metadata Privacy &amp; GPS Location Security
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              Free EXIF Remover Online: Strip Photo Metadata, GPS &amp; Camera Tags Privately
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card p-6 rounded-2xl space-y-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Globe className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                What Hidden Metadata is Stored in Photos?
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                When you snap a picture with a modern smartphone (iPhone or Android) or DSLR camera, the device invisibly records detailed <strong>Exchangeable Image File Format (EXIF)</strong> metadata directly into the image container. This includes:
              </p>
              <ul className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-1 list-disc list-inside">
                <li><strong>GPS Coordinates:</strong> Exact latitude, longitude, and altitude of where the photo was taken.</li>
                <li><strong>Hardware Identity:</strong> Camera model, lens specifications, and unique device serial numbers.</li>
                <li><strong>Capture Timestamps:</strong> Exact date, minute, and second of recording.</li>
                <li><strong>Camera Settings:</strong> Exposure, ISO speed, focal length, aperture, and flash state.</li>
              </ul>
            </div>

            <div className="glass-card p-6 rounded-2xl space-y-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Lock className="w-5 h-5 text-emerald-500" />
                Why Purge Metadata Before Sharing?
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Sharing raw camera photos on forums, social media, Craigslist, classifieds, or messaging apps can inadvertently reveal your home address, child's school, daily commute routes, or workplace to strangers.
              </p>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Zubware EXIF Remover reads raw pixel buffers and re-encodes pure visual data, permanently purging all embedded EXIF, IPTC, and XMP metadata chunks by exporting a fresh PNG or JPEG. JPEG is re-encoded at 95% quality, so pixels and file size can change. Inspect the output metadata before sharing.
              </p>
            </div>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <span>🔗</span> Explore Related Privacy Tools
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
              <a
                href={getLinkUrl('/image-info-viewer')}
                onClick={(e) => handleNav(e, '/image-info-viewer')}
                className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 transition-all block text-xs group"
              >
                <span className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 block mb-1">
                  Image Info Viewer →
                </span>
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                  Inspect embedded EXIF tags, GPS maps, and camera technical specs.
                </span>
              </a>
              <a
                href={getLinkUrl('/blur-image')}
                onClick={(e) => handleNav(e, '/blur-image')}
                className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 transition-all block text-xs group"
              >
                <span className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 block mb-1">
                  Blur Image Online →
                </span>
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                  Blur sensitive faces, license plates, and documents in photos.
                </span>
              </a>
              <a
                href={getLinkUrl('/pixelate-image')}
                onClick={(e) => handleNav(e, '/pixelate-image')}
                className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 transition-all block text-xs group"
              >
                <span className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 block mb-1">
                  Pixelate Image Online →
                </span>
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                  Censor private areas with customizable mosaic pixelation boxes.
                </span>
              </a>
              <a
                href={getLinkUrl('/image-compressor')}
                onClick={(e) => handleNav(e, '/image-compressor')}
                className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 transition-all block text-xs group"
              >
                <span className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 block mb-1">
                  Image Compressor →
                </span>
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                  Reduce photo byte size for fast email sharing and web uploads.
                </span>
              </a>
            </div>
          </div>
        </section>
      );

    case 'favicon-generator':
      return (
        <section className="glass-panel p-6 sm:p-10 rounded-3xl space-y-8 border border-indigo-200/50 dark:border-indigo-900/40">
          <div className="border-b border-slate-200/60 dark:border-slate-800/60 pb-4">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
              Web Standards &amp; Icon Architecture
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              Favicon Generator: Create .ico, Apple Touch &amp; Android PWA Icon Packages
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card p-6 rounded-2xl space-y-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Globe className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                The Complete 2026 Favicon Specification Suite
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Modern web browsers, mobile operating systems, and search engines require different icon sizes and formats to render your brand identity properly across devices. A single 16x16 icon is no longer sufficient.
              </p>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Zubware Favicon Generator transforms a single high-resolution square logo into a complete, production-ready favicon suite. Download a consolidated ZIP archive containing:
              </p>
              <ul className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-1 list-disc list-inside">
                <li><strong>favicon.ico:</strong> Multi-resolution binary container (16x16, 32x32, 48x48) for legacy desktop browsers and Googlebot.</li>
                <li><strong>favicon-16x16.png &amp; favicon-32x32.png:</strong> Standard browser tab &amp; bookmark icons.</li>
                <li><strong>apple-touch-icon.png:</strong> 180x180 px high-DPI icon for iOS Safari home screen bookmarks.</li>
                <li><strong>android-chrome-192x192.png &amp; 512x512.png:</strong> High-res Progressive Web App (PWA) splash icons.</li>
                <li><strong>site.webmanifest:</strong> Pre-configured PWA manifest file with custom theme colors.</li>
              </ul>
            </div>

            <div className="glass-card p-6 rounded-2xl space-y-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                Ready-to-Paste HTML Head Code
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Along with the ZIP archive, Zubware provides clean, standardized HTML code you can copy with one click and paste into your website's &lt;head&gt; section:
              </p>
              <div className="p-3 rounded-xl bg-slate-900 text-slate-200 font-mono text-[11px] leading-relaxed overflow-x-auto">
                <code>
                  &lt;link rel="icon" type="image/x-icon" href="/favicon.ico"&gt;<br />
                  &lt;link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"&gt;<br />
                  &lt;link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"&gt;<br />
                  &lt;link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"&gt;<br />
                  &lt;link rel="manifest" href="/site.webmanifest"&gt;
                </code>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Compatible with HTML5, React, Next.js, Vite, Vue, WordPress, Shopify, and Webflow websites.
              </p>
            </div>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <span>🔗</span> Related Tools for Web Graphics
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
              <a
                href={getLinkUrl('/image-converter')}
                onClick={(e) => handleNav(e, '/image-converter')}
                className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 transition-all block text-xs group"
              >
                <span className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 block mb-1">
                  Image Converter →
                </span>
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                  Convert images to standalone ICO, PNG, or WebP formats.
                </span>
              </a>
              <a
                href={getLinkUrl('/svg-optimizer')}
                onClick={(e) => handleNav(e, '/svg-optimizer')}
                className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 transition-all block text-xs group"
              >
                <span className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 block mb-1">
                  SVG Optimizer →
                </span>
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                  Minify SVG logo files before converting them into site favicons.
                </span>
              </a>
              <a
                href={getLinkUrl('/rounded-corners')}
                onClick={(e) => handleNav(e, '/rounded-corners')}
                className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 transition-all block text-xs group"
              >
                <span className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 block mb-1">
                  Rounded Corner Generator →
                </span>
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                  Add rounded corner radiuses to logo icons for modern app styling.
                </span>
              </a>
              <a
                href={getLinkUrl('/batch-image-converter')}
                onClick={(e) => handleNav(e, '/batch-image-converter')}
                className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 transition-all block text-xs group"
              >
                <span className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 block mb-1">
                  Batch Image Converter →
                </span>
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                  Batch optimize website graphics into lightweight WebP format.
                </span>
              </a>
            </div>
          </div>
        </section>
      );

    case 'gif-maker':
      return (
        <section className="glass-panel p-6 sm:p-10 rounded-3xl space-y-8 border border-indigo-200/50 dark:border-indigo-900/40">
          <div className="border-b border-slate-200/60 dark:border-slate-800/60 pb-4">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
              Animation &amp; Frame Sequencing Guide
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              Free Online GIF Maker: Create Animated GIFs from Photos in Your Browser
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card p-6 rounded-2xl space-y-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                Turn Photos into Smooth Animated Loops
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Zubware GIF Maker lets you combine multiple sequential photos, illustrations, screenshots, or stop-motion frames into vibrant animated GIFs directly in your browser. Whether creating memes, product showcase rotations, tutorial snippets, or reaction clips, compiling animations requires zero software installation or subscription fees.
              </p>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                All rendering is powered by the fast client-side <code>omggif</code> binary encoder. Your animated GIFs are exported with 100% clean visuals—never branded with forced watermarks or logos.
              </p>
            </div>

            <div className="glass-card p-6 rounded-2xl space-y-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sliders className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                Playback Direction: Forward, Reverse &amp; Bounce
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Customize playback dynamics to suit your animation style:
              </p>
              <ul className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-1.5 list-disc list-inside">
                <li><strong>Forward:</strong> Standard sequential playback from first to last frame.</li>
                <li><strong>Reverse:</strong> Plays the animation in reverse chronological order.</li>
                <li><strong>Ping-Pong (Bounce):</strong> Plays from frame 1 to the end, then immediately reverses back to frame 1, creating an endless, seamless looping bounce without jarring cuts.</li>
                <li><strong>Speed Tuning:</strong> Fine-tune frame delay from 50ms (rapid 20 FPS motion) to 1000ms (slow slideshow).</li>
              </ul>
            </div>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <span>🔗</span> Explore Related Animation &amp; Image Tools
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
              <a
                href={getLinkUrl('/crop-image')}
                onClick={(e) => handleNav(e, '/crop-image')}
                className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 transition-all block text-xs group"
              >
                <span className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 block mb-1">
                  Crop Image →
                </span>
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                  Crop animation frames to uniform square or widescreen bounds.
                </span>
              </a>
              <a
                href={getLinkUrl('/image-resizer')}
                onClick={(e) => handleNav(e, '/image-resizer')}
                className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 transition-all block text-xs group"
              >
                <span className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 block mb-1">
                  Image Resizer →
                </span>
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                  Downscale source photos to reduce final GIF download size.
                </span>
              </a>
              <a
                href={getLinkUrl('/watermark-image')}
                onClick={(e) => handleNav(e, '/watermark-image')}
                className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 transition-all block text-xs group"
              >
                <span className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 block mb-1">
                  Watermark Image →
                </span>
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                  Add branding or copyright stamps to photos before animation.
                </span>
              </a>
              <a
                href={getLinkUrl('/image-collage')}
                onClick={(e) => handleNav(e, '/image-collage')}
                className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 transition-all block text-xs group"
              >
                <span className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 block mb-1">
                  Photo Collage Maker →
                </span>
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                  Combine multiple photos side-by-side in creative photo grids.
                </span>
              </a>
            </div>
          </div>
        </section>
      );

    case 'batch-image-converter':
      return (
        <section className="glass-panel p-6 sm:p-10 rounded-3xl space-y-8 border border-indigo-200/50 dark:border-indigo-900/40">
          <div className="border-b border-slate-200/60 dark:border-slate-800/60 pb-4">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
              Bulk Processing &amp; Compression Architecture
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              Batch Image Converter: Convert Multiple Images to WebP, JPG &amp; PNG Online
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card p-6 rounded-2xl space-y-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                High-Volume Image Queue Processing
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Converting images one-by-one is tedious when optimizing photo albums, e-commerce product catalogs, or blog media libraries. Zubware Batch Image Converter lets you queue dozens of photos simultaneously across mixed formats: <strong>JPG, PNG, WebP, BMP, and GIF</strong>.
              </p>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Select a unified target format—such as modern high-efficiency WebP to speed up website loading or universal JPG for maximum compatibility—and convert the entire batch concurrently with zero server upload bottlenecks.
              </p>
            </div>

            <div className="glass-card p-6 rounded-2xl space-y-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Download className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                Instant ZIP Packaging &amp; Progress Tracking
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Watch real-time client-side conversion progress bars as each file is processed. Review original versus converted file sizes to inspect immediate byte savings.
              </p>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Once the queue finishes, click <strong>Download All as ZIP</strong> to export every converted photo inside an organized <code>converted_images.zip</code> archive created directly in your browser using JSZip.
              </p>
            </div>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <span>🔗</span> Explore Related Bulk Editing Tools
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
              <a
                href={getLinkUrl('/bulk-image-renamer-resizer')}
                onClick={(e) => handleNav(e, '/bulk-image-renamer-resizer')}
                className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 transition-all block text-xs group"
              >
                <span className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 block mb-1">
                  Bulk Resizer &amp; Renamer →
                </span>
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                  Batch resize dimensions and rename dozens of files sequentially.
                </span>
              </a>
              <a
                href={getLinkUrl('/heic-to-jpg')}
                onClick={(e) => handleNav(e, '/heic-to-jpg')}
                className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 transition-all block text-xs group"
              >
                <span className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 block mb-1">
                  HEIC to JPG Converter →
                </span>
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                  Batch convert iPhone camera roll photos to universal JPG format.
                </span>
              </a>
              <a
                href={getLinkUrl('/image-compressor')}
                onClick={(e) => handleNav(e, '/image-compressor')}
                className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 transition-all block text-xs group"
              >
                <span className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 block mb-1">
                  Image Compressor →
                </span>
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                  Compress photos to exact 20KB, 50KB, or 100KB limits for forms.
                </span>
              </a>
              <a
                href={getLinkUrl('/image-converter')}
                onClick={(e) => handleNav(e, '/image-converter')}
                className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 transition-all block text-xs group"
              >
                <span className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 block mb-1">
                  Single Image Converter →
                </span>
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                  Convert single photos with advanced background color filling.
                </span>
              </a>
            </div>
          </div>
        </section>
      );

    case 'heic-to-jpg':
      return (
        <section className="glass-panel p-6 sm:p-10 rounded-3xl space-y-8 border border-indigo-200/50 dark:border-indigo-900/40">
          <div className="border-b border-slate-200/60 dark:border-slate-800/60 pb-4">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
              Apple Ecosystem &amp; Universal Compatibility
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              HEIC to JPG Converter: Convert Apple iPhone Photos to High-Quality JPG Online
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card p-6 rounded-2xl space-y-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                Why Does Apple Save Photos as HEIC?
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Starting with iOS 11, Apple iPhones and iPads capture photos in <strong>High Efficiency Image Coding (HEIC / HEIF)</strong> by default. HEIC cuts storage requirements nearly in half compared to traditional JPEG while offering 16-bit color depth.
              </p>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                However, HEIC files are notorious for compatibility failures: Windows PCs without paid codecs, Android devices, government portals, college admissions, and online job applications often reject HEIC uploads with "Unsupported Format" errors.
              </p>
            </div>

            <div className="glass-card p-6 rounded-2xl space-y-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Cpu className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                In-Browser WebAssembly Decoder (heic2any)
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Other online HEIC converters force you to upload personal family albums, vacation photos, and private camera roll shots to remote cloud servers, creating major security and privacy concerns.
              </p>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Zubware utilizes the <strong>heic2any WebAssembly</strong> engine to decode and convert Apple HEIC photos 100% locally on your computer or phone. Your personal photographs never leave your device RAM, guaranteeing complete privacy and blistering conversion speed.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card p-6 rounded-2xl space-y-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sliders className="w-5 h-5 text-indigo-600 dark:text-indigo-400" /> Quality Presets &amp; Scaling
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Tailor your output to your exact use case:
              </p>
              <ul className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-1.5 list-disc list-inside">
                <li><strong>High Quality (90%):</strong> Ideal for photo printing, archiving, and portfolio display.</li>
                <li><strong>Balanced (80%):</strong> Great for email attachments, social media, and messaging.</li>
                <li><strong>Web (65%):</strong> Ultra-compact file sizes for fast web loading and strict portal upload limits.</li>
              </ul>
            </div>

            <div className="glass-card p-6 rounded-2xl space-y-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Download className="w-5 h-5 text-indigo-600 dark:text-indigo-400" /> Batch Conversion &amp; ZIP Export
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Have a dozen HEIC photos from your iPhone? Drop them all into Zubware simultaneously. The batch converter will process each file in sequence and package all resulting high-resolution JPG files into a single convenient ZIP archive.
              </p>
            </div>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <span>🔗</span> Related Image Workflow Tools
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
              <a
                href={getLinkUrl('/image-compressor')}
                onClick={(e) => handleNav(e, '/image-compressor')}
                className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 transition-all block text-xs group"
              >
                <span className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 block mb-1">
                  Image Compressor →
                </span>
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                  Compress converted JPG photos to 20KB, 50KB, or 100KB limits.
                </span>
              </a>
              <a
                href={getLinkUrl('/exif-remover')}
                onClick={(e) => handleNav(e, '/exif-remover')}
                className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 transition-all block text-xs group"
              >
                <span className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 block mb-1">
                  EXIF Remover →
                </span>
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                  Strip GPS coordinates and iPhone camera metadata before posting.
                </span>
              </a>
              <a
                href={getLinkUrl('/image-resizer')}
                onClick={(e) => handleNav(e, '/image-resizer')}
                className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 transition-all block text-xs group"
              >
                <span className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 block mb-1">
                  Image Resizer →
                </span>
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                  Resize high-megapixel iPhone photos to standard web dimensions.
                </span>
              </a>
              <a
                href={getLinkUrl('/batch-image-converter')}
                onClick={(e) => handleNav(e, '/batch-image-converter')}
                className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 transition-all block text-xs group"
              >
                <span className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 block mb-1">
                  Batch Image Converter →
                </span>
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                  Convert multiple images across WebP, PNG, and JPG formats.
                </span>
              </a>
            </div>
          </div>
        </section>
      );

    case 'passport-photo-maker':
      return (
        <section className="glass-panel p-6 sm:p-10 rounded-3xl space-y-8 border border-indigo-200/50 dark:border-indigo-900/40">
          <div className="border-b border-slate-200/60 dark:border-slate-800/60 pb-4">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
              Official Consular Standards &amp; Biometric Alignment
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              Passport Photo Maker: Biometric ID Photos for India, US, Schengen, UK &amp; Canada
            </h2>
          </div>

          {/* Consular Specifications Table */}
          <div className="glass-card p-6 rounded-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Globe className="w-4 h-4 text-indigo-500" /> International Passport &amp; Visa Specifications Table
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold uppercase">
                    <th className="py-2.5 px-3">Country / Document</th>
                    <th className="py-2.5 px-3">Physical Size</th>
                    <th className="py-2.5 px-3">Pixels (300 DPI)</th>
                    <th className="py-2.5 px-3">Head Ratio</th>
                    <th className="py-2.5 px-3">Background</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-indigo-600">India Passport (Online)</td>
                    <td className="py-2.5 px-3">35 &times; 45 mm</td>
                    <td className="py-2.5 px-3">413 &times; 531 px</td>
                    <td className="py-2.5 px-3">70% – 80% (31–36 mm)</td>
                    <td className="py-2.5 px-3">Plain White / Light Grey</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-indigo-600">India Visa &amp; OCI</td>
                    <td className="py-2.5 px-3">2 &times; 2 in (51 &times; 51 mm)</td>
                    <td className="py-2.5 px-3">600 &times; 600 px</td>
                    <td className="py-2.5 px-3">70% – 80% (35–40 mm)</td>
                    <td className="py-2.5 px-3">Plain White</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-indigo-600">US Passport &amp; Visa</td>
                    <td className="py-2.5 px-3">2 &times; 2 in (51 &times; 51 mm)</td>
                    <td className="py-2.5 px-3">600 &times; 600 px</td>
                    <td className="py-2.5 px-3">50% – 69% (1–1.375 in)</td>
                    <td className="py-2.5 px-3">Plain White / Off-White</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-indigo-600">Schengen Europe Visa</td>
                    <td className="py-2.5 px-3">35 &times; 45 mm</td>
                    <td className="py-2.5 px-3">413 &times; 531 px</td>
                    <td className="py-2.5 px-3">70% – 80% (32–36 mm)</td>
                    <td className="py-2.5 px-3">Light Grey or White</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-indigo-600">UK Passport</td>
                    <td className="py-2.5 px-3">35 &times; 45 mm</td>
                    <td className="py-2.5 px-3">413 &times; 531 px</td>
                    <td className="py-2.5 px-3">65% – 75% (29–34 mm)</td>
                    <td className="py-2.5 px-3">Plain Cream / Light Grey</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-indigo-600">Canada Passport</td>
                    <td className="py-2.5 px-3">50 &times; 70 mm</td>
                    <td className="py-2.5 px-3">591 &times; 827 px</td>
                    <td className="py-2.5 px-3">31–36 mm chin to crown</td>
                    <td className="py-2.5 px-3">Plain White or Light</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card p-6 rounded-2xl space-y-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Camera className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                Biometric Framing Guide Overlay
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                The most common reason for passport application rejection is incorrect facial proportion (head too small or too large). Zubware overlays an interactive <strong>biometric head guide</strong> showing:
              </p>
              <ul className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-1.5 list-disc list-inside">
                <li><strong>Crown Guideline:</strong> Aligns top of hair / head.</li>
                <li><strong>Chin Guideline:</strong> Ensures chin reaches the lower boundary.</li>
                <li><strong>Eye Level Line:</strong> Centers eyes horizontally between 55%–70% of total height.</li>
              </ul>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Use intuitive zoom, pan, and rotate sliders to frame your headshot perfectly within the biometric markers.
              </p>
            </div>

            <div className="glass-card p-6 rounded-2xl space-y-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Printer className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                Printable 4&times;6" Multi-Photo Sheets
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Paying $15 to $20 at commercial pharmacies or photo studios for a passport photo is unnecessary.
              </p>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Zubware automatically formats multiple copies of your photo onto a standard <strong>4&times;6 inch (10&times;15 cm) printable grid</strong> complete with thin scissor cut marks. Save the image, print it at any local pharmacy kiosk or home photo printer for under $0.50, and cut out 6 to 8 compliant passport photos.
              </p>
            </div>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <span>🔗</span> Explore Related Identity Tools
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
              <a
                href={getLinkUrl('/background-remover')}
                onClick={(e) => handleNav(e, '/background-remover')}
                className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 transition-all block text-xs group"
              >
                <span className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 block mb-1">
                  Background Remover →
                </span>
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                  Isolate portrait subjects and replace cluttered room backgrounds.
                </span>
              </a>
              <a
                href={getLinkUrl('/photo-signature-joiner')}
                onClick={(e) => handleNav(e, '/photo-signature-joiner')}
                className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 transition-all block text-xs group"
              >
                <span className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 block mb-1">
                  Photo &amp; Signature Joiner →
                </span>
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                  Stitch candidate photo and signature into a single image for exam portals.
                </span>
              </a>
              <a
                href={getLinkUrl('/signature-resizer')}
                onClick={(e) => handleNav(e, '/signature-resizer')}
                className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 transition-all block text-xs group"
              >
                <span className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 block mb-1">
                  Signature Resizer →
                </span>
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                  Crop and compress candidate signatures under 20KB for SSC &amp; UPSC.
                </span>
              </a>
              <a
                href={getLinkUrl('/image-compressor')}
                onClick={(e) => handleNav(e, '/image-compressor')}
                className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 transition-all block text-xs group"
              >
                <span className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 block mb-1">
                  Image Compressor →
                </span>
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                  Compress passport photos to 20KB–50KB limits for online applications.
                </span>
              </a>
            </div>
          </div>
        </section>
      );

    case 'signature-maker':
      return (
        <section className="glass-panel p-6 sm:p-10 rounded-3xl space-y-8 border border-indigo-200/50 dark:border-indigo-900/40">
          <div className="border-b border-slate-200/60 dark:border-slate-800/60 pb-4">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
              Electronic Signature &amp; Document Authorization
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              Online Signature Maker: Draw, Type or Scan Transparent Electronic Signatures
            </h2>
          </div>

          {/* Three Creation Modes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card p-6 rounded-2xl space-y-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <PenTool className="w-5 h-5 text-indigo-600 dark:text-indigo-400" /> Mode 1: Draw Signature
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Sign directly on screen using an HTML5 drawing canvas with real-time bezier curve interpolation. Optimized for smartphone touchscreens, iPads, Apple Pencils, and computer mice.
              </p>
              <ul className="text-xs text-slate-500 dark:text-slate-400 space-y-1">
                <li>• Smooth pressure-like stroke width (1–8px)</li>
                <li>• Executive ink colors (Black, Royal Blue, Navy)</li>
                <li>• Instant Undo, Redo, and Clear controls</li>
              </ul>
            </div>

            <div className="glass-card p-6 rounded-2xl space-y-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" /> Mode 2: Type Cursive Signature
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Type your name or initials to generate elegant digital signatures using curated calligraphy fonts (such as Caveat, Dancing Script, Great Vibes, and Pacifico).
              </p>
              <ul className="text-xs text-slate-500 dark:text-slate-400 space-y-1">
                <li>• 10+ realistic handwriting typography styles</li>
                <li>• Adjustable font size, letter slant &amp; spacing</li>
                <li>• Perfect for formal contracts and letters</li>
              </ul>
            </div>

            <div className="glass-card p-6 rounded-2xl space-y-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Camera className="w-5 h-5 text-indigo-600 dark:text-indigo-400" /> Mode 3: Scan &amp; Clean Paper
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Sign a white sheet of paper and take a quick smartphone photo. Zubware automatically analyzes contrast and strips paper shadows, yellow tint, and grain.
              </p>
              <ul className="text-xs text-slate-500 dark:text-slate-400 space-y-1">
                <li>• Adaptive binarization threshold slider</li>
                <li>• Removes paper background to 100% transparent</li>
                <li>• Preserves authentic personal pen strokes</li>
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card p-6 rounded-2xl space-y-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-600 dark:text-indigo-400" /> Transparent PNG &amp; Vector SVG Export
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Exporting your signature as a <strong>transparent 32-bit PNG</strong> ensures you can insert it into Adobe Acrobat, Microsoft Word, Google Docs, or DocuSign contracts without ugly white boxes covering signature lines or text underneath.
              </p>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Graphic designers and professionals can also download in scalable vector SVG format for infinite resolution in print.
              </p>
            </div>

            <div className="glass-card p-6 rounded-2xl space-y-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Lock className="w-5 h-5 text-emerald-500" /> Absolute Identity Privacy (Zero Server Logs)
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Your signature is your legal identity. Unlike commercial e-signature platforms that store your biometric drawings in centralized databases, Zubware executes 100% locally inside your device browser memory.
              </p>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Your signature drawings, typed names, and scanned photos are never sent across the internet, recorded on Zubware servers, or used for AI training.
              </p>
            </div>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <span>🔗</span> Explore Related Signature &amp; Document Tools
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
              <a
                href={getLinkUrl('/signature-resizer')}
                onClick={(e) => handleNav(e, '/signature-resizer')}
                className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 transition-all block text-xs group"
              >
                <span className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 block mb-1">
                  Signature Resizer →
                </span>
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                  Resize and compress signatures under 20KB for SSC, UPSC &amp; IBPS.
                </span>
              </a>
              <a
                href={getLinkUrl('/photo-signature-joiner')}
                onClick={(e) => handleNav(e, '/photo-signature-joiner')}
                className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 transition-all block text-xs group"
              >
                <span className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 block mb-1">
                  Photo &amp; Signature Joiner →
                </span>
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                  Merge passport photo and signature into one image for online exams.
                </span>
              </a>
              <a
                href={getLinkUrl('/edit-pdf')}
                onClick={(e) => handleNav(e, '/edit-pdf')}
                className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 transition-all block text-xs group"
              >
                <span className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 block mb-1">
                  Online PDF Editor →
                </span>
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                  Insert your digital signature directly onto PDF document pages.
                </span>
              </a>
              <a
                href={getLinkUrl('/watermark-image')}
                onClick={(e) => handleNav(e, '/watermark-image')}
                className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 transition-all block text-xs group"
              >
                <span className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 block mb-1">
                  Watermark Image →
                </span>
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                  Stamp your signature as a transparent copyright watermark on photos.
                </span>
              </a>
            </div>
          </div>
        </section>
      );

    case 'handwriting-to-text':
      return (
        <section className="glass-panel p-6 sm:p-10 rounded-3xl space-y-8 border border-indigo-200/50 dark:border-indigo-900/40">
          <div className="border-b border-slate-200/60 dark:border-slate-800/60 pb-4">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
              Neural OCR &amp; Handwritten Notes Transcription
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              Handwriting to Text OCR: Convert Handwritten Notes to Digital Text Online
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card p-6 rounded-2xl space-y-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                Digitize Notebook Pages, Lectures &amp; Homework
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Manually retyping handwritten student notebook pages, research scribbles, or conference brainstorm notes consumes hours of productive time. Zubware Handwriting to Text OCR converts physical pen-and-paper notes into editable, searchable digital text in seconds.
              </p>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Featuring two convenient input modes: upload smartphone snapshots of physical pages or use the <strong>interactive drawing canvas</strong> to handwrite live on your iPad, tablet, or touchscreen with a stylus.
              </p>
            </div>

            <div className="glass-card p-6 rounded-2xl space-y-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sliders className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                Adaptive Contrast &amp; Ink Binarization
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Handwritten notes captured under indoor lighting often suffer from yellowish casts, faint pencil strokes, and distracting notebook margins or grid lines.
              </p>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Zubware applies adaptive thresholding to boost ink contrast and whiten paper textures. This feeds razor-sharp character contours into the <strong>Tesseract.js LSTM neural network</strong>, drastically minimizing OCR transcription errors.
              </p>
            </div>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <span>🔗</span> Explore Related OCR &amp; Text Tools
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
              <a
                href={getLinkUrl('/image-to-text')}
                onClick={(e) => handleNav(e, '/image-to-text')}
                className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 transition-all block text-xs group"
              >
                <span className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 block mb-1">
                  Image to Text OCR →
                </span>
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                  Extract printed text from screenshots, books, receipts &amp; scans.
                </span>
              </a>
              <a
                href={getLinkUrl('/text-to-handwriting')}
                onClick={(e) => handleNav(e, '/text-to-handwriting')}
                className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 transition-all block text-xs group"
              >
                <span className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 block mb-1">
                  Text to Handwriting →
                </span>
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                  Convert digital typed text back into realistic handwritten notes.
                </span>
              </a>
              <a
                href={getLinkUrl('/signature-maker')}
                onClick={(e) => handleNav(e, '/signature-maker')}
                className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 transition-all block text-xs group"
              >
                <span className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 block mb-1">
                  Online Signature Maker →
                </span>
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                  Draw or scan clean digital signatures for PDF document forms.
                </span>
              </a>
              <a
                href={getLinkUrl('/pdf-to-text')}
                onClick={(e) => handleNav(e, '/pdf-to-text')}
                className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 transition-all block text-xs group"
              >
                <span className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 block mb-1">
                  PDF to Text Converter →
                </span>
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                  Extract textual contents from multi-page PDF documents.
                </span>
              </a>
            </div>
          </div>
        </section>
      );

    case 'image-to-text':
      return (
        <section className="glass-panel p-6 sm:p-10 rounded-3xl space-y-8 border border-indigo-200/50 dark:border-indigo-900/40">
          <div className="border-b border-slate-200/60 dark:border-slate-800/60 pb-4">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
              Optical Character Recognition &amp; Multilingual Extraction
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              Image to Text OCR: Extract Text from Photos, Scans &amp; Screenshots Online
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card p-6 rounded-2xl space-y-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                Universal Document &amp; Screen Extraction
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Zubware Image to Text OCR extracts machine-encoded and printed text from any image format: <strong>JPG, PNG, WebP, BMP, and GIF</strong>. Easily pull data from:
              </p>
              <ul className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-1.5 list-disc list-inside">
                <li><strong>Screenshots:</strong> Code snippets, WhatsApp chats, tweets, error dialogs.</li>
                <li><strong>Scanned Invoices &amp; Receipts:</strong> Table rows, dates, item amounts, totals.</li>
                <li><strong>Printed Literature:</strong> Textbook chapters, research papers, legal agreements.</li>
                <li><strong>Business Cards &amp; Signs:</strong> Phone numbers, email addresses, street names.</li>
              </ul>
            </div>

            <div className="glass-card p-6 rounded-2xl space-y-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Globe className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                11+ Language Models Supported
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Accurate OCR requires specialized linguistic character models. Zubware supports over 11 major global and Indian languages:
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300">
                <span>• English (eng)</span>
                <span>• Hindi (hin - हिंदी)</span>
                <span>• Spanish (spa)</span>
                <span>• French (fra)</span>
                <span>• German (deu)</span>
                <span>• Italian (ita)</span>
                <span>• Portuguese (por)</span>
                <span>• Russian (rus)</span>
                <span>• Chinese Simplified</span>
                <span>• Japanese (jpn)</span>
                <span>• Arabic (ara)</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card p-6 rounded-2xl space-y-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" /> Confidence Score &amp; Text Editing
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Following recognition, Zubware calculates an overall <strong>confidence accuracy percentage</strong> (0%–100%) so you can gauge transcription reliability at a glance.
              </p>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Review and refine recognized text directly in the integrated editor featuring live word and character counters. Copy text to your clipboard with one click or download as a <code>.txt</code> file.
              </p>
            </div>

            <div className="glass-card p-6 rounded-2xl space-y-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Lock className="w-5 h-5 text-emerald-500" /> 100% Client-Side WebAssembly Privacy
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Your confidential financial invoices, tax documents, patient medical summaries, and contracts are processed entirely inside your browser memory using <strong>Tesseract.js WebAssembly</strong>.
              </p>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Zero document uploads, zero logging, and zero remote data retention.
              </p>
            </div>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <span>🔗</span> Explore Related OCR Tools
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
              <a
                href={getLinkUrl('/handwriting-to-text')}
                onClick={(e) => handleNav(e, '/handwriting-to-text')}
                className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 transition-all block text-xs group"
              >
                <span className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 block mb-1">
                  Handwriting to Text OCR →
                </span>
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                  Transcribe handwritten notebook pages and whiteboard notes.
                </span>
              </a>
              <a
                href={getLinkUrl('/pdf-to-text')}
                onClick={(e) => handleNav(e, '/pdf-to-text')}
                className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 transition-all block text-xs group"
              >
                <span className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 block mb-1">
                  PDF to Text Converter →
                </span>
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                  Extract selectable text from multi-page PDF documents.
                </span>
              </a>
              <a
                href={getLinkUrl('/image-info-viewer')}
                onClick={(e) => handleNav(e, '/image-info-viewer')}
                className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 transition-all block text-xs group"
              >
                <span className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 block mb-1">
                  Image Info Viewer →
                </span>
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                  Inspect image resolution, color space, and metadata tags.
                </span>
              </a>
              <a
                href={getLinkUrl('/barcode-scanner')}
                onClick={(e) => handleNav(e, '/barcode-scanner')}
                className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 transition-all block text-xs group"
              >
                <span className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 block mb-1">
                  Barcode Scanner →
                </span>
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                  Scan and decode retail barcodes and 2D QR codes from images.
                </span>
              </a>
            </div>
          </div>
        </section>
      );

    default:
      return null;
  }
};
