import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Download,
  Upload,
  Sparkles,
  Volume2,
  VolumeX,
  Settings,
  Layers,
  CheckCircle2,
  XCircle,
  Video,
  Image as ImageIcon,
  Music,
  Maximize2,
  Minimize2,
  Save,
  FolderOpen,
  Trash2,
  HelpCircle,
  AlertTriangle,
  Eye,
  EyeOff,
  Shuffle,
  Clock,
  Palette,
  Film,
  Check,
  X,
  Plus,
  ChevronDown,
  ChevronUp,
  FileVideo,
  Move,
  Copy,
  Lock,
  Unlock,
  ArrowUp,
  ArrowDown,
  ZoomIn,
  ZoomOut,
  Sliders,
  Type
} from 'lucide-react';
import { AdSlot } from '../../AdSlot';
import { getLinkUrl } from '../../../lib/paths';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface PuzzleObject {
  id: string;
  name: string;
  baseImage: string; // Base / left portion
  matchingPartImage: string; // Matching / right portion
  // Position on 9:16 Canvas (Normalized percentages 0-100)
  baseX: number; // e.g. 10 (%)
  baseY: number; // e.g. 15 (%)
  baseWidth: number; // e.g. 40 (%)
  baseHeight: number; // e.g. 16 (%)
  rotation: number; // degrees
  opacity: number; // 0 to 1
  visible: boolean;
  locked: boolean;
  // Matching Part Position relative to scene
  targetX: number; // Target X (%) where matching part snaps
  targetY: number; // Target Y (%) where matching part snaps
  targetWidth: number; // Target Width (%)
  targetHeight: number; // Target Height (%)
  startX: number; // Start X (%) offscreen right (e.g. 115%)
  startY: number; // Start Y (%)
}

export interface VideoSettings {
  aspectRatio: '9:16' | '1:1' | '16:9';
  resolutionWidth: number; // 1080
  resolutionHeight: number; // 1920
  fps: 24 | 30 | 60;
  speedPreset: 'slow' | 'normal' | 'fast' | 'very-fast';
  wrongAttemptsPerPart: number; // 0, 1, 2, 3
  randomizeMatching: boolean;
  movementEasing: 'ease-out' | 'bounce' | 'spring' | 'linear';
  // Background configuration
  backgroundType: 'grass' | 'road' | 'garage' | 'city' | 'forest' | 'desert' | 'color' | 'gradient' | 'image';
  bgFit: 'cover' | 'contain' | 'fill';
  customBgColor: string;
  customBgGradient1: string;
  customBgGradient2: string;
  customBgImage: string | null;
  bgBlur: number;
  bgBrightness: number;
  // Visual Feedback & Overlay
  showMarks: boolean;
  markSize: number;
  // Audio
  soundEnabled: boolean;
  masterVolume: number;
  wrongVolume: number;
  successVolume: number;
  // Text & Branding
  showTitleText: boolean;
  titleText: string;
  roundText: string;
  successText: string;
  textColor: string;
  fontFamily: string;
  watermarkText: string;
  watermarkPos: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  // Animation Timings (sec)
  pauses: {
    initial: number;
    afterWrong: number;
    beforeRetry: number;
    afterCorrect: number;
    final: number;
  };
}

// ============================================================================
// DEFAULT VECTOR ASSETS FOR DEMO PROJECT (High Resolution SVG Strings)
// ============================================================================

const createDefaultSvg = (
  type: 'red_car_left' | 'red_car_right' |
        'blue_truck_left' | 'blue_truck_right' |
        'yellow_excavator_left' | 'yellow_excavator_right' |
        'green_heli_left' | 'green_heli_right'
): string => {
  let svg = '';
  if (type === 'red_car_left') {
    svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200" width="320" height="200">
      <defs>
        <linearGradient id="rc_body" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#b91c1c"/>
          <stop offset="100%" stop-color="#ef4444"/>
        </linearGradient>
      </defs>
      <path d="M 20 130 C 20 85, 75 75, 120 45 L 200 45 L 210 130 Z" fill="url(#rc_body)" stroke="#7f1d1d" stroke-width="5"/>
      <circle cx="75" cy="140" r="32" fill="#0f172a" stroke="#475569" stroke-width="7"/>
      <circle cx="75" cy="140" r="14" fill="#cbd5e1"/>
      <path d="M 95 80 L 130 55 L 190 55 L 195 80 Z" fill="#38bdf8" opacity="0.85" stroke="#0284c7" stroke-width="3"/>
      <rect x="20" y="100" width="180" height="14" fill="#facc15" rx="3"/>
      <text x="35" y="111" font-family="sans-serif" font-weight="900" font-size="11" fill="#000">SUPER GT</text>
    </svg>`;
  } else if (type === 'red_car_right') {
    svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200" width="320" height="200">
      <defs>
        <linearGradient id="rc_front" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#ef4444"/>
          <stop offset="100%" stop-color="#f87171"/>
        </linearGradient>
      </defs>
      <path d="M 10 45 L 120 78 C 150 85, 185 110, 185 130 L 10 130 Z" fill="url(#rc_front)" stroke="#7f1d1d" stroke-width="5"/>
      <circle cx="115" cy="140" r="32" fill="#0f172a" stroke="#475569" stroke-width="7"/>
      <circle cx="115" cy="140" r="14" fill="#cbd5e1"/>
      <path d="M 160 98 L 180 102 L 175 118 L 155 114 Z" fill="#fef08a" stroke="#ca8a04" stroke-width="2"/>
      <rect x="10" y="100" width="145" height="14" fill="#facc15" rx="3"/>
    </svg>`;
  } else if (type === 'blue_truck_left') {
    svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200" width="320" height="200">
      <rect x="20" y="45" width="180" height="85" rx="12" fill="#1d4ed8" stroke="#1e3a8a" stroke-width="5"/>
      <rect x="35" y="55" width="150" height="42" fill="#172554" rx="6"/>
      <circle cx="85" cy="140" r="42" fill="#020617" stroke="#334155" stroke-width="8"/>
      <circle cx="85" cy="140" r="18" fill="#3b82f6"/>
      <rect x="45" y="10" width="16" height="50" fill="#94a3b8" rx="3"/>
    </svg>`;
  } else if (type === 'blue_truck_right') {
    svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200" width="320" height="200">
      <path d="M 10 45 L 110 45 L 165 90 L 165 130 L 10 130 Z" fill="#2563eb" stroke="#1e3a8a" stroke-width="5"/>
      <polygon points="45,55 100,55 135,90 45,90" fill="#60a5fa" stroke="#1d4ed8" stroke-width="3"/>
      <circle cx="110" cy="140" r="42" fill="#020617" stroke="#334155" stroke-width="8"/>
      <circle cx="110" cy="140" r="18" fill="#60a5fa"/>
      <rect x="155" y="95" width="18" height="32" fill="#e2e8f0"/>
    </svg>`;
  } else if (type === 'yellow_excavator_left') {
    svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200" width="320" height="200">
      <rect x="20" y="120" width="180" height="38" rx="18" fill="#334155" stroke="#0f172a" stroke-width="5"/>
      <circle cx="55" cy="139" r="12" fill="#64748b"/>
      <circle cx="110" cy="139" r="12" fill="#64748b"/>
      <circle cx="165" cy="139" r="12" fill="#64748b"/>
      <rect x="45" y="55" width="125" height="65" rx="10" fill="#ca8a04" stroke="#854d0e" stroke-width="5"/>
      <rect x="90" y="65" width="68" height="38" fill="#38bdf8" rx="5"/>
    </svg>`;
  } else if (type === 'yellow_excavator_right') {
    svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200" width="320" height="200">
      <path d="M 10 100 L 75 25 L 150 80 L 175 125 L 130 135 Z" fill="#eab308" stroke="#a16207" stroke-width="6"/>
      <path d="M 130 135 L 180 128 L 190 150 L 150 155 Z" fill="#475569" stroke="#1e293b" stroke-width="4"/>
      <line x1="35" y1="80" x2="90" y2="48" stroke="#94a3b8" stroke-width="9"/>
    </svg>`;
  } else if (type === 'green_heli_left') {
    svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200" width="320" height="200">
      <path d="M 20 90 L 175 80 L 175 125 L 20 100 Z" fill="#15803d" stroke="#14532d" stroke-width="5"/>
      <circle cx="28" cy="95" r="20" fill="none" stroke="#4ade80" stroke-width="4" stroke-dasharray="5,5"/>
      <rect x="22" y="78" width="12" height="34" fill="#052e16"/>
    </svg>`;
  } else if (type === 'green_heli_right') {
    svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200" width="320" height="200">
      <path d="M 10 80 C 10 38, 130 38, 165 90 C 165 135, 90 135, 10 125 Z" fill="#16a34a" stroke="#14532d" stroke-width="5"/>
      <path d="M 75 48 C 110 48, 140 58, 152 85 Z" fill="#86efac" opacity="0.85"/>
      <rect x="10" y="22" width="165" height="9" fill="#334155" rx="4"/>
      <rect x="85" y="31" width="14" height="22" fill="#0f172a"/>
      <line x1="30" y1="152" x2="150" y2="152" stroke="#334155" stroke-width="7"/>
      <line x1="55" y1="125" x2="55" y2="152" stroke="#334155" stroke-width="5"/>
      <line x1="130" y1="125" x2="130" y2="152" stroke="#334155" stroke-width="5"/>
    </svg>`;
  }

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

// Initial 4 high-quality demo objects laid out vertically on scene
const INITIAL_DEMO_OBJECTS: PuzzleObject[] = [
  {
    id: 'obj-1',
    name: 'Red Sports Car',
    baseImage: createDefaultSvg('red_car_left'),
    matchingPartImage: createDefaultSvg('red_car_right'),
    baseX: 8,
    baseY: 15,
    baseWidth: 42,
    baseHeight: 16,
    rotation: 0,
    opacity: 1,
    visible: true,
    locked: false,
    targetX: 50,
    targetY: 15,
    targetWidth: 42,
    targetHeight: 16,
    startX: 115,
    startY: 15
  },
  {
    id: 'obj-2',
    name: 'Blue Monster Truck',
    baseImage: createDefaultSvg('blue_truck_left'),
    matchingPartImage: createDefaultSvg('blue_truck_right'),
    baseX: 8,
    baseY: 34,
    baseWidth: 42,
    baseHeight: 16,
    rotation: 0,
    opacity: 1,
    visible: true,
    locked: false,
    targetX: 50,
    targetY: 34,
    targetWidth: 42,
    targetHeight: 16,
    startX: 115,
    startY: 34
  },
  {
    id: 'obj-3',
    name: 'Yellow Excavator',
    baseImage: createDefaultSvg('yellow_excavator_left'),
    matchingPartImage: createDefaultSvg('yellow_excavator_right'),
    baseX: 8,
    baseY: 53,
    baseWidth: 42,
    baseHeight: 16,
    rotation: 0,
    opacity: 1,
    visible: true,
    locked: false,
    targetX: 50,
    targetY: 53,
    targetWidth: 42,
    targetHeight: 16,
    startX: 115,
    startY: 53
  },
  {
    id: 'obj-4',
    name: 'Green Helicopter',
    baseImage: createDefaultSvg('green_heli_left'),
    matchingPartImage: createDefaultSvg('green_heli_right'),
    baseX: 8,
    baseY: 72,
    baseWidth: 42,
    baseHeight: 16,
    rotation: 0,
    opacity: 1,
    visible: true,
    locked: false,
    targetX: 50,
    targetY: 72,
    targetWidth: 42,
    targetHeight: 16,
    startX: 115,
    startY: 72
  }
];

const DEFAULT_SETTINGS: VideoSettings = {
  aspectRatio: '9:16',
  resolutionWidth: 1080,
  resolutionHeight: 1920,
  fps: 30,
  speedPreset: 'normal',
  wrongAttemptsPerPart: 1,
  randomizeMatching: true,
  movementEasing: 'ease-out',
  backgroundType: 'grass',
  bgFit: 'cover',
  customBgColor: '#15803d',
  customBgGradient1: '#166534',
  customBgGradient2: '#15803d',
  customBgImage: null,
  bgBlur: 0,
  bgBrightness: 100,
  showMarks: true,
  markSize: 85,
  soundEnabled: true,
  masterVolume: 80,
  wrongVolume: 100,
  successVolume: 100,
  showTitleText: true,
  titleText: 'Which Part Matches?',
  roundText: 'PUZZLE CHALLENGE',
  successText: 'PERFECT MATCH!',
  textColor: '#facc15',
  fontFamily: 'sans-serif',
  watermarkText: '@ZubwarePuzzle',
  watermarkPos: 'top-right',
  pauses: {
    initial: 1.0,
    afterWrong: 0.6,
    beforeRetry: 0.4,
    afterCorrect: 0.8,
    final: 2.0
  }
};

// ============================================================================
// AUDIO SYNTHESIZER ENGINE (Web Audio API)
// ============================================================================

class SoundEngine {
  private ctx: AudioContext | null = null;
  public destinationStreamNode: MediaStreamAudioDestinationNode | null = null;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    if (!this.destinationStreamNode && this.ctx) {
      this.destinationStreamNode = this.ctx.createMediaStreamDestination();
    }
  }

  public playWrongBuzz(volumePct = 100) {
    try {
      this.initCtx();
      if (!this.ctx) return;

      const masterVol = (volumePct / 100) * 0.35;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(170, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(75, this.ctx.currentTime + 0.35);

      gain.gain.setValueAtTime(masterVol, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      if (this.destinationStreamNode) {
        gain.connect(this.destinationStreamNode);
      }

      osc.start();
      osc.stop(this.ctx.currentTime + 0.35);
    } catch {
      // Audio fallback
    }
  }

  public playSuccessChime(volumePct = 100) {
    try {
      this.initCtx();
      if (!this.ctx) return;

      const masterVol = (volumePct / 100) * 0.3;
      const notes = [523.25, 659.25, 783.99, 1046.50];
      const now = this.ctx.currentTime;

      notes.forEach((freq, i) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * 0.07);

        gain.gain.setValueAtTime(0.001, now + i * 0.07);
        gain.gain.linearRampToValueAtTime(masterVol, now + i * 0.07 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.07 + 0.3);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        if (this.destinationStreamNode) {
          gain.connect(this.destinationStreamNode);
        }

        osc.start(now + i * 0.07);
        osc.stop(now + i * 0.07 + 0.3);
      });
    } catch {
      // Audio fallback
    }
  }

  public playWhoosh(volumePct = 80) {
    try {
      this.initCtx();
      if (!this.ctx) return;

      const masterVol = (volumePct / 100) * 0.18;
      const bufferSize = this.ctx.sampleRate * 0.25;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(350, this.ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(1300, this.ctx.currentTime + 0.25);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.01, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(masterVol, this.ctx.currentTime + 0.12);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      if (this.destinationStreamNode) {
        gain.connect(this.destinationStreamNode);
      }

      whiteNoise.start();
    } catch {
      // Audio fallback
    }
  }

  public playSnap(volumePct = 90) {
    try {
      this.initCtx();
      if (!this.ctx) return;

      const masterVol = (volumePct / 100) * 0.35;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(850, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(160, this.ctx.currentTime + 0.06);

      gain.gain.setValueAtTime(masterVol, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.06);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      if (this.destinationStreamNode) {
        gain.connect(this.destinationStreamNode);
      }

      osc.start();
      osc.stop(this.ctx.currentTime + 0.06);
    } catch {
      // Audio fallback
    }
  }

  public playCompletionFanfare(volumePct = 100) {
    try {
      this.initCtx();
      if (!this.ctx) return;

      const masterVol = (volumePct / 100) * 0.35;
      const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
      const now = this.ctx.currentTime;

      notes.forEach((freq, i) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * 0.1);

        gain.gain.setValueAtTime(0.001, now + i * 0.1);
        gain.gain.linearRampToValueAtTime(masterVol, now + i * 0.1 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.5);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        if (this.destinationStreamNode) {
          gain.connect(this.destinationStreamNode);
        }

        osc.start(now + i * 0.1);
        osc.stop(now + i * 0.1 + 0.5);
      });
    } catch {
      // Audio fallback
    }
  }
}

const soundEngine = new SoundEngine();

// ============================================================================
// MAIN COMPONENT: MatchingPartsPuzzleVideoMakerTool
// ============================================================================

export function MatchingPartsPuzzleVideoMakerTool({
  onShowToast,
  onNavigate
}: {
  onShowToast: (msg: string) => void;
  onNavigate?: (path: string) => void;
}) {
  // --------------------------------------------------------------------------
  // STATE MANAGEMENT
  // --------------------------------------------------------------------------

  const [settings, setSettings] = useState<VideoSettings>(DEFAULT_SETTINGS);
  const [objects, setObjects] = useState<PuzzleObject[]>(INITIAL_DEMO_OBJECTS);
  const [selectedObjectId, setSelectedObjectId] = useState<string | null>('obj-1');
  const [activeTab, setActiveTab] = useState<'scene' | 'background' | 'layers' | 'animation' | 'audio' | 'text'>('scene');

  // Interactive Dragging on Canvas State
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragMode, setDragMode] = useState<'base' | 'target' | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Player & Timeline State
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [totalDuration, setTotalDuration] = useState<number>(20);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Video Export Modal State
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportProgress, setExportProgress] = useState<number>(0);
  const [exportStepText, setExportStepText] = useState<string>('Preparing rendering pipeline...');
  const [exportedVideoUrl, setExportedVideoUrl] = useState<string | null>(null);

  // DOM Refs
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const previewContainerRef = useRef<HTMLDivElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const lastUiUpdateRef = useRef<number>(0);
  const loadedImagesRef = useRef<Map<string, HTMLImageElement>>(new Map());
  const audioEventTrackerRef = useRef<Set<string>>(new Set());

  // Image caching helper
  const getImage = useCallback((url: string): HTMLImageElement | null => {
    if (!url) return null;
    if (loadedImagesRef.current.has(url)) {
      return loadedImagesRef.current.get(url)!;
    }
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = url;
    img.onload = () => {
      loadedImagesRef.current.set(url, img);
    };
    return img;
  }, []);

  // Preload default object images on mount
  useEffect(() => {
    objects.forEach(obj => {
      if (obj.baseImage) getImage(obj.baseImage);
      if (obj.matchingPartImage) getImage(obj.matchingPartImage);
    });
    if (settings.customBgImage) getImage(settings.customBgImage);
  }, [objects, settings.customBgImage, getImage]);

  // Selected Object reference helper
  const selectedObject = objects.find(o => o.id === selectedObjectId) || objects[0] || null;

  // Add new blank puzzle object
  const handleAddObject = () => {
    const newIdx = objects.length + 1;
    const newId = `obj-${Date.now()}`;
    const svgTypesLeft = ['red_car_left', 'blue_truck_left', 'yellow_excavator_left', 'green_heli_left'] as const;
    const svgTypesRight = ['red_car_right', 'blue_truck_right', 'yellow_excavator_right', 'green_heli_right'] as const;
    const defaultSvgType = (newIdx - 1) % 4;

    const newObj: PuzzleObject = {
      id: newId,
      name: `Object ${newIdx}`,
      baseImage: createDefaultSvg(svgTypesLeft[defaultSvgType]),
      matchingPartImage: createDefaultSvg(svgTypesRight[defaultSvgType]),
      baseX: 10,
      baseY: Math.min(80, 15 + (newIdx - 1) * 18),
      baseWidth: 40,
      baseHeight: 15,
      rotation: 0,
      opacity: 1,
      visible: true,
      locked: false,
      targetX: 52,
      targetY: Math.min(80, 15 + (newIdx - 1) * 18),
      targetWidth: 40,
      targetHeight: 15,
      startX: 115,
      startY: Math.min(80, 15 + (newIdx - 1) * 18)
    };

    setObjects(prev => [...prev, newObj]);
    setSelectedObjectId(newId);
    getImage(newObj.baseImage);
    getImage(newObj.matchingPartImage);
    onShowToast(`Added ${newObj.name} to scene`);
  };

  // Remove puzzle object
  const handleDeleteObject = (id: string) => {
    if (objects.length <= 1) {
      onShowToast('Scene must contain at least 1 object.');
      return;
    }
    setObjects(prev => prev.filter(o => o.id !== id));
    if (selectedObjectId === id) {
      const remaining = objects.filter(o => o.id !== id);
      setSelectedObjectId(remaining[0]?.id || null);
    }
    onShowToast('Deleted object from scene.');
  };

  // Reorder object layer position
  const handleMoveObjectLayer = (id: string, direction: 'up' | 'down') => {
    const idx = objects.findIndex(o => o.id === id);
    if (idx === -1) return;
    if (direction === 'up' && idx === 0) return;
    if (direction === 'down' && idx === objects.length - 1) return;

    const newArr = [...objects];
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    const temp = newArr[idx];
    newArr[idx] = newArr[targetIdx];
    newArr[targetIdx] = temp;
    setObjects(newArr);
  };

  // Update specific property of selected object
  const updateSelectedObject = (key: keyof PuzzleObject, value: unknown) => {
    if (!selectedObjectId) return;
    setObjects(prev => prev.map(obj => {
      if (obj.id === selectedObjectId) {
        return { ...obj, [key]: value };
      }
      return obj;
    }));
  };

  // --------------------------------------------------------------------------
  // ANIMATION TIMELINE SEQUENCER ENGINE
  // --------------------------------------------------------------------------

  const generateAttemptTimeline = useCallback(() => {
    const activeObjs = objects.filter(o => o.visible);
    const attemptsPerPart = settings.wrongAttemptsPerPart;

    // Order of object matching parts
    const partOrder = activeObjs.map((obj, idx) => ({ objectIndex: idx, objId: obj.id }));
    if (settings.randomizeMatching && partOrder.length > 1) {
      // Deterministic swap sequence
      for (let i = partOrder.length - 1; i > 0; i--) {
        const j = (i * 5 + 1) % (i + 1);
        [partOrder[i], partOrder[j]] = [partOrder[j], partOrder[i]];
      }
    }

    interface PartTimelineStep {
      objIndex: number; // Index in activeObjs
      targetObjIndex: number; // Target object location it moves toward
      isCorrect: boolean;
      startTime: number;
      slideDuration: number;
      endTime: number;
    }

    const steps: PartTimelineStep[] = [];
    let currentTimeCursor = settings.pauses.initial;
    const baseSlideDuration = 1.5 / (settings.speedPreset === 'fast' ? 1.5 : settings.speedPreset === 'slow' ? 0.75 : settings.speedPreset === 'very-fast' ? 2.0 : 1.0);

    partOrder.forEach((p) => {
      const correctIdx = p.objectIndex;

      // Determine wrong target candidates
      const wrongCandidates = activeObjs
        .map((_, idx) => idx)
        .filter(idx => idx !== correctIdx);

      const wrongCount = Math.min(attemptsPerPart, wrongCandidates.length);

      // Add wrong attempt steps
      for (let w = 0; w < wrongCount; w++) {
        const wrongTargetIdx = wrongCandidates[w % wrongCandidates.length];
        const startTime = currentTimeCursor;
        const endTime = startTime + baseSlideDuration + settings.pauses.afterWrong + settings.pauses.beforeRetry;

        steps.push({
          objIndex: p.objectIndex,
          targetObjIndex: wrongTargetIdx,
          isCorrect: false,
          startTime,
          slideDuration: baseSlideDuration,
          endTime
        });

        currentTimeCursor = endTime;
      }

      // Add correct attempt step
      const startTime = currentTimeCursor;
      const endTime = startTime + baseSlideDuration + settings.pauses.afterCorrect;

      steps.push({
        objIndex: p.objectIndex,
        targetObjIndex: correctIdx,
        isCorrect: true,
        startTime,
        slideDuration: baseSlideDuration,
        endTime
      });

      currentTimeCursor = endTime;
    });

    const calculatedTotalTime = currentTimeCursor + settings.pauses.final;
    return { steps, calculatedTotalTime, activeObjs };
  }, [objects, settings]);

  // Update total duration when settings/objects change
  useEffect(() => {
    const { calculatedTotalTime } = generateAttemptTimeline();
    setTotalDuration(Math.round(calculatedTotalTime * 10) / 10);
  }, [generateAttemptTimeline]);

  // Evaluate visual scene state at time T
  const evaluateSceneAtTime = useCallback((time: number) => {
    const { steps, calculatedTotalTime, activeObjs } = generateAttemptTimeline();

    // Map of locked objects: objIndex -> targetObjIndex
    const lockedParts = new Map<number, number>();
    let currentActiveStep: {
      objIndex: number;
      targetObjIndex: number;
      isCorrect: boolean;
      progress: number; // 0 to 1
      phase: 'sliding_in' | 'pause_at_slot' | 'sliding_back' | 'locked';
      showMark: 'none' | 'wrong' | 'correct';
      markOpacity: number;
      stepId: string;
    } | null = null;

    for (const step of steps) {
      const stepId = `${step.objIndex}_${step.targetObjIndex}_${step.isCorrect}_${step.startTime}`;
      if (time >= step.endTime) {
        if (step.isCorrect) {
          lockedParts.set(step.objIndex, step.targetObjIndex);
        }
      } else if (time >= step.startTime && time < step.endTime) {
        const localTime = time - step.startTime;
        const slideDur = step.slideDuration;

        if (step.isCorrect) {
          if (localTime <= slideDur) {
            const p = Math.min(1, localTime / slideDur);
            currentActiveStep = {
              objIndex: step.objIndex,
              targetObjIndex: step.targetObjIndex,
              isCorrect: true,
              progress: p,
              phase: 'sliding_in',
              showMark: 'none',
              markOpacity: 0,
              stepId
            };
          } else {
            const markTime = localTime - slideDur;
            const markOpacity = Math.min(1, markTime / 0.2);
            currentActiveStep = {
              objIndex: step.objIndex,
              targetObjIndex: step.targetObjIndex,
              isCorrect: true,
              progress: 1.0,
              phase: 'locked',
              showMark: 'correct',
              markOpacity,
              stepId
            };
          }
        } else {
          const slideInEnd = slideDur;
          const wrongPauseEnd = slideInEnd + settings.pauses.afterWrong;
          const slideBackEnd = wrongPauseEnd + slideDur * 0.6;

          if (localTime < slideInEnd) {
            const p = localTime / slideInEnd;
            currentActiveStep = {
              objIndex: step.objIndex,
              targetObjIndex: step.targetObjIndex,
              isCorrect: false,
              progress: p,
              phase: 'sliding_in',
              showMark: 'none',
              markOpacity: 0,
              stepId
            };
          } else if (localTime < wrongPauseEnd) {
            const markTime = localTime - slideInEnd;
            const markOpacity = Math.min(1, markTime / 0.15);
            currentActiveStep = {
              objIndex: step.objIndex,
              targetObjIndex: step.targetObjIndex,
              isCorrect: false,
              progress: 1.0,
              phase: 'pause_at_slot',
              showMark: 'wrong',
              markOpacity,
              stepId
            };
          } else if (localTime < slideBackEnd) {
            const p = 1.0 - (localTime - wrongPauseEnd) / (slideDur * 0.6);
            currentActiveStep = {
              objIndex: step.objIndex,
              targetObjIndex: step.targetObjIndex,
              isCorrect: false,
              progress: Math.max(0, p),
              phase: 'sliding_back',
              showMark: 'wrong',
              markOpacity: Math.max(0, p),
              stepId
            };
          } else {
            currentActiveStep = null;
          }
        }
        break;
      }
    }

    const isFinished = time >= calculatedTotalTime - settings.pauses.final;

    return {
      activeObjs,
      lockedParts,
      currentActiveStep,
      isFinished
    };
  }, [settings, generateAttemptTimeline]);

  // --------------------------------------------------------------------------
  // FULL CANVAS SCENE RENDERER (9:16 Vertical Scene)
  // --------------------------------------------------------------------------

  const renderCanvasFrame = useCallback((
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    evalTime: number,
    triggerAudio = false
  ) => {
    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // 1. RENDER FULL-SCREEN BACKGROUND
    if (settings.backgroundType === 'grass') {
      // Natural grass lawn background
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, '#15803d');
      bgGrad.addColorStop(0.5, '#16a34a');
      bgGrad.addColorStop(1, '#14532d');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Lawn mower stripe texture
      const stripeH = height / 18;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
      for (let i = 0; i < 18; i += 2) {
        ctx.fillRect(0, i * stripeH, width, stripeH);
      }
    } else if (settings.backgroundType === 'road') {
      // Asphalt Road
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(0, 0, width, height);
      // Yellow road line
      ctx.setLineDash([30, 20]);
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 10;
      ctx.beginPath();
      ctx.moveTo(width * 0.5, 0);
      ctx.lineTo(width * 0.5, height);
      ctx.stroke();
      ctx.setLineDash([]);
    } else if (settings.backgroundType === 'garage') {
      ctx.fillStyle = '#334155';
      ctx.fillRect(0, 0, width, height);
    } else if (settings.backgroundType === 'city') {
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, width, height);
    } else if (settings.backgroundType === 'color') {
      ctx.fillStyle = settings.customBgColor;
      ctx.fillRect(0, 0, width, height);
    } else if (settings.backgroundType === 'gradient') {
      const grad = ctx.createLinearGradient(0, 0, 0, height);
      grad.addColorStop(0, settings.customBgGradient1);
      grad.addColorStop(1, settings.customBgGradient2);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
    } else if (settings.backgroundType === 'image' && settings.customBgImage) {
      const bgImg = getImage(settings.customBgImage);
      if (bgImg && bgImg.complete) {
        ctx.drawImage(bgImg, 0, 0, width, height);
      } else {
        ctx.fillStyle = '#15803d';
        ctx.fillRect(0, 0, width, height);
      }
    }

    // 2. HEADER TEXT OVERLAYS
    if (settings.showTitleText) {
      const headerY = height * 0.08;

      // Category / Round Badge Text
      if (settings.roundText) {
        ctx.font = `bold ${Math.round(width * 0.038)}px ${settings.fontFamily}`;
        ctx.textAlign = 'center';
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = 'rgba(0,0,0,0.7)';
        ctx.shadowBlur = 8;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        ctx.fillText(settings.roundText.toUpperCase(), width / 2, headerY);
      }

      // Title Text
      if (settings.titleText) {
        ctx.font = `900 ${Math.round(width * 0.056)}px ${settings.fontFamily}`;
        ctx.fillStyle = settings.textColor;
        ctx.shadowColor = 'rgba(0,0,0,0.85)';
        ctx.shadowBlur = 12;
        ctx.fillText(settings.titleText, width / 2, headerY + width * 0.08);
      }

      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
    }

    // Evaluate animation state at time evalTime
    const { activeObjs, lockedParts, currentActiveStep, isFinished } = evaluateSceneAtTime(evalTime);

    // Audio Event Trigger during live playback
    if (triggerAudio && settings.soundEnabled && !isMuted) {
      if (currentActiveStep) {
        const audioKey = currentActiveStep.stepId + '_' + currentActiveStep.phase;
        if (!audioEventTrackerRef.current.has(audioKey)) {
          audioEventTrackerRef.current.add(audioKey);

          if (currentActiveStep.phase === 'sliding_in') {
            soundEngine.playWhoosh(settings.masterVolume);
          } else if (currentActiveStep.phase === 'pause_at_slot' && currentActiveStep.showMark === 'wrong') {
            soundEngine.playWrongBuzz(settings.wrongVolume * (settings.masterVolume / 100));
          } else if (currentActiveStep.phase === 'locked' && currentActiveStep.showMark === 'correct') {
            soundEngine.playSnap(settings.masterVolume);
            soundEngine.playSuccessChime(settings.successVolume * (settings.masterVolume / 100));
          }
        }
      }

      if (isFinished) {
        const finishKey = 'fanfare_complete';
        if (!audioEventTrackerRef.current.has(finishKey)) {
          audioEventTrackerRef.current.add(finishKey);
          soundEngine.playCompletionFanfare(settings.masterVolume);
        }
      }
    }

    // 3. DRAW BASE OBJECTS AND LOCKED MATCHING PARTS
    activeObjs.forEach((obj, objIdx) => {
      // Base Image Position (Normalized % -> canvas pixels)
      const bx = (obj.baseX / 100) * width;
      const by = (obj.baseY / 100) * height;
      const bw = (obj.baseWidth / 100) * width;
      const bh = (obj.baseHeight / 100) * height;

      // Draw Base Image
      const baseImg = getImage(obj.baseImage);
      if (baseImg && baseImg.complete) {
        ctx.save();
        ctx.globalAlpha = obj.opacity;

        if (obj.rotation !== 0) {
          ctx.translate(bx + bw / 2, by + bh / 2);
          ctx.rotate((obj.rotation * Math.PI) / 180);
          ctx.drawImage(baseImg, -bw / 2, -bh / 2, bw, bh);
        } else {
          ctx.drawImage(baseImg, bx, by, bw, bh);
        }

        ctx.restore();
      }

      // Check if matching part is locked at this object position
      let isObjLocked = false;
      let lockedPartObjIndex: number | null = null;

      for (const [pIdx, targetOIdx] of lockedParts.entries()) {
        if (targetOIdx === objIdx) {
          isObjLocked = true;
          lockedPartObjIndex = pIdx;
          break;
        }
      }

      if (isObjLocked && lockedPartObjIndex !== null) {
        const lockedObj = activeObjs[lockedPartObjIndex];
        const matchImg = getImage(lockedObj.matchingPartImage);

        if (matchImg && matchImg.complete) {
          // Target position of the base object where part snaps
          const tx = (obj.targetX / 100) * width;
          const ty = (obj.targetY / 100) * height;
          const tw = (obj.targetWidth / 100) * width;
          const th = (obj.targetHeight / 100) * height;

          ctx.save();
          ctx.shadowColor = '#22c55e';
          ctx.shadowBlur = 15;
          ctx.drawImage(matchImg, tx, ty, tw, th);
          ctx.restore();
        }
      }
    });

    // 4. DRAW CURRENT MOVING MATCHING PART (Sliding from Right to Target)
    if (currentActiveStep && currentActiveStep.phase !== 'locked') {
      const movingObj = activeObjs[currentActiveStep.objIndex];
      const targetObj = activeObjs[currentActiveStep.targetObjIndex];

      // Final Target coordinates
      const finalX = (targetObj.targetX / 100) * width;
      const finalY = (targetObj.targetY / 100) * height;
      const targetW = (movingObj.targetWidth / 100) * width;
      const targetH = (movingObj.targetHeight / 100) * height;

      // Start position (outside right canvas)
      const startX = (movingObj.startX / 100) * width;
      const startY = (movingObj.startY / 100) * height;

      const prog = currentActiveStep.progress;
      let easeProgress = prog;

      if (settings.movementEasing === 'ease-out') {
        easeProgress = 1 - Math.pow(1 - prog, 3);
      } else if (settings.movementEasing === 'bounce') {
        easeProgress = Math.sin(prog * Math.PI * 0.5);
      }

      // Calculate current animated X & Y coordinates
      const currentX = startX + (finalX - startX) * easeProgress;
      const currentY = startY + (finalY - startY) * easeProgress;

      const partImg = getImage(movingObj.matchingPartImage);
      if (partImg && partImg.complete) {
        ctx.save();
        ctx.shadowColor = 'rgba(0,0,0,0.6)';
        ctx.shadowBlur = 20;
        ctx.shadowOffsetY = 8;
        ctx.drawImage(partImg, currentX, currentY, targetW, targetH);
        ctx.restore();
      }

      // 5. DRAW CHECKMARK / WRONG MARK OVERLAY (❌ or ✔)
      if (settings.showMarks && currentActiveStep.showMark !== 'none') {
        const markX = finalX + targetW * 0.5;
        const markY = finalY + targetH * 0.5;
        const markSize = settings.markSize;

        ctx.save();
        ctx.globalAlpha = currentActiveStep.markOpacity;

        const popScale = 0.5 + currentActiveStep.markOpacity * 0.6;
        ctx.translate(markX, markY);
        ctx.scale(popScale, popScale);

        if (currentActiveStep.showMark === 'wrong') {
          // Large Red ❌ Badge
          ctx.beginPath();
          ctx.arc(0, 0, markSize * 0.5, 0, Math.PI * 2);
          ctx.fillStyle = '#dc2626';
          ctx.shadowColor = 'rgba(220, 38, 38, 0.85)';
          ctx.shadowBlur = 18;
          ctx.fill();

          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = markSize * 0.12;
          ctx.lineCap = 'round';

          const arm = markSize * 0.22;
          ctx.beginPath();
          ctx.moveTo(-arm, -arm);
          ctx.lineTo(arm, arm);
          ctx.moveTo(arm, -arm);
          ctx.lineTo(-arm, arm);
          ctx.stroke();
        } else if (currentActiveStep.showMark === 'correct') {
          // Large Green ✔ Badge
          ctx.beginPath();
          ctx.arc(0, 0, markSize * 0.5, 0, Math.PI * 2);
          ctx.fillStyle = '#16a34a';
          ctx.shadowColor = 'rgba(22, 163, 74, 0.85)';
          ctx.shadowBlur = 18;
          ctx.fill();

          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = markSize * 0.12;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';

          ctx.beginPath();
          ctx.moveTo(-markSize * 0.2, 0);
          ctx.lineTo(-markSize * 0.05, markSize * 0.18);
          ctx.lineTo(markSize * 0.22, -markSize * 0.18);
          ctx.stroke();
        }

        ctx.restore();
      }
    }

    // 6. DRAW FINAL SUCCESS BANNER
    if (isFinished) {
      ctx.save();
      const bannerY = height * 0.5 - 65;

      ctx.fillStyle = 'rgba(22, 163, 74, 0.94)';
      ctx.shadowColor = '#22c55e';
      ctx.shadowBlur = 30;
      ctx.fillRect(0, bannerY, width, 130);

      ctx.font = `900 ${Math.round(width * 0.075)}px ${settings.fontFamily}`;
      ctx.textAlign = 'center';
      ctx.fillStyle = '#facc15';
      ctx.fillText(settings.successText, width / 2, bannerY + 80);
      ctx.restore();
    }

    // 7. DRAW WATERMARK / BRANDING
    if (settings.watermarkText) {
      ctx.save();
      ctx.font = `bold ${Math.round(width * 0.028)}px ${settings.fontFamily}`;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';

      const margin = width * 0.04;
      if (settings.watermarkPos === 'top-right') {
        ctx.textAlign = 'right';
        ctx.fillText(settings.watermarkText, width - margin, margin + 25);
      } else if (settings.watermarkPos === 'top-left') {
        ctx.textAlign = 'left';
        ctx.fillText(settings.watermarkText, margin, margin + 25);
      } else if (settings.watermarkPos === 'bottom-right') {
        ctx.textAlign = 'right';
        ctx.fillText(settings.watermarkText, width - margin, height - margin);
      } else {
        ctx.textAlign = 'left';
        ctx.fillText(settings.watermarkText, margin, height - margin);
      }
      ctx.restore();
    }
  }, [settings, evaluateSceneAtTime, getImage]);

  // --------------------------------------------------------------------------
  // LIVE ANIMATION LOOP & CONTROLS
  // --------------------------------------------------------------------------

  const currentTimeRef = useRef(currentTime);
  currentTimeRef.current = currentTime;

  // Render canvas frame when paused and seeking or settings update
  useEffect(() => {
    if (isPlaying) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (canvas.width !== settings.resolutionWidth) canvas.width = settings.resolutionWidth;
    if (canvas.height !== settings.resolutionHeight) canvas.height = settings.resolutionHeight;
    renderCanvasFrame(ctx, canvas.width, canvas.height, currentTime, false);
  }, [isPlaying, currentTime, settings, renderCanvasFrame]);

  // Active playback animation loop decoupled from currentTime state
  useEffect(() => {
    if (!isPlaying) {
      lastTimeRef.current = 0;
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (canvas.width !== settings.resolutionWidth) canvas.width = settings.resolutionWidth;
    if (canvas.height !== settings.resolutionHeight) canvas.height = settings.resolutionHeight;

    let isSubscribed = true;

    const loop = (timestamp: number) => {
      if (!isSubscribed) return;

      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const deltaSec = (timestamp - lastTimeRef.current) / 1000;
      lastTimeRef.current = timestamp;

      const nextTime = currentTimeRef.current + deltaSec * playbackSpeed;
      if (nextTime >= totalDuration) {
        currentTimeRef.current = totalDuration;
        setCurrentTime(totalDuration);
        setIsPlaying(false);
        renderCanvasFrame(ctx, canvas.width, canvas.height, totalDuration, false);
        return;
      }

      currentTimeRef.current = nextTime;

      // Throttle React state update to ~12 FPS (every 80ms) so timeline displays smoothly without choking React on mobile
      if (timestamp - lastUiUpdateRef.current >= 80) {
        lastUiUpdateRef.current = timestamp;
        setCurrentTime(nextTime);
      }

      renderCanvasFrame(ctx, canvas.width, canvas.height, nextTime, true);

      if (isSubscribed) {
        animationFrameRef.current = requestAnimationFrame(loop);
      }
    };

    animationFrameRef.current = requestAnimationFrame(loop);

    return () => {
      isSubscribed = false;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      setCurrentTime(currentTimeRef.current);
    };
  }, [isPlaying, totalDuration, playbackSpeed, settings, renderCanvasFrame]);

  const handleRestart = () => {
    audioEventTrackerRef.current.clear();
    setCurrentTime(0);
    setIsPlaying(true);
  };

  // --------------------------------------------------------------------------
  // INTERACTIVE CANVAS DRAG & POSITIONING
  // --------------------------------------------------------------------------

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isPlaying || !selectedObject || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;

    // Check if clicked inside selected object base or target
    const obj = selectedObject;
    const isInsideBase =
      clickX >= obj.baseX && clickX <= obj.baseX + obj.baseWidth &&
      clickY >= obj.baseY && clickY <= obj.baseY + obj.baseHeight;

    const isInsideTarget =
      clickX >= obj.targetX && clickX <= obj.targetX + obj.targetWidth &&
      clickY >= obj.targetY && clickY <= obj.targetY + obj.targetHeight;

    if (isInsideTarget) {
      setIsDragging(true);
      setDragMode('target');
      setDragOffset({ x: clickX - obj.targetX, y: clickY - obj.targetY });
    } else if (isInsideBase) {
      setIsDragging(true);
      setDragMode('base');
      setDragOffset({ x: clickX - obj.baseX, y: clickY - obj.baseY });
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || !selectedObject || !canvasRef.current || !dragMode) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const currX = ((e.clientX - rect.left) / rect.width) * 100;
    const currY = ((e.clientY - rect.top) / rect.height) * 100;

    const newX = Math.max(0, Math.min(90, Math.round(currX - dragOffset.x)));
    const newY = Math.max(0, Math.min(90, Math.round(currY - dragOffset.y)));

    if (dragMode === 'base') {
      updateSelectedObject('baseX', newX);
      updateSelectedObject('baseY', newY);
    } else {
      updateSelectedObject('targetX', newX);
      updateSelectedObject('targetY', newY);
    }
  };

  const handleCanvasMouseUp = () => {
    setIsDragging(false);
    setDragMode(null);
  };

  const handleCanvasTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (isPlaying || !selectedObject || !canvasRef.current || e.touches.length === 0) return;
    const touch = e.touches[0];
    const rect = canvasRef.current.getBoundingClientRect();
    const clickX = ((touch.clientX - rect.left) / rect.width) * 100;
    const clickY = ((touch.clientY - rect.top) / rect.height) * 100;

    const obj = selectedObject;
    const isInsideBase =
      clickX >= obj.baseX && clickX <= obj.baseX + obj.baseWidth &&
      clickY >= obj.baseY && clickY <= obj.baseY + obj.baseHeight;

    const isInsideTarget =
      clickX >= obj.targetX && clickX <= obj.targetX + obj.targetWidth &&
      clickY >= obj.targetY && clickY <= obj.targetY + obj.targetHeight;

    if (isInsideTarget) {
      setIsDragging(true);
      setDragMode('target');
      setDragOffset({ x: clickX - obj.targetX, y: clickY - obj.targetY });
    } else if (isInsideBase) {
      setIsDragging(true);
      setDragMode('base');
      setDragOffset({ x: clickX - obj.baseX, y: clickY - obj.baseY });
    }
  };

  const handleCanvasTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDragging || !selectedObject || !canvasRef.current || !dragMode || e.touches.length === 0) return;
    const touch = e.touches[0];
    const rect = canvasRef.current.getBoundingClientRect();
    const currX = ((touch.clientX - rect.left) / rect.width) * 100;
    const currY = ((touch.clientY - rect.top) / rect.height) * 100;

    const newX = Math.max(0, Math.min(90, Math.round(currX - dragOffset.x)));
    const newY = Math.max(0, Math.min(90, Math.round(currY - dragOffset.y)));

    if (dragMode === 'base') {
      updateSelectedObject('baseX', newX);
      updateSelectedObject('baseY', newY);
    } else {
      updateSelectedObject('targetX', newX);
      updateSelectedObject('targetY', newY);
    }
  };

  const handleCanvasTouchEnd = () => {
    setIsDragging(false);
    setDragMode(null);
  };

  // --------------------------------------------------------------------------
  // VIDEO EXPORT PIPELINE
  // --------------------------------------------------------------------------

  const handleExportVideo = async () => {
    if (isExporting) return;

    setIsExporting(true);
    setExportProgress(0);
    setExportStepText('Initializing video export pipeline...');
    setExportedVideoUrl(null);

    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = settings.resolutionWidth;
    exportCanvas.height = settings.resolutionHeight;

    const exportCtx = exportCanvas.getContext('2d');
    if (!exportCtx) {
      onShowToast('Canvas export not supported in this browser.');
      setIsExporting(false);
      return;
    }

    if (typeof (exportCanvas as unknown as { captureStream?: (fps?: number) => MediaStream }).captureStream !== 'function' || typeof MediaRecorder === 'undefined') {
      onShowToast('Video export (MediaRecorder/captureStream) is not supported in this browser environment.');
      setIsExporting(false);
      return;
    }

    try {
      const canvasStream = exportCanvas.captureStream(settings.fps);

      if (settings.soundEnabled && soundEngine.destinationStreamNode) {
        const audioTracks = soundEngine.destinationStreamNode.stream.getAudioTracks();
        if (audioTracks.length > 0) {
          canvasStream.addTrack(audioTracks[0]);
        }
      }

      let mimeType = 'video/webm;codecs=vp9,opus';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'video/webm;codecs=vp8,opus';
        if (!MediaRecorder.isTypeSupported(mimeType)) {
          mimeType = 'video/webm';
        }
      }

      const recorder = new MediaRecorder(canvasStream, {
        mimeType,
        videoBitsPerSecond: 9000000
      });

      const chunks: Blob[] = [];
      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const videoUrl = URL.createObjectURL(blob);
        setExportedVideoUrl(videoUrl);
        setExportProgress(100);
        setExportStepText('Video export ready!');
        onShowToast('Video rendering complete! Ready to download.');
      };

      recorder.start();

      const totalFrames = Math.ceil(totalDuration * settings.fps);
      const frameStepSec = 1 / settings.fps;
      audioEventTrackerRef.current.clear();

      for (let frame = 0; frame <= totalFrames; frame++) {
        const renderTime = frame * frameStepSec;

        renderCanvasFrame(exportCtx, exportCanvas.width, exportCanvas.height, renderTime, true);

        const pct = Math.round((frame / totalFrames) * 95);
        setExportProgress(pct);
        setExportStepText(`Rendering frame ${frame} of ${totalFrames} (${pct}%)...`);

        await new Promise(r => setTimeout(r, 1000 / settings.fps));
      }

      recorder.stop();
    } catch (err) {
      console.error('Export error:', err);
      onShowToast('Video export failed. Please try again.');
      setIsExporting(false);
    }
  };

  // File Upload Handler for Object Images & Background
  const handleFileUpload = (type: 'base' | 'matching' | 'background', file: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (!dataUrl) return;

      if (type === 'background') {
        setSettings(prev => ({ ...prev, backgroundType: 'image', customBgImage: dataUrl }));
        getImage(dataUrl);
        onShowToast('Uploaded custom background image.');
      } else if (selectedObjectId) {
        if (type === 'base') {
          updateSelectedObject('baseImage', dataUrl);
          onShowToast(`Updated base image for ${selectedObject?.name}`);
        } else {
          updateSelectedObject('matchingPartImage', dataUrl);
          onShowToast(`Updated matching part for ${selectedObject?.name}`);
        }
        getImage(dataUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  // Save Project JSON
  const handleSaveProject = () => {
    try {
      const projectData = { settings, objects, timestamp: Date.now() };
      localStorage.setItem('splitdrop-puzzle-project-v2', JSON.stringify(projectData));
      onShowToast('Saved project to browser storage!');
    } catch {
      onShowToast('Failed to save project. Storage limit exceeded.');
    }
  };

  // Load Project JSON
  const handleLoadProject = () => {
    try {
      const raw = localStorage.getItem('splitdrop-puzzle-project-v2');
      if (!raw) {
        onShowToast('No saved project found.');
        return;
      }
      const data = JSON.parse(raw);
      if (data.settings && data.objects) {
        setSettings(data.settings);
        setObjects(data.objects);
        onShowToast('Loaded saved project!');
      }
    } catch {
      onShowToast('Failed to load project data.');
    }
  };

  return (
    <div className="bg-slate-900 text-slate-100 flex flex-col font-sans rounded-3xl p-3.5 sm:p-6 border border-slate-800 shadow-xl">
      {/* TOOL ACTION TOOLBAR */}
      <div className="bg-slate-850 bg-slate-800/80 border border-slate-700/70 rounded-2xl p-3 sm:p-4 mb-5 flex flex-wrap items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl">📹</span>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-bold text-white tracking-tight">Interactive Puzzle Video Studio</h2>
              <span className="px-2 py-0.5 text-[10px] font-extrabold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 rounded-full uppercase">
                9:16 Shorts
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Satisfying matching-parts puzzle videos for YouTube Shorts, Reels & TikTok
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSaveProject}
            className="px-3 py-1.5 rounded-lg bg-slate-700/80 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-600 transition-all"
          >
            <Save className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Save</span>
          </button>
          <button
            type="button"
            onClick={handleLoadProject}
            className="px-3 py-1.5 rounded-lg bg-slate-700/80 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-600 transition-all"
          >
            <FolderOpen className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Load</span>
          </button>
          <button
            type="button"
            onClick={() => handleExportVideo()}
            className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-xs font-bold shadow-lg shadow-indigo-500/20 flex items-center gap-1.5 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Export 9:16 Video</span>
          </button>
        </div>
      </div>

      {/* MAIN TOOL SUITE WORKSPACE */}
      <div className="w-full flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* LEFT COLUMN: EDITOR TABS & CONTROLS */}
        <div className="lg:col-span-6 flex flex-col gap-4 order-2 lg:order-1">

          {/* TAB NAVIGATION HEADER */}
          <div className="flex items-center gap-1 bg-slate-800/80 p-1.5 rounded-xl border border-slate-700/80 overflow-x-auto text-xs">
            <button
              type="button"
              onClick={() => setActiveTab('scene')}
              className={`flex-1 py-2 px-3 rounded-lg font-bold flex items-center justify-center gap-1.5 whitespace-nowrap transition-all ${
                activeTab === 'scene'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Objects & Parts</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('background')}
              className={`flex-1 py-2 px-3 rounded-lg font-bold flex items-center justify-center gap-1.5 whitespace-nowrap transition-all ${
                activeTab === 'background'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>Background</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('layers')}
              className={`flex-1 py-2 px-3 rounded-lg font-bold flex items-center justify-center gap-1.5 whitespace-nowrap transition-all ${
                activeTab === 'layers'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Layers ({objects.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('animation')}
              className={`flex-1 py-2 px-3 rounded-lg font-bold flex items-center justify-center gap-1.5 whitespace-nowrap transition-all ${
                activeTab === 'animation'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
              }`}
            >
              <Film className="w-3.5 h-3.5" />
              <span>Animation</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('audio')}
              className={`flex-1 py-2 px-3 rounded-lg font-bold flex items-center justify-center gap-1.5 whitespace-nowrap transition-all ${
                activeTab === 'audio'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
              }`}
            >
              <Music className="w-3.5 h-3.5" />
              <span>Audio</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('text')}
              className={`flex-1 py-2 px-3 rounded-lg font-bold flex items-center justify-center gap-1.5 whitespace-nowrap transition-all ${
                activeTab === 'text'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
              }`}
            >
              <Type className="w-3.5 h-3.5" />
              <span>Text</span>
            </button>
          </div>

          {/* TAB 1: OBJECTS & MATCHING PARTS EDITOR */}
          {activeTab === 'scene' && (
            <div className="bg-slate-800/60 backdrop-blur-md rounded-2xl p-5 border border-slate-700/80 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    Selected Object: {selectedObject?.name || 'None'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Upload base object and its corresponding matching part
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddObject}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1 shadow"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Object
                </button>
              </div>

              {selectedObject && (
                <div className="space-y-4">
                  {/* Object Name Input */}
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Object Title / Category Name:
                    </label>
                    <input
                      type="text"
                      value={selectedObject.name}
                      onChange={(e) => updateSelectedObject('name', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  {/* Dual Upload Cards: Base Image + Matching Part Image */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* 1. Base Image Upload */}
                    <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-700 space-y-2">
                      <div className="text-xs font-bold text-indigo-400 flex items-center justify-between">
                        <span>1. Base Image (Left)</span>
                        <label className="cursor-pointer text-[11px] text-indigo-300 hover:underline flex items-center gap-1">
                          <Upload className="w-3 h-3" />
                          Change
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const f = e.target.files?.[0];
                              if (f) handleFileUpload('base', f);
                            }}
                          />
                        </label>
                      </div>

                      <div className="h-28 bg-slate-950/60 rounded-lg flex items-center justify-center p-2 border border-slate-800 relative overflow-hidden group">
                        {selectedObject.baseImage ? (
                          <img
                            src={selectedObject.baseImage}
                            alt="Base"
                            className="max-h-full max-w-full object-contain"
                          />
                        ) : (
                          <span className="text-xs text-slate-500">No Image</span>
                        )}
                      </div>
                    </div>

                    {/* 2. Matching Part Upload */}
                    <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-700 space-y-2">
                      <div className="text-xs font-bold text-amber-400 flex items-center justify-between">
                        <span>2. Matching Part (Right)</span>
                        <label className="cursor-pointer text-[11px] text-amber-300 hover:underline flex items-center gap-1">
                          <Upload className="w-3 h-3" />
                          Change
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const f = e.target.files?.[0];
                              if (f) handleFileUpload('matching', f);
                            }}
                          />
                        </label>
                      </div>

                      <div className="h-28 bg-slate-950/60 rounded-lg flex items-center justify-center p-2 border border-slate-800 relative overflow-hidden group">
                        {selectedObject.matchingPartImage ? (
                          <img
                            src={selectedObject.matchingPartImage}
                            alt="Part"
                            className="max-h-full max-w-full object-contain"
                          />
                        ) : (
                          <span className="text-xs text-slate-500">No Image</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Positioning Sliders for Base Object & Target Part */}
                  <div className="space-y-3 pt-2 border-t border-slate-700/60">
                    <span className="text-xs font-bold text-slate-300 block">
                      Canvas Coordinates (% Position):
                    </span>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="text-slate-400 text-[11px] block">Base Position X ({selectedObject.baseX}%):</label>
                        <input
                          type="range"
                          min="0"
                          max="90"
                          value={selectedObject.baseX}
                          onChange={(e) => updateSelectedObject('baseX', Number(e.target.value))}
                          className="w-full accent-indigo-500 cursor-pointer"
                        />
                      </div>

                      <div>
                        <label className="text-slate-400 text-[11px] block">Base Position Y ({selectedObject.baseY}%):</label>
                        <input
                          type="range"
                          min="0"
                          max="90"
                          value={selectedObject.baseY}
                          onChange={(e) => updateSelectedObject('baseY', Number(e.target.value))}
                          className="w-full accent-indigo-500 cursor-pointer"
                        />
                      </div>

                      <div>
                        <label className="text-slate-400 text-[11px] block">Target Match X ({selectedObject.targetX}%):</label>
                        <input
                          type="range"
                          min="0"
                          max="90"
                          value={selectedObject.targetX}
                          onChange={(e) => updateSelectedObject('targetX', Number(e.target.value))}
                          className="w-full accent-amber-500 cursor-pointer"
                        />
                      </div>

                      <div>
                        <label className="text-slate-400 text-[11px] block">Target Match Y ({selectedObject.targetY}%):</label>
                        <input
                          type="range"
                          min="0"
                          max="90"
                          value={selectedObject.targetY}
                          onChange={(e) => updateSelectedObject('targetY', Number(e.target.value))}
                          className="w-full accent-amber-500 cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: BACKGROUND CUSTOMIZATION */}
          {activeTab === 'background' && (
            <div className="bg-slate-800/60 backdrop-blur-md rounded-2xl p-5 border border-slate-700/80 space-y-4">
              <div className="border-b border-slate-700/60 pb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Palette className="w-4 h-4 text-emerald-400" />
                  Background Style
                </h3>
                <p className="text-xs text-slate-400">
                  Choose a high-quality preset background or upload custom image
                </p>
              </div>

              {/* Upload Custom Background Image Card */}
              <div className="p-4 bg-slate-900/80 rounded-xl border border-dashed border-indigo-500/40 text-center space-y-2">
                <p className="text-xs font-bold text-indigo-300">Upload Full-Screen Background Image</p>
                <p className="text-[11px] text-slate-400">Supports JPG, PNG, WEBP high-resolution backgrounds</p>
                <label className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold cursor-pointer transition-all">
                  <Upload className="w-3.5 h-3.5" />
                  Browse Background Image
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload('background', file);
                    }}
                  />
                </label>
              </div>

              {/* Background Preset Selector Buttons */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 block">Preset Backgrounds:</label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {[
                    { id: 'grass', label: '🌿 Green Grass', desc: 'Natural Lawn' },
                    { id: 'road', label: '🛣️ Asphalt Road', desc: 'Yellow Line' },
                    { id: 'garage', label: '🏬 Garage Workshop', desc: 'Industrial' },
                    { id: 'city', label: '🏙️ Night City', desc: 'Urban Lights' },
                    { id: 'color', label: '🎨 Custom Color', desc: 'Solid Tint' },
                    { id: 'gradient', label: '🌈 Custom Gradient', desc: 'Smooth Blend' }
                  ].map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => {
                        setSettings(prev => ({ ...prev, backgroundType: preset.id as any }));
                        onShowToast(`Applied ${preset.label} background`);
                      }}
                      className={`p-2.5 rounded-xl text-left border transition-all ${
                        settings.backgroundType === preset.id
                          ? 'bg-indigo-600/30 border-indigo-500 text-white font-bold'
                          : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <div className="text-xs font-bold">{preset.label}</div>
                      <div className="text-[10px] text-slate-400">{preset.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: LAYERS MANAGER */}
          {activeTab === 'layers' && (
            <div className="bg-slate-800/60 backdrop-blur-md rounded-2xl p-5 border border-slate-700/80 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Layers className="w-4 h-4 text-violet-400" />
                    Scene Objects ({objects.length})
                  </h3>
                  <p className="text-xs text-slate-400">Manage layer order, visibility, and object selection</p>
                </div>
                <button
                  type="button"
                  onClick={handleAddObject}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Layer
                </button>
              </div>

              {/* Layer Cards List */}
              <div className="space-y-2">
                {objects.map((obj, idx) => (
                  <div
                    key={obj.id}
                    onClick={() => setSelectedObjectId(obj.id)}
                    className={`p-3 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                      selectedObjectId === obj.id
                        ? 'bg-indigo-600/20 border-indigo-500 text-white'
                        : 'bg-slate-900/80 border-slate-700/80 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-950 rounded-lg p-1 border border-slate-800 flex items-center justify-center shrink-0">
                        {obj.baseImage && (
                          <img src={obj.baseImage} alt="Thumb" className="max-h-full max-w-full object-contain" />
                        )}
                      </div>
                      <div>
                        <div className="text-xs font-bold">{obj.name}</div>
                        <div className="text-[10px] text-slate-400">Position Y: {obj.baseY}%</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => handleMoveObjectLayer(obj.id, 'up')}
                        disabled={idx === 0}
                        className="p-1.5 hover:bg-slate-700 rounded text-slate-400 hover:text-white disabled:opacity-30"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveObjectLayer(obj.id, 'down')}
                        disabled={idx === objects.length - 1}
                        className="p-1.5 hover:bg-slate-700 rounded text-slate-400 hover:text-white disabled:opacity-30"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteObject(obj.id)}
                        className="p-1.5 hover:bg-red-500/20 text-red-400 rounded"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: ANIMATION TIMING & SPEED */}
          {activeTab === 'animation' && (
            <div className="bg-slate-800/60 backdrop-blur-md rounded-2xl p-5 border border-slate-700/80 space-y-4">
              <div className="border-b border-slate-700/60 pb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Film className="w-4 h-4 text-cyan-400" />
                  Animation & Movement Engine
                </h3>
                <p className="text-xs text-slate-400">Control slide duration, wrong attempt count, and easing</p>
              </div>

              {/* Speed Presets */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 block">Animation Speed Preset:</label>
                <div className="grid grid-cols-4 gap-2 text-xs">
                  {[
                    { id: 'slow', label: '🐢 Slow' },
                    { id: 'normal', label: '⚡ Normal' },
                    { id: 'fast', label: '🚀 Fast' },
                    { id: 'very-fast', label: '🔥 Very Fast' }
                  ].map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => setSettings(prev => ({ ...prev, speedPreset: preset.id as any }))}
                      className={`py-2 rounded-xl border text-center font-bold text-xs transition-all ${
                        settings.speedPreset === preset.id
                          ? 'bg-indigo-600 border-indigo-400 text-white shadow'
                          : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Wrong Attempts per Object Slider */}
              <div className="space-y-1.5 pt-2 border-t border-slate-700/60">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-300">Wrong Target Attempts per Part:</span>
                  <span className="font-bold text-indigo-400">{settings.wrongAttemptsPerPart} Attempt(s)</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="3"
                  value={settings.wrongAttemptsPerPart}
                  onChange={(e) => setSettings(prev => ({ ...prev, wrongAttemptsPerPart: Number(e.target.value) }))}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
                <p className="text-[10px] text-slate-400">
                  Part will try wrong slots first with red ❌ and buzz sound before snapping to the correct slot
                </p>
              </div>
            </div>
          )}

          {/* TAB 5: AUDIO SYNTHESIZER */}
          {activeTab === 'audio' && (
            <div className="bg-slate-800/60 backdrop-blur-md rounded-2xl p-5 border border-slate-700/80 space-y-4">
              <div className="border-b border-slate-700/60 pb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Music className="w-4 h-4 text-pink-400" />
                  Web Audio Sound Effects
                </h3>
                <p className="text-xs text-slate-400">Synthesized original sound effects embedded directly into exported video</p>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-900 rounded-xl border border-slate-700">
                <span className="text-xs font-bold text-slate-200">Enable Sound Effects in Video</span>
                <button
                  type="button"
                  onClick={() => setSettings(prev => ({ ...prev, soundEnabled: !prev.soundEnabled }))}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    settings.soundEnabled ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {settings.soundEnabled ? 'ON' : 'OFF'}
                </button>
              </div>

              {/* Master Volume */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-semibold">Master Volume:</span>
                  <span className="font-bold text-indigo-400">{settings.masterVolume}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settings.masterVolume}
                  onChange={(e) => setSettings(prev => ({ ...prev, masterVolume: Number(e.target.value) }))}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* TAB 6: TEXT OVERLAYS & WATERMARK */}
          {activeTab === 'text' && (
            <div className="bg-slate-800/60 backdrop-blur-md rounded-2xl p-5 border border-slate-700/80 space-y-4">
              <div className="border-b border-slate-700/60 pb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Type className="w-4 h-4 text-amber-400" />
                  Text Overlays & Watermark
                </h3>
                <p className="text-xs text-slate-400">Customize headline title and channel watermark badge</p>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Headline Title:</label>
                <input
                  type="text"
                  value={settings.titleText}
                  onChange={(e) => setSettings(prev => ({ ...prev, titleText: e.target.value }))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Channel Watermark:</label>
                <input
                  type="text"
                  value={settings.watermarkText}
                  onChange={(e) => setSettings(prev => ({ ...prev, watermarkText: e.target.value }))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: REAL-TIME 9:16 VERTICAL CANVAS PREVIEW */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center order-1 lg:order-2">
          <div className="w-full max-w-[380px] bg-slate-950 p-4 rounded-3xl border border-slate-800 shadow-2xl space-y-3">
            
            {/* Top Preview Controls Bar */}
            <div className="flex items-center justify-between text-xs text-slate-400 px-1">
              <span className="font-bold text-slate-200 flex items-center gap-1.5">
                <Video className="w-4 h-4 text-indigo-400" />
                9:16 Shorts Preview
              </span>
              <span className="text-[11px] font-mono text-indigo-400">
                {currentTime.toFixed(1)}s / {totalDuration.toFixed(1)}s
              </span>
            </div>

            {/* Canvas Viewport (9:16 Aspect Ratio Container) */}
            <div
              ref={previewContainerRef}
              className="relative w-full aspect-[9/16] bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-inner group"
            >
              <canvas
                ref={canvasRef}
                onMouseDown={handleCanvasMouseDown}
                onMouseMove={handleCanvasMouseMove}
                onMouseUp={handleCanvasMouseUp}
                onTouchStart={handleCanvasTouchStart}
                onTouchMove={handleCanvasTouchMove}
                onTouchEnd={handleCanvasTouchEnd}
                className="w-full h-full object-contain cursor-crosshair touch-none"
              />

              {/* Interactive Edit Overlay Helper Text */}
              {!isPlaying && (
                <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-semibold text-slate-300 border border-slate-700/80 pointer-events-none">
                  💡 Click & drag object on scene
                </div>
              )}
            </div>

            {/* Playback Transport Controls */}
            <div className="space-y-2 pt-1">
              {/* Timeline Progress Bar */}
              <input
                type="range"
                min="0"
                max={totalDuration || 20}
                step="0.1"
                value={currentTime}
                onChange={(e) => {
                  audioEventTrackerRef.current.clear();
                  setCurrentTime(Number(e.target.value));
                }}
                className="w-full accent-indigo-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-md transition-all"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                  <button
                    type="button"
                    onClick={handleRestart}
                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold transition-all"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold transition-all"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-indigo-400" />}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => handleExportVideo()}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-xs font-bold shadow-lg shadow-indigo-500/20 flex items-center gap-1.5 transition-all"
                >
                  <Download className="w-4 h-4" />
                  Export Video
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* EXPORT PROGRESS MODAL */}
      {isExporting && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 p-6 rounded-2xl max-w-md w-full space-y-4 text-center shadow-2xl">
            <div className="w-12 h-12 bg-indigo-600/20 rounded-full flex items-center justify-center mx-auto text-indigo-400">
              <Film className="w-6 h-6 animate-pulse" />
            </div>

            <h3 className="text-base font-bold text-white">Rendering 9:16 Vertical Video</h3>
            <p className="text-xs text-slate-400">{exportStepText}</p>

            {/* Progress Bar */}
            <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden border border-slate-700">
              <div
                className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full transition-all duration-200"
                style={{ width: `${exportProgress}%` }}
              />
            </div>
            <p className="text-xs font-bold text-indigo-400">{exportProgress}% Completed</p>

            {exportedVideoUrl && (
              <div className="space-y-3 pt-2">
                <a
                  href={exportedVideoUrl}
                  download="matching-parts-puzzle-shorts.webm"
                  className="w-full py-3 rounded-xl bg-green-600 hover:bg-green-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
                >
                  <Download className="w-4 h-4" />
                  Download 1080p WebM Video
                </a>
                <button
                  type="button"
                  onClick={() => setIsExporting(false)}
                  className="text-xs text-slate-400 hover:underline"
                >
                  Close Window
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* LOCAL PROCESSING NOTICE */}
      <div className="mt-6 pt-4 border-t border-slate-800 text-center text-xs text-slate-500">
        <p>Your images and project are processed 100% locally in your browser. Nothing is uploaded to Zubware servers.</p>
      </div>
    </div>
  );
}
