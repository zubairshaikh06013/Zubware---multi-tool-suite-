import React, { useState, useEffect, useRef, useCallback } from 'react';
import { buildQrPayload, type QrContentType } from '../../lib/qrPayload';
import { renderQrSvg, qrContrast, escapeXml, type QrDesign } from '../../lib/qrCodeDesign';
import { jsPDF } from 'jspdf';
import {
  Download,
  Copy,
  Check,
  Wifi,
  User,
  Link as LinkIcon,
  Mail,
  Phone,
  MessageSquare,
  MapPin,
  Calendar,
  CreditCard,
  Palette,
  Image as ImageIcon,
  Sparkles,
  Sliders,
  Share2,
  Printer,
  History,
  Trash2,
  Upload,
  RefreshCw,
  FileCode,
  FileText,
  RotateCcw
} from 'lucide-react';

interface QrGeneratorToolProps {
  onShowToast: (msg: string) => void;
}

type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';
type DotStyle = 'square' | 'dots' | 'rounded' | 'classy' | 'diamond';
type CornerStyle = 'square' | 'rounded' | 'circle';

interface QrHistoryItem {
  id: string;
  type: QrContentType;
  title: string;
  content: string;
  timestamp: number;
}

const COLOR_PRESETS = [
  { name: 'Classic Slate', fg: '#0f172a', bg: '#ffffff' },
  { name: 'Indigo Accent', fg: '#4f46e5', bg: '#ffffff' },
  { name: 'Emerald Pay', fg: '#059669', bg: '#f0fdf4' },
  { name: 'Royal Violet', fg: '#7c3aed', bg: '#faf5ff' },
  { name: 'Crimson Bold', fg: '#dc2626', bg: '#fff1f2' },
  { name: 'Cyber Amber', fg: '#d97706', bg: '#fffbeb' },
  { name: 'Deep Ocean', fg: '#0284c7', bg: '#f0f9ff' },
  { name: 'Dark Mode Invert', fg: '#f8fafc', bg: '#0f172a' },
  { name: 'Midnight Blue', fg: '#172554', bg: '#eff6ff' },
  { name: 'Forest Green', fg: '#14532d', bg: '#f0fdf4' },
  { name: 'Coffee Brown', fg: '#78350f', bg: '#fffbeb' },
  { name: 'Rose Boutique', fg: '#9f1239', bg: '#fff1f2' },
  { name: 'Graphite', fg: '#262626', bg: '#fafafa' },
  { name: 'Teal Studio', fg: '#115e59', bg: '#f0fdfa' },
  { name: 'Plum', fg: '#701a75', bg: '#fdf4ff' },
  { name: 'Copper', fg: '#9a3412', bg: '#fff7ed' },
  { name: 'Navy Corporate', fg: '#1e3a8a', bg: '#eff6ff' },
  { name: 'Olive Market', fg: '#365314', bg: '#f7fee7' },
  { name: 'Burgundy Wine', fg: '#881337', bg: '#fff1f2' },
  { name: 'Ocean Teal', fg: '#134e4a', bg: '#ccfbf1' },
  { name: 'Ink & Cream', fg: '#292524', bg: '#fefce8' },
  { name: 'Purple Night', fg: '#581c87', bg: '#faf5ff' },
  { name: 'Terracotta', fg: '#7c2d12', bg: '#ffedd5' },
  { name: 'Deep Cyan', fg: '#155e75', bg: '#ecfeff' }
];

const QUICK_TEMPLATES = [
  { label: 'Google Search', type: 'url' as const, val: 'https://www.google.com' },
  { label: 'Instagram Profile', type: 'url' as const, val: 'https://instagram.com/yourbrand' },
  { label: 'YouTube Channel', type: 'url' as const, val: 'https://youtube.com/@yourchannel' },
  { label: 'LinkedIn Page', type: 'url' as const, val: 'https://linkedin.com/in/yourprofile' }
];

export const QrGeneratorTool: React.FC<QrGeneratorToolProps> = ({ onShowToast }) => {


  // Content Type
  const [qrType, setQrType] = useState<QrContentType>('url');

  // URL / Text State
  const [textValue, setTextValue] = useState('https://www.zubware.com');

  // WiFi State
  const [wifiSsid, setWifiSsid] = useState('');
  const [wifiPass, setWifiPass] = useState('');
  const [wifiEnc, setWifiEnc] = useState<'WPA' | 'WEP' | 'nopass'>('WPA');
  const [wifiHidden, setWifiHidden] = useState(false);

  // VCard State
  const [vFirstName, setVFirstName] = useState('');
  const [vLastName, setVLastName] = useState('');
  const [vOrg, setVOrg] = useState('');
  const [vTitle, setVTitle] = useState('');
  const [vPhone, setVPhone] = useState('');
  const [vEmail, setVEmail] = useState('');
  const [vUrl, setVUrl] = useState('');
  const [vAddress, setVAddress] = useState('');

  // Email State
  const [emailTo, setEmailTo] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');

  // Phone & SMS State
  const [phoneNumber, setPhoneNumber] = useState('');
  const [smsMessage, setSmsMessage] = useState('');

  // UPI Payment State (India / Digital Payments)
  const [upiId, setUpiId] = useState('');
  const [upiName, setUpiName] = useState('');
  const [upiAmount, setUpiAmount] = useState('');
  const [upiNote, setUpiNote] = useState('');

  // Geo Location State
  const [geoLat, setGeoLat] = useState('');
  const [geoLng, setGeoLng] = useState('');

  // Calendar Event State
  const [eventTitle, setEventTitle] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [eventStart, setEventStart] = useState('');
  const [eventEnd, setEventEnd] = useState('');
  const [eventDescription, setEventDescription] = useState('');

  // Visual Customization
  const [fgColor, setFgColor] = useState('#0f172a');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [transparentBg, setTransparentBg] = useState(false);
  const [qrSize, setQrSize] = useState<number>(320);
  const [margin, setMargin] = useState<number>(4);
  const [errorCorrection, setErrorCorrection] = useState<ErrorCorrectionLevel>('H');
  const [dotStyle, setDotStyle] = useState<DotStyle>('square');
  const [cornerStyle, setCornerStyle] = useState<CornerStyle>('square');

  // Gradient options
  const [useGradient, setUseGradient] = useState(false);
  const [fgColor2, setFgColor2] = useState('#4f46e5');
  const [gradientType, setGradientType] = useState<'linear' | 'radial'>('linear');

  // Center Logo
  const [logoImage, setLogoImage] = useState<string | null>(null);
  const [logoSize, setLogoSize] = useState<number>(16); // percent of QR code
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Call-To-Action Frame
  const [frameText, setFrameText] = useState('');
  const [frameColor, setFrameColor] = useState('#0f172a');
  const [framePosition, setFramePosition] = useState<'bottom' | 'top'>('bottom');

  // Canvas Refs & State
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<QrHistoryItem[]>([]);
  const [activeTab, setActiveTab] = useState<'content' | 'design' | 'logo' | 'history'>('content');

  const [historyEnabled, setHistoryEnabled] = useState(false);
  const [rendered, setRendered] = useState<(ReturnType<typeof renderQrSvg> & { key: string }) | null>(null);
  const [renderError, setRenderError] = useState('');
  const [scanResult, setScanResult] = useState<{ key: string; message: string; passed: boolean } | null>(null);
  const [logoLoading, setLogoLoading] = useState(false);
  const logoRequest = useRef(0);
  const renderRequest = useRef(0);

  // Load existing history for deletion/restoration, but never opt users in automatically.
  // Load History from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('zubware_qr_history');
      if (saved) {
        const items: unknown = JSON.parse(saved);
        if (Array.isArray(items)) setHistory(items.filter(item => item && typeof item.id === 'string' && typeof item.title === 'string' && typeof item.content === 'string' && item.content.length <= 5000).slice(0, 10));
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  // Save item to history
  const saveToHistory = useCallback((type: QrContentType, content: string) => {
    if (!historyEnabled) return;
    try {
      const title =
        type === 'url' ? content :
        type === 'wifi' ? `WiFi: ${wifiSsid || 'Network'}` :
        type === 'vcard' ? `Contact: ${vFirstName} ${vLastName}`.trim() :
        type === 'upi' ? `UPI: ${upiId} (${upiAmount ? '₹' + upiAmount : 'Any'})` :
        type === 'email' ? `Email: ${emailTo}` :
        type === 'phone' ? `Phone: ${phoneNumber}` :
        type === 'sms' ? `SMS: ${phoneNumber}` :
        type === 'geo' ? `Geo: ${geoLat}, ${geoLng}` :
        type === 'event' ? `Event: ${eventTitle}` : 'QR Code';

      const newItem: QrHistoryItem = {
        id: String(Date.now()),
        type,
        title: title || 'Custom QR',
        content,
        timestamp: Date.now()
      };

      setHistory(prev => {
        const filtered = prev.filter(h => h.content !== content);
        const updated = [newItem, ...filtered].slice(0, 10);
        localStorage.setItem('zubware_qr_history', JSON.stringify(updated));
        return updated;
      });
    } catch {
      // Ignore
    }
  }, [historyEnabled, wifiSsid, vFirstName, vLastName, upiId, upiAmount, emailTo, phoneNumber, geoLat, geoLng, eventTitle]);

  const clearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem('zubware_qr_history');
      onShowToast('Cleared QR history');
    } catch {
      // Ignore
    }
  };

  let payload = '';
  let validationError = '';
  try {
    payload = buildQrPayload(qrType, {
      textValue, wifiSsid, wifiPass, wifiEnc, wifiHidden,
      vFirstName, vLastName, vOrg, vTitle, vPhone, vEmail, vUrl, vAddress,
      emailTo, emailSubject, emailBody, phoneNumber, smsMessage,
      upiId, upiName, upiAmount, upiNote, geoLat, geoLng,
      eventTitle, eventStart, eventEnd, eventLocation, eventDescription
    });
  } catch (error) { validationError = error instanceof Error ? error.message : 'Check your content.'; }
  const design: QrDesign = {
    qrSize, margin, fgColor, bgColor, transparentBg, errorCorrection, dotStyle, cornerStyle,
    useGradient, fgColor2, gradientType, logoImage, logoSize, frameText, frameColor, framePosition
  };
  const renderKey = JSON.stringify({ payload, validationError, design });
  const ready = !validationError && !renderError && !logoLoading && rendered?.key === renderKey;
  const getConstructedText = () => payload;
  const contrast = qrContrast(design);

  useEffect(() => {
    const request = ++renderRequest.current;
    setRenderError('');
    setRendered(null);
    const canvas = canvasRef.current;
    canvas?.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height);
    if (validationError) return;
    let cancelled = false;
    const timer = window.setTimeout(() => {
      try {
        const output = renderQrSvg(payload, design);
        const image = new Image();
        image.onload = () => {
          if (cancelled || request !== renderRequest.current || !canvas) return;
          const context = canvas.getContext('2d');
          if (!context) { setRenderError('This browser cannot create a canvas preview.'); return; }
          canvas.width = output.width;
          canvas.height = output.height;
          context.drawImage(image, 0, 0);
          setRendered({ ...output, key: renderKey });
        };
        image.onerror = () => {
          if (!cancelled) setRenderError('Could not render this design. Remove the logo or try a simpler style.');
        };
        image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(output.svg)}`;
      } catch (error) {
        if (!cancelled) setRenderError(error instanceof Error ? error.message : 'Could not generate this code.');
      }
    }, 150);
    return () => { cancelled = true; window.clearTimeout(timer); };
  }, [renderKey]);

  useEffect(() => () => { logoRequest.current += 1; }, []);
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    const request = ++logoRequest.current;
    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type) || file.size > 2 * 1024 * 1024) {
      setLogoLoading(false);
      onShowToast('Choose a PNG, JPEG or WebP logo up to 2 MB.');
      return;
    }
    setLogoLoading(true);
    const url = URL.createObjectURL(file);
    try {
      const image = new Image();
      await new Promise<void>((resolve, reject) => {
        image.onload = () => resolve();
        image.onerror = () => reject(new Error('The logo image could not be read.'));
        image.src = url;
      });
      if (image.width * image.height > 24000000) throw new Error('Choose a logo smaller than 24 megapixels.');
      const canvas = document.createElement('canvas');
      const scale = Math.min(1, 1024 / Math.max(image.width, image.height));
      canvas.width = Math.max(1, Math.round(image.width * scale));
      canvas.height = Math.max(1, Math.round(image.height * scale));
      const context = canvas.getContext('2d');
      if (!context) throw new Error('Image processing is unavailable in this browser.');
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      if (request === logoRequest.current) {
        setLogoImage(canvas.toDataURL('image/png'));
        onShowToast('Logo added. Run the scan test before downloading.');
      }
    } catch (error) {
      if (request === logoRequest.current) onShowToast(error instanceof Error ? error.message : 'Logo upload failed.');
    } finally {
      URL.revokeObjectURL(url);
      if (request === logoRequest.current) setLogoLoading(false);
    }
  };

  const testScan = async () => {
    if (!ready || !canvasRef.current) return;
    try {
      const source = canvasRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = source.width; canvas.height = source.height;
      const context = canvas.getContext('2d');
      if (!context) throw new Error('Canvas unavailable');
      context.fillStyle = '#ffffff'; context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(source, 0, 0);
      const pixels = context.getImageData(0, 0, canvas.width, canvas.height);
      const { default: jsQR } = await import('jsqr');
      const decoded = jsQR(pixels.data, pixels.width, pixels.height, { inversionAttempts: 'attemptBoth' });
      const passed = decoded?.data === payload;
      setScanResult({ key: renderKey, passed, message: passed
        ? 'Passed: the preview decodes to your exact content. Also test the downloaded file and a printed sample with your phone.'
        : 'This design did not decode correctly. Use scan-friendly defaults, shorten the content or reduce the logo, then test again.' });
    } catch { setScanResult({ key: renderKey, passed: false, message: 'Scan test could not run in this browser. Test with your phone before use.' }); }
  };
  const resetDesign = () => {
    setFgColor('#0f172a'); setBgColor('#ffffff'); setTransparentBg(false); setUseGradient(false);
    setDotStyle('square'); setCornerStyle('square'); setMargin(4); setErrorCorrection('H');
    logoRequest.current += 1; setLogoLoading(false); setLogoImage(null); setQrSize(640);
  };

  // Export Formats
  const downloadPng = () => {
    if (!ready || !canvasRef.current) return;
    try {
      canvasRef.current.toBlob(blob => {
        if (!blob) { onShowToast('Could not create a PNG. Try again or download SVG.'); return; }
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `qr-code-${qrType}.png`;
        link.click();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        saveToHistory(qrType, payload);
        onShowToast('PNG download started.');
      }, 'image/png');
    } catch { onShowToast('PNG export failed. Try a simpler design or download SVG.'); }
  };

  const downloadSvg = async () => {
    try {
      const content = getConstructedText();
      if (!ready || !rendered) return;
      const svgString = rendered.svg;

      const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `qr-code-${qrType}.svg`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      saveToHistory(qrType, content);
      onShowToast('Downloaded Scalable Vector SVG!');
    } catch {
      onShowToast('Failed to generate SVG vector.');
    }
  };

  const downloadPdf = () => {
    if (!ready || !canvasRef.current) return;
    try {
      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const imgData = canvasRef.current.toDataURL('image/png');
      doc.setFontSize(18);
      doc.text('Zubware QR Code Print Sheet', 105, 30, { align: 'center' });
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Type: ${qrType.toUpperCase()} • Generated with Zubware.com`, 105, 38, { align: 'center' });

      // Preserve the frame aspect ratio on the A4 print sheet.
      const printHeight = 120 * canvasRef.current.height / canvasRef.current.width;
      doc.addImage(imgData, 'PNG', 45, 50, 120, printHeight);

      doc.setFontSize(11);
      doc.setTextColor(50);
      doc.text('Test this printed code with your phone before distribution.', 105, 65 + printHeight, { align: 'center' });

      doc.save(`qr-code-${qrType}.pdf`);
      saveToHistory(qrType, getConstructedText());
      onShowToast('Downloaded printable A4 PDF!');
    } catch {
      onShowToast('PDF generation failed.');
    }
  };

  const copyToClipboard = async () => {
    if (!ready || !canvasRef.current) return;
    canvasRef.current.toBlob(async (blob) => {
      if (!blob) { onShowToast('Could not copy the image. Try downloading PNG.'); return; }
      try {
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
        setCopied(true);
        saveToHistory(qrType, getConstructedText());
        onShowToast('Copied QR Code image to clipboard!');
        setTimeout(() => setCopied(false), 2000);
      } catch {
        onShowToast('Clipboard access is unavailable. Use PNG Image to download instead.');
      }
    });
  };

  const printQrCode = () => {
    if (!ready || !canvasRef.current) return;
    const dataUrl = canvasRef.current.toDataURL();
    const win = window.open('', '_blank');
    if (win) {
      win.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Print QR Code — Zubware</title>
            <style>
              body { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; font-family: sans-serif; }
              img { max-width: 80%; max-height: 80vh; object-fit: contain; }
              p { margin-top: 1rem; font-size: 1.25rem; font-weight: bold; color: #333; }
            </style>
          </head>
          <body>
            <img src="${dataUrl}" />
            <p>${escapeXml(frameText.trim() || 'Scan with Camera')}</p>
            <script>
              window.onload = function() { window.print(); window.close(); }
            </script>
          </body>
        </html>
      `);
      win.document.close();
    } else { onShowToast('Allow pop-ups to print, or download the A4 PDF.'); }
  };

  return (
    <div className="w-full max-w-5xl mx-auto my-6 glass-panel rounded-3xl p-6 sm:p-8 space-y-6">
      {/* Main Mode Navigation Tabs */}
      <div className="flex flex-wrap gap-2 justify-center border-b border-slate-200 dark:border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('content')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'content'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'glass-btn text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <FileCode className="w-4 h-4" /> 1. Content & Type
        </button>
        <button
          onClick={() => setActiveTab('design')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'design'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'glass-btn text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Palette className="w-4 h-4" /> 2. Colors & Shapes
        </button>
        <button
          onClick={() => setActiveTab('logo')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'logo'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'glass-btn text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <ImageIcon className="w-4 h-4" /> 3. Logo & CTA Frame
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'history'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'glass-btn text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <History className="w-4 h-4" /> History ({history.length})
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form Controls */}
        <div className="lg:col-span-7 space-y-6">
          {/* TAB 1: CONTENT TYPE */}
          {activeTab === 'content' && (
            <div className="space-y-5">
              {/* Type Pill Selector */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                  Select Data Format
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {[
                    { id: 'url' as const, label: 'URL / Text', icon: LinkIcon },
                    { id: 'wifi' as const, label: 'WiFi', icon: Wifi },
                    { id: 'vcard' as const, label: 'vCard', icon: User },
                    { id: 'upi' as const, label: 'UPI Pay', icon: CreditCard },
                    { id: 'email' as const, label: 'Email', icon: Mail },
                    { id: 'phone' as const, label: 'Phone', icon: Phone },
                    { id: 'sms' as const, label: 'SMS', icon: MessageSquare },
                    { id: 'whatsapp' as const, label: 'WhatsApp', icon: MessageSquare },
                    { id: 'geo' as const, label: 'Location', icon: MapPin },
                    { id: 'event' as const, label: 'Event', icon: Calendar }
                  ].map((item) => {
                    const Icon = item.icon;
                    const isSelected = qrType === item.id;
                    return (
                      <button
                        key={item.id}
                        aria-pressed={isSelected}
                        onClick={() => setQrType(item.id)}
                        className={`p-2.5 rounded-xl flex flex-col items-center justify-center gap-1 text-xs font-bold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                            : 'glass-card text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-[11px] truncate">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {qrType === 'whatsapp' && <p className="text-sm">Use the full country code and an active WhatsApp number. The optional message is prefilled, never sent automatically.</p>}
              {qrType === 'event' && <p className="text-sm">Enter times in your device time zone ({Intl.DateTimeFormat().resolvedOptions().timeZone}). They are encoded in UTC. Check the imported event before saving.</p>}
              {qrType === 'upi' && <p className="text-sm">Use your verified UPI ID. The generator cannot verify the payee; confirm the recipient in your payment app before paying.</p>}
              {qrType === 'sms' && <p className="text-sm">SMS message prefilling varies by phone and scanning app. Test on the devices your audience uses.</p>}
              {/* Dynamic Inputs per Content Type */}
              <div className="glass-card p-4 sm:p-5 rounded-2xl space-y-4">
                {/* 1. URL / Plain Text */}
                {qrType === 'url' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold uppercase text-slate-700 dark:text-slate-300">
                        Website URL or Any Text
                      </label>
                      <span className="text-[11px] text-slate-400">{textValue.length} characters</span>
                    </div>
                    <textarea aria-label="Website URL or text"
                      rows={3}
                      value={textValue}
                      onChange={(e) => setTextValue(e.target.value)}
                      placeholder="https://yourwebsite.com or any plain text..."
                      className="w-full p-3 rounded-xl glass-input text-sm font-semibold text-slate-900 dark:text-white"
                    />
                    <div className="flex flex-wrap gap-2 pt-1">
                      <span className="text-[11px] font-bold text-slate-400 self-center">Quick Presets:</span>
                      {QUICK_TEMPLATES.map((tmpl, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setTextValue(tmpl.val)}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] font-medium text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600 transition-colors"
                        >
                          {tmpl.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 2. WiFi Network */}
                {qrType === 'wifi' && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                        Network Name (SSID)
                      </label>
                      <input aria-label="Wi-Fi network name"
                        type="text"
                        value={wifiSsid}
                        onChange={(e) => setWifiSsid(e.target.value)}
                        placeholder="e.g. Office_Guest_WiFi_5G"
                        className="w-full p-2.5 rounded-xl glass-input text-sm font-semibold text-slate-900 dark:text-white"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                          Password
                        </label>
                        <input aria-label="Wi-Fi password"
                          type="text"
                          value={wifiPass}
                          disabled={wifiEnc === 'nopass'}
                          onChange={(e) => setWifiPass(e.target.value)}
                          placeholder="Password"
                          className="w-full p-2.5 rounded-xl glass-input text-sm font-semibold text-slate-900 dark:text-white disabled:opacity-50"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                          Security Type
                        </label>
                        <select aria-label="Wi-Fi security"
                          value={wifiEnc}
                          onChange={(e) => setWifiEnc(e.target.value as any)}
                          className="w-full p-2.5 rounded-xl glass-input text-sm font-semibold text-slate-900 dark:text-white"
                        >
                          <option value="WPA">WPA / WPA2 Personal</option>
                          <option value="WEP">WEP</option>
                          <option value="nopass">None (Open Network)</option>
                        </select>
                      </div>
                    </div>
                    <label className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-400 cursor-pointer pt-1">
                      <input
                        type="checkbox"
                        checked={wifiHidden}
                        onChange={(e) => setWifiHidden(e.target.checked)}
                        className="rounded text-indigo-600"
                      />
                      <span>Hidden SSID Network</span>
                    </label>
                  </div>
                )}

                {/* 3. vCard Digital Contact */}
                {qrType === 'vcard' && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">First Name</label>
                        <input aria-label="First name"
                          type="text"
                          value={vFirstName}
                          onChange={(e) => setVFirstName(e.target.value)}
                          placeholder="John"
                          className="w-full p-2.5 rounded-xl glass-input text-sm font-semibold text-slate-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">Last Name</label>
                        <input aria-label="Last name"
                          type="text"
                          value={vLastName}
                          onChange={(e) => setVLastName(e.target.value)}
                          placeholder="Doe"
                          className="w-full p-2.5 rounded-xl glass-input text-sm font-semibold text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">Phone Number</label>
                        <input aria-label="Contact phone"
                          type="tel"
                          value={vPhone}
                          onChange={(e) => setVPhone(e.target.value)}
                          placeholder="+1 555 123 4567"
                          className="w-full p-2.5 rounded-xl glass-input text-sm font-semibold text-slate-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                        <input aria-label="Contact email"
                          type="email"
                          value={vEmail}
                          onChange={(e) => setVEmail(e.target.value)}
                          placeholder="john@example.com"
                          className="w-full p-2.5 rounded-xl glass-input text-sm font-semibold text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">Company / Org</label>
                        <input aria-label="Organization"
                          type="text"
                          value={vOrg}
                          onChange={(e) => setVOrg(e.target.value)}
                          placeholder="Acme Inc."
                          className="w-full p-2.5 rounded-xl glass-input text-sm font-semibold text-slate-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">Job Title</label>
                        <input aria-label="Job title"
                          type="text"
                          value={vTitle}
                          onChange={(e) => setVTitle(e.target.value)}
                          placeholder="Product Manager"
                          className="w-full p-2.5 rounded-xl glass-input text-sm font-semibold text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">Website URL</label>
                      <input aria-label="Contact website"
                        type="url"
                        value={vUrl}
                        onChange={(e) => setVUrl(e.target.value)}
                        placeholder="https://example.com"
                        className="w-full p-2.5 rounded-xl glass-input text-sm font-semibold text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>
                )}

                {/* 4. UPI Payment */}
                {qrType === 'upi' && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                        UPI VPA ID (e.g. mobile@upi, merchant@okaxis)
                      </label>
                      <input aria-label="UPI ID"
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="merchant@okhdfcbank"
                        className="w-full p-2.5 rounded-xl glass-input text-sm font-semibold text-slate-900 dark:text-white"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                          Payee / Business Name
                        </label>
                        <input aria-label="Upi name"
                          type="text"
                          value={upiName}
                          onChange={(e) => setUpiName(e.target.value)}
                          placeholder="My Store"
                          className="w-full p-2.5 rounded-xl glass-input text-sm font-semibold text-slate-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                          Amount in INR (Optional)
                        </label>
                        <input aria-label="Upi amount"
                          type="number"
                          value={upiAmount}
                          onChange={(e) => setUpiAmount(e.target.value)}
                          placeholder="Leave empty for any amount"
                          className="w-full p-2.5 rounded-xl glass-input text-sm font-semibold text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                        Transaction Note / Bill Reference
                      </label>
                      <input aria-label="Upi note"
                        type="text"
                        value={upiNote}
                        onChange={(e) => setUpiNote(e.target.value)}
                        placeholder="Invoice #1048"
                        className="w-full p-2.5 rounded-xl glass-input text-sm font-semibold text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>
                )}

                {/* 5. Email */}
                {qrType === 'email' && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">Recipient Email</label>
                      <input aria-label="Email to"
                        type="email"
                        value={emailTo}
                        onChange={(e) => setEmailTo(e.target.value)}
                        placeholder="support@example.com"
                        className="w-full p-2.5 rounded-xl glass-input text-sm font-semibold text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">Subject</label>
                      <input aria-label="Email subject"
                        type="text"
                        value={emailSubject}
                        onChange={(e) => setEmailSubject(e.target.value)}
                        placeholder="Feedback or Inquiry"
                        className="w-full p-2.5 rounded-xl glass-input text-sm font-semibold text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">Message Body</label>
                      <textarea aria-label="Email body"
                        rows={2}
                        value={emailBody}
                        onChange={(e) => setEmailBody(e.target.value)}
                        placeholder="Hello, I would like to ask..."
                        className="w-full p-2.5 rounded-xl glass-input text-sm font-semibold text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>
                )}

                {/* 6. Phone Call */}
                {qrType === 'phone' && (
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">Phone Number</label>
                    <input aria-label="Phone number"
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="+1 800 555 0199"
                      className="w-full p-2.5 rounded-xl glass-input text-sm font-semibold text-slate-900 dark:text-white"
                    />
                  </div>
                )}

                {/* 7. SMS Message */}
                {(qrType === 'sms' || qrType === 'whatsapp') && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">Phone Number</label>
                      <input aria-label="Phone number"
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="+1 800 555 0199"
                        className="w-full p-2.5 rounded-xl glass-input text-sm font-semibold text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">Pre-filled Message (Optional)</label>
                      <textarea aria-label="Sms message"
                        rows={2}
                        value={smsMessage}
                        onChange={(e) => setSmsMessage(e.target.value)}
                        placeholder="JOIN VIP CLUB"
                        className="w-full p-2.5 rounded-xl glass-input text-sm font-semibold text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>
                )}

                {/* 8. Geo Location */}
                {qrType === 'geo' && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">Latitude</label>
                      <input aria-label="Geo lat"
                        type="text"
                        value={geoLat}
                        onChange={(e) => setGeoLat(e.target.value)}
                        placeholder="37.7749"
                        className="w-full p-2.5 rounded-xl glass-input text-sm font-semibold text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">Longitude</label>
                      <input aria-label="Geo lng"
                        type="text"
                        value={geoLng}
                        onChange={(e) => setGeoLng(e.target.value)}
                        placeholder="-122.4194"
                        className="w-full p-2.5 rounded-xl glass-input text-sm font-semibold text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>
                )}

                {/* 9. Calendar Event */}
                {qrType === 'event' && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">Event Title</label>
                      <input aria-label="Event title"
                        type="text"
                        value={eventTitle}
                        onChange={(e) => setEventTitle(e.target.value)}
                        placeholder="Company Annual Meetup"
                        className="w-full p-2.5 rounded-xl glass-input text-sm font-semibold text-slate-900 dark:text-white"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">Start Date & Time</label>
                        <input aria-label="Event start"
                          type="datetime-local"
                          value={eventStart}
                          onChange={(e) => setEventStart(e.target.value)}
                          className="w-full p-2.5 rounded-xl glass-input text-xs font-semibold text-slate-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">End Date & Time</label>
                        <input aria-label="Event end"
                          type="datetime-local"
                          value={eventEnd}
                          onChange={(e) => setEventEnd(e.target.value)}
                          className="w-full p-2.5 rounded-xl glass-input text-xs font-semibold text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">Location</label>
                      <input aria-label="Event location"
                        type="text"
                        value={eventLocation}
                        onChange={(e) => setEventLocation(e.target.value)}
                        placeholder="Grand Ballroom, NYC"
                        className="w-full p-2.5 rounded-xl glass-input text-sm font-semibold text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: DESIGN, COLORS & SHAPES */}
          {activeTab === 'design' && (
            <div className="space-y-5">
              <label className="block text-sm font-semibold">Target QR width
                <select aria-label="Qr size" value={qrSize} onChange={e => setQrSize(Number(e.target.value))} className="w-full mt-2 p-2 glass-input rounded-lg">
                  {[320, 640, 1024, 2048].map(size => <option key={size} value={size}>{size} pixels</option>)}
                </select>
                <span className="text-xs font-normal">Actual size rounds up to whole pixels per module; frame adds height. SVG scales for print.</span>
              </label>
              {/* Color Presets */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                  Curated Brand Color Themes
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {COLOR_PRESETS.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setFgColor(p.fg);
                        setBgColor(p.bg);
                        setTransparentBg(false);
                        setUseGradient(false);
                      }}
                      className="p-2 rounded-xl glass-card text-left flex items-center gap-2 hover:border-indigo-500/50 transition-all cursor-pointer"
                    >
                      <div className="w-6 h-6 rounded-lg border border-slate-300 dark:border-slate-700 shrink-0 flex items-center justify-center overflow-hidden">
                        <div className="w-1/2 h-full" style={{ backgroundColor: p.fg }} />
                        <div className="w-1/2 h-full" style={{ backgroundColor: p.bg }} />
                      </div>
                      <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 truncate">{p.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Color Pickers */}
              <div className="glass-card p-4 rounded-2xl space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                      Foreground Color
                    </label>
                    <div className="flex items-center gap-2">
                      <input aria-label="Foreground color"
                        type="color"
                        value={fgColor}
                        onChange={(e) => setFgColor(e.target.value)}
                        className="w-9 h-9 rounded-lg border-0 cursor-pointer"
                      />
                      <input aria-label="Foreground color"
                        type="text"
                        value={fgColor}
                        onChange={(e) => setFgColor(e.target.value)}
                        className="w-24 p-1.5 rounded-lg glass-input text-xs font-mono font-bold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                      Background Color
                    </label>
                    <div className="flex items-center gap-2">
                      <input aria-label="Background color"
                        type="color"
                        disabled={transparentBg}
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                        className="w-9 h-9 rounded-lg border-0 cursor-pointer disabled:opacity-40"
                      />
                      <input aria-label="Background color"
                        type="text"
                        disabled={transparentBg}
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                        className="w-24 p-1.5 rounded-lg glass-input text-xs font-mono font-bold disabled:opacity-40"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={transparentBg}
                      onChange={(e) => setTransparentBg(e.target.checked)}
                      className="rounded text-indigo-600"
                    />
                    <span>Transparent Background (PNG / SVG Only)</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={useGradient}
                      onChange={(e) => setUseGradient(e.target.checked)}
                      className="rounded text-indigo-600"
                    />
                    <span>Color Gradient Fill</span>
                  </label>
                </div>

                {useGradient && (
                  <div className="p-3 bg-indigo-50/50 dark:bg-slate-800/50 rounded-xl space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">Gradient End Color</label>
                        <div className="flex items-center gap-2">
                          <input aria-label="Gradient end color"
                            type="color"
                            value={fgColor2}
                            onChange={(e) => setFgColor2(e.target.value)}
                            className="w-8 h-8 rounded-lg border-0 cursor-pointer"
                          />
                          <span className="text-xs font-mono font-bold">{fgColor2}</span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">Gradient Type</label>
                        <select aria-label="Gradient type"
                          value={gradientType}
                          onChange={(e) => setGradientType(e.target.value as any)}
                          className="w-full p-2 rounded-lg glass-input text-xs font-semibold"
                        >
                          <option value="linear">Linear Diagonal</option>
                          <option value="radial">Radial Circle</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* One-tap scan-friendly design combinations */}
              <div className="glass-card p-4 rounded-2xl space-y-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Quick QR Design Templates</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Apply a complete color, pattern and eye-style combination. Always run the scan test before printing.</p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { name: 'Classic Print', fg: '#0f172a', bg: '#ffffff', dot: 'square' as const, eye: 'square' as const },
                    { name: 'Soft Indigo', fg: '#312e81', bg: '#eef2ff', dot: 'rounded' as const, eye: 'rounded' as const },
                    { name: 'Cafe Menu', fg: '#78350f', bg: '#fffbeb', dot: 'dots' as const, eye: 'circle' as const },
                    { name: 'Eco Green', fg: '#14532d', bg: '#f0fdf4', dot: 'rounded' as const, eye: 'square' as const },
                    { name: 'Modern Teal', fg: '#115e59', bg: '#f0fdfa', dot: 'classy' as const, eye: 'rounded' as const },
                    { name: 'Royal Purple', fg: '#581c87', bg: '#faf5ff', dot: 'dots' as const, eye: 'rounded' as const }
                  ].map(t => (
                    <button key={t.name} type="button" onClick={() => {
                      setFgColor(t.fg); setBgColor(t.bg); setTransparentBg(false);
                      setUseGradient(false); setDotStyle(t.dot); setCornerStyle(t.eye);
                      setMargin(4); setErrorCorrection('H');
                    }} className="rounded-xl border border-slate-200 dark:border-slate-700 p-3 text-left hover:border-indigo-500 focus-visible:outline-2 focus-visible:outline-indigo-500 transition-colors">
                      <span className="flex gap-1 mb-2" aria-hidden="true">
                        <span className="w-5 h-5 rounded" style={{ backgroundColor: t.fg }} />
                        <span className="w-5 h-5 rounded border border-slate-200" style={{ backgroundColor: t.bg }} />
                      </span>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-100">{t.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Dot & Corner Styles */}
              <div className="glass-card p-4 rounded-2xl space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-2">
                    Body Pattern Shapes
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {[
                      { id: 'square' as const, label: 'Square' },
                      { id: 'dots' as const, label: 'Dots / Circles' },
                      { id: 'rounded' as const, label: 'Rounded' },
                      { id: 'classy' as const, label: 'Smooth' },
                      { id: 'diamond' as const, label: 'Diamond' }
                    ].map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        aria-pressed={dotStyle === s.id}
                        onClick={() => setDotStyle(s.id)}
                        className={`p-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          dotStyle === s.id
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-2">
                    Corner Eye Frame Style
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'square' as const, label: 'Sharp Square' },
                      { id: 'rounded' as const, label: 'Rounded Edge' },
                      { id: 'circle' as const, label: 'Soft Corners' }
                    ].map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        aria-pressed={cornerStyle === c.id}
                        onClick={() => setCornerStyle(c.id)}
                        className={`p-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          cornerStyle === c.id
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                        }`}
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sizing & Margins */}
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      <span>Quiet Zone Margin</span>
                      <span>{margin} modules</span>
                    </div>
                    <input aria-label="Quiet zone in modules"
                      type="range"
                      min={4}
                      max={12}
                      step={1}
                      value={margin}
                      onChange={(e) => setMargin(Number(e.target.value))}
                      className="w-full accent-indigo-600 cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                      Error Correction Level
                    </label>
                    <select aria-label="Error correction"
                      value={errorCorrection}
                      onChange={(e) => setErrorCorrection(e.target.value as any)}
                      className="w-full p-2 rounded-lg glass-input text-xs font-semibold"
                    >
                      <option value="L">Level L — low</option>
                      <option value="M">Level M — standard</option>
                      <option value="Q">Level Q — high</option>
                      <option value="H">Level H — highest (automatic with logo)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: LOGO & CTA FRAME */}
          {activeTab === 'logo' && (
            <div className="space-y-5">
              {/* Logo Embed */}
              <div className="glass-card p-4 sm:p-5 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">Center Logo Overlay</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">PNG, JPEG or WebP, up to 2 MB. The logo keeps its original proportions.</p>
                  </div>
                  {logoImage && (
                    <button
                      type="button"
                      onClick={() => { logoRequest.current += 1; setLogoLoading(false); setLogoImage(null); }}
                      className="text-xs text-rose-500 font-bold hover:underline cursor-pointer"
                    >
                      Remove Logo
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    ref={fileInputRef}
                    id="qr-center-logo-upload"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handleLogoUpload}
                    className="absolute w-px h-px opacity-0 overflow-hidden"
                    aria-label="Choose QR center logo"
                  />
                  <label
                    htmlFor="qr-center-logo-upload"
                    className="px-4 py-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 text-xs font-bold flex items-center gap-2 hover:bg-indigo-100 transition-colors cursor-pointer"
                  >
                    <Upload className="w-4 h-4" /> Upload Custom Logo
                  </label>
                  {logoImage && (
                    <label htmlFor="qr-center-logo-upload" title="Replace logo" aria-label="Replace QR logo" className="w-12 h-12 rounded-xl border border-slate-300 dark:border-slate-700 p-1 flex items-center justify-center bg-white shadow-xs cursor-pointer">
                      <img src={logoImage} alt="Current QR logo" className="max-w-full max-h-full object-contain" />
                    </label>
                  )}
                </div>

                {logoImage && (
                  <div className="pt-2">
                    <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      <span>Logo Size Ratio</span>
                      <span>{logoSize}%</span>
                    </div>
                    <input aria-label="Logo size"
                      type="range"
                      min={10}
                      max={20}
                      step={2}
                      value={logoSize}
                      onChange={(e) => setLogoSize(Number(e.target.value))}
                      className="w-full accent-indigo-600 cursor-pointer"
                    />
                    <span className="text-[11px] text-amber-600 dark:text-amber-400">
                      Logo mode uses Level H. A logo can still make a code unreadable: keep it small and run the scan test.
                    </span>
                  </div>
                )}
              </div>

              {/* Call-to-Action Banner Frame */}
              <div className="glass-card p-4 sm:p-5 rounded-2xl space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Call-To-Action Frame</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Add an eye-catching banner badge like &quot;SCAN ME&quot; or &quot;CONNECT WIFI&quot;.</p>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                    Frame Text (Leave blank for no frame)
                  </label>
                  <input aria-label="Frame text"
                    type="text"
                    value={frameText}
                    onChange={(e) => setFrameText(e.target.value)}
                    placeholder="e.g. SCAN ME FOR MENU"
                    maxLength={32}
                    className="w-full p-2.5 rounded-xl glass-input text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider"
                  />
                </div>

                {frameText.trim() && (
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                        Banner Position
                      </label>
                      <select aria-label="Frame position"
                        value={framePosition}
                        onChange={(e) => setFramePosition(e.target.value as any)}
                        className="w-full p-2 rounded-lg glass-input text-xs font-semibold"
                      >
                        <option value="bottom">Bottom of QR Code</option>
                        <option value="top">Top of QR Code</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                        Banner Color
                      </label>
                      <div className="flex items-center gap-2">
                        <input aria-label="Frame color"
                          type="color"
                          value={frameColor}
                          onChange={(e) => setFrameColor(e.target.value)}
                          className="w-8 h-8 rounded-lg border-0 cursor-pointer"
                        />
                        <span className="text-xs font-mono font-bold">{frameColor}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: RECENT HISTORY */}
          {activeTab === 'history' && (
            <div className="glass-card p-4 sm:p-5 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Recent Generated QR Codes</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Optional, unencrypted storage on this browser. Saved codes can include Wi-Fi passwords and contact details.</p>
                </div>
                {history.length > 0 && (
                  <button
                    type="button"
                    onClick={clearHistory}
                    className="text-xs text-rose-500 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Clear All
                  </button>
                )}
              </div>

              <label className="flex items-start gap-2 text-sm">
                <input type="checkbox" checked={historyEnabled} onChange={e => setHistoryEnabled(e.target.checked)} />
                Save downloaded or copied content in this browser (this visit only). Do not enable on shared devices.
              </label>
              <p className="text-xs text-slate-500">Restore loads encoded content into URL / Text; it does not restore design settings. Turning this off stops new saves. Use Clear All to delete existing history.</p>
              {history.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs">
                  No saved codes. Enable history below, then download or copy a code to keep its content here.
                </div>
              ) : (
                <div className="space-y-2 max-h-72 overflow-y-auto">
                  {history.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="truncate">
                        <span className="font-bold text-slate-900 dark:text-white block truncate">{item.title}</span>
                        <span className="text-[11px] text-slate-500 truncate block font-mono">{item.content}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setQrType('url');
                          setTextValue(item.content);
                          setActiveTab('content');
                          onShowToast('Restored exact encoded content in URL / Text mode.');
                        }}
                        className="px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-bold hover:bg-indigo-100 transition-colors shrink-0 cursor-pointer"
                      >
                        Restore
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Live Interactive Preview & Export Deck */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 rounded-3xl glass-card text-center space-y-5 sticky top-6">
          <div className="flex items-center justify-between w-full">
            <span className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Live QR Preview
            </span>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
              {ready && rendered ? `${rendered.width} × ${rendered.height} px` : 'Updating'}
            </span>
          </div>

          {/* Interactive QR Display Canvas */}
          <div className="p-4 bg-white rounded-3xl shadow-xl border border-slate-200/80 dark:border-slate-700 inline-block transition-transform hover:scale-[1.02]">
            <canvas ref={canvasRef} role="img" aria-label="Generated QR code preview" className={`max-w-full h-auto ${ready ? '' : 'invisible'}`} />
          </div>

          <div className="w-full text-left space-y-3 text-xs" aria-live="polite">
            {(validationError || renderError) && <p role="alert" className="text-rose-600 dark:text-rose-400">{validationError || renderError}</p>}
            {logoLoading && <p>Preparing logo…</p>}
            {!validationError && !renderError && !ready && !logoLoading && <p>Updating preview…</p>}
            {(contrast.inverted || contrast.ratio < 4.5) && <p className="text-amber-700 dark:text-amber-400">Use dark dots on a light background. Current contrast: {contrast.ratio.toFixed(1)}:1. This is a design warning, not a scan guarantee.</p>}
            {transparentBg && <p>Transparent codes are tested on white here. Test again on your final background.</p>}
            <button type="button" disabled={!ready} onClick={testScan} className="w-full rounded-xl bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 p-3 font-bold disabled:opacity-40">Test this QR code</button>
            {scanResult?.key === renderKey && <p className={scanResult.passed ? 'text-emerald-700 dark:text-emerald-400' : 'text-amber-700 dark:text-amber-400'}>{scanResult.message}</p>}
            <button type="button" onClick={resetDesign} className="underline font-semibold">Use scan-friendly defaults</button>
            <p>The scan test checks encoded content. It does not verify a website, WhatsApp account, Wi-Fi connection or payment recipient.</p>
          </div>
          {ready && <details className="w-full text-left text-xs">
            <summary className="cursor-pointer font-semibold">Review encoded content (may contain private details)</summary>
            <pre className="mt-2 max-h-40 overflow-auto whitespace-pre-wrap break-all p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">{payload}</pre>
          </details>}
          {/* Main Action Buttons */}
          <div className="grid grid-cols-2 gap-2.5 w-full">
            <button
              disabled={!ready}
              onClick={downloadPng}
              className="py-3 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4" /> PNG Image
            </button>
            <button
              disabled={!ready}
              onClick={downloadSvg}
              className="py-3 px-3 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <FileCode className="w-4 h-4" /> Vector SVG
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2 w-full text-xs">
            <button
              disabled={!ready}
              onClick={downloadPdf}
              className="py-2.5 px-2 glass-btn text-slate-700 dark:text-slate-200 font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer hover:bg-slate-200/60"
            >
              <FileText className="w-3.5 h-3.5" /> PDF (A4)
            </button>
            <button
              disabled={!ready}
              onClick={printQrCode}
              className="py-2.5 px-2 glass-btn text-slate-700 dark:text-slate-200 font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer hover:bg-slate-200/60"
            >
              <Printer className="w-3.5 h-3.5" /> Print
            </button>
            <button
              disabled={!ready}
              onClick={copyToClipboard}
              className="py-2.5 px-2 glass-btn text-slate-700 dark:text-slate-200 font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer hover:bg-slate-200/60"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          {/* Quick Specifications */}
          <div className="w-full pt-3 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 space-y-1 text-left">
            <div className="flex justify-between">
              <span>Encoding Level:</span>
              <span className="font-bold text-slate-700 dark:text-slate-300">Level {logoImage ? 'H (logo mode)' : errorCorrection}</span>
            </div>
            <div className="flex justify-between">
              <span>Resolution:</span>
              <span className="font-bold text-slate-700 dark:text-slate-300">{ready && rendered ? `${rendered.cell} px per module` : '—'}</span>
            </div>
            <div className="flex justify-between">
              <span>Processing:</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">Generated in your browser</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
