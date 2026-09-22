import React, { useState, useMemo } from 'react';
import { jsPDF } from 'jspdf';
import {
  Download,
  FileText,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Bold,
  Italic,
  ShieldCheck,
  RefreshCw,
  Copy,
  Eye,
  Sliders,
  Type
} from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';

export const TextToPdfTool: React.FC<{ onShowToast: (msg: string) => void }> = ({ onShowToast }) => {
  const { t } = useLanguage();

  const [documentTitle, setDocumentTitle] = useState('My Document');
  const [content, setContent] = useState(
    'Welcome to Zubware Text to PDF Converter.\n\nYou can type or paste any formatted or unformatted text here, configure your typography, margins, and page orientation, and download an official publication-ready PDF.\n\nAll generation is processed 100% locally in your browser with zero server uploads, keeping your documents and sensitive notes private.'
  );

  // Layout parameters
  const [pageSize, setPageSize] = useState<'a4' | 'letter' | 'legal'>('a4');
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [marginPreset, setMarginPreset] = useState<'narrow' | 'normal' | 'wide'>('normal');

  // Typography parameters
  const [fontFamily, setFontFamily] = useState<'helvetica' | 'times' | 'courier'>('helvetica');
  const [fontSize, setFontSize] = useState<number>(12);
  const [lineHeightFactor, setLineHeightFactor] = useState<number>(1.5);
  const [alignment, setAlignment] = useState<'left' | 'center' | 'right' | 'justify'>('left');
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [textColor, setTextColor] = useState('#1e293b');
  const [includePageNumbers, setIncludePageNumbers] = useState(true);

  // Statistics
  const wordCount = useMemo(() => {
    const trimmed = content.trim();
    return trimmed ? trimmed.split(/\s+/).length : 0;
  }, [content]);

  const charCount = content.length;

  const generatePdfInstance = (): jsPDF => {
    const doc = new jsPDF({
      orientation,
      unit: 'pt',
      format: pageSize
    });

    // Determine dimensions
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Margins
    let margin = 36; // normal
    if (marginPreset === 'narrow') margin = 24;
    if (marginPreset === 'wide') margin = 54;

    const printableWidth = pageWidth - (margin * 2);
    const bottomMargin = margin + 20;

    // Convert hex color to RGB
    const hex = textColor.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16) || 0;
    const g = parseInt(hex.substring(2, 4), 16) || 0;
    const b = parseInt(hex.substring(4, 6), 16) || 0;

    let fontStyle: 'normal' | 'bold' | 'italic' | 'bolditalic' = 'normal';
    if (isBold && isItalic) fontStyle = 'bolditalic';
    else if (isBold) fontStyle = 'bold';
    else if (isItalic) fontStyle = 'italic';

    let currentY = margin;

    // Add Document Title if present
    if (documentTitle.trim()) {
      doc.setFont(fontFamily, 'bold');
      doc.setFontSize(fontSize + 8);
      doc.setTextColor(r, g, b);
      doc.text(documentTitle.trim(), margin, currentY + fontSize + 4);
      currentY += (fontSize + 8) * 1.6;

      // Draw subtle separator line
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.8);
      doc.line(margin, currentY, margin + printableWidth, currentY);
      currentY += 16;
    }

    // Set body font
    doc.setFont(fontFamily, fontStyle);
    doc.setFontSize(fontSize);
    doc.setTextColor(r, g, b);

    const lineSpacing = fontSize * lineHeightFactor;

    // Split text into paragraphs and lines
    const paragraphs = content.split('\n');

    for (const paragraph of paragraphs) {
      if (!paragraph.trim()) {
        currentY += lineSpacing * 0.8;
        if (currentY + lineSpacing > pageHeight - bottomMargin) {
          doc.addPage(pageSize, orientation);
          currentY = margin;
        }
        continue;
      }

      const lines = doc.splitTextToSize(paragraph, printableWidth);

      for (const line of lines) {
        if (currentY + lineSpacing > pageHeight - bottomMargin) {
          doc.addPage(pageSize, orientation);
          currentY = margin;
          doc.setFont(fontFamily, fontStyle);
          doc.setFontSize(fontSize);
          doc.setTextColor(r, g, b);
        }

        let lineX = margin;
        if (alignment === 'center') {
          const textWidth = doc.getTextWidth(line);
          lineX = margin + (printableWidth - textWidth) / 2;
        } else if (alignment === 'right') {
          const textWidth = doc.getTextWidth(line);
          lineX = margin + (printableWidth - textWidth);
        }

        doc.text(line, lineX, currentY + fontSize);
        currentY += lineSpacing;
      }
      // Small gap between paragraphs
      currentY += lineSpacing * 0.3;
    }

    // Add page numbers
    if (includePageNumbers) {
      const totalPages = doc.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFont(fontFamily, 'normal');
        doc.setFontSize(9);
        doc.setTextColor(130, 140, 150);
        const footerText = `Page ${i} of ${totalPages}`;
        const footerWidth = doc.getTextWidth(footerText);
        doc.text(footerText, (pageWidth - footerWidth) / 2, pageHeight - 16);
      }
    }

    return doc;
  };

  const handleDownloadPdf = () => {
    try {
      const doc = generatePdfInstance();
      const safeTitle = (documentTitle.trim() || 'document').replace(/[^a-z0-9_-]/gi, '_').toLowerCase();
      doc.save(`${safeTitle}.pdf`);
      onShowToast('PDF generated and downloaded!');
    } catch (err) {
      console.error('Text to PDF error:', err);
      onShowToast('Failed to generate PDF document.');
    }
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(content);
    onShowToast('Content copied to clipboard.');
  };

  const handleClear = () => {
    setContent('');
    setDocumentTitle('');
    onShowToast('Cleared editor.');
  };

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Privacy Notice */}
      <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs font-semibold border border-emerald-200/60 dark:border-emerald-800/40">
        <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
        <span>Files are processed locally in your browser and are not uploaded to Zubware&apos;s servers.</span>
      </div>

      {/* Editor & Controls Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 Cols: Large Text Editor */}
        <div className="lg:col-span-8 space-y-4">
          <div className="glass-card p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-4">
            {/* Document Title Input */}
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Document Header / Title (Optional)
              </label>
              <input
                type="text"
                value={documentTitle}
                onChange={(e) => setDocumentTitle(e.target.value)}
                placeholder="e.g. Project Proposal, Meeting Minutes..."
                className="w-full p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-sm sm:text-base text-slate-900 dark:text-white"
              />
            </div>

            {/* Main Textarea */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Document Body
                </label>
                <div className="flex items-center gap-3 text-xs text-slate-500 font-semibold">
                  <span>{wordCount} words</span>
                  <span>•</span>
                  <span>{charCount} characters</span>
                </div>
              </div>

              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Type or paste your text here..."
                rows={16}
                className="w-full p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm leading-relaxed text-slate-900 dark:text-white resize-y font-mono focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Fast Utility Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-200/60 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyText}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700"
                >
                  <Copy className="w-3.5 h-3.5" /> Copy
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700"
                >
                  Clear
                </button>
              </div>

              <button
                type="button"
                onClick={handleDownloadPdf}
                disabled={!content.trim()}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-40"
              >
                <Download className="w-4 h-4" /> Download PDF
              </button>
            </div>
          </div>
        </div>

        {/* Right 4 Cols: PDF Layout & Formatting Controls */}
        <div className="lg:col-span-4 space-y-5">
          <div className="glass-card p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-4">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-600" /> Page & Print Setup
            </h3>

            {/* Page Size & Orientation */}
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Paper Format
                </label>
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(e.target.value as any)}
                  className="w-full p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-900 dark:text-white"
                >
                  <option value="a4">A4 (210 × 297 mm)</option>
                  <option value="letter">US Letter (8.5 × 11 in)</option>
                  <option value="legal">Legal (8.5 × 14 in)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Orientation
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setOrientation('portrait')}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                      orientation === 'portrait'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    Portrait
                  </button>
                  <button
                    type="button"
                    onClick={() => setOrientation('landscape')}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                      orientation === 'landscape'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    Landscape
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Page Margins
                </label>
                <select
                  value={marginPreset}
                  onChange={(e) => setMarginPreset(e.target.value as any)}
                  className="w-full p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-900 dark:text-white"
                >
                  <option value="narrow">Narrow (0.33 in / 24 pt)</option>
                  <option value="normal">Standard (0.5 in / 36 pt)</option>
                  <option value="wide">Wide (0.75 in / 54 pt)</option>
                </select>
              </div>
            </div>

            <hr className="border-slate-200/60 dark:border-slate-800" />

            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <Type className="w-4 h-4 text-indigo-600" /> Typography & Style
            </h3>

            {/* Typography Controls */}
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Font Family
                </label>
                <select
                  value={fontFamily}
                  onChange={(e) => setFontFamily(e.target.value as any)}
                  className="w-full p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-900 dark:text-white"
                >
                  <option value="helvetica">Helvetica (Sans-Serif)</option>
                  <option value="times">Times New Roman (Serif)</option>
                  <option value="courier">Courier (Monospace)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Font Size: {fontSize}pt
                  </label>
                  <input
                    type="number"
                    min={8}
                    max={36}
                    value={fontSize}
                    onChange={(e) => setFontSize(parseInt(e.target.value) || 12)}
                    className="w-full p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Line Spacing
                  </label>
                  <select
                    value={lineHeightFactor}
                    onChange={(e) => setLineHeightFactor(parseFloat(e.target.value))}
                    className="w-full p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold"
                  >
                    <option value={1.2}>Tight (1.2x)</option>
                    <option value={1.5}>Standard (1.5x)</option>
                    <option value={1.8}>Relaxed (1.8x)</option>
                    <option value={2.0}>Double (2.0x)</option>
                  </select>
                </div>
              </div>

              {/* Text Alignment */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Alignment & Styling
                </label>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setAlignment('left')}
                    className={`p-2 rounded-lg cursor-pointer ${alignment === 'left' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800'}`}
                    title="Align Left"
                  >
                    <AlignLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setAlignment('center')}
                    className={`p-2 rounded-lg cursor-pointer ${alignment === 'center' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800'}`}
                    title="Align Center"
                  >
                    <AlignCenter className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setAlignment('right')}
                    className={`p-2 rounded-lg cursor-pointer ${alignment === 'right' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800'}`}
                    title="Align Right"
                  >
                    <AlignRight className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsBold(!isBold)}
                    className={`p-2 rounded-lg font-bold cursor-pointer ${isBold ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800'}`}
                    title="Bold"
                  >
                    <Bold className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsItalic(!isItalic)}
                    className={`p-2 rounded-lg cursor-pointer ${isItalic ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800'}`}
                    title="Italic"
                  >
                    <Italic className="w-4 h-4" />
                  </button>
                  <input
                    type="color"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    className="w-8 h-8 rounded-lg cursor-pointer ml-auto"
                    title="Font Color"
                  />
                </div>
              </div>

              {/* Page Numbering Checkbox */}
              <label className="flex items-center gap-2 cursor-pointer pt-2">
                <input
                  type="checkbox"
                  checked={includePageNumbers}
                  onChange={(e) => setIncludePageNumbers(e.target.checked)}
                  className="rounded text-indigo-600"
                />
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Include bottom page numbering (e.g. Page 1 of N)
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
