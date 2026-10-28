const DAY_MS = 86400000;
export const calendarDay = (date: Date) => {
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
  if (!Number.isFinite(birth.getTime()) || !Number.isFinite(target.getTime()) || calendarDay(birth) > calendarDay(target)) return null;
  let totalMonths = (target.getFullYear() - birth.getFullYear()) * 12 + target.getMonth() - birth.getMonth();
  let anchor = calendarAnniversary(birth, birth.getFullYear(), birth.getMonth() + totalMonths);
  if (calendarDay(anchor) > calendarDay(target)) {
    totalMonths--;
    anchor = calendarAnniversary(birth, birth.getFullYear(), birth.getMonth() + totalMonths);
  }
  return {
    years: Math.floor(totalMonths / 12),
    months: totalMonths % 12,
    days: calendarDay(target) - calendarDay(anchor),
    totalDays: calendarDay(target) - calendarDay(birth),
  };
}

/** Birthday on or after a reference date, using the same leap-day convention as age. */
export function nextCalendarBirthday(birth: Date, reference: Date): Date | null {
  if (!Number.isFinite(birth.getTime()) || !Number.isFinite(reference.getTime())) return null;
  let birthday = calendarAnniversary(birth, Math.max(birth.getFullYear(), reference.getFullYear()));
  if (calendarDay(birthday) < calendarDay(reference)) {
    birthday = calendarAnniversary(birth, birthday.getFullYear() + 1);
  }
  return birthday;
}

/** Parse a date-only input without UTC conversion or JavaScript's 1900 offset. */
export function parseCalendarDate(value: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const [year, month, day] = value.split('-').map(Number);
  if (year < 1) return null;
  const date = new Date(0);
  date.setFullYear(year, month - 1, day);
  date.setHours(0, 0, 0, 0);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day ? date : null;
}
