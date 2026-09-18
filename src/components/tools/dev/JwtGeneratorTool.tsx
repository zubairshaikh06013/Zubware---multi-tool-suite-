import React, { useState, useEffect } from 'react';
import { KeyRound, Copy, Check, RefreshCw, ShieldCheck, Sparkles, AlertCircle, Clock, Lock } from 'lucide-react';
import CryptoJS from 'crypto-js';

export function JwtGeneratorTool({ onShowToast }: { onShowToast: (msg: string) => void }) {
  const [algorithm, setAlgorithm] = useState<'HS256' | 'HS384' | 'HS512'>('HS256');
  const [secretKey, setSecretKey] = useState<string>('zubware_secret_key_2026_jwt_auth');
  const [headerJson, setHeaderJson] = useState<string>(
    JSON.stringify({ alg: 'HS256', typ: 'JWT' }, null, 2)
  );
  const [payloadJson, setPayloadJson] = useState<string>(
    JSON.stringify(
      {
        sub: 'usr_102938475',
        name: 'Jordan Rivera',
        email: 'jordan@zubware.com',
        role: 'admin',
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 3600 * 24, // 24 hours
      },
      null,
      2
    )
  );

  const [jwtToken, setJwtToken] = useState<string>('');
  const [headerPart, setHeaderPart] = useState<string>('');
  const [payloadPart, setPayloadPart] = useState<string>('');
  const [signaturePart, setSignaturePart] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  // Base64URL helpers
  const base64UrlEncode = (str: string): string => {
    return btoa(unescape(encodeURIComponent(str)))
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
  };

  const wordToBase64Url = (wordArray: CryptoJS.lib.WordArray): string => {
    return CryptoJS.enc.Base64.stringify(wordArray)
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
  };

  const generateRandomSecret = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=';
    let res = '';
    for (let i = 0; i < 32; i++) {
      res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setSecretKey(res);
    onShowToast('Generated new random 256-bit secret key');
  };

  const addExpiryHours = (hours: number) => {
    try {
      const parsed = JSON.parse(payloadJson);
      const now = Math.floor(Date.now() / 1000);
      parsed.iat = now;
      parsed.exp = now + hours * 3600;
      setPayloadJson(JSON.stringify(parsed, null, 2));
      onShowToast(`Updated token expiration (+${hours}h)`);
    } catch {
      onShowToast('Invalid payload JSON');
    }
  };

  useEffect(() => {
    // Sync algorithm in header when dropdown changes
    try {
      const parsed = JSON.parse(headerJson);
      if (parsed.alg !== algorithm) {
        parsed.alg = algorithm;
        setHeaderJson(JSON.stringify(parsed, null, 2));
      }
    } catch {
      // Ignore if currently editing
    }
  }, [algorithm]);

  useEffect(() => {
    try {
      setError(null);
      const cleanHeader = JSON.stringify(JSON.parse(headerJson));
      const cleanPayload = JSON.stringify(JSON.parse(payloadJson));

      const encodedHeader = base64UrlEncode(cleanHeader);
      const encodedPayload = base64UrlEncode(cleanPayload);
      const dataToSign = `${encodedHeader}.${encodedPayload}`;

      let signatureWord: CryptoJS.lib.WordArray;
      if (algorithm === 'HS384') {
        signatureWord = CryptoJS.HmacSHA384(dataToSign, secretKey);
      } else if (algorithm === 'HS512') {
        signatureWord = CryptoJS.HmacSHA512(dataToSign, secretKey);
      } else {
        signatureWord = CryptoJS.HmacSHA256(dataToSign, secretKey);
      }

      const encodedSignature = wordToBase64Url(signatureWord);

      setHeaderPart(encodedHeader);
      setPayloadPart(encodedPayload);
      setSignaturePart(encodedSignature);
      setJwtToken(`${encodedHeader}.${encodedPayload}.${encodedSignature}`);
    } catch (err: any) {
      setError(err.message || 'Error generating JWT');
    }
  }, [headerJson, payloadJson, secretKey, algorithm]);

  const handleCopy = () => {
    if (!jwtToken) return;
    navigator.clipboard.writeText(jwtToken);
    setCopied(true);
    onShowToast('Copied JWT token to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-4 gap-3">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            JSON Web Token (JWT) Generator & Signer
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Build, sign, and verify cryptographic JSON Web Tokens (HS256, HS384, HS512) client-side in real time.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Algorithm:</span>
          <select
            value={algorithm}
            onChange={(e) => setAlgorithm(e.target.value as any)}
            className="px-3 py-1.5 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
          >
            <option value="HS256">HS256 (HMAC-SHA256)</option>
            <option value="HS384">HS384 (HMAC-SHA384)</option>
            <option value="HS512">HS512 (HMAC-SHA512)</option>
          </select>
        </div>
      </div>

      {/* Secret Key Input Bar */}
      <div className="glass-card p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 uppercase tracking-wider">
            <Lock className="w-3.5 h-3.5 text-indigo-500" /> Secret Key / HMAC Passphrase
          </label>
          <button
            onClick={generateRandomSecret}
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <RefreshCw className="w-3 h-3" /> Generate Random Secret
          </button>
        </div>
        <input
          type="text"
          value={secretKey}
          onChange={(e) => setSecretKey(e.target.value)}
          placeholder="Enter signing secret..."
          className="w-full px-3 py-2 text-xs font-mono rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Generated Token Display */}
      <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 text-white space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> Generated Encoded Token
          </span>
          <button
            onClick={handleCopy}
            className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied' : 'Copy JWT'}
          </button>
        </div>

        {error ? (
          <div className="text-rose-400 text-xs font-mono p-3 bg-rose-500/10 rounded-xl border border-rose-500/30">
            {error}
          </div>
        ) : (
          <div className="p-3.5 rounded-2xl bg-slate-950 font-mono text-xs break-all leading-relaxed select-all">
            <span className="text-rose-400 font-bold">{headerPart}</span>
            <span className="text-slate-500">.</span>
            <span className="text-purple-400 font-bold">{payloadPart}</span>
            <span className="text-slate-500">.</span>
            <span className="text-cyan-400 font-bold">{signaturePart}</span>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400 pt-1">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400 inline-block" /> Header
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-400 inline-block" /> Payload
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block" /> Signature
          </span>
        </div>
      </div>

      {/* Editor Grid: Header & Payload */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Header Column */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
            JWT Header (JSON)
          </label>
          <textarea
            value={headerJson}
            onChange={(e) => setHeaderJson(e.target.value)}
            rows={10}
            className="w-full p-4 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-slate-200 resize-y"
          />
        </div>

        {/* Payload Column */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              JWT Payload (Claims)
            </label>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => addExpiryHours(1)}
                className="px-2 py-0.5 text-[11px] font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg cursor-pointer"
              >
                +1h Exp
              </button>
              <button
                onClick={() => addExpiryHours(24)}
                className="px-2 py-0.5 text-[11px] font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg cursor-pointer"
              >
                +24h Exp
              </button>
              <button
                onClick={() => addExpiryHours(24 * 30)}
                className="px-2 py-0.5 text-[11px] font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg cursor-pointer"
              >
                +30d Exp
              </button>
            </div>
          </div>
          <textarea
            value={payloadJson}
            onChange={(e) => setPayloadJson(e.target.value)}
            rows={10}
            className="w-full p-4 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-slate-200 resize-y"
          />
        </div>
      </div>
    </div>
  );
}
