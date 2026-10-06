import React, { useState, useEffect, useRef, useCallback } from 'react';
import QRCode from 'qrcode';
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
import { useLanguage } from '../../context/LanguageContext';

interface QrGeneratorToolProps {
  onShowToast: (msg: string) => void;
}

type QrContentType =
  | 'url'
  | 'wifi'
  | 'vcard'
  | 'email'
  | 'phone'
  | 'sms'
  | 'upi'
  | 'geo'
  | 'event';

type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';
type DotStyle = 'square' | 'dots' | 'rounded' | 'classy';
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
  { name: 'Dark Mode Invert', fg: '#f8fafc', bg: '#0f172a' }
];

const QUICK_TEMPLATES = [
  { label: 'Google Search', type: 'url' as const, val: 'https://www.google.com' },
  { label: 'Instagram Profile', type: 'url' as const, val: 'https://instagram.com/yourbrand' },
  { label: 'YouTube Channel', type: 'url' as const, val: 'https://youtube.com/@yourchannel' },
  { label: 'LinkedIn Page', type: 'url' as const, val: 'https://linkedin.com/in/yourprofile' }
];

export const QrGeneratorTool: React.FC<QrGeneratorToolProps> = ({ onShowToast }) => {
  const { t } = useLanguage();

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
  const [margin, setMargin] = useState<number>(2);
  const [errorCorrection, setErrorCorrection] = useState<ErrorCorrectionLevel>('H');
  const [dotStyle, setDotStyle] = useState<DotStyle>('square');
  const [cornerStyle, setCornerStyle] = useState<CornerStyle>('square');

  // Gradient options
  const [useGradient, setUseGradient] = useState(false);
  const [fgColor2, setFgColor2] = useState('#4f46e5');
  const [gradientType, setGradientType] = useState<'linear' | 'radial'>('linear');

  // Center Logo
  const [logoImage, setLogoImage] = useState<string | null>(null);
  const [logoSize, setLogoSize] = useState<number>(22); // percent of QR code
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

  // Load History from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('zubware_qr_history');
      if (saved) {
        setHistory(JSON.parse(saved));
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  // Save item to history
  const saveToHistory = useCallback((type: QrContentType, content: string) => {
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
  }, [wifiSsid, vFirstName, vLastName, upiId, upiAmount, emailTo, phoneNumber, geoLat, geoLng, eventTitle]);

  const clearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem('zubware_qr_history');
      onShowToast('Cleared QR history');
    } catch {
      // Ignore
    }
  };

  // Construct standard payload strings
  const getConstructedText = useCallback(() => {
    switch (qrType) {
      case 'url':
        return textValue.trim() || 'https://www.zubware.com';

      case 'wifi': {
        const ssid = wifiSsid.trim();
        const enc = wifiEnc;
        const pass = wifiPass;
        const hidden = wifiHidden ? 'H:true;' : '';
        return `WIFI:S:${ssid};T:${enc};P:${pass};${hidden};`;
      }

      case 'vcard': {
        const parts = [
          'BEGIN:VCARD',
          'VERSION:3.0',
          `N:${vLastName};${vFirstName};;;`,
          `FN:${vFirstName} ${vLastName}`.trim(),
          vOrg ? `ORG:${vOrg}` : '',
          vTitle ? `TITLE:${vTitle}` : '',
          vPhone ? `TEL;TYPE=CELL:${vPhone}` : '',
          vEmail ? `EMAIL:${vEmail}` : '',
          vUrl ? `URL:${vUrl}` : '',
          vAddress ? `ADR;TYPE=WORK:;;${vAddress};;;;` : '',
          'END:VCARD'
        ].filter(Boolean);
        return parts.join('\n');
      }

      case 'email': {
        const to = emailTo.trim();
        const sub = encodeURIComponent(emailSubject);
        const b = encodeURIComponent(emailBody);
        return `mailto:${to}?subject=${sub}&body=${b}`;
      }

      case 'phone': {
        return `tel:${phoneNumber.trim()}`;
      }

      case 'sms': {
        const num = phoneNumber.trim();
        const msg = encodeURIComponent(smsMessage);
        return `smsto:${num}:${msg}`;
      }

      case 'upi': {
        // Indian Unified Payments Interface standard URL
        const id = upiId.trim();
        const pn = encodeURIComponent(upiName || 'Payee');
        const am = upiAmount ? `&am=${encodeURIComponent(upiAmount)}` : '';
        const tn = upiNote ? `&tn=${encodeURIComponent(upiNote)}` : '';
        return `upi://pay?pa=${id}&pn=${pn}&cu=INR${am}${tn}`;
      }

      case 'geo': {
        const lat = geoLat.trim() || '0';
        const lng = geoLng.trim() || '0';
        return `geo:${lat},${lng}?q=${lat},${lng}`;
      }

      case 'event': {
        const sTime = eventStart ? eventStart.replace(/[-:]/g, '') + '00Z' : '';
        const eTime = eventEnd ? eventEnd.replace(/[-:]/g, '') + '00Z' : '';
        const parts = [
          'BEGIN:VEVENT',
          `SUMMARY:${eventTitle}`,
          eventLocation ? `LOCATION:${eventLocation}` : '',
          eventDescription ? `DESCRIPTION:${eventDescription}` : '',
          sTime ? `DTSTART:${sTime}` : '',
          eTime ? `DTEND:${eTime}` : '',
          'END:VEVENT'
        ].filter(Boolean);
        return parts.join('\n');
      }

      default:
        return 'https://www.zubware.com';
    }
  }, [
    qrType,
    textValue,
    wifiSsid,
    wifiPass,
    wifiEnc,
    wifiHidden,
    vFirstName,
    vLastName,
    vOrg,
    vTitle,
    vPhone,
    vEmail,
    vUrl,
    vAddress,
    emailTo,
    emailSubject,
    emailBody,
    phoneNumber,
    smsMessage,
    upiId,
    upiName,
    upiAmount,
    upiNote,
    geoLat,
    geoLng,
    eventTitle,
    eventLocation,
    eventStart,
    eventEnd,
    eventDescription
  ]);

  // Main Canvas Rendering Function with Custom Shapes, Gradients, Frames & Logos
  const renderQrCanvas = useCallback(async () => {
    if (!canvasRef.current) return;
    const content = getConstructedText();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    try {
      const qrData = QRCode.create(content, {
        errorCorrectionLevel: logoImage ? 'H' : errorCorrection
      });

      const moduleCount = qrData.modules.size;
      const effectiveMargin = margin;
      const totalCells = moduleCount + effectiveMargin * 2;
      const cellSize = Math.floor(qrSize / totalCells);
      const actualQrWidth = cellSize * totalCells;

      // Adjust height if frameText exists
      const frameHeight = frameText.trim() ? 46 : 0;
      const totalCanvasWidth = actualQrWidth;
      const totalCanvasHeight = actualQrWidth + frameHeight;

      canvas.width = totalCanvasWidth;
      canvas.height = totalCanvasHeight;

      // 1. Draw Background
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (!transparentBg) {
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // Calculate QR vertical offset based on frame text position
      const qrOffsetY = frameText.trim() && framePosition === 'top' ? frameHeight : 0;

      // 2. Setup Foreground FillStyle (Solid or Gradient)
      let fillStyle: string | CanvasGradient = fgColor;
      if (useGradient) {
        if (gradientType === 'linear') {
          const grad = ctx.createLinearGradient(0, qrOffsetY, actualQrWidth, qrOffsetY + actualQrWidth);
          grad.addColorStop(0, fgColor);
          grad.addColorStop(1, fgColor2);
          fillStyle = grad;
        } else {
          const cx = actualQrWidth / 2;
          const cy = qrOffsetY + actualQrWidth / 2;
          const grad = ctx.createRadialGradient(cx, cy, 10, cx, cy, actualQrWidth / 1.5);
          grad.addColorStop(0, fgColor);
          grad.addColorStop(1, fgColor2);
          fillStyle = grad;
        }
      }
      ctx.fillStyle = fillStyle;

      // Helper to identify finder pattern eyes (top-left, top-right, bottom-left)
      const isFinderPattern = (r: number, c: number) => {
        if (r < 7 && c < 7) return true; // Top-Left
        if (r < 7 && c >= moduleCount - 7) return true; // Top-Right
        if (r >= moduleCount - 7 && c < 7) return true; // Bottom-Left
        return false;
      };

      // 3. Render Data Modules & Eye Patterns
      for (let r = 0; r < moduleCount; r++) {
        for (let c = 0; c < moduleCount; c++) {
          const isDark = qrData.modules.get(r, c);
          if (!isDark) continue;

          const x = (c + effectiveMargin) * cellSize;
          const y = (r + effectiveMargin) * cellSize + qrOffsetY;

          if (isFinderPattern(r, c)) {
            // Render Finder Pattern Corner based on cornerStyle
            if (cornerStyle === 'rounded') {
              ctx.beginPath();
              ctx.roundRect(x, y, cellSize, cellSize, 3);
              ctx.fill();
            } else if (cornerStyle === 'circle') {
              ctx.beginPath();
              ctx.arc(x + cellSize / 2, y + cellSize / 2, cellSize / 2, 0, Math.PI * 2);
              ctx.fill();
            } else {
              ctx.fillRect(x, y, cellSize, cellSize);
            }
          } else {
            // Render Data Modules based on dotStyle
            if (dotStyle === 'dots') {
              ctx.beginPath();
              ctx.arc(x + cellSize / 2, y + cellSize / 2, (cellSize / 2) * 0.85, 0, Math.PI * 2);
              ctx.fill();
            } else if (dotStyle === 'rounded') {
              ctx.beginPath();
              ctx.roundRect(x + 0.5, y + 0.5, cellSize - 1, cellSize - 1, cellSize * 0.35);
              ctx.fill();
            } else if (dotStyle === 'classy') {
              ctx.beginPath();
              ctx.arc(x + cellSize / 2, y + cellSize / 2, cellSize / 2, 0, Math.PI * 2);
              ctx.fill();
            } else {
              // Standard sharp square
              ctx.fillRect(x, y, cellSize, cellSize);
            }
          }
        }
      }

      // 4. Render Center Logo if uploaded
      if (logoImage) {
        const logo = new Image();
        logo.crossOrigin = 'anonymous';
        logo.src = logoImage;
        await new Promise((resolve) => {
          logo.onload = resolve;
          logo.onerror = resolve;
        });

        const targetLogoSize = (actualQrWidth * (logoSize / 100));
        const logoX = (actualQrWidth - targetLogoSize) / 2;
        const logoY = qrOffsetY + (actualQrWidth - targetLogoSize) / 2;
        const padding = 6;

        // White badge behind logo for readability
        ctx.fillStyle = bgColor;
        ctx.beginPath();
        ctx.roundRect(
          logoX - padding,
          logoY - padding,
          targetLogoSize + padding * 2,
          targetLogoSize + padding * 2,
          10
        );
        ctx.fill();

        ctx.strokeStyle = fgColor;
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.drawImage(logo, logoX, logoY, targetLogoSize, targetLogoSize);
      }

      // 5. Render CTA Banner Frame if text specified
      if (frameText.trim()) {
        const bannerY = framePosition === 'bottom' ? actualQrWidth : 0;
        ctx.fillStyle = frameColor;
        ctx.fillRect(0, bannerY, actualQrWidth, frameHeight);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 14px ui-sans-serif, system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(frameText.trim(), actualQrWidth / 2, bannerY + frameHeight / 2);
      }
    } catch (err) {
      console.error('QR Render Error:', err);
    }
  }, [
    getConstructedText,
    qrSize,
    margin,
    fgColor,
    bgColor,
    transparentBg,
    errorCorrection,
    dotStyle,
    cornerStyle,
    useGradient,
    fgColor2,
    gradientType,
    logoImage,
    logoSize,
    frameText,
    frameColor,
    framePosition
  ]);

  useEffect(() => {
    renderQrCanvas();
  }, [renderQrCanvas]);

  // Handle Logo Upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      onShowToast('Please select a valid image file (PNG, JPG, SVG).');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setLogoImage(reader.result as string);
      onShowToast('Logo uploaded into QR code!');
    };
    reader.readAsDataURL(file);
  };

  // Export Formats
  const downloadPng = () => {
    if (!canvasRef.current) return;
    const url = canvasRef.current.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `qr-code-${qrType}.png`;
    a.click();
    saveToHistory(qrType, getConstructedText());
    onShowToast('Downloaded high-res PNG!');
  };

  const downloadSvg = async () => {
    try {
      const content = getConstructedText();
      const svgString = await QRCode.toString(content, {
        type: 'svg',
        margin,
        color: {
          dark: fgColor,
          light: transparentBg ? '#00000000' : bgColor
        },
        errorCorrectionLevel: logoImage ? 'H' : errorCorrection
      });

      const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `qr-code-${qrType}.svg`;
      a.click();
      URL.revokeObjectURL(url);
      saveToHistory(qrType, content);
      onShowToast('Downloaded Scalable Vector SVG!');
    } catch {
      onShowToast('Failed to generate SVG vector.');
    }
  };

  const downloadPdf = () => {
    if (!canvasRef.current) return;
    try {
      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const imgData = canvasRef.current.toDataURL('image/png');
      doc.setFontSize(18);
      doc.text('Zubware QR Code Print Sheet', 105, 30, { align: 'center' });
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Type: ${qrType.toUpperCase()} • Generated with Zubware.com`, 105, 38, { align: 'center' });

      // Center 120mm x 120mm QR Code
      doc.addImage(imgData, 'PNG', 45, 50, 120, 120);

      doc.setFontSize(11);
      doc.setTextColor(50);
      doc.text(frameText.trim() || 'Scan with your smartphone camera', 105, 185, { align: 'center' });

      doc.save(`qr-code-${qrType}.pdf`);
      saveToHistory(qrType, getConstructedText());
      onShowToast('Downloaded printable A4 PDF!');
    } catch {
      onShowToast('PDF generation failed.');
    }
  };

  const copyToClipboard = async () => {
    if (!canvasRef.current) return;
    canvasRef.current.toBlob(async (blob) => {
      if (!blob) return;
      try {
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
        setCopied(true);
        saveToHistory(qrType, getConstructedText());
        onShowToast('Copied QR Code image to clipboard!');
        setTimeout(() => setCopied(false), 2000);
      } catch {
        downloadPng();
      }
    });
  };

  const printQrCode = () => {
    if (!canvasRef.current) return;
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
            <p>${frameText.trim() || 'Scan with Camera'}</p>
            <script>
              window.onload = function() { window.print(); window.close(); }
            </script>
          </body>
        </html>
      `);
      win.document.close();
    }
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
                    { id: 'geo' as const, label: 'Location', icon: MapPin },
                    { id: 'event' as const, label: 'Event', icon: Calendar }
                  ].map((item) => {
                    const Icon = item.icon;
                    const isSelected = qrType === item.id;
                    return (
                      <button
                        key={item.id}
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
                    <textarea
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
                      <input
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
                        <input
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
                        <select
                          value={wifiEnc}
                          onChange={(e) => setWifiEnc(e.target.value as any)}
                          className="w-full p-2.5 rounded-xl glass-input text-sm font-semibold text-slate-900 dark:text-white"
                        >
                          <option value="WPA">WPA / WPA2 / WPA3</option>
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
                        <input
                          type="text"
                          value={vFirstName}
                          onChange={(e) => setVFirstName(e.target.value)}
                          placeholder="John"
                          className="w-full p-2.5 rounded-xl glass-input text-sm font-semibold text-slate-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">Last Name</label>
                        <input
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
                        <input
                          type="tel"
                          value={vPhone}
                          onChange={(e) => setVPhone(e.target.value)}
                          placeholder="+1 555 123 4567"
                          className="w-full p-2.5 rounded-xl glass-input text-sm font-semibold text-slate-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                        <input
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
                        <input
                          type="text"
                          value={vOrg}
                          onChange={(e) => setVOrg(e.target.value)}
                          placeholder="Acme Inc."
                          className="w-full p-2.5 rounded-xl glass-input text-sm font-semibold text-slate-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">Job Title</label>
                        <input
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
                      <input
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
                      <input
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
                        <input
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
                        <input
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
                      <input
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
                      <input
                        type="email"
                        value={emailTo}
                        onChange={(e) => setEmailTo(e.target.value)}
                        placeholder="support@example.com"
                        className="w-full p-2.5 rounded-xl glass-input text-sm font-semibold text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">Subject</label>
                      <input
                        type="text"
                        value={emailSubject}
                        onChange={(e) => setEmailSubject(e.target.value)}
                        placeholder="Feedback or Inquiry"
                        className="w-full p-2.5 rounded-xl glass-input text-sm font-semibold text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">Message Body</label>
                      <textarea
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
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="+1 800 555 0199"
                      className="w-full p-2.5 rounded-xl glass-input text-sm font-semibold text-slate-900 dark:text-white"
                    />
                  </div>
                )}

                {/* 7. SMS Message */}
                {qrType === 'sms' && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">Phone Number</label>
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="+1 800 555 0199"
                        className="w-full p-2.5 rounded-xl glass-input text-sm font-semibold text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">Pre-filled SMS Text</label>
                      <textarea
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
                      <input
                        type="text"
                        value={geoLat}
                        onChange={(e) => setGeoLat(e.target.value)}
                        placeholder="37.7749"
                        className="w-full p-2.5 rounded-xl glass-input text-sm font-semibold text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">Longitude</label>
                      <input
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
                      <input
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
                        <input
                          type="datetime-local"
                          value={eventStart}
                          onChange={(e) => setEventStart(e.target.value)}
                          className="w-full p-2.5 rounded-xl glass-input text-xs font-semibold text-slate-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">End Date & Time</label>
                        <input
                          type="datetime-local"
                          value={eventEnd}
                          onChange={(e) => setEventEnd(e.target.value)}
                          className="w-full p-2.5 rounded-xl glass-input text-xs font-semibold text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">Location</label>
                      <input
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
                      <input
                        type="color"
                        value={fgColor}
                        onChange={(e) => setFgColor(e.target.value)}
                        className="w-9 h-9 rounded-lg border-0 cursor-pointer"
                      />
                      <input
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
                      <input
                        type="color"
                        disabled={transparentBg}
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                        className="w-9 h-9 rounded-lg border-0 cursor-pointer disabled:opacity-40"
                      />
                      <input
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
                          <input
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
                        <select
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

              {/* Dot & Corner Styles */}
              <div className="glass-card p-4 rounded-2xl space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-2">
                    Body Pattern Shapes
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { id: 'square' as const, label: 'Square' },
                      { id: 'dots' as const, label: 'Dots / Circles' },
                      { id: 'rounded' as const, label: 'Rounded' },
                      { id: 'classy' as const, label: 'Smooth' }
                    ].map((s) => (
                      <button
                        key={s.id}
                        type="button"
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
                      { id: 'circle' as const, label: 'Full Circle' }
                    ].map((c) => (
                      <button
                        key={c.id}
                        type="button"
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
                    <input
                      type="range"
                      min={0}
                      max={5}
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
                    <select
                      value={errorCorrection}
                      onChange={(e) => setErrorCorrection(e.target.value as any)}
                      className="w-full p-2 rounded-lg glass-input text-xs font-semibold"
                    >
                      <option value="L">Level L (7% Damage Tolerance)</option>
                      <option value="M">Level M (15% Standard)</option>
                      <option value="Q">Level Q (25% High)</option>
                      <option value="H">Level H (30% Best for Logos)</option>
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
                    <p className="text-xs text-slate-500 dark:text-slate-400">Embed your brand logo in the center of the QR code.</p>
                  </div>
                  {logoImage && (
                    <button
                      type="button"
                      onClick={() => setLogoImage(null)}
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
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 text-xs font-bold flex items-center gap-2 hover:bg-indigo-100 transition-colors cursor-pointer"
                  >
                    <Upload className="w-4 h-4" /> Upload Custom Logo
                  </button>
                  {logoImage && (
                    <div className="w-12 h-12 rounded-xl border border-slate-300 dark:border-slate-700 p-1 flex items-center justify-center bg-white shadow-xs">
                      <img src={logoImage} alt="Logo" className="max-w-full max-h-full object-contain" />
                    </div>
                  )}
                </div>

                {logoImage && (
                  <div className="pt-2">
                    <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      <span>Logo Size Ratio</span>
                      <span>{logoSize}%</span>
                    </div>
                    <input
                      type="range"
                      min={12}
                      max={28}
                      step={2}
                      value={logoSize}
                      onChange={(e) => setLogoSize(Number(e.target.value))}
                      className="w-full accent-indigo-600 cursor-pointer"
                    />
                    <span className="text-[11px] text-amber-600 dark:text-amber-400">
                      *Error correction automatically locked to Level H (30%) to ensure scan reliability.
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
                  <input
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
                      <select
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
                        <input
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
                  <p className="text-xs text-slate-500 dark:text-slate-400">Stored safely inside your device local storage.</p>
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

              {history.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs">
                  No saved QR codes yet. Download or copy a code to save it here!
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
                          setQrType(item.type);
                          if (item.type === 'url') setTextValue(item.content);
                          setActiveTab('content');
                          onShowToast(`Loaded ${item.title}`);
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
              <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Live Vector Preview
            </span>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
              {qrSize} x {qrSize} px
            </span>
          </div>

          {/* Interactive QR Display Canvas */}
          <div className="p-4 bg-white rounded-3xl shadow-xl border border-slate-200/80 dark:border-slate-700 inline-block transition-transform hover:scale-[1.02]">
            <canvas ref={canvasRef} className="max-w-full h-auto rounded-xl" />
          </div>

          {/* Main Action Buttons */}
          <div className="grid grid-cols-2 gap-2.5 w-full">
            <button
              onClick={downloadPng}
              className="py-3 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" /> PNG Image
            </button>
            <button
              onClick={downloadSvg}
              className="py-3 px-3 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <FileCode className="w-4 h-4" /> Vector SVG
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2 w-full text-xs">
            <button
              onClick={downloadPdf}
              className="py-2.5 px-2 glass-btn text-slate-700 dark:text-slate-200 font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer hover:bg-slate-200/60"
            >
              <FileText className="w-3.5 h-3.5" /> PDF (A4)
            </button>
            <button
              onClick={printQrCode}
              className="py-2.5 px-2 glass-btn text-slate-700 dark:text-slate-200 font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer hover:bg-slate-200/60"
            >
              <Printer className="w-3.5 h-3.5" /> Print
            </button>
            <button
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
              <span className="font-bold text-slate-700 dark:text-slate-300">Level {errorCorrection} (Max Durability)</span>
            </div>
            <div className="flex justify-between">
              <span>Resolution:</span>
              <span className="font-bold text-slate-700 dark:text-slate-300">Print Ready 300 DPI</span>
            </div>
            <div className="flex justify-between">
              <span>Processing:</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">100% In-Browser Private</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
