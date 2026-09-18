import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Copy, Check, Sparkles, RefreshCw, PartyPopper } from 'lucide-react';

interface CountdownCalculatorToolProps {
  onShowToast: (message: string) => void;
}

export const CountdownCalculatorTool: React.FC<CountdownCalculatorToolProps> = ({ onShowToast }) => {
  const [eventName, setEventName] = useState<string>('New Year Countdown');
  // Default target date: next year Jan 1st 00:00:00
  const nextYear = new Date().getFullYear() + 1;
  const [targetDateStr, setTargetDateStr] = useState<string>(`${nextYear}-01-01T00:00`);
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    totalSeconds: number;
    isPast: boolean;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0, totalSeconds: 0, isPast: false });
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    const calculate = () => {
      const targetTime = new Date(targetDateStr).getTime();
      const now = new Date().getTime();
      const difference = targetTime - now;

      if (difference <= 0) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          totalSeconds: 0,
          isPast: true
        });
        return;
      }

      const totalSec = Math.floor(difference / 1000);
      const days = Math.floor(totalSec / (3600 * 24));
      const hours = Math.floor((totalSec % (3600 * 24)) / 3600);
      const minutes = Math.floor((totalSec % 3600) / 60);
      const seconds = totalSec % 60;

      setTimeLeft({
        days,
        hours,
        minutes,
        seconds,
        totalSeconds: totalSec,
        isPast: false
      });
    };

    calculate();
    const interval = setInterval(calculate, 1000);
    return () => clearInterval(interval);
  }, [targetDateStr]);

  const copyCountdown = () => {
    const text = `${eventName}: ${timeLeft.days}d ${timeLeft.hours}h ${timeLeft.minutes}m ${timeLeft.seconds}s remaining!`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    onShowToast('Countdown summary copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const setPreset = (name: string, date: Date) => {
    setEventName(name);
    // Format YYYY-MM-DDTHH:mm for datetime-local
    const offset = date.getTimezoneOffset() * 60000;
    const localIso = new Date(date.getTime() - offset).toISOString().slice(0, 16);
    setTargetDateStr(localIso);
    onShowToast(`Preset set: ${name}`);
  };

  return (
    <div className="p-6 sm:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>⏳</span> Countdown Calculator
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Track exact time remaining to your target event, holiday, launch date, or deadline with real-time live ticking.
          </p>
        </div>
        <button
          onClick={copyCountdown}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          <span>Copy Status</span>
        </button>
      </div>

      {/* Main Countdown Cards */}
      <div className="glass-card p-8 sm:p-10 rounded-3xl border border-indigo-500/20 text-center space-y-6 bg-gradient-to-b from-indigo-500/5 via-slate-500/5 to-transparent">
        <h3 className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white">
          {eventName || 'Upcoming Event'}
        </h3>

        {timeLeft.isPast ? (
          <div className="py-6 space-y-2">
            <PartyPopper className="w-12 h-12 mx-auto text-amber-500 animate-bounce" />
            <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
              The event has arrived! 🎉
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto">
            {/* Days */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800">
              <span className="text-4xl sm:text-6xl font-black text-indigo-600 dark:text-indigo-400 font-mono block">
                {String(timeLeft.days).padStart(2, '0')}
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 block">
                Days
              </span>
            </div>

            {/* Hours */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800">
              <span className="text-4xl sm:text-6xl font-black text-indigo-600 dark:text-indigo-400 font-mono block">
                {String(timeLeft.hours).padStart(2, '0')}
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 block">
                Hours
              </span>
            </div>

            {/* Minutes */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800">
              <span className="text-4xl sm:text-6xl font-black text-indigo-600 dark:text-indigo-400 font-mono block">
                {String(timeLeft.minutes).padStart(2, '0')}
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 block">
                Minutes
              </span>
            </div>

            {/* Seconds */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800">
              <span className="text-4xl sm:text-6xl font-black text-rose-500 font-mono block animate-pulse">
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 block">
                Seconds
              </span>
            </div>
          </div>
        )}

        {/* Total Breakdown Metrics */}
        <div className="flex flex-wrap justify-center gap-4 text-xs font-mono text-slate-500 pt-2">
          <span>Total: ~{timeLeft.totalSeconds.toLocaleString()} seconds</span>
          <span>•</span>
          <span>~{Math.floor(timeLeft.totalSeconds / 60).toLocaleString()} minutes</span>
          <span>•</span>
          <span>~{Math.floor(timeLeft.totalSeconds / 3600).toLocaleString()} hours</span>
        </div>
      </div>

      {/* Inputs and Presets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Event Setup Form */}
        <div className="glass-card p-6 rounded-3xl space-y-4">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
            Target Date & Title
          </span>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Event Title</label>
            <input
              type="text"
              value={eventName}
              onChange={e => setEventName(e.target.value)}
              placeholder="e.g. Vacation, Product Launch..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Target Date & Time</label>
            <input
              type="datetime-local"
              value={targetDateStr}
              onChange={e => setTargetDateStr(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-sm"
            />
          </div>
        </div>

        {/* Quick Presets */}
        <div className="glass-card p-6 rounded-3xl space-y-4">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
            Quick Date Presets
          </span>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                const d = new Date();
                d.setDate(d.getDate() + 1);
                d.setHours(0, 0, 0, 0);
                setPreset('Tomorrow Morning', d);
              }}
              className="p-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 text-left transition-colors"
            >
              Tomorrow Morning
            </button>

            <button
              onClick={() => {
                const d = new Date();
                d.setDate(d.getDate() + 7);
                setPreset('Next Week', d);
              }}
              className="p-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 text-left transition-colors"
            >
              In 7 Days
            </button>

            <button
              onClick={() => {
                const d = new Date();
                d.setMonth(d.getMonth() + 1, 0);
                d.setHours(23, 59, 59);
                setPreset('End of Month', d);
              }}
              className="p-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 text-left transition-colors"
            >
              End of Month
            </button>

            <button
              onClick={() => {
                const d = new Date(new Date().getFullYear() + 1, 0, 1, 0, 0, 0);
                setPreset('New Year Celebration', d);
              }}
              className="p-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 text-left transition-colors"
            >
              Next New Year
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
