import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import {
  Upload,
  Image as ImageIcon,
  Smartphone,
  Monitor,
  Tv,
  Layers,
  Columns3,
  Download,
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  Sliders,
  Info,
  ShieldCheck,
  Sparkles,
  Crosshair,
  Check,
  ArrowRight,
  Search,
  Move,
  ZoomIn,
  ZoomOut,
  Maximize,
  Minimize2,
  Focus,
  SplitSquareVertical,
  Eye,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Palette,
  Pipette,
  Wand2
} from 'lucide-react';

// ============================================================================
// BACKGROUND STYLE & COLOR PALETTE TYPES
// ============================================================================

export type BackgroundStyle = 'gradient' | 'blur' | 'solid' | 'none';

export interface ExtractedPalette {
  leftColor: string;
  rightColor: string;
  topColor: string;
  bottomColor: string;
  centerColor: string;
  dominantColor: string;
  raw: {
    left: [number, number, number];
    right: [number, number, number];
    top: [number, number, number];
    bottom: [number, number, number];
    center: [number, number, number];
    dominant: [number, number, number];
  };
}

export const DEFAULT_PALETTE: ExtractedPalette = {
  leftColor: 'rgb(15, 23, 42)',
  rightColor: 'rgb(30, 27, 75)',
  topColor: 'rgb(15, 23, 42)',
  bottomColor: 'rgb(15, 23, 42)',
  centerColor: 'rgb(30, 41, 59)',
  dominantColor: 'rgb(24, 28, 55)',
  raw: {
    left: [15, 23, 42],
    right: [30, 27, 75],
    top: [15, 23, 42],
    bottom: [15, 23, 42],
    center: [30, 41, 59],
    dominant: [24, 28, 55]
  }
};

/**
 * Samples image edges & center using a hidden offscreen canvas to calculate dominant colors
 */
export const extractPaletteFromImage = (img: HTMLImageElement): ExtractedPalette => {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 36;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });

  if (!ctx) return DEFAULT_PALETTE;

  try {
    ctx.drawImage(img, 0, 0, 64, 36);
    const imgData = ctx.getImageData(0, 0, 64, 36).data;
    const w = 64;
    const h = 36;

    const sampleRegion = (x0: number, x1: number, y0: number, y1: number): [number, number, number] => {
      let r = 0, g = 0, b = 0, count = 0;
      for (let y = y0; y < y1; y++) {
        for (let x = x0; x < x1; x++) {
          const idx = (y * w + x) * 4;
          if (imgData[idx + 3] > 20) {
            r += imgData[idx];
            g += imgData[idx + 1];
            b += imgData[idx + 2];
            count++;
          }
        }
      }
      if (count === 0) return [15, 23, 42];
      return [Math.round(r / count), Math.round(g / count), Math.round(b / count)];
    };

    const left = sampleRegion(0, Math.floor(w * 0.18), 0, h);
    const right = sampleRegion(Math.floor(w * 0.82), w, 0, h);
    const top = sampleRegion(0, w, 0, Math.floor(h * 0.18));
    const bottom = sampleRegion(0, w, Math.floor(h * 0.82), h);
    const center = sampleRegion(Math.floor(w * 0.25), Math.floor(w * 0.75), Math.floor(h * 0.25), Math.floor(h * 0.75));
    const dominant = sampleRegion(0, w, 0, h);

    const toRgb = (rgb: [number, number, number]) => `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;

    return {
      leftColor: toRgb(left),
      rightColor: toRgb(right),
      topColor: toRgb(top),
      bottomColor: toRgb(bottom),
      centerColor: toRgb(center),
      dominantColor: toRgb(dominant),
      raw: {
        left,
        right,
        top,
        bottom,
        center,
        dominant
      }
    };
  } catch (err) {
    console.warn('Could not extract image palette:', err);
    return DEFAULT_PALETTE;
  }
};

/**
 * Smoothly blends a sampled RGB color with an ambient dark background tone based on blend percentage (0-100%)
 */
export const blendRgbWithAmbient = (rgb: [number, number, number], blendPct: number): string => {
  const factor = Math.max(0, Math.min(1, blendPct / 100));
  const baseR = 11;
  const baseG = 15;
  const baseB = 26;

  const r = Math.round(baseR * (1 - factor) + rgb[0] * factor);
  const g = Math.round(baseG * (1 - factor) + rgb[1] * factor);
  const b = Math.round(baseB * (1 - factor) + rgb[2] * factor);

  return `rgb(${r}, ${g}, ${b})`;
};

// ============================================================================
// OFFICIAL YOUTUBE BANNER SPECIFICATIONS & COORDINATE SYSTEM
// (Working Logical Canvas: 2560 × 1440 px, 16:9 Aspect Ratio)
// ============================================================================

export const YOUTUBE_BANNER_SPECS = {
  CANVAS_WIDTH: 2560,
  CANVAS_HEIGHT: 1440,
  ASPECT_RATIO: 16 / 9,
  MIN_UPLOAD_WIDTH: 2048,
  MIN_UPLOAD_HEIGHT: 1152,

  // Mobile & Core Safe Area for Text & Logos (Centered)
  SAFE_WIDTH: 1546,
  SAFE_HEIGHT: 423,
  SAFE_X: 507, // (2560 - 1546) / 2
  SAFE_Y: 508.5, // (1440 - 423) / 2

  // Tablet Visible Dimensions
  TABLET_WIDTH: 1855,
  TABLET_HEIGHT: 423,
  TABLET_X: 352.5, // (2560 - 1855) / 2

  // Desktop Visible Slice (Full width, 423px height)
  DESKTOP_WIDTH: 2560,
  DESKTOP_HEIGHT: 423,
  DESKTOP_Y: 508.5,

  // Percentage Calculations for responsive CSS overlay positioning
  SAFE_WIDTH_PCT: (1546 / 2560) * 100, // ~60.39%
  SAFE_HEIGHT_PCT: (423 / 1440) * 100, // ~29.38%
  SAFE_LEFT_PCT: (507 / 2560) * 100, // ~19.80%
  SAFE_TOP_PCT: (508.5 / 1440) * 100, // ~35.31%

  DESKTOP_HEIGHT_PCT: (423 / 1440) * 100,
  DESKTOP_TOP_PCT: (508.5 / 1440) * 100,
};

// ============================================================================
// SAMPLE BANNER (Designed with text & logos crossing outside the safe area
// to clearly demonstrate the problem and the "Fit to Safe Area" solution)
// ============================================================================

const SAMPLE_BANNER_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2560 1440" width="2560" height="1440">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#090d16" />
      <stop offset="40%" stop-color="#111827" />
      <stop offset="100%" stop-color="#1e1b4b" />
    </linearGradient>
    <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ec4899" />
      <stop offset="50%" stop-color="#8b5cf6" />
      <stop offset="100%" stop-color="#3b82f6" />
    </linearGradient>
  </defs>

  <!-- TV Canvas Background -->
  <rect width="2560" height="1440" fill="url(#bgGrad)" />

  <!-- Abstract TV Background Artwork -->
  <circle cx="350" cy="260" r="220" fill="#3b82f6" opacity="0.18" />
  <circle cx="2250" cy="220" r="260" fill="#ec4899" opacity="0.18" />
  <circle cx="500" cy="1220" r="280" fill="#8b5cf6" opacity="0.15" />
  <circle cx="2150" cy="1240" r="250" fill="#06b6d4" opacity="0.18" />

  <!-- TV Top Corner Guidance -->
  <text x="120" y="120" fill="#64748b" font-family="system-ui, sans-serif" font-size="28" font-weight="700">
    📺 TV BACKGROUND ARTWORK (2560 × 1440)
  </text>
  <text x="2440" y="120" fill="#64748b" font-family="system-ui, sans-serif" font-size="26" font-weight="700" text-anchor="end">
    CROPPED ON DESKTOP &amp; MOBILE
  </text>

  <!-- DESKTOP LATERAL ARTWORK -->
  <g opacity="0.75">
    <rect x="100" y="580" width="340" height="180" rx="16" fill="#1e293b" />
    <text x="270" y="665" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="22" font-weight="700" text-anchor="middle">
      💻 DESKTOP WING
    </text>
    <text x="270" y="700" fill="#64748b" font-family="system-ui, sans-serif" font-size="18" text-anchor="middle">
      (Cropped on Mobile)
    </text>

    <rect x="2120" y="580" width="340" height="180" rx="16" fill="#1e293b" />
    <text x="2290" y="665" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="22" font-weight="700" text-anchor="middle">
      💻 DESKTOP WING
    </text>
    <text x="2290" y="700" fill="#64748b" font-family="system-ui, sans-serif" font-size="18" text-anchor="middle">
      (Cropped on Mobile)
    </text>
  </g>

  <!-- INTENTIONALLY PLACED LOGO & CORE TEXT SHIFTED HIGH (PARTLY OUTSIDE SAFE AREA) -->
  <!-- This showcases the real creator problem: essential branding placed too high! -->
  <g transform="translate(680, 420)">
    <!-- Creator Face Avatar Illustration -->
    <circle cx="100" cy="140" r="100" fill="url(#accentGrad)" />
    <!-- Face Silhouette -->
    <circle cx="100" cy="120" r="45" fill="#ffffff" />
    <path d="M50 210 C50 160, 150 160, 150 210 Z" fill="#ffffff" />

    <!-- Channel Name (crossing the Y=508 boundary!) -->
    <text x="240" y="110" fill="#ffffff" font-family="system-ui, -apple-system, sans-serif" font-size="64" font-weight="950" letter-spacing="-1">
      CREATOR ACADEMY
    </text>
    <text x="240" y="165" fill="#38bdf8" font-family="system-ui, -apple-system, sans-serif" font-size="26" font-weight="800" letter-spacing="1">
      TUTORIALS • REVIEWS • CREATIVE CODING
    </text>
    <rect x="240" y="190" width="480" height="38" rx="8" fill="#ef4444" />
    <text x="480" y="216" fill="#ffffff" font-family="system-ui, sans-serif" font-size="17" font-weight="800" text-anchor="middle" letter-spacing="1">
      ★ NEW VIDEOS EVERY TUESDAY &amp; FRIDAY
    </text>
  </g>
</svg>
`)}`;

export interface ImageMeta {
  width: number;
  height: number;
  aspectRatio: number;
  aspectRatioString: string;
  isOptimal16x9: boolean;
  isRecommendedResolution: boolean;
  isMinimumResolution: boolean;
  fileSizeBytes: number;
  fileSizeFormatted: string;
  fileType: string;
  fileName: string;
}

export type MainToolMode = 'edit' | 'preview';
export type PreviewSubMode = 'mobile' | 'desktop' | 'tv' | 'full' | 'compare';

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const YouTubeBannerSafeAreaTool: React.FC<{ onShowToast: (msg: string) => void }> = ({ onShowToast }) => {
  // Main Navigation Modes
  const [mainMode, setMainMode] = useState<MainToolMode>('edit');
  const [previewDevice, setPreviewDevice] = useState<PreviewSubMode>('mobile');

  // Image Source & Natural Dimensions
  const [bannerSrc, setBannerSrc] = useState<string>(SAMPLE_BANNER_SVG);
  const [imgNaturalSize, setImgNaturalSize] = useState<{ width: number; height: number }>({
    width: 2560,
    height: 1440
  });

  // --------------------------------------------------------------------------
  // INTERACTIVE TRANSFORMATION STATE (Logical 2560 × 1440 coordinate system)
  // --------------------------------------------------------------------------
  const [offsetX, setOffsetX] = useState<number>(0);
  const [offsetY, setOffsetY] = useState<number>(0);
  const [scale, setScale] = useState<number>(1.0);

  // Before/After comparison state
  const [showBeforeAfter, setShowBeforeAfter] = useState<boolean>(false);
  const initialTransformRef = useRef<{ offsetX: number; offsetY: number; scale: number }>({
    offsetX: 0,
    offsetY: 0,
    scale: 1.0
  });

  // Editor Display Toggles
  const [mobileFocus, setMobileFocus] = useState<boolean>(true); // Dims outside area
  const [showSafeAreaBorder, setShowSafeAreaBorder] = useState<boolean>(true);
  const [showCenterCrosshair, setShowCenterCrosshair] = useState<boolean>(true);
  const [showDeviceCutLines, setShowDeviceCutLines] = useState<boolean>(true);

  // Mockup Channel Details for realistic preview
  const [channelName, setChannelName] = useState<string>('Creator Academy');
  const [channelHandle, setChannelHandle] = useState<string>('@CreatorAcademy');
  const [subscriberCount, setSubscriberCount] = useState<string>('248K subscribers');
  const [videoCount, setVideoCount] = useState<string>('312 videos');
  const [showChannelSettings, setShowChannelSettings] = useState<boolean>(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Upload & File Validation Metadata
  const [imageMeta, setImageMeta] = useState<ImageMeta | null>({
    width: 2560,
    height: 1440,
    aspectRatio: 1.778,
    aspectRatioString: '16:9',
    isOptimal16x9: true,
    isRecommendedResolution: true,
    isMinimumResolution: true,
    fileSizeBytes: 85000,
    fileSizeFormatted: '85 KB',
    fileType: 'SVG',
    fileName: 'sample-banner.svg'
  });
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  // --------------------------------------------------------------------------
  // SMART MATCHING BACKGROUND & COLOR PALETTE STATE
  // --------------------------------------------------------------------------
  const [backgroundStyle, setBackgroundStyle] = useState<BackgroundStyle>('gradient');
  const [backgroundBlend, setBackgroundBlend] = useState<number>(70);
  const [extractedPalette, setExtractedPalette] = useState<ExtractedPalette>(DEFAULT_PALETTE);
  const [isMobileSafeApplied, setIsMobileSafeApplied] = useState<boolean>(false);

  // Function to extract colors client-side from an image source
  const analyzeImagePalette = useCallback((source: string) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const palette = extractPaletteFromImage(img);
      setExtractedPalette(palette);
    };
    img.src = source;
  }, []);

  // Analyze palette whenever bannerSrc changes
  useEffect(() => {
    analyzeImagePalette(bannerSrc);
  }, [bannerSrc, analyzeImagePalette]);

  // Dragging interaction state
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStartRef = useRef<{ clientX: number; clientY: number; initialOffsetX: number; initialOffsetY: number }>({
    clientX: 0,
    clientY: 0,
    initialOffsetX: 0,
    initialOffsetY: 0
  });

  // DOM Refs
  const editorContainerRef = useRef<HTMLDivElement | null>(null);
  const bannerImageRef = useRef<HTMLImageElement | null>(null);
  const currentObjectUrlRef = useRef<string | null>(null);

  // Cleanup object URLs
  useEffect(() => {
    return () => {
      if (currentObjectUrlRef.current) {
        URL.revokeObjectURL(currentObjectUrlRef.current);
      }
    };
  }, []);

  // --------------------------------------------------------------------------
  // CALCULATED TRANSFORMATION DIMENSIONS (2560 × 1440 Canvas Basis)
  // --------------------------------------------------------------------------
  // The base fitted dimensions preserving natural aspect ratio
  const { baseW, baseH } = useMemo(() => {
    const naturalRatio = imgNaturalSize.width / (imgNaturalSize.height || 1);
    const canvasRatio = YOUTUBE_BANNER_SPECS.CANVAS_WIDTH / YOUTUBE_BANNER_SPECS.CANVAS_HEIGHT;

    let bW = YOUTUBE_BANNER_SPECS.CANVAS_WIDTH;
    let bH = YOUTUBE_BANNER_SPECS.CANVAS_HEIGHT;

    if (naturalRatio >= canvasRatio) {
      // Wider than 16:9 -> fit by canvas width
      bW = YOUTUBE_BANNER_SPECS.CANVAS_WIDTH;
      bH = YOUTUBE_BANNER_SPECS.CANVAS_WIDTH / naturalRatio;
    } else {
      // Taller than 16:9 -> fit by canvas height
      bH = YOUTUBE_BANNER_SPECS.CANVAS_HEIGHT;
      bW = YOUTUBE_BANNER_SPECS.CANVAS_HEIGHT * naturalRatio;
    }

    return { baseW: bW, baseH: bH };
  }, [imgNaturalSize]);

  // Scaled dimensions and top-left coordinates on the 2560 × 1440 canvas
  const drawW = baseW * scale;
  const drawH = baseH * scale;
  const drawX = (YOUTUBE_BANNER_SPECS.CANVAS_WIDTH - drawW) / 2 + offsetX;
  const drawY = (YOUTUBE_BANNER_SPECS.CANVAS_HEIGHT - drawH) / 2 + offsetY;

  // Percentage values relative to the 2560 × 1440 canvas
  const canvasLeftPct = (drawX / YOUTUBE_BANNER_SPECS.CANVAS_WIDTH) * 100;
  const canvasTopPct = (drawY / YOUTUBE_BANNER_SPECS.CANVAS_HEIGHT) * 100;
  const canvasWidthPct = (drawW / YOUTUBE_BANNER_SPECS.CANVAS_WIDTH) * 100;
  const canvasHeightPct = (drawH / YOUTUBE_BANNER_SPECS.CANVAS_HEIGHT) * 100;

  // --------------------------------------------------------------------------
  // RELATIVE PERCENTAGES FOR MOBILE CROPPED WINDOW (1546 × 423 px safe area)
  // --------------------------------------------------------------------------
  // The mobile view displays only [SAFE_X, SAFE_X + SAFE_W] × [SAFE_Y, SAFE_Y + SAFE_H]
  const mobileLeftPct = ((drawX - YOUTUBE_BANNER_SPECS.SAFE_X) / YOUTUBE_BANNER_SPECS.SAFE_WIDTH) * 100;
  const mobileTopPct = ((drawY - YOUTUBE_BANNER_SPECS.SAFE_Y) / YOUTUBE_BANNER_SPECS.SAFE_HEIGHT) * 100;
  const mobileWidthPct = (drawW / YOUTUBE_BANNER_SPECS.SAFE_WIDTH) * 100;
  const mobileHeightPct = (drawH / YOUTUBE_BANNER_SPECS.SAFE_HEIGHT) * 100;

  // --------------------------------------------------------------------------
  // RELATIVE PERCENTAGES FOR DESKTOP CROPPED WINDOW (2560 × 423 px strip)
  // --------------------------------------------------------------------------
  const desktopLeftPct = canvasLeftPct;
  const desktopTopPct = ((drawY - YOUTUBE_BANNER_SPECS.DESKTOP_Y) / YOUTUBE_BANNER_SPECS.DESKTOP_HEIGHT) * 100;
  const desktopWidthPct = canvasWidthPct;
  const desktopHeightPct = (drawH / YOUTUBE_BANNER_SPECS.DESKTOP_HEIGHT) * 100;

  // --------------------------------------------------------------------------
  // FILE UPLOAD HANDLERS
  // --------------------------------------------------------------------------
  const handleFileUpload = (file: File) => {
    setUploadError(null);

    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg', 'image/svg+xml'];
    if (!validTypes.includes(file.type)) {
      setUploadError('Unsupported image format. Please upload a JPG, PNG, or WebP image.');
      onShowToast('Please upload a valid JPG, PNG, or WebP banner file.');
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      setUploadError('File is too large. Please upload an image smaller than 20MB.');
      onShowToast('File exceeds 20MB limit.');
      return;
    }

    if (currentObjectUrlRef.current) {
      URL.revokeObjectURL(currentObjectUrlRef.current);
    }

    const objectUrl = URL.createObjectURL(file);
    currentObjectUrlRef.current = objectUrl;

    const img = new Image();
    img.onload = () => {
      const width = img.naturalWidth || img.width;
      const height = img.naturalHeight || img.height;
      const ratio = height > 0 ? width / height : 1.777;
      const is16x9 = ratio >= 1.70 && ratio <= 1.85;
      const isRecommendedResolution = width >= 2560 && height >= 1440;
      const isMinimumResolution = width >= 2048 && height >= 1152;

      let formattedSize = `${(file.size / 1024).toFixed(1)} KB`;
      if (file.size > 1024 * 1024) {
        formattedSize = `${(file.size / (1024 * 1024)).toFixed(2)} MB`;
      }

      setImgNaturalSize({ width, height });
      setImageMeta({
        width,
        height,
        aspectRatio: Math.round(ratio * 1000) / 1000,
        aspectRatioString: is16x9 ? '16:9' : `${(width / (height || 1)).toFixed(2)}:1`,
        isOptimal16x9: is16x9,
        isRecommendedResolution,
        isMinimumResolution,
        fileSizeBytes: file.size,
        fileSizeFormatted: formattedSize,
        fileType: file.type.replace('image/', '').toUpperCase(),
        fileName: file.name
      });

      // Reset transformations for new image
      setOffsetX(0);
      setOffsetY(0);
      setScale(1.0);
      initialTransformRef.current = { offsetX: 0, offsetY: 0, scale: 1.0 };

      setBannerSrc(objectUrl);
      onShowToast('Banner loaded into editor! Drag & zoom to fit the safe area.');
    };

    img.onerror = () => {
      setUploadError('Could not decode image. The file may be damaged or invalid.');
      onShowToast('Error loading image file.');
    };

    img.src = objectUrl;
  };

  // --------------------------------------------------------------------------
  // DRAG INTERACTION (Mouse & Touch)
  // --------------------------------------------------------------------------
  const handleDragStart = (clientX: number, clientY: number) => {
    setIsDragging(true);
    dragStartRef.current = {
      clientX,
      clientY,
      initialOffsetX: offsetX,
      initialOffsetY: offsetY
    };
  };

  const handleDragMove = useCallback((clientX: number, clientY: number) => {
    if (!isDragging || !editorContainerRef.current) return;

    const rect = editorContainerRef.current.getBoundingClientRect();
    // Ratio between logical 2560 canvas and current rendered screen width
    const screenToLogicalRatio = YOUTUBE_BANNER_SPECS.CANVAS_WIDTH / (rect.width || 1);

    const deltaScreenX = clientX - dragStartRef.current.clientX;
    const deltaScreenY = clientY - dragStartRef.current.clientY;

    const newOffsetX = dragStartRef.current.initialOffsetX + deltaScreenX * screenToLogicalRatio;
    const newOffsetY = dragStartRef.current.initialOffsetY + deltaScreenY * screenToLogicalRatio;

    setOffsetX(Math.round(newOffsetX));
    setOffsetY(Math.round(newOffsetY));
  }, [isDragging]);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Global listeners for smooth dragging outside the container
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        e.preventDefault();
        handleDragMove(e.clientX, e.clientY);
      }
    };
    const onMouseUp = () => {
      if (isDragging) handleDragEnd();
    };
    const onTouchMove = (e: TouchEvent) => {
      if (isDragging && e.touches[0]) {
        e.preventDefault();
        handleDragMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };
    const onTouchEnd = () => {
      if (isDragging) handleDragEnd();
    };

    if (isDragging) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
      window.addEventListener('touchmove', onTouchMove, { passive: false });
      window.addEventListener('touchend', onTouchEnd);
    }

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [isDragging, handleDragMove, handleDragEnd]);

  // --------------------------------------------------------------------------
  // QUICK ACTIONS: MAKE MOBILE SAFE, FIT CANVAS, CENTER, RESET
  // --------------------------------------------------------------------------

  // Automatic "Make Mobile Safe" composition:
  // Fits entire original artwork proportionally inside the central 1546 × 423 safe area
  // and enables background fill for surrounding desktop & TV canvas
  const handleMakeMobileSafe = (style: BackgroundStyle = 'gradient') => {
    const targetScale = Math.min(
      YOUTUBE_BANNER_SPECS.SAFE_WIDTH / baseW,
      YOUTUBE_BANNER_SPECS.SAFE_HEIGHT / baseH
    );

    setScale(Number(targetScale.toFixed(4)));
    setOffsetX(0);
    setOffsetY(0);
    setBackgroundStyle(style);
    setIsMobileSafeApplied(true);
    setShowBeforeAfter(false);

    const styleLabels: Record<BackgroundStyle, string> = {
      gradient: 'Fit + Matching Gradient',
      blur: 'Fit + Blurred Extension',
      solid: 'Fit + Solid Dominant Color',
      none: 'Fit Original Banner Only'
    };

    onShowToast(`✨ Mobile-Safe Applied: ${styleLabels[style]}!`);
  };

  // Fit into the central 1546 × 423 safe area
  const handleFitToMobileSafeArea = () => {
    handleMakeMobileSafe(backgroundStyle);
  };

  // Fit to full 2560 × 1440 canvas
  const handleFitToCanvas = () => {
    setScale(1.0);
    setOffsetX(0);
    setOffsetY(0);
    setIsMobileSafeApplied(false);
    onShowToast('Fitted to Full 2560 × 1440 Canvas.');
  };

  // Center image without changing zoom
  const handleCenterImage = () => {
    setOffsetX(0);
    setOffsetY(0);
    onShowToast('Centered image.');
  };

  // Reset to initial position
  const handleResetEdit = () => {
    setOffsetX(0);
    setOffsetY(0);
    setScale(1.0);
    setBackgroundStyle('gradient');
    setIsMobileSafeApplied(false);
    onShowToast('Reset edit position and zoom.');
  };

  // --------------------------------------------------------------------------
  // REUSABLE BACKGROUND LAYER RENDERER
  // --------------------------------------------------------------------------
  const renderBackgroundLayer = (customClass: string = '') => {
    if (backgroundStyle === 'none') {
      return <div className={`absolute inset-0 bg-[#090d16] pointer-events-none ${customClass}`} />;
    }
    if (backgroundStyle === 'solid') {
      const solidColor = blendRgbWithAmbient(extractedPalette.raw.dominant, backgroundBlend);
      return (
        <div
          className={`absolute inset-0 pointer-events-none transition-colors duration-300 ${customClass}`}
          style={{ backgroundColor: solidColor }}
        />
      );
    }
    if (backgroundStyle === 'blur') {
      return (
        <div className={`absolute inset-0 overflow-hidden bg-[#090d16] pointer-events-none ${customClass}`}>
          <img
            src={bannerSrc}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-80 scale-125 select-none transition-opacity duration-300"
          />
          <div className="absolute inset-0 bg-black/25" />
        </div>
      );
    }
    // 'gradient' (horizontal edge-aware gradient with cinematic vertical falloff)
    const left = blendRgbWithAmbient(extractedPalette.raw.left, backgroundBlend);
    const center = blendRgbWithAmbient(extractedPalette.raw.center, backgroundBlend);
    const right = blendRgbWithAmbient(extractedPalette.raw.right, backgroundBlend);
    const gradCss = `linear-gradient(90deg, ${left} 0%, ${center} 50%, ${right} 100%)`;

    return (
      <div className={`absolute inset-0 pointer-events-none overflow-hidden transition-all duration-300 ${customClass}`}>
        <div className="absolute inset-0" style={{ background: gradCss }} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/45" />
      </div>
    );
  };

  // --------------------------------------------------------------------------
  // EXPORT: DOWNLOAD FINAL CLEAN BANNER (2560 × 1440, NO GUIDES/OVERLAYS)
  // --------------------------------------------------------------------------
  const handleDownloadFinalBanner = async () => {
    setIsExporting(true);

    try {
      const exportCanvas = document.createElement('canvas');
      exportCanvas.width = YOUTUBE_BANNER_SPECS.CANVAS_WIDTH; // 2560
      exportCanvas.height = YOUTUBE_BANNER_SPECS.CANVAS_HEIGHT; // 1440
      const ctx = exportCanvas.getContext('2d');

      if (!ctx) {
        throw new Error('Canvas 2D context unavailable');
      }

      // Load original image to render at maximum native resolution
      const img = new Image();
      img.crossOrigin = 'anonymous';

      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('Failed to load image for export'));
        img.src = bannerSrc;
      });

      // 1. Render Background on the full 2560 × 1440 Canvas
      if (backgroundStyle === 'solid') {
        ctx.fillStyle = blendRgbWithAmbient(extractedPalette.raw.dominant, backgroundBlend);
        ctx.fillRect(0, 0, 2560, 1440);
      } else if (backgroundStyle === 'blur') {
        ctx.fillStyle = '#090d16';
        ctx.fillRect(0, 0, 2560, 1440);
        ctx.save();
        try {
          (ctx as unknown as { filter?: string }).filter = 'blur(60px) brightness(0.85)';
        } catch {
          // ignore if canvas filter is unsupported in environment
        }
        ctx.drawImage(img, -150, -100, 2860, 1640);
        ctx.restore();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
        ctx.fillRect(0, 0, 2560, 1440);
      } else if (backgroundStyle === 'gradient') {
        const left = blendRgbWithAmbient(extractedPalette.raw.left, backgroundBlend);
        const center = blendRgbWithAmbient(extractedPalette.raw.center, backgroundBlend);
        const right = blendRgbWithAmbient(extractedPalette.raw.right, backgroundBlend);

        const hGrad = ctx.createLinearGradient(0, 0, 2560, 0);
        hGrad.addColorStop(0, left);
        hGrad.addColorStop(0.5, center);
        hGrad.addColorStop(1, right);
        ctx.fillStyle = hGrad;
        ctx.fillRect(0, 0, 2560, 1440);

        // Vertical cinematic vignette
        const vGrad = ctx.createLinearGradient(0, 0, 0, 1440);
        vGrad.addColorStop(0, 'rgba(0, 0, 0, 0.35)');
        vGrad.addColorStop(0.35, 'rgba(0, 0, 0, 0)');
        vGrad.addColorStop(0.65, 'rgba(0, 0, 0, 0)');
        vGrad.addColorStop(1, 'rgba(0, 0, 0, 0.45)');
        ctx.fillStyle = vGrad;
        ctx.fillRect(0, 0, 2560, 1440);
      } else {
        // Neutral background base
        ctx.fillStyle = '#090d16';
        ctx.fillRect(0, 0, 2560, 1440);
      }

      // 2. Draw user's positioned & scaled original image at exact 2560 × 1440 coordinates
      ctx.drawImage(img, drawX, drawY, drawW, drawH);

      // Export as clean high-quality PNG
      exportCanvas.toBlob(
        (blob) => {
          if (!blob) {
            onShowToast('Export failed. Please try again.');
            setIsExporting(false);
            return;
          }
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.download = 'youtube-channel-banner-mobile-safe-2560x1440.png';
          link.href = url;
          link.click();
          URL.revokeObjectURL(url);
          setIsExporting(false);
          onShowToast('✓ Final 2560×1440 banner downloaded successfully!');
        },
        'image/png',
        0.98
      );
    } catch (err) {
      console.error('Final banner export error:', err);
      onShowToast('Failed to export banner. Please check image permissions.');
      setIsExporting(false);
    }
  };

  // --------------------------------------------------------------------------
  // EXPORT: DOWNLOAD SAFE AREA GUIDE (Includes overlays, labels & cut-lines)
  // --------------------------------------------------------------------------
  const handleDownloadGuide = async () => {
    setIsExporting(true);

    try {
      const exportCanvas = document.createElement('canvas');
      exportCanvas.width = YOUTUBE_BANNER_SPECS.CANVAS_WIDTH;
      exportCanvas.height = YOUTUBE_BANNER_SPECS.CANVAS_HEIGHT;
      const ctx = exportCanvas.getContext('2d');
      if (!ctx) throw new Error('No context');

      ctx.fillStyle = '#090d16';
      ctx.fillRect(0, 0, 2560, 1440);

      const img = new Image();
      img.crossOrigin = 'anonymous';
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('Image load failed'));
        img.src = bannerSrc;
      });

      // 1. Draw image
      ctx.drawImage(img, drawX, drawY, drawW, drawH);

      // 2. Draw outer masks
      ctx.fillStyle = 'rgba(2, 6, 23, 0.65)';
      // Top mask
      ctx.fillRect(0, 0, 2560, YOUTUBE_BANNER_SPECS.DESKTOP_Y);
      // Bottom mask
      ctx.fillRect(0, YOUTUBE_BANNER_SPECS.DESKTOP_Y + YOUTUBE_BANNER_SPECS.DESKTOP_HEIGHT, 2560, YOUTUBE_BANNER_SPECS.DESKTOP_Y);
      // Desktop wings
      ctx.fillStyle = 'rgba(30, 58, 138, 0.35)';
      ctx.fillRect(0, YOUTUBE_BANNER_SPECS.DESKTOP_Y, YOUTUBE_BANNER_SPECS.SAFE_X, YOUTUBE_BANNER_SPECS.SAFE_HEIGHT);
      ctx.fillRect(
        YOUTUBE_BANNER_SPECS.SAFE_X + YOUTUBE_BANNER_SPECS.SAFE_WIDTH,
        YOUTUBE_BANNER_SPECS.DESKTOP_Y,
        YOUTUBE_BANNER_SPECS.SAFE_X,
        YOUTUBE_BANNER_SPECS.SAFE_HEIGHT
      );

      // 3. Desktop Cut Lines
      ctx.strokeStyle = '#60a5fa';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, YOUTUBE_BANNER_SPECS.DESKTOP_Y);
      ctx.lineTo(2560, YOUTUBE_BANNER_SPECS.DESKTOP_Y);
      ctx.moveTo(0, YOUTUBE_BANNER_SPECS.DESKTOP_Y + YOUTUBE_BANNER_SPECS.DESKTOP_HEIGHT);
      ctx.lineTo(2560, YOUTUBE_BANNER_SPECS.DESKTOP_Y + YOUTUBE_BANNER_SPECS.DESKTOP_HEIGHT);
      ctx.stroke();

      // 4. Emerald Safe Area Outline
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 5;
      ctx.strokeRect(
        YOUTUBE_BANNER_SPECS.SAFE_X,
        YOUTUBE_BANNER_SPECS.SAFE_Y,
        YOUTUBE_BANNER_SPECS.SAFE_WIDTH,
        YOUTUBE_BANNER_SPECS.SAFE_HEIGHT
      );

      // 5. Labels & Guidance text
      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 32px sans-serif';
      ctx.fillText('★ MOBILE SAFE AREA (1546 × 423 px) — KEEP TEXT & LOGOS INSIDE', YOUTUBE_BANNER_SPECS.SAFE_X + 20, YOUTUBE_BANNER_SPECS.SAFE_Y + 45);

      ctx.fillStyle = '#94a3b8';
      ctx.font = 'bold 26px sans-serif';
      ctx.fillText('💻 DESKTOP VISIBLE SLICE (2560 × 423 px)', 30, YOUTUBE_BANNER_SPECS.DESKTOP_Y - 15);
      ctx.fillText('📺 TV ONLY CANVAS (2560 × 1440 px)', 30, 60);

      exportCanvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = 'youtube-banner-safe-area-guide-2560x1440.png';
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
        setIsExporting(false);
        onShowToast('Safe Area Guide exported with overlay lines.');
      });
    } catch (e) {
      console.error(e);
      setIsExporting(false);
    }
  };

  // --------------------------------------------------------------------------
  // RENDER UI
  // --------------------------------------------------------------------------
  return (
    <div className="space-y-8 font-sans">
      {/* ===================================================================== */}
      {/* 1. HEADER & PRIMARY ACTION BANNER */}
      {/* ===================================================================== */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2.5 rounded-2xl bg-red-600/10 text-red-600 dark:text-red-400 border border-red-500/20 shadow-xs">
              <ImageIcon className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                YouTube Banner Safe Area Editor &amp; Simulator
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                Drag, scale, and position your banner so your core text, logo, and artwork stay perfectly visible across Mobile, Desktop, and TV.
              </p>
            </div>
          </div>
        </div>

        {/* Primary Export & Reset Action Buttons */}
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          <button
            type="button"
            onClick={handleResetEdit}
            className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 transition-all cursor-pointer"
            title="Reset position & zoom"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Reset Position</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadGuide}
            disabled={isExporting}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
            title="Download banner with safe-area guides and dimensions"
          >
            <Layers className="w-3.5 h-3.5 text-indigo-500" />
            <span>Download Guide</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadFinalBanner}
            disabled={isExporting}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white text-xs font-black shadow-md shadow-red-500/25 flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
            title="Export clean 2560x1440 banner without any overlays"
          >
            <Download className="w-4 h-4" />
            <span>{isExporting ? 'Exporting...' : 'DOWNLOAD FINAL BANNER'}</span>
          </button>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 2. MAIN MODE SWITCH: [ EDIT BANNER ] vs [ PREVIEW ACROSS DEVICES ] */}
      {/* ===================================================================== */}
      <div className="flex items-center justify-between flex-wrap gap-3 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 shadow-xs">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setMainMode('edit')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
              mainMode === 'edit'
                ? 'bg-white dark:bg-slate-900 text-red-600 dark:text-red-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Move className="w-4 h-4" />
            <span>EDIT BANNER (DRAG &amp; FIT)</span>
          </button>

          <button
            type="button"
            onClick={() => setMainMode('preview')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
              mainMode === 'preview'
                ? 'bg-white dark:bg-slate-900 text-red-600 dark:text-red-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>DEVICE PREVIEWS</span>
          </button>
        </div>

        {/* Informative Guidance */}
        <div className="text-xs font-bold text-slate-500 dark:text-slate-400 px-2 flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
          <span>100% Client-Side Privacy: Your images are never uploaded to any server.</span>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 3. EDIT BANNER WORKSPACE (Interactive Drag, Zoom, Live Mobile Feed) */}
      {/* ===================================================================== */}
      {mainMode === 'edit' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* ----------------------------------------------------------------- */}
          {/* LEFT: EDITING TOOLBAR & QUICK ACTIONS (4 cols on lg) */}
          {/* ----------------------------------------------------------------- */}
          <div className="lg:col-span-4 space-y-5">
            {/* UPLOAD SECTION */}
            <div className="glass-card p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-3.5 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black uppercase tracking-wider text-red-600 dark:text-red-400 flex items-center gap-1.5">
                  <Upload className="w-4 h-4" />
                  1. Upload Banner Image
                </h3>
                <span className="text-[11px] font-mono text-slate-400">JPG, PNG, WebP</span>
              </div>

              <label
                onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                    handleFileUpload(e.dataTransfer.files[0]);
                  }
                }}
                className={`flex flex-col items-center justify-center p-5 rounded-2xl border-2 border-dashed cursor-pointer transition-all ${
                  uploadError
                    ? 'border-red-400 bg-red-500/5'
                    : 'border-slate-300 dark:border-slate-700 hover:border-red-500 dark:hover:border-red-500 bg-white/60 dark:bg-slate-900/60'
                }`}
              >
                <ImageIcon className="w-7 h-7 text-red-500 mb-1.5 opacity-80" />
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 text-center">
                  Drag &amp; drop banner or click to upload
                </span>
                <span className="text-[10px] text-slate-400 mt-0.5">
                  Recommended: 2560 × 1440 px
                </span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/jpg"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileUpload(e.target.files[0]);
                    }
                  }}
                  className="hidden"
                />
              </label>

              {uploadError && (
                <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-600 dark:text-red-400 flex items-start gap-1.5">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{uploadError}</span>
                </div>
              )}
            </div>

            {/* ============================================================= */}
            {/* ✨ 2. MAKE MOBILE SAFE AUTO COMPOSITION HERO CARD             */}
            {/* ============================================================= */}
            <div className="glass-card p-5 rounded-3xl border-2 border-emerald-500/30 dark:border-emerald-500/20 bg-emerald-500/[0.03] space-y-4 shadow-sm">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-wider mb-1.5 border border-emerald-500/20">
                    <Wand2 className="w-3 h-3" />
                    <span>One-Click Smart Layout</span>
                  </div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                    Make Mobile Safe
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                    Scales your entire original artwork proportionally inside the mobile safe zone (1546 × 423 px) and automatically fills surrounding Desktop &amp; TV canvas.
                  </p>
                </div>
              </div>

              {/* 4 PRIMARY COMPOSITION PRESETS */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
                  Select Layout &amp; Background:
                </label>

                <div className="grid grid-cols-1 gap-1.5 text-xs font-bold">
                  {/* Option 1: Fit + Matching Gradient (Default) */}
                  <button
                    type="button"
                    onClick={() => handleMakeMobileSafe('gradient')}
                    className={`w-full py-2.5 px-3 rounded-xl flex items-center justify-between text-left border transition-all cursor-pointer ${
                      isMobileSafeApplied && backgroundStyle === 'gradient'
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-emerald-500 shadow-sm'
                        : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-800 hover:border-emerald-500/50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Palette className={`w-4 h-4 ${isMobileSafeApplied && backgroundStyle === 'gradient' ? 'text-white' : 'text-emerald-500'}`} />
                      <span>Fit + Matching Gradient</span>
                    </div>
                    <span className={`text-[10px] uppercase font-mono px-1.5 py-0.5 rounded ${
                      isMobileSafeApplied && backgroundStyle === 'gradient'
                        ? 'bg-black/20 text-white'
                        : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                    }`}>
                      Default
                    </span>
                  </button>

                  {/* Option 2: Fit + Blurred Extension */}
                  <button
                    type="button"
                    onClick={() => handleMakeMobileSafe('blur')}
                    className={`w-full py-2.5 px-3 rounded-xl flex items-center justify-between text-left border transition-all cursor-pointer ${
                      isMobileSafeApplied && backgroundStyle === 'blur'
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-emerald-500 shadow-sm'
                        : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-800 hover:border-emerald-500/50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Layers className={`w-4 h-4 ${isMobileSafeApplied && backgroundStyle === 'blur' ? 'text-white' : 'text-indigo-500'}`} />
                      <span>Fit + Blurred Extension</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-normal">
                      Cinematic
                    </span>
                  </button>

                  {/* Option 3: Fit + Solid Dominant Color */}
                  <button
                    type="button"
                    onClick={() => handleMakeMobileSafe('solid')}
                    className={`w-full py-2.5 px-3 rounded-xl flex items-center justify-between text-left border transition-all cursor-pointer ${
                      isMobileSafeApplied && backgroundStyle === 'solid'
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-emerald-500 shadow-sm'
                        : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-800 hover:border-emerald-500/50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Pipette className={`w-4 h-4 ${isMobileSafeApplied && backgroundStyle === 'solid' ? 'text-white' : 'text-purple-500'}`} />
                      <span>Fit + Solid Dominant Color</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-normal">
                      Clean
                    </span>
                  </button>

                  {/* Option 4: Fit Original Banner Only */}
                  <button
                    type="button"
                    onClick={() => handleMakeMobileSafe('none')}
                    className={`w-full py-2.5 px-3 rounded-xl flex items-center justify-between text-left border transition-all cursor-pointer ${
                      isMobileSafeApplied && backgroundStyle === 'none'
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-emerald-500 shadow-sm'
                        : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-800 hover:border-emerald-500/50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Minimize2 className={`w-4 h-4 ${isMobileSafeApplied && backgroundStyle === 'none' ? 'text-white' : 'text-slate-400'}`} />
                      <span>Fit Original Banner (Dark Base)</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-normal">
                      No Fill
                    </span>
                  </button>
                </div>
              </div>

              {/* BACKGROUND BLEND SLIDER */}
              {backgroundStyle !== 'none' && (
                <div className="space-y-2 pt-2 border-t border-slate-200/60 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Background Blend Intensity:
                    </span>
                    <span className="text-xs font-mono font-black text-slate-600 dark:text-slate-400">
                      {backgroundBlend}%
                    </span>
                  </div>

                  <input
                    type="range"
                    min="10"
                    max="100"
                    step="5"
                    value={backgroundBlend}
                    onChange={(e) => setBackgroundBlend(parseInt(e.target.value, 10))}
                    className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />

                  {/* Extracted Edge Color Swatches */}
                  <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                    <span>Edge Palette:</span>
                    <div className="flex items-center gap-1">
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-xs"
                        style={{ backgroundColor: extractedPalette.leftColor }}
                        title={`Left Edge: ${extractedPalette.leftColor}`}
                      />
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-xs"
                        style={{ backgroundColor: extractedPalette.centerColor }}
                        title={`Center Core: ${extractedPalette.centerColor}`}
                      />
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-xs"
                        style={{ backgroundColor: extractedPalette.rightColor }}
                        title={`Right Edge: ${extractedPalette.rightColor}`}
                      />
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-xs"
                        style={{ backgroundColor: extractedPalette.dominantColor }}
                        title={`Dominant Color: ${extractedPalette.dominantColor}`}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Disclaimer */}
              <p className="text-[10px] text-slate-400 italic pt-1 border-t border-slate-200/40 dark:border-slate-800/60">
                * Optimized for simulated mobile safe area (1546 × 423 px). Final display may vary slightly across specific YouTube apps.
              </p>
            </div>

            {/* MANUAL FINE-TUNING & QUICK ACTIONS */}
            <div className="glass-card p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-3 shadow-sm">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Focus className="w-4 h-4 text-emerald-500" />
                3. Manual Alignment
              </h3>

              <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                <button
                  type="button"
                  onClick={handleFitToCanvas}
                  className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 flex items-center justify-center gap-1.5 border border-slate-200 dark:border-slate-700 transition-all cursor-pointer"
                >
                  <Maximize className="w-3.5 h-3.5 text-blue-500" />
                  <span>Fit Canvas</span>
                </button>

                <button
                  type="button"
                  onClick={handleCenterImage}
                  className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 flex items-center justify-center gap-1.5 border border-slate-200 dark:border-slate-700 transition-all cursor-pointer"
                >
                  <Crosshair className="w-3.5 h-3.5 text-purple-500" />
                  <span>Center</span>
                </button>
              </div>
            </div>

            {/* ZOOM & SCALE CONTROLS */}
            <div className="glass-card p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-3.5 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <ZoomIn className="w-4 h-4 text-indigo-500" />
                  3. Zoom / Scale
                </h3>
                <span className="text-xs font-mono font-black text-slate-700 dark:text-slate-300">
                  {Math.round(scale * 100)}%
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setScale((s) => Math.max(0.2, Number((s - 0.1).toFixed(2))))}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 cursor-pointer"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>

                <input
                  type="range"
                  min="0.2"
                  max="3.0"
                  step="0.02"
                  value={scale}
                  onChange={(e) => setScale(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-red-600"
                />

                <button
                  type="button"
                  onClick={() => setScale((s) => Math.min(3.5, Number((s + 0.1).toFixed(2))))}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 cursor-pointer"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* OVERLAY & FOCUS TOGGLES */}
            <div className="glass-card p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-2.5 shadow-sm text-xs font-bold">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Visual Guides
              </h3>

              <label className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 cursor-pointer">
                <span className="text-slate-700 dark:text-slate-300">Mobile Safe Area Focus (Dim Outside)</span>
                <input
                  type="checkbox"
                  checked={mobileFocus}
                  onChange={(e) => setMobileFocus(e.target.checked)}
                  className="w-4 h-4 accent-red-600 rounded cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 cursor-pointer">
                <span className="text-slate-700 dark:text-slate-300">Show Safe Area Emerald Border</span>
                <input
                  type="checkbox"
                  checked={showSafeAreaBorder}
                  onChange={(e) => setShowSafeAreaBorder(e.target.checked)}
                  className="w-4 h-4 accent-red-600 rounded cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 cursor-pointer">
                <span className="text-slate-700 dark:text-slate-300">Show Center Alignment Guides</span>
                <input
                  type="checkbox"
                  checked={showCenterCrosshair}
                  onChange={(e) => setShowCenterCrosshair(e.target.checked)}
                  className="w-4 h-4 accent-red-600 rounded cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 cursor-pointer">
                <span className="text-slate-700 dark:text-slate-300">Show Desktop / Tablet Cut Lines</span>
                <input
                  type="checkbox"
                  checked={showDeviceCutLines}
                  onChange={(e) => setShowDeviceCutLines(e.target.checked)}
                  className="w-4 h-4 accent-red-600 rounded cursor-pointer"
                />
              </label>
            </div>

            {/* LIVE SYNCHRONIZED MOBILE FEED (Displays real-time crop as user drags) */}
            <div className="glass-card p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-3 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4" />
                  Live Mobile View (Real-Time)
                </h3>
                <span className="text-[10px] font-mono text-emerald-500 font-bold">1546 × 423 px</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                This shows exactly what viewers see on smartphones as you drag or scale:
              </p>

              {/* Mini Smartphone Channel Header */}
              <div className="rounded-2xl bg-[#0f0f0f] border-4 border-slate-800 p-2 text-white shadow-lg overflow-hidden">
                {/* Banner Window in Phone */}
                <div className="relative aspect-[1546/423] w-full overflow-hidden rounded-lg bg-slate-950">
                  {!showBeforeAfter && renderBackgroundLayer()}
                  <img
                    src={bannerSrc}
                    alt="Live Mobile Synchronized Banner"
                    className="absolute max-w-none pointer-events-none select-none transition-none"
                    style={{
                      left: `${mobileLeftPct}%`,
                      top: `${mobileTopPct}%`,
                      width: `${mobileWidthPct}%`,
                      height: `${mobileHeightPct}%`
                    }}
                  />
                  <div className="absolute inset-0 border border-emerald-500/40 pointer-events-none" />
                </div>

                {/* Mini Channel Details */}
                <div className="pt-2 px-1 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-[10px] font-black shrink-0">
                    {channelName.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-black truncate">{channelName}</div>
                    <div className="text-[9px] text-slate-400 truncate">{channelHandle} • {subscriberCount}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ----------------------------------------------------------------- */}
          {/* RIGHT: INTERACTIVE DRAG-AND-SCALE CANVAS (8 cols on lg) */}
          {/* ----------------------------------------------------------------- */}
          <div className="lg:col-span-8 space-y-4">
            <div className="glass-card p-5 sm:p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-sm">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <Move className="w-4 h-4 text-red-500" />
                    Interactive Working Canvas (2560 × 1440)
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Click and drag inside the canvas to position text &amp; logos inside the emerald mobile safe box.
                  </p>
                </div>

                {/* Before / After toggle */}
                <button
                  type="button"
                  onClick={() => setShowBeforeAfter(!showBeforeAfter)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                    showBeforeAfter
                      ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <SplitSquareVertical className="w-3.5 h-3.5" />
                  <span>{showBeforeAfter ? 'Viewing: Original (Before)' : 'Compare: Original (Before)'}</span>
                </button>
              </div>

              {/* ------------------------------------------------------------- */}
              {/* THE 2560 × 1440 INTERACTIVE DRAG CANVAS */}
              {/* ------------------------------------------------------------- */}
              <div
                ref={editorContainerRef}
                onMouseDown={(e) => handleDragStart(e.clientX, e.clientY)}
                onTouchStart={(e) => {
                  if (e.touches[0]) handleDragStart(e.touches[0].clientX, e.touches[0].clientY);
                }}
                className={`relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-950 border-2 shadow-2xl select-none touch-none ${
                  isDragging ? 'cursor-grabbing border-red-500' : 'cursor-grab border-slate-700 hover:border-slate-500'
                }`}
              >
                {/* Background Layer (Auto-Generated Matching Gradient / Blur / Solid) */}
                {!showBeforeAfter && renderBackgroundLayer()}

                {/* 1. The Editable Banner Image Layer */}
                <img
                  ref={bannerImageRef}
                  src={bannerSrc}
                  alt="Editable YouTube Banner Layer"
                  draggable={false}
                  className="absolute max-w-none pointer-events-none select-none transition-none"
                  style={{
                    left: showBeforeAfter ? '0%' : `${canvasLeftPct}%`,
                    top: showBeforeAfter ? '0%' : `${canvasTopPct}%`,
                    width: showBeforeAfter ? '100%' : `${canvasWidthPct}%`,
                    height: showBeforeAfter ? '100%' : `${canvasHeightPct}%`
                  }}
                />

                {/* 2. Visual Dimming Mask outside Mobile Safe Area */}
                {mobileFocus && !showBeforeAfter && (
                  <>
                    {/* Top Mask */}
                    <div
                      className="absolute inset-x-0 top-0 bg-slate-950/75 pointer-events-none transition-opacity"
                      style={{ height: `${YOUTUBE_BANNER_SPECS.SAFE_TOP_PCT}%` }}
                    />
                    {/* Bottom Mask */}
                    <div
                      className="absolute inset-x-0 bottom-0 bg-slate-950/75 pointer-events-none transition-opacity"
                      style={{ height: `${YOUTUBE_BANNER_SPECS.SAFE_TOP_PCT}%` }}
                    />
                    {/* Left Mask */}
                    <div
                      className="absolute bg-slate-950/75 pointer-events-none transition-opacity"
                      style={{
                        top: `${YOUTUBE_BANNER_SPECS.SAFE_TOP_PCT}%`,
                        height: `${YOUTUBE_BANNER_SPECS.SAFE_HEIGHT_PCT}%`,
                        left: 0,
                        width: `${YOUTUBE_BANNER_SPECS.SAFE_LEFT_PCT}%`
                      }}
                    />
                    {/* Right Mask */}
                    <div
                      className="absolute bg-slate-950/75 pointer-events-none transition-opacity"
                      style={{
                        top: `${YOUTUBE_BANNER_SPECS.SAFE_TOP_PCT}%`,
                        height: `${YOUTUBE_BANNER_SPECS.SAFE_HEIGHT_PCT}%`,
                        right: 0,
                        width: `${YOUTUBE_BANNER_SPECS.SAFE_LEFT_PCT}%`
                      }}
                    />
                  </>
                )}

                {/* 3. Desktop & Tablet Cut Lines */}
                {showDeviceCutLines && !showBeforeAfter && (
                  <>
                    {/* Desktop horizontal boundary */}
                    <div
                      className="absolute inset-x-0 border-y border-blue-400/50 pointer-events-none"
                      style={{
                        top: `${YOUTUBE_BANNER_SPECS.DESKTOP_TOP_PCT}%`,
                        height: `${YOUTUBE_BANNER_SPECS.DESKTOP_HEIGHT_PCT}%`
                      }}
                    />
                  </>
                )}

                {/* 4. Emerald Mobile Safe Area Border */}
                {showSafeAreaBorder && !showBeforeAfter && (
                  <div
                    className="absolute border-2 border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.35)] pointer-events-none flex flex-col justify-between p-2"
                    style={{
                      top: `${YOUTUBE_BANNER_SPECS.SAFE_TOP_PCT}%`,
                      height: `${YOUTUBE_BANNER_SPECS.SAFE_HEIGHT_PCT}%`,
                      left: `${YOUTUBE_BANNER_SPECS.SAFE_LEFT_PCT}%`,
                      width: `${YOUTUBE_BANNER_SPECS.SAFE_WIDTH_PCT}%`
                    }}
                  >
                    <div className="flex justify-between items-center text-[9px] sm:text-[10px] font-black uppercase tracking-wider">
                      <span className="px-2 py-0.5 rounded bg-emerald-500 text-slate-950 shadow-xs">
                        ★ MOBILE SAFE AREA (1546 × 423 px)
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-black/80 text-emerald-300 font-mono">
                        Visible on Mobile &amp; Desktop
                      </span>
                    </div>

                    <div className="text-[8px] sm:text-[9px] font-bold text-emerald-300/90 text-right drop-shadow-md">
                      Keep text, faces &amp; logos inside this box
                    </div>
                  </div>
                )}

                {/* 5. Center Alignment Crosshairs */}
                {showCenterCrosshair && !showBeforeAfter && (
                  <>
                    <div className="absolute top-0 bottom-0 left-1/2 w-px -ml-0.5 border-l border-red-500/60 border-dashed pointer-events-none" />
                    <div className="absolute left-0 right-0 top-1/2 h-px -mt-0.5 border-t border-red-500/60 border-dashed pointer-events-none" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full border border-red-500/80 flex items-center justify-center pointer-events-none">
                      <div className="w-1 h-1 rounded-full bg-red-500" />
                    </div>
                  </>
                )}

                {/* Dragging Help Indicator Tag */}
                <div className="absolute bottom-2.5 left-2.5 px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-xs text-[10px] font-bold text-white flex items-center gap-1.5 pointer-events-none">
                  <Move className="w-3 h-3 text-red-400" />
                  <span>{isDragging ? 'Dragging image...' : 'Click & drag image anywhere'}</span>
                </div>
              </div>

              {/* Workflow Guidance & Status Bar */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-0.5">
                  <div className="font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>Workflow: Position inside green box → Preview → Download</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    The exported file is a pure 2560 × 1440 banner containing your composition, ready to upload directly into YouTube Studio.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleDownloadFinalBanner}
                  disabled={isExporting}
                  className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs shrink-0 shadow-md shadow-red-500/20 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Final Banner</span>
                </button>
              </div>

              {/* Dimension & Aspect Ratio Checker */}
              {imageMeta && (
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <Sliders className="w-3.5 h-3.5 text-blue-500" />
                      Uploaded Image Diagnostics
                    </h4>
                    <span className="text-[11px] font-mono text-slate-500 truncate max-w-[200px]">
                      {imageMeta.fileName}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
                      <div className="text-[10px] text-slate-400 font-bold uppercase">Resolution</div>
                      <div className="text-sm font-black text-slate-800 dark:text-slate-200 font-mono mt-0.5">
                        {imageMeta.width} × {imageMeta.height}
                      </div>
                      <span className={`inline-block text-[9px] font-bold px-1.5 py-0.2 rounded mt-1 ${
                        imageMeta.isRecommendedResolution
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          : imageMeta.isMinimumResolution
                          ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                          : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                      }`}>
                        {imageMeta.isRecommendedResolution ? 'Optimal 2560×1440' : imageMeta.isMinimumResolution ? 'Meets Minimum' : 'Below Minimum'}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
                      <div className="text-[10px] text-slate-400 font-bold uppercase">Aspect Ratio</div>
                      <div className="text-sm font-black text-slate-800 dark:text-slate-200 font-mono mt-0.5">
                        {imageMeta.aspectRatioString}
                      </div>
                      <span className={`inline-block text-[9px] font-bold px-1.5 py-0.2 rounded mt-1 ${
                        imageMeta.isOptimal16x9
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                      }`}>
                        {imageMeta.isOptimal16x9 ? 'Optimal 16:9' : 'Non-Standard Ratio'}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
                      <div className="text-[10px] text-slate-400 font-bold uppercase">File Size</div>
                      <div className="text-sm font-black text-slate-800 dark:text-slate-200 font-mono mt-0.5">
                        {imageMeta.fileSizeFormatted}
                      </div>
                      <span className="inline-block text-[9px] font-bold px-1.5 py-0.2 rounded mt-1 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                        Max YouTube: 6 MB
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
                      <div className="text-[10px] text-slate-400 font-bold uppercase">Format</div>
                      <div className="text-sm font-black text-slate-800 dark:text-slate-200 font-mono mt-0.5">
                        {imageMeta.fileType}
                      </div>
                      <span className="inline-block text-[9px] font-bold px-1.5 py-0.2 rounded mt-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                        Ready to Export
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 4. PREVIEW ACROSS DEVICES WORKSPACE (Mobile, Desktop, TV, Compare) */}
      {/* ===================================================================== */}
      {mainMode === 'preview' && (
        <div className="space-y-6">
          {/* Sub-device selector tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 w-fit">
            <button
              type="button"
              onClick={() => setPreviewDevice('mobile')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                previewDevice === 'mobile'
                  ? 'bg-white dark:bg-slate-900 text-red-600 dark:text-red-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Mobile Header</span>
            </button>
            <button
              type="button"
              onClick={() => setPreviewDevice('desktop')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                previewDevice === 'desktop'
                  ? 'bg-white dark:bg-slate-900 text-red-600 dark:text-red-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Desktop Strip</span>
            </button>
            <button
              type="button"
              onClick={() => setPreviewDevice('tv')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                previewDevice === 'tv'
                  ? 'bg-white dark:bg-slate-900 text-red-600 dark:text-red-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Tv className="w-3.5 h-3.5" />
              <span>TV Display</span>
            </button>
            <button
              type="button"
              onClick={() => setPreviewDevice('compare')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                previewDevice === 'compare'
                  ? 'bg-white dark:bg-slate-900 text-red-600 dark:text-red-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Columns3 className="w-3.5 h-3.5" />
              <span>Compare All 3</span>
            </button>
          </div>

          {/* Toggle Channel Mockup Metadata Details & Quick Background Switcher */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setShowChannelSettings(!showChannelSettings)}
              className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5 text-red-500" />
              <span>{showChannelSettings ? 'Hide Channel Mockup Details' : 'Customize Channel Details (Name, Handle)'}</span>
              {showChannelSettings ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>

            {/* Quick Background Selector in Preview */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold">
              <span className="text-[10px] text-slate-400 px-1.5 font-bold uppercase">Background:</span>
              <button
                type="button"
                onClick={() => setBackgroundStyle('gradient')}
                className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                  backgroundStyle === 'gradient'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Gradient
              </button>
              <button
                type="button"
                onClick={() => setBackgroundStyle('blur')}
                className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                  backgroundStyle === 'blur'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Blur
              </button>
              <button
                type="button"
                onClick={() => setBackgroundStyle('solid')}
                className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                  backgroundStyle === 'solid'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Solid
              </button>
              <button
                type="button"
                onClick={() => setBackgroundStyle('none')}
                className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                  backgroundStyle === 'none'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Dark Base
              </button>
            </div>
          </div>

          {showChannelSettings && (
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Channel Name</label>
                <input
                  type="text"
                  value={channelName}
                  onChange={(e) => setChannelName(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Handle</label>
                <input
                  type="text"
                  value={channelHandle}
                  onChange={(e) => setChannelHandle(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Subscribers</label>
                <input
                  type="text"
                  value={subscriberCount}
                  onChange={(e) => setSubscriberCount(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Videos</label>
                <input
                  type="text"
                  value={videoCount}
                  onChange={(e) => setVideoCount(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold"
                />
              </div>
            </div>
          )}

          {/* 1. MOBILE DEVICE VIEW */}
          {previewDevice === 'mobile' && (
            <div className="glass-card p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-4 max-w-xl mx-auto shadow-sm">
              <div className="text-center space-y-1">
                <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center justify-center gap-2">
                  <Smartphone className="w-4 h-4 text-emerald-500" />
                  YouTube-style Mobile Header Preview
                </h3>
                <p className="text-xs text-slate-500">
                  Reflects your current edited position inside the central 1546 × 423 px safe zone.
                </p>
              </div>

              {/* Smartphone mockup */}
              <div className="rounded-[32px] border-[8px] border-slate-800 bg-[#0f0f0f] text-white shadow-2xl overflow-hidden">
                <div className="pt-2 px-5 pb-1 flex items-center justify-between text-[10px] font-bold opacity-80 select-none">
                  <span>9:41</span>
                  <div className="w-14 h-2.5 bg-black rounded-full" />
                  <span>5G</span>
                </div>

                <div className="px-4 py-2 flex items-center justify-between border-b border-slate-800 text-xs font-black">
                  <span className="truncate">{channelName}</span>
                  <Search className="w-3.5 h-3.5 text-slate-400" />
                </div>

                {/* The Mobile Cropped Banner */}
                <div className="relative aspect-[1546/423] w-full overflow-hidden bg-slate-950">
                  {renderBackgroundLayer()}
                  <img
                    src={bannerSrc}
                    alt="Mobile Cropped Banner"
                    className="absolute max-w-none"
                    style={{
                      left: `${mobileLeftPct}%`,
                      top: `${mobileTopPct}%`,
                      width: `${mobileWidthPct}%`,
                      height: `${mobileHeightPct}%`
                    }}
                  />
                  <div className="absolute inset-0 border border-emerald-500/40 pointer-events-none" />
                </div>

                {/* Channel Details */}
                <div className="p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-black text-base shadow-md shrink-0">
                      {channelName.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-black truncate">{channelName}</h4>
                      <p className="text-xs text-slate-400">{channelHandle}</p>
                      <p className="text-[10px] text-slate-500">{subscriberCount} • {videoCount}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button type="button" className="flex-1 py-1.5 rounded-full bg-white text-black font-extrabold text-xs">
                      Subscribe
                    </button>
                    <button type="button" className="px-3 py-1.5 rounded-full bg-slate-800 text-white font-bold text-xs">
                      Join
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. DESKTOP DEVICE VIEW */}
          {previewDevice === 'desktop' && (
            <div className="glass-card p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <Monitor className="w-4 h-4 text-blue-500" />
                    Desktop Channel Header Simulation
                  </h3>
                  <p className="text-xs text-slate-500">
                    Displays the horizontal 2560 × 423 px strip across full screen.
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-mono font-bold">
                  2560 × 423 px
                </span>
              </div>

              {/* Desktop Browser Window */}
              <div className="rounded-2xl border border-slate-800 bg-[#0f0f0f] text-white shadow-2xl overflow-hidden">
                <div className="px-4 py-2 bg-slate-900 flex items-center gap-2 border-b border-slate-800 text-[10px] font-mono text-slate-400">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  </div>
                  <span className="mx-auto">youtube.com/{channelHandle}</span>
                </div>

                {/* Banner Strip */}
                <div className="relative aspect-[2560/423] w-full overflow-hidden bg-slate-950">
                  {renderBackgroundLayer()}
                  <img
                    src={bannerSrc}
                    alt="Desktop Cropped Banner"
                    className="absolute max-w-none"
                    style={{
                      left: `${desktopLeftPct}%`,
                      top: `${desktopTopPct}%`,
                      width: `${desktopWidthPct}%`,
                      height: `${desktopHeightPct}%`
                    }}
                  />
                  {/* Safe Area Box Indicator on Desktop */}
                  <div
                    className="absolute inset-y-0 border-x-2 border-emerald-400/80 pointer-events-none flex items-start justify-between p-1.5"
                    style={{
                      left: `${YOUTUBE_BANNER_SPECS.SAFE_LEFT_PCT}%`,
                      width: `${YOUTUBE_BANNER_SPECS.SAFE_WIDTH_PCT}%`
                    }}
                  >
                    <span className="px-1 py-0.5 rounded bg-emerald-500 text-slate-950 text-[8px] font-black">
                      Mobile Safe Area
                    </span>
                  </div>
                </div>

                {/* Desktop Channel Info */}
                <div className="p-5 flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-black text-xl shadow-lg shrink-0">
                      {channelName.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-lg font-black">{channelName}</h4>
                      <p className="text-xs text-slate-400">{channelHandle} • {subscriberCount} • {videoCount}</p>
                    </div>
                  </div>
                  <button type="button" className="px-5 py-2 rounded-full bg-white text-black font-extrabold text-xs shadow-md">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 3. TV DEVICE VIEW */}
          {previewDevice === 'tv' && (
            <div className="glass-card p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <Tv className="w-4 h-4 text-purple-500" />
                    TV Display Preview
                  </h3>
                  <p className="text-xs text-slate-500">
                    Smart TVs show the full 2560 × 1440 canvas behind the channel menu.
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs font-mono font-bold">
                  2560 × 1440 px
                </span>
              </div>

              <div className="p-4 sm:p-6 rounded-3xl bg-slate-950 border-[12px] border-slate-900 shadow-2xl relative select-none">
                <div className="relative aspect-video w-full rounded-xl overflow-hidden shadow-inner bg-black">
                  {renderBackgroundLayer()}
                  <img
                    src={bannerSrc}
                    alt="TV Cropped Banner"
                    className="absolute max-w-none"
                    style={{
                      left: `${canvasLeftPct}%`,
                      top: `${canvasTopPct}%`,
                      width: `${canvasWidthPct}%`,
                      height: `${canvasHeightPct}%`
                    }}
                  />
                  {/* Safe Area Box on TV */}
                  <div
                    className="absolute border border-emerald-400 pointer-events-none flex items-center justify-center"
                    style={{
                      top: `${YOUTUBE_BANNER_SPECS.SAFE_TOP_PCT}%`,
                      height: `${YOUTUBE_BANNER_SPECS.SAFE_HEIGHT_PCT}%`,
                      left: `${YOUTUBE_BANNER_SPECS.SAFE_LEFT_PCT}%`,
                      width: `${YOUTUBE_BANNER_SPECS.SAFE_WIDTH_PCT}%`
                    }}
                  >
                    <span className="bg-black/75 text-emerald-300 text-[8px] px-1.5 py-0.5 rounded font-mono font-bold">
                      Safe Area
                    </span>
                  </div>
                </div>
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 mx-auto mt-2" />
              </div>
            </div>
          )}

          {/* 4. 3-WAY CROP COMPARISON */}
          {previewDevice === 'compare' && (
            <div className="glass-card p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-6 shadow-sm">
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Columns3 className="w-4 h-4 text-red-500" />
                  Simultaneous 3-Way Crop Comparison (Mobile vs. Desktop vs. TV)
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  All views reflect your currently edited position and zoom in real time.
                </p>
              </div>

              {/* Mobile */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  <span>1. Mobile Display (1546 × 423)</span>
                  <span className="text-[10px] text-slate-400 font-mono">~60% width visible</span>
                </div>
                <div className="relative aspect-[1546/423] w-full rounded-xl overflow-hidden bg-slate-950 border-2 border-emerald-500">
                  {renderBackgroundLayer()}
                  <img
                    src={bannerSrc}
                    alt="Mobile comparison"
                    className="absolute max-w-none"
                    style={{
                      left: `${mobileLeftPct}%`,
                      top: `${mobileTopPct}%`,
                      width: `${mobileWidthPct}%`,
                      height: `${mobileHeightPct}%`
                    }}
                  />
                </div>
              </div>

              {/* Desktop */}
              <div className="space-y-1.5 pt-3 border-t border-slate-200 dark:border-slate-800">
                <div className="flex justify-between text-xs font-bold text-blue-600 dark:text-blue-400">
                  <span>2. Desktop Display (2560 × 423)</span>
                  <span className="text-[10px] text-slate-400 font-mono">100% width, ~29% height</span>
                </div>
                <div className="relative aspect-[2560/423] w-full rounded-xl overflow-hidden bg-slate-950 border-2 border-blue-500">
                  {renderBackgroundLayer()}
                  <img
                    src={bannerSrc}
                    alt="Desktop comparison"
                    className="absolute max-w-none"
                    style={{
                      left: `${desktopLeftPct}%`,
                      top: `${desktopTopPct}%`,
                      width: `${desktopWidthPct}%`,
                      height: `${desktopHeightPct}%`
                    }}
                  />
                </div>
              </div>

              {/* TV */}
              <div className="space-y-1.5 pt-3 border-t border-slate-200 dark:border-slate-800">
                <div className="flex justify-between text-xs font-bold text-purple-600 dark:text-purple-400">
                  <span>3. TV Display (2560 × 1440 Full 16:9 Canvas)</span>
                  <span className="text-[10px] text-slate-400 font-mono">100% visible</span>
                </div>
                <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-slate-950 border-2 border-purple-500">
                  {renderBackgroundLayer()}
                  <img
                    src={bannerSrc}
                    alt="TV comparison"
                    className="absolute max-w-none"
                    style={{
                      left: `${canvasLeftPct}%`,
                      top: `${canvasTopPct}%`,
                      width: `${canvasWidthPct}%`,
                      height: `${canvasHeightPct}%`
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ===================================================================== */}
      {/* 5. EDUCATIONAL CREATOR GUIDE / HOW IT WORKS */}
      {/* ===================================================================== */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-6 shadow-sm">
        <div>
          <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-red-600" />
            How to Make Your YouTube Banner 100% Mobile Safe
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Follow these 3 simple rules to guarantee clean presentation across all viewers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/70 dark:border-slate-800 space-y-2">
            <span className="w-7 h-7 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-black text-xs flex items-center justify-center">
              1
            </span>
            <h4 className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              Central Safe Area
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Keep your channel name, tagline, social handles, and faces strictly centered within <strong>1546 × 423 px</strong>.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/70 dark:border-slate-800 space-y-2">
            <span className="w-7 h-7 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 font-black text-xs flex items-center justify-center">
              2
            </span>
            <h4 className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              Desktop Bleed
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Desktop browsers expand outward horizontally to <strong>2560 × 423 px</strong>. Keep secondary graphics in these wings.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/70 dark:border-slate-800 space-y-2">
            <span className="w-7 h-7 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 font-black text-xs flex items-center justify-center">
              3
            </span>
            <h4 className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              Full 16:9 Canvas
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Export at <strong>2560 × 1440 px</strong> so that Smart TV viewers see rich background artwork without awkward black bars.
            </p>
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 6. FREQUENTLY ASKED QUESTIONS (CREATOR FAQ) */}
      {/* ===================================================================== */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-sm">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
          <h3 className="text-lg font-black text-slate-900 dark:text-white">
            Frequently Asked Questions
          </h3>
        </div>

        <div className="space-y-3">
          {[
            {
              q: 'Why does YouTube crop my channel banner differently on mobile, desktop, and TV?',
              a: 'YouTube serves a single uploaded image (recommended 2560 × 1440 px) to all devices. On Smart TVs, the entire 16:9 canvas is displayed. On desktop monitors, YouTube cuts out a wide horizontal strip (2560 × 423 px). On smartphones and tablets, YouTube crops inward even further, showing only the central 1546 × 423 px safe area. If your channel title or logos are placed near the sides or top, they will be clipped on phones.'
            },
            {
              q: 'What is the "Fit to Mobile Safe Area" button?',
              a: 'Clicking "Fit to Mobile Safe Area" automatically scales and centers your uploaded artwork so that your primary content fits neatly inside the 1546 × 423 px central green safe box. It maintains your image’s original aspect ratio without distortion and prevents crucial text or faces from getting cut off on mobile devices.'
            },
            {
              q: 'Will the green safe-area outline appear in my downloaded banner?',
              a: 'No! When you click "DOWNLOAD FINAL BANNER", our client-side canvas engine renders only your clean, repositioned artwork onto an exact 2560 × 1440 px canvas. No borders, crop masks, guides, or labels are included. If you want the visual guides for Photoshop or Figma reference, use the secondary "Download Guide" button instead.'
            },
            {
              q: 'Can I drag and position my banner using a phone or tablet touch screen?',
              a: 'Yes! The interactive canvas fully supports multi-touch gestures and touch dragging. You can touch and drag your banner around the canvas directly from your iPhone, Android phone, or iPad, and use the zoom slider to scale your design.'
            },
            {
              q: 'Are my uploaded banner images uploaded to any server?',
              a: 'Never. Zubware processes 100% of your images locally in your browser memory using HTML5 Canvas and Object URLs. Your design never leaves your device, guaranteeing total privacy.'
            }
          ].map((item, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 overflow-hidden transition-all"
            >
              <button
                type="button"
                onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                className="w-full px-5 py-4 text-left flex items-center justify-between gap-3 text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-100/60 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
              >
                <span>{item.q}</span>
                {openFaqIndex === idx ? (
                  <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                )}
              </button>
              {openFaqIndex === idx && (
                <div className="px-5 pb-4 pt-1 text-xs text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-200/40 dark:border-slate-800/40">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
