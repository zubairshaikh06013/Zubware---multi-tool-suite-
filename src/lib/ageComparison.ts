import { calendarAge, parseCalendarDate } from './calendarAge';

/** Up to three date-only comparisons, preserving the user's input order. */
export function compareAgeDates(dob: string, dates: string[]) {
  const birth = parseCalendarDate(dob);
  return dates.slice(0, 3).map(value => {
    const date = parseCalendarDate(value);
    const age = birth && date ? calendarAge(birth, date) : null;
    const error = !value ? '' : !birth ? 'Enter a valid date of birth first.' : !date ? 'Enter a valid comparison date.' : !age ? 'Comparison date must be on or after birth.' : '';
    return { date: value, age, error };
  });
}
