import React, { useState } from 'react';
import { Upload, GitCompare, RefreshCw, FileText, ArrowRight, CheckCircle, AlertTriangle, Download } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';

interface DiffPart {
  type: 'same' | 'added' | 'removed';
  value: string;
}

export function PdfCompareTool({ onShowToast }: { onShowToast: (msg: string) => void }) {
  const [fileA, setFileA] = useState<File | null>(null);
  const [fileB, setFileB] = useState<File | null>(null);
  const [textA, setTextA] = useState<string>('');
  const [textB, setTextB] = useState<string>('');
  const [diffResult, setDiffResult] = useState<DiffPart[]>([]);
  const [similarityScore, setSimilarityScore] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const extractPdfText = async (file: File): Promise<string> => {
    const buffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(buffer.slice(0)) });
    const pdf = await loadingTask.promise;
    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .map((item: any) => item.str || '')
        .join(' ')
        .replace(/\s+/g, ' ');
      fullText += `[Page ${i}]\n` + pageText + '\n\n';
    }

    return fullText.trim();
  };

  const computeWordDiff = (str1: string, str2: string) => {
    const words1 = str1.split(/\s+/);
    const words2 = str2.split(/\s+/);

    const diff: DiffPart[] = [];
    let i = 0;
    let j = 0;

    while (i < words1.length || j < words2.length) {
      if (i < words1.length && j < words2.length && words1[i] === words2[j]) {
        diff.push({ type: 'same', value: words1[i] + ' ' });
        i++;
        j++;
      } else if (j < words2.length && (!words1.slice(i, i + 5).includes(words2[j]) || i >= words1.length)) {
        diff.push({ type: 'added', value: words2[j] + ' ' });
        j++;
      } else if (i < words1.length) {
        diff.push({ type: 'removed', value: words1[i] + ' ' });
        i++;
      } else {
        j++;
      }
    }

    // Calculate similarity %
    const sameCount = diff.filter((d) => d.type === 'same').length;
    const totalWords = Math.max(words1.length, words2.length) || 1;
    const similarity = Math.round((sameCount / totalWords) * 100);

    setDiffResult(diff);
    setSimilarityScore(similarity);
  };

  const processCompare = async () => {
    if (!fileA || !fileB) {
      onShowToast('Please upload both PDF files to compare');
      return;
    }

    setIsProcessing(true);
    try {
      const [tA, tB] = await Promise.all([extractPdfText(fileA), extractPdfText(fileB)]);
      setTextA(tA);
      setTextB(tB);
      computeWordDiff(tA, tB);
      onShowToast('PDF comparison completed!');
    } catch (err) {
      console.error(err);
      onShowToast('Failed to parse and compare PDF files');
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
            <GitCompare className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            PDF Compare & Diff Checker
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Compare two PDF files side-by-side to highlight added, removed, or modified text.
          </p>
        </div>
      </div>

      {/* Upload Dual Files */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Document A */}
        <div className="glass-card p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-indigo-500" /> Original Document (PDF A)
          </span>

          <label className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 rounded-2xl p-4 text-center cursor-pointer block bg-slate-50/50 dark:bg-slate-900/50">
            <input
              type="file"
              accept=".pdf,application/pdf"
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  setFileA(e.target.files[0]);
                  setDiffResult([]);
                  onShowToast(`Uploaded PDF A: ${e.target.files[0].name}`);
                }
              }}
            />
            {fileA ? (
              <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{fileA.name}</p>
            ) : (
              <p className="text-xs font-bold text-slate-500">Choose Original PDF</p>
            )}
          </label>
        </div>

        {/* Document B */}
        <div className="glass-card p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-indigo-500" /> Revised Document (PDF B)
          </span>

          <label className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 rounded-2xl p-4 text-center cursor-pointer block bg-slate-50/50 dark:bg-slate-900/50">
            <input
              type="file"
              accept=".pdf,application/pdf"
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  setFileB(e.target.files[0]);
                  setDiffResult([]);
                  onShowToast(`Uploaded PDF B: ${e.target.files[0].name}`);
                }
              }}
            />
            {fileB ? (
              <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{fileB.name}</p>
            ) : (
              <p className="text-xs font-bold text-slate-500">Choose Revised PDF</p>
            )}
          </label>
        </div>
      </div>

      <div className="flex justify-center">
        <button
          onClick={processCompare}
          disabled={!fileA || !fileB || isProcessing}
          className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2 shadow-sm"
        >
          {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <GitCompare className="w-4 h-4" />}
          <span>Compare PDFs & Calculate Diffs</span>
        </button>
      </div>

      {/* Similarity Score & Results */}
      {similarityScore !== null && (
        <div className="space-y-4 pt-2">
          <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Document Similarity Score</p>
              <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{similarityScore}% Match</p>
            </div>

            <div className="flex items-center gap-4 text-xs font-bold">
              <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                <span className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500" />
                Added in Doc B
              </span>
              <span className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400">
                <span className="w-3 h-3 rounded-full bg-rose-500/20 border border-rose-500" />
                Removed from Doc A
              </span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 max-h-[420px] overflow-y-auto leading-relaxed text-xs">
            {diffResult.map((part, index) => {
              if (part.type === 'added') {
                return (
                  <span
                    key={index}
                    className="bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold px-1 py-0.5 rounded mx-0.5"
                  >
                    {part.value}
                  </span>
                );
              }
              if (part.type === 'removed') {
                return (
                  <span
                    key={index}
                    className="bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 line-through px-1 py-0.5 rounded mx-0.5"
                  >
                    {part.value}
                  </span>
                );
              }
              return (
                <span key={index} className="text-slate-700 dark:text-slate-300">
                  {part.value}
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
