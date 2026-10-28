import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

// Regression checks for the A4 OMR layout configurations.
// These calculations mirror the renderer's page split and bubble sizing.
const source = readFileSync('src/components/tools/business/OmrSheetGeneratorTool.tsx', 'utf8');
assert.match(source, /Math\.ceil\(questionCount \/ 100\)/);
assert.match(source, /pageStart = 1, pageEnd = questionCount/);
assert.match(source, /n <= 9; n\+\+/);
assert.match(source, /Math\.max\(4, Math\.min\(10, rollNoDigits\)\)/);

const canvasWidth = 1240;
const contentWidth = canvasWidth - (36 + 15) * 2;
const startY = 400; // Conservative lower bound for header + numeric roll grid
const availableHeight = 1754 - startY - 110;
let checked = 0;
for (const count of [20, 50, 100, 150, 200]) {
  for (const options of [4, 5, 6]) {
    for (const requestedColumns of [1, 2, 3, 4]) {
      const pages = Math.ceil(count / 100);
      let covered = 0;
      for (let page = 0; page < pages; page++) {
        const pageQuestions = Math.min(100, count - page * 100);
        const maxColumns = options === 6 ? 2 : options === 5 ? 3 : 4;
        const columns = Math.min(maxColumns, Math.max(requestedColumns, Math.ceil(pageQuestions / 50)));
        const perCol = Math.ceil(pageQuestions / columns);
        const colWidth = (contentWidth - (columns - 1) * 20) / columns;
        const rowHeight = Math.min(26, (availableHeight - 24) / perCol);
        const radius = Math.max(3, Math.min(9, rowHeight * 0.32, (colWidth - 56) / (options * 2) - 2));
        const step = (colWidth - 56) / options;
        assert.ok(rowHeight >= 18, `Rows too dense: ${count}/${options}/${requestedColumns}`);
        assert.ok(2 * radius + 4 <= step, `Bubbles horizontally crowded: ${count}/${options}/${requestedColumns}`);
        assert.ok(2 * radius + 3 <= rowHeight, `Bubbles vertically crowded: ${count}/${options}/${requestedColumns}`);
        assert.ok(24 + perCol * rowHeight <= availableHeight + 0.001);
        covered += pageQuestions;
        checked++;
      }
      assert.equal(covered, count);
    }
  }
}

// PDF vectors and 300-DPI PNG must use the same A4 logical coordinate system.
// Catch accidental regressions that silently distort bubbles or text between formats.
assert.match(source, /const sx = doc\.internal\.pageSize\.getWidth\(\) \/ 1240/);
assert.match(source, /const sy = doc\.internal\.pageSize\.getHeight\(\) \/ 1754/);
assert.match(source, /doc\.setFontSize\(px \* sy\)/);
assert.match(source, /doc\.circle\(segment\.x \* sx, segment\.y \* sy, \(segment\.r \|\| 0\) \* sx, 'S'\)/);
assert.match(source, /printCanvas\.width = 2480/);
assert.match(source, /printCanvas\.height = 3508/);
assert.match(source, /printCtx\.scale\(2, 2\)/);
assert.match(source, /renderOmrCanvas\(\(page - 1\) \* 100 \+ 1, Math\.min\(questionCount, page \* 100\), printCtx\)/);
// The PNG canvas must use a predictable Arial-like font, matching vector PDF Helvetica.
assert.ok(!/ctx\.font = '[^']*px sans-serif'/.test(source), 'Canvas should not use platform-dependent generic fonts');
assert.match(source, /ctx\.font = 'bold 22px Arial, Helvetica, sans-serif'/);
assert.match(source, /doc\.setFont\('helvetica'/);
const a4Aspect = 210 / 297;
assert.ok(Math.abs(1240 / 1754 - a4Aspect) < 0.001);
assert.ok(Math.abs(2480 / 3508 - a4Aspect) < 0.001);

console.log(`OMR layout geometry: ${checked} page/configuration checks passed.`);
