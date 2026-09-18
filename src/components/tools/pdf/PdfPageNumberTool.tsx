import React, { useState } from 'react';
import { Upload, Hash, Download, RefreshCw, Layers, Sparkles, Check } from 'lucide-react';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export function PdfPageNumberTool({ onShowToast }: { onShowToast: (msg: string) => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [pdfBuffer, setPdfBuffer] = useState<ArrayBuffer | null>(null);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [format, setFormat] = useState<'pageNum' | 'pageOfTotal' | 'dashNum' | 'custom'>('pageOfTotal');
  const [position, setPosition] = useState<'bottom-center' | 'bottom-right' | 'bottom-left' | 'top-left' | 'top-center' | 'top-right'>('bottom-center');
  const [startFrom, setStartFrom] = useState<number>(1);
  const [fontSize, setFontSize] = useState<number>(10);
  const [skipFirstPage, setSkipFirstPage] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [numberedPdfUrl, setNumberedPdfUrl] = useState<string | null>(null);

  const handleFile = async (uploadedFile: File) => {
    if (uploadedFile.type !== 'application/pdf' && !uploadedFile.name.endsWith('.pdf')) {
      onShowToast('Please upload a valid PDF document');
      return;
    }
    const buffer = await uploadedFile.arrayBuffer();
    const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
    setFile(uploadedFile);
    setPdfBuffer(buffer);
    setTotalPages(pdfDoc.getPageCount());
    setNumberedPdfUrl(null);
    onShowToast(`Loaded PDF: ${pdfDoc.getPageCount()} pages`);
  };

  const processPageNumbers = async () => {
    if (!pdfBuffer || !file) return;
    setIsProcessing(true);

    try {
      const pdfDoc = await PDFDocument.load(pdfBuffer, { ignoreEncryption: true });
      const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const pages = pdfDoc.getPages();
      const count = pages.length;

      for (let i = 0; i < count; i++) {
        if (skipFirstPage && i === 0) continue;

        const page = pages[i];
        const { width, height } = page.getSize();
        const currentNum = i + startFrom - (skipFirstPage ? 1 : 0);

        let label = '';
        if (format === 'pageNum') label = `Page ${currentNum}`;
        else if (format === 'pageOfTotal') label = `Page ${currentNum} of ${count}`;
        else if (format === 'dashNum') label = `- ${currentNum} -`;
        else label = `${currentNum}`;

        const textWidth = helveticaFont.widthOfTextAtSize(label, fontSize);
        const margin = 30;

        let x = width / 2 - textWidth / 2;
        let y = margin;

        if (position === 'bottom-left') {
          x = margin;
          y = margin;
        } else if (position === 'bottom-right') {
          x = width - margin - textWidth;
          y = margin;
        } else if (position === 'bottom-center') {
          x = width / 2 - textWidth / 2;
          y = margin;
        } else if (position === 'top-left') {
          x = margin;
          y = height - margin;
        } else if (position === 'top-center') {
          x = width / 2 - textWidth / 2;
          y = height - margin;
        } else if (position === 'top-right') {
          x = width - margin - textWidth;
          y = height - margin;
        }

        page.drawText(label, {
          x,
          y,
          size: fontSize,
          font: helveticaFont,
          color: rgb(0.2, 0.25, 0.3),
        });
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setNumberedPdfUrl(url);
      onShowToast('Page numbers added successfully!');
    } catch (err) {
      console.error(err);
      onShowToast('Failed to add page numbers to PDF');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Hash className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            PDF Page Numberer
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Add customized page numbering headers or footers to all pages in your PDF document.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: Upload & Configuration */}
        <div className="lg:col-span-6 space-y-4">
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
            }}
            className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 rounded-3xl p-6 text-center transition-all bg-slate-50/50 dark:bg-slate-900/50 flex flex-col items-center justify-center min-h-[180px]"
          >
            <input
              type="file"
              accept=".pdf,application/pdf"
              id="page-number-file"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />

            {file ? (
              <div className="space-y-1 text-center w-full">
                <p className="text-sm font-bold text-slate-900 dark:text-white truncate px-4">{file.name}</p>
                <p className="text-xs text-indigo-600 dark:text-indigo-400 font-bold">{totalPages} pages detected</p>
                <label
                  htmlFor="page-number-file"
                  className="text-[11px] text-slate-400 hover:underline cursor-pointer block pt-1 font-bold"
                >
                  Change PDF
                </label>
              </div>
            ) : (
              <label htmlFor="page-number-file" className="cursor-pointer space-y-2 block">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
                  <Upload className="w-5 h-5" />
                </div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Upload PDF File</p>
              </label>
            )}
          </div>

          {/* Numbering Settings */}
          <div className="glass-card p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Numbering Format
              </label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold"
              >
                <option value="pageOfTotal">Page 1 of {totalPages || 'N'}</option>
                <option value="pageNum">Page 1</option>
                <option value="dashNum">- 1 -</option>
                <option value="custom">1 (Number only)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Position on Page
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { id: 'top-left', label: 'Top Left' },
                  { id: 'top-center', label: 'Top Center' },
                  { id: 'top-right', label: 'Top Right' },
                  { id: 'bottom-left', label: 'Bottom Left' },
                  { id: 'bottom-center', label: 'Bottom Center' },
                  { id: 'bottom-right', label: 'Bottom Right' },
                ].map((pos) => (
                  <button
                    key={pos.id}
                    onClick={() => setPosition(pos.id as any)}
                    className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      position === pos.id
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {pos.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Start Count At</label>
                <input
                  type="number"
                  min="1"
                  value={startFrom}
                  onChange={(e) => setStartFrom(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Font Size ({fontSize}pt)</label>
                <input
                  type="number"
                  min="8"
                  max="20"
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold font-mono"
                />
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700 dark:text-slate-300 pt-1">
              <input
                type="checkbox"
                checked={skipFirstPage}
                onChange={(e) => setSkipFirstPage(e.target.checked)}
                className="rounded text-indigo-600 focus:ring-indigo-500"
              />
              <span>Skip first page (Cover / Title Page)</span>
            </label>

            <button
              onClick={processPageNumbers}
              disabled={!file || isProcessing}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Stamping Page Numbers...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Apply Numbers to PDF</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Col: Preview & Download */}
        <div className="lg:col-span-6 space-y-4 flex flex-col">
          <div className="p-4 rounded-3xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex-1 flex flex-col items-center justify-center min-h-[340px]">
            {numberedPdfUrl ? (
              <div className="space-y-4 w-full text-center">
                <iframe
                  src={numberedPdfUrl}
                  className="w-full h-80 rounded-2xl border border-slate-200 dark:border-slate-800"
                />
                <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  Page numbering applied to all {totalPages} pages!
                </p>
              </div>
            ) : (
              <div className="text-center space-y-2 text-slate-400">
                <Hash className="w-10 h-10 mx-auto stroke-1" />
                <p className="text-xs font-bold">Numbered PDF preview will appear here</p>
              </div>
            )}
          </div>

          {numberedPdfUrl && (
            <div className="flex items-center justify-end">
              <a
                href={numberedPdfUrl}
                download={`numbered_${file?.name || 'document.pdf'}`}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shadow-sm"
              >
                <Download className="w-4 h-4" /> Download Numbered PDF
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
