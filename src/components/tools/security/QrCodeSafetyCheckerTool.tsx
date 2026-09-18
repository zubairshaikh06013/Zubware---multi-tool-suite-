import React, { useState, useRef, useEffect, useMemo } from 'react';
import jsQR from 'jsqr';
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  Camera,
  Upload,
  Clipboard,
  Copy,
  ExternalLink,
  RotateCcw,
  Check,
  AlertTriangle,
  Info,
  Lock,
  Unlock,
  Globe,
  Link as LinkIcon,
  HelpCircle,
  Eye,
  EyeOff,
  Sparkles,
  Smartphone,
  Wifi,
  Mail,
  Phone,
  MessageSquare,
  FileText,
  CreditCard,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Layers,
  Zap,
  RefreshCw,
  Sliders,
  Volume2,
  VolumeX,
  Languages
} from 'lucide-react';

interface QrCodeSafetyCheckerToolProps {
  onShowToast?: (message: string) => void;
}

// ----------------------------------------------------
// HEURISTIC DEFINITIONS & DATA
// ----------------------------------------------------

export type RuleSeverity = 'safe' | 'info' | 'warning' | 'danger';

export interface HeuristicResult {
  id: string;
  ruleNumber: number;
  title: string;
  titleHi: string;
  severity: RuleSeverity;
  penalty: number;
  description: string;
  descriptionHi: string;
  details?: string;
}

export type QRContentType = 'url' | 'upi' | 'wifi' | 'email' | 'tel' | 'sms' | 'text';

export interface DecodedQRData {
  raw: string;
  type: QRContentType;
  parsedUrl?: {
    urlObj?: URL;
    protocol: string;
    hostname: string;
    pathname: string;
    search: string;
    port: string;
    hasAuth: boolean;
    authUsername?: string;
  };
  parsedUpi?: {
    pa?: string; // Payee VPA
    pn?: string; // Payee Name
    am?: string; // Amount
    cu?: string; // Currency
    tn?: string; // Note
  };
  parsedWifi?: {
    ssid?: string;
    security?: string;
    password?: string;
    hidden?: boolean;
  };
  heuristics: HeuristicResult[];
  riskScore: number;
  verdict: 'safe' | 'suspicious' | 'danger';
}

// Known URL shorteners
const KNOWN_SHORTENERS = new Set([
  'bit.ly', 'tinyurl.com', 't.co', 'cutt.ly', 'is.gd', 'soo.gd',
  'shorturl.at', 'rebrand.ly', 'ow.ly', 'buff.ly', 'tiny.cc', 'lnkd.in',
  'rb.gy', 'qr.ae', 'v.gd', 'trib.al', 'ift.tt', 'bl.ink', 's.id',
  'rotf.lol', 'goo.gl', 'qrco.de', 'me-qr.com', 'linktr.ee', 'cutt.us',
  'bit.do', 'bc.vc', 'u.to', 'shorte.st', 'adfocus.rf.gd', 'short.io'
]);

// Phishing / Sensitive keywords
const SUSPICIOUS_KEYWORDS = [
  'login', 'signin', 'sign-in', 'verify', 'verification', 'account', 'update',
  'secure', 'security', 'password', 'credential', 'otp', 'kyc', 'wallet',
  'wallet-connect', 'payment', 'pay', 'bank', 'banking', 'confirm', 'confirmation',
  'unlock', 'suspended', 'suspension', 'recover', 'recovery', 'claim', 'reward',
  'bonus', 'prize', 'urgent', 'limited', 'invoice', 'refund', 'support',
  'authenticate', 'authentication', 'webmail', 'cpanel', 'billing', 'free-gift',
  'airdrop', 'payout', 'validate', 'validation', 'authorization', 'passcode'
];

// Commonly impersonated brands and their legitimate official root domains
const BRAND_DOMAINS: Record<string, string[]> = {
  paypal: ['paypal.com', 'paypal.me'],
  amazon: ['amazon.com', 'amazon.in', 'amazon.co.uk', 'amazon.de', 'amazon.ca', 'amazon.fr', 'amazon.co.jp', 'amzn.to'],
  google: ['google.com', 'google.co.in', 'google.co.uk', 'google.de', 'google.fr', 'goo.gle', 'google.org'],
  microsoft: ['microsoft.com', 'live.com', 'office.com', 'outlook.com', 'microsoftonline.com', 'msn.com'],
  apple: ['apple.com', 'icloud.com'],
  facebook: ['facebook.com', 'fb.com', 'fb.me'],
  instagram: ['instagram.com', 'instagr.am'],
  whatsapp: ['whatsapp.com', 'wa.me'],
  netflix: ['netflix.com'],
  flipkart: ['flipkart.com'],
  sbi: ['sbi.co.in', 'onlinesbi.sbi', 'statebankofindia.com'],
  hdfc: ['hdfcbank.com', 'hdfc.com'],
  icici: ['icicibank.com'],
  axis: ['axisbank.com'],
  phonepe: ['phonepe.com'],
  paytm: ['paytm.com'],
  razorpay: ['razorpay.com'],
  binance: ['binance.com'],
  coinbase: ['coinbase.com'],
  telegram: ['telegram.org', 't.me'],
  twitter: ['twitter.com', 'x.com'],
  meta: ['meta.com'],
  chase: ['chase.com'],
  wellsfargo: ['wellsfargo.com'],
  bankofamerica: ['bankofamerica.com'],
  uber: ['uber.com'],
  spotify: ['spotify.com']
};

// Lookalike / Typosquatting replacements dictionary (e.g., 0->o, 1->l, etc.)
const BRAND_TYPO_PATTERNS = [
  { brand: 'amazon', regex: /amaz[0o]n|arnazon|amazn/i },
  { brand: 'paypal', regex: /paypa[1l]|pay-pal|paypaI|paypol/i },
  { brand: 'google', regex: /g[0o][0o]gle|goog1e|googie/i },
  { brand: 'microsoft', regex: /micr[0o]s[0o]ft|micros0ft/i },
  { brand: 'apple', regex: /app[1l]e|app-le/i },
  { brand: 'facebook', regex: /faceb[0o][0o]k|face-book/i },
  { brand: 'instagram', regex: /[1i]nstagram|instagrarn|insta-gram/i },
  { brand: 'whatsapp', regex: /whats-?app|whatapp|whatsaap/i },
  { brand: 'netflix', regex: /netfl[1i]x|net-flix/i },
  { brand: 'flipkart', regex: /fl[1i]pkart|flip-kart/i },
  { brand: 'phonepe', regex: /ph[0o]nepe|phone-pe/i },
  { brand: 'paytm', regex: /pay-tm|payt-m/i },
  { brand: 'hdfc', regex: /hdfc-?bank|hdfc-update/i },
  { brand: 'sbi', regex: /sbi-?online|sbi-kyc|onlinesbi-update/i }
];

// Cyrillic / Greek homoglyphs commonly used in IDN spoofing
const HOMOGLYPH_REGEX = /[\u0400-\u04FF\u0370-\u03FF\u0500-\u052F]/;

// Standard web ports
const STANDARD_PORTS = new Set(['', '80', '443']);

// Preset test scenarios
const PRESET_SCENARIOS = [
  {
    name: 'Safe Website',
    nameHi: 'सुरक्षित वेबसाइट',
    badge: 'Safe',
    color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800',
    data: 'https://zubware.com/about.html'
  },
  {
    name: 'HTTP Login Form',
    nameHi: 'असुरक्षित HTTP लॉगिन',
    badge: 'Warning',
    color: 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-300 dark:border-amber-800',
    data: 'http://mybank-portal.example.com/login?redirect=dashboard'
  },
  {
    name: 'URL Shortener',
    nameHi: 'शॉर्टनर लिंक',
    badge: 'Suspicious',
    color: 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-300 dark:border-amber-800',
    data: 'https://bit.ly/claim-urgent-reward-2026'
  },
  {
    name: 'Raw IP Address',
    nameHi: 'रॉ आईपी पता',
    badge: 'Suspicious',
    color: 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-300 dark:border-rose-800',
    data: 'http://192.168.1.10:8080/secure/account-login'
  },
  {
    name: '@ User-Info Spoof',
    nameHi: '@ सिंबल धोखा',
    badge: 'High Risk',
    color: 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-300 dark:border-rose-800',
    data: 'https://paypal.com@evil-phishing-attacker.com/verification'
  },
  {
    name: 'Brand Typosquat',
    nameHi: 'ब्रांड नकल / फिशिंग',
    badge: 'High Risk',
    color: 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-300 dark:border-rose-800',
    data: 'https://amaz0n-security-kyc-verify.com/account/login'
  },
  {
    name: 'UPI Payment QR',
    nameHi: 'UPI पेमेंट कोड',
    badge: 'Payment',
    color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-300 dark:border-indigo-800',
    data: 'upi://pay?pa=store9981@okaxis&pn=DailyGroceries&am=450.00&cu=INR&tn=Invoice_9941'
  },
  {
    name: 'Plain Text Note',
    nameHi: 'सामान्य टेक्स्ट',
    badge: 'Text',
    color: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-300 dark:border-slate-700',
    data: 'WiFi Password for Conference Hall: SecureGuest2026!'
  }
];

// Helper: Synthesize short audio beep for scan confirmation
const playScanChime = () => {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime); // A5
    osc.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.12); // E6
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.18);
  } catch {
    // Ignore audio autoplay restrictions
  }
};

// ----------------------------------------------------
// LOCAL HEURISTIC ANALYSIS ENGINE
// ----------------------------------------------------

export function analyzeDecodedContent(rawInput: string): DecodedQRData {
  const trimmed = rawInput.trim();

  // 1. Check for UPI / Payment Links
  if (trimmed.toLowerCase().startsWith('upi://pay') || trimmed.toLowerCase().startsWith('paytmmp://pay')) {
    const heuristics: HeuristicResult[] = [];
    let pa = '';
    let pn = '';
    let am = '';
    let cu = 'INR';
    let tn = '';

    try {
      const url = new URL(trimmed);
      pa = url.searchParams.get('pa') || '';
      pn = url.searchParams.get('pn') || '';
      am = url.searchParams.get('am') || '';
      cu = url.searchParams.get('cu') || 'INR';
      tn = url.searchParams.get('tn') || '';
    } catch {
      // Manual parse fallback
      const queryPart = trimmed.split('?')[1] || '';
      const params = new URLSearchParams(queryPart);
      pa = params.get('pa') || '';
      pn = params.get('pn') || '';
      am = params.get('am') || '';
      cu = params.get('cu') || 'INR';
      tn = params.get('tn') || '';
    }

    heuristics.push({
      id: 'upi-detection',
      ruleNumber: 0,
      title: 'UPI / Payment Protocol Detected',
      titleHi: 'UPI / पेमेंट प्रोटोकॉल का पता चला',
      severity: 'info',
      penalty: 0,
      description: 'This QR code contains a direct payment instruction (UPI URI).',
      descriptionHi: 'इस क्यूआर कोड में प्रत्यक्ष भुगतान निर्देश (UPI) शामिल है।',
      details: pa ? `Payee VPA: ${pa} | Merchant/Name: ${pn || 'Not specified'}` : undefined
    });

    heuristics.push({
      id: 'upi-pin-warning',
      ruleNumber: 0,
      title: 'Crucial Security Reminder: PIN Safety',
      titleHi: 'महत्वपूर्ण सुरक्षा नियम: UPI PIN की सुरक्षा',
      severity: 'warning',
      penalty: 10,
      description: 'You NEVER need to enter your UPI PIN or scan a QR code to RECEIVE money. Entering your UPI PIN ALWAYS transfers money OUT of your bank account.',
      descriptionHi: 'पैसे प्राप्त करने के लिए कभी भी UPI PIN दर्ज करने या QR कोड स्कैन करने की आवश्यकता नहीं होती है। PIN दर्ज करने पर बैंक खाते से पैसे कटते हैं।'
    });

    return {
      raw: trimmed,
      type: 'upi',
      parsedUpi: { pa, pn, am, cu, tn },
      heuristics,
      riskScore: 10,
      verdict: 'safe'
    };
  }

  // 2. Check for Wi-Fi Configuration
  if (trimmed.startsWith('WIFI:') || trimmed.startsWith('wifi:')) {
    const ssidMatch = trimmed.match(/S:([^;]+)/i);
    const typeMatch = trimmed.match(/T:([^;]+)/i);
    const passMatch = trimmed.match(/P:([^;]+)/i);
    const hiddenMatch = trimmed.match(/H:([^;]+)/i);

    const heuristics: HeuristicResult[] = [
      {
        id: 'wifi-config',
        ruleNumber: 0,
        title: 'Wi-Fi Network Configuration',
        titleHi: 'वाई-फ़ाई नेटवर्क कॉन्फ़िगरेशन',
        severity: 'info',
        penalty: 0,
        description: 'Contains Wi-Fi connection credentials. Verify that you trust the physical premises offering this Wi-Fi network.',
        descriptionHi: 'इसमें वाई-फ़ाई क्रेडेंशियल्स हैं। सुनिश्चित करें कि आप इस नेटवर्क पर भरोसा करते हैं।',
        details: `SSID: ${ssidMatch ? ssidMatch[1] : 'Unknown'} (${typeMatch ? typeMatch[1] : 'WPA/WPA2'})`
      }
    ];

    return {
      raw: trimmed,
      type: 'wifi',
      parsedWifi: {
        ssid: ssidMatch ? ssidMatch[1] : '',
        security: typeMatch ? typeMatch[1] : 'WPA',
        password: passMatch ? passMatch[1] : '',
        hidden: hiddenMatch ? hiddenMatch[1] === 'true' : false
      },
      heuristics,
      riskScore: 0,
      verdict: 'safe'
    };
  }

  // 3. Check for Email / Phone / SMS
  if (trimmed.toLowerCase().startsWith('mailto:')) {
    return {
      raw: trimmed,
      type: 'email',
      heuristics: [{
        id: 'email-link',
        ruleNumber: 0,
        title: 'Email Contact Link',
        titleHi: 'ईमेल संपर्क लिंक',
        severity: 'info',
        penalty: 0,
        description: 'Contains an email recipient address. Verify recipient before sending confidential attachments.',
        descriptionHi: 'इसमें एक ईमेल पता शामिल है। भेजने से पहले पते की पुष्टि करें।'
      }],
      riskScore: 0,
      verdict: 'safe'
    };
  }

  if (trimmed.toLowerCase().startsWith('tel:')) {
    return {
      raw: trimmed,
      type: 'tel',
      heuristics: [{
        id: 'tel-link',
        ruleNumber: 0,
        title: 'Telephone Number Link',
        titleHi: 'फ़ोन नंबर लिंक',
        severity: 'info',
        penalty: 0,
        description: 'Contains a dialable telephone number. Be cautious of unknown toll or premium-rate numbers.',
        descriptionHi: 'इसमें फ़ोन नंबर है। अनजान नंबरों से सावधान रहें।'
      }],
      riskScore: 0,
      verdict: 'safe'
    };
  }

  if (trimmed.toLowerCase().startsWith('sms:') || trimmed.toLowerCase().startsWith('smsto:')) {
    return {
      raw: trimmed,
      type: 'sms',
      heuristics: [{
        id: 'sms-link',
        ruleNumber: 0,
        title: 'SMS Message Link',
        titleHi: 'SMS संदेश लिंक',
        severity: 'info',
        penalty: 0,
        description: 'Contains a pre-drafted SMS message. Verify the recipient and message body before sending.',
        descriptionHi: 'इसमें पहले से लिखा SMS है। भेजने से पहले प्राप्तकर्ता जांचें।'
      }],
      riskScore: 0,
      verdict: 'safe'
    };
  }

  // 4. Attempt URL Parsing
  let parsedUrlObj: URL | null = null;
  let isWebUrl = false;

  const isLikelyUrl = /^(https?:\/\/|www\.)/i.test(trimmed) ||
    (!trimmed.includes(' ') && /^[a-z0-9-]+(\.[a-z0-9-]+)+(\/.*)?$/i.test(trimmed));

  if (isLikelyUrl) {
    try {
      const urlToTest = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
      parsedUrlObj = new URL(urlToTest);
      // Validate that hostname has at least a TLD or is an IP address
      if (parsedUrlObj.hostname && (parsedUrlObj.hostname.includes('.') || parsedUrlObj.hostname === 'localhost' || /^(\d{1,3}\.){3}\d{1,3}$/.test(parsedUrlObj.hostname))) {
        isWebUrl = true;
      }
    } catch {
      isWebUrl = false;
    }
  }

  // If not a URL, return as Plain Text
  if (!isWebUrl || !parsedUrlObj) {
    return {
      raw: trimmed,
      type: 'text',
      heuristics: [{
        id: 'plain-text',
        ruleNumber: 0,
        title: 'Plain Text Content',
        titleHi: 'सादा टेक्स्ट सामग्री',
        severity: 'info',
        penalty: 0,
        description: 'QR contains plain text, note or custom formatted data — not an executable web link.',
        descriptionHi: 'क्यूआर कोड में सादा टेक्स्ट या नोट है, कोई वेब लिंक नहीं है।'
      }],
      riskScore: 0,
      verdict: 'safe'
    };
  }

  // ----------------------------------------------------
  // RUN 12+ HEURISTIC CHECKS ON WEB URL
  // ----------------------------------------------------
  const heuristics: HeuristicResult[] = [];
  let score = 0;

  const originalHasHttp = trimmed.toLowerCase().startsWith('http://');
  const protocol = originalHasHttp ? 'http:' : parsedUrlObj.protocol;
  const hostname = parsedUrlObj.hostname.toLowerCase();
  const pathname = parsedUrlObj.pathname;
  const search = parsedUrlObj.search;
  const fullUrlLower = (trimmed.toLowerCase());
  const port = parsedUrlObj.port;
  const hasAuth = trimmed.includes('@') && !trimmed.startsWith('mailto:');
  let authUsername = '';

  if (hasAuth) {
    try {
      const authMatch = trimmed.match(/https?:\/\/([^@/]+)@/i);
      if (authMatch) {
        authUsername = authMatch[1];
      }
    } catch {
      // ignore
    }
  }

  // RULE 1: HTTPS Check
  if (protocol === 'https:') {
    heuristics.push({
      id: 'rule-1-https',
      ruleNumber: 1,
      title: 'Uses Encrypted HTTPS Connection',
      titleHi: 'एन्क्रिप्टेड HTTPS कनेक्शन का उपयोग करता है',
      severity: 'safe',
      penalty: 0,
      description: 'Communication is encrypted using TLS/HTTPS. (Note: HTTPS encrypts traffic, but does not guarantee the site is honest).',
      descriptionHi: 'यह कनेक्शन TLS/HTTPS द्वारा सुरक्षित है। (ध्यान दें: HTTPS डेटा एन्क्रिप्ट करता है, लेकिन सामग्री की प्रमाणिकता की गारंटी नहीं देता)।'
    });
  } else if (protocol === 'http:') {
    score += 20;
    heuristics.push({
      id: 'rule-1-http',
      ruleNumber: 1,
      title: 'Unencrypted HTTP Connection (No HTTPS)',
      titleHi: 'असुरक्षित अनएन्क्रिप्टेड HTTP कनेक्शन',
      severity: 'warning',
      penalty: 20,
      description: 'The website connection is unencrypted. Any credentials or personal data entered can be intercepted over public networks.',
      descriptionHi: 'यह वेबसाइट HTTPS का उपयोग नहीं करती है। सार्वजनिक वाई-फ़ाई पर कोई भी आपका डेटा देख सकता है।'
    });
  }

  // RULE 2: URL Shortener Detection
  if (KNOWN_SHORTENERS.has(hostname) || hostname.endsWith('.link') && hostname.length < 12) {
    score += 20;
    heuristics.push({
      id: 'rule-2-shortener',
      ruleNumber: 2,
      title: 'Shortened URL (Hides Final Destination)',
      titleHi: 'शॉर्ट यूआरएल (अंतिम गंतव्य छिपा हुआ है)',
      severity: 'warning',
      penalty: 20,
      description: `The URL uses a known link shortener (${hostname}). Scammers frequently use shorteners on physical stickers to hide malicious targets.`,
      descriptionHi: `यह यूआरएल एक शॉर्टनर सेवा (${hostname}) का उपयोग करता है। जालसाज अक्सर असली लिंक छिपाने के लिए इसका उपयोग करते हैं।`
    });
  }

  // RULE 3: Suspicious & Phishing Keywords
  const matchedKeywords = SUSPICIOUS_KEYWORDS.filter((kw) => {
    // Check if keyword exists in pathname, search, or subdomain/hostname
    return pathname.toLowerCase().includes(kw) ||
      search.toLowerCase().includes(kw) ||
      hostname.includes(kw);
  });

  if (matchedKeywords.length > 0) {
    // Conservative penalty: +5 for 1 kw, +10 for 2-3, +15 for 4+
    const kwPenalty = Math.min(15, matchedKeywords.length >= 4 ? 15 : matchedKeywords.length >= 2 ? 10 : 5);
    score += kwPenalty;
    heuristics.push({
      id: 'rule-3-keywords',
      ruleNumber: 3,
      title: 'Sensitive / Phishing Keywords Detected',
      titleHi: 'संवेदनशील / फिशिंग कीवर्ड पाए गए',
      severity: matchedKeywords.length >= 2 ? 'warning' : 'info',
      penalty: kwPenalty,
      description: `Contains high-risk terms commonly targeted in credential harvesting: [${matchedKeywords.slice(0, 5).join(', ')}]. Always verify domain authenticity before entering passwords.`,
      descriptionHi: `इसमें संवेदनशील कीवर्ड पाए गए हैं: [${matchedKeywords.slice(0, 5).join(', ')}]। पासवर्ड दर्ज करने से पहले डोमेन की जांच करें।`
    });
  }

  // RULE 4: Raw IP Address Hostname
  const isIpv4 = /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname);
  const isIpv6 = /^\[?[a-f0-9:]+\]?$/i.test(hostname) && hostname.includes(':');
  if (isIpv4 || isIpv6) {
    score += 25;
    heuristics.push({
      id: 'rule-4-raw-ip',
      ruleNumber: 4,
      title: 'Raw IP Address Used Instead of Domain',
      titleHi: 'डोमेन नाम की जगह रॉ आईपी एड्रेस (IP Address)',
      severity: 'danger',
      penalty: 25,
      description: `The URL directly points to an IP address (${hostname}) instead of a standard registered domain name. Legitimate consumer services rarely use raw IPs in public QR codes.`,
      descriptionHi: `यह यूआरएल किसी पंजीकृत डोमेन के बजाय सीधे आईपी पते (${hostname}) पर जाता है। वैध कंपनियां सार्वजनिक क्यूआर में आईपी का उपयोग बहुत कम करती हैं।`
    });
  }

  // RULE 5: Excessive Subdomain Depth
  const domainParts = hostname.split('.');
  // Check if labels > 4 (excluding standard 2-part ccTLDs like co.in, co.uk, com.au)
  if (domainParts.length >= 5) {
    score += 10;
    heuristics.push({
      id: 'rule-5-subdomains',
      ruleNumber: 5,
      title: 'Unusually Deep Subdomain Structure',
      titleHi: 'असामान्य रूप से गहरे सबडोमेन',
      severity: 'warning',
      penalty: 10,
      description: `Domain contains ${domainParts.length} label levels (${hostname}). Attackers often prefix reputable brand names in subdomains to trick mobile users.`,
      descriptionHi: `डोमेन में ${domainParts.length} स्तर हैं। हमलावर अक्सर असली कंपनी का नाम सबडोमेन में जोड़कर धोखा देते हैं।`
    });
  }

  // RULE 6: Excessive Hyphens in Domain
  const hyphenCount = (hostname.match(/-/g) || []).length;
  if (hyphenCount >= 3) {
    score += 10;
    heuristics.push({
      id: 'rule-6-hyphens',
      ruleNumber: 6,
      title: 'Excessive Hyphens in Domain Name',
      titleHi: 'डोमेन नाम में अत्यधिक हाइफ़न (-)',
      severity: 'warning',
      penalty: 10,
      description: `Domain contains ${hyphenCount} hyphens (${hostname}), a pattern strongly correlated with fraudulent disposable domains.`,
      descriptionHi: `डोमेन में ${hyphenCount} हाइफ़न (-) हैं। यह पैटर्न अक्सर फर्जी और अस्थायी वेबसाइटों में पाया जाता है।`
    });
  }

  // RULE 7: Lookalike / Brand Impersonation / Typosquatting
  let brandImpersonated: string | null = null;
  let isLegitimateBrand = false;

  // Check known brands
  for (const [brand, officialDomains] of Object.entries(BRAND_DOMAINS)) {
    // Check if brand is in hostname
    if (hostname.includes(brand)) {
      // Check if it ends with one of the official domains
      const isOfficial = officialDomains.some((d) => hostname === d || hostname.endsWith(`.${d}`));
      if (isOfficial) {
        isLegitimateBrand = true;
      } else {
        brandImpersonated = brand;
        break;
      }
    }
  }

  // Also check typo patterns (e.g. amaz0n, paypa1, g00gle)
  if (!brandImpersonated && !isLegitimateBrand) {
    for (const item of BRAND_TYPO_PATTERNS) {
      if (item.regex.test(hostname)) {
        const officialDomains = BRAND_DOMAINS[item.brand] || [];
        const isOfficial = officialDomains.some((d) => hostname === d || hostname.endsWith(`.${d}`));
        if (!isOfficial) {
          brandImpersonated = item.brand;
          break;
        }
      }
    }
  }

  if (brandImpersonated) {
    score += 30;
    heuristics.push({
      id: 'rule-7-brand-impersonation',
      ruleNumber: 7,
      title: `Possible Brand Impersonation (${brandImpersonated.toUpperCase()})`,
      titleHi: `ब्रांड प्रतिरूपण / नकली डोमेन (${brandImpersonated.toUpperCase()})`,
      severity: 'danger',
      penalty: 30,
      description: `The domain references "${brandImpersonated}", but is NOT an official verified domain of that organization. This is a very high indicator of phishing.`,
      descriptionHi: `यह डोमेन "${brandImpersonated}" की नकल करता है, लेकिन उस कंपनी का आधिकारिक डोमेन नहीं है। फिशिंग का उच्च जोखिम है।`
    });
  } else if (isLegitimateBrand) {
    heuristics.push({
      id: 'rule-7-official-brand',
      ruleNumber: 7,
      title: 'Official Verified Brand Domain Recognized',
      titleHi: 'आधिकारिक मान्यता प्राप्त ब्रांड डोमेन',
      severity: 'safe',
      penalty: 0,
      description: `Hostname matches the registered official domain structure for ${hostname}.`,
      descriptionHi: `${hostname} के लिए आधिकारिक डोमेन संरचना से मेल खाता है।`
    });
  }

  // RULE 8: Homoglyph / Confusable Unicode Characters
  if (HOMOGLYPH_REGEX.test(hostname)) {
    score += 30;
    heuristics.push({
      id: 'rule-8-homoglyph',
      ruleNumber: 8,
      title: 'Homoglyph / Lookalike Unicode Characters Detected',
      titleHi: 'धोखाधड़ी वाले यूनिकोड / समरूप अक्षर पाए गए',
      severity: 'danger',
      penalty: 30,
      description: 'Domain contains mixed non-Latin characters (e.g. Cyrillic/Greek) designed to look visually identical to English Latin characters (IDN Homograph attack).',
      descriptionHi: 'डोमेन में गैर-लैटिन अक्षर शामिल हैं जो अंग्रेजी अक्षरों जैसे दिखते हैं (होमोग्राफ हमला)।'
    });
  }

  // RULE 9: User-Info @ Symbol Spoofing
  if (hasAuth) {
    score += 35;
    heuristics.push({
      id: 'rule-9-at-spoofing',
      ruleNumber: 9,
      title: 'High-Risk User-Info "@" Authority Spoofing',
      titleHi: 'उच्च-जोखिम उपयोगकर्ता "@" सिंबल धोखा',
      severity: 'danger',
      penalty: 35,
      description: `URL contains an "@" symbol. Web browsers ignore text before "@" (${authUsername || 'trusted-brand.com'}) and actually navigate to the real destination (${hostname}).`,
      descriptionHi: `यूआरएल में "@" सिंबल है। ब्राउज़र "@" से पहले वाले नाम को अनदेखा करते हैं और वास्तविक होस्ट (${hostname}) पर जाते हैं।`
    });
  }

  // RULE 10: Non-Standard Web Port
  if (port && !STANDARD_PORTS.has(port)) {
    score += 5;
    heuristics.push({
      id: 'rule-10-custom-port',
      ruleNumber: 10,
      title: `Non-Standard Web Port (:${port})`,
      titleHi: `गैर-मानक वेब पोर्ट (:${port})`,
      severity: 'info',
      penalty: 5,
      description: `Explicit port :${port} is specified. Standard web traffic runs on port 80 (HTTP) or 443 (HTTPS).`,
      descriptionHi: `स्पष्ट पोर्ट :${port} निर्दिष्ट है। सामान्य वेब ट्रैफ़िक पोर्ट 80 या 443 पर चलता है।`
    });
  }

  // RULE 11: Unusually Long URL / Parameter Overload
  if (trimmed.length > 220 || (search.match(/&/g) || []).length >= 6) {
    score += 5;
    heuristics.push({
      id: 'rule-11-long-url',
      ruleNumber: 11,
      title: 'Excessive Length / Heavy Tracking Query',
      titleHi: 'अत्यधिक लंबा यूआरएल / भारी ट्रैकिंग स्ट्रिंग',
      severity: 'info',
      penalty: 5,
      description: `URL is ${trimmed.length} characters long with numerous tracking parameters. Often used to pass encoded session payloads.`,
      descriptionHi: `यूआरएल ${trimmed.length} अक्षर लंबा है जिसमें कई ट्रैकिंग पैरामीटर हैं।`
    });
  }

  // RULE 12: Punycode Internationalized Domain
  if (hostname.startsWith('xn--') || hostname.includes('.xn--')) {
    score += 10;
    heuristics.push({
      id: 'rule-12-punycode',
      ruleNumber: 12,
      title: 'Punycode / Internationalized Domain Name (IDN)',
      titleHi: 'प्यूनीकोड (Punycode xn--) अंतर्राष्ट्रीय डोमेन',
      severity: 'warning',
      penalty: 10,
      description: `The domain uses Punycode encoding (${hostname}). Verify the decoded native characters carefully to prevent visual impersonation.`,
      descriptionHi: `डोमेन प्यूनीकोड (${hostname}) का उपयोग करता है। नकल रोकने के लिए वर्णों की सावधानीपूर्वक पुष्टि करें।`
    });
  }

  // Determine Final Verdict based on score
  const finalScore = Math.min(100, Math.max(0, score));
  let verdict: 'safe' | 'suspicious' | 'danger' = 'safe';
  if (finalScore >= 50) {
    verdict = 'danger';
  } else if (finalScore >= 20) {
    verdict = 'suspicious';
  } else {
    verdict = 'safe';
  }

  return {
    raw: trimmed,
    type: 'url',
    parsedUrl: {
      urlObj: parsedUrlObj,
      protocol,
      hostname,
      pathname,
      search,
      port: port || (protocol === 'https:' ? '443 (Default)' : '80 (Default)'),
      hasAuth,
      authUsername
    },
    heuristics,
    riskScore: finalScore,
    verdict
  };
}

// ----------------------------------------------------
// MAIN COMPONENT
// ----------------------------------------------------

export const QrCodeSafetyCheckerTool: React.FC<QrCodeSafetyCheckerToolProps> = ({ onShowToast }) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'camera' | 'paste'>('upload');
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraFacing, setCameraFacing] = useState<'environment' | 'user'>('environment');
  const [hasTorch, setHasTorch] = useState<boolean>(false);
  const [isTorchOn, setIsTorchOn] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isScanningFile, setIsScanningFile] = useState<boolean>(false);
  const [uploadedImagePreview, setUploadedImagePreview] = useState<string | null>(null);
  const [pastedText, setPastedText] = useState<string>('');

  // Scan Result State
  const [scanResult, setScanResult] = useState<DecodedQRData | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [showOpenConfirmModal, setShowOpenConfirmModal] = useState<boolean>(false);

  // Refs
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const notify = (msg: string) => {
    if (onShowToast) onShowToast(msg);
  };

  // Clean up camera when unmounting or switching tab
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch {
          // ignore
        }
      });
      mediaStreamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    setIsCameraActive(false);
    setIsTorchOn(false);
    setHasTorch(false);
  };

  // Process and analyze raw decoded string
  const handleDecodedString = (text: string) => {
    if (!text || !text.trim()) return;
    if (soundEnabled) {
      playScanChime();
    }
    const analysis = analyzeDecodedContent(text);
    setScanResult(analysis);
    stopCamera();
    notify(language === 'hi' ? 'क्यूआर कोड सफलतापूर्वक स्कैन हुआ!' : 'QR Code decoded and analyzed locally!');
  };

  // ----------------------------------------------------
  // CAMERA SCANNING LOOP
  // ----------------------------------------------------

  const scanCameraFrame = () => {
    if (!videoRef.current || videoRef.current.readyState !== videoRef.current.HAVE_ENOUGH_DATA) {
      animFrameRef.current = requestAnimationFrame(scanCameraFrame);
      return;
    }

    const video = videoRef.current;
    let canvas = canvasRef.current;
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvasRef.current = canvas;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    if (ctx && canvas.width > 0 && canvas.height > 0) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'attemptBoth'
      });

      if (code && code.data) {
        handleDecodedString(code.data);
        return; // Stop loop
      }
    }

    animFrameRef.current = requestAnimationFrame(scanCameraFrame);
  };

  const startCamera = async (facing: 'environment' | 'user' = cameraFacing) => {
    stopCamera();
    setCameraError(null);

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError(
        language === 'hi'
          ? 'इस ब्राउज़र में कैमरा उपलब्ध नहीं है। कृपया इमेज अपलोड विकल्प का उपयोग करें।'
          : 'Camera scanning is not available in this browser. Please upload a QR image instead.'
      );
      return;
    }

    try {
      setIsCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: facing },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });

      mediaStreamRef.current = stream;

      // Check for torch capability
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack && 'getCapabilities' in videoTrack) {
        const capabilities = (videoTrack as any).getCapabilities?.();
        if (capabilities && capabilities.torch) {
          setHasTorch(true);
        }
      }

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true');
        await videoRef.current.play();
        animFrameRef.current = requestAnimationFrame(scanCameraFrame);
      }
    } catch (err: any) {
      setIsCameraActive(false);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraError(
          language === 'hi'
            ? 'कैमरा अनुमति अस्वीकार कर दी गई थी। आप इमेज अपलोड कर सकते हैं।'
            : 'Camera permission was denied. You can still upload a QR image instead.'
        );
      } else {
        setCameraError(
          language === 'hi'
            ? 'कैमरा शुरू करने में त्रुटि। कृपया सुनिश्चित करें कि कोई अन्य ऐप कैमरे का उपयोग नहीं कर रहा है।'
            : 'Unable to access camera. Please check your device permissions or upload an image.'
        );
      }
    }
  };

  const toggleTorch = async () => {
    if (!mediaStreamRef.current) return;
    const track = mediaStreamRef.current.getVideoTracks()[0];
    if (track && 'applyConstraints' in track) {
      try {
        const nextState = !isTorchOn;
        await (track as any).applyConstraints({
          advanced: [{ torch: nextState }]
        });
        setIsTorchOn(nextState);
      } catch {
        notify('Torch could not be toggled.');
      }
    }
  };

  const switchCameraFacing = () => {
    const nextFacing = cameraFacing === 'environment' ? 'user' : 'environment';
    setCameraFacing(nextFacing);
    startCamera(nextFacing);
  };

  // ----------------------------------------------------
  // IMAGE FILE UPLOAD
  // ----------------------------------------------------

  const decodeImageFile = (file: File) => {
    setUploadError(null);
    if (!file.type.startsWith('image/')) {
      setUploadError(language === 'hi' ? 'कृपया एक वैध इमेज फ़ाइल (PNG, JPG, WEBP) चुनें।' : 'Please select a valid image file (PNG, JPG, WEBP).');
      return;
    }

    setIsScanningFile(true);
    const reader = new FileReader();

    reader.onload = (e) => {
      const src = e.target?.result as string;
      setUploadedImagePreview(src);

      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });

        if (!ctx) {
          setIsScanningFile(false);
          setUploadError('Failed to initialize canvas context.');
          return;
        }

        ctx.drawImage(img, 0, 0, img.width, img.height);
        const imageData = ctx.getImageData(0, 0, img.width, img.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: 'attemptBoth'
        });

        setIsScanningFile(false);

        if (code && code.data) {
          handleDecodedString(code.data);
        } else {
          setUploadError(
            language === 'hi'
              ? 'अपलोड की गई छवि में कोई स्पष्ट QR कोड नहीं मिला। कृपया स्पष्ट छवि आज़माएं।'
              : 'No valid QR code detected in this image. Please ensure the QR code is clearly visible and well-lit.'
          );
        }
      };

      img.onerror = () => {
        setIsScanningFile(false);
        setUploadError(language === 'hi' ? 'छवि लोड करने में विफल।' : 'Failed to load image file.');
      };

      img.src = src;
    };

    reader.onerror = () => {
      setIsScanningFile(false);
      setUploadError('Failed to read file from disk.');
    };

    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      decodeImageFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      decodeImageFile(file);
    }
  };

  const handlePasteClipboardImage = async () => {
    try {
      const items = await navigator.clipboard.read();
      for (const item of items) {
        const imageType = item.types.find((t) => t.startsWith('image/'));
        if (imageType) {
          const blob = await item.getType(imageType);
          const file = new File([blob], 'clipboard-qr.png', { type: imageType });
          decodeImageFile(file);
          return;
        }
      }
      notify(language === 'hi' ? 'क्लिपबोर्ड में कोई छवि नहीं मिली।' : 'No image found in clipboard. Try copying an image first.');
    } catch {
      notify(language === 'hi' ? 'क्लिपबोर्ड एक्सेस करने में असमर्थ।' : 'Clipboard access denied or unavailable.');
    }
  };

  // Reset entire analysis
  const handleReset = () => {
    stopCamera();
    setScanResult(null);
    setUploadedImagePreview(null);
    setUploadError(null);
    setCameraError(null);
    setPastedText('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    notify(language === 'hi' ? 'कॉपी कर लिया गया!' : 'Decoded content copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-4 sm:p-8 space-y-6 max-w-5xl mx-auto">
      {/* ----------------- TOP HEADER WITH BILINGUAL TOGGLE & BADGES ----------------- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 dark:bg-indigo-500/20 flex items-center justify-center text-2xl border border-indigo-200 dark:border-indigo-800/50 shadow-inner">
            🛡️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                {language === 'hi' ? 'QR कोड सेफ्टी चेकर' : 'QR Code Safety Checker'}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-indigo-600 text-white uppercase tracking-wider shadow-xs">
                Local Engine
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-0.5">
              {language === 'hi'
                ? 'बिना खोले क्यूआर लिंक को सुरक्षित रूप से डिकोड और संदिग्ध पैटर्न की जांच करें।'
                : 'Safely inspect, decode and detect phishing patterns in QR URLs completely inside your browser.'}
            </p>
          </div>
        </div>

        {/* Action controls: Language switcher & Privacy badge */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center bg-slate-100 dark:bg-slate-800/90 p-1 rounded-xl border border-slate-200 dark:border-slate-700/60 shadow-inner">
            <button
              onClick={() => setLanguage('en')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                language === 'en'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setLanguage('hi')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                language === 'hi'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              हिन्दी
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold border border-emerald-200/80 dark:border-emerald-800/40">
            <Lock className="w-3.5 h-3.5" />
            <span>{language === 'hi' ? '100% प्राइवेट • नो सर्वर अपलोड' : '100% Client-Side Private'}</span>
          </div>
        </div>
      </div>

      {/* ----------------- IF RESULT IS PRESENT: DISPLAY VERDICT & DETAILED ANALYSIS ----------------- */}
      {scanResult ? (
        <div className="space-y-6">
          {/* 1. LARGE VERDICT CARD */}
          <div
            className={`p-6 sm:p-8 rounded-3xl border shadow-lg transition-all ${
              scanResult.verdict === 'safe'
                ? 'bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent border-emerald-200 dark:border-emerald-800/60'
                : scanResult.verdict === 'suspicious'
                ? 'bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border-amber-200 dark:border-amber-800/60'
                : 'bg-gradient-to-br from-rose-500/15 via-rose-500/5 to-transparent border-rose-200 dark:border-rose-800/60'
            }`}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-sm shrink-0 ${
                    scanResult.verdict === 'safe'
                      ? 'bg-emerald-600 text-white'
                      : scanResult.verdict === 'suspicious'
                      ? 'bg-amber-500 text-white'
                      : 'bg-rose-600 text-white animate-pulse'
                  }`}
                >
                  {scanResult.verdict === 'safe' ? (
                    <ShieldCheck className="w-9 h-9" />
                  ) : scanResult.verdict === 'suspicious' ? (
                    <ShieldAlert className="w-9 h-9" />
                  ) : (
                    <ShieldX className="w-9 h-9" />
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                        scanResult.verdict === 'safe'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200'
                          : scanResult.verdict === 'suspicious'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-200'
                      }`}
                    >
                      {scanResult.verdict === 'safe'
                        ? language === 'hi' ? '🟢 सुरक्षित प्रतीत होता है' : '🟢 Looks Safe'
                        : scanResult.verdict === 'suspicious'
                        ? language === 'hi' ? '🟡 संदिग्ध पैटर्न' : '🟡 Suspicious'
                        : language === 'hi' ? '🔴 उच्च जोखिम / खतरनाक' : '🔴 Dangerous-looking'}
                    </span>
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      {language === 'hi' ? 'जोखिम स्कोर:' : 'Heuristic Risk Score:'} <strong>{scanResult.riskScore} / 100</strong>
                    </span>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                    {scanResult.verdict === 'safe'
                      ? language === 'hi'
                        ? 'स्थानीय जांच के आधार पर कोई स्पष्ट संदिग्ध पैटर्न नहीं मिला'
                        : 'Looks safe based on local heuristic checks'
                      : scanResult.verdict === 'suspicious'
                      ? language === 'hi'
                        ? 'एक या अधिक संदिग्ध सुरक्षा पैटर्न का पता चला'
                        : 'One or more suspicious patterns were detected'
                      : language === 'hi'
                      ? 'उच्च जोखिम वाले फिशिंग या दुर्भावनापूर्ण पैटर्न मिले'
                      : 'High-risk patterns detected — Do NOT enter credentials'}
                  </h2>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl">
                    {scanResult.verdict === 'safe'
                      ? language === 'hi'
                        ? 'इस लिंक में कोई आम फिशिंग कीवर्ड, आईपी एड्रेस या ब्रांड की नकल नहीं पाई गई। हालांकि, हमेशा सावधानी बरतें।'
                        : 'No obvious suspicious patterns (unencrypted HTTP, shorteners, raw IPs, or lookalike typosquats) were detected.'
                      : scanResult.verdict === 'suspicious'
                      ? language === 'hi'
                        ? 'इस लिंक में कुछ ऐसे लक्षण हैं जो अक्सर फिशिंग में उपयोग किए जाते हैं (जैसे शॉर्टनर या गैर-मानक पोर्ट)।'
                        : 'One or more patterns commonly associated with masked or unverified links were detected. Inspect carefully.'
                      : language === 'hi'
                      ? 'इस यूआरएल में गंभीर जोखिम पैटर्न मिले हैं। जब तक आप गंतव्य की पूरी तरह पुष्टि न कर लें, इसे न खोलें।'
                      : 'Several high-risk patterns were detected. Do not open this link unless you can independently verify the destination.'}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-row md:flex-col gap-2.5 shrink-0">
                <button
                  onClick={handleReset}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs sm:text-sm font-bold border border-slate-200 dark:border-slate-700 shadow-xs transition-all cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>{language === 'hi' ? 'दूसरा QR स्कैन करें' : 'Scan Another QR'}</span>
                </button>

                {scanResult.type === 'url' && (
                  <button
                    onClick={() => {
                      if (scanResult.verdict === 'danger' || scanResult.verdict === 'suspicious') {
                        setShowOpenConfirmModal(true);
                      } else {
                        window.open(scanResult.raw, '_blank', 'noopener,noreferrer');
                      }
                    }}
                    className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer shadow-xs ${
                      scanResult.verdict === 'danger'
                        ? 'bg-rose-600 hover:bg-rose-700 text-white'
                        : scanResult.verdict === 'suspicious'
                        ? 'bg-amber-600 hover:bg-amber-700 text-white'
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                    }`}
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>{language === 'hi' ? 'मैन्युअल रूप से लिंक खोलें' : 'Open Link Manually'}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Risk Meter Bar */}
            <div className="mt-6 pt-6 border-t border-slate-200/60 dark:border-slate-800/60">
              <div className="flex justify-between items-center text-xs font-bold mb-1.5 text-slate-700 dark:text-slate-300">
                <span>{language === 'hi' ? 'सुरक्षा जोखिम स्तर' : 'Safety Risk Level'}</span>
                <span className="font-mono">{scanResult.riskScore}%</span>
              </div>
              <div className="w-full h-3 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden p-0.5">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    scanResult.verdict === 'safe'
                      ? 'bg-emerald-500'
                      : scanResult.verdict === 'suspicious'
                      ? 'bg-amber-500'
                      : 'bg-rose-500'
                  }`}
                  style={{ width: `${Math.max(5, scanResult.riskScore)}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] font-semibold text-slate-500 dark:text-slate-400 mt-1">
                <span>0 (Safe-looking)</span>
                <span>50 (Suspicious threshold)</span>
                <span>100 (High-risk)</span>
              </div>
            </div>
          </div>

          {/* 2. DECODED CONTENT DISPLAY CARD */}
          <div className="glass-panel p-6 rounded-3xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  {language === 'hi' ? 'डिकोड की गई सामग्री (Decoded Content)' : 'Decoded QR Content'}
                </h3>
              </div>
              <button
                onClick={() => handleCopyText(scanResult.raw)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-slate-700 dark:text-slate-300 hover:text-indigo-600 text-xs font-bold border border-slate-200 dark:border-slate-700 transition-all cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? (language === 'hi' ? 'कॉपी हो गया!' : 'Copied!') : (language === 'hi' ? 'कॉपी करें' : 'Copy')}</span>
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 text-slate-100 font-mono text-xs sm:text-sm break-all select-all leading-relaxed shadow-inner border border-slate-800">
              {scanResult.raw}
            </div>

            {/* Content Type Specific Insights */}
            {scanResult.type === 'url' && scanResult.parsedUrl && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
                  <span className="text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400 block mb-0.5">Protocol</span>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white">
                    {scanResult.parsedUrl.protocol === 'https:' ? (
                      <Lock className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <Unlock className="w-3.5 h-3.5 text-amber-500" />
                    )}
                    <span>{scanResult.parsedUrl.protocol.toUpperCase()}</span>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
                  <span className="text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400 block mb-0.5">Domain / Host</span>
                  <span className="text-xs font-bold text-slate-900 dark:text-white truncate block font-mono">
                    {scanResult.parsedUrl.hostname}
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
                  <span className="text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400 block mb-0.5">Port</span>
                  <span className="text-xs font-bold text-slate-900 dark:text-white block font-mono">
                    {scanResult.parsedUrl.port}
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
                  <span className="text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400 block mb-0.5">Path / Query</span>
                  <span className="text-xs font-bold text-slate-900 dark:text-white truncate block font-mono">
                    {scanResult.parsedUrl.pathname || '/'}{scanResult.parsedUrl.search ? '?...' : ''}
                  </span>
                </div>
              </div>
            )}

            {/* UPI / PAYMENT SPECIFIC CARD */}
            {scanResult.type === 'upi' && scanResult.parsedUpi && (
              <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 space-y-3">
                <div className="flex items-center gap-2 text-indigo-900 dark:text-indigo-200 font-bold text-sm">
                  <CreditCard className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>{language === 'hi' ? 'UPI भुगतान विवरण' : 'UPI Payment Parameters'}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-indigo-100 dark:border-indigo-900">
                    <span className="text-slate-500 text-[10px] block uppercase font-bold">Payee UPI VPA:</span>
                    <strong className="text-slate-900 dark:text-white font-mono">{scanResult.parsedUpi.pa || 'None'}</strong>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-indigo-100 dark:border-indigo-900">
                    <span className="text-slate-500 text-[10px] block uppercase font-bold">Payee / Merchant Name:</span>
                    <strong className="text-slate-900 dark:text-white">{scanResult.parsedUpi.pn || 'Not specified'}</strong>
                  </div>
                  {scanResult.parsedUpi.am && (
                    <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-indigo-100 dark:border-indigo-900">
                      <span className="text-slate-500 text-[10px] block uppercase font-bold">Pre-filled Amount:</span>
                      <strong className="text-emerald-600 dark:text-emerald-400 font-bold text-sm">₹ {scanResult.parsedUpi.am}</strong>
                    </div>
                  )}
                  {scanResult.parsedUpi.tn && (
                    <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-indigo-100 dark:border-indigo-900">
                      <span className="text-slate-500 text-[10px] block uppercase font-bold">Note:</span>
                      <span className="text-slate-800 dark:text-slate-200">{scanResult.parsedUpi.tn}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* 3. HEURISTICS BREAKDOWN — WHY WAS THIS FLAGGED? */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>{language === 'hi' ? 'सुरक्षा हीयूरिस्टिक ऑडिट रिपोर्ट' : 'Detailed Security Heuristics Audit'}</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                    {scanResult.heuristics.length} {language === 'hi' ? 'जांचें' : 'Checks'}
                  </span>
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                  {language === 'hi'
                    ? 'ब्राउज़र में स्थानीय रूप से निष्पादित 12+ सुरक्षा नियमों का विस्तृत विवरण'
                    : 'Transparent breakdown of local heuristics evaluated on this QR code'}
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              {scanResult.heuristics.map((item) => (
                <div
                  key={item.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    item.severity === 'danger'
                      ? 'bg-rose-50/80 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800/50'
                      : item.severity === 'warning'
                      ? 'bg-amber-50/80 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/50'
                      : item.severity === 'safe'
                      ? 'bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/50'
                      : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200/80 dark:border-slate-700/60'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 shrink-0">
                      {item.severity === 'danger' ? (
                        <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                      ) : item.severity === 'warning' ? (
                        <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                      ) : item.severity === 'safe' ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        <Info className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                      )}
                    </div>

                    <div className="space-y-1 flex-1">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                          {language === 'hi' ? item.titleHi : item.title}
                        </h4>
                        {item.penalty > 0 && (
                          <span className="text-[11px] font-black px-2 py-0.5 rounded-md bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300 font-mono">
                            +{item.penalty} Risk
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        {language === 'hi' ? item.descriptionHi : item.description}
                      </p>

                      {item.details && (
                        <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400 mt-1">
                          {item.details}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Heuristic Disclaimer Card */}
            <div className="p-4 rounded-2xl bg-slate-100/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 text-xs space-y-1 border border-slate-200/80 dark:border-slate-700/60">
              <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
                <HelpCircle className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>{language === 'hi' ? 'हीयूरिस्टिक अस्वीकरण (Heuristic Disclaimer)' : 'Important Safety Disclaimer'}</span>
              </div>
              <p>
                {language === 'hi'
                  ? 'यह चेकर स्थानीय नियमों (हीयूरिस्टिक्स) का उपयोग करता है। एक "सुरक्षित दिखने वाला" लिंक भी नया बना हुआ फिशिंग पेज हो सकता है। संवेदनशील क्रेडेंशियल्स दर्ज करने से पहले हमेशा ब्राउज़र एड्रेस बार में डोमेन की पुष्टि करें।'
                  : 'Automated local heuristic checks inspect structural URL and domain indicators, but cannot guarantee that a benign-looking link is completely safe. Always verify the domain name in your browser address bar before typing passwords, OTPs, or financial details.'}
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* ----------------- IF NO RESULT: SCANNER INPUT TABS (UPLOAD / CAMERA / PASTE / PRESETS) ----------------- */
        <div className="space-y-6">
          {/* TAB NAVIGATION */}
          <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/70 max-w-md mx-auto">
            <button
              onClick={() => {
                setActiveTab('upload');
                stopCamera();
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'upload'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Upload className="w-4 h-4" />
              <span>{language === 'hi' ? 'इमेज अपलोड' : 'Upload Image'}</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('camera');
                startCamera();
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'camera'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Camera className="w-4 h-4" />
              <span>{language === 'hi' ? 'कैमरा स्कैनर' : 'Camera Scan'}</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('paste');
                stopCamera();
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'paste'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Clipboard className="w-4 h-4" />
              <span>{language === 'hi' ? 'टेक्स्ट / लिंक' : 'Paste Link'}</span>
            </button>
          </div>

          {/* TAB 1: FILE UPLOAD AREA */}
          {activeTab === 'upload' && (
            <div className="glass-panel p-6 sm:p-10 rounded-3xl space-y-6">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                className="hidden"
                onChange={handleFileChange}
              />

              <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-indigo-300 dark:border-indigo-800/80 hover:border-indigo-500 dark:hover:border-indigo-500 rounded-3xl p-8 sm:p-14 text-center cursor-pointer transition-all bg-indigo-50/30 dark:bg-indigo-950/10 hover:bg-indigo-50/60 dark:hover:bg-indigo-950/20 group"
              >
                <div className="w-16 h-16 rounded-2xl bg-indigo-600/10 dark:bg-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mx-auto mb-4 group-hover:scale-110 transition-transform">
                  {isScanningFile ? (
                    <RefreshCw className="w-8 h-8 animate-spin text-indigo-600" />
                  ) : (
                    <Upload className="w-8 h-8" />
                  )}
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-1.5">
                  {language === 'hi' ? 'QR कोड इमेज यहाँ खींचें या चुनें' : 'Upload QR Image to Check Safely'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto mb-4">
                  {language === 'hi'
                    ? 'PNG, JPG, JPEG या WEBP फ़ाइल का समर्थन करता है। आपकी छवि कभी भी किसी सर्वर पर अपलोड नहीं होती है।'
                    : 'Supports PNG, JPG, JPEG, WEBP. Decoded 100% locally in your browser memory.'}
                </p>

                <div className="flex items-center justify-center gap-3 flex-wrap">
                  <button
                    type="button"
                    className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-indigo-600/20 transition-all pointer-events-none"
                  >
                    {language === 'hi' ? 'फ़ाइल चुनें' : 'Select QR Image File'}
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePasteClipboardImage();
                    }}
                    className="px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-bold border border-slate-200 dark:border-slate-700 transition-all flex items-center gap-1.5"
                  >
                    <Clipboard className="w-4 h-4" />
                    <span>{language === 'hi' ? 'क्लिपबोर्ड से पेस्ट करें' : 'Paste from Clipboard'}</span>
                  </button>
                </div>
              </div>

              {uploadError && (
                <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 shrink-0 text-rose-600" />
                  <span>{uploadError}</span>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: LIVE CAMERA SCANNER */}
          {activeTab === 'camera' && (
            <div className="glass-panel p-6 rounded-3xl space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <Camera className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                    {language === 'hi' ? 'लाइव कैमरा QR स्कैनर' : 'Live Camera QR Scanner'}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  {hasTorch && (
                    <button
                      onClick={toggleTorch}
                      className={`p-2 rounded-xl border text-xs font-bold transition-all ${
                        isTorchOn
                          ? 'bg-amber-500 text-white border-amber-600'
                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                      }`}
                      title="Toggle Torch"
                    >
                      <Zap className="w-4 h-4" />
                    </button>
                  )}

                  <button
                    onClick={switchCameraFacing}
                    className="p-2 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 transition-all"
                    title="Switch Camera (Front/Back)"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className="p-2 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 transition-all"
                    title="Audio Chime"
                  >
                    {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Viewfinder Container */}
              <div className="relative w-full max-w-lg mx-auto aspect-square sm:aspect-[4/3] rounded-3xl overflow-hidden bg-black shadow-2xl border-4 border-slate-900">
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  autoPlay
                  playsInline
                  muted
                />

                {/* Laser Overlay & Target Box */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <div className="w-64 h-64 border-2 border-indigo-400/80 rounded-2xl relative shadow-2xl">
                    {/* Corner Guides */}
                    <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-indigo-500 rounded-tl-lg" />
                    <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-indigo-500 rounded-tr-lg" />
                    <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-indigo-500 rounded-bl-lg" />
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-indigo-500 rounded-br-lg" />

                    {/* Animated Scanning Laser Line */}
                    <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent shadow-lg shadow-red-500/80 animate-pulse absolute top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div className="absolute bottom-4 inset-x-4 flex items-center justify-center">
                  <span className="px-3.5 py-1.5 rounded-full bg-black/75 backdrop-blur-md text-white text-xs font-semibold">
                    {language === 'hi' ? 'कैमरे को QR कोड के सामने रखें' : 'Point camera directly at QR Code'}
                  </span>
                </div>
              </div>

              {cameraError && (
                <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 shrink-0 text-rose-600" />
                  <span>{cameraError}</span>
                </div>
              )}

              <div className="flex justify-center gap-3">
                {isCameraActive ? (
                  <button
                    onClick={stopCamera}
                    className="px-6 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
                  >
                    {language === 'hi' ? 'कैमरा बंद करें (Stop Camera)' : 'Stop Camera'}
                  </button>
                ) : (
                  <button
                    onClick={() => startCamera()}
                    className="px-6 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
                  >
                    {language === 'hi' ? 'कैमरा शुरू करें (Start Camera)' : 'Start Camera'}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: DIRECT TEXT / URL PASTE */}
          {activeTab === 'paste' && (
            <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-4">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  {language === 'hi' ? 'यूआरएल या टेक्स्ट सीधे पेस्ट करें' : 'Analyze URL or QR Payload Directly'}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {language === 'hi'
                    ? 'यदि आपके पास पहले से लिंक या टेक्स्ट है, तो इसे यहाँ पेस्ट करके सुरक्षा विश्लेषण चलाएँ।'
                    : 'Paste any URL, UPI string, or raw text to inspect it against the 12+ security heuristic rules.'}
                </p>
              </div>

              <textarea
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
                placeholder="e.g. https://amaz0n-security-update.com/login or upi://pay?pa=merchant@upi"
                rows={4}
                className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setPastedText('')}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  {language === 'hi' ? 'साफ़ करें' : 'Clear'}
                </button>
                <button
                  disabled={!pastedText.trim()}
                  onClick={() => handleDecodedString(pastedText)}
                  className="px-6 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer"
                >
                  {language === 'hi' ? 'सुरक्षा जांचें (Run Safety Check)' : 'Analyze Safety Heuristics'}
                </button>
              </div>
            </div>
          )}

          {/* ----------------- PRESET TEST SCENARIOS (EASY 1-CLICK TESTING) ----------------- */}
          <div className="glass-panel p-6 rounded-3xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  {language === 'hi' ? 'त्वरित परीक्षण परिदृश्य (1-Click Test Presets)' : 'Interactive Test Scenarios (1-Click Heuristic Tests)'}
                </h3>
              </div>
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                {language === 'hi' ? 'बिना QR कोड के जांचें' : 'Test engine instantly'}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {PRESET_SCENARIOS.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => handleDecodedString(preset.data)}
                  className="p-3 rounded-2xl bg-slate-50 hover:bg-indigo-50/80 dark:bg-slate-800/60 dark:hover:bg-indigo-950/40 border border-slate-200/80 dark:border-slate-700/60 hover:border-indigo-300 dark:hover:border-indigo-700 text-left transition-all group cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md border ${preset.color}`}>
                      {preset.badge}
                    </span>
                    <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
                  </div>
                  <strong className="text-xs font-bold text-slate-800 dark:text-slate-200 block truncate">
                    {language === 'hi' ? preset.nameHi : preset.name}
                  </strong>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ----------------- SAFETY CONFIRMATION MODAL FOR SUSPICIOUS LINKS ----------------- */}
      {showOpenConfirmModal && scanResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl max-w-md w-full border border-rose-300 dark:border-rose-800 shadow-2xl space-y-5 bg-white dark:bg-slate-900">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto text-2xl">
              <ShieldAlert className="w-7 h-7" />
            </div>

            <div className="text-center space-y-1.5">
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                {language === 'hi' ? 'चेतावनी: क्या आप वाकई यह लिंक खोलना चाहते हैं?' : 'Warning: Open Flagged Link?'}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                {language === 'hi'
                  ? 'स्थानीय सुरक्षा जांच में इस लिंक में संदिग्ध या उच्च-जोखिम वाले पैटर्न पाए गए हैं।'
                  : 'Our local heuristics flagged high-risk or suspicious patterns in this URL. Only proceed if you independently trust this exact web destination.'}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-[11px] font-mono break-all text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              {scanResult.raw}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowOpenConfirmModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition-all cursor-pointer"
              >
                {language === 'hi' ? 'रद्द करें (सुरक्षित रहें)' : 'Cancel (Stay Safe)'}
              </button>
              <button
                onClick={() => {
                  setShowOpenConfirmModal(false);
                  window.open(scanResult.raw, '_blank', 'noopener,noreferrer');
                }}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                {language === 'hi' ? 'फिर भी खोलें' : 'Open Anyway'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
