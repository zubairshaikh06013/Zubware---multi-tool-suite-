import React, { useState } from 'react';
import { Award, CheckCircle2, XCircle, Percent, Info, Copy, Check } from 'lucide-react';

interface ExamScoreCalculatorToolProps {
  onShowToast: (message: string) => void;
}

export const ExamScoreCalculatorTool: React.FC<ExamScoreCalculatorToolProps> = ({ onShowToast }) => {
  const [totalQuestions, setTotalQuestions] = useState<number>(50);
  const [wrongAnswers, setWrongAnswers] = useState<number>(4);
  const [negativeMarking, setNegativeMarking] = useState<number>(0); // e.g. 0.25
  const [copied, setCopied] = useState<boolean>(false);

  const correctAnswers = Math.max(0, totalQuestions - wrongAnswers);
  const penalty = wrongAnswers * negativeMarking;
  const netScore = Math.max(0, correctAnswers - penalty);
  const percentage = totalQuestions > 0 ? (netScore / totalQuestions) * 100 : 0;

  // Grade classification
  const getLetterGrade = (pct: number) => {
    if (pct >= 97) return { grade: 'A+', label: 'Outstanding' };
    if (pct >= 93) return { grade: 'A', label: 'Excellent' };
    if (pct >= 90) return { grade: 'A-', label: 'Very Good' };
    if (pct >= 87) return { grade: 'B+', label: 'Good' };
    if (pct >= 83) return { grade: 'B', label: 'Above Average' };
    if (pct >= 80) return { grade: 'B-', label: 'Average' };
    if (pct >= 77) return { grade: 'C+', label: 'Competent' };
    if (pct >= 70) return { grade: 'C', label: 'Passing' };
    if (pct >= 60) return { grade: 'D', label: 'Marginal Pass' };
    return { grade: 'F', label: 'Failing' };
  };

  const letter = getLetterGrade(percentage);

  const copyResult = () => {
    const text = `Exam Result: ${netScore}/${totalQuestions} (${percentage.toFixed(1)}% - Grade ${letter.grade})`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    onShowToast('Copied exam result!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 sm:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>📝</span> Exam Score & Grade Calculator
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Calculate percentage score, net marks, letter grades, and negative marking penalties for tests and exams.
          </p>
        </div>
        <button
          onClick={copyResult}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          <span>Copy Score</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input */}
        <div className="lg:col-span-7 glass-card p-6 sm:p-7 rounded-3xl space-y-6">
          <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Award className="w-4 h-4 text-indigo-500" />
            <span>Test Parameters</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Total Questions */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Total Questions
              </label>
              <input
                type="number"
                min="1"
                max="500"
                value={totalQuestions}
                onChange={e => setTotalQuestions(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-sm"
              />
            </div>

            {/* Wrong Answers */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Wrong / Missed
              </label>
              <input
                type="number"
                min="0"
                max={totalQuestions}
                value={wrongAnswers}
                onChange={e => setWrongAnswers(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-sm"
              />
            </div>

            {/* Negative Marking */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Penalty per Wrong
              </label>
              <select
                value={negativeMarking}
                onChange={e => setNegativeMarking(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-xs"
              >
                <option value={0}>None (0 penalty)</option>
                <option value={0.25}>-0.25 marks (1/4)</option>
                <option value={0.33}>-0.33 marks (1/3)</option>
                <option value={0.5}>-0.5 marks (1/2)</option>
                <option value={1}>-1.0 mark</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-card p-6 sm:p-7 rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-slate-500/5 space-y-4">
            <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 block">
              Test Performance Summary
            </span>

            <div className="flex items-baseline justify-between">
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black font-mono text-slate-900 dark:text-white tracking-tight">
                  {percentage.toFixed(1)}%
                </span>
              </div>
              <div className="text-4xl font-black text-indigo-600 dark:text-indigo-400 font-mono">
                {letter.grade}
              </div>
            </div>

            <div className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              {letter.label} Performance
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Correct Answers:</span>
                <span className="font-mono font-bold text-emerald-600">
                  {correctAnswers} / {totalQuestions}
                </span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Wrong / Deducted:</span>
                <span className="font-mono font-bold text-rose-500">
                  -{wrongAnswers} {penalty > 0 ? `(-${penalty.toFixed(2)} pts)` : ''}
                </span>
              </div>
              <div className="flex justify-between font-bold pt-1 border-t border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white">
                <span>Net Final Points:</span>
                <span className="font-mono text-indigo-600">
                  {netScore.toFixed(2)} / {totalQuestions}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
