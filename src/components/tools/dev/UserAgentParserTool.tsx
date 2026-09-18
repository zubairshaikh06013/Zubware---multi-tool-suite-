import React, { useState, useEffect } from 'react';
import { Laptop, Smartphone, Globe, Cpu, Copy, Check, RefreshCw, Bot } from 'lucide-react';

interface UserAgentParserToolProps {
  onShowToast: (message: string) => void;
}

const SAMPLE_UAS = [
  {
    name: 'Current Browser',
    ua: typeof navigator !== 'undefined' ? navigator.userAgent : ''
  },
  {
    name: 'iPhone Safari (iOS 17)',
    ua: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1'
  },
  {
    name: 'Windows 11 Chrome',
    ua: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36'
  },
  {
    name: 'Android Chrome',
    ua: 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.6312.80 Mobile Safari/537.36'
  },
  {
    name: 'Googlebot Crawler',
    ua: 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
  }
];

export const UserAgentParserTool: React.FC<UserAgentParserToolProps> = ({ onShowToast }) => {
  const [uaString, setUaString] = useState<string>(
    typeof navigator !== 'undefined' ? navigator.userAgent : ''
  );
  const [copied, setCopied] = useState<boolean>(false);

  // Pure Client-side Regex Parser
  const parseUa = (ua: string) => {
    let browser = 'Unknown Browser';
    let browserVersion = '';
    let os = 'Unknown OS';
    let device = 'Desktop';
    let engine = 'Unknown Engine';

    // Device
    if (/bot|crawler|spider|crawling/i.test(ua)) {
      device = 'Bot / Crawler';
    } else if (/ipad|tablet/i.test(ua)) {
      device = 'Tablet';
    } else if (/mobile|iphone|android.*mobile/i.test(ua)) {
      device = 'Mobile Phone';
    } else {
      device = 'Desktop PC / Mac';
    }

    // OS
    if (/windows nt 10/i.test(ua)) os = 'Windows 10 / 11';
    else if (/windows nt 6.3/i.test(ua)) os = 'Windows 8.1';
    else if (/windows nt 6.1/i.test(ua)) os = 'Windows 7';
    else if (/iphone os ([0-9_]+)/i.test(ua)) {
      const match = ua.match(/iphone os ([0-9_]+)/i);
      os = `iOS ${match ? match[1].replace(/_/g, '.') : ''}`;
    } else if (/mac os x ([0-9_]+)/i.test(ua)) {
      const match = ua.match(/mac os x ([0-9_]+)/i);
      os = `macOS ${match ? match[1].replace(/_/g, '.') : ''}`;
    } else if (/android ([0-9.]+)/i.test(ua)) {
      const match = ua.match(/android ([0-9.]+)/i);
      os = `Android ${match ? match[1] : ''}`;
    } else if (/linux/i.test(ua)) {
      os = 'Linux';
    }

    // Browser & Engine
    if (/edg\/([0-9.]+)/i.test(ua)) {
      browser = 'Microsoft Edge';
      browserVersion = ua.match(/edg\/([0-9.]+)/i)?.[1] || '';
      engine = 'Blink';
    } else if (/chrome\/([0-9.]+)/i.test(ua) && !/edg/i.test(ua)) {
      browser = 'Google Chrome';
      browserVersion = ua.match(/chrome\/([0-9.]+)/i)?.[1] || '';
      engine = 'Blink';
    } else if (/firefox\/([0-9.]+)/i.test(ua)) {
      browser = 'Mozilla Firefox';
      browserVersion = ua.match(/firefox\/([0-9.]+)/i)?.[1] || '';
      engine = 'Gecko';
    } else if (/version\/([0-9.]+).*safari/i.test(ua)) {
      browser = 'Apple Safari';
      browserVersion = ua.match(/version\/([0-9.]+)/i)?.[1] || '';
      engine = 'WebKit';
    } else if (/googlebot/i.test(ua)) {
      browser = 'Googlebot Search Engine Bot';
      engine = 'Google Web Crawler';
    }

    return {
      browser,
      browserVersion,
      os,
      device,
      engine
    };
  };

  const parsed = parseUa(uaString);

  const copyJson = () => {
    navigator.clipboard.writeText(JSON.stringify({ userAgent: uaString, parsed }, null, 2));
    setCopied(true);
    onShowToast('Parsed UA copied as JSON!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 sm:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>🔍</span> User Agent Parser & Detector
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Decode HTTP User-Agent strings to identify browser version, operating system, layout engine, and device type.
          </p>
        </div>
        <button
          onClick={copyJson}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          <span>Copy Parsed JSON</span>
        </button>
      </div>

      {/* Input Section */}
      <div className="glass-card p-6 sm:p-7 rounded-3xl space-y-4">
        <div className="flex justify-between items-center">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            User Agent String
          </label>
          <button
            onClick={() => setUaString(navigator.userAgent)}
            className="text-xs text-indigo-600 hover:text-indigo-700 font-bold flex items-center gap-1"
          >
            <RefreshCw className="w-3 h-3" /> Auto-Detect My UA
          </button>
        </div>

        <textarea
          rows={3}
          value={uaString}
          onChange={e => setUaString(e.target.value)}
          placeholder="Paste user agent string here..."
          className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-xs leading-relaxed outline-none focus:ring-2 focus:ring-indigo-500"
        />

        {/* Sample UAs */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Test Samples:</span>
          {SAMPLE_UAS.map((sample, idx) => (
            <button
              key={idx}
              onClick={() => setUaString(sample.ua)}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors"
            >
              {sample.name}
            </button>
          ))}
        </div>
      </div>

      {/* Parsed Breakdown Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Browser */}
        <div className="glass-card p-5 rounded-2xl space-y-2 border-indigo-500/20">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
            <Globe className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Browser</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {parsed.browser}
          </div>
          {parsed.browserVersion && (
            <div className="text-xs font-mono text-slate-400">v{parsed.browserVersion}</div>
          )}
        </div>

        {/* Operating System */}
        <div className="glass-card p-5 rounded-2xl space-y-2">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
            <Laptop className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Operating System</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {parsed.os}
          </div>
        </div>

        {/* Device Type */}
        <div className="glass-card p-5 rounded-2xl space-y-2">
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
            <Smartphone className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Device Form Factor</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {parsed.device}
          </div>
        </div>

        {/* Engine */}
        <div className="glass-card p-5 rounded-2xl space-y-2">
          <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
            <Cpu className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Rendering Engine</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {parsed.engine}
          </div>
        </div>
      </div>
    </div>
  );
};
