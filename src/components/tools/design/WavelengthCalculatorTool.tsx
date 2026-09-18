import React, { useState } from 'react';
import { Waves, Zap, Info, Copy, Check } from 'lucide-react';

interface WavelengthCalculatorToolProps {
  onShowToast: (message: string) => void;
}

const PRESET_WAVES = [
  { name: 'Light / Radio (Vacuum)', speed: 299792458, unit: 'm/s' },
  { name: 'Sound in Air (20°C)', speed: 343, unit: 'm/s' },
  { name: 'Sound in Water (Fresh)', speed: 1482, unit: 'm/s' },
  { name: 'Sound in Steel', speed: 5960, unit: 'm/s' }
];

export const WavelengthCalculatorTool: React.FC<WavelengthCalculatorToolProps> = ({ onShowToast }) => {
  const [frequency, setFrequency] = useState<number>(100);
  const [freqUnit, setFreqUnit] = useState<'Hz' | 'kHz' | 'MHz' | 'GHz'>('MHz');
  const [waveSpeed, setWaveSpeed] = useState<number>(299792458);
  const [copied, setCopied] = useState<boolean>(false);

  // Convert frequency to Hz
  const unitMultipliers = {
    Hz: 1,
    kHz: 1e3,
    MHz: 1e6,
    GHz: 1e9
  };

  const freqHz = frequency * unitMultipliers[freqUnit];

  // Wavelength = velocity / frequency (meters)
  const wavelengthMeters = freqHz > 0 ? waveSpeed / freqHz : 0;
  const periodSeconds = freqHz > 0 ? 1 / freqHz : 0;

  // Electromagnetic Spectrum Band approximation (if wave speed is near speed of light)
  const isEmWave = waveSpeed >= 2.9e8;
  let spectrumBand = 'Acoustic / Mechanical Wave';

  if (isEmWave) {
    if (wavelengthMeters > 1) spectrumBand = 'Radio Waves (RF)';
    else if (wavelengthMeters > 1e-3) spectrumBand = 'Microwaves';
    else if (wavelengthMeters > 7e-7) spectrumBand = 'Infrared (IR)';
    else if (wavelengthMeters > 4e-7) spectrumBand = 'Visible Light';
    else if (wavelengthMeters > 1e-8) spectrumBand = 'Ultraviolet (UV)';
    else if (wavelengthMeters > 1e-11) spectrumBand = 'X-Rays';
    else spectrumBand = 'Gamma Rays';
  } else {
    if (freqHz < 20) spectrumBand = 'Infrasound (< 20 Hz)';
    else if (freqHz <= 20000) spectrumBand = 'Audible Human Range (20 Hz – 20 kHz)';
    else spectrumBand = 'Ultrasound (> 20 kHz)';
  }

  const formatLength = (meters: number) => {
    if (meters === 0) return '0 m';
    if (meters >= 1000) return `${(meters / 1000).toPrecision(4)} km`;
    if (meters >= 1) return `${meters.toPrecision(4)} m`;
    if (meters >= 0.01) return `${(meters * 100).toPrecision(4)} cm`;
    if (meters >= 1e-3) return `${(meters * 1e3).toPrecision(4)} mm`;
    if (meters >= 1e-6) return `${(meters * 1e6).toPrecision(4)} µm`;
    if (meters >= 1e-9) return `${(meters * 1e9).toPrecision(4)} nm`;
    return `${meters.toExponential(4)} m`;
  };

  const copyResult = () => {
    navigator.clipboard.writeText(`${formatLength(wavelengthMeters)} (${spectrumBand})`);
    setCopied(true);
    onShowToast('Wavelength result copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 sm:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>〰️</span> Wavelength Calculator
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Calculate wave length, frequency, period, and spectrum classifications using the universal wave equation (λ = v / f).
          </p>
        </div>
        <button
          onClick={copyResult}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          <span>Copy Result</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Inputs */}
        <div className="lg:col-span-7 glass-card p-6 sm:p-7 rounded-3xl space-y-6">
          <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Waves className="w-4 h-4 text-indigo-500" />
            <span>Wave Properties</span>
          </h3>

          {/* Frequency & Unit */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Frequency (f)</label>
            <div className="grid grid-cols-12 gap-2">
              <input
                type="number"
                min="0.0001"
                step="any"
                value={frequency}
                onChange={e => setFrequency(Number(e.target.value))}
                className="col-span-8 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono font-bold text-sm"
              />
              <select
                value={freqUnit}
                onChange={e => setFreqUnit(e.target.value as any)}
                className="col-span-4 px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-xs"
              >
                <option value="Hz">Hz</option>
                <option value="kHz">kHz (10³)</option>
                <option value="MHz">MHz (10⁶)</option>
                <option value="GHz">GHz (10⁹)</option>
              </select>
            </div>
          </div>

          {/* Wave Velocity / Medium Presets */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Medium & Wave Velocity (v)</label>
            <div className="grid grid-cols-2 gap-2">
              {PRESET_WAVES.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => setWaveSpeed(preset.speed)}
                  className={`p-2.5 rounded-xl text-xs font-semibold border transition-all text-left ${
                    waveSpeed === preset.speed
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="truncate font-bold">{preset.name}</div>
                  <div className="text-[10px] opacity-75 font-mono">{preset.speed.toLocaleString()} m/s</div>
                </button>
              ))}
            </div>

            <div className="pt-2">
              <label className="text-[11px] font-bold text-slate-400">Custom Wave Speed (m/s)</label>
              <input
                type="number"
                value={waveSpeed}
                onChange={e => setWaveSpeed(Number(e.target.value))}
                className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border font-mono font-bold text-xs mt-1"
              />
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-5 space-y-6">
          {/* Main Hero Card */}
          <div className="glass-card p-6 sm:p-7 rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-slate-500/5 space-y-4">
            <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 block">
              Calculated Wavelength (λ)
            </span>

            <div className="text-3xl sm:text-4xl font-black font-mono text-slate-900 dark:text-white tracking-tight">
              {formatLength(wavelengthMeters)}
            </div>

            <div className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-600 dark:text-indigo-400">
              {spectrumBand}
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Exact Meters:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  {wavelengthMeters.toPrecision(6)} m
                </span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Wave Period (T = 1/f):</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  {periodSeconds.toExponential(4)} s
                </span>
              </div>
            </div>
          </div>

          {/* Formula Reference */}
          <div className="glass-card p-5 rounded-3xl space-y-2 text-xs text-slate-500">
            <span className="font-bold text-slate-700 dark:text-slate-300 block">Wave Equation:</span>
            <p className="font-mono bg-slate-100 dark:bg-slate-900 p-2.5 rounded-xl text-slate-800 dark:text-slate-200">
              λ = v / f
            </p>
            <p>Where λ is wavelength, v is propagation velocity, and f is wave frequency in Hertz.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
