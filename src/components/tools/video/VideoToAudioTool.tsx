import React, { useState } from 'react';
import { Upload, Music, Download, RefreshCw, FileAudio, Check, Sparkles, Volume2 } from 'lucide-react';

export function VideoToAudioTool({ onShowToast }: { onShowToast: (msg: string) => void }) {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [format, setFormat] = useState<'wav' | 'mp3'>('wav');
  const [progress, setProgress] = useState<number>(0);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('video/')) {
      onShowToast('Please upload a valid video file');
      return;
    }
    setVideoFile(file);
    setAudioUrl(null);
    setAudioBlob(null);
    setProgress(0);
    onShowToast(`Loaded video: ${file.name}`);
  };

  const bufferToWave = (abuffer: AudioBuffer, len: number): Blob => {
    const numOfChan = abuffer.numberOfChannels;
    const length = len * numOfChan * 2 + 44;
    const out = new DataView(new ArrayBuffer(length));
    const channels: Float32Array[] = [];
    let sampleRate = abuffer.sampleRate;
    let offset = 0;
    let pos = 0;

    function setUint16(data: number) {
      out.setUint16(pos, data, true);
      pos += 2;
    }

    function setUint32(data: number) {
      out.setUint32(pos, data, true);
      pos += 4;
    }

    // write WAVE header
    setUint32(0x46464952); // "RIFF"
    setUint32(length - 8); // file length - 8
    setUint32(0x45564157); // "WAVE"

    setUint32(0x20746d66); // "fmt " chunk
    setUint32(16); // length = 16
    setUint16(1); // PCM (uncompressed)
    setUint16(numOfChan);
    setUint32(sampleRate);
    setUint32(sampleRate * 2 * numOfChan); // avg. bytes/sec
    setUint16(numOfChan * 2); // block-align
    setUint16(16); // 16-bit precision

    setUint32(0x61746164); // "data" - chunk
    setUint32(length - pos - 4); // chunk length

    for (let i = 0; i < abuffer.numberOfChannels; i++) {
      channels.push(abuffer.getChannelData(i));
    }

    while (pos < length) {
      for (let i = 0; i < numOfChan; i++) {
        let sample = Math.max(-1, Math.min(1, channels[i][offset]));
        sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767) | 0;
        out.setInt16(pos, sample, true);
        pos += 2;
      }
      offset++;
    }

    return new Blob([out], { type: 'audio/wav' });
  };

  const extractAudio = async () => {
    if (!videoFile) return;
    setIsProcessing(true);
    setProgress(20);

    try {
      const arrayBuffer = await videoFile.arrayBuffer();
      setProgress(40);

      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      setProgress(60);

      const decodedBuffer = await audioCtx.decodeAudioData(arrayBuffer);
      setProgress(85);

      const waveBlob = bufferToWave(decodedBuffer, decodedBuffer.length);
      const url = URL.createObjectURL(waveBlob);

      setAudioBlob(waveBlob);
      setAudioUrl(url);
      setProgress(100);
      onShowToast('Audio extracted successfully from video!');
    } catch (err) {
      console.error(err);
      onShowToast('Failed to extract audio track. Ensure the video contains audio.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Music className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Video to Audio Extractor (MP3 / WAV)
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Extract the audio soundtrack from any MP4, WebM, or MOV video file without quality loss.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: Upload & Settings */}
        <div className="lg:col-span-6 space-y-4">
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
            }}
            className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 rounded-3xl p-6 text-center transition-all bg-slate-50/50 dark:bg-slate-900/50 flex flex-col items-center justify-center min-h-[220px]"
          >
            <input
              type="file"
              accept="video/*"
              id="video-audio-file"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />

            {videoFile ? (
              <div className="space-y-2 text-center w-full">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
                  <FileAudio className="w-6 h-6" />
                </div>
                <p className="text-sm font-bold text-slate-900 dark:text-white truncate px-4">{videoFile.name}</p>
                <p className="text-xs text-indigo-600 dark:text-indigo-400 font-bold">
                  Size: {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
                </p>
                <label
                  htmlFor="video-audio-file"
                  className="text-[11px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 underline cursor-pointer block pt-1"
                >
                  Choose another video
                </label>
              </div>
            ) : (
              <label htmlFor="video-audio-file" className="cursor-pointer space-y-3 block">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Upload Video File</p>
                  <p className="text-xs text-slate-400 mt-1">Supports MP4, WebM, MOV, MKV</p>
                </div>
              </label>
            )}
          </div>

          <div className="glass-card p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-4">
            <button
              onClick={extractAudio}
              disabled={!videoFile || isProcessing}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Decoding & Extracting Audio ({progress}%)...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Extract Lossless Audio Track</span>
                </>
              )}
            </button>

            {isProcessing && (
              <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-600 h-full transition-all duration-200 rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Audio Player & Download */}
        <div className="lg:col-span-6 space-y-4 flex flex-col">
          <div className="p-6 rounded-3xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex-1 flex flex-col items-center justify-center min-h-[260px]">
            {audioUrl ? (
              <div className="space-y-5 w-full text-center">
                <div className="w-16 h-16 rounded-3xl bg-indigo-600 text-white flex items-center justify-center mx-auto shadow-md">
                  <Volume2 className="w-8 h-8 animate-pulse" />
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-black text-slate-900 dark:text-white">
                    {videoFile?.name.replace(/\.[^/.]+$/, '')}_audio.wav
                  </p>
                  <p className="text-xs text-slate-400">
                    Extracted Size: {audioBlob ? (audioBlob.size / (1024 * 1024)).toFixed(2) : 0} MB
                  </p>
                </div>

                <audio src={audioUrl} controls className="w-full mx-auto" />
              </div>
            ) : (
              <div className="text-center space-y-2 text-slate-400">
                <Music className="w-10 h-10 mx-auto stroke-1" />
                <p className="text-xs font-bold">Extracted audio player will appear here</p>
              </div>
            )}
          </div>

          {audioUrl && (
            <div className="flex items-center justify-end">
              <a
                href={audioUrl}
                download={`${videoFile?.name.replace(/\.[^/.]+$/, '') || 'audio'}.wav`}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shadow-sm"
              >
                <Download className="w-4 h-4" /> Download Audio File (WAV)
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
