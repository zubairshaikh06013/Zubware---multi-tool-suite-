import React, { useState, useRef, useEffect } from 'react';
import { Play, RotateCcw, Trash2, Trophy, Sparkles, Check } from 'lucide-react';

interface NamePickerWheelToolProps {
  onShowToast: (message: string) => void;
}

const COLORS = [
  '#4F46E5', '#7C3AED', '#EC4899', '#F43F5E',
  '#F97316', '#EAB308', '#10B981', '#06B6D4',
  '#3B82F6', '#8B5CF6', '#14B8A6', '#F59E0B'
];

export const NamePickerWheelTool: React.FC<NamePickerWheelToolProps> = ({ onShowToast }) => {
  const [itemsText, setItemsText] = useState<string>(
    'Sarah\nDavid\nMichael\nEmma\nJames\nOlivia\nDaniel\nSophia'
  );
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [removeWinnerOnPick, setRemoveWinnerOnPick] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const currentAngleRef = useRef<number>(0);
  const animationFrameRef = useRef<number | null>(null);

  const items = itemsText
    .split('\n')
    .map(i => i.trim())
    .filter(i => i.length > 0);

  const drawWheel = (angle: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(centerX, centerY) - 15;

    ctx.clearRect(0, 0, width, height);

    if (items.length === 0) {
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      ctx.fillStyle = '#94a3b8';
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 16px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Add names to spin', centerX, centerY);
      return;
    }

    const arc = (2 * Math.PI) / items.length;

    // Draw Slices
    for (let i = 0; i < items.length; i++) {
      const startAngle = angle + i * arc;
      const endAngle = startAngle + arc;

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.fillStyle = COLORS[i % COLORS.length];
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#ffffff';
      ctx.stroke();

      // Text
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(startAngle + arc / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 14px sans-serif';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
      ctx.shadowBlur = 4;
      ctx.fillText(items[i].slice(0, 14), radius - 20, 5);
      ctx.restore();
    }

    // Center Pin / Cap
    ctx.beginPath();
    ctx.arc(centerX, centerY, 24, 0, 2 * Math.PI);
    ctx.fillStyle = '#1e293b';
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#ffffff';
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('SPIN', centerX, centerY + 4);
  };

  useEffect(() => {
    drawWheel(currentAngleRef.current);
  }, [itemsText]);

  const spinWheel = () => {
    if (isSpinning || items.length < 2) {
      if (items.length < 2) onShowToast('Add at least 2 names to spin!');
      return;
    }

    setIsSpinning(true);
    setWinner(null);

    // Random spin target between 5 and 10 full rotations plus random slice
    const extraRotations = 5 + Math.random() * 4;
    const totalSpinAngle = extraRotations * 2 * Math.PI;
    const startAngle = currentAngleRef.current;
    const endAngle = startAngle + totalSpinAngle;

    const startTime = performance.now();
    const duration = 4500; // 4.5 seconds spin duration

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease Out Cubic function
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentAngle = startAngle + (endAngle - startAngle) * easeOut;
      currentAngleRef.current = currentAngle % (2 * Math.PI);

      drawWheel(currentAngle);

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        setIsSpinning(false);

        // Pointer is at the top (angle = 3*PI/2 or 270 deg)
        const normalized = (2 * Math.PI - (currentAngle % (2 * Math.PI)) + (3 * Math.PI) / 2) % (2 * Math.PI);
        const arc = (2 * Math.PI) / items.length;
        const winnerIndex = Math.floor(normalized / arc) % items.length;
        const chosen = items[winnerIndex];

        setWinner(chosen);
        onShowToast(`🎉 Winner: ${chosen}!`);

        if (removeWinnerOnPick) {
          const updated = items.filter((_, idx) => idx !== winnerIndex);
          setItemsText(updated.join('\n'));
        }
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);
  };

  const removeWinner = () => {
    if (!winner) return;
    const updated = items.filter(item => item !== winner);
    setItemsText(updated.join('\n'));
    setWinner(null);
    onShowToast(`Removed "${winner}" from the wheel.`);
  };

  return (
    <div className="p-6 sm:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>🎡</span> Name Picker Wheel
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Visual interactive spinning wheel for classroom raffles, giveaways, and decision making.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Wheel Stage */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center relative select-none">
          {/* Top Indicator Arrow */}
          <div className="z-10 -mb-4 flex flex-col items-center">
            <div className="w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[22px] border-t-rose-500 drop-shadow-md" />
          </div>

          <div
            onClick={spinWheel}
            className="cursor-pointer active:scale-95 transition-transform"
          >
            <canvas
              ref={canvasRef}
              width={380}
              height={380}
              className="max-w-full rounded-full shadow-2xl border-4 border-slate-200 dark:border-slate-800"
            />
          </div>

          <button
            onClick={spinWheel}
            disabled={isSpinning || items.length < 2}
            className="mt-6 px-8 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-extrabold text-sm shadow-xl shadow-indigo-600/30 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <Play className={`w-4 h-4 fill-current ${isSpinning ? 'animate-spin' : ''}`} />
            <span>{isSpinning ? 'Spinning...' : 'SPIN WHEEL'}</span>
          </button>
        </div>

        {/* Entries & Results */}
        <div className="lg:col-span-5 space-y-6">
          {/* Winner Card */}
          {winner && (
            <div className="glass-card p-6 rounded-3xl border-emerald-500/40 bg-emerald-500/10 text-center space-y-3 animate-in fade-in zoom-in-95 duration-300">
              <span className="text-xs font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-1">
                <Trophy className="w-4 h-4 text-amber-500" /> Winner Selected!
              </span>
              <div className="text-3xl font-black text-slate-900 dark:text-white">
                {winner}
              </div>
              <div className="flex justify-center gap-2 pt-1">
                <button
                  onClick={spinWheel}
                  className="px-4 py-1.5 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700"
                >
                  Spin Again
                </button>
                <button
                  onClick={removeWinner}
                  className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs hover:bg-slate-300"
                >
                  Remove Name
                </button>
              </div>
            </div>
          )}

          {/* Entries Form */}
          <div className="glass-card p-6 rounded-3xl space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Wheel Entries ({items.length})
              </span>
              <button
                onClick={() => setItemsText('')}
                className="text-xs text-rose-500 hover:text-rose-600 font-semibold"
              >
                Clear
              </button>
            </div>

            <textarea
              rows={7}
              value={itemsText}
              onChange={e => setItemsText(e.target.value)}
              placeholder="Enter one name per line..."
              className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-medium text-xs outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={removeWinnerOnPick}
                onChange={e => setRemoveWinnerOnPick(e.target.checked)}
                className="w-4 h-4 rounded accent-indigo-600 cursor-pointer"
              />
              <span>Automatically remove winner after spin</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
