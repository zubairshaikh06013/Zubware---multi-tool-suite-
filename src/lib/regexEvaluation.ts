export interface RegexMatch { match: string; index: number; groups: (string | undefined)[] }
export interface RegexResult { matches: RegexMatch[]; error: string | null; truncated: boolean }
// Call in a terminable worker: a match limit cannot interrupt one expensive RegExp.exec call.
export function evaluateRegex(pattern: string, flags: string, text: string): RegexResult {
  if (!pattern) return { matches: [], error: null, truncated: false };
  try {
    const regex = new RegExp(pattern, flags);
    const matches: RegexMatch[] = [];
    let match: RegExpExecArray | null;
    while ((match = regex.exec(text)) !== null) {
      if (matches.length === 1000) return { matches, error: null, truncated: true };
      matches.push({match: match[0], index: match.index, groups: match.slice(1)});
      if (!regex.global) break;
      if (match[0].length === 0) {
        const index = regex.lastIndex;
        // Advance by a whole code point with Unicode mode; otherwise a surrogate can loop forever.
        regex.lastIndex += regex.unicode && (text.codePointAt(index) ?? 0) > 0xffff ? 2 : 1;
      }
    }
    return {matches, error: null, truncated: false};
  } catch (error) {
    return {matches: [], error: error instanceof Error ? error.message : 'Invalid pattern.', truncated: false};
  }
}
