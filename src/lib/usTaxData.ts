export type FilingStatus = 'single' | 'married_joint' | 'married_separate' | 'head_of_household';
export type UsTaxYear = '2026' | '2025' | '2024';

export interface TaxBracket {
  rate: number;
  upTo: number;
}

// 2026 Official Tax Brackets: https://www.irs.gov/irb/2025-45_IRB
export const BRACKETS_2026: Record<FilingStatus, TaxBracket[]> = {
  single: [
    { rate: 0.1, upTo: 12400 },
    { rate: 0.12, upTo: 50400 },
    { rate: 0.22, upTo: 105700 },
    { rate: 0.24, upTo: 201775 },
    { rate: 0.32, upTo: 256225 },
    { rate: 0.35, upTo: 640600 },
    { rate: 0.37, upTo: Infinity }
  ],
  married_joint: [
    { rate: 0.1, upTo: 24800 },
    { rate: 0.12, upTo: 100800 },
    { rate: 0.22, upTo: 211400 },
    { rate: 0.24, upTo: 403550 },
    { rate: 0.32, upTo: 512450 },
    { rate: 0.35, upTo: 768700 },
    { rate: 0.37, upTo: Infinity }
  ],
  married_separate: [
    { rate: 0.1, upTo: 12400 },
    { rate: 0.12, upTo: 50400 },
    { rate: 0.22, upTo: 105700 },
    { rate: 0.24, upTo: 201775 },
    { rate: 0.32, upTo: 256225 },
    { rate: 0.35, upTo: 384350 },
    { rate: 0.37, upTo: Infinity }
  ],
  head_of_household: [
    { rate: 0.1, upTo: 17700 },
    { rate: 0.12, upTo: 67450 },
    { rate: 0.22, upTo: 105700 },
    { rate: 0.24, upTo: 201750 },
    { rate: 0.32, upTo: 256200 },
    { rate: 0.35, upTo: 640600 },
    { rate: 0.37, upTo: Infinity }
  ]
};

export const STANDARD_DEDUCTION_2026: Record<FilingStatus, number> = {
  single: 16100,
  married_joint: 32200,
  married_separate: 16100,
  head_of_household: 24150
};

// 2025 Official IRS Federal Tax Brackets (Rev. Proc. 2024-40)
export const BRACKETS_2025: Record<FilingStatus, TaxBracket[]> = {
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

export const STANDARD_DEDUCTION_2025: Record<FilingStatus, number> = {
  single: 15750,
  married_joint: 31500,
  married_separate: 15750,
  head_of_household: 23625
};

// 2024 Reference Tax Brackets
export const BRACKETS_2024: Record<FilingStatus, TaxBracket[]> = {
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

export const STANDARD_DEDUCTION_2024: Record<FilingStatus, number> = {
  single: 14600,
  married_joint: 29200,
  married_separate: 14600,
  head_of_household: 21900
};

// Social Security Wage Base caps
export const SS_WAGE_CAPS: Record<UsTaxYear, number> = {
  '2026': 184500,
  '2025': 176100,
  '2024': 168600
};


export function calculateFederalTax(taxableIncome: number, brackets: TaxBracket[]) {
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
}
