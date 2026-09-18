import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  ShieldCheck, Upload, Camera, ZoomIn, ZoomOut, RotateCw, RefreshCw, Download,
  Printer, Sliders, Eye, Sparkles, CheckCircle2, AlertTriangle, XCircle, FileText,
  Maximize2, Move, HelpCircle, FileCheck, Layers, Palette, Grid, Scissors,
  Shirt, User, Wand2, Sun, Heart, Sparkle
} from 'lucide-react';
import jsPDF from 'jspdf';
import { ImageUploadArea } from './ImageUploadArea';
import { SEOHead } from '../../SEOHead';
import { Breadcrumb } from '../../Breadcrumb';
import { BackButton } from '../../BackButton';
import { formatBytes } from '../../../lib/imageUtils';

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
    name: 'India Visa / e-Visa',
    country: 'India',
    widthMm: 51,
    heightMm: 51,
    widthPx: 600,
    heightPx: 600,
    aspectRatio: '1:1',
    dpi: 300,
    bgRecommended: 'Plain White or Light',
    bgColorHex: '#FFFFFF',
    minKb: 10,
    maxKb: 1000,
    faceRatio: '70% - 80%',
    guidanceText: 'Square 2x2 inch format, equal height and width, light or white background.',
    format: 'JPG'
  },
  'in-passport-printed': {
    id: 'in-passport-printed',
    name: 'India Passport Printed Photo',
    country: 'India',
    widthMm: 35,
    heightMm: 45,
    widthPx: 413,
    heightPx: 531,
    aspectRatio: '3.5:4.5',
    dpi: 300,
    bgRecommended: 'White or Off-White',
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
    maxKb: 10000,
    faceRatio: '50% - 69%',
    guidanceText: '2x2 inches (51x51 mm), head must be between 1 and 1 3/8 inches.',
    format: 'JPG'
  },
  'eu-schengen': {
    id: 'eu-schengen',
    name: 'Schengen Europe Visa',
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
    guidanceText: '35x45 mm, light background (not pure white for some embassies), neutral expression.',
    format: 'JPG'
  },
  'uk-passport': {
    id: 'uk-passport',
    name: 'UK Passport & Visa',
    country: 'United Kingdom',
    widthMm: 35,
    heightMm: 45,
    widthPx: 413,
    heightPx: 531,
    aspectRatio: '3.5:4.5',
    dpi: 300,
    bgRecommended: 'Light Grey or Cream',
    bgColorHex: '#F3F4F6',
    minKb: 10,
    maxKb: 500,
    faceRatio: '65% - 75%',
    guidanceText: '35x45 mm, cream or light grey background, no red eye or shadows.',
    format: 'JPG'
  },
  'custom': {
    id: 'custom',
    name: 'Custom Dimensions',
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
    name: 'Other Country / General ID',
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

type ActiveTab = 'edit' | 'smart-adjust' | 'repair' | 'print';
type CustomUnit = 'mm' | 'cm' | 'inch' | 'px';

// Formal Suits SVG Vector Templates for Photo Overlay
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
    label: "Men's White Shirt & Dark Tie",
    svg: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 350"><path d="M 110 350 L 145 180 L 175 160 Q 200 170 225 160 L 255 180 L 290 350 Z" fill="%23F9FAFB"/><path d="M 175 160 L 155 185 L 185 180 Z" fill="%23E5E7EB"/><path d="M 225 160 L 245 185 L 215 180 Z" fill="%23E5E7EB"/><path d="M 193 162 L 207 162 L 210 250 L 200 280 L 190 250 Z" fill="%23111827"/><polygon points="193,162 207,162 204,175 196,175" fill="%23374151"/></svg>`
  },
  'womens-formal-suit': {
    label: "Women's Dark Formal Suit",
    svg: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 350"><path d="M 115 350 L 145 175 L 175 160 L 200 220 L 225 160 L 255 175 L 285 350 Z" fill="%231F2937"/><path d="M 175 160 Q 200 180 225 160 L 215 230 L 185 230 Z" fill="%23FFFFFF"/><path d="M 115 350 Q 85 240 145 175 L 175 160 L 165 260 L 115 350 Z" fill="%23111827"/><path d="M 285 350 Q 315 240 255 175 L 225 160 L 235 260 L 285 350 Z" fill="%23111827"/></svg>`
  },
  'womens-black-blazer': {
    label: "Women's Navy Blazer",
    svg: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 350"><path d="M 115 350 L 145 175 L 175 160 L 200 220 L 225 160 L 255 175 L 285 350 Z" fill="%231E3A8A"/><path d="M 175 160 Q 200 180 225 160 L 215 230 L 185 230 Z" fill="%23F3F4F6"/><path d="M 115 350 Q 85 240 145 175 L 175 160 L 165 260 L 115 350 Z" fill="%23172554"/><path d="M 285 350 Q 315 240 255 175 L 225 160 L 235 260 L 285 350 Z" fill="%23172554"/></svg>`
  }
};

export const PassportPhotoMakerTool: React.FC<PassportPhotoMakerToolProps> = ({ onShowToast, onNavigate }) => {
  // Navigation & Tab state
  const [activeTab, setActiveTab] = useState<ActiveTab>('edit');

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
  const [rotation, setRotation] = useState<number>(0); // degrees
  const [brightness, setBrightness] = useState<number>(0); // -100 to 100
  const [contrast, setContrast] = useState<number>(0); // -100 to 100
  const [saturation, setSaturation] = useState<number>(0); // -100 to 100
  const [warmth, setWarmth] = useState<number>(0); // -100 to 100 (Color Temperature)
  const [clarity, setClarity] = useState<number>(0); // 0 to 100 (Facial detail & edge contrast)

  // PHOTO REPAIR & RETOUCHING STATE
  const [skinSmooth, setSkinSmooth] = useState<number>(0); // 0-100% (Blemish & Wrinkle reduction)
  const [deGlare, setDeGlare] = useState<number>(0); // 0-100% (Flash glare removal)
  const [deBlur, setDeBlur] = useState<number>(0); // 0-100% (Facial sharpening / clarity)
  const [hairTone, setHairTone] = useState<'original' | 'dark-black' | 'natural-brown' | 'silver-grey'>('original');

  // AGE TRANSFORMATION STATE
  const [agePreset, setAgePreset] = useState<'younger' | 'natural' | 'mature' | 'senior'>('natural');
  const [ageShift, setAgeShift] = useState<number>(0); // -30 to +40 years

  // CLOTHES COLOR CHANGE STATE
  const [clothesColorPreset, setClothesColorPreset] = useState<'original' | 'navy' | 'black' | 'royal-blue' | 'maroon' | 'emerald' | 'white' | 'custom'>('original');
  const [customClothesHex, setCustomClothesHex] = useState<string>('#1E3A8A');
  const [clothesHueShift, setClothesHueShift] = useState<number>(0); // -180 to 180 degrees

  // FORMAL SUIT OVERLAY STATE
  const [suitOverlay, setSuitOverlay] = useState<string>('none');
  const [suitScale, setSuitScale] = useState<number>(1.0);
  const [suitX, setSuitX] = useState<number>(0);
  const [suitY, setSuitY] = useState<number>(0);

  // Background replacement
  const [bgChoice, setBgChoice] = useState<'original' | 'white' | 'off-white' | 'light-grey' | 'custom'>('white');
  const [customBgHex, setCustomBgHex] = useState<string>('#FFFFFF');
  const [bgThreshold, setBgThreshold] = useState<number>(35); // tolerance for background replacement

  // Visual Overlay Guide
  const [showOverlayGuide, setShowOverlayGuide] = useState<boolean>(true);

  // Output JPG quality & Single Photo export
  const [jpgQuality, setJpgQuality] = useState<number>(95);
  const [exportBlob, setExportBlob] = useState<Blob | null>(null);
  const [exportUrl, setExportUrl] = useState<string>('');
  const [exportKbSize, setExportKbSize] = useState<number>(0);

  // Print Sheet Options
  const [paperSize, setPaperSize] = useState<'a4' | 'a5' | '4x6' | '5x7'>('a4');
  const [paperOrientation, setPaperOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [photoCopies, setPhotoCopies] = useState<number>(8);
  const [showCropMarks, setShowCropMarks] = useState<boolean>(true);
  const [sheetMarginMm, setSheetMarginMm] = useState<number>(10);
  const [photoSpacingMm, setPhotoSpacingMm] = useState<number>(5);

  // Touch & Drag state
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Pre-loaded Suit HTMLImageElements cache
  const suitImageMapRef = useRef<Record<string, HTMLImageElement>>({});

  // References
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sheetCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Load Suit SVGs into memory
  useEffect(() => {
    Object.entries(SUIT_TEMPLATES).forEach(([key, template]) => {
      const img = new Image();
      img.src = template.svg;
      img.onload = () => {
        suitImageMapRef.current[key] = img;
      };
    });
  }, []);

  // Calculate actual pixel size depending on profile or custom input
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
      } catch (err) {
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

      // Reset transformations
      setZoom(1);
      setPanX(0);
      setPanY(0);
      setRotation(0);
      setBrightness(0);
      setContrast(0);
      setSaturation(0);
      setWarmth(0);
      setClarity(0);

      // Reset repair & clothes state
      setSkinSmooth(0);
      setDeGlare(0);
      setDeBlur(0);
      setHairTone('original');
      setAgePreset('natural');
      setAgeShift(0);
      setClothesColorPreset('original');
      setClothesHueShift(0);
      setSuitOverlay('none');

      onShowToast('Photo loaded! Use the editor to position your face and retouch your photo.');
    };
    img.onerror = () => {
      onShowToast('Failed to load selected image.');
    };
    img.src = url;
  };

  // One-Click AI Auto Repair
  const handleAutoAIRepair = () => {
    setSkinSmooth(45);
    setDeGlare(35);
    setDeBlur(40);
    setBrightness(5);
    setContrast(10);
    setSaturation(8);
    setWarmth(12);
    setClarity(30);
    onShowToast('✨ Applied AI Auto-Repair: Enhanced contrast, smoothed skin, warmth & clarity!');
  };

  // Render single passport photo onto canvas
  const renderSinglePhoto = useCallback(() => {
    if (!imageElement || !canvasRef.current) return;

    const { w: targetW, h: targetH } = getTargetPixelDimensions();
    const canvas = canvasRef.current;
    canvas.width = targetW;
    canvas.height = targetH;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, targetW, targetH);

    // 1. Fill Background
    let targetBg = '#FFFFFF';
    if (bgChoice === 'off-white') targetBg = '#F8F9FA';
    else if (bgChoice === 'light-grey') targetBg = '#E5E7EB';
    else if (bgChoice === 'custom') targetBg = customBgHex;
    else if (bgChoice === 'original') targetBg = 'transparent';

    if (bgChoice !== 'original') {
      ctx.fillStyle = targetBg;
      ctx.fillRect(0, 0, targetW, targetH);
    }

    // Save context for transform
    ctx.save();

    // Center transform
    ctx.translate(targetW / 2 + panX, targetH / 2 + panY);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(zoom, zoom);

    // Apply color filters via filter string
    const bVal = 100 + brightness;
    const cVal = 100 + contrast;
    const sVal = 100 + saturation;
    ctx.filter = `brightness(${bVal}%) contrast(${cVal}%) saturate(${sVal}%)`;

    const imgW = imageElement.naturalWidth || imageElement.width;
    const imgH = imageElement.naturalHeight || imageElement.height;

    // Draw image centered
    ctx.drawImage(imageElement, -imgW / 2, -imgH / 2, imgW, imgH);

    ctx.restore();

    // 2. Perform Photo Repair & Retouching Pixel Pass (Skin smoothing, De-glare, De-blur, Warmth, Clarity, Age Shift, Clothes Color Shift)
    const hasRepairOrEdit =
      skinSmooth > 0 ||
      deGlare > 0 ||
      deBlur > 0 ||
      warmth !== 0 ||
      clarity > 0 ||
      ageShift !== 0 ||
      agePreset !== 'natural' ||
      hairTone !== 'original' ||
      clothesColorPreset !== 'original' ||
      clothesHueShift !== 0;

    if (hasRepairOrEdit) {
      try {
        const imgData = ctx.getImageData(0, 0, targetW, targetH);
        const data = imgData.data;

        // Effective total age shift
        let totalAge = ageShift;
        if (agePreset === 'younger') totalAge -= 15;
        if (agePreset === 'mature') totalAge += 15;
        if (agePreset === 'senior') totalAge += 30;

        const chestStartRow = Math.round(targetH * 0.58); // Clothes area (lower 42%)
        const hairEndRow = Math.round(targetH * 0.28); // Hair region (top 28%)

        // Target clothes RGB for preset color change
        let presetR = -1, presetG = -1, presetB = -1;
        if (clothesColorPreset === 'navy') { presetR = 30; presetG = 58; presetB = 138; }
        else if (clothesColorPreset === 'black') { presetR = 25; presetG = 25; presetB = 30; }
        else if (clothesColorPreset === 'royal-blue') { presetR = 37; presetG = 99; presetB = 235; }
        else if (clothesColorPreset === 'maroon') { presetR = 127; presetG = 29; presetB = 29; }
        else if (clothesColorPreset === 'emerald') { presetR = 6; presetG = 95; presetB = 70; }
        else if (clothesColorPreset === 'white') { presetR = 245; presetG = 247; presetB = 250; }
        else if (clothesColorPreset === 'custom') {
          const hex = customClothesHex.replace('#', '');
          presetR = parseInt(hex.substring(0, 2), 16) || 30;
          presetG = parseInt(hex.substring(2, 4), 16) || 58;
          presetB = parseInt(hex.substring(4, 6), 16) || 138;
        }

        for (let y = 0; y < targetH; y++) {
          for (let x = 0; x < targetW; x++) {
            const idx = (y * targetW + x) * 4;
            let r = data[idx];
            let g = data[idx + 1];
            let b = data[idx + 2];

            // A. De-glare (Overexposed flash highlight clamping on skin)
            if (deGlare > 0 && r > 225 && g > 225 && b > 225) {
              const damp = (deGlare / 100) * 0.3;
              r = Math.round(r * (1 - damp) + 210 * damp);
              g = Math.round(g * (1 - damp) + 195 * damp);
              b = Math.round(b * (1 - damp) + 180 * damp);
            }

            // B. Warmth (Color Temperature adjustment - golden amber vs cool studio blue)
            if (warmth !== 0) {
              const wFactor = warmth / 100;
              r = Math.min(255, Math.max(0, Math.round(r + wFactor * 24)));
              g = Math.min(255, Math.max(0, Math.round(g + wFactor * 8)));
              b = Math.min(255, Math.max(0, Math.round(b - wFactor * 20)));
            }

            // C. Clarity (Local micro-contrast / facial edge definition)
            if (clarity > 0) {
              const cFactor = clarity / 100;
              const lum = 0.299 * r + 0.587 * g + 0.114 * b;
              const delta = lum - 128;
              const microContrast = delta * cFactor * 0.35;
              r = Math.min(255, Math.max(0, Math.round(r + microContrast)));
              g = Math.min(255, Math.max(0, Math.round(g + microContrast)));
              b = Math.min(255, Math.max(0, Math.round(b + microContrast)));
            }

            // B. Skin Smoothing & Blemish Reduction (Midtone skin detection)
            const isSkin = r > 80 && g > 50 && b > 30 && r > g && r > b && Math.abs(r - g) > 12;
            if (isSkin && skinSmooth > 0) {
              const factor = (skinSmooth / 100) * 0.35;
              const avg = (r + g + b) / 3;
              r = Math.round(r * (1 - factor) + (avg + 10) * factor);
              g = Math.round(g * (1 - factor) + (avg) * factor);
              b = Math.round(b * (1 - factor) + (avg - 10) * factor);
            }

            // C. Age Transformation
            if (totalAge < 0) {
              // Younger: Smooth skin, brighten under-eyes, add youthful skin glow
              if (isSkin) {
                const youthFactor = Math.min(0.25, Math.abs(totalAge) * 0.008);
                r = Math.min(255, Math.round(r + 12 * youthFactor));
                g = Math.min(255, Math.round(g + 10 * youthFactor));
                b = Math.min(255, Math.round(b + 8 * youthFactor));
              }
            } else if (totalAge > 0) {
              // Older / Senior: Hair silvering tint for top hair region
              if (y < hairEndRow && (r < 120 && g < 120 && b < 120)) {
                const silverFactor = Math.min(0.65, totalAge * 0.012);
                r = Math.round(r * (1 - silverFactor) + 210 * silverFactor);
                g = Math.round(g * (1 - silverFactor) + 210 * silverFactor);
                b = Math.round(b * (1 - silverFactor) + 220 * silverFactor);
              }
            }

            // D. Hair Tone Adjustment
            if (y < hairEndRow && (r < 130 && g < 130 && b < 130)) {
              if (hairTone === 'dark-black') {
                r = Math.round(r * 0.5);
                g = Math.round(g * 0.5);
                b = Math.round(b * 0.5);
              } else if (hairTone === 'natural-brown') {
                r = Math.min(255, Math.round(r * 1.3 + 20));
                g = Math.round(g * 0.9);
                b = Math.round(b * 0.6);
              } else if (hairTone === 'silver-grey') {
                const silver = Math.round((r + g + b) / 3 + 80);
                r = Math.min(240, silver);
                g = Math.min(240, silver);
                b = Math.min(250, silver + 10);
              }
            }

            // E. Clothes Color Transformation (Targeting chest/clothing region)
            if (y >= chestStartRow) {
              const isBg = (r > 240 && g > 240 && b > 240) || (r < 15 && g < 15 && b < 15);
              if (!isBg) {
                if (presetR !== -1) {
                  // Apply preset clothes color while preserving fabric shading/luminance
                  const lum = (r * 0.299 + g * 0.587 + b * 0.114) / 255;
                  r = Math.min(255, Math.round(presetR * (0.4 + lum * 0.8)));
                  g = Math.min(255, Math.round(presetG * (0.4 + lum * 0.8)));
                  b = Math.min(255, Math.round(presetB * (0.4 + lum * 0.8)));
                }

                if (clothesHueShift !== 0) {
                  // Hue Rotation
                  const rad = (clothesHueShift * Math.PI) / 180;
                  const cosA = Math.cos(rad);
                  const sinA = Math.sin(rad);
                  const newR = r * (0.213 + 0.787 * cosA - 0.213 * sinA) + g * (0.715 - 0.715 * cosA - 0.715 * sinA) + b * (0.072 - 0.072 * cosA + 0.928 * sinA);
                  const newG = r * (0.213 - 0.213 * cosA + 0.143 * sinA) + g * (0.715 + 0.285 * cosA + 0.140 * sinA) + b * (0.072 - 0.072 * cosA - 0.283 * sinA);
                  const newB = r * (0.213 - 0.213 * cosA - 0.787 * sinA) + g * (0.715 - 0.715 * cosA + 0.715 * sinA) + b * (0.072 + 0.928 * cosA + 0.072 * sinA);

                  r = Math.min(255, Math.max(0, Math.round(newR)));
                  g = Math.min(255, Math.max(0, Math.round(newG)));
                  b = Math.min(255, Math.max(0, Math.round(newB)));
                }
              }
            }

            data[idx] = r;
            data[idx + 1] = g;
            data[idx + 2] = b;
          }
        }

        ctx.putImageData(imgData, 0, 0);
      } catch (err) {
        // Fallback silently if canvas security restricts direct image data access
      }
    }

    // 3. Draw Formal Suit Overlay (If selected)
    if (suitOverlay !== 'none' && suitImageMapRef.current[suitOverlay]) {
      const suitImg = suitImageMapRef.current[suitOverlay];
      const suitW = Math.round(targetW * 0.92 * suitScale);
      const suitH = Math.round(targetH * 0.7 * suitScale);
      const suitDrawX = Math.round(targetW / 2 - suitW / 2 + suitX);
      const suitDrawY = Math.round(targetH * 0.52 + suitY);

      ctx.drawImage(suitImg, suitDrawX, suitDrawY, suitW, suitH);
    }

    // 4. Background Keying & Replacement
    if (bgChoice !== 'original') {
      try {
        const imgData = ctx.getImageData(0, 0, targetW, targetH);
        const data = imgData.data;

        const tempDiv = document.createElement('div');
        tempDiv.style.color = targetBg;
        document.body.appendChild(tempDiv);
        const cs = window.getComputedStyle(tempDiv).color;
        document.body.removeChild(tempDiv);
        const rgbMatch = cs.match(/\d+/g);
        const targetR = rgbMatch ? parseInt(rgbMatch[0], 10) : 255;
        const targetG = rgbMatch ? parseInt(rgbMatch[1], 10) : 255;
        const targetB = rgbMatch ? parseInt(rgbMatch[2], 10) : 255;

        const cornerR = (data[0] + data[(targetW - 1) * 4] + data[(targetW * (targetH - 1)) * 4]) / 3;
        const cornerG = (data[1] + data[(targetW - 1) * 4 + 1] + data[(targetW * (targetH - 1)) * 4 + 1]) / 3;
        const cornerB = (data[2] + data[(targetW - 1) * 4 + 2] + data[(targetW * (targetH - 1)) * 4 + 2]) / 3;

        const thresholdSq = bgThreshold * bgThreshold * 12;

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];

          const distSq = (r - cornerR) ** 2 + (g - cornerG) ** 2 + (b - cornerB) ** 2;

          if (distSq < thresholdSq) {
            const factor = Math.min(1, distSq / thresholdSq);
            data[i] = Math.round(targetR * (1 - factor) + r * factor);
            data[i + 1] = Math.round(targetG * (1 - factor) + g * factor);
            data[i + 2] = Math.round(targetB * (1 - factor) + b * factor);
          }
        }
        ctx.putImageData(imgData, 0, 0);
      } catch (err) {
        // Fallback silently if canvas security blocks image data
      }
    }

    // Generate output blob & preview
    canvas.toBlob(
      (blob) => {
        if (blob) {
          setExportBlob(blob);
          setExportKbSize(Math.round(blob.size / 1024));
          if (exportUrl) URL.revokeObjectURL(exportUrl);
          setExportUrl(URL.createObjectURL(blob));
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
    saturation,
    warmth,
    clarity,
    skinSmooth,
    deGlare,
    deBlur,
    hairTone,
    agePreset,
    ageShift,
    clothesColorPreset,
    customClothesHex,
    clothesHueShift,
    suitOverlay,
    suitScale,
    suitX,
    suitY,
    bgChoice,
    customBgHex,
    bgThreshold,
    jpgQuality,
    exportUrl
  ]);

  useEffect(() => {
    if (imageElement) {
      renderSinglePhoto();
    }
  }, [imageElement, renderSinglePhoto]);

  // Auto Crop / Centering helper
  const handleAutoCrop = () => {
    if (!imageElement) return;

    const { w: targetW, h: targetH } = getTargetPixelDimensions();
    const imgW = imageElement.naturalWidth || imageElement.width;
    const imgH = imageElement.naturalHeight || imageElement.height;

    const scaleW = targetW / imgW;
    const scaleH = targetH / imgH;
    const fitScale = Math.max(scaleW, scaleH) * 1.25;

    setZoom(fitScale);
    setPanX(0);
    setPanY(Math.round(targetH * 0.05));
    setRotation(0);

    onShowToast('Auto-aligned photo position based on guide oval.');
  };

  // Mouse / Touch drag handling for panning canvas
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

    let paperWmm = 210; // A4
    let paperHmm = 297;

    if (paperSize === 'a5') { paperWmm = 148; paperHmm = 210; }
    else if (paperSize === '4x6') { paperWmm = 102; paperHmm = 152; }
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

    const { w: reqW, h: reqH } = getTargetPixelDimensions();
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
        ctx.strokeStyle = '#D1D5DB';
        ctx.setLineDash([8, 8]);
        ctx.lineWidth = 2;
        ctx.strokeRect(currentX - 1, currentY - 1, photoWpx + 2, photoHpx + 2);
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
  }, [paperSize, paperOrientation, photoCopies, showCropMarks, sheetMarginMm, photoSpacingMm, activeProfile, getTargetPixelDimensions]);

  useEffect(() => {
    if (activeTab === 'print') {
      renderPrintSheet();
    }
  }, [activeTab, renderPrintSheet]);

  // Single photo download
  const handleDownloadSinglePhoto = () => {
    if (!canvasRef.current) return;

    const link = document.createElement('a');
    const filename = `passport-photo-${activeProfile.id}-${activeProfile.widthPx}x${activeProfile.heightPx}.jpg`;
    link.download = filename;
    link.href = canvasRef.current.toDataURL('image/jpeg', jpgQuality / 100);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    onShowToast(`Downloaded ${filename} (${exportKbSize} KB)!`);
  };

  // Download Print Sheet as Image (JPG / PNG)
  const handleDownloadPrintSheetImage = (fmt: 'jpg' | 'png') => {
    if (!sheetCanvasRef.current) return;

    const mime = fmt === 'png' ? 'image/png' : 'image/jpeg';
    const link = document.createElement('a');
    link.download = `passport-print-sheet-${paperSize}-${paperOrientation}.${fmt}`;
    link.href = sheetCanvasRef.current.toDataURL(mime, 0.95);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    onShowToast(`Downloaded printable photo sheet as ${fmt.toUpperCase()}!`);
  };

  // Download Print Sheet as PDF
  const handleDownloadPrintSheetPdf = () => {
    if (!sheetCanvasRef.current) return;

    const canvas = sheetCanvasRef.current;
    const imgData = canvas.toDataURL('image/jpeg', 0.95);

    const pdf = new jsPDF({
      orientation: paperOrientation,
      unit: 'mm',
      format: paperSize === 'a4' ? 'a4' : paperSize === 'a5' ? 'a5' : [102, 152]
    });

    const pdfW = pdf.internal.pageSize.getWidth();
    const pdfH = pdf.internal.pageSize.getHeight();

    pdf.addImage(imgData, 'JPEG', 0, 0, pdfW, pdfH);
    pdf.save(`passport-print-sheet-${paperSize}.pdf`);

    onShowToast('Downloaded print-ready PDF document!');
  };

  // Guidance Quality Check logic
  const targetDims = getTargetPixelDimensions();
  const checkResOk = targetDims.w >= (activeProfile.widthPx * 0.8);
  const checkBgOk = bgChoice !== 'original';
  const checkSizeOk = exportKbSize >= (activeProfile.minKb || 10) && exportKbSize <= (activeProfile.maxKb || 5000);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* SEO Head */}
      <SEOHead
        title="Passport Photo Maker - Create Passport, Visa & Age Repair Photos Online"
        description="Create passport, visa and ID photos online with AI Photo Repair, clothes color changer, formal suit overlays, age transformation, background removal, and print-ready PDF sheet generator."
        canonicalPath="/passport-photo-maker.html"
        faqs={[
          {
            question: "What is a passport-size photo?",
            answer: "A passport-size photo is a standardized physical or digital photograph meeting specific government requirements regarding dimensions (e.g., 35x45 mm or 2x2 inches), background color, face position, and file size."
          },
          {
            question: "How can I change clothes color or wear a formal suit in my photo?",
            answer: "Zubware includes built-in clothes color transformation tools (Navy Blue, Black, Royal Blue, Maroon, Emerald) and formal suit overlays (Men's Suit & Tie, White Shirt & Tie, Women's Blazer). You can adjust scale and position to snap a formal outfit onto your photo instantly."
          },
          {
            question: "Can I change person age or retouch my face?",
            answer: "Yes! Our Photo Repair & Touch-Up Suite lets you perform age transformation (Younger, Natural, Mature, Senior), skin blemish & wrinkle smoothing, flash glare removal, and hair tone adjustments."
          },
          {
            question: "Can I make a passport photo from a selfie?",
            answer: "Yes, you can upload a clean, well-lit portrait photo or selfie. Ensure your face is directly facing the camera with a neutral expression and no harsh shadows."
          },
          {
            question: "Can I change the background to white?",
            answer: "Yes! Zubware includes an automated background color modifier that allows you to replace your photo background with plain white, off-white, light grey, or custom hex colors."
          },
          {
            question: "Can I print multiple passport photos on A4 or 4x6 paper?",
            answer: "Yes, our built-in Print Sheet Generator arranges 2, 4, 8, 12, or 16 photo copies onto A4, A5, or 4x6 inch paper with cutting guides and PDF export."
          },
          {
            question: "Are my photos uploaded to a server?",
            answer: "No. All cropping, clothes color changes, age retouching, background styling, and PDF exports are calculated 100% locally inside your web browser. Your photo is never sent to any server."
          }
        ]}
      />

      {/* Navigation Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <BackButton onNavigate={(p) => onNavigate ? onNavigate(p) : window.history.back()} />
          <Breadcrumb
            items={[
              { label: 'Home', path: '/' },
              { label: 'Image Tools', path: '/#category-image-tools' },
              { label: 'Passport & Visa Photo Maker' }
            ]}
            onNavigate={onNavigate}
          />
        </div>
      </div>

      {/* Title Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
          <ShieldCheck className="w-4 h-4" />
          Official Requirements & Photo Repair Suite
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Passport & Visa Photo Maker
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300">
          Create passport photos, change clothes color, wear formal suits, transform age & repair photos instantly.
        </p>
      </div>

      {/* Mandatory Official Legal / Accuracy Notice Banner */}
      <div className="glass-panel p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 text-slate-800 dark:text-slate-200 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs sm:text-sm space-y-1">
          <p className="font-semibold text-amber-900 dark:text-amber-300">
            Important Legal & Official Accuracy Notice:
          </p>
          <p>
            Photo requirements vary by application, country, embassy, passport office or visa type. Always verify current official requirements before submitting your photo.
          </p>
        </div>
      </div>

      {/* Privacy Banner */}
      <div className="glass-panel p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
        <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
        <span>
          <strong>100% Private & In-Browser:</strong> Your photo is processed directly inside your browser. It is never uploaded to Zubware or any remote server.
        </span>
      </div>

      {/* Upload Dropzone (When no image selected) */}
      {!imageElement && (
        <div className="glass-panel p-6 rounded-2xl">
          <ImageUploadArea
            onImageSelected={handleImageSelected}
            accept="image/*,.heic,.heif"
            multiple={false}
            title="Upload your selfie or portrait photo"
            subtitle="Support JPG, PNG, WEBP, HEIC • Front View, Clear Lighting Recommended"
            showCamera={true}
            showClipboard={true}
          />
        </div>
      )}

      {/* Main Studio Interface (When photo loaded) */}
      {imageElement && (
        <div className="space-y-6">
          {/* Studio Top Toolbar / Mode Tabs */}
          <div className="glass-panel p-3 rounded-2xl flex flex-wrap items-center justify-between gap-3 border border-indigo-500/20">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('edit')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  activeTab === 'edit'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <Sliders className="w-4 h-4" />
                1. Edit & Align
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('smart-adjust')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  activeTab === 'smart-adjust'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                2. Smart Adjustment
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('repair')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  activeTab === 'repair'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <Wand2 className="w-4 h-4 text-amber-400" />
                3. Clothes & Age Photo Repair
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('print')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  activeTab === 'print'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <Printer className="w-4 h-4" />
                4. Create Print Sheet (A4 / 4x6)
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleAutoAIRepair}
                className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 hover:bg-amber-500/20 transition-all flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                AI Auto-Repair
              </button>

              <button
                type="button"
                onClick={() => {
                  setImageElement(null);
                  setImageFile(null);
                }}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Change Photo
              </button>
            </div>
          </div>

          {/* MODE TAB 1, 2 & 3 LIVE CANVAS PREVIEW WORKSPACE */}
          {(activeTab === 'edit' || activeTab === 'smart-adjust' || activeTab === 'repair') && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* LEFT / CENTER: CANVAS EDITOR */}
              <div className="lg:col-span-7 space-y-4">
                <div className="glass-panel p-4 rounded-2xl space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Move className="w-4 h-4 text-indigo-500" />
                      Live Photo Canvas
                    </h3>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleAutoCrop}
                        className="px-3 py-1 rounded-lg text-xs font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 hover:bg-indigo-500/20 transition-all flex items-center gap-1.5"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        Auto-Align
                      </button>

                      <button
                        type="button"
                        onClick={() => setShowOverlayGuide(!showOverlayGuide)}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                          showOverlayGuide
                            ? 'bg-indigo-600 text-white border-indigo-600'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Guide Overlay
                      </button>
                    </div>
                  </div>

                  {/* Canvas Container */}
                  <div
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleMouseUp}
                    className="relative w-full aspect-[3/4] max-h-[460px] mx-auto bg-slate-900 rounded-xl overflow-hidden cursor-grab active:cursor-grabbing flex items-center justify-center border-2 border-indigo-500/30 shadow-inner group select-none"
                  >
                    {/* Hidden Working Canvas */}
                    <canvas ref={canvasRef} className="max-w-full max-h-full object-contain" />

                    {/* SVG Guide Overlay */}
                    {showOverlayGuide && (
                      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                        <svg className="w-full h-full text-indigo-400/70" viewBox="0 0 100 133" fill="none">
                          <rect x="2" y="2" width="96" height="129" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
                          <ellipse cx="50" cy="50" rx="24" ry="32" stroke="currentColor" strokeWidth="1.5" className="animate-pulse" />
                          <line x1="20" y1="44" x2="80" y2="44" stroke="#10B981" strokeWidth="1" strokeDasharray="2 2" />
                          <text x="82" y="46" fill="#10B981" fontSize="4" fontWeight="bold">Eyes</text>
                          <line x1="25" y1="82" x2="75" y2="82" stroke="#F59E0B" strokeWidth="1" strokeDasharray="2 2" />
                          <text x="77" y="84" fill="#F59E0B" fontSize="4" fontWeight="bold">Chin</text>
                          <line x1="50" y1="10" x2="50" y2="120" stroke="currentColor" strokeWidth="0.75" strokeDasharray="2 2" />
                          <path d="M 15 125 C 30 105, 70 105, 85 125" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
                        </svg>
                      </div>
                    )}

                    {/* Drag helper tooltip */}
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-[11px] text-white flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
                      <Move className="w-3 h-3 text-indigo-400" />
                      Drag photo to center face inside guide
                    </div>
                  </div>

                  {/* Active Modifications Summary Pills */}
                  <div className="flex flex-wrap items-center gap-2 text-[11px]">
                    <span className="font-semibold text-slate-500">Active Retouching:</span>
                    {saturation !== 0 && <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-medium">Saturation: {saturation > 0 ? `+${saturation}` : saturation}%</span>}
                    {warmth !== 0 && <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 font-medium">Warmth: {warmth > 0 ? `+${warmth}` : warmth}%</span>}
                    {clarity > 0 && <span className="px-2 py-0.5 rounded bg-violet-500/10 text-violet-600 dark:text-violet-400 font-medium">Clarity: {clarity}%</span>}
                    {skinSmooth > 0 && <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-medium">Skin Smooth: {skinSmooth}%</span>}
                    {deGlare > 0 && <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-medium">De-glare: {deGlare}%</span>}
                    {agePreset !== 'natural' && <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 font-medium">Age: {agePreset.toUpperCase()}</span>}
                    {clothesColorPreset !== 'original' && <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium">Clothes: {clothesColorPreset}</span>}
                    {suitOverlay !== 'none' && <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400 font-medium">Suit: Active</span>}
                    {saturation === 0 && warmth === 0 && clarity === 0 && skinSmooth === 0 && deGlare === 0 && agePreset === 'natural' && clothesColorPreset === 'original' && suitOverlay === 'none' && (
                      <span className="text-slate-400 italic">None applied yet — use Smart Adjustments or Repair tab</span>
                    )}
                  </div>

                  {/* Zoom, Rotation & Transform Toolbar */}
                  <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800">
                    <div className="grid grid-cols-2 gap-4">
                      {/* Zoom slider */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-600 dark:text-slate-400 font-medium">Zoom Scale</span>
                          <span className="font-bold text-indigo-600 dark:text-indigo-400">{Math.round(zoom * 100)}%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
                            className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                          >
                            <ZoomOut className="w-3.5 h-3.5" />
                          </button>
                          <input
                            type="range"
                            min="0.5"
                            max="3"
                            step="0.05"
                            value={zoom}
                            onChange={(e) => setZoom(Number(e.target.value))}
                            className="w-full accent-indigo-600"
                          />
                          <button
                            type="button"
                            onClick={() => setZoom(Math.min(3, zoom + 0.1))}
                            className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                          >
                            <ZoomIn className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Rotation controls */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-600 dark:text-slate-400 font-medium">Rotation Angle</span>
                          <span className="font-bold text-indigo-600 dark:text-indigo-400">{rotation}°</span>
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
                            className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 shrink-0"
                            title="Rotate 90°"
                          >
                            <RotateCw className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT SIDE PANELS */}
              <div className="lg:col-span-5 space-y-6">
                {/* TAB 1 SIDE PANELS: SPECIFICATIONS & BACKGROUND */}
                {activeTab === 'edit' && (
                  <>
                    {/* PANEL 1: SPECIFICATION SELECTOR */}
                    <div className="glass-panel p-5 rounded-2xl space-y-3">
                      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2.5">
                        <FileCheck className="w-4 h-4 text-indigo-500" />
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                          Choose Photo Requirement Profile
                        </h3>
                      </div>

                      <select
                        value={selectedProfileId}
                        onChange={(e) => setSelectedProfileId(e.target.value as SpecProfileId)}
                        className="w-full px-3 py-2 text-xs font-medium rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="in-passport">🇮🇳 India Passport (630 × 810 px Online)</option>
                        <option value="in-visa">🇮🇳 India Visa / e-Visa (2x2 inch / 600 × 600 px)</option>
                        <option value="in-passport-printed">🇮🇳 India Passport Printed Photo (35 × 45 mm)</option>
                        <option value="us-passport">🇺🇸 US Passport & Visa (2x2 inch / 600 × 600 px)</option>
                        <option value="eu-schengen">🇪🇺 Schengen Europe Visa (35 × 45 mm)</option>
                        <option value="uk-passport">🇬🇧 UK Passport & Visa (35 × 45 mm)</option>
                        <option value="other">🌐 Other Country / General ID (35 × 45 mm)</option>
                        <option value="custom">⚙️ Custom Dimensions...</option>
                      </select>

                      {selectedProfileId === 'custom' && (
                        <div className="p-3 rounded-xl bg-slate-100/70 dark:bg-slate-800/70 space-y-2 border border-slate-200 dark:border-slate-700">
                          <div className="grid grid-cols-3 gap-2">
                            <div>
                              <label className="text-[10px] text-slate-500">Unit</label>
                              <select
                                value={customUnit}
                                onChange={(e) => setCustomUnit(e.target.value as CustomUnit)}
                                className="w-full px-2 py-1 text-xs rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                              >
                                <option value="mm">mm</option>
                                <option value="cm">cm</option>
                                <option value="inch">inch</option>
                                <option value="px">px</option>
                              </select>
                            </div>
                            <div>
                              <label className="text-[10px] text-slate-500">Width</label>
                              <input
                                type="number"
                                value={customWidthVal}
                                onChange={(e) => setCustomWidthVal(Number(e.target.value))}
                                className="w-full px-2 py-1 text-xs rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] text-slate-500">Height</label>
                              <input
                                type="number"
                                value={customHeightVal}
                                onChange={(e) => setCustomHeightVal(Number(e.target.value))}
                                className="w-full px-2 py-1 text-xs rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                              />
                            </div>
                          </div>

                          {customUnit !== 'px' && (
                            <div>
                              <label className="text-[10px] text-slate-500">DPI (Print Density)</label>
                              <select
                                value={customDpi}
                                onChange={(e) => setCustomDpi(Number(e.target.value))}
                                className="w-full px-2 py-1 text-xs rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                              >
                                <option value={150}>150 DPI (Draft)</option>
                                <option value={300}>300 DPI (Standard Print)</option>
                                <option value={600}>600 DPI (High Res)</option>
                              </select>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="p-3 rounded-xl bg-indigo-500/5 dark:bg-indigo-500/10 border border-indigo-500/20 text-xs space-y-1.5">
                        <div className="flex justify-between font-bold text-slate-900 dark:text-white">
                          <span>{activeProfile.name}</span>
                          <span className="text-indigo-600 dark:text-indigo-400">{targetDims.w} × {targetDims.h} px</span>
                        </div>
                        <div className="grid grid-cols-2 gap-1 text-[11px] text-slate-600 dark:text-slate-400">
                          <div>Physical: {activeProfile.widthMm} × {activeProfile.heightMm} mm</div>
                          <div>Face Ratio: {activeProfile.faceRatio}</div>
                          <div>Background: {activeProfile.bgRecommended}</div>
                          <div>File Size: {activeProfile.minKb || 10} KB - {activeProfile.maxKb || 1000} KB</div>
                        </div>
                        <p className="text-[10px] text-slate-500 italic pt-1 border-t border-indigo-500/10">
                          {activeProfile.guidanceText}
                        </p>
                      </div>
                    </div>

                    {/* PANEL 2: BACKGROUND STYLING */}
                    <div className="glass-panel p-5 rounded-2xl space-y-3">
                      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2.5">
                        <Palette className="w-4 h-4 text-indigo-500" />
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                          Background Color Replacement
                        </h3>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        {[
                          { id: 'white', label: 'Plain White', hex: '#FFFFFF' },
                          { id: 'off-white', label: 'Off-White', hex: '#F8F9FA' },
                          { id: 'light-grey', label: 'Light Grey', hex: '#E5E7EB' },
                          { id: 'original', label: 'Original Photo', hex: '' }
                        ].map((b) => (
                          <button
                            key={b.id}
                            type="button"
                            onClick={() => setBgChoice(b.id as any)}
                            className={`p-2 rounded-xl text-left border flex items-center gap-2 transition-all ${
                              bgChoice === b.id
                                ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                            }`}
                          >
                            {b.hex && (
                              <span
                                className="w-4 h-4 rounded-full border border-slate-400 shrink-0"
                                style={{ backgroundColor: b.hex }}
                              />
                            )}
                            <span className="font-semibold text-[11px]">{b.label}</span>
                          </button>
                        ))}
                      </div>

                      {bgChoice !== 'original' && (
                        <div className="space-y-1 pt-1">
                          <div className="flex justify-between text-[11px] text-slate-500">
                            <span>Background Tolerance</span>
                            <span>{bgThreshold}</span>
                          </div>
                          <input
                            type="range"
                            min="10"
                            max="80"
                            value={bgThreshold}
                            onChange={(e) => setBgThreshold(Number(e.target.value))}
                            className="w-full accent-indigo-600"
                          />
                        </div>
                      )}
                    </div>

                    {/* PANEL 3: COLOR & LIGHTING ADJUSTMENTS */}
                    <div className="glass-panel p-5 rounded-2xl space-y-3">
                      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2.5">
                        <div className="flex items-center gap-2">
                          <Sliders className="w-4 h-4 text-indigo-500" />
                          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                            Color & Lighting
                          </h3>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setBrightness(0);
                            setContrast(0);
                            setSaturation(0);
                          }}
                          className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
                        >
                          Reset Colors
                        </button>
                      </div>

                      <div className="space-y-2.5 text-xs">
                        <div>
                          <div className="flex justify-between text-slate-600 dark:text-slate-400">
                            <span>Brightness</span>
                            <span>{brightness}</span>
                          </div>
                          <input
                            type="range"
                            min="-50"
                            max="50"
                            value={brightness}
                            onChange={(e) => setBrightness(Number(e.target.value))}
                            className="w-full accent-indigo-600"
                          />
                        </div>

                        <div>
                          <div className="flex justify-between text-slate-600 dark:text-slate-400">
                            <span>Contrast</span>
                            <span>{contrast}</span>
                          </div>
                          <input
                            type="range"
                            min="-50"
                            max="50"
                            value={contrast}
                            onChange={(e) => setContrast(Number(e.target.value))}
                            className="w-full accent-indigo-600"
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* TAB 2 SIDE PANELS: SMART ADJUSTMENT (SATURATION, WARMTH, CLARITY) */}
                {activeTab === 'smart-adjust' && (
                  <div className="glass-panel p-5 rounded-2xl space-y-5 border border-indigo-500/20">
                    <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-500" />
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                          Smart Portrait Adjustments
                        </h3>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setSaturation(0);
                          setWarmth(0);
                          setClarity(0);
                          onShowToast('Reset Smart Adjustments');
                        }}
                        className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
                      >
                        Reset Adjustments
                      </button>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      Real-time tuning for skin tone temperature, color richness, and facial feature clarity specifically optimized for portrait photo preparation.
                    </p>

                    {/* Quick Portrait Presets */}
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                        <Sun className="w-3.5 h-3.5 text-amber-500" />
                        Portrait Prep Presets:
                      </label>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        {[
                          { label: '🌟 Warm Studio Glow', sat: 10, warmth: 20, clarity: 30, desc: 'Skin warmth & sharp focus' },
                          { label: '🏛️ Neutral Passport ID', sat: 0, warmth: 0, clarity: 20, desc: 'Balanced official lighting' },
                          { label: '❄️ Cool Professional', sat: -5, warmth: -20, clarity: 35, desc: 'Cool studio flash balance' },
                          { label: '✨ High Clarity HD', sat: 15, warmth: 10, clarity: 60, desc: 'Maximum eye & facial definition' }
                        ].map((preset, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              setSaturation(preset.sat);
                              setWarmth(preset.warmth);
                              setClarity(preset.clarity);
                              onShowToast(`Applied ${preset.label} preset`);
                            }}
                            className="p-2.5 rounded-xl text-left border bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 border-slate-200 dark:border-slate-700 hover:border-indigo-400 transition-all group"
                          >
                            <div className="font-bold text-[11px] text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                              {preset.label}
                            </div>
                            <div className="text-[10px] text-slate-500 line-clamp-1">{preset.desc}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Real-time Sliders */}
                    <div className="space-y-4 pt-2 border-t border-slate-200 dark:border-slate-800">
                      {/* 1. Saturation Slider */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                            <Palette className="w-3.5 h-3.5 text-indigo-500" />
                            Saturation (Color Richness)
                          </span>
                          <span className="font-bold text-indigo-600 dark:text-indigo-400">
                            {saturation > 0 ? `+${saturation}` : saturation}%
                          </span>
                        </div>
                        <input
                          type="range"
                          min="-100"
                          max="100"
                          value={saturation}
                          onChange={(e) => setSaturation(Number(e.target.value))}
                          className="w-full accent-indigo-600 cursor-pointer"
                        />
                        <div className="flex justify-between text-[10px] text-slate-400">
                          <span>Monochrome (-100%)</span>
                          <span>Natural (0%)</span>
                          <span>Vivid (+100%)</span>
                        </div>
                      </div>

                      {/* 2. Warmth Slider */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                            <Sun className="w-3.5 h-3.5 text-amber-500" />
                            Warmth (Color Temperature)
                          </span>
                          <span className="font-bold text-amber-600 dark:text-amber-400">
                            {warmth > 0 ? `+${warmth}` : warmth}%
                          </span>
                        </div>
                        <input
                          type="range"
                          min="-100"
                          max="100"
                          value={warmth}
                          onChange={(e) => setWarmth(Number(e.target.value))}
                          className="w-full accent-amber-500 cursor-pointer"
                        />
                        <div className="flex justify-between text-[10px] text-slate-400">
                          <span>Cool Studio (-100)</span>
                          <span>Neutral (0)</span>
                          <span>Warm Golden (+100)</span>
                        </div>
                      </div>

                      {/* 3. Clarity Slider */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                            <Sparkle className="w-3.5 h-3.5 text-violet-500" />
                            Clarity (Facial Feature Definition)
                          </span>
                          <span className="font-bold text-violet-600 dark:text-violet-400">
                            {clarity}%
                          </span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={clarity}
                          onChange={(e) => setClarity(Number(e.target.value))}
                          className="w-full accent-violet-600 cursor-pointer"
                        />
                        <div className="flex justify-between text-[10px] text-slate-400">
                          <span>Soft Focus (0%)</span>
                          <span>Crisp Portrait HD (100%)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 3 SIDE PANELS: CLOTHES COLOR & AGE PHOTO REPAIR */}
                {activeTab === 'repair' && (
                  <>
                    {/* PANEL 1: CLOTHES COLOR CHANGE & FORMAL SUIT OVERLAY */}
                    <div className="glass-panel p-5 rounded-2xl space-y-4">
                      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2.5">
                        <Shirt className="w-4 h-4 text-emerald-500" />
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                          Clothes Color & Formal Suits
                        </h3>
                      </div>

                      {/* Formal Suit Overlay Selector */}
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                          <Layers className="w-3.5 h-3.5 text-indigo-500" />
                          Wear Formal Suit / Shirt Overlay:
                        </label>
                        <select
                          value={suitOverlay}
                          onChange={(e) => setSuitOverlay(e.target.value)}
                          className="w-full px-3 py-2 text-xs font-medium rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                        >
                          <option value="none">Original Clothing (No Suit Overlay)</option>
                          <option value="mens-black-suit">👔 Men's Black Suit & Tie</option>
                          <option value="mens-navy-suit">👔 Men's Navy Blazer & Blue Tie</option>
                          <option value="mens-white-shirt">👔 Men's White Shirt & Dark Tie</option>
                          <option value="womens-formal-suit">👚 Women's Dark Formal Suit</option>
                          <option value="womens-black-blazer">👚 Women's Navy Blazer</option>
                        </select>

                        {suitOverlay !== 'none' && (
                          <div className="p-3 rounded-xl bg-indigo-500/5 dark:bg-indigo-500/10 border border-indigo-500/20 space-y-2 text-xs">
                            <div className="flex justify-between text-slate-600 dark:text-slate-400">
                              <span>Suit Scale</span>
                              <span>{Math.round(suitScale * 100)}%</span>
                            </div>
                            <input
                              type="range"
                              min="0.6"
                              max="1.6"
                              step="0.02"
                              value={suitScale}
                              onChange={(e) => setSuitScale(Number(e.target.value))}
                              className="w-full accent-indigo-600"
                            />

                            <div className="grid grid-cols-2 gap-2 pt-1">
                              <div>
                                <label className="text-[10px] text-slate-500">Position X (Left/Right)</label>
                                <input
                                  type="range"
                                  min="-60"
                                  max="60"
                                  value={suitX}
                                  onChange={(e) => setSuitX(Number(e.target.value))}
                                  className="w-full accent-indigo-600"
                                />
                              </div>
                              <div>
                                <label className="text-[10px] text-slate-500">Position Y (Up/Down)</label>
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
                          </div>
                        )}
                      </div>

                      {/* Clothes Color Transformation */}
                      <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                          Change Original Clothes Color:
                        </label>

                        <div className="grid grid-cols-4 gap-1.5 text-xs">
                          {[
                            { id: 'original', label: 'Original', hex: '' },
                            { id: 'navy', label: 'Navy Blue', hex: '#1E3A8A' },
                            { id: 'black', label: 'Black', hex: '#1F2937' },
                            { id: 'royal-blue', label: 'Royal Blue', hex: '#2563EB' },
                            { id: 'maroon', label: 'Maroon', hex: '#7F1D1D' },
                            { id: 'emerald', label: 'Emerald', hex: '#065F46' },
                            { id: 'white', label: 'White', hex: '#F9FAFB' },
                            { id: 'custom', label: 'Custom', hex: customClothesHex }
                          ].map((c) => (
                            <button
                              key={c.id}
                              type="button"
                              onClick={() => setClothesColorPreset(c.id as any)}
                              className={`p-1.5 rounded-lg border flex flex-col items-center gap-1 transition-all text-center ${
                                clothesColorPreset === c.id
                                  ? 'bg-indigo-600 text-white border-indigo-600 shadow'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                              }`}
                            >
                              {c.hex && (
                                <span
                                  className="w-3.5 h-3.5 rounded-full border border-slate-400"
                                  style={{ backgroundColor: c.hex }}
                                />
                              )}
                              <span className="text-[10px] font-semibold leading-tight">{c.label}</span>
                            </button>
                          ))}
                        </div>

                        {clothesColorPreset === 'custom' && (
                          <div className="flex items-center gap-2 pt-1">
                            <span className="text-xs text-slate-500">Pick Clothes Color:</span>
                            <input
                              type="color"
                              value={customClothesHex}
                              onChange={(e) => setCustomClothesHex(e.target.value)}
                              className="w-8 h-8 rounded border border-slate-300 cursor-pointer"
                            />
                          </div>
                        )}

                        <div className="space-y-1 pt-2">
                          <div className="flex justify-between text-[11px] text-slate-500">
                            <span>Clothes Color Hue Shift</span>
                            <span>{clothesHueShift}°</span>
                          </div>
                          <input
                            type="range"
                            min="-180"
                            max="180"
                            value={clothesHueShift}
                            onChange={(e) => setClothesHueShift(Number(e.target.value))}
                            className="w-full accent-indigo-600"
                          />
                        </div>
                      </div>
                    </div>

                    {/* PANEL 2: AGE TRANSFORMATION */}
                    <div className="glass-panel p-5 rounded-2xl space-y-4">
                      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2.5">
                        <User className="w-4 h-4 text-amber-500" />
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                          Person Age Transformation
                        </h3>
                      </div>

                      <div className="space-y-2 text-xs">
                        <label className="font-semibold text-slate-700 dark:text-slate-300">Age Presets:</label>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            { id: 'younger', label: '👶 Younger (-15 Yrs)', desc: 'Smooth skin & bright eyes' },
                            { id: 'natural', label: '👤 Natural (Original)', desc: 'Current portrait age' },
                            { id: 'mature', label: '🧔 Mature (+15 Yrs)', desc: 'Refined mature character' },
                            { id: 'senior', label: '👴 Senior (+30 Yrs)', desc: 'Silver hair highlight' }
                          ].map((a) => (
                            <button
                              key={a.id}
                              type="button"
                              onClick={() => {
                                setAgePreset(a.id as any);
                                if (a.id === 'younger') setAgeShift(-15);
                                else if (a.id === 'natural') setAgeShift(0);
                                else if (a.id === 'mature') setAgeShift(15);
                                else if (a.id === 'senior') setAgeShift(30);
                              }}
                              className={`p-2 rounded-xl text-left border transition-all ${
                                agePreset === a.id
                                  ? 'bg-amber-500 text-white border-amber-500 shadow'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                              }`}
                            >
                              <div className="font-bold text-[11px]">{a.label}</div>
                              <div className={`text-[9px] ${agePreset === a.id ? 'text-amber-100' : 'text-slate-500'}`}>{a.desc}</div>
                            </button>
                          ))}
                        </div>

                        <div className="space-y-1 pt-2">
                          <div className="flex justify-between text-[11px] text-slate-500">
                            <span>Custom Age Offset</span>
                            <span className="font-bold">{ageShift > 0 ? `+${ageShift}` : ageShift} Years</span>
                          </div>
                          <input
                            type="range"
                            min="-30"
                            max="40"
                            value={ageShift}
                            onChange={(e) => setAgeShift(Number(e.target.value))}
                            className="w-full accent-amber-500"
                          />
                        </div>
                      </div>
                    </div>

                    {/* PANEL 3: FACIAL PHOTO REPAIR & TOUCH-UP */}
                    <div className="glass-panel p-5 rounded-2xl space-y-3">
                      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2.5">
                        <Wand2 className="w-4 h-4 text-indigo-500" />
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                          Facial Photo Repair & Retouch
                        </h3>
                      </div>

                      <div className="space-y-3 text-xs">
                        {/* Skin Smooth */}
                        <div>
                          <div className="flex justify-between text-slate-600 dark:text-slate-400">
                            <span>Skin Blemish & Wrinkle Smooth</span>
                            <span className="font-semibold text-indigo-600 dark:text-indigo-400">{skinSmooth}%</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={skinSmooth}
                            onChange={(e) => setSkinSmooth(Number(e.target.value))}
                            className="w-full accent-indigo-600"
                          />
                        </div>

                        {/* De-glare */}
                        <div>
                          <div className="flex justify-between text-slate-600 dark:text-slate-400">
                            <span>Flash Glare Reduction</span>
                            <span className="font-semibold text-indigo-600 dark:text-indigo-400">{deGlare}%</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={deGlare}
                            onChange={(e) => setDeGlare(Number(e.target.value))}
                            className="w-full accent-indigo-600"
                          />
                        </div>

                        {/* Hair Tone Selector */}
                        <div>
                          <label className="text-slate-600 dark:text-slate-400 block mb-1">Hair Tone Coverage:</label>
                          <select
                            value={hairTone}
                            onChange={(e) => setHairTone(e.target.value as any)}
                            className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                          >
                            <option value="original">Original Hair Tone</option>
                            <option value="dark-black">Dark Black Hair</option>
                            <option value="natural-brown">Natural Brown Hair</option>
                            <option value="silver-grey">Silver Grey Hair</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* SINGLE PHOTO DOWNLOAD ACTION CARD */}
                <div className="glass-panel p-5 rounded-2xl space-y-3 bg-gradient-to-br from-indigo-500/10 to-violet-500/10 border border-indigo-500/30">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-900 dark:text-white">JPG Output Quality</span>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">{jpgQuality}%</span>
                  </div>
                  <input
                    type="range"
                    min="70"
                    max="100"
                    value={jpgQuality}
                    onChange={(e) => setJpgQuality(Number(e.target.value))}
                    className="w-full accent-indigo-600"
                  />

                  <button
                    type="button"
                    onClick={handleDownloadSinglePhoto}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download Passport Photo (JPG)
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* MODE TAB 3: CREATE PRINT SHEET */}
          {activeTab === 'print' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* LEFT: PRINT CANVAS PREVIEW */}
              <div className="lg:col-span-7 space-y-4">
                <div className="glass-panel p-5 rounded-2xl space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Grid className="w-4 h-4 text-indigo-500" />
                      Print Sheet Preview
                    </h3>
                    <span className="text-xs text-slate-500 font-medium">
                      Paper Size: {paperSize.toUpperCase()} ({paperOrientation})
                    </span>
                  </div>

                  {/* Printable Canvas */}
                  <div className="w-full aspect-[1/1.4] max-h-[520px] bg-slate-800 rounded-xl p-4 flex items-center justify-center overflow-auto border border-slate-700 shadow-inner">
                    <canvas ref={sheetCanvasRef} className="max-w-full max-h-full object-contain shadow-2xl bg-white" />
                  </div>
                </div>
              </div>

              {/* RIGHT: PRINT SHEET CONFIGURATION */}
              <div className="lg:col-span-5 space-y-6">
                <div className="glass-panel p-5 rounded-2xl space-y-4">
                  <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2.5">
                    <Printer className="w-4 h-4 text-indigo-500" />
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      Print Sheet Configuration
                    </h3>
                  </div>

                  {/* Paper Size */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Paper Size</label>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {[
                        { id: 'a4', label: 'A4 Paper (210×297 mm)' },
                        { id: 'a5', label: 'A5 Paper (148×210 mm)' },
                        { id: '4x6', label: '4×6 Inch Photo Paper' },
                        { id: '5x7', label: '5×7 Inch Photo Paper' }
                      ].map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => setPaperSize(p.id as any)}
                          className={`p-2 rounded-xl text-left border transition-all ${
                            paperSize === p.id
                              ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                          }`}
                        >
                          <span className="font-semibold text-[11px]">{p.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Orientation */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div>
                      <label className="text-[11px] text-slate-500">Orientation</label>
                      <select
                        value={paperOrientation}
                        onChange={(e) => setPaperOrientation(e.target.value as any)}
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                      >
                        <option value="portrait">Portrait</option>
                        <option value="landscape">Landscape</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] text-slate-500">Number of Copies</label>
                      <select
                        value={photoCopies}
                        onChange={(e) => setPhotoCopies(Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                      >
                        <option value={2}>2 Copies</option>
                        <option value={4}>4 Copies</option>
                        <option value={6}>6 Copies</option>
                        <option value={8}>8 Copies</option>
                        <option value={12}>12 Copies</option>
                        <option value={16}>16 Copies</option>
                        <option value={20}>20 Copies</option>
                      </select>
                    </div>
                  </div>

                  {/* Margins & Spacing */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] text-slate-500">Page Margin (mm)</label>
                      <input
                        type="number"
                        value={sheetMarginMm}
                        onChange={(e) => setSheetMarginMm(Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] text-slate-500">Photo Spacing (mm)</label>
                      <input
                        type="number"
                        value={photoSpacingMm}
                        onChange={(e) => setPhotoSpacingMm(Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  {/* Crop marks checkbox */}
                  <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      checked={showCropMarks}
                      onChange={(e) => setShowCropMarks(e.target.checked)}
                      className="rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    <Scissors className="w-3.5 h-3.5 text-indigo-500" />
                    Include Cut Lines / Crop Marks
                  </label>

                  {/* EXPORT BUTTONS */}
                  <div className="space-y-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={handleDownloadPrintSheetPdf}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-sm shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2"
                    >
                      <FileText className="w-4 h-4" />
                      Download Printable PDF Document
                    </button>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => handleDownloadPrintSheetImage('jpg')}
                        className="py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Save Sheet (JPG)
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDownloadPrintSheetImage('png')}
                        className="py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Save Sheet (PNG)
                      </button>
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
