/**
 * Shared Time and Audio Utilities for Zubware
 * 100% Client-side, browser-native Intl & Web Audio API
 */

export interface TimeZoneOption {
  city: string;
  country: string;
  zone: string;
  region: string;
}

export const WORLD_CITIES: TimeZoneOption[] = [
  { city: 'New York', country: 'United States', zone: 'America/New_York', region: 'Americas' },
  { city: 'Los Angeles', country: 'United States', zone: 'America/Los_Angeles', region: 'Americas' },
  { city: 'Chicago', country: 'United States', zone: 'America/Chicago', region: 'Americas' },
  { city: 'Toronto', country: 'Canada', zone: 'America/Toronto', region: 'Americas' },
  { city: 'Vancouver', country: 'Canada', zone: 'America/Vancouver', region: 'Americas' },
  { city: 'Mexico City', country: 'Mexico', zone: 'America/Mexico_City', region: 'Americas' },
  { city: 'Sao Paulo', country: 'Brazil', zone: 'America/Sao_Paulo', region: 'Americas' },
  { city: 'Buenos Aires', country: 'Argentina', zone: 'America/Argentina/Buenos_Aires', region: 'Americas' },
  { city: 'London', country: 'United Kingdom', zone: 'Europe/London', region: 'Europe' },
  { city: 'Paris', country: 'France', zone: 'Europe/Paris', region: 'Europe' },
  { city: 'Berlin', country: 'Germany', zone: 'Europe/Berlin', region: 'Europe' },
  { city: 'Rome', country: 'Italy', zone: 'Europe/Rome', region: 'Europe' },
  { city: 'Madrid', country: 'Spain', zone: 'Europe/Madrid', region: 'Europe' },
  { city: 'Amsterdam', country: 'Netherlands', zone: 'Europe/Amsterdam', region: 'Europe' },
  { city: 'Zurich', country: 'Switzerland', zone: 'Europe/Zurich', region: 'Europe' },
  { city: 'Stockholm', country: 'Sweden', zone: 'Europe/Stockholm', region: 'Europe' },
  { city: 'Athens', country: 'Greece', zone: 'Europe/Athens', region: 'Europe' },
  { city: 'Istanbul', country: 'Turkey', zone: 'Europe/Istanbul', region: 'Europe' },
  { city: 'Dubai', country: 'United Arab Emirates', zone: 'Asia/Dubai', region: 'Middle East' },
  { city: 'Riyadh', country: 'Saudi Arabia', zone: 'Asia/Riyadh', region: 'Middle East' },
  { city: 'Cairo', country: 'Egypt', zone: 'Africa/Cairo', region: 'Africa' },
  { city: 'Johannesburg', country: 'South Africa', zone: 'Africa/Johannesburg', region: 'Africa' },
  { city: 'Mumbai', country: 'India', zone: 'Asia/Kolkata', region: 'Asia' },
  { city: 'New Delhi', country: 'India', zone: 'Asia/Kolkata', region: 'Asia' },
  { city: 'Bangkok', country: 'Thailand', zone: 'Asia/Bangkok', region: 'Asia' },
  { city: 'Singapore', country: 'Singapore', zone: 'Asia/Singapore', region: 'Asia' },
  { city: 'Hong Kong', country: 'Hong Kong', zone: 'Asia/Hong_Kong', region: 'Asia' },
  { city: 'Tokyo', country: 'Japan', zone: 'Asia/Tokyo', region: 'Asia' },
  { city: 'Seoul', country: 'South Korea', zone: 'Asia/Seoul', region: 'Asia' },
  { city: 'Shanghai', country: 'China', zone: 'Asia/Shanghai', region: 'Asia' },
  { city: 'Sydney', country: 'Australia', zone: 'Australia/Sydney', region: 'Pacific' },
  { city: 'Melbourne', country: 'Australia', zone: 'Australia/Melbourne', region: 'Pacific' },
  { city: 'Auckland', country: 'New Zealand', zone: 'Pacific/Auckland', region: 'Pacific' },
  { city: 'Honolulu', country: 'United States', zone: 'Pacific/Honolulu', region: 'Pacific' },
  { city: 'UTC (Coordinated Universal Time)', country: 'Universal', zone: 'UTC', region: 'Global' }
];

/**
 * Calculates accurate UTC offset string for a given timezone (e.g. "UTC+05:30", "UTC-05:00")
 * Automatically accounts for Daylight Saving Time (DST) on the specified date.
 */
export function getTimezoneOffsetString(timeZone: string, date: Date = new Date()): string {
  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone,
      timeZoneName: 'longOffset'
    });
    const parts = formatter.formatToParts(date);
    const tzPart = parts.find((p) => p.type === 'timeZoneName');
    if (tzPart && tzPart.value) {
      // Returns e.g. "GMT+5:30" or "GMT-4"
      return tzPart.value.replace('GMT', 'UTC');
    }
  } catch {
    // Fallback calculation using Date offset diff
  }

  try {
    const isoString = date.toLocaleString('en-US', { timeZone });
    const targetDate = new Date(isoString);
    const utcDate = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }));
    const diffMinutes = Math.round((targetDate.getTime() - utcDate.getTime()) / 60000);
    const sign = diffMinutes >= 0 ? '+' : '-';
    const absMinutes = Math.abs(diffMinutes);
    const hours = Math.floor(absMinutes / 60);
    const minutes = absMinutes % 60;
    return `UTC${sign}${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  } catch {
    return 'UTC';
  }
}

/**
 * Retrieves the short timezone abbreviation (e.g., EST, EDT, BST, JST)
 */
export function getTimezoneAbbreviation(timeZone: string, date: Date = new Date()): string {
  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone,
      timeZoneName: 'short'
    });
    const parts = formatter.formatToParts(date);
    const tzPart = parts.find((p) => p.type === 'timeZoneName');
    return tzPart ? tzPart.value : '';
  } catch {
    return '';
  }
}

/**
 * Formats stopwatch milliseconds into HH:MM:SS.mmm
 */
export function formatStopwatchTime(timeMs: number): string {
  const ms = Math.floor(timeMs % 1000);
  const secs = Math.floor((timeMs / 1000) % 60);
  const mins = Math.floor((timeMs / (1000 * 60)) % 60);
  const hrs = Math.floor(timeMs / (1000 * 60 * 60));

  const formattedMs = ms.toString().padStart(3, '0');
  const formattedSecs = secs.toString().padStart(2, '0');
  const formattedMins = mins.toString().padStart(2, '0');
  const formattedHrs = hrs.toString().padStart(2, '0');

  return `${formattedHrs}:${formattedMins}:${formattedSecs}.${formattedMs}`;
}

/**
 * Formats countdown seconds into MM:SS or HH:MM:SS
 */
export function formatTimerDisplay(totalSeconds: number): string {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds || 0));
  const hrs = Math.floor(safeSeconds / 3600);
  const mins = Math.floor((safeSeconds % 3600) / 60);
  const secs = safeSeconds % 60;

  const formattedMins = mins.toString().padStart(2, '0');
  const formattedSecs = secs.toString().padStart(2, '0');

  if (hrs > 0) {
    const formattedHrs = hrs.toString().padStart(2, '0');
    return `${formattedHrs}:${formattedMins}:${formattedSecs}`;
  }

  return `${formattedMins}:${formattedSecs}`;
}

// Shared singleton AudioContext to prevent exceeding mobile hardware context limit (max 6 on Android Chrome)
let sharedAudioCtx: AudioContext | null = null;

function getSafeAudioContext(): AudioContext | null {
  try {
    if (typeof window === 'undefined') return null;
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return null;

    if (!sharedAudioCtx || sharedAudioCtx.state === 'closed') {
      sharedAudioCtx = new AudioContextClass();
    }
    if (sharedAudioCtx.state === 'suspended') {
      sharedAudioCtx.resume().catch(() => {});
    }
    return sharedAudioCtx;
  } catch {
    return null;
  }
}

/**
 * Plays a pleasant browser-generated sound using Web Audio API (Zero external files)
 */
export function playChimeSound(type: 'beep' | 'success' | 'alert' = 'alert'): void {
  try {
    const ctx = getSafeAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    if (type === 'alert') {
      // Gentle four-tone chime (C5 -> E5 -> G5 -> C6)
      const freqs = [523.25, 659.25, 783.99, 1046.5];
      freqs.forEach((freq, idx) => {
        try {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.18);

          gain.gain.setValueAtTime(0.0001, now + idx * 0.18);
          gain.gain.exponentialRampToValueAtTime(0.25, now + idx * 0.18 + 0.04);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.18 + 0.45);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now + idx * 0.18);
          osc.stop(now + idx * 0.18 + 0.5);
        } catch {
          // Ignore individual oscillator error
        }
      });
    } else if (type === 'beep') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(880, now);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.15);
    }
  } catch {
    // AudioContext blocked or not supported; gracefully ignore
  }
}
