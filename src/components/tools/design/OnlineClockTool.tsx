import React, { useState, useEffect, useMemo } from 'react';
import { Clock, Plus, Trash2, Sun, Moon, Search, X, Globe, Copy, Check } from 'lucide-react';
import {
  WORLD_CITIES,
  getTimezoneOffsetString,
  getTimezoneAbbreviation,
  TimeZoneOption
} from '../../../lib/timeUtils';

interface OnlineClockToolProps {
  onShowToast: (message: string) => void;
}

interface SavedClock {
  id: string;
  city: string;
  country: string;
  zone: string;
}

const DEFAULT_SELECTED_ZONES: SavedClock[] = [
  { id: '1', city: 'New York', country: 'United States', zone: 'America/New_York' },
  { id: '2', city: 'London', country: 'United Kingdom', zone: 'Europe/London' },
  { id: '3', city: 'Dubai', country: 'United Arab Emirates', zone: 'Asia/Dubai' },
  { id: '4', city: 'Mumbai', country: 'India', zone: 'Asia/Kolkata' },
  { id: '5', city: 'Singapore', country: 'Singapore', zone: 'Asia/Singapore' },
  { id: '6', city: 'Tokyo', country: 'Japan', zone: 'Asia/Tokyo' },
  { id: '7', city: 'Sydney', country: 'Australia', zone: 'Australia/Sydney' },
  { id: '8', city: 'Los Angeles', country: 'United States', zone: 'America/Los_Angeles' },
  { id: '9', city: 'Paris', country: 'France', zone: 'Europe/Paris' },
  { id: '10', city: 'Toronto', country: 'Canada', zone: 'America/Toronto' }
];

export const OnlineClockTool: React.FC<OnlineClockToolProps> = ({ onShowToast }) => {
  // Shared live timestamp updated once per second
  const [currentTime, setCurrentTime] = useState<Date>(() => new Date());
  const [is24Hour, setIs24Hour] = useState<boolean>(false);
  const [worldClocks, setWorldClocks] = useState<SavedClock[]>(() => {
    try {
      const saved = localStorage.getItem('splitdrop-world-clocks');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Ignore
    }
    return DEFAULT_SELECTED_ZONES;
  });

  // Modal / Search state for adding new city
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedTime, setCopiedTime] = useState<string | null>(null);

  // Single shared interval for all clocks
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Save clocks to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('splitdrop-world-clocks', JSON.stringify(worldClocks));
    } catch {
      // Ignore
    }
  }, [worldClocks]);

  // Local user timezone metadata
  const localZone = useMemo(() => {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
    } catch {
      return 'UTC';
    }
  }, []);

  const formatLocalTime = (date: Date, timeZone: string, hour24: boolean) => {
    try {
      const timeFmt = new Intl.DateTimeFormat('en-US', {
        timeZone,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: !hour24
      });

      const dateFmt = new Intl.DateTimeFormat('en-US', {
        timeZone,
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      });

      const hourNumberFmt = new Intl.DateTimeFormat('en-US', {
        timeZone,
        hour: 'numeric',
        hour12: false
      });

      const hourNum = parseInt(hourNumberFmt.format(date), 10) || 12;
      const isDaytime = hourNum >= 6 && hourNum < 18;

      return {
        timeStr: timeFmt.format(date),
        dateStr: dateFmt.format(date),
        isDaytime
      };
    } catch {
      return {
        timeStr: '--:--:--',
        dateStr: '---',
        isDaytime: true
      };
    }
  };

  const localTimeData = formatLocalTime(currentTime, localZone, is24Hour);
  const localOffset = getTimezoneOffsetString(localZone, currentTime);
  const localAbbr = getTimezoneAbbreviation(localZone, currentTime);

  const handleAddClock = (option: TimeZoneOption) => {
    if (worldClocks.some((c) => c.zone === option.zone && c.city === option.city)) {
      onShowToast(`${option.city} is already in your world clocks!`);
      return;
    }

    const newClock: SavedClock = {
      id: `${Date.now()}-${option.zone}`,
      city: option.city,
      country: option.country,
      zone: option.zone
    };

    setWorldClocks((prev) => [...prev, newClock]);
    setIsAddModalOpen(false);
    setSearchQuery('');
    onShowToast(`Added ${option.city} to World Clocks`);
  };

  const handleRemoveClock = (id: string, cityName: string) => {
    setWorldClocks((prev) => prev.filter((c) => c.id !== id));
    onShowToast(`Removed ${cityName}`);
  };

  const handleCopyTime = (timeStr: string, city: string) => {
    navigator.clipboard.writeText(`${city}: ${timeStr}`);
    setCopiedTime(city);
    onShowToast(`Copied ${city} time to clipboard!`);
    setTimeout(() => setCopiedTime(null), 2000);
  };

  // Filter available cities for modal
  const filteredCities = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return WORLD_CITIES;
    return WORLD_CITIES.filter(
      (c) =>
        c.city.toLowerCase().includes(q) ||
        c.country.toLowerCase().includes(q) ||
        c.region.toLowerCase().includes(q) ||
        c.zone.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-5xl mx-auto" id="online-clock-container">
      {/* Header */}
      <div className="border-b border-slate-200/80 dark:border-slate-800 pb-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <span>🌐</span> Online Clock & World Clock
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time local clock and multi-city world time viewer with automatic DST adjustments.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* 12h / 24h toggle */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200/60 dark:border-slate-700/60 text-xs font-bold">
            <button
              id="clock-toggle-12h-btn"
              onClick={() => setIs24Hour(false)}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                !is24Hour
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              12-Hour
            </button>
            <button
              id="clock-toggle-24h-btn"
              onClick={() => setIs24Hour(true)}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                is24Hour
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              24-Hour
            </button>
          </div>

          <button
            id="clock-open-add-modal-btn"
            onClick={() => setIsAddModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add City</span>
          </button>
        </div>
      </div>

      {/* Main Local Clock Hero Card */}
      <div className="glass-card p-8 sm:p-12 rounded-3xl text-center space-y-6 relative overflow-hidden shadow-xl border border-slate-200/70 dark:border-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/60 dark:border-slate-800/60 pb-3">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            <Clock className="w-4 h-4" />
            <span>Your Local Time</span>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-slate-400">
            <span>{localZone}</span>
            <span>•</span>
            <span className="font-bold text-slate-700 dark:text-slate-300">{localOffset}</span>
            {localAbbr && <span>({localAbbr})</span>}
          </div>
        </div>

        {/* Big Time Display */}
        <div className="select-none py-2">
          <div
            className="font-mono text-5xl sm:text-7xl font-black text-slate-900 dark:text-white tracking-widest tabular-nums"
            aria-live="polite"
          >
            {localTimeData.timeStr}
          </div>
          <div className="text-base sm:text-lg font-bold text-slate-600 dark:text-slate-300 mt-3 flex items-center justify-center gap-2">
            <span>{localTimeData.dateStr}</span>
            <span>•</span>
            <span className="flex items-center gap-1 text-sm font-normal text-slate-500 dark:text-slate-400">
              {localTimeData.isDaytime ? (
                <>
                  <Sun className="w-4 h-4 text-amber-500" />
                  <span>Daylight</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-indigo-400" />
                  <span>Night</span>
                </>
              )}
            </span>
          </div>
        </div>
      </div>

      {/* World Clocks Grid */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Globe className="w-4 h-4 text-indigo-500" />
            <span>World Clocks ({worldClocks.length})</span>
          </h3>

          <span className="text-xs text-slate-400 font-medium">Automatic DST synchronization</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {worldClocks.map((clock) => {
            const timeData = formatLocalTime(currentTime, clock.zone, is24Hour);
            const offset = getTimezoneOffsetString(clock.zone, currentTime);
            const abbr = getTimezoneAbbreviation(clock.zone, currentTime);

            return (
              <div
                key={clock.id}
                className="glass-card p-5 rounded-2xl border border-slate-200/70 dark:border-slate-800 space-y-3 hover:border-indigo-400/50 transition-all group relative"
              >
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {clock.city}
                    </h4>
                    <span className="text-[11px] text-slate-400 block">{clock.country}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleCopyTime(timeData.timeStr, clock.city)}
                      title="Copy Time"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      {copiedTime === clock.city ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>

                    <button
                      onClick={() => handleRemoveClock(clock.id, clock.city)}
                      title="Remove Clock"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Time Display */}
                <div className="flex items-baseline justify-between pt-1">
                  <div className="font-mono text-2xl font-black text-slate-900 dark:text-white tabular-nums tracking-wide">
                    {timeData.timeStr}
                  </div>

                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400">
                    {timeData.isDaytime ? (
                      <span title="Daytime"><Sun className="w-4 h-4 text-amber-500" /></span>
                    ) : (
                      <span title="Nighttime"><Moon className="w-4 h-4 text-indigo-400" /></span>
                    )}
                  </div>
                </div>

                {/* Date and Offset */}
                <div className="flex justify-between items-center text-[11px] font-mono text-slate-400 border-t border-slate-100 dark:border-slate-800/80 pt-2">
                  <span>{timeData.dateStr}</span>
                  <span className="font-bold text-slate-600 dark:text-slate-300">
                    {offset} {abbr ? `(${abbr})` : ''}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add City Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="font-black text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-indigo-600" />
                <span>Add World City Clock</span>
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search city, country, or timezone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* City List */}
            <div className="overflow-y-auto space-y-1.5 flex-1 pr-1">
              {filteredCities.map((city) => {
                const isAdded = worldClocks.some((c) => c.zone === city.zone && c.city === city.city);

                return (
                  <button
                    key={`${city.city}-${city.zone}`}
                    onClick={() => handleAddClock(city)}
                    disabled={isAdded}
                    className={`w-full p-3 rounded-xl flex items-center justify-between text-left transition-colors cursor-pointer border ${
                      isAdded
                        ? 'bg-slate-50 dark:bg-slate-800/40 border-transparent opacity-50 cursor-not-allowed'
                        : 'bg-slate-50 hover:bg-indigo-50/50 dark:bg-slate-800/80 dark:hover:bg-indigo-950/30 border-slate-100 dark:border-slate-800 text-slate-900 dark:text-white'
                    }`}
                  >
                    <div>
                      <span className="font-bold text-xs block">{city.city}</span>
                      <span className="text-[10px] text-slate-400">{city.country} • {city.region}</span>
                    </div>

                    <div className="text-right">
                      <span className="text-[11px] font-mono font-bold text-indigo-600 dark:text-indigo-400 block">
                        {getTimezoneOffsetString(city.zone, currentTime)}
                      </span>
                      {isAdded && <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-bold">Added</span>}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
