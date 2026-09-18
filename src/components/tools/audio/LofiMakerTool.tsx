import React, { useState, useRef, useEffect } from 'react';
import {
  Upload,
  Play,
  Pause,
  Download,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  FileAudio,
  Trash2,
  Disc
} from 'lucide-react';
import { processAutomaticLofi } from '../../../lib/lofiMakerEngine';
import { validateAudioBuffer } from '../../../lib/slowedReverbEngine';
import { encodeAudioBufferToMp3 } from '../../../lib/mp3Encoder';

interface LofiMakerToolProps {
  onShowToast: (msg: string) => void;
  onNavigate?: (path: string) => void;
}

export function LofiMakerTool({ onShowToast }: LofiMakerToolProps) {
  // File & Audio State
  const [file, setFile] = useState<File | null>(null);
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
  const [originalAudioUrl, setOriginalAudioUrl] = useState<string | null>(null);
  const [isDecoding, setIsDecoding] = useState<boolean>(false);

  // Processing & Export State
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processingStage, setProcessingStage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Rendered Output State
  const [processedMp3Blob, setProcessedMp3Blob] = useState<Blob | null>(null);
  const [processedMp3Url, setProcessedMp3Url] = useState<string | null>(null);

  // Audio Players
  const originalAudioRef = useRef<HTMLAudioElement | null>(null);
  const processedAudioRef = useRef<HTMLAudioElement | null>(null);

  const [isPlayingOriginal, setIsPlayingOriginal] = useState<boolean>(false);
  const [originalCurrentTime, setOriginalCurrentTime] = useState<number>(0);
  const [originalDuration, setOriginalDuration] = useState<number>(0);

  const [isPlayingProcessed, setIsPlayingProcessed] = useState<boolean>(false);
  const [processedCurrentTime, setProcessedCurrentTime] = useState<number>(0);
  const [processedDuration, setProcessedDuration] = useState<number>(0);

  // Clean up Object URLs on unmount
  useEffect(() => {
    return () => {
      if (originalAudioUrl) URL.revokeObjectURL(originalAudioUrl);
      if (processedMp3Url) URL.revokeObjectURL(processedMp3Url);
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

    if (selectedFile.size > 50 * 1024 * 1024) {
      onShowToast('File size exceeds 50 MB limit. Please select a smaller song.');
      return;
    }

    // Clean up previous URLs
    if (originalAudioUrl) URL.revokeObjectURL(originalAudioUrl);
    if (processedMp3Url) URL.revokeObjectURL(processedMp3Url);

    setFile(selectedFile);
    setAudioBuffer(null);
    setProcessedMp3Blob(null);
    setProcessedMp3Url(null);
    setErrorMessage(null);
    setIsPlayingOriginal(false);
    setIsPlayingProcessed(false);

    const origUrl = URL.createObjectURL(selectedFile);
    setOriginalAudioUrl(origUrl);

    setIsDecoding(true);
    setProcessingStage('Reading file...');

    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const decodedBuffer = await audioCtx.decodeAudioData(arrayBuffer);

      const check = validateAudioBuffer(decodedBuffer);
      if (!check.valid) {
        throw new Error('Sorry, we couldn\'t process this audio. Please try another file.');
      }

      setAudioBuffer(decodedBuffer);
      setOriginalDuration(decodedBuffer.duration);
      onShowToast(`Loaded "${selectedFile.name}"`);
    } catch (err: any) {
      console.error('Audio decode error:', err);
      setFile(null);
      setAudioBuffer(null);
      const userErr = 'Sorry, we couldn\'t process this audio. Please try another file.';
      setErrorMessage(userErr);
      onShowToast(userErr);
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

  // ONE-CLICK LOFI PROCESSING
  const handleMakeItLofi = async () => {
    if (!audioBuffer || !file) {
      onShowToast('Please upload an audio file first.');
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);
    setProcessingStage('Creating Slowed & Reverb Lofi version...');

    // Pause audio playbacks
    if (originalAudioRef.current) originalAudioRef.current.pause();
    if (processedAudioRef.current) processedAudioRef.current.pause();
    setIsPlayingOriginal(false);
    setIsPlayingProcessed(false);

    try {
      // 1. Automatic Audioalter-style Lofi Audio Processing (0.85x slowed, 35% space reverb, 4.5kHz lowpass)
      const rendered = await processAutomaticLofi(audioBuffer, {}, (stage) => {
        setProcessingStage(stage);
      });

      setProcessedDuration(rendered.duration);

      // 2. Encode to 320 kbps MP3
      setProcessingStage('Encoding MP3...');
      const mp3Blob = await encodeAudioBufferToMp3(rendered, 320);

      if (!mp3Blob || mp3Blob.size < 500) {
        throw new Error('Sorry, we couldn\'t process this audio. Please try another file.');
      }

      if (processedMp3Url) URL.revokeObjectURL(processedMp3Url);
      const mp3Url = URL.createObjectURL(mp3Blob);

      setProcessedMp3Blob(mp3Blob);
      setProcessedMp3Url(mp3Url);
      setProcessingStage('✓ Lofi version ready!');
      onShowToast('✓ Slowed & Reverb Lofi version ready! 🎧');
    } catch (err: any) {
      console.error('Lofi maker error:', err);
      const userErr = 'Sorry, we couldn\'t process this audio. Please try another file.';
      setErrorMessage(userErr);
      onShowToast(userErr);
    } finally {
      setIsProcessing(false);
    }
  };

  // DOWNLOAD HANDLER
  const handleDownloadMp3 = () => {
    if (!processedMp3Url || !processedMp3Blob) return;
    const baseName = file ? file.name.replace(/\.[^/.]+$/, '') : 'song';
    const filename = `${baseName}-lofi.mp3`;

    const a = document.createElement('a');
    a.href = processedMp3Url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    onShowToast(`Downloading ${filename}...`);
  };

  // Play / Pause Toggles
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

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      
      {/* Hidden HTML5 Audio Elements */}
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

      {/* Hero Title Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl text-center space-y-3">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-600/10 dark:bg-indigo-400/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
          <Disc className="w-9 h-9 animate-spin-slow" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          🎧 Lofi Maker
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 font-medium">
          Turn your song into a smooth Lofi version in one click.
        </p>
      </div>

      {/* Main Glass Panel */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-6">

        {/* 1. UPLOAD BOX */}
        {!file && (
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="border-2 border-dashed border-indigo-300/80 dark:border-indigo-800/80 hover:border-indigo-500 dark:hover:border-indigo-400 rounded-3xl p-8 sm:p-12 text-center transition-all bg-white/40 dark:bg-slate-900/40 cursor-pointer group space-y-4"
            onClick={() => {
              const input = document.createElement('input');
              input.type = 'file';
              input.accept = 'audio/*,.mp3,.wav,.ogg,.m4a,.flac';
              input.onchange = (e: any) => {
                if (e.target.files && e.target.files[0]) handleFileChange(e.target.files[0]);
              };
              input.click();
            }}
          >
            <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-600/10 dark:bg-indigo-400/10 flex items-center justify-center group-hover:scale-110 transition-transform text-indigo-600 dark:text-indigo-400">
              <Upload className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                Drop your song here
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                or <span className="text-indigo-600 dark:text-indigo-400 font-bold underline">Browse Files</span>
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
              <span>MP3, WAV, OGG, M4A, FLAC</span>
              <span>•</span>
              <span>Max 50 MB</span>
            </div>
          </div>
        )}

        {/* Decoding Loader */}
        {isDecoding && (
          <div className="p-8 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 text-center space-y-3">
            <div className="w-8 h-8 border-3 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin mx-auto"></div>
            <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">{processingStage}</p>
          </div>
        )}

        {/* 2. UPLOADED SONG STATE */}
        {file && audioBuffer && !isDecoding && (
          <div className="space-y-6">

            {/* Song File Details */}
            <div className="p-4 rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 truncate">
                <div className="p-3 rounded-xl bg-indigo-600 text-white shrink-0">
                  <FileAudio className="w-5 h-5" />
                </div>
                <div className="truncate">
                  <h4 className="text-sm font-extrabold text-slate-900 dark:text-white truncate">
                    {file.name}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                    {formatFileSize(file.size)} • {formatTime(audioBuffer.duration)}
                  </p>
                </div>
              </div>

              {/* Replace Song Button */}
              <button
                onClick={() => {
                  setFile(null);
                  setAudioBuffer(null);
                  setProcessedMp3Url(null);
                  setProcessedMp3Blob(null);
                }}
                className="p-2.5 rounded-xl bg-slate-200/60 dark:bg-slate-800/60 hover:bg-rose-500/20 hover:text-rose-600 text-slate-600 dark:text-slate-300 transition-colors shrink-0"
                title="Replace song"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Original Audio Preview */}
            <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/50 flex items-center gap-3">
              <button
                onClick={togglePlayOriginal}
                className="w-9 h-9 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center shrink-0 shadow-md transition-transform active:scale-95"
              >
                {isPlayingOriginal ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
              </button>
              <div className="flex-1 space-y-1">
                <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                  <span>▶ Original Song</span>
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

            {/* Error Message */}
            {errorMessage && (
              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-bold">
                {errorMessage}
              </div>
            )}

            {/* ONE-CLICK MAKE IT LOFI BUTTON */}
            <button
              onClick={handleMakeItLofi}
              disabled={isProcessing}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-700 hover:to-purple-700 text-white font-black text-base tracking-wide transition-all shadow-xl hover:shadow-indigo-500/20 active:scale-[0.99] disabled:opacity-60 flex items-center justify-center gap-3"
            >
              {isProcessing ? (
                <>
                  <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>{processingStage || 'Creating Lofi version...'}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>✨ MAKE IT LOFI</span>
                </>
              )}
            </button>

            {/* PROCESSED LOFI RESULT */}
            {processedMp3Url && processedMp3Blob && !isProcessing && (
              <div className="p-6 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 space-y-5 animate-fade-in">
                
                <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 font-extrabold text-sm">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-5 h-5" /> ✓ Lofi version ready!
                  </span>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-lg bg-emerald-500/20">
                    {formatFileSize(processedMp3Blob.size)}
                  </span>
                </div>

                {/* Processed Lofi Preview Player */}
                <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md flex items-center gap-3 border border-emerald-500/20 shadow-md">
                  <button
                    onClick={togglePlayProcessed}
                    className="w-10 h-10 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-md transition-transform active:scale-95"
                  >
                    {isPlayingProcessed ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                  </button>
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between text-xs font-extrabold text-slate-800 dark:text-slate-200">
                      <span>▶ Lofi Preview</span>
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

                {/* DOWNLOAD LOFI MP3 BUTTON */}
                <button
                  onClick={handleDownloadMp3}
                  className="w-full py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-base tracking-wide transition-all shadow-xl hover:shadow-emerald-500/20 active:scale-[0.99] flex items-center justify-center gap-3"
                >
                  <Download className="w-5 h-5" />
                  <span>⬇ DOWNLOAD LOFI MP3</span>
                </button>

              </div>
            )}

          </div>
        )}

      </div>

      {/* PRIVACY NOTICE */}
      <div className="glass-panel p-4 rounded-2xl flex items-center gap-3 text-slate-600 dark:text-slate-300 text-xs font-medium">
        <ShieldCheck className="w-5 h-5 text-indigo-500 shrink-0" />
        <span>Your audio is processed locally in your browser whenever possible. Your file is not uploaded to our server.</span>
      </div>

    </div>
  );
}
