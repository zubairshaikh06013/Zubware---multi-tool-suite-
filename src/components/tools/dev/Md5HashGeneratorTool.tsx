import React, { useState, useMemo } from 'react';
import { Hash, Copy, Check, Lock, CheckCircle2, XCircle } from 'lucide-react';

interface Md5HashGeneratorToolProps {
  onShowToast: (message: string) => void;
}

// Pure Client-side MD5 implementation (RFC 1321)
function md5(input: string): string {
  function safeAdd(x: number, y: number): number {
    const lsw = (x & 0xffff) + (y & 0xffff);
    const msw = (x >> 16) + (y >> 16) + (lsw >> 16);
    return (msw << 16) | (lsw & 0xffff);
  }

  function bitRotateLeft(num: number, cnt: number): number {
    return (num << cnt) | (num >>> (32 - cnt));
  }

  function md5cmn(q: number, a: number, b: number, x: number, s: number, t: number): number {
    return safeAdd(bitRotateLeft(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b);
  }

  function md5ff(a: number, b: number, c: number, d: number, x: number, s: number, t: number): number {
    return md5cmn((b & c) | (~b & d), a, b, x, s, t);
  }

  function md5gg(a: number, b: number, c: number, d: number, x: number, s: number, t: number): number {
    return md5cmn((b & d) | (c & ~d), a, b, x, s, t);
  }

  function md5hh(a: number, b: number, c: number, d: number, x: number, s: number, t: number): number {
    return md5cmn(b ^ c ^ d, a, b, x, s, t);
  }

  function md5ii(a: number, b: number, c: number, d: number, x: number, s: number, t: number): number {
    return md5cmn(c ^ (b | ~d), a, b, x, s, t);
  }

  function binlMD5(x: number[], len: number): number[] {
    x[len >> 5] |= 0x80 << len % 32;
    x[(((len + 64) >>> 9) << 4) + 14] = len;

    let a = 1732584193;
    let b = -271733879;
    let c = -1732584194;
    let d = 271733878;

    for (let i = 0; i < x.length; i += 16) {
      const olda = a;
      const oldb = b;
      const oldc = c;
      const oldd = d;

      a = md5ff(a, b, c, d, x[i], 7, -680876936);
      d = md5ff(d, a, b, c, x[i + 1], 12, -389564586);
      c = md5ff(c, d, a, b, x[i + 2], 17, 606105819);
      b = md5ff(b, c, d, a, x[i + 3], 22, -1044525330);
      a = md5ff(a, b, c, d, x[i + 4], 7, -176418897);
      d = md5ff(d, a, b, c, x[i + 5], 12, 1200080426);
      c = md5ff(c, d, a, b, x[i + 6], 17, -1473231341);
      b = md5ff(b, c, d, a, x[i + 7], 22, -45705983);
      a = md5ff(a, b, c, d, x[i + 8], 7, 1770035416);
      d = md5ff(d, a, b, c, x[i + 9], 12, -1958414417);
      c = md5ff(c, d, a, b, x[i + 10], 17, -42063);
      b = md5ff(b, c, d, a, x[i + 11], 22, -1990404162);
      a = md5ff(a, b, c, d, x[i + 12], 7, 1804603682);
      d = md5ff(d, a, b, c, x[i + 13], 12, -40341101);
      c = md5ff(c, d, a, b, x[i + 14], 17, -1502002290);
      b = md5ff(b, c, d, a, x[i + 15], 22, 1236535329);

      a = md5gg(a, b, c, d, x[i + 1], 5, -165796510);
      d = md5gg(d, a, b, c, x[i + 6], 9, -1069501632);
      c = md5gg(c, d, a, b, x[i + 11], 14, 643717713);
      b = md5gg(b, c, d, a, x[i], 20, -373897302);
      a = md5gg(a, b, c, d, x[i + 5], 5, -701558691);
      d = md5gg(d, a, b, c, x[i + 10], 9, 38016083);
      c = md5gg(c, d, a, b, x[i + 15], 14, -660478335);
      b = md5gg(b, c, d, a, x[i + 4], 20, -405537848);
      a = md5gg(a, b, c, d, x[i + 9], 5, 568446438);
      d = md5gg(d, a, b, c, x[i + 14], 9, -1019803690);
      c = md5gg(c, d, a, b, x[i + 3], 14, -187363961);
      b = md5gg(b, c, d, a, x[i + 8], 20, 1163531501);
      a = md5gg(a, b, c, d, x[i + 13], 5, -1444681467);
      d = md5gg(d, a, b, c, x[i + 2], 9, -51403784);
      c = md5gg(c, d, a, b, x[i + 7], 14, 1735328473);
      b = md5gg(b, c, d, a, x[i + 12], 20, -1926607734);

      a = md5hh(a, b, c, d, x[i + 5], 4, -378558);
      d = md5hh(d, a, b, c, x[i + 8], 11, -2022574463);
      c = md5hh(c, d, a, b, x[i + 11], 16, 1839030562);
      b = md5hh(b, c, d, a, x[i + 14], 23, -35309556);
      a = md5hh(a, b, c, d, x[i + 1], 4, -1530992060);
      d = md5hh(d, a, b, c, x[i + 4], 11, 1272893353);
      c = md5hh(c, d, a, b, x[i + 7], 16, -155497632);
      b = md5hh(b, c, d, a, x[i + 10], 23, -1094730640);
      a = md5hh(a, b, c, d, x[i + 13], 4, 681279174);
      d = md5hh(d, a, b, c, x[i], 11, -358537222);
      c = md5hh(c, d, a, b, x[i + 3], 16, -722521979);
      b = md5hh(b, c, d, a, x[i + 6], 23, 76029189);
      a = md5hh(a, b, c, d, x[i + 9], 4, -640364487);
      d = md5hh(d, a, b, c, x[i + 12], 11, -421815835);
      c = md5hh(c, d, a, b, x[i + 15], 16, 530742520);
      b = md5hh(b, c, d, a, x[i + 2], 23, -995338651);

      a = md5ii(a, b, c, d, x[i], 6, -198630844);
      d = md5ii(d, a, b, c, x[i + 7], 10, 1126891415);
      c = md5ii(c, d, a, b, x[i + 14], 15, -1416354905);
      b = md5ii(b, c, d, a, x[i + 5], 21, -57434055);
      a = md5ii(a, b, c, d, x[i + 12], 6, 1700485571);
      d = md5ii(d, a, b, c, x[i + 3], 10, -1894986606);
      c = md5ii(c, d, a, b, x[i + 10], 15, -1051523);
      b = md5ii(b, c, d, a, x[i + 1], 21, -2054922799);
      a = md5ii(a, b, c, d, x[i + 8], 6, 1873313359);
      d = md5ii(d, a, b, c, x[i + 15], 10, -30611744);
      c = md5ii(c, d, a, b, x[i + 6], 15, -1560198380);
      b = md5ii(b, c, d, a, x[i + 13], 21, 1309151649);
      a = md5ii(a, b, c, d, x[i + 4], 6, -145523070);
      d = md5ii(d, a, b, c, x[i + 11], 10, -1120210379);
      c = md5ii(c, d, a, b, x[i + 2], 15, 718787259);
      b = md5ii(b, c, d, a, x[i + 9], 21, -343485551);

      a = safeAdd(a, olda);
      b = safeAdd(b, oldb);
      c = safeAdd(c, oldc);
      d = safeAdd(d, oldd);
    }
    return [a, b, c, d];
  }

  function rstr2binl(input: string): number[] {
    const output: number[] = [];
    for (let i = 0; i < input.length * 8; i += 8) {
      output[i >> 5] |= (input.charCodeAt(i / 8) & 0xff) << i % 32;
    }
    return output;
  }

  function binl2hex(binarray: number[]): string {
    const hexTab = '0123456789abcdef';
    let str = '';
    for (let i = 0; i < binarray.length * 4; i++) {
      str +=
        hexTab.charAt((binarray[i >> 2] >> ((i % 4) * 8 + 4)) & 0x0f) +
        hexTab.charAt((binarray[i >> 2] >> ((i % 4) * 8)) & 0x0f);
    }
    return str;
  }

  // UTF-8 encode string
  const utf8 = unescape(encodeURIComponent(input));
  return binl2hex(binlMD5(rstr2binl(utf8), utf8.length * 8));
}

export const Md5HashGeneratorTool: React.FC<Md5HashGeneratorToolProps> = ({ onShowToast }) => {
  const [inputText, setInputText] = useState<string>('Hello Zubware');
  const [isUppercase, setIsUppercase] = useState<boolean>(false);
  const [verifyChecksum, setVerifyChecksum] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  const hash = useMemo(() => {
    if (!inputText) return '';
    const h = md5(inputText);
    return isUppercase ? h.toUpperCase() : h.toLowerCase();
  }, [inputText, isUppercase]);

  const isMatch =
    verifyChecksum.trim().length > 0 &&
    verifyChecksum.trim().toLowerCase() === hash.toLowerCase();

  const isMismatch =
    verifyChecksum.trim().length > 0 &&
    verifyChecksum.trim().toLowerCase() !== hash.toLowerCase();

  const copyHash = () => {
    if (!hash) return;
    navigator.clipboard.writeText(hash);
    setCopied(true);
    onShowToast('Copied MD5 hash!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 sm:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>#️⃣</span> MD5 Hash Generator & Checksum Tool
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Generate 128-bit MD5 message digest hash checksums instantly with real-time verification and casing options.
          </p>
        </div>
        <button
          onClick={copyHash}
          disabled={!hash}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          <span>Copy MD5</span>
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
            {inputText.length} chars
          </span>
        </div>

        <textarea
          rows={4}
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          placeholder="Enter text to generate MD5 hash..."
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
          MD5 Hash Digest (32 Hex Characters)
        </span>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 break-all font-mono text-base sm:text-lg font-bold text-slate-900 dark:text-white">
          {hash || 'Enter text above to see MD5 hash'}
        </div>
      </div>

      {/* Verify Checksum Matcher */}
      <div className="glass-card p-6 rounded-3xl space-y-3">
        <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
          Verify Match Against Existing Hash
        </span>
        <input
          type="text"
          value={verifyChecksum}
          onChange={e => setVerifyChecksum(e.target.value)}
          placeholder="Paste expected MD5 hash here to verify..."
          className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-xs"
        />

        {isMatch && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Checksum Verified! Matches the generated MD5 hash.</span>
          </div>
        )}

        {isMismatch && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs font-bold text-rose-600 dark:text-rose-400 flex items-center gap-2">
            <XCircle className="w-4 h-4 text-rose-500" />
            <span>Mismatch. The checksum does not match.</span>
          </div>
        )}
      </div>
    </div>
  );
};
