import * as fs from 'fs';

const tools = [
  { id: 'contrast-checker', path: 'src/components/tools/design/ContrastCheckerTool.tsx' },
  { id: 'qr-business-card-generator', path: 'src/components/tools/design/QrBusinessCardGeneratorTool.tsx' },
  { id: 'unit-converter', path: 'src/components/tools/design/UnitConverterTool.tsx' },
  { id: 'percentage-calculator', path: 'src/components/tools/design/PercentageCalculatorTool.tsx' },
  { id: 'emi-calculator', path: 'src/components/tools/design/EmiCalculatorTool.tsx' },
  { id: 'discount-calculator', path: 'src/components/tools/design/DiscountCalculatorTool.tsx' },
  { id: 'currency-calculator', path: 'src/components/tools/design/CurrencyCalculatorTool.tsx' },
  { id: 'loan-calculator', path: 'src/components/tools/business/LoanMortgageCalculatorTool.tsx' },
  { id: 'roi-calculator', path: 'src/components/tools/business/RoiProfitMarginCalculatorTool.tsx' },
  { id: 'compound-interest-calculator', path: 'src/components/tools/business/CompoundInterestCalculatorTool.tsx' },
  { id: 'countdown-calculator', path: 'src/components/tools/design/CountdownCalculatorTool.tsx' },
  { id: 'online-stopwatch', path: 'src/components/tools/security/StopwatchTool.tsx' },
  { id: 'countdown-timer', path: 'src/components/tools/security/CountdownTimerTool.tsx' },
  { id: 'online-clock', path: 'src/components/tools/design/OnlineClockTool.tsx' },
  { id: 'time-zone-converter', path: 'src/components/tools/design/TimeZoneConverterTool.tsx' },
  { id: 'cement-calculator', path: 'src/components/tools/design/CementCalculatorTool.tsx' },
  { id: 'random-letter-generator', path: 'src/components/tools/design/RandomLetterGeneratorTool.tsx' },
  { id: 'qr-code-safety-checker', path: 'src/components/tools/security/QrCodeSafetyCheckerTool.tsx' },
  { id: 'typing-speed-test', path: 'src/components/tools/typing/TypingSpeedTestTool.tsx' },
  { id: 'file-checksum-verifier', path: 'src/components/tools/security/FileChecksumVerifierTool.tsx' },
  { id: 'passphrase-generator', path: 'src/components/tools/security/PassphraseGeneratorTool.tsx' },
  { id: 'password-strength-checker', path: 'src/components/tools/security/PasswordStrengthCheckerTool.tsx' },
  { id: 'text-encrypt-decrypt', path: 'src/components/tools/security/TextEncryptDecryptTool.tsx' }
];

tools.forEach(t => {
  if (!fs.existsSync(t.path)) {
    console.log(`[${t.id}] FILE NOT FOUND: ${t.path}`);
    return;
  }
  const content = fs.readFileSync(t.path, 'utf8');
  console.log(`=== ${t.id} (${content.split('\n').length} lines) ===`);
  const lines = content.split('\n');
  // Check main features, state, calculations
  const states = lines.filter(l => l.includes('useState') || l.includes('function ') || l.includes('const calculate') || l.includes('crypto.'));
  console.log('Sample key logic/state:', states.slice(0, 6).map(s => s.trim()).join(' | '));
});
