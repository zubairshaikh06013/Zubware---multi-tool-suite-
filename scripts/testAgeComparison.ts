import assert from 'node:assert/strict';
import { compareAgeDates } from '../src/lib/ageComparison';
const rows = compareAgeDates('1997-05-13', ['2026-05-12', '2026-05-13', '2026-12-31']);
assert.deepEqual(rows.map(r => r.age && [r.age.years,r.age.months,r.age.days]), [[28,11,29],[29,0,0],[29,7,18]]);
assert.deepEqual(compareAgeDates('2004-02-29',['2025-02-28','2025-03-01']).map(r=>r.age?.years),[21,21]);
assert.deepEqual(compareAgeDates('2000-01-31',['2000-02-29','2000-03-01']).map(r=>r.age && [r.age.months,r.age.days]),[[1,0],[1,1]]);
assert.equal(compareAgeDates('2026-05-13',['2026-05-13'])[0].age?.totalDays,0);
for (const row of compareAgeDates('2026-05-13',['2026-05-12','2025-02-29','not-a-date'])) { assert.equal(row.age,null); assert.ok(row.error); }
assert.ok(compareAgeDates('', ['2026-01-01'])[0].error);
assert.equal(compareAgeDates('1997-05-13',[''])[0].error,'');
assert.equal(compareAgeDates('1997-05-13',Array(4).fill('2026-01-01')).length,3);
console.log('Age comparison birthday boundaries, month-end, leap-day, invalid and blank dates passed.');
