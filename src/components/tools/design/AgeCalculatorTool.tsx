import React, { useState } from 'react';
import { calendarAge, calendarDay, nextCalendarBirthday, parseCalendarDate } from '../../../lib/calendarAge';
import { 
  Calendar, 
  Clock, 
  Gift, 
  Sparkles, 
  Copy, 
  Check, 
  Heart, 
  Moon, 
  Compass, 
  Activity,
  RotateCcw
} from 'lucide-react';

interface AgeCalculatorToolProps {
  onShowToast: (message: string) => void;
}

const getTodayString = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const AgeCalculatorTool: React.FC<AgeCalculatorToolProps> = ({ onShowToast }) => {
  const [dob, setDob] = useState<string>('');
  const [targetDate, setTargetDate] = useState<string>(getTodayString());
  const [copied, setCopied] = useState<boolean>(false);

  const calculateAge = () => {
    const birth = parseCalendarDate(dob);
    const target = parseCalendarDate(targetDate);

    if (!birth || !target || isNaN(birth.getTime()) || isNaN(target.getTime()) || birth > target) {
      return null;
    }

    const age = calendarAge(birth, target);
    if (!age) return null;
    const { years, months, days, totalDays } = age;

    const totalWeeks = Math.floor(totalDays / 7);
    const totalMonths = years * 12 + months;
    const totalHours = totalDays * 24;
    const totalMinutes = totalHours * 60;
    const totalSeconds = totalMinutes * 60;

    // Day of birth
    const birthDayOfWeek = birth.toLocaleDateString('en-US', { weekday: 'long' });

    // Next Birthday
    const nextBday = nextCalendarBirthday(birth, target)!;
    const daysToNextBday = calendarDay(nextBday) - calendarDay(target);
    const nextBdayDayOfWeek = nextBday.toLocaleDateString('en-US', { weekday: 'long' });

    // Western Zodiac
    const getZodiac = (month: number, day: number) => {
      // month is 0-indexed
      const dates = [20, 19, 21, 20, 21, 21, 23, 23, 23, 23, 22, 22];
      const signs = ['Capricorn', 'Aquarius', 'Pisces', 'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn'];
      const elements = ['Earth', 'Air', 'Water', 'Fire', 'Earth', 'Air', 'Water', 'Fire', 'Earth', 'Air', 'Water', 'Fire', 'Earth'];
      const birthstones = ['Garnet', 'Amethyst', 'Aquamarine', 'Diamond', 'Emerald', 'Pearl', 'Ruby', 'Peridot', 'Sapphire', 'Opal', 'Topaz', 'Turquoise'];

      const signIdx = day < dates[month] ? month : (month + 1) % 12;
      return {
        sign: signs[signIdx],
        element: elements[signIdx],
        stone: birthstones[month]
      };
    };

    const zodiacInfo = getZodiac(birth.getMonth(), birth.getDate());

    // Chinese Zodiac
    const chineseZodiacAnimals = ['Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake', 'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig'];
    const birthYear = birth.getFullYear();
    const chineseAnimal = chineseZodiacAnimals[((birthYear - 4) % 12 + 12) % 12];

    // Estimated life stats
    const estimatedHeartbeats = Math.floor(totalDays * 24 * 60 * 80); // 80 bpm
    const estimatedBreaths = Math.floor(totalDays * 24 * 60 * 16); // 16 bpm
    const estimatedSleepHours = Math.floor(totalDays * 8);

    return {
      years,
      months,
      days,
      totalMonths,
      totalWeeks,
      totalDays,
      totalHours,
      totalMinutes,
      totalSeconds,
      birthDayOfWeek,
      daysToNextBday,
      nextBdayDayOfWeek,
      nextBirthdayDate: nextBday.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }),
      zodiacInfo,
      chineseAnimal,
      estimatedHeartbeats,
      estimatedBreaths,
      estimatedSleepHours
    };
  };

  const result = calculateAge();
  const today = getTodayString();
  const birthDate = parseCalendarDate(dob);
  const nextBirthday = birthDate ? nextCalendarBirthday(birthDate, parseCalendarDate(today)!) : null;
  const nextBirthdayValue = nextBirthday && nextBirthday.getFullYear() <= 9999
    ? `${String(nextBirthday.getFullYear()).padStart(4, '0')}-${String(nextBirthday.getMonth() + 1).padStart(2, '0')}-${String(nextBirthday.getDate()).padStart(2, '0')}`
    : null;
  const referenceLabel = parseCalendarDate(targetDate)?.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
  const dateError = dob && !result ? 'Enter valid dates. The reference date must be on or after your date of birth.' : '';
  const setReference = (value: string) => { setTargetDate(value); setCopied(false); };
  const loadExample = () => {
    setDob('1997-05-13');
    setReference('2026-12-31');
    onShowToast('Example loaded: 13 May 1997 to 31 December 2026');
  };

  const copyAgeSummary = async () => {
    if (!result) return;
    const text = `Date of birth: ${dob} | Age at date: ${targetDate} | Calendar age: ${result.years} years, ${result.months} months, ${result.days} days | Total elapsed days: ${result.totalDays} | Born on a ${result.birthDayOfWeek} | Birthday on or after reference date: ${result.nextBirthdayDate} (${result.daysToNextBday} days away)`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      onShowToast('Copied age summary to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
      onShowToast('Could not copy. Please select and copy the displayed age.');
    }
  };

  return (
    <div className="p-4 sm:p-8 space-y-6">
      {/* Title Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            Calculate Age on Any Date
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Enter your date of birth and the date you need. See your age in years, months and days, total days old, and birthday countdown.
          </p>
          <p className="text-xs font-semibold text-indigo-700 dark:text-indigo-300 mt-2">
            Free to use. No signup. Your dates are processed in your browser.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setDob('');
              setTargetDate(getTodayString());
              setCopied(false);
              onShowToast('Dates cleared; reference date set to today');
            }}
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
            title="Reset to default dates"
            aria-label="Reset dates"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          {result && (
            <button
              onClick={copyAgeSummary}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>Copy Age Card</span>
            </button>
          )}
        </div>
      </div>

      {/* Date Pickers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass-card p-5 rounded-3xl space-y-2">
          <label htmlFor="age-birth-date" className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-indigo-500" />
            <span>Date of Birth</span>
          </label>
          <input
            id="age-birth-date"
            type="date"
            value={dob}
            onChange={e => { setDob(e.target.value); setCopied(false); }}
            min="0001-01-01"
            max="9999-12-31"
            aria-describedby="age-date-help age-result-status"
            aria-invalid={Boolean(dateError)}
            className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-base font-bold text-slate-900 dark:text-white"
          />
        </div>

        <div className="glass-card p-5 rounded-3xl space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <label htmlFor="age-reference-date" className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-indigo-500" />
              <span>Age at date (reference date)</span>
            </label>
            <button
              type="button"
              onClick={() => { setTargetDate(getTodayString()); setCopied(false); }}
              className="min-h-11 px-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
            >
              Set to Today
            </button>
          </div>
          <input
            id="age-reference-date"
            type="date"
            aria-describedby="age-date-help age-result-status"
            aria-invalid={Boolean(dateError)}
            value={targetDate}
            onChange={e => { setTargetDate(e.target.value); setCopied(false); }}
            min="0001-01-01"
            max="9999-12-31"
            className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-base font-bold text-slate-900 dark:text-white"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2" role="group" aria-label="Reference date shortcuts">
        {[
          { label: 'Today', value: today },
          { label: `31 Dec ${today.slice(0, 4)}`, value: `${today.slice(0, 4)}-12-31` },
        ].map(preset => (
          <button key={preset.label} type="button" aria-pressed={targetDate === preset.value}
            onClick={() => setReference(preset.value)}
            className="min-h-11 px-4 py-2 rounded-xl border border-indigo-200 dark:border-indigo-800 text-sm font-semibold text-indigo-700 dark:text-indigo-300 aria-pressed:bg-indigo-100 dark:aria-pressed:bg-indigo-950">
            {preset.label}
          </button>
        ))}
        <button type="button" disabled={!nextBirthdayValue}
          aria-pressed={Boolean(nextBirthdayValue && targetDate === nextBirthdayValue)}
          onClick={() => { if (nextBirthdayValue) setReference(nextBirthdayValue); }}
          className="min-h-11 px-4 py-2 rounded-xl border border-indigo-200 dark:border-indigo-800 text-sm font-semibold text-indigo-700 dark:text-indigo-300 aria-pressed:bg-indigo-100 dark:aria-pressed:bg-indigo-950 disabled:opacity-50 disabled:cursor-not-allowed">
          Next birthday from today
        </button>
        <button type="button" onClick={loadExample} className="min-h-11 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-700 dark:text-slate-200">
          Try an example
        </button>
      </div>
      <p id="age-result-status" role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {dateError || (result ? `Age on ${referenceLabel}: ${result.years} years, ${result.months} months, ${result.days} days.` : 'Enter your date of birth. Results update automatically.')}
      </p>
      <p id="age-date-help" className="text-xs text-slate-600 dark:text-slate-400">
        Results update automatically when both dates are valid. Choose any past or future reference date on or after birth. Month-end dates use the last valid day of the destination month. A February 29 birthday uses February 28 in non-leap years here. Official eligibility rules may differ.
      </p>
      {result ? (
        <div className="space-y-6">
          {/* Main Hero Age Display */}
          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-indigo-500/20 bg-gradient-to-br from-indigo-50/30 to-purple-50/20 dark:from-slate-900/60 dark:to-indigo-950/20 space-y-4">
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
              {targetDate === today ? 'Your age today' : `Your age on ${referenceLabel}`}
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {[{ label: 'Years', value: result.years }, { label: 'Months', value: result.months }, { label: 'Days', value: result.days }].map(unit => (
                <div key={unit.label} className="rounded-2xl bg-white/70 dark:bg-slate-950/50 p-2 sm:p-4 text-center">
                  <p className="text-2xl sm:text-4xl font-black text-indigo-600 dark:text-indigo-400 tabular-nums">{unit.value}</p>
                  <p className="text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-300">{unit.label}</p>
                </div>
              ))}
            </div>

            <p className="text-sm text-slate-700 dark:text-slate-200">
              <strong>Completed age: {result.years} years.</strong> If a form asks for completed years only, use this number for the selected reference date.
            </p>
            <div className="border-t border-indigo-200/60 dark:border-indigo-900/60 pt-4 space-y-1">
              <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200">How many days old am I?</h3>
              <p className="text-2xl sm:text-3xl font-black text-indigo-600 dark:text-indigo-400 break-words">
                {result.totalDays.toLocaleString()} days old
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                From <time dateTime={dob}>{dob}</time> to <time dateTime={targetDate}>{targetDate}</time> (YYYY-MM-DD). The birth date is day zero; leap days are included.
              </p>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
              You were born on a <span className="font-bold text-slate-900 dark:text-white">{result.birthDayOfWeek}</span>.
            </p>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400">
            Months and weeks below are completed units, with the remaining days shown separately. Hours, minutes and seconds use 24 hours per calendar day; they do not account for your birth time or daylight-saving clock changes.
          </p>

          {/* Quick Metrics Breakdown Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Completed Months</span>
              <div className="text-lg font-black text-slate-900 dark:text-white font-mono">
                {result.totalMonths.toLocaleString()}
              </div>
              <p className="text-xs text-slate-500">and {result.days} days</p>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Completed Weeks</span>
              <div className="text-lg font-black text-slate-900 dark:text-white font-mono">
                {result.totalWeeks.toLocaleString()}
              </div>
              <p className="text-xs text-slate-500">and {result.totalDays % 7} days</p>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Total Days</span>
              <div className="text-lg font-black text-indigo-600 dark:text-indigo-400 font-mono">
                {result.totalDays.toLocaleString()}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Total Hours</span>
              <div className="text-lg font-black text-slate-900 dark:text-white font-mono">
                {result.totalHours.toLocaleString()}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Total Minutes</span>
              <div className="text-lg font-black text-slate-900 dark:text-white font-mono break-all">
                {result.totalMinutes.toLocaleString()}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Total Seconds</span>
              <div className="text-lg font-black text-slate-900 dark:text-white font-mono break-all">
                {result.totalSeconds.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Next Birthday & Astrology Highlights */}
          <div>
            {/* Birthday Countdown */}
            <div className="glass-card p-6 rounded-3xl space-y-3 flex items-center justify-between border border-pink-500/20 bg-pink-50/20 dark:bg-slate-900/60">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Gift className="w-5 h-5 text-pink-500" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                    Birthday Countdown from Reference Date
                  </span>
                </div>
                <div className="text-2xl font-black text-pink-600 dark:text-pink-400 font-mono">
                  {result.daysToNextBday === 0 ? 'Birthday on this date!' : `${result.daysToNextBday} days away`}
                </div>
                <p className="text-xs text-slate-500">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{result.nextBirthdayDate}</span> ({result.nextBdayDayOfWeek})
                </p>
              </div>
            </div>

          </div>
          <details className="rounded-3xl border border-slate-200 dark:border-slate-800 p-5">
            <summary className="cursor-pointer min-h-11 text-sm font-bold text-slate-800 dark:text-slate-200">Optional extras: zodiac, birthstone and fun estimates</summary>
            <p className="text-xs text-slate-500 mb-4">For entertainment only. Life statistics are rough estimates over the selected date range, not measurements. The Chinese zodiac below uses the calendar year and does not adjust for Lunar New Year.</p>
            {/* Zodiac & Astrological Signs */}
            <div className="glass-card p-6 rounded-3xl space-y-2 border border-indigo-500/20 bg-indigo-50/20 dark:bg-slate-900/60">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-500" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                  Zodiac & Birthstone
                </span>
              </div>
              <div className="flex flex-wrap gap-4 items-center justify-between pt-1 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Sun Sign</span>
                  <span className="font-black text-base text-slate-900 dark:text-white">
                    {result.zodiacInfo.sign} ({result.zodiacInfo.element})
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Chinese Zodiac</span>
                  <span className="font-black text-base text-slate-900 dark:text-white">
                    Year of the {result.chineseAnimal}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Birthstone</span>
                  <span className="font-black text-base text-indigo-600 dark:text-indigo-400">
                    {result.zodiacInfo.stone}
                  </span>
                </div>
              </div>
            </div>

          {/* Biological / Fun Stats */}
          <div className="glass-card p-6 rounded-3xl space-y-4">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-emerald-500" />
              <span>Biological Journey Since Birth</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                <div className="flex items-center gap-1.5 text-rose-500 font-bold">
                  <Heart className="w-4 h-4" />
                  <span>Estimated Heartbeats</span>
                </div>
                <div className="text-xl font-black text-slate-900 dark:text-white font-mono">
                  ~{(result.estimatedHeartbeats / 1000000).toFixed(1)} Million
                </div>
                <p className="text-[10px] text-slate-400">Based on resting ~80 beats/min</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                <div className="flex items-center gap-1.5 text-cyan-500 font-bold">
                  <Compass className="w-4 h-4" />
                  <span>Estimated Breaths</span>
                </div>
                <div className="text-xl font-black text-slate-900 dark:text-white font-mono">
                  ~{(result.estimatedBreaths / 1000000).toFixed(1)} Million
                </div>
                <p className="text-[10px] text-slate-400">Based on ~16 breaths/min</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                <div className="flex items-center gap-1.5 text-indigo-500 font-bold">
                  <Moon className="w-4 h-4" />
                  <span>Time Spent Sleeping</span>
                </div>
                <div className="text-xl font-black text-slate-900 dark:text-white font-mono">
                  ~{Math.round(result.estimatedSleepHours / 24).toLocaleString()} Days
                </div>
                <p className="text-[10px] text-slate-400">Approx. 1/3 of your entire life</p>
              </div>
            </div>
          </div>
          </details>
        </div>
      ) : !dob ? (
        <div role="status" className="p-8 text-center text-sm text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/40 rounded-3xl border border-slate-200 dark:border-slate-800">
          Select your date of birth above to see your age in years, months, days, and total days old.
        </div>
      ) : (
        <div role="alert" className="p-8 text-center text-xs text-rose-600 dark:text-rose-400 bg-rose-50/50 dark:bg-rose-950/20 rounded-3xl border border-rose-200 dark:border-rose-900">
          Enter valid dates. The reference date must be on or after your date of birth.
        </div>
      )}
    </div>
  );
};
