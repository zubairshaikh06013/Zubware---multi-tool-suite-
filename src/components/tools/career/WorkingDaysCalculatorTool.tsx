import React, { useState } from 'react';
import { Calendar, Clock, DollarSign, Copy, Check, ArrowRight, Briefcase, Plus, RefreshCw, Sparkles } from 'lucide-react';

interface WorkingDaysCalculatorToolProps {
  onShowToast: (msg: string) => void;
}

export const WorkingDaysCalculatorTool: React.FC<WorkingDaysCalculatorToolProps> = ({ onShowToast }) => {
  const [calcMode, setCalcMode] = useState<'between' | 'add'>('between');

  // Mode 1: Between Dates
  const [startDate, setStartDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState<string>(() => {
    const d = new Date();
    d.setMonth(d.getMonth() + 3);
    return d.toISOString().split('T')[0];
  });

  // Mode 2: Add Days
  const [daysToAdd, setDaysToAdd] = useState<number>(30);

  // Settings
  const [weekendScheme, setWeekendScheme] = useState<'standard' | 'sunday_only' | 'mideast' | 'four_day'>('standard');
  const [holidaysCount, setHolidaysCount] = useState<number>(5);
  const [hoursPerDay, setHoursPerDay] = useState<number>(8);
  const [hourlyRate, setHourlyRate] = useState<number>(65);
  const [copied, setCopied] = useState<boolean>(false);

  // Helper: Is a date a weekend based on scheme
  const isWeekend = (d: Date) => {
    const day = d.getDay(); // 0 = Sun, 1 = Mon, ..., 5 = Fri, 6 = Sat
    if (weekendScheme === 'standard') return day === 0 || day === 6; // Sat + Sun
    if (weekendScheme === 'sunday_only') return day === 0; // Sun only
    if (weekendScheme === 'mideast') return day === 5 || day === 6; // Fri + Sat
    if (weekendScheme === 'four_day') return day === 0 || day === 5 || day === 6; // Fri + Sat + Sun
    return false;
  };

  // Calculations for Mode 1: Between Dates
  const start = new Date(startDate);
  const end = new Date(endDate);

  let workingDaysBetween = 0;
  let totalCalendarDaysBetween = 0;
  let weekendDaysBetween = 0;

  if (!isNaN(start.getTime()) && !isNaN(end.getTime()) && end >= start) {
    const cur = new Date(start);
    while (cur <= end) {
      totalCalendarDaysBetween++;
      if (isWeekend(cur)) {
        weekendDaysBetween++;
      } else {
        workingDaysBetween++;
      }
      cur.setDate(cur.getDate() + 1);
    }
  }

  const netWorkingDaysBetween = Math.max(0, workingDaysBetween - holidaysCount);
  const totalHoursBetween = netWorkingDaysBetween * hoursPerDay;
  const projectedRevenueBetween = totalHoursBetween * hourlyRate;

  // Calculations for Mode 2: Add Working Days
  const targetDateResult = new Date(start);
  let added = 0;
  let calendarDaysAdded = 0;

  if (!isNaN(start.getTime()) && daysToAdd > 0) {
    while (added < daysToAdd) {
      calendarDaysAdded++;
      targetDateResult.setDate(targetDateResult.getDate() + 1);
      if (!isWeekend(targetDateResult)) {
        added++;
      }
    }
  }

  const formattedTargetDate = isNaN(targetDateResult.getTime()) ? 'Invalid Date' : targetDateResult.toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const handleCopySummary = () => {
    let text = '';
    if (calcMode === 'between') {
      text = `📅 Zubware Business Working Days Report
--------------------------------------
Date Range: ${startDate} to ${endDate}
Total Calendar Days: ${totalCalendarDaysBetween} days
Weekend Days: ${weekendDaysBetween} days
Public Holidays: ${holidaysCount} days
--------------------------------------
👉 Net Working Business Days: ${netWorkingDaysBetween} days
Total Billable Hours: ${totalHoursBetween.toLocaleString()} hours (@ ${hoursPerDay} hrs/day)
Projected Billing Revenue: $${projectedRevenueBetween.toLocaleString()} (@ $${hourlyRate}/hr)

Calculated on Zubware`;
    } else {
      text = `🎯 Zubware Project Deadline Schedule
--------------------------------------
Start Date: ${startDate}
Working Days Needed: ${daysToAdd} business days
--------------------------------------
👉 Projected Target Completion Date: ${formattedTargetDate}
Total Calendar Days Elapsed: ${calendarDaysAdded} days

Calculated on Zubware`;
    }

    navigator.clipboard.writeText(text);
    setCopied(true);
    onShowToast('Schedule report copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
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
            Working Days & Business Hours Calculator
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Calculate net working business days, billable consulting hours, and future project completion deadlines.
          </p>
        </div>
      </div>

      {/* Mode Switcher */}
      <div className="flex rounded-2xl bg-slate-100 dark:bg-slate-800/80 p-1.5 text-xs font-bold max-w-md mx-auto">
        <button
          onClick={() => setCalcMode('between')}
          className={`flex-1 py-2.5 rounded-xl transition-all ${
            calcMode === 'between' ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          Between Two Dates
        </button>
        <button
          onClick={() => setCalcMode('add')}
          className={`flex-1 py-2.5 rounded-xl transition-all ${
            calcMode === 'add' ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          Add Working Days to Date
        </button>
      </div>

      {/* Hero Result Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 text-white shadow-2xl relative overflow-hidden border border-indigo-500/30">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="inline-block px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 font-extrabold text-[11px] tracking-wider uppercase">
              {calcMode === 'between' ? 'Net Business Working Days' : 'Projected Completion Target Date'}
            </span>
            <div className="text-3xl sm:text-4xl font-black tracking-tight text-white flex items-baseline gap-2">
              {calcMode === 'between' ? (
                <>
                  <span>{netWorkingDaysBetween} Days</span>
                  <span className="text-sm text-indigo-300 font-normal">({totalHoursBetween.toLocaleString()} Billable Hours)</span>
                </>
              ) : (
                <span>{formattedTargetDate}</span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-indigo-200/80">
              {calcMode === 'between'
                ? `Out of ${totalCalendarDaysBetween} total calendar days (${weekendDaysBetween} weekend days, ${holidaysCount} holidays excluded)`
                : `Takes ${calendarDaysAdded} calendar days to complete ${daysToAdd} working days`}
            </p>
          </div>

          <button
            onClick={handleCopySummary}
            className="px-4 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs flex items-center gap-2 transition-all cursor-pointer backdrop-blur-sm shrink-0 self-start sm:self-center"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied Summary!' : 'Copy Schedule Report'}</span>
          </button>
        </div>
      </div>

      {/* Inputs & Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left Inputs (7 cols) */}
        <div className="md:col-span-7 glass-card p-6 rounded-3xl space-y-5 border border-slate-200/80 dark:border-slate-800">
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Calendar className="w-4 h-4 text-indigo-500" />
            Calendar Parameters
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {calcMode === 'between' ? (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            ) : (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Business Days to Add</label>
                <input
                  type="number"
                  min="1"
                  max="1000"
                  value={daysToAdd}
                  onChange={e => setDaysToAdd(Math.max(1, Number(e.target.value)))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            )}
          </div>

          {/* Weekend Scheme */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Weekly Schedule / Weekend Days</label>
            <select
              value={weekendScheme}
              onChange={e => setWeekendScheme(e.target.value as any)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="standard">Standard 5-Day Week (Saturday & Sunday Off)</option>
              <option value="sunday_only">6-Day Work Week (Sunday Off Only)</option>
              <option value="mideast">Middle East Schedule (Friday & Saturday Off)</option>
              <option value="four_day">4-Day Work Week (Friday, Saturday & Sunday Off)</option>
            </select>
          </div>

          {/* Public Holidays */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
              <span>Public Holidays in Period</span>
              <span className="text-indigo-600 font-extrabold">{holidaysCount} Days</span>
            </div>
            <input
              type="range"
              min="0"
              max="30"
              value={holidaysCount}
              onChange={e => setHolidaysCount(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex gap-2 pt-1">
              {[0, 5, 10, 15].map(cnt => (
                <button
                  key={cnt}
                  onClick={() => setHolidaysCount(cnt)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold ${
                    holidaysCount === cnt ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
                  }`}
                >
                  {cnt} Days
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Billable Hours & Revenue Estimator (5 cols) */}
        <div className="md:col-span-5 glass-card p-6 rounded-3xl space-y-5 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-emerald-500" />
              Billable Hours & Revenue
            </h3>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                <span>Working Hours per Day</span>
                <span className="text-emerald-600 font-bold">{hoursPerDay} hrs/day</span>
              </div>
              <input
                type="range"
                min="4"
                max="12"
                value={hoursPerDay}
                onChange={e => setHoursPerDay(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Hourly Billing Rate ($/hr)</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-sm">$</span>
                <input
                  type="number"
                  min="0"
                  step="5"
                  value={hourlyRate}
                  onChange={e => setHourlyRate(Math.max(0, Number(e.target.value)))}
                  className="w-full pl-8 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-sm text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-900 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-600 dark:text-slate-400">Total Billable Hours:</span>
                <span className="font-extrabold text-slate-900 dark:text-white font-mono">{totalHoursBetween.toLocaleString()} hrs</span>
              </div>
              <div className="flex justify-between items-center text-sm font-black pt-2 border-t border-emerald-200/60 dark:border-emerald-900/60">
                <span className="text-emerald-800 dark:text-emerald-300">Estimated Project Revenue:</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-mono text-base">${projectedRevenueBetween.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 italic">
            *Useful for freelancers, consulting scopes, retainer forecasts, and sprint capacity allocations.
          </div>
        </div>
      </div>
    </div>
  );
};
