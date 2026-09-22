import React, { useState } from 'react';
import { Copy, Check, Trash2, Download, FileText, Clock, AlignLeft, Upload, Sparkles, BookOpen, Award, Info } from 'lucide-react';

export const WordCounterTool: React.FC<{ onShowToast: (msg: string) => void }> = ({ onShowToast }) => {
  const [text, setText] = useState(
    `Welcome to Zubware Word Counter & Readability Analyzer!\n\nThis browser-based tool calculates real-time word count, total character count, characters without spaces, sentences, paragraphs, reading time, and estimated speaking duration.\n\nIt also evaluates the readability level of your writing using standard formulas like Flesch Reading Ease and Flesch-Kincaid Grade Level.\n\nYou can type directly, paste text, or drag and drop text files (.txt, .md, .json, .xml, .html) directly into the box below.`
  );
  const [copiedText, setCopiedText] = useState(false);
  const [copiedStats, setCopiedStats] = useState(false);

  // Helper to count syllables in an English word
  const countWordSyllables = (word: string): number => {
    const cleanWord = word.toLowerCase().replace(/[^a-z]/g, '');
    if (!cleanWord) return 0;
    if (cleanWord.length <= 3) return 1;
    const clean = cleanWord.replace(/(?:[^laeiouy]|ed|es|e)$/, '').replace(/^y/, '');
    const matches = clean.match(/[aeiouy]{1,2}/g);
    return matches ? Math.max(1, matches.length) : 1;
  };

  // Stats calculation
  const wordsArray = text.trim() ? text.trim().split(/\s+/).filter(Boolean) : [];
  const words = wordsArray.length;
  const characters = text.length;
  const charsNoSpaces = text.replace(/\s/g, '').length;
  const sentencesArray = text.trim() ? (text.match(/[^.!?]+[.!?]+/g) || [text]).filter(s => s.trim().length > 0) : [];
  const sentences = sentencesArray.length || (words > 0 ? 1 : 0);
  const paragraphs = text.trim() ? text.split(/\n+/).filter(p => p.trim().length > 0).length : 0;
  
  // Syllables & Readability Math
  let totalSyllables = 0;
  let complexWordsCount = 0; // 3 or more syllables
  wordsArray.forEach(w => {
    const syl = countWordSyllables(w);
    totalSyllables += syl;
    if (syl >= 3) complexWordsCount++;
  });

  const avgWordsPerSentence = sentences > 0 ? words / sentences : 0;
  const avgSyllablesPerWord = words > 0 ? totalSyllables / words : 0;
  const avgCharsPerWord = words > 0 ? charsNoSpaces / words : 0;

  // Flesch Reading Ease formula: 206.835 - (1.015 * ASL) - (84.6 * ASW)
  let fleschScore = 0;
  if (words > 0 && sentences > 0) {
    fleschScore = 206.835 - (1.015 * avgWordsPerSentence) - (84.6 * avgSyllablesPerWord);
    fleschScore = Math.max(0, Math.min(100, Math.round(fleschScore * 10) / 10));
  }

  // Flesch-Kincaid Grade Level: (0.39 * ASL) + (11.8 * ASW) - 15.59
  let gradeLevel = 0;
  if (words > 0 && sentences > 0) {
    gradeLevel = (0.39 * avgWordsPerSentence) + (11.8 * avgSyllablesPerWord) - 15.59;
    gradeLevel = Math.max(1, Math.min(18, Math.round(gradeLevel * 10) / 10));
  }

  // Gunning Fog Index: 0.4 * ((words / sentences) + 100 * (complexWords / words))
  let gunningFog = 0;
  if (words > 0 && sentences > 0) {
    const percentComplex = (complexWordsCount / words) * 100;
    gunningFog = 0.4 * (avgWordsPerSentence + percentComplex);
    gunningFog = Math.max(1, Math.min(20, Math.round(gunningFog * 10) / 10));
  }

  const getFleschInterpretation = (score: number) => {
    if (score >= 90) return { label: 'Very Easy (5th Grade)', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800' };
    if (score >= 80) return { label: 'Easy (6th Grade)', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800' };
    if (score >= 70) return { label: 'Fairly Easy (7th Grade)', color: 'text-teal-600 dark:text-teal-400', bg: 'bg-teal-50 dark:bg-teal-950/40 border-teal-200 dark:border-teal-800' };
    if (score >= 60) return { label: 'Standard / Plain English (8th-9th)', color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800' };
    if (score >= 50) return { label: 'Fairly Difficult (High School)', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800' };
    if (score >= 30) return { label: 'Difficult (College Level)', color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-50 dark:bg-orange-950/40 border-orange-200 dark:border-orange-800' };
    return { label: 'Very Confusing / Academic', color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800' };
  };

  const fleschInfo = getFleschInterpretation(fleschScore);
  
  // Reading speed ~200 wpm, Speaking speed ~130 wpm
  const readingSeconds = Math.ceil((words / 200) * 60);
  const speakingSeconds = Math.ceil((words / 130) * 60);

  const formatDuration = (totalSeconds: number) => {
    if (totalSeconds < 60) return `${totalSeconds} sec`;
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins} min ${secs} sec`;
  };

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (content) {
        setText(content);
        onShowToast(`Loaded file: ${file.name}`);
      }
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    onShowToast('Copied text to clipboard!');
    setTimeout(() => setCopiedText(false), 2000);
  };

  const handleCopyStats = () => {
    const statsSummary = `Word Count: ${words}\nCharacters: ${characters}\nCharacters (no spaces): ${charsNoSpaces}\nSentences: ${sentences}\nParagraphs: ${paragraphs}\nReading Time: ${formatDuration(readingSeconds)}\nSpeaking Time: ${formatDuration(speakingSeconds)}\nFlesch Reading Ease: ${fleschScore}/100 (${fleschInfo.label})\nGrade Level: ${gradeLevel}\nGunning Fog: ${gunningFog}`;
    navigator.clipboard.writeText(statsSummary);
    setCopiedStats(true);
    onShowToast('Copied statistics summary!');
    setTimeout(() => setCopiedStats(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'word_counter_text.txt';
    a.click();
    URL.revokeObjectURL(url);
    onShowToast('Downloaded text file!');
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Word Counter & Readability Score Analyzer
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time word, character, sentence, paragraph, reading time, speaking time, and Flesch readability evaluation.
          </p>
        </div>
      </div>

      {/* Grid Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        <div className="glass-card p-3.5 rounded-2xl border border-slate-200/70 dark:border-slate-800 text-center">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Words</span>
          <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1">{words.toLocaleString()}</p>
        </div>

        <div className="glass-card p-3.5 rounded-2xl border border-slate-200/70 dark:border-slate-800 text-center">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Characters</span>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{characters.toLocaleString()}</p>
        </div>

        <div className="glass-card p-3.5 rounded-2xl border border-slate-200/70 dark:border-slate-800 text-center">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">No Spaces</span>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{charsNoSpaces.toLocaleString()}</p>
        </div>

        <div className="glass-card p-3.5 rounded-2xl border border-slate-200/70 dark:border-slate-800 text-center">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Sentences</span>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{sentences.toLocaleString()}</p>
        </div>

        <div className="glass-card p-3.5 rounded-2xl border border-slate-200/70 dark:border-slate-800 text-center">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Paragraphs</span>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{paragraphs.toLocaleString()}</p>
        </div>

        <div className="glass-card p-3.5 rounded-2xl border border-slate-200/70 dark:border-slate-800 text-center col-span-1">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center justify-center gap-1">
            <Clock className="w-3 h-3 text-emerald-500" /> Read Time
          </span>
          <p className="text-base font-black text-emerald-600 dark:text-emerald-400 mt-1">{formatDuration(readingSeconds)}</p>
        </div>

        <div className="glass-card p-3.5 rounded-2xl border border-slate-200/70 dark:border-slate-800 text-center col-span-1">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center justify-center gap-1">
            <Clock className="w-3 h-3 text-amber-500" /> Speak Time
          </span>
          <p className="text-base font-black text-amber-600 dark:text-amber-400 mt-1">{formatDuration(speakingSeconds)}</p>
        </div>
      </div>

      {/* READABILITY & METRICS DASHBOARD */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Flesch Reading Ease Card */}
        <div className={`p-4 rounded-2xl border ${fleschInfo.bg}`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-indigo-500" /> Flesch Reading Ease
            </span>
            <span className="text-xs font-black text-slate-400">0 - 100</span>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className={`text-3xl font-black ${fleschInfo.color}`}>{words > 0 ? fleschScore : '—'}</span>
            <span className="text-xs font-semibold text-slate-500">/ 100</span>
          </div>
          <p className={`text-xs font-bold mt-1 ${fleschInfo.color}`}>{words > 0 ? fleschInfo.label : 'Enter text to calculate'}</p>
        </div>

        {/* Grade Level & Gunning Fog Card */}
        <div className="glass-card p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-500" /> Grade Level & Fog Index
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <div>
              <span className="text-[10px] text-slate-400 font-bold block">FK Grade Level</span>
              <span className="text-xl font-black text-indigo-600 dark:text-indigo-400">{words > 0 ? gradeLevel : '—'}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold block">Gunning Fog Index</span>
              <span className="text-xl font-black text-amber-600 dark:text-amber-400">{words > 0 ? gunningFog : '—'}</span>
            </div>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Estimates US school grade years required to comprehend.</p>
        </div>

        {/* Text Density & Averages Card */}
        <div className="glass-card p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-500" /> Structure Averages
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1 mt-2 text-center">
            <div>
              <span className="text-[9px] text-slate-400 font-bold block">Words/Sent</span>
              <span className="text-sm font-black text-slate-800 dark:text-slate-200">{avgWordsPerSentence.toFixed(1)}</span>
            </div>
            <div>
              <span className="text-[9px] text-slate-400 font-bold block">Chars/Word</span>
              <span className="text-sm font-black text-slate-800 dark:text-slate-200">{avgCharsPerWord.toFixed(1)}</span>
            </div>
            <div>
              <span className="text-[9px] text-slate-400 font-bold block">Syllables/Word</span>
              <span className="text-sm font-black text-slate-800 dark:text-slate-200">{avgSyllablesPerWord.toFixed(1)}</span>
            </div>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Average structural density per sentence & word unit.</p>
        </div>
      </div>

      {/* Language Disclaimer Note */}
      <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 flex items-start gap-2 text-[11px] text-slate-500 dark:text-slate-400">
        <Info className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
        <span>
          <strong>Language Note:</strong> Word, character, and duration counters support all international scripts (including Hindi, Devanagari, Arabic, Chinese). Readability formulas (Flesch & Gunning Fog) are mathematically calibrated for Latin/English syllable structures.
        </span>
      </div>

      {/* Input Area + Controls */}
      <div className="space-y-3" onDragOver={(e) => e.preventDefault()} onDrop={handleDrop}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <AlignLeft className="w-4 h-4 text-indigo-500" /> Text Input / File Drop Zone
          </label>
          <div className="flex flex-wrap items-center gap-2">
            <label className="px-3 py-1.5 text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl cursor-pointer transition-all flex items-center gap-1">
              <Upload className="w-3.5 h-3.5" /> Upload File
              <input
                type="file"
                accept=".txt,.md,.json,.xml,.html,.csv"
                onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                className="hidden"
              />
            </label>
            <button
              onClick={handleCopyStats}
              className="px-3 py-1.5 text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl transition-all cursor-pointer flex items-center gap-1"
            >
              {copiedStats ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedStats ? 'Stats Copied' : 'Copy Stats'}
            </button>
            <button
              onClick={() => { setText(''); onShowToast('Cleared text!'); }}
              className="px-3 py-1.5 text-xs font-bold bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 rounded-xl transition-all cursor-pointer flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear
            </button>
          </div>
        </div>

        <textarea
          rows={12}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste or type your text here, or drag & drop a text file..."
          className="w-full p-4 text-sm rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed font-sans"
        />

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <p className="text-xs text-slate-400">
            Supports TXT, MD, HTML, XML, JSON drag & drop file imports.
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              disabled={!text}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-900 dark:bg-slate-800 dark:hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" /> Download TXT
            </button>

            <button
              onClick={handleCopyText}
              disabled={!text}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5 shadow-sm"
            >
              {copiedText ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedText ? 'Copied!' : 'Copy Text'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

