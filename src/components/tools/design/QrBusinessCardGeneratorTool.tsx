import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { 
  Download, 
  QrCode, 
  Copy, 
  Check, 
  User, 
  Briefcase, 
  Building2, 
  Phone, 
  Mail, 
  Globe, 
  MapPin, 
  Sparkles, 
  Palette, 
  Smartphone, 
  Share2, 
  CreditCard 
} from 'lucide-react';

interface QrBusinessCardGeneratorToolProps {
  onShowToast: (message: string) => void;
}

interface CardTheme {
  id: string;
  name: string;
  cardBg: string;
  textColor: string;
  accentColor: string;
  qrDark: string;
  qrLight: string;
}

const THEMES: CardTheme[] = [
  {
    id: 'executive-white',
    name: 'Executive Minimalist',
    cardBg: 'bg-white border-slate-200 shadow-xl',
    textColor: 'text-slate-900',
    accentColor: 'text-indigo-600',
    qrDark: '#0f172a',
    qrLight: '#ffffff'
  },
  {
    id: 'obsidian-dark',
    name: 'Obsidian Matte Dark',
    cardBg: 'bg-slate-950 border-slate-800 shadow-2xl text-white',
    textColor: 'text-white',
    accentColor: 'text-cyan-400',
    qrDark: '#020617',
    qrLight: '#ffffff'
  },
  {
    id: 'royal-indigo',
    name: 'Royal Indigo Gradient',
    cardBg: 'bg-gradient-to-br from-indigo-700 via-indigo-900 to-purple-950 border-indigo-500/40 shadow-2xl text-white',
    textColor: 'text-white',
    accentColor: 'text-indigo-200',
    qrDark: '#312e81',
    qrLight: '#ffffff'
  },
  {
    id: 'emerald-luxe',
    name: 'Emerald Luxe',
    cardBg: 'bg-gradient-to-br from-emerald-800 via-teal-900 to-slate-950 border-emerald-500/40 shadow-2xl text-white',
    textColor: 'text-white',
    accentColor: 'text-emerald-300',
    qrDark: '#064e3b',
    qrLight: '#ffffff'
  },
  {
    id: 'cyberpunk-neon',
    name: 'Sunset Cyberpunk',
    cardBg: 'bg-gradient-to-br from-pink-600 via-rose-700 to-indigo-950 border-pink-500/40 shadow-2xl text-white',
    textColor: 'text-white',
    accentColor: 'text-pink-200',
    qrDark: '#831843',
    qrLight: '#ffffff'
  }
];

export const QrBusinessCardGeneratorTool: React.FC<QrBusinessCardGeneratorToolProps> = ({ onShowToast }) => {
  const [fullName, setFullName] = useState<string>('Alex Morgan');
  const [title, setTitle] = useState<string>('Principal Architect & Lead Director');
  const [company, setCompany] = useState<string>('Zubware Technologies');
  const [department, setDepartment] = useState<string>('Product Engineering');
  const [phone, setPhone] = useState<string>('+1 (555) 234-5678');
  const [mobilePhone, setMobilePhone] = useState<string>('+1 (555) 987-6543');
  const [email, setEmail] = useState<string>('alex.morgan@zubware.com');
  const [website, setWebsite] = useState<string>('https://zubware.com');
  const [address, setAddress] = useState<string>('742 Innovation Blvd, San Francisco, CA');
  const [linkedIn, setLinkedIn] = useState<string>('linkedin.com/in/alexmorgan');

  const [selectedThemeId, setSelectedThemeId] = useState<string>('executive-white');
  const [qrColorDark, setQrColorDark] = useState<string>('#0f172a');
  const [copiedVCard, setCopiedVCard] = useState<boolean>(false);
  const [activeSide, setActiveSide] = useState<'front' | 'back'>('front');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const cardPreviewRef = useRef<HTMLDivElement | null>(null);

  const selectedTheme = THEMES.find(t => t.id === selectedThemeId) || THEMES[0];

  const getVCardString = () => {
    const names = fullName.trim().split(' ');
    const lastName = names.length > 1 ? names[names.length - 1] : '';
    const firstName = names.length > 1 ? names.slice(0, -1).join(' ') : names[0];

    return `BEGIN:VCARD
VERSION:3.0
N:${lastName};${firstName};;;
FN:${fullName}
ORG:${company}${department ? ';' + department : ''}
TITLE:${title}
TEL;TYPE=WORK,VOICE:${phone}
TEL;TYPE=CELL,VOICE:${mobilePhone || phone}
EMAIL;TYPE=PREF,INTERNET:${email}
URL:${website}
ADR;TYPE=WORK:;;${address};;;;
X-SOCIALPROFILE;TYPE=linkedin:${linkedIn}
NOTE:Generated with Zubware QR Business Card Generator
END:VCARD`;
  };

  useEffect(() => {
    if (!canvasRef.current) return;
    const vcard = getVCardString();

    QRCode.toCanvas(
      canvasRef.current,
      vcard,
      {
        width: 220,
        margin: 2,
        color: {
          dark: qrColorDark || selectedTheme.qrDark,
          light: '#ffffff'
        },
        errorCorrectionLevel: 'M'
      },
      (err) => {
        if (err) console.error(err);
      }
    );
  }, [fullName, phone, mobilePhone, email, website, company, department, title, address, linkedIn, qrColorDark, selectedTheme]);

  const downloadQrCode = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = `${fullName.toLowerCase().replace(/\s+/g, '-')}-contact-qr.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
    onShowToast('Downloaded high-resolution QR code PNG!');
  };

  const downloadVCardFile = () => {
    const vcard = getVCardString();
    const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fullName.toLowerCase().replace(/\s+/g, '_')}_contact.vcf`;
    a.click();
    URL.revokeObjectURL(url);
    onShowToast('Downloaded .vcf contact card file!');
  };

  const copyVCardText = () => {
    navigator.clipboard.writeText(getVCardString());
    setCopiedVCard(true);
    onShowToast('Copied vCard raw text to clipboard!');
    setTimeout(() => setCopiedVCard(false), 2000);
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      {/* Title Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            Digital QR Business Card & vCard Studio
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Create standard vCard 3.0 contact cards that scan instantly on iPhone & Android with custom card styling and exports.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={downloadQrCode}
            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download QR (PNG)</span>
          </button>

          <button
            onClick={downloadVCardFile}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Download .vcf Card</span>
          </button>

          <button
            onClick={copyVCardText}
            className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 font-bold text-xs shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
          >
            {copiedVCard ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedVCard ? 'Copied' : 'Copy vCard'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Form Inputs + Live Card Mockup */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Inputs (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Theme Selector */}
          <div className="glass-card p-5 rounded-3xl space-y-3">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <Palette className="w-4 h-4 text-indigo-500" /> Card Theme & Palette
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {THEMES.map((th) => (
                <button
                  key={th.id}
                  onClick={() => {
                    setSelectedThemeId(th.id);
                    setQrColorDark(th.qrDark);
                  }}
                  className={`p-3 rounded-2xl border text-xs font-bold flex flex-col gap-1 text-left transition-all ${
                    selectedThemeId === th.id
                      ? 'border-indigo-600 ring-2 ring-indigo-500/20 shadow-md bg-indigo-50/20 dark:bg-slate-800'
                      : 'border-slate-200 dark:border-slate-800 hover:border-indigo-400 bg-white dark:bg-slate-900'
                  }`}
                >
                  <span className="text-slate-900 dark:text-white line-clamp-1">{th.name}</span>
                  <div className="w-full h-2 rounded-full" style={{ backgroundColor: th.qrDark }} />
                </button>
              ))}
            </div>
          </div>

          {/* Form Fields */}
          <div className="glass-card p-6 rounded-3xl space-y-4">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-2">
              Contact & Professional Profile
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Full Legal / Display Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-semibold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Job Title / Designation</label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-semibold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Company / Organization</label>
                <input
                  type="text"
                  value={company}
                  onChange={e => setCompany(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-semibold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Department / Division</label>
                <input
                  type="text"
                  value={department}
                  onChange={e => setDepartment(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-semibold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Work Phone Number</label>
                <input
                  type="text"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-semibold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Mobile / Cell Phone</label>
                <input
                  type="text"
                  value={mobilePhone}
                  onChange={e => setMobilePhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-semibold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Professional Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-semibold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Official Website URL</label>
                <input
                  type="text"
                  value={website}
                  onChange={e => setWebsite(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-semibold"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Physical Office Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-semibold"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">LinkedIn Profile</label>
                <input
                  type="text"
                  value={linkedIn}
                  onChange={e => setLinkedIn(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-semibold"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Live Card Preview (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between text-xs px-1">
            <span className="font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-indigo-500" /> Live Business Card Preview
            </span>
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              <button
                onClick={() => setActiveSide('front')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  activeSide === 'front' ? 'bg-white dark:bg-slate-900 text-indigo-600 shadow-sm' : 'text-slate-500'
                }`}
              >
                Front View
              </button>
              <button
                onClick={() => setActiveSide('back')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  activeSide === 'back' ? 'bg-white dark:bg-slate-900 text-indigo-600 shadow-sm' : 'text-slate-500'
                }`}
              >
                Back (QR Only)
              </button>
            </div>
          </div>

          {/* Physical Ratio Card (3.5" x 2" standard proportions: w:h = 1.75) */}
          <div
            ref={cardPreviewRef}
            className={`w-full aspect-[1.75] rounded-3xl p-6 border transition-all duration-300 flex flex-col justify-between ${selectedTheme.cardBg}`}
          >
            {activeSide === 'front' ? (
              <>
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-60 block">
                      {company}
                    </span>
                    <h4 className={`text-lg font-black tracking-tight ${selectedTheme.textColor}`}>
                      {fullName}
                    </h4>
                    <p className={`text-xs font-bold ${selectedTheme.accentColor}`}>
                      {title}
                    </p>
                  </div>

                  {/* QR Stamp */}
                  <div className="p-1.5 bg-white rounded-xl shadow-md border border-slate-200/40 shrink-0">
                    <canvas ref={canvasRef} className="w-20 h-20 rounded" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px] opacity-85 pt-3 border-t border-current/10">
                  <div className="flex items-center gap-1.5 truncate">
                    <Phone className="w-3 h-3 shrink-0 opacity-70" />
                    <span className="truncate">{phone}</span>
                  </div>
                  <div className="flex items-center gap-1.5 truncate">
                    <Mail className="w-3 h-3 shrink-0 opacity-70" />
                    <span className="truncate">{email}</span>
                  </div>
                  <div className="flex items-center gap-1.5 truncate">
                    <Globe className="w-3 h-3 shrink-0 opacity-70" />
                    <span className="truncate">{website.replace(/^https?:\/\//, '')}</span>
                  </div>
                  <div className="flex items-center gap-1.5 truncate">
                    <MapPin className="w-3 h-3 shrink-0 opacity-70" />
                    <span className="truncate">{address}</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center space-y-3">
                <div className="p-2 bg-white rounded-2xl shadow-xl">
                  <canvas ref={canvasRef} className="w-32 h-32 rounded-lg" />
                </div>
                <div className="text-center">
                  <span className={`text-xs font-black uppercase tracking-wider block ${selectedTheme.textColor}`}>
                    Scan to Save Contact
                  </span>
                  <span className="text-[10px] opacity-70">Works with standard Camera app</span>
                </div>
              </div>
            )}
          </div>

          {/* Quick Info Callout */}
          <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-slate-900/60 border border-indigo-500/20 text-xs text-slate-600 dark:text-slate-400 space-y-1">
            <div className="font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> Universal Compatibility Guarantee
            </div>
            <p className="text-[11px] leading-relaxed">
              When someone points their smartphone camera at this QR code, iOS and Android automatically show a prompt: <span className="font-semibold text-slate-800 dark:text-slate-200">"Add to Contacts"</span> with all fields populated.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
