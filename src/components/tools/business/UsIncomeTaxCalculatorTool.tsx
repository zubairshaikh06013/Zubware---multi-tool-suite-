import React, { useState, useMemo } from 'react';
import { 
  DollarSign, 
  ShieldAlert, 
  PieChart, 
  TrendingUp, 
  Copy, 
  Check, 
  Info, 
  Sparkles, 
  Calendar, 
  Building2, 
  Table, 
  Download,
  ArrowRight,
  TrendingDown,
  Percent,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';

interface UsIncomeTaxCalculatorToolProps {
  onShowToast: (message: string) => void;
}

type CountryMode = 'us' | 'in';
type FilingStatus = 'single' | 'married_joint' | 'married_separate' | 'head_of_household';
type UsTaxYear = '2026' | '2025' | '2024';

interface TaxBracket {
  rate: number;
  upTo: number;
}

// 2026 Projected Tax Brackets (IRS Inflation Adjusted)
const BRACKETS_2026: Record<FilingStatus, TaxBracket[]> = {
  single: [
    { rate: 0.1, upTo: 12250 },
    { rate: 0.12, upTo: 49800 },
    { rate: 0.22, upTo: 106200 },
    { rate: 0.24, upTo: 202800 },
    { rate: 0.32, upTo: 257500 },
    { rate: 0.35, upTo: 643500 },
    { rate: 0.37, upTo: Infinity }
  ],
  married_joint: [
    { rate: 0.1, upTo: 24500 },
    { rate: 0.12, upTo: 99600 },
    { rate: 0.22, upTo: 212400 },
    { rate: 0.24, upTo: 405600 },
    { rate: 0.32, upTo: 515000 },
    { rate: 0.35, upTo: 772200 },
    { rate: 0.37, upTo: Infinity }
  ],
  married_separate: [
    { rate: 0.1, upTo: 12250 },
    { rate: 0.12, upTo: 49800 },
    { rate: 0.22, upTo: 106200 },
    { rate: 0.24, upTo: 202800 },
    { rate: 0.32, upTo: 257500 },
    { rate: 0.35, upTo: 386100 },
    { rate: 0.37, upTo: Infinity }
  ],
  head_of_household: [
    { rate: 0.1, upTo: 17500 },
    { rate: 0.12, upTo: 66650 },
    { rate: 0.22, upTo: 106200 },
    { rate: 0.24, upTo: 202800 },
    { rate: 0.32, upTo: 257400 },
    { rate: 0.35, upTo: 643500 },
    { rate: 0.37, upTo: Infinity }
  ]
};

const STANDARD_DEDUCTION_2026: Record<FilingStatus, number> = {
  single: 15400,
  married_joint: 30800,
  married_separate: 15400,
  head_of_household: 23100
};

// 2025 Official IRS Federal Tax Brackets (Rev. Proc. 2024-40)
const BRACKETS_2025: Record<FilingStatus, TaxBracket[]> = {
  single: [
    { rate: 0.1, upTo: 11925 },
    { rate: 0.12, upTo: 48475 },
    { rate: 0.22, upTo: 103350 },
    { rate: 0.24, upTo: 197300 },
    { rate: 0.32, upTo: 250525 },
    { rate: 0.35, upTo: 626350 },
    { rate: 0.37, upTo: Infinity }
  ],
  married_joint: [
    { rate: 0.1, upTo: 23850 },
    { rate: 0.12, upTo: 96950 },
    { rate: 0.22, upTo: 206700 },
    { rate: 0.24, upTo: 394600 },
    { rate: 0.32, upTo: 501050 },
    { rate: 0.35, upTo: 751600 },
    { rate: 0.37, upTo: Infinity }
  ],
  married_separate: [
    { rate: 0.1, upTo: 11925 },
    { rate: 0.12, upTo: 48475 },
    { rate: 0.22, upTo: 103350 },
    { rate: 0.24, upTo: 197300 },
    { rate: 0.32, upTo: 250525 },
    { rate: 0.35, upTo: 375800 },
    { rate: 0.37, upTo: Infinity }
  ],
  head_of_household: [
    { rate: 0.1, upTo: 17000 },
    { rate: 0.12, upTo: 64850 },
    { rate: 0.22, upTo: 103350 },
    { rate: 0.24, upTo: 197300 },
    { rate: 0.32, upTo: 250500 },
    { rate: 0.35, upTo: 626350 },
    { rate: 0.37, upTo: Infinity }
  ]
};

const STANDARD_DEDUCTION_2025: Record<FilingStatus, number> = {
  single: 15000,
  married_joint: 30000,
  married_separate: 15000,
  head_of_household: 22500
};

// 2024 Reference Tax Brackets
const BRACKETS_2024: Record<FilingStatus, TaxBracket[]> = {
  single: [
    { rate: 0.1, upTo: 11600 },
    { rate: 0.12, upTo: 47150 },
    { rate: 0.22, upTo: 100525 },
    { rate: 0.24, upTo: 191950 },
    { rate: 0.32, upTo: 243725 },
    { rate: 0.35, upTo: 609350 },
    { rate: 0.37, upTo: Infinity }
  ],
  married_joint: [
    { rate: 0.1, upTo: 23200 },
    { rate: 0.12, upTo: 94300 },
    { rate: 0.22, upTo: 201050 },
    { rate: 0.24, upTo: 383900 },
    { rate: 0.32, upTo: 487450 },
    { rate: 0.35, upTo: 731200 },
    { rate: 0.37, upTo: Infinity }
  ],
  married_separate: [
    { rate: 0.1, upTo: 11600 },
    { rate: 0.12, upTo: 47150 },
    { rate: 0.22, upTo: 100525 },
    { rate: 0.24, upTo: 191950 },
    { rate: 0.32, upTo: 243725 },
    { rate: 0.35, upTo: 365600 },
    { rate: 0.37, upTo: Infinity }
  ],
  head_of_household: [
    { rate: 0.1, upTo: 16550 },
    { rate: 0.12, upTo: 63100 },
    { rate: 0.22, upTo: 100500 },
    { rate: 0.24, upTo: 191950 },
    { rate: 0.32, upTo: 243700 },
    { rate: 0.35, upTo: 609350 },
    { rate: 0.37, upTo: Infinity }
  ]
};

const STANDARD_DEDUCTION_2024: Record<FilingStatus, number> = {
  single: 14600,
  married_joint: 29200,
  married_separate: 14600,
  head_of_household: 21900
};

// Social Security Wage Base caps
const SS_WAGE_CAPS: Record<UsTaxYear, number> = {
  '2026': 181800,
  '2025': 176100,
  '2024': 168600
};

interface StateTaxOption {
  code: string;
  name: string;
  rate: number;
}

const STATE_TAX_PRESETS: StateTaxOption[] = [
  { code: 'none', name: 'No State Tax (TX, FL, WA, NV, TN, WY, SD, AK, NH)', rate: 0 },
  { code: 'CA', name: 'California (~8.0% progressive avg)', rate: 8.0 },
  { code: 'NY', name: 'New York (~6.2% progressive avg)', rate: 6.2 },
  { code: 'IL', name: 'Illinois (4.95% flat rate)', rate: 4.95 },
  { code: 'PA', name: 'Pennsylvania (3.07% flat rate)', rate: 3.07 },
  { code: 'NC', name: 'North Carolina (4.50% flat rate)', rate: 4.50 },
  { code: 'MA', name: 'Massachusetts (5.00% flat rate)', rate: 5.00 },
  { code: 'custom', name: 'Custom State Rate (%)', rate: 5.0 }
];

export const UsIncomeTaxCalculatorTool: React.FC<UsIncomeTaxCalculatorToolProps> = ({ onShowToast }) => {
  // Global / Country Mode Toggle
  const [countryMode, setCountryMode] = useState<CountryMode>('us');

  // --- US TAX STATE ---
  const [taxYear, setTaxYear] = useState<UsTaxYear>('2026'); // Latest IRS
  const [grossIncome, setGrossIncome] = useState<number>(95000);
  const [filingStatus, setFilingStatus] = useState<FilingStatus>('single');
  const [k401Contribution, setK401Contribution] = useState<number>(6000);
  const [hsaContribution, setHsaContribution] = useState<number>(1500);
  const [healthInsurancePreTax, setHealthInsurancePreTax] = useState<number>(1200);
  const [selectedStateCode, setSelectedStateCode] = useState<string>('none');
  const [customStateRate, setCustomStateRate] = useState<number>(5.0);
  const [paycheckFreq, setPaycheckFreq] = useState<'monthly' | 'biweekly' | 'semimonthly' | 'weekly'>('biweekly');
  const [showTierBreakdown, setShowTierBreakdown] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  // --- INDIA TAX STATE (Latest Union Budget FY 2025-26 / AY 2026-27) ---
  const [inGrossSalary, setInGrossSalary] = useState<number>(1200000); // ₹12 Lakh default
  const [inActiveRegime, setInActiveRegime] = useState<'new' | 'old' | 'compare'>('compare');
  const [inSec80C, setInSec80C] = useState<number>(150000); // Max 1.5 Lakh
  const [inSec80D, setInSec80D] = useState<number>(25000); // Health insurance
  const [inHraExemption, setInHraExemption] = useState<number>(120000); // Rent exemption
  const [inHomeLoanInterest, setInHomeLoanInterest] = useState<number>(0); // Section 24(b)

  // --- US TAX COMPUTATIONS ---
  const brackets = taxYear === '2026' ? BRACKETS_2026[filingStatus] : (taxYear === '2025' ? BRACKETS_2025[filingStatus] : BRACKETS_2024[filingStatus]);
  const standardDeduction = taxYear === '2026' ? STANDARD_DEDUCTION_2026[filingStatus] : (taxYear === '2025' ? STANDARD_DEDUCTION_2025[filingStatus] : STANDARD_DEDUCTION_2024[filingStatus]);
  const ssWageCap = SS_WAGE_CAPS[taxYear];

  const totalPreTaxDeductions = k401Contribution + hsaContribution + healthInsurancePreTax;
  const taxableIncome = Math.max(0, grossIncome - totalPreTaxDeductions - standardDeduction);

  const { federalTax, bracketTiers, marginalRate } = useMemo(() => {
    let tax = 0;
    let prev = 0;
    let mRate = 0.1;
    const tiers: { rate: number; min: number; max: number; taxableInTier: number; taxForTier: number }[] = [];

    for (const b of brackets) {
      if (taxableIncome > prev) {
        const taxableInTier = Math.min(taxableIncome - prev, b.upTo - prev);
        const taxForTier = taxableInTier * b.rate;
        tax += taxForTier;
        mRate = b.rate;

        tiers.push({
          rate: b.rate,
          min: prev,
          max: b.upTo,
          taxableInTier,
          taxForTier
        });
        prev = b.upTo;
      } else {
        break;
      }
    }

    return { federalTax: tax, bracketTiers: tiers, marginalRate: mRate };
  }, [taxableIncome, brackets]);

  // FICA Taxes
  const socialSecurityTax = Math.min(grossIncome, ssWageCap) * 0.062;
  const baseMedicareTax = grossIncome * 0.0145;
  const addlMedicareThreshold = filingStatus === 'married_joint' ? 250000 : (filingStatus === 'married_separate' ? 125000 : 200000);
  const additionalMedicareTax = grossIncome > addlMedicareThreshold ? (grossIncome - addlMedicareThreshold) * 0.009 : 0;
  const totalMedicareTax = baseMedicareTax + additionalMedicareTax;
  const totalFica = socialSecurityTax + totalMedicareTax;

  // State Tax
  const stateRatePct = selectedStateCode === 'custom' 
    ? customStateRate 
    : (STATE_TAX_PRESETS.find(s => s.code === selectedStateCode)?.rate || 0);
  const stateTax = taxableIncome * (stateRatePct / 100);

  // Total Tax & Take-Home
  const totalTaxes = federalTax + totalFica + stateTax;
  const netAnnualTakeHome = Math.max(0, grossIncome - totalTaxes - totalPreTaxDeductions);

  const federalEffectiveRate = grossIncome > 0 ? (federalTax / grossIncome) * 100 : 0;
  const totalEffectiveTaxRate = grossIncome > 0 ? (totalTaxes / grossIncome) * 100 : 0;

  const paycheckDivisor = paycheckFreq === 'biweekly' ? 26 : paycheckFreq === 'monthly' ? 12 : paycheckFreq === 'semimonthly' ? 24 : 52;
  const netPaycheck = netAnnualTakeHome / paycheckDivisor;

  // --- INDIA TAX COMPUTATIONS (Latest FY 2025-26 Budget Slabs) ---
  const indiaTaxResults = useMemo(() => {
    // New Tax Regime:
    // Standard Deduction: ₹75,000
    // Slabs:
    // 0 - 4,00,000: Nil
    // 4,00,001 - 8,00,000: 5%
    // 8,00,001 - 12,00,000: 10%
    // 12,00,001 - 16,00,000: 15%
    // 16,00,001 - 20,00,000: 20%
    // 20,00,001 - 24,00,000: 25%
    // Above 24,00,000: 30%
    // Section 87A rebate: Nil tax if total taxable income <= ₹12,00,000!
    const newStdDeduction = 75000;
    const newTaxableIncome = Math.max(0, inGrossSalary - newStdDeduction);

    let newTaxBeforeRebate = 0;
    const newSlabs = [
      { min: 0, max: 400000, rate: 0 },
      { min: 400000, max: 800000, rate: 0.05 },
      { min: 800000, max: 1200000, rate: 0.10 },
      { min: 1200000, max: 1600000, rate: 0.15 },
      { min: 1600000, max: 2000000, rate: 0.20 },
      { min: 2000000, max: 2400000, rate: 0.25 },
      { min: 2400000, max: Infinity, rate: 0.30 }
    ];

    const newTierBreakdown: { slab: string; rate: number; taxable: number; tax: number }[] = [];

    for (const slab of newSlabs) {
      if (newTaxableIncome > slab.min) {
        const taxable = Math.min(newTaxableIncome - slab.min, slab.max - slab.min);
        const tax = taxable * slab.rate;
        newTaxBeforeRebate += tax;
        newTierBreakdown.push({
          slab: slab.max === Infinity ? `Above ₹24,00,000` : `₹${(slab.min / 100000).toFixed(1)}L - ₹${(slab.max / 100000).toFixed(1)}L`,
          rate: slab.rate * 100,
          taxable,
          tax
        });
      }
    }

    // 87A Rebate: if taxable income <= 12,00,000, 100% tax rebate applies!
    let newRebate87A = 0;
    if (newTaxableIncome <= 1200000) {
      newRebate87A = newTaxBeforeRebate;
    }
    const newTaxAfterRebate = Math.max(0, newTaxBeforeRebate - newRebate87A);
    const newCess = Math.round(newTaxAfterRebate * 0.04);
    const newTotalTax = newTaxAfterRebate + newCess;
    const newMonthlyInHand = Math.round(Math.max(0, inGrossSalary - newTotalTax) / 12);

    // Old Tax Regime:
    // Standard Deduction: ₹50,000
    // Slabs:
    // 0 - 2.5L: Nil
    // 2.5L - 5L: 5%
    // 5L - 10L: 20%
    // > 10L: 30%
    // Deductions: 80C (max 1.5L), 80D (max 75k), HRA, Home Loan Interest (24b)
    const oldStdDeduction = 50000;
    const allowed80C = Math.min(inSec80C, 150000);
    const allowed80D = Math.min(inSec80D, 75000);
    const allowed24b = Math.min(inHomeLoanInterest, 200000);
    const totalOldDeductions = oldStdDeduction + allowed80C + allowed80D + inHraExemption + allowed24b;
    const oldTaxableIncome = Math.max(0, inGrossSalary - totalOldDeductions);

    let oldTaxBeforeRebate = 0;
    const oldSlabs = [
      { min: 0, max: 250000, rate: 0 },
      { min: 250000, max: 500000, rate: 0.05 },
      { min: 500000, max: 1000000, rate: 0.20 },
      { min: 1000000, max: Infinity, rate: 0.30 }
    ];

    const oldTierBreakdown: { slab: string; rate: number; taxable: number; tax: number }[] = [];

    for (const slab of oldSlabs) {
      if (oldTaxableIncome > slab.min) {
        const taxable = Math.min(oldTaxableIncome - slab.min, slab.max - slab.min);
        const tax = taxable * slab.rate;
        oldTaxBeforeRebate += tax;
        oldTierBreakdown.push({
          slab: slab.max === Infinity ? `Above ₹10,00,000` : `₹${(slab.min / 100000).toFixed(1)}L - ₹${(slab.max / 100000).toFixed(1)}L`,
          rate: slab.rate * 100,
          taxable,
          tax
        });
      }
    }

    let oldRebate87A = 0;
    if (oldTaxableIncome <= 500000) {
      oldRebate87A = Math.min(oldTaxBeforeRebate, 12500);
    }
    const oldTaxAfterRebate = Math.max(0, oldTaxBeforeRebate - oldRebate87A);
    const oldCess = Math.round(oldTaxAfterRebate * 0.04);
    const oldTotalTax = oldTaxAfterRebate + oldCess;
    const oldMonthlyInHand = Math.round(Math.max(0, inGrossSalary - oldTotalTax) / 12);

    const taxDifference = oldTotalTax - newTotalTax;
    const betterRegime = taxDifference > 0 ? 'new' : taxDifference < 0 ? 'old' : 'equal';
    const taxSaved = Math.abs(taxDifference);

    return {
      newTaxableIncome,
      newTotalTax,
      newRebate87A,
      newMonthlyInHand,
      newTierBreakdown,
      oldTaxableIncome,
      oldTotalTax,
      oldRebate87A,
      totalOldDeductions,
      oldMonthlyInHand,
      oldTierBreakdown,
      betterRegime,
      taxSaved
    };
  }, [inGrossSalary, inSec80C, inSec80D, inHraExemption, inHomeLoanInterest]);

  const copySummary = () => {
    if (countryMode === 'us') {
      const text = `US Income Tax & Paycheck Summary (${taxYear} Tax Year):
Gross Annual Income: $${grossIncome.toLocaleString()}
Filing Status: ${filingStatus.replace('_', ' ').toUpperCase()}
Total Pre-Tax Deductions: $${totalPreTaxDeductions.toLocaleString()}
Standard Deduction: $${standardDeduction.toLocaleString()}
Taxable Income: $${taxableIncome.toLocaleString()}

Federal Income Tax: $${federalTax.toFixed(2)} (${federalEffectiveRate.toFixed(1)}% effective, ${(marginalRate * 100).toFixed(0)}% marginal)
Social Security (FICA): $${socialSecurityTax.toFixed(2)}
Medicare (FICA): $${totalMedicareTax.toFixed(2)}
State Tax (${selectedStateCode}): $${stateTax.toFixed(2)}
Total Combined Tax: $${totalTaxes.toFixed(2)} (${totalEffectiveTaxRate.toFixed(1)}% total effective)

Estimated Net Take-Home:
- Per ${paycheckFreq}: $${netPaycheck.toFixed(2)}
- Annual Net: $${netAnnualTakeHome.toFixed(2)}`;

      navigator.clipboard.writeText(text);
      setCopied(true);
      onShowToast('Copied US Tax Summary to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } else {
      const { newTotalTax, oldTotalTax, newMonthlyInHand, oldMonthlyInHand, betterRegime, taxSaved } = indiaTaxResults;
      const text = `India Income Tax Summary (FY 2025-26 / AY 2026-27 - Latest Budget):
Gross Annual Salary: ₹${inGrossSalary.toLocaleString('en-IN')}

[NEW TAX REGIME (Default & Recommended)]
- Standard Deduction: ₹75,000
- Section 87A Rebate: ${inGrossSalary <= 1275000 ? 'Full Rebate (Zero Tax up to ₹12 Lakhs)' : 'Not applicable'}
- Total Income Tax (incl. 4% Cess): ₹${newTotalTax.toLocaleString('en-IN')}
- Monthly In-Hand Salary: ₹${newMonthlyInHand.toLocaleString('en-IN')}

[OLD TAX REGIME]
- Total Deductions (Std + 80C + 80D + HRA): ₹${indiaTaxResults.totalOldDeductions.toLocaleString('en-IN')}
- Total Income Tax (incl. 4% Cess): ₹${oldTotalTax.toLocaleString('en-IN')}
- Monthly In-Hand Salary: ₹${oldMonthlyInHand.toLocaleString('en-IN')}

RECOMMENDATION: ${betterRegime === 'new' ? `New Tax Regime saves you ₹${taxSaved.toLocaleString('en-IN')}!` : betterRegime === 'old' ? `Old Tax Regime saves you ₹${taxSaved.toLocaleString('en-IN')}!` : 'Both regimes result in equal tax.'}`;

      navigator.clipboard.writeText(text);
      setCopied(true);
      onShowToast('Copied India Tax Summary to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const downloadReport = () => {
    let text = '';
    if (countryMode === 'us') {
      text = `=== Zubware US Income Tax & Paycheck Report ===
Tax Year: ${taxYear} (Latest IRS Schedules)
Generated: ${new Date().toLocaleDateString()}
Gross Income: $${grossIncome.toLocaleString()}
Filing Status: ${filingStatus}
Taxable Income: $${taxableIncome.toLocaleString()}
Federal Tax: $${federalTax.toFixed(2)}
FICA Taxes: $${totalFica.toFixed(2)}
State Tax: $${stateTax.toFixed(2)}
Total Taxes: $${totalTaxes.toFixed(2)}
Net Take-Home Pay (Annual): $${netAnnualTakeHome.toFixed(2)}
Net Paycheck (${paycheckFreq}): $${netPaycheck.toFixed(2)}
`;
    } else {
      text = `=== Zubware India Income Tax Report (FY 2025-26 / AY 2026-27) ===
Financial Year: 2025-2026 (Budget 2025 Latest Slabs)
Gross Annual Salary: ₹${inGrossSalary.toLocaleString('en-IN')}
New Regime Tax: ₹${indiaTaxResults.newTotalTax.toLocaleString('en-IN')} (Monthly Take-Home: ₹${indiaTaxResults.newMonthlyInHand.toLocaleString('en-IN')})
Old Regime Tax: ₹${indiaTaxResults.oldTotalTax.toLocaleString('en-IN')} (Monthly Take-Home: ₹${indiaTaxResults.oldMonthlyInHand.toLocaleString('en-IN')})
Best Regime: ${indiaTaxResults.betterRegime.toUpperCase()} REGIME (Saves ₹${indiaTaxResults.taxSaved.toLocaleString('en-IN')})
`;
    }

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tax-calculation-report-${countryMode}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    onShowToast('Downloaded tax report!');
  };

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-6xl mx-auto">
      {/* Title Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">{countryMode === 'us' ? '🇺🇸' : '🇮🇳'}</span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              {countryMode === 'us' ? `US Income Tax Calculator (${taxYear})` : 'Income Tax Calculator (FY 2025-26 / AY 2026)'}
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              Latest Budget & IRS Brackets
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {countryMode === 'us' 
              ? 'Calculate progressive IRS federal tax brackets, FICA withholdings, state tax, and net paycheck pay.'
              : 'Calculate Union Budget 2025-2026 revised slabs, ₹75,000 standard deduction, Section 87A rebate (zero tax up to ₹12L), and Old vs New regime.'}
          </p>
        </div>

        {/* Global Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Country Switcher */}
          <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl flex items-center text-xs font-bold shadow-xs">
            <button
              onClick={() => setCountryMode('us')}
              className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                countryMode === 'us' ? 'bg-white dark:bg-slate-900 text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>🇺🇸</span> US (IRS)
            </button>
            <button
              onClick={() => setCountryMode('in')}
              className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                countryMode === 'in' ? 'bg-white dark:bg-slate-900 text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>🇮🇳</span> India (Budget 2025-26)
            </button>
          </div>

          {countryMode === 'us' && (
            <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl flex items-center text-xs font-bold">
              {(['2026', '2025', '2024'] as const).map(yr => (
                <button
                  key={yr}
                  onClick={() => setTaxYear(yr)}
                  className={`px-2.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                    taxYear === yr ? 'bg-white dark:bg-slate-900 text-indigo-600 shadow-sm' : 'text-slate-500'
                  }`}
                >
                  {yr} {yr === '2026' ? '(Latest)' : ''}
                </button>
              ))}
            </div>
          )}

          <button
            onClick={copySummary}
            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>Copy Summary</span>
          </button>

          <button
            onClick={downloadReport}
            className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {countryMode === 'us' ? (
        /* US TAX CALCULATOR */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Inputs (7 Cols) */}
          <div className="lg:col-span-7 glass-card p-6 sm:p-7 rounded-3xl space-y-6">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-indigo-500" />
              <span>Income & IRS Tax Filing Profile ({taxYear})</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Gross Annual Income */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Gross Annual Income ($)
                </label>
                <input
                  type="number"
                  min="0"
                  step="1000"
                  value={grossIncome}
                  onChange={e => setGrossIncome(Math.max(0, Number(e.target.value)))}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-sm"
                />
              </div>

              {/* Filing Status */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  IRS Filing Status
                </label>
                <select
                  value={filingStatus}
                  onChange={e => setFilingStatus(e.target.value as FilingStatus)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-xs"
                >
                  <option value="single">Single</option>
                  <option value="married_joint">Married Filing Jointly</option>
                  <option value="married_separate">Married Filing Separately</option>
                  <option value="head_of_household">Head of Household</option>
                </select>
              </div>

              {/* Pre-Tax 401(k) */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Pre-Tax 401(k) / IRA ($)
                </label>
                <input
                  type="number"
                  min="0"
                  step="500"
                  value={k401Contribution}
                  onChange={e => setK401Contribution(Math.max(0, Number(e.target.value)))}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-sm"
                />
              </div>

              {/* HSA */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  HSA Contribution ($)
                </label>
                <input
                  type="number"
                  min="0"
                  step="250"
                  value={hsaContribution}
                  onChange={e => setHsaContribution(Math.max(0, Number(e.target.value)))}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-sm"
                />
              </div>

              {/* Healthcare */}
              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Pre-Tax Health Insurance Premiums ($/year)
                </label>
                <input
                  type="number"
                  min="0"
                  step="200"
                  value={healthInsurancePreTax}
                  onChange={e => setHealthInsurancePreTax(Math.max(0, Number(e.target.value)))}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-sm"
                />
              </div>

              {/* State Tax Selector */}
              <div className="sm:col-span-2 space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  State Income Tax Selection
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <select
                    value={selectedStateCode}
                    onChange={e => setSelectedStateCode(e.target.value)}
                    className="sm:col-span-2 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-xs"
                  >
                    {STATE_TAX_PRESETS.map(s => (
                      <option key={s.code} value={s.code}>
                        {s.name}
                      </option>
                    ))}
                  </select>

                  {selectedStateCode === 'custom' && (
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        min="0"
                        max="20"
                        step="0.1"
                        value={customStateRate}
                        onChange={e => setCustomStateRate(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border font-bold text-xs text-center"
                      />
                      <span className="text-xs font-bold">%</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Deductions Summary Banner */}
            <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200/50 dark:border-indigo-900/50 flex flex-wrap items-center justify-between text-xs gap-3">
              <div>
                <span className="text-slate-500 dark:text-slate-400 block font-medium">Standard Deduction ({taxYear}):</span>
                <span className="font-extrabold text-indigo-700 dark:text-indigo-300 text-sm">
                  ${standardDeduction.toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400 block font-medium">Pre-Tax Deductions:</span>
                <span className="font-extrabold text-indigo-700 dark:text-indigo-300 text-sm">
                  ${totalPreTaxDeductions.toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400 block font-medium">Taxable Income:</span>
                <span className="font-extrabold text-indigo-700 dark:text-indigo-300 text-sm">
                  ${taxableIncome.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Right Summary (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="glass-card p-6 rounded-3xl space-y-5 border border-indigo-500/20 bg-gradient-to-br from-indigo-50/20 to-purple-50/10 dark:from-slate-900/60 dark:to-indigo-950/20">
              {/* Paycheck Frequency Tabs */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Estimated Net Paycheck
                </span>
                <div className="flex bg-slate-100 dark:bg-slate-800 p-0.5 rounded-xl text-[10px] font-bold">
                  {(['biweekly', 'monthly', 'weekly'] as const).map(freq => (
                    <button
                      key={freq}
                      onClick={() => setPaycheckFreq(freq)}
                      className={`px-2.5 py-1 rounded-lg transition-all capitalize cursor-pointer ${
                        paycheckFreq === freq ? 'bg-white dark:bg-slate-900 text-indigo-600 shadow-sm' : 'text-slate-500'
                      }`}
                    >
                      {freq}
                    </button>
                  ))}
                </div>
              </div>

              <div className="text-4xl font-black text-indigo-600 dark:text-indigo-400 font-mono">
                ${netPaycheck.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200/50 dark:border-slate-800/50 text-xs">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Annual Net Pay</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                    ${netAnnualTakeHome.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Effective Tax Rate</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                    {totalEffectiveTaxRate.toFixed(1)}%
                  </span>
                </div>
              </div>

              {/* Tax Line Items */}
              <div className="space-y-2 pt-2 border-t border-slate-200/50 dark:border-slate-800/50 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                  <span className="text-slate-600 dark:text-slate-400">Federal Income Tax</span>
                  <span className="font-bold text-slate-900 dark:text-white">${federalTax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                  <span className="text-slate-600 dark:text-slate-400">Social Security (6.2%)</span>
                  <span className="font-bold text-slate-900 dark:text-white">${socialSecurityTax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                  <span className="text-slate-600 dark:text-slate-400">Medicare (1.45% + addl)</span>
                  <span className="font-bold text-slate-900 dark:text-white">${totalMedicareTax.toFixed(2)}</span>
                </div>
                {stateTax > 0 && (
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                    <span className="text-slate-600 dark:text-slate-400">State Tax ({selectedStateCode})</span>
                    <span className="font-bold text-slate-900 dark:text-white">${stateTax.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between py-1.5 font-bold text-rose-600 dark:text-rose-400">
                  <span>Total Tax Withheld</span>
                  <span>${totalTaxes.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Federal Bracket Breakdown Toggle */}
            <div className="glass-card p-5 rounded-3xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Table className="w-3.5 h-3.5 text-indigo-500" />
                  Federal Progressive Brackets ({taxYear})
                </span>
                <button
                  onClick={() => setShowTierBreakdown(!showTierBreakdown)}
                  className="text-[11px] text-indigo-600 dark:text-indigo-400 font-bold hover:underline cursor-pointer"
                >
                  {showTierBreakdown ? 'Hide Slabs' : 'Show Slabs'}
                </button>
              </div>

              {showTierBreakdown && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[11px]">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold">
                        <th className="py-1">Rate</th>
                        <th className="py-1">Bracket Range</th>
                        <th className="py-1 text-right">Tax</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                      {bracketTiers.map((tier, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                          <td className="py-1.5 font-bold text-indigo-600 dark:text-indigo-400">
                            {(tier.rate * 100).toFixed(0)}%
                          </td>
                          <td className="py-1.5 text-slate-600 dark:text-slate-300">
                            ${tier.min.toLocaleString()} - {tier.max === Infinity ? 'Above' : `$${tier.max.toLocaleString()}`}
                          </td>
                          <td className="py-1.5 text-right font-bold text-slate-900 dark:text-white">
                            ${tier.taxForTier.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* INDIA INCOME TAX CALCULATOR (BUDGET 2025-2026 LATEST) */
        <div className="space-y-6">
          {/* Regime Comparison Banner */}
          <div className={`p-5 rounded-3xl border flex flex-wrap items-center justify-between gap-4 ${
            indiaTaxResults.betterRegime === 'new' 
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-900 dark:text-emerald-300'
              : indiaTaxResults.betterRegime === 'old'
              ? 'bg-amber-500/10 border-amber-500/30 text-amber-900 dark:text-amber-300'
              : 'bg-indigo-500/10 border-indigo-500/30 text-indigo-900 dark:text-indigo-300'
          }`}>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 flex-shrink-0" />
              <div>
                <h4 className="font-black text-sm sm:text-base">
                  {indiaTaxResults.betterRegime === 'new'
                    ? `🎉 New Tax Regime (Latest Budget) is Better for You!`
                    : indiaTaxResults.betterRegime === 'old'
                    ? `💡 Old Tax Regime Saves You More with Deductions!`
                    : `⚖️ Both Regimes Result in Equal Tax Liability!`}
                </h4>
                <p className="text-xs opacity-90 mt-0.5">
                  {indiaTaxResults.betterRegime === 'new'
                    ? `You save ₹${indiaTaxResults.taxSaved.toLocaleString('en-IN')} in tax under the New Regime (zero tax up to ₹12 Lakhs income under Section 87A + ₹75,000 std deduction).`
                    : indiaTaxResults.betterRegime === 'old'
                    ? `You save ₹${indiaTaxResults.taxSaved.toLocaleString('en-IN')} using 80C, 80D, HRA, and Home Loan interest deductions under Old Regime.`
                    : `Both regimes result in the exact same tax of ₹${indiaTaxResults.newTotalTax.toLocaleString('en-IN')}.`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 font-extrabold text-xs shadow-xs">
                Tax Saved: ₹{indiaTaxResults.taxSaved.toLocaleString('en-IN')}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Input Controls (5 Cols) */}
            <div className="lg:col-span-5 glass-card p-6 rounded-3xl space-y-5">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-indigo-500" />
                <span>Salary & Tax Deductions (FY 2025-26)</span>
              </h3>

              {/* Annual Gross Salary */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Gross Annual CTC / Salary (₹)
                  </label>
                  <span className="text-[11px] font-extrabold text-indigo-600">
                    ₹{(inGrossSalary / 100000).toFixed(2)} Lakhs
                  </span>
                </div>
                <input
                  type="number"
                  min="0"
                  step="25000"
                  value={inGrossSalary}
                  onChange={e => setInGrossSalary(Math.max(0, Number(e.target.value)))}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-sm"
                />
              </div>

              {/* Quick Preset Buttons */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Quick Salary Presets:</span>
                <div className="flex flex-wrap gap-1.5">
                  {[600000, 900000, 1200000, 1500000, 2000000, 3000000].map(amt => (
                    <button
                      key={amt}
                      onClick={() => setInGrossSalary(amt)}
                      className={`px-2 py-1 rounded-lg text-xs font-semibold cursor-pointer border ${
                        inGrossSalary === amt 
                          ? 'bg-indigo-600 text-white border-indigo-600' 
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      ₹{amt / 100000}L
                    </button>
                  ))}
                </div>
              </div>

              {/* Old Regime Deductions Section */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    Old Regime Deductions
                  </span>
                  <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 px-2 py-0.5 rounded-md font-semibold">
                    Ignored in New Regime
                  </span>
                </div>

                {/* Section 80C */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <label className="text-slate-600 dark:text-slate-400">Section 80C (PPF, ELSS, EPF, LIC)</label>
                    <span className="text-slate-400 text-[10px]">Max ₹1.5L</span>
                  </div>
                  <input
                    type="number"
                    min="0"
                    max="150000"
                    step="10000"
                    value={inSec80C}
                    onChange={e => setInSec80C(Math.min(150000, Math.max(0, Number(e.target.value))))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-xs"
                  />
                </div>

                {/* Section 80D */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <label className="text-slate-600 dark:text-slate-400">Section 80D (Health Insurance)</label>
                    <span className="text-slate-400 text-[10px]">Max ₹75k</span>
                  </div>
                  <input
                    type="number"
                    min="0"
                    max="75000"
                    step="5000"
                    value={inSec80D}
                    onChange={e => setInSec80D(Math.min(75000, Math.max(0, Number(e.target.value))))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-xs"
                  />
                </div>

                {/* HRA */}
                <div className="space-y-1">
                  <label className="text-xs text-slate-600 dark:text-slate-400">HRA Exemption (Rent Paid)</label>
                  <input
                    type="number"
                    min="0"
                    step="10000"
                    value={inHraExemption}
                    onChange={e => setInHraExemption(Math.max(0, Number(e.target.value)))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-xs"
                  />
                </div>

                {/* Home Loan Interest (24b) */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <label className="text-slate-600 dark:text-slate-400">Home Loan Interest (Sec 24b)</label>
                    <span className="text-slate-400 text-[10px]">Max ₹2L</span>
                  </div>
                  <input
                    type="number"
                    min="0"
                    max="200000"
                    step="10000"
                    value={inHomeLoanInterest}
                    onChange={e => setInHomeLoanInterest(Math.min(200000, Math.max(0, Number(e.target.value))))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Comparison Cards (7 Cols) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* New Tax Regime Card */}
                <div className={`p-6 rounded-3xl border transition-all ${
                  indiaTaxResults.betterRegime === 'new'
                    ? 'border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/20 ring-2 ring-emerald-500/20'
                    : 'glass-card border-slate-200 dark:border-slate-800'
                }`}>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                    <span className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                      New Tax Regime
                      {indiaTaxResults.betterRegime === 'new' && (
                        <span className="px-2 py-0.5 text-[10px] bg-emerald-600 text-white rounded-full font-bold">
                          Recommended
                        </span>
                      )}
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold">Budget 2025</span>
                  </div>

                  <div className="mt-4 space-y-3">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Annual Tax</span>
                      <span className="text-3xl font-black text-slate-900 dark:text-white font-mono">
                        ₹{indiaTaxResults.newTotalTax.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="p-3 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/50 dark:border-slate-800/50 space-y-1.5 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Monthly In-Hand</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                          ₹{indiaTaxResults.newMonthlyInHand.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Standard Deduction</span>
                        <span className="font-bold">₹75,000</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Sec 87A Rebate</span>
                        <span className="font-bold text-indigo-600">
                          {indiaTaxResults.newRebate87A > 0 ? `₹${indiaTaxResults.newRebate87A.toLocaleString('en-IN')} (Full Nil)` : '₹0'}
                        </span>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Standard deduction is ₹75,000 for salaried employees. Tax is 0% up to ₹12 Lakhs income with full Section 87A rebate!
                    </p>
                  </div>
                </div>

                {/* Old Tax Regime Card */}
                <div className={`p-6 rounded-3xl border transition-all ${
                  indiaTaxResults.betterRegime === 'old'
                    ? 'border-indigo-500 bg-indigo-50/20 dark:bg-indigo-950/20 ring-2 ring-indigo-500/20'
                    : 'glass-card border-slate-200 dark:border-slate-800'
                }`}>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                    <span className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                      Old Tax Regime
                      {indiaTaxResults.betterRegime === 'old' && (
                        <span className="px-2 py-0.5 text-[10px] bg-indigo-600 text-white rounded-full font-bold">
                          Recommended
                        </span>
                      )}
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold">With Deductions</span>
                  </div>

                  <div className="mt-4 space-y-3">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Annual Tax</span>
                      <span className="text-3xl font-black text-slate-900 dark:text-white font-mono">
                        ₹{indiaTaxResults.oldTotalTax.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="p-3 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/50 dark:border-slate-800/50 space-y-1.5 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Monthly In-Hand</span>
                        <span className="font-bold text-indigo-600 dark:text-indigo-400 font-mono">
                          ₹{indiaTaxResults.oldMonthlyInHand.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Standard Deduction</span>
                        <span className="font-bold">₹50,000</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Total Deductions</span>
                        <span className="font-bold text-indigo-600">
                          ₹{indiaTaxResults.totalOldDeductions.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Allows chapter VI-A deductions including 80C, 80D, HRA rent, and Section 24b home loan interest.
                    </p>
                  </div>
                </div>
              </div>

              {/* Slabs breakdown for New Regime */}
              <div className="glass-card p-5 rounded-3xl space-y-3">
                <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Table className="w-3.5 h-3.5 text-indigo-500" />
                  New Tax Regime Slab Breakdown (Budget 2025-26)
                </span>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold text-[11px]">
                        <th className="py-1">Tax Slab</th>
                        <th className="py-1">Tax Rate</th>
                        <th className="py-1">Taxable Amount</th>
                        <th className="py-1 text-right">Tax Payable</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                      {indiaTaxResults.newTierBreakdown.map((t, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                          <td className="py-2 font-medium text-slate-700 dark:text-slate-300">{t.slab}</td>
                          <td className="py-2 font-bold text-indigo-600">{t.rate}%</td>
                          <td className="py-2 text-slate-600 dark:text-slate-400">₹{t.taxable.toLocaleString('en-IN')}</td>
                          <td className="py-2 text-right font-bold text-slate-900 dark:text-white">₹{t.tax.toLocaleString('en-IN')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
