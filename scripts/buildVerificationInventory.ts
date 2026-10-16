import fs from 'node:fs';
import { TOOLS_DATA } from '../src/data/toolsData';
const evidence: Record<string, string[]> = {
  'csv-to-json': ['testDataConversions: multiline/quotes, identifiers, type inference, duplicate headers, record width, special property names'],
  'json-to-csv': ['testDataConversions: shared CSV serializer round-trip including CR/LF/quotes'],
  'csv-viewer': ['testDataConversions: shared parser/serializer fidelity; not every sort/filter interaction'],
  'number-to-words': ['testDataConversions: BigInt, invalid syntax, Indian grouping, decimal zeros, currency rounding'],
  'words-to-number': ['testDataConversions: valid cardinal phrases, negative decimals, invalid/unknown words and scale order'],
  'roman-numeral-converter': ['testDataConversions: canonical examples, invalid forms and exhaustive 1–3999 round-trip'],
  'regex-tester': ['testDataConversions: capture groups, Unicode zero-width advancement, invalid syntax, match cap; worker deadline requires browser test'],
  'pdf-to-word': ['testDataConversions: escaping literal markup in extracted text; full layout fidelity not certified'],
  'passphrase-generator': ['testToolReliability: unbiased sampling, actual wordlist integrity and entropy'],
  'random-password-generator': ['testToolReliability: empty/excluded pools and entropy'],
  'image-converter': ['testToolReliability: canvas MIME/failure handling; prior JPEG/PNG/corrupt-file browser fixtures'],
  'age-calculator': ['testSeoRegressions: calendar month-end/leap cases'],
  'us-income-tax-calculator': ['testSeoRegressions: selected official federal table examples; not all tax circumstances']
};
const inventory = TOOLS_DATA.map(t => ({id:t.id, path:t.path, name:t.navTitle, structuralCheck:'canonical page and incoming link validated by build',functionalEvidence:evidence[t.id]??[],functionalStatus:evidence[t.id]?'specific_regression_cases_only':'not_functionally_verified',allInputsAndDevicesVerified:false}));
for (const id of Object.keys(evidence)) if (!TOOLS_DATA.some(t=>t.id===id)) throw new Error(`Unknown tool id in evidence: ${id}`);
fs.writeFileSync('docs/TOOL_VERIFICATION_COVERAGE.json',JSON.stringify({scope:'Evidence inventory, not a claim of full functional verification',tools:inventory},null,2)+'\n');
console.log(`Recorded ${inventory.length} tools; ${Object.keys(evidence).length} have named regression evidence.`);
