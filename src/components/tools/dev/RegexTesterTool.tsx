import React, { useEffect, useState } from 'react';
import type { RegexResult } from '../../../lib/regexEvaluation';
import { Code2, Sparkles, CheckCircle2, AlertOctagon, HelpCircle } from 'lucide-react';

export const RegexTesterTool: React.FC<{ onShowToast: (msg: string) => void }> = ({ onShowToast }) => {
  const [pattern, setPattern] = useState<string>('([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+\\.[a-zA-Z]{2,})');
  const [flags, setFlags] = useState<{ [key: string]: boolean }>({
    g: true,
    i: true,
    m: false,
    s: false,
    u: false,
    y: false
  });

  const [testText, setTestText] = useState<string>(
    `Hello developer! Reach out to us at support@zubware.com or sales@example.org for questions. Invalid emails: test@com or @domain.com.`
  );

  const flagStr = Object.keys(flags)
    .filter((k) => flags[k])
    .join('');

  // Presets
  const presets = [
    { label: 'Email Address', regex: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}' },
    { label: 'URL Pattern', regex: 'https?://(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)' },
    { label: 'IPv4 Address', regex: '\\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\b' },
    { label: 'HEX Color', regex: '#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})' },
    { label: 'Date (YYYY-MM-DD)', regex: '\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])' },
    { label: 'Phone Number', regex: '\\+?[1-9]\\d{1,14}' }
  ];

  const [result, setResult] = useState<RegexResult>({matches: [], error: null, truncated: false});
  const [evaluating, setEvaluating] = useState(false);
  useEffect(() => {
    setResult({matches: [], error: null, truncated: false});
    if (!pattern) { setEvaluating(false); return; }
    if (testText.length > 200000 || pattern.length > 10000) {
      setEvaluating(false);
      setResult({matches: [], error: 'Use at most 200,000 text characters and 10,000 pattern characters.', truncated: false});
      return;
    }
    setEvaluating(true);
    let worker: Worker | undefined;
    let deadline: ReturnType<typeof setTimeout> | undefined;
    const timer = setTimeout(() => {
      const fail = (message: string) => {
        worker?.terminate(); clearTimeout(deadline); setEvaluating(false);
        setResult({matches: [], error: message, truncated: false});
      };
      try {
        worker = new Worker(new URL('../../../workers/regex.worker.ts', import.meta.url), {type: 'module'});
        deadline = setTimeout(() => fail('Evaluation stopped after 2 seconds. Simplify the pattern or shorten the text.'), 2000);
        worker.onmessage = (event: MessageEvent<RegexResult>) => {
          clearTimeout(deadline); worker?.terminate(); setResult(event.data); setEvaluating(false);
        };
        worker.onerror = () => fail('Regex worker could not run in this browser.');
        worker.postMessage({pattern, flags: flagStr, text: testText});
      } catch { fail('Regex worker could not start in this browser.'); }
    }, 150);
    return () => { clearTimeout(timer); clearTimeout(deadline); worker?.terminate(); };
  }, [pattern, flagStr, testText]);
  const {matches, error, truncated} = result;

  // Explain Regex tokens in simple terms
  const explainRegex = (regexPattern: string) => {
    const explanations: { token: string; desc: string }[] = [];
    if (regexPattern.includes('@')) explanations.push({ token: '@', desc: 'Matches literal "@" symbol' });
    if (regexPattern.includes('[a-zA-Z]')) explanations.push({ token: '[a-zA-Z]', desc: 'Matches any English letter (uppercase or lowercase)' });
    if (regexPattern.includes('\\d')) explanations.push({ token: '\\d', desc: 'Matches any digit character (0-9)' });
    if (regexPattern.includes('+')) explanations.push({ token: '+', desc: 'Quantifier: Matches 1 or more occurrences of preceding element' });
    if (regexPattern.includes('*')) explanations.push({ token: '*', desc: 'Quantifier: Matches 0 or more occurrences of preceding element' });
    if (regexPattern.includes('?')) explanations.push({ token: '?', desc: 'Quantifier: Makes preceding element optional (0 or 1)' });
    if (regexPattern.includes('^')) explanations.push({ token: '^', desc: 'Anchor: Matches start of line or string' });
    if (regexPattern.includes('$')) explanations.push({ token: '$', desc: 'Anchor: Matches end of line or string' });
    if (regexPattern.includes('(')) explanations.push({ token: '(...)', desc: 'Capturing Group: Groups multiple tokens together to extract sub-matches' });

    if (explanations.length === 0) {
      explanations.push({ token: regexPattern, desc: 'Literal string or custom character sequence matching' });
    }
    return explanations;
  };

  // Highlight matches inside test text
  const renderHighlightedText = () => {
    if (!pattern || error || matches.length === 0) return testText;

    const parts = [];
    let lastIndex = 0;

    matches.forEach((m, idx) => {
      if (m.index > lastIndex) {
        parts.push(testText.substring(lastIndex, m.index));
      }
      parts.push(
        <mark
          key={idx}
          className="bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border border-indigo-500/40 font-bold rounded-sm px-1"
        >
          {m.match}
        </mark>
      );
      lastIndex = m.index + m.match.length;
    });

    if (lastIndex < testText.length) {
      parts.push(testText.substring(lastIndex));
    }

    return parts;
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Code2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Regex Tester & Explainer
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Test regular expressions against sample text with live highlights, group extraction, and pattern token explanations.
          </p>
        </div>
      </div>

      {/* Presets Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-xs font-bold text-slate-400 shrink-0">Presets:</span>
        {presets.map((p) => (
          <button
            key={p.label}
            onClick={() => {
              setPattern(p.regex);
              onShowToast(`Loaded preset: ${p.label}`);
            }}
            className="px-2.5 py-1 text-xs font-bold rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-all shrink-0 cursor-pointer"
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Expression Input & Flags */}
      <div className="glass-card p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-3">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
          Regular Expression (Pattern)
        </label>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex-1 flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 font-mono text-xs">
            <span className="text-slate-400 font-bold mr-1">/</span>
            <input
              type="text"
              aria-label="Regular expression"
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              placeholder="Enter regex pattern..."
              className="w-full bg-transparent text-slate-900 dark:text-white focus:outline-none font-bold"
            />
            <span className="text-slate-400 font-bold ml-1">/{flagStr}</span>
          </div>
        </div>

        {/* Flag Checkboxes */}
        <div className="flex flex-wrap items-center gap-3 pt-1">
          <span className="text-xs font-bold text-slate-500">Flags:</span>
          {[
            { id: 'g', label: 'Global (g)' },
            { id: 'i', label: 'Case Insensitive (i)' },
            { id: 'm', label: 'Multiline (m)' },
            { id: 's', label: 'Dotall (s)' },
            { id: 'u', label: 'Unicode (u)' },
            { id: 'y', label: 'Sticky (y)' }
          ].map((flag) => (
            <label
              key={flag.id}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={flags[flag.id]}
                onChange={(e) => setFlags({ ...flags, [flag.id]: e.target.checked })}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
              />
              {flag.label}
            </label>
          ))}
        </div>
      </div>

      {/* Error state */}
      <p role="status" className="text-xs text-slate-500">{evaluating ? "Evaluating pattern…" : truncated ? "Showing the first 1,000 matches. Narrow the pattern to see fewer results." : "Evaluation runs in a separate worker with a 2-second limit."}</p>
      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-center gap-2">
          <AlertOctagon className="w-5 h-5 shrink-0" />
          {error}
        </div>
      )}

      {/* Test String and Highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Test String</label>
          <textarea aria-label="Test text"
            rows={8}
            value={testText}
            onChange={(e) => setTestText(e.target.value)}
            placeholder="Type or paste sample text here to test match..."
            className="w-full p-4 text-xs font-mono rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Highlighted Matches</label>
            <span className="text-xs font-black text-slate-500">
              {matches.length} Match{matches.length === 1 ? '' : 'es'} Found
            </span>
          </div>
          <div className="w-full p-4 text-xs font-mono rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white leading-relaxed min-h-[160px] whitespace-pre-wrap break-all">
            {renderHighlightedText()}
          </div>
        </div>
      </div>

      {/* Match Details & Explanation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Matches List */}
        <div className="glass-card p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-3">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Extracted Matches
          </h3>
          {matches.length === 0 ? (
            <p className="text-xs text-slate-400 italic">No matches found for current pattern.</p>
          ) : (
            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
              {matches.map((m, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-800 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-indigo-600 dark:text-indigo-400 font-mono">Match #{idx + 1}: "{m.match}"</span>
                    <span className="text-[10px] text-slate-400">Index: {m.index}</span>
                  </div>
                  {m.groups.length > 0 && (
                    <div className="pt-1 text-[11px] text-slate-500 space-y-0.5 font-mono">
                      {m.groups.map((g, gIdx) => (
                        <p key={gIdx}>Group ${gIdx + 1}: {g}</p>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pattern Explanation */}
        <div className="glass-card p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-3">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-indigo-500" /> Token Breakdown Explanation
          </h3>
          <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
            {explainRegex(pattern).map((item, i) => (
              <div key={i} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between gap-3 text-xs">
                <code className="font-bold text-purple-600 dark:text-purple-400 font-mono bg-purple-500/10 px-2 py-0.5 rounded-md">
                  {item.token}
                </code>
                <span className="text-slate-600 dark:text-slate-400 text-right">{item.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
