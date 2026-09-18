import React, { useState, useMemo } from 'react';
import { TrendingUp, Plus, Trash2, Copy, Check, Calculator } from 'lucide-react';

interface Point {
  x: number;
  y: number;
}

interface LinearRegressionCalculatorToolProps {
  onShowToast: (message: string) => void;
}

const DEFAULT_POINTS_TEXT = `1, 2
2, 3.5
3, 5
4, 6.8
5, 8.2
6, 9.7`;

export const LinearRegressionCalculatorTool: React.FC<LinearRegressionCalculatorToolProps> = ({ onShowToast }) => {
  const [inputText, setInputText] = useState<string>(DEFAULT_POINTS_TEXT);
  const [predictX, setPredictX] = useState<number>(7);
  const [copied, setCopied] = useState<boolean>(false);

  // Parse points
  const points: Point[] = useMemo(() => {
    return inputText
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .map(line => {
        const parts = line.split(/[\s,;\t]+/).map(p => parseFloat(p));
        if (parts.length >= 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
          return { x: parts[0], y: parts[1] };
        }
        return null;
      })
      .filter((p): p is Point => p !== null);
  }, [inputText]);

  // Compute Linear Regression: y = mx + b
  const regression = useMemo(() => {
    const n = points.length;
    if (n < 2) return null;

    const sumX = points.reduce((acc, p) => acc + p.x, 0);
    const sumY = points.reduce((acc, p) => acc + p.y, 0);
    const sumXY = points.reduce((acc, p) => acc + p.x * p.y, 0);
    const sumX2 = points.reduce((acc, p) => acc + p.x * p.x, 0);
    const sumY2 = points.reduce((acc, p) => acc + p.y * p.y, 0);

    const xMean = sumX / n;
    const yMean = sumY / n;

    const denominator = n * sumX2 - sumX * sumX;
    if (denominator === 0) return null;

    const slope = (n * sumXY - sumX * sumY) / denominator;
    const intercept = (sumY - slope * sumX) / n;

    // Pearson r
    const rNumerator = n * sumXY - sumX * sumY;
    const rDenominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
    const r = rDenominator !== 0 ? rNumerator / rDenominator : 0;
    const rSquared = Math.pow(r, 2);

    return {
      n,
      slope,
      intercept,
      r,
      rSquared,
      equation: `y = ${slope.toFixed(4)}x ${intercept >= 0 ? '+' : '-'} ${Math.abs(intercept).toFixed(4)}`
    };
  }, [points]);

  const predictedY = regression ? regression.slope * predictX + regression.intercept : null;

  const copyEquation = () => {
    if (!regression) return;
    const text = `${regression.equation} (R² = ${regression.rSquared.toFixed(4)})`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    onShowToast('Copied regression equation!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 sm:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>📈</span> Linear Regression Calculator (y = mx + b)
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Calculate least squares regression line, slope (m), intercept (b), correlation (r), and R² determination coefficient.
          </p>
        </div>
        <button
          onClick={copyEquation}
          disabled={!regression}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          <span>Copy Equation</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input Text Area */}
        <div className="lg:col-span-7 glass-card p-6 sm:p-7 rounded-3xl space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Data Points (x, y per line)
            </span>
            <span className="text-xs font-mono font-bold text-indigo-600">
              {points.length} points parsed
            </span>
          </div>

          <textarea
            rows={8}
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            placeholder="e.g.&#10;1, 2&#10;2, 3.5&#10;3, 5"
            className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-sm leading-relaxed outline-none focus:ring-2 focus:ring-indigo-500"
          />

          {/* Predictor */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center gap-3">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Predict Y for X =
            </span>
            <input
              type="number"
              value={predictX}
              onChange={e => setPredictX(Number(e.target.value))}
              className="w-24 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border font-mono font-bold text-xs"
            />
            {predictedY !== null && (
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                → Predicted Y = <span className="font-mono text-sm">{predictedY.toFixed(3)}</span>
              </span>
            )}
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-card p-6 sm:p-7 rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-slate-500/5 space-y-4">
            <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 block">
              Linear Best-Fit Equation
            </span>

            {regression ? (
              <div>
                <div className="text-2xl sm:text-3xl font-black font-mono text-slate-900 dark:text-white tracking-tight">
                  {regression.equation}
                </div>
                <div className="mt-2 inline-block px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-600 dark:text-indigo-400">
                  R² = {regression.rSquared.toFixed(4)} ({regression.rSquared >= 0.8 ? 'Strong Fit' : 'Moderate Fit'})
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400">Add at least 2 coordinate pairs</p>
            )}

            {regression && (
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>Slope (m):</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">
                    {regression.slope.toFixed(5)}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>Y-Intercept (b):</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">
                    {regression.intercept.toFixed(5)}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>Correlation Coefficient (r):</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">
                    {regression.r.toFixed(4)}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
