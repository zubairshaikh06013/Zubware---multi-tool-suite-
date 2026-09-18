import React, { useState } from 'react';
import { ShieldCheck, ShieldAlert, Upload, Copy, Check, FileCheck, RefreshCw } from 'lucide-react';
import CryptoJS from 'crypto-js';

interface FileChecksumVerifierToolProps {
  onShowToast: (message: string) => void;
}

type HashAlgorithm = 'SHA-256' | 'SHA-1' | 'SHA-512' | 'MD5';

export const FileChecksumVerifierTool: React.FC<FileChecksumVerifierToolProps> = ({ onShowToast }) => {
  const [algorithm, setAlgorithm] = useState<HashAlgorithm>('SHA-256');
  const [expectedHash, setExpectedHash] = useState<string>('');
  const [calculatedHash, setCalculatedHash] = useState<string>('');
  const [fileInfo, setFileInfo] = useState<{ name: string; size: number; file: File } | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const arrayBufferToHex = (buffer: ArrayBuffer): string => {
    const byteArray = new Uint8Array(buffer);
    const hexCodes = [...byteArray].map((value) => value.toString(16).padStart(2, '0'));
    return hexCodes.join('');
  };

  const computeHash = async (file: File, algo: HashAlgorithm) => {
    setIsProcessing(true);
    try {
      const buffer = await file.arrayBuffer();
      let hashHex = '';

      if (algo === 'MD5') {
        const wordArray = CryptoJS.lib.WordArray.create(buffer as any);
        hashHex = CryptoJS.MD5(wordArray).toString();
      } else {
        const hashBuffer = await crypto.subtle.digest(algo, buffer);
        hashHex = arrayBufferToHex(hashBuffer);
      }

      setCalculatedHash(hashHex);
      onShowToast(`Calculated ${algo} for ${file.name}`);
    } catch {
      onShowToast('Error calculating file checksum.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileInfo({ name: file.name, size: file.size, file });
    await computeHash(file, algorithm);
  };

  const handleAlgorithmChange = async (newAlgo: HashAlgorithm) => {
    setAlgorithm(newAlgo);
    if (fileInfo) {
      await computeHash(fileInfo.file, newAlgo);
    }
  };

  const cleanExpected = expectedHash.trim().toLowerCase();
  const cleanCalculated = calculatedHash.trim().toLowerCase();

  const isMatch = cleanExpected && cleanCalculated && cleanExpected === cleanCalculated;
  const isMismatch = cleanExpected && cleanCalculated && cleanExpected !== cleanCalculated;

  const handleCopy = () => {
    if (!calculatedHash) return;
    navigator.clipboard.writeText(calculatedHash);
    setCopied(true);
    onShowToast('Checksum copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <span>🛡️</span> File Checksum Verifier ({algorithm})
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Verify file integrity by comparing uploaded file cryptographic hashes (SHA-256, SHA-1, SHA-512, MD5) against original developer checksums locally.
        </p>
      </div>

      {/* Algorithm selector */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 mr-2">Algorithm:</span>
        {(['SHA-256', 'SHA-1', 'SHA-512', 'MD5'] as HashAlgorithm[]).map((algo) => (
          <button
            key={algo}
            onClick={() => handleAlgorithmChange(algo)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              algorithm === algo
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            {algo}
          </button>
        ))}
      </div>

      {/* Input Expected Hash */}
      <div className="glass-card p-6 rounded-3xl space-y-3">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
          Expected Official {algorithm} Checksum
        </label>
        <input
          type="text"
          value={expectedHash}
          onChange={(e) => setExpectedHash(e.target.value)}
          placeholder={`Paste official ${algorithm} hash here to verify match...`}
          className="w-full py-3 px-4 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Upload File */}
      <div className="glass-card p-8 rounded-3xl border-2 border-dashed border-slate-300 dark:border-slate-700 text-center space-y-3">
        <Upload className="w-10 h-10 text-indigo-500 mx-auto" />
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">Select File to Verify</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
          Calculates cryptographic hash client-side with zero data uploads.
        </p>
        <label className="inline-block mt-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs cursor-pointer transition-colors shadow-md">
          Choose File
          <input type="file" onChange={handleFile} className="hidden" />
        </label>

        {fileInfo && (
          <div className="text-xs font-mono text-slate-600 dark:text-slate-300 pt-2">
            File: <span className="font-bold">{fileInfo.name}</span> ({(fileInfo.size / (1024 * 1024)).toFixed(2)} MB)
          </div>
        )}

        {isProcessing && <p className="text-xs text-indigo-500 font-bold animate-pulse">Computing {algorithm} hash...</p>}
      </div>

      {/* Calculated Hash Display */}
      {calculatedHash && (
        <div className="glass-card p-6 rounded-3xl space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
              Calculated {algorithm} Checksum
            </span>
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-900 font-mono text-xs break-all text-slate-800 dark:text-slate-200 select-all font-bold">
            {calculatedHash}
          </div>
        </div>
      )}

      {/* Match / Mismatch Result Banner */}
      {isMatch && (
        <div className="p-6 rounded-3xl bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center gap-4 text-emerald-600 dark:text-emerald-400">
          <ShieldCheck className="w-10 h-10 shrink-0" />
          <div>
            <h4 className="text-sm font-extrabold uppercase tracking-wider">Verification Passed — Checksums Match!</h4>
            <p className="text-xs opacity-90 mt-1">
              The file is authentic and has not been tampered with or corrupted during download.
            </p>
          </div>
        </div>
      )}

      {isMismatch && (
        <div className="p-6 rounded-3xl bg-rose-500/10 border-2 border-rose-500/30 flex items-center gap-4 text-rose-600 dark:text-rose-400">
          <ShieldAlert className="w-10 h-10 shrink-0" />
          <div>
            <h4 className="text-sm font-extrabold uppercase tracking-wider">Verification Failed — Hash Mismatch!</h4>
            <p className="text-xs opacity-90 mt-1">
              The calculated hash does not match the expected official checksum. Do not trust or execute this file.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
