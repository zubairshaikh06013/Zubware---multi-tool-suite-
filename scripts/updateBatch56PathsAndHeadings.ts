import * as fs from 'fs';
import * as path from 'path';

export const BATCH_5_6_HEADINGS: Record<string, string> = {
  'contrast-checker': 'How to Check WCAG Color Contrast Ratios for Web Accessibility',
  'qr-business-card-generator': 'How to Create a Contact vCard QR Business Card',
  'unit-converter': 'How to Convert Units Across Metric and Imperial Measurement Systems',
  'percentage-calculator': 'How to Calculate Percentages, Percentage Increase & Decrease, and Differences',
  'emi-calculator': 'How to Calculate Loan EMI, Total Interest, and Prepayment Savings',
  'discount-calculator': 'How to Calculate Discounted Sale Prices and Savings',
  'currency-calculator': 'How to Calculate Currency Conversions and Foreign Exchange Rates',
  'loan-calculator': 'How to Calculate Mortgage & Loan Amortization Schedules',
  'roi-calculator': 'How to Calculate Return on Investment (ROI), Profit Margins, and Markup',
  'compound-interest-calculator': 'How to Calculate Compound Interest Growth and Annualized CAGR',
  'countdown-calculator': 'How to Calculate Exact Days, Hours, and Time Remaining to an Event',
  'online-stopwatch': 'How to Time Splits and Record Laps with Millisecond Precision',
  'countdown-timer': 'How to Set a Countdown Timer with Custom Alarm Chimes and Notifications',
  'online-clock': 'How to Check Current Local Time and Synchronized World Clocks',
  'time-zone-converter': 'How to Convert Time Zones and Plan International Meetings',
  'cement-calculator': 'How to Calculate Concrete Volume, Cement Bags, Sand, and Gravel Quantities',
  'random-letter-generator': 'How to Pick Random Alphabet Letters with Custom Case and Filters',
  'qr-code-safety-checker': 'How to Scan and Inspect QR Codes for Malicious Links and Quishing Threats',
  'typing-speed-test': 'How to Measure Words Per Minute (WPM) and Keystroke Accuracy Online',
  'file-checksum-verifier': 'How to Calculate and Verify File Checksums (SHA-256, SHA-512, SHA-1, MD5)',
  'passphrase-generator': 'How to Generate Cryptographically Secure Diceware Passphrases',
  'password-strength-checker': 'How to Test Password Strength, Shannon Entropy, and Brute-Force Crack Time',
  'text-encrypt-decrypt': 'How to Encrypt and Decrypt Confidential Text with AES Symmetric Keys'
};

export const BATCH_5_6_INTROS: Record<string, string> = {
  'contrast-checker':
    'Zubware Contrast Checker calculates mathematically precise color contrast ratios between foreground text and background elements using the W3C sRGB relative luminance standard. Instantly evaluate WCAG 2.1 Level AA and Level AAA compliance across normal text, large headlines, and graphical user interface components with live visual card previews and complete browser privacy.',
  'qr-business-card-generator':
    'Zubware QR Business Card Generator creates standardized vCard 3.0 digital contact barcodes for print and mobile networking. Encode full names, job titles, companies, telephone numbers, emails, addresses, and websites into scannable QR symbols with customizable dimensions, error correction levels, and vector SVG and high-resolution PNG downloads without cloud tracking.',
  'unit-converter':
    'Zubware Unit Converter provides instantaneous two-way conversion across 7 core measurement categories: Length, Mass/Weight, Temperature, Volume, Area, Speed, and Digital Storage. Designed with high floating-point precision and standardized international conversion factors, all unit calculations run 100% locally in your browser with zero latency.',
  'percentage-calculator':
    'Zubware Percentage Calculator solves multi-scenario percentage math including finding percentages of values, calculating what percentage one number is of another, evaluating percentage increase and decrease, and compounding additions or discounts. Features clear step-by-step mathematical explanations and immediate client-side calculations.',
  'emi-calculator':
    'Zubware EMI Calculator computes equated monthly installments for home mortgages, auto loans, and personal loans using standard monthly reducing balance formulas. Input principal, annual interest rate, and tenure to evaluate monthly payments, total interest payable, annual amortization schedules, and interest saved through extra monthly prepayments.',
  'discount-calculator':
    'Zubware Discount Calculator determines final retail checkout prices and total monetary savings across percentage discounts, flat cash price drops, stacked coupons, and local sales tax rates. Switch between single product calculations and multi-item shopping cart breakdowns with instant local browser computation.',
  'currency-calculator':
    'Zubware Currency Calculator performs instantaneous fiat currency conversions across major international currencies including USD, EUR, GBP, INR, JPY, CAD, AUD, and AED. Features benchmark foreign exchange rates, custom bank spread adjustments, and instant reciprocal rate comparisons without external network latency or tracker cookies.',
  'loan-calculator':
    'Zubware Loan & Mortgage Calculator provides comprehensive financial amortization modeling for residential home loans, commercial mortgages, and fixed-rate borrowing. Analyze monthly principal and interest payments, total lifetime financing costs, and accelerated payoff schedules achieved through recurring extra principal contributions.',
  'roi-calculator':
    'Zubware ROI & Profit Margin Calculator analyzes commercial profitability across three dedicated financial modes: Gross Profit Margin vs Markup %, Return on Investment (ROI) %, and Break-Even Unit Volume Analysis. Compare revenue gains against cost outlays with mathematically rigorous formulas and complete client-side data privacy.',
  'compound-interest-calculator':
    'Zubware Compound Interest & CAGR Calculator models exponential long-term wealth accumulation and annualized investment returns. Simulate initial deposits with recurring monthly contributions across daily, monthly, quarterly, or annual compounding frequencies, or calculate exact historical Compound Annual Growth Rates (CAGR) without server logging.',
  'countdown-calculator':
    'Zubware Countdown Calculator measures exact remaining time until future deadlines, exams, holidays, and milestones, or calculates elapsed time since past events. Breaks down calendar intervals into days, hours, minutes, seconds, total weeks, and working business days with live real-time ticking and zero cloud storage.',
  'online-stopwatch':
    'Zubware Online Stopwatch delivers high-resolution millisecond timing powered by the browser\'s performance.now() engine and requestAnimationFrame. Features start, pause, resume, and split lap recording with automated fastest/slowest lap identification and one-click clipboard export for athletic and productivity training.',
  'countdown-timer':
    'Zubware Countdown Timer provides precision duration countdowns with quick presets (including a 25-minute Pomodoro study timer) and custom hour/minute/second configurations. Features local Web Audio API synthesized chime alerts, HTML5 desktop notifications, and distraction-free fullscreen presentation mode with 100% offline functionality.',
  'online-clock':
    'Zubware Online Clock & World Clock displays accurate local system time down to the second with 12-hour (AM/PM) and 24-hour military toggles, full date formatting, and local time zone detection. Add multiple global cities (London, New York, Tokyo, Sydney, Mumbai, Dubai) to monitor real-time international business hours with zero server tracking.',
  'time-zone-converter':
    'Zubware Time Zone Converter coordinates cross-border meetings and global schedules using the international IANA time zone database. Compare source times against multiple target cities, account for seasonal Daylight Saving Time (DST) shifts, highlight standard 9-to-5 working hour overlaps, and copy meeting invitations directly to your clipboard.',
  'cement-calculator':
    'Zubware Cement Concrete Calculator estimates volumetric concrete requirements and raw material batches for slabs, footings, retaining walls, and columns. Supports Metric and Imperial units, standard nominal mix ratios (M15, M20, M25), dry volume void coefficients (1.54 factor), and wastage contingency buffers with complete in-browser calculation.',
  'random-letter-generator':
    'Zubware Random Letter Generator draws randomized letters from the English alphabet for word games, classroom phonics, vocabulary drills, and creative prompts. Configure uppercase, lowercase, or mixed casing, filter by vowels or consonants, control duplicate sampling, and choose custom delimiters with instant client-side generation.',
  'qr-code-safety-checker':
    'Zubware QR Code Safety Checker inspects QR code payloads safely inside an isolated browser sandbox before you open links. Decode QR codes via image upload, device camera, or text input, and evaluate structural security flags including insecure protocols, IP hostnames, URL shorteners, and credential phishing indicators with zero cloud data transmission.',
  'typing-speed-test':
    'Zubware Typing Speed Test evaluates keyboarding proficiency across 15, 30, and 60-second typing assessments. Calculates Net WPM, Gross WPM, percentage accuracy, and error counts using standardized 5-character word metrics with live visual feedback, multiple practice passages, and zero server logging.',
  'file-checksum-verifier':
    'Zubware File Checksum Verifier validates file integrity and verifies software downloads against published hashes using the browser\'s native Web Crypto API. Calculate SHA-256, SHA-512, SHA-1, and MD5 digests for large installers and disk images directly in browser RAM without uploading a single byte to external servers.',
  'passphrase-generator':
    'Zubware Memorable Passphrase Generator creates strong, memorable multi-word passphrases using window.crypto.getRandomValues() CSPRNG entropy and a curated dictionary of clean English words. Customize word counts (3 to 8 words), separators, capitalization, numbers, and symbols while inspecting exact mathematical entropy bits with complete local privacy.',
  'password-strength-checker':
    'Zubware Password Strength Checker evaluates credential security in real-time through client-side heuristic inspection and Shannon entropy analysis. Detect common keyboard sequences, dictionary words, and character pool vulnerabilities, and review estimated brute-force resistance against offline GPU cracking clusters with zero network transmission.',
  'text-encrypt-decrypt':
    'Zubware AES Text Encrypt & Decrypt provides client-side symmetric-key cryptography to secure confidential notes, messages, and credentials with a private secret key. Transform plaintext into clean Base64-encoded ciphertext or decrypt cipher payloads in local browser memory with zero tracking and zero server storage.'
};

function updateFile(filePath: string) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Update specificHeadings
  for (const [id, heading] of Object.entries(BATCH_5_6_HEADINGS)) {
    if (content.includes(`'${id}':`)) {
      // replace line
      const regex = new RegExp(`'${id}':\\s*'[^']*'`, 'g');
      content = content.replace(regex, `'${id}': '${heading.replace(/'/g, "\\'")}'`);
    } else {
      // insert before 'scientific-calculator': or at end of specificHeadings
      const anchor = content.includes("'scientific-calculator':")
        ? "    'scientific-calculator':"
        : "  };";
      content = content.replace(
        anchor,
        `    '${id}': '${heading.replace(/'/g, "\\'")}',\n${anchor}`
      );
    }
  }

  // Update priorityIntros
  for (const [id, intro] of Object.entries(BATCH_5_6_INTROS)) {
    if (content.includes(`'${id}':\n`)) {
      // already exists, replace value
      const regex = new RegExp(`'${id}':\\s*\\n\\s*'[^']*'`, 'g');
      content = content.replace(regex, `'${id}':\n      '${intro.replace(/'/g, "\\'")}'`);
    } else if (content.includes(`'${id}':`)) {
      const regex = new RegExp(`'${id}':\\s*'[^']*'`, 'g');
      content = content.replace(regex, `'${id}':\n      '${intro.replace(/'/g, "\\'")}'`);
    } else {
      // insert before 'scientific-calculator': or at end of priorityIntros
      const anchor = content.includes("'scientific-calculator':")
        ? "    'scientific-calculator':"
        : "  };";
      content = content.replace(
        anchor,
        `    '${id}':\n      '${intro.replace(/'/g, "\\'")}',\n${anchor}`
      );
    }
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${filePath}`);
}

updateFile(path.resolve('src/lib/paths.ts'));
updateFile(path.resolve('scripts/generateSeoAndSitemap.ts'));
