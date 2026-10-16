/** Historical filename retained for compatibility. This is an inventory, not a functional test. */
import fs from 'node:fs';
const mapping = JSON.parse(fs.readFileSync('scripts/groupA50Mapping.json', 'utf8'));
const results = mapping.map((tool: { id: string; resolved: string }, index: number) => ({
  num: index + 1,
  id: tool.id,
  source: tool.resolved,
  sourceExists: fs.existsSync(tool.resolved),
  functionalStatus: 'not_tested_by_this_script'
}));
fs.writeFileSync('scripts/groupA50AuditResults.json', JSON.stringify(results, null, 2) + '\n');
console.log(`Static inventory: ${results.filter((r: { sourceExists: boolean }) => r.sourceExists).length}/${mapping.length} source files found. No input/output or browser behavior tested.`);
if (results.some((r: { sourceExists: boolean }) => !r.sourceExists)) process.exitCode = 1;
