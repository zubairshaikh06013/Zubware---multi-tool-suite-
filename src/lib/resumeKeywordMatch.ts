/** Match complete skill names, preserving punctuation in Node.js, CI/CD, C++, etc. */
export function hasResumeKeyword(text: string, keyword: string): boolean {
  const normalized = keyword.normalize('NFKC').trim();
  if (!normalized) return false;
  const escaped = normalized.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\s+');
  return new RegExp(`(?<![\\p{L}\\p{N}_+#])${escaped}(?![\\p{L}\\p{N}_+#])`, 'iu').test(text.normalize('NFKC'));
}

export function resumeWordCount(text: string): number {
  return text.trim().split(/\s+/u).filter(Boolean).length;
}
