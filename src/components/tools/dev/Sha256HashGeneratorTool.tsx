import React, { useState, useEffect } from 'react';
import { ShieldCheck, Copy, Check, Lock, CheckCircle2, XCircle } from 'lucide-react';

interface Sha256HashGeneratorToolProps {
  onShowToast: (message: string) => void;
}

export const Sha256HashGeneratorTool: React.FC<Sha256HashGeneratorToolProps> = ({ onShowToast }) => {
  const [inputText, setInputText] = useState<string>('Hello Zubware');
  const [sha256Hash, setSha256Hash] = useState<string>('');
  const [isUppercase, setIsUppercase] = useState<boolean>(false);
  const [verifyChecksum, setVerifyChecksum] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  // Compute SHA-256 using standard Web Cryptography API
  useEffect(() => {
    let isMounted = true;

    async function computeHash() {
      if (!inputText) {
        if (isMounted) setSha256Hash('');
        return;
      }
      try {
        const msgBuffer = new TextEncoder().encode(inputText);
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        if (isMounted) setSha256Hash(hashHex);
      } catch (err) {
        console.error('SHA-256 error', err);
      }
    }

    computeHash();
    return () => {
      isMounted = false;
    };
  }, [inputText]);

  const displayedHash = isUppercase ? sha256Hash.toUpperCase() : sha256Hash.toLowerCase();

  const isMatch =
    verifyChecksum.trim().length > 0 &&
    verifyChecksum.trim().toLowerCase() === sha256Hash.toLowerCase();

  const isMismatch =
    verifyChecksum.trim().length > 0 &&
    verifyChecksum.trim().toLowerCase() !== sha256Hash.toLowerCase();

  const copyHash = () => {
    if (!displayedHash) return;
    navigator.clipboard.writeText(displayedHash);
    setCopied(true);
    onShowToast('Copied SHA-256 hash!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 sm:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>🛡️</span> SHA-256 Hash Generator & Checksum Verifier
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Generate 256-bit cryptographic SHA-256 checksum hashes in real-time with Web Crypto API and verify matching digests.
          </p>
        </div>
        <button
          onClick={copyHash}
          disabled={!displayedHash}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          <span>Copy Hash</span>
        </button>
      </div>

      {/* Input */}
      <div className="glass-card p-6 sm:p-7 rounded-3xl space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Lock className="w-4 h-4 text-indigo-500" />
            <span>Input String / Data</span>
          </span>
          <span className="text-xs font-mono text-slate-400">
            {inputText.length} chars ({new TextEncoder().encode(inputText).length} bytes)
          </span>
        </div>

        <textarea
          rows={4}
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          placeholder="Enter plain text to hash..."
          className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-xs leading-relaxed outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <div className="flex items-center gap-4 pt-1">
          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300">
            <input
              type="checkbox"
              checked={isUppercase}
              onChange={e => setIsUppercase(e.target.checked)}
              className="w-4 h-4 rounded accent-indigo-600 cursor-pointer"
            />
            <span>Uppercase Hex</span>
          </label>
        </div>
      </div>

      {/* Hash Result Display */}
      <div className="glass-card p-6 sm:p-7 rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-indigo-500/10 via-slate-500/5 to-transparent space-y-3">
        <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 block">
          SHA-256 Digest (64 Hex Characters)
        </span>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 break-all font-mono text-sm sm:text-base font-bold text-slate-900 dark:text-white">
          {displayedHash || 'Enter text above to see hash'}
        </div>
      </div>

      {/* Verify Checksum Matcher */}
      <div className="glass-card p-6 rounded-3xl space-y-3">
        <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
          Checksum Match Verification
        </span>
        <input
          type="text"
          value={verifyChecksum}
          onChange={e => setVerifyChecksum(e.target.value)}
          placeholder="Paste expected SHA-256 hash here to compare..."
          className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-xs"
        />

        {isMatch && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Checksum Verified! The generated hash matches your expected hash exactly.</span>
          </div>
        )}

        {isMismatch && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs font-bold text-rose-600 dark:text-rose-400 flex items-center gap-2">
            <XCircle className="w-4 h-4 text-rose-500" />
            <span>Hash Mismatch. The checksums do not match.</span>
          </div>
        )}
      </div>
    </div>
  );
};
