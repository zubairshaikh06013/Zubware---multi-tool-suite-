import React, { useState, useRef, useEffect, useMemo } from 'react';
import { jsPDF } from 'jspdf';
import {
  Download,
  FileText,
  Sliders,
  ShieldCheck,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  RefreshCw,
  Palette,
  BookOpen
} from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';

type PaperType = 'lined' | 'plain' | 'grid' | 'vintage';
type InkColor = 'blue' | 'navy' | 'black' | 'red' | 'violet';

const INK_COLORS: Record<InkColor, { label: string; hex: string }> = {
  blue: { label: 'Gel Blue', hex: '#003eb3' },
  navy: { label: 'Navy Ballpoint', hex: '#1e3a8a' },
  black: { label: 'Ink Black', hex: '#18181b' },
  red: { label: 'Teacher Red', hex: '#b91c1c' },
  violet: { label: 'Fountain Violet', hex: '#581c87' }
};

export const TextToHandwritingTool: React.FC<{ onShowToast: (msg: string) => void }> = ({ onShowToast }) => {
  const { t } = useLanguage();

  const [text, setText] = useState(
    'Assignment 1: Quantum Physics Overview\n\nIn physics, a quantum is the minimum amount of any physical entity involved in an interaction. The fundamental notion that a physical property may be "quantized" is referred to as the hypothesis of quantization.\n\nKey Concepts:\n1. Wave-particle duality of matter and radiation\n2. Heisenberg Uncertainty Principle\n3. Planck constant and energy quanta: E = h * f\n\nPlease submit all tutorial problem sets by next Tuesday morning.'
  );

  // Styling
  const [fontFamily, setFontFamily] = useState<'Caveat' | 'Kalam' | 'Homemade Apple' | 'Dancing Script' | 'Sacramento'>('Caveat');
  const [inkColor, setInkColor] = useState<InkColor>('blue');
  const [paperType, setPaperType] = useState<PaperType>('lined');
  const [fontSize, setFontSize] = useState<number>(24);
  const [lineSpacing, setLineSpacing] = useState<number>(36);
  const [letterSpacing, setLetterSpacing] = useState<number>(1);
  const [naturalJitter, setNaturalJitter] = useState<boolean>(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState<number>(0);

  // Canvas Dimensions (standard high-res A4: 1240 × 1754 px at ~150 DPI)
  const PAGE_WIDTH = 1240;
  const PAGE_HEIGHT = 1754;
  const MARGIN_LEFT = 180; // Margin line position
  const MARGIN_RIGHT = 120;
  const MARGIN_TOP = 160;
  const MARGIN_BOTTOM = 140;

  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Calculate paginated text
  const pages = useMemo(() => {
    // Temporary measurement canvas
    const measCanvas = document.createElement('canvas');
    const ctx = measCanvas.getContext('2d');
    if (!ctx) return [[]];

    ctx.font = `${fontSize}px "${fontFamily}", cursive`;

    const printableWidth = PAGE_WIDTH - MARGIN_LEFT - MARGIN_RIGHT;
    const printableHeight = PAGE_HEIGHT - MARGIN_TOP - MARGIN_BOTTOM;
    const maxLinesPerPage = Math.floor(printableHeight / lineSpacing);

    const paragraphs = text.split('\n');
    const allLines: string[] = [];

    for (const para of paragraphs) {
      if (!para.trim()) {
        allLines.push('');
        continue;
      }

      const words = para.split(' ');
      let currentLine = '';

      for (const word of words) {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        const width = ctx.measureText(testLine).width;
        if (width > printableWidth && currentLine) {
          allLines.push(currentLine);
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      }
      if (currentLine) {
        allLines.push(currentLine);
      }
    }

    // Split lines into pages
    const pageList: string[][] = [];
    let curPageLines: string[] = [];

    for (const line of allLines) {
      if (curPageLines.length >= maxLinesPerPage) {
        pageList.push(curPageLines);
        curPageLines = [];
      }
      curPageLines.push(line);
    }
    if (curPageLines.length > 0 || pageList.length === 0) {
      pageList.push(curPageLines);
    }

    return pageList;
  }, [text, fontSize, fontFamily, lineSpacing]);

  // Adjust current page if out of bounds
  useEffect(() => {
    if (currentPage >= pages.length) {
      setCurrentPage(Math.max(0, pages.length - 1));
    }
  }, [pages.length, currentPage]);

  // Render a specific page to an HTML Canvas
  const drawPage = (pageIdx: number): HTMLCanvasElement => {
    const canvas = document.createElement('canvas');
    canvas.width = PAGE_WIDTH;
    canvas.height = PAGE_HEIGHT;
    const ctx = canvas.getContext('2d');
    if (!ctx) return canvas;

    // 1. Draw Paper Background
    if (paperType === 'vintage') {
      ctx.fillStyle = '#fef3c7'; // warm aged parchment
      ctx.fillRect(0, 0, PAGE_WIDTH, PAGE_HEIGHT);
    } else {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, PAGE_WIDTH, PAGE_HEIGHT);
    }

    // 2. Draw Paper Rules / Lines
    if (paperType === 'lined' || paperType === 'vintage') {
      // Horizontal blue lines
      ctx.strokeStyle = paperType === 'vintage' ? '#d9770633' : '#bfdbfe';
      ctx.lineWidth = 1.2;

      for (let y = MARGIN_TOP; y < PAGE_HEIGHT - MARGIN_BOTTOM; y += lineSpacing) {
        ctx.beginPath();
        ctx.moveTo(40, y);
        ctx.lineTo(PAGE_WIDTH - 40, y);
        ctx.stroke();
      }

      // Vertical Left Margin Red Line
      ctx.strokeStyle = '#f87171';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(MARGIN_LEFT - 30, 40);
      ctx.lineTo(MARGIN_LEFT - 30, PAGE_HEIGHT - 40);
      ctx.stroke();
    } else if (paperType === 'grid') {
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 0.8;
      const gridSize = 28;

      for (let x = 0; x < PAGE_WIDTH; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, PAGE_HEIGHT);
        ctx.stroke();
      }
      for (let y = 0; y < PAGE_HEIGHT; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(PAGE_WIDTH, y);
        ctx.stroke();
      }
    }

    // 3. Draw Handwritten Text
    const lines = pages[pageIdx] || [];
    ctx.fillStyle = INK_COLORS[inkColor].hex;
    ctx.textBaseline = 'bottom';

    lines.forEach((line, lineIdx) => {
      if (!line) return;

      const baselineY = MARGIN_TOP + lineIdx * lineSpacing;
      let startX = MARGIN_LEFT;

      // Draw word by word or letter by letter to apply subtle organic jitter
      const words = line.split(' ');
      words.forEach((word) => {
        // Natural jitter per word
        const jitterY = naturalJitter ? (Math.sin(word.length * 3.7 + lineIdx) * 1.5) : 0;
        const wordFont = `${fontSize}px "${fontFamily}", cursive`;
        ctx.font = wordFont;

        ctx.fillText(word, startX, baselineY + jitterY);
        const wordWidth = ctx.measureText(word + ' ').width;
        startX += wordWidth;
      });
    });

    return canvas;
  };

  // Render preview on current page change
  useEffect(() => {
    const pageCanvas = drawPage(currentPage);
    const targetRef = previewCanvasRef.current;
    if (targetRef) {
      targetRef.width = pageCanvas.width;
      targetRef.height = pageCanvas.height;
      const ctx = targetRef.getContext('2d');
      if (ctx) ctx.drawImage(pageCanvas, 0, 0);
    }
  }, [currentPage, pages, fontFamily, inkColor, paperType, fontSize, lineSpacing, naturalJitter]);

  const handleDownloadPng = () => {
    const canvas = drawPage(currentPage);
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `handwritten-page-${currentPage + 1}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    onShowToast(`Downloaded Page ${currentPage + 1} PNG.`);
  };

  const handleDownloadAllPdf = () => {
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: 'a4'
      });

      const pW = doc.internal.pageSize.getWidth();
      const pH = doc.internal.pageSize.getHeight();

      for (let i = 0; i < pages.length; i++) {
        if (i > 0) doc.addPage('a4', 'portrait');
        const canvas = drawPage(i);
        const imgData = canvas.toDataURL('image/jpeg', 0.92);
        doc.addImage(imgData, 'JPEG', 0, 0, pW, pH, undefined, 'FAST');
      }

      doc.save(`handwritten-notes-${Date.now()}.pdf`);
      onShowToast(`Downloaded all ${pages.length} pages as PDF!`);
    } catch (err) {
      console.error(err);
      onShowToast('Failed to generate PDF.');
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Privacy Notice */}
      <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs font-semibold border border-emerald-200/60 dark:border-emerald-800/40">
        <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
        <span>Files are processed locally in your browser and are not uploaded to SplitDrop&apos;s servers.</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 5 Cols: Input & Customization */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-card p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-4">
            {/* Textarea */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Text to Convert
                </label>
                <span className="text-xs text-slate-500 font-semibold">
                  {text.trim() ? text.trim().split(/\s+/).length : 0} words • {pages.length} page{pages.length > 1 ? 's' : ''}
                </span>
              </div>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={9}
                placeholder="Type or paste your text / notes here..."
                className="w-full p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white leading-relaxed focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Font Style Selection */}
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1">Handwriting Font Style</label>
              <select
                value={fontFamily}
                onChange={(e) => setFontFamily(e.target.value as any)}
                className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-900 dark:text-white"
              >
                <option value="Caveat">Caveat (Smooth Ballpoint Pen)</option>
                <option value="Kalam">Kalam (Neat Student Penmanship)</option>
                <option value="Homemade Apple">Homemade Apple (Natural Fast Cursive)</option>
                <option value="Dancing Script">Dancing Script (Artistic Calligraphy)</option>
                <option value="Sacramento">Sacramento (Connected Monoline Script)</option>
              </select>
            </div>

            {/* Ink Color Selection */}
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1.5">Ink Color</label>
              <div className="flex flex-wrap gap-2">
                {(Object.keys(INK_COLORS) as InkColor[]).map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setInkColor(c)}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                      inkColor === c
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300'
                        : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: INK_COLORS[c].hex }} />
                    {INK_COLORS[c].label}
                  </button>
                ))}
              </div>
            </div>

            {/* Paper Type */}
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1.5">Paper Style</label>
              <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setPaperType('lined')}
                  className={`p-2 rounded-xl border text-center cursor-pointer transition-all ${
                    paperType === 'lined' ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700' : 'border-slate-200 dark:border-slate-800'
                  }`}
                >
                  Ruled Lined Paper
                </button>
                <button
                  type="button"
                  onClick={() => setPaperType('plain')}
                  className={`p-2 rounded-xl border text-center cursor-pointer transition-all ${
                    paperType === 'plain' ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700' : 'border-slate-200 dark:border-slate-800'
                  }`}
                >
                  Plain Blank Paper
                </button>
                <button
                  type="button"
                  onClick={() => setPaperType('grid')}
                  className={`p-2 rounded-xl border text-center cursor-pointer transition-all ${
                    paperType === 'grid' ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700' : 'border-slate-200 dark:border-slate-800'
                  }`}
                >
                  Grid Graph Paper
                </button>
                <button
                  type="button"
                  onClick={() => setPaperType('vintage')}
                  className={`p-2 rounded-xl border text-center cursor-pointer transition-all ${
                    paperType === 'vintage' ? 'border-indigo-600 bg-amber-50 dark:bg-amber-950/40 text-amber-800' : 'border-slate-200 dark:border-slate-800'
                  }`}
                >
                  Vintage Aged Parchment
                </button>
              </div>
            </div>

            {/* Typography Sizing Controls */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-500 block mb-1">Font Size: {fontSize}px</label>
                <input
                  type="range"
                  min={18}
                  max={38}
                  value={fontSize}
                  onChange={(e) => setFontSize(parseInt(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 block mb-1">Line Height: {lineSpacing}px</label>
                <input
                  type="range"
                  min={26}
                  max={52}
                  value={lineSpacing}
                  onChange={(e) => setLineSpacing(parseInt(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>
            </div>

            {/* Organic Jitter Toggle */}
            <label className="flex items-center gap-2 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={naturalJitter}
                onChange={(e) => setNaturalJitter(e.target.checked)}
                className="rounded text-indigo-600"
              />
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Natural penmanship variation (simulates organic human writing)
              </span>
            </label>
          </div>
        </div>

        {/* Right 7 Cols: Live Notebook Preview & Download */}
        <div className="lg:col-span-7 space-y-4">
          <div className="glass-card p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-4">
            {/* Top Toolbar */}
            <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                  disabled={currentPage === 0}
                  className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer disabled:opacity-30"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs font-extrabold text-slate-900 dark:text-white">
                  Page {currentPage + 1} of {pages.length}
                </span>
                <button
                  type="button"
                  onClick={() => setCurrentPage(prev => Math.min(pages.length - 1, prev + 1))}
                  disabled={currentPage >= pages.length - 1}
                  className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer disabled:opacity-30"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleDownloadPng}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" /> Save Current PNG
                </button>
                <button
                  type="button"
                  onClick={handleDownloadAllPdf}
                  className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" /> Download All as PDF
                </button>
              </div>
            </div>

            {/* Notebook Stage */}
            <div className="p-4 sm:p-6 rounded-xl bg-slate-200/70 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-center min-h-[500px] overflow-auto">
              <canvas
                ref={previewCanvasRef}
                className="max-h-[620px] object-contain shadow-2xl rounded-sm"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
