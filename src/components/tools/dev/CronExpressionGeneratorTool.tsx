import React, { useState, useMemo } from 'react';
import { Clock, Copy, Check, Sparkles, RefreshCw, Calendar, ArrowRight, CheckCircle2 } from 'lucide-react';

export function CronExpressionGeneratorTool({ onShowToast }: { onShowToast: (msg: string) => void }) {
  const [minute, setMinute] = useState<string>('0');
  const [hour, setHour] = useState<string>('9');
  const [dayOfMonth, setDayOfMonth] = useState<string>('*');
  const [month, setMonth] = useState<string>('*');
  const [dayOfWeek, setDayOfWeek] = useState<string>('1-5');
  const [customCron, setCustomCron] = useState<string>('0 9 * * 1-5');
  const [copied, setCopied] = useState<boolean>(false);

  const presets = [
    { label: 'Every minute', cron: '* * * * *' },
    { label: 'Every 5 minutes', cron: '*/5 * * * *' },
    { label: 'Every 15 minutes', cron: '*/15 * * * *' },
    { label: 'Every hour at :00', cron: '0 * * * *' },
    { label: 'Daily at midnight (00:00)', cron: '0 0 * * *' },
    { label: 'Daily at 9:00 AM', cron: '0 9 * * *' },
    { label: 'Every Weekday at 9:00 AM', cron: '0 9 * * 1-5' },
    { label: 'Every Sunday at 12:00 PM', cron: '0 12 * * 0' },
    { label: '1st of every month at midnight', cron: '0 0 1 * *' },
  ];

  const cronExpression = customCron.trim() || `${minute} ${hour} ${dayOfMonth} ${month} ${dayOfWeek}`;

  const applyPreset = (presetCron: string) => {
    setCustomCron(presetCron);
    const parts = presetCron.split(/\s+/);
    if (parts.length >= 5) {
      setMinute(parts[0]);
      setHour(parts[1]);
      setDayOfMonth(parts[2]);
      setMonth(parts[3]);
      setDayOfWeek(parts[4]);
    }
    onShowToast(`Applied preset: ${presetCron}`);
  };

  const handleFieldChange = (field: 'minute' | 'hour' | 'dom' | 'month' | 'dow', val: string) => {
    let m = minute;
    let h = hour;
    let dom = dayOfMonth;
    let mo = month;
    let dow = dayOfWeek;

    if (field === 'minute') { m = val; setMinute(val); }
    if (field === 'hour') { h = val; setHour(val); }
    if (field === 'dom') { dom = val; setDayOfMonth(val); }
    if (field === 'month') { mo = val; setMonth(val); }
    if (field === 'dow') { dow = val; setDayOfWeek(val); }

    const combined = `${m} ${h} ${dom} ${mo} ${dow}`;
    setCustomCron(combined);
  };

  // Human description generator
  const humanDescription = useMemo(() => {
    const parts = cronExpression.trim().split(/\s+/);
    if (parts.length !== 5) {
      return 'Invalid cron format (must have 5 space-separated parts: minute, hour, day, month, day-of-week)';
    }

    const [m, h, dom, mo, dow] = parts;
    const descParts: string[] = [];

    // Time description
    if (m === '*' && h === '*') {
      descParts.push('Every minute');
    } else if (m.startsWith('*/') && h === '*') {
      descParts.push(`Every ${m.slice(2)} minutes`);
    } else if (h === '*' && m !== '*') {
      descParts.push(`At ${m} minutes past every hour`);
    } else if (m === '0' && h.startsWith('*/')) {
      descParts.push(`Every ${h.slice(2)} hours`);
    } else if (!m.includes('*') && !h.includes('*')) {
      const formattedH = h.padStart(2, '0');
      const formattedM = m.padStart(2, '0');
      descParts.push(`At ${formattedH}:${formattedM}`);
    } else {
      descParts.push(`At minute ${m}, hour ${h}`);
    }

    // Day of month
    if (dom !== '*') {
      descParts.push(`on day ${dom} of the month`);
    }

    // Month
    const monthNames = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    if (mo !== '*') {
      if (/^\d+$/.test(mo)) {
        descParts.push(`in ${monthNames[parseInt(mo)] || mo}`);
      } else {
        descParts.push(`in month ${mo}`);
      }
    }

    // Day of week
    const dayMap: Record<string, string> = {
      '0': 'Sunday',
      '1': 'Monday',
      '2': 'Tuesday',
      '3': 'Wednesday',
      '4': 'Thursday',
      '5': 'Friday',
      '6': 'Saturday',
      '7': 'Sunday',
      '1-5': 'Monday through Friday',
      '0,6': 'weekends (Saturday and Sunday)',
    };

    if (dow !== '*') {
      if (dayMap[dow]) {
        descParts.push(`on ${dayMap[dow]}`);
      } else {
        descParts.push(`on day-of-week ${dow}`);
      }
    }

    return descParts.join(' ');
  }, [cronExpression]);

  // Compute next 5 occurrences
  const nextRuns = useMemo(() => {
    const list: string[] = [];
    const parts = cronExpression.trim().split(/\s+/);
    if (parts.length !== 5) return list;

    try {
      const now = new Date();
      let probe = new Date(now.getTime() + 60000); // start next minute
      probe.setSeconds(0, 0);

      const matchField = (val: number, expr: string): boolean => {
        if (expr === '*') return true;
        if (expr.startsWith('*/')) {
          const step = parseInt(expr.slice(2));
          return !isNaN(step) && step > 0 && val % step === 0;
        }
        if (expr.includes('-')) {
          const [start, end] = expr.split('-').map(Number);
          return val >= start && val <= end;
        }
        if (expr.includes(',')) {
          return expr.split(',').map(Number).includes(val);
        }
        return Number(expr) === val;
      };

      let count = 0;
      let iterations = 0;
      while (count < 5 && iterations < 50000) {
        iterations++;
        const pMin = probe.getMinutes();
        const pHour = probe.getHours();
        const pDom = probe.getDate();
        const pMonth = probe.getMonth() + 1;
        const pDow = probe.getDay();

        if (
          matchField(pMin, parts[0]) &&
          matchField(pHour, parts[1]) &&
          matchField(pDom, parts[2]) &&
          matchField(pMonth, parts[3]) &&
          matchField(pDow, parts[4])
        ) {
          list.push(probe.toLocaleString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          }));
          count++;
          probe = new Date(probe.getTime() + 60000);
        } else {
          probe = new Date(probe.getTime() + 60000);
        }
      }
    } catch {
      // Ignore
    }

    return list;
  }, [cronExpression]);

  const handleCopy = () => {
    navigator.clipboard.writeText(cronExpression);
    setCopied(true);
    onShowToast('Copied cron expression!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-4 gap-3">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Cron Expression Generator & Explainer
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Design, translate, and inspect cron job schedules with plain English descriptions and future run estimates.
          </p>
        </div>
      </div>

      {/* Main Expression Box */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 text-white space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Cron Schedule Expression
          </span>
          <button
            onClick={handleCopy}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied' : 'Copy Expression'}
          </button>
        </div>

        <input
          type="text"
          value={customCron}
          onChange={(e) => setCustomCron(e.target.value)}
          className="w-full text-2xl sm:text-3xl font-mono font-black text-indigo-400 bg-slate-950 px-5 py-3 rounded-2xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="* * * * *"
        />

        {/* Human Translation */}
        <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-800/40 flex items-start gap-3">
          <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
          <div>
            <span className="text-xs font-bold text-indigo-300 block uppercase tracking-wider">Schedule Meaning</span>
            <p className="text-sm font-semibold text-white mt-0.5">{humanDescription}</p>
          </div>
        </div>
      </div>

      {/* Interactive Field Builder */}
      <div className="glass-card p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-4">
        <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
          Interactive Field Builders
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-600 dark:text-slate-400">Minute (0-59)</label>
            <input
              type="text"
              value={minute}
              onChange={(e) => handleFieldChange('minute', e.target.value)}
              className="w-full px-3 py-2 text-xs font-mono font-bold rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-600 dark:text-slate-400">Hour (0-23)</label>
            <input
              type="text"
              value={hour}
              onChange={(e) => handleFieldChange('hour', e.target.value)}
              className="w-full px-3 py-2 text-xs font-mono font-bold rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-600 dark:text-slate-400">Day of Month (1-31)</label>
            <input
              type="text"
              value={dayOfMonth}
              onChange={(e) => handleFieldChange('dom', e.target.value)}
              className="w-full px-3 py-2 text-xs font-mono font-bold rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-600 dark:text-slate-400">Month (1-12)</label>
            <input
              type="text"
              value={month}
              onChange={(e) => handleFieldChange('month', e.target.value)}
              className="w-full px-3 py-2 text-xs font-mono font-bold rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-600 dark:text-slate-400">Day of Week (0-6)</label>
            <input
              type="text"
              value={dayOfWeek}
              onChange={(e) => handleFieldChange('dow', e.target.value)}
              className="w-full px-3 py-2 text-xs font-mono font-bold rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
            />
          </div>
        </div>
      </div>

      {/* Presets and Next Runs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Presets */}
        <div className="glass-card p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-3">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
            Common Presets
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {presets.map((p, idx) => (
              <button
                key={idx}
                onClick={() => applyPreset(p.cron)}
                className={`p-2.5 rounded-xl text-left transition-all border cursor-pointer ${
                  customCron === p.cron
                    ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-300 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="text-xs font-bold">{p.label}</div>
                <div className="text-[11px] font-mono text-slate-500 mt-0.5">{p.cron}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Next Scheduled Runs */}
        <div className="glass-card p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-3">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-indigo-500" /> Next 5 Scheduled Executions
          </span>

          {nextRuns.length > 0 ? (
            <div className="space-y-2">
              {nextRuns.map((runTime, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs"
                >
                  <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    {runTime}
                  </span>
                  <span className="font-mono text-[10px] text-slate-400">Run #{idx + 1}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-xs text-slate-400">
              Enter a valid 5-part cron expression to calculate upcoming dates.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
