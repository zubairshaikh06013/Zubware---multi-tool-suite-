import React, { useState } from 'react';
import { Copy, Check, Clock, Plus, Trash2, ArrowUpDown, AlertCircle, ShieldCheck } from 'lucide-react';

interface Chapter {
  id: string;
  time: string; // e.g. "00:00" or "01:45"
  title: string;
}

export const YouTubeTimestampGeneratorTool: React.FC<{ onShowToast: (msg: string) => void }> = ({ onShowToast }) => {
  const [chapters, setChapters] = useState<Chapter[]>([
    { id: '1', time: '00:00', title: 'Intro & Summary' },
    { id: '2', time: '01:15', title: 'Key Architecture Concepts' },
    { id: '3', time: '04:30', title: 'Step 1: Setup & Configuration' },
    { id: '4', time: '08:45', title: 'Step 2: Building Core Features' },
    { id: '5', time: '14:20', title: 'Final Demo & Conclusion' },
  ]);
  const [copied, setCopied] = useState(false);

  const addChapter = () => {
    setChapters(previous => [...previous, {
      id: crypto.randomUUID(),
      time: '00:00',
      title: 'New Chapter'
    }]);
  };

  const removeChapter = (id: string) => {
    if (chapters.length <= 1) return;
    setChapters(chapters.filter(c => c.id !== id));
  };

  const updateChapter = (id: string, field: 'time' | 'title', val: string) => {
    setChapters(chapters.map(c => c.id === id ? { ...c, [field]: val } : c));
  };

  // Reject malformed timestamps rather than silently sorting them as 00:00.
  const timeToSeconds = (timeStr: string): number | null => {
    const value = timeStr.trim();
    if (!/^(?:\d+:)?\d{1,2}:\d{2}$/.test(value)) return null;
    const parts = value.split(':').map(Number);
    if (parts.some(part => !Number.isSafeInteger(part))) return null;
    // MM:SS permits minutes above 59 (e.g. 75:30); HH:MM:SS does not.
    if (parts.length === 2 && parts[1] >= 60) return null;
    if (parts.length === 3 && (parts[1] >= 60 || parts[2] >= 60)) return null;
    return parts.reduce((seconds, part) => seconds * 60 + part, 0);
  };

  const chapterSeconds = chapters.map(chapter => timeToSeconds(chapter.time));
  const chapterError = chapterSeconds.some(seconds => seconds === null)
    ? 'Enter valid timestamps (MM:SS or HH:MM:SS, with seconds below 60).'
    : chapterSeconds[0] !== 0
    ? 'The first chapter must start at 00:00.'
    : chapters.length < 3
    ? 'YouTube requires at least three chapters.'
    : chapterSeconds.some((seconds, index) => index > 0 && seconds! - chapterSeconds[index - 1]! < 10)
    ? 'Chapters must be chronological and at least 10 seconds apart.'
    : chapters.some(chapter => !chapter.title.trim())
    ? 'Give every chapter a title.'
    : null;

  const autoSortChronological = () => {
    if (chapterSeconds.some(seconds => seconds === null)) {
      onShowToast('Fix invalid timestamps before sorting.');
      return;
    }
    setChapters([...chapters].sort((a, b) => timeToSeconds(a.time)! - timeToSeconds(b.time)!));
    onShowToast('Timestamps sorted chronologically!');
  };

  const formattedOutput = chapters
    .map(c => `${c.time.trim()} ${c.title.trim()}`)
    .join('\n');

  const handleCopy = async () => {
    if (chapterError) { onShowToast(chapterError); return; }
    try {
      await navigator.clipboard.writeText(formattedOutput);
      setCopied(true);
      onShowToast('Timestamps copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      onShowToast('Clipboard access failed. Please copy the timestamps manually.');
    }
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            YouTube Timestamp Generator
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Build, validate, and auto-sort YouTube Studio video chapter timestamps.
          </p>
        </div>
      </div>

      {/* Validation Banner */}
      <div className={`p-3.5 rounded-2xl border text-xs font-bold flex items-center justify-between gap-3 ${
        !chapterError 
          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400' 
          : 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400'
      }`}>
        <div className="flex items-center gap-2">
          {!chapterError ? (
            <>
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Chapter timestamps meet YouTube's basic formatting requirements.</span>
            </>
          ) : (
            <>
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{chapterError}</span>
            </>
          )}
        </div>

        <button
          onClick={autoSortChronological}
          className="px-3 py-1 bg-white/80 dark:bg-slate-900 text-slate-900 dark:text-white rounded-lg text-xs font-extrabold hover:bg-white cursor-pointer shadow-xs border border-slate-200 dark:border-slate-800 flex items-center gap-1 shrink-0"
        >
          <ArrowUpDown className="w-3.5 h-3.5" /> Auto-Sort
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Editor List */}
        <div className="space-y-3 glass-card p-5 rounded-2xl border border-slate-200/70 dark:border-slate-800">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Chapter List ({chapters.length})
            </h3>
            <button
              onClick={addChapter}
              className="flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Add Chapter
            </button>
          </div>

          <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
            {chapters.map((chap, idx) => (
              <div key={chap.id} className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 w-4 text-center">{idx + 1}</span>
                <input
                  type="text"
                  value={chap.time}
                  onChange={(e) => updateChapter(chap.id, 'time', e.target.value)}
                  placeholder="00:00"
                  className="w-20 px-2.5 py-1.5 font-mono text-xs font-bold rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
                <input
                  type="text"
                  value={chap.title}
                  onChange={(e) => updateChapter(chap.id, 'title', e.target.value)}
                  placeholder="Chapter Title"
                  className="flex-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
                <button
                  onClick={() => removeChapter(chap.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-500 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Output Box */}
        <div className="space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Formatted Timestamps Output
            </h3>
            <textarea
              readOnly
              value={formattedOutput}
              rows={12}
              className="w-full p-4 font-mono text-xs leading-relaxed bg-slate-950 text-indigo-400 rounded-2xl border border-slate-800 focus:outline-none shadow-inner resize-none"
            />
          </div>

          <button
            onClick={handleCopy}
            disabled={!!chapterError}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-300" /> Copied Timestamps!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" /> Copy Formatted Timestamps
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
