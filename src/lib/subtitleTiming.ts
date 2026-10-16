/** Round the complete duration before splitting units, including hour boundaries. */
export function formatSubtitleTimestamp(seconds: number, separator: ',' | '.'): string {
  const total = Math.max(0, Math.round((Number.isFinite(seconds) ? seconds : 0) * 1000));
  const hours = Math.floor(total / 3600000);
  const minutes = Math.floor(total / 60000) % 60;
  const secs = Math.floor(total / 1000) % 60;
  const ms = total % 1000;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}${separator}${String(ms).padStart(3, '0')}`;
}
