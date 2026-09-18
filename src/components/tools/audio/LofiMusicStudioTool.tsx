import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Headphones,
  Music,
  Play,
  Pause,
  RotateCcw,
  Download,
  Upload,
  Sliders,
  Sparkles,
  Video,
  FileAudio,
  RefreshCw,
  CheckCircle2,
  HelpCircle,
  Disc,
  ShieldCheck,
  Volume2,
  VolumeX,
  AlertCircle
} from 'lucide-react';
import { SEOHead } from '../../SEOHead';
import { AdSlot } from '../../AdSlot';
import { Breadcrumb } from '../../Breadcrumb';
import {
  StudioMode,
  LofiEffects,
  AmbienceSettings,
  CreatorSettings,
  VideoMakerSettings
} from '../../../types';
import {
  encodeAudioBufferToWav,
  validateAudioBuffer,
  renderLofiAudioOffline,
  synthesizeOriginalLofiTrack
} from '../../../lib/lofiAudioEngine';

// ============================================================================
// PRESETS & DATA
// ============================================================================

const LOFI_PRESETS: { id: string; name: string; description: string; effects: Partial<LofiEffects> }[] = [
  {
    id: 'classic',
    name: 'Classic Lofi',
    description: 'Warm vinyl warmth with gentle low-pass filtering and subtle tape flutter.',
    effects: { speed: 0.90, pitch: -2, lowPassFreq: 6500, bassGain: 3, trebleGain: -3, reverbWet: 0.25, vinylCrackle: 0.35, tapeSaturation: 0.2 }
  },
  {
    id: 'warm',
    name: 'Warm Lofi',
    description: 'Cozy boosted bass and soft treble cutoff for relaxed study vibes.',
    effects: { speed: 0.88, pitch: -3, lowPassFreq: 5000, bassGain: 5, trebleGain: -5, reverbWet: 0.3, vinylCrackle: 0.2, tapeSaturation: 0.4 }
  },
  {
    id: 'chill_night',
    name: 'Chill Night',
    description: 'Slightly slowed down with spacious dreamy reverb and ambient hiss.',
    effects: { speed: 0.85, pitch: -4, lowPassFreq: 5500, reverbWet: 0.45, delayWet: 0.2, delayTime: 0.35, vinylHiss: 0.3, tapeWow: 0.25 }
  },
  {
    id: 'rainy',
    name: 'Rainy Lofi',
    description: 'Deep muffled tones with gentle tape flutter and vintage crackle.',
    effects: { speed: 0.87, pitch: -2, lowPassFreq: 4500, bassGain: 4, reverbWet: 0.35, vinylCrackle: 0.5, vinylPop: 0.2 }
  },
  {
    id: 'vinyl',
    name: 'Vinyl Lofi',
    description: 'Prominent vinyl pops, crackle, and pitch warmth.',
    effects: { speed: 0.92, pitch: -1, lowPassFreq: 8000, vinylCrackle: 0.6, vinylPop: 0.45, vinylHiss: 0.25, tapeSaturation: 0.15 }
  },
  {
    id: 'dreamy',
    name: 'Dreamy Lofi',
    description: 'Ethereal atmosphere with long reverb trails and tape wow.',
    effects: { speed: 0.82, pitch: -5, lowPassFreq: 6000, reverbWet: 0.55, reverbDecay: 3.5, delayWet: 0.3, tapeWow: 0.4 }
  },
  {
    id: 'deep',
    name: 'Deep Lofi',
    description: 'Heavily filtered sub-bass orientation for late night focus.',
    effects: { speed: 0.80, pitch: -6, lowPassFreq: 3500, bassGain: 6, trebleGain: -8, reverbWet: 0.2, tapeSaturation: 0.5 }
  },
  {
    id: 'study',
    name: 'Study Lofi',
    description: 'Clean, non-intrusive lofi EQ profile ideal for background work.',
    effects: { speed: 0.92, pitch: -1, lowPassFreq: 7500, bassGain: 2, trebleGain: -2, reverbWet: 0.18, vinylCrackle: 0.2 }
  },
  {
    id: 'sleep',
    name: 'Sleep Lofi',
    description: 'Ultra soft, dark low-pass filter with gentle hypnotic tape saturation.',
    effects: { speed: 0.75, pitch: -7, lowPassFreq: 2800, bassGain: 4, trebleGain: -10, reverbWet: 0.4, tapeSaturation: 0.35 }
  },
  {
    id: 'retro_tape',
    name: 'Retro Tape',
    description: 'Nostalgic cassette tape warmth with flutter and audible hiss.',
    effects: { speed: 0.95, pitch: 0, lowPassFreq: 7000, tapeHiss: 0.45, tapeSaturation: 0.5, tapeFlutter: 0.35, tapeWow: 0.2 }
  }
];

const DEFAULT_EFFECTS: LofiEffects = {
  speed: 0.90,
  pitch: -2,
  lowPassFreq: 7000,
  highPassFreq: 80,
  bassGain: 2,
  trebleGain: -3,
  reverbWet: 0.25,
  reverbDecay: 2.0,
  delayWet: 0.15,
  delayTime: 0.3,
  delayFeedback: 0.3,
  vinylCrackle: 0.25,
  vinylHiss: 0.15,
  vinylPop: 0.1,
  tapeHiss: 0.15,
  tapeSaturation: 0.2,
  tapeWow: 0.15,
  tapeFlutter: 0.1,
  stereoWidth: 1.0,
  volume: 0.9
};

const DEFAULT_CREATOR_SETTINGS: CreatorSettings = {
  bpm: 78,
  key: 'A',
  scale: 'minor',
  mood: 'chill',
  durationSec: 120,
  instrument: 'soft_piano',
  swing: 0.3,
  seed: 'lofi-78-a-minor',
  enableDrums: true,
  enableBass: true,
  enableChords: true,
  enableMelody: true
};

const DEFAULT_VIDEO_SETTINGS: VideoMakerSettings = {
  aspectRatio: '16:9',
  bgType: 'cozy_room',
  bgColor: '#0f172a',
  bgGradient1: '#1e1b4b',
  bgGradient2: '#0f172a',
  bgImage: null,
  bgBlur: 2,
  bgBrightness: 80,
  showCover: true,
  coverImage: null,
  titleText: 'Midnight Chill Lofi',
  artistText: 'Zubware Lofi Studio',
  taglineText: 'LOFI • STUDY & RELAX',
  visualizerMode: 'waveform',
  visualizerColor: '#facc15'
};

// ============================================================================
// MAIN COMPONENT: LofiMusicStudioTool
// ============================================================================

export function LofiMusicStudioTool({
  onShowToast,
  onNavigate
}: {
  onShowToast: (msg: string) => void;
  onNavigate?: (path: string) => void;
}) {
  // Mode & Effect State
  const [mode, setMode] = useState<StudioMode>('transform');
  const [effects, setEffects] = useState<LofiEffects>(DEFAULT_EFFECTS);
  const [ambience, setAmbience] = useState<AmbienceSettings>({ type: 'rain', volume: 0.3, muted: false });
  const [creator, setCreator] = useState<CreatorSettings>(DEFAULT_CREATOR_SETTINGS);
  const [videoSettings, setVideoSettings] = useState<VideoMakerSettings>(DEFAULT_VIDEO_SETTINGS);

  // Audio Data State
  const [loadedFileName, setLoadedFileName] = useState<string | null>(null);
  const [audioDuration, setAudioDuration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isAbOriginal, setIsAbOriginal] = useState<boolean>(false);
  const [activePresetId, setActivePresetId] = useState<string | null>('classic');

  // Creator state
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedSuccessMsg, setGeneratedSuccessMsg] = useState<string | null>(null);

  // Render & Export State
  const [isExportingAudio, setIsExportingAudio] = useState<boolean>(false);
  const [isExportingVideo, setIsExportingVideo] = useState<boolean>(false);
  const [exportProgress, setExportProgress] = useState<number>(0);
  const [renderStatusMsg, setRenderStatusMsg] = useState<string>('');
  const [exportedAudioUrl, setExportedAudioUrl] = useState<string | null>(null);
  const [renderedFileSizeMb, setRenderedFileSizeMb] = useState<string>('0 MB');
  const [renderedAudioDuration, setRenderedAudioDuration] = useState<number>(0);
  const [exportedVideoUrl, setExportedVideoUrl] = useState<string | null>(null);

  // Audio References
  const audioBufferRef = useRef<AudioBuffer | null>(null);
  const renderedBufferRef = useRef<AudioBuffer | null>(null);
  const liveAudioCtxRef = useRef<AudioContext | null>(null);
  const liveSourceRef = useRef<AudioBufferSourceNode | null>(null);

  // DOM Refs
  const waveformCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const audioPreviewRef = useRef<HTMLAudioElement | null>(null);

  // Clean up Object URLs on unmount
  useEffect(() => {
    return () => {
      if (exportedAudioUrl) URL.revokeObjectURL(exportedAudioUrl);
      if (exportedVideoUrl) URL.revokeObjectURL(exportedVideoUrl);
      if (liveAudioCtxRef.current) liveAudioCtxRef.current.close();
    };
  }, []);

  // --------------------------------------------------------------------------
  // FILE UPLOAD HANDLER (Mode 1)
  // --------------------------------------------------------------------------

  const handleAudioUpload = async (file: File) => {
    if (!file) return;
    try {
      onShowToast(`Loading ${file.name}...`);
      const arrayBuffer = await file.arrayBuffer();

      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const tempCtx = new AudioCtxClass();
      if (tempCtx.state === 'suspended') {
        await tempCtx.resume();
      }

      const decodedBuffer = await tempCtx.decodeAudioData(arrayBuffer);
      const val = validateAudioBuffer(decodedBuffer);

      if (!val.valid) {
        onShowToast(`Invalid audio file: ${val.error || 'Empty audio data.'}`);
        tempCtx.close();
        return;
      }

      audioBufferRef.current = decodedBuffer;
      setAudioDuration(decodedBuffer.duration);
      setLoadedFileName(file.name);
      setCurrentTime(0);
      setExportedAudioUrl(null); // Reset previous render
      setRenderedFileSizeMb('0 MB');

      onShowToast(`Successfully loaded ${file.name} (${Math.round(decodedBuffer.duration)}s)`);
      drawWaveform(decodedBuffer);
      tempCtx.close();
    } catch (err) {
      console.error('Audio decode error:', err);
      onShowToast('Could not decode audio file. Please try another MP3 or WAV file.');
    }
  };

  // Draw static waveform on canvas
  const drawWaveform = (buffer: AudioBuffer) => {
    const canvas = waveformCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = (canvas.width = canvas.parentElement?.clientWidth || 800);
    const height = (canvas.height = 100);

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, width, height);

    const channelData = buffer.getChannelData(0);
    const step = Math.ceil(channelData.length / width);
    const amp = height / 2;

    ctx.fillStyle = '#38bdf8';

    for (let i = 0; i < width; i++) {
      let min = 1.0;
      let max = -1.0;
      for (let j = 0; j < step; j++) {
        const datum = channelData[i * step + j];
        if (datum < min) min = datum;
        if (datum > max) max = datum;
      }
      ctx.fillRect(i, (1 + min) * amp, 1, Math.max(1, (max - min) * amp));
    }
  };

  // --------------------------------------------------------------------------
  // PRESET SELECTION
  // --------------------------------------------------------------------------

  const handleApplyPreset = (presetId: string) => {
    const p = LOFI_PRESETS.find(x => x.id === presetId);
    if (!p) return;

    setEffects(prev => ({ ...prev, ...p.effects }));
    setActivePresetId(presetId);
    onShowToast(`Applied ${p.name} preset!`);
  };

  const handleMakeItLofi = () => {
    handleApplyPreset('classic');
    handleExportWav();
  };

  // --------------------------------------------------------------------------
  // LIVE PREVIEW PLAYBACK
  // --------------------------------------------------------------------------

  const toggleLivePlayback = async () => {
    if (isPlaying) {
      if (liveSourceRef.current) {
        try { liveSourceRef.current.stop(); } catch {}
      }
      setIsPlaying(false);
      return;
    }

    const buf = renderedBufferRef.current || audioBufferRef.current;
    if (!buf && mode === 'transform') {
      onShowToast('Please upload an audio file first.');
      return;
    }

    try {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!liveAudioCtxRef.current) {
        liveAudioCtxRef.current = new AudioCtxClass();
      }
      const ctx = liveAudioCtxRef.current;
      if (ctx.state === 'suspended') {
        await ctx.resume();
      }

      if (mode === 'creator' && !buf) {
        // Synthesize quick live preview buffer
        onShowToast('Synthesizing Lofi track for preview...');
        const synBuf = await synthesizeOriginalLofiTrack({ creator });
        audioBufferRef.current = synBuf;
        setAudioDuration(synBuf.duration);
        drawWaveform(synBuf);
      }

      const activeBuf = audioBufferRef.current;
      if (!activeBuf) return;

      const source = ctx.createBufferSource();
      source.buffer = activeBuf;
      source.playbackRate.value = isAbOriginal ? 1.0 : effects.speed;
      if (!isAbOriginal && effects.pitch !== 0) {
        source.detune.value = effects.pitch * 100;
      }

      source.connect(ctx.destination);
      source.start(0);
      liveSourceRef.current = source;
      setIsPlaying(true);

      source.onended = () => {
        setIsPlaying(false);
      };
    } catch (err) {
      console.error('Live playback error:', err);
      onShowToast('Error playing live audio.');
    }
  };

  // --------------------------------------------------------------------------
  // ORIGINAL LOFI CREATOR GENERATION (Mode 2)
  // --------------------------------------------------------------------------

  const handleGenerateOriginalLofi = async () => {
    try {
      setIsGenerating(true);
      setRenderStatusMsg('Composing original track...');
      onShowToast('Synthesizing original Lofi track in browser...');

      const synBuf = await synthesizeOriginalLofiTrack({
        creator,
        onProgress: (msg, pct) => setRenderStatusMsg(msg)
      });

      audioBufferRef.current = synBuf;
      setAudioDuration(synBuf.duration);
      setLoadedFileName(`Original Lofi (${creator.key} ${creator.scale} - ${creator.bpm} BPM)`);
      setGeneratedSuccessMsg(`Generated ${creator.durationSec}s original Lofi beat in ${creator.key} ${creator.scale}!`);

      drawWaveform(synBuf);
      onShowToast(`Generated original Lofi track in ${creator.key} ${creator.scale}! Click "EXPORT AUDIO" to render WAV.`);
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'Generation failed';
      console.error('Original Lofi generation error:', err);
      onShowToast(`Generation error: ${errMsg}`);
    } finally {
      setIsGenerating(false);
    }
  };

  // --------------------------------------------------------------------------
  // AUDIO RENDERING & PCM WAV EXPORT (CORE FIX)
  // --------------------------------------------------------------------------

  const handleExportWav = async () => {
    try {
      setIsExportingAudio(true);
      setExportProgress(5);
      setRenderStatusMsg('Preparing audio rendering pipeline...');
      onShowToast('Preparing Lofi audio rendering...');

      let inputBuf: AudioBuffer | null = null;

      if (mode === 'transform') {
        if (!audioBufferRef.current) {
          onShowToast('Please upload an audio file first or switch to Mode 2.');
          setIsExportingAudio(false);
          return;
        }
        inputBuf = audioBufferRef.current;
      } else {
        if (!audioBufferRef.current) {
          setRenderStatusMsg('Composing original Lofi track...');
          onShowToast('Composing original Lofi track...');
          inputBuf = await synthesizeOriginalLofiTrack({
            creator,
            onProgress: (msg, pct) => {
              setRenderStatusMsg(msg);
              setExportProgress(Math.min(40, Math.round(pct * 0.4)));
            }
          });
          audioBufferRef.current = inputBuf;
          setAudioDuration(inputBuf.duration);
          drawWaveform(inputBuf);
        } else {
          inputBuf = audioBufferRef.current;
        }
      }

      if (!inputBuf) {
        throw new Error('No input audio buffer found.');
      }

      // 1. Validate Input Buffer
      const inputVal = validateAudioBuffer(inputBuf);
      if (!inputVal.valid) {
        throw new Error(inputVal.error || 'Input audio buffer is invalid.');
      }

      setRenderStatusMsg('Rendering Lofi effects offline...');
      onShowToast('Rendering offline audio graph with vintage Lofi effects...');

      // 2. Offline Audio Graph Rendering
      const renderedBuffer = await renderLofiAudioOffline({
        inputBuffer: inputBuf,
        effects,
        ambience,
        onProgress: (msg, pct) => {
          setRenderStatusMsg(msg);
          setExportProgress(40 + Math.round(pct * 0.4));
        }
      });

      // 3. Mandatory Audio Quality Inspection on Rendered Output Buffer
      const renderedVal = validateAudioBuffer(renderedBuffer);
      if (
        !renderedVal.valid ||
        renderedVal.maxAmplitude <= 0.00001 ||
        renderedVal.rms <= 0.00001 ||
        renderedBuffer.duration <= 0.1
      ) {
        if (exportedAudioUrl) {
          URL.revokeObjectURL(exportedAudioUrl);
          setExportedAudioUrl(null);
        }
        const qualityErrorMsg =
          renderedVal.error ||
          'Mandatory quality check failed: audio buffer is silent, invalid duration, or has zero RMS level.';
        throw new Error(qualityErrorMsg);
      }

      renderedBufferRef.current = renderedBuffer;

      setRenderStatusMsg('Encoding PCM 16-bit WAV file...');
      setExportProgress(85);

      // 4. Encode to 16-Bit PCM WAV ArrayBuffer
      const wavArrayBuffer = encodeAudioBufferToWav(renderedBuffer);
      const blob = new Blob([wavArrayBuffer], { type: 'audio/wav' });

      if (blob.size < 1000) {
        if (exportedAudioUrl) {
          URL.revokeObjectURL(exportedAudioUrl);
          setExportedAudioUrl(null);
        }
        throw new Error('Generated WAV file is empty or corrupted.');
      }

      // Clean up previous URL
      if (exportedAudioUrl) {
        URL.revokeObjectURL(exportedAudioUrl);
      }

      const url = URL.createObjectURL(blob);
      setExportedAudioUrl(url);
      const sizeMb = (blob.size / (1024 * 1024)).toFixed(2);
      setRenderedFileSizeMb(`${sizeMb} MB`);
      setRenderedAudioDuration(renderedBuffer.duration);

      setExportProgress(100);
      setRenderStatusMsg('Song rendered successfully!');
      onShowToast(`Audio rendered successfully! Size: ${sizeMb} MB. Ready to download.`);

      // Automatically reload preview player if attached
      if (audioPreviewRef.current) {
        audioPreviewRef.current.load();
      }
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'Audio rendering error';
      console.error('WAV Export Error:', err);
      if (exportedAudioUrl) {
        URL.revokeObjectURL(exportedAudioUrl);
        setExportedAudioUrl(null);
      }
      onShowToast(`Export blocked: ${errMsg}`);
      setRenderStatusMsg(`Rendering failed: ${errMsg}`);
    } finally {
      setIsExportingAudio(false);
    }
  };

  // --------------------------------------------------------------------------
  // VIDEO EXPORT HANDLER
  // --------------------------------------------------------------------------

  const handleExportLofiVideo = async () => {
    try {
      setIsExportingVideo(true);
      setExportProgress(10);
      onShowToast('Generating Lofi Video preview...');

      let buf = renderedBufferRef.current || audioBufferRef.current;
      if (!buf && mode === 'creator') {
        buf = await synthesizeOriginalLofiTrack({ creator });
        audioBufferRef.current = buf;
      }

      if (!buf) {
        onShowToast('Please upload an audio file or generate a beat first.');
        setIsExportingVideo(false);
        return;
      }

      const canvas = videoCanvasRef.current;
      if (!canvas) {
        throw new Error('Canvas not found.');
      }

      // Set Canvas Dimensions according to format
      if (videoSettings.aspectRatio === '9:16') {
        canvas.width = 720;
        canvas.height = 1280;
      } else if (videoSettings.aspectRatio === '1:1') {
        canvas.width = 800;
        canvas.height = 800;
      } else {
        canvas.width = 1280;
        canvas.height = 720;
      }

      const recordDuration = Math.min(15, buf.duration);
      const stream = canvas.captureStream(30);

      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const audioCtx = new AudioCtxClass();
      const source = audioCtx.createBufferSource();
      source.buffer = buf;
      const dest = audioCtx.createMediaStreamDestination();
      source.connect(dest);

      const combinedStream = new MediaStream([
        ...stream.getVideoTracks(),
        ...dest.stream.getAudioTracks()
      ]);

      const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus')
        ? 'video/webm;codecs=vp9,opus'
        : MediaRecorder.isTypeSupported('video/webm')
        ? 'video/webm'
        : 'video/mp4';

      const recorder = new MediaRecorder(combinedStream, { mimeType });
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = () => {
        const videoBlob = new Blob(chunks, { type: mimeType });
        if (exportedVideoUrl) URL.revokeObjectURL(exportedVideoUrl);
        const videoUrl = URL.createObjectURL(videoBlob);
        setExportedVideoUrl(videoUrl);
        setIsExportingVideo(false);
        setExportProgress(100);
        onShowToast(`Lofi Video created! (${(videoBlob.size / (1024 * 1024)).toFixed(2)} MB)`);
      };

      source.start(0);
      recorder.start();

      const ctx = canvas.getContext('2d');
      let frame = 0;
      const totalFrames = recordDuration * 30;

      const interval = setInterval(() => {
        frame++;
        setExportProgress(Math.min(95, Math.round((frame / totalFrames) * 100)));

        if (ctx) {
          const w = canvas.width;
          const h = canvas.height;

          // Background
          ctx.fillStyle = videoSettings.bgColor || '#0f172a';
          ctx.fillRect(0, 0, w, h);

          // Cozy Lofi Visualizer Circle
          ctx.beginPath();
          ctx.arc(w / 2, h / 2 - 30, Math.min(w, h) * 0.2, 0, Math.PI * 2);
          ctx.fillStyle = '#1e293b';
          ctx.fill();
          ctx.strokeStyle = videoSettings.visualizerColor || '#facc15';
          ctx.lineWidth = 4;
          ctx.stroke();

          // Title Text
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 32px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(videoSettings.titleText || 'Lofi Chill', w / 2, h / 2 + 100);

          ctx.fillStyle = '#94a3b8';
          ctx.font = '20px sans-serif';
          ctx.fillText(videoSettings.artistText || 'Zubware Lofi Studio', w / 2, h / 2 + 140);

          // Visualizer Bars
          const barCount = 24;
          const barWidth = 8;
          const barGap = 6;
          const startX = (w - (barCount * (barWidth + barGap))) / 2;
          ctx.fillStyle = videoSettings.visualizerColor || '#facc15';

          for (let i = 0; i < barCount; i++) {
            const barH = Math.abs(Math.sin((frame + i * 5) * 0.12)) * 50 + 10;
            ctx.fillRect(startX + i * (barWidth + barGap), h / 2 - 30 - barH / 2, barWidth, barH);
          }
        }

        if (frame >= totalFrames) {
          clearInterval(interval);
          source.stop();
          recorder.stop();
          audioCtx.close();
        }
      }, 1000 / 30);
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'Failed';
      console.error('Video export error:', err);
      onShowToast(`Video export error: ${errMsg}`);
      setIsExportingVideo(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 text-slate-100">
      <SEOHead
        title="Lofi Music Studio - Create Original Lofi Beats & Transform Audio | Zubware"
        description="Transform songs with vintage Lofi effects or generate original chill Lofi music from scratch in your browser. Add vinyl crackle, tape saturation, rainy ambience & export PCM WAV audio or video."
        canonicalPath="/lofi-song-maker.html"
      />

      <Breadcrumb
        items={[
          { label: 'Home', path: '/' },
          { label: 'Audio Tools', path: '/category/audio-tools' },
          { label: 'Lofi Music Studio' }
        ]}
      />

      {/* HEADER HERO */}
      <div className="p-6 md:p-8 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Headphones size={200} className="text-amber-400" />
        </div>
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles size={14} /> 100% Client-Side Lofi Music Studio
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Lofi Music Studio
          </h1>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            Transform your uploaded tracks with vintage tape warmth & vinyl crackle, or compose brand-new, original Lofi music directly inside your browser with high quality PCM WAV export.
          </p>
        </div>
      </div>

      {/* MODE SWITCHER TABS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={() => {
            setMode('transform');
            onShowToast('Switched to Lofi Song Maker Mode');
          }}
          className={`p-5 rounded-xl border text-left transition-all flex items-start gap-4 ${
            mode === 'transform'
              ? 'bg-amber-500/15 border-amber-500/50 shadow-lg shadow-amber-500/5'
              : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/80'
          }`}
        >
          <div className={`p-3 rounded-xl ${mode === 'transform' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-amber-400'}`}>
            <Headphones size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              MODE 1: 🎧 LOFI SONG MAKER
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Upload your own audio track and apply vintage tape, vinyl crackle, pitch shifts, and rain ambiance.
            </p>
          </div>
        </button>

        <button
          onClick={() => {
            setMode('creator');
            onShowToast('Switched to Original Lofi Creator Mode');
          }}
          className={`p-5 rounded-xl border text-left transition-all flex items-start gap-4 ${
            mode === 'creator'
              ? 'bg-purple-500/15 border-purple-500/50 shadow-lg shadow-purple-500/5'
              : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/80'
          }`}
        >
          <div className={`p-3 rounded-xl ${mode === 'creator' ? 'bg-purple-500 text-slate-950' : 'bg-slate-800 text-purple-400'}`}>
            <Music size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              MODE 2: 🎹 ORIGINAL LOFI CREATOR
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Synthesize original Lofi beats, chords, and melodies from scratch without uploading existing songs.
            </p>
          </div>
        </button>
      </div>

      {/* MAIN TOOL WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* LEFT / CENTER PANEL */}
        <div className="lg:col-span-8 space-y-6">

          {/* MODE 1: FILE UPLOAD & PLAYER */}
          {mode === 'transform' && (
            <div className="p-6 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-slate-800 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <FileAudio className="text-amber-400" /> Audio Source
                  </h2>
                  <p className="text-xs text-slate-400">Upload your track (MP3, WAV, OGG, M4A, WEBM)</p>
                </div>

                <button
                  onClick={handleMakeItLofi}
                  disabled={isExportingAudio}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-all shadow-md flex items-center gap-2 disabled:opacity-50"
                >
                  <Sparkles size={16} /> MAKE IT LOFI
                </button>
              </div>

              {/* DRAG & DROP UPLOAD AREA */}
              {!loadedFileName ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="p-8 border-2 border-dashed border-slate-700 hover:border-amber-500/50 rounded-2xl bg-slate-950/40 hover:bg-slate-900/50 transition-all text-center cursor-pointer space-y-3"
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={e => e.target.files?.[0] && handleAudioUpload(e.target.files[0])}
                    accept="audio/*"
                    className="hidden"
                  />
                  <div className="w-14 h-14 mx-auto rounded-full bg-slate-800 flex items-center justify-center text-amber-400">
                    <Upload size={28} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">Click or drag audio file here</p>
                    <p className="text-xs text-slate-400 mt-1">Supports MP3, WAV, OGG, AAC, M4A, WEBM</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <Disc size={20} className="text-amber-400 animate-spin-slow shrink-0" />
                      <span className="text-sm font-semibold text-white truncate">{loadedFileName}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setIsAbOriginal(!isAbOriginal)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                          isAbOriginal
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        A/B: {isAbOriginal ? 'ORIGINAL' : 'LOFI'}
                      </button>

                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
                        title="Change audio file"
                      >
                        <RefreshCw size={16} />
                      </button>
                    </div>
                  </div>

                  {/* WAVEFORM DISPLAY */}
                  <div className="relative p-3 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden">
                    <canvas ref={waveformCanvasRef} className="w-full h-24 rounded-lg block" />
                  </div>

                  {/* PLAYER CONTROLS */}
                  <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={toggleLivePlayback}
                        className="p-3 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-all shadow-md"
                      >
                        {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                      </button>

                      <button
                        onClick={() => setCurrentTime(0)}
                        className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300"
                      >
                        <RotateCcw size={18} />
                      </button>
                    </div>

                    <div className="text-xs font-mono text-slate-400">
                      Duration: {Math.floor(audioDuration / 60)}:{(Math.floor(audioDuration % 60)).toString().padStart(2, '0')}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* MODE 2: ORIGINAL LOFI CREATOR SETUP */}
          {mode === 'creator' && (
            <div className="p-6 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-slate-800 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Music className="text-purple-400" /> Algorithmic Lofi Synthesizer
                  </h2>
                  <p className="text-xs text-slate-400">Generate original beats without uploading copyrighted music</p>
                </div>

                <button
                  onClick={handleGenerateOriginalLofi}
                  disabled={isGenerating}
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm transition-all shadow-md flex items-center gap-2 disabled:opacity-50"
                >
                  <Sparkles size={16} /> {isGenerating ? 'SYNTHESIZING...' : 'GENERATE BEAT'}
                </button>
              </div>

              {generatedSuccessMsg && (
                <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs flex items-center gap-2">
                  <CheckCircle2 size={16} /> {generatedSuccessMsg}
                </div>
              )}

              {/* CREATOR PARAMETERS GRID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {/* BPM */}
                <div className="space-y-1.5 p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                    <span>BPM (Tempo)</span>
                    <span className="text-purple-400 font-mono">{creator.bpm} BPM</span>
                  </label>
                  <input
                    type="range"
                    min="60"
                    max="120"
                    value={creator.bpm}
                    onChange={e => setCreator({ ...creator, bpm: Number(e.target.value) })}
                    className="w-full accent-purple-500 h-1.5 rounded-lg bg-slate-800 cursor-pointer"
                  />
                </div>

                {/* KEY */}
                <div className="space-y-1.5 p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <label className="text-xs font-semibold text-slate-300">Musical Key</label>
                  <select
                    value={creator.key}
                    onChange={e => setCreator({ ...creator, key: e.target.value })}
                    className="w-full bg-slate-900 text-white text-xs rounded-lg p-2 border border-slate-700"
                  >
                    {['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'].map(k => (
                      <option key={k} value={k}>{k} Minor / Major</option>
                    ))}
                  </select>
                </div>

                {/* INSTRUMENT */}
                <div className="space-y-1.5 p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <label className="text-xs font-semibold text-slate-300">Lead Instrument</label>
                  <select
                    value={creator.instrument}
                    onChange={e => setCreator({ ...creator, instrument: e.target.value as CreatorSettings['instrument'] })}
                    className="w-full bg-slate-900 text-white text-xs rounded-lg p-2 border border-slate-700"
                  >
                    <option value="soft_piano">Soft Piano</option>
                    <option value="electric_piano">Electric Piano (Rhodes)</option>
                    <option value="warm_keys">Warm Vintage Keys</option>
                    <option value="synth_pad">Analog Synth Pad</option>
                    <option value="pluck">Pluck / Kalimba</option>
                    <option value="bell">Soft Music Box Bell</option>
                  </select>
                </div>

                {/* DURATION */}
                <div className="space-y-1.5 p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <label className="text-xs font-semibold text-slate-300">Track Duration</label>
                  <select
                    value={creator.durationSec}
                    onChange={e => setCreator({ ...creator, durationSec: Number(e.target.value) })}
                    className="w-full bg-slate-900 text-white text-xs rounded-lg p-2 border border-slate-700"
                  >
                    <option value="30">30 Seconds</option>
                    <option value="60">1 Minute</option>
                    <option value="120">2 Minutes</option>
                    <option value="180">3 Minutes</option>
                    <option value="300">5 Minutes</option>
                  </select>
                </div>
              </div>

              {/* TRACK COMPONENT TOGGLES */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Generated Layers</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                    <input
                      type="checkbox"
                      checked={creator.enableDrums}
                      onChange={e => setCreator({ ...creator, enableDrums: e.target.checked })}
                      className="rounded accent-purple-500"
                    />
                    Lofi Drums
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                    <input
                      type="checkbox"
                      checked={creator.enableBass}
                      onChange={e => setCreator({ ...creator, enableBass: e.target.checked })}
                      className="rounded accent-purple-500"
                    />
                    Warm Bass
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                    <input
                      type="checkbox"
                      checked={creator.enableChords}
                      onChange={e => setCreator({ ...creator, enableChords: e.target.checked })}
                      className="rounded accent-purple-500"
                    />
                    7th Chords
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                    <input
                      type="checkbox"
                      checked={creator.enableMelody}
                      onChange={e => setCreator({ ...creator, enableMelody: e.target.checked })}
                      className="rounded accent-purple-500"
                    />
                    Melody Line
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* RENDERED AUDIO PREVIEW & DOWNLOAD CARD */}
          <div className="p-6 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-slate-800 space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Download className="text-emerald-400" /> Exported Audio Preview
              </span>
              {renderedFileSizeMb !== '0 MB' && (
                <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-mono font-semibold">
                  {renderedFileSizeMb} • {Math.round(renderedAudioDuration)}s
                </span>
              )}
            </h2>

            {isExportingAudio && (
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex justify-between text-xs text-amber-400 font-semibold">
                  <span>{renderStatusMsg || 'Rendering audio...'}</span>
                  <span>{exportProgress}%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-500 h-full transition-all duration-300"
                    style={{ width: `${exportProgress}%` }}
                  />
                </div>
              </div>
            )}

            {exportedAudioUrl ? (
              <div className="space-y-4 p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
                  <CheckCircle2 size={16} /> Song rendered successfully!
                </div>

                {/* HTML5 Audio Player for previewing rendered WAV */}
                <audio
                  ref={audioPreviewRef}
                  src={exportedAudioUrl}
                  controls
                  className="w-full rounded-lg bg-slate-900 border border-slate-800"
                />

                <a
                  href={exportedAudioUrl}
                  download={`${loadedFileName ? loadedFileName.replace(/\.[^/.]+$/, '') : 'zubware_lofi'}_render.wav`}
                  className="block w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-center text-sm transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  <Download size={18} /> Download Rendered Lofi Audio (WAV - {renderedFileSizeMb})
                </a>
              </div>
            ) : (
              <div className="p-6 rounded-xl bg-slate-950/40 border border-slate-800/80 text-center text-slate-400 text-xs space-y-1">
                <p>No audio rendered yet.</p>
                <p>Click "MAKE IT LOFI" or "Export Audio (WAV)" to render your track with effects.</p>
              </div>
            )}
          </div>

          {/* LOFI VIDEO MAKER & VISUALIZER */}
          <div className="p-6 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-slate-800 space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Video className="text-cyan-400" /> Lofi Video Maker & Visualizer
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <label className="text-xs font-semibold text-slate-300">Video Aspect Ratio</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['16:9', '9:16', '1:1'] as const).map(fmt => (
                    <button
                      key={fmt}
                      onClick={() => setVideoSettings({ ...videoSettings, aspectRatio: fmt })}
                      className={`p-2 rounded-lg text-xs font-bold border ${
                        videoSettings.aspectRatio === fmt
                          ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {fmt === '16:9' ? '16:9 YT' : fmt === '9:16' ? '9:16 Shorts' : '1:1 Square'}
                    </button>
                  ))}
                </div>

                <div className="space-y-2 pt-2">
                  <label className="text-xs font-semibold text-slate-300">Track Title Overlay</label>
                  <input
                    type="text"
                    value={videoSettings.titleText}
                    onChange={e => setVideoSettings({ ...videoSettings, titleText: e.target.value })}
                    className="w-full bg-slate-900 text-white text-xs rounded-lg p-2 border border-slate-800"
                  />
                </div>
              </div>

              {/* VIDEO PREVIEW CANVAS */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center min-h-[160px] relative overflow-hidden">
                <canvas ref={videoCanvasRef} className="hidden" />
                <div className="text-center space-y-2 z-10">
                  <Disc size={32} className="mx-auto text-amber-400 animate-spin-slow" />
                  <p className="text-sm font-bold text-white">{videoSettings.titleText}</p>
                  <p className="text-xs text-slate-400">{videoSettings.artistText}</p>
                </div>
              </div>
            </div>

            {exportedVideoUrl && (
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <p className="text-xs text-cyan-400 font-semibold flex items-center gap-1.5">
                  <CheckCircle2 size={16} /> Video preview ready!
                </p>
                <video src={exportedVideoUrl} controls className="w-full rounded-lg max-h-60" />
                <a
                  href={exportedVideoUrl}
                  download="zubware_lofi_video.webm"
                  className="block w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-center text-xs transition-all shadow-md"
                >
                  Download Lofi Video (WebM/MP4)
                </a>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT PANEL: LOFI CONTROLS & PRESET TABS */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-slate-800 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Sliders size={18} className="text-amber-400" /> Lofi Effects & Tuning
              </h3>
            </div>

            {/* PRESETS LIST */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Quick Presets</label>
              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                {LOFI_PRESETS.map(preset => (
                  <button
                    key={preset.id}
                    onClick={() => handleApplyPreset(preset.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all text-xs ${
                      activePresetId === preset.id
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <p className="truncate">{preset.name}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* EFFECT SLIDERS */}
            <div className="space-y-4 pt-2 border-t border-slate-800">
              {/* SPEED & PITCH */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-slate-300">
                  <span>Playback Speed</span>
                  <span className="text-amber-400 font-mono">{effects.speed.toFixed(2)}x</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="1.2"
                  step="0.01"
                  value={effects.speed}
                  onChange={e => setEffects({ ...effects, speed: Number(e.target.value) })}
                  className="w-full accent-amber-500 h-1.5 rounded-lg bg-slate-800 cursor-pointer"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-slate-300">
                  <span>Pitch Shift</span>
                  <span className="text-amber-400 font-mono">{effects.pitch > 0 ? `+${effects.pitch}` : effects.pitch} ST</span>
                </div>
                <input
                  type="range"
                  min="-12"
                  max="12"
                  step="1"
                  value={effects.pitch}
                  onChange={e => setEffects({ ...effects, pitch: Number(e.target.value) })}
                  className="w-full accent-amber-500 h-1.5 rounded-lg bg-slate-800 cursor-pointer"
                />
              </div>

              {/* LOW PASS FILTER */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-slate-300">
                  <span>Low-Pass Filter (Muffle)</span>
                  <span className="text-amber-400 font-mono">{effects.lowPassFreq} Hz</span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="12000"
                  step="100"
                  value={effects.lowPassFreq}
                  onChange={e => setEffects({ ...effects, lowPassFreq: Number(e.target.value) })}
                  className="w-full accent-amber-500 h-1.5 rounded-lg bg-slate-800 cursor-pointer"
                />
              </div>

              {/* VINYL CRACKLE */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-slate-300">
                  <span>Vinyl Crackle & Pops</span>
                  <span className="text-amber-400 font-mono">{Math.round(effects.vinylCrackle * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={effects.vinylCrackle}
                  onChange={e => setEffects({ ...effects, vinylCrackle: Number(e.target.value) })}
                  className="w-full accent-amber-500 h-1.5 rounded-lg bg-slate-800 cursor-pointer"
                />
              </div>

              {/* TAPE SATURATION */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-slate-300">
                  <span>Tape Saturation & Flutter</span>
                  <span className="text-amber-400 font-mono">{Math.round(effects.tapeSaturation * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={effects.tapeSaturation}
                  onChange={e => setEffects({ ...effects, tapeSaturation: Number(e.target.value) })}
                  className="w-full accent-amber-500 h-1.5 rounded-lg bg-slate-800 cursor-pointer"
                />
              </div>

              {/* REVERB */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-slate-300">
                  <span>Space Reverb</span>
                  <span className="text-amber-400 font-mono">{Math.round(effects.reverbWet * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={effects.reverbWet}
                  onChange={e => setEffects({ ...effects, reverbWet: Number(e.target.value) })}
                  className="w-full accent-amber-500 h-1.5 rounded-lg bg-slate-800 cursor-pointer"
                />
              </div>
            </div>

            {/* AMBIENCE SOUND SELECTOR */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Background Ambience</label>
              <select
                value={ambience.type}
                onChange={e => setAmbience({ ...ambience, type: e.target.value as AmbienceSettings['type'] })}
                className="w-full bg-slate-950 text-white text-xs rounded-xl p-2.5 border border-slate-800"
              >
                <option value="none">None</option>
                <option value="rain">Cozy Rain & Thunder</option>
                <option value="night">Night Crickets</option>
                <option value="cafe">Coffee Shop Ambience</option>
                <option value="fireplace">Crackling Fireplace</option>
              </select>
            </div>

            {/* EXPORT ACTION BUTTONS */}
            <div className="space-y-2 pt-4 border-t border-slate-800">
              <button
                onClick={handleExportWav}
                disabled={isExportingAudio}
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Download size={18} /> {isExportingAudio ? 'Rendering Audio...' : 'Export Audio (WAV)'}
              </button>

              <button
                onClick={handleExportLofiVideo}
                disabled={isExportingVideo}
                className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm transition-all border border-slate-700 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Video size={18} /> {isExportingVideo ? 'Generating Video...' : 'Export Lofi Video'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* PRIVACY & LOCAL PROCESSING NOTICE */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 text-xs text-slate-400 flex items-center gap-3">
        <ShieldCheck size={20} className="text-emerald-400 shrink-0" />
        <span>
          <strong>100% Privacy & Local Processing:</strong> Your audio files and synthesized tracks are processed entirely locally in your browser using the Web Audio API. Nothing is uploaded to any server.
        </span>
      </div>

      {/* FAQ SECTION */}
      <div className="p-6 md:p-8 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-slate-800 space-y-6">
        <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
          <HelpCircle className="text-amber-400" /> Frequently Asked Questions
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-300">
          <div className="space-y-2">
            <h3 className="font-bold text-sm text-white">What format is exported?</h3>
            <p>Audio is exported as an uncompressed, studio-quality 16-bit PCM WAV file encoded client-side in your browser.</p>
          </div>

          <div className="space-y-2">
            <h3 className="font-bold text-sm text-white">Can I create original Lofi music without uploading a song?</h3>
            <p>Yes! Mode 2 (Original Lofi Creator) uses algorithmic Web Audio synthesis to generate custom chords, melodies, drums, and basslines in any BPM and key.</p>
          </div>

          <div className="space-y-2">
            <h3 className="font-bold text-sm text-white">What Lofi effects are applied?</h3>
            <p>You can tweak playback speed, pitch shifting, low-pass filters, vinyl crackle & pop, tape saturation, wow & flutter, space reverb, and background ambiance like rain or fireplace sounds.</p>
          </div>

          <div className="space-y-2">
            <h3 className="font-bold text-sm text-white">Can I export a Lofi video for YouTube Shorts or Reels?</h3>
            <p>Yes, you can export your finished track as a video in 16:9, 9:16 Shorts, or 1:1 Square format complete with visualizers and track titles.</p>
          </div>
        </div>
      </div>

      <AdSlot type="banner" />
    </div>
  );
}
