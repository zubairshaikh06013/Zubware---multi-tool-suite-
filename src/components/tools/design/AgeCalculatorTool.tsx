import React, { useState } from 'react';
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
  Award, 
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

const parseLocalDate = (dateStr: string) => {
  if (!dateStr) return null;
  const parts = dateStr.split('-').map(Number);
  if (parts.length !== 3 || parts.some(isNaN)) return null;
  const [y, m, d] = parts;
  return new Date(y, m - 1, d);
};

export const AgeCalculatorTool: React.FC<AgeCalculatorToolProps> = ({ onShowToast }) => {
  const [dob, setDob] = useState<string>('1998-05-15');
  const [targetDate, setTargetDate] = useState<string>(getTodayString());
  const [copied, setCopied] = useState<boolean>(false);

  const calculateAge = () => {
    const birth = parseLocalDate(dob);
    const target = parseLocalDate(targetDate);

    if (!birth || !target || isNaN(birth.getTime()) || isNaN(target.getTime()) || birth > target) {
      return null;
    }

    let years = target.getFullYear() - birth.getFullYear();
    let months = target.getMonth() - birth.getMonth();
    let days = target.getDate() - birth.getDate();

    if (days < 0) {
      months--;
      const prevMonthLastDay = new Date(target.getFullYear(), target.getMonth(), 0).getDate();
      days += prevMonthLastDay;
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    const diffMs = target.getTime() - birth.getTime();
    const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const totalMonths = years * 12 + months;
    const totalHours = totalDays * 24;
    const totalMinutes = totalHours * 60;
    const totalSeconds = totalMinutes * 60;

    // Day of birth
    const birthDayOfWeek = birth.toLocaleDateString('en-US', { weekday: 'long' });

    // Next Birthday
    const nextBday = new Date(target.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBday < target) {
      nextBday.setFullYear(target.getFullYear() + 1);
    }
    const daysToNextBday = Math.ceil((nextBday.getTime() - target.getTime()) / (1000 * 60 * 60 * 24));
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
    const chineseAnimal = chineseZodiacAnimals[(birthYear - 4) % 12];

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
      zodiacInfo,
      chineseAnimal,
      estimatedHeartbeats,
      estimatedBreaths,
      estimatedSleepHours
    };
  };

  const result = calculateAge();

  const copyAgeSummary = () => {
    if (!result) return;
    const text = `Exact Age: ${result.years} years, ${result.months} months, ${result.days} days | Born on a ${result.birthDayOfWeek} | Zodiac: ${result.zodiacInfo.sign} (${result.zodiacInfo.element}) | Next Birthday in: ${result.daysToNextBday} days`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    onShowToast('Copied age summary to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      {/* Title Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            Chronological Age Calculator & Life Milestones
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Exact age in years, months, and days, with next birthday countdown, zodiac sign, birthstone, and fun biological statistics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setDob('1998-05-15');
              setTargetDate(getTodayString());
              onShowToast('Reset to default dates');
            }}
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
            title="Reset to default dates"
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
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-indigo-500" />
            <span>Date of Birth</span>
          </label>
          <input
            type="date"
            value={dob}
            onChange={e => setDob(e.target.value)}
            className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-base font-bold text-slate-900 dark:text-white"
          />
        </div>

        <div className="glass-card p-5 rounded-3xl space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-indigo-500" />
              <span>Age at Date (Reference Date)</span>
            </label>
            <button
              type="button"
              onClick={() => setTargetDate(getTodayString())}
              className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
            >
              Set to Today
            </button>
          </div>
          <input
            type="date"
            value={targetDate}
            onChange={e => setTargetDate(e.target.value)}
            className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-base font-bold text-slate-900 dark:text-white"
          />
        </div>
      </div>

      {result ? (
        <div className="space-y-6">
          {/* Main Hero Age Display */}
          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-indigo-500/20 bg-gradient-to-br from-indigo-50/30 to-purple-50/20 dark:from-slate-900/60 dark:to-indigo-950/20 space-y-4">
            <div className="flex flex-wrap items-baseline gap-2">
              <span className="text-3xl sm:text-5xl font-black text-indigo-600 dark:text-indigo-400 font-mono">
                {result.years}
              </span>
              <span className="text-sm sm:text-base font-bold text-slate-500 uppercase">Years</span>

              <span className="text-3xl sm:text-5xl font-black text-indigo-600 dark:text-indigo-400 font-mono ml-3">
                {result.months}
              </span>
              <span className="text-sm sm:text-base font-bold text-slate-500 uppercase">Months</span>

              <span className="text-3xl sm:text-5xl font-black text-indigo-600 dark:text-indigo-400 font-mono ml-3">
                {result.days}
              </span>
              <span className="text-sm sm:text-base font-bold text-slate-500 uppercase">Days</span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
              You were born on a <span className="font-bold text-slate-900 dark:text-white">{result.birthDayOfWeek}</span>.
            </p>
          </div>

          {/* Quick Metrics Breakdown Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Total Months</span>
              <div className="text-lg font-black text-slate-900 dark:text-white font-mono">
                {result.totalMonths.toLocaleString()}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Total Weeks</span>
              <div className="text-lg font-black text-slate-900 dark:text-white font-mono">
                {result.totalWeeks.toLocaleString()}
              </div>
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
              <div className="text-lg font-black text-slate-900 dark:text-white font-mono truncate">
                {result.totalMinutes.toLocaleString()}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Total Seconds</span>
              <div className="text-lg font-black text-slate-900 dark:text-white font-mono truncate">
                {result.totalSeconds.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Next Birthday & Astrology Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Birthday Countdown */}
            <div className="glass-card p-6 rounded-3xl space-y-3 flex items-center justify-between border border-pink-500/20 bg-pink-50/20 dark:bg-slate-900/60">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Gift className="w-5 h-5 text-pink-500" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                    Next Birthday Countdown
                  </span>
                </div>
                <div className="text-2xl font-black text-pink-600 dark:text-pink-400 font-mono">
                  {result.daysToNextBday} Days Left
                </div>
                <p className="text-xs text-slate-500">
                  Will fall on a <span className="font-semibold text-slate-800 dark:text-slate-200">{result.nextBdayDayOfWeek}</span>
                </p>
              </div>
            </div>

            {/* Zodiac & Astrological Signs */}
            <div className="glass-card p-6 rounded-3xl space-y-2 border border-indigo-500/20 bg-indigo-50/20 dark:bg-slate-900/60">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-500" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                  Zodiac & Birthstone
                </span>
              </div>
              <div className="flex items-center justify-between pt-1 text-xs">
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
        </div>
      ) : (
        <div className="p-8 text-center text-xs text-rose-500 bg-rose-50/50 dark:bg-rose-950/20 rounded-3xl border border-rose-200 dark:border-rose-900">
          Target date must be later than or equal to the date of birth.
        </div>
      )}
    </div>
  );
};
