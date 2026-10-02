import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  ShieldCheck, Upload, Camera, ZoomIn, ZoomOut, RotateCw, RefreshCw, Download,
  Printer, Sliders, Eye, Sparkles, CheckCircle2, AlertTriangle, XCircle,
  Move, HelpCircle, FileCheck, Layers, Palette, Grid, Scissors,
  Shirt, User, Wand2, Sun, Heart, Sparkle, Undo, Check, SlidersHorizontal
} from 'lucide-react';
import jsPDF from 'jspdf';
import { ImageUploadArea } from './ImageUploadArea';

interface PassportPhotoMakerToolProps {
  onShowToast: (msg: string) => void;
  onNavigate?: (path: string) => void;
}

export type SpecProfileId =
  | 'in-passport'
  | 'in-visa'
  | 'in-passport-printed'
  | 'us-passport'
  | 'eu-schengen'
  | 'uk-passport'
  | 'ca-passport'
  | 'au-passport'
  | 'sg-passport'
  | 'custom'
  | 'other';

export interface SpecProfile {
  id: SpecProfileId;
  name: string;
  country: string;
  widthMm: number;
  heightMm: number;
  widthPx: number;
  heightPx: number;
  aspectRatio: string;
  dpi: number;
  bgRecommended: string;
  bgColorHex: string;
  minKb?: number;
  maxKb?: number;
  faceRatio: string;
  guidanceText: string;
  format: 'JPG' | 'PNG' | 'JPEG';
}

const PROFILES: Record<SpecProfileId, SpecProfile> = {
  'in-passport': {
    id: 'in-passport',
    name: 'India Passport (Online / MEA)',
    country: 'India',
    widthMm: 35,
    heightMm: 45,
    widthPx: 630,
    heightPx: 810,
    aspectRatio: '7:9',
    dpi: 450,
    bgRecommended: 'Plain White',
    bgColorHex: '#FFFFFF',
    minKb: 10,
    maxKb: 300,
    faceRatio: '80% - 85%',
    guidanceText: 'Full face, front view, eyes open, plain white background. Head centered.',
    format: 'JPG'
  },
  'in-visa': {
    id: 'in-visa',
    name: 'India Visa / e-Visa (2x2")',
    country: 'India',
    widthMm: 51,
    heightMm: 51,
    widthPx: 600,
    heightPx: 600,
    aspectRatio: '1:1',
    dpi: 300,
    bgRecommended: 'Plain White',
    bgColorHex: '#FFFFFF',
    minKb: 10,
    maxKb: 1000,
    faceRatio: '70% - 80%',
    guidanceText: 'Square 2x2 inch format, equal height and width, light or white background.',
    format: 'JPG'
  },
  'in-passport-printed': {
    id: 'in-passport-printed',
    name: 'India Passport Printed (35x45 mm)',
    country: 'India',
    widthMm: 35,
    heightMm: 45,
    widthPx: 413,
    heightPx: 531,
    aspectRatio: '3.5:4.5',
    dpi: 300,
    bgRecommended: 'White / Off-White',
    bgColorHex: '#FFFFFF',
    minKb: 20,
    maxKb: 500,
    faceRatio: '75% - 80%',
    guidanceText: 'Standard 35mm x 45mm physical print size for passport application forms.',
    format: 'JPG'
  },
  'us-passport': {
    id: 'us-passport',
    name: 'US Passport & Visa (2x2")',
    country: 'United States',
    widthMm: 51,
    heightMm: 51,
    widthPx: 600,
    heightPx: 600,
    aspectRatio: '1:1',
    dpi: 300,
    bgRecommended: 'Off-White or White',
    bgColorHex: '#FFFFFF',
    minKb: 24,
    maxKb: 240,
    faceRatio: '50% - 69%',
    guidanceText: '2x2 inches (51x51 mm), head must be between 1 and 1 3/8 inches.',
    format: 'JPG'
  },
  'eu-schengen': {
    id: 'eu-schengen',
    name: 'Schengen Europe Visa (35x45 mm)',
    country: 'European Union',
    widthMm: 35,
    heightMm: 45,
    widthPx: 413,
    heightPx: 531,
    aspectRatio: '3.5:4.5',
    dpi: 300,
    bgRecommended: 'Light Grey or Off-White',
    bgColorHex: '#E5E7EB',
    minKb: 10,
    maxKb: 500,
    faceRatio: '70% - 80%',
    guidanceText: '35x45 mm, light background, neutral expression with mouth closed.',
    format: 'JPG'
  },
  'uk-passport': {
    id: 'uk-passport',
    name: 'UK Passport & Visa (35x45 mm)',
    country: 'United Kingdom',
    widthMm: 35,
    heightMm: 45,
    widthPx: 413,
    heightPx: 531,
    aspectRatio: '3.5:4.5',
    dpi: 300,
    bgRecommended: 'Light Grey / Cream',
    bgColorHex: '#F3F4F6',
    minKb: 10,
    maxKb: 500,
    faceRatio: '65% - 75%',
    guidanceText: '35x45 mm, cream or light grey background, no red eye or harsh shadows.',
    format: 'JPG'
  },
  'ca-passport': {
    id: 'ca-passport',
    name: 'Canada Passport (50x70 mm)',
    country: 'Canada',
    widthMm: 50,
    heightMm: 70,
    widthPx: 590,
    heightPx: 826,
    aspectRatio: '5:7',
    dpi: 300,
    bgRecommended: 'Plain White or Light',
    bgColorHex: '#FFFFFF',
    minKb: 20,
    maxKb: 1000,
    faceRatio: '70% - 75%',
    guidanceText: '50x70 mm, facial length between 31 and 36 mm from chin to crown.',
    format: 'JPG'
  },
  'au-passport': {
    id: 'au-passport',
    name: 'Australia Passport (35x45 mm)',
    country: 'Australia',
    widthMm: 35,
    heightMm: 45,
    widthPx: 413,
    heightPx: 531,
    aspectRatio: '3.5:4.5',
    dpi: 300,
    bgRecommended: 'Light Grey / Plain White',
    bgColorHex: '#FFFFFF',
    minKb: 10,
    maxKb: 500,
    faceRatio: '70% - 80%',
    guidanceText: '35x45 mm, head size between 32mm and 36mm from chin to crown.',
    format: 'JPG'
  },
  'sg-passport': {
    id: 'sg-passport',
    name: 'Singapore Passport (35x45 mm / 400x514 px)',
    country: 'Singapore',
    widthMm: 35,
    heightMm: 45,
    widthPx: 400,
    heightPx: 514,
    aspectRatio: '3.5:4.5',
    dpi: 300,
    bgRecommended: 'Plain White',
    bgColorHex: '#FFFFFF',
    minKb: 10,
    maxKb: 150,
    faceRatio: '70% - 80%',
    guidanceText: 'Online ICA requirements: 400x514 px, plain white background, file size < 150 KB.',
    format: 'JPG'
  },
  'custom': {
    id: 'custom',
    name: 'Custom Dimensions...',
    country: 'Custom',
    widthMm: 35,
    heightMm: 45,
    widthPx: 413,
    heightPx: 531,
    aspectRatio: 'Custom',
    dpi: 300,
    bgRecommended: 'User Choice',
    bgColorHex: '#FFFFFF',
    minKb: 10,
    maxKb: 5000,
    faceRatio: '70% - 80%',
    guidanceText: 'Configure custom physical or pixel dimensions and DPI.',
    format: 'JPG'
  },
  'other': {
    id: 'other',
    name: 'International Standard ID (35x45 mm)',
    country: 'International',
    widthMm: 35,
    heightMm: 45,
    widthPx: 413,
    heightPx: 531,
    aspectRatio: '3.5:4.5',
    dpi: 300,
    bgRecommended: 'White',
    bgColorHex: '#FFFFFF',
    minKb: 10,
    maxKb: 2000,
    faceRatio: '70% - 80%',
    guidanceText: 'Standard international ID size 35x45 mm.',
    format: 'JPG'
  }
};

type ActiveTab = 'align' | 'background' | 'enhance' | 'suit' | 'print';
type CustomUnit = 'mm' | 'cm' | 'inch' | 'px';

const SUIT_TEMPLATES: Record<string, { label: string; svg: string }> = {
  'mens-black-suit': {
    label: "Men's Black Suit & Tie",
    svg: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 350"><path d="M 110 350 L 140 180 L 175 160 L 200 210 L 225 160 L 260 180 L 290 350 Z" fill="%23111827"/><path d="M 140 180 L 180 160 L 190 250 L 170 350 Z" fill="%231F2937"/><path d="M 260 180 L 220 160 L 210 250 L 230 350 Z" fill="%231F2937"/><path d="M 175 160 Q 200 170 225 160 L 215 250 L 185 250 Z" fill="%23FFFFFF"/><path d="M 193 162 L 207 162 L 210 240 L 200 270 L 190 240 Z" fill="%23000000"/><polygon points="193,162 207,162 204,175 196,175" fill="%231F2937"/><path d="M 110 350 Q 80 250 140 180 L 175 160 L 160 260 L 110 350 Z" fill="%230F172A"/><path d="M 290 350 Q 320 250 260 180 L 225 160 L 240 260 L 290 350 Z" fill="%230F172A"/></svg>`
  },
  'mens-navy-suit': {
    label: "Men's Navy Blazer & Blue Tie",
    svg: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 350"><path d="M 110 350 L 140 180 L 175 160 L 200 210 L 225 160 L 260 180 L 290 350 Z" fill="%231E3A8A"/><path d="M 140 180 L 180 160 L 190 250 L 170 350 Z" fill="%231D4ED8"/><path d="M 260 180 L 220 160 L 210 250 L 230 350 Z" fill="%231D4ED8"/><path d="M 175 160 Q 200 170 225 160 L 215 250 L 185 250 Z" fill="%23FFFFFF"/><path d="M 193 162 L 207 162 L 210 240 L 200 270 L 190 240 Z" fill="%231E40AF"/><polygon points="193,162 207,162 204,175 196,175" fill="%231E3A8A"/><path d="M 110 350 Q 80 250 140 180 L 175 160 L 160 260 L 110 350 Z" fill="%23172554"/><path d="M 290 350 Q 320 250 260 180 L 225 160 L 240 260 L 290 350 Z" fill="%23172554"/></svg>`
  },
  'mens-white-shirt': {
    label: "Formal White Shirt & Tie",
    svg: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 350"><path d="M 110 350 L 145 180 L 175 160 Q 200 170 225 160 L 255 180 L 290 350 Z" fill="%23F9FAFB"/><path d="M 175 160 L 155 185 L 185 180 Z" fill="%23E5E7EB"/><path d="M 225 160 L 245 185 L 215 180 Z" fill="%23E5E7EB"/><path d="M 193 162 L 207 162 L 210 250 L 200 280 L 190 250 Z" fill="%23111827"/><polygon points="193,162 207,162 204,175 196,175" fill="%23374151"/></svg>`
  },
  'womens-formal-suit': {
    label: "Women's Dark Formal Blazer",
    svg: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 350"><path d="M 115 350 L 145 175 L 175 160 L 200 220 L 225 160 L 255 175 L 285 350 Z" fill="%231F2937"/><path d="M 175 160 Q 200 180 225 160 L 215 230 L 185 230 Z" fill="%23FFFFFF"/><path d="M 115 350 Q 85 240 145 175 L 175 160 L 165 260 L 115 350 Z" fill="%23111827"/><path d="M 285 350 Q 315 240 255 175 L 225 160 L 235 260 L 285 350 Z" fill="%23111827"/></svg>`
  },
  'womens-navy-blazer': {
    label: "Women's Navy Blazer",
    svg: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 350"><path d="M 115 350 L 145 175 L 175 160 L 200 220 L 225 160 L 255 175 L 285 350 Z" fill="%231E3A8A"/><path d="M 175 160 Q 200 180 225 160 L 215 230 L 185 230 Z" fill="%23F3F4F6"/><path d="M 115 350 Q 85 240 145 175 L 175 160 L 165 260 L 115 350 Z" fill="%23172554"/><path d="M 285 350 Q 315 240 255 175 L 225 160 L 235 260 L 285 350 Z" fill="%23172554"/></svg>`
  }
};

export const PassportPhotoMakerTool: React.FC<PassportPhotoMakerToolProps> = ({ onShowToast }) => {
  // Navigation & Tab state
  const [activeTab, setActiveTab] = useState<ActiveTab>('align');

  // Source Image state
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageElement, setImageElement] = useState<HTMLImageElement | null>(null);
  const [origDimensions, setOrigDimensions] = useState<{ w: number; h: number }>({ w: 0, h: 0 });

  // Profile selection
  const [selectedProfileId, setSelectedProfileId] = useState<SpecProfileId>('in-passport');
  const activeProfile = PROFILES[selectedProfileId];

  // Custom Profile state
  const [customUnit, setCustomUnit] = useState<CustomUnit>('mm');
  const [customWidthVal, setCustomWidthVal] = useState<number>(35);
  const [customHeightVal, setCustomHeightVal] = useState<number>(45);
  const [customDpi, setCustomDpi] = useState<number>(300);

  // Position, Crop, Zoom & Adjustments
  const [zoom, setZoom] = useState<number>(1);
  const [panX, setPanX] = useState<number>(0);
  const [panY, setPanY] = useState<number>(0);
  const [rotation, setRotation] = useState<number>(0);

  // Lighting & Enhancements
  const [brightness, setBrightness] = useState<number>(0); // -50 to 50
  const [contrast, setContrast] = useState<number>(0); // -50 to 50
  const [exposure, setExposure] = useState<number>(0); // -50 to 50
  const [saturation, setSaturation] = useState<number>(0); // -50 to 50
  const [warmth, setWarmth] = useState<number>(0); // -50 to 50
  const [clarity, setClarity] = useState<number>(0); // 0 to 100
  const [skinSmooth, setSkinSmooth] = useState<number>(0); // 0-100%
  const [deGlare, setDeGlare] = useState<number>(0); // 0-100%

  // Background replacement
  const [bgChoice, setBgChoice] = useState<'white' | 'off-white' | 'sky-blue' | 'light-grey' | 'transparent' | 'original' | 'custom'>('white');
  const [customBgHex, setCustomBgHex] = useState<string>('#FFFFFF');
  const [bgTolerance, setBgTolerance] = useState<number>(38);
  const [bgEdgeFeather, setBgEdgeFeather] = useState<number>(2);

  // Suit Overlay
  const [suitOverlay, setSuitOverlay] = useState<string>('none');
  const [suitScale, setSuitScale] = useState<number>(1.0);
  const [suitX, setSuitX] = useState<number>(0);
  const [suitY, setSuitY] = useState<number>(0);

  // Visual Overlay Guide
  const [showOverlayGuide, setShowOverlayGuide] = useState<boolean>(true);
  const [guideOpacity, setGuideOpacity] = useState<number>(75);

  // Output JPG quality & Single Photo export
  const [jpgQuality, setJpgQuality] = useState<number>(95);
  const [exportKbSize, setExportKbSize] = useState<number>(0);

  // Print Sheet Options
  const [paperSize, setPaperSize] = useState<'4x6' | 'a4' | '5x7'>('4x6');
  const [paperOrientation, setPaperOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [photoCopies, setPhotoCopies] = useState<number>(6);
  const [showCropMarks, setShowCropMarks] = useState<boolean>(true);
  const [sheetMarginMm, setSheetMarginMm] = useState<number>(8);
  const [photoSpacingMm, setPhotoSpacingMm] = useState<number>(4);

  // Touch & Drag state
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Suit HTMLImageElements cache
  const suitImageMapRef = useRef<Record<string, HTMLImageElement>>({});

  // Canvas Refs
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sheetCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Load Suit SVGs
  useEffect(() => {
    Object.entries(SUIT_TEMPLATES).forEach(([key, template]) => {
      const img = new Image();
      img.src = template.svg;
      img.onload = () => {
        suitImageMapRef.current[key] = img;
      };
    });
  }, []);

  // Calculate target dimensions
  const getTargetPixelDimensions = useCallback((): { w: number; h: number } => {
    if (selectedProfileId !== 'custom') {
      return { w: activeProfile.widthPx, h: activeProfile.heightPx };
    }

    let wPx = 413;
    let hPx = 531;

    if (customUnit === 'px') {
      wPx = Math.max(50, customWidthVal);
      hPx = Math.max(50, customHeightVal);
    } else {
      let wInches = customWidthVal / 25.4;
      let hInches = customHeightVal / 25.4;

      if (customUnit === 'cm') {
        wInches = (customWidthVal * 10) / 25.4;
        hInches = (customHeightVal * 10) / 25.4;
      } else if (customUnit === 'inch') {
        wInches = customWidthVal;
        hInches = customHeightVal;
      }

      wPx = Math.round(wInches * customDpi);
      hPx = Math.round(hInches * customDpi);
    }

    return { w: Math.max(100, wPx), h: Math.max(100, hPx) };
  }, [selectedProfileId, activeProfile, customUnit, customWidthVal, customHeightVal, customDpi]);

  // Load image
  const handleImageSelected = async (files: File[]) => {
    if (!files || !files.length) return;
    const file = files[0];

    const isHeic = file.name.toLowerCase().endsWith('.heic') || file.name.toLowerCase().endsWith('.heif');
    let loadedFile = file;

    if (isHeic) {
      try {
        const heic2anyModule = await import('heic2any');
        const heic2anyFn: any = heic2anyModule.default || heic2anyModule;
        const res = await heic2anyFn({ blob: file, toType: 'image/jpeg', quality: 0.9 });
        const decodedBlob = Array.isArray(res) ? res[0] : res;
        loadedFile = new File([decodedBlob], file.name.replace(/\.(heic|heif)$/i, '.jpg'), { type: 'image/jpeg' });
      } catch {
        onShowToast('Could not decode HEIC image. Please upload a JPG or PNG.');
        return;
      }
    }

    const url = URL.createObjectURL(loadedFile);
    const img = new Image();
    img.onload = () => {
      setImageFile(loadedFile);
      setImageElement(img);
      setOrigDimensions({ w: img.naturalWidth || img.width, h: img.naturalHeight || img.height });

      // Auto-fit defaults
      const { w: tw, h: th } = getTargetPixelDimensions();
      const scale = Math.max(tw / img.naturalWidth, th / img.naturalHeight) * 1.15;
      setZoom(scale);
      setPanX(0);
      setPanY(Math.round(th * 0.04));
      setRotation(0);

      // Reset filters
      setBrightness(0);
      setContrast(0);
      setExposure(0);
      setSaturation(0);
      setWarmth(0);
      setClarity(0);
      setSkinSmooth(0);
      setDeGlare(0);
      setSuitOverlay('none');

      onShowToast('Photo loaded! Use the controls to align and format your photo.');
    };
    img.onerror = () => {
      onShowToast('Failed to load selected image.');
    };
    img.src = url;
  };

  // 1-Click Auto Alignment
  const handleAutoAlign = () => {
    if (!imageElement) return;
    const { w: targetW, h: targetH } = getTargetPixelDimensions();
    const imgW = imageElement.naturalWidth || imageElement.width;
    const imgH = imageElement.naturalHeight || imageElement.height;

    const scale = Math.max(targetW / imgW, targetH / imgH) * 1.2;
    setZoom(scale);
    setPanX(0);
    setPanY(Math.round(targetH * 0.05));
    setRotation(0);
    onShowToast('Auto-aligned photo centered with biometric guide.');
  };

  // 1-Click Studio Lighting Enhancement
  const handleAutoEnhance = () => {
    setBrightness(6);
    setContrast(10);
    setExposure(4);
    setWarmth(6);
    setClarity(25);
    setSkinSmooth(35);
    setDeGlare(25);
    onShowToast('Applied studio lighting enhancement & facial clarity.');
  };

  // Reset all adjustments
  const handleResetAdjustments = () => {
    setBrightness(0);
    setContrast(0);
    setExposure(0);
    setSaturation(0);
    setWarmth(0);
    setClarity(0);
    setSkinSmooth(0);
    setDeGlare(0);
    setRotation(0);
    onShowToast('Reset all lighting and adjustments.');
  };

  // Render Single Photo onto Canvas
  const renderSinglePhoto = useCallback(() => {
    if (!imageElement || !canvasRef.current) return;

    const { w: targetW, h: targetH } = getTargetPixelDimensions();
    const canvas = canvasRef.current;
    canvas.width = targetW;
    canvas.height = targetH;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    ctx.clearRect(0, 0, targetW, targetH);

    // 1. Fill Chosen Background
    let targetBg = '#FFFFFF';
    if (bgChoice === 'off-white') targetBg = '#F8F9FA';
    else if (bgChoice === 'sky-blue') targetBg = '#E0F2FE';
    else if (bgChoice === 'light-grey') targetBg = '#F3F4F6';
    else if (bgChoice === 'custom') targetBg = customBgHex;
    else if (bgChoice === 'transparent') targetBg = 'transparent';

    if (bgChoice !== 'transparent' && bgChoice !== 'original') {
      ctx.fillStyle = targetBg;
      ctx.fillRect(0, 0, targetW, targetH);
    }

    // 2. Draw Transformed Photo
    ctx.save();
    ctx.translate(targetW / 2 + panX, targetH / 2 + panY);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(zoom, zoom);

    const bVal = 100 + brightness + exposure;
    const cVal = 100 + contrast;
    const sVal = 100 + saturation;
    ctx.filter = `brightness(${bVal}%) contrast(${cVal}%) saturate(${sVal}%)`;

    const imgW = imageElement.naturalWidth || imageElement.width;
    const imgH = imageElement.naturalHeight || imageElement.height;
    ctx.drawImage(imageElement, -imgW / 2, -imgH / 2, imgW, imgH);
    ctx.restore();

    // 3. Pixel Enhancement Pass (Skin smooth, clarity, warmth, de-glare)
    const hasPixelPass = skinSmooth > 0 || deGlare > 0 || warmth !== 0 || clarity > 0;
    if (hasPixelPass) {
      try {
        const imgData = ctx.getImageData(0, 0, targetW, targetH);
        const data = imgData.data;

        for (let i = 0; i < data.length; i += 4) {
          let r = data[i];
          let g = data[i + 1];
          let b = data[i + 2];

          // De-glare (flash highlight dampening)
          if (deGlare > 0 && r > 225 && g > 225 && b > 225) {
            const factor = (deGlare / 100) * 0.3;
            r = Math.round(r * (1 - factor) + 210 * factor);
            g = Math.round(g * (1 - factor) + 195 * factor);
            b = Math.round(b * (1 - factor) + 180 * factor);
          }

          // Warmth (color temp)
          if (warmth !== 0) {
            const wFactor = warmth / 100;
            r = Math.min(255, Math.max(0, Math.round(r + wFactor * 22)));
            g = Math.min(255, Math.max(0, Math.round(g + wFactor * 7)));
            b = Math.min(255, Math.max(0, Math.round(b - wFactor * 18)));
          }

          // Clarity (micro-contrast)
          if (clarity > 0) {
            const cFactor = clarity / 100;
            const lum = 0.299 * r + 0.587 * g + 0.114 * b;
            const delta = lum - 128;
            const micro = delta * cFactor * 0.3;
            r = Math.min(255, Math.max(0, Math.round(r + micro)));
            g = Math.min(255, Math.max(0, Math.round(g + micro)));
            b = Math.min(255, Math.max(0, Math.round(b + micro)));
          }

          // Skin Smoothing
          const isSkin = r > 80 && g > 50 && b > 30 && r > g && r > b && Math.abs(r - g) > 12;
          if (isSkin && skinSmooth > 0) {
            const factor = (skinSmooth / 100) * 0.3;
            const avg = (r + g + b) / 3;
            r = Math.round(r * (1 - factor) + (avg + 8) * factor);
            g = Math.round(g * (1 - factor) + (avg) * factor);
            b = Math.round(b * (1 - factor) + (avg - 8) * factor);
          }

          data[i] = r;
          data[i + 1] = g;
          data[i + 2] = b;
        }
        ctx.putImageData(imgData, 0, 0);
      } catch {
        // Fallback silently if canvas pixel manipulation is restricted
      }
    }

    // 4. Background Segmentation & Replacement (if requested)
    if (bgChoice !== 'original') {
      try {
        const imgData = ctx.getImageData(0, 0, targetW, targetH);
        const data = imgData.data;

        const targetDiv = document.createElement('div');
        targetDiv.style.color = targetBg === 'transparent' ? '#FFFFFF' : targetBg;
        document.body.appendChild(targetDiv);
        const cs = window.getComputedStyle(targetDiv).color;
        document.body.removeChild(targetDiv);
        const match = cs.match(/\d+/g);
        const tr = match ? parseInt(match[0], 10) : 255;
        const tg = match ? parseInt(match[1], 10) : 255;
        const tb = match ? parseInt(match[2], 10) : 255;

        // Sample 4 corner pixels to estimate dominant background hue
        const c1 = 0;
        const c2 = (targetW - 1) * 4;
        const c3 = (targetW * (targetH - 1)) * 4;
        const c4 = (targetW * targetH - 1) * 4;

        const bgR = (data[c1] + data[c2] + data[c3] + data[c4]) / 4;
        const bgG = (data[c1 + 1] + data[c2 + 1] + data[c3 + 1] + data[c4 + 1]) / 4;
        const bgB = (data[c1 + 2] + data[c2 + 2] + data[c3 + 2] + data[c4 + 2]) / 4;

        const tolSq = bgTolerance * bgTolerance * 10;

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];

          const diffSq = (r - bgR) ** 2 + (g - bgG) ** 2 + (b - bgB) ** 2;

          if (diffSq < tolSq) {
            const blend = Math.min(1, diffSq / tolSq);
            if (bgChoice === 'transparent') {
              data[i + 3] = Math.round(255 * blend);
            } else {
              data[i] = Math.round(tr * (1 - blend) + r * blend);
              data[i + 1] = Math.round(tg * (1 - blend) + g * blend);
              data[i + 2] = Math.round(tb * (1 - blend) + b * blend);
            }
          }
        }
        ctx.putImageData(imgData, 0, 0);
      } catch {
        // Continue without background keying
      }
    }

    // 5. Draw Formal Suit Overlay (if selected)
    if (suitOverlay !== 'none' && suitImageMapRef.current[suitOverlay]) {
      const suitImg = suitImageMapRef.current[suitOverlay];
      const suitW = Math.round(targetW * 0.94 * suitScale);
      const suitH = Math.round(targetH * 0.68 * suitScale);
      const suitDrawX = Math.round(targetW / 2 - suitW / 2 + suitX);
      const suitDrawY = Math.round(targetH * 0.52 + suitY);
      ctx.drawImage(suitImg, suitDrawX, suitDrawY, suitW, suitH);
    }

    // Measure resulting file size
    canvas.toBlob(
      (blob) => {
        if (blob) {
          setExportKbSize(Math.round(blob.size / 1024));
        }
      },
      'image/jpeg',
      jpgQuality / 100
    );
  }, [
    imageElement,
    getTargetPixelDimensions,
    panX,
    panY,
    zoom,
    rotation,
    brightness,
    contrast,
    exposure,
    saturation,
    warmth,
    clarity,
    skinSmooth,
    deGlare,
    bgChoice,
    customBgHex,
    bgTolerance,
    suitOverlay,
    suitScale,
    suitX,
    suitY,
    jpgQuality
  ]);

  useEffect(() => {
    if (imageElement) {
      renderSinglePhoto();
    }
  }, [imageElement, renderSinglePhoto]);

  // Mouse & Touch Dragging Handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - panX, y: e.clientY - panY });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    setPanX(e.clientX - dragStart.x);
    setPanY(e.clientY - dragStart.y);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({ x: e.touches[0].clientX - panX, y: e.touches[0].clientY - panY });
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging || e.touches.length !== 1) return;
    setPanX(e.touches[0].clientX - dragStart.x);
    setPanY(e.touches[0].clientY - dragStart.y);
  };

  // Render Print Sheet
  const renderPrintSheet = useCallback(() => {
    if (!canvasRef.current || !sheetCanvasRef.current) return;

    const sheetCanvas = sheetCanvasRef.current;
    const singleCanvas = canvasRef.current;

    let paperWmm = 102; // 4x6"
    let paperHmm = 152;

    if (paperSize === 'a4') { paperWmm = 210; paperHmm = 297; }
    else if (paperSize === '5x7') { paperWmm = 127; paperHmm = 178; }

    if (paperOrientation === 'landscape') {
      const tmp = paperWmm;
      paperWmm = paperHmm;
      paperHmm = tmp;
    }

    const printDpi = 300;
    const paperWpx = Math.round((paperWmm / 25.4) * printDpi);
    const paperHpx = Math.round((paperHmm / 25.4) * printDpi);

    sheetCanvas.width = paperWpx;
    sheetCanvas.height = paperHpx;

    const ctx = sheetCanvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, paperWpx, paperHpx);

    const photoWmm = activeProfile.widthMm || 35;
    const photoHmm = activeProfile.heightMm || 45;

    const photoWpx = Math.round((photoWmm / 25.4) * printDpi);
    const photoHpx = Math.round((photoHmm / 25.4) * printDpi);

    const marginPx = Math.round((sheetMarginMm / 25.4) * printDpi);
    const spacingPx = Math.round((photoSpacingMm / 25.4) * printDpi);

    const availableW = paperWpx - marginPx * 2;
    const cols = Math.max(1, Math.floor((availableW + spacingPx) / (photoWpx + spacingPx)));

    let currentX = marginPx;
    let currentY = marginPx;
    let placedCount = 0;

    for (let i = 0; i < photoCopies; i++) {
      if (currentY + photoHpx > paperHpx - marginPx) break;

      ctx.drawImage(singleCanvas, currentX, currentY, photoWpx, photoHpx);

      if (showCropMarks) {
        ctx.strokeStyle = '#CBD5E1';
        ctx.setLineDash([6, 6]);
        ctx.lineWidth = 1.5;
        ctx.strokeRect(currentX - 0.5, currentY - 0.5, photoWpx + 1, photoHpx + 1);
        ctx.setLineDash([]);
      }

      placedCount++;
      const colIndex = placedCount % cols;

      if (colIndex === 0) {
        currentX = marginPx;
        currentY += photoHpx + spacingPx;
      } else {
        currentX += photoWpx + spacingPx;
      }
    }
  }, [paperSize, paperOrientation, photoCopies, showCropMarks, sheetMarginMm, photoSpacingMm, activeProfile]);

  useEffect(() => {
    if (activeTab === 'print') {
      renderPrintSheet();
    }
  }, [activeTab, renderPrintSheet]);

  // Download Single Photo
  const handleDownloadSingle = (fmt: 'jpg' | 'png') => {
    if (!canvasRef.current) return;
    const mime = fmt === 'png' ? 'image/png' : 'image/jpeg';
    const link = document.createElement('a');
    link.download = `passport-photo-${activeProfile.id}-${activeProfile.widthPx}x${activeProfile.heightPx}.${fmt}`;
    link.href = canvasRef.current.toDataURL(mime, jpgQuality / 100);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onShowToast(`Downloaded single photo (${fmt.toUpperCase()})!`);
  };

  // Download Print Sheet as Image
  const handleDownloadSheetImage = (fmt: 'jpg' | 'png') => {
    if (!sheetCanvasRef.current) return;
    const mime = fmt === 'png' ? 'image/png' : 'image/jpeg';
    const link = document.createElement('a');
    link.download = `passport-sheet-${paperSize}-${photoCopies}-photos.${fmt}`;
    link.href = sheetCanvasRef.current.toDataURL(mime, 0.95);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onShowToast(`Downloaded ${paperSize.toUpperCase()} print sheet!`);
  };

  // Download Print Sheet as PDF
  const handleDownloadSheetPdf = () => {
    if (!sheetCanvasRef.current) return;
    const imgData = sheetCanvasRef.current.toDataURL('image/jpeg', 0.95);
    const pdf = new jsPDF({
      orientation: paperOrientation,
      unit: 'mm',
      format: paperSize === 'a4' ? 'a4' : [102, 152]
    });
    const pdfW = pdf.internal.pageSize.getWidth();
    const pdfH = pdf.internal.pageSize.getHeight();
    pdf.addImage(imgData, 'JPEG', 0, 0, pdfW, pdfH);
    pdf.save(`passport-sheet-${paperSize}.pdf`);
    onShowToast('Downloaded print-ready PDF!');
  };

  const targetDims = getTargetPixelDimensions();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 space-y-6">
      {/* Top Banner Notice */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>
            <strong>100% Client-Side Privacy:</strong> Your photo is processed locally in your browser. Nothing is uploaded to any server.
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0 text-[11px] text-slate-500">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
          <span>Verify specific embassy criteria before submitting</span>
        </div>
      </div>

      {/* Upload Dropzone (when no image selected) */}
      {!imageElement && (
        <div className="glass-panel p-8 rounded-2xl">
          <ImageUploadArea
            onImageSelected={handleImageSelected}
            accept="image/*,.heic,.heif"
            multiple={false}
            title="Upload portrait photo or selfie"
            subtitle="JPG, PNG, WEBP, HEIC supported · Front view with even lighting recommended"
            showCamera={true}
            showClipboard={true}
          />
        </div>
      )}

      {/* Workspace (When image is loaded) */}
      {imageElement && (
        <div className="space-y-6">
          {/* Top Control Bar: Document Preset & Action Tabs */}
          <div className="glass-panel p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Document Selector */}
              <div className="flex-1 max-w-md">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Document / Country Requirement Profile
                </label>
                <select
                  value={selectedProfileId}
                  onChange={(e) => setSelectedProfileId(e.target.value as SpecProfileId)}
                  className="w-full px-3 py-2 text-xs font-medium rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="in-passport">🇮🇳 India Passport (35 × 45 mm / 630 × 810 px)</option>
                  <option value="in-visa">🇮🇳 India Visa / e-Visa (2 × 2 inch / 600 × 600 px)</option>
                  <option value="in-passport-printed">🇮🇳 India Passport Physical Print (35 × 45 mm)</option>
                  <option value="us-passport">🇺🇸 US Passport & Visa (2 × 2 inch / 600 × 600 px)</option>
                  <option value="eu-schengen">🇪🇺 Schengen Europe Visa (35 × 45 mm)</option>
                  <option value="uk-passport">🇬🇧 UK Passport & Visa (35 × 45 mm)</option>
                  <option value="ca-passport">🇨🇦 Canada Passport (50 × 70 mm)</option>
                  <option value="au-passport">🇦🇺 Australia Passport (35 × 45 mm)</option>
                  <option value="sg-passport">🇸🇬 Singapore Passport (35 × 45 mm / 400 × 514 px)</option>
                  <option value="other">🌐 International General ID (35 × 45 mm)</option>
                  <option value="custom">⚙️ Custom Dimensions...</option>
                </select>
              </div>

              {/* Document Specs Meta Row */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                <span><strong>Size:</strong> {activeProfile.widthMm} × {activeProfile.heightMm} mm</span>
                <span>·</span>
                <span><strong>Resolution:</strong> {targetDims.w} × {targetDims.h} px</span>
                <span>·</span>
                <span><strong>Target:</strong> {activeProfile.bgRecommended}</span>
                <span>·</span>
                <span><strong>File:</strong> {exportKbSize} KB</span>
              </div>

              {/* Change Photo Button */}
              <button
                type="button"
                onClick={() => {
                  setImageElement(null);
                  setImageFile(null);
                }}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 border border-slate-200 dark:border-slate-700 hover:border-rose-300 dark:hover:border-rose-900 transition-colors flex items-center gap-1.5 self-start md:self-auto"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Change Photo
              </button>
            </div>

            {/* Custom Dimension Box */}
            {selectedProfileId === 'custom' && (
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <label className="text-slate-500 block mb-1">Unit</label>
                  <select
                    value={customUnit}
                    onChange={(e) => setCustomUnit(e.target.value as CustomUnit)}
                    className="w-full px-2 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700"
                  >
                    <option value="mm">mm</option>
                    <option value="cm">cm</option>
                    <option value="inch">inch</option>
                    <option value="px">px</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-500 block mb-1">Width</label>
                  <input
                    type="number"
                    value={customWidthVal}
                    onChange={(e) => setCustomWidthVal(Number(e.target.value))}
                    className="w-full px-2 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700"
                  />
                </div>
                <div>
                  <label className="text-slate-500 block mb-1">Height</label>
                  <input
                    type="number"
                    value={customHeightVal}
                    onChange={(e) => setCustomHeightVal(Number(e.target.value))}
                    className="w-full px-2 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700"
                  />
                </div>
                <div>
                  <label className="text-slate-500 block mb-1">DPI</label>
                  <select
                    value={customDpi}
                    onChange={(e) => setCustomDpi(Number(e.target.value))}
                    className="w-full px-2 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700"
                  >
                    <option value={150}>150 DPI</option>
                    <option value={300}>300 DPI</option>
                    <option value={600}>600 DPI</option>
                  </select>
                </div>
              </div>
            )}

            {/* Segmented Step Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-x-auto text-xs font-medium">
              <button
                type="button"
                onClick={() => setActiveTab('align')}
                className={`px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'align'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Move className="w-3.5 h-3.5" />
                1. Crop & Position
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('background')}
                className={`px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'background'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Palette className="w-3.5 h-3.5" />
                2. Background Color
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('enhance')}
                className={`px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'enhance'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Sun className="w-3.5 h-3.5" />
                3. Lighting & Retouch
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('suit')}
                className={`px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'suit'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Shirt className="w-3.5 h-3.5" />
                4. Formal Attire
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('print')}
                className={`px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'print'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Printer className="w-3.5 h-3.5" />
                5. Printable Sheet
              </button>
            </div>
          </div>

          {/* Main Workspace Grid (Canvas on Left, Controls on Right) */}
          {activeTab !== 'print' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Interactive Canvas */}
              <div className="lg:col-span-7 space-y-4">
                <div className="glass-panel p-4 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      Live Biometric Canvas
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleAutoAlign}
                        className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 font-medium transition-colors flex items-center gap-1"
                      >
                        <Sparkles className="w-3 h-3" />
                        Auto-Center
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowOverlayGuide(!showOverlayGuide)}
                        className={`px-2.5 py-1 rounded-lg border transition-colors flex items-center gap-1 ${
                          showOverlayGuide
                            ? 'bg-indigo-600 text-white border-indigo-600'
                            : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        <Eye className="w-3 h-3" />
                        Guide
                      </button>
                    </div>
                  </div>

                  {/* Canvas Frame */}
                  <div
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleMouseUp}
                    className="relative w-full aspect-[3.5/4.5] max-h-[440px] mx-auto bg-slate-950 rounded-xl overflow-hidden cursor-grab active:cursor-grabbing flex items-center justify-center border border-slate-200 dark:border-slate-800 shadow-inner select-none"
                  >
                    <canvas ref={canvasRef} className="max-w-full max-h-full object-contain" />

                    {/* Subtle Biometric Mask Overlay */}
                    {showOverlayGuide && (
                      <div
                        className="absolute inset-0 pointer-events-none flex items-center justify-center transition-opacity"
                        style={{ opacity: guideOpacity / 100 }}
                      >
                        <svg className="w-full h-full text-indigo-400/80" viewBox="0 0 100 130" fill="none">
                          {/* Outer Margin */}
                          <rect x="2" y="2" width="96" height="126" stroke="currentColor" strokeWidth="0.75" strokeDasharray="3 3" />
                          {/* Head Oval */}
                          <ellipse cx="50" cy="48" rx="22" ry="30" stroke="currentColor" strokeWidth="1.25" />
                          {/* Eye Line */}
                          <line x1="22" y1="42" x2="78" y2="42" stroke="#38BDF8" strokeWidth="0.75" strokeDasharray="2 2" />
                          <text x="80" y="44" fill="#38BDF8" fontSize="3.5" fontWeight="600">Eyes</text>
                          {/* Chin Line */}
                          <line x1="26" y1="78" x2="74" y2="78" stroke="#F59E0B" strokeWidth="0.75" strokeDasharray="2 2" />
                          <text x="76" y="80" fill="#F59E0B" fontSize="3.5" fontWeight="600">Chin</text>
                          {/* Center Vertical Axis */}
                          <line x1="50" y1="6" x2="50" y2="124" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" />
                          {/* Shoulder Curve */}
                          <path d="M 12 125 C 28 102, 72 102, 88 125" stroke="currentColor" strokeWidth="0.75" strokeDasharray="2 2" />
                        </svg>
                      </div>
                    )}

                    <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-sm text-[10px] text-white flex items-center gap-1 opacity-80 pointer-events-none">
                      <Move className="w-3 h-3 text-indigo-400" />
                      Drag to position head within oval
                    </div>
                  </div>

                  {/* Zoom & Rotation Quick Sliders */}
                  <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                    <div>
                      <div className="flex justify-between mb-1 text-slate-500">
                        <span>Zoom</span>
                        <span className="font-semibold text-slate-700 dark:text-slate-300">{Math.round(zoom * 100)}%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setZoom(Math.max(0.4, zoom - 0.1))}
                          className="p-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                        >
                          <ZoomOut className="w-3.5 h-3.5" />
                        </button>
                        <input
                          type="range"
                          min="0.4"
                          max="3"
                          step="0.05"
                          value={zoom}
                          onChange={(e) => setZoom(Number(e.target.value))}
                          className="w-full accent-indigo-600"
                        />
                        <button
                          type="button"
                          onClick={() => setZoom(Math.min(3, zoom + 0.1))}
                          className="p-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                        >
                          <ZoomIn className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1 text-slate-500">
                        <span>Rotate</span>
                        <span className="font-semibold text-slate-700 dark:text-slate-300">{rotation}°</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="range"
                          min="-180"
                          max="180"
                          value={rotation}
                          onChange={(e) => setRotation(Number(e.target.value))}
                          className="w-full accent-indigo-600"
                        />
                        <button
                          type="button"
                          onClick={() => setRotation((prev) => (prev + 90) % 360)}
                          className="p-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                          title="Rotate 90 degrees"
                        >
                          <RotateCw className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Single Photo Download Box */}
                <div className="glass-panel p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 border border-indigo-500/20 bg-indigo-50/20 dark:bg-indigo-950/20">
                  <div className="text-xs space-y-0.5 text-center sm:text-left">
                    <p className="font-semibold text-slate-900 dark:text-white">
                      Single Digital Photo Ready
                    </p>
                    <p className="text-slate-500">
                      {targetDims.w} × {targetDims.h} px · ~{exportKbSize} KB · Ready for online forms
                    </p>
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={() => handleDownloadSingle('jpg')}
                      className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download JPG
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDownloadSingle('png')}
                      className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium text-xs transition-colors"
                    >
                      PNG
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column: Tabbed Adjustments */}
              <div className="lg:col-span-5 space-y-4">
                {/* TAB 1: CROP & POSITION CONTROLS */}
                {activeTab === 'align' && (
                  <div className="glass-panel p-5 rounded-2xl space-y-4">
                    <h3 className="text-xs font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                      <Move className="w-4 h-4 text-indigo-500" />
                      Alignment & Biometric Guide Settings
                    </h3>

                    <div className="space-y-3 text-xs">
                      <div>
                        <div className="flex justify-between text-slate-600 dark:text-slate-400 mb-1">
                          <span>Guide Overlay Opacity</span>
                          <span className="font-medium">{guideOpacity}%</span>
                        </div>
                        <input
                          type="range"
                          min="10"
                          max="100"
                          value={guideOpacity}
                          onChange={(e) => setGuideOpacity(Number(e.target.value))}
                          className="w-full accent-indigo-600"
                        />
                      </div>

                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-1.5 text-slate-600 dark:text-slate-400">
                        <div className="font-semibold text-slate-900 dark:text-white">Official Criteria Reminder</div>
                        <p>· Top of head/hair should sit inside the upper oval boundary.</p>
                        <p>· Eye level must align near the cyan dashed eye line.</p>
                        <p>· Chin should rest near the amber dashed chin line.</p>
                      </div>

                      <button
                        type="button"
                        onClick={handleAutoAlign}
                        className="w-full py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-medium transition-colors flex items-center justify-center gap-2"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                        Re-Center Face Inside Oval
                      </button>
                    </div>
                  </div>
                )}

                {/* TAB 2: BACKGROUND COLOR CONTROLS */}
                {activeTab === 'background' && (
                  <div className="glass-panel p-5 rounded-2xl space-y-4">
                    <h3 className="text-xs font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                      <Palette className="w-4 h-4 text-indigo-500" />
                      Background Color Replacement
                    </h3>

                    <div className="space-y-3">
                      <label className="block text-xs font-medium text-slate-600 dark:text-slate-400">
                        Select Standard Color
                      </label>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <button
                          type="button"
                          onClick={() => setBgChoice('white')}
                          className={`p-2.5 rounded-xl border flex items-center gap-2 text-left transition-all ${
                            bgChoice === 'white'
                              ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-950 dark:text-indigo-200 font-semibold'
                              : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                          }`}
                        >
                          <span className="w-4 h-4 rounded-full bg-white border border-slate-300 shadow-sm shrink-0" />
                          <span>Plain White</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setBgChoice('off-white')}
                          className={`p-2.5 rounded-xl border flex items-center gap-2 text-left transition-all ${
                            bgChoice === 'off-white'
                              ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-950 dark:text-indigo-200 font-semibold'
                              : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                          }`}
                        >
                          <span className="w-4 h-4 rounded-full bg-[#F8F9FA] border border-slate-300 shadow-sm shrink-0" />
                          <span>Off-White</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setBgChoice('sky-blue')}
                          className={`p-2.5 rounded-xl border flex items-center gap-2 text-left transition-all ${
                            bgChoice === 'sky-blue'
                              ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-950 dark:text-indigo-200 font-semibold'
                              : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                          }`}
                        >
                          <span className="w-4 h-4 rounded-full bg-[#E0F2FE] border border-sky-300 shadow-sm shrink-0" />
                          <span>Light Blue</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setBgChoice('light-grey')}
                          className={`p-2.5 rounded-xl border flex items-center gap-2 text-left transition-all ${
                            bgChoice === 'light-grey'
                              ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-950 dark:text-indigo-200 font-semibold'
                              : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                          }`}
                        >
                          <span className="w-4 h-4 rounded-full bg-[#F3F4F6] border border-slate-300 shadow-sm shrink-0" />
                          <span>Light Grey</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setBgChoice('transparent')}
                          className={`p-2.5 rounded-xl border flex items-center gap-2 text-left transition-all ${
                            bgChoice === 'transparent'
                              ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-950 dark:text-indigo-200 font-semibold'
                              : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                          }`}
                        >
                          <span className="w-4 h-4 rounded-full bg-gradient-to-tr from-slate-200 to-slate-400 border border-slate-300 shrink-0" />
                          <span>Transparent</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setBgChoice('original')}
                          className={`p-2.5 rounded-xl border flex items-center gap-2 text-left transition-all ${
                            bgChoice === 'original'
                              ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-950 dark:text-indigo-200 font-semibold'
                              : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                          }`}
                        >
                          <span className="w-4 h-4 rounded-full bg-slate-400 shrink-0" />
                          <span>Original BG</span>
                        </button>
                      </div>

                      {bgChoice !== 'original' && (
                        <div className="space-y-3 pt-2 text-xs">
                          <div>
                            <div className="flex justify-between text-slate-600 dark:text-slate-400 mb-1">
                              <span>Background Removal Tolerance</span>
                              <span className="font-medium">{bgTolerance}%</span>
                            </div>
                            <input
                              type="range"
                              min="15"
                              max="70"
                              value={bgTolerance}
                              onChange={(e) => setBgTolerance(Number(e.target.value))}
                              className="w-full accent-indigo-600"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* TAB 3: LIGHTING & RETOUCH CONTROLS */}
                {activeTab === 'enhance' && (
                  <div className="glass-panel p-5 rounded-2xl space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                        <Sun className="w-4 h-4 text-indigo-500" />
                        Lighting & Facial Retouching
                      </h3>
                      <button
                        type="button"
                        onClick={handleAutoEnhance}
                        className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 text-xs font-medium hover:bg-indigo-100 flex items-center gap-1"
                      >
                        <Sparkles className="w-3 h-3" />
                        Auto-Enhance
                      </button>
                    </div>

                    <div className="space-y-3.5 text-xs">
                      <div>
                        <div className="flex justify-between text-slate-600 dark:text-slate-400 mb-1">
                          <span>Brightness</span>
                          <span className="font-medium">{brightness > 0 ? `+${brightness}` : brightness}</span>
                        </div>
                        <input
                          type="range"
                          min="-40"
                          max="40"
                          value={brightness}
                          onChange={(e) => setBrightness(Number(e.target.value))}
                          className="w-full accent-indigo-600"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between text-slate-600 dark:text-slate-400 mb-1">
                          <span>Contrast</span>
                          <span className="font-medium">{contrast > 0 ? `+${contrast}` : contrast}</span>
                        </div>
                        <input
                          type="range"
                          min="-40"
                          max="40"
                          value={contrast}
                          onChange={(e) => setContrast(Number(e.target.value))}
                          className="w-full accent-indigo-600"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between text-slate-600 dark:text-slate-400 mb-1">
                          <span>Warmth (Color Temp)</span>
                          <span className="font-medium">{warmth > 0 ? `+${warmth}` : warmth}</span>
                        </div>
                        <input
                          type="range"
                          min="-40"
                          max="40"
                          value={warmth}
                          onChange={(e) => setWarmth(Number(e.target.value))}
                          className="w-full accent-indigo-600"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between text-slate-600 dark:text-slate-400 mb-1">
                          <span>Facial Clarity / Sharpness</span>
                          <span className="font-medium">{clarity}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="80"
                          value={clarity}
                          onChange={(e) => setClarity(Number(e.target.value))}
                          className="w-full accent-indigo-600"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between text-slate-600 dark:text-slate-400 mb-1">
                          <span>Skin Smoothing</span>
                          <span className="font-medium">{skinSmooth}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="70"
                          value={skinSmooth}
                          onChange={(e) => setSkinSmooth(Number(e.target.value))}
                          className="w-full accent-indigo-600"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between text-slate-600 dark:text-slate-400 mb-1">
                          <span>De-Glare (Flash Suppression)</span>
                          <span className="font-medium">{deGlare}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="70"
                          value={deGlare}
                          onChange={(e) => setDeGlare(Number(e.target.value))}
                          className="w-full accent-indigo-600"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={handleResetAdjustments}
                        className="w-full py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-700 text-xs transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Undo className="w-3 h-3" />
                        Reset Adjustments
                      </button>
                    </div>
                  </div>
                )}

                {/* TAB 4: FORMAL SUIT OVERLAY */}
                {activeTab === 'suit' && (
                  <div className="glass-panel p-5 rounded-2xl space-y-4">
                    <h3 className="text-xs font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                      <Shirt className="w-4 h-4 text-indigo-500" />
                      Formal Attire & Suit Overlay
                    </h3>

                    <div className="space-y-3 text-xs">
                      <div className="grid grid-cols-1 gap-2">
                        <button
                          type="button"
                          onClick={() => setSuitOverlay('none')}
                          className={`p-2.5 rounded-xl border flex items-center justify-between text-left transition-all ${
                            suitOverlay === 'none'
                              ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 font-semibold text-indigo-950 dark:text-indigo-200'
                              : 'border-slate-200 dark:border-slate-800'
                          }`}
                        >
                          <span>Original Clothes (No Suit)</span>
                          {suitOverlay === 'none' && <Check className="w-4 h-4 text-indigo-600" />}
                        </button>

                        {Object.entries(SUIT_TEMPLATES).map(([key, template]) => (
                          <button
                            key={key}
                            type="button"
                            onClick={() => setSuitOverlay(key)}
                            className={`p-2.5 rounded-xl border flex items-center justify-between text-left transition-all ${
                              suitOverlay === key
                                ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 font-semibold text-indigo-950 dark:text-indigo-200'
                                : 'border-slate-200 dark:border-slate-800'
                            }`}
                          >
                            <span>{template.label}</span>
                            {suitOverlay === key && <Check className="w-4 h-4 text-indigo-600" />}
                          </button>
                        ))}
                      </div>

                      {suitOverlay !== 'none' && (
                        <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                          <div>
                            <div className="flex justify-between text-slate-600 dark:text-slate-400 mb-1">
                              <span>Suit Scale</span>
                              <span className="font-medium">{Math.round(suitScale * 100)}%</span>
                            </div>
                            <input
                              type="range"
                              min="0.7"
                              max="1.4"
                              step="0.02"
                              value={suitScale}
                              onChange={(e) => setSuitScale(Number(e.target.value))}
                              className="w-full accent-indigo-600"
                            />
                          </div>

                          <div>
                            <div className="flex justify-between text-slate-600 dark:text-slate-400 mb-1">
                              <span>Vertical Position</span>
                              <span className="font-medium">{suitY}px</span>
                            </div>
                            <input
                              type="range"
                              min="-60"
                              max="60"
                              value={suitY}
                              onChange={(e) => setSuitY(Number(e.target.value))}
                              className="w-full accent-indigo-600"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: PRINT SHEET VIEW */}
          {activeTab === 'print' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Sheet Canvas Preview */}
              <div className="lg:col-span-8 space-y-4">
                <div className="glass-panel p-4 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <Grid className="w-3.5 h-3.5 text-indigo-500" />
                      Printable Sheet Layout ({paperSize.toUpperCase()})
                    </span>
                    <span className="text-slate-500">
                      {photoCopies} Photos · 300 DPI High-Res Print
                    </span>
                  </div>

                  <div className="w-full max-h-[500px] overflow-auto bg-slate-900 rounded-xl p-4 flex items-center justify-center border border-slate-200 dark:border-slate-800">
                    <canvas ref={sheetCanvasRef} className="max-w-full max-h-[460px] object-contain shadow-2xl rounded" />
                  </div>
                </div>
              </div>

              {/* Sheet Settings & Downloads */}
              <div className="lg:col-span-4 space-y-4">
                <div className="glass-panel p-5 rounded-2xl space-y-4">
                  <h3 className="text-xs font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <Printer className="w-4 h-4 text-indigo-500" />
                    Print Sheet Configuration
                  </h3>

                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="text-slate-600 dark:text-slate-400 block mb-1">Paper Format</label>
                      <select
                        value={paperSize}
                        onChange={(e) => setPaperSize(e.target.value as any)}
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 font-medium"
                      >
                        <option value="4x6">4 × 6 inch Photo Paper (Standard)</option>
                        <option value="a4">A4 Standard Sheet (210 × 297 mm)</option>
                        <option value="5x7">5 × 7 inch Photo Paper</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-slate-600 dark:text-slate-400 block mb-1">Orientation</label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setPaperOrientation('portrait')}
                          className={`p-2 rounded-lg border text-center font-medium ${
                            paperOrientation === 'portrait'
                              ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200'
                              : 'border-slate-200 dark:border-slate-800'
                          }`}
                        >
                          Portrait
                        </button>
                        <button
                          type="button"
                          onClick={() => setPaperOrientation('landscape')}
                          className={`p-2 rounded-lg border text-center font-medium ${
                            paperOrientation === 'landscape'
                              ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200'
                              : 'border-slate-200 dark:border-slate-800'
                          }`}
                        >
                          Landscape
                        </button>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-slate-600 dark:text-slate-400 mb-1">
                        <span>Number of Copies</span>
                        <span className="font-semibold">{photoCopies} photos</span>
                      </div>
                      <input
                        type="range"
                        min="2"
                        max="16"
                        step="1"
                        value={photoCopies}
                        onChange={(e) => setPhotoCopies(Number(e.target.value))}
                        className="w-full accent-indigo-600"
                      />
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <label className="text-slate-600 dark:text-slate-400 flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={showCropMarks}
                          onChange={(e) => setShowCropMarks(e.target.checked)}
                          className="rounded text-indigo-600 focus:ring-indigo-500"
                        />
                        <span>Show Scissor Cut Marks</span>
                      </label>
                      <Scissors className="w-3.5 h-3.5 text-slate-400" />
                    </div>

                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                      <button
                        type="button"
                        onClick={handleDownloadSheetPdf}
                        className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Download Print PDF
                      </button>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => handleDownloadSheetImage('jpg')}
                          className="py-2 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium text-xs transition-colors flex items-center justify-center gap-1"
                        >
                          <Download className="w-3 h-3" />
                          JPG Image
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDownloadSheetImage('png')}
                          className="py-2 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium text-xs transition-colors flex items-center justify-center gap-1"
                        >
                          <Download className="w-3 h-3" />
                          PNG Image
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
