import assert from 'node:assert/strict';
import { calendarAge, calendarAnniversary } from '../src/lib/calendarAge';
import { formatSubtitleTimestamp } from '../src/lib/subtitleTiming';
import { getRelatedTools, getMatchingGuidesForTool } from '../src/lib/workflowMap';
import { TOOLS_DATA } from '../src/data/toolsData';
import { BLOG_ARTICLES } from '../src/data/blogArticles';

const date = (value: string) => new Date(`${value}T00:00:00`);
for (const [birth, target, expected] of [
  ['2000-01-31', '2026-03-01', [26, 1, 1]],
  ['2000-01-01', '2025-01-01', [25, 0, 0]],
  ['2004-02-29', '2025-02-28', [21, 0, 0]],
  ['2024-01-31', '2024-02-29', [0, 1, 0]],
  ['2024-03-09', '2024-03-11', [0, 0, 2]],
  ['1995-05-15', '2024-10-20', [29, 5, 5]],
] as const) {
  const age = calendarAge(date(birth), date(target));
  assert.ok(age);
  assert.deepEqual([age.years, age.months, age.days], expected, `${birth} to ${target}`);
}
assert.equal(calendarAge(date('2025-01-01'), date('2024-01-01')), null);
assert.equal(calendarAnniversary(date('2004-02-29'), 2025).getDate(), 28);
assert.equal(formatSubtitleTimestamp(59.9999, ','), '00:01:00,000');
assert.equal(formatSubtitleTimestamp(3600.125, '.'), '01:00:00.125');
assert.equal(formatSubtitleTimestamp(1.001, ','), '00:00:01,001');
assert.equal(formatSubtitleTimestamp(-1, '.'), '00:00:00.000');
const ageTool = TOOLS_DATA.find(t => t.id === 'age-calculator')!;
assert.ok(getRelatedTools(ageTool, TOOLS_DATA).some(t => t.id === 'working-days-calculator'));
assert.ok(!getRelatedTools(ageTool, TOOLS_DATA).some(t => t.id.includes('css') || t.id.includes('shadow')));
assert.ok(!getMatchingGuidesForTool(ageTool, BLOG_ARTICLES).some(a => a.slug.includes('pdf')));
for (const tool of TOOLS_DATA) {
  const related = getRelatedTools(tool, TOOLS_DATA);
  assert.ok(related.length <= 6 && !related.some(t => t.id === tool.id));
  assert.equal(new Set(related.map(t => t.id)).size, related.length);
}
console.log('Calendar, subtitle, and related-link regressions passed for all tool mappings.');

// Independent expected amounts from IRS Rev. Proc. 2025-32 tax tables.
const { BRACKETS_2026, STANDARD_DEDUCTION_2025, STANDARD_DEDUCTION_2026, SS_WAGE_CAPS, calculateFederalTax } = await import('../src/lib/usTaxData');
for (const [status, income, expected] of [
  ['single', 50400, 5800], ['single', 105700, 17966],
  ['married_joint', 211400, 35932], ['head_of_household', 105700, 16155],
  ['head_of_household', 201750, 39207], ['married_separate', 384350, 103291.75],
] as const) assert.ok(Math.abs(calculateFederalTax(income, BRACKETS_2026[status]).federalTax - expected) < 0.01);
assert.equal(STANDARD_DEDUCTION_2025.single, 15750);
assert.equal(STANDARD_DEDUCTION_2026.married_joint, 32200);
assert.equal(SS_WAGE_CAPS['2026'], 184500);
console.log('Official 2026 federal tax table regression examples passed.');
