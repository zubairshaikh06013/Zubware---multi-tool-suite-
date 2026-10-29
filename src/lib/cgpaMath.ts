// A conversion rule must come from the student's own grading scheme.
export function convertGrade(value: number, direction: 'to-percent' | 'to-cgpa', scale: number, multiplier: number, offset: number): number | null {
  if (![value, scale, multiplier, offset].every(Number.isFinite) || scale <= 0 || multiplier <= 0) return null;
  const result = direction === 'to-percent' ? value * multiplier + offset : (value - offset) / multiplier;
  const inputMax = direction === 'to-percent' ? scale : 100;
  const resultMax = direction === 'to-percent' ? 100 : scale;
  return value >= 0 && value <= inputMax && result >= 0 && result <= resultMax ? result : null;
}

export function weightedCgpa(rows: { gpa: number; credits: number }[], scale: number): number | null {
  if (!rows.length || rows.some(row => !Number.isFinite(row.gpa) || !Number.isFinite(row.credits) || row.gpa < 0 || row.gpa > scale || row.credits <= 0)) return null;
  const credits = rows.reduce((sum, row) => sum + row.credits, 0);
  return rows.reduce((sum, row) => sum + row.gpa * row.credits, 0) / credits;
}
