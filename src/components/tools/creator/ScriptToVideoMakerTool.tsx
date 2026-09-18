import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Download,
  Upload,
  Sparkles,
  Video,
  Image as ImageIcon,
  Type,
  Palette,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Move,
  Trash2,
  Sliders,
  Maximize2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  ShieldCheck,
  RefreshCw,
  X,
  Plus,
  Mic,
  Volume2,
  VolumeX,
  Music
} from 'lucide-react';
import { SEOHead } from '../../SEOHead';
import { AdSlot } from '../../AdSlot';
import { BackButton } from '../../BackButton';
import { Breadcrumb } from '../../Breadcrumb';
import { getLinkUrl } from '../../../lib/paths';
import { ToolSEOContent } from '../../ToolSEOContent';
import { TOOLS_DATA } from '../../../data/toolsData';

import {
  ScriptVideoOptions,
  BackgroundConfig,
  TextConfig,
  PngOverlayConfig,
  GRADIENT_PRESETS,
  getCanvasDimensions,
  calculateScriptLayout,
  renderScriptVideoFrame,
  computeScriptVideoDuration
} from './scriptToVideo/scriptVideoEngine';

import { exportScriptToMp4Video, ExportVideoProgress } from './scriptToVideo/videoExportHelper';

interface ScriptToVideoMakerProps {
  onShowToast?: (message: string) => void;
  onNavigate?: (path: string) => void;
}

const DEFAULT_SCRIPT = `Once upon a time in a quiet seaside town,
there was a small wooden lighthouse that hadn't shone its light in fifty years.

Every evening, an old fisherman sat by the shore,
watching the dark waves crash against the rocks.

He knew that somewhere far out at sea,
lost ships were searching for a way home.

One foggy night, he decided to climb the spiral stairs...
and bring the ancient flame back to life.`;

export const ScriptToVideoMakerTool: React.FC<ScriptToVideoMakerProps> = ({
  onShowToast,
  onNavigate
}) => {
  // Navigation Handler Helper
  const handleNav = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    } else {
      window.location.href = path;
    }
  };

  const currentToolMeta = TOOLS_DATA.find(t => t.id === 'script-to-video-maker') || {
    id: 'script-to-video-maker',
    title: 'Script to Video Maker',
    navTitle: 'Script to Video',
    description: 'Turn any script into a scrolling text video with your own background, fonts, colors, and logo overlay — perfect for Reels, Shorts, and TikTok.',
    icon: '📜',
    path: '/script-to-video-maker.html',
    filename: 'script-to-video-maker.html',
    category: '📱 Creator & Social Media Tools',
    badge: 'New',
    features: [
      'Scrolling Text Story Reel Animation',
      'Custom Backgrounds (Gradients, Images, Videos)',
      'Aspect Ratio Presets (9:16, 1:1, 16:9)',
      'Custom Typography, Fonts & Text Highlight Boxes',
      'Draggable Fixed Logo / Watermark PNG Overlay',
      '100% Free Client-Side MP4 Export'
    ]
  };

  // ---------------------------------------------------------------------------
  // STATE DEFINITIONS
  // ---------------------------------------------------------------------------

  const [activeTab, setActiveTab] = useState<'script' | 'audio' | 'bg' | 'format' | 'text' | 'overlay'>('script');

  // Script State
  const [scriptText, setScriptText] = useState<string>(DEFAULT_SCRIPT);

  // Voiceover & Audio State
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const [audioFileName, setAudioFileName] = useState<string | null>(null);
  const [audioDuration, setAudioDuration] = useState<number>(0);
  const [audioVolume, setAudioVolume] = useState<number>(1.0); // 0 to 1
  const [audioAutoSync, setAudioAutoSync] = useState<boolean>(true);
  const [audioEnabled, setAudioEnabled] = useState<boolean>(true);
  const audioElRef = useRef<HTMLAudioElement | null>(null);

  // Background State
  const [bgMode, setBgMode] = useState<'gradient' | 'image' | 'video'>('gradient');
  const [gradientIndex, setGradientIndex] = useState<number>(0);
  const [gradientFrom, setGradientFrom] = useState<string>(GRADIENT_PRESETS[0].from);
  const [gradientTo, setGradientTo] = useState<string>(GRADIENT_PRESETS[0].to);
  const [gradientDirection, setGradientDirection] = useState<'vertical' | 'horizontal' | 'diagonal' | 'radial'>('vertical');

  const [bgImageSrc, setBgImageSrc] = useState<string | null>(null);
  const [bgImageElement, setBgImageElement] = useState<HTMLImageElement | null>(null);
  const [bgImageOverlayOpacity, setBgImageOverlayOpacity] = useState<number>(0.3);
  const [bgImageOverlayMode, setBgImageOverlayMode] = useState<'dark' | 'light'>('dark');

  const [bgVideoSrc, setBgVideoSrc] = useState<string | null>(null);
  const [bgVideoElement, setBgVideoElement] = useState<HTMLVideoElement | null>(null);
  const [bgVideoOverlayOpacity, setBgVideoOverlayOpacity] = useState<number>(0.3);
  const [bgVideoOverlayMode, setBgVideoOverlayMode] = useState<'dark' | 'light'>('dark');

  // Format & Timing State
  const [aspectRatio, setAspectRatio] = useState<'9:16' | '1:1' | '16:9'>('9:16');
  const [scrollSpeed, setScrollSpeed] = useState<number>(180); // px/sec at 1080 width

  // Text Styling State
  const [fontFamily, setFontFamily] = useState<string>('Poppins');
  const [fontWeight, setFontWeight] = useState<'regular' | 'bold' | 'italic'>('bold');
  const [textColor, setTextColor] = useState<string>('#ffffff');
  const [fontSize, setFontSize] = useState<number>(42); // base px
  const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right'>('center');
  const [lineHeightMultiplier, setLineHeightMultiplier] = useState<number>(1.4);

  // Text Background Highlight State
  const [highlightEnabled, setHighlightEnabled] = useState<boolean>(true);
  const [highlightColor, setHighlightColor] = useState<string>('#000000');
  const [highlightOpacity, setHighlightOpacity] = useState<number>(0.6);
  const [highlightBorderRadius, setHighlightBorderRadius] = useState<number>(12);
  const [highlightPaddingH, setHighlightPaddingH] = useState<number>(18);
  const [highlightPaddingV, setHighlightPaddingV] = useState<number>(8);

  // PNG Overlay State
  const [pngOverlaySrc, setPngOverlaySrc] = useState<string | null>(null);
  const [pngOverlayElement, setPngOverlayElement] = useState<HTMLImageElement | null>(null);
  const [pngOverlayX, setPngOverlayX] = useState<number>(0.85); // 85% right
  const [pngOverlayY, setPngOverlayY] = useState<number>(0.1); // 10% top
  const [pngOverlayScale, setPngOverlayScale] = useState<number>(1.0);

  // Playback & Canvas State
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [totalDuration, setTotalDuration] = useState<number>(10);

  // Exporting State
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportProgress, setExportProgress] = useState<ExportVideoProgress>({ percent: 0, stage: '' });
  const exportAbortControllerRef = useRef<AbortController | null>(null);

  // Dragging State for Overlay
  const [isDraggingOverlay, setIsDraggingOverlay] = useState<boolean>(false);

  // Refs
  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(performance.now());

  // ---------------------------------------------------------------------------
  // IMAGE & VIDEO ASSET LOADERS
  // ---------------------------------------------------------------------------

  // Handle Image Upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      onShowToast?.('Please upload a valid image file (JPG, PNG, WebP).');
      return;
    }

    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      setBgImageSrc(url);
      setBgImageElement(img);
      setBgMode('image');
      onShowToast?.('Background image loaded successfully!');
    };
    img.onerror = () => {
      onShowToast?.('Failed to load image file.');
    };
    img.src = url;
  };

  // Handle Video Upload
  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      onShowToast?.('Please upload a valid video file (MP4, WebM, MOV).');
      return;
    }

    const url = URL.createObjectURL(file);
    const video = document.createElement('video');
    video.src = url;
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.autoplay = true;

    video.onloadeddata = () => {
      setBgVideoSrc(url);
      setBgVideoElement(video);
      setBgMode('video');
      video.play().catch(() => {});
      onShowToast?.('Background video loaded successfully!');
    };
    video.onerror = () => {
      onShowToast?.('Could not decode background video. Please try MP4 or WebM.');
    };
  };

  // Handle PNG Overlay Upload
  const handleOverlayUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      setPngOverlaySrc(url);
      setPngOverlayElement(img);
      onShowToast?.('Overlay PNG added successfully!');
    };
    img.src = url;
  };

  // Handle Voiceover Audio Upload
  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('audio/')) {
      onShowToast?.('Please upload a valid audio file (MP3, WAV, AAC, M4A, OGG).');
      return;
    }

    const url = URL.createObjectURL(file);
    const audio = new Audio(url);

    audio.onloadedmetadata = () => {
      if (audio.duration && !isNaN(audio.duration) && audio.duration > 0) {
        setAudioSrc(url);
        setAudioFileName(file.name);
        setAudioDuration(audio.duration);
        setAudioEnabled(true);
        setAudioAutoSync(true); // Auto-sync text duration to audio duration
        onShowToast?.(`Voiceover "${file.name}" uploaded and synced (${Math.round(audio.duration)}s)!`);
      } else {
        onShowToast?.('Failed to detect audio duration.');
      }
    };

    audio.onerror = () => {
      onShowToast?.('Could not load audio file. Please try standard MP3 or WAV.');
    };
  };

  const handleClearAudio = () => {
    if (audioElRef.current) {
      try { audioElRef.current.pause(); } catch (_) {}
      audioElRef.current = null;
    }
    setAudioSrc(null);
    setAudioFileName(null);
    setAudioDuration(0);
    setAudioEnabled(false);
    onShowToast?.('Voiceover audio removed.');
  };

  // Synchronize Audio with Live Preview Playback
  useEffect(() => {
    if (!audioSrc) {
      if (audioElRef.current) {
        try { audioElRef.current.pause(); } catch (_) {}
        audioElRef.current = null;
      }
      return;
    }

    if (!audioElRef.current || audioElRef.current.src !== audioSrc) {
      const audio = new Audio(audioSrc);
      audio.volume = audioVolume;
      audioElRef.current = audio;
    }
  }, [audioSrc]);

  useEffect(() => {
    if (audioElRef.current) {
      audioElRef.current.volume = audioVolume;
    }
  }, [audioVolume]);

  useEffect(() => {
    const audio = audioElRef.current;
    if (!audio || !audioEnabled || !audioSrc) return;

    if (isPlaying && !isExporting) {
      if (Math.abs(audio.currentTime - currentTime) > 0.3) {
        audio.currentTime = currentTime;
      }
      if (audio.paused) {
        audio.play().catch(() => {});
      }
    } else {
      if (!audio.paused) {
        audio.pause();
      }
      if (Math.abs(audio.currentTime - currentTime) > 0.3) {
        audio.currentTime = currentTime;
      }
    }
  }, [isPlaying, currentTime, isExporting, audioEnabled, audioSrc]);

  // ---------------------------------------------------------------------------
  // OPTIONS COMPILER HELPER
  // ---------------------------------------------------------------------------

  const compileOptions = useCallback((): ScriptVideoOptions => {
    return {
      aspectRatio,
      scrollSpeed,
      background: {
        mode: bgMode,
        gradient: {
          fromColor: gradientFrom,
          toColor: gradientTo,
          direction: gradientDirection
        },
        image: {
          src: bgImageSrc || '',
          element: bgImageElement,
          overlayOpacity: bgImageOverlayOpacity,
          overlayMode: bgImageOverlayMode
        },
        video: {
          src: bgVideoSrc || '',
          element: bgVideoElement,
          overlayOpacity: bgVideoOverlayOpacity,
          overlayMode: bgVideoOverlayMode
        }
      },
      text: {
        script: scriptText,
        fontFamily,
        fontWeight,
        fontSize,
        color: textColor,
        align: textAlign,
        lineHeightMultiplier,
        highlight: {
          enabled: highlightEnabled,
          color: highlightColor,
          opacity: highlightOpacity,
          borderRadius: highlightBorderRadius,
          paddingHorizontal: highlightPaddingH,
          paddingVertical: highlightPaddingV
        }
      },
      overlay: {
        src: pngOverlaySrc,
        element: pngOverlayElement,
        xPercent: pngOverlayX,
        yPercent: pngOverlayY,
        scale: pngOverlayScale
      },
      audio: {
        enabled: audioEnabled && !!audioSrc,
        src: audioSrc,
        element: audioElRef.current,
        duration: audioDuration,
        volume: audioVolume,
        autoSync: audioAutoSync
      }
    };
  }, [
    aspectRatio,
    scrollSpeed,
    bgMode,
    gradientFrom,
    gradientTo,
    gradientDirection,
    bgImageSrc,
    bgImageElement,
    bgImageOverlayOpacity,
    bgImageOverlayMode,
    bgVideoSrc,
    bgVideoElement,
    bgVideoOverlayOpacity,
    bgVideoOverlayMode,
    scriptText,
    fontFamily,
    fontWeight,
    fontSize,
    textColor,
    textAlign,
    lineHeightMultiplier,
    highlightEnabled,
    highlightColor,
    highlightOpacity,
    highlightBorderRadius,
    highlightPaddingH,
    highlightPaddingV,
    pngOverlaySrc,
    pngOverlayElement,
    pngOverlayX,
    pngOverlayY,
    pngOverlayScale,
    audioEnabled,
    audioSrc,
    audioDuration,
    audioVolume,
    audioAutoSync
  ]);

  // ---------------------------------------------------------------------------
  // LIVE PREVIEW ANIMATION LOOP
  // ---------------------------------------------------------------------------

  // Compute total duration whenever options change (decoupled from currentTime)
  useEffect(() => {
    try {
      const options = compileOptions();
      const dur = computeScriptVideoDuration(options);
      setTotalDuration(dur);
    } catch (e) {
      console.warn('Duration calculation error', e);
    }
  }, [compileOptions]);

  // Render canvas preview whenever options or currentTime change
  useEffect(() => {
    const canvas = previewCanvasRef.current;
    if (!canvas) return;

    const options = compileOptions();

    try {
      renderScriptVideoFrame(canvas, options, currentTime);
    } catch (e) {
      console.warn('Canvas render error', e);
    }
  }, [compileOptions, currentTime]);

  useEffect(() => {
    let animId: number;

    const tick = (now: number) => {
      if (isPlaying && !isExporting) {
        const deltaSec = (now - lastTimeRef.current) / 1000;
        setCurrentTime(prev => {
          const next = prev + deltaSec;
          if (next >= totalDuration) {
            return 0; // loop back to start
          }
          return next;
        });
      }
      lastTimeRef.current = now;
      animId = requestAnimationFrame(tick);
    };

    lastTimeRef.current = performance.now();
    animId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [isPlaying, totalDuration, isExporting]);

  // ---------------------------------------------------------------------------
  // INTERACTIVE OVERLAY DRAGGING
  // ---------------------------------------------------------------------------

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!pngOverlayElement || !previewCanvasRef.current) return;
    setIsDraggingOverlay(true);
    updateOverlayPositionFromEvent(e.clientX, e.clientY);
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDraggingOverlay) return;
    updateOverlayPositionFromEvent(e.clientX, e.clientY);
  };

  const handleCanvasMouseUp = () => {
    setIsDraggingOverlay(false);
  };

  const updateOverlayPositionFromEvent = (clientX: number, clientY: number) => {
    const canvas = previewCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();

    const relX = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const relY = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height));

    setPngOverlayX(relX);
    setPngOverlayY(relY);
  };

  // ---------------------------------------------------------------------------
  // EXPORT PROCESS
  // ---------------------------------------------------------------------------

  const handleStartExport = async () => {
    if (!scriptText.trim()) {
      onShowToast?.('Please paste or enter a script before generating video.');
      return;
    }

    setIsPlaying(false);
    setIsExporting(true);
    setExportProgress({ percent: 0, stage: 'Preparing video export...' });

    const controller = new AbortController();
    exportAbortControllerRef.current = controller;

    try {
      const options = compileOptions();
      const result = await exportScriptToMp4Video({
        options,
        onProgress: (prog) => {
          setExportProgress(prog);
        },
        signal: controller.signal
      });

      // Trigger File Download
      const link = document.createElement('a');
      link.href = result.url;
      link.download = result.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      onShowToast?.('Video downloaded successfully!');
    } catch (err: any) {
      if (err.message !== 'Export cancelled.' && err.message !== 'Export cancelled by user.') {
        onShowToast?.(`Export error: ${err.message || 'Failed to render video.'}`);
      }
    } finally {
      setIsExporting(false);
      exportAbortControllerRef.current = null;
    }
  };

  const handleCancelExport = () => {
    if (exportAbortControllerRef.current) {
      exportAbortControllerRef.current.abort();
    }
    setIsExporting(false);
    onShowToast?.('Video export cancelled.');
  };

  // Stats calculation
  const charCount = scriptText.length;
  const wordCount = scriptText.trim() ? scriptText.trim().split(/\s+/).length : 0;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      <SEOHead
        title="Script to Video Maker - Create Scrolling Text Videos Online | Zubware"
        description="Turn scripts and stories into scrolling text videos for Reels, Shorts and TikTok. Add custom backgrounds, fonts, colors and logo overlays 100% free in your browser."
        canonicalPath="/script-to-video-maker.html"
        toolMeta={currentToolMeta}
        breadcrumbs={[
          { label: 'Home', path: getLinkUrl('/') },
          { label: 'Creator Tools', path: getLinkUrl('/categories.html') },
          { label: 'Script to Video' }
        ]}
      />

      {/* Header Navigation */}
      <div className="sticky top-16 z-40 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl py-3 px-4 sm:px-6 -mx-4 sm:-mx-6 border-b border-white/50 dark:border-white/10 shadow-sm flex flex-wrap items-center justify-between gap-3 rounded-2xl mb-2">
        <BackButton onNavigate={handleNav} />
        <Breadcrumb
          items={[
            { label: 'Home', path: getLinkUrl('/') },
            { label: 'Creator Tools', path: getLinkUrl('/categories.html') },
            { label: 'Script to Video' }
          ]}
          onNavigate={handleNav}
        />
      </div>

      {/* Tool Title Banner */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-4xl inline-block p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900">
          📜
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
          Script to Video Maker
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          Turn any story or script into a clean, scrolling text video with custom backgrounds, typography, and logo overlay — ready for Reels, Shorts, and TikTok.
        </p>
      </div>

      <AdSlot type="banner" label="Advertisement" />

      {/* MAIN TWO-COLUMN WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* LEFT COLUMN: CONTROLS & TABS */}
        <div className="lg:col-span-7 glass-panel p-5 sm:p-6 rounded-3xl space-y-6 order-2 lg:order-1">

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1.5 p-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-2xl overflow-x-auto text-xs font-bold scrollbar-none">
            <button
              onClick={() => setActiveTab('script')}
              className={`flex-1 min-w-[80px] py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'script'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Type className="w-3.5 h-3.5" /> Script
            </button>
            <button
              onClick={() => setActiveTab('audio')}
              className={`flex-1 min-w-[90px] py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'audio'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Mic className="w-3.5 h-3.5" /> Voiceover
              {audioSrc && <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />}
            </button>
            <button
              onClick={() => setActiveTab('bg')}
              className={`flex-1 min-w-[90px] py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'bg'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" /> Background
            </button>
            <button
              onClick={() => setActiveTab('format')}
              className={`flex-1 min-w-[80px] py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'format'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Video className="w-3.5 h-3.5" /> Format
            </button>
            <button
              onClick={() => setActiveTab('text')}
              className={`flex-1 min-w-[80px] py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'text'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Palette className="w-3.5 h-3.5" /> Style
            </button>
            <button
              onClick={() => setActiveTab('overlay')}
              className={`flex-1 min-w-[80px] py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'overlay'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" /> Logo
            </button>
          </div>

          {/* TAB 1: SCRIPT INPUT */}
          {activeTab === 'script' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Paste Your Story or Script
                </label>
                <span className="text-xs font-mono text-indigo-600 dark:text-indigo-400 font-bold">
                  Est. Duration: {formatTime(totalDuration)}
                </span>
              </div>

              <textarea
                value={scriptText}
                onChange={(e) => setScriptText(e.target.value)}
                placeholder="Paste your story or script here... Line breaks and paragraphs will be preserved."
                rows={10}
                className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm font-sans text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-inner resize-y leading-relaxed"
              />

              {/* Stats Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-200/60 dark:border-slate-800/60">
                <div className="flex items-center gap-3">
                  <span>Characters: <strong>{charCount}</strong></span>
                  <span>Words: <strong>{wordCount}</strong></span>
                </div>
                <button
                  onClick={() => setScriptText('')}
                  className="text-xs text-red-500 hover:underline flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" /> Clear Text
                </button>
              </div>

              {/* Warnings & Helper Prompts */}
              {!scriptText.trim() && (
                <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-amber-700 dark:text-amber-300 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>Paste a script to preview and create your video.</span>
                </div>
              )}

              {totalDuration > 60 && (
                <div className="p-3.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60 text-indigo-700 dark:text-indigo-300 text-xs flex items-center gap-2">
                  <Sparkles className="w-4 h-4 shrink-0 text-indigo-500" />
                  <span>This script is long (over 1 min) and will render a full-length reel video.</span>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: VOICEOVER / AUDIO SYNC */}
          {activeTab === 'audio' && (
            <div className="space-y-5">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                  Voiceover & Audio Sync
                </span>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Upload your own voiceover narration or background track. The scrolling text will automatically adjust speed to sync with your audio.
                </p>
              </div>

              {/* Upload Dropzone */}
              {!audioSrc ? (
                <label className="block p-6 rounded-2xl border-2 border-dashed border-indigo-300 dark:border-indigo-900/80 hover:border-indigo-500 bg-indigo-50/40 dark:bg-indigo-950/20 text-center cursor-pointer transition-all">
                  <Mic className="w-8 h-8 text-indigo-500 mx-auto mb-2" />
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                    Upload Voiceover Audio File
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-1">
                    Supports MP3, WAV, M4A, AAC, OGG
                  </span>
                  <input type="file" accept="audio/*" onChange={handleAudioUpload} className="hidden" />
                </label>
              ) : (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 space-y-4">
                  {/* File Header */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
                        <Music className="w-5 h-5" />
                      </div>
                      <div className="truncate">
                        <span className="text-xs font-bold text-slate-900 dark:text-white block truncate">
                          {audioFileName || 'Voiceover Track'}
                        </span>
                        <span className="text-[11px] font-mono text-indigo-600 dark:text-indigo-400 font-bold block">
                          Duration: {formatTime(audioDuration)}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={handleClearAudio}
                      className="text-xs text-red-500 hover:underline flex items-center gap-1 shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Remove
                    </button>
                  </div>

                  {/* Enable Voiceover Toggle */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80">
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-slate-900 dark:text-white block">
                        Include Voiceover Audio in Video
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                        Plays audio in preview and includes track in exported MP4
                      </span>
                    </div>
                    <button
                      onClick={() => setAudioEnabled(!audioEnabled)}
                      className={`w-10 h-6 rounded-full transition-colors relative p-0.5 ${audioEnabled ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'}`}
                    >
                      <div className={`w-5 h-5 rounded-full bg-white transition-transform ${audioEnabled ? 'translate-x-4' : 'translate-x-0'}`} />
                    </button>
                  </div>

                  {/* Auto-Sync Toggle Switch */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80">
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-slate-900 dark:text-white block">
                        Auto-Sync Text Scroll to Audio Length
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                        Text automatically finishes scrolling exactly when audio ends ({formatTime(audioDuration)})
                      </span>
                    </div>
                    <button
                      onClick={() => setAudioAutoSync(!audioAutoSync)}
                      className={`w-10 h-6 rounded-full transition-colors relative p-0.5 ${audioAutoSync ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'}`}
                    >
                      <div className={`w-5 h-5 rounded-full bg-white transition-transform ${audioAutoSync ? 'translate-x-4' : 'translate-x-0'}`} />
                    </button>
                  </div>

                  {/* Volume Slider */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                      <span className="flex items-center gap-1.5">
                        {audioVolume === 0 ? <VolumeX className="w-3.5 h-3.5 text-slate-400" /> : <Volume2 className="w-3.5 h-3.5 text-indigo-500" />}
                        Voiceover Volume
                      </span>
                      <span className="font-mono text-indigo-600">{Math.round(audioVolume * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={audioVolume}
                      onChange={(e) => setAudioVolume(parseFloat(e.target.value))}
                      className="w-full accent-indigo-600 cursor-pointer"
                    />
                  </div>

                  <div className="p-3 rounded-xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900 text-[11px] text-indigo-700 dark:text-indigo-300 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 shrink-0 text-indigo-500" />
                    <span>Your voiceover will be merged directly into the downloaded MP4 video file!</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: BACKGROUND */}
          {activeTab === 'bg' && (
            <div className="space-y-5">
              {/* Mode Switcher */}
              <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 text-xs font-bold">
                <button
                  onClick={() => setBgMode('gradient')}
                  className={`flex-1 py-2 rounded-lg transition-all ${
                    bgMode === 'gradient' ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-500'
                  }`}
                >
                  Gradient Presets
                </button>
                <button
                  onClick={() => setBgMode('image')}
                  className={`flex-1 py-2 rounded-lg transition-all ${
                    bgMode === 'image' ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-500'
                  }`}
                >
                  Custom Image
                </button>
                <button
                  onClick={() => setBgMode('video')}
                  className={`flex-1 py-2 rounded-lg transition-all ${
                    bgMode === 'video' ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-500'
                  }`}
                >
                  Background Video
                </button>
              </div>

              {/* GRADIENT MODE CONTROLS */}
              {bgMode === 'gradient' && (
                <div className="space-y-4">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Preset Color Themes</span>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {GRADIENT_PRESETS.map((p, idx) => (
                      <button
                        key={p.name}
                        onClick={() => {
                          setGradientIndex(idx);
                          setGradientFrom(p.from);
                          setGradientTo(p.to);
                        }}
                        style={{ background: `linear-gradient(135deg, ${p.from}, ${p.to})` }}
                        className={`h-14 rounded-xl border-2 transition-all flex flex-col justify-end p-1.5 ${
                          gradientIndex === idx ? 'border-indigo-500 ring-2 ring-indigo-500/40 scale-105' : 'border-transparent'
                        }`}
                      >
                        <span className="text-[10px] font-bold text-white drop-shadow truncate">{p.name}</span>
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">From Color</label>
                      <input
                        type="color"
                        value={gradientFrom}
                        onChange={(e) => setGradientFrom(e.target.value)}
                        className="w-full h-10 rounded-xl cursor-pointer bg-transparent border border-slate-200 dark:border-slate-800"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">To Color</label>
                      <input
                        type="color"
                        value={gradientTo}
                        onChange={(e) => setGradientTo(e.target.value)}
                        className="w-full h-10 rounded-xl cursor-pointer bg-transparent border border-slate-200 dark:border-slate-800"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">Gradient Flow</label>
                    <select
                      value={gradientDirection}
                      onChange={(e: any) => setGradientDirection(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold"
                    >
                      <option value="vertical">Vertical (Top to Bottom)</option>
                      <option value="horizontal">Horizontal (Left to Right)</option>
                      <option value="diagonal">Diagonal</option>
                      <option value="radial">Radial Glow</option>
                    </select>
                  </div>
                </div>
              )}

              {/* IMAGE MODE CONTROLS */}
              {bgMode === 'image' && (
                <div className="space-y-4">
                  <label className="block p-6 rounded-2xl border-2 border-dashed border-indigo-300 dark:border-indigo-900 hover:border-indigo-500 bg-indigo-50/40 dark:bg-indigo-950/20 text-center cursor-pointer transition-all">
                    <Upload className="w-6 h-6 text-indigo-500 mx-auto mb-2" />
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">Click or Drag Background Image</span>
                    <span className="text-[11px] text-slate-500 block mt-0.5">JPG, PNG, WebP supported</span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>

                  {bgImageSrc && (
                    <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <img src={bgImageSrc} alt="Background" className="w-12 h-12 rounded-xl object-cover shrink-0" />
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 truncate">Background Image Active</span>
                      </div>
                      <button
                        onClick={() => { setBgImageSrc(null); setBgImageElement(null); setBgMode('gradient'); }}
                        className="text-xs text-red-500 hover:underline p-1"
                      >
                        Remove
                      </button>
                    </div>
                  )}

                  {/* Tint Overlay Slider */}
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span>Background Dark Tint Overlay</span>
                      <span className="text-indigo-600">{Math.round(bgImageOverlayOpacity * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="0.8"
                      step="0.05"
                      value={bgImageOverlayOpacity}
                      onChange={(e) => setBgImageOverlayOpacity(parseFloat(e.target.value))}
                      className="w-full accent-indigo-600 cursor-pointer"
                    />
                    <p className="text-[11px] text-slate-500">Adds a dark or light tint over the background image to keep scrolling text readable.</p>
                  </div>
                </div>
              )}

              {/* VIDEO MODE CONTROLS */}
              {bgMode === 'video' && (
                <div className="space-y-4">
                  <label className="block p-6 rounded-2xl border-2 border-dashed border-indigo-300 dark:border-indigo-900 hover:border-indigo-500 bg-indigo-50/40 dark:bg-indigo-950/20 text-center cursor-pointer transition-all">
                    <Video className="w-6 h-6 text-indigo-500 mx-auto mb-2" />
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">Upload MP4 / WebM Background Video</span>
                    <span className="text-[11px] text-slate-500 block mt-0.5">Looping video will play behind scrolling text</span>
                    <input type="file" accept="video/mp4,video/webm,video/quicktime" onChange={handleVideoUpload} className="hidden" />
                  </label>

                  {bgVideoSrc && (
                    <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Background Video Ready</span>
                      <button
                        onClick={() => { setBgVideoSrc(null); setBgVideoElement(null); setBgMode('gradient'); }}
                        className="text-xs text-red-500 hover:underline p-1"
                      >
                        Remove
                      </button>
                    </div>
                  )}

                  {/* Tint Overlay Slider */}
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span>Video Dark Overlay Tint</span>
                      <span className="text-indigo-600">{Math.round(bgVideoOverlayOpacity * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="0.8"
                      step="0.05"
                      value={bgVideoOverlayOpacity}
                      onChange={(e) => setBgVideoOverlayOpacity(parseFloat(e.target.value))}
                      className="w-full accent-indigo-600 cursor-pointer"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: ASPECT RATIO & FORMAT */}
          {activeTab === 'format' && (
            <div className="space-y-5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                Video Format & Aspect Ratio
              </span>

              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => setAspectRatio('9:16')}
                  className={`p-4 rounded-2xl border-2 transition-all text-center space-y-1.5 ${
                    aspectRatio === '9:16' ? 'border-indigo-600 bg-indigo-50/80 dark:bg-indigo-950/60 shadow-md' : 'border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div className="w-5 h-8 border-2 border-indigo-600 rounded-sm mx-auto" />
                  <span className="text-xs font-black block text-slate-900 dark:text-white">9:16 Shorts</span>
                  <span className="text-[10px] text-slate-500 block">1080 x 1920</span>
                </button>

                <button
                  onClick={() => setAspectRatio('1:1')}
                  className={`p-4 rounded-2xl border-2 transition-all text-center space-y-1.5 ${
                    aspectRatio === '1:1' ? 'border-indigo-600 bg-indigo-50/80 dark:bg-indigo-950/60 shadow-md' : 'border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div className="w-6 h-6 border-2 border-indigo-600 rounded-sm mx-auto" />
                  <span className="text-xs font-black block text-slate-900 dark:text-white">1:1 Square</span>
                  <span className="text-[10px] text-slate-500 block">1080 x 1080</span>
                </button>

                <button
                  onClick={() => setAspectRatio('16:9')}
                  className={`p-4 rounded-2xl border-2 transition-all text-center space-y-1.5 ${
                    aspectRatio === '16:9' ? 'border-indigo-600 bg-indigo-50/80 dark:bg-indigo-950/60 shadow-md' : 'border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div className="w-8 h-5 border-2 border-indigo-600 rounded-sm mx-auto" />
                  <span className="text-xs font-black block text-slate-900 dark:text-white">16:9 YouTube</span>
                  <span className="text-[10px] text-slate-500 block">1920 x 1080</span>
                </button>
              </div>

              {/* Scroll Speed Controls */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span>Scroll Speed</span>
                  <span className="text-indigo-600 font-mono">{scrollSpeed} px/s</span>
                </div>

                {audioSrc && audioAutoSync ? (
                  <div className="p-3.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-900/60 text-indigo-700 dark:text-indigo-300 text-xs flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Mic className="w-4 h-4 text-indigo-500 shrink-0" />
                      <span>Scroll speed is auto-synced with voiceover duration ({formatTime(audioDuration)}).</span>
                    </div>
                    <button
                      onClick={() => setAudioAutoSync(false)}
                      className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 underline shrink-0"
                    >
                      Manual Speed
                    </button>
                  </div>
                ) : (
                  <>
                    <input
                      type="range"
                      min="80"
                      max="400"
                      step="10"
                      value={scrollSpeed}
                      onChange={(e) => setScrollSpeed(parseInt(e.target.value))}
                      className="w-full accent-indigo-600 cursor-pointer"
                    />
                    <div className="flex justify-between text-[11px] text-slate-500">
                      <button onClick={() => setScrollSpeed(120)} className="hover:underline">Slow (120)</button>
                      <button onClick={() => setScrollSpeed(180)} className="hover:underline">Normal (180)</button>
                      <button onClick={() => setScrollSpeed(260)} className="hover:underline">Fast (260)</button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: TYPOGRAPHY & TEXT STYLING */}
          {activeTab === 'text' && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">Font Family</label>
                  <select
                    value={fontFamily}
                    onChange={(e) => setFontFamily(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold"
                  >
                    <option value="Poppins">Poppins</option>
                    <option value="Montserrat">Montserrat</option>
                    <option value="Roboto">Roboto</option>
                    <option value="Playfair Display">Playfair Display</option>
                    <option value="Georgia">Georgia</option>
                    <option value="Arial">Arial</option>
                    <option value="Comic Sans MS">Comic Sans</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">Font Weight</label>
                  <div className="flex rounded-xl bg-slate-100 dark:bg-slate-900 p-1 text-xs font-bold">
                    <button
                      onClick={() => setFontWeight('regular')}
                      className={`flex-1 py-1.5 rounded-lg ${fontWeight === 'regular' ? 'bg-white dark:bg-slate-800 text-indigo-600 shadow-sm' : 'text-slate-500'}`}
                    >
                      Regular
                    </button>
                    <button
                      onClick={() => setFontWeight('bold')}
                      className={`flex-1 py-1.5 rounded-lg ${fontWeight === 'bold' ? 'bg-white dark:bg-slate-800 text-indigo-600 shadow-sm' : 'text-slate-500'}`}
                    >
                      Bold
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">Text Color</label>
                  <input
                    type="color"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    className="w-full h-10 rounded-xl cursor-pointer bg-transparent border border-slate-200 dark:border-slate-800"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">Text Alignment</label>
                  <div className="flex rounded-xl bg-slate-100 dark:bg-slate-900 p-1">
                    <button
                      onClick={() => setTextAlign('left')}
                      className={`flex-1 py-1.5 flex items-center justify-center rounded-lg ${textAlign === 'left' ? 'bg-white dark:bg-slate-800 text-indigo-600 shadow-sm' : 'text-slate-500'}`}
                    >
                      <AlignLeft className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setTextAlign('center')}
                      className={`flex-1 py-1.5 flex items-center justify-center rounded-lg ${textAlign === 'center' ? 'bg-white dark:bg-slate-800 text-indigo-600 shadow-sm' : 'text-slate-500'}`}
                    >
                      <AlignCenter className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setTextAlign('right')}
                      className={`flex-1 py-1.5 flex items-center justify-center rounded-lg ${textAlign === 'right' ? 'bg-white dark:bg-slate-800 text-indigo-600 shadow-sm' : 'text-slate-500'}`}
                    >
                      <AlignRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Font Size Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span>Font Size</span>
                  <span className="text-indigo-600">{fontSize} px</span>
                </div>
                <input
                  type="range"
                  min="24"
                  max="72"
                  value={fontSize}
                  onChange={(e) => setFontSize(parseInt(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>

              {/* Text Background Highlight Section */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">Text Highlight Background</span>
                  <button
                    onClick={() => setHighlightEnabled(!highlightEnabled)}
                    className={`w-10 h-6 rounded-full transition-colors relative p-0.5 ${highlightEnabled ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'}`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white transition-transform ${highlightEnabled ? 'translate-x-4' : 'translate-x-0'}`} />
                  </button>
                </div>

                {highlightEnabled && (
                  <div className="space-y-3 pt-2">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-semibold text-slate-500 block mb-1">Highlight Color</label>
                        <input
                          type="color"
                          value={highlightColor}
                          onChange={(e) => setHighlightColor(e.target.value)}
                          className="w-full h-8 rounded-lg cursor-pointer bg-transparent border border-slate-200 dark:border-slate-700"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-slate-500 block mb-1">Opacity ({Math.round(highlightOpacity * 100)}%)</label>
                        <input
                          type="range"
                          min="0.1"
                          max="1.0"
                          step="0.05"
                          value={highlightOpacity}
                          onChange={(e) => setHighlightOpacity(parseFloat(e.target.value))}
                          className="w-full accent-indigo-600"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-slate-500 flex justify-between">
                        <span>Corner Roundness</span>
                        <span>{highlightBorderRadius}px</span>
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="24"
                        value={highlightBorderRadius}
                        onChange={(e) => setHighlightBorderRadius(parseInt(e.target.value))}
                        className="w-full accent-indigo-600"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: PNG OVERLAY (LOGO / WATERMARK) */}
          {activeTab === 'overlay' && (
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                Fixed PNG Watermark / Logo Overlay
              </span>

              <label className="block p-5 rounded-2xl border-2 border-dashed border-indigo-300 dark:border-indigo-900 hover:border-indigo-500 bg-indigo-50/40 dark:bg-indigo-950/20 text-center cursor-pointer transition-all">
                <Upload className="w-5 h-5 text-indigo-500 mx-auto mb-1.5" />
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">Upload Transparent PNG Logo</span>
                <input type="file" accept="image/png" onChange={handleOverlayUpload} className="hidden" />
              </label>

              {pngOverlaySrc && (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src={pngOverlaySrc} alt="Overlay Logo" className="w-10 h-10 object-contain bg-slate-200 dark:bg-slate-800 rounded-lg p-1" />
                      <span className="text-xs font-bold text-slate-900 dark:text-white">Active Logo Overlay</span>
                    </div>
                    <button
                      onClick={() => { setPngOverlaySrc(null); setPngOverlayElement(null); }}
                      className="text-xs text-red-500 hover:underline"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold">
                      <span>Logo Size Scale</span>
                      <span className="text-indigo-600">{Math.round(pngOverlayScale * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0.3"
                      max="2.5"
                      step="0.1"
                      value={pngOverlayScale}
                      onChange={(e) => setPngOverlayScale(parseFloat(e.target.value))}
                      className="w-full accent-indigo-600 cursor-pointer"
                    />
                  </div>

                  <div className="p-3 rounded-xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900 text-[11px] text-indigo-700 dark:text-indigo-300 flex items-center gap-2">
                    <Move className="w-4 h-4 shrink-0 text-indigo-500" />
                    <span>Click and drag on the live video preview to reposition your logo anywhere on screen!</span>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: LIVE CANVAS PREVIEW & EXPORT */}
        <div className="lg:col-span-5 space-y-5 order-1 lg:order-2 sticky top-28">

          {/* Canvas Viewport Box */}
          <div className="glass-panel p-4 sm:p-5 rounded-3xl space-y-4 border border-slate-200/80 dark:border-slate-800/80 shadow-xl flex flex-col items-center">
            
            <div className="flex items-center justify-between w-full text-xs font-bold text-slate-600 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <Video className="w-4 h-4 text-indigo-500" />
                Live Video Preview ({aspectRatio})
              </span>
              <span className="font-mono text-indigo-600 dark:text-indigo-400">
                {formatTime(currentTime)} / {formatTime(totalDuration)}
              </span>
            </div>

            {/* Canvas Frame Container */}
            <div
              className={`relative bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl group transition-all w-full flex items-center justify-center ${
                aspectRatio === '9:16' ? 'aspect-[9/16] max-w-[320px]' : (aspectRatio === '1:1' ? 'aspect-square max-w-[360px]' : 'aspect-[16/9] max-w-[100%]')
              }`}
            >
              <canvas
                ref={previewCanvasRef}
                onMouseDown={handleCanvasMouseDown}
                onMouseMove={handleCanvasMouseMove}
                onMouseUp={handleCanvasMouseUp}
                className="w-full h-full object-contain cursor-crosshair"
              />

              {/* Dragging Overlay Tip */}
              {pngOverlayElement && (
                <div className="absolute top-2 left-2 px-2.5 py-1 rounded-full bg-slate-900/80 text-[10px] font-bold text-indigo-300 border border-slate-700/80 pointer-events-none backdrop-blur-sm">
                  💡 Drag logo to move
                </div>
              )}
            </div>

            {/* Playback Controls & Timeline Scrubber */}
            <div className="w-full space-y-2 pt-1">
              <input
                type="range"
                min="0"
                max={totalDuration || 10}
                step="0.1"
                value={currentTime}
                onChange={(e) => setCurrentTime(parseFloat(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg"
              />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs flex items-center gap-1.5 hover:bg-indigo-700 transition-colors shadow-sm"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    <span>{isPlaying ? 'Pause' : 'Play Preview'}</span>
                  </button>

                  <button
                    onClick={() => setCurrentTime(0)}
                    className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-200 transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>

                <span className="text-[11px] font-bold text-slate-500">
                  {scrollSpeed} px/s
                </span>
              </div>
            </div>

            {/* PRIMARY EXPORT BUTTON */}
            <button
              onClick={handleStartExport}
              disabled={isExporting || !scriptText.trim()}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-extrabold text-sm shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              <Download className="w-4 h-4" />
              <span>DOWNLOAD MP4 VIDEO</span>
            </button>

            <div className="text-[11px] text-slate-500 text-center flex items-center gap-1 justify-center">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>100% Private Client-Side Browser Processing</span>
            </div>

          </div>

        </div>

      </div>

      {/* EXPORT OVERLAY MODAL */}
      {isExporting && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-3xl max-w-md w-full shadow-2xl text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900 flex items-center justify-center mx-auto text-indigo-600 dark:text-indigo-400">
              <RefreshCw className="w-8 h-8 animate-spin" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                Generating Video...
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {exportProgress.stage || 'Rendering frames...'}
              </p>
            </div>

            {/* Real Progress Bar */}
            <div className="space-y-1.5">
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-600 h-full transition-all duration-200"
                  style={{ width: `${exportProgress.percent}%` }}
                />
              </div>
              <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
                {exportProgress.percent}% Complete
              </span>
            </div>

            <button
              onClick={handleCancelExport}
              className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40 text-slate-600 dark:text-slate-300 font-bold text-xs transition-colors"
            >
              Cancel Export
            </button>
          </div>
        </div>
      )}

      {/* CRAWLABLE AEO / SEO VALUE PROPOSITION CONTENT MODULE */}
      <ToolSEOContent tool={currentToolMeta} allTools={TOOLS_DATA} onNavigate={handleNav} />

      <AdSlot type="banner" label="Advertisement" />
    </div>
  );
};
