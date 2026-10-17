const small = ['zero','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen'];
const tens = ['','','twenty','thirty','forty','fifty','sixty','seventy','eighty','ninety'];
const scales: [bigint, string][] = [[10n**18n,'quintillion'],[10n**15n,'quadrillion'],[10n**12n,'trillion'],[10n**9n,'billion'],[10n**6n,'million'],[1000n,'thousand']];
export type NumberSystem = 'international' | 'indian';
export type Currency = 'none' | 'usd' | 'inr' | 'eur' | 'gbp';
function integerWords(n: bigint, system: NumberSystem): string {
  if (n < 20n) return small[Number(n)];
  if (n < 100n) return tens[Number(n / 10n)] + (n % 10n ? '-' + small[Number(n % 10n)] : '');
  if (n < 1000n) return small[Number(n / 100n)] + ' hundred' + (n % 100n ? ' ' + integerWords(n % 100n, system) : '');
  const units: [bigint, string][] = system === 'indian' ? [[10000000n,'crore'],[100000n,'lakh'],[1000n,'thousand']] : scales;
  for (const [value, name] of units) if (n >= value) return integerWords(n / value, system) + ' ' + name + (n % value ? ' ' + integerWords(n % value, system) : '');
  throw new Error('Number is outside the supported range.');
}
export function formatNumberWords(input: string, system: NumberSystem = 'international', currency: Currency = 'none'): string {
  let raw = input.trim();
  if (raw.length > 150) return 'Please use at most 21 integer digits and 100 decimal digits.';
  // Accept conventional international or Indian comma grouping, never silently discard malformed punctuation.
  if (raw.includes(',')) {
    if (!/^[+-]?(?:\d{1,3}(?:,\d{3})+|\d{1,2}(?:,\d{2})*,\d{3})(?:\.\d*)?$/.test(raw)) return 'Please use valid comma grouping.';
    raw = raw.replace(/,/g, '');
  }
  if (!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(raw)) return 'Please enter a decimal number (not scientific notation or hexadecimal).';
  const negative = raw[0] === '-';
  const [whole = '0', fraction = ''] = raw.replace(/^[+-]/, '').split('.');
  let n = BigInt(whole || '0');
  if (n >= 10n**21n || fraction.length > 100) return 'Please use a number below 1 sextillion and at most 100 decimal digits.';
  if (currency === 'none') {
    const sign = negative && (n !== 0n || /[1-9]/.test(fraction)) ? 'minus ' : '';
    return sign + integerWords(n, system) + (fraction ? ' point ' + [...fraction].map(d => small[Number(d)]).join(' ') : '');
  }
  // Round decimal text to cents/paisa/pence without binary floating-point rounding errors.
  let cents = BigInt(fraction.padEnd(2,'0').slice(0,2));
  if (fraction.length > 2 && fraction[2] >= '5') cents++;
  if (cents === 100n) { n++; cents = 0n; }
  if (n >= 10n**21n) return 'Rounded amount is outside the supported range.';
  const names = {usd:['dollar','dollars','cent','cents'],eur:['euro','euros','cent','cents'],inr:['rupee','rupees','paisa','paise'],gbp:['pound','pounds','penny','pence']}[currency];
  return (negative && (n || cents) ? 'minus ' : '') + integerWords(n, system) + ' ' + names[n === 1n ? 0 : 1]
    + (cents ? ' and ' + integerWords(cents, system) + ' ' + names[cents === 1n ? 2 : 3] : ' only');
}

/** Deliberately accepts cardinal number phrases, not arbitrary prose or arithmetic expressions. */
export function parseWordsToNumber(input: string): { value: number; error: string | null } {
  const fail = (error: string) => ({value: 0, error});
  if (!input.trim()) return fail('Enter a number phrase.');
  if (input.length > 1000) return fail('Please use a shorter number phrase.');
  let text = input.toLowerCase().trim();
  const negative = /^(minus|negative)\s/.test(text);
  text = text.replace(/^(minus|negative)\s+/, '').replace(/-/g,' ').replace(/,/g,' ');
  const parts = text.split(/\b(?:point|decimal)\b/);
  if (parts.length > 2) return fail('Use only one decimal point.');
  const tokens = parts[0].trim().split(/\s+/).filter(Boolean);
  const units = Object.fromEntries(small.map((x,i)=>[x,i]));
  const tensMap = Object.fromEntries(tens.map((x,i)=>[x,i*10]).filter(([x])=>x));
  const large: Record<string,number> = {thousand:1000,lakh:100000,lakhs:100000,million:1000000,millions:1000000,crore:10000000,crores:10000000,billion:1000000000,billions:1000000000,trillion:1000000000000,trillions:1000000000000};
  const allowed = new Set([...Object.keys(units),...Object.keys(tensMap),...Object.keys(large),'hundred','and']);
  if (!tokens.length) return fail('Write zero before the decimal point.');
  for (const token of tokens) if (!allowed.has(token)) return fail(`Unrecognized number word: ${token}`);
  if (tokens[0] === 'and' || tokens[tokens.length-1] === 'and' || tokens.some((t,i)=>t==='and' && tokens[i-1]==='and')) return fail('Place "and" between number groups.');
  const words = tokens.filter(t=>t!=='and');
  function group(chunk: string[]): number | null {
    if (!chunk.length) return null;
    let n=0;
    const h=chunk.indexOf('hundred');
    if (h>=0) {
      if (h!==1 || !(units[chunk[0]]>=1 && units[chunk[0]]<=9) || chunk.lastIndexOf('hundred')!==h) return null;
      n=units[chunk[0]]*100;chunk=chunk.slice(2);
      if (!chunk.length)return n;
    }
    if (chunk.length===1 && units[chunk[0]]!==undefined)return n+units[chunk[0]];
    if (chunk.length===1 && tensMap[chunk[0]]!==undefined)return n+Number(tensMap[chunk[0]]);
    if (chunk.length===2 && tensMap[chunk[0]] && units[chunk[1]]>=1 && units[chunk[1]]<=9)return n+Number(tensMap[chunk[0]])+units[chunk[1]];
    return null;
  }
  let total=0, previousScale=Infinity, current: string[]=[];
  for (const word of words) {
    const scale=large[word];
    if (scale) {
      const value=group(current);
      if (value===null || value===0 || scale>=previousScale || value*scale>=previousScale) return fail('Use explicit number groups with scales in descending order, for example one million two thousand.');
      total+=value*scale;previousScale=scale;current=[];
    } else current.push(word);
  }
  if (current.length) {
    const value=group(current);
    if(value===null || value>=previousScale)return fail('Invalid number-word order. Use a phrase such as two hundred thirty five.');
    total+=value;
  }
  if (!Number.isSafeInteger(total))return fail('This phrase exceeds the exact integer range supported by this parser.');
  let digits='';
  if(parts.length===2) {
    const decimalWords=parts[1].trim().split(/\s+/);
    for (const word of decimalWords) {
      if(units[word]===undefined || units[word]>9)return fail('After point, spell each digit separately, for example zero five.');
      digits+=units[word];
    }
    if ((String(total)+digits).replace(/^0+/,'').length>15 || digits.length>15)return fail('Use at most 15 significant digits for a decimal result.');
  }
  const value=Number(String(total)+(digits?'.'+digits:''));
  return {value:negative?-value:value,error:null};
}
