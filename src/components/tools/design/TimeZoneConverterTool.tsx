import React, { useState, useMemo } from 'react';
import {
  Globe,
  Clock,
  ArrowRightLeft,
  Copy,
  Check,
  Calendar,
  Plus,
  Trash2,
  Sun,
  Moon,
  RotateCcw
} from 'lucide-react';
import {
  WORLD_CITIES,
  getTimezoneOffsetString,
  getTimezoneAbbreviation,
  TimeZoneOption
} from '../../../lib/timeUtils';

interface TimeZoneConverterToolProps {
  onShowToast: (message: string) => void;
}

interface DestinationZone {
  id: string;
  zone: string;
  label: string;
}

const PRESET_DESTINATIONS: DestinationZone[] = [
  { id: '1', zone: 'Europe/London', label: 'London, UK' },
  { id: '2', zone: 'Asia/Dubai', label: 'Dubai, UAE' },
  { id: '3', zone: 'Asia/Kolkata', label: 'Mumbai / India' },
  { id: '4', zone: 'Asia/Tokyo', label: 'Tokyo, Japan' }
];

export const TimeZoneConverterTool: React.FC<TimeZoneConverterToolProps> = ({ onShowToast }) => {
  // Source date & time
  const getInitialLocalDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const [inputDateTime, setInputDateTime] = useState<string>(getInitialLocalDateTime);
  const [fromZone, setFromZone] = useState<string>(() => {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/New_York';
    } catch {
      return 'America/New_York';
    }
  });

  const [destinations, setDestinations] = useState<DestinationZone[]>(PRESET_DESTINATIONS);
  const [is24Hour, setIs24Hour] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Set to current date & time
  const handleSetCurrentDateTime = () => {
    setInputDateTime(getInitialLocalDateTime());
    onShowToast('Updated to current date & time');
  };

  // Construct absolute Date object in source timezone
  const sourceDate = useMemo(() => {
    try {
      if (!inputDateTime) return new Date();
      const [datePart, timePart] = inputDateTime.split('T');
      if (!datePart || !timePart) return new Date();
      const [y, m, d] = datePart.split('-').map(Number);
      const [h, min] = timePart.split(':').map(Number);

      // Create UTC base timestamp, then calibrate offset difference to represent source zone
      const tentativeUtc = Date.UTC(y, m - 1, d, h, min, 0);

      // Calculate source zone offset at that moment
      const dateForTz = new Date(tentativeUtc);
      const isoInZone = dateForTz.toLocaleString('en-US', { timeZone: fromZone });
      const tzDate = new Date(isoInZone);
      const offsetDiff = tzDate.getTime() - tentativeUtc;

      // Adjust so that when displayed in fromZone, it matches inputDateTime
      return new Date(tentativeUtc - offsetDiff);
    } catch {
      return new Date();
    }
  }, [inputDateTime, fromZone]);

  // Convert time to target zone with day difference calculation
  const convertToZone = (date: Date, targetZone: string) => {
    try {
      const timeFmt = new Intl.DateTimeFormat('en-US', {
        timeZone: targetZone,
        hour: '2-digit',
        minute: '2-digit',
        hour12: !is24Hour
      });

      const dateFmt = new Intl.DateTimeFormat('en-US', {
        timeZone: targetZone,
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });

      const hourNumberFmt = new Intl.DateTimeFormat('en-US', {
        timeZone: targetZone,
        hour: 'numeric',
        hour12: false
      });

      const sourceDayFmt = new Intl.DateTimeFormat('en-US', {
        timeZone: fromZone,
        year: 'numeric',
        month: 'numeric',
        day: 'numeric'
      });

      const targetDayFmt = new Intl.DateTimeFormat('en-US', {
        timeZone: targetZone,
        year: 'numeric',
        month: 'numeric',
        day: 'numeric'
      });

      const sourceDayParts = sourceDayFmt.format(date).split('/').map(Number);
      const targetDayParts = targetDayFmt.format(date).split('/').map(Number);

      const sourceDayUtc = Date.UTC(sourceDayParts[2], sourceDayParts[0] - 1, sourceDayParts[1]);
      const targetDayUtc = Date.UTC(targetDayParts[2], targetDayParts[0] - 1, targetDayParts[1]);

      const dayDiffMs = targetDayUtc - sourceDayUtc;
      const dayDiffDays = Math.round(dayDiffMs / (1000 * 60 * 60 * 24));

      let dayTag = 'Same Day';
      if (dayDiffDays > 0) dayTag = `+${dayDiffDays} Day (Tomorrow)`;
      else if (dayDiffDays < 0) dayTag = `${dayDiffDays} Day (Yesterday)`;

      const hourNum = parseInt(hourNumberFmt.format(date), 10) || 12;
      const isDaytime = hourNum >= 6 && hourNum < 18;

      const offsetStr = getTimezoneOffsetString(targetZone, date);
      const abbr = getTimezoneAbbreviation(targetZone, date);

      return {
        timeStr: timeFmt.format(date),
        dateStr: dateFmt.format(date),
        dayTag,
        dayDiffDays,
        isDaytime,
        offsetStr,
        abbr
      };
    } catch {
      return {
        timeStr: '--:--',
        dateStr: '---',
        dayTag: 'Same Day',
        dayDiffDays: 0,
        isDaytime: true,
        offsetStr: 'UTC',
        abbr: ''
      };
    }
  };

  // Swap primary source zone with first destination zone
  const handleSwapPrimary = () => {
    if (destinations.length === 0) return;
    const firstDest = destinations[0];
    const newFromZone = firstDest.zone;
    const updatedDestinations = [
      { id: `${Date.now()}`, zone: fromZone, label: getCityLabel(fromZone) },
      ...destinations.slice(1)
    ];

    setFromZone(newFromZone);
    setDestinations(updatedDestinations);
    onShowToast(`Swapped timezones with ${firstDest.label}`);
  };

  const handleAddDestination = (city: TimeZoneOption) => {
    if (destinations.some((d) => d.zone === city.zone)) {
      onShowToast(`${city.city} is already in destination list!`);
      return;
    }
    setDestinations((prev) => [
      ...prev,
      { id: `${Date.now()}-${city.zone}`, zone: city.zone, label: `${city.city}, ${city.country}` }
    ]);
    onShowToast(`Added ${city.city} to comparison`);
  };

  const handleRemoveDestination = (id: string) => {
    if (destinations.length <= 1) {
      onShowToast('Please keep at least one destination timezone.');
      return;
    }
    setDestinations((prev) => prev.filter((d) => d.id !== id));
  };

  const getCityLabel = (zone: string) => {
    const match = WORLD_CITIES.find((c) => c.zone === zone);
    if (match) return `${match.city}, ${match.country}`;
    const city = zone.split('/').pop()?.replace(/_/g, ' ') || zone;
    return city;
  };

  // Copy full conversion summary
  const copyAllConversions = () => {
    const lines = [
      `Source: ${getCityLabel(fromZone)} (${getTimezoneOffsetString(fromZone, sourceDate)})`,
      `Time: ${convertToZone(sourceDate, fromZone).timeStr} — ${convertToZone(sourceDate, fromZone).dateStr}`,
      '',
      'Converted Destinations:'
    ];

    destinations.forEach((dest) => {
      const conv = convertToZone(sourceDate, dest.zone);
      lines.push(
        `• ${dest.label}: ${conv.timeStr} (${conv.dayTag}) | ${conv.offsetStr} ${conv.abbr ? `(${conv.abbr})` : ''}`
      );
    });

    navigator.clipboard.writeText(lines.join('\n'));
    setCopied(true);
    onShowToast('Converted schedule copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const sourceConversion = convertToZone(sourceDate, fromZone);

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-5xl mx-auto" id="time-zone-converter-container">
      {/* Header */}
      <div className="border-b border-slate-200/80 dark:border-slate-800 pb-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <span>🌐</span> Time Zone Converter
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Convert date and time across multiple global time zones with automatic Daylight Saving Time (DST) tracking.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* 12h / 24h toggle */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200/60 dark:border-slate-700/60 text-xs font-bold">
            <button
              onClick={() => setIs24Hour(false)}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                !is24Hour
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              12H
            </button>
            <button
              onClick={() => setIs24Hour(true)}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                is24Hour
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              24H
            </button>
          </div>

          <button
            id="tz-copy-all-btn"
            onClick={copyAllConversions}
            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Summary'}</span>
          </button>
        </div>
      </div>

      {/* Main Conversion Control Panel */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Source Zone Box */}
        <div className="md:col-span-5 glass-card p-6 sm:p-7 rounded-3xl space-y-4 border border-slate-200/70 dark:border-slate-800 shadow-md">
          <div className="flex justify-between items-center">
            <span className="text-xs font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              <span>Source Time Zone</span>
            </span>

            <button
              onClick={handleSetCurrentDateTime}
              className="text-[11px] font-bold text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1 cursor-pointer transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Use Current Time</span>
            </button>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400">Select City / Timezone</label>
            <select
              value={fromZone}
              onChange={(e) => setFromZone(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {WORLD_CITIES.map((c) => (
                <option key={`${c.city}-${c.zone}`} value={c.zone}>
                  {c.city}, {c.country} ({c.zone})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400">Date & Time</label>
            <input
              type="datetime-local"
              value={inputDateTime}
              onChange={(e) => setInputDateTime(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono font-bold text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Source formatted preview */}
          <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800/60 flex justify-between items-center text-xs font-mono">
            <span className="text-slate-500">{sourceConversion.dateStr}</span>
            <span className="font-black text-slate-900 dark:text-white">{sourceConversion.timeStr}</span>
          </div>
        </div>

        {/* Swap Button Divider */}
        <div className="md:col-span-2 flex justify-center py-2">
          <button
            id="tz-swap-btn"
            onClick={handleSwapPrimary}
            title="Swap source with first destination"
            className="p-4 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 shadow-md transition-all hover:scale-110 active:scale-95 cursor-pointer border border-slate-200 dark:border-slate-700"
          >
            <ArrowRightLeft className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </button>
        </div>

        {/* Primary Destination Output Box */}
        <div className="md:col-span-5 glass-card p-6 sm:p-7 rounded-3xl space-y-4 border-2 border-indigo-500/30 bg-indigo-500/5 shadow-md">
          <div className="flex justify-between items-center">
            <span className="text-xs font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
              <Globe className="w-4 h-4" />
              <span>Primary Destination</span>
            </span>

            {destinations.length > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300">
                {convertToZone(sourceDate, destinations[0].zone).dayTag}
              </span>
            )}
          </div>

          {destinations.length > 0 && (
            <>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400">Target Timezone</label>
                <select
                  value={destinations[0].zone}
                  onChange={(e) => {
                    const newZone = e.target.value;
                    setDestinations((prev) => [
                      { ...prev[0], zone: newZone, label: getCityLabel(newZone) },
                      ...prev.slice(1)
                    ]);
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-xs text-slate-900 dark:text-white"
                >
                  {WORLD_CITIES.map((c) => (
                    <option key={`dest0-${c.city}-${c.zone}`} value={c.zone}>
                      {c.city}, {c.country} ({c.zone})
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Converted Time</span>
                <div className="font-mono text-3xl font-black text-slate-900 dark:text-white tracking-wide">
                  {convertToZone(sourceDate, destinations[0].zone).timeStr}
                </div>
                <div className="text-xs font-mono text-slate-500 dark:text-slate-400 flex items-center justify-between pt-1">
                  <span>{convertToZone(sourceDate, destinations[0].zone).dateStr}</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">
                    {convertToZone(sourceDate, destinations[0].zone).offsetStr}
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Multiple Destination Time Zones Section */}
      <div className="space-y-4">
        <div className="flex flex-wrap justify-between items-center gap-3">
          <div>
            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Globe className="w-4 h-4 text-indigo-500" />
              <span>All Destination Time Zones ({destinations.length})</span>
            </h3>
            <span className="text-xs text-slate-400 font-medium">Compare times across multiple cities side-by-side</span>
          </div>

          {/* Quick preset city adder */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-bold text-slate-400 mr-1">Quick Add:</span>
            {WORLD_CITIES.slice(0, 6).map((c) => (
              <button
                key={`add-${c.city}`}
                onClick={() => handleAddDestination(c)}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-indigo-50 dark:bg-slate-800 dark:hover:bg-indigo-950/40 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors cursor-pointer border border-slate-200/60 dark:border-slate-700/60"
              >
                +{c.city}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {destinations.map((dest, idx) => {
            const conv = convertToZone(sourceDate, dest.zone);

            return (
              <div
                key={dest.id}
                className="glass-card p-5 rounded-2xl border border-slate-200/70 dark:border-slate-800 space-y-3 relative hover:border-indigo-400/50 transition-all shadow-sm"
              >
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900 dark:text-white truncate">
                      {dest.label}
                    </h4>
                    <span className="text-[10px] font-mono text-slate-400 block">{dest.zone}</span>
                  </div>

                  {idx > 0 && (
                    <button
                      onClick={() => handleRemoveDestination(dest.id)}
                      title="Remove Destination"
                      className="p-1 rounded-lg text-slate-400 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Time Display */}
                <div className="flex items-baseline justify-between pt-1">
                  <div className="font-mono text-2xl font-black text-slate-900 dark:text-white tabular-nums tracking-wide">
                    {conv.timeStr}
                  </div>

                  <div className="flex items-center gap-1 text-xs">
                    {conv.isDaytime ? (
                      <span title="Daytime"><Sun className="w-4 h-4 text-amber-500" /></span>
                    ) : (
                      <span title="Nighttime"><Moon className="w-4 h-4 text-indigo-400" /></span>
                    )}
                  </div>
                </div>

                {/* Day difference badge & offset */}
                <div className="flex justify-between items-center text-[11px] border-t border-slate-100 dark:border-slate-800/80 pt-2 font-mono">
                  <span
                    className={`font-bold px-2 py-0.5 rounded-md ${
                      conv.dayDiffDays > 0
                        ? 'bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300'
                        : conv.dayDiffDays < 0
                        ? 'bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300'
                        : 'text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {conv.dayTag}
                  </span>

                  <span className="font-bold text-slate-600 dark:text-slate-300">
                    {conv.offsetStr} {conv.abbr ? `(${conv.abbr})` : ''}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
