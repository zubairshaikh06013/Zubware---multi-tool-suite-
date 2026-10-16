const DAY_MS = 86400000;
const utcDay = (date: Date) => {
  const result = new Date(0);
  result.setUTCFullYear(date.getFullYear(), date.getMonth(), date.getDate());
  result.setUTCHours(0, 0, 0, 0);
  return result.getTime() / DAY_MS;
};

/** Clamp month-end anniversaries to the last day of the destination month. */
export function calendarAnniversary(birth: Date, year: number, month = birth.getMonth()): Date {
  const end = new Date(0);
  end.setFullYear(year, month + 1, 0);
  end.setHours(0, 0, 0, 0);
  const result = new Date(0);
  result.setFullYear(year, month, Math.min(birth.getDate(), end.getDate()));
  result.setHours(0, 0, 0, 0);
  return result;
}

export function calendarAge(birth: Date, target: Date) {
  if (!Number.isFinite(birth.getTime()) || !Number.isFinite(target.getTime()) || utcDay(birth) > utcDay(target)) return null;
  let totalMonths = (target.getFullYear() - birth.getFullYear()) * 12 + target.getMonth() - birth.getMonth();
  let anchor = calendarAnniversary(birth, birth.getFullYear(), birth.getMonth() + totalMonths);
  if (utcDay(anchor) > utcDay(target)) {
    totalMonths--;
    anchor = calendarAnniversary(birth, birth.getFullYear(), birth.getMonth() + totalMonths);
  }
  return {
    years: Math.floor(totalMonths / 12),
    months: totalMonths % 12,
    days: utcDay(target) - utcDay(anchor),
    totalDays: utcDay(target) - utcDay(birth),
  };
}
