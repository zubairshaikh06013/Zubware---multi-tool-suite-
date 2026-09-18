import React, { useState } from 'react';
import { Upload, FileText, Download, Copy, Check, RefreshCw, Layers, Scan, AlertCircle } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';
import { createWorker } from 'tesseract.js';
import { renderPdfPageToCanvas } from '../../../lib/pdfUtils';

export function PdfToTextTool({ onShowToast }: { onShowToast: (msg: string) => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [pdfBuffer, setPdfBuffer] = useState<ArrayBuffer | null>(null);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [mode, setMode] = useState<'digital' | 'ocr'>('digital');
  const [selectedLang, setSelectedLang] = useState('eng');
  const [extractedText, setExtractedText] = useState<string>('');
  const [pageOutputs, setPageOutputs] = useState<{ page: number; text: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('');
  const [copied, setCopied] = useState(false);

  const handleFile = async (uploadedFile: File) => {
    if (uploadedFile.type !== 'application/pdf' && !uploadedFile.name.endsWith('.pdf')) {
      onShowToast('Please upload a valid PDF file');
      return;
    }

    try {
      const buffer = await uploadedFile.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(buffer.slice(0)) });
      const pdf = await loadingTask.promise;
      setFile(uploadedFile);
      setPdfBuffer(buffer);
      setTotalPages(pdf.numPages);
      setExtractedText('');
      setPageOutputs([]);
      onShowToast(`Loaded PDF: ${pdf.numPages} pages`);
    } catch {
      onShowToast('Failed to parse PDF document');
    }
  };

  const processExtract = async () => {
    if (!pdfBuffer || !totalPages) return;
    setLoading(true);
    setProgress(0);
    setExtractedText('');
    setPageOutputs([]);

    try {
      if (mode === 'digital') {
        setStatusText('Extracting digital text...');
        const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(pdfBuffer.slice(0)) });
        const pdf = await loadingTask.promise;
        const results: { page: number; text: string }[] = [];

        for (let i = 1; i <= pdf.numPages; i++) {
          setStatusText(`Reading Page ${i} of ${pdf.numPages}...`);
          setProgress(Math.round((i / pdf.numPages) * 100));
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .map((item: any) => item.str || '')
            .join(' ')
            .replace(/\s+/g, ' ')
            .trim();

          results.push({ page: i, text: pageText });
        }

        const fullText = results
          .map((r) => `--- PAGE ${r.page} ---\n\n${r.text || '[No selectable text detected on this page - try Scanned OCR mode]'}\n`)
          .join('\n\n');

        setPageOutputs(results);
        setExtractedText(fullText);
        onShowToast('PDF text extracted successfully!');
      } else {
        // Scanned OCR mode with Tesseract
        setStatusText('Starting OCR engine...');
        const worker = await createWorker(selectedLang, 1, {
          logger: (m) => {
            if (m.status === 'recognizing text') {
              setStatusText(`OCR Page in progress (${Math.round(m.progress * 100)}%)...`);
            }
          },
        });

        const results: { page: number; text: string }[] = [];

        for (let i = 0; i < totalPages; i++) {
          setStatusText(`Rendering & OCR scanning page ${i + 1} of ${totalPages}...`);
          setProgress(Math.round(((i + 1) / totalPages) * 100));

          const canvas = await renderPdfPageToCanvas(pdfBuffer, i, 1.8);
          const dataUrl = canvas.toDataURL('image/png');
          const ret = await worker.recognize(dataUrl);

          results.push({ page: i + 1, text: ret.data.text.trim() });
        }

        await worker.terminate();

        const fullText = results
          .map((r) => `--- PAGE ${r.page} (OCR) ---\n\n${r.text || '[No text recognized]'}\n`)
          .join('\n\n');

        setPageOutputs(results);
        setExtractedText(fullText);
        onShowToast('Scanned PDF OCR complete!');
      }
    } catch (err) {
      console.error(err);
      onShowToast('Error processing PDF text extraction');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!extractedText) return;
    navigator.clipboard.writeText(extractedText);
    setCopied(true);
    onShowToast('Copied PDF text!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!extractedText || !file) return;
    const blob = new Blob([extractedText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${file.name.replace(/\.[^/.]+$/, '')}_text.txt`;
    a.click();
    URL.revokeObjectURL(url);
    onShowToast('Downloaded text document!');
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            PDF to Text (Digital & Scanned OCR)
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Extract text from digital PDFs or run optical character recognition on scanned PDF documents.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: Upload & Configuration */}
        <div className="lg:col-span-5 space-y-4">
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
            }}
            className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 rounded-3xl p-6 text-center transition-all bg-slate-50/50 dark:bg-slate-900/50 flex flex-col items-center justify-center min-h-[220px]"
          >
            <input
              type="file"
              accept=".pdf,application/pdf"
              id="pdf-text-upload"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />

            {file ? (
              <div className="space-y-2 text-center w-full">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
                  <FileText className="w-6 h-6" />
                </div>
                <p className="text-sm font-bold text-slate-900 dark:text-white truncate px-4">{file.name}</p>
                <p className="text-xs text-indigo-600 dark:text-indigo-400 font-bold">{totalPages} pages detected</p>
                <label
                  htmlFor="pdf-text-upload"
                  className="text-[11px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 underline cursor-pointer block pt-1"
                >
                  Choose another PDF
                </label>
              </div>
            ) : (
              <label htmlFor="pdf-text-upload" className="cursor-pointer space-y-3 block">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Upload PDF Document</p>
                  <p className="text-xs text-slate-400 mt-1">Drag & drop or click to browse</p>
                </div>
              </label>
            )}
          </div>

          {/* Extraction Mode Card */}
          <div className="glass-card p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-3">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Extraction Engine Mode</span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setMode('digital')}
                className={`p-3 rounded-xl text-xs font-bold text-left border transition-all cursor-pointer ${
                  mode === 'digital'
                    ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                <div className="font-black">Digital Text</div>
                <div className="text-[10px] text-slate-400 font-normal mt-0.5">Instant vector extraction</div>
              </button>

              <button
                onClick={() => setMode('ocr')}
                className={`p-3 rounded-xl text-xs font-bold text-left border transition-all cursor-pointer ${
                  mode === 'ocr'
                    ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                <div className="font-black">Scanned OCR</div>
                <div className="text-[10px] text-slate-400 font-normal mt-0.5">For image/scanned pages</div>
              </button>
            </div>

            {mode === 'ocr' && (
              <div className="flex items-center justify-between pt-1">
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400">OCR Language:</label>
                <select
                  value={selectedLang}
                  onChange={(e) => setSelectedLang(e.target.value)}
                  className="px-3 py-1.5 text-xs font-bold rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="eng">English</option>
                  <option value="spa">Spanish</option>
                  <option value="fra">French</option>
                  <option value="deu">German</option>
                  <option value="hin">Hindi</option>
                </select>
              </div>
            )}

            <button
              onClick={processExtract}
              disabled={!file || loading}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>{statusText || 'Extracting...'}</span>
                </>
              ) : (
                <>
                  <Scan className="w-4 h-4" />
                  <span>Extract Text from PDF</span>
                </>
              )}
            </button>

            {loading && (
              <div className="space-y-1.5 pt-1">
                <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-indigo-600 h-full transition-all duration-300 rounded-full"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                  <span>{statusText}</span>
                  <span>{progress}%</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Extracted Text */}
        <div className="lg:col-span-7 space-y-3 flex flex-col">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
              <FileText className="w-4 h-4" /> Extracted Text Content
            </label>
            <span className="text-[10px] text-slate-400 font-bold">
              {extractedText.length} characters &bull; {extractedText.trim() ? extractedText.trim().split(/\s+/).length : 0} words
            </span>
          </div>

          <textarea
            rows={14}
            value={extractedText}
            onChange={(e) => setExtractedText(e.target.value)}
            placeholder="Extracted PDF text will appear here with page separators..."
            className="w-full flex-1 min-h-[300px] p-4 text-sm rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans"
          />

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Extracted 100% locally. Zero server upload.</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleDownload}
                disabled={!extractedText}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 dark:bg-slate-800 dark:hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" /> Download TXT
              </button>
              <button
                onClick={handleCopy}
                disabled={!extractedText}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5 shadow-sm"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied!' : 'Copy Text'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
