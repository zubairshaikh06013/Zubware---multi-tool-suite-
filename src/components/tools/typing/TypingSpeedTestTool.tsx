import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, RotateCcw, Award, Gauge, Zap, CheckCircle2, XCircle, Clock, ArrowRight } from 'lucide-react';

interface TypingSpeedTestToolProps {
  onShowToast: (message: string) => void;
}

const SAMPLE_PASSAGES = [
  "Technology continues to reshape the way we communicate, learn, and solve complex problems around the world. Every keystroke is an opportunity to express ideas clearly and efficiently.",
  "Deep in the ancient forest, towering pine trees swayed gently under the cool morning breeze. Sunlight filtered through the green canopy, casting golden patterns across the damp earth.",
  "Consistent practice and deliberate focus are the two foundational pillars of personal mastery. Whether playing an instrument or learning a new language, dedication yields noticeable growth.",
  "Curiosity drives scientific discovery and creative innovation. When we ask meaningful questions about our surroundings, we unlock deeper understanding and inventive solutions.",
  "The quiet harbor reflected the vibrant colors of sunset, painting the gentle ocean waves in brilliant shades of amber, crimson, and deep indigo as twilight approached."
];

export const TypingSpeedTestTool: React.FC<TypingSpeedTestToolProps> = ({ onShowToast }) => {
  const [selectedDuration, setSelectedDuration] = useState<number>(30); // 15, 30, 60
  const [passageIndex, setPassageIndex] = useState<number>(0);
  const [userInput, setUserInput] = useState<string>('');
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(30);

  // Statistics
  const [wpm, setWpm] = useState<number>(0);
  const [cpm, setCpm] = useState<number>(0);
  const [accuracy, setAccuracy] = useState<number>(100);
  const [correctChars, setCorrectChars] = useState<number>(0);
  const [incorrectChars, setIncorrectChars] = useState<number>(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  const targetPassage = SAMPLE_PASSAGES[passageIndex % SAMPLE_PASSAGES.length];

  const resetTest = useCallback((duration: number = selectedDuration, nextPassage: boolean = false) => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsActive(false);
    setIsFinished(false);
    setTimeLeft(duration);
    setUserInput('');
    setWpm(0);
    setCpm(0);
    setAccuracy(100);
    setCorrectChars(0);
    setIncorrectChars(0);
    if (nextPassage) {
      setPassageIndex(prev => (prev + 1) % SAMPLE_PASSAGES.length);
    }
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  }, [selectedDuration]);

  // Handle duration switch
  const handleDurationChange = (dur: number) => {
    setSelectedDuration(dur);
    resetTest(dur, false);
  };

  // End test calculations
  const finishTest = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsActive(false);
    setIsFinished(true);

    const elapsedSeconds = selectedDuration - timeLeft > 0 ? selectedDuration - timeLeft : selectedDuration;
    const elapsedMinutes = elapsedSeconds / 60;

    let correct = 0;
    let incorrect = 0;
    const passage = targetPassage;

    for (let i = 0; i < userInput.length; i++) {
      if (i < passage.length && userInput[i] === passage[i]) {
        correct++;
      } else {
        incorrect++;
      }
    }

    const standardWords = correct / 5;
    const computedWpm = elapsedMinutes > 0 ? Math.round(standardWords / elapsedMinutes) : 0;
    const computedCpm = elapsedMinutes > 0 ? Math.round(correct / elapsedMinutes) : 0;
    const totalAttempted = correct + incorrect;
    const computedAcc = totalAttempted > 0 ? Math.round((correct / totalAttempted) * 100) : 100;

    setWpm(computedWpm);
    setCpm(computedCpm);
    setAccuracy(computedAcc);
    setCorrectChars(correct);
    setIncorrectChars(incorrect);
    onShowToast(`Test completed! Your speed: ${computedWpm} WPM`);
  }, [selectedDuration, timeLeft, targetPassage, userInput, onShowToast]);

  const finishTestRef = useRef(finishTest);
  finishTestRef.current = finishTest;

  // Timer effect
  useEffect(() => {
    if (isActive) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            finishTestRef.current();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isActive]);

  // Handle typing input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isFinished) return;
    const val = e.target.value;

    if (!isActive && val.length > 0) {
      setIsActive(true);
      startTimeRef.current = Date.now();
    }

    setUserInput(val);

    // Calculate interim counts
    let correct = 0;
    let incorrect = 0;
    for (let i = 0; i < val.length; i++) {
      if (i < targetPassage.length && val[i] === targetPassage[i]) {
        correct++;
      } else {
        incorrect++;
      }
    }
    setCorrectChars(correct);
    setIncorrectChars(incorrect);

    const total = correct + incorrect;
    if (total > 0) {
      setAccuracy(Math.round((correct / total) * 100));
    }

    // Finished entire passage early
    if (val.length >= targetPassage.length) {
      finishTest();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    onShowToast('Pasting is disabled for typing speed tests!');
  };

  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto space-y-6">
      {/* Header controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Duration</span>
          <div className="flex items-center gap-1.5 ml-2">
            {[15, 30, 60].map(dur => (
              <button
                key={dur}
                onClick={() => handleDurationChange(dur)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedDuration === dur
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700'
                }`}
              >
                {dur}s
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <Gauge className="w-4 h-4 text-emerald-500" />
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Time Left:</span>
            <span className={`text-sm font-black font-mono ${timeLeft <= 5 && isActive ? 'text-rose-500 animate-pulse' : 'text-slate-900 dark:text-white'}`}>
              {timeLeft}s
            </span>
          </div>

          <button
            onClick={() => resetTest(selectedDuration, true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-semibold transition-all"
            title="Next Passage / Reset"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restart</span>
          </button>
        </div>
      </div>

      {/* Target text display */}
      <div
        onClick={() => inputRef.current?.focus()}
        className="cursor-text p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs relative overflow-hidden"
      >
        <p className="text-lg sm:text-2xl leading-relaxed tracking-wide font-mono select-none">
          {targetPassage.split('').map((char, index) => {
            let status = 'pending';
            if (index < userInput.length) {
              status = userInput[index] === char ? 'correct' : 'incorrect';
            }
            const isCurrent = index === userInput.length;

            return (
              <span
                key={index}
                className={`${
                  status === 'correct'
                    ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                    : status === 'incorrect'
                    ? 'text-rose-600 dark:text-rose-400 bg-rose-100 dark:bg-rose-950/80 underline decoration-rose-500'
                    : 'text-slate-400 dark:text-slate-500'
                } ${isCurrent ? 'bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400 animate-pulse' : ''}`}
              >
                {char}
              </span>
            );
          })}
        </p>

        {/* Hidden input capturing typing keystrokes */}
        <input
          ref={inputRef}
          type="text"
          value={userInput}
          onChange={handleInputChange}
          onPaste={handlePaste}
          disabled={isFinished}
          placeholder={isActive ? '' : 'Click here and start typing to begin timer...'}
          className="w-full mt-6 px-4 py-3 text-base rounded-xl border border-indigo-300 dark:border-indigo-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
        />
      </div>

      {/* Results Card */}
      {isFinished && (
        <div className="p-6 sm:p-8 rounded-3xl bg-linear-to-br from-indigo-50 via-white to-purple-50 dark:from-indigo-950/40 dark:via-slate-900 dark:to-purple-950/40 border border-indigo-200 dark:border-indigo-800 text-center space-y-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/20">
            <Award className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {wpm >= 60 ? '⚡ Incredible Typing Speed!' : wpm >= 40 ? '👍 Great Typing Pace!' : '🌱 Good Start! Keep Practicing'}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Standard 5-character word calculation over {selectedDuration} seconds.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-2xl mx-auto">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Words / Min</span>
              <p className="text-3xl sm:text-4xl font-black text-indigo-600 dark:text-indigo-400 font-mono mt-1">{wpm}</p>
              <span className="text-[11px] text-slate-400">WPM</span>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Accuracy</span>
              <p className="text-3xl sm:text-4xl font-black text-emerald-600 dark:text-emerald-400 font-mono mt-1">{accuracy}%</p>
              <span className="text-[11px] text-slate-400">{correctChars} correct</span>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Characters / Min</span>
              <p className="text-3xl sm:text-4xl font-black text-purple-600 dark:text-purple-400 font-mono mt-1">{cpm}</p>
              <span className="text-[11px] text-slate-400">CPM</span>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Errors</span>
              <p className="text-3xl sm:text-4xl font-black text-rose-500 font-mono mt-1">{incorrectChars}</p>
              <span className="text-[11px] text-slate-400">mistakes</span>
            </div>
          </div>

          <div className="flex justify-center gap-3">
            <button
              onClick={() => resetTest(selectedDuration, true)}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md transition-all flex items-center gap-2"
            >
              <span>Try Another Passage</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Real-time stats during test */}
      {!isFinished && (
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 text-center">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Current Accuracy</span>
            <p className="text-xl font-black text-slate-900 dark:text-white font-mono">{accuracy}%</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 text-center">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Correct Chars</span>
            <p className="text-xl font-black text-emerald-600 dark:text-emerald-400 font-mono">{correctChars}</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 text-center">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Mistakes</span>
            <p className="text-xl font-black text-rose-500 font-mono">{incorrectChars}</p>
          </div>
        </div>
      )}
    </div>
  );
};
