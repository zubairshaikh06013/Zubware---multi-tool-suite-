import React, { useState, useEffect, useRef } from 'react';
import {
  Volume2,
  VolumeX,
  RotateCw,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Copy,
  Check,
  Flame,
  Coins,
  Layers
} from 'lucide-react';

interface CoinFlipToolProps {
  onShowToast: (message: string) => void;
}

type CoinMaterial = 'gold' | 'silver' | 'bronze' | 'cyber';
type CoinOutcome = 'heads' | 'tails';

interface FlipHistoryItem {
  id: string;
  side: CoinOutcome;
  timestamp: string;
}

export const CoinFlipTool: React.FC<CoinFlipToolProps> = ({ onShowToast }) => {
  const [isFlipping, setIsFlipping] = useState<boolean>(false);
  const [currentResult, setCurrentResult] = useState<CoinOutcome>('heads');
  const [rotations, setRotations] = useState<number>(0);
  const [material, setMaterial] = useState<CoinMaterial>('gold');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [coinCountMode, setCoinCountMode] = useState<1 | 2 | 3>(1);
  const [multiResults, setMultiResults] = useState<CoinOutcome[]>(['heads']);

  // Statistics
  const [headsCount, setHeadsCount] = useState<number>(0);
  const [tailsCount, setTailsCount] = useState<number>(0);
  const [currentStreak, setCurrentStreak] = useState<{ side: CoinOutcome; count: number }>({
    side: 'heads',
    count: 0,
  });
  const [bestStreak, setBestStreak] = useState<number>(0);
  const [history, setHistory] = useState<FlipHistoryItem[]>([]);
  const [copiedHistory, setCopiedHistory] = useState<boolean>(false);

  // Audio Context Ref
  const audioCtxRef = useRef<AudioContext | null>(null);

  const getAudioContext = () => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        audioCtxRef.current = new AudioCtx();
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  // Play realistic metallic coin ping sound using Web Audio API
  const playFlipPingSound = () => {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;

      // Resonant metallic ring
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(2450, now);
      osc1.frequency.exponentialRampToValueAtTime(1200, now + 0.35);

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(4900, now);
      osc2.frequency.exponentialRampToValueAtTime(2400, now + 0.25);

      gainNode.gain.setValueAtTime(0.3, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      osc1.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.4);
      osc2.stop(now + 0.4);
    } catch {
      // Audio not supported or blocked
    }
  };

  // Play crisp metallic landing/table clink
  const playLandingClinkSound = () => {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.15);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.15);
    } catch {
      // Audio not supported
    }
  };

  // Cryptographically Secure Fair RNG (CSPRNG)
  const getCryptoRandomOutcome = (): CoinOutcome => {
    const array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    return array[0] % 2 === 0 ? 'heads' : 'tails';
  };

  // Main Flip Handler
  const handleFlip = () => {
    if (isFlipping) return;

    setIsFlipping(true);
    playFlipPingSound();

    // Haptic feedback for mobile
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(30);
    }

    const numCoins = coinCountMode;
    const newOutcomes: CoinOutcome[] = [];
    for (let i = 0; i < numCoins; i++) {
      newOutcomes.push(getCryptoRandomOutcome());
    }

    const primaryOutcome = newOutcomes[0];

    // Determine target 3D rotation:
    // Heads ends on an even multiple of 360 (0 mod 360)
    // Tails ends on an odd multiple of 180 (180 mod 360)
    const baseTurns = 5 + Math.floor(Math.random() * 3); // 5 to 7 full revolutions
    const targetDeg = primaryOutcome === 'heads' ? baseTurns * 360 : baseTurns * 360 + 180;

    setRotations((prev) => prev + targetDeg);

    setTimeout(() => {
      setCurrentResult(primaryOutcome);
      setMultiResults(newOutcomes);
      setIsFlipping(false);
      playLandingClinkSound();

      // Update counts
      let hAdd = 0;
      let tAdd = 0;
      newOutcomes.forEach((o) => {
        if (o === 'heads') hAdd++;
        else tAdd++;
      });

      setHeadsCount((h) => h + hAdd);
      setTailsCount((t) => t + tAdd);

      // Update streaks based on primary coin
      setCurrentStreak((prev) => {
        const nextCount = prev.side === primaryOutcome ? prev.count + 1 : 1;
        setBestStreak((b) => Math.max(b, nextCount));
        return { side: primaryOutcome, count: nextCount };
      });

      // Add to history
      const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const newHistoryItems: FlipHistoryItem[] = newOutcomes.map((side, idx) => ({
        id: `${Date.now()}-${idx}-${Math.random()}`,
        side,
        timestamp: nowStr,
      }));

      setHistory((prev) => [...newHistoryItems, ...prev].slice(0, 50));

      if (numCoins === 1) {
        onShowToast(`Coin landed on ${primaryOutcome.toUpperCase()}! 🪙`);
      } else {
        onShowToast(`Landed: ${newOutcomes.map((o) => o.toUpperCase()).join(' & ')}!`);
      }
    }, 1100);
  };

  // Batch Multi-Flip (Simulate fast coin flips)
  const handleBatchFlip = (count: number) => {
    if (isFlipping) return;

    let h = 0;
    let t = 0;
    const items: FlipHistoryItem[] = [];
    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    for (let i = 0; i < count; i++) {
      const outcome = getCryptoRandomOutcome();
      if (outcome === 'heads') h++;
      else t++;
      items.push({
        id: `${Date.now()}-${i}`,
        side: outcome,
        timestamp: nowStr,
      });
    }

    const lastOutcome = items[items.length - 1].side;
    setCurrentResult(lastOutcome);
    setMultiResults([lastOutcome]);
    setHeadsCount((prev) => prev + h);
    setTailsCount((prev) => prev + t);
    setHistory((prev) => [...items.reverse(), ...prev].slice(0, 50));

    playLandingClinkSound();
    onShowToast(`Simulated ${count} flips: ${h} Heads, ${t} Tails!`);
  };

  // Keyboard shortcut listener (Spacebar)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && (e.target as HTMLElement)?.tagName !== 'INPUT') {
        e.preventDefault();
        handleFlip();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFlipping, coinCountMode, soundEnabled]);

  const resetStats = () => {
    setHeadsCount(0);
    setTailsCount(0);
    setCurrentStreak({ side: 'heads', count: 0 });
    setBestStreak(0);
    setHistory([]);
    onShowToast('Coin flip statistics reset!');
  };

  const copyHistoryToClipboard = () => {
    if (history.length === 0) return;
    const text = history.map((h, i) => `#${history.length - i} [${h.timestamp}]: ${h.side.toUpperCase()}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopiedHistory(true);
    setTimeout(() => setCopiedHistory(false), 2000);
    onShowToast('History copied to clipboard!');
  };

  const total = headsCount + tailsCount;
  const headsPct = total > 0 ? ((headsCount / total) * 100).toFixed(1) : '50.0';
  const tailsPct = total > 0 ? ((tailsCount / total) * 100).toFixed(1) : '50.0';

  // Material Palettes
  const materialThemes = {
    gold: {
      name: '24K Royal Gold',
      outerBorder: 'border-amber-300 dark:border-amber-400',
      headsBg: 'from-amber-300 via-yellow-400 to-amber-600',
      tailsBg: 'from-amber-400 via-yellow-500 to-amber-700',
      textColor: 'text-amber-950',
      accentColor: 'text-amber-500',
      buttonBg: 'bg-amber-500 hover:bg-amber-600 text-slate-950',
      glow: 'shadow-[0_0_35px_rgba(245,158,11,0.45)]',
      rim: '#d97706',
    },
    silver: {
      name: 'Silver Dollar',
      outerBorder: 'border-slate-200 dark:border-slate-300',
      headsBg: 'from-slate-100 via-slate-300 to-slate-500',
      tailsBg: 'from-slate-200 via-slate-400 to-slate-600',
      textColor: 'text-slate-900',
      accentColor: 'text-slate-400',
      buttonBg: 'bg-slate-200 hover:bg-slate-300 text-slate-900',
      glow: 'shadow-[0_0_35px_rgba(203,213,225,0.45)]',
      rim: '#94a3b8',
    },
    bronze: {
      name: 'Roman Bronze',
      outerBorder: 'border-amber-700 dark:border-amber-600',
      headsBg: 'from-amber-600 via-amber-700 to-amber-900',
      tailsBg: 'from-amber-700 via-amber-800 to-amber-950',
      textColor: 'text-amber-100',
      accentColor: 'text-amber-700',
      buttonBg: 'bg-amber-700 hover:bg-amber-800 text-amber-50',
      glow: 'shadow-[0_0_35px_rgba(180,83,9,0.45)]',
      rim: '#78350f',
    },
    cyber: {
      name: 'Cyber Neon',
      outerBorder: 'border-cyan-400 dark:border-cyan-300',
      headsBg: 'from-cyan-400 via-indigo-600 to-fuchsia-600',
      tailsBg: 'from-fuchsia-500 via-purple-700 to-cyan-600',
      textColor: 'text-white',
      accentColor: 'text-cyan-400',
      buttonBg: 'bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white',
      glow: 'shadow-[0_0_40px_rgba(6,182,212,0.55)]',
      rim: '#06b6d4',
    },
  };

  const theme = materialThemes[material];

  return (
    <div className="p-4 sm:p-8 space-y-8 max-w-5xl mx-auto">
      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <span className="text-3xl">🪙</span> 3D Coin Flip Simulator
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
              Pro Physics
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            True 3D physics coin toss, realistic metallic sound effects, CSPRNG mathematical fairness, and probability analytics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Sound Toggle */}
          <button
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2.5 rounded-xl border transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-bold ${
              soundEnabled
                ? 'bg-indigo-50 dark:bg-indigo-950/50 border-indigo-300 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400'
                : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400'
            }`}
            title={soundEnabled ? 'Mute Sound' : 'Enable Sound'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span className="hidden sm:inline">{soundEnabled ? 'Sound On' : 'Muted'}</span>
          </button>

          {/* Reset Stats Button */}
          <button
            type="button"
            onClick={resetStats}
            className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Stats</span>
          </button>
        </div>
      </div>

      {/* Control Bar: Theme & Coin Count */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl glass-card border border-slate-200/60 dark:border-slate-800/60">
        {/* Material Selection */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> Coin Material:
          </span>
          <div className="flex gap-1.5">
            {(['gold', 'silver', 'bronze', 'cyber'] as CoinMaterial[]).map((mat) => (
              <button
                key={mat}
                type="button"
                onClick={() => setMaterial(mat)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
                  material === mat
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm scale-105'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                {mat}
              </button>
            ))}
          </div>
        </div>

        {/* Multi Coin Mode */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1">
            <Coins className="w-3.5 h-3.5" /> Toss Mode:
          </span>
          <div className="flex gap-1">
            {([1, 2, 3] as (1 | 2 | 3)[]).map((cnt) => (
              <button
                key={cnt}
                type="button"
                onClick={() => setCoinCountMode(cnt)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  coinCountMode === cnt
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                {cnt === 1 ? '1 Coin' : `${cnt} Coins`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3D Realistic Coin Stage */}
      <div className="relative glass-card rounded-3xl p-8 sm:p-14 flex flex-col items-center justify-center overflow-hidden border border-slate-200/80 dark:border-slate-800 bg-gradient-to-b from-slate-100/50 via-transparent to-slate-200/20 dark:from-slate-900/50 dark:to-slate-950/40">
        {/* Fair RNG Badge */}
        <div className="absolute top-4 left-4 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
          <ShieldCheck className="w-3 h-3" />
          <span>Web Crypto CSPRNG Fair</span>
        </div>

        {/* Keyboard Hint */}
        <div className="absolute top-4 right-4 hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-mono font-bold bg-slate-200/60 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
          <span>Press</span>
          <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 shadow-xs">
            SPACE
          </kbd>
          <span>to flip</span>
        </div>

        {/* Coin Perspective Container */}
        <div
          className="my-6 py-6 cursor-pointer select-none relative"
          style={{ perspective: '1200px' }}
          onClick={handleFlip}
          title="Click to Flip Coin"
        >
          {/* Multi-Coins View */}
          <div className="flex items-center justify-center gap-6 sm:gap-10">
            {Array.from({ length: coinCountMode }).map((_, coinIdx) => {
              const outcomeForThisCoin = multiResults[coinIdx] || currentResult;
              return (
                <div key={coinIdx} className="relative flex flex-col items-center">
                  {/* Dynamic Ground Shadow */}
                  <div
                    className={`w-32 sm:w-44 h-6 rounded-full bg-slate-950/20 dark:bg-black/60 blur-md absolute -bottom-8 transition-all duration-700 ${
                      isFlipping ? 'scale-50 opacity-20' : 'scale-100 opacity-80'
                    }`}
                  />

                  {/* 3D Coin Model */}
                  <div
                    className={`w-36 h-36 sm:w-44 sm:h-44 rounded-full relative transition-all ${
                      isFlipping ? 'scale-105' : 'hover:scale-105 active:scale-95'
                    } ${theme.glow}`}
                    style={{
                      transformStyle: 'preserve-3d',
                      transform: isFlipping
                        ? `translateY(-110px) rotateY(${rotations + (coinIdx * 180)}deg)`
                        : `translateY(0px) rotateY(${outcomeForThisCoin === 'heads' ? 0 : 180}deg)`,
                      transitionDuration: isFlipping ? '1100ms' : '500ms',
                      transitionTimingFunction: isFlipping
                        ? 'cubic-bezier(0.25, 1, 0.5, 1)'
                        : 'cubic-bezier(0.34, 1.56, 0.64, 1)',
                    }}
                  >
                    {/* Coin Edge 3D Extrusion illusion */}
                    <div
                      className="absolute inset-0 rounded-full border-4 pointer-events-none"
                      style={{
                        borderColor: theme.rim,
                        transform: 'translateZ(-4px)',
                        boxShadow: `inset 0 0 12px rgba(0,0,0,0.5)`,
                      }}
                    />

                    {/* FRONT FACE: HEADS */}
                    <div
                      className={`absolute inset-0 rounded-full bg-gradient-to-tr ${theme.headsBg} ${theme.textColor} border-4 ${theme.outerBorder} shadow-2xl flex flex-col items-center justify-between p-3.5 select-none overflow-hidden`}
                      style={{
                        backfaceVisibility: 'hidden',
                        transform: 'rotateY(0deg)',
                      }}
                    >
                      {/* Radial Milled Rim Texture */}
                      <div className="absolute inset-1.5 rounded-full border border-dashed border-black/20 pointer-events-none" />

                      {/* Top Inscription */}
                      <div className="text-[10px] sm:text-[11px] font-black tracking-[0.2em] uppercase opacity-90 text-center">
                        LIBERTY
                      </div>

                      {/* Heads Center Emblem (Detailed Classical Bust / Eagle) */}
                      <div className="flex flex-col items-center justify-center my-auto relative">
                        <svg
                          className="w-16 h-16 sm:w-20 sm:h-20 drop-shadow-md"
                          viewBox="0 0 100 100"
                          fill="currentColor"
                        >
                          {/* Classical Roman Laurel Profile / Emblem */}
                          <path
                            d="M50 15 C32 15 22 28 22 45 C22 62 34 76 48 83 C49 84 51 84 52 83 C66 76 78 62 78 45 C78 28 68 15 50 15 Z"
                            fillOpacity="0.15"
                          />
                          {/* Laurel Wreath */}
                          <path
                            d="M32 30 C30 38 33 48 40 54 M26 44 C26 55 35 66 46 70 M68 30 C70 38 67 48 60 54 M74 44 C74 55 65 66 54 70"
                            stroke="currentColor"
                            strokeWidth="3.5"
                            strokeLinecap="round"
                            fill="none"
                            opacity="0.8"
                          />
                          {/* Central Star Crest */}
                          <polygon
                            points="50,28 53,38 63,38 55,44 58,54 50,48 42,54 45,44 37,38 47,38"
                            fill="currentColor"
                            opacity="0.9"
                          />
                          <circle cx="50" cy="62" r="5" fill="currentColor" opacity="0.85" />
                        </svg>
                        <span className="text-xs sm:text-sm font-black tracking-widest uppercase mt-0.5">
                          HEADS
                        </span>
                      </div>

                      {/* Bottom Inscription & Year */}
                      <div className="flex items-center justify-between w-full px-2 text-[8px] sm:text-[9px] font-bold opacity-80 uppercase tracking-wider">
                        <span>★ 2026 ★</span>
                        <span>TRUST</span>
                      </div>
                    </div>

                    {/* BACK FACE: TAILS */}
                    <div
                      className={`absolute inset-0 rounded-full bg-gradient-to-tr ${theme.tailsBg} ${theme.textColor} border-4 ${theme.outerBorder} shadow-2xl flex flex-col items-center justify-between p-3.5 select-none overflow-hidden`}
                      style={{
                        backfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)',
                      }}
                    >
                      {/* Radial Milled Rim Texture */}
                      <div className="absolute inset-1.5 rounded-full border border-dashed border-black/20 pointer-events-none" />

                      {/* Top Inscription */}
                      <div className="text-[9px] sm:text-[10px] font-black tracking-[0.15em] uppercase opacity-90 text-center">
                        E PLURIBUS UNUM
                      </div>

                      {/* Tails Center Emblem (Heraldic Eagle Crest) */}
                      <div className="flex flex-col items-center justify-center my-auto relative">
                        <svg
                          className="w-16 h-16 sm:w-20 sm:h-20 drop-shadow-md"
                          viewBox="0 0 100 100"
                          fill="currentColor"
                        >
                          {/* Outstretched Wings Shield */}
                          <path
                            d="M50 22 L62 35 L78 30 L68 46 L82 52 L65 58 L72 70 L50 62 L28 70 L35 58 L18 52 L32 46 L22 30 L38 35 Z"
                            fillOpacity="0.25"
                          />
                          {/* Heraldic Shield */}
                          <path
                            d="M40 40 L60 40 L60 56 C60 66 50 72 50 72 C50 72 40 66 40 56 Z"
                            fill="currentColor"
                            opacity="0.85"
                          />
                          <line x1="50" y1="40" x2="50" y2="70" stroke="currentColor" strokeWidth="2" opacity="0.3" />
                        </svg>
                        <span className="text-xs sm:text-sm font-black tracking-widest uppercase mt-0.5">
                          TAILS
                        </span>
                      </div>

                      {/* Bottom Denomination */}
                      <div className="flex items-center justify-between w-full px-2 text-[8px] sm:text-[9px] font-bold opacity-80 uppercase tracking-wider">
                        <span>★ ONE ★</span>
                        <span>DOLLAR</span>
                      </div>
                    </div>
                  </div>

                  {coinCountMode > 1 && (
                    <span className="mt-4 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-slate-900 text-white dark:bg-white dark:text-slate-900">
                      Coin #{coinIdx + 1}: {isFlipping ? '...' : outcomeForThisCoin.toUpperCase()}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Result Indicator Pill */}
        <div className="flex items-center gap-3 mt-4">
          <div className="px-5 py-2 rounded-full text-sm font-black uppercase tracking-wider bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-md">
            {isFlipping
              ? 'Tossing in 3D...'
              : coinCountMode === 1
              ? `Landed on ${currentResult.toUpperCase()}`
              : `Result: ${multiResults.map((r) => r.toUpperCase()).join(' - ')}`}
          </div>

          {currentStreak.count > 1 && (
            <div className="px-3.5 py-2 rounded-full text-xs font-black bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5" />
              <span>
                {currentStreak.count}x {currentStreak.side.toUpperCase()} Streak!
              </span>
            </div>
          )}
        </div>

        {/* Action Flip Buttons */}
        <div className="flex flex-wrap gap-2.5 justify-center mt-6">
          <button
            type="button"
            onClick={handleFlip}
            disabled={isFlipping}
            className={`px-8 py-4 rounded-2xl font-black text-sm shadow-xl transition-all flex items-center gap-2 cursor-pointer active:scale-95 ${
              isFlipping
                ? 'bg-slate-300 dark:bg-slate-700 text-slate-500 cursor-not-allowed'
                : `${theme.buttonBg} shadow-amber-500/20 hover:scale-105`
            }`}
          >
            <RotateCw className={`w-4 h-4 ${isFlipping ? 'animate-spin' : ''}`} />
            <span>{isFlipping ? 'Tossing...' : coinCountMode === 1 ? 'Flip Coin 🪙' : `Flip ${coinCountMode} Coins 🪙`}</span>
          </button>

          {/* Quick Simulation Buttons */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-200/60 dark:bg-slate-800">
            <button
              type="button"
              onClick={() => handleBatchFlip(5)}
              disabled={isFlipping}
              className="px-3 py-2.5 rounded-xl hover:bg-white dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition-colors cursor-pointer"
            >
              Sim 5x
            </button>
            <button
              type="button"
              onClick={() => handleBatchFlip(25)}
              disabled={isFlipping}
              className="px-3 py-2.5 rounded-xl hover:bg-white dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition-colors cursor-pointer"
            >
              Sim 25x
            </button>
            <button
              type="button"
              onClick={() => handleBatchFlip(100)}
              disabled={isFlipping}
              className="px-3 py-2.5 rounded-xl hover:bg-white dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition-colors cursor-pointer"
            >
              Sim 100x
            </button>
          </div>
        </div>
      </div>

      {/* Probability & Statistics Dashboard */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-500" /> Probability & Flip Statistics
          </h3>
          {bestStreak > 1 && (
            <span className="text-xs font-bold text-slate-500">
              Longest Run: <strong className="text-amber-500">{bestStreak} in a row</strong>
            </span>
          )}
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          <div className="glass-card p-4 rounded-2xl text-center space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Flips</span>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono">{total}</div>
          </div>

          <div className="glass-card p-4 rounded-2xl text-center space-y-1 bg-amber-500/5 border border-amber-500/20">
            <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
              Heads (👑)
            </span>
            <div className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400 font-mono">
              {headsCount}{' '}
              <span className="text-xs font-normal text-slate-500 dark:text-slate-400">({headsPct}%)</span>
            </div>
          </div>

          <div className="glass-card p-4 rounded-2xl text-center space-y-1 bg-slate-500/5 border border-slate-500/20">
            <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
              Tails (🦅)
            </span>
            <div className="text-2xl sm:text-3xl font-black text-slate-700 dark:text-slate-200 font-mono">
              {tailsCount}{' '}
              <span className="text-xs font-normal text-slate-500 dark:text-slate-400">({tailsPct}%)</span>
            </div>
          </div>

          <div className="glass-card p-4 rounded-2xl text-center space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Fair Ratio</span>
            <div className="text-2xl sm:text-3xl font-black text-indigo-600 dark:text-indigo-400 font-mono">
              50 / 50
            </div>
          </div>
        </div>

        {/* Live Visual Split Bar */}
        {total > 0 && (
          <div className="p-4 rounded-2xl glass-card border border-slate-200/60 dark:border-slate-800/60 space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-amber-600 dark:text-amber-400">Heads: {headsPct}%</span>
              <span className="text-slate-400">Law of Large Numbers Visualizer</span>
              <span className="text-slate-700 dark:text-slate-300">Tails: {tailsPct}%</span>
            </div>
            <div className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden flex">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all duration-500"
                style={{ width: `${headsPct}%` }}
              />
              <div
                className="h-full bg-gradient-to-r from-slate-400 to-slate-600 transition-all duration-500"
                style={{ width: `${tailsPct}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* History Log */}
      {history.length > 0 && (
        <div className="glass-card p-5 rounded-2xl space-y-4 border border-slate-200/60 dark:border-slate-800/60">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                Recent Flip History ({history.length})
              </span>
            </div>
            <button
              type="button"
              onClick={copyHistoryToClipboard}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              {copiedHistory ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedHistory ? 'Copied!' : 'Copy History'}</span>
            </button>
          </div>

          <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto pr-1">
            {history.map((item, i) => (
              <span
                key={item.id}
                className={`px-2.5 py-1 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-xs ${
                  item.side === 'heads'
                    ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700'
                }`}
                title={`Toss #${history.length - i} at ${item.timestamp}`}
              >
                <span>{item.side === 'heads' ? '🪙' : '🦅'}</span>
                <span>{item.side === 'heads' ? 'HEADS' : 'TAILS'}</span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
