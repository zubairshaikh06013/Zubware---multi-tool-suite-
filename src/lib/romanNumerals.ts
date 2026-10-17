  const romanMap: [number, string][] = [
    [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'],
    [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'],
    [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']
  ];

export const numberToRoman = (num: number): { roman: string; breakdown: string[] } => {
    if (!Number.isInteger(num) || num < 1 || num > 3999999) {
      return { roman: 'Invalid (Enter 1 to 3,999,999)', breakdown: [] };
    }

    let n = num;
    let result = '';
    let breakdown: string[] = [];

    for (let [val, symbol] of romanMap) {
      while (n >= val) {
        result += symbol;
        breakdown.push(`${symbol} = ${val}`);
        n -= val;
      }
    }

    return { roman: result, breakdown };
  };

export const romanToNumber = (romanStr: string): { num: number; valid: boolean } => {
    const str = romanStr.toUpperCase().trim();
    if (!str || str.length > 4015 || !/^M*(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/.test(str)) return { num: 0, valid: false };

    const romanValues: { [key: string]: number } = {
      I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000
    };

    let total = 0;
    let prev = 0;

    for (let i = str.length - 1; i >= 0; i--) {
      const char = str[i];
      const val = romanValues[char];
      if (!val) return { num: 0, valid: false };

      if (val < prev) {
        total -= val;
      } else {
        total += val;
      }
      prev = val;
    }

    return { num: total, valid: total > 0 && total <= 3999999 };
  };

