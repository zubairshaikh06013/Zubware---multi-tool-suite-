import React, { useState } from 'react';
import { ArrowLeftRight, Calculator, Copy, Check, RotateCcw, Download, Share2 } from 'lucide-react';

interface UnitConverterToolProps {
  onShowToast: (message: string) => void;
}

type UnitCategory = 'length' | 'weight' | 'temperature' | 'area' | 'volume' | 'speed' | 'data' | 'time' | 'pressure' | 'power' | 'energy';

interface UnitDef {
  name: string;
  factor: number; // Ratio to base unit
}

const CATEGORIES: Record<UnitCategory, { label: string; base: string; units: Record<string, UnitDef> }> = {
  length: {
    label: 'Length',
    base: 'meter',
    units: {
      millimeter: { name: 'Millimeters (mm)', factor: 0.001 },
      centimeter: { name: 'Centimeters (cm)', factor: 0.01 },
      meter: { name: 'Meters (m)', factor: 1 },
      kilometer: { name: 'Kilometers (km)', factor: 1000 },
      inch: { name: 'Inches (in)', factor: 0.0254 },
      foot: { name: 'Feet (ft)', factor: 0.3048 },
      yard: { name: 'Yards (yd)', factor: 0.9144 },
      mile: { name: 'Miles (mi)', factor: 1609.344 }
    }
  },
  weight: {
    label: 'Weight & Mass',
    base: 'gram',
    units: {
      milligram: { name: 'Milligrams (mg)', factor: 0.001 },
      gram: { name: 'Grams (g)', factor: 1 },
      kilogram: { name: 'Kilograms (kg)', factor: 1000 },
      metric_ton: { name: 'Metric Tons (t)', factor: 1000000 },
      ounce: { name: 'Ounces (oz)', factor: 28.3495 },
      pound: { name: 'Pounds (lb)', factor: 453.592 }
    }
  },
  temperature: {
    label: 'Temperature',
    base: 'celsius',
    units: {
      celsius: { name: 'Celsius (°C)', factor: 1 },
      fahrenheit: { name: 'Fahrenheit (°F)', factor: 1 },
      kelvin: { name: 'Kelvin (K)', factor: 1 }
    }
  },
  area: {
    label: 'Area',
    base: 'sq_meter',
    units: {
      sq_meter: { name: 'Square Meters (m²)', factor: 1 },
      sq_km: { name: 'Square Kilometers (km²)', factor: 1000000 },
      sq_foot: { name: 'Square Feet (sq ft)', factor: 0.092903 },
      acre: { name: 'Acres (ac)', factor: 4046.86 },
      hectare: { name: 'Hectares (ha)', factor: 10000 }
    }
  },
  volume: {
    label: 'Volume',
    base: 'liter',
    units: {
      milliliter: { name: 'Milliliters (ml)', factor: 0.001 },
      liter: { name: 'Liters (l)', factor: 1 },
      cubic_meter: { name: 'Cubic Meters (m³)', factor: 1000 },
      gallon: { name: 'US Gallons (gal)', factor: 3.78541 },
      fluid_ounce: { name: 'US Fluid Ounces (fl oz)', factor: 0.0295735 }
    }
  },
  speed: {
    label: 'Speed',
    base: 'm_s',
    units: {
      m_s: { name: 'Meters per second (m/s)', factor: 1 },
      km_h: { name: 'Kilometers per hour (km/h)', factor: 0.277778 },
      mph: { name: 'Miles per hour (mph)', factor: 0.44704 },
      knot: { name: 'Knots (kn)', factor: 0.514444 }
    }
  },
  data: {
    label: 'Data Storage',
    base: 'byte',
    units: {
      bit: { name: 'Bits (b)', factor: 0.125 },
      byte: { name: 'Bytes (B)', factor: 1 },
      kilobyte: { name: 'Kilobytes (KB)', factor: 1024 },
      megabyte: { name: 'Megabytes (MB)', factor: 1048576 },
      gigabyte: { name: 'Gigabytes (GB)', factor: 1073741824 },
      terabyte: { name: 'Terabytes (TB)', factor: 1099511627776 }
    }
  },
  time: {
    label: 'Time',
    base: 'second',
    units: {
      millisecond: { name: 'Milliseconds (ms)', factor: 0.001 },
      second: { name: 'Seconds (s)', factor: 1 },
      minute: { name: 'Minutes (min)', factor: 60 },
      hour: { name: 'Hours (h)', factor: 3600 },
      day: { name: 'Days (d)', factor: 86400 },
      week: { name: 'Weeks (wk)', factor: 604800 },
      year: { name: 'Years (yr)', factor: 31536000 }
    }
  },
  pressure: {
    label: 'Pressure',
    base: 'pascal',
    units: {
      pascal: { name: 'Pascals (Pa)', factor: 1 },
      kilopascal: { name: 'Kilopascals (kPa)', factor: 1000 },
      bar: { name: 'Bar (bar)', factor: 100000 },
      psi: { name: 'Pounds per sq inch (psi)', factor: 6894.76 },
      atm: { name: 'Standard Atmospheres (atm)', factor: 101325 },
      mmhg: { name: 'Millimeters of Mercury (mmHg)', factor: 133.322 }
    }
  },
  power: {
    label: 'Power',
    base: 'watt',
    units: {
      watt: { name: 'Watts (W)', factor: 1 },
      kilowatt: { name: 'Kilowatts (kW)', factor: 1000 },
      megawatt: { name: 'Megawatts (MW)', factor: 1000000 },
      horsepower: { name: 'Horsepower (hp metric)', factor: 735.499 },
      btu_per_hour: { name: 'BTU per hour (BTU/h)', factor: 0.293071 }
    }
  },
  energy: {
    label: 'Energy',
    base: 'joule',
    units: {
      joule: { name: 'Joules (J)', factor: 1 },
      kilojoule: { name: 'Kilojoules (kJ)', factor: 1000 },
      calorie: { name: 'Calories (cal)', factor: 4.184 },
      kilocalorie: { name: 'Kilocalories (kcal)', factor: 4184 },
      kwh: { name: 'Kilowatt-hours (kWh)', factor: 3600000 },
      btu: { name: 'British Thermal Units (BTU)', factor: 1055.06 }
    }
  }
};

export const UnitConverterTool: React.FC<UnitConverterToolProps> = ({ onShowToast }) => {
  const [category, setCategory] = useState<UnitCategory>('length');
  const [inputValue, setInputValue] = useState<string>('1');
  const [fromUnit, setFromUnit] = useState<string>('meter');
  const [toUnit, setToUnit] = useState<string>('foot');
  const [copied, setCopied] = useState<boolean>(false);

  const currentCategory = CATEGORIES[category];

  const convertValue = (valStr: string, fromKey: string, toKey: string) => {
    const val = parseFloat(valStr);
    if (isNaN(val)) return 0;

    if (category === 'temperature') {
      let celsius = val;
      if (fromKey === 'fahrenheit') celsius = (val - 32) * (5 / 9);
      if (fromKey === 'kelvin') celsius = val - 273.15;

      if (toKey === 'celsius') return celsius;
      if (toKey === 'fahrenheit') return celsius * (9 / 5) + 32;
      if (toKey === 'kelvin') return celsius + 273.15;
    }

    const fromFactor = currentCategory.units[fromKey]?.factor || 1;
    const toFactor = currentCategory.units[toKey]?.factor || 1;
    const baseVal = val * fromFactor;
    return baseVal / toFactor;
  };

  const convertedValue = convertValue(inputValue, fromUnit, toUnit);

  const swapUnits = () => {
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
    onShowToast(`Swapped units: ${toUnit} ⇄ ${temp}`);
  };

  const handleCategoryChange = (catKey: UnitCategory) => {
    setCategory(catKey);
    const keys = Object.keys(CATEGORIES[catKey].units);
    setFromUnit(keys[0]);
    setToUnit(keys[1] || keys[0]);
  };

  const handleCopyResult = () => {
    const fromLabel = currentCategory.units[fromUnit]?.name || fromUnit;
    const toLabel = currentCategory.units[toUnit]?.name || toUnit;
    const formatted = `${inputValue} ${fromLabel} = ${convertedValue.toLocaleString(undefined, { maximumFractionDigits: 6 })} ${toLabel}`;
    navigator.clipboard.writeText(formatted);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    onShowToast('Copied conversion to clipboard!');
  };

  const handleReset = () => {
    setCategory('length');
    setInputValue('1');
    setFromUnit('meter');
    setToUnit('foot');
    onShowToast('Reset unit converter to default');
  };

  const handleDownloadTable = () => {
    const fromLabel = currentCategory.units[fromUnit]?.name || fromUnit;
    let report = `Zubware Universal Unit Converter\nCategory: ${currentCategory.label}\nInput: ${inputValue} ${fromLabel}\nDate: ${new Date().toLocaleDateString()}\n\n`;
    report += `Conversions:\n`;
    Object.entries(currentCategory.units).forEach(([uKey, uDef]) => {
      const res = convertValue(inputValue, fromUnit, uKey);
      report += `• ${uDef.name}: ${res.toLocaleString(undefined, { maximumFractionDigits: 6 })}\n`;
    });

    const blob = new Blob([report], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `unit-conversion-${category}-${inputValue}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    onShowToast('Downloaded conversion breakdown!');
  };

  return (
    <div className="p-4 sm:p-8 space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            Universal Unit Converter
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Convert length, weight, area, volume, temperature, pressure, energy, power, data storage, speed & time units.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Reset to default"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2">
        {(Object.keys(CATEGORIES) as UnitCategory[]).map((catKey) => (
          <button
            key={catKey}
            onClick={() => handleCategoryChange(catKey)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all capitalize cursor-pointer ${
              category === catKey
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {CATEGORIES[catKey].label}
          </button>
        ))}
      </div>

      {/* Conversion Main Interface */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-6 border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
          {/* From */}
          <div className="md:col-span-2 space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">From Value & Unit</label>
            <input
              type="number"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-lg font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <select
              value={fromUnit}
              onChange={e => setFromUnit(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700"
            >
              {Object.entries(currentCategory.units).map(([key, def]) => (
                <option key={key} value={key}>{def.name}</option>
              ))}
            </select>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center">
            <button
              onClick={swapUnits}
              className="p-3 rounded-2xl bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-md cursor-pointer active:scale-95"
              title="Swap units"
            >
              <ArrowLeftRight className="w-5 h-5" />
            </button>
          </div>

          {/* To */}
          <div className="md:col-span-2 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Converted Result</label>
              <button
                onClick={handleCopyResult}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <div className="w-full px-4 py-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-900 font-mono text-lg font-bold text-indigo-600 dark:text-indigo-400 flex items-center justify-between">
              <span className="truncate">
                {Number.isFinite(convertedValue) ? convertedValue.toLocaleString(undefined, { maximumFractionDigits: 6 }) : '0'}
              </span>
            </div>
            <select
              value={toUnit}
              onChange={e => setToUnit(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700"
            >
              {Object.entries(currentCategory.units).map(([key, def]) => (
                <option key={key} value={key}>{def.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Quick All-Unit Breakdown Table */}
      <div className="glass-card p-6 rounded-3xl space-y-4 border border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            All {currentCategory.label} Conversions for {inputValue || '0'} {currentCategory.units[fromUnit]?.name}
          </h3>
          <button
            onClick={handleDownloadTable}
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export TXT</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {Object.entries(currentCategory.units).map(([uKey, uDef]) => {
            const res = convertValue(inputValue, fromUnit, uKey);
            return (
              <div key={uKey} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase">{uDef.name}</div>
                  <div className="font-mono text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                    {res.toLocaleString(undefined, { maximumFractionDigits: 6 })}
                  </div>
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`${res}`);
                    onShowToast(`Copied ${res} ${uDef.name}`);
                  }}
                  className="p-1.5 text-slate-400 hover:text-indigo-600 transition-colors"
                  title="Copy this value"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
