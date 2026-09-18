import React, { useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Scissors,
  Copy,
  Trash2,
  Lock,
  Unlock,
  Volume2,
  VolumeX,
  Plus,
  Minus,
  FastForward,
  Rewind,
  Eye,
  EyeOff,
  MoveHorizontal
} from 'lucide-react';
import { Layer, AudioConfig } from './types';

interface VnTimelineProps {
  layers: Layer[];
  selectedLayerId: string | null;
  onSelectLayer: (id: string | null) => void;
  currentTime: number;
  durationSeconds: number;
  onSeek: (time: number) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  playbackSpeed: number;
  onChangeSpeed: (speed: number) => void;
  audioConfig: AudioConfig;
  onToggleMuteAudio: () => void;
  onSplitLayerAtPlayhead: () => void;
  onDuplicateSelectedLayer: () => void;
  onDeleteSelectedLayer: () => void;
  onToggleLockSelectedLayer: () => void;
  onToggleHideSelectedLayer: () => void;
}

export const VnTimeline: React.FC<VnTimelineProps> = ({
  layers,
  selectedLayerId,
  onSelectLayer,
  currentTime,
  durationSeconds,
  onSeek,
  isPlaying,
  onTogglePlay,
  playbackSpeed,
  onChangeSpeed,
  audioConfig,
  onToggleMuteAudio,
  onSplitLayerAtPlayhead,
  onDuplicateSelectedLayer,
  onDeleteSelectedLayer,
  onToggleLockSelectedLayer,
  onToggleHideSelectedLayer
}) => {
  const timelineRef = useRef<HTMLDivElement | null>(null);

  // Group layers into tracks
  const textLayers = layers.filter((l) => l.type === 'text');
  const decorLayers = layers.filter((l) => l.type === 'decoration' || l.type === 'shape');
  const imageLayers = layers.filter((l) => l.type === 'image');

  const selectedLayer = layers.find((l) => l.id === selectedLayerId);

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!timelineRef.current) return;
    const rect = timelineRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    onSeek(ratio * durationSeconds);
  };

  const formatTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = Math.floor(sec % 60);
    const ms = Math.floor((sec % 1) * 100);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-slate-950 border-t border-slate-800 text-white rounded-b-3xl overflow-hidden shadow-2xl flex flex-col select-none">
      {/* 1. VN TOOLBAR TOP ACTION ROW */}
      <div className="flex flex-wrap items-center justify-between px-4 py-2.5 bg-slate-900/90 border-b border-slate-800/80 gap-2">
        {/* Playback Controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onSeek(0)}
            title="Rewind to start"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onSeek(Math.max(0, currentTime - 0.5))}
            title="Step Back 0.5s"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
          >
            <Rewind className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onTogglePlay}
            className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
              isPlaying
                ? 'bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-lg shadow-amber-500/20'
                : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-lg shadow-emerald-500/20'
            }`}
          >
            {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
            <span>{isPlaying ? 'PAUSE' : 'PLAY'}</span>
          </button>
          <button
            onClick={() => onSeek(Math.min(durationSeconds, currentTime + 0.5))}
            title="Step Forward 0.5s"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
          >
            <FastForward className="w-3.5 h-3.5" />
          </button>

          {/* Time Counter Badge */}
          <div className="ml-2 px-3 py-1 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-amber-400 font-bold">
            {formatTime(currentTime)} <span className="text-slate-500">/ {formatTime(durationSeconds)}</span>
          </div>
        </div>

        {/* VN Quick Split / Duplicate / Edit Controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={onSplitLayerAtPlayhead}
            disabled={!selectedLayerId}
            className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:hover:bg-indigo-600 text-white font-extrabold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
          >
            <Scissors className="w-3.5 h-3.5" />
            <span>Split Clip</span>
          </button>

          <button
            onClick={onDuplicateSelectedLayer}
            disabled={!selectedLayerId}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300 hover:text-white transition-all cursor-pointer"
            title="Duplicate Selected Layer"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onToggleLockSelectedLayer}
            disabled={!selectedLayerId}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300 hover:text-white transition-all cursor-pointer"
            title={selectedLayer?.locked ? 'Unlock Layer' : 'Lock Layer'}
          >
            {selectedLayer?.locked ? <Lock className="w-3.5 h-3.5 text-amber-400" /> : <Unlock className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={onToggleHideSelectedLayer}
            disabled={!selectedLayerId}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300 hover:text-white transition-all cursor-pointer"
            title={selectedLayer?.hidden ? 'Show Layer' : 'Hide Layer'}
          >
            {selectedLayer?.hidden ? <EyeOff className="w-3.5 h-3.5 text-rose-400" /> : <Eye className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={onDeleteSelectedLayer}
            disabled={!selectedLayerId}
            className="p-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/40 text-rose-400 disabled:opacity-30 transition-all cursor-pointer"
            title="Delete Selected Layer"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>

          {/* Speed Selector */}
          <div className="flex items-center gap-1 ml-2 pl-2 border-l border-slate-800">
            <span className="text-[10px] text-slate-500 font-bold uppercase">Speed:</span>
            {[0.5, 1.0, 1.5, 2.0].map((s) => (
              <button
                key={s}
                onClick={() => onChangeSpeed(s)}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                  playbackSpeed === s
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. VN MULTI-TRACK TIMELINE CONTAINER */}
      <div className="relative p-3 bg-slate-950 flex flex-col gap-2 overflow-x-auto">
        {/* Time Scale Ruler */}
        <div
          ref={timelineRef}
          onClick={handleTimelineClick}
          className="relative h-6 bg-slate-900 rounded-lg border border-slate-800 cursor-pointer overflow-hidden flex items-center"
        >
          {/* Time ticks */}
          {Array.from({ length: Math.ceil(durationSeconds) + 1 }).map((_, i) => {
            const leftPct = (i / durationSeconds) * 100;
            return (
              <div
                key={i}
                className="absolute top-0 bottom-0 flex flex-col justify-between pointer-events-none"
                style={{ left: `${leftPct}%` }}
              >
                <div className="w-0.5 h-2 bg-slate-600" />
                <span className="text-[9px] font-mono font-bold text-slate-400 -translate-x-1/2">
                  00:0{i}s
                </span>
              </div>
            );
          })}

          {/* Playhead Needle Bar */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-amber-400 z-30 pointer-events-none shadow-[0_0_12px_rgba(251,191,36,0.8)]"
            style={{ left: `${(currentTime / durationSeconds) * 100}%` }}
          >
            <div className="w-3 h-3 bg-amber-400 rounded-full -translate-x-1/2 -mt-1 shadow-md" />
          </div>
        </div>

        {/* TRACK LANES */}

        {/* TRACK 1: Text & Subtitle Lane */}
        <div className="flex items-center gap-2">
          <div className="w-24 text-[10px] font-black text-amber-400 uppercase tracking-wider flex items-center gap-1 shrink-0">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            Text / Sub
          </div>
          <div className="flex-1 h-9 bg-slate-900/80 rounded-xl border border-slate-800/80 relative overflow-hidden flex items-center p-1 gap-1">
            {textLayers.map((l) => {
              const isSelected = l.id === selectedLayerId;
              return (
                <div
                  key={l.id}
                  onClick={() => onSelectLayer(l.id)}
                  className={`h-full flex-1 rounded-lg px-2 flex items-center justify-between text-[11px] font-bold truncate cursor-pointer transition-all border ${
                    isSelected
                      ? 'bg-amber-500/30 border-amber-400 text-amber-200 shadow-lg shadow-amber-500/10'
                      : 'bg-amber-950/40 border-amber-800/60 text-amber-300 hover:bg-amber-900/50'
                  }`}
                >
                  <span className="truncate">{l.name}</span>
                  <span className="text-[9px] opacity-70 ml-1 font-mono">{l.animType || 'static'}</span>
                </div>
              );
            })}
            {textLayers.length === 0 && (
              <span className="text-[10px] text-slate-600 italic px-2">No Text Layers added yet</span>
            )}
          </div>
        </div>

        {/* TRACK 2: Stickers & Decor Lane */}
        <div className="flex items-center gap-2">
          <div className="w-24 text-[10px] font-black text-emerald-400 uppercase tracking-wider flex items-center gap-1 shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            Decor / PNG
          </div>
          <div className="flex-1 h-9 bg-slate-900/80 rounded-xl border border-slate-800/80 relative overflow-hidden flex items-center p-1 gap-1">
            {[...decorLayers, ...imageLayers].map((l) => {
              const isSelected = l.id === selectedLayerId;
              return (
                <div
                  key={l.id}
                  onClick={() => onSelectLayer(l.id)}
                  className={`h-full flex-1 rounded-lg px-2 flex items-center justify-between text-[11px] font-bold truncate cursor-pointer transition-all border ${
                    isSelected
                      ? 'bg-emerald-500/30 border-emerald-400 text-emerald-200 shadow-lg shadow-emerald-500/10'
                      : 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300 hover:bg-emerald-900/50'
                  }`}
                >
                  <span className="truncate">{l.name}</span>
                </div>
              );
            })}
            {decorLayers.length === 0 && imageLayers.length === 0 && (
              <span className="text-[10px] text-slate-600 italic px-2">No Decor / Graphics added yet</span>
            )}
          </div>
        </div>

        {/* TRACK 3: Audio / Voiceover Lane */}
        <div className="flex items-center gap-2">
          <div className="w-24 text-[10px] font-black text-purple-400 uppercase tracking-wider flex items-center gap-1 shrink-0">
            <span className="w-2 h-2 rounded-full bg-purple-400" />
            Audio / BGM
          </div>
          <div className="flex-1 h-9 bg-slate-900/80 rounded-xl border border-slate-800/80 relative overflow-hidden flex items-center px-3 justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={onToggleMuteAudio}
                className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-purple-300 transition-colors cursor-pointer"
              >
                {audioConfig.muted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5" />}
              </button>
              <span className="text-[11px] font-extrabold text-purple-300 truncate">
                {audioConfig.name || 'Default Islamic Ambient Voiceover Track'}
              </span>
            </div>
            {/* Audio Waveform Graphic */}
            <div className="flex items-center gap-0.5 h-4 opacity-50">
              {[...Array(24)].map((_, idx) => (
                <div
                  key={idx}
                  className="w-1 bg-purple-400 rounded-full"
                  style={{ height: `${20 + Math.sin(idx + currentTime * 4) * 70}%` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
