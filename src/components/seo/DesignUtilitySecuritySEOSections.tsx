import React from 'react';
import { ToolMeta } from '../../types';
import { ShieldCheck, Zap, BookOpen, ExternalLink, ArrowRight, CheckCircle2, AlertTriangle, Key, Clock, Palette } from 'lucide-react';

interface Props {
  tool: ToolMeta;
  onNavigate: (path: string) => void;
}

export const DesignUtilitySecuritySEOSection: React.FC<Props> = ({ tool, onNavigate }) => {
  switch (tool.id) {
    case 'contrast-checker':
      return (
        <section className="mt-12 glass-panel p-6 sm:p-10 rounded-3xl space-y-8 border border-slate-200/80 dark:border-slate-800/80">
          <div className="border-b border-slate-200/60 dark:border-slate-800/60 pb-5">
            <span className="text-xs font-bold uppercase tracking-widest text-primary-600 dark:text-primary-400">
              WCAG 2.1 Color Accessibility Standards
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              WCAG Color Contrast Checker: Accessible Web Design & Luminance Ratios
            </h2>
            <p className="mt-3 text-base text-slate-600 dark:text-slate-300 max-w-4xl leading-relaxed">
              Zubware Contrast Checker calculates mathematically precise color contrast ratios between text and background surfaces using the W3C sRGB relative luminance specification. Evaluate WCAG 2.1 Level AA and Level AAA conformance in real time to design inclusive digital experiences.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card p-6 rounded-2xl space-y-3 border border-slate-200/60 dark:border-slate-800/60">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">sRGB Relative Luminance Math</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Computes photometric brightness weighted by human retinal sensitivity: L = 0.2126*R + 0.7152*G + 0.0722*B after linearizing gamma-compressed 8-bit color channels.</p>
              <ul className="text-xs space-y-1.5 text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Normalized float luminance (0.0 to 1.0)</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Human eye weighting (green-dominant)</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Contrast Ratio = (L1 + 0.05) / (L2 + 0.05)</li>
              </ul>
            </div>
            <div className="glass-card p-6 rounded-2xl space-y-3 border border-slate-200/60 dark:border-slate-800/60">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">WCAG 2.1 Compliance Tiers</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Evaluates color pairs across all formal W3C accessibility criteria for body typography, display headlines, and interactive components.</p>
              <ul className="text-xs space-y-1.5 text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Normal Text AA: Minimum 4.5:1 ratio</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Normal Text AAA: Minimum 7.0:1 ratio</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Large Text AA: Minimum 3.0:1 ratio</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> UI Elements & Badges: Minimum 3.0:1 ratio</li>
              </ul>
            </div>
            <div className="glass-card p-6 rounded-2xl space-y-3 border border-slate-200/60 dark:border-slate-800/60">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">100% Client-Side Privacy</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">All color parsing, luminance equations, and live card rendering execute entirely inside your browser memory with zero network requests.</p>
              <ul className="text-xs space-y-1.5 text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Zero server telemetry</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Instant real-time recalculation</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Works completely offline</li>
              </ul>
            </div>
          </div>

          <div className="space-y-6 pt-2">
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Understanding Relative Luminance and Contrast Thresholds</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">Under the Web Content Accessibility Guidelines (WCAG 2.1), visual presentation of text and images of text must have adequate contrast against background colors. Contrast ratio is calculated on a mathematical scale from 1:1 (zero contrast, e.g., white on white) to 21:1 (maximum theoretical contrast, black on white). Relative luminance normalizes non-linear sRGB gamma curves into linear RGB color space before applying photometric coefficients.</p>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">WCAG defines two primary compliance levels: Level AA (the international legal standard referenced by ADA Title III, Section 508, and the European Accessibility Act EN 301 549) and Level AAA (the enhanced standard for specialized low-vision environments). Normal text (below 18pt regular or 14pt bold) requires at least 4.5:1 for AA and 7:1 for AAA. Large text requires 3:1 for AA and 4.5:1 for AAA.</p>
              <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 text-amber-900 dark:text-amber-200 text-sm">
                <strong className="block font-semibold mb-1">Non-Text Contrast (Success Criterion 1.4.11)</strong>
                WCAG 2.1 introduced mandatory 3:1 contrast requirements for graphical user interface components (active button borders, form input outlines, checkbox states) and meaningful informational icons. Avoid subtle low-contrast gray borders on form inputs.
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Design Best Practices & Accessibility Limitations</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">While passing automated contrast checks is necessary, automated tools cannot test contextual usability. For example, high-contrast pure white (#ffffff) on pitch black (#000000) achieves a 21:1 ratio but can cause visual halation (blurry text ghosting) for readers with astigmatism. Off-white (#f1f5f9) on dark slate (#0f172a) often provides superior reading comfort.</p>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">Additionally, color contrast is only one pillar of accessibility. Digital compliance also requires semantic HTML heading hierarchy, keyboard focus rings, alt text for images, and responsive font scaling up to 200% without horizontal scrolling.</p>

            </div>
          </div>

          <div className="pt-6 border-t border-slate-200/60 dark:border-slate-800/60">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">
              Contextual & Related Workflows on Zubware
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => onNavigate('/qr-business-card-generator')}
                className="text-left p-4 rounded-xl border border-slate-200/70 dark:border-slate-800/70 hover:border-primary-500 dark:hover:border-primary-500 transition-colors group bg-white/50 dark:bg-slate-900/40"
              >
                <div className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 flex items-center justify-between">
                  <span>QR Business Card Generator</span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-primary-500 transition-transform group-hover:translate-x-1" />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Ensure high-contrast styling on printed and digital vCards</p>
              </button>
              <button
                type="button"
                onClick={() => onNavigate('/percentage-calculator')}
                className="text-left p-4 rounded-xl border border-slate-200/70 dark:border-slate-800/70 hover:border-primary-500 dark:hover:border-primary-500 transition-colors group bg-white/50 dark:bg-slate-900/40"
              >
                <div className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 flex items-center justify-between">
                  <span>Percentage Calculator</span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-primary-500 transition-transform group-hover:translate-x-1" />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Calculate color channel tint and shade percentage offsets</p>
              </button>
            </div>
          </div>
        </section>
      );
    case 'qr-business-card-generator':
      return (
        <section className="mt-12 glass-panel p-6 sm:p-10 rounded-3xl space-y-8 border border-slate-200/80 dark:border-slate-800/80">
          <div className="border-b border-slate-200/60 dark:border-slate-800/60 pb-5">
            <span className="text-xs font-bold uppercase tracking-widest text-primary-600 dark:text-primary-400">
              vCard 3.0 Digital Networking
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              vCard QR Business Card Generator: Contactless Networking & Print Barcodes
            </h2>
            <p className="mt-3 text-base text-slate-600 dark:text-slate-300 max-w-4xl leading-relaxed">
              Zubware QR Business Card Generator creates standardized vCard 3.0 contact barcodes that seamlessly import into iOS and Android contact books upon scanning. Configure contact details, dimensions, and error correction levels with high-resolution vector SVG and PNG downloads.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card p-6 rounded-2xl space-y-3 border border-slate-200/60 dark:border-slate-800/60">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Universal vCard 3.0 Standard</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Encodes structured electronic business cards (names, organizations, titles, phone numbers, emails, addresses, and URLs) recognized natively by smartphone camera systems.</p>
              <ul className="text-xs space-y-1.5 text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Direct phone address book import</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Works completely offline without Wi-Fi</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> No specialized mobile app required</li>
              </ul>
            </div>
            <div className="glass-card p-6 rounded-2xl space-y-3 border border-slate-200/60 dark:border-slate-800/60">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Vector SVG & PNG Export</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Generate razor-sharp vector SVG barcodes for luxury card stock printing or clean PNG images for email signatures and digital badges.</p>
              <ul className="text-xs space-y-1.5 text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Infinite vector scalability (no pixelation)</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Adjustable pixel dimensions (180–400px)</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Custom margin and quiet-zone padding</li>
              </ul>
            </div>
            <div className="glass-card p-6 rounded-2xl space-y-3 border border-slate-200/60 dark:border-slate-800/60">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Reed-Solomon Error Correction</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Configurable error correction (L, M, Q, H) allows business card QR codes to scan reliably even if scuffed, folded, or printed with a custom logo overlay.</p>
              <ul className="text-xs space-y-1.5 text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Level M (15% recovery) for business cards</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Level Q (25% recovery) for textured cardstock</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Zero tracking redirects or expiring links</li>
              </ul>
            </div>
          </div>

          <div className="space-y-6 pt-2">
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Direct vCard Data vs URL Redirect QR Codes</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">Commercial QR providers often encode a redirection URL that points to their private hosted landing page, requiring recurring monthly subscriptions to keep the QR code functional. In contrast, Zubware creates direct, self-contained vCard QR codes. All contact details reside inside the matrix itself.</p>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">When an iPhone camera or Android Google Lens scans a direct vCard QR code, the smartphone decodes the contact fields locally and displays an immediate "Create New Contact" prompt. The recipient does not need cellular reception or an internet connection to import your details.</p>
              <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 text-amber-900 dark:text-amber-200 text-sm">
                <strong className="block font-semibold mb-1">Minimum Print Dimensions & Quiet Zone Rules</strong>
                Because vCard payloads contain substantial text, the QR matrix is dense. Always print the QR code at a minimum size of 0.8 x 0.8 inches (20 x 20 mm) with at least 4 modules of uninterrupted white quiet-zone border to guarantee camera autofocus.
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Print Preparation & Troubleshooting Scannability</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">For professional business card printing, always download the vector SVG format. Raster images (JPEG/PNG) can suffer compression artifacts or blur when scaled in desktop publishing software like Adobe InDesign or Illustrator. SVG retains mathematical vector paths that print crisply at 1200+ DPI.</p>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">Maintain high visual contrast: the QR code modules must be significantly darker than the paper background. Avoid metallic gold ink on white paper or dark charcoal modules on kraft paper, as smartphone sensors rely on sharp contrast differences.</p>

            </div>
          </div>

          <div className="pt-6 border-t border-slate-200/60 dark:border-slate-800/60">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">
              Contextual & Related Workflows on Zubware
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => onNavigate('/qr-code-safety-checker')}
                className="text-left p-4 rounded-xl border border-slate-200/70 dark:border-slate-800/70 hover:border-primary-500 dark:hover:border-primary-500 transition-colors group bg-white/50 dark:bg-slate-900/40"
              >
                <div className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 flex items-center justify-between">
                  <span>QR Code Safety Checker</span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-primary-500 transition-transform group-hover:translate-x-1" />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Verify QR payload safety and test barcode scan parameters</p>
              </button>
              <button
                type="button"
                onClick={() => onNavigate('/contrast-checker')}
                className="text-left p-4 rounded-xl border border-slate-200/70 dark:border-slate-800/70 hover:border-primary-500 dark:hover:border-primary-500 transition-colors group bg-white/50 dark:bg-slate-900/40"
              >
                <div className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 flex items-center justify-between">
                  <span>Contrast Checker</span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-primary-500 transition-transform group-hover:translate-x-1" />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Ensure sufficient optical contrast between QR modules and card stock</p>
              </button>
            </div>
          </div>
        </section>
      );
    case 'unit-converter':
      return (
        <section className="mt-12 glass-panel p-6 sm:p-10 rounded-3xl space-y-8 border border-slate-200/80 dark:border-slate-800/80">
          <div className="border-b border-slate-200/60 dark:border-slate-800/60 pb-5">
            <span className="text-xs font-bold uppercase tracking-widest text-primary-600 dark:text-primary-400">
              Universal Measurement Standards
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              Unit Converter: Metric, Imperial & International Engineering Conversions
            </h2>
            <p className="mt-3 text-base text-slate-600 dark:text-slate-300 max-w-4xl leading-relaxed">
              Zubware Unit Converter provides instantaneous two-way conversion across 7 core physical and digital measurement categories: Length, Mass/Weight, Temperature, Volume, Area, Speed, and Digital Storage. Built with standardized international conversion factors and high floating-point precision.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card p-6 rounded-2xl space-y-3 border border-slate-200/60 dark:border-slate-800/60">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">7 Physical & Digital Categories</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Comprehensive coverage of international metric (SI), US customary, British imperial, and computing unit standards.</p>
              <ul className="text-xs space-y-1.5 text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Length (m, km, mi, ft, in, yd, cm, mm)</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Mass/Weight (kg, g, mg, t, lb, oz, st)</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Temperature (Celsius, Fahrenheit, Kelvin)</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Volume, Area, Speed & Digital Storage</li>
              </ul>
            </div>
            <div className="glass-card p-6 rounded-2xl space-y-3 border border-slate-200/60 dark:border-slate-800/60">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">High-Precision Scientific Factors</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Grounded in official BIPM and NIST conversion factors to eliminate rounding drift across engineering calculations.</p>
              <ul className="text-xs space-y-1.5 text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> 1 inch = exactly 25.4 mm</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> 1 pound = exactly 0.45359237 kg</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Affine temperature scale transformations</li>
              </ul>
            </div>
            <div className="glass-card p-6 rounded-2xl space-y-3 border border-slate-200/60 dark:border-slate-800/60">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Instant In-Browser Execution</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">All conversions recalculate instantly on keystroke with zero server requests, zero latency, and one-click clipboard copying.</p>
              <ul className="text-xs space-y-1.5 text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Zero network roundtrips</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Reverse unit swap button</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Clean decimal formatting</li>
              </ul>
            </div>
          </div>

          <div className="space-y-6 pt-2">
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Scientific Foundations: Mass vs Weight and Temperature Scales</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">In scientific physics, mass is the fundamental measure of matter (measured in kilograms or grams), independent of gravitational field strength. Weight is the gravitational force exerted on that mass (measured in Newtons). In terrestrial engineering and commerce, units like pounds (lb) and kilograms (kg) are treated as equivalent mass standards under standard gravity (9.80665 m/s²).</p>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">Temperature conversions differ from linear physical measurements because temperature scales do not share a common zero point. While length conversion simply multiplies by a constant scalar, Celsius and Fahrenheit require affine transformations: °F = (°C × 9/5) + 32, and °C = (°F - 32) × 5/9. The Kelvin scale represents absolute thermodynamic temperature, offset from Celsius by 273.15 degrees.</p>
              <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 text-amber-900 dark:text-amber-200 text-sm">
                <strong className="block font-semibold mb-1">Digital Storage: Decimal vs Binary Byte Standards</strong>
                This converter follows the international decimal standard (SI / IEEE 1541) where 1 KB = 1,000 Bytes, 1 MB = 1,000,000 Bytes, and 1 GB = 1,000,000,000 Bytes, matching hard drive storage specifications and network bandwidth metrics.
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Common Conversion Pitfalls in International Engineering</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">A frequent source of costly engineering errors is confusing US Customary and British Imperial liquid volumes. While both use pints, quarts, and gallons, a US liquid gallon is 3.78541 liters (128 US fluid ounces of 29.57 ml), whereas an Imperial gallon is 4.54609 liters (160 Imperial fluid ounces of 28.41 ml). Our volume converter uses standard US Customary liquid units.</p>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">When converting square or cubic units, remember that conversion factors must be squared or cubed. For example, because 1 yard = 3 feet, 1 cubic yard = 3³ = 27 cubic feet. The calculator handles dimensional power scaling automatically.</p>

            </div>
          </div>

          <div className="pt-6 border-t border-slate-200/60 dark:border-slate-800/60">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">
              Contextual & Related Workflows on Zubware
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => onNavigate('/cement-calculator')}
                className="text-left p-4 rounded-xl border border-slate-200/70 dark:border-slate-800/70 hover:border-primary-500 dark:hover:border-primary-500 transition-colors group bg-white/50 dark:bg-slate-900/40"
              >
                <div className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 flex items-center justify-between">
                  <span>Cement Concrete Calculator</span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-primary-500 transition-transform group-hover:translate-x-1" />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Convert construction volume between cubic meters and cubic yards</p>
              </button>
              <button
                type="button"
                onClick={() => onNavigate('/percentage-calculator')}
                className="text-left p-4 rounded-xl border border-slate-200/70 dark:border-slate-800/70 hover:border-primary-500 dark:hover:border-primary-500 transition-colors group bg-white/50 dark:bg-slate-900/40"
              >
                <div className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 flex items-center justify-between">
                  <span>Percentage Calculator</span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-primary-500 transition-transform group-hover:translate-x-1" />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Calculate percentage dimensional tolerances and conversion margins</p>
              </button>
            </div>
          </div>
        </section>
      );
    case 'percentage-calculator':
      return (
        <section className="mt-12 glass-panel p-6 sm:p-10 rounded-3xl space-y-8 border border-slate-200/80 dark:border-slate-800/80">
          <div className="border-b border-slate-200/60 dark:border-slate-800/60 pb-5">
            <span className="text-xs font-bold uppercase tracking-widest text-primary-600 dark:text-primary-400">
              Multi-Mode Mathematical Analysis
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              Percentage Calculator: Multi-Scenario Percentages, Increase, Decrease & Change
            </h2>
            <p className="mt-3 text-base text-slate-600 dark:text-slate-300 max-w-4xl leading-relaxed">
              Zubware Percentage Calculator provides mathematically verified calculations across 4 dedicated financial and academic scenarios: What is P% of X, X is what % of Y, Percentage Increase/Decrease between two values, and compounding additions or discounts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card p-6 rounded-2xl space-y-3 border border-slate-200/60 dark:border-slate-800/60">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">4 Specialized Calculation Modes</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Instantly toggle between real-world percentage queries with clear formula explanations for students and analysts.</p>
              <ul className="text-xs space-y-1.5 text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Mode 1: Find P% of X (e.g. 15% of 200 = 30)</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Mode 2: X is what % of Y (e.g. 30 of 200 = 15%)</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Mode 3: Percentage Change from X to Y</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Mode 4: Add or Subtract P% from Value</li>
              </ul>
            </div>
            <div className="glass-card p-6 rounded-2xl space-y-3 border border-slate-200/60 dark:border-slate-800/60">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Step-by-Step Mathematical Transparency</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Every calculation renders its underlying algebraic formula, helping learners understand percentage mechanics.</p>
              <ul className="text-xs space-y-1.5 text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Clear numerator and denominator breakdown</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Directional color indicators (green/red)</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Exact decimal precision</li>
              </ul>
            </div>
            <div className="glass-card p-6 rounded-2xl space-y-3 border border-slate-200/60 dark:border-slate-800/60">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Zero Latency Browser Math</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Calculates instantaneously on keystroke with zero external dependencies and zero data transmission.</p>
              <ul className="text-xs space-y-1.5 text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Instant keyboard input</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Copyable result summaries</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Works offline</li>
              </ul>
            </div>
          </div>

          <div className="space-y-6 pt-2">
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Percentage Change vs Percentage Points: The Critical Distinction</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">One of the most pervasive mathematical errors in financial reporting and politics is confusing percentage change with percentage points. Percentage change evaluates the relative proportional difference between an initial value and a new value: % Change = ((New - Old) / |Old|) × 100.</p>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">Percentage points refer to the simple arithmetic difference between two percentage values. For instance, if a central bank raises its benchmark interest rate from 4% to 6%, the rate has increased by 2 percentage points, but the relative percentage increase in borrowing cost is ((6 - 4) / 4) × 100 = 50%.</p>
              <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 text-amber-900 dark:text-amber-200 text-sm">
                <strong className="block font-semibold mb-1">The Asymmetry of Percentage Increases and Decreases</strong>
                A common cognitive bias assumes that adding 20% and then subtracting 20% restores the original number. In reality, percentage changes operate on shifting bases: 100 + 20% = 120, but 120 - 20% (subtracting 24) = 96. Recovering from a 50% loss requires a 100% gain.
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Everyday Applications: Taxes, Markdowns & Grade Scoring</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">Percentage calculations are foundational across everyday commerce and academics. When determining sales tax or tipping, Mode 1 and Mode 4 allow you to calculate exact dollar add-ons and gross bills. In academic grading, Mode 2 lets students convert raw points (e.g., 68 out of 85) into standardized percentages (80%).</p>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">In business analytics, evaluating year-over-year revenue growth or quarter-over-quarter customer churn relies on Mode 3 to reveal trends independent of absolute company scale.</p>

            </div>
          </div>

          <div className="pt-6 border-t border-slate-200/60 dark:border-slate-800/60">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">
              Contextual & Related Workflows on Zubware
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => onNavigate('/discount-calculator')}
                className="text-left p-4 rounded-xl border border-slate-200/70 dark:border-slate-800/70 hover:border-primary-500 dark:hover:border-primary-500 transition-colors group bg-white/50 dark:bg-slate-900/40"
              >
                <div className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 flex items-center justify-between">
                  <span>Discount Calculator</span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-primary-500 transition-transform group-hover:translate-x-1" />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Apply percentage markdowns to retail products and shopping carts</p>
              </button>
              <button
                type="button"
                onClick={() => onNavigate('/roi-calculator')}
                className="text-left p-4 rounded-xl border border-slate-200/70 dark:border-slate-800/70 hover:border-primary-500 dark:hover:border-primary-500 transition-colors group bg-white/50 dark:bg-slate-900/40"
              >
                <div className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 flex items-center justify-between">
                  <span>ROI & Profit Margin Calculator</span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-primary-500 transition-transform group-hover:translate-x-1" />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Calculate gross profit margins and markup percentages</p>
              </button>
            </div>
          </div>
        </section>
      );
    case 'emi-calculator':
      return (
        <section className="mt-12 glass-panel p-6 sm:p-10 rounded-3xl space-y-8 border border-slate-200/80 dark:border-slate-800/80">
          <div className="border-b border-slate-200/60 dark:border-slate-800/60 pb-5">
            <span className="text-xs font-bold uppercase tracking-widest text-primary-600 dark:text-primary-400">
              Reducing Balance Loan Modeling
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              EMI Calculator: Equated Monthly Installment & Amortization Schedule
            </h2>
            <p className="mt-3 text-base text-slate-600 dark:text-slate-300 max-w-4xl leading-relaxed">
              Zubware EMI Calculator computes monthly loan installments for mortgages, auto financing, and personal loans using the standard monthly reducing balance formula. Analyze principal vs interest splits, lifetime financing costs, and prepayment savings.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card p-6 rounded-2xl space-y-3 border border-slate-200/60 dark:border-slate-800/60">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Monthly Reducing Balance Math</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Uses the universal banking formula: EMI = [P * r * (1 + r)^n] / [(1 + r)^n - 1] to calculate exact monthly payment obligations.</p>
              <ul className="text-xs space-y-1.5 text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> P = Principal borrowed</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> r = Monthly interest rate (Annual % / 12 / 100)</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> n = Total tenure in months</li>
              </ul>
            </div>
            <div className="glass-card p-6 rounded-2xl space-y-3 border border-slate-200/60 dark:border-slate-800/60">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Prepayment Savings Simulator</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Test how small recurring extra monthly payments directly reduce principal, slashing total interest and shortening loan tenure.</p>
              <ul className="text-xs space-y-1.5 text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Simulate $50, $100, or $200 extra payments</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Calculate total interest dollars saved</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Model accelerated loan freedom</li>
              </ul>
            </div>
            <div className="glass-card p-6 rounded-2xl space-y-3 border border-slate-200/60 dark:border-slate-800/60">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Annual Amortization Table</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Review the year-by-year breakdown showing the gradual transition from front-loaded interest charges to rapid principal payoff.</p>
              <ul className="text-xs space-y-1.5 text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Yearly principal paid</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Yearly interest charges</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Ending balance tracking</li>
              </ul>
            </div>
          </div>

          <div className="space-y-6 pt-2">
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">How Amortization Works: Why Early Payments Are Interest-Heavy</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">In a standard reducing-balance amortizing loan, monthly payments remain fixed, but the internal allocation between interest and principal changes drastically over time. In month one, the outstanding loan balance is at its maximum, meaning the monthly interest charge is at its peak. Only a small fraction of your first EMI reduces the actual debt.</p>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">As monthly payments gradually lower the principal balance, the subsequent monthly interest charge decreases. With each passing year, an increasing percentage of your fixed monthly installment goes toward principal equity. Understanding this front-loaded interest curve explains why early prepayments yield massive interest savings.</p>
              <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 text-amber-900 dark:text-amber-200 text-sm">
                <strong className="block font-semibold mb-1">Fixed vs Floating Interest Rates & Bank Surcharges</strong>
                This calculator models fixed-rate repayment or current floating rates. In floating-rate loans (e.g. linked to the RBI repo rate or US SOFR), rate hikes either increase the EMI or extend the loan tenure. Furthermore, banks charge one-time processing fees (0.5%–2%) and statutory taxes not included in pure EMI.
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Strategic Debt Management: Debt-to-Income Guidelines</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">Underwriting standards generally advise that your total monthly EMI commitments (across mortgages, auto loans, and personal credit) should not exceed 40% to 50% of your net monthly income. Exceeding this threshold leaves insufficient liquidity for living expenses and emergencies.</p>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">If you receive an annual bonus or tax refund, applying lump-sum prepayments toward principal early in the loan tenure provides an immediate, risk-free guaranteed return equal to the loan interest rate.</p>

            </div>
          </div>

          <div className="pt-6 border-t border-slate-200/60 dark:border-slate-800/60">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">
              Contextual & Related Workflows on Zubware
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => onNavigate('/loan-calculator')}
                className="text-left p-4 rounded-xl border border-slate-200/70 dark:border-slate-800/70 hover:border-primary-500 dark:hover:border-primary-500 transition-colors group bg-white/50 dark:bg-slate-900/40"
              >
                <div className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 flex items-center justify-between">
                  <span>Loan & Mortgage Calculator</span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-primary-500 transition-transform group-hover:translate-x-1" />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Model detailed mortgage terms with extra payment schedules</p>
              </button>
              <button
                type="button"
                onClick={() => onNavigate('/compound-interest-calculator')}
                className="text-left p-4 rounded-xl border border-slate-200/70 dark:border-slate-800/70 hover:border-primary-500 dark:hover:border-primary-500 transition-colors group bg-white/50 dark:bg-slate-900/40"
              >
                <div className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 flex items-center justify-between">
                  <span>Compound Interest Calculator</span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-primary-500 transition-transform group-hover:translate-x-1" />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Compare debt payoff returns against investing in index funds</p>
              </button>
            </div>
          </div>
        </section>
      );
    case 'discount-calculator':
      return (
        <section className="mt-12 glass-panel p-6 sm:p-10 rounded-3xl space-y-8 border border-slate-200/80 dark:border-slate-800/80">
          <div className="border-b border-slate-200/60 dark:border-slate-800/60 pb-5">
            <span className="text-xs font-bold uppercase tracking-widest text-primary-600 dark:text-primary-400">
              Retail Pricing & Cart Analysis
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              Discount Calculator: Sale Price, Stacked Coupons & Tax Calculations
            </h2>
            <p className="mt-3 text-base text-slate-600 dark:text-slate-300 max-w-4xl leading-relaxed">
              Zubware Discount Calculator determines final register costs and total monetary savings across percentage markdowns, flat cash price drops, stacked promotional coupons, and sales tax. Switch between single item calculations and multi-product cart analysis.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card p-6 rounded-2xl space-y-3 border border-slate-200/60 dark:border-slate-800/60">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Sequential Stacked Discounts</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Accurately computes cascading multi-coupon promotions (e.g. 20% off plus an extra 10% coupon) without common additive errors.</p>
              <ul className="text-xs space-y-1.5 text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Sequential base reduction</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Calculates true effective discount %</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Prevents overestimating store savings</li>
              </ul>
            </div>
            <div className="glass-card p-6 rounded-2xl space-y-3 border border-slate-200/60 dark:border-slate-800/60">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Sales Tax & VAT Integration</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Factor in local state sales tax or national VAT percentages calculated on the net discounted price to see exact checkout totals.</p>
              <ul className="text-xs space-y-1.5 text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Configurable tax percentage</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Breakdown of net price and tax dollars</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Multi-currency symbol support</li>
              </ul>
            </div>
            <div className="glass-card p-6 rounded-2xl space-y-3 border border-slate-200/60 dark:border-slate-800/60">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Single Item & Shopping Cart Modes</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Analyze clearance sticker prices for individual products or total up multiple items with differing discounts in Shopping Cart mode.</p>
              <ul className="text-xs space-y-1.5 text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Instant clear and reset</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> One-click clipboard copying</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> 100% private in-browser math</li>
              </ul>
            </div>
          </div>

          <div className="space-y-6 pt-2">
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">The Mathematics of Stacked Discounts: Why 20% + 10% ≠ 30%</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">Retailers frequently advertise promotions such as "Take 20% off, plus an extra 10% off at register!" Shoppers often mistakenly add the percentages together and expect a 30% discount. In reality, retail POS systems apply discounts sequentially.</p>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">On a $100 item, the initial 20% discount reduces the price to $80. The second 10% coupon applies to the new $80 price, taking off $8. The final price is $72 ($28 total savings), representing an effective discount rate of 28%, not 30%. The calculator displays both the individual markdowns and the true net effective discount rate.</p>
              <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 text-amber-900 dark:text-amber-200 text-sm">
                <strong className="block font-semibold mb-1">Sales Tax Calculation Rules on Discounted Goods</strong>
                In most jurisdictions, sales tax is assessed on the final discounted sale price rather than the original manufacturer MSRP. Final Checkout Cost = Discounted Price × (1 + Tax% / 100). The calculator breaks down the pre-tax savings and the post-tax out-of-pocket cost.
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Reverse Discount Calculation & Shopping Psychology</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">To determine an item’s original retail price from its clearance sticker: Original Price = Sale Price / (1 - Discount% / 100). For example, a coat purchased for $75 after a 25% discount had an original MSRP of $75 / 0.75 = $100.</p>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">Understanding effective discount math helps shoppers evaluate promotional gimmicks like "Buy One Get One 50% Off" (which is mathematically equivalent to a 25% discount across two identical items) versus straight 30% storewide sales.</p>

            </div>
          </div>

          <div className="pt-6 border-t border-slate-200/60 dark:border-slate-800/60">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">
              Contextual & Related Workflows on Zubware
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => onNavigate('/percentage-calculator')}
                className="text-left p-4 rounded-xl border border-slate-200/70 dark:border-slate-800/70 hover:border-primary-500 dark:hover:border-primary-500 transition-colors group bg-white/50 dark:bg-slate-900/40"
              >
                <div className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 flex items-center justify-between">
                  <span>Percentage Calculator</span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-primary-500 transition-transform group-hover:translate-x-1" />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Calculate standalone percentage differences and base changes</p>
              </button>
              <button
                type="button"
                onClick={() => onNavigate('/roi-calculator')}
                className="text-left p-4 rounded-xl border border-slate-200/70 dark:border-slate-800/70 hover:border-primary-500 dark:hover:border-primary-500 transition-colors group bg-white/50 dark:bg-slate-900/40"
              >
                <div className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 flex items-center justify-between">
                  <span>ROI & Profit Margin Calculator</span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-primary-500 transition-transform group-hover:translate-x-1" />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Evaluate retail margins and vendor product markups</p>
              </button>
            </div>
          </div>
        </section>
      );
    case 'currency-calculator':
      return (
        <section className="mt-12 glass-panel p-6 sm:p-10 rounded-3xl space-y-8 border border-slate-200/80 dark:border-slate-800/80">
          <div className="border-b border-slate-200/60 dark:border-slate-800/60 pb-5">
            <span className="text-xs font-bold uppercase tracking-widest text-primary-600 dark:text-primary-400">
              Foreign Exchange Modeling
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              Currency Calculator: International FX Rates & Custom Spread Adjustments
            </h2>
            <p className="mt-3 text-base text-slate-600 dark:text-slate-300 max-w-4xl leading-relaxed">
              Zubware Currency Calculator performs instantaneous currency conversions across major international fiat currencies. Features benchmark interbank exchange rates, custom bank spread adjustments, and reciprocal rate lookups with zero network tracking.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card p-6 rounded-2xl space-y-3 border border-slate-200/60 dark:border-slate-800/60">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Major International Currencies</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Instant conversion between major global currencies: USD, EUR, GBP, INR, JPY, CAD, AUD, CHF, CNY, AED, and SGD.</p>
              <ul className="text-xs space-y-1.5 text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Bidirectional unit swap</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Reciprocal rate display (1 USD = X EUR)</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> High decimal precision</li>
              </ul>
            </div>
            <div className="glass-card p-6 rounded-2xl space-y-3 border border-slate-200/60 dark:border-slate-800/60">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Custom Bank Spread Settings</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Open Rate Settings to input your credit card or bank’s specific markup spread to see actual statement charges.</p>
              <ul className="text-xs space-y-1.5 text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Model 1.5%–3.5% foreign transaction fees</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Test hypothetical exchange rate scenarios</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Custom rate persistence in session</li>
              </ul>
            </div>
            <div className="glass-card p-6 rounded-2xl space-y-3 border border-slate-200/60 dark:border-slate-800/60">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Zero Latency & Total Privacy</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">All conversions run locally in browser memory without connecting to external tracking servers or third-party ad networks.</p>
              <ul className="text-xs space-y-1.5 text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Instant calculation on keystroke</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Works offline without Wi-Fi</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Zero financial data collection</li>
              </ul>
            </div>
          </div>

          <div className="space-y-6 pt-2">
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Interbank Mid-Market Rates vs Retail Foreign Exchange Spreads</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">Foreign exchange markets operate on wholesale interbank rates—the midpoint between institutional buy and sell quotes. However, retail consumers traveling abroad or ordering international goods rarely receive the mid-market rate.</p>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">Commercial banks, airport currency exchange kiosks, and credit card issuers add a foreign exchange markup (spread) ranging from 1.5% to over 5%, plus optional foreign transaction fees. By opening Rate Settings, users can calibrate the conversion rate to match their bank’s exact fee schedule.</p>
              <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 text-amber-900 dark:text-amber-200 text-sm">
                <strong className="block font-semibold mb-1">Understanding Reciprocal Exchange Rates</strong>
                Every currency conversion has a direct rate and an inverse (reciprocal) rate: Inverse = 1 / Direct Rate. For example, if 1 USD = 0.92 EUR, then 1 EUR = 1 / 0.92 ≈ 1.087 USD. The calculator displays both directions simultaneously to prevent mental math errors.
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Travel Budgeting & Cross-Border Commerce</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">When budgeting for overseas travel or pricing international ecommerce shipments, tracking exchange rate volatility prevents unexpected credit card charges. Dynamic Currency Conversion (DCC) offered at foreign payment terminals often carries hidden 5%–7% markups; travelers should always opt to be billed in the local destination currency.</p>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">This tool provides an immediate reference benchmark so you can quickly evaluate whether a local merchant or ATM is offering a fair exchange rate.</p>

            </div>
          </div>

          <div className="pt-6 border-t border-slate-200/60 dark:border-slate-800/60">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">
              Contextual & Related Workflows on Zubware
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => onNavigate('/unit-converter')}
                className="text-left p-4 rounded-xl border border-slate-200/70 dark:border-slate-800/70 hover:border-primary-500 dark:hover:border-primary-500 transition-colors group bg-white/50 dark:bg-slate-900/40"
              >
                <div className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 flex items-center justify-between">
                  <span>Unit Converter</span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-primary-500 transition-transform group-hover:translate-x-1" />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Convert imperial and metric units for international travel</p>
              </button>
              <button
                type="button"
                onClick={() => onNavigate('/discount-calculator')}
                className="text-left p-4 rounded-xl border border-slate-200/70 dark:border-slate-800/70 hover:border-primary-500 dark:hover:border-primary-500 transition-colors group bg-white/50 dark:bg-slate-900/40"
              >
                <div className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 flex items-center justify-between">
                  <span>Discount Calculator</span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-primary-500 transition-transform group-hover:translate-x-1" />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Calculate duty-free shopping discounts across currencies</p>
              </button>
            </div>
          </div>
        </section>
      );
    case 'loan-calculator':
      return (
        <section className="mt-12 glass-panel p-6 sm:p-10 rounded-3xl space-y-8 border border-slate-200/80 dark:border-slate-800/80">
          <div className="border-b border-slate-200/60 dark:border-slate-800/60 pb-5">
            <span className="text-xs font-bold uppercase tracking-widest text-primary-600 dark:text-primary-400">
              Comprehensive Mortgage Amortization
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              Loan & Mortgage Calculator: Monthly Payments & Accelerated Payoff
            </h2>
            <p className="mt-3 text-base text-slate-600 dark:text-slate-300 max-w-4xl leading-relaxed">
              Zubware Loan & Mortgage Calculator provides comprehensive financial modeling for home purchases, refinances, and fixed-rate installment loans. Evaluate monthly principal and interest payments, total financing charges, and extra payment payoff acceleration.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card p-6 rounded-2xl space-y-3 border border-slate-200/60 dark:border-slate-800/60">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Standard Fixed-Rate Amortization</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Models 15-year, 20-year, and 30-year fixed-rate mortgages and personal installment loans with full mathematical precision.</p>
              <ul className="text-xs space-y-1.5 text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> P&I monthly payment calculation</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Total interest paid over loan life</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Lifetime total cash outlay</li>
              </ul>
            </div>
            <div className="glass-card p-6 rounded-2xl space-y-3 border border-slate-200/60 dark:border-slate-800/60">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Extra Principal Contribution Modeling</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">See how adding $50, $100, or $500 to your monthly payment shaves years off your mortgage and saves tens of thousands in interest.</p>
              <ul className="text-xs space-y-1.5 text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Accelerated payoff year and month</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Exact interest dollars eliminated</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Shortened debt horizon</li>
              </ul>
            </div>
            <div className="glass-card p-6 rounded-2xl space-y-3 border border-slate-200/60 dark:border-slate-800/60">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Full Annual Amortization Breakdown</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Inspect the itemized schedule tracking the shift from interest charges to rapid home equity accumulation.</p>
              <ul className="text-xs space-y-1.5 text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Annual principal reduction</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Cumulative interest payments</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Ending balance progression</li>
              </ul>
            </div>
          </div>

          <div className="space-y-6 pt-2">
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">15-Year vs 30-Year Mortgages: The Trade-Off Between Cash Flow and Wealth</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">The 30-year fixed mortgage is the most popular residential home loan because spreading repayment over 360 months lowers the mandatory monthly payment, maximizing borrowing power. However, the extended timeline means borrowers often pay more in total interest than the original purchase price of the home.</p>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">A 15-year fixed mortgage requires higher monthly payments (typically 30%–40% higher), but usually carries a lower interest rate and cuts lifetime financing charges by more than 60%. Borrowers with a 30-year mortgage can mimic a 15-year loan by making voluntary extra principal payments while retaining the safety of a lower required monthly payment.</p>
              <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 text-amber-900 dark:text-amber-200 text-sm">
                <strong className="block font-semibold mb-1">Understanding PITI and Private Mortgage Insurance (PMI)</strong>
                This calculator determines the core Principal and Interest (P&I) payment. Real-world mortgage escrow (PITI) also includes local Property Taxes, Homeowners Insurance, HOA dues, and Private Mortgage Insurance (PMI) if down payment is under 20%.
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">The Wealth-Building Power of Early Principal Curtailment</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">Because mortgage interest is calculated monthly on the remaining unpaid principal balance, every dollar paid above the scheduled payment reduces all future interest compounding. For example, on a $300,000 mortgage at 6.5%, an extra $150 per month saves over $40,000 in interest and pays off the loan 4 years early.</p>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">This tool allows prospective homebuyers and homeowners exploring refinancing to model realistic payoff strategies without submitting personal information or triggering credit checks.</p>

            </div>
          </div>

          <div className="pt-6 border-t border-slate-200/60 dark:border-slate-800/60">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">
              Contextual & Related Workflows on Zubware
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => onNavigate('/emi-calculator')}
                className="text-left p-4 rounded-xl border border-slate-200/70 dark:border-slate-800/70 hover:border-primary-500 dark:hover:border-primary-500 transition-colors group bg-white/50 dark:bg-slate-900/40"
              >
                <div className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 flex items-center justify-between">
                  <span>EMI Calculator</span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-primary-500 transition-transform group-hover:translate-x-1" />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Calculate monthly loan installments with reducing-balance schedules</p>
              </button>
              <button
                type="button"
                onClick={() => onNavigate('/compound-interest-calculator')}
                className="text-left p-4 rounded-xl border border-slate-200/70 dark:border-slate-800/70 hover:border-primary-500 dark:hover:border-primary-500 transition-colors group bg-white/50 dark:bg-slate-900/40"
              >
                <div className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 flex items-center justify-between">
                  <span>Compound Interest Calculator</span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-primary-500 transition-transform group-hover:translate-x-1" />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Compare mortgage prepayment against long-term index fund investing</p>
              </button>
            </div>
          </div>
        </section>
      );
    case 'roi-calculator':
      return (
        <section className="mt-12 glass-panel p-6 sm:p-10 rounded-3xl space-y-8 border border-slate-200/80 dark:border-slate-800/80">
          <div className="border-b border-slate-200/60 dark:border-slate-800/60 pb-5">
            <span className="text-xs font-bold uppercase tracking-widest text-primary-600 dark:text-primary-400">
              Commercial Profitability Modeling
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              ROI & Profit Margin Calculator: Margins, Markup & Break-Even Analysis
            </h2>
            <p className="mt-3 text-base text-slate-600 dark:text-slate-300 max-w-4xl leading-relaxed">
              Zubware ROI & Profit Margin Calculator analyzes commercial profitability across three financial models: Gross Profit Margin vs Markup %, Return on Investment (ROI) %, and Break-Even Unit Volume Analysis. Compare revenue gains against cost outlays with complete client-side data privacy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card p-6 rounded-2xl space-y-3 border border-slate-200/60 dark:border-slate-800/60">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Margin vs Markup Disambiguation</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Eliminate common pricing confusion by instantly calculating both Profit Margin % and Markup % from Cost and Selling Price.</p>
              <ul className="text-xs space-y-1.5 text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Margin % = (Profit / Revenue) × 100</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Markup % = (Profit / Cost) × 100</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Gross profit dollar calculation</li>
              </ul>
            </div>
            <div className="glass-card p-6 rounded-2xl space-y-3 border border-slate-200/60 dark:border-slate-800/60">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Return on Investment (ROI %)</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Evaluate capital expenditure and marketing campaigns: ROI = ((Total Gain - Investment Cost) / Investment Cost) × 100.</p>
              <ul className="text-xs space-y-1.5 text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Net return dollars</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Percentage yield calculation</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Supports marketing ROAS modeling</li>
              </ul>
            </div>
            <div className="glass-card p-6 rounded-2xl space-y-3 border border-slate-200/60 dark:border-slate-800/60">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Break-Even Volume Analysis</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Determine the exact number of product units and gross revenue required to recover fixed operational overhead.</p>
              <ul className="text-xs space-y-1.5 text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Fixed costs vs unit variable costs</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Break-even unit threshold</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Break-even revenue milestone</li>
              </ul>
            </div>
          </div>

          <div className="space-y-6 pt-2">
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">The Danger of Confusing Margin and Markup in Retail Pricing</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">Confusing markup with margin is one of the most common causes of business insolvency in retail and wholesale. Margin represents the percentage of selling price that is profit. Markup represents the percentage added to cost price to establish the selling price.</p>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">If a product costs $50 and is sold for $100, the gross profit is $50. The markup is 100% ($50 / $50), but the profit margin is only 50% ($50 / $100). If a business owner needing a 30% margin mistakenly applies a 30% markup to a $100 cost, they sell for $130, yielding a margin of only 23.1% ($30 / $130), leaving them short of overhead targets.</p>
              <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 text-amber-900 dark:text-amber-200 text-sm">
                <strong className="block font-semibold mb-1">Break-Even Economics: Fixed vs Variable Cost Structures</strong>
                Break-Even Units = Total Fixed Costs / (Unit Selling Price - Unit Variable Cost). The denominator is known as the "Unit Contribution Margin". Every unit sold past the break-even volume contributes 100% of its contribution margin directly to net profit.
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Accounting Profit vs Cash Flow in ROI Evaluations</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">When evaluating ROI on business initiatives (such as software development, real estate renovation, or paid digital advertising), remember that simple ROI does not account for the time horizon. A 30% ROI achieved over 6 months represents an annualized rate of 69%, whereas 30% over 5 years is under 6% annually.</p>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">Additionally, standard ROI calculations reflect gross accounting return before corporate tax liabilities and working capital constraints. Use these figures as baseline analytical models alongside cash flow projections.</p>

            </div>
          </div>

          <div className="pt-6 border-t border-slate-200/60 dark:border-slate-800/60">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">
              Contextual & Related Workflows on Zubware
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => onNavigate('/percentage-calculator')}
                className="text-left p-4 rounded-xl border border-slate-200/70 dark:border-slate-800/70 hover:border-primary-500 dark:hover:border-primary-500 transition-colors group bg-white/50 dark:bg-slate-900/40"
              >
                <div className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 flex items-center justify-between">
                  <span>Percentage Calculator</span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-primary-500 transition-transform group-hover:translate-x-1" />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Calculate standalone percentage gains and price variances</p>
              </button>
              <button
                type="button"
                onClick={() => onNavigate('/discount-calculator')}
                className="text-left p-4 rounded-xl border border-slate-200/70 dark:border-slate-800/70 hover:border-primary-500 dark:hover:border-primary-500 transition-colors group bg-white/50 dark:bg-slate-900/40"
              >
                <div className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 flex items-center justify-between">
                  <span>Discount Calculator</span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-primary-500 transition-transform group-hover:translate-x-1" />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Test retail markdown impacts on gross profit margins</p>
              </button>
            </div>
          </div>
        </section>
      );
    case 'compound-interest-calculator':
      return (
        <section className="mt-12 glass-panel p-6 sm:p-10 rounded-3xl space-y-8 border border-slate-200/80 dark:border-slate-800/80">
          <div className="border-b border-slate-200/60 dark:border-slate-800/60 pb-5">
            <span className="text-xs font-bold uppercase tracking-widest text-primary-600 dark:text-primary-400">
              Wealth Accumulation & Geometric Returns
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              Compound Interest & CAGR Calculator: Long-Term Growth & Annualized Returns
            </h2>
            <p className="mt-3 text-base text-slate-600 dark:text-slate-300 max-w-4xl leading-relaxed">
              Zubware Compound Interest & CAGR Calculator models exponential wealth accumulation and annualized investment returns. Simulate initial principal with recurring monthly deposits across flexible compounding frequencies, or calculate historical Compound Annual Growth Rates (CAGR).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card p-6 rounded-2xl space-y-3 border border-slate-200/60 dark:border-slate-800/60">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Compound Interest Simulation</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Simulate long-term investing: A = P*(1 + r/n)^(n*t) with recurring monthly contributions and flexible compounding frequencies.</p>
              <ul className="text-xs space-y-1.5 text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Daily, Monthly, Quarterly, or Annual compounding</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Recurring monthly contribution support</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Total principal vs interest breakdown</li>
              </ul>
            </div>
            <div className="glass-card p-6 rounded-2xl space-y-3 border border-slate-200/60 dark:border-slate-800/60">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Compound Annual Growth Rate (CAGR)</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Calculate smoothed annualized returns over multi-year periods: CAGR = ((Ending Value / Starting Value)^(1 / Years)) - 1.</p>
              <ul className="text-xs space-y-1.5 text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Evaluates true geometric return</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Smooths out volatile market years</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Ideal for mutual funds, stocks, and real estate</li>
              </ul>
            </div>
            <div className="glass-card p-6 rounded-2xl space-y-3 border border-slate-200/60 dark:border-slate-800/60">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Year-by-Year Growth Table</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Review the annual breakdown tracking total invested capital, annual interest credited, and compounding exponential growth.</p>
              <ul className="text-xs space-y-1.5 text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Clear visual timeline</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> One-click clipboard export</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> 100% private in-browser computation</li>
              </ul>
            </div>
          </div>

          <div className="space-y-6 pt-2">
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">The Mechanics of Compound Interest: Why Time Beats Timing</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">Simple interest grows linearly by computing returns solely on the initial principal. Compound interest grows exponentially because returns are credited back to the principal, generating "interest on interest" in subsequent cycles. Over horizons of 10, 20, or 30 years, compounding interest rapidly outpaces the original principal invested.</p>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">More frequent compounding (such as monthly or daily) credits gains sooner, increasing the active base. For example, $10,000 at 8% compounded annually yields $46,610 over 20 years; compounded monthly, it yields $49,268.</p>
              <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 text-amber-900 dark:text-amber-200 text-sm">
                <strong className="block font-semibold mb-1">The Rule of 72: Mental Math for Investment Doubling</strong>
                The Rule of 72 provides a quick approximation for how long it takes an investment to double at a constant compound return: Years to Double ≈ 72 / Annual Interest Rate. At a 9% return, money doubles in approximately 72 / 9 = 8 years.
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">CAGR vs Arithmetic Average Return: Understanding Volatility Drag</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">A dangerous pitfall in evaluating investment track records is relying on the simple arithmetic average return. If a portfolio gains 50% in Year 1 and loses 50% in Year 2, the arithmetic average is (50 - 50) / 2 = 0%. However, starting with $100, gaining 50% reaches $150, and losing 50% drops the balance to $75—a net 25% loss.</p>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">CAGR reflects the true geometric growth rate: (($75 / $100)^(1/2)) - 1 = -13.4% per year. CAGR accurately accounts for sequence of returns and volatility drag, making it the industry benchmark for mutual funds, index funds, and real estate.</p>

            </div>
          </div>

          <div className="pt-6 border-t border-slate-200/60 dark:border-slate-800/60">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">
              Contextual & Related Workflows on Zubware
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => onNavigate('/emi-calculator')}
                className="text-left p-4 rounded-xl border border-slate-200/70 dark:border-slate-800/70 hover:border-primary-500 dark:hover:border-primary-500 transition-colors group bg-white/50 dark:bg-slate-900/40"
              >
                <div className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 flex items-center justify-between">
                  <span>EMI Calculator</span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-primary-500 transition-transform group-hover:translate-x-1" />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Compare investment growth against debt interest costs</p>
              </button>
              <button
                type="button"
                onClick={() => onNavigate('/roi-calculator')}
                className="text-left p-4 rounded-xl border border-slate-200/70 dark:border-slate-800/70 hover:border-primary-500 dark:hover:border-primary-500 transition-colors group bg-white/50 dark:bg-slate-900/40"
              >
                <div className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 flex items-center justify-between">
                  <span>ROI & Profit Margin Calculator</span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-primary-500 transition-transform group-hover:translate-x-1" />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Evaluate business project returns against financial investments</p>
              </button>
            </div>
          </div>
        </section>
      );
    case 'countdown-calculator':
      return (
        <section className="mt-12 glass-panel p-6 sm:p-10 rounded-3xl space-y-8 border border-slate-200/80 dark:border-slate-800/80">
          <div className="border-b border-slate-200/60 dark:border-slate-800/60 pb-5">
            <span className="text-xs font-bold uppercase tracking-widest text-primary-600 dark:text-primary-400">
              Event & Milestone Time Tracking
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              Countdown Calculator: Exact Days, Hours & Calendar Date Tracking
            </h2>
            <p className="mt-3 text-base text-slate-600 dark:text-slate-300 max-w-4xl leading-relaxed">
              Zubware Countdown Calculator measures exact remaining time until future deadlines, exams, weddings, product launches, and milestones, or calculates elapsed time since past historical events. Breaks down calendar intervals into days, hours, minutes, seconds, and working business days.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card p-6 rounded-2xl space-y-3 border border-slate-200/60 dark:border-slate-800/60">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Precise Millisecond Delta Math</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Computes exact temporal intervals by calculating epoch millisecond offsets between the user system clock and target date.</p>
              <ul className="text-xs space-y-1.5 text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Days, Hours, Minutes, and Seconds breakdown</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Total weeks, total hours, and total days readout</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Working business days calculation</li>
              </ul>
            </div>
            <div className="glass-card p-6 rounded-2xl space-y-3 border border-slate-200/60 dark:border-slate-800/60">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Past & Future Event Support</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Automatically detects whether target dates are upcoming or have already passed, calculating elapsed time for anniversaries.</p>
              <ul className="text-xs space-y-1.5 text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Live real-time ticking display</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Automatic past date milestone mode</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Leap year and DST aware</li>
              </ul>
            </div>
            <div className="glass-card p-6 rounded-2xl space-y-3 border border-slate-200/60 dark:border-slate-800/60">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">100% Private Client-Side Operation</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">All event names and dates exist solely in your active browser session. Zero personal schedules are uploaded or stored.</p>
              <ul className="text-xs space-y-1.5 text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Zero server database storage</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Shareable copy summaries</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Works offline</li>
              </ul>
            </div>
          </div>

          <div className="space-y-6 pt-2">
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Calendar Mathematics: Epoch Offsets, Leap Years & DST</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">Calculating time between dates is deceptively complex due to non-uniform calendar structures: months vary from 28 to 31 days, leap years introduce February 29 every 4 years, and regional Daylight Saving Time (DST) shifts add or subtract 60 minutes twice annually.</p>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">The Zubware Countdown Calculator overcomes these discrepancies by operating directly on Unix epoch timestamps (milliseconds since January 1, 1970 UTC). It computes the absolute time delta and translates it into clean calendar units based on your browser’s localized timezone configuration.</p>
              <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 text-amber-900 dark:text-amber-200 text-sm">
                <strong className="block font-semibold mb-1">Countdown Calculator vs Countdown Timer</strong>
                The Countdown Calculator tracks time until a specific future calendar date and time (e.g., December 31, 2026 at 11:59 PM). In contrast, a Countdown Timer counts down a fixed duration of hours, minutes, and seconds (e.g., a 25-minute study timer).
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Practical Productivity: Business Days & Project Deadlines</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">For corporate project managers, software release engineers, and legal professionals, total calendar days do not reflect actual working time. The tool includes a business days calculation that automatically excludes Saturdays and Sundays.</p>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">Whether counting down to competitive exams (UPSC, NEET, SAT), wedding ceremonies, or product launches, the tool gives teams an actionable sense of urgency.</p>

            </div>
          </div>

          <div className="pt-6 border-t border-slate-200/60 dark:border-slate-800/60">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">
              Contextual & Related Workflows on Zubware
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => onNavigate('/countdown-timer')}
                className="text-left p-4 rounded-xl border border-slate-200/70 dark:border-slate-800/70 hover:border-primary-500 dark:hover:border-primary-500 transition-colors group bg-white/50 dark:bg-slate-900/40"
              >
                <div className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 flex items-center justify-between">
                  <span>Countdown Timer</span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-primary-500 transition-transform group-hover:translate-x-1" />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Set duration timers with audible chimes for focused work</p>
              </button>
              <button
                type="button"
                onClick={() => onNavigate('/online-clock')}
                className="text-left p-4 rounded-xl border border-slate-200/70 dark:border-slate-800/70 hover:border-primary-500 dark:hover:border-primary-500 transition-colors group bg-white/50 dark:bg-slate-900/40"
              >
                <div className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 flex items-center justify-between">
                  <span>Online Clock & World Clock</span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-primary-500 transition-transform group-hover:translate-x-1" />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Verify current local time and global time zones</p>
              </button>
            </div>
          </div>
        </section>
      );
    case 'online-stopwatch':
      return (
        <section className="mt-12 glass-panel p-6 sm:p-10 rounded-3xl space-y-8 border border-slate-200/80 dark:border-slate-800/80">
          <div className="border-b border-slate-200/60 dark:border-slate-800/60 pb-5">
            <span className="text-xs font-bold uppercase tracking-widest text-primary-600 dark:text-primary-400">
              High-Resolution Timing Engine
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              Online Stopwatch: Millisecond Precision, Split Laps & Training Timer
            </h2>
            <p className="mt-3 text-base text-slate-600 dark:text-slate-300 max-w-4xl leading-relaxed">
              Zubware Online Stopwatch delivers high-resolution millisecond precision timing powered by the browser’s performance.now() clock and requestAnimationFrame. Features start, pause, resume, and split lap recording with automated fastest/slowest lap tracking.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card p-6 rounded-2xl space-y-3 border border-slate-200/60 dark:border-slate-800/60">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">High-Resolution performance.now()</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Operates on sub-millisecond hardware timestamps rather than uncalibrated setInterval counters for maximum precision.</p>
              <ul className="text-xs space-y-1.5 text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Hours : Minutes : Seconds . Milliseconds (0.001s)</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Zero timer drift over long durations</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Fluid 60 FPS visual rendering</li>
              </ul>
            </div>
            <div className="glass-card p-6 rounded-2xl space-y-3 border border-slate-200/60 dark:border-slate-800/60">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Split Lap Timing & Benchmarking</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Capture individual lap splits without halting the main timer, automatically highlighting fastest (green) and slowest (red) laps.</p>
              <ul className="text-xs space-y-1.5 text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Individual lap duration tracking</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Cumulative total time elapsed</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> One-click clipboard export of lap tables</li>
              </ul>
            </div>
            <div className="glass-card p-6 rounded-2xl space-y-3 border border-slate-200/60 dark:border-slate-800/60">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Keyboard Shortcuts & Offline Privacy</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Operate the stopwatch hands-free using keyboard controls. Runs 100% client-side with zero network uploads.</p>
              <ul className="text-xs space-y-1.5 text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Spacebar to Start / Pause</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Press L to Record Lap</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Press R to Reset</li>
              </ul>
            </div>
          </div>

          <div className="space-y-6 pt-2">
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Browser Timing Architecture: Why performance.now() Matters</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">Basic web stopwatches often rely on simple JavaScript setInterval(..., 10) loops. However, because JavaScript is single-threaded, garbage collection cycles and UI thread events cause intervals to delay, leading to compounding timer drift over time.</p>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">The Zubware Online Stopwatch calculates elapsed time using performance.now(), which reads monotonically increasing high-resolution hardware timestamps provided by the CPU. Even if the browser tab is placed in the background and throttled by the OS, returning to the tab immediately recalculates the exact true elapsed time.</p>
              <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 text-amber-900 dark:text-amber-200 text-sm">
                <strong className="block font-semibold mb-1">Athletic & Productivity Use vs Scientific Calibration</strong>
                While performance.now() provides sub-millisecond precision, display refresh rates (60Hz–144Hz) and physical human reaction times (150–250ms) represent the primary variance in sports timing. This tool is optimized for athletic training, track splits, rubik’s cube solving, and productivity.
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Split Time vs Lap Time: Understanding Timing Terminology</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">In competitive sports, a "Split Time" represents the cumulative time from the start gun to a specific checkpoint. A "Lap Time" is the discrete duration of the single segment between two checkpoints. The stopwatch displays both metrics simultaneously.</p>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">Reviewing lap consistency helps distance runners and swimmers maintain disciplined pacing rather than exhausting energy in early splits.</p>

            </div>
          </div>

          <div className="pt-6 border-t border-slate-200/60 dark:border-slate-800/60">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">
              Contextual & Related Workflows on Zubware
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => onNavigate('/countdown-timer')}
                className="text-left p-4 rounded-xl border border-slate-200/70 dark:border-slate-800/70 hover:border-primary-500 dark:hover:border-primary-500 transition-colors group bg-white/50 dark:bg-slate-900/40"
              >
                <div className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 flex items-center justify-between">
                  <span>Countdown Timer</span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-primary-500 transition-transform group-hover:translate-x-1" />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Set countdown alarms for interval workouts and study sprints</p>
              </button>
              <button
                type="button"
                onClick={() => onNavigate('/typing-speed-test')}
                className="text-left p-4 rounded-xl border border-slate-200/70 dark:border-slate-800/70 hover:border-primary-500 dark:hover:border-primary-500 transition-colors group bg-white/50 dark:bg-slate-900/40"
              >
                <div className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 flex items-center justify-between">
                  <span>Typing Speed Test</span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-primary-500 transition-transform group-hover:translate-x-1" />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Test your keyboarding speed under timed conditions</p>
              </button>
            </div>
          </div>
        </section>
      );
    case 'countdown-timer':
      return (
        <section className="mt-12 glass-panel p-6 sm:p-10 rounded-3xl space-y-8 border border-slate-200/80 dark:border-slate-800/80">
          <div className="border-b border-slate-200/60 dark:border-slate-800/60 pb-5">
            <span className="text-xs font-bold uppercase tracking-widest text-primary-600 dark:text-primary-400">
              Synthesized Web Audio Alerts
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              Countdown Timer: Online Interval Timer, Audio Chimes & Desktop Alerts
            </h2>
            <p className="mt-3 text-base text-slate-600 dark:text-slate-300 max-w-4xl leading-relaxed">
              Zubware Countdown Timer provides precision duration countdowns with quick presets (including a 25-minute Pomodoro study timer) and custom hour/minute/second configurations. Features local Web Audio API synthesized chime alerts, HTML5 desktop notifications, and fullscreen presentation mode.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card p-6 rounded-2xl space-y-3 border border-slate-200/60 dark:border-slate-800/60">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Web Audio API Chime Synthesis</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Synthesizes clean harmonic bell chimes locally using Web Audio oscillators, guaranteeing reliable audio alarms without external audio files.</p>
              <ul className="text-xs space-y-1.5 text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Pleasant 3-tone chime sequence</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Never fails due to broken audio links</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Works completely offline</li>
              </ul>
            </div>
            <div className="glass-card p-6 rounded-2xl space-y-3 border border-slate-200/60 dark:border-slate-800/60">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">HTML5 Desktop Notifications</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Sends an operating system notification when time expires so you never miss an alert while working in other desktop applications.</p>
              <ul className="text-xs space-y-1.5 text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Background tab notification alert</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> System-level alert banners</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Requires explicit user permission</li>
              </ul>
            </div>
            <div className="glass-card p-6 rounded-2xl space-y-3 border border-slate-200/60 dark:border-slate-800/60">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Study Presets & Fullscreen Mode</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Quick buttons for 1m, 3m, 5m, 10m, 15m, 25m Pomodoro, 30m, and 1 hour, plus fullscreen toggle for classrooms and presentations.</p>
              <ul className="text-xs space-y-1.5 text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Dedicated 25m Pomodoro study preset</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> +1 Minute quick extension button</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Large high-contrast display</li>
              </ul>
            </div>
          </div>

          <div className="space-y-6 pt-2">
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Audio Synthesis via Web Audio API: Reliable Offline Sound</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">Many online timers load sound effects from third-party MP3 files. If the network drops, the CDN is blocked by ad filters, or the browser blocks cross-origin media, the alarm fails silently. Zubware Countdown Timer generates its audio alert procedurally using the browser’s native Web Audio API.</p>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">When time reaches zero, the tool constructs an AudioContext, connects oscillator nodes, and synthesizes a soothing three-tone chime (sine wave frequencies at 587Hz, 880Hz, and 1174Hz) with smooth exponential gain decay. It functions reliably offline with zero media dependencies.</p>
              <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 text-amber-900 dark:text-amber-200 text-sm">
                <strong className="block font-semibold mb-1">The Pomodoro Technique for Cognitive Focus</strong>
                Developed by Francesco Cirillo, the Pomodoro Technique uses 25-minute focused work sprints followed by 5-minute restorative breaks. The timer includes dedicated 25m and 5m buttons to streamline Pomodoro study sessions without distraction.
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Managing Browser Background Tab Throttling</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">Modern desktop and mobile browsers aggressively throttle JavaScript execution in inactive background tabs to preserve battery. The timer counteracts this by anchoring countdown progress to absolute system wall-clock timestamps rather than naive interval ticks.</p>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">Even if your computer switches to another window, the timer maintains exact second-by-second accuracy and plays its synthesized audio when the deadline is reached.</p>

            </div>
          </div>

          <div className="pt-6 border-t border-slate-200/60 dark:border-slate-800/60">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">
              Contextual & Related Workflows on Zubware
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => onNavigate('/online-stopwatch')}
                className="text-left p-4 rounded-xl border border-slate-200/70 dark:border-slate-800/70 hover:border-primary-500 dark:hover:border-primary-500 transition-colors group bg-white/50 dark:bg-slate-900/40"
              >
                <div className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 flex items-center justify-between">
                  <span>Online Stopwatch</span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-primary-500 transition-transform group-hover:translate-x-1" />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Time lap splits with high-resolution millisecond precision</p>
              </button>
              <button
                type="button"
                onClick={() => onNavigate('/countdown-calculator')}
                className="text-left p-4 rounded-xl border border-slate-200/70 dark:border-slate-800/70 hover:border-primary-500 dark:hover:border-primary-500 transition-colors group bg-white/50 dark:bg-slate-900/40"
              >
                <div className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 flex items-center justify-between">
                  <span>Countdown Calculator</span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-primary-500 transition-transform group-hover:translate-x-1" />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Count down exact calendar days until future events</p>
              </button>
            </div>
          </div>
        </section>
      );
    case 'online-clock':
      return (
        <section className="mt-12 glass-panel p-6 sm:p-10 rounded-3xl space-y-8 border border-slate-200/80 dark:border-slate-800/80">
          <div className="border-b border-slate-200/60 dark:border-slate-800/60 pb-5">
            <span className="text-xs font-bold uppercase tracking-widest text-primary-600 dark:text-primary-400">
              Synchronized International Time
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              Online Clock & World Clock: Accurate Local Time & Global City Clocks
            </h2>
            <p className="mt-3 text-base text-slate-600 dark:text-slate-300 max-w-4xl leading-relaxed">
              Zubware Online Clock & World Clock displays accurate local system time down to the second with 12-hour (AM/PM) and 24-hour military toggles, full date formatting, and local time zone detection. Add multiple global cities to monitor international business hours simultaneously.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card p-6 rounded-2xl space-y-3 border border-slate-200/60 dark:border-slate-800/60">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Accurate Local Clock</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Displays current local time down to the second, synchronized with your operating system’s network time protocol (NTP).</p>
              <ul className="text-xs space-y-1.5 text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> 12-Hour (AM/PM) and 24-Hour Military toggles</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Complete calendar date and day of week</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Local IANA time zone and UTC offset</li>
              </ul>
            </div>
            <div className="glass-card p-6 rounded-2xl space-y-3 border border-slate-200/60 dark:border-slate-800/60">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Synchronized World Clocks</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Add multiple international cities to track global business hubs simultaneously with automated daylight status.</p>
              <ul className="text-xs space-y-1.5 text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> London, New York, Tokyo, Sydney, Mumbai, Dubai</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Visual Day and Night status badges</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Automatic seasonal DST tracking</li>
              </ul>
            </div>
            <div className="glass-card p-6 rounded-2xl space-y-3 border border-slate-200/60 dark:border-slate-800/60">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Zero Latency & Privacy</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Runs entirely client-side using the native Intl.DateTimeFormat API with zero tracking cookies and zero server logging.</p>
              <ul className="text-xs space-y-1.5 text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Zero remote network roundtrips</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Saves city preferences locally</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Aesthetic full-screen desk clock</li>
              </ul>
            </div>
          </div>

          <div className="space-y-6 pt-2">
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Time Standards: UTC, IANA Time Zones & Operating System NTP</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">Global timekeeping is anchored to Coordinated Universal Time (UTC), maintained by atomic clocks worldwide. Local regional times are expressed as positive or negative offsets from UTC. The browser reads your local hardware clock, which operating systems synchronize with internet Network Time Protocol (NTP) servers.</p>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">The World Clock utilizes the international IANA Time Zone Database embedded in modern browsers. Rather than using fixed numerical offsets (which break during seasonal daylight saving shifts), IANA city identifiers (e.g., "America/New_York", "Europe/London") track historical and future DST rules automatically.</p>
              <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 text-amber-900 dark:text-amber-200 text-sm">
                <strong className="block font-semibold mb-1">Daylight Saving Time (DST) Transitions</strong>
                Because different countries transition to Daylight Saving Time on different weekends (e.g. the US changes in early March, while the UK and EU change in late March), fixed-offset clocks display incorrect times for weeks. Our IANA-powered clock handles these transitions seamlessly.
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Global Collaboration & Virtual Desk Clock Display</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">In remote and distributed engineering teams, coordinating across time zones requires quick visual clarity on colleagues’ working hours. The World Clock provides instant day and night status indicators so you know whether teammates in Singapore or San Francisco are awake.</p>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">With its large high-contrast typography, the tool also doubles as a distraction-free digital desk clock to keep open on an auxiliary monitor or tablet.</p>

            </div>
          </div>

          <div className="pt-6 border-t border-slate-200/60 dark:border-slate-800/60">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">
              Contextual & Related Workflows on Zubware
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => onNavigate('/time-zone-converter')}
                className="text-left p-4 rounded-xl border border-slate-200/70 dark:border-slate-800/70 hover:border-primary-500 dark:hover:border-primary-500 transition-colors group bg-white/50 dark:bg-slate-900/40"
              >
                <div className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 flex items-center justify-between">
                  <span>Time Zone Converter</span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-primary-500 transition-transform group-hover:translate-x-1" />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Schedule international meetings and compare overlapping hours</p>
              </button>
              <button
                type="button"
                onClick={() => onNavigate('/countdown-timer')}
                className="text-left p-4 rounded-xl border border-slate-200/70 dark:border-slate-800/70 hover:border-primary-500 dark:hover:border-primary-500 transition-colors group bg-white/50 dark:bg-slate-900/40"
              >
                <div className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 flex items-center justify-between">
                  <span>Countdown Timer</span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-primary-500 transition-transform group-hover:translate-x-1" />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Set duration timers for work sprints and breaks</p>
              </button>
            </div>
          </div>
        </section>
      );
    case 'time-zone-converter':
      return (
        <section className="mt-12 glass-panel p-6 sm:p-10 rounded-3xl space-y-8 border border-slate-200/80 dark:border-slate-800/80">
          <div className="border-b border-slate-200/60 dark:border-slate-800/60 pb-5">
            <span className="text-xs font-bold uppercase tracking-widest text-primary-600 dark:text-primary-400">
              Cross-Border Meeting Scheduling
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              Time Zone Converter: World Meeting Planner & Overlapping Work Hours
            </h2>
            <p className="mt-3 text-base text-slate-600 dark:text-slate-300 max-w-4xl leading-relaxed">
              Zubware Time Zone Converter coordinates cross-border meetings and global schedules using the international IANA time zone database. Compare source times against multiple target cities, account for seasonal Daylight Saving Time shifts, and highlight standard 9-to-5 working hour overlaps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card p-6 rounded-2xl space-y-3 border border-slate-200/60 dark:border-slate-800/60">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Multi-City Synchronized Timeline</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Select an origin date and time to see synchronized local times across multiple global destinations simultaneously.</p>
              <ul className="text-xs space-y-1.5 text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Dynamic source date and hour selector</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Supports non-integer zones (IST +5:30, Nepal +5:45)</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> 12-Hour and 24-Hour toggle</li>
              </ul>
            </div>
            <div className="glass-card p-6 rounded-2xl space-y-3 border border-slate-200/60 dark:border-slate-800/60">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Business Hours Overlap Visualizer</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Visual color badges highlight standard working hours (9:00 AM – 5:00 PM) across all target cities to spot mutual meeting windows.</p>
              <ul className="text-xs space-y-1.5 text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Instant overlap identification</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Daylight / Nighttime indicators</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> International date line day indicator (+1/-1 Day)</li>
              </ul>
            </div>
            <div className="glass-card p-6 rounded-2xl space-y-3 border border-slate-200/60 dark:border-slate-800/60">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">One-Click Meeting Invite Export</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Click Copy Times to copy a clear, formatted meeting invitation summary listing local times across all participants.</p>
              <ul className="text-xs space-y-1.5 text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Pre-formatted for email and Slack</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Zero server tracking</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Works completely offline</li>
              </ul>
            </div>
          </div>

          <div className="space-y-6 pt-2">
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">The Challenge of Global Scheduling: Half-Hour Offsets & Date Lines</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">Coordinating meetings across distributed teams is prone to human error when relying on mental math. Several major global regions do not use standard whole-hour UTC offsets: India Standard Time (IST) is UTC+5:30, Nepal is UTC+5:45, and Australian Central Time is UTC+9:30.</p>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">Furthermore, meetings between North America and the Asia-Pacific region frequently cross the International Date Line, meaning an afternoon call on Tuesday in San Francisco is Wednesday morning in Tokyo or Sydney. The converter displays the relative calendar day (+1 Day / -1 Day) to prevent missed appointments.</p>
              <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 text-amber-900 dark:text-amber-200 text-sm">
                <strong className="block font-semibold mb-1">Ambiguous & Nonexistent Times during "Fall Back" and "Spring Forward"</strong>
                During annual spring DST transitions, clocks skip an hour (e.g. 2:00 AM becomes 3:00 AM, making 2:30 AM nonexistent). During autumn fall-back transitions, 1:00 AM to 2:00 AM repeats. The IANA engine resolves these boundary conditions correctly based on the exact calendar date selected.
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Finding the "Golden Overlap" Window</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">For teams spanning London, New York, and Mumbai, finding mutually respectful working hours requires strategic compromise. London (GMT) often acts as the bridge, catching Mumbai in the afternoon and New York in the morning.</p>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">Use the interactive hour slider to find the optimal green window where no participant is required to take calls late at night or before dawn.</p>

            </div>
          </div>

          <div className="pt-6 border-t border-slate-200/60 dark:border-slate-800/60">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">
              Contextual & Related Workflows on Zubware
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => onNavigate('/online-clock')}
                className="text-left p-4 rounded-xl border border-slate-200/70 dark:border-slate-800/70 hover:border-primary-500 dark:hover:border-primary-500 transition-colors group bg-white/50 dark:bg-slate-900/40"
              >
                <div className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 flex items-center justify-between">
                  <span>Online Clock & World Clock</span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-primary-500 transition-transform group-hover:translate-x-1" />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Monitor live current times across global cities</p>
              </button>
              <button
                type="button"
                onClick={() => onNavigate('/countdown-calculator')}
                className="text-left p-4 rounded-xl border border-slate-200/70 dark:border-slate-800/70 hover:border-primary-500 dark:hover:border-primary-500 transition-colors group bg-white/50 dark:bg-slate-900/40"
              >
                <div className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 flex items-center justify-between">
                  <span>Countdown Calculator</span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-primary-500 transition-transform group-hover:translate-x-1" />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Track time remaining until global webinar and launch dates</p>
              </button>
            </div>
          </div>
        </section>
      );
    case 'cement-calculator':
      return (
        <section className="mt-12 glass-panel p-6 sm:p-10 rounded-3xl space-y-8 border border-slate-200/80 dark:border-slate-800/80">
          <div className="border-b border-slate-200/60 dark:border-slate-800/60 pb-5">
            <span className="text-xs font-bold uppercase tracking-widest text-primary-600 dark:text-primary-400">
              Civil Construction & Mix Design
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              Cement Concrete Calculator: Slab Volumes, Bags, Sand & Gravel Batches
            </h2>
            <p className="mt-3 text-base text-slate-600 dark:text-slate-300 max-w-4xl leading-relaxed">
              Zubware Cement Concrete Calculator estimates volumetric concrete requirements and raw material batches for slabs, footings, retaining walls, and columns. Supports Metric and Imperial units, standard nominal mix ratios (M15, M20, M25), dry volume void coefficients (1.54 factor), and wastage contingency buffers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card p-6 rounded-2xl space-y-3 border border-slate-200/60 dark:border-slate-800/60">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Metric & Imperial Dimensional Support</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Input dimensions in feet, inches, and cubic yards, or meters, centimeters, and cubic meters for international construction.</p>
              <ul className="text-xs space-y-1.5 text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Slabs, patios, footings, and walls</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Automatic unit conversion</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Custom wastage allowance (default 10%)</li>
              </ul>
            </div>
            <div className="glass-card p-6 rounded-2xl space-y-3 border border-slate-200/60 dark:border-slate-800/60">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Nominal Mix Ratios (M15, M20, M25)</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Evaluates standard volumetric mix ratios (Cement : Sand : Gravel) based on civil engineering specifications.</p>
              <ul className="text-xs space-y-1.5 text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> M15 (1:2:4) for non-structural slabs</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> M20 (1:1.5:3) for standard reinforced concrete</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> M25 (1:1:2) for heavy structural elements</li>
              </ul>
            </div>
            <div className="glass-card p-6 rounded-2xl space-y-3 border border-slate-200/60 dark:border-slate-800/60">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Detailed Material Batching Breakdown</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Calculates the exact number of 50kg cement bags (or 80lb/60lb premix bags), sand volume, and coarse gravel aggregate.</p>
              <ul className="text-xs space-y-1.5 text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> 50kg cement bag counts</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Sand volume in cubic feet & tonnes</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Gravel aggregate volume & tonnes</li>
              </ul>
            </div>
          </div>

          <div className="space-y-6 pt-2">
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">The 1.54 Dry Volume Factor: Why Wet Volume is Insufficient</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">A fundamental principle of concrete technology is that dry ingredients occupy significantly more volume than the final poured wet concrete. When water is added to dry cement, sand, and coarse aggregate, fine cement and sand particles fill the interstitial voids between the larger stones.</p>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">This causes a volumetric shrinkage of roughly 30% to 35%. To produce 1.0 cubic meter of wet, compacted concrete, civil engineers apply a standard dry volume factor of 1.54 (requiring 1.54 m³ of dry materials). Failing to account for this void shrinkage results in ordering 30% less cement and aggregate than needed on site.</p>
              <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 text-amber-900 dark:text-amber-200 text-sm">
                <strong className="block font-semibold mb-1">Wastage Allowance & Subgrade Imperfections</strong>
                Excavated soil is rarely laser-flat, formwork bows slightly under wet concrete pressure, and material remains in wheelbarrows or pumps. Always maintain a 5% to 10% wastage allowance. Running out of concrete mid-pour creates weak cold joints that compromise structural integrity.
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Water-Cement Ratio and Structural Strength Realities</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">The compressive strength of concrete is heavily dictated by the water-to-cement (w/c) ratio. A ratio of 0.45 to 0.50 by weight is optimal for structural concrete. Adding excessive water on site makes concrete easier to rake and finish, but severely lowers cured compressive strength, increases shrinkage cracks, and causes surface dusting.</p>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">Calculator outputs provide material estimation guidance for budgeting and procurement. Commercial high-rise structures, bridges, and foundation pilings require certified laboratory mix designs and slump tests.</p>

            </div>
          </div>

          <div className="pt-6 border-t border-slate-200/60 dark:border-slate-800/60">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">
              Contextual & Related Workflows on Zubware
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => onNavigate('/unit-converter')}
                className="text-left p-4 rounded-xl border border-slate-200/70 dark:border-slate-800/70 hover:border-primary-500 dark:hover:border-primary-500 transition-colors group bg-white/50 dark:bg-slate-900/40"
              >
                <div className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 flex items-center justify-between">
                  <span>Unit Converter</span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-primary-500 transition-transform group-hover:translate-x-1" />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Convert dimensional units between meters, feet, and yards</p>
              </button>
              <button
                type="button"
                onClick={() => onNavigate('/percentage-calculator')}
                className="text-left p-4 rounded-xl border border-slate-200/70 dark:border-slate-800/70 hover:border-primary-500 dark:hover:border-primary-500 transition-colors group bg-white/50 dark:bg-slate-900/40"
              >
                <div className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 flex items-center justify-between">
                  <span>Percentage Calculator</span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-primary-500 transition-transform group-hover:translate-x-1" />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Calculate custom wastage allowances and material cost markups</p>
              </button>
            </div>
          </div>
        </section>
      );
    case 'random-letter-generator':
      return (
        <section className="mt-12 glass-panel p-6 sm:p-10 rounded-3xl space-y-8 border border-slate-200/80 dark:border-slate-800/80">
          <div className="border-b border-slate-200/60 dark:border-slate-800/60 pb-5">
            <span className="text-xs font-bold uppercase tracking-widest text-primary-600 dark:text-primary-400">
              Educational & Creative Randomization
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              Random Letter Generator: Alphabet Picker, Phonics & Word Games
            </h2>
            <p className="mt-3 text-base text-slate-600 dark:text-slate-300 max-w-4xl leading-relaxed">
              Zubware Random Letter Generator draws randomized letters from the English alphabet for word games, classroom phonics, vocabulary drills, and creative prompts. Configure uppercase, lowercase, or mixed casing, filter by vowels or consonants, control duplicate sampling, and choose custom delimiters.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card p-6 rounded-2xl space-y-3 border border-slate-200/60 dark:border-slate-800/60">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Custom Alphabet Subsets & Filters</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Filter candidate letters to suit specific classroom or gaming needs with instant uniform random sampling.</p>
              <ul className="text-xs space-y-1.5 text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> All 26 English letters (A–Z)</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Vowels only (A, E, I, O, U)</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Consonants only (21 letters)</li>
              </ul>
            </div>
            <div className="glass-card p-6 rounded-2xl space-y-3 border border-slate-200/60 dark:border-slate-800/60">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Sampling With or Without Replacement</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Toggle duplicate letters on or off. Sampling without replacement ensures each letter appears at most once per draw.</p>
              <ul className="text-xs space-y-1.5 text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Generate 1 to 100 letters with duplicates</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Draw up to 26 unique non-repeating letters</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Case control: Uppercase, Lowercase, Mixed</li>
              </ul>
            </div>
            <div className="glass-card p-6 rounded-2xl space-y-3 border border-slate-200/60 dark:border-slate-800/60">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Flexible Output Formatting</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Separate generated letters with spaces, commas, new lines (one per line), or no delimiter for anagram generation.</p>
              <ul className="text-xs space-y-1.5 text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> One-click clipboard copying</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Instant re-roll button</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> 100% private client-side math</li>
              </ul>
            </div>
          </div>

          <div className="space-y-6 pt-2">
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Uniform Distribution vs Scrabble / English Frequency Weighting</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">In natural English prose, letters do not occur with equal probability: "E" accounts for roughly 12.7% of all letters, while "Z" accounts for only 0.07%. Board games like Scrabble balance their tile bags based on these linguistic frequencies.</p>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">This generator utilizes an unweighted uniform random distribution where every letter in the chosen pool has an identical 1/26 (or 1/5 for vowels) mathematical probability of being selected. This makes it ideal for fair classroom turns, random student initials, Scattergories letter selection, and impartial word challenges.</p>
              <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 text-amber-900 dark:text-amber-200 text-sm">
                <strong className="block font-semibold mb-1">Educational Phonics & Creative Writing Exercises</strong>
                Teachers frequently use vowel-only or consonant-only draws for early childhood phonics drills and CVC (Consonant-Vowel-Consonant) word formation exercises. Creative writers use 3-letter prompts to inspire acronyms or character naming.
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Pseudorandom vs Cryptographic Randomness Context</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">The Random Letter Generator utilizes JavaScript’s standard Math.random() algorithm, which is optimized for fast execution in games, education, and UI simulations.</p>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">Because Math.random() is a pseudorandom number generator (PRNG) rather than a cryptographically secure PRNG, it should not be used to generate cryptographic keys, encryption nonces, or secure passphrases. For security-sensitive use cases, use our dedicated Passphrase Generator.</p>

            </div>
          </div>

          <div className="pt-6 border-t border-slate-200/60 dark:border-slate-800/60">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">
              Contextual & Related Workflows on Zubware
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => onNavigate('/typing-speed-test')}
                className="text-left p-4 rounded-xl border border-slate-200/70 dark:border-slate-800/70 hover:border-primary-500 dark:hover:border-primary-500 transition-colors group bg-white/50 dark:bg-slate-900/40"
              >
                <div className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 flex items-center justify-between">
                  <span>Typing Speed Test</span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-primary-500 transition-transform group-hover:translate-x-1" />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Practice typing random character sequences and word passages</p>
              </button>
              <button
                type="button"
                onClick={() => onNavigate('/passphrase-generator')}
                className="text-left p-4 rounded-xl border border-slate-200/70 dark:border-slate-800/70 hover:border-primary-500 dark:hover:border-primary-500 transition-colors group bg-white/50 dark:bg-slate-900/40"
              >
                <div className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 flex items-center justify-between">
                  <span>Memorable Passphrase Generator</span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-primary-500 transition-transform group-hover:translate-x-1" />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Generate cryptographically secure multi-word passwords</p>
              </button>
            </div>
          </div>
        </section>
      );
    case 'qr-code-safety-checker':
      return (
        <section className="mt-12 glass-panel p-6 sm:p-10 rounded-3xl space-y-8 border border-slate-200/80 dark:border-slate-800/80">
          <div className="border-b border-slate-200/60 dark:border-slate-800/60 pb-5">
            <span className="text-xs font-bold uppercase tracking-widest text-primary-600 dark:text-primary-400">
              Quishing & Threat Detection
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              QR Code Safety Checker: Inspect Malicious Links, Phishing & QR Sandbox
            </h2>
            <p className="mt-3 text-base text-slate-600 dark:text-slate-300 max-w-4xl leading-relaxed">
              Zubware QR Code Safety Checker inspects QR code payloads safely inside an isolated browser sandbox before you open links. Decode QR codes via image upload, device camera, or text input, and evaluate structural security flags including insecure protocols, IP hostnames, URL shorteners, and credential phishing indicators.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card p-6 rounded-2xl space-y-3 border border-slate-200/60 dark:border-slate-800/60">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Sandboxed Client-Side Decoding</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Decodes QR barcodes in isolated browser memory using jsQR without triggering web navigation or executing malicious scripts.</p>
              <ul className="text-xs space-y-1.5 text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Upload image file (PNG, JPG, WebP)</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Scan live via device camera</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Paste decoded URL / raw payload text</li>
              </ul>
            </div>
            <div className="glass-card p-6 rounded-2xl space-y-3 border border-slate-200/60 dark:border-slate-800/60">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Heuristic Threat Analysis</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Scans for deceptive structural patterns frequently employed in Quishing (QR code phishing) attacks.</p>
              <ul className="text-xs space-y-1.5 text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Insecure HTTP protocol warnings</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Flag non-HTTP schemes (javascript:, data:, tel:)</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Raw IP address and dynamic DNS detection</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Known URL shortener obfuscation warnings</li>
              </ul>
            </div>
            <div className="glass-card p-6 rounded-2xl space-y-3 border border-slate-200/60 dark:border-slate-800/60">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Zero Cloud Data Transmission</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">All image decoding and URL pattern evaluations execute 100% locally in your device memory. Scanned codes are never uploaded.</p>
              <ul className="text-xs space-y-1.5 text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Zero telemetry logging</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Protects private Wi-Fi and vCard data</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Independent educational safety tool</li>
              </ul>
            </div>
          </div>

          <div className="space-y-6 pt-2">
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">The Rise of "Quishing" (QR Phishing) Attacks</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">Because QR codes are graphical pixel patterns that cannot be read by human eyes, attackers exploit them to bypass email security gateways and deceive users in public spaces. In a "Quishing" attack, malicious actors paste rogue QR stickers over parking meters, restaurant menus, or send phishing emails disguised as HR multi-factor authentication setup prompts.</p>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">When scanned directly with a smartphone camera, the device navigates immediately to the attacker’s landing page. The Zubware QR Code Safety Checker acts as a protective buffer, decoding the barcode and displaying the full destination domain, URL parameters, and potential risks before your browser ever communicates with the server.</p>
              <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 text-amber-900 dark:text-amber-200 text-sm">
                <strong className="block font-semibold mb-1">Structural Heuristic Checks vs Cloud Reputation Databases</strong>
                This tool performs comprehensive structural pattern checks (suspicious TLDs, IP hostnames, shortener redirects, sensitive query parameters) locally to preserve your complete privacy. It does not query external reputation databases and cannot provide an absolute guarantee that a clean-looking URL is safe.
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Safe QR Code Scanning Hygiene in Public Spaces</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">Always inspect physical QR stickers before scanning: check if a sticker has been pasted over the original signage. Verify the domain in the address bar carefully, watching for homograph attacks or misspelled brand domains.</p>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">Never scan a QR code that requests immediate entry of sensitive credentials (bank logins, Apple ID, Google accounts) unless you initiated the request directly on that device.</p>

            </div>
          </div>

          <div className="pt-6 border-t border-slate-200/60 dark:border-slate-800/60">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">
              Contextual & Related Workflows on Zubware
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => onNavigate('/qr-business-card-generator')}
                className="text-left p-4 rounded-xl border border-slate-200/70 dark:border-slate-800/70 hover:border-primary-500 dark:hover:border-primary-500 transition-colors group bg-white/50 dark:bg-slate-900/40"
              >
                <div className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 flex items-center justify-between">
                  <span>QR Business Card Generator</span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-primary-500 transition-transform group-hover:translate-x-1" />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Create clean, verifiable vCard QR codes for networking</p>
              </button>
              <button
                type="button"
                onClick={() => onNavigate('/password-strength-checker')}
                className="text-left p-4 rounded-xl border border-slate-200/70 dark:border-slate-800/70 hover:border-primary-500 dark:hover:border-primary-500 transition-colors group bg-white/50 dark:bg-slate-900/40"
              >
                <div className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 flex items-center justify-between">
                  <span>Password Strength Checker</span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-primary-500 transition-transform group-hover:translate-x-1" />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Audit password security and protect against credential theft</p>
              </button>
            </div>
          </div>
        </section>
      );
    case 'typing-speed-test':
      return (
        <section className="mt-12 glass-panel p-6 sm:p-10 rounded-3xl space-y-8 border border-slate-200/80 dark:border-slate-800/80">
          <div className="border-b border-slate-200/60 dark:border-slate-800/60 pb-5">
            <span className="text-xs font-bold uppercase tracking-widest text-primary-600 dark:text-primary-400">
              Keyboarding Assessment Engine
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              Typing Speed Test: Measure Words Per Minute (WPM), CPM & Accuracy
            </h2>
            <p className="mt-3 text-base text-slate-600 dark:text-slate-300 max-w-4xl leading-relaxed">
              Zubware Typing Speed Test evaluates keyboarding proficiency across 15, 30, and 60-second typing assessments. Calculates Net WPM, Gross WPM, percentage accuracy, and error counts using standardized 5-character word metrics with live visual feedback and multiple practice passages.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card p-6 rounded-2xl space-y-3 border border-slate-200/60 dark:border-slate-800/60">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Standardized Net WPM Formula</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Evaluates speed using international 5-keystroke word standards: Net WPM = ((Total Typed Characters / 5) - Uncorrected Errors) / Minutes.</p>
              <ul className="text-xs space-y-1.5 text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Standard 5-character word normalization</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Penalizes uncorrected typographical errors</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Gross WPM raw keystroke tracking</li>
              </ul>
            </div>
            <div className="glass-card p-6 rounded-2xl space-y-3 border border-slate-200/60 dark:border-slate-800/60">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">15s, 30s & 60s Timed Durations</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Select quick sprint drills or formal 1-minute assessments with automatic timer activation upon your first keystroke.</p>
              <ul className="text-xs space-y-1.5 text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Real-time character color-coding (green/red)</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Multiple diverse literature passages</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Immediate score card summary</li>
              </ul>
            </div>
            <div className="glass-card p-6 rounded-2xl space-y-3 border border-slate-200/60 dark:border-slate-800/60">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">100% Client-Side Privacy</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Keystroke timing, error calculations, and performance scores run locally in browser memory without recording or logging user text.</p>
              <ul className="text-xs space-y-1.5 text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Zero keystroke logging</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> No account registration required</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> One-click score copying</li>
              </ul>
            </div>
          </div>

          <div className="space-y-6 pt-2">
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">The Standardization of WPM: Why 5 Characters Equal One Word</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">Because natural words vary wildly in length ("a" vs "characterization"), typing tests cannot simply count space-delimited words. Under standardized typing metrics established in professional secretarial and transcription testing, one "word" is defined as exactly 5 keystrokes (including letters, punctuation, and spaces).</p>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">Gross WPM measures raw motor speed: (All Characters / 5) / Time in Minutes. Net WPM subtracts uncorrected errors to reflect true usable productivity: ((All Characters / 5) - Errors) / Time. A typist typing 80 Gross WPM with 10 uncorrected errors in one minute achieves a Net WPM of 70.</p>
              <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 text-amber-900 dark:text-amber-200 text-sm">
                <strong className="block font-semibold mb-1">Global Typing Speed Benchmarks</strong>
                The average worldwide typing speed is approximately 40 WPM. Professional knowledge workers typically type 50–65 WPM. Speeds above 75 WPM are considered fast, and speeds above 90 WPM place typists in the top 5% of keyboard operators.
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Ergonomics & Touch Typing Habits for Maximum Speed</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">To increase typing speed sustainably, focus on proper home-row finger placement (ASDF JKL;) and avoid "hunting and pecking" with two fingers. Resist the urge to look down at the keyboard; developing spatial muscle memory allows your brain to process whole words rather than individual letters.</p>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">Maintain ergonomic posture: keep wrists elevated and unbent, elbows at 90 degrees, and practice in short, consistent 5-minute daily intervals to prevent repetitive strain injuries (RSI).</p>

            </div>
          </div>

          <div className="pt-6 border-t border-slate-200/60 dark:border-slate-800/60">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">
              Contextual & Related Workflows on Zubware
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => onNavigate('/online-stopwatch')}
                className="text-left p-4 rounded-xl border border-slate-200/70 dark:border-slate-800/70 hover:border-primary-500 dark:hover:border-primary-500 transition-colors group bg-white/50 dark:bg-slate-900/40"
              >
                <div className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 flex items-center justify-between">
                  <span>Online Stopwatch</span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-primary-500 transition-transform group-hover:translate-x-1" />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Track interval training and millisecond task duration</p>
              </button>
              <button
                type="button"
                onClick={() => onNavigate('/random-letter-generator')}
                className="text-left p-4 rounded-xl border border-slate-200/70 dark:border-slate-800/70 hover:border-primary-500 dark:hover:border-primary-500 transition-colors group bg-white/50 dark:bg-slate-900/40"
              >
                <div className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 flex items-center justify-between">
                  <span>Random Letter Generator</span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-primary-500 transition-transform group-hover:translate-x-1" />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Practice typing random alphabet letter drills</p>
              </button>
            </div>
          </div>
        </section>
      );
    case 'file-checksum-verifier':
      return (
        <section className="mt-12 glass-panel p-6 sm:p-10 rounded-3xl space-y-8 border border-slate-200/80 dark:border-slate-800/80">
          <div className="border-b border-slate-200/60 dark:border-slate-800/60 pb-5">
            <span className="text-xs font-bold uppercase tracking-widest text-primary-600 dark:text-primary-400">
              Web Crypto Cryptographic Hashing
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              File Checksum Verifier: Verify SHA-256, SHA-512, SHA-1 & MD5 Hashes
            </h2>
            <p className="mt-3 text-base text-slate-600 dark:text-slate-300 max-w-4xl leading-relaxed">
              Zubware File Checksum Verifier validates file integrity and verifies software downloads against published hashes using the browser’s native Web Crypto API. Calculate SHA-256, SHA-512, SHA-1, and MD5 digests for large installers and disk images directly in browser RAM without uploading a single byte to external servers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card p-6 rounded-2xl space-y-3 border border-slate-200/60 dark:border-slate-800/60">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Native Web Crypto API Hashing</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Computes cryptographic digests using browser hardware-accelerated crypto.subtle.digest for fast, secure in-memory execution.</p>
              <ul className="text-xs space-y-1.5 text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> SHA-256 (Industry standard)</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> SHA-512 (High security)</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> SHA-1 & MD5 (Legacy validation)</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Chunked FileReader memory streaming</li>
              </ul>
            </div>
            <div className="glass-card p-6 rounded-2xl space-y-3 border border-slate-200/60 dark:border-slate-800/60">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Automated Match Comparison</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Paste the official hash published by the software developer to perform an instant case-insensitive byte match evaluation.</p>
              <ul className="text-xs space-y-1.5 text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Green badge: Exact Match (File is intact)</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Red badge: Hash Mismatch (Corrupted or altered)</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> One-click copy calculated hash</li>
              </ul>
            </div>
            <div className="glass-card p-6 rounded-2xl space-y-3 border border-slate-200/60 dark:border-slate-800/60">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Zero Server Uploads (100% Private)</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Your operating system installers, firmware ROMs, disk ISOs, and sensitive documents are hashed completely offline on your computer.</p>
              <ul className="text-xs space-y-1.5 text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Supports multi-gigabyte files</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> No server bandwidth queues</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Complete corporate data confidentiality</li>
              </ul>
            </div>
          </div>

          <div className="space-y-6 pt-2">
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">How Cryptographic Checksums Work: The Avalanche Effect</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">A cryptographic hash function is a one-way mathematical algorithm that transforms an arbitrary stream of binary data into a unique, fixed-length hexadecimal string (digest). For SHA-256, the digest is always exactly 256 bits (64 hexadecimal characters), whether hashing a 5-word text file or a 10-gigabyte operating system image.</p>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">Cryptographic hash functions exhibit the "avalanche effect": if even a single bit of the file is flipped or corrupted during download, the resulting hash changes drastically and unpredictably. This makes checksums the universal standard for verifying that downloaded files have not suffered network packet loss or malicious tampering.</p>
              <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 text-amber-900 dark:text-amber-200 text-sm">
                <strong className="block font-semibold mb-1">Integrity vs Authenticity: What a Checksum Does and Does Not Prove</strong>
                A checksum verifies integrity (that your file exactly matches the author’s file). It does NOT verify inherent safety. If an attacker breaches a vendor’s server and replaces both the installer and the posted checksum, the hash will match. Always obtain checksums over secure HTTPS connections or verified PGP signatures.
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Cryptographic Strength: Why Modern Security Prefers SHA-256 over MD5</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">MD5 (128-bit) and SHA-1 (160-bit) were once standard across computing. However, cryptanalysts have demonstrated practical collision attacks against both algorithms, where two distinct files can be engineered to produce identical hash digests. While MD5 remains useful for detecting accidental corruption on legacy drives, SHA-256 and SHA-512 are mandatory for security-critical verification.</p>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">Renaming a file does not alter its checksum because hashing evaluates only the internal binary content stream, ignoring external filesystem metadata like filename or creation date.</p>

            </div>
          </div>

          <div className="pt-6 border-t border-slate-200/60 dark:border-slate-800/60">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">
              Contextual & Related Workflows on Zubware
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => onNavigate('/text-encrypt-decrypt')}
                className="text-left p-4 rounded-xl border border-slate-200/70 dark:border-slate-800/70 hover:border-primary-500 dark:hover:border-primary-500 transition-colors group bg-white/50 dark:bg-slate-900/40"
              >
                <div className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 flex items-center justify-between">
                  <span>AES Text Encrypt & Decrypt</span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-primary-500 transition-transform group-hover:translate-x-1" />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Encrypt confidential files and text using AES symmetric ciphers</p>
              </button>
              <button
                type="button"
                onClick={() => onNavigate('/password-strength-checker')}
                className="text-left p-4 rounded-xl border border-slate-200/70 dark:border-slate-800/70 hover:border-primary-500 dark:hover:border-primary-500 transition-colors group bg-white/50 dark:bg-slate-900/40"
              >
                <div className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 flex items-center justify-between">
                  <span>Password Strength Checker</span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-primary-500 transition-transform group-hover:translate-x-1" />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Evaluate password entropy and brute-force resistance</p>
              </button>
            </div>
          </div>
        </section>
      );
    case 'passphrase-generator':
      return (
        <section className="mt-12 glass-panel p-6 sm:p-10 rounded-3xl space-y-8 border border-slate-200/80 dark:border-slate-800/80">
          <div className="border-b border-slate-200/60 dark:border-slate-800/60 pb-5">
            <span className="text-xs font-bold uppercase tracking-widest text-primary-600 dark:text-primary-400">
              Diceware CSPRNG Cryptography
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              Memorable Passphrase Generator: High-Entropy Diceware Passwords
            </h2>
            <p className="mt-3 text-base text-slate-600 dark:text-slate-300 max-w-4xl leading-relaxed">
              Zubware Memorable Passphrase Generator creates strong, memorable multi-word passphrases using window.crypto.getRandomValues() CSPRNG entropy and a curated dictionary of clean English words. Customize word counts (3 to 10 words), separators, capitalization, numbers, and symbols while inspecting exact mathematical entropy bits with complete local privacy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card p-6 rounded-2xl space-y-3 border border-slate-200/60 dark:border-slate-800/60">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Cryptographically Secure CSPRNG</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Draws random words using the browser’s cryptographically secure pseudorandom number generator rather than predictable Math.random().</p>
              <ul className="text-xs space-y-1.5 text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> window.crypto.getRandomValues() entropy</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Uniform probability across all word slots</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Zero pattern predictability</li>
              </ul>
            </div>
            <div className="glass-card p-6 rounded-2xl space-y-3 border border-slate-200/60 dark:border-slate-800/60">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Customizable Structure & Separators</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Fine-tune passphrase formatting to balance human typing ease against legacy website complexity requirements.</p>
              <ul className="text-xs space-y-1.5 text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> 3 to 10 words; six-word default</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Hyphen, underscore, space, or period separators</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Capitalization, random number & symbol toggles</li>
              </ul>
            </div>
            <div className="glass-card p-6 rounded-2xl space-y-3 border border-slate-200/60 dark:border-slate-800/60">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Shannon Entropy & Crack-Time Resistance</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">The entropy readout uses the actual wordlist size and independent random choices. It does not predict the speed of a real attack.</p>
              <ul className="text-xs space-y-1.5 text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Exact entropy bits (E = W * log2(N))</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Theoretical search-space estimate, not a cracking-time prediction</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> 100% private in-browser generation</li>
              </ul>
            </div>
          </div>

          <div className="space-y-6 pt-2">
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Choosing Random Words for a Passphrase</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">For decades, computer users were instructed to create passwords like "J#8x!mP$9". These short, complex strings are almost impossible for humans to remember, leading to dangerous habits like writing passwords on sticky notes or reusing them across accounts. Furthermore, at only 8 characters, their total search space is vulnerable to modern GPU brute-force attacks.</p>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">Each word must be selected independently at random. A familiar quotation or published example is predictable, regardless of its length. Use a freshly generated phrase, keep it private, and never reuse a phrase across accounts.</p>
              <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 text-amber-900 dark:text-amber-200 text-sm">
                <strong className="block font-semibold mb-1">Calculating Passphrase Entropy Bits</strong>
                Entropy in bits measures unpredictable randomness. For a wordlist of size N and a passphrase of W words, Entropy = W × log2(N). This tool uses the 7,776-word EFF Long Wordlist. Six independent word choices provide about 77.5 bits before optional random digits or symbols. Fixed capitalization and separators add no entropy.
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Where to Use Passphrases: Master Passwords & Full Disk Encryption</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">Passphrases are the ideal choice for secrets that humans must regularly type into keyboards: your primary Password Manager master password, computer full-disk encryption (BitLocker, FileVault), and smartphone PIN passcodes.</p>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">For individual website accounts, store generated random passwords inside your password manager protected by one ultra-secure memorable master passphrase.</p>

            </div>
          </div>

          <div className="pt-6 border-t border-slate-200/60 dark:border-slate-800/60">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">
              Contextual & Related Workflows on Zubware
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => onNavigate('/password-strength-checker')}
                className="text-left p-4 rounded-xl border border-slate-200/70 dark:border-slate-800/70 hover:border-primary-500 dark:hover:border-primary-500 transition-colors group bg-white/50 dark:bg-slate-900/40"
              >
                <div className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 flex items-center justify-between">
                  <span>Password Strength Checker</span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-primary-500 transition-transform group-hover:translate-x-1" />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Audit your existing passwords for entropy and pattern vulnerabilities</p>
              </button>
              <button
                type="button"
                onClick={() => onNavigate('/text-encrypt-decrypt')}
                className="text-left p-4 rounded-xl border border-slate-200/70 dark:border-slate-800/70 hover:border-primary-500 dark:hover:border-primary-500 transition-colors group bg-white/50 dark:bg-slate-900/40"
              >
                <div className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 flex items-center justify-between">
                  <span>AES Text Encrypt & Decrypt</span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-primary-500 transition-transform group-hover:translate-x-1" />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Encrypt sensitive text notes with your generated master passphrase</p>
              </button>
            </div>
          </div>
        </section>
      );
    case 'password-strength-checker':
      return (
        <section className="mt-12 glass-panel p-6 sm:p-10 rounded-3xl space-y-8 border border-slate-200/80 dark:border-slate-800/80">
          <div className="border-b border-slate-200/60 dark:border-slate-800/60 pb-5">
            <span className="text-xs font-bold uppercase tracking-widest text-primary-600 dark:text-primary-400">
              Client-Side Heuristic & Entropy Audit
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              Password Strength Checker: Entropy Bits & Brute-Force Crack Time
            </h2>
            <p className="mt-3 text-base text-slate-600 dark:text-slate-300 max-w-4xl leading-relaxed">
              Zubware Password Strength Checker evaluates credential security in real-time through client-side heuristic inspection and Shannon entropy analysis. Detect common keyboard sequences, dictionary words, and character pool vulnerabilities, and review estimated brute-force resistance against offline GPU cracking clusters with zero network transmission.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card p-6 rounded-2xl space-y-3 border border-slate-200/60 dark:border-slate-800/60">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Shannon Entropy & Crack Time</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Calculates mathematical information density in bits and estimates offline brute-force cracking resistance against 100B guesses/sec GPU rigs.</p>
              <ul className="text-xs space-y-1.5 text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Information entropy bit score</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Estimated crack time duration</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Visual strength meter (Weak to Strong)</li>
              </ul>
            </div>
            <div className="glass-card p-6 rounded-2xl space-y-3 border border-slate-200/60 dark:border-slate-800/60">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Pattern & Vulnerability Auditing</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Scans for predictable character structures that compromise passwords regardless of their length.</p>
              <ul className="text-xs space-y-1.5 text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Sequential numbers (123456)</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Common keyboard patterns (qwerty, asdf)</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Repeated characters and dictionary stems</li>
              </ul>
            </div>
            <div className="glass-card p-6 rounded-2xl space-y-3 border border-slate-200/60 dark:border-slate-800/60">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">100% Client-Side Privacy Guarantee</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">All password evaluation runs strictly in local browser memory. Passwords are never sent across the internet, logged, or stored.</p>
              <ul className="text-xs space-y-1.5 text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Zero network requests</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Never queries external breach APIs</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Eye icon to toggle visibility</li>
              </ul>
            </div>
          </div>

          <div className="space-y-6 pt-2">
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">How Offline Brute-Force Cracking Works: Beyond Online Rate Limits</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">When logging into a website, online services implement rate limiting (locking accounts after 5 failed attempts). However, in a corporate data breach, attackers steal password hash dumps (e.g. bcrypt, Argon2, or unsalted SHA-256) and attack them offline on specialized GPU cracking clusters capable of generating billions of guesses per second.</p>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">Under offline attack conditions, short passwords of 8 to 10 characters are cracked in minutes or hours through automated dictionary mutations and rainbow tables. Length is the single most effective defense: each additional character exponentially expands the brute-force search space.</p>
              <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 text-amber-900 dark:text-amber-200 text-sm">
                <strong className="block font-semibold mb-1">Why Character Diversity Alone Is Not Enough</strong>
                Many users satisfy complex website rules by taking a simple word and appending "1!" at the end (e.g., "Password1!"). Cracking tools like Hashcat specifically test these common substitution masks first. True security requires length (15+ characters) and unpredictability.
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Actionable Credential Hygiene: The Three Core Rules</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">1. Never reuse passwords: If one service is compromised, automated bots immediately test leaked email/password combinations across thousands of other sites (credential stuffing).</p>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">2. Use a password manager: Generate unique 16+ character random passwords for every website and protect the vault with a strong multi-word passphrase.</p>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">3. Enable Multi-Factor Authentication (MFA): Always turn on hardware security keys (FIDO2/WebAuthn) or authenticator apps (TOTP) to protect critical accounts even if a password is compromised.</p>

            </div>
          </div>

          <div className="pt-6 border-t border-slate-200/60 dark:border-slate-800/60">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">
              Contextual & Related Workflows on Zubware
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => onNavigate('/passphrase-generator')}
                className="text-left p-4 rounded-xl border border-slate-200/70 dark:border-slate-800/70 hover:border-primary-500 dark:hover:border-primary-500 transition-colors group bg-white/50 dark:bg-slate-900/40"
              >
                <div className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 flex items-center justify-between">
                  <span>Memorable Passphrase Generator</span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-primary-500 transition-transform group-hover:translate-x-1" />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Generate strong Diceware passphrases that resist brute-force attacks</p>
              </button>
              <button
                type="button"
                onClick={() => onNavigate('/text-encrypt-decrypt')}
                className="text-left p-4 rounded-xl border border-slate-200/70 dark:border-slate-800/70 hover:border-primary-500 dark:hover:border-primary-500 transition-colors group bg-white/50 dark:bg-slate-900/40"
              >
                <div className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 flex items-center justify-between">
                  <span>AES Text Encrypt & Decrypt</span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-primary-500 transition-transform group-hover:translate-x-1" />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Encrypt sensitive text data using strong master secret keys</p>
              </button>
            </div>
          </div>
        </section>
      );
    case 'text-encrypt-decrypt':
      return (
        <section className="mt-12 glass-panel p-6 sm:p-10 rounded-3xl space-y-8 border border-slate-200/80 dark:border-slate-800/80">
          <div className="border-b border-slate-200/60 dark:border-slate-800/60 pb-5">
            <span className="text-xs font-bold uppercase tracking-widest text-primary-600 dark:text-primary-400">
              AES Symmetric Cryptography
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              AES Text Encrypt & Decrypt: Symmetric Key Cipher & Secure Messaging
            </h2>
            <p className="mt-3 text-base text-slate-600 dark:text-slate-300 max-w-4xl leading-relaxed">
              Zubware AES Text Encrypt & Decrypt provides client-side symmetric-key cryptography to secure confidential notes, messages, and credentials with a private secret key. Transform plaintext into clean Base64-encoded ciphertext or decrypt cipher payloads in local browser memory with zero tracking and zero server storage.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card p-6 rounded-2xl space-y-3 border border-slate-200/60 dark:border-slate-800/60">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Advanced Encryption Standard (AES)</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Uses the global cryptographic benchmark established by NIST and trusted worldwide for commercial banking, government, and military data security.</p>
              <ul className="text-xs space-y-1.5 text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Strong symmetric block cipher</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Base64 ciphertext output for easy sharing</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Error detection on incorrect key or altered cipher</li>
              </ul>
            </div>
            <div className="glass-card p-6 rounded-2xl space-y-3 border border-slate-200/60 dark:border-slate-800/60">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Dual Encrypt & Decrypt Workflow</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Easily toggle between Encrypt mode (plaintext to ciphertext) and Decrypt mode (ciphertext to plaintext) in an intuitive UI.</p>
              <ul className="text-xs space-y-1.5 text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Secret passphrase protection</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Show / hide key toggle</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> One-click clipboard copying and clear buttons</li>
              </ul>
            </div>
            <div className="glass-card p-6 rounded-2xl space-y-3 border border-slate-200/60 dark:border-slate-800/60">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">100% In-Browser Cryptography</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">All key scheduling, byte substitution, and cipher operations execute in your device browser RAM. No secrets touch our servers.</p>
              <ul className="text-xs space-y-1.5 text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Zero server logging or storage</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Works completely offline</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> No unrecoverable cloud keys</li>
              </ul>
            </div>
          </div>

          <div className="space-y-6 pt-2">
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">The Principles of Symmetric Key Cryptography</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">Symmetric-key cryptography utilizes the identical secret key for both encryption and decryption. In Encrypt mode, the AES algorithm divides plaintext into discrete blocks and applies multiple rounds of cryptographic substitution, row shifting, column mixing, and round key addition. The resulting ciphertext is formatted into standard ASCII Base64 text that can be copied into emails or chat messages.</p>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">In Decrypt mode, the inverse mathematical transformations are applied using the identical secret key. If the recipient enters the correct key, the original plaintext is restored. If an incorrect key is provided, or if the ciphertext was tampered with in transit, the algorithm fails safely and produces an error message.</p>
              <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 text-amber-900 dark:text-amber-200 text-sm">
                <strong className="block font-semibold mb-1">Lost Keys Are Mathematically Unrecoverable</strong>
                Because AES is mathematically robust with zero backdoors or administrative recovery mechanisms, lost secret keys cannot be recovered by Zubware or anyone else. Never store encrypted data without safely backing up your private key.
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Out-of-Band Key Exchange & Practical Security Boundaries</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">The fundamental operational security challenge of symmetric encryption is key exchange. You must never send the secret key through the same communication channel used to send the ciphertext (e.g. sending the encrypted message and the password in the same email thread).</p>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">Always share your secret key through an out-of-band channel, such as an encrypted signal voice call, in-person conversation, or secure end-to-end messaging app. This tool is ideal for securing confidential notes, client credentials, and sensitive code snippets.</p>

            </div>
          </div>

          <div className="pt-6 border-t border-slate-200/60 dark:border-slate-800/60">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">
              Contextual & Related Workflows on Zubware
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => onNavigate('/file-checksum-verifier')}
                className="text-left p-4 rounded-xl border border-slate-200/70 dark:border-slate-800/70 hover:border-primary-500 dark:hover:border-primary-500 transition-colors group bg-white/50 dark:bg-slate-900/40"
              >
                <div className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 flex items-center justify-between">
                  <span>File Checksum Verifier</span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-primary-500 transition-transform group-hover:translate-x-1" />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Verify cryptographic integrity of files and software downloads</p>
              </button>
              <button
                type="button"
                onClick={() => onNavigate('/passphrase-generator')}
                className="text-left p-4 rounded-xl border border-slate-200/70 dark:border-slate-800/70 hover:border-primary-500 dark:hover:border-primary-500 transition-colors group bg-white/50 dark:bg-slate-900/40"
              >
                <div className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 flex items-center justify-between">
                  <span>Memorable Passphrase Generator</span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-primary-500 transition-transform group-hover:translate-x-1" />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Generate high-entropy secret passphrases for AES encryption keys</p>
              </button>
            </div>
          </div>
        </section>
      );
    case 'photo-signature-joiner':
      return (
        <section className="mt-12 glass-panel p-6 sm:p-10 rounded-3xl space-y-8 border border-slate-200/80 dark:border-slate-800/80">
          <div className="border-b border-slate-200/60 dark:border-slate-800/60 pb-5">
            <span className="text-xs font-bold uppercase tracking-widest text-primary-600 dark:text-primary-400">
              Exam Portal Image Collation Guide
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              Photo and Signature Joiner Guide: Combine Passport Photo & Signature for Online Forms
            </h2>
            <p className="mt-3 text-base text-slate-600 dark:text-slate-300 max-w-4xl leading-relaxed">
              Some application forms request one image containing both a photo and signature. Upload both images here, select a layout, and export a JPG or PNG in your browser. Read your own form's required dimensions, format, and file size before uploading the result.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card p-6 rounded-2xl space-y-3 border border-slate-200/60 dark:border-slate-800/60">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Palette className="w-5 h-5 text-indigo-500" /> Flexible Layout Configurations
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Choose vertical stacking (photo above signature) or horizontal placement (photo next to signature). Set each image's dimensions and check the output size shown in the preview.
              </p>
              <ul className="text-xs space-y-1.5 text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Configurable photo & signature pixel dimensions</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Adjustable inter-item gap and outer border padding</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Standard white or neutral frame borders</li>
              </ul>
            </div>
            <div className="glass-card p-6 rounded-2xl space-y-3 border border-slate-200/60 dark:border-slate-800/60">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-500" /> Preserves Resolution & Legibility
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                The canvas crops the photo to fill its frame and fits the signature inside its frame without stretching. Enlarging a small source image can reduce sharpness, so inspect the preview before downloading.
              </p>
              <ul className="text-xs space-y-1.5 text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Real-time interactive canvas preview</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> High-fidelity JPEG export for form gateways</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Lossless PNG support for document archives</li>
              </ul>
            </div>
            <div className="glass-card p-6 rounded-2xl space-y-3 border border-slate-200/60 dark:border-slate-800/60">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-500" /> Complete Device Privacy
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Photo and signature composition happens in your browser. The tool does not upload either image to Zubware servers.
              </p>
              <ul className="text-xs space-y-1.5 text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Zero server uploads or cloud archiving</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> No signup or phone number required</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> On shared devices, remove downloaded copies after use</li>
              </ul>
            </div>
          </div>

          <div className="space-y-6 pt-2">
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Check Your Application's Upload Instructions</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Upload rules differ by application. Some ask for two separate files, while others request a combined image. Use this joiner only when your form asks for one file.
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                The 300×460 px example uses a 300×350 px photo, a 300×100 px signature, a 10 px gap, and zero outer padding. Presets are examples, not official specifications. Confirm the resulting pixels and file size against your form.
              </p>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-200/60 dark:border-slate-800/60">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">
              Related Exam Preparation Workflows on Zubware
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => onNavigate('/signature-resizer')}
                className="text-left p-4 rounded-xl border border-slate-200/70 dark:border-slate-800/70 hover:border-primary-500 dark:hover:border-primary-500 transition-colors group bg-white/50 dark:bg-slate-900/40"
              >
                <div className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 flex items-center justify-between">
                  <span>Signature Resizer</span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-primary-500 transition-transform group-hover:translate-x-1" />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Crop margins, scale to exact mm/px, and compress signature images below 20KB</p>
              </button>
              <button
                type="button"
                onClick={() => onNavigate('/passport-photo-maker')}
                className="text-left p-4 rounded-xl border border-slate-200/70 dark:border-slate-800/70 hover:border-primary-500 dark:hover:border-primary-500 transition-colors group bg-white/50 dark:bg-slate-900/40"
              >
                <div className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 flex items-center justify-between">
                  <span>Passport Photo Maker</span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-primary-500 transition-transform group-hover:translate-x-1" />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Create standard 2x2 inch and 35x45 mm passport photos with white background</p>
              </button>
            </div>
          </div>
        </section>
      );
    case 'signature-resizer':
      return (
        <section className="mt-12 glass-panel p-6 sm:p-10 rounded-3xl space-y-8 border border-slate-200/80 dark:border-slate-800/80">
          <div className="border-b border-slate-200/60 dark:border-slate-800/60 pb-5">
            <span className="text-xs font-bold uppercase tracking-widest text-primary-600 dark:text-primary-400">
              Digital Signature Optimization Standards
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              Signature Resizer Guide: Crop, Scale & Compress Digital Signatures for Application Gateways
            </h2>
            <p className="mt-3 text-base text-slate-600 dark:text-slate-300 max-w-4xl leading-relaxed">
              When scanning or photographing a signature on paper, smartphones capture large multi-megabyte images filled with unnecessary background borders, shadows, and skewed aspect ratios. Online exam and job recruitment portals typically restrict signature uploads to strict limits between 10 KB and 20 KB with exact pixel bounds. Zubware Signature Resizer crops margins, standardizes dimensions, and optimizes byte sizes privately in your browser.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card p-6 rounded-2xl space-y-3 border border-slate-200/60 dark:border-slate-800/60">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Palette className="w-5 h-5 text-indigo-500" /> Automatic Margin Cropping
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Scanned signatures on blank paper often have large blank borders around the pen strokes. The auto-crop feature automatically detects bounding contours and removes excess whitespace.
              </p>
              <ul className="text-xs space-y-1.5 text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Focuses solely on pen ink strokes</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Optional pure white or transparent background mode</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Maintains consistent signature aspect ratio</li>
              </ul>
            </div>
            <div className="glass-card p-6 rounded-2xl space-y-3 border border-slate-200/60 dark:border-slate-800/60">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-500" /> Strict Maximum File Size Caps
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Set a strict maximum file size threshold (such as 10 KB, 20 KB, or 50 KB). The engine optimizes compression so the exported file never exceeds the gateway ceiling.
              </p>
              <ul className="text-xs space-y-1.5 text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Dimension inputs in px, cm, mm, and inches</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Real-time output file size badge in KB</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Form-ready JPEG or transparent PNG export</li>
              </ul>
            </div>
            <div className="glass-card p-6 rounded-2xl space-y-3 border border-slate-200/60 dark:border-slate-800/60">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-500" /> Biometric Identity Protection
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Handwritten signatures must never be stored on unknown remote servers or cloud databases. All image processing runs locally in browser RAM, ensuring your signature remains strictly on your device.
              </p>
              <ul className="text-xs space-y-1.5 text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Client-side Canvas image processing</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Zero cloud transmission or server storage</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Instant one-tap download</li>
              </ul>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-200/60 dark:border-slate-800/60">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">
              Related Document & Exam Workflows on Zubware
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => onNavigate('/photo-signature-joiner')}
                className="text-left p-4 rounded-xl border border-slate-200/70 dark:border-slate-800/70 hover:border-primary-500 dark:hover:border-primary-500 transition-colors group bg-white/50 dark:bg-slate-900/40"
              >
                <div className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 flex items-center justify-between">
                  <span>Photo & Signature Joiner</span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-primary-500 transition-transform group-hover:translate-x-1" />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Combine resized signature and passport photo into a single admit card file</p>
              </button>
              <button
                type="button"
                onClick={() => onNavigate('/image-compressor')}
                className="text-left p-4 rounded-xl border border-slate-200/70 dark:border-slate-800/70 hover:border-primary-500 dark:hover:border-primary-500 transition-colors group bg-white/50 dark:bg-slate-900/40"
              >
                <div className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 flex items-center justify-between">
                  <span>Image Compressor</span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-primary-500 transition-transform group-hover:translate-x-1" />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Compress candidate photos to 20KB, 50KB, or 100KB with zero quality distortion</p>
              </button>
            </div>
          </div>
        </section>
      );
    case 'jwt-decoder':
      return (
        <section className="mt-12 glass-panel p-6 sm:p-10 rounded-3xl space-y-8 border border-slate-200/80 dark:border-slate-800/80">
          <div className="border-b border-slate-200/60 dark:border-slate-800/60 pb-5">
            <span className="text-xs font-bold uppercase tracking-widest text-primary-600 dark:text-primary-400">
              Developer Token Security & Debugging Standards
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              JWT Decoder & Security Guide: Inspect Header, Payload Claims & Expiration Timestamps
            </h2>
            <p className="mt-3 text-base text-slate-600 dark:text-slate-300 max-w-4xl leading-relaxed">
              JSON Web Tokens (RFC 7519) are the industry-standard compact format for asserting authentication claims between identity providers and API gateways. When debugging authorization headers or OAuth2 bearer tokens, developers need to inspect claims and expiration timestamps without leaking production credentials to third-party web servers. Zubware JWT Decoder runs 100% locally in your browser memory with zero network transmission.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card p-6 rounded-2xl space-y-3 border border-slate-200/60 dark:border-slate-800/60">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Key className="w-5 h-5 text-indigo-500" /> Header & Algorithm Inspection
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Inspect cryptographic header parameters including the signing algorithm (<code className="text-xs">alg</code>: RS256, HS256, ES256) and token type (<code className="text-xs">typ</code>: JWT) to diagnose algorithm-mismatch vulnerabilities.
              </p>
              <ul className="text-xs space-y-1.5 text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Identifies key ID (<code className="text-xs">kid</code>) for JWKS lookup</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Syntax highlighting for formatted JSON blocks</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> One-click copy for clean debug payloads</li>
              </ul>
            </div>
            <div className="glass-card p-6 rounded-2xl space-y-3 border border-slate-200/60 dark:border-slate-800/60">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-500" /> Expiration & Epoch Calculation
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Standard claims like <code className="text-xs">exp</code> (expiration time), <code className="text-xs">iat</code> (issued at), and <code className="text-xs">nbf</code> (not before) are recorded as Unix epoch seconds. The decoder translates these into human-readable local time and remaining validity duration.
              </p>
              <ul className="text-xs space-y-1.5 text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Visual badge indicating if token is Active or Expired</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Human-readable date and time formatting</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Accurate clock skew and validity diagnosis</li>
              </ul>
            </div>
            <div className="glass-card p-6 rounded-2xl space-y-3 border border-slate-200/60 dark:border-slate-800/60">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-500" /> Zero Network Transmission
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Pasting customer JWTs containing user emails, roles, and session tokens into external web debuggers risks data exposure. Zubware decodes all base64url segments directly in client-side JavaScript.
              </p>
              <ul className="text-xs space-y-1.5 text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> No HTTP POST requests or server-side logging</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Safe for corporate networks and production tokens</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Works completely offline after page load</li>
              </ul>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-200/60 dark:border-slate-800/60">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">
              Related Developer Workflows on Zubware
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => onNavigate('/json-formatter')}
                className="text-left p-4 rounded-xl border border-slate-200/70 dark:border-slate-800/70 hover:border-primary-500 dark:hover:border-primary-500 transition-colors group bg-white/50 dark:bg-slate-900/40"
              >
                <div className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 flex items-center justify-between">
                  <span>JSON Formatter & Validator</span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-primary-500 transition-transform group-hover:translate-x-1" />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Beautify, inspect, and validate nested JSON data structures with clean indentation</p>
              </button>
              <button
                type="button"
                onClick={() => onNavigate('/base64-encoder-decoder')}
                className="text-left p-4 rounded-xl border border-slate-200/70 dark:border-slate-800/70 hover:border-primary-500 dark:hover:border-primary-500 transition-colors group bg-white/50 dark:bg-slate-900/40"
              >
                <div className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 flex items-center justify-between">
                  <span>Base64 Encoder & Decoder</span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-primary-500 transition-transform group-hover:translate-x-1" />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Convert text and binary strings to and from Base64 and Base64URL formats</p>
              </button>
            </div>
          </div>
        </section>
      );
    default:
      return null;
  }
};
