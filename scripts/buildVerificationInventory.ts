import fs from 'node:fs';
import { TOOLS_DATA } from '../src/data/toolsData';
const evidence: Record<string, string[]> = {
  'signature-resizer': ['testSignatureExport: stale callback cancellation and preview URL cleanup', 'testSignatureAppearance: real canvas proportions, ink/paper pixel handling; not full browser coverage'],
  'photo-signature-joiner': ['testCompositeImageExport: JPEG/PNG decoding, fixed dimensions, byte limits and failures', 'testPhotoFrame: crop bounds, aspect ratio and real pixel selection; not full browser coverage'],
  'ats-resume-checker': ['testResumeKeywords: whole-skill matching, punctuation and word counts; not employer ATS validation'],
  'gst-invoice-generator': ['testInvoiceWorkspace: backup validation, payment balance/QR payload, page coverage and paise carry', 'testInvoiceCanvas: visible and centred label glyphs at 1x/2x/3x; not a mobile browser export test'],
  'image-compressor': ['testToolReliability: original preservation, MIME and target-size result selection; not every browser codec'],
  'image-resizer': ['testToolReliability: dimensions, aspect ratios, rounding and memory limits'],
  'crop-image': ['testToolReliability: crop bounds, edge clamps and extreme-aspect presets'],
  'image-splitter-merger': ['testToolReliability: alpha bounds, gap-free split rectangles, combine layouts and seam positions'],
  'image-watermark': ['testToolReliability: placement, rotated corners and oversized-logo bounds'],
  'favicon-generator': ['testToolReliability: real ICO structure, complete ZIP entries, manifest/HTML targets and invalid input'],
  'exif-remover': ['testToolReliability: alpha-safe export format, unique ZIP filenames and payloads; metadata removal still needs output inspection'],

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
