// Zubware birthday-boundary benchmark v1. Original data and code: CC0-1.0.
// Run: node generate.mjs [output-directory]. Requires Node.js 18+.
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
const out = process.argv[2] || '.';
fs.mkdirSync(out, { recursive: true });
const DAY = 86400000;
const leap = y => y % 4 === 0 && (y % 100 !== 0 || y % 400 === 0);
const daysInMonth = (y, m) => [31, leap(y) ? 29 : 28, 31,30,31,30,31,31,30,31,30,31][m - 1];
const date = (y,m,d) => Date.UTC(y,m-1,d);
const iso = ms => new Date(ms).toISOString().slice(0,10);
const groups = {};
let births = 0, rows = 0;
const lines = ['birth_date,target_date,anniversary_age,offset_days,completed_years,total_days,floor_days_div_365,floor_days_div_365_25'];
for (let y=1980; y<=1999; y++) for (let m=1; m<=12; m++) for (let d=1; d<=daysInMonth(y,m); d++) {
  births++;
  for (const age of [1,18,25,60]) for (const offset of [-1,0,1]) {
    const anniversary = date(y+age,m,Math.min(d,daysInMonth(y+age,m)));
    const target = anniversary + offset*DAY;
    // Reference is the selected anniversary boundary, independent of any age library.
    const expected = age + (offset < 0 ? -1 : 0);
    const totalDays = (target-date(y,m,d))/DAY;
    const a = Math.floor(totalDays/365), b = Math.floor(totalDays/365.25);
    const key = `${age}:${offset}`;
    const g = groups[key] ||= { anniversaryAge:age, offsetDays:offset, rows:0, mismatches365:0, mismatches365_25:0 };
    g.rows++; g.mismatches365 += Number(a!==expected); g.mismatches365_25 += Number(b!==expected);
    lines.push([iso(date(y,m,d)),iso(target),age,offset,expected,totalDays,a,b].join(',')); rows++;
  }
}
const csv = lines.join('\n')+'\n';
const summary = {
  version:1, published:'2026-11-19', license:'CC0-1.0',
  birthDateRange:['1980-01-01','1999-12-31'], anniversaryAges:[1,18,25,60], offsetDays:[-1,0,1],
  convention:'Gregorian date-only completed years; February 29 anniversary clamped to February 28 in non-leap years; starting day excluded.',
  limitations:'Synthetic birthday-boundary sample, deliberately not representative of ordinary date pairs, people, or calculator websites. No third-party calculator was tested. Not legal eligibility advice.',
  birthDates:births, rows,
  mismatches365:Object.values(groups).reduce((n,g)=>n+g.mismatches365,0),
  mismatches365_25:Object.values(groups).reduce((n,g)=>n+g.mismatches365_25,0),
  csvSha256:createHash('sha256').update(csv).digest('hex'), groups:Object.values(groups)
};
fs.writeFileSync(path.join(out,'birthday-boundary-benchmark.csv'),csv);
fs.writeFileSync(path.join(out,'summary.json'),JSON.stringify(summary,null,2)+'\n');
console.log(JSON.stringify(summary,null,2));
