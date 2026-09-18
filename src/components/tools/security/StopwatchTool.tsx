import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, RotateCcw, Flag, Copy, Check, Trash2 } from 'lucide-react';
import { formatStopwatchTime } from '../../../lib/timeUtils';

interface StopwatchToolProps {
  onShowToast: (message: string) => void;
}

interface LapItem {
  id: number;
  lapTime: number; // Split time (duration of this lap)
  totalTime: number; // Overall elapsed time at this lap
}

export const StopwatchTool: React.FC<StopwatchToolProps> = ({ onShowToast }) => {
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [laps, setLaps] = useState<LapItem[]>([]);
  const [copied, setCopied] = useState<boolean>(false);

  // Performance tracking refs to prevent background tab throttling inaccuracies
  const startTimeRef = useRef<number>(0);
  const accumulatedTimeRef = useRef<number>(0);
  const animationFrameRef = useRef<number | null>(null);
  const lastLapTimeRef = useRef<number>(0);

  // Live timer tick driven by requestAnimationFrame + performance.now()
  const tick = useCallback(() => {
    const now = performance.now();
    const currentElapsed = accumulatedTimeRef.current + (now - startTimeRef.current);
    setElapsedTime(currentElapsed);
    animationFrameRef.current = requestAnimationFrame(tick);
  }, []);

  const handleStart = () => {
    if (isRunning) return;
    startTimeRef.current = performance.now();
    setIsRunning(true);
    animationFrameRef.current = requestAnimationFrame(tick);
  };

  const handlePause = () => {
    if (!isRunning) return;
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    accumulatedTimeRef.current += performance.now() - startTimeRef.current;
    setElapsedTime(accumulatedTimeRef.current);
    setIsRunning(false);
  };

  const handleToggle = () => {
    if (isRunning) {
      handlePause();
    } else {
      handleStart();
    }
  };

  const handleReset = () => {
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    setIsRunning(false);
    accumulatedTimeRef.current = 0;
    startTimeRef.current = 0;
    lastLapTimeRef.current = 0;
    setElapsedTime(0);
  };

  const handleLap = () => {
    if (elapsedTime <= 0) return;
    const currentTotal = isRunning
      ? accumulatedTimeRef.current + (performance.now() - startTimeRef.current)
      : elapsedTime;
    
    const lapSplit = currentTotal - lastLapTimeRef.current;
    lastLapTimeRef.current = currentTotal;

    const newLap: LapItem = {
      id: laps.length + 1,
      lapTime: lapSplit,
      totalTime: currentTotal
    };

    setLaps((prev) => [newLap, ...prev]);
  };

  const handleClearLaps = () => {
    setLaps([]);
    lastLapTimeRef.current = 0;
    onShowToast('Lap history cleared');
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Keyboard accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        handleToggle();
      } else if (e.code === 'KeyL') {
        e.preventDefault();
        handleLap();
      } else if (e.code === 'KeyR') {
        e.preventDefault();
        handleReset();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isRunning, elapsedTime, laps]);

  const copyResults = () => {
    if (laps.length === 0) return;
    const text = laps
      .map(
        (l) =>
          `Lap #${l.id.toString().padStart(2, '0')}: Split ${formatStopwatchTime(l.lapTime)} | Total: ${formatStopwatchTime(l.totalTime)}`
      )
      .join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    onShowToast('Lap results copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  // Find min/max lap times for subtle visual highlighting
  const minLap = laps.length > 1 ? Math.min(...laps.map((l) => l.lapTime)) : null;
  const maxLap = laps.length > 1 ? Math.max(...laps.map((l) => l.lapTime)) : null;

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-4xl mx-auto" id="online-stopwatch-container">
      {/* Header */}
      <div className="border-b border-slate-200/80 dark:border-slate-800 pb-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <span>⏱️</span> Online Stopwatch
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Millisecond precision stopwatch with split time, lap history, and keyboard shortcuts.
          </p>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-[11px] font-mono font-medium text-slate-400 bg-slate-100 dark:bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
          <span>Space: Start/Pause</span>
          <span>•</span>
          <span>L: Lap</span>
          <span>•</span>
          <span>R: Reset</span>
        </div>
      </div>

      {/* Main Big Display Card */}
      <div className="glass-card p-8 sm:p-14 rounded-3xl text-center space-y-8 flex flex-col items-center justify-center relative overflow-hidden shadow-xl border border-slate-200/70 dark:border-slate-800">
        <div className="w-full flex justify-center items-center select-none py-4">
          <div
            className="font-mono text-4xl sm:text-7xl font-black tracking-widest text-slate-900 dark:text-white tabular-nums"
            aria-live="polite"
            aria-atomic="true"
          >
            {formatStopwatchTime(elapsedTime)}
          </div>
        </div>

        {/* Primary Controls */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 pt-2">
          {/* Start / Pause */}
          <button
            id="stopwatch-start-pause-btn"
            onClick={handleToggle}
            aria-label={isRunning ? 'Pause stopwatch' : 'Start stopwatch'}
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
                <span>{elapsedTime > 0 ? 'Resume' : 'Start'}</span>
              </>
            )}
          </button>

          {/* Lap */}
          <button
            id="stopwatch-lap-btn"
            onClick={handleLap}
            disabled={!isRunning && elapsedTime === 0}
            aria-label="Record lap time"
            className="px-6 py-4 rounded-2xl bg-slate-100 dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed font-bold text-sm flex items-center gap-2 transition-all cursor-pointer border border-slate-200 dark:border-slate-700 active:scale-95"
          >
            <Flag className="w-4 h-4 text-indigo-500" />
            <span>Lap</span>
          </button>

          {/* Reset */}
          <button
            id="stopwatch-reset-btn"
            onClick={handleReset}
            disabled={isRunning || elapsedTime === 0}
            aria-label="Reset stopwatch to zero"
            className="px-6 py-4 rounded-2xl bg-slate-100 dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed font-bold text-sm flex items-center gap-2 transition-all cursor-pointer border border-slate-200 dark:border-slate-700 active:scale-95"
          >
            <RotateCcw className="w-4 h-4 text-slate-500" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Laps List Section */}
      {laps.length > 0 && (
        <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-4 border border-slate-200/70 dark:border-slate-800">
          <div className="flex flex-wrap justify-between items-center gap-3 border-b border-slate-200/60 dark:border-slate-800/80 pb-4">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                Recorded Laps ({laps.length})
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                id="stopwatch-copy-laps-btn"
                onClick={copyResults}
                aria-label="Copy lap results"
                className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy All'}</span>
              </button>

              <button
                id="stopwatch-clear-laps-btn"
                onClick={handleClearLaps}
                aria-label="Clear lap history"
                className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-red-500 hover:text-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            </div>
          </div>

          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {laps.map((lap) => {
              const isFastest = minLap !== null && lap.lapTime === minLap;
              const isSlowest = maxLap !== null && lap.lapTime === maxLap;

              return (
                <div
                  key={lap.id}
                  className={`p-3.5 rounded-2xl flex flex-wrap justify-between items-center text-xs font-mono border transition-all ${
                    isFastest
                      ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800/60'
                      : isSlowest
                      ? 'bg-rose-50 dark:bg-rose-950/20 border-rose-300 dark:border-rose-800/60'
                      : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200/60 dark:border-slate-700/60'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-500 dark:text-slate-400">
                      #{lap.id.toString().padStart(2, '0')}
                    </span>
                    {isFastest && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-sans font-bold bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300">
                        Fastest
                      </span>
                    )}
                    {isSlowest && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-sans font-bold bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300">
                        Slowest
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <span className="text-[10px] uppercase font-sans text-slate-400 block">Split</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200 tracking-wider">
                        {formatStopwatchTime(lap.lapTime)}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] uppercase font-sans text-slate-400 block">Overall</span>
                      <span className="font-bold text-indigo-600 dark:text-indigo-400 tracking-wider">
                        {formatStopwatchTime(lap.totalTime)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
