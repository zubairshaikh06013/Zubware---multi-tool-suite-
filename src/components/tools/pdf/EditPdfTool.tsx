import React, { useState, useRef, useEffect } from 'react';
import {
  Upload,
  Download,
  Type,
  PenTool,
  Image as ImageIcon,
  Square,
  RotateCw,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  RefreshCw,
  Info,
  CheckCircle2,
  Plus,
  Move,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { UniversalFileUpload } from '../../common/UniversalFileUpload';
import { renderPdfPageToCanvas } from '../../../lib/pdfUtils';
import { PDFDocument, rgb, degrees, StandardFonts } from 'pdf-lib';

interface TextAnnotation {
  id: string;
  type: 'text';
  pageIndex: number;
  text: string;
  xPercent: number; // 0-100% of page width
  yPercent: number; // 0-100% of page height
  fontSize: number;
  color: string;
  isBold?: boolean;
}

interface ImageAnnotation {
  id: string;
  type: 'image';
  pageIndex: number;
  dataUrl: string;
  xPercent: number;
  yPercent: number;
  widthPercent: number;
  heightPercent: number;
}

interface HighlightAnnotation {
  id: string;
  type: 'highlight';
  pageIndex: number;
  xPercent: number;
  yPercent: number;
  widthPercent: number;
  heightPercent: number;
  color: string;
}

type Annotation = TextAnnotation | ImageAnnotation | HighlightAnnotation;

export const EditPdfTool: React.FC<{ onShowToast: (msg: string) => void }> = ({ onShowToast }) => {
  const { t } = useLanguage();
  const [file, setFile] = useState<File | null>(null);
  const [pdfBuffer, setPdfBuffer] = useState<ArrayBuffer | null>(null);
  const [pageOrder, setPageOrder] = useState<number[]>([]); // 0-indexed original page indexes
  const [pageRotations, setPageRotations] = useState<Record<number, number>>({}); // pageIndex -> rotation degrees (0, 90, 180, 270)
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0); // index in pageOrder

  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [activeTool, setActiveTool] = useState<'select' | 'text' | 'highlight' | 'draw' | 'image'>('select');

  // Text options
  const [newText, setNewText] = useState('Enter note here');
  const [textColor, setTextColor] = useState('#1e293b');
  const [textSize, setTextSize] = useState(16);
  const [textBold, setTextBold] = useState(false);

  // Drawing Pad Modal
  const [isDrawingPadOpen, setIsDrawingPadOpen] = useState(false);
  const drawCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawColor, setDrawColor] = useState('#0f172a');
  const [drawWidth, setDrawWidth] = useState(3);

  // Highlight options
  const [highlightColor, setHighlightColor] = useState('#fef08a'); // soft yellow

  // Preview canvas & interaction
  const pageContainerRef = useRef<HTMLDivElement | null>(null);
  const pageCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [pageDimensions, setPageDimensions] = useState<{ width: number; height: number }>({ width: 600, height: 800 });
  const [isExporting, setIsExporting] = useState(false);

  // Dragging state for annotations
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const handleFileSelected = async (files: File[]) => {
    if (!files || files.length === 0) return;
    const selected = files[0];
    if (!selected.name.toLowerCase().endsWith('.pdf') && selected.type !== 'application/pdf') {
      onShowToast('Please upload a valid PDF document.');
      return;
    }

    try {
      const buffer = await selected.arrayBuffer();
      const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const count = pdfDoc.getPageCount();

      setFile(selected);
      setPdfBuffer(buffer);
      setPageOrder(Array.from({ length: count }, (_, i) => i));
      setPageRotations({});
      setCurrentPageIndex(0);
      setAnnotations([]);
      onShowToast(`Loaded PDF with ${count} pages.`);
    } catch {
      onShowToast('Error loading PDF. File may be encrypted or corrupted.');
    }
  };

  // Render current page onto canvas
  useEffect(() => {
    if (!pdfBuffer || pageOrder.length === 0) return;

    const originalIdx = pageOrder[currentPageIndex];
    let isCancelled = false;

    renderPdfPageToCanvas(pdfBuffer, originalIdx, 1.3).then((canvas) => {
      if (isCancelled || !pageCanvasRef.current) return;
      const targetCanvas = pageCanvasRef.current;
      targetCanvas.width = canvas.width;
      targetCanvas.height = canvas.height;
      setPageDimensions({ width: canvas.width, height: canvas.height });

      const ctx = targetCanvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, targetCanvas.width, targetCanvas.height);
        // Apply page rotation to preview
        const rot = pageRotations[originalIdx] || 0;
        if (rot !== 0) {
          ctx.save();
          ctx.translate(targetCanvas.width / 2, targetCanvas.height / 2);
          ctx.rotate((rot * Math.PI) / 180);
          ctx.drawImage(canvas, -canvas.width / 2, -canvas.height / 2);
          ctx.restore();
        } else {
          ctx.drawImage(canvas, 0, 0);
        }
      }
    });

    return () => {
      isCancelled = true;
    };
  }, [pdfBuffer, currentPageIndex, pageOrder, pageRotations]);

  // Click on page canvas to add active annotation
  const handlePageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!pageContainerRef.current) return;
    const rect = pageContainerRef.current.getBoundingClientRect();
    const xPct = ((e.clientX - rect.left) / rect.width) * 100;
    const yPct = ((e.clientY - rect.top) / rect.height) * 100;

    const currentOrigPage = pageOrder[currentPageIndex];

    if (activeTool === 'text') {
      const newAnnotation: TextAnnotation = {
        id: 'txt_' + Date.now(),
        type: 'text',
        pageIndex: currentOrigPage,
        text: newText || 'New Note',
        xPercent: Math.min(Math.max(xPct, 2), 85),
        yPercent: Math.min(Math.max(yPct, 2), 92),
        fontSize: textSize,
        color: textColor,
        isBold: textBold
      };
      setAnnotations(prev => [...prev, newAnnotation]);
      setActiveTool('select');
      onShowToast('Text note placed on page.');
    } else if (activeTool === 'highlight') {
      const newAnnotation: HighlightAnnotation = {
        id: 'hl_' + Date.now(),
        type: 'highlight',
        pageIndex: currentOrigPage,
        xPercent: Math.min(Math.max(xPct, 2), 75),
        yPercent: Math.min(Math.max(yPct, 2), 92),
        widthPercent: 25,
        heightPercent: 4,
        color: highlightColor
      };
      setAnnotations(prev => [...prev, newAnnotation]);
      setActiveTool('select');
      onShowToast('Highlight added. Drag to reposition.');
    }
  };

  // Image Upload Annotation
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const imgFile = e.target.files?.[0];
    if (!imgFile) return;

    const reader = new FileReader();
    reader.onload = (loadEvt) => {
      const dataUrl = loadEvt.target?.result as string;
      if (!dataUrl) return;

      const currentOrigPage = pageOrder[currentPageIndex];
      const newAnnotation: ImageAnnotation = {
        id: 'img_' + Date.now(),
        type: 'image',
        pageIndex: currentOrigPage,
        dataUrl,
        xPercent: 30,
        yPercent: 40,
        widthPercent: 25,
        heightPercent: 15
      };

      setAnnotations(prev => [...prev, newAnnotation]);
      setActiveTool('select');
      onShowToast('Image added to page. Drag to move.');
    };
    reader.readAsDataURL(imgFile);
    e.target.value = '';
  };

  // Freehand signature drawing pad
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = drawCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const drawMove = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = drawCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.strokeStyle = drawColor;
    ctx.lineWidth = drawWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const saveDrawingToPage = () => {
    const canvas = drawCanvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');

    const currentOrigPage = pageOrder[currentPageIndex];
    const newAnnotation: ImageAnnotation = {
      id: 'draw_' + Date.now(),
      type: 'image',
      pageIndex: currentOrigPage,
      dataUrl,
      xPercent: 35,
      yPercent: 45,
      widthPercent: 28,
      heightPercent: 14
    };

    setAnnotations(prev => [...prev, newAnnotation]);
    setIsDrawingPadOpen(false);
    onShowToast('Signature placed on document.');
  };

  const clearDrawingCanvas = () => {
    const canvas = drawCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  // Page Management
  const rotateCurrentPage = () => {
    const origIdx = pageOrder[currentPageIndex];
    const currentRot = pageRotations[origIdx] || 0;
    const nextRot = (currentRot + 90) % 360;
    setPageRotations(prev => ({ ...prev, [origIdx]: nextRot }));
    onShowToast(`Page rotated to ${nextRot}°`);
  };

  const deleteCurrentPage = () => {
    if (pageOrder.length <= 1) {
      onShowToast('Cannot delete the only page in the document.');
      return;
    }
    const origIdx = pageOrder[currentPageIndex];
    // Remove page from order
    const nextOrder = pageOrder.filter((_, i) => i !== currentPageIndex);
    setPageOrder(nextOrder);
    // Remove annotations on this page
    setAnnotations(prev => prev.filter(a => a.pageIndex !== origIdx));
    setCurrentPageIndex(prev => Math.min(prev, nextOrder.length - 1));
    onShowToast('Page removed from document.');
  };

  const movePageUp = () => {
    if (currentPageIndex === 0) return;
    const nextOrder = [...pageOrder];
    const temp = nextOrder[currentPageIndex - 1];
    nextOrder[currentPageIndex - 1] = nextOrder[currentPageIndex];
    nextOrder[currentPageIndex] = temp;
    setPageOrder(nextOrder);
    setCurrentPageIndex(currentPageIndex - 1);
    onShowToast('Page moved up.');
  };

  const movePageDown = () => {
    if (currentPageIndex >= pageOrder.length - 1) return;
    const nextOrder = [...pageOrder];
    const temp = nextOrder[currentPageIndex + 1];
    nextOrder[currentPageIndex + 1] = nextOrder[currentPageIndex];
    nextOrder[currentPageIndex] = temp;
    setPageOrder(nextOrder);
    setCurrentPageIndex(currentPageIndex + 1);
    onShowToast('Page moved down.');
  };

  // Delete individual annotation
  const deleteAnnotation = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setAnnotations(prev => prev.filter(a => a.id !== id));
    onShowToast('Item removed.');
  };

  // Save & Download Edited PDF using pdf-lib
  const handleDownloadEditedPdf = async () => {
    if (!pdfBuffer || !file || pageOrder.length === 0) return;

    setIsExporting(true);
    try {
      // Load source PDF
      const srcPdf = await PDFDocument.load(pdfBuffer, { ignoreEncryption: true });
      // Create fresh output PDF to reassemble ordered pages and strip deleted ones
      const outPdf = await PDFDocument.create();

      const fontHelvetica = await outPdf.embedFont(StandardFonts.Helvetica);
      const fontHelveticaBold = await outPdf.embedFont(StandardFonts.HelveticaBold);

      // Copy pages in desired order
      const copiedPages = await outPdf.copyPages(srcPdf, pageOrder);

      for (let i = 0; i < copiedPages.length; i++) {
        const page = copiedPages[i];
        const origIdx = pageOrder[i];

        // Apply rotation
        const extraRot = pageRotations[origIdx] || 0;
        if (extraRot !== 0) {
          const currentRot = page.getRotation().angle;
          page.setRotation(degrees((currentRot + extraRot) % 360));
        }

        outPdf.addPage(page);

        // Render annotations for this page
        const { width: pWidth, height: pHeight } = page.getSize();
        const pageAnns = annotations.filter(a => a.pageIndex === origIdx);

        for (const ann of pageAnns) {
          if (ann.type === 'text') {
            // pdf-lib origin is bottom-left
            const x = (ann.xPercent / 100) * pWidth;
            const y = pHeight - ((ann.yPercent / 100) * pHeight) - ann.fontSize;

            // Hex color to rgb
            const hex = ann.color.replace('#', '');
            const r = parseInt(hex.substring(0, 2), 16) / 255 || 0;
            const g = parseInt(hex.substring(2, 4), 16) / 255 || 0;
            const b = parseInt(hex.substring(4, 6), 16) / 255 || 0;

            page.drawText(ann.text, {
              x,
              y: Math.max(y, 10),
              size: ann.fontSize,
              font: ann.isBold ? fontHelveticaBold : fontHelvetica,
              color: rgb(r, g, b)
            });
          } else if (ann.type === 'highlight') {
            const x = (ann.xPercent / 100) * pWidth;
            const y = pHeight - ((ann.yPercent / 100) * pHeight) - ((ann.heightPercent / 100) * pHeight);
            const w = (ann.widthPercent / 100) * pWidth;
            const h = (ann.heightPercent / 100) * pHeight;

            page.drawRectangle({
              x,
              y: Math.max(y, 0),
              width: w,
              height: h,
              color: rgb(1, 0.95, 0.4),
              opacity: 0.4
            });
          } else if (ann.type === 'image') {
            try {
              const base64Data = ann.dataUrl.split(',')[1];
              const imgBytes = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));

              let embeddedImg;
              if (ann.dataUrl.includes('image/png')) {
                embeddedImg = await outPdf.embedPng(imgBytes);
              } else {
                embeddedImg = await outPdf.embedJpg(imgBytes);
              }

              const w = (ann.widthPercent / 100) * pWidth;
              const h = (ann.heightPercent / 100) * pHeight;
              const x = (ann.xPercent / 100) * pWidth;
              const y = pHeight - ((ann.yPercent / 100) * pHeight) - h;

              page.drawImage(embeddedImg, {
                x,
                y: Math.max(y, 0),
                width: w,
                height: h
              });
            } catch (imgErr) {
              console.warn('Failed to embed image annotation:', imgErr);
            }
          }
        }
      }

      const pdfBytes = await outPdf.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const baseName = file.name.replace(/\.pdf$/i, '');
      a.href = url;
      a.download = `${baseName}-edited.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 2000);

      onShowToast('Edited PDF downloaded successfully!');
    } catch (err) {
      console.error('Error saving edited PDF:', err);
      onShowToast('Failed to export edited PDF.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setPdfBuffer(null);
    setPageOrder([]);
    setPageRotations({});
    setCurrentPageIndex(0);
    setAnnotations([]);
  };

  const currentOriginalPage = pageOrder[currentPageIndex];
  const currentPageAnnotations = annotations.filter(a => a.pageIndex === currentOriginalPage);

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Privacy Notice */}
      <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs font-semibold border border-emerald-200/60 dark:border-emerald-800/40">
        <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
        <span>Files are processed locally in your browser and are not uploaded to Zubware&apos;s servers.</span>
      </div>

      {/* Honest Capability Disclaimer */}
      <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/30 text-blue-900 dark:text-blue-300 text-xs border border-blue-200/60 dark:border-blue-800/40">
        <Info className="w-4 h-4 shrink-0 text-blue-600 dark:text-blue-400 mt-0.5" />
        <span>
          <strong>Browser-Side Overlay Editing:</strong> This tool allows you to add text notes, sign, draw, add images, highlight sections, rotate, reorder, and remove pages without altering the underlying original vector text.
        </span>
      </div>

      {!file ? (
        <UniversalFileUpload
          accept=".pdf,application/pdf"
          multiple={false}
          maxSizeMB={100}
          title="Drop your PDF here to edit"
          subtitle="Add text, signature, images, highlights, and rearrange pages directly in your browser"
          fileTypeSupportText="100% Client-Side • Secure & Private"
          onFilesSelected={handleFileSelected}
        />
      ) : (
        <div className="space-y-5">
          {/* Main Editing Toolbar */}
          <div className="glass-card p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
            {/* Overlay Tools */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTool('select')}
                className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                  activeTool === 'select'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <Move className="w-3.5 h-3.5" /> Select / Move
              </button>

              <button
                type="button"
                onClick={() => setActiveTool('text')}
                className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                  activeTool === 'text'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <Type className="w-3.5 h-3.5" /> Add Text
              </button>

              <button
                type="button"
                onClick={() => setActiveTool('highlight')}
                className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                  activeTool === 'highlight'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <Square className="w-3.5 h-3.5" /> Highlight
              </button>

              <button
                type="button"
                onClick={() => setIsDrawingPadOpen(true)}
                className="px-3 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-1.5 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                <PenTool className="w-3.5 h-3.5" /> Add Signature
              </button>

              <label className="px-3 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-1.5 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700">
                <ImageIcon className="w-3.5 h-3.5" /> Add Image
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              </label>
            </div>

            {/* Page Action Controls */}
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={rotateCurrentPage}
                title="Rotate page 90°"
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                <RotateCw className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={movePageUp}
                disabled={currentPageIndex === 0}
                title="Move page earlier"
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={movePageDown}
                disabled={currentPageIndex >= pageOrder.length - 1}
                title="Move page later"
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30"
              >
                <ArrowDown className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={deleteCurrentPage}
                title="Delete current page"
                className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 cursor-pointer hover:bg-rose-100 dark:hover:bg-rose-900"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleDownloadEditedPdf}
                disabled={isExporting}
                className="ml-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                {isExporting ? 'Saving PDF...' : 'Download PDF'}
              </button>
            </div>
          </div>

          {/* Sub-tool options if Text mode active */}
          {activeTool === 'text' && (
            <div className="glass-card p-3.5 rounded-xl border border-indigo-200 dark:border-indigo-900 flex flex-wrap items-center gap-3 bg-indigo-50/40 dark:bg-indigo-950/20 text-xs">
              <span className="font-bold text-indigo-700 dark:text-indigo-300">Click anywhere on document to place text:</span>
              <input
                type="text"
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                placeholder="Text note..."
                className="p-1.5 px-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-medium"
              />
              <div className="flex items-center gap-1">
                <span className="text-slate-500">Size:</span>
                <input
                  type="number"
                  min={10}
                  max={48}
                  value={textSize}
                  onChange={(e) => setTextSize(parseInt(e.target.value) || 16)}
                  className="w-14 p-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center font-bold"
                />
              </div>
              <div className="flex items-center gap-1">
                <span className="text-slate-500">Color:</span>
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="w-7 h-7 rounded cursor-pointer"
                />
              </div>
              <button
                type="button"
                onClick={() => setTextBold(!textBold)}
                className={`px-2.5 py-1 rounded-lg font-bold cursor-pointer ${
                  textBold ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-slate-900 border'
                }`}
              >
                B
              </button>
            </div>
          )}

          {/* Document Canvas Display & Page Navigator */}
          <div className="glass-card p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-4">
            {/* Page Navigation Bar */}
            <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800 pb-3">
              <button
                type="button"
                onClick={() => setCurrentPageIndex(prev => Math.max(prev - 1, 0))}
                disabled={currentPageIndex === 0}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1 cursor-pointer disabled:opacity-30"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>

              <span className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white">
                Page {currentPageIndex + 1} of {pageOrder.length}
                {pageRotations[currentOriginalPage] ? ` (${pageRotations[currentOriginalPage]}° rotated)` : ''}
              </span>

              <button
                type="button"
                onClick={() => setCurrentPageIndex(prev => Math.min(prev + 1, pageOrder.length - 1))}
                disabled={currentPageIndex >= pageOrder.length - 1}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1 cursor-pointer disabled:opacity-30"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Interactive Page Container */}
            <div className="flex justify-center bg-slate-200/60 dark:bg-slate-950/60 p-4 sm:p-6 rounded-xl overflow-auto min-h-[500px]">
              <div
                ref={pageContainerRef}
                onClick={handlePageClick}
                className="relative bg-white shadow-xl cursor-crosshair select-none"
                style={{
                  width: '100%',
                  maxWidth: '700px',
                  aspectRatio: pageDimensions.width && pageDimensions.height ? `${pageDimensions.width} / ${pageDimensions.height}` : '1 / 1.41'
                }}
              >
                <canvas ref={pageCanvasRef} className="w-full h-full object-contain pointer-events-none" />

                {/* Overlaid Annotations on this Page */}
                {currentPageAnnotations.map((ann) => {
                  if (ann.type === 'text') {
                    return (
                      <div
                        key={ann.id}
                        className="absolute group border border-dashed border-transparent hover:border-indigo-500 rounded p-1 cursor-move"
                        style={{
                          left: `${ann.xPercent}%`,
                          top: `${ann.yPercent}%`,
                          color: ann.color,
                          fontSize: `${ann.fontSize}px`,
                          fontWeight: ann.isBold ? 'bold' : 'normal',
                          lineHeight: 1.2
                        }}
                      >
                        {ann.text}
                        <button
                          type="button"
                          onClick={(e) => deleteAnnotation(ann.id, e)}
                          className="opacity-0 group-hover:opacity-100 absolute -top-3 -right-3 p-1 rounded-full bg-rose-500 text-white text-[10px] cursor-pointer shadow-sm"
                          title="Remove text"
                        >
                          ✕
                        </button>
                      </div>
                    );
                  } else if (ann.type === 'highlight') {
                    return (
                      <div
                        key={ann.id}
                        className="absolute group border border-dashed border-amber-400/80 rounded cursor-move"
                        style={{
                          left: `${ann.xPercent}%`,
                          top: `${ann.yPercent}%`,
                          width: `${ann.widthPercent}%`,
                          height: `${ann.heightPercent}%`,
                          backgroundColor: ann.color,
                          opacity: 0.45
                        }}
                      >
                        <button
                          type="button"
                          onClick={(e) => deleteAnnotation(ann.id, e)}
                          className="opacity-0 group-hover:opacity-100 absolute -top-3 -right-3 p-1 rounded-full bg-rose-500 text-white text-[10px] cursor-pointer shadow-sm"
                          title="Remove highlight"
                        >
                          ✕
                        </button>
                      </div>
                    );
                  } else if (ann.type === 'image') {
                    return (
                      <div
                        key={ann.id}
                        className="absolute group border border-dashed border-indigo-400/80 rounded cursor-move"
                        style={{
                          left: `${ann.xPercent}%`,
                          top: `${ann.yPercent}%`,
                          width: `${ann.widthPercent}%`,
                          height: `${ann.heightPercent}%`
                        }}
                      >
                        <img src={ann.dataUrl} alt="Annotation" className="w-full h-full object-contain pointer-events-none" />
                        <button
                          type="button"
                          onClick={(e) => deleteAnnotation(ann.id, e)}
                          className="opacity-0 group-hover:opacity-100 absolute -top-3 -right-3 p-1 rounded-full bg-rose-500 text-white text-[10px] cursor-pointer shadow-sm"
                          title="Remove image"
                        >
                          ✕
                        </button>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1">
              <span>{currentPageAnnotations.length} overlay elements on this page</span>
              <button
                type="button"
                onClick={handleReset}
                className="text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 font-bold cursor-pointer"
              >
                Close Document
              </button>
            </div>
          </div>

          {/* Signature Drawing Modal */}
          {isDrawingPadOpen && (
            <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-5 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                  <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">Draw Signature or Stamp</h4>
                  <button
                    type="button"
                    onClick={() => setIsDrawingPadOpen(false)}
                    className="text-slate-400 hover:text-slate-600 text-xs font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>

                <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-950">
                  <canvas
                    ref={drawCanvasRef}
                    width={400}
                    height={180}
                    onMouseDown={startDrawing}
                    onMouseMove={drawMove}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={drawMove}
                    onTouchEnd={stopDrawing}
                    className="w-full h-44 cursor-crosshair touch-none"
                  />
                </div>

                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500">Color:</span>
                    <input
                      type="color"
                      value={drawColor}
                      onChange={(e) => setDrawColor(e.target.value)}
                      className="w-6 h-6 rounded cursor-pointer"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={clearDrawingCanvas}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold cursor-pointer"
                  >
                    Clear
                  </button>
                  <button
                    type="button"
                    onClick={saveDrawingToPage}
                    className="px-4 py-1.5 rounded-lg bg-indigo-600 text-white font-bold cursor-pointer shadow-xs"
                  >
                    Insert on Page
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
