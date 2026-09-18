import React, { useState, useRef, useEffect, useMemo, useLayoutEffect } from 'react';
import {
  Upload,
  Image as ImageIcon,
  Smartphone,
  Search,
  Moon,
  Sun,
  Download,
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  Sliders,
  Info,
  ShieldCheck,
  Sparkles,
  Layers,
  Copy,
  Check,
  FileCheck,
  Eye,
  Maximize2
} from 'lucide-react';
import html2canvas from 'html2canvas';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface ImageAnalysisMetrics {
  avgLuminance: number; // 0 - 255
  contrastStdDev: number; // 0 - 100 approx
  edgeDensity: number; // 0 - 100 approx
  avgSaturation: number; // 0 - 1
  darkBorderContrast: number; // 0 - 100 (contrast with #0f0f0f)
  lightBorderContrast: number; // 0 - 100 (contrast with #ffffff)
  clippedDarkPct: number; // % of pixels < 25
  clippedLightPct: number; // % of pixels > 235
  readabilityScore: number; // 0 - 100
  lightModeScore: number; // 0 - 100
  darkModeScore: number; // 0 - 100
  worksBestIn: 'Light' | 'Dark' | 'Both';
  feedStandoutScore: number; // 0 - 100
  overallScore: number; // 0 - 100
  scoreGrade: 'Excellent' | 'Strong' | 'Good' | 'Needs Improvement' | 'Poor';
  recommendations: string[];
}

export interface ImageMeta {
  width: number;
  height: number;
  aspectRatio: number;
  aspectRatioString: string;
  isOptimal16x9: boolean;
  fileSizeBytes: number;
  fileSizeFormatted: string;
  fileType: string;
  fileName: string;
}

export interface TitleComparisonItem {
  id: string;
  label: string;
  text: string;
  charCount: number;
  wordCount: number;
  isTruncated: boolean;
}

// Built-in high-quality default sample thumbnail (SVG data URI - creator styled)
const DEFAULT_SAMPLE_THUMBNAIL = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720" width="1280" height="720">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a" />
      <stop offset="50%" stop-color="#1e1b4b" />
      <stop offset="100%" stop-color="#311042" />
    </linearGradient>
    <linearGradient id="glow" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ec4899" />
      <stop offset="50%" stop-color="#8b5cf6" />
      <stop offset="100%" stop-color="#3b82f6" />
    </linearGradient>
    <filter id="shadow" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#000000" flood-opacity="0.75" />
    </filter>
  </defs>

  <!-- Background -->
  <rect width="1280" height="720" fill="url(#bg)" />

  <!-- Geometric dynamic grid lines -->
  <circle cx="1050" cy="360" r="320" fill="none" stroke="#ec4899" stroke-width="4" opacity="0.25" />
  <circle cx="1050" cy="360" r="220" fill="none" stroke="#8b5cf6" stroke-width="3" opacity="0.35" />
  <circle cx="1050" cy="360" r="120" fill="none" stroke="#3b82f6" stroke-width="2" opacity="0.45" />

  <!-- Glow Orb -->
  <circle cx="1100" cy="320" r="160" fill="#8b5cf6" opacity="0.3" filter="blur(60px)" />
  <circle cx="200" cy="600" r="140" fill="#ec4899" opacity="0.2" filter="blur(65px)" />

  <!-- Badge -->
  <g transform="translate(100, 110)">
    <rect width="320" height="64" rx="14" fill="#ef4444" filter="url(#shadow)" />
    <text x="160" y="42" fill="#ffffff" font-family="system-ui, -apple-system, sans-serif" font-size="28" font-weight="900" text-anchor="middle" letter-spacing="3">
      NEW 2026 GUIDE
    </text>
  </g>

  <!-- Bold Main Subject Text with Dark Outline -->
  <g transform="translate(100, 270)" filter="url(#shadow)">
    <text x="0" y="60" fill="#ffffff" stroke="#000000" stroke-width="14" paint-order="stroke fill" font-family="system-ui, -apple-system, sans-serif" font-size="88" font-weight="950" letter-spacing="-1">
      BUILD FULLSTACK
    </text>
    <text x="0" y="155" fill="#facc15" stroke="#000000" stroke-width="14" paint-order="stroke fill" font-family="system-ui, -apple-system, sans-serif" font-size="88" font-weight="950" letter-spacing="-1">
      IN 30 MINUTES!
    </text>
    <text x="0" y="240" fill="#38bdf8" stroke="#000000" stroke-width="12" paint-order="stroke fill" font-family="system-ui, -apple-system, sans-serif" font-size="62" font-weight="900" letter-spacing="0">
      Zero to Production 🚀
    </text>
  </g>

  <!-- Simulated Feature Pill -->
  <g transform="translate(100, 580)">
    <rect width="340" height="52" rx="12" fill="#000000" opacity="0.8" />
    <rect x="0" y="0" width="340" height="52" rx="12" fill="none" stroke="#a855f7" stroke-width="2" />
    <text x="170" y="34" fill="#e2e8f0" font-family="system-ui, -apple-system, sans-serif" font-size="22" font-weight="700" text-anchor="middle">
      ★ Free Source Code Included
    </text>
  </g>

  <!-- Graphic representation icon on right -->
  <g transform="translate(920, 220)" filter="url(#shadow)">
    <rect width="260" height="260" rx="36" fill="url(#glow)" />
    <polygon points="110,80 190,130 110,180" fill="#ffffff" />
  </g>
</svg>
`)}`;

// Neutral competitor placeholder cards for search results simulation (pure SVG, non-scraped)
const COMPETITOR_DATA = [
  {
    id: 'comp-1',
    title: '10 Mistakes Every Creator Makes in 2026 (Avoid These!)',
    channel: 'Creator Blueprint',
    views: '340K views',
    timeAgo: '1 week ago',
    duration: '14:20',
    colorFrom: '#064e3b',
    colorTo: '#047857',
    badgeText: 'AVOID MISTAKES',
    avatarText: 'CB'
  },
  {
    id: 'comp-2',
    title: 'Complete Step-By-Step Beginner Tutorial for Fast Results',
    channel: 'Tech Growth Lab',
    views: '89K views',
    timeAgo: '3 days ago',
    duration: '22:15',
    colorFrom: '#1e3a8a',
    colorTo: '#2563eb',
    badgeText: 'FULL COURSE',
    avatarText: 'TG'
  },
  {
    id: 'comp-3',
    title: 'Why Nobody Watches Your Videos (And How to Fix It Today)',
    channel: 'Viral Insights',
    views: '620K views',
    timeAgo: '1 month ago',
    duration: '09:48',
    colorFrom: '#7f1d1d',
    colorTo: '#dc2626',
    badgeText: 'STOP DOING THIS',
    avatarText: 'VI'
  }
];

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const YouTubeThumbnailSimulatorTool: React.FC<{ onShowToast: (msg: string) => void }> = ({ onShowToast }) => {
  // Input states
  const [thumbnailSrc, setThumbnailSrc] = useState<string>(DEFAULT_SAMPLE_THUMBNAIL);
  const [primaryTitle, setPrimaryTitle] = useState<string>('Build a Fullstack App in 30 Minutes! (Complete Step-by-Step 2026 Tutorial)');
  const [titleOption2, setTitleOption2] = useState<string>('Zero to Production: Fullstack App in 30 Mins');
  const [titleOption3, setTitleOption3] = useState<string>('How to Build Modern Fullstack Web Apps Faster Than Ever');
  const [selectedTitleIdx, setSelectedTitleIdx] = useState<number>(0); // 0 = primary, 1 = opt2, 2 = opt3

  // Channel & metadata states
  const [channelName, setChannelName] = useState<string>('Creator Studio');
  const [channelViews, setChannelViews] = useState<string>('125K views');
  const [channelTimeAgo, setChannelTimeAgo] = useState<string>('2 days ago');
  const [videoDuration, setVideoDuration] = useState<string>('14:28');

  // Preview display settings
  const [previewMode, setPreviewMode] = useState<'home' | 'search'>('home');
  const [previewTheme, setPreviewTheme] = useState<'dark' | 'light'>('dark');
  const [previewScale, setPreviewScale] = useState<'large' | 'medium' | 'small'>('large');
  const [searchQuery, setSearchQuery] = useState<string>('fullstack tutorial 2026');

  // Upload validation & image metadata
  const [imageMeta, setImageMeta] = useState<ImageMeta | null>({
    width: 1280,
    height: 720,
    aspectRatio: 1.778,
    aspectRatioString: '16:9',
    isOptimal16x9: true,
    fileSizeBytes: 48000,
    fileSizeFormatted: '48 KB',
    fileType: 'image/svg+xml',
    fileName: 'sample-thumbnail.svg'
  });
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // Analysis result
  const [analysis, setAnalysis] = useState<ImageAnalysisMetrics | null>(null);

  // Truncation measurement refs
  const phoneContainerRef = useRef<HTMLDivElement | null>(null);
  const titleMeasureRefs = [
    useRef<HTMLHeadingElement | null>(null),
    useRef<HTMLHeadingElement | null>(null),
    useRef<HTMLHeadingElement | null>(null)
  ];
  const [truncationStates, setTruncationStates] = useState<boolean[]>([false, false, false]);

  // Object URL tracking for cleanup
  const currentObjectUrlRef = useRef<string | null>(null);

  // Active title string based on selection
  const activeTitle = useMemo(() => {
    if (selectedTitleIdx === 1 && titleOption2.trim()) return titleOption2;
    if (selectedTitleIdx === 2 && titleOption3.trim()) return titleOption3;
    return primaryTitle;
  }, [selectedTitleIdx, primaryTitle, titleOption2, titleOption3]);

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      if (currentObjectUrlRef.current) {
        URL.revokeObjectURL(currentObjectUrlRef.current);
      }
    };
  }, []);

  // --------------------------------------------------------------------------
  // DETERMINISTIC IMAGE ANALYSIS ENGINE (CANVAS 2D)
  // --------------------------------------------------------------------------
  useEffect(() => {
    if (!thumbnailSrc) return;

    let isSubscribed = true;
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      if (!isSubscribed) return;

      try {
        // Offscreen canvas normalized to 320x180 (16:9 aspect, 57,600 pixels)
        const canvas = document.createElement('canvas');
        const normWidth = 320;
        const normHeight = 180;
        canvas.width = normWidth;
        canvas.height = normHeight;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });

        if (!ctx) return;

        ctx.drawImage(img, 0, 0, normWidth, normHeight);
        const imgData = ctx.getImageData(0, 0, normWidth, normHeight);
        const data = imgData.data;
        const totalPixels = normWidth * normHeight;

        let sumLuminance = 0;
        let sumSaturation = 0;
        let clippedDarkCount = 0;
        let clippedLightCount = 0;
        const luminances = new Float32Array(totalPixels);

        // First pass: compute luminance and saturation
        for (let i = 0; i < totalPixels; i++) {
          const idx = i * 4;
          const r = data[idx];
          const g = data[idx + 1];
          const b = data[idx + 2];

          // Rec. 601 perceived luminance
          const Y = 0.299 * r + 0.587 * g + 0.114 * b;
          luminances[i] = Y;
          sumLuminance += Y;

          // HSL Saturation approx
          const max = Math.max(r, g, b);
          const min = Math.min(r, g, b);
          const delta = max - min;
          const sat = max === 0 ? 0 : delta / max;
          sumSaturation += sat;

          if (Y < 25) clippedDarkCount++;
          if (Y > 235) clippedLightCount++;
        }

        const avgLuminance = sumLuminance / totalPixels;
        const avgSaturation = sumSaturation / totalPixels;
        const clippedDarkPct = (clippedDarkCount / totalPixels) * 100;
        const clippedLightPct = (clippedLightCount / totalPixels) * 100;

        // Second pass: Standard deviation (Contrast)
        let sumSqDiff = 0;
        for (let i = 0; i < totalPixels; i++) {
          const diff = luminances[i] - avgLuminance;
          sumSqDiff += diff * diff;
        }
        const contrastStdDev = Math.sqrt(sumSqDiff / totalPixels);

        // Third pass: Edge Density (Spatial Gradient Magnitude)
        let edgeSum = 0;
        let edgeSamples = 0;
        for (let y = 1; y < normHeight - 1; y += 2) {
          for (let x = 1; x < normWidth - 1; x += 2) {
            const curr = luminances[y * normWidth + x];
            const right = luminances[y * normWidth + (x + 1)];
            const bottom = luminances[(y + 1) * normWidth + x];
            const grad = Math.abs(curr - right) + Math.abs(curr - bottom);
            edgeSum += grad;
            edgeSamples++;
          }
        }
        const rawEdgeDensity = edgeSamples > 0 ? edgeSum / edgeSamples : 0;
        const edgeDensity = Math.min(100, Math.round(rawEdgeDensity * 2.1));

        // Fourth pass: Border contrast against #0f0f0f (Dark) and #ffffff (Light)
        // Sample outer 5% margin pixels
        let borderLumSum = 0;
        let borderCount = 0;
        const marginX = Math.round(normWidth * 0.05);
        const marginY = Math.round(normHeight * 0.05);

        for (let y = 0; y < normHeight; y++) {
          for (let x = 0; x < normWidth; x++) {
            if (x < marginX || x >= normWidth - marginX || y < marginY || y >= normHeight - marginY) {
              borderLumSum += luminances[y * normWidth + x];
              borderCount++;
            }
          }
        }
        const avgBorderLum = borderCount > 0 ? borderLumSum / borderCount : avgLuminance;
        const darkThemeLum = 15; // #0f0f0f
        const lightThemeLum = 255; // #ffffff

        const darkBorderContrast = Math.min(100, Math.round((Math.abs(avgBorderLum - darkThemeLum) / 240) * 100));
        const lightBorderContrast = Math.min(100, Math.round((Math.abs(lightThemeLum - avgBorderLum) / 240) * 100));

        // Deterministic Readability Score (0 - 100)
        // Factors: Contrast standard dev (up to 40), Brightness balance (up to 30), Dynamic range (up to 15), Clarity/sharpness (up to 15)
        let readability = 0;
        readability += Math.min(40, (contrastStdDev / 65) * 40);

        // Optimal avg luminance is between 90 and 165
        const lumDist = Math.abs(avgLuminance - 128);
        const lumScore = Math.max(0, 30 - (lumDist / 128) * 30);
        readability += lumScore;

        // Dynamic range penalty for severe clipping
        const clippingPenalty = Math.min(15, (clippedDarkPct + clippedLightPct) * 0.3);
        readability += Math.max(0, 15 - clippingPenalty);

        // Edge sharpness factor (ideal between 20 and 55)
        let sharpnessScore = 15;
        if (edgeDensity < 15) sharpnessScore = (edgeDensity / 15) * 15;
        else if (edgeDensity > 75) sharpnessScore = Math.max(5, 15 - (edgeDensity - 75) * 0.4);
        readability += sharpnessScore;

        const readabilityScore = Math.min(98, Math.max(20, Math.round(readability)));

        // Light & Dark theme scores
        const lightModeScore = Math.min(98, Math.max(25, Math.round(35 + lightBorderContrast * 0.45 + readabilityScore * 0.2)));
        const darkModeScore = Math.min(98, Math.max(25, Math.round(35 + darkBorderContrast * 0.45 + readabilityScore * 0.2)));

        let worksBestIn: 'Light' | 'Dark' | 'Both' = 'Both';
        if (Math.abs(lightModeScore - darkModeScore) <= 6) worksBestIn = 'Both';
        else if (lightModeScore > darkModeScore) worksBestIn = 'Light';
        else worksBestIn = 'Dark';

        // Feed Standout Score (prominence in feed)
        // Saturation factor (35%) + Contrast factor (35%) + Sharpness factor (30%)
        const satScore = Math.min(35, avgSaturation * 75);
        const standoutContrast = Math.min(35, (contrastStdDev / 60) * 35);
        const standoutSharpness = Math.min(30, (edgeDensity / 50) * 30);
        const feedStandoutScore = Math.min(98, Math.max(25, Math.round(satScore + standoutContrast + standoutSharpness)));

        // Overall Score (weighted combination)
        const overallScore = Math.min(98, Math.max(25, Math.round(
          readabilityScore * 0.40 +
          feedStandoutScore * 0.35 +
          Math.max(lightModeScore, darkModeScore) * 0.25
        )));

        let scoreGrade: 'Excellent' | 'Strong' | 'Good' | 'Needs Improvement' | 'Poor' = 'Good';
        if (overallScore >= 90) scoreGrade = 'Excellent';
        else if (overallScore >= 75) scoreGrade = 'Strong';
        else if (overallScore >= 60) scoreGrade = 'Good';
        else if (overallScore >= 40) scoreGrade = 'Needs Improvement';
        else scoreGrade = 'Poor';

        // Dynamic, honest recommendations based solely on measured factors
        const recs: string[] = [];
        if (avgLuminance < 60) {
          recs.push('Thumbnail appears dark overall; consider brightening focal subjects or adding an outer rim glow.');
        } else if (avgLuminance > 195) {
          recs.push('Thumbnail is very bright; ensure overlay text has sufficient drop-shadow or a dark backing badge.');
        }

        if (contrastStdDev < 35) {
          recs.push('Low tonal contrast detected. Increasing contrast between your foreground subject and background will improve mobile pop.');
        } else if (contrastStdDev > 65) {
          recs.push('Strong visual contrast detected! High dynamic range helps your thumbnail stand out in busy feeds.');
        }

        if (darkBorderContrast < 40) {
          recs.push('Dark edges detected; the thumbnail borders may blend into YouTube Dark Mode feeds. A bright border or edge highlight can prevent blending.');
        }
        if (lightBorderContrast < 40) {
          recs.push('Bright edges detected; the thumbnail borders may bleed into YouTube Light Mode feeds.');
        }

        if (edgeDensity > 70) {
          recs.push('High visual complexity detected. Ensure small text or intricate details remain distinguishable at phone scale.');
        } else if (edgeDensity < 18) {
          recs.push('Low edge detail detected. Consider sharpening main focal subjects or text elements.');
        }

        if (avgSaturation < 0.25) {
          recs.push('Low color saturation. Boosting vibrance by 10–20% on the main subject can improve visual prominence.');
        } else if (avgSaturation > 0.65) {
          recs.push('Vibrant color palette detected; warm and saturated elements naturally catch attention in mobile feeds.');
        }

        setAnalysis({
          avgLuminance: Math.round(avgLuminance),
          contrastStdDev: Math.round(contrastStdDev),
          edgeDensity,
          avgSaturation: Math.round(avgSaturation * 100) / 100,
          darkBorderContrast,
          lightBorderContrast,
          clippedDarkPct: Math.round(clippedDarkPct),
          clippedLightPct: Math.round(clippedLightPct),
          readabilityScore,
          lightModeScore,
          darkModeScore,
          worksBestIn,
          feedStandoutScore,
          overallScore,
          scoreGrade,
          recommendations: recs
        });
      } catch (err) {
        console.warn('Canvas pixel analysis skipped or restricted:', err);
      }
    };

    img.src = thumbnailSrc;

    return () => {
      isSubscribed = false;
    };
  }, [thumbnailSrc]);

  // --------------------------------------------------------------------------
  // REAL CSS TITLE TRUNCATION MEASUREMENT
  // --------------------------------------------------------------------------
  useLayoutEffect(() => {
    // Measure truncation on each of the 3 title ref elements
    const newTruncStates = titleMeasureRefs.map((ref) => {
      if (!ref.current) return false;
      // If scrollHeight exceeds clientHeight by more than 2 pixels, text is visually clamped
      return ref.current.scrollHeight > ref.current.clientHeight + 2;
    });
    setTruncationStates(newTruncStates);
  }, [primaryTitle, titleOption2, titleOption3, previewScale]);

  // --------------------------------------------------------------------------
  // TITLE COMPARISON DATA
  // --------------------------------------------------------------------------
  const titleComparisonList: TitleComparisonItem[] = useMemo(() => {
    return [
      {
        id: 'primary',
        label: 'Primary Title (Option 1)',
        text: primaryTitle,
        charCount: primaryTitle.length,
        wordCount: primaryTitle.trim() ? primaryTitle.trim().split(/\s+/).length : 0,
        isTruncated: truncationStates[0]
      },
      {
        id: 'opt2',
        label: 'Title Option 2',
        text: titleOption2,
        charCount: titleOption2.length,
        wordCount: titleOption2.trim() ? titleOption2.trim().split(/\s+/).length : 0,
        isTruncated: truncationStates[1]
      },
      {
        id: 'opt3',
        label: 'Title Option 3',
        text: titleOption3,
        charCount: titleOption3.length,
        wordCount: titleOption3.trim() ? titleOption3.trim().split(/\s+/).length : 0,
        isTruncated: truncationStates[2]
      }
    ];
  }, [primaryTitle, titleOption2, titleOption3, truncationStates]);

  // --------------------------------------------------------------------------
  // FILE UPLOAD & VALIDATION
  // --------------------------------------------------------------------------
  const handleFileUpload = (file: File) => {
    setUploadError(null);

    // Validate mime type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg', 'image/svg+xml'];
    if (!validTypes.includes(file.type)) {
      setUploadError('Unsupported file type. Please upload a JPG, PNG, or WebP image.');
      onShowToast('Please upload a valid JPG, PNG, or WebP image file.');
      return;
    }

    // Validate size (max 15MB)
    const maxBytes = 15 * 1024 * 1024;
    if (file.size > maxBytes) {
      setUploadError('Image file is too large (maximum size is 15MB).');
      onShowToast('File exceeds 15MB limit.');
      return;
    }

    // Clean up previous object URL if any
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
      const is16x9 = ratio >= 1.68 && ratio <= 1.88;

      let formattedSize = `${(file.size / 1024).toFixed(1)} KB`;
      if (file.size > 1024 * 1024) {
        formattedSize = `${(file.size / (1024 * 1024)).toFixed(2)} MB`;
      }

      setImageMeta({
        width,
        height,
        aspectRatio: Math.round(ratio * 1000) / 1000,
        aspectRatioString: is16x9 ? '16:9' : `${(width / (height || 1)).toFixed(2)}:1`,
        isOptimal16x9: is16x9,
        fileSizeBytes: file.size,
        fileSizeFormatted: formattedSize,
        fileType: file.type.replace('image/', '').toUpperCase(),
        fileName: file.name
      });

      setThumbnailSrc(objectUrl);
      onShowToast('Thumbnail loaded successfully!');
    };

    img.onerror = () => {
      setUploadError('Could not decode image file. The file may be corrupted.');
      onShowToast('Error loading image file.');
    };

    img.src = objectUrl;
  };

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  // --------------------------------------------------------------------------
  // RESET HANDLER
  // --------------------------------------------------------------------------
  const handleReset = () => {
    if (currentObjectUrlRef.current) {
      URL.revokeObjectURL(currentObjectUrlRef.current);
      currentObjectUrlRef.current = null;
    }
    setThumbnailSrc(DEFAULT_SAMPLE_THUMBNAIL);
    setPrimaryTitle('Build a Fullstack App in 30 Minutes! (Complete Step-by-Step 2026 Tutorial)');
    setTitleOption2('Zero to Production: Fullstack App in 30 Mins');
    setTitleOption3('How to Build Modern Fullstack Web Apps Faster Than Ever');
    setSelectedTitleIdx(0);
    setChannelName('Creator Studio');
    setChannelViews('125K views');
    setChannelTimeAgo('2 days ago');
    setVideoDuration('14:28');
    setPreviewMode('home');
    setPreviewTheme('dark');
    setPreviewScale('large');
    setUploadError(null);
    setImageMeta({
      width: 1280,
      height: 720,
      aspectRatio: 1.778,
      aspectRatioString: '16:9',
      isOptimal16x9: true,
      fileSizeBytes: 48000,
      fileSizeFormatted: '48 KB',
      fileType: 'image/svg+xml',
      fileName: 'sample-thumbnail.svg'
    });
    onShowToast('Reset all simulator inputs and previews.');
  };

  // --------------------------------------------------------------------------
  // DOWNLOAD / EXPORT SCREENSHOT
  // --------------------------------------------------------------------------
  const handleDownloadPreview = async () => {
    if (!phoneContainerRef.current) return;
    setIsExporting(true);

    try {
      // Temporarily expand container scale for crisp export
      const canvas = await html2canvas(phoneContainerRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: previewTheme === 'dark' ? '#0f0f0f' : '#ffffff',
        logging: false
      });

      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `youtube-simulated-${previewMode}-preview-${previewTheme}.png`;
      link.href = dataUrl;
      link.click();

      onShowToast('Simulated mobile preview downloaded!');
    } catch (err) {
      console.error('Export error:', err);
      onShowToast('Failed to generate preview image. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  // Copy active title
  const handleCopyTitle = () => {
    if (!activeTitle) return;
    navigator.clipboard.writeText(activeTitle);
    setIsCopied(true);
    onShowToast('Video title copied to clipboard!');
    setTimeout(() => setIsCopied(false), 2000);
  };

  // --------------------------------------------------------------------------
  // RENDER
  // --------------------------------------------------------------------------
  return (
    <div className="space-y-8 font-sans">
      {/* TOOL HEADER / BANNER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-red-600/10 text-red-600 dark:text-red-400 border border-red-500/20">
              <Smartphone className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                YouTube Thumbnail & Mobile Feed Simulator
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                Preview your thumbnail + video titles in realistic mobile Home Feed & Search results before publishing.
              </p>
            </div>
          </div>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleReset}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 transition-all cursor-pointer"
            title="Reset to default sample"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Reset</span>
          </button>
          <button
            type="button"
            onClick={handleDownloadPreview}
            disabled={isExporting}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white text-xs font-bold shadow-md shadow-red-500/20 flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>{isExporting ? 'Generating...' : 'Download Preview'}</span>
          </button>
        </div>
      </div>

      {/* PRIVACY & SIMULATION DISCLAIMER BAR */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 rounded-2xl bg-slate-100/90 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 text-xs text-slate-600 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span className="font-semibold text-slate-800 dark:text-slate-200">100% Client-Side Privacy:</span>
          <span>Your image is processed locally in your browser. Nothing is uploaded to any server.</span>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 italic">
          <Info className="w-3.5 h-3.5 shrink-0" />
          <span>Simulated YouTube-style Preview for creator testing (not an official YouTube product).</span>
        </div>
      </div>

      {/* WORKSPACE GRID: INPUTS (LEFT) & SIMULATED MOBILE PHONE (RIGHT) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ================================================================= */}
        {/* LEFT COLUMN: CREATOR INPUT CONTROLS & TITLE MANAGEMENT */}
        {/* ================================================================= */}
        <div className="lg:col-span-6 space-y-6">
          {/* SECTION 1: THUMBNAIL UPLOAD & METADATA */}
          <div className="glass-card p-5 sm:p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-wider text-red-600 dark:text-red-400 flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4" />
                1. Upload Thumbnail
              </h3>
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                16:9 Recommended (1280×720)
              </span>
            </div>

            {/* Drag and Drop Zone */}
            <label
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed cursor-pointer transition-all ${
                uploadError
                  ? 'border-red-400 bg-red-500/5'
                  : 'border-slate-300 dark:border-slate-700 hover:border-red-500 dark:hover:border-red-500 bg-white/60 dark:bg-slate-900/60'
              }`}
            >
              <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center mb-2">
                <Upload className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Drag & drop your thumbnail image here
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                or click to browse from device (JPG, PNG, WebP)
              </span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/jpg"
                onChange={handleFileInputChange}
                className="hidden"
              />
            </label>

            {uploadError && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-600 dark:text-red-400 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{uploadError}</span>
              </div>
            )}

            {/* Image Metadata Specifications */}
            {imageMeta && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-200/80 dark:border-slate-800 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Resolution</span>
                  <span className="font-extrabold text-slate-800 dark:text-slate-200">
                    {imageMeta.width} × {imageMeta.height}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Aspect Ratio</span>
                  <span className={`font-extrabold ${imageMeta.isOptimal16x9 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-500'}`}>
                    {imageMeta.aspectRatioString} {imageMeta.isOptimal16x9 ? '✓' : '⚠️'}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">File Size</span>
                  <span className="font-extrabold text-slate-800 dark:text-slate-200">
                    {imageMeta.fileSizeFormatted}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Format</span>
                  <span className="font-extrabold text-slate-800 dark:text-slate-200">
                    {imageMeta.fileType}
                  </span>
                </div>
              </div>
            )}

            {!imageMeta?.isOptimal16x9 && imageMeta && (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-700 dark:text-amber-400 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  Your image is not 16:9 (approx {imageMeta.aspectRatio}:1). Consider using a 16:9 thumbnail composition (1280×720 or 1920×1080) so it doesn't get letterboxed.
                </span>
              </div>
            )}
          </div>

          {/* SECTION 2: VIDEO TITLES & 3-WAY COMPARISON */}
          <div className="glass-card p-5 sm:p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-wider text-red-600 dark:text-red-400 flex items-center gap-1.5">
                <Sliders className="w-4 h-4" />
                2. Enter Video Titles (Compare Up To 3)
              </h3>
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                Click pill to activate in preview
              </span>
            </div>

            {/* Primary Video Title */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setSelectedTitleIdx(0)}
                    className={`px-2 py-0.5 rounded text-[10px] font-black uppercase cursor-pointer transition-all ${
                      selectedTitleIdx === 0
                        ? 'bg-red-600 text-white shadow-sm'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-300'
                    }`}
                  >
                    {selectedTitleIdx === 0 ? '● Active in Preview' : 'Select Option 1'}
                  </button>
                  <span>Primary Title</span>
                </label>
                <span className={`text-[11px] font-mono ${primaryTitle.length > 70 ? 'text-amber-500 font-bold' : 'text-slate-400'}`}>
                  {primaryTitle.length}/100 chars
                </span>
              </div>
              <textarea
                rows={2}
                value={primaryTitle}
                onChange={(e) => setPrimaryTitle(e.target.value)}
                placeholder="Enter your YouTube video title..."
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-semibold rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition-all resize-none"
              />
            </div>

            {/* Alternative Title 2 */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setSelectedTitleIdx(1)}
                    className={`px-2 py-0.5 rounded text-[10px] font-black uppercase cursor-pointer transition-all ${
                      selectedTitleIdx === 1
                        ? 'bg-red-600 text-white shadow-sm'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-300'
                    }`}
                  >
                    {selectedTitleIdx === 1 ? '● Active in Preview' : 'Select Option 2'}
                  </button>
                  <span>Title Option 2 (Alternative)</span>
                </label>
                <span className="text-[11px] font-mono text-slate-400">
                  {titleOption2.length}/100 chars
                </span>
              </div>
              <input
                type="text"
                value={titleOption2}
                onChange={(e) => setTitleOption2(e.target.value)}
                placeholder="Enter alternative title option 2..."
                className="w-full px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
              />
            </div>

            {/* Alternative Title 3 */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setSelectedTitleIdx(2)}
                    className={`px-2 py-0.5 rounded text-[10px] font-black uppercase cursor-pointer transition-all ${
                      selectedTitleIdx === 2
                        ? 'bg-red-600 text-white shadow-sm'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-300'
                    }`}
                  >
                    {selectedTitleIdx === 2 ? '● Active in Preview' : 'Select Option 3'}
                  </button>
                  <span>Title Option 3 (Alternative)</span>
                </label>
                <span className="text-[11px] font-mono text-slate-400">
                  {titleOption3.length}/100 chars
                </span>
              </div>
              <input
                type="text"
                value={titleOption3}
                onChange={(e) => setTitleOption3(e.target.value)}
                placeholder="Enter alternative title option 3..."
                className="w-full px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
              />
            </div>

            {/* Channel Metadata Adjustments */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-200/80 dark:border-slate-800">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Channel Name</label>
                <input
                  type="text"
                  value={channelName}
                  onChange={(e) => setChannelName(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs font-bold rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Views</label>
                <input
                  type="text"
                  value={channelViews}
                  onChange={(e) => setChannelViews(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs font-bold rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Uploaded</label>
                <input
                  type="text"
                  value={channelTimeAgo}
                  onChange={(e) => setChannelTimeAgo(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs font-bold rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Duration</label>
                <input
                  type="text"
                  value={videoDuration}
                  onChange={(e) => setVideoDuration(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs font-bold rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: TITLE TRUNCATION COMPARISON TABLE */}
          <div className="glass-card p-5 sm:p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-3 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-indigo-500" />
                Mobile Title Cut / Truncation Comparison
              </h3>
              <span className="text-[10px] text-slate-400">Estimated mobile 2-line display</span>
            </div>

            <div className="space-y-2.5">
              {titleComparisonList.map((item, idx) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedTitleIdx(idx)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    selectedTitleIdx === idx
                      ? 'border-red-500/60 bg-red-500/5 dark:bg-red-500/10 shadow-sm'
                      : 'border-slate-200/80 dark:border-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200">
                      {item.label}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-400">
                        {item.charCount} chars • {item.wordCount} words
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold flex items-center gap-1 ${
                          item.isTruncated
                            ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                            : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                        }`}
                      >
                        {item.isTruncated ? (
                          <>
                            <AlertTriangle className="w-3 h-3" /> May truncate
                          </>
                        ) : (
                          <>
                            <Check className="w-3 h-3" /> Fits
                          </>
                        )}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 line-clamp-2 leading-tight">
                    {item.text || '(No title entered)'}
                  </p>

                  <div className="text-[10px] text-slate-400 mt-1">
                    {item.isTruncated
                      ? 'Title may be truncated on smaller phone screens. Important keywords should be front-loaded in the first 45 chars.'
                      : 'Title fits cleanly within the standard 2-line mobile display boundary.'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 4: THUMBNAIL READABILITY & STANDOUT ANALYSIS SCORES */}
          {analysis && (
            <div className="glass-card p-5 sm:p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-black uppercase tracking-wider text-red-600 dark:text-red-400 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" />
                    Thumbnail Readability & Standout Analysis
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Deterministic pixel analysis calculated locally via HTML5 Canvas
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-slate-900 dark:text-white">
                    {analysis.overallScore}
                  </span>
                  <span className="text-xs text-slate-400">/100</span>
                  <span
                    className={`block text-[10px] font-extrabold uppercase ${
                      analysis.overallScore >= 75
                        ? 'text-emerald-500'
                        : analysis.overallScore >= 60
                        ? 'text-indigo-400'
                        : 'text-amber-500'
                    }`}
                  >
                    {analysis.scoreGrade}
                  </span>
                </div>
              </div>

              {/* Score breakdown metrics grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800">
                  <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-1">
                    Readability Score
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-black text-slate-800 dark:text-slate-100">
                      {analysis.readabilityScore}
                    </span>
                    <span className="text-[10px] text-slate-400">/100</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div
                      className="bg-indigo-500 h-full rounded-full transition-all"
                      style={{ width: `${analysis.readabilityScore}%` }}
                    />
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800">
                  <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-1">
                    Standout Score
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-black text-slate-800 dark:text-slate-100">
                      {analysis.feedStandoutScore}
                    </span>
                    <span className="text-[10px] text-slate-400">/100</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div
                      className="bg-rose-500 h-full rounded-full transition-all"
                      style={{ width: `${analysis.feedStandoutScore}%` }}
                    />
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800">
                  <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-1">
                    Dark Mode Pop
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-black text-slate-800 dark:text-slate-100">
                      {analysis.darkModeScore}
                    </span>
                    <span className="text-[10px] text-slate-400">/100</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div
                      className="bg-purple-500 h-full rounded-full transition-all"
                      style={{ width: `${analysis.darkModeScore}%` }}
                    />
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800">
                  <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-1">
                    Light Mode Pop
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-black text-slate-800 dark:text-slate-100">
                      {analysis.lightModeScore}
                    </span>
                    <span className="text-[10px] text-slate-400">/100</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div
                      className="bg-amber-500 h-full rounded-full transition-all"
                      style={{ width: `${analysis.lightModeScore}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Works best in indicator */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-xs">
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  Environment Compatibility:
                </span>
                <span className="font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">
                  Works best in: {analysis.worksBestIn} Mode
                </span>
              </div>

              {/* Actionable Recommendations */}
              {analysis.recommendations.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                    Actionable Improvement Suggestions:
                  </span>
                  <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-400 list-disc list-inside">
                    {analysis.recommendations.map((rec, i) => (
                      <li key={i} className="leading-relaxed">
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <p className="text-[10px] text-slate-400 italic">
                *Visual Standout Estimate: Evaluates visual properties only. Does not predict actual YouTube CTR or algorithm ranking.
              </p>
            </div>
          )}

          {/* SECTION 5: SMALL-SIZE PREVIEW INSPECTOR */}
          <div className="glass-card p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-3 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-red-500" />
                Small Mobile Preview (Micro-Inspection)
              </h3>
              <span className="text-[10px] text-slate-400">~140px width</span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Check if your main subject, text, and facial expressions remain instantly recognizable when scaled down on smaller smartphone screens or search previews:
            </p>

            <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="relative w-36 aspect-video rounded-xl overflow-hidden bg-slate-800 shrink-0 shadow-md">
                <img
                  src={thumbnailSrc}
                  alt="Small thumbnail preview"
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-1 right-1 px-1 py-0.2 rounded bg-black/80 text-white text-[8px] font-bold font-mono">
                  {videoDuration}
                </span>
              </div>
              <div className="space-y-1 min-w-0">
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 line-clamp-2 leading-tight">
                  {activeTitle}
                </h4>
                <p className="text-[10px] text-slate-400">
                  {channelName} • {channelViews}
                </p>
                <span className="inline-block px-1.5 py-0.5 rounded bg-red-500/10 text-red-500 text-[9px] font-bold">
                  Compact Scale
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ================================================================= */}
        {/* RIGHT COLUMN: SIMULATED YOUTUBE-STYLE PHONE CONTAINER */}
        {/* ================================================================= */}
        <div className="lg:col-span-6 flex flex-col items-center space-y-4">
          {/* Mockup Display Controls Toolbar */}
          <div className="w-full max-w-sm flex items-center justify-between gap-2 p-2 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 shadow-sm">
            {/* Mode Switcher */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setPreviewMode('home')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                  previewMode === 'home'
                    ? 'bg-white dark:bg-slate-900 text-red-600 dark:text-red-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" /> Home Feed
              </button>
              <button
                type="button"
                onClick={() => setPreviewMode('search')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                  previewMode === 'search'
                    ? 'bg-white dark:bg-slate-900 text-red-600 dark:text-red-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Search className="w-3.5 h-3.5" /> Search Results
              </button>
            </div>

            {/* Theme Toggle (Dark / Light) */}
            <div className="flex items-center gap-1 bg-slate-200/80 dark:bg-slate-900/80 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setPreviewTheme('dark')}
                className={`p-1.5 rounded-lg cursor-pointer transition-all ${
                  previewTheme === 'dark'
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                }`}
                title="Dark Mode Simulator"
              >
                <Moon className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setPreviewTheme('light')}
                className={`p-1.5 rounded-lg cursor-pointer transition-all ${
                  previewTheme === 'light'
                    ? 'bg-amber-500 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                }`}
                title="Light Mode Simulator"
              >
                <Sun className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Size Scale Toggle */}
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="font-bold">Scale:</span>
            <button
              type="button"
              onClick={() => setPreviewScale('large')}
              className={`px-2.5 py-1 rounded-lg font-bold cursor-pointer transition-all ${
                previewScale === 'large'
                  ? 'bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              100%
            </button>
            <button
              type="button"
              onClick={() => setPreviewScale('medium')}
              className={`px-2.5 py-1 rounded-lg font-bold cursor-pointer transition-all ${
                previewScale === 'medium'
                  ? 'bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              85%
            </button>
            <button
              type="button"
              onClick={() => setPreviewScale('small')}
              className={`px-2.5 py-1 rounded-lg font-bold cursor-pointer transition-all ${
                previewScale === 'small'
                  ? 'bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              70%
            </button>
          </div>

          {/* SIMULATION LABEL */}
          <div className="text-center">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {previewMode === 'home' ? 'Simulated YouTube-style Home Feed' : 'Simulated Competition View'}
            </span>
          </div>

          {/* =============================================================== */}
          {/* PHONE FRAME WORKSPACE */}
          {/* =============================================================== */}
          <div
            className={`transition-transform duration-200 origin-top ${
              previewScale === 'large'
                ? 'scale-100'
                : previewScale === 'medium'
                ? 'scale-[0.88]'
                : 'scale-[0.75]'
            }`}
          >
            <div
              ref={phoneContainerRef}
              className={`w-[360px] sm:w-[380px] rounded-[42px] border-[10px] overflow-hidden shadow-2xl transition-colors duration-200 flex flex-col select-none relative ${
                previewTheme === 'dark'
                  ? 'bg-[#0f0f0f] text-[#f1f1f1] border-slate-800'
                  : 'bg-white text-[#0f0f0f] border-slate-300'
              }`}
            >
              {/* SMARTPHONE STATUS BAR */}
              <div className="pt-3 px-6 pb-1 flex items-center justify-between text-[11px] font-bold opacity-85 shrink-0">
                <span>9:41</span>
                {/* Simulated camera notch pill */}
                <div className="w-20 h-4 bg-black rounded-full mx-auto" />
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px]">5G</span>
                  <div className="w-4 h-2 rounded-sm border border-current flex items-center p-0.5">
                    <div className="w-full h-full bg-current rounded-xs" />
                  </div>
                </div>
              </div>

              {/* APP HEADER BAR */}
              {previewMode === 'home' ? (
                <div
                  className={`px-4 py-2.5 flex items-center justify-between border-b ${
                    previewTheme === 'dark' ? 'border-slate-800/80 bg-[#0f0f0f]' : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    {/* Simulated YouTube-like logo icon */}
                    <div className="w-7 h-5 rounded-md bg-red-600 flex items-center justify-center text-white shadow-xs">
                      <div className="w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-l-[7px] border-l-white ml-0.5" />
                    </div>
                    <span className="text-base font-black tracking-tighter">Video</span>
                  </div>

                  <div className="flex items-center gap-3 opacity-80">
                    <button type="button" className="p-1 hover:opacity-100" title="Cast">
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M1 18v3h3c0-1.66-1.34-3-3-3zm0-4v2c2.76 0 5 2.24 5 5h2c0-3.87-3.13-7-7-7zm0-4v2c4.97 0 9 4.03 9 9h2c0-6.08-4.93-11-11-11zm20-7H3c-1.1 0-2 .9-2 2v3h2V5h18v14h-7v2h7c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" />
                      </svg>
                    </button>
                    <button type="button" className="p-1 hover:opacity-100" title="Notifications">
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
                      </svg>
                    </button>
                    <button type="button" className="p-1 hover:opacity-100" title="Search">
                      <Search className="w-4 h-4" />
                    </button>
                    <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 text-white flex items-center justify-center text-[10px] font-bold">
                      {channelName.charAt(0)}
                    </div>
                  </div>
                </div>
              ) : (
                /* SEARCH BAR HEADER */
                <div
                  className={`px-3 py-2 border-b flex items-center gap-2 ${
                    previewTheme === 'dark' ? 'border-slate-800 bg-[#0f0f0f]' : 'border-slate-200 bg-white'
                  }`}
                >
                  <button type="button" className="p-1">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
                    </svg>
                  </button>
                  <div
                    className={`flex-1 flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${
                      previewTheme === 'dark' ? 'bg-[#272727] text-white' : 'bg-slate-100 text-slate-800'
                    }`}
                  >
                    <Search className="w-3.5 h-3.5 opacity-60" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-transparent w-full focus:outline-none text-xs"
                      placeholder="Search YouTube..."
                    />
                  </div>
                  <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                    </svg>
                  </div>
                </div>
              )}

              {/* HORIZONTAL FILTER CHIPS */}
              <div
                className={`px-3 py-2 flex items-center gap-1.5 overflow-x-hidden border-b ${
                  previewTheme === 'dark' ? 'border-slate-800/60' : 'border-slate-100'
                }`}
              >
                <span
                  className={`px-3 py-1 rounded-lg text-[11px] font-bold shrink-0 ${
                    previewTheme === 'dark' ? 'bg-white text-black' : 'bg-black text-white'
                  }`}
                >
                  All
                </span>
                <span
                  className={`px-3 py-1 rounded-lg text-[11px] font-semibold shrink-0 ${
                    previewTheme === 'dark' ? 'bg-[#272727] text-slate-300' : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  Trending
                </span>
                <span
                  className={`px-3 py-1 rounded-lg text-[11px] font-semibold shrink-0 ${
                    previewTheme === 'dark' ? 'bg-[#272727] text-slate-300' : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  Guides
                </span>
                <span
                  className={`px-3 py-1 rounded-lg text-[11px] font-semibold shrink-0 ${
                    previewTheme === 'dark' ? 'bg-[#272727] text-slate-300' : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  Recent
                </span>
              </div>

              {/* ============================================================= */}
              {/* FEED SCROLLABLE CONTENT BODY */}
              {/* ============================================================= */}
              <div className="overflow-y-auto max-h-[500px] flex-1 divide-y divide-slate-200/50 dark:divide-slate-800/60">
                {/* ----------------------------------------------------------- */}
                {/* VIEW A: MOBILE HOME FEED */}
                {/* ----------------------------------------------------------- */}
                {previewMode === 'home' && (
                  <div className="space-y-4">
                    {/* PRIMARY USER VIDEO CARD */}
                    <div className="space-y-2.5 pb-4">
                      {/* Thumbnail Container */}
                      <div className="relative aspect-video w-full bg-slate-800 overflow-hidden">
                        <img
                          src={thumbnailSrc}
                          alt="Video thumbnail mobile simulation"
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/85 text-white text-[10px] font-bold font-mono tracking-wider">
                          {videoDuration}
                        </span>
                      </div>

                      {/* Video Metadata Row */}
                      <div className="px-3.5 flex items-start gap-3">
                        {/* Channel Avatar */}
                        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-xs shrink-0 mt-0.5 shadow-xs">
                          {channelName.charAt(0).toUpperCase()}
                        </div>

                        {/* Title, Channel, & Stats */}
                        <div className="flex-1 min-w-0 pr-1">
                          <h3
                            ref={titleMeasureRefs[selectedTitleIdx]}
                            className={`text-[13px] font-bold leading-[1.3] line-clamp-2 ${
                              previewTheme === 'dark' ? 'text-[#f1f1f1]' : 'text-[#0f0f0f]'
                            }`}
                          >
                            {activeTitle || 'Untitled Video'}
                          </h3>
                          <div
                            className={`text-[11px] mt-1 flex items-center gap-1 font-medium ${
                              previewTheme === 'dark' ? 'text-[#aaaaaa]' : 'text-[#606060]'
                            }`}
                          >
                            <span className="truncate max-w-[120px]">{channelName}</span>
                            <span>•</span>
                            <span>{channelViews}</span>
                            <span>•</span>
                            <span>{channelTimeAgo}</span>
                          </div>
                        </div>

                        {/* 3-Dots Menu */}
                        <button
                          type="button"
                          className={`p-1 mt-0.5 opacity-70 hover:opacity-100 ${
                            previewTheme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                          }`}
                        >
                          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                            <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* SECONDARY FEED PLACEHOLDER CARD (FOR REALISTIC CONTEXT) */}
                    <div className="space-y-2.5 pb-4 pt-2 opacity-85">
                      <div className="relative aspect-video w-full bg-gradient-to-r from-slate-800 to-slate-900 overflow-hidden flex items-center justify-center">
                        <div className="text-center p-4">
                          <span className="px-2 py-1 rounded bg-black/60 text-white text-[10px] font-bold uppercase tracking-wider">
                            Recommended In Feed
                          </span>
                          <p className="text-xs text-slate-300 font-bold mt-2">
                            Next Video: How Algorithm Recommends Thumbnails
                          </p>
                        </div>
                        <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/85 text-white text-[10px] font-bold font-mono">
                          18:50
                        </span>
                      </div>
                      <div className="px-3.5 flex items-start gap-3">
                        <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                          AC
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-[13px] font-bold leading-[1.3] line-clamp-2">
                            The Secret Behind 1M+ View Thumbnails (Real Case Study)
                          </h4>
                          <p className="text-[11px] opacity-70 mt-1">Algorithm Creators • 410K views • 5 days ago</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ----------------------------------------------------------- */}
                {/* VIEW B: MOBILE SEARCH RESULTS (COMPETITION VIEW) */}
                {/* ----------------------------------------------------------- */}
                {previewMode === 'search' && (
                  <div className="p-3 space-y-4">
                    <div className="text-[10px] uppercase font-black tracking-wider text-slate-500 pb-1 border-b border-slate-200/40 dark:border-slate-800/40 flex items-center justify-between">
                      <span>Simulated Search Feed</span>
                      <span>Results for &quot;{searchQuery}&quot;</span>
                    </div>

                    {/* Competitor Card 1 */}
                    <div className="space-y-1.5">
                      <div
                        className="relative aspect-video w-full rounded-xl overflow-hidden shadow-xs flex items-center justify-center p-4 text-center"
                        style={{
                          background: `linear-gradient(135deg, ${COMPETITOR_DATA[0].colorFrom}, ${COMPETITOR_DATA[0].colorTo})`
                        }}
                      >
                        <span className="px-2.5 py-1 rounded-md bg-black/80 text-white text-xs font-black tracking-wide">
                          {COMPETITOR_DATA[0].badgeText}
                        </span>
                        <span className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded bg-black/80 text-white text-[9px] font-bold">
                          {COMPETITOR_DATA[0].duration}
                        </span>
                      </div>
                      <div className="flex gap-2 items-start">
                        <div className="w-7 h-7 rounded-full bg-slate-700 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                          {COMPETITOR_DATA[0].avatarText}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold leading-snug line-clamp-2">
                            {COMPETITOR_DATA[0].title}
                          </h4>
                          <p className="text-[10px] opacity-70 mt-0.5">
                            {COMPETITOR_DATA[0].channel} • {COMPETITOR_DATA[0].views} • {COMPETITOR_DATA[0].timeAgo}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* YOUR VIDEO (FEATURED RESULT WITH HIGHLIGHT) */}
                    <div className="p-2.5 rounded-2xl border-2 border-red-500/80 bg-red-500/5 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded-md bg-red-600 text-white text-[9px] font-black uppercase tracking-wider">
                          ★ Your Video Result
                        </span>
                        <span className="text-[9px] font-bold text-red-500">
                          Simulated Position #2
                        </span>
                      </div>

                      <div className="relative aspect-video w-full rounded-xl overflow-hidden shadow-md">
                        <img
                          src={thumbnailSrc}
                          alt="Your simulated search result"
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded bg-black/85 text-white text-[9px] font-bold font-mono">
                          {videoDuration}
                        </span>
                      </div>

                      <div className="flex gap-2 items-start">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                          {channelName.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold leading-snug line-clamp-2 text-slate-900 dark:text-white">
                            {activeTitle}
                          </h4>
                          <p className="text-[10px] opacity-70 mt-0.5">
                            {channelName} • {channelViews} • {channelTimeAgo}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Competitor Card 2 */}
                    <div className="space-y-1.5 opacity-90">
                      <div
                        className="relative aspect-video w-full rounded-xl overflow-hidden shadow-xs flex items-center justify-center p-4 text-center"
                        style={{
                          background: `linear-gradient(135deg, ${COMPETITOR_DATA[1].colorFrom}, ${COMPETITOR_DATA[1].colorTo})`
                        }}
                      >
                        <span className="px-2.5 py-1 rounded-md bg-black/80 text-white text-xs font-black tracking-wide">
                          {COMPETITOR_DATA[1].badgeText}
                        </span>
                        <span className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded bg-black/80 text-white text-[9px] font-bold">
                          {COMPETITOR_DATA[1].duration}
                        </span>
                      </div>
                      <div className="flex gap-2 items-start">
                        <div className="w-7 h-7 rounded-full bg-slate-700 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                          {COMPETITOR_DATA[1].avatarText}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold leading-snug line-clamp-2">
                            {COMPETITOR_DATA[1].title}
                          </h4>
                          <p className="text-[10px] opacity-70 mt-0.5">
                            {COMPETITOR_DATA[1].channel} • {COMPETITOR_DATA[1].views} • {COMPETITOR_DATA[1].timeAgo}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* BOTTOM NAVIGATION BAR */}
              <div
                className={`py-2 px-6 flex items-center justify-between border-t text-[10px] font-semibold shrink-0 ${
                  previewTheme === 'dark' ? 'border-slate-800 bg-[#0f0f0f]' : 'border-slate-200 bg-white'
                }`}
              >
                <div className="flex flex-col items-center gap-0.5 text-red-500">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
                  </svg>
                  <span>Home</span>
                </div>
                <div className="flex flex-col items-center gap-0.5 opacity-60">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M17.77 10.32l-1.2-.5L18 9.06c1.84-.8 2.53-3.02 1.54-4.88-.99-1.86-3.26-2.55-5.1-1.75l-7.13 3.1c-1.25.54-2.06 1.77-2.06 3.12 0 1.34.81 2.57 2.06 3.11l1.2.52-1.43.76c-1.84.8-2.53 3.02-1.54 4.88.99 1.86 3.26 2.55 5.1 1.75l7.13-3.1c1.25-.54 2.06-1.77 2.06-3.12 0-1.34-.81-2.57-2.06-3.11zM10 14.5v-5l4.5 2.5-4.5 2.5z" />
                  </svg>
                  <span>Shorts</span>
                </div>
                <div className="w-7 h-7 rounded-full border border-current flex items-center justify-center">
                  <span className="text-base font-light leading-none">+</span>
                </div>
                <div className="flex flex-col items-center gap-0.5 opacity-60">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M20 8H4V6h16v2zm-2-6H6v2h12V2zm4 10v8c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2v-8c0-1.1.9-2 2-2h16c1.1 0 2 .9 2 2zm-6 4l-6-3.27v6.53L16 16z" />
                  </svg>
                  <span>Subs</span>
                </div>
                <div className="flex flex-col items-center gap-0.5 opacity-60">
                  <div className="w-4 h-4 rounded-full bg-slate-500 text-[8px] text-white flex items-center justify-center font-bold">
                    Y
                  </div>
                  <span>You</span>
                </div>
              </div>

              {/* SIMULATED WATERMARK FOOTER (DISCREET) */}
              <div
                className={`py-1 px-4 text-center text-[9px] font-mono opacity-40 border-t ${
                  previewTheme === 'dark' ? 'border-slate-800 bg-black' : 'border-slate-200 bg-slate-100'
                }`}
              >
                Simulated Preview • Zubware
              </div>
            </div>
          </div>

          {/* Quick Copy Title button under phone */}
          <div className="pt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyTitle}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 cursor-pointer transition-all"
            >
              {isCopied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Title Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  <span>Copy Active Title</span>
                </>
              )}
            </button>
            <span className="text-[11px] text-slate-400">
              Option {selectedTitleIdx + 1} active ({activeTitle.length} chars)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
