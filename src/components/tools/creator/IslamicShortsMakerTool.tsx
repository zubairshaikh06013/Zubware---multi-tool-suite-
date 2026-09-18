import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Sparkles,
  Type,
  Palette,
  Layers,
  Download,
  AlertTriangle,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Image as ImageIcon,
  Shield,
  Video,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Trash2,
  ArrowUp,
  ArrowDown,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Move,
  Plus,
  Square,
  Circle,
  Music,
  Save,
  Undo,
  Redo,
  Check,
  RefreshCw,
  Sliders,
  Copy,
  BookOpen,
  Scissors
} from 'lucide-react';

import {
  Layer,
  TextLayer,
  ImageLayer,
  ShapeLayer,
  DecorationLayer,
  ProjectData,
  VideoAnimationPreset,
  BackgroundConfig,
  BrandingConfig,
  AudioConfig
} from './islamicShorts/types';
import { TEMPLATE_PRESETS } from './islamicShorts/templates';
import { ISLAMIC_CONTENT_PRESETS, IslamicContentItem } from './islamicShorts/contentPresets';
import { renderIslamicShortsCanvas } from './islamicShorts/canvasRenderer';
import { saveProjectToStorage, loadLastActiveProject, exportProjectJSON } from './islamicShorts/storage';
import { exportIslamicShortVideo } from './islamicShorts/videoExporter';
import { VnTimeline } from './islamicShorts/VnTimeline';

interface IslamicShortsMakerProps {
  onShowToast: (message: string) => void;
  onNavigate?: (path: string) => void;
}

export const IslamicShortsMakerTool: React.FC<IslamicShortsMakerProps> = ({ onShowToast }) => {
  // 1. EDITOR OUTPUT MODE
  const [outputMode, setOutputMode] = useState<'image' | 'video'>('video');
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);

  // 2. PROJECT STATE
  const [projectName, setProjectName] = useState<string>('Islamic Short #1');
  const [layers, setLayers] = useState<Layer[]>(() => TEMPLATE_PRESETS[0].createLayers());
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);

  // Background config
  const [background, setBackground] = useState<BackgroundConfig>(() => TEMPLATE_PRESETS[0].background);

  // Branding config
  const [branding, setBranding] = useState<BrandingConfig>({
    channelName: '@IslamicShortsOfficial',
    watermarkOpacity: 0.85,
    watermarkPosition: 'bottom',
    logoSrc: null,
    ctaText: 'Share Zaroor Karein 🤲'
  });

  // Video / Audio config
  const [videoDuration, setVideoDuration] = useState<number>(5); // 5s default
  const [animationPreset, setAnimationPreset] = useState<VideoAnimationPreset>('zoom-in');
  const [audioConfig, setAudioConfig] = useState<AudioConfig>({
    src: null,
    name: '',
    volume: 0.8,
    muted: false,
    startTime: 0,
    fadeIn: true,
    fadeOut: true
  });

  // History for Undo / Redo
  const [history, setHistory] = useState<Layer[][]>([]);
  const [historyIdx, setHistoryIdx] = useState<number>(-1);

  // 3. CANVAS / PLAYBACK STATES
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(0.32);
  const [activeTab, setActiveTab] = useState<'templates' | 'library' | 'content' | 'text' | 'media' | 'shapes' | 'decorations' | 'background' | 'layers' | 'video' | 'branding' | 'export'>('templates');

  // Playback state in Video mode
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const animFrameRef = useRef<number | null>(null);

  // Export states
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportProgress, setExportProgress] = useState<number>(0);
  const [exportStatusText, setExportStatusText] = useState<string>('');
  const exportAbortController = useRef<AbortController | null>(null);

  // Dragging state on canvas
  const isDraggingRef = useRef<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number; layerX: number; layerY: number }>({ x: 0, y: 0, layerX: 0, layerY: 0 });

  // Save history state
  const pushHistory = useCallback((newLayers: Layer[]) => {
    setHistory((prev) => {
      const next = prev.slice(0, historyIdx + 1);
      return [...next, newLayers];
    });
    setHistoryIdx((prev) => prev + 1);
  }, [historyIdx]);

  const handleSetLayers = (newLayers: Layer[] | ((prev: Layer[]) => Layer[])) => {
    if (typeof newLayers === 'function') {
      setLayers((prev) => {
        const next = newLayers(prev);
        pushHistory(next);
        return next;
      });
    } else {
      pushHistory(newLayers);
      setLayers(newLayers);
    }
  };

  const handleUndo = () => {
    if (historyIdx > 0) {
      const prevIdx = historyIdx - 1;
      setHistoryIdx(prevIdx);
      setLayers(history[prevIdx]);
    }
  };

  const handleRedo = () => {
    if (historyIdx < history.length - 1) {
      const nextIdx = historyIdx + 1;
      setHistoryIdx(nextIdx);
      setLayers(history[nextIdx]);
    }
  };

  // Load last active project on mount
  useEffect(() => {
    const saved = loadLastActiveProject();
    if (saved && saved.layers && saved.layers.length > 0) {
      setLayers(saved.layers);
      if (saved.background) setBackground(saved.background);
      if (saved.branding) setBranding(saved.branding);
      if (saved.name) setProjectName(saved.name);
    }
  }, []);

  // Main Render Canvas Trigger
  const renderStudioCanvas = useCallback(() => {
    if (!canvasRef.current) return;
    renderIslamicShortsCanvas({
      canvas: canvasRef.current,
      layers,
      background,
      branding,
      timeSeconds: currentTime,
      durationSeconds: videoDuration,
      animationPreset,
      selectedLayerId,
      showEditorControls: true
    });
  }, [layers, background, branding, currentTime, videoDuration, animationPreset, selectedLayerId]);

  useEffect(() => {
    renderStudioCanvas();
  }, [renderStudioCanvas]);

  // Video Playback Loop
  useEffect(() => {
    let lastTime = performance.now();
    const updatePlayback = (now: number) => {
      const dt = ((now - lastTime) / 1000) * playbackSpeed;
      lastTime = now;

      setCurrentTime((prev) => {
        const next = prev + dt;
        if (next >= videoDuration) {
          return 0; // loop
        }
        return next;
      });

      if (isPlaying) {
        animFrameRef.current = requestAnimationFrame(updatePlayback);
      }
    };

    if (isPlaying) {
      lastTime = performance.now();
      animFrameRef.current = requestAnimationFrame(updatePlayback);
    } else {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    }

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying, videoDuration, playbackSpeed]);

  // Apply Template Preset
  const applyTemplate = (tpl: typeof TEMPLATE_PRESETS[0]) => {
    const newLayers = tpl.createLayers();
    handleSetLayers(newLayers);
    setBackground(tpl.background);
    setSelectedLayerId(newLayers[0]?.id || null);
    onShowToast(`Applied "${tpl.name}" template!`);
  };

  // Canvas Mouse / Touch Selection & Drag
  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = 1080 / rect.width;
    const scaleY = 1920 / rect.height;

    const clickX = (e.clientX - rect.left) * scaleX;
    const clickY = (e.clientY - rect.top) * scaleY;

    // Find clicked layer (top to bottom)
    const clickedLayer = [...layers].reverse().find((l) => {
      if (l.hidden || l.locked) return false;
      const hw = l.width / 2;
      const hh = l.height / 2;
      return clickX >= l.x - hw && clickX <= l.x + hw && clickY >= l.y - hh && clickY <= l.y + hh;
    });

    if (clickedLayer) {
      setSelectedLayerId(clickedLayer.id);
      isDraggingRef.current = true;
      dragStartRef.current = {
        x: clickX,
        y: clickY,
        layerX: clickedLayer.x,
        layerY: clickedLayer.y
      };
    } else {
      setSelectedLayerId(null);
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDraggingRef.current || !selectedLayerId || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = 1080 / rect.width;
    const scaleY = 1920 / rect.height;

    const currentX = (e.clientX - rect.left) * scaleX;
    const currentY = (e.clientY - rect.top) * scaleY;

    const dx = currentX - dragStartRef.current.x;
    const dy = currentY - dragStartRef.current.y;

    setLayers((prev) =>
      prev.map((l) => {
        if (l.id === selectedLayerId && !l.locked) {
          return {
            ...l,
            x: Math.round(dragStartRef.current.layerX + dx),
            y: Math.round(dragStartRef.current.layerY + dy)
          };
        }
        return l;
      })
    );
  };

  const handleCanvasMouseUp = () => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      pushHistory(layers);
    }
  };

  // Layer Operations
  const updateSelectedLayer = (updates: Partial<Layer>) => {
    if (!selectedLayerId) return;
    handleSetLayers((prev) =>
      prev.map((l) => (l.id === selectedLayerId ? ({ ...l, ...updates } as Layer) : l))
    );
  };

  const centerSelectedLayerHorizontally = () => {
    if (!selectedLayerId) return;
    updateSelectedLayer({ x: 540 });
    onShowToast('Centered horizontally (X: 540)');
  };

  const centerSelectedLayerVertically = () => {
    if (!selectedLayerId) return;
    updateSelectedLayer({ y: 960 });
    onShowToast('Centered vertically (Y: 960)');
  };

  const duplicateSelectedLayer = () => {
    const selectedLayer = layers.find((l) => l.id === selectedLayerId);
    if (!selectedLayer) return;
    const newId = `${selectedLayer.type}-${Date.now()}`;
    const copy: Layer = {
      ...selectedLayer,
      id: newId,
      name: `${selectedLayer.name} Copy`,
      x: Math.min(1000, selectedLayer.x + 30),
      y: Math.min(1800, selectedLayer.y + 30)
    };
    handleSetLayers((prev) => [...prev, copy]);
    setSelectedLayerId(newId);
    onShowToast('Layer duplicated!');
  };

  const handleSplitLayerAtPlayhead = () => {
    if (!selectedLayerId) {
      onShowToast('Select a layer to split at playhead position');
      return;
    }
    const layerToSplit = layers.find((l) => l.id === selectedLayerId);
    if (!layerToSplit) return;
    const newId = `${layerToSplit.type}-split-${Date.now()}`;
    const copy: Layer = {
      ...layerToSplit,
      id: newId,
      name: `${layerToSplit.name} (Split)`,
      y: Math.min(1800, layerToSplit.y + 50)
    };
    handleSetLayers((prev) => [...prev, copy]);
    setSelectedLayerId(newId);
    onShowToast('✂️ Clip split at current playhead position!');
  };

  const handleToggleLockSelectedLayer = () => {
    if (!selectedLayerId) return;
    const l = layers.find((layer) => layer.id === selectedLayerId);
    if (!l) return;
    updateSelectedLayer({ locked: !l.locked });
    onShowToast(l.locked ? '🔓 Layer Unlocked' : '🔒 Layer Locked');
  };

  const handleToggleHideSelectedLayer = () => {
    if (!selectedLayerId) return;
    const l = layers.find((layer) => layer.id === selectedLayerId);
    if (!l) return;
    updateSelectedLayer({ hidden: !l.hidden });
    onShowToast(l.hidden ? '👁️ Layer Visible' : '🙈 Layer Hidden');
  };

  const handleToggleMuteAudio = () => {
    setAudioConfig((a) => ({ ...a, muted: !a.muted }));
    onShowToast(audioConfig.muted ? '🔊 Audio Unmuted' : '🔇 Audio Muted');
  };

  const applyContentItem = (item: IslamicContentItem) => {
    handleSetLayers((prev) => {
      const nonTextLayers = prev.filter((l) => l.type !== 'text');

      const titleLayer: TextLayer = {
        id: `text-title-${Date.now()}`,
        name: 'Header Title',
        type: 'text',
        text: item.title,
        fontFamily: 'sans-serif',
        fontSize: 32,
        fontWeight: '800',
        color: '#fbbf24',
        align: 'center',
        lineHeight: 1.4,
        letterSpacing: 0,
        x: 540,
        y: 380,
        width: 900,
        height: 80,
        rotation: 0,
        opacity: 1,
        locked: false,
        hidden: false
      };

      const arabicLayer: TextLayer = {
        id: `text-arabic-${Date.now()}`,
        name: 'Arabic Calligraphy',
        type: 'text',
        text: item.arabic,
        fontFamily: 'Amiri, serif',
        fontSize: 54,
        fontWeight: 'bold',
        color: '#ffffff',
        align: 'center',
        lineHeight: 1.4,
        letterSpacing: 0,
        x: 540,
        y: 750,
        width: 950,
        height: 300,
        rotation: 0,
        opacity: 1,
        locked: false,
        hidden: false,
        isArabic: true
      };

      const romanLayer: TextLayer = {
        id: `text-roman-${Date.now()}`,
        name: 'Roman Translation',
        type: 'text',
        text: item.romanUrdu,
        fontFamily: 'sans-serif',
        fontSize: 34,
        fontWeight: 'bold',
        color: '#fef08a',
        align: 'center',
        lineHeight: 1.4,
        letterSpacing: 0,
        x: 540,
        y: 1150,
        width: 920,
        height: 200,
        rotation: 0,
        opacity: 1,
        locked: false,
        hidden: false
      };

      const englishLayer: TextLayer = {
        id: `text-english-${Date.now()}`,
        name: 'English Translation',
        type: 'text',
        text: item.english,
        fontFamily: 'sans-serif',
        fontSize: 28,
        fontWeight: 'normal',
        color: '#cbd5e1',
        align: 'center',
        lineHeight: 1.4,
        letterSpacing: 0,
        x: 540,
        y: 1420,
        width: 900,
        height: 180,
        rotation: 0,
        opacity: 1,
        locked: false,
        hidden: false
      };

      return [...nonTextLayers, titleLayer, arabicLayer, romanLayer, englishLayer];
    });

    onShowToast(`Loaded Dua: ${item.title}`);
  };

  const addTextLayer = (presetText: string = 'New Text', isArabic: boolean = false) => {
    const newId = `text-${Date.now()}`;
    const newLayer: TextLayer = {
      id: newId,
      name: isArabic ? 'Arabic Text' : 'Text Layer',
      type: 'text',
      text: presetText,
      fontFamily: isArabic ? 'Amiri, serif' : 'sans-serif',
      fontSize: isArabic ? 54 : 36,
      fontWeight: 'bold',
      color: '#ffffff',
      align: 'center',
      lineHeight: 1.4,
      letterSpacing: 0,
      x: 540,
      y: 960,
      width: 800,
      height: 100,
      rotation: 0,
      opacity: 1,
      locked: false,
      hidden: false,
      isArabic
    };
    handleSetLayers((prev) => [...prev, newLayer]);
    setSelectedLayerId(newId);
    setActiveTab('text');
  };

  const addDecorationLayer = (decoType: DecorationLayer['decoType']) => {
    const newId = `deco-${Date.now()}`;
    const newLayer: DecorationLayer = {
      id: newId,
      name: `${decoType.toUpperCase()} Ornament`,
      type: 'decoration',
      decoType,
      x: 540,
      y: decoType === 'lantern' ? 140 : 960,
      width: decoType === 'frame-gold' ? 1000 : 400,
      height: decoType === 'frame-gold' ? 1840 : 200,
      rotation: 0,
      opacity: 0.9,
      locked: false,
      hidden: false,
      color: '#fbbf24'
    };
    handleSetLayers((prev) => [...prev, newLayer]);
    setSelectedLayerId(newId);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    const img = new Image();
    img.src = url;
    img.onload = () => {
      const aspect = img.width / img.height;
      const targetW = Math.min(800, img.width);
      const targetH = Math.round(targetW / aspect);

      const newId = `img-${Date.now()}`;
      const newLayer: ImageLayer = {
        id: newId,
        name: file.name.slice(0, 15),
        type: 'image',
        src: url,
        x: 540,
        y: 960,
        width: targetW,
        height: targetH,
        rotation: 0,
        opacity: 1,
        locked: false,
        hidden: false,
        flipX: false,
        flipY: false
      };
      handleSetLayers((prev) => [...prev, newLayer]);
      setSelectedLayerId(newId);
      onShowToast('Image added to canvas!');
    };
  };

  const deleteLayer = (id: string) => {
    handleSetLayers((prev) => prev.filter((l) => l.id !== id));
    if (selectedLayerId === id) setSelectedLayerId(null);
  };

  const moveLayerOrder = (id: string, direction: 'up' | 'down') => {
    handleSetLayers((prev) => {
      const idx = prev.findIndex((l) => l.id === id);
      if (idx === -1) return prev;
      const next = [...prev];
      if (direction === 'up' && idx < next.length - 1) {
        const temp = next[idx];
        next[idx] = next[idx + 1];
        next[idx + 1] = temp;
      } else if (direction === 'down' && idx > 0) {
        const temp = next[idx];
        next[idx] = next[idx - 1];
        next[idx - 1] = temp;
      }
      return next;
    });
  };

  // Export Image (PNG / JPG)
  const handleExportImage = (format: 'png' | 'jpg') => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsExporting(true);
    setTimeout(() => {
      try {
        renderIslamicShortsCanvas({
          canvas,
          layers,
          background,
          branding,
          timeSeconds: currentTime,
          durationSeconds: videoDuration,
          animationPreset,
          selectedLayerId: null,
          showEditorControls: false
        });

        const mime = format === 'jpg' ? 'image/jpeg' : 'image/png';
        const dataUrl = canvas.toDataURL(mime, 0.95);

        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = `${projectName.toLowerCase().replace(/\s+/g, '-')}-1080x1920.${format}`;
        a.click();

        onShowToast(`High resolution 1080x1920 ${format.toUpperCase()} exported! 🎉`);
      } catch (err) {
        onShowToast('Failed to export image. Please try again.');
      } finally {
        setIsExporting(false);
      }
    }, 200);
  };

  // Export Video
  const handleExportVideo = async () => {
    setIsExporting(true);
    setExportProgress(0);
    setExportStatusText('Preparing 9:16 Video Engine...');
    exportAbortController.current = new AbortController();

    try {
      const result = await exportIslamicShortVideo({
        layers,
        background,
        branding,
        audio: audioConfig,
        durationSeconds: videoDuration,
        animationPreset,
        onProgress: (percent, status) => {
          setExportProgress(percent);
          setExportStatusText(status);
        },
        signal: exportAbortController.current.signal
      });

      const a = document.createElement('a');
      a.href = result.url;
      a.download = `${projectName.toLowerCase().replace(/\s+/g, '-')}-shorts.webm`;
      a.click();

      onShowToast('1080x1920 Islamic Short Video downloaded! 🎬');
    } catch (err: any) {
      if (err.message !== 'Video export cancelled.') {
        onShowToast(`Video Export Error: ${err.message || 'Browser limits reached. Try Image Export.'}`);
      }
    } finally {
      setIsExporting(false);
    }
  };

  const handleCancelExport = () => {
    if (exportAbortController.current) {
      exportAbortController.current.abort();
    }
  };

  // Get currently selected layer object
  const selectedLayer = layers.find((l) => l.id === selectedLayerId);

  return (
    <div className="p-3 sm:p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* HEADER BAR & MODE SWITCHER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs border border-emerald-500/20">
              🕌 9:16 Islamic Studio
            </span>
            <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold text-xs border border-indigo-500/20">
              Canva-Style Editor
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1.5 flex items-center gap-3">
            <span>Islamic Shorts Maker</span>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="text-sm font-bold px-3 py-1 rounded-xl bg-slate-200/60 dark:bg-slate-800 border-0 text-slate-700 dark:text-slate-300 w-48"
            />
          </h1>
        </div>

        {/* MODE SWITCHER PILL [ IMAGE ] [ VIDEO ] */}
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-2xl bg-slate-200 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 flex items-center gap-1 shadow-inner">
            <button
              onClick={() => setOutputMode('image')}
              className={`px-4 py-2 rounded-xl font-black text-xs transition-all flex items-center gap-2 cursor-pointer ${
                outputMode === 'image'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              <span>[ IMAGE MODE ]</span>
            </button>

            <button
              onClick={() => setOutputMode('video')}
              className={`px-4 py-2 rounded-xl font-black text-xs transition-all flex items-center gap-2 cursor-pointer ${
                outputMode === 'video'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Video className="w-4 h-4" />
              <span>[ VIDEO MODE ]</span>
            </button>
          </div>

          {/* Quick Primary Export Button */}
          {outputMode === 'image' ? (
            <button
              onClick={() => handleExportImage('png')}
              disabled={isExporting}
              className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all shadow-lg shadow-emerald-600/20 flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>Save PNG</span>
            </button>
          ) : (
            <button
              onClick={handleExportVideo}
              disabled={isExporting}
              className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-all shadow-lg shadow-indigo-600/20 flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <Video className="w-4 h-4" />
              <span>Export 9:16 Video</span>
            </button>
          )}
        </div>
      </div>

      {/* SAFETY REMINDER BANNER */}
      <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-200 text-xs flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <AlertTriangle className="w-4 h-4 shrink-0 text-amber-500" />
          <p className="font-medium">
            <strong>Religious Content Notice:</strong> Please double-check Arabic diacritics, diacritical marks, and Hadith/Quran references before publishing. Everything is processed locally inside your browser.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleUndo}
            disabled={historyIdx <= 0}
            className="p-1.5 rounded-lg bg-white/40 dark:bg-slate-900/40 hover:bg-white/80 dark:hover:bg-slate-900 font-bold text-xs flex items-center gap-1 disabled:opacity-30 cursor-pointer"
            title="Undo"
          >
            <Undo className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleRedo}
            disabled={historyIdx >= history.length - 1}
            className="p-1.5 rounded-lg bg-white/40 dark:bg-slate-900/40 hover:bg-white/80 dark:hover:bg-slate-900 font-bold text-xs flex items-center gap-1 disabled:opacity-30 cursor-pointer"
            title="Redo"
          >
            <Redo className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* EXPORT PROGRESS MODAL OVERLAY */}
      {isExporting && (
        <div className="p-6 rounded-3xl bg-slate-900/90 backdrop-blur-md border border-indigo-500/30 text-white space-y-4 shadow-2xl animate-fade-in">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-base flex items-center gap-2 text-indigo-400">
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>{exportStatusText || 'Exporting 1080×1920 Short...'}</span>
            </h3>
            <button
              onClick={handleCancelExport}
              className="px-3 py-1 rounded-xl bg-rose-600/80 hover:bg-rose-600 text-xs font-bold cursor-pointer"
            >
              Cancel
            </button>
          </div>

          <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-emerald-500 to-indigo-500 h-full transition-all duration-200"
              style={{ width: `${exportProgress}%` }}
            />
          </div>
          <div className="flex justify-between text-xs font-mono text-slate-400">
            <span>Status: Rendering 1080x1920 Canvas Frames</span>
            <span>{exportProgress}%</span>
          </div>
        </div>
      )}

      {/* MAIN STUDIO GRID: Left Control Panel (7 Cols) + Right Canvas Preview (5 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: EDITOR TABS & ACCORDION CONTROLS (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Navigation Accordion Bar */}
          <div className="flex flex-wrap gap-2 p-1.5 rounded-2xl bg-slate-200/70 dark:bg-slate-900/70 border border-slate-300/50 dark:border-slate-800 overflow-x-auto">
            {[
              { id: 'templates', label: '🎨 Templates', icon: Sparkles },
              { id: 'library', label: '📖 Duas & Quotes', icon: BookOpen },
              { id: 'text', label: '🔤 Add Text', icon: Type },
              { id: 'media', label: '🖼️ Images / PNGs', icon: ImageIcon },
              { id: 'shapes', label: '📐 Shapes', icon: Square },
              { id: 'decorations', label: '🕌 Frame & Icons', icon: Layers },
              { id: 'background', label: '🎨 Background', icon: Palette },
              { id: 'layers', label: `🗂️ Layers (${layers.length})`, icon: Sliders },
              ...(outputMode === 'video' ? [{ id: 'video', label: '🎬 Video & Audio', icon: Video }] : []),
              { id: 'branding', label: '🏷️ Watermark', icon: Shield },
              { id: 'export', label: '💾 Export', icon: Download }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* TAB 1: TEMPLATES PRESETS (15 Presets) */}
          {activeTab === 'templates' && (
            <div className="glass-card p-5 rounded-3xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-500" />
                  Islamic Design Presets (15 Templates)
                </h3>
                <span className="text-xs text-slate-400 font-medium">Click to load full layout</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {TEMPLATE_PRESETS.map((tpl) => (
                  <button
                    key={tpl.id}
                    onClick={() => applyTemplate(tpl)}
                    className="p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between h-28 relative overflow-hidden group border-slate-200 dark:border-slate-800 hover:border-indigo-500 hover:scale-[1.02]"
                    style={{
                      background: tpl.background.type === 'gradient-linear'
                        ? `linear-gradient(135deg, ${tpl.background.color1}, ${tpl.background.color2})`
                        : tpl.background.color1,
                      color: '#ffffff'
                    }}
                  >
                    <div className="space-y-1 relative z-10">
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-xs inline-block">
                        {tpl.category}
                      </span>
                      <p className="text-xs font-extrabold leading-tight line-clamp-1">{tpl.name}</p>
                    </div>

                    <p className="text-[10px] opacity-80 line-clamp-2 leading-tight relative z-10">
                      {tpl.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* TAB 1.5: ISLAMIC CONTENT LIBRARY */}
          {activeTab === 'library' && (
            <div className="glass-card p-5 rounded-3xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-amber-500" />
                  Popular Islamic Content Library (Duas, Hadith, Wazifa)
                </h3>
                <span className="text-xs text-slate-400 font-medium">Click to load into Canvas</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {ISLAMIC_CONTENT_PRESETS.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => applyContentItem(item)}
                    className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-left transition-all hover:border-amber-500 cursor-pointer space-y-2 group hover:shadow-lg"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400">
                        {item.category}
                      </span>
                      {item.reference && (
                        <span className="text-[9px] text-slate-400 font-mono">{item.reference}</span>
                      )}
                    </div>

                    <div>
                      <h4 className="text-xs font-black text-slate-900 dark:text-white group-hover:text-amber-500 transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-[11px] font-serif text-emerald-600 dark:text-emerald-400 font-bold mt-1 line-clamp-1">
                        {item.arabic}
                      </p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                        {item.romanUrdu}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: TEXT LAYERS & ARABIC TYPOGRAPHY */}
          {activeTab === 'text' && (
            <div className="glass-card p-5 rounded-3xl space-y-4">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Type className="w-4 h-4 text-indigo-500" />
                Text Layers & Arabic Diacritics
              </h3>

              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  onClick={() => addTextLayer('99 मर्तबा पढ़ें', false)}
                  className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md shadow-indigo-600/20"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Add Heading Text</span>
                </button>

                <button
                  onClick={() => addTextLayer('سُبْحَانَ اللَّهِ وَبِحَمْدِهِ', true)}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md shadow-emerald-600/20 font-serif"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ إضافة نص عربي (Arabic)</span>
                </button>
              </div>

              {/* Selected Text Layer Controls */}
              {selectedLayer && selectedLayer.type === 'text' ? (
                <div className="p-4 rounded-2xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-3 text-xs">
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                    <span className="font-extrabold text-indigo-600 dark:text-indigo-400">Editing Layer: {selectedLayer.name}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={duplicateSelectedLayer}
                        className="text-indigo-500 font-bold hover:underline cursor-pointer flex items-center gap-1"
                      >
                        <Copy className="w-3.5 h-3.5" /> Duplicate
                      </button>
                      <button
                        onClick={() => deleteLayer(selectedLayer.id)}
                        className="text-rose-500 font-bold hover:underline cursor-pointer flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                    </div>
                  </div>

                  {/* Quick Canvas Alignment Bar */}
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-200/60 dark:bg-slate-800/60">
                    <span className="font-bold text-[10px] text-slate-500">Center:</span>
                    <button
                      onClick={centerSelectedLayerHorizontally}
                      className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-[10px] cursor-pointer hover:bg-indigo-600 hover:text-white transition-all"
                    >
                      ↔️ Horizontally (X:540)
                    </button>
                    <button
                      onClick={centerSelectedLayerVertically}
                      className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-[10px] cursor-pointer hover:bg-indigo-600 hover:text-white transition-all"
                    >
                      ↕️ Vertically (Y:960)
                    </button>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Text Content</label>
                    <textarea
                      rows={2}
                      value={selectedLayer.text}
                      onChange={(e) => updateSelectedLayer({ text: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold"
                    />
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Font Family</label>
                      <select
                        value={selectedLayer.fontFamily}
                        onChange={(e) => updateSelectedLayer({ fontFamily: e.target.value })}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
                      >
                        <option value="Amiri, serif">Amiri (Arabic Traditional)</option>
                        <option value="Scheherazade New, serif">Scheherazade (Naskh)</option>
                        <option value="sans-serif">Clean Sans-Serif</option>
                        <option value="Cinzel, serif">Cinzel (Royal Header)</option>
                        <option value="Playfair Display, serif">Playfair (Serif)</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Font Size ({selectedLayer.fontSize}px)</label>
                      <input
                        type="range"
                        min={18}
                        max={100}
                        value={selectedLayer.fontSize}
                        onChange={(e) => updateSelectedLayer({ fontSize: Number(e.target.value) })}
                        className="w-full accent-indigo-600"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Text Color</label>
                      <input
                        type="color"
                        value={selectedLayer.color}
                        onChange={(e) => updateSelectedLayer({ color: e.target.value })}
                        className="w-full h-8 rounded-lg cursor-pointer border-0"
                      />
                    </div>
                  </div>

                  {/* Alignment & Box Background */}
                  <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200 dark:border-slate-800">
                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Background Pill Color</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={selectedLayer.backgroundColor || '#000000'}
                          onChange={(e) => updateSelectedLayer({ backgroundColor: e.target.value })}
                          className="w-8 h-8 rounded-lg cursor-pointer border-0"
                        />
                        <button
                          onClick={() => updateSelectedLayer({ backgroundColor: undefined })}
                          className="text-[10px] text-slate-400 hover:underline cursor-pointer"
                        >
                          Clear Box
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Text Align</label>
                      <div className="flex gap-1">
                        {(['left', 'center', 'right'] as const).map((align) => (
                          <button
                            key={align}
                            onClick={() => updateSelectedLayer({ align })}
                            className={`p-1.5 rounded-lg border capitalize cursor-pointer ${
                              selectedLayer.align === align ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-slate-800'
                            }`}
                          >
                            {align === 'left' && <AlignLeft className="w-4 h-4" />}
                            {align === 'center' && <AlignCenter className="w-4 h-4" />}
                            {align === 'right' && <AlignRight className="w-4 h-4" />}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-slate-100/50 dark:bg-slate-900/50 text-slate-400 text-xs text-center">
                  Select a text layer on the canvas to edit typography properties.
                </div>
              )}
            </div>
          )}

          {/* TAB 3: MEDIA & CUSTOM PNG UPLOADER */}
          {activeTab === 'media' && (
            <div className="glass-card p-5 rounded-3xl space-y-4">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-indigo-500" />
                Upload Transparent Arabic Calligraphy & Custom PNGs
              </h3>

              <div className="p-4 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-800 flex flex-col items-center justify-center text-center space-y-2">
                <ImageIcon className="w-8 h-8 text-indigo-500" />
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Drag & Drop transparent PNGs, Hadith calligraphy, or Channel Logos
                </p>
                <label className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs cursor-pointer shadow-md shadow-indigo-600/20">
                  <span>Browse Image / PNG</span>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              </div>
            </div>
          )}

          {/* TAB 4: SHAPES & LINES */}
          {activeTab === 'shapes' && (
            <div className="glass-card p-5 rounded-3xl space-y-4">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Square className="w-4 h-4 text-indigo-500" />
                Vector Shapes & Dividers
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <button
                  onClick={() => {
                    const newId = `shape-${Date.now()}`;
                    const newLayer: ShapeLayer = {
                      id: newId,
                      name: 'Rounded Box',
                      type: 'shape',
                      shapeType: 'rounded-rect',
                      fillColor: 'rgba(0,0,0,0.4)',
                      strokeColor: '#fbbf24',
                      strokeWidth: 2,
                      cornerRadius: 24,
                      x: 540,
                      y: 960,
                      width: 800,
                      height: 200,
                      rotation: 0,
                      opacity: 1,
                      locked: false,
                      hidden: false
                    };
                    handleSetLayers((prev) => [...prev, newLayer]);
                    setSelectedLayerId(newId);
                  }}
                  className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold flex flex-col items-center gap-1 cursor-pointer hover:border-indigo-500"
                >
                  <Square className="w-5 h-5 text-indigo-500" />
                  <span>Rounded Box</span>
                </button>

                <button
                  onClick={() => {
                    const newId = `shape-${Date.now()}`;
                    const newLayer: ShapeLayer = {
                      id: newId,
                      name: 'Circle Badge',
                      type: 'shape',
                      shapeType: 'circle',
                      fillColor: '#fbbf24',
                      strokeColor: '#ffffff',
                      strokeWidth: 2,
                      x: 540,
                      y: 960,
                      width: 140,
                      height: 140,
                      rotation: 0,
                      opacity: 1,
                      locked: false,
                      hidden: false
                    };
                    handleSetLayers((prev) => [...prev, newLayer]);
                    setSelectedLayerId(newId);
                  }}
                  className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold flex flex-col items-center gap-1 cursor-pointer hover:border-indigo-500"
                >
                  <Circle className="w-5 h-5 text-indigo-500" />
                  <span>Circle Pill</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 5: ISLAMIC DECORATIONS & FRAMES */}
          {activeTab === 'decorations' && (
            <div className="glass-card p-5 rounded-3xl space-y-4">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-500" />
                Islamic Vector Decorations & Ornaments
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                {[
                  { type: 'frame-gold', label: ' Double Gold Frame' },
                  { type: 'frame-arch', label: ' Mosque Mihrab Arch' },
                  { type: 'bismillah', label: ' Bismillah Calligraphy' },
                  { type: 'tasbih', label: ' Prayer Beads Ring' },
                  { type: 'lantern', label: ' Hanging Lanterns' },
                  { type: 'crescent', label: ' Crescent Moon' },
                  { type: 'mosque', label: ' Mosque Silhouette' },
                  { type: 'quran', label: ' Holy Quran Icon' },
                  { type: 'divider-gold', label: ' Gold Line Divider' },
                  { type: 'stars', label: ' Night Stars' }
                ].map((item) => (
                  <button
                    key={item.type}
                    onClick={() => addDecorationLayer(item.type as any)}
                    className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold hover:border-indigo-500 cursor-pointer text-left transition-all"
                  >
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: BACKGROUND CONFIG */}
          {activeTab === 'background' && (
            <div className="glass-card p-5 rounded-3xl space-y-4">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Palette className="w-4 h-4 text-indigo-500" />
                Canvas Background Styling
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Background Fill Type</label>
                  <select
                    value={background.type}
                    onChange={(e) => setBackground((b) => ({ ...b, type: e.target.value as any }))}
                    className="w-full px-3 py-2 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-bold"
                  >
                    <option value="solid">Solid Single Color</option>
                    <option value="gradient-linear">Linear Gradient</option>
                    <option value="gradient-radial">Radial Gradient Spotlight</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Color 1 (Primary)</label>
                    <input
                      type="color"
                      value={background.color1}
                      onChange={(e) => setBackground((b) => ({ ...b, color1: e.target.value }))}
                      className="w-full h-8 rounded-lg cursor-pointer border-0"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Color 2 (Secondary)</label>
                    <input
                      type="color"
                      value={background.color2}
                      onChange={(e) => setBackground((b) => ({ ...b, color2: e.target.value }))}
                      className="w-full h-8 rounded-lg cursor-pointer border-0"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: LAYERS MANAGER */}
          {activeTab === 'layers' && (
            <div className="glass-card p-5 rounded-3xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-indigo-500" />
                  Layer Manager & Ordering ({layers.length})
                </h3>
              </div>

              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {[...layers].reverse().map((layer) => (
                  <div
                    key={layer.id}
                    onClick={() => setSelectedLayerId(layer.id)}
                    className={`p-2.5 rounded-xl border flex items-center justify-between text-xs cursor-pointer transition-all ${
                      selectedLayerId === layer.id
                        ? 'bg-indigo-600/10 border-indigo-600 text-indigo-600 dark:text-indigo-400 font-bold'
                        : 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <span className="truncate max-w-[180px]">{layer.name}</span>

                    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => moveLayerOrder(layer.id, 'up')}
                        className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => moveLayerOrder(layer.id, 'down')}
                        className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() =>
                          updateSelectedLayer({ hidden: !layer.hidden })
                        }
                        className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded"
                      >
                        {layer.hidden ? <EyeOff className="w-3.5 h-3.5 text-rose-500" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>

                      <button
                        onClick={() => deleteLayer(layer.id)}
                        className="p-1 hover:bg-rose-500/20 text-rose-500 rounded"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 8: VIDEO & ANIMATION (Only shown in VIDEO MODE) */}
          {outputMode === 'video' && activeTab === 'video' && (
            <div className="glass-card p-5 rounded-3xl space-y-4">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Video className="w-4 h-4 text-indigo-500" />
                Short Video Animation & Audio Settings
              </h3>

              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Duration (Seconds)</label>
                    <div className="flex gap-2">
                      {[5, 10, 15].map((sec) => (
                        <button
                          key={sec}
                          onClick={() => setVideoDuration(sec)}
                          className={`px-3 py-1.5 rounded-lg font-bold cursor-pointer ${
                            videoDuration === sec ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-800'
                          }`}
                        >
                          {sec}s
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Global Animation Preset</label>
                    <select
                      value={animationPreset}
                      onChange={(e) => setAnimationPreset(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-bold"
                    >
                      <option value="static">Static (No Camera Motion)</option>
                      <option value="zoom-in">Slow Zoom In (Subtle)</option>
                      <option value="zoom-out">Slow Zoom Out</option>
                      <option value="pan">Gentle Pan Vertical</option>
                      <option value="fade-in">Soft Fade In</option>
                      <option value="particles">Floating Gold Particles</option>
                    </select>
                  </div>
                </div>

                {/* Audio Upload */}
                <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
                  <label className="font-bold text-slate-700 dark:text-slate-300 block">Upload Background Audio (MP3 / WAV)</label>
                  <label className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-slate-900 dark:text-white font-bold cursor-pointer inline-flex items-center gap-2">
                    <Music className="w-4 h-4 text-indigo-500" />
                    <span>Choose Audio File</span>
                    <input
                      type="file"
                      accept="audio/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const url = URL.createObjectURL(file);
                          setAudioConfig((a) => ({ ...a, src: url, name: file.name }));
                          onShowToast('Audio track attached!');
                        }
                      }}
                      className="hidden"
                    />
                  </label>
                  {audioConfig.name && (
                    <p className="text-[11px] text-emerald-600 font-bold">Attached: {audioConfig.name}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 9: WATERMARK & BRANDING */}
          {activeTab === 'branding' && (
            <div className="glass-card p-5 rounded-3xl space-y-4">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Shield className="w-4 h-4 text-indigo-500" />
                Channel Watermark & CTA Button
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Channel Handle Watermark</label>
                  <input
                    type="text"
                    value={branding.channelName}
                    onChange={(e) => setBranding((b) => ({ ...b, channelName: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-bold"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 10: EXPORT */}
          {activeTab === 'export' && (
            <div className="glass-card p-5 rounded-3xl space-y-4">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Download className="w-4 h-4 text-emerald-500" />
                Export 1080×1920 Poster Image or Video
              </h3>

              <div className="space-y-3 text-xs">
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-200 space-y-1">
                  <p className="font-bold flex items-center gap-1 text-sm">
                    <Check className="w-4 h-4 text-emerald-600" /> Clean High-Res 1080×1920 Export
                  </p>
                  <p className="opacity-90">
                    The exported file contains strictly your completed design without editor handles, selection boxes, or Zubware watermarks.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => handleExportImage('png')}
                    disabled={isExporting}
                    className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm flex items-center justify-center gap-2 cursor-pointer transition-all"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download PNG</span>
                  </button>

                  <button
                    onClick={handleExportVideo}
                    disabled={isExporting}
                    className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm flex items-center justify-center gap-2 cursor-pointer transition-all"
                  >
                    <Video className="w-4 h-4" />
                    <span>Export 9:16 Video</span>
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: LIVE 9:16 CANVAS PREVIEW STAGE (5 Cols) */}
        <div className="lg:col-span-5 space-y-4 sticky top-20">
          
          <div className="glass-card p-5 rounded-3xl flex flex-col items-center justify-center relative overflow-hidden">
            
            {/* Header Toolbar above canvas */}
            <div className="w-full flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-3 mb-3">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                Live 9:16 VN Studio Preview (1080×1920)
              </span>

              {/* Zoom Controls */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setZoomLevel((z) => Math.max(0.2, z - 0.05))}
                  className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 cursor-pointer"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-[10px] font-mono font-bold w-10 text-center">{Math.round(zoomLevel * 100)}%</span>
                <button
                  onClick={() => setZoomLevel((z) => Math.min(0.7, z + 0.05))}
                  className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 cursor-pointer"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Floating VN Overlay Quick Action Strip when layer selected */}
            {selectedLayerId && (
              <div className="w-full flex items-center justify-center gap-1.5 p-2 mb-3 rounded-2xl bg-slate-900/90 text-white border border-slate-800 shadow-xl overflow-x-auto text-[11px] font-bold">
                <button
                  onClick={handleSplitLayerAtPlayhead}
                  className="px-2.5 py-1 rounded-xl bg-indigo-600 hover:bg-indigo-500 flex items-center gap-1 cursor-pointer transition-all"
                >
                  <Scissors className="w-3.5 h-3.5" />
                  <span>Split</span>
                </button>
                <button
                  onClick={duplicateSelectedLayer}
                  className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 flex items-center gap-1 cursor-pointer transition-all"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Duplicate</span>
                </button>
                <button
                  onClick={centerSelectedLayerHorizontally}
                  className="px-2 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 cursor-pointer transition-all"
                >
                  Center X
                </button>
                <button
                  onClick={centerSelectedLayerVertically}
                  className="px-2 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 cursor-pointer transition-all"
                >
                  Center Y
                </button>
                <button
                  onClick={handleToggleLockSelectedLayer}
                  className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 cursor-pointer"
                  title="Lock Layer"
                >
                  <Lock className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => deleteLayer(selectedLayerId)}
                  className="p-1.5 rounded-xl bg-rose-500/20 text-rose-400 hover:bg-rose-500/40 cursor-pointer"
                  title="Delete Layer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Video Playback Bar if in Video Mode */}
            {outputMode === 'video' && (
              <div className="w-full flex items-center justify-between p-2 mb-3 rounded-xl bg-slate-900 text-white text-xs">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold cursor-pointer"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>

                <div className="flex-1 mx-3 flex items-center gap-2">
                  <span className="font-mono text-[10px]">{currentTime.toFixed(1)}s</span>
                  <input
                    type="range"
                    min={0}
                    max={videoDuration}
                    step={0.1}
                    value={currentTime}
                    onChange={(e) => setCurrentTime(Number(e.target.value))}
                    className="w-full accent-amber-500"
                  />
                  <span className="font-mono text-[10px]">{videoDuration}s</span>
                </div>

                <button
                  onClick={() => setCurrentTime(0)}
                  className="p-1 text-slate-400 hover:text-white cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Canvas Container */}
            <div
              className="relative shadow-2xl rounded-2xl overflow-hidden border-2 border-slate-300 dark:border-slate-700 transition-all cursor-move select-none"
              style={{
                width: `${1080 * zoomLevel}px`,
                height: `${1920 * zoomLevel}px`
              }}
            >
              <canvas
                ref={canvasRef}
                onMouseDown={handleCanvasMouseDown}
                onMouseMove={handleCanvasMouseMove}
                onMouseUp={handleCanvasMouseUp}
                className="w-full h-full object-contain"
                style={{
                  width: '100%',
                  height: '100%'
                }}
              />
            </div>

            <p className="text-[10px] text-slate-400 mt-3">
              Click & drag elements to position freely on canvas
            </p>
          </div>

        </div>

      </div>

      {/* VN MULTI-TRACK TIMELINE AT BOTTOM */}
      <div className="mt-6">
        <VnTimeline
          layers={layers}
          selectedLayerId={selectedLayerId}
          onSelectLayer={setSelectedLayerId}
          currentTime={currentTime}
          durationSeconds={videoDuration}
          onSeek={(time) => setCurrentTime(time)}
          isPlaying={isPlaying}
          onTogglePlay={() => setIsPlaying(!isPlaying)}
          playbackSpeed={playbackSpeed}
          onChangeSpeed={setPlaybackSpeed}
          audioConfig={audioConfig}
          onToggleMuteAudio={handleToggleMuteAudio}
          onSplitLayerAtPlayhead={handleSplitLayerAtPlayhead}
          onDuplicateSelectedLayer={duplicateSelectedLayer}
          onDeleteSelectedLayer={() => selectedLayerId && deleteLayer(selectedLayerId)}
          onToggleLockSelectedLayer={handleToggleLockSelectedLayer}
          onToggleHideSelectedLayer={handleToggleHideSelectedLayer}
        />
      </div>

      {/* FREQUENTLY ASKED QUESTIONS */}
      <section className="glass-panel p-6 rounded-3xl space-y-4">
        <h3 className="text-lg font-black text-slate-900 dark:text-white">
          Islamic Shorts & Reels Maker — FAQs
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="glass-card p-4 rounded-2xl space-y-1">
            <h4 className="font-bold text-indigo-600 dark:text-indigo-400">How do I create an Islamic Short in 5 seconds?</h4>
            <p className="text-slate-600 dark:text-slate-400">
              Select a template or compose your text with Arabic diacritics, click "Save PNG" or "Export 9:16 Video", then import into CapCut or YouTube Shorts editor.
            </p>
          </div>

          <div className="glass-card p-4 rounded-2xl space-y-1">
            <h4 className="font-bold text-indigo-600 dark:text-indigo-400">Are my files or text saved on a server?</h4>
            <p className="text-slate-600 dark:text-slate-400">
              No! Everything runs 100% locally inside your browser memory using Web APIs and HTML5 Canvas with zero cloud uploads.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
};
