import React, { useState, useRef } from 'react';
import { Upload, Copy, Check, Download, RefreshCw, FileText, Image as ImageIcon, Scan, Globe, AlertCircle } from 'lucide-react';
import { createWorker } from 'tesseract.js';

const OCR_LANGUAGES = [
  { code: 'eng', name: 'English' },
  { code: 'hin', name: 'Hindi (हिंदी)' },
  { code: 'spa', name: 'Spanish (Español)' },
  { code: 'fra', name: 'French (Français)' },
  { code: 'deu', name: 'German (Deutsch)' },
  { code: 'ita', name: 'Italian (Italiano)' },
  { code: 'por', name: 'Portuguese (Português)' },
  { code: 'rus', name: 'Russian (Русский)' },
  { code: 'ara', name: 'Arabic (العربية)' },
  { code: 'chi_sim', name: 'Chinese Simplified (简体中文)' },
  { code: 'jpn', name: 'Japanese (日本語)' },
];

export function ImageToTextTool({ onShowToast }: { onShowToast: (msg: string) => void }) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [selectedLang, setSelectedLang] = useState<string>('eng');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState<number>(0);
  const [statusText, setStatusText] = useState<string>('');
  const [extractedText, setExtractedText] = useState<string>('');
  const [confidence, setConfidence] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      onShowToast('Please upload an image file (PNG, JPG, WebP)');
      return;
    }
    setFileName(file.name);
    setExtractedText('');
    setConfidence(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      setImageSrc(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const processOcr = async () => {
    if (!imageSrc) return;
    setLoading(true);
    setProgress(0);
    setStatusText('Initializing OCR engine...');

    try {
      const worker = await createWorker(selectedLang, 1, {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            setProgress(Math.round(m.progress * 100));
            setStatusText(`Recognizing characters (${Math.round(m.progress * 100)}%)...`);
          } else if (m.status === 'loading tesseract core') {
            setStatusText('Loading OCR engine...');
          } else if (m.status === 'loading language traineddata') {
            setStatusText(`Loading language dictionary (${selectedLang})...`);
          }
        },
      });

      const ret = await worker.recognize(imageSrc);
      setExtractedText(ret.data.text);
      setConfidence(Math.round(ret.data.confidence));
      await worker.terminate();
      onShowToast('Text extracted successfully!');
    } catch (err: unknown) {
      console.error(err);
      onShowToast('OCR failed. Please try a clearer image.');
      setStatusText('Error extracting text.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!extractedText) return;
    navigator.clipboard.writeText(extractedText);
    setCopied(true);
    onShowToast('Copied extracted text!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!extractedText) return;
    const blob = new Blob([extractedText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName.replace(/\.[^/.]+$/, '') || 'extracted'}_text.txt`;
    a.click();
    URL.revokeObjectURL(url);
    onShowToast('Downloaded text file!');
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Scan className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Image to Text (OCR Extractor)
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Extract readable text directly from screenshots, photos, invoices, receipts, and scans 100% inside your browser.
          </p>
        </div>
      </div>

      {/* Upload & Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Upload & Preview */}
        <div className="lg:col-span-5 space-y-4">
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
            }}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 rounded-3xl p-6 text-center cursor-pointer transition-all bg-slate-50/50 dark:bg-slate-900/50 flex flex-col items-center justify-center min-h-[260px]"
          >
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />

            {imageSrc ? (
              <div className="space-y-3 w-full">
                <img
                  src={imageSrc}
                  alt="OCR Preview"
                  className="max-h-56 mx-auto rounded-xl object-contain shadow-sm border border-slate-200 dark:border-slate-800"
                />
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate">{fileName}</p>
                <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold block">Click or drop another image to replace</span>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    Click to upload or drag & drop image
                  </p>
                  <p className="text-xs text-slate-400 mt-1">Supports PNG, JPG, JPEG, WebP, BMP</p>
                </div>
              </div>
            )}
          </div>

          {/* Language Selector & OCR Button */}
          <div className="glass-card p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-indigo-500" /> Recognition Language
              </label>
              <select
                value={selectedLang}
                onChange={(e) => setSelectedLang(e.target.value)}
                disabled={loading}
                className="px-3 py-1.5 text-xs font-bold rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
              >
                {OCR_LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={processOcr}
              disabled={!imageSrc || loading}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>{statusText || 'Extracting Text...'}</span>
                </>
              ) : (
                <>
                  <Scan className="w-4 h-4" />
                  <span>Extract Text from Image</span>
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

        {/* Right Side: Extracted Result */}
        <div className="lg:col-span-7 space-y-3 flex flex-col">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                <FileText className="w-4 h-4" /> Extracted Text Output
              </label>
              {confidence !== null && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  confidence >= 80 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300'
                }`}>
                  OCR Confidence: {confidence}%
                </span>
              )}
            </div>

            <span className="text-[10px] text-slate-400 font-bold">
              {extractedText.length} characters &bull; {extractedText.trim() ? extractedText.trim().split(/\s+/).length : 0} words
            </span>
          </div>

          <textarea
            rows={14}
            value={extractedText}
            onChange={(e) => setExtractedText(e.target.value)}
            placeholder="Extracted text will appear here. You can edit, copy, or download it..."
            className="w-full flex-1 min-h-[300px] p-4 text-sm rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans"
          />

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>100% Client-Side OCR. Your images never leave your computer.</span>
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
                {copied ? 'Copied!' : 'Copy Extracted Text'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
