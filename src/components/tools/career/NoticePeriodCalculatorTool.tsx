import React, { useState } from 'react';
import { Calendar, DollarSign, Clock, Copy, Check, Mail, AlertCircle, FileText, ChevronRight, Sparkles } from 'lucide-react';

interface NoticePeriodCalculatorToolProps {
  onShowToast: (msg: string) => void;
}

const CURRENCIES = [
  { symbol: '$', code: 'USD' },
  { symbol: '₹', code: 'INR' },
  { symbol: '€', code: 'EUR' },
  { symbol: '£', code: 'GBP' },
  { symbol: 'C$', code: 'CAD' },
  { symbol: 'A$', code: 'AUD' }
];

export const NoticePeriodCalculatorTool: React.FC<NoticePeriodCalculatorToolProps> = ({ onShowToast }) => {
  const [resignationDate, setResignationDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [noticeDurationType, setNoticeDurationType] = useState<'days' | 'months' | 'weeks'>('days');
  const [noticeValue, setNoticeValue] = useState<number>(60);
  const [leaveDaysAvailable, setLeaveDaysAvailable] = useState<number>(5);
  const [adjustLeaves, setAdjustLeaves] = useState<boolean>(true);
  const [monthlySalary, setMonthlySalary] = useState<number>(85000);
  const [buyoutDays, setBuyoutDays] = useState<number>(15);
  const [currency, setCurrency] = useState(CURRENCIES[0]);
  const [copiedLwd, setCopiedLwd] = useState<boolean>(false);
  const [copiedEmail, setCopiedEmail] = useState<boolean>(false);

  // Email template fields
  const [managerName, setManagerName] = useState<string>('Alex Johnson');
  const [jobTitle, setJobTitle] = useState<string>('Senior Software Engineer');
  const [companyName, setCompanyName] = useState<string>('Acme Corp');

  // Convert notice to total calendar days
  let totalNoticeDays = noticeValue;
  if (noticeDurationType === 'months') {
    totalNoticeDays = noticeValue * 30;
  } else if (noticeDurationType === 'weeks') {
    totalNoticeDays = noticeValue * 7;
  }

  // Adjusted notice days after leaves
  const effectiveNoticeDays = adjustLeaves
    ? Math.max(0, totalNoticeDays - leaveDaysAvailable)
    : totalNoticeDays;

  // Calculate Last Working Day (LWD)
  const resign = new Date(resignationDate);
  const lwdDate = new Date(resign);
  lwdDate.setDate(lwdDate.getDate() + effectiveNoticeDays);

  const formattedLwd = isNaN(lwdDate.getTime()) ? 'Invalid Date' : lwdDate.toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Calculate Days Remaining from today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diffTime = lwdDate.getTime() - today.getTime();
  const daysRemaining = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  // Buyout calculations
  const perDaySalary = monthlySalary / 30;
  const estimatedBuyoutAmount = Math.round(perDaySalary * buyoutDays);

  // Professional Resignation Email Template
  const emailBody = `Dear ${managerName || '[Manager Name]'},

Please accept this email as formal notification that I am resigning from my position as ${jobTitle || '[Job Title]'} at ${companyName || '[Company Name]'}.

As per my employment contract, my notice period is ${noticeValue} ${noticeDurationType}${adjustLeaves && leaveDaysAvailable > 0 ? `, adjusted by ${leaveDaysAvailable} accrued paid leaves` : ''}. Therefore, my official Last Working Day (LWD) will be ${formattedLwd}.

During this transition period, I am fully committed to completing my current project deliverables and ensuring a seamless handover to the team. Please let me know how I can best assist with the transition.

I want to express my sincere gratitude for the opportunities and professional growth I have experienced during my tenure here. I wish ${companyName || 'the company'} continued success.

Sincerely,
[Your Name]`;

  const handleCopyLwd = () => {
    navigator.clipboard.writeText(`Official Last Working Day (LWD): ${formattedLwd} (Resigned: ${resignationDate}, Notice: ${noticeValue} ${noticeDurationType})`);
    setCopiedLwd(true);
    onShowToast('Last Working Day copied!');
    setTimeout(() => setCopiedLwd(false), 2000);
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(emailBody);
    setCopiedEmail(true);
    onShowToast('Resignation email template copied to clipboard!');
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <div className="p-4 sm:p-8 space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <Calendar className="w-5 h-5" />
            </span>
            Notice Period & Last Working Day (LWD) Calculator
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Calculate your exact last working day, adjust for accrued leaves, estimate buyout costs, and generate your resignation letter.
          </p>
        </div>

        {/* Currency Switcher */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500">Currency:</span>
          <select
            value={currency.code}
            onChange={(e) => {
              const selected = CURRENCIES.find(c => c.code === e.target.value) || CURRENCIES[0];
              setCurrency(selected);
            }}
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {CURRENCIES.map(c => (
              <option key={c.code} value={c.code}>{c.code} ({c.symbol})</option>
            ))}
          </select>
        </div>
      </div>

      {/* Hero Result Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 text-white shadow-2xl relative overflow-hidden border border-indigo-500/30">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="inline-block px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 font-extrabold text-[11px] tracking-wider uppercase">
              Official Last Working Day (LWD)
            </span>
            <div className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              {formattedLwd}
            </div>
            <p className="text-xs sm:text-sm text-indigo-200/80">
              {effectiveNoticeDays} calendar days from resignation submission • {daysRemaining} days remaining from today
            </p>
          </div>

          <button
            onClick={handleCopyLwd}
            className="px-4 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs flex items-center gap-2 transition-all cursor-pointer backdrop-blur-sm shrink-0 self-start sm:self-center"
          >
            {copiedLwd ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copiedLwd ? 'Copied Date!' : 'Copy LWD Date'}</span>
          </button>
        </div>
      </div>

      {/* Grid: Inputs & Buyout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Inputs (6 cols) */}
        <div className="lg:col-span-6 glass-card p-6 rounded-3xl space-y-5 border border-slate-200/80 dark:border-slate-800">
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-500" />
            Notice Period Parameters
          </h3>

          {/* Resignation Submission Date */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Resignation Submission Date
            </label>
            <input
              type="date"
              value={resignationDate}
              onChange={(e) => setResignationDate(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Notice Period Duration & Unit */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Notice Period Duration
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                min="1"
                max="365"
                value={noticeValue}
                onChange={(e) => setNoticeValue(Math.max(1, Number(e.target.value)))}
                className="w-28 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <select
                value={noticeDurationType}
                onChange={(e) => setNoticeDurationType(e.target.value as any)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="days">Days</option>
                <option value="weeks">Weeks</option>
                <option value="months">Months (30 days/mo)</option>
              </select>
            </div>

            {/* Quick Presets */}
            <div className="flex gap-1.5 pt-1">
              {[30, 60, 90].map((d) => (
                <button
                  key={d}
                  onClick={() => { setNoticeDurationType('days'); setNoticeValue(d); }}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    noticeDurationType === 'days' && noticeValue === d ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {d} Days
                </button>
              ))}
              <button
                onClick={() => { setNoticeDurationType('months'); setNoticeValue(1); }}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  noticeDurationType === 'months' && noticeValue === 1 ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                1 Month
              </button>
              <button
                onClick={() => { setNoticeDurationType('months'); setNoticeValue(3); }}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  noticeDurationType === 'months' && noticeValue === 3 ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                3 Months
              </button>
            </div>
          </div>

          {/* Leave Adjustment */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2.5">
            <label className="flex items-center gap-2 cursor-pointer font-bold text-xs text-slate-800 dark:text-slate-200">
              <input
                type="checkbox"
                checked={adjustLeaves}
                onChange={(e) => setAdjustLeaves(e.target.checked)}
                className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
              />
              <span>Offset Available Accrued Paid Leaves against Notice</span>
            </label>

            {adjustLeaves && (
              <div className="flex items-center gap-3 pl-6">
                <span className="text-xs text-slate-500">Paid Leave Balance:</span>
                <input
                  type="number"
                  min="0"
                  max="60"
                  value={leaveDaysAvailable}
                  onChange={(e) => setLeaveDaysAvailable(Math.max(0, Number(e.target.value)))}
                  className="w-20 px-3 py-1 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-xs text-center"
                />
                <span className="text-xs font-bold text-indigo-600">days early release</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Buyout Calculator (6 cols) */}
        <div className="lg:col-span-6 glass-card p-6 rounded-3xl space-y-5 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-500" />
              Notice Buyout Cost Estimator
            </h3>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Monthly Gross Salary ({currency.symbol})
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-sm">
                  {currency.symbol}
                </span>
                <input
                  type="number"
                  min="0"
                  step="1000"
                  value={monthlySalary}
                  onChange={(e) => setMonthlySalary(Math.max(0, Number(e.target.value)))}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                <span>Days to Buyout</span>
                <span className="text-emerald-600 font-extrabold">{buyoutDays} Days</span>
              </div>
              <input
                type="range"
                min="1"
                max={Math.min(90, totalNoticeDays)}
                value={buyoutDays}
                onChange={(e) => setBuyoutDays(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-900 space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-600 dark:text-slate-400 font-medium">Per-Day Salary Rate:</span>
                <span className="font-bold text-slate-900 dark:text-white font-mono">{currency.symbol}{Math.round(perDaySalary).toLocaleString()} / day</span>
              </div>
              <div className="flex justify-between items-center text-sm font-black pt-1 border-t border-emerald-200/60 dark:border-emerald-900/60">
                <span className="text-emerald-800 dark:text-emerald-300">Total Buyout Amount:</span>
                <span className="text-emerald-600 dark:text-emerald-400 text-lg font-mono">{currency.symbol}{estimatedBuyoutAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 italic">
            *Buyout calculation is based on standard 30-day payroll divisor. Company policies on basic vs gross salary buyout may vary.
          </div>
        </div>
      </div>

      {/* Resignation Email Generator Module */}
      <div className="glass-card p-6 rounded-3xl space-y-5 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Mail className="w-4 h-4 text-indigo-500" />
            Auto-Generated Resignation Email Letter
          </h3>

          <button
            onClick={handleCopyEmail}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-2 transition-all cursor-pointer self-start sm:self-auto"
          >
            {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedEmail ? 'Copied Email Template!' : 'Copy Email to Clipboard'}</span>
          </button>
        </div>

        {/* Customizable fields */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="font-bold text-slate-600 dark:text-slate-400 block mb-1">Manager's Name</label>
            <input
              type="text"
              value={managerName}
              onChange={(e) => setManagerName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-medium"
            />
          </div>
          <div>
            <label className="font-bold text-slate-600 dark:text-slate-400 block mb-1">Your Job Title</label>
            <input
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-medium"
            />
          </div>
          <div>
            <label className="font-bold text-slate-600 dark:text-slate-400 block mb-1">Company Name</label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-medium"
            />
          </div>
        </div>

        {/* Preview Pre */}
        <pre className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed select-all">
          {emailBody}
        </pre>
      </div>
    </div>
  );
};
