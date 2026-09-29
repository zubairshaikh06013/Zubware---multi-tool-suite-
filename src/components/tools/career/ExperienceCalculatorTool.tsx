import React, { useState, useMemo } from 'react';
import { 
  Clock, 
  Plus, 
  Trash2, 
  Calendar, 
  Award, 
  Copy, 
  Check, 
  Download, 
  Sparkles, 
  Briefcase, 
  AlertCircle,
  TrendingUp,
  Layers,
  ArrowRight
} from 'lucide-react';

interface JobPeriod {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
}

export const ExperienceCalculatorTool: React.FC<{ onShowToast: (msg: string) => void }> = ({ onShowToast }) => {
  const [jobs, setJobs] = useState<JobPeriod[]>([
    { id: 'j1', company: 'Acme Corp', role: 'Senior Tech Lead', startDate: '2022-04-01', endDate: '', isCurrent: true },
    { id: 'j2', company: 'Global Solutions Ltd', role: 'Software Engineer', startDate: '2019-06-15', endDate: '2022-03-31', isCurrent: false },
    { id: 'j3', company: 'InnoTech Systems', role: 'Associate Developer', startDate: '2017-08-01', endDate: '2019-05-31', isCurrent: false }
  ]);
  const [copied, setCopied] = useState<boolean>(false);

  const addJob = () => {
    setJobs(prev => [
      ...prev,
      { id: `j_${Date.now()}`, company: 'New Company', role: 'Position Title', startDate: '2015-01-01', endDate: '2017-06-30', isCurrent: false }
    ]);
  };

  const removeJob = (id: string) => {
    if (jobs.length <= 1) {
      onShowToast('You must keep at least one employment entry');
      return;
    }
    setJobs(prev => prev.filter(j => j.id !== id));
  };

  // Helper to format duration between two dates
  const formatJobDuration = (startStr: string, endStr: string, isCurrent: boolean) => {
    const start = new Date(startStr);
    const end = isCurrent ? new Date() : new Date(endStr);
    if (isNaN(start.getTime()) || isNaN(end.getTime()) || end < start) {
      return { years: 0, months: 0, days: 0, totalDays: 0, formatted: 'Invalid Date Range' };
    }
    const diffMs = end.getTime() - start.getTime();
    const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const years = Math.floor(totalDays / 365.25);
    const remainingDaysAfterYears = totalDays % 365.25;
    const months = Math.floor(remainingDaysAfterYears / 30.4375);
    const days = Math.floor(remainingDaysAfterYears % 30.4375);

    const parts = [];
    if (years > 0) parts.push(`${years} yr${years > 1 ? 's' : ''}`);
    if (months > 0) parts.push(`${months} mo${months > 1 ? 's' : ''}`);
    if (days > 0 && years === 0) parts.push(`${days} day${days > 1 ? 's' : ''}`);
    return {
      years,
      months,
      days,
      totalDays,
      formatted: parts.join(' ') || '0 days'
    };
  };

  // Merge intervals to avoid double-counting overlapping job dates
  const { totalUniqueDays, totalGrossDays, hasOverlaps, gapCount } = useMemo(() => {
    const validIntervals: { start: number; end: number }[] = [];
    let grossDays = 0;

    jobs.forEach(j => {
      const s = new Date(j.startDate).getTime();
      const e = j.isCurrent ? new Date().getTime() : new Date(j.endDate).getTime();
      if (!isNaN(s) && !isNaN(e) && e >= s) {
        validIntervals.push({ start: s, end: e });
        grossDays += Math.floor((e - s) / (1000 * 60 * 60 * 24));
      }
    });

    if (validIntervals.length === 0) {
      return { totalUniqueDays: 0, totalGrossDays: 0, hasOverlaps: false, gapCount: 0 };
    }

    // Sort intervals by start timestamp
    validIntervals.sort((a, b) => a.start - b.start);

    // Merge
    const merged: { start: number; end: number }[] = [validIntervals[0]];
    for (let i = 1; i < validIntervals.length; i++) {
      const current = validIntervals[i];
      const prev = merged[merged.length - 1];

      if (current.start <= prev.end) {
        prev.end = Math.max(prev.end, current.end);
      } else {
        merged.push(current);
      }
    }

    let uniqueDays = 0;
    merged.forEach(m => {
      uniqueDays += Math.floor((m.end - m.start) / (1000 * 60 * 60 * 24));
    });

    const overlaps = grossDays > uniqueDays;
    const gaps = merged.length - 1;

    return { totalUniqueDays: uniqueDays, totalGrossDays: grossDays, hasOverlaps: overlaps, gapCount: gaps };
  }, [jobs]);

  const years = Math.floor(totalUniqueDays / 365.25);
  const remainingDaysAfterYears = totalUniqueDays % 365.25;
  const months = Math.floor(remainingDaysAfterYears / 30.4375);
  const days = Math.floor(remainingDaysAfterYears % 30.4375);

  // Seniority Level Determination
  const seniorityInfo = useMemo(() => {
    const totalYearsExact = totalUniqueDays / 365.25;
    if (totalYearsExact < 1) return { label: 'Entry Level / Intern', color: 'text-emerald-500', bg: 'bg-emerald-500/10' };
    if (totalYearsExact < 3) return { label: 'Junior Professional', color: 'text-blue-500', bg: 'bg-blue-500/10' };
    if (totalYearsExact < 5) return { label: 'Mid-Level Specialist', color: 'text-indigo-500', bg: 'bg-indigo-500/10' };
    if (totalYearsExact < 8) return { label: 'Senior Professional', color: 'text-purple-500', bg: 'bg-purple-500/10' };
    if (totalYearsExact < 12) return { label: 'Lead / Principal', color: 'text-amber-500', bg: 'bg-amber-500/10' };
    return { label: 'Director / Executive Veteran', color: 'text-rose-500', bg: 'bg-rose-500/10' };
  }, [totalUniqueDays]);

  const copyExperienceSummary = () => {
    const lines = jobs.map((j, idx) => {
      const dur = formatJobDuration(j.startDate, j.endDate, j.isCurrent);
      return `${idx + 1}. ${j.role} at ${j.company} (${j.startDate} to ${j.isCurrent ? 'Present' : j.endDate}) — ${dur.formatted}`;
    });

    const text = `Total Work Experience: ${years} Years, ${months} Months, ${days} Days (${totalUniqueDays.toLocaleString()} days)
Seniority Level: ${seniorityInfo.label}

Employment Breakdown:
${lines.join('\n')}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    onShowToast('Copied experience summary to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const exportExperienceReport = () => {
    const lines = jobs.map((j, idx) => {
      const dur = formatJobDuration(j.startDate, j.endDate, j.isCurrent);
      return `"${idx + 1}","${j.company}","${j.role}","${j.startDate}","${j.isCurrent ? 'Present' : j.endDate}","${dur.formatted}"`;
    });

    const csv = `Index,Company,Role,StartDate,EndDate,Duration\n${lines.join('\n')}\n"Total","Combined Careers","${seniorityInfo.label}","","","${years} Years ${months} Months ${days} Days"`;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `career-experience-summary.csv`;
    a.click();
    URL.revokeObjectURL(url);
    onShowToast('Downloaded career experience CSV!');
  };

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              Work Experience Calculator
            </h2>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${seniorityInfo.bg} ${seniorityInfo.color}`}>
              {seniorityInfo.label}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Calculate exact career duration across multiple jobs, eliminate overlapping dates, and detect career gaps.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={copyExperienceSummary}
            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>Copy Summary</span>
          </button>
          <button
            onClick={exportExperienceReport}
            className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>CSV Export</span>
          </button>
        </div>
      </div>

      {/* Main Stats Card */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl text-center space-y-4 border border-indigo-500/20 bg-gradient-to-br from-indigo-50/20 to-purple-50/10 dark:from-slate-900/60 dark:to-indigo-950/20">
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
          Total Net Work Experience
        </span>
        <div className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white font-mono tracking-tight">
          {years} <span className="text-base sm:text-2xl font-bold text-slate-500">Years</span> {months} <span className="text-base sm:text-2xl font-bold text-slate-500">Months</span> {days} <span className="text-base sm:text-2xl font-bold text-slate-500">Days</span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 text-xs pt-2 border-t border-slate-200/50 dark:border-slate-800/50">
          <span className="text-slate-500 font-medium">
            Total Calendar Days: <strong className="text-slate-900 dark:text-white">{totalUniqueDays.toLocaleString()}</strong>
          </span>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <span className="text-slate-500 font-medium">
            Total Positions: <strong className="text-slate-900 dark:text-white">{jobs.length}</strong>
          </span>
          {hasOverlaps && (
            <>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span className="text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                Overlapping dates merged ({totalGrossDays - totalUniqueDays} duplicate days adjusted)
              </span>
            </>
          )}
        </div>
      </div>

      {/* Employment Timeline Cards */}
      <div className="glass-card p-6 rounded-3xl space-y-5">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-indigo-500" />
            <span>Employment Timeline</span>
          </h3>
          <button
            onClick={addJob}
            className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Add Job
          </button>
        </div>

        <div className="space-y-4">
          {jobs.map((j, idx) => {
            const dur = formatJobDuration(j.startDate, j.endDate, j.isCurrent);

            return (
              <div 
                key={j.id} 
                className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/60 dark:border-slate-800/60 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white font-extrabold text-xs flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                      {j.role || 'Position'} at {j.company || 'Company'}
                    </span>
                    {j.isCurrent && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        Current Role
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-black text-indigo-600 dark:text-indigo-400 font-mono">
                      {dur.formatted}
                    </span>
                    <button
                      onClick={() => removeJob(j.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg transition-colors cursor-pointer"
                      title="Remove Position"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                  <div>
                    <label className="text-slate-500 dark:text-slate-400 text-[11px] font-semibold block mb-1">Company</label>
                    <input
                      type="text"
                      value={j.company}
                      onChange={(e) => {
                        const val = e.target.value;
                        setJobs(prev => prev.map(x => x.id === j.id ? { ...x, company: val } : x));
                      }}
                      className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-slate-900 dark:text-white"
                      placeholder="e.g. Google"
                    />
                  </div>

                  <div>
                    <label className="text-slate-500 dark:text-slate-400 text-[11px] font-semibold block mb-1">Job Title</label>
                    <input
                      type="text"
                      value={j.role}
                      onChange={(e) => {
                        const val = e.target.value;
                        setJobs(prev => prev.map(x => x.id === j.id ? { ...x, role: val } : x));
                      }}
                      className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-slate-900 dark:text-white"
                      placeholder="e.g. Lead Designer"
                    />
                  </div>

                  <div>
                    <label className="text-slate-500 dark:text-slate-400 text-[11px] font-semibold block mb-1">Start Date</label>
                    <input
                      type="date"
                      value={j.startDate}
                      onChange={(e) => {
                        const val = e.target.value;
                        setJobs(prev => prev.map(x => x.id === j.id ? { ...x, startDate: val } : x));
                      }}
                      className="w-full p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-slate-500 dark:text-slate-400 text-[11px] font-semibold">End Date</label>
                      <label className="flex items-center gap-1 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={j.isCurrent}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            setJobs(prev => prev.map(x => x.id === j.id ? { ...x, isCurrent: checked } : x));
                          }}
                          className="rounded text-indigo-600 focus:ring-0 w-3.5 h-3.5"
                        />
                        <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400">Present</span>
                      </label>
                    </div>
                    <input
                      type="date"
                      disabled={j.isCurrent}
                      value={j.endDate}
                      onChange={(e) => {
                        const val = e.target.value;
                        setJobs(prev => prev.map(x => x.id === j.id ? { ...x, endDate: val } : x));
                      }}
                      className="w-full p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-slate-900 dark:text-white disabled:opacity-40"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
