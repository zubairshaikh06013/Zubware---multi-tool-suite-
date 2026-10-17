import assert from 'node:assert/strict';
import { hasNoindexRobotsMeta, extractCanonicalHrefs, extractNamedMetaContent } from './validateSeoBuild';
import { calendarAge, calendarAnniversary } from '../src/lib/calendarAge';
import { formatSubtitleTimestamp } from '../src/lib/subtitleTiming';
import { getRelatedTools, getMatchingGuidesForTool } from '../src/lib/workflowMap';
import { TOOLS_DATA } from '../src/data/toolsData';
import { BLOG_ARTICLES } from '../src/data/blogArticles';

for (const [html, expected] of [
  ['<meta name="robots" content="noindex,follow">', true],
  ['<meta content="noindex" name="robots">', true],
  ['<meta name="googlebot" content="NOINDEX, NOFOLLOW">', true],
  ['<meta name="robots" content="index,follow">', false],
  ['<meta name="description" content="noindex">', false],
  ['<p>noindex</p>', false],
] as const) assert.equal(hasNoindexRobotsMeta(html), expected, html);

assert.deepEqual(extractCanonicalHrefs('<link rel="canonical" href="https://www.zubware.com/age-calculator">'), ['https://www.zubware.com/age-calculator']);
assert.deepEqual(extractCanonicalHrefs("<link href='https://www.zubware.com/age-calculator' rel='CANONICAL'>"), ['https://www.zubware.com/age-calculator']);
assert.deepEqual(extractCanonicalHrefs('<link rel="alternate" href="/wrong"><link rel="canonical" href="/correct">'), ['/correct']);
assert.deepEqual(extractCanonicalHrefs('<link rel="canonical" href="/one"><link href="/two" rel="canonical">'), ['/one', '/two']);

assert.deepEqual(extractNamedMetaContent('<meta name="description" content="First description">', 'description'), ['First description']);
assert.deepEqual(extractNamedMetaContent("<meta content='Second description' name='DESCRIPTION'>", 'description'), ['Second description']);
assert.deepEqual(extractNamedMetaContent('<meta name="description" content="One"><meta content="Two" name="description">', 'description'), ['One', 'Two']);
assert.deepEqual(extractNamedMetaContent('<meta name="keywords" content="no description">', 'description'), []);
assert.equal(hasNoindexRobotsMeta('<meta content="index, follow" name="robots">'), false);

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
// Calendar arithmetic must remain correct across every month end, leap year and year boundary.
for (const year of [1900, 2000, 2024, 2025, 2026, 2100]) {
  for (let month = 0; month < 12; month++) {
    const monthEnd = new Date(year, month + 1, 0).getDate();
    for (const day of [1, 15, monthEnd]) {
      const birth = new Date(year, month, day);
      const sameDay = calendarAge(birth, birth);
      assert.deepEqual(sameDay && [sameDay.years, sameDay.months, sameDay.days, sameDay.totalDays], [0, 0, 0, 0]);
      const nextDay = new Date(year, month, day + 1);
      const ageNext = calendarAge(birth, nextDay);
      assert.ok(ageNext && ageNext.totalDays === 1 && ageNext.days === 1);
      const nextMonth = calendarAnniversary(birth, year, month + 1);
      const oneMonth = calendarAge(birth, nextMonth);
      assert.deepEqual(oneMonth && [oneMonth.years, oneMonth.months, oneMonth.days], [0, 1, 0]);
      const nextYear = calendarAnniversary(birth, year + 1);
      const oneYear = calendarAge(birth, nextYear);
      assert.deepEqual(oneYear && [oneYear.years, oneYear.months, oneYear.days], [1, 0, 0]);
    }
  }
}
assert.equal(calendarAge(new Date('invalid'), date('2026-01-01')), null);
assert.equal(calendarAge(date('2026-01-01'), new Date('invalid')), null);

assert.equal(calendarAge(date('2025-01-01'), date('2024-01-01')), null);
assert.equal(calendarAnniversary(date('2004-02-29'), 2025).getDate(), 28);
assert.equal(formatSubtitleTimestamp(59.9999, ','), '00:01:00,000');
assert.equal(formatSubtitleTimestamp(3600.125, '.'), '01:00:00.125');
assert.equal(formatSubtitleTimestamp(1.001, ','), '00:00:01,001');
assert.equal(formatSubtitleTimestamp(-1, '.'), '00:00:00.000');
const ageTool = TOOLS_DATA.find(t => t.id === 'age-calculator')!;
assert.match(ageTool.description, /date of birth/i, 'Age calculator description must explain its DOB input');
assert.match(ageTool.description, /years, months and days/i, 'Age calculator description must describe its exact-age output');
assert.ok(ageTool.tags.some(tag => /dob calculation/i.test(tag)), 'Age calculator should cover the observed DOB calculation query');
assert.ok(ageTool.tags.some(tag => /age calculator by date of birth/i.test(tag)), 'Age calculator should retain a specific date-of-birth search phrase');

assert.ok(getRelatedTools(ageTool, TOOLS_DATA).some(t => t.id === 'working-days-calculator'));
for (const sourceId of ['countdown-calculator', 'cat-age-calculator', 'working-days-calculator']) {
  const source = TOOLS_DATA.find(t => t.id === sourceId);
  assert.ok(source, `Missing contextual source tool: ${sourceId}`);
  assert.ok(getRelatedTools(source, TOOLS_DATA).some(t => t.id === 'age-calculator'), `${sourceId} must link to age calculator`);
}
assert.ok(!getRelatedTools(ageTool, TOOLS_DATA).some(t => t.id.includes('css') || t.id.includes('shadow')));
assert.ok(!getMatchingGuidesForTool(ageTool, BLOG_ARTICLES).some(a => a.slug.includes('pdf')));
for (const [sourceId, destinationId] of [
  ['json-to-csv', 'csv-to-json'],
  ['csv-to-json', 'json-to-csv'],
  ['csv-viewer', 'csv-to-json'],
  ['json-formatter', 'json-validator'],
  ['json-validator', 'json-to-csv'],
] as const) {
  const source = TOOLS_DATA.find(t => t.id === sourceId);
  assert.ok(source, `Missing source tool: ${sourceId}`);
  assert.ok(TOOLS_DATA.some(t => t.id === destinationId), `Missing destination tool: ${destinationId}`);
  assert.ok(getRelatedTools(source, TOOLS_DATA).some(t => t.id === destinationId), `${sourceId} must link to ${destinationId}`);
}
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
