import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, RotateCcw, Bell, BellOff, Volume2, Sparkles, CheckCircle2 } from 'lucide-react';
import { formatTimerDisplay, playChimeSound } from '../../../lib/timeUtils';

interface CountdownTimerToolProps {
  onShowToast: (message: string) => void;
}

const PRESETS = [
  { label: '10s', seconds: 10 },
  { label: '30s', seconds: 30 },
  { label: '1m', seconds: 60 },
  { label: '5m', seconds: 300 },
  { label: '10m', seconds: 600 },
  { label: '15m', seconds: 900 },
  { label: '25m', seconds: 1500 },
  { label: '30m', seconds: 1800 },
  { label: '1h', seconds: 3600 }
];

// Safe helper to check Notification permission without throwing SecurityError in sandboxed iframes
function getSafeNotificationPermission(): NotificationPermission | null {
  try {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      return Notification.permission;
    }
  } catch {
    // Sandboxed iframe or permission access denied
  }
  return null;
}

export const CountdownTimerTool: React.FC<CountdownTimerToolProps> = ({ onShowToast }) => {
  // Configured target duration in seconds
  const [totalSeconds, setTotalSeconds] = useState<number>(300); // default 5m
  // Remaining seconds
  const [secondsLeft, setSecondsLeft] = useState<number>(300);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  // Custom input controls
  const [customHours, setCustomHours] = useState<number>(0);
  const [customMinutes, setCustomMinutes] = useState<number>(5);
  const [customSeconds, setCustomSeconds] = useState<number>(0);

  // Notification state
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(false);

  // Accuracy tracking refs using timestamps
  const targetEndTimeRef = useRef<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Trigger completion state, audio chime, and optional notification
  const handleComplete = useCallback(() => {
    setIsRunning(false);
    setIsCompleted(true);
    setSecondsLeft(0);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    targetEndTimeRef.current = null;

    // Play pleasant Web Audio chime
    try {
      playChimeSound('alert');
    } catch {
      // Audio autoplay policy or context error
    }
    onShowToast("⏰ Time's up!");

    // Browser notification if granted
    if (notificationsEnabled) {
      try {
        const perm = getSafeNotificationPermission();
        if (perm === 'granted') {
          new Notification("Zubware Timer — Time's up!", {
            body: `Your countdown for ${formatTimerDisplay(totalSeconds)} has finished!`,
            icon: '/icon.png'
          });
        }
      } catch {
        // Ignore notification errors in iframe/sandboxed environments
      }
    }
  }, [notificationsEnabled, onShowToast, totalSeconds]);

  const handleCompleteRef = useRef(handleComplete);
  handleCompleteRef.current = handleComplete;

  // Accurate interval tick using timestamp delta
  useEffect(() => {
    if (isRunning && targetEndTimeRef.current !== null) {
      intervalRef.current = setInterval(() => {
        const now = Date.now();
        const diffMs = (targetEndTimeRef.current as number) - now;
        const remaining = Math.max(0, Math.ceil(diffMs / 1000));

        setSecondsLeft(remaining);

        if (remaining <= 0) {
          handleCompleteRef.current();
        }
      }, 250); // fast interval for responsive seconds update
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning]);

  // Handle visibility change to immediately re-sync on tab focus
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && isRunning && targetEndTimeRef.current !== null) {
        const now = Date.now();
        const diffMs = targetEndTimeRef.current - now;
        const remaining = Math.max(0, Math.ceil(diffMs / 1000));
        setSecondsLeft(remaining);
        if (remaining <= 0) {
          handleCompleteRef.current();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isRunning, handleComplete]);

  const handleStart = () => {
    if (secondsLeft <= 0) {
      if (totalSeconds <= 0) {
        onShowToast('Please set a duration greater than 0.');
        return;
      }
      setSecondsLeft(totalSeconds);
      targetEndTimeRef.current = Date.now() + totalSeconds * 1000;
    } else {
      targetEndTimeRef.current = Date.now() + secondsLeft * 1000;
    }
    setIsCompleted(false);
    setIsRunning(true);
  };

  const handlePause = () => {
    if (!isRunning) return;
    if (targetEndTimeRef.current !== null) {
      const now = Date.now();
      const diffMs = targetEndTimeRef.current - now;
      const remaining = Math.max(0, Math.ceil(diffMs / 1000));
      setSecondsLeft(remaining);
    }
    setIsRunning(false);
    targetEndTimeRef.current = null;
  };

  const handleToggle = () => {
    if (isRunning) {
      handlePause();
    } else {
      handleStart();
    }
  };

  const handleReset = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsRunning(false);
    setIsCompleted(false);
    targetEndTimeRef.current = null;
    setSecondsLeft(totalSeconds);
  };

  const selectPreset = (secs: number) => {
    if (isRunning) handlePause();
    setIsCompleted(false);
    setTotalSeconds(secs);
    setSecondsLeft(secs);

    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    setCustomHours(h);
    setCustomMinutes(m);
    setCustomSeconds(s);

    onShowToast(`Timer set to ${formatTimerDisplay(secs)}`);
  };

  const applyCustomDuration = () => {
    const total = customHours * 3600 + customMinutes * 60 + customSeconds;
    if (total <= 0) {
      onShowToast('Please enter a duration greater than zero.');
      return;
    }
    if (isRunning) handlePause();
    setIsCompleted(false);
    setTotalSeconds(total);
    setSecondsLeft(total);
    onShowToast(`Timer set to ${formatTimerDisplay(total)}`);
  };

  const toggleNotifications = async () => {
    try {
      if (typeof window === 'undefined' || !('Notification' in window)) {
        onShowToast('Desktop notifications are not supported by this browser.');
        return;
      }

      const currentPerm = getSafeNotificationPermission();
      if (!currentPerm) {
        onShowToast('Notification permission is restricted in this environment.');
        return;
      }

      if (currentPerm === 'granted') {
        setNotificationsEnabled(!notificationsEnabled);
        onShowToast(!notificationsEnabled ? 'Desktop notifications enabled!' : 'Notifications muted.');
      } else if (currentPerm !== 'denied') {
        try {
          const permission = await Notification.requestPermission();
          if (permission === 'granted') {
            setNotificationsEnabled(true);
            onShowToast('Notifications enabled for timer completion!');
          } else {
            onShowToast('Notification permission was declined.');
          }
        } catch {
          onShowToast('Notification prompt blocked by browser.');
        }
      } else {
        onShowToast('Notifications blocked in browser settings.');
      }
    } catch {
      onShowToast('Notifications cannot be enabled in this frame.');
    }
  };

  // Keyboard accessibility: Space to start/pause, R to reset
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        return;
      }
      if (e.code === 'Space') {
        e.preventDefault();
        handleToggle();
      } else if (e.code === 'KeyR') {
        e.preventDefault();
        handleReset();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isRunning, secondsLeft, totalSeconds]);

  // Calculate percentage remaining for circular progress
  const progressPercent = totalSeconds > 0 ? ((totalSeconds - secondsLeft) / totalSeconds) * 100 : 0;

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-4xl mx-auto" id="countdown-timer-container">
      {/* Header */}
      <div className="border-b border-slate-200/80 dark:border-slate-800 pb-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <span>⏲️</span> Countdown Timer
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Accurate live countdown timer with custom presets, audio chime, and optional desktop alerts.
          </p>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-2">
          <button
            id="timer-preview-audio-btn"
            onClick={() => {
              playChimeSound('alert');
              onShowToast('Played test alarm chime');
            }}
            title="Preview Alarm Sound"
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer text-xs flex items-center gap-1.5 font-bold"
          >
            <Volume2 className="w-4 h-4 text-indigo-500" />
            <span className="hidden sm:inline">Test Sound</span>
          </button>

          <button
            id="timer-notification-btn"
            onClick={toggleNotifications}
            title={notificationsEnabled ? 'Mute Notifications' : 'Enable Desktop Notification'}
            className={`p-2.5 rounded-xl transition-colors cursor-pointer text-xs flex items-center gap-1.5 font-bold ${
              notificationsEnabled
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'
            }`}
          >
            {notificationsEnabled ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
            <span className="hidden sm:inline">{notificationsEnabled ? 'Alerts On' : 'Alerts Off'}</span>
          </button>
        </div>
      </div>

      {/* Main Timer Display */}
      <div className="glass-card p-8 sm:p-14 rounded-3xl text-center space-y-8 flex flex-col items-center justify-center relative overflow-hidden shadow-xl border border-slate-200/70 dark:border-slate-800">
        {/* Completion Alert Banner */}
        {isCompleted && (
          <div className="w-full max-w-md p-4 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 font-bold flex items-center justify-center gap-2 animate-bounce">
            <Sparkles className="w-5 h-5" />
            <span className="text-base sm:text-lg">Time&apos;s up! Well done.</span>
          </div>
        )}

        {/* Big Digital Display */}
        <div className="w-full flex flex-col items-center justify-center select-none py-2">
          <div
            className={`font-mono text-5xl sm:text-8xl font-black tracking-widest tabular-nums transition-colors ${
              isCompleted
                ? 'text-amber-500 animate-pulse'
                : secondsLeft <= 10 && isRunning
                ? 'text-rose-600 dark:text-rose-400'
                : 'text-slate-900 dark:text-white'
            }`}
            aria-live="polite"
          >
            {formatTimerDisplay(secondsLeft)}
          </div>

          {/* Progress bar */}
          <div className="w-full max-w-md mt-6 bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                isCompleted ? 'bg-amber-500' : 'bg-indigo-600'
              }`}
              style={{ width: `${Math.min(100, Math.max(0, 100 - progressPercent))}%` }}
            />
          </div>
        </div>

        {/* Primary Controls */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 pt-2">
          {/* Start / Pause */}
          <button
            id="timer-start-pause-btn"
            onClick={handleToggle}
            aria-label={isRunning ? 'Pause countdown timer' : 'Start countdown timer'}
            className={`min-w-[140px] px-8 py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-3 transition-all duration-200 shadow-lg cursor-pointer ${
              isRunning
                ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/25 active:scale-95'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/25 hover:shadow-indigo-600/35 active:scale-95'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-5 h-5 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-current" />
                <span>{secondsLeft < totalSeconds && secondsLeft > 0 ? 'Resume' : 'Start'}</span>
              </>
            )}
          </button>

          {/* Reset */}
          <button
            id="timer-reset-btn"
            onClick={handleReset}
            disabled={secondsLeft === totalSeconds && !isCompleted}
            aria-label="Reset countdown timer"
            className="px-6 py-4 rounded-2xl bg-slate-100 dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed font-bold text-sm flex items-center gap-2 transition-all cursor-pointer border border-slate-200 dark:border-slate-700 active:scale-95"
          >
            <RotateCcw className="w-4 h-4 text-slate-500" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Quick Presets Grid */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-4 border border-slate-200/70 dark:border-slate-800">
        <div className="flex justify-between items-center">
          <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            Quick Duration Presets
          </h3>
          <span className="text-[11px] text-slate-400 font-medium">Click to set duration</span>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-9 gap-2">
          {PRESETS.map((preset) => (
            <button
              key={preset.seconds}
              onClick={() => selectPreset(preset.seconds)}
              className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all text-center cursor-pointer border ${
                totalSeconds === preset.seconds && !isCompleted
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                  : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-indigo-400'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Duration Configurator */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-4 border border-slate-200/70 dark:border-slate-800">
        <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
          Custom Duration
        </h3>

        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 items-end">
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400">Hours</label>
            <input
              type="number"
              min="0"
              max="99"
              value={customHours}
              onChange={(e) => setCustomHours(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm font-mono font-bold text-slate-900 dark:text-white"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400">Minutes</label>
            <input
              type="number"
              min="0"
              max="59"
              value={customMinutes}
              onChange={(e) => setCustomMinutes(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm font-mono font-bold text-slate-900 dark:text-white"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400">Seconds</label>
            <input
              type="number"
              min="0"
              max="59"
              value={customSeconds}
              onChange={(e) => setCustomSeconds(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm font-mono font-bold text-slate-900 dark:text-white"
            />
          </div>

          <div className="col-span-3 sm:col-span-1">
            <button
              id="timer-apply-custom-btn"
              onClick={applyCustomDuration}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 text-xs font-bold transition-colors cursor-pointer shadow-sm flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Set Time</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
