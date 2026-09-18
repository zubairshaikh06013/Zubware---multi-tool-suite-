// Core Canvas Rendering Engine for Script to Video Maker

export interface TextHighlightConfig {
  enabled: boolean;
  color: string;
  opacity: number; // 0 to 1
  borderRadius: number; // px
  paddingHorizontal: number; // px
  paddingVertical: number; // px
}

export interface GradientConfig {
  presetName?: string;
  fromColor: string;
  toColor: string;
  direction: 'vertical' | 'horizontal' | 'diagonal' | 'radial';
}

export interface ImageBgConfig {
  src: string;
  element: HTMLImageElement | null;
  overlayOpacity: number; // 0 to 0.8
  overlayMode: 'dark' | 'light';
}

export interface VideoBgConfig {
  src: string;
  element: HTMLVideoElement | null;
  overlayOpacity: number; // 0 to 0.8
  overlayMode: 'dark' | 'light';
}

export interface BackgroundConfig {
  mode: 'gradient' | 'image' | 'video';
  gradient: GradientConfig;
  image: ImageBgConfig;
  video: VideoBgConfig;
}

export interface PngOverlayConfig {
  src: string | null;
  element: HTMLImageElement | null;
  xPercent: number; // 0 to 1 (center x)
  yPercent: number; // 0 to 1 (center y)
  scale: number; // 0.1 to 2.0
}

export interface TextConfig {
  script: string;
  fontFamily: string;
  fontWeight: 'regular' | 'bold' | 'italic';
  fontSize: number; // Base font size for 1080px width
  color: string;
  align: 'left' | 'center' | 'right';
  lineHeightMultiplier: number; // e.g., 1.4
  highlight: TextHighlightConfig;
}

export interface AudioConfig {
  enabled: boolean;
  src: string | null;
  element: HTMLAudioElement | null;
  duration: number; // in seconds
  volume: number; // 0 to 1
  autoSync: boolean; // if true, text scroll duration matches audio duration
}

export interface ScriptVideoOptions {
  aspectRatio: '9:16' | '1:1' | '16:9';
  scrollSpeed: number; // pixels per second at 1080 resolution
  background: BackgroundConfig;
  text: TextConfig;
  overlay: PngOverlayConfig;
  audio?: AudioConfig;
}

export interface WrappedLine {
  text: string;
  width: number;
}

export interface ParagraphBlock {
  lines: WrappedLine[];
}

export interface ScriptLayout {
  canvasWidth: number;
  canvasHeight: number;
  scaledFontSize: number;
  scaledLineHeight: number;
  scaledParagraphGap: number;
  scaledHorizontalPadding: number;
  scaledTopMargin: number;
  scaledBottomMargin: number;
  paragraphs: ParagraphBlock[];
  totalTextHeight: number;
  scrollDistance: number;
  scaledScrollSpeed: number;
  estimatedDurationSeconds: number;
  startY: number;
  endY: number;
}

// Preset Gradients
export const GRADIENT_PRESETS: { name: string; from: string; to: string }[] = [
  { name: 'Midnight', from: '#0f172a', to: '#1e1b4b' },
  { name: 'Ocean', from: '#0284c7', to: '#0f172a' },
  { name: 'Sunset', from: '#f97316', to: '#4c1d95' },
  { name: 'Purple Dream', from: '#581c87', to: '#0f172a' },
  { name: 'Dark Rose', from: '#881337', to: '#18181b' },
  { name: 'Emerald', from: '#064e3b', to: '#022c22' }
];

// Calculate Canvas Dimensions based on Aspect Ratio
export function getCanvasDimensions(aspectRatio: '9:16' | '1:1' | '16:9'): { width: number; height: number } {
  switch (aspectRatio) {
    case '9:16':
      return { width: 1080, height: 1920 };
    case '1:1':
      return { width: 1080, height: 1080 };
    case '16:9':
      return { width: 1920, height: 1080 };
    default:
      return { width: 1080, height: 1920 };
  }
}

// Measure and Wrap Script into Paragraph Lines
export function calculateScriptLayout(
  ctx: CanvasRenderingContext2D,
  options: ScriptVideoOptions
): ScriptLayout {
  const { width, height } = getCanvasDimensions(options.aspectRatio);

  // Scale font metrics based on canvas width (1080 baseline)
  const scaleFactor = width / 1080;
  const scaledFontSize = Math.round(options.text.fontSize * scaleFactor);
  const scaledLineHeight = Math.round(scaledFontSize * options.text.lineHeightMultiplier);
  const scaledParagraphGap = Math.round(scaledFontSize * 0.8);

  // Safe area margins
  const scaledHorizontalPadding = Math.round(100 * scaleFactor);
  const scaledTopMargin = Math.round(120 * scaleFactor);
  const scaledBottomMargin = Math.round(120 * scaleFactor);

  const maxTextWidth = width - (scaledHorizontalPadding * 2);

  // Set font on context for accurate measurement
  const fontStyle = options.text.fontWeight === 'italic' ? 'italic' : 'normal';
  const fontWeight = options.text.fontWeight === 'bold' ? '700' : '400';
  ctx.font = `${fontStyle} ${fontWeight} ${scaledFontSize}px "${options.text.fontFamily}", sans-serif`;

  // Split script by user line breaks (preserve paragraphs)
  const rawParagraphs = options.text.script.split(/\r?\n/);
  const paragraphs: ParagraphBlock[] = [];
  let totalTextHeight = 0;

  for (let i = 0; i < rawParagraphs.length; i++) {
    const paragraphText = rawParagraphs[i].trim();

    // If paragraph is blank line, add empty block
    if (!paragraphText) {
      paragraphs.push({ lines: [] });
      totalTextHeight += Math.round(scaledLineHeight * 0.6);
      continue;
    }

    const words = paragraphText.split(/\s+/);
    const wrappedLines: WrappedLine[] = [];
    let currentLine = '';

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const metrics = ctx.measureText(testLine);

      if (metrics.width > maxTextWidth && currentLine) {
        wrappedLines.push({
          text: currentLine,
          width: ctx.measureText(currentLine).width
        });
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }

    if (currentLine) {
      wrappedLines.push({
        text: currentLine,
        width: ctx.measureText(currentLine).width
      });
    }

    paragraphs.push({ lines: wrappedLines });

    // Calculate height of this paragraph
    const pLinesCount = wrappedLines.length;
    const pHeight = (pLinesCount * scaledLineHeight) + (i < rawParagraphs.length - 1 ? scaledParagraphGap : 0);
    totalTextHeight += pHeight;
  }

  // Scroll distance calculation
  // Text starts below canvas bottom and ends above canvas top
  const startY = height + scaledTopMargin;
  const endY = -totalTextHeight - scaledBottomMargin;
  const scrollDistance = startY - endY;

  // Scaled scroll speed (pixels per second)
  let scaledScrollSpeed = Math.max(30, options.scrollSpeed * scaleFactor);
  let estimatedDurationSeconds = Math.max(2, scrollDistance / scaledScrollSpeed);

  if (options.audio && options.audio.enabled && options.audio.autoSync && options.audio.duration > 0) {
    estimatedDurationSeconds = options.audio.duration;
    scaledScrollSpeed = scrollDistance / options.audio.duration;
  }

  return {
    canvasWidth: width,
    canvasHeight: height,
    scaledFontSize,
    scaledLineHeight,
    scaledParagraphGap,
    scaledHorizontalPadding,
    scaledTopMargin,
    scaledBottomMargin,
    paragraphs,
    totalTextHeight,
    scrollDistance,
    scaledScrollSpeed,
    estimatedDurationSeconds,
    startY,
    endY
  };
}

// Render background (Gradient, Image, or Video Frame)
export function renderBackground(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  background: BackgroundConfig,
  currentTimeSeconds: number
) {
  if (background.mode === 'gradient') {
    let grad: CanvasGradient;
    const { fromColor, toColor, direction } = background.gradient;

    switch (direction) {
      case 'horizontal':
        grad = ctx.createLinearGradient(0, 0, width, 0);
        break;
      case 'diagonal':
        grad = ctx.createLinearGradient(0, 0, width, height);
        break;
      case 'radial':
        grad = ctx.createRadialGradient(width / 2, height / 2, 10, width / 2, height / 2, Math.max(width, height) / 1.2);
        break;
      case 'vertical':
      default:
        grad = ctx.createLinearGradient(0, 0, 0, height);
        break;
    }

    grad.addColorStop(0, fromColor);
    grad.addColorStop(1, toColor);

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);
  } else if (background.mode === 'image' && background.image.element) {
    const img = background.image.element;
    drawCoverFitImage(ctx, img, width, height);

    // Apply Overlay Tint
    if (background.image.overlayOpacity > 0) {
      ctx.fillStyle = background.image.overlayMode === 'dark'
        ? `rgba(0, 0, 0, ${background.image.overlayOpacity})`
        : `rgba(255, 255, 255, ${background.image.overlayOpacity})`;
      ctx.fillRect(0, 0, width, height);
    }
  } else if (background.mode === 'video' && background.video.element) {
    const video = background.video.element;

    // Seek video if needed
    if (video.duration && !isNaN(video.duration)) {
      const targetTime = currentTimeSeconds % video.duration;
      // If video isn't playing continuously, update currentTime
      if (Math.abs(video.currentTime - targetTime) > 0.3) {
        try { video.currentTime = targetTime; } catch (_) {}
      }
    }

    try {
      drawCoverFitImage(ctx, video, width, height);
    } catch (_) {
      // Fallback color if video frame draw fails
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, width, height);
    }

    // Apply Overlay Tint
    if (background.video.overlayOpacity > 0) {
      ctx.fillStyle = background.video.overlayMode === 'dark'
        ? `rgba(0, 0, 0, ${background.video.overlayOpacity})`
        : `rgba(255, 255, 255, ${background.video.overlayOpacity})`;
      ctx.fillRect(0, 0, width, height);
    }
  } else {
    // Fallback default dark canvas
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, width, height);
  }
}

// Draw Image or Video using object-fit: cover logic
function drawCoverFitImage(
  ctx: CanvasRenderingContext2D,
  media: HTMLImageElement | HTMLVideoElement,
  canvasWidth: number,
  canvasHeight: number
) {
  const mediaWidth = 'videoWidth' in media && media.videoWidth ? media.videoWidth : media.width;
  const mediaHeight = 'videoHeight' in media && media.videoHeight ? media.videoHeight : media.height;

  if (!mediaWidth || !mediaHeight) {
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    return;
  }

  const scale = Math.max(canvasWidth / mediaWidth, canvasHeight / mediaHeight);
  const scaledWidth = mediaWidth * scale;
  const scaledHeight = mediaHeight * scale;

  const dx = (canvasWidth - scaledWidth) / 2;
  const dy = (canvasHeight - scaledHeight) / 2;

  ctx.drawImage(media, dx, dy, scaledWidth, scaledHeight);
}

// Render Scrolling Text onto Canvas
export function renderScrollingText(
  ctx: CanvasRenderingContext2D,
  layout: ScriptLayout,
  options: ScriptVideoOptions,
  currentTimeSeconds: number
) {
  const {
    canvasWidth,
    scaledFontSize,
    scaledLineHeight,
    scaledParagraphGap,
    paragraphs,
    startY,
    scaledScrollSpeed
  } = layout;

  const scaleFactor = canvasWidth / 1080;

  // Compute Current Y position of script top
  const currentTextTopY = startY - (currentTimeSeconds * scaledScrollSpeed);

  // Set Text Font
  const fontStyle = options.text.fontWeight === 'italic' ? 'italic' : 'normal';
  const fontWeight = options.text.fontWeight === 'bold' ? '700' : '400';
  ctx.font = `${fontStyle} ${fontWeight} ${scaledFontSize}px "${options.text.fontFamily}", sans-serif`;
  ctx.textAlign = options.text.align;
  ctx.textBaseline = 'middle';

  let cursorY = currentTextTopY;

  for (let i = 0; i < paragraphs.length; i++) {
    const paragraph = paragraphs[i];

    if (paragraph.lines.length === 0) {
      cursorY += Math.round(scaledLineHeight * 0.6);
      continue;
    }

    for (const line of paragraph.lines) {
      // Only render line if it's within visible or near-visible vertical range
      if (cursorY + scaledLineHeight > -100 && cursorY - scaledLineHeight < layout.canvasHeight + 100) {

        // Determine X coordinate based on alignment
        let lineX = canvasWidth / 2; // Center
        if (options.text.align === 'left') {
          lineX = layout.scaledHorizontalPadding;
        } else if (options.text.align === 'right') {
          lineX = canvasWidth - layout.scaledHorizontalPadding;
        }

        // Draw Text Highlight Box if enabled
        if (options.text.highlight.enabled && line.text.trim().length > 0) {
          const hPad = Math.round(options.text.highlight.paddingHorizontal * scaleFactor);
          const vPad = Math.round(options.text.highlight.paddingVertical * scaleFactor);
          const radius = Math.round(options.text.highlight.borderRadius * scaleFactor);

          const boxWidth = line.width + (hPad * 2);
          const boxHeight = scaledFontSize + (vPad * 2);

          let boxX = lineX - (line.width / 2) - hPad;
          if (options.text.align === 'left') {
            boxX = lineX - hPad;
          } else if (options.text.align === 'right') {
            boxX = lineX - line.width - hPad;
          }

          const boxY = cursorY - (scaledFontSize / 2) - vPad;

          ctx.save();
          const opacity = options.text.highlight.opacity;
          ctx.fillStyle = hexToRgba(options.text.highlight.color, opacity);
          drawRoundedRect(ctx, boxX, boxY, boxWidth, boxHeight, radius);
          ctx.fill();
          ctx.restore();
        }

        // Draw Line Text
        ctx.fillStyle = options.text.color;
        ctx.fillText(line.text, lineX, cursorY);
      }

      cursorY += scaledLineHeight;
    }

    cursorY += scaledParagraphGap;
  }
}

// Render Fixed PNG Overlay (Logo/Watermark)
export function renderPngOverlay(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  overlay: PngOverlayConfig
) {
  if (!overlay.src || !overlay.element) return;

  const img = overlay.element;
  const baseScale = (width / 1080) * overlay.scale;
  const imgWidth = img.width * baseScale * 0.25; // standard scaled size
  const imgHeight = img.height * baseScale * 0.25;

  const centerX = width * overlay.xPercent;
  const centerY = height * overlay.yPercent;

  const drawX = centerX - (imgWidth / 2);
  const drawY = centerY - (imgHeight / 2);

  ctx.drawImage(img, drawX, drawY, imgWidth, imgHeight);
}

// Shared offscreen canvas for measuring text & layout duration without DOM churn
let sharedMeasurementCanvas: HTMLCanvasElement | null = null;

// Helper to calculate total video duration from options without full rendering
export function computeScriptVideoDuration(options: ScriptVideoOptions): number {
  if (options.audio && options.audio.enabled && options.audio.autoSync && options.audio.duration > 0) {
    return options.audio.duration;
  }
  if (!sharedMeasurementCanvas) {
    sharedMeasurementCanvas = document.createElement('canvas');
  }
  const ctx = sharedMeasurementCanvas.getContext('2d');
  if (!ctx) return 15;
  const layout = calculateScriptLayout(ctx, options);
  return layout.estimatedDurationSeconds;
}

// Complete Canvas Frame Render Function
export function renderScriptVideoFrame(
  canvas: HTMLCanvasElement,
  options: ScriptVideoOptions,
  currentTimeSeconds: number
): ScriptLayout {
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get 2d context from canvas');

  const { width, height } = getCanvasDimensions(options.aspectRatio);
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }

  // 1. Calculate Layout
  const layout = calculateScriptLayout(ctx, options);

  // 2. Draw Background
  renderBackground(ctx, width, height, options.background, currentTimeSeconds);

  // 3. Draw Scrolling Text
  renderScrollingText(ctx, layout, options, currentTimeSeconds);

  // 4. Draw Fixed PNG Overlay
  renderPngOverlay(ctx, width, height, options.overlay);

  return layout;
}

// Helper: Hex to RGBA
function hexToRgba(hex: string, alpha: number): string {
  let c = hex.replace('#', '');
  if (c.length === 3) {
    c = c.split('').map(x => x + x).join('');
  }
  const num = parseInt(c, 16);
  if (isNaN(num)) return `rgba(0,0,0,${alpha})`;
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// Helper: Draw Rounded Rectangle
function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}
