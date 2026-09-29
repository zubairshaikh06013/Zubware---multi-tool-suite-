import React, { useState } from 'react';
import { 
  Award, 
  CheckCircle2, 
  XCircle, 
  Percent, 
  Info, 
  Copy, 
  Check, 
  Sparkles, 
  Plus, 
  Trash2, 
  Target, 
  BarChart3, 
  Download 
} from 'lucide-react';

interface ExamScoreCalculatorToolProps {
  onShowToast: (message: string) => void;
}

interface SectionItem {
  id: string;
  name: string;
  scored: number;
  total: number;
  weight: number; // percentage (e.g. 40)
}

export const ExamScoreCalculatorTool: React.FC<ExamScoreCalculatorToolProps> = ({ onShowToast }) => {
  const [calcMode, setCalcMode] = useState<'standard' | 'weighted' | 'target'>('standard');

  // Standard Mode
  const [totalQuestions, setTotalQuestions] = useState<number>(100);
  const [wrongAnswers, setWrongAnswers] = useState<number>(12);
  const [unanswered, setUnanswered] = useState<number>(8);
  const [negativeMarking, setNegativeMarking] = useState<number>(0.25); // e.g. 0.25 per wrong answer
  const [pointsPerCorrect, setPointsPerCorrect] = useState<number>(1);

  // Weighted Mode
  const [sections, setSections] = useState<SectionItem[]>([
    { id: '1', name: 'Midterm Exam', scored: 84, total: 100, weight: 25 },
    { id: '2', name: 'Assignments & Labs', scored: 95, total: 100, weight: 25 },
    { id: '3', name: 'Final Examination', scored: 88, total: 100, weight: 50 },
  ]);

  // Target Mode
  const [currentScore, setCurrentScore] = useState<number>(78);
  const [currentWeight, setCurrentWeight] = useState<number>(60); // % of course done
  const [targetFinalGrade, setTargetFinalGrade] = useState<number>(85); // % desired overall

  const [copied, setCopied] = useState<boolean>(false);

  // Calculations for Standard Mode
  const correctCount = Math.max(0, totalQuestions - wrongAnswers - unanswered);
  const penalty = wrongAnswers * negativeMarking;
  const netScore = Math.max(0, correctCount * pointsPerCorrect - penalty);
  const maxPossibleScore = totalQuestions * pointsPerCorrect;
  const percentage = maxPossibleScore > 0 ? (netScore / maxPossibleScore) * 100 : 0;
  const accuracy = (correctCount + wrongAnswers) > 0 ? (correctCount / (correctCount + wrongAnswers)) * 100 : 0;

  // Grade classification
  const getLetterGrade = (pct: number) => {
    if (pct >= 97) return { grade: 'A+', gpa: '4.0', label: 'Outstanding Honors', color: 'text-emerald-500' };
    if (pct >= 93) return { grade: 'A', gpa: '4.0', label: 'Superior Achievement', color: 'text-emerald-500' };
    if (pct >= 90) return { grade: 'A-', gpa: '3.7', label: 'Excellent', color: 'text-emerald-500' };
    if (pct >= 87) return { grade: 'B+', gpa: '3.3', label: 'Very Good', color: 'text-indigo-500' };
    if (pct >= 83) return { grade: 'B', gpa: '3.0', label: 'Good', color: 'text-indigo-500' };
    if (pct >= 80) return { grade: 'B-', gpa: '2.7', label: 'Above Average', color: 'text-indigo-500' };
    if (pct >= 77) return { grade: 'C+', gpa: '2.3', label: 'Competent', color: 'text-amber-500' };
    if (pct >= 70) return { grade: 'C', gpa: '2.0', label: 'Average Passing', color: 'text-amber-500' };
    if (pct >= 60) return { grade: 'D', gpa: '1.0', label: 'Marginal Pass', color: 'text-amber-600' };
    return { grade: 'F', gpa: '0.0', label: 'Failing / No Credit', color: 'text-rose-500' };
  };

  // Calculations for Weighted Mode
  const weightedPercentage = sections.reduce((acc, sec) => {
    const secPct = sec.total > 0 ? (sec.scored / sec.total) : 0;
    return acc + (secPct * sec.weight);
  }, 0);
  const totalWeight = sections.reduce((acc, s) => acc + s.weight, 0);

  // Calculations for Target Mode
  const remainingWeight = Math.max(0, 100 - currentWeight);
  const neededScoreOnRemaining = remainingWeight > 0
    ? (targetFinalGrade - (currentScore * (currentWeight / 100))) / (remainingWeight / 100)
    : 0;

  const currentGradeObj = getLetterGrade(calcMode === 'standard' ? percentage : weightedPercentage);

  const copyResult = () => {
    let text = '';
    if (calcMode === 'standard') {
      text = `Exam Score: ${netScore.toFixed(2)}/${maxPossibleScore} (${percentage.toFixed(1)}%) | Grade: ${currentGradeObj.grade} (GPA: ${currentGradeObj.gpa}) | Correct: ${correctCount}, Wrong: ${wrongAnswers}, Unanswered: ${unanswered}`;
    } else if (calcMode === 'weighted') {
      text = `Weighted Course Grade: ${weightedPercentage.toFixed(1)}% | Grade: ${currentGradeObj.grade} (GPA: ${currentGradeObj.gpa}) | ${sections.length} assessment components`;
    } else {
      text = `Target Score Goal: Need ${neededScoreOnRemaining.toFixed(1)}% on remaining ${remainingWeight}% of coursework to achieve ${targetFinalGrade}% final grade.`;
    }

    navigator.clipboard.writeText(text);
    setCopied(true);
    onShowToast('Copied score summary to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const addSection = () => {
    setSections(prev => [
      ...prev,
      { id: `sec_${Date.now()}`, name: `Assessment ${prev.length + 1}`, scored: 80, total: 100, weight: 20 }
    ]);
  };

  const removeSection = (id: string) => {
    setSections(prev => prev.filter(s => s.id !== id));
  };

  return (
    <div className="p-6 sm:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            Academic & Exam Score Calculator
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Calculate test percentages, negative marks, weighted semester grades, and required final exam target scores.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Mode Switcher */}
          <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl flex items-center text-xs font-bold">
            <button
              onClick={() => setCalcMode('standard')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                calcMode === 'standard' ? 'bg-white dark:bg-slate-900 text-indigo-600 shadow-sm' : 'text-slate-500'
              }`}
            >
              Test Scoring
            </button>
            <button
              onClick={() => setCalcMode('weighted')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                calcMode === 'weighted' ? 'bg-white dark:bg-slate-900 text-indigo-600 shadow-sm' : 'text-slate-500'
              }`}
            >
              Weighted Course
            </button>
            <button
              onClick={() => setCalcMode('target')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                calcMode === 'target' ? 'bg-white dark:bg-slate-900 text-indigo-600 shadow-sm' : 'text-slate-500'
              }`}
            >
              Target Needed
            </button>
          </div>

          <button
            onClick={copyResult}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>Copy Score</span>
          </button>
        </div>
      </div>

      {calcMode === 'standard' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Inputs 7 Cols */}
          <div className="lg:col-span-7 glass-card p-6 sm:p-7 rounded-3xl space-y-6">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Award className="w-4 h-4 text-indigo-500" />
              <span>Exam Question Breakdown</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Total Questions
                </label>
                <input
                  type="number"
                  min="1"
                  max="1000"
                  value={totalQuestions}
                  onChange={e => setTotalQuestions(Math.max(1, Number(e.target.value)))}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Incorrect Answers
                </label>
                <input
                  type="number"
                  min="0"
                  max={totalQuestions}
                  value={wrongAnswers}
                  onChange={e => setWrongAnswers(Math.max(0, Number(e.target.value)))}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-sm text-rose-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Blank / Unanswered
                </label>
                <input
                  type="number"
                  min="0"
                  max={totalQuestions}
                  value={unanswered}
                  onChange={e => setUnanswered(Math.max(0, Number(e.target.value)))}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-sm text-slate-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Points Per Correct Answer
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="0.1"
                  value={pointsPerCorrect}
                  onChange={e => setPointsPerCorrect(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Negative Marking Penalty (Per Wrong)
                </label>
                <select
                  value={negativeMarking}
                  onChange={e => setNegativeMarking(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-xs"
                >
                  <option value={0}>0 (No Penalty)</option>
                  <option value={0.25}>-0.25 (1/4 Mark Off)</option>
                  <option value={0.333}>-0.33 (1/3 Mark Off)</option>
                  <option value={0.5}>-0.50 (1/2 Mark Off)</option>
                  <option value={1}>-1.00 (Full Mark Penalty)</option>
                </select>
              </div>
            </div>

            {/* Questions Distribution Bar */}
            <div className="space-y-2 pt-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-emerald-600">Correct: {correctCount}</span>
                <span className="text-rose-600">Wrong: {wrongAnswers}</span>
                <span className="text-slate-500">Skipped: {unanswered}</span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden flex">
                <div style={{ width: `${(correctCount / totalQuestions) * 100}%` }} className="bg-emerald-500 h-full" />
                <div style={{ width: `${(wrongAnswers / totalQuestions) * 100}%` }} className="bg-rose-500 h-full" />
                <div style={{ width: `${(unanswered / totalQuestions) * 100}%` }} className="bg-slate-400 h-full" />
              </div>
            </div>
          </div>

          {/* Results Summary 5 Cols */}
          <div className="lg:col-span-5 space-y-4">
            <div className="glass-card p-6 rounded-3xl space-y-5 border border-indigo-500/20 bg-gradient-to-br from-indigo-50/20 to-purple-50/10 dark:from-slate-900/60 dark:to-indigo-950/20">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Performance Score Card
                </span>
                <span className={`text-2xl font-black ${currentGradeObj.color}`}>
                  Grade {currentGradeObj.grade}
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-2xl bg-indigo-600 text-white flex flex-col items-center justify-center shadow-lg">
                  <span className="text-2xl font-black">{percentage.toFixed(1)}%</span>
                  <span className="text-[10px] font-bold opacity-80">SCORE</span>
                </div>

                <div className="space-y-1">
                  <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
                    {currentGradeObj.label}
                  </h4>
                  <p className="text-xs text-slate-500">
                    GPA Equivalent: <span className="font-bold text-indigo-600">{currentGradeObj.gpa} / 4.0</span>
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs pt-2">
                <div className="p-3 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Net Marks</span>
                  <span className="text-base font-black text-slate-900 dark:text-white">
                    {netScore.toFixed(2)} / {maxPossibleScore}
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Accuracy Rate</span>
                  <span className="text-base font-black text-indigo-600 dark:text-indigo-400">
                    {accuracy.toFixed(1)}%
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Penalty Deducted</span>
                  <span className="text-base font-black text-rose-500">
                    -{penalty.toFixed(2)} pts
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Passing Status</span>
                  <span className={`text-base font-black ${percentage >= 60 ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {percentage >= 60 ? 'PASSED' : 'FAILED'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {calcMode === 'weighted' && (
        <div className="space-y-6">
          <div className="glass-card p-6 rounded-3xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Course Assessment Components
              </h3>
              <button
                onClick={addSection}
                className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Component</span>
              </button>
            </div>

            <div className="space-y-3">
              {sections.map((sec, idx) => (
                <div key={sec.id} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center gap-3 text-xs">
                  <input
                    type="text"
                    value={sec.name}
                    onChange={e => {
                      const val = e.target.value;
                      setSections(prev => prev.map(s => s.id === sec.id ? { ...s, name: val } : s));
                    }}
                    className="flex-1 min-w-[150px] px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border font-bold"
                  />

                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-400">Score:</span>
                    <input
                      type="number"
                      value={sec.scored}
                      onChange={e => {
                        const val = Number(e.target.value);
                        setSections(prev => prev.map(s => s.id === sec.id ? { ...s, scored: val } : s));
                      }}
                      className="w-16 px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 border font-bold text-center"
                    />
                    <span className="text-slate-400">/</span>
                    <input
                      type="number"
                      value={sec.total}
                      onChange={e => {
                        const val = Number(e.target.value);
                        setSections(prev => prev.map(s => s.id === sec.id ? { ...s, total: val } : s));
                      }}
                      className="w-16 px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 border font-bold text-center"
                    />
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-400">Weight:</span>
                    <input
                      type="number"
                      value={sec.weight}
                      onChange={e => {
                        const val = Number(e.target.value);
                        setSections(prev => prev.map(s => s.id === sec.id ? { ...s, weight: val } : s));
                      }}
                      className="w-16 px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 border font-bold text-center"
                    />
                    <span className="font-bold">%</span>
                  </div>

                  <button
                    onClick={() => removeSection(sec.id)}
                    className="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded-xl"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-2 text-xs font-bold">
              <span>Total Weight Allocated: <span className={totalWeight === 100 ? 'text-emerald-500' : 'text-amber-500'}>{totalWeight}%</span></span>
              {totalWeight !== 100 && <span className="text-amber-500">Note: Weights should ideally sum to 100%</span>}
            </div>
          </div>

          <div className="glass-card p-6 rounded-3xl flex items-center justify-between border border-indigo-500/20 bg-indigo-50/20 dark:bg-slate-900/60">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase block">Overall Weighted Grade</span>
              <div className="text-3xl font-black text-indigo-600 dark:text-indigo-400 font-mono">
                {weightedPercentage.toFixed(2)}%
              </div>
            </div>
            <div className="text-right">
              <span className={`text-2xl font-black ${currentGradeObj.color}`}>Grade {currentGradeObj.grade}</span>
              <p className="text-xs text-slate-500">{currentGradeObj.label} (GPA: {currentGradeObj.gpa})</p>
            </div>
          </div>
        </div>
      )}

      {calcMode === 'target' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <div className="glass-card p-6 rounded-3xl space-y-4">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <Target className="w-4 h-4 text-indigo-500" />
              <span>Target Final Grade Parameters</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Current Course Average (%)
                </label>
                <input
                  type="number"
                  value={currentScore}
                  onChange={e => setCurrentScore(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border font-bold text-sm"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Course Weight Completed So Far (%)
                </label>
                <input
                  type="number"
                  value={currentWeight}
                  onChange={e => setCurrentWeight(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border font-bold text-sm"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Desired Final Grade Target (%)
                </label>
                <input
                  type="number"
                  value={targetFinalGrade}
                  onChange={e => setTargetFinalGrade(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border font-bold text-sm text-indigo-600"
                />
              </div>
            </div>
          </div>

          <div className="glass-card p-6 rounded-3xl space-y-4 border border-indigo-500/20 bg-indigo-50/20 dark:bg-slate-900/60">
            <span className="text-xs font-bold text-slate-500 uppercase block">Required Score on Final Assessment</span>
            <div className={`text-4xl font-black font-mono ${neededScoreOnRemaining <= 100 ? 'text-emerald-500' : 'text-rose-500'}`}>
              {neededScoreOnRemaining.toFixed(1)}%
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {neededScoreOnRemaining <= 100 
                ? `You need to score at least ${neededScoreOnRemaining.toFixed(1)}% on the final ${remainingWeight}% of the coursework to finish with a ${targetFinalGrade}% grade.`
                : `A score of ${neededScoreOnRemaining.toFixed(1)}% is mathematically required, which exceeds 100% without extra credit.`}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
