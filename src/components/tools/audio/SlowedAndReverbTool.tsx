import React, { useState, useRef, useEffect } from 'react';
import {
  Upload,
  Music,
  Play,
  Pause,
  RotateCcw,
  Download,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  FileAudio,
  Volume2,
  Sliders,
  Disc,
  Info,
  ChevronDown,
  Trash2,
  Zap,
  Radio,
  ArrowRight
} from 'lucide-react';
import {
  processSlowedAndReverb,
  validateAudioBuffer,
  SlowedReverbOptions
} from '../../../lib/slowedReverbEngine';
import { encodeAudioBufferToMp3, encodeAudioBufferToWav } from '../../../lib/mp3Encoder';
import { getLinkUrl } from '../../../lib/paths';

interface SlowedAndReverbToolProps {
  onShowToast: (msg: string) => void;
  onNavigate?: (path: string) => void;
}

export function SlowedAndReverbTool({ onShowToast, onNavigate }: SlowedAndReverbToolProps) {
  // File & Audio State
  const [file, setFile] = useState<File | null>(null);
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
  const [originalAudioUrl, setOriginalAudioUrl] = useState<string | null>(null);
  const [isDecoding, setIsDecoding] = useState<boolean>(false);

  // Settings
  const [speed, setSpeed] = useState<number>(0.85); // Default 0.85x
  const [reverbPreset, setReverbPreset] = useState<'light' | 'medium' | 'deep'>('medium');
  const [masterVolume, setMasterVolume] = useState<number>(0.95);
  const [mp3Bitrate, setMp3Bitrate] = useState<number>(320); // 320 kbps

  // Processing & Export State
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processingStage, setProcessingStage] = useState<string>('');
  const [processingProgress, setProcessingProgress] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Rendered Output State
  const [renderedBuffer, setRenderedBuffer] = useState<AudioBuffer | null>(null);
  const [processedMp3Blob, setProcessedMp3Blob] = useState<Blob | null>(null);
  const [processedMp3Url, setProcessedMp3Url] = useState<string | null>(null);
  const [processedWavBlob, setProcessedWavBlob] = useState<Blob | null>(null);
  const [processedWavUrl, setProcessedWavUrl] = useState<string | null>(null);

  // Audio Playback Elements & Controls
  const originalAudioRef = useRef<HTMLAudioElement | null>(null);
  const processedAudioRef = useRef<HTMLAudioElement | null>(null);

  const [isPlayingOriginal, setIsPlayingOriginal] = useState<boolean>(false);
  const [originalCurrentTime, setOriginalCurrentTime] = useState<number>(0);
  const [originalDuration, setOriginalDuration] = useState<number>(0);

  const [isPlayingProcessed, setIsPlayingProcessed] = useState<boolean>(false);
  const [processedCurrentTime, setProcessedCurrentTime] = useState<number>(0);
  const [processedDuration, setProcessedDuration] = useState<number>(0);

  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const dropZoneRef = useRef<HTMLDivElement | null>(null);

  // Clean up Object URLs on unmount
  useEffect(() => {
    return () => {
      if (originalAudioUrl) URL.revokeObjectURL(originalAudioUrl);
      if (processedMp3Url) URL.revokeObjectURL(processedMp3Url);
      if (processedWavUrl) URL.revokeObjectURL(processedWavUrl);
    };
  }, []);

  // Format seconds to mm:ss
  const formatTime = (seconds: number): string => {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (!bytes || bytes <= 0) return '0 MB';
    const mb = bytes / (1024 * 1024);
    if (mb < 1) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${mb.toFixed(2)} MB`;
  };

  // Handle File Selection
  const handleFileChange = async (selectedFile: File) => {
    if (!selectedFile) return;

    // Check size limit (50MB)
    if (selectedFile.size > 50 * 1024 * 1024) {
      onShowToast('File size exceeds 50 MB limit. Please select a smaller song.');
      return;
    }

    // Reset previous audio states
    if (originalAudioUrl) URL.revokeObjectURL(originalAudioUrl);
    if (processedMp3Url) URL.revokeObjectURL(processedMp3Url);
    if (processedWavUrl) URL.revokeObjectURL(processedWavUrl);

    setFile(selectedFile);
    setAudioBuffer(null);
    setRenderedBuffer(null);
    setProcessedMp3Blob(null);
    setProcessedMp3Url(null);
    setProcessedWavBlob(null);
    setProcessedWavUrl(null);
    setErrorMessage(null);
    setIsPlayingOriginal(false);
    setIsPlayingProcessed(false);

    const origUrl = URL.createObjectURL(selectedFile);
    setOriginalAudioUrl(origUrl);

    setIsDecoding(true);
    setProcessingStage('Decoding audio file...');

    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const decodedBuffer = await audioCtx.decodeAudioData(arrayBuffer);

      const check = validateAudioBuffer(decodedBuffer);
      if (!check.valid) {
        throw new Error(check.error || 'Audio file decode failed or audio is silent.');
      }

      setAudioBuffer(decodedBuffer);
      setOriginalDuration(decodedBuffer.duration);
      onShowToast(`Loaded "${selectedFile.name}" successfully!`);
    } catch (err: any) {
      console.error('Audio decode error:', err);
      setFile(null);
      setAudioBuffer(null);
      setErrorMessage(err.message || 'Could not process this audio. Please try another file.');
      onShowToast('Could not decode audio. Please try an MP3, WAV, or OGG file.');
    } finally {
      setIsDecoding(false);
      setProcessingStage('');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // Process Slowed + Reverb
  const handleProcessAudio = async () => {
    if (!audioBuffer || !file) {
      onShowToast('Please upload an audio file first.');
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);
    setProcessingStage('PROCESSING...');
    setProcessingProgress(10);

    // Stop current playbacks
    if (originalAudioRef.current) originalAudioRef.current.pause();
    if (processedAudioRef.current) processedAudioRef.current.pause();
    setIsPlayingOriginal(false);
    setIsPlayingProcessed(false);

    try {
      const options: SlowedReverbOptions = {
        speed,
        reverbPreset,
        outputVolume: masterVolume
      };

      // 1. Process Offline Audio Context
      const rendered = await processSlowedAndReverb(audioBuffer, options, (stage, pct) => {
        setProcessingStage(stage.toUpperCase());
        setProcessingProgress(Math.min(75, pct));
      });

      setRenderedBuffer(rendered);
      setProcessedDuration(rendered.duration);

      // 2. Encode to MP3 (Primary Format)
      setProcessingStage('ENCODING MP3...');
      setProcessingProgress(80);

      const mp3Blob = await encodeAudioBufferToMp3(rendered, mp3Bitrate, (pct) => {
        setProcessingProgress(80 + Math.round(pct * 0.18));
      });

      if (!mp3Blob || mp3Blob.size < 500) {
        throw new Error('Encoded MP3 output was invalid or corrupted.');
      }

      // Clean up previous URLs
      if (processedMp3Url) URL.revokeObjectURL(processedMp3Url);
      if (processedWavUrl) URL.revokeObjectURL(processedWavUrl);

      const mp3Url = URL.createObjectURL(mp3Blob);
      setProcessedMp3Blob(mp3Blob);
      setProcessedMp3Url(mp3Url);

      // 3. Optional WAV Encoding
      const wavBlob = encodeAudioBufferToWav(rendered);
      const wavUrl = URL.createObjectURL(wavBlob);
      setProcessedWavBlob(wavBlob);
      setProcessedWavUrl(wavUrl);

      setProcessingProgress(100);
      setProcessingStage('READY');
      onShowToast('Slowed + Reverb song created successfully! 🎧');
    } catch (err: any) {
      console.error('Audio processing error:', err);
      const userErr = err?.message || 'Could not process this audio. Please try another file.';
      setErrorMessage(userErr);
      onShowToast(`Processing failed: ${userErr}`);
    } finally {
      setIsProcessing(false);
    }
  };

  // Download Handler
  const handleDownloadMp3 = () => {
    if (!processedMp3Url || !processedMp3Blob) return;
    const baseName = file ? file.name.replace(/\.[^/.]+$/, '') : 'song';
    const filename = `${baseName}-slowed-reverb.mp3`;

    const a = document.createElement('a');
    a.href = processedMp3Url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    onShowToast(`Downloading ${filename}...`);
  };

  const handleDownloadWav = () => {
    if (!processedWavUrl || !processedWavBlob) return;
    const baseName = file ? file.name.replace(/\.[^/.]+$/, '') : 'song';
    const filename = `${baseName}-slowed-reverb.wav`;

    const a = document.createElement('a');
    a.href = processedWavUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    onShowToast(`Downloading ${filename}...`);
  };

  // Audio Player Toggles
  const togglePlayOriginal = () => {
    if (!originalAudioRef.current) return;
    if (isPlayingOriginal) {
      originalAudioRef.current.pause();
      setIsPlayingOriginal(false);
    } else {
      if (processedAudioRef.current) {
        processedAudioRef.current.pause();
        setIsPlayingProcessed(false);
      }
      originalAudioRef.current.play()
        .then(() => {
          setIsPlayingOriginal(true);
        })
        .catch((err) => {
          console.warn('Playback error:', err);
          setIsPlayingOriginal(false);
          onShowToast('Could not start playback. Click the player to interact.');
        });
    }
  };

  const togglePlayProcessed = () => {
    if (!processedAudioRef.current) return;
    if (isPlayingProcessed) {
      processedAudioRef.current.pause();
      setIsPlayingProcessed(false);
    } else {
      if (originalAudioRef.current) {
        originalAudioRef.current.pause();
        setIsPlayingOriginal(false);
      }
      processedAudioRef.current.play()
        .then(() => {
          setIsPlayingProcessed(true);
        })
        .catch((err) => {
          console.warn('Playback error:', err);
          setIsPlayingProcessed(false);
          onShowToast('Could not start playback. Click the player to interact.');
        });
    }
  };

  // Calculate estimated MP3 output file size
  const estimatedDuration = audioBuffer ? audioBuffer.duration / speed : 0;
  const estimatedMp3SizeBytes = Math.round((estimatedDuration * (mp3Bitrate * 1000)) / 8);

  const faqs = [
    {
      question: 'What is Slowed and Reverb?',
      answer: 'Slowed and Reverb (often stylized as "slowed + reverb") is a popular music aesthetic where a track is slowed down to around 80%–90% of its original tempo and layered with acoustic reverb. This creates a dreamy, atmospheric, and nostalgic listening vibe.'
    },
    {
      question: 'How do I make a slowed and reverb song?',
      answer: 'Simply upload your MP3, WAV, or OGG audio file into Zubware, pick a speed preset (such as 0.85x or 0.80x), select a reverb intensity (Light, Medium, or Deep), and click "CREATE SLOWED + REVERB". Zubware handles the audio rendering locally in seconds.'
    },
    {
      question: 'What speed should I use for the best slowed effect?',
      answer: '0.85x is the golden standard default for most songs! It lowers the pitch and tempo naturally without making vocals sound unnaturally distorted. For energetic pop or EDM songs, 0.80x or 0.85x works great. For acoustic tracks, 0.90x yields a subtle chill vibe.'
    },
    {
      question: 'Can I download the processed result as an MP3 file?',
      answer: 'Yes! Zubware includes a high-fidelity 320 kbps LAME MP3 encoder built directly into your browser. The output file is a genuine MP3 audio file ready for offline playback, ringtones, or content creation.'
    },
    {
      question: 'Is my audio uploaded to a server?',
      answer: 'No. Your audio file is processed entirely inside your web browser using HTML5 Web Audio API and WebAssembly. Your files never leave your device memory, ensuring 100% privacy and instant speed.'
    },
    {
      question: 'Does slowing a song change its pitch?',
      answer: 'Yes! By default, slowing a song down with standard analog-style playback speed lowers both the tempo and pitch naturally together. This gives slowed & reverb tracks their signature deep, warm, and atmospheric tone.'
    }
  ];

  const relatedTools = [
    { title: 'Lofi Music Studio', icon: '🎧', path: '/lofi-song-maker.html', category: 'Audio Tools' },
    { title: 'Audio Converter', icon: '🔄', path: '/category/audio.html', category: 'Audio Tools' },
    { title: 'Audio Compressor', icon: '🗜️', path: '/category/audio.html', category: 'Audio Tools' },
    { title: 'Audio Cutter', icon: '✂️', path: '/category/audio.html', category: 'Audio Tools' },
    { title: 'Volume Booster', icon: '🔊', path: '/category/audio.html', category: 'Audio Tools' },
    { title: 'Bass Booster', icon: '🎸', path: '/category/audio.html', category: 'Audio Tools' },
    { title: 'Pitch Shifter', icon: '🎶', path: '/category/audio.html', category: 'Audio Tools' },
    { title: 'Video to Audio', icon: '📹', path: '/category/video.html', category: 'Video Tools' }
  ];

  return (
    <div className="space-y-8">
      
      {/* Hidden Audio Players */}
      {originalAudioUrl && (
        <audio
          ref={originalAudioRef}
          src={originalAudioUrl}
          onTimeUpdate={() => {
            if (originalAudioRef.current) setOriginalCurrentTime(originalAudioRef.current.currentTime);
          }}
          onEnded={() => setIsPlayingOriginal(false)}
        />
      )}

      {processedMp3Url && (
        <audio
          ref={processedAudioRef}
          src={processedMp3Url}
          onTimeUpdate={() => {
            if (processedAudioRef.current) setProcessedCurrentTime(processedAudioRef.current.currentTime);
          }}
          onEnded={() => setIsPlayingProcessed(false)}
        />
      )}

      {/* Hero Header Card */}
      <div className="glass-panel p-6 sm:p-10 rounded-3xl text-center space-y-4 relative overflow-hidden">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 dark:bg-indigo-400/10 text-indigo-600 dark:text-indigo-300 font-bold text-xs border border-indigo-200/50 dark:border-indigo-800/50 shadow-xs">
          <Disc className="w-4 h-4 animate-spin-slow text-indigo-500" /> Free Browser-Based Audio Tool
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          🎧 Slowed & Reverb
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed font-medium">
          Add a smooth slowed-down and reverb effect to your song. Zero uploads required — fast, private, and 100% free.
        </p>
      </div>

      {/* Main App Container */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-6">

        {/* 1. File Upload Area (If no file uploaded) */}
        {!file && (
          <div
            ref={dropZoneRef}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="border-2 border-dashed border-indigo-300/80 dark:border-indigo-800/80 hover:border-indigo-500 dark:hover:border-indigo-400 rounded-3xl p-8 sm:p-14 text-center transition-all bg-white/40 dark:bg-slate-900/40 cursor-pointer group space-y-4"
            onClick={() => {
              const input = document.createElement('input');
              input.type = 'file';
              input.accept = 'audio/*,.mp3,.wav,.ogg,.flac,.m4a,.aac';
              input.onchange = (e: any) => {
                if (e.target.files && e.target.files[0]) handleFileChange(e.target.files[0]);
              };
              input.click();
            }}
          >
            <div className="w-20 h-20 mx-auto rounded-3xl bg-indigo-600/10 dark:bg-indigo-400/10 flex items-center justify-center group-hover:scale-110 transition-transform text-indigo-600 dark:text-indigo-400 shadow-inner">
              <Upload className="w-10 h-10" />
            </div>

            <div>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                Drag & drop your song here
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                or <span className="text-indigo-600 dark:text-indigo-400 font-bold underline">Browse Files</span> from your computer or phone
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <span className="px-3 py-1 rounded-xl bg-slate-200/60 dark:bg-slate-800/60">MP3</span>
              <span className="px-3 py-1 rounded-xl bg-slate-200/60 dark:bg-slate-800/60">WAV</span>
              <span className="px-3 py-1 rounded-xl bg-slate-200/60 dark:bg-slate-800/60">OGG</span>
              <span className="px-3 py-1 rounded-xl bg-slate-200/60 dark:bg-slate-800/60">FLAC</span>
              <span className="px-3 py-1 rounded-xl bg-slate-200/60 dark:bg-slate-800/60">M4A</span>
              <span className="px-3 py-1 rounded-xl bg-slate-200/60 dark:bg-slate-800/60">Max 50 MB</span>
            </div>

            <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
              🔒 Private local processing — your audio file is never uploaded to any server.
            </p>
          </div>
        )}

        {/* Decode Loading Indicator */}
        {isDecoding && (
          <div className="p-8 rounded-3xl bg-indigo-50/50 dark:bg-indigo-950/30 text-center space-y-3">
            <div className="w-10 h-10 border-4 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin mx-auto"></div>
            <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">{processingStage}</p>
          </div>
        )}

        {/* 2. File Uploaded Card */}
        {file && audioBuffer && !isDecoding && (
          <div className="space-y-6">
            
            {/* Song Details Banner */}
            <div className="glass-card p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-indigo-500/20">
              <div className="flex items-center gap-4">
                <div className="p-3.5 rounded-2xl bg-indigo-600 text-white shadow-md">
                  <FileAudio className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white truncate max-w-xs sm:max-w-md">
                    {file.name}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 font-semibold mt-0.5">
                    <span>{formatFileSize(file.size)}</span>
                    <span>•</span>
                    <span>{formatTime(audioBuffer.duration)}</span>
                    <span>•</span>
                    <span>{audioBuffer.sampleRate} Hz</span>
                  </div>
                </div>
              </div>

              {/* Remove / Replace File */}
              <button
                onClick={() => {
                  setFile(null);
                  setAudioBuffer(null);
                  setRenderedBuffer(null);
                  setProcessedMp3Url(null);
                  setProcessedWavUrl(null);
                }}
                className="px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 font-bold text-xs transition-colors flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>Replace Song</span>
              </button>
            </div>

            {/* Original Preview Player */}
            <div className="p-4 rounded-2xl bg-slate-200/50 dark:bg-slate-800/50 flex items-center gap-4">
              <button
                onClick={togglePlayOriginal}
                className="w-10 h-10 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center shrink-0 shadow-md transition-transform active:scale-95"
              >
                {isPlayingOriginal ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
              </button>
              <div className="flex-1 space-y-1">
                <div className="flex justify-between text-xs font-bold text-slate-600 dark:text-slate-400">
                  <span>Original Preview</span>
                  <span>{formatTime(originalCurrentTime)} / {formatTime(originalDuration)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={originalDuration || 1}
                  step="0.1"
                  value={originalCurrentTime}
                  onChange={(e) => {
                    const time = parseFloat(e.target.value);
                    setOriginalCurrentTime(time);
                    if (originalAudioRef.current) originalAudioRef.current.currentTime = time;
                  }}
                  className="w-full accent-indigo-600 cursor-pointer h-1.5 bg-slate-300 dark:bg-slate-700 rounded-lg"
                />
              </div>
            </div>

            {/* CONTROLS SECTION */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">

              {/* Speed Controls */}
              <div className="glass-card p-5 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-indigo-500" />
                    Speed
                  </label>
                  <span className="text-sm font-black px-2.5 py-0.5 rounded-lg bg-indigo-600 text-white">
                    {speed.toFixed(2)}x
                  </span>
                </div>

                {/* Speed Presets */}
                <div className="grid grid-cols-5 gap-1.5">
                  {[1.00, 0.95, 0.90, 0.85, 0.80].map((s) => (
                    <button
                      key={s}
                      onClick={() => setSpeed(s)}
                      className={`py-2 text-xs font-bold rounded-xl transition-all ${
                        Math.abs(speed - s) < 0.01
                          ? 'bg-indigo-600 text-white shadow-md scale-105'
                          : 'bg-slate-200/70 dark:bg-slate-800/70 text-slate-700 dark:text-slate-300 hover:bg-indigo-500/20'
                      }`}
                    >
                      {s.toFixed(2)}x
                    </button>
                  ))}
                </div>

                {/* Custom Speed Slider */}
                <div className="space-y-1 pt-1">
                  <div className="flex justify-between text-[11px] font-semibold text-slate-500">
                    <span>0.70x (Slower)</span>
                    <span>1.10x (Faster)</span>
                  </div>
                  <input
                    type="range"
                    min="0.70"
                    max="1.10"
                    step="0.01"
                    value={speed}
                    onChange={(e) => setSpeed(parseFloat(e.target.value))}
                    className="w-full accent-indigo-600 cursor-pointer h-2 bg-slate-200 dark:bg-slate-800 rounded-lg"
                  />
                </div>

                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  💡 0.85x is the standard slowed preset. Speed and pitch adjust naturally together for a deep atmosphere.
                </p>
              </div>

              {/* Reverb Controls */}
              <div className="glass-card p-5 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <Radio className="w-4 h-4 text-purple-500" />
                    Reverb Amount
                  </label>
                  <span className="text-xs font-bold capitalize px-2.5 py-0.5 rounded-lg bg-purple-600 text-white">
                    {reverbPreset}
                  </span>
                </div>

                {/* Reverb Presets */}
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'light', name: 'Light', desc: '~10% Reverb' },
                    { id: 'medium', name: 'Medium', desc: '~16% Reverb (Default)' },
                    { id: 'deep', name: 'Deep', desc: '~24% Reverb' }
                  ].map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setReverbPreset(p.id as any)}
                      className={`p-3 text-left rounded-xl transition-all border ${
                        reverbPreset === p.id
                          ? 'border-purple-500 bg-purple-500/15 text-slate-900 dark:text-white shadow-sm font-bold'
                          : 'border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 text-slate-600 dark:text-slate-400 hover:border-purple-300'
                      }`}
                    >
                      <div className="text-xs font-bold">{p.name}</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{p.desc}</div>
                    </button>
                  ))}
                </div>

                {/* Output Volume Control */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-300">
                    <span className="flex items-center gap-1">
                      <Volume2 className="w-3.5 h-3.5" /> Output Volume
                    </span>
                    <span className="font-bold">{Math.round(masterVolume * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="1.0"
                    step="0.05"
                    value={masterVolume}
                    onChange={(e) => setMasterVolume(parseFloat(e.target.value))}
                    className="w-full accent-purple-600 cursor-pointer h-2 bg-slate-200 dark:bg-slate-800 rounded-lg"
                  />
                </div>
              </div>

            </div>

            {/* Error Banner if processing failed */}
            {errorMessage && (
              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-center gap-3">
                <Info className="w-5 h-5 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* PROCESS BUTTON */}
            <div className="pt-2">
              <button
                onClick={handleProcessAudio}
                disabled={isProcessing}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-700 hover:to-purple-700 text-white font-black text-sm sm:text-base tracking-wide transition-all shadow-xl hover:shadow-indigo-500/25 active:scale-[0.99] disabled:opacity-60 flex items-center justify-center gap-3"
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>{processingStage || 'PROCESSING...'}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>CREATE SLOWED + REVERB</span>
                  </>
                )}
              </button>

              {isProcessing && (
                <div className="mt-3 space-y-1 text-center">
                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-600 h-full transition-all duration-300"
                      style={{ width: `${processingProgress}%` }}
                    />
                  </div>
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                    {processingProgress}% — {processingStage}
                  </span>
                </div>
              )}
            </div>

            {/* 3. PROCESSED AUDIO RESULT SECTION */}
            {processedMp3Url && processedMp3Blob && !isProcessing && (
              <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-6 border-2 border-emerald-500/30 bg-emerald-500/5 animate-fade-in">
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-emerald-500/20">
                  <div>
                    <span className="text-xs font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" /> Ready for Download
                    </span>
                    <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
                      Slowed + Reverb Audio Preview
                    </h3>
                  </div>

                  <span className="text-xs font-bold px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                    Ready — {formatFileSize(processedMp3Blob.size)}
                  </span>
                </div>

                {/* Processed Audio Player */}
                <div className="p-5 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md flex items-center gap-4 border border-emerald-500/20 shadow-md">
                  <button
                    onClick={togglePlayProcessed}
                    className="w-12 h-12 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-lg transition-transform active:scale-95"
                  >
                    {isPlayingProcessed ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
                  </button>
                  <div className="flex-1 space-y-1.5">
                    <div className="flex justify-between text-xs font-extrabold text-slate-800 dark:text-slate-200">
                      <span>Slowed + Reverb Result</span>
                      <span>{formatTime(processedCurrentTime)} / {formatTime(processedDuration)}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max={processedDuration || 1}
                      step="0.1"
                      value={processedCurrentTime}
                      onChange={(e) => {
                        const time = parseFloat(e.target.value);
                        setProcessedCurrentTime(time);
                        if (processedAudioRef.current) processedAudioRef.current.currentTime = time;
                      }}
                      className="w-full accent-emerald-600 cursor-pointer h-2 bg-slate-200 dark:bg-slate-800 rounded-lg"
                    />
                  </div>
                </div>

                {/* MP3 Quality Settings & Downloads */}
                <div className="space-y-4 pt-2">
                  <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2 font-bold text-slate-700 dark:text-slate-300">
                      <span>MP3 Bitrate Quality:</span>
                      <div className="flex gap-1">
                        {[320, 256, 192].map((b) => (
                          <button
                            key={b}
                            onClick={() => {
                              setMp3Bitrate(b);
                              // Re-trigger process if clicked
                            }}
                            className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                              mp3Bitrate === b
                                ? 'bg-emerald-600 text-white'
                                : 'bg-slate-200/70 dark:bg-slate-800/70 text-slate-600 dark:text-slate-400'
                            }`}
                          >
                            {b} kbps
                          </button>
                        ))}
                      </div>
                    </div>

                    <span className="text-slate-500 font-semibold">
                      Estimated MP3 Size: ~{formatFileSize(estimatedMp3SizeBytes)}
                    </span>
                  </div>

                  {/* MAIN DOWNLOAD MP3 BUTTON */}
                  <button
                    onClick={handleDownloadMp3}
                    className="w-full py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm sm:text-base tracking-wide transition-all shadow-xl hover:shadow-emerald-500/20 active:scale-[0.99] flex items-center justify-center gap-3"
                  >
                    <Download className="w-5 h-5" />
                    <span>⬇ DOWNLOAD SLOWED + REVERB MP3</span>
                  </button>

                  {/* Optional WAV Download */}
                  {processedWavUrl && (
                    <div className="text-center pt-1">
                      <button
                        onClick={handleDownloadWav}
                        className="text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 underline transition-colors"
                      >
                        Download uncompressed WAV version ({formatFileSize(processedWavBlob?.size || 0)})
                      </button>
                    </div>
                  )}
                </div>

              </div>
            )}

          </div>
        )}

      </div>

      {/* PRIVACY BANNER */}
      <div className="glass-panel p-5 rounded-2xl flex items-center gap-4 text-slate-700 dark:text-slate-300">
        <ShieldCheck className="w-8 h-8 text-indigo-500 shrink-0" />
        <p className="text-xs leading-relaxed font-medium">
          <strong>Privacy Guaranteed:</strong> Your audio is processed locally in your browser whenever possible. Your file is not uploaded to any external server.
        </p>
      </div>

      {/* FAQ SECTION */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-6">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Frequently Asked Questions
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Everything you need to know about creating slowed & reverb tracks online.
          </p>
        </div>

        <div className="space-y-3 max-w-3xl mx-auto">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div key={idx} className="glass-card rounded-2xl overflow-hidden transition-all">
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between gap-4 text-xs sm:text-sm font-bold text-slate-900 dark:text-white hover:text-indigo-600 transition-colors"
                >
                  <span>{faq.question}</span>
                  <ChevronDown className={`w-4 h-4 shrink-0 transition-transform ${isOpen ? 'rotate-180 text-indigo-600' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 text-xs text-slate-600 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800/60 leading-relaxed pt-2">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* RELATED TOOLS SECTION */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          Explore Related Audio & Media Tools
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {relatedTools.map((t, idx) => (
            <div
              key={idx}
              onClick={() => onNavigate && onNavigate(getLinkUrl(t.path))}
              className="glass-card p-4 rounded-2xl cursor-pointer hover:border-indigo-500/40 transition-all flex items-center gap-3 group"
            >
              <span className="text-2xl group-hover:scale-110 transition-transform">{t.icon}</span>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                  {t.title}
                </h4>
                <span className="text-[10px] text-slate-500 font-medium">{t.category}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
