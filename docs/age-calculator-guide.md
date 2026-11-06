# Calculate age on a reference date

Use the free [Zubware Age Calculator](https://www.zubware.com/age-calculator) to calculate age from a full date of birth on today’s date or a date you choose. It shows completed years, months and remaining days separately from total elapsed days. You can compare the same DOB on three reference dates.

## Reproduce the birthday boundary

Open the calculator and choose **Try an example**, or enter these dates yourself. Dates below use YYYY-MM-DD.

| Date of birth | Reference date | Calendar age | Completed years |
|---|---|---|---|
| 1997-05-13 | 2026-05-12 | 28 years, 11 months, 29 days | 28 |
| 1997-05-13 | 2026-05-13 | 29 years, 0 months, 0 days | 29 |
| 1997-05-13 | 2026-12-31 | 29 years, 7 months, 18 days | 29 |

Completed years are not rounded up. The day before the birthday and the birthday itself give different completed-year values. A year subtraction alone misses that distinction.

## Calendar conventions

The calculator counts completed monthly anniversaries and then remaining calendar days. If an anniversary day is missing in a destination month, it uses the month’s last day. For example, January 31 to February 28 is one month in a non-leap year. February 29 birthdays use February 28 in non-leap years here.

The birth date counts as elapsed day zero. Hours, minutes and seconds are conversions from calendar days using 24 hours per day; they do not use a birth time or daylight-saving clock changes. A reference date before birth is rejected.

These conventions document this implementation. Organisations can use other conventions; the tool does not decide exam, admission or legal eligibility.

## Teaching and verification resources

- [Cutoff-date and completed-years guide](https://www.zubware.com/blog/calculate-age-on-cutoff-date)
- [Leap-year and month-end test cases, with reusable CSV](https://www.zubware.com/blog/age-calculator-leap-year-month-end-test-cases)
- [Calendar-age source](../src/lib/calendarAge.ts)
- [Three-date comparison tests](../scripts/testAgeComparison.ts)

The calculator processes entered dates in the browser. Copy Age Card includes the DOB and reference dates, so review that text before sharing it.

When reporting a calculation issue, include a reproducible example using fictional dates, the expected result and the convention being applied. Do not publish someone’s personal DOB in a bug report.
