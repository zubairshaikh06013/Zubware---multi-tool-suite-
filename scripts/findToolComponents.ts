import * as fs from 'fs';
import * as path from 'path';

const targetIds = [
  'contrast-checker',
  'qr-business-card-generator',
  'unit-converter',
  'percentage-calculator',
  'emi-calculator',
  'discount-calculator',
  'currency-calculator',
  'loan-calculator',
  'roi-calculator',
  'compound-interest-calculator',
  'countdown-calculator',
  'online-stopwatch',
  'countdown-timer',
  'online-clock',
  'time-zone-converter',
  'cement-calculator',
  'random-letter-generator',
  'qr-code-safety-checker',
  'typing-speed-test',
  'file-checksum-verifier',
  'passphrase-generator',
  'password-strength-checker',
  'text-encrypt-decrypt'
];

const appContent = fs.readFileSync('src/App.tsx', 'utf8');

// Find component name for each id in App.tsx
targetIds.forEach(id => {
  const lines = appContent.split('\n');
  const matchLine = lines.find(l => l.includes(`'${id}':`) || l.includes(`"${id}":`));
  console.log(`[${id}] -> ${matchLine ? matchLine.trim() : 'NOT FOUND IN APP.TSX'}`);
});
