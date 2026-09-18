// ============================================================================
// MP3 & WAV AUDIO ENCODING UTILITIES
// High-Quality Client-Side MP3 (LameJS) & PCM WAV Encoder
// ============================================================================

// @ts-ignore
import ATH from 'lamejs/src/js/ATH.js';
// @ts-ignore
import BitStream from 'lamejs/src/js/BitStream.js';
// @ts-ignore
import CBRNewIterationLoop from 'lamejs/src/js/CBRNewIterationLoop.js';
// @ts-ignore
import CalcNoiseData from 'lamejs/src/js/CalcNoiseData.js';
// @ts-ignore
import CalcNoiseResult from 'lamejs/src/js/CalcNoiseResult.js';
// @ts-ignore
import Encoder from 'lamejs/src/js/Encoder.js';
// @ts-ignore
import FFT from 'lamejs/src/js/FFT.js';
// @ts-ignore
import GainAnalysis from 'lamejs/src/js/GainAnalysis.js';
// @ts-ignore
import GrInfo from 'lamejs/src/js/GrInfo.js';
// @ts-ignore
import IIISideInfo from 'lamejs/src/js/IIISideInfo.js';

function ID3TagSpec(this: any) {
  this.flags = 0;
  this.year = 0;
  this.title = null;
  this.artist = null;
  this.album = null;
  this.comment = null;
  this.track_id3v1 = 0;
  this.genre_id3v1 = 0;
  this.albumart = null;
  this.albumart_size = 0;
  this.padding_size = 0;
  this.albumart_mimetype = null;
  this.values = [];
  this.num_values = 0;
  this.v2_head = null;
  this.v2_tail = null;
}
// @ts-ignore
import III_psy_ratio from 'lamejs/src/js/III_psy_ratio.js';
// @ts-ignore
import III_psy_xmin from 'lamejs/src/js/III_psy_xmin.js';
// @ts-ignore
import L3Side from 'lamejs/src/js/L3Side.js';
// @ts-ignore
import Lame from 'lamejs/src/js/Lame.js';
// @ts-ignore
import LameGlobalFlags from 'lamejs/src/js/LameGlobalFlags.js';
// @ts-ignore
import LameInternalFlags from 'lamejs/src/js/LameInternalFlags.js';
// @ts-ignore
import MPEGMode from 'lamejs/src/js/MPEGMode.js';
// @ts-ignore
import MeanBits from 'lamejs/src/js/MeanBits.js';
// @ts-ignore
import NewMDCT from 'lamejs/src/js/NewMDCT.js';
// @ts-ignore
import NsPsy from 'lamejs/src/js/NsPsy.js';
// @ts-ignore
import Presets from 'lamejs/src/js/Presets.js';
// @ts-ignore
import PsyModel from 'lamejs/src/js/PsyModel.js';
// @ts-ignore
import Quantize from 'lamejs/src/js/Quantize.js';
// @ts-ignore
import QuantizePVT from 'lamejs/src/js/QuantizePVT.js';
// @ts-ignore
import ReplayGain from 'lamejs/src/js/ReplayGain.js';
// @ts-ignore
import Reservoir from 'lamejs/src/js/Reservoir.js';
// @ts-ignore
import ScaleFac from 'lamejs/src/js/ScaleFac.js';
// @ts-ignore
import Tables from 'lamejs/src/js/Tables.js';
// @ts-ignore
import Takehiro from 'lamejs/src/js/Takehiro.js';
// @ts-ignore
import VBRQuantize from 'lamejs/src/js/VBRQuantize.js';
// @ts-ignore
import VBRSeekInfo from 'lamejs/src/js/VBRSeekInfo.js';
// @ts-ignore
import VBRTag from 'lamejs/src/js/VBRTag.js';
// @ts-ignore
import Version from 'lamejs/src/js/Version.js';
// @ts-ignore
import common from 'lamejs/src/js/common.js';
import * as lamejsModule from 'lamejs';

const lamejsModules: Record<string, any> = {
  ATH,
  BitStream,
  CBRNewIterationLoop,
  CalcNoiseData,
  CalcNoiseResult,
  Encoder,
  FFT,
  GainAnalysis,
  GrInfo,
  ID3TagSpec,
  IIISideInfo,
  III_psy_ratio,
  III_psy_xmin,
  L3Side,
  Lame,
  LameGlobalFlags,
  LameInternalFlags,
  MPEGMode,
  MeanBits,
  NewMDCT,
  NsPsy,
  Presets,
  PsyModel,
  Quantize,
  QuantizePVT,
  ReplayGain,
  Reservoir,
  ScaleFac,
  Tables,
  Takehiro,
  VBRQuantize,
  VBRSeekInfo,
  VBRTag,
  Version,
  common,
};

function ensureLamejsGlobals() {
  const targetGlobals = [globalThis, typeof window !== 'undefined' ? window : null].filter(Boolean) as any[];

  for (const g of targetGlobals) {
    for (const [key, val] of Object.entries(lamejsModules)) {
      if (key === 'common' && val) {
        Object.assign(g, val);
      } else if (val) {
        g[key] = val;
      }
    }
  }
}

ensureLamejsGlobals();

// Resolve default import or namespace export for lamejs in Vite ESM
// @ts-ignore
const lamejs = lamejsModule.default || lamejsModule;

/**
 * Encodes an AudioBuffer into a true MP3 Blob using LAME encoder.
 */
export async function encodeAudioBufferToMp3(
  buffer: AudioBuffer,
  kbps: number = 320,
  onProgress?: (pct: number) => void
): Promise<Blob> {
  ensureLamejsGlobals();

  const numChannels = Math.min(2, Math.max(1, buffer.numberOfChannels));
  const sampleRate = buffer.sampleRate;
  const numSamples = buffer.length;

  // Instantiate LAME MP3 Encoder
  // @ts-ignore
  const Mp3Encoder = lamejs.Mp3Encoder || (lamejsModule as any).Mp3Encoder;
  if (!Mp3Encoder) {
    throw new Error('LAME MP3 encoder library could not be loaded.');
  }

  const mp3encoder = new Mp3Encoder(numChannels, sampleRate, kbps);
  const mp3Data: Uint8Array[] = [];

  // Extract channel samples & convert Float32 to Int16
  const leftFloat = buffer.getChannelData(0);
  const rightFloat = numChannels > 1 ? buffer.getChannelData(1) : leftFloat;

  const sampleBlockSize = 1152; // LAME standard frame size
  const leftChunk = new Int16Array(sampleBlockSize);
  const rightChunk = new Int16Array(sampleBlockSize);

  for (let i = 0; i < numSamples; i += sampleBlockSize) {
    const chunkLen = Math.min(sampleBlockSize, numSamples - i);

    for (let j = 0; j < chunkLen; j++) {
      let l = leftFloat[i + j];
      let r = rightFloat[i + j];

      // Soft-clip safety
      if (l > 1.0) l = 1.0;
      if (l < -1.0) l = -1.0;
      if (r > 1.0) r = 1.0;
      if (r < -1.0) r = -1.0;

      leftChunk[j] = l < 0 ? Math.round(l * 0x8000) : Math.round(l * 0x7FFF);
      rightChunk[j] = r < 0 ? Math.round(r * 0x8000) : Math.round(r * 0x7FFF);
    }

    // Fill remaining buffer with zeroes if last chunk is smaller than sampleBlockSize
    if (chunkLen < sampleBlockSize) {
      for (let j = chunkLen; j < sampleBlockSize; j++) {
        leftChunk[j] = 0;
        rightChunk[j] = 0;
      }
    }

    let mp3buf: Int8Array;
    if (numChannels === 2) {
      mp3buf = mp3encoder.encodeBuffer(leftChunk, rightChunk);
    } else {
      mp3buf = mp3encoder.encodeBuffer(leftChunk);
    }

    if (mp3buf.length > 0) {
      mp3Data.push(new Uint8Array(mp3buf));
    }

    if (onProgress && i % (sampleBlockSize * 100) === 0) {
      const pct = Math.min(99, Math.round((i / numSamples) * 100));
      onProgress(pct);
    }
  }

  // Flush encoder
  const mp3buf = mp3encoder.flush();
  if (mp3buf.length > 0) {
    mp3Data.push(new Uint8Array(mp3buf));
  }

  if (onProgress) onProgress(100);

  return new Blob(mp3Data, { type: 'audio/mp3' });
}

/**
 * Fallback / optional PCM 16-Bit WAV Encoder.
 */
export function encodeAudioBufferToWav(buffer: AudioBuffer): Blob {
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const format = 1; // PCM
  const bitDepth = 16;
  const bytesPerSample = bitDepth / 8;
  const blockAlign = numChannels * bytesPerSample;
  const numSamples = buffer.length;
  const dataSize = numSamples * blockAlign;
  const headerSize = 44;
  const totalSize = headerSize + dataSize;

  const arrayBuffer = new ArrayBuffer(totalSize);
  const view = new DataView(arrayBuffer);

  function writeString(offset: number, str: string) {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  }

  /* RIFF header */
  writeString(0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeString(8, 'WAVE');

  /* fmt chunk */
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, format, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * blockAlign, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitDepth, true);

  /* data chunk */
  writeString(36, 'data');
  view.setUint32(40, dataSize, true);

  const channels: Float32Array[] = [];
  for (let c = 0; c < numChannels; c++) {
    channels.push(buffer.getChannelData(c));
  }

  let offset = 44;
  for (let i = 0; i < numSamples; i++) {
    for (let c = 0; c < numChannels; c++) {
      let sample = channels[c][i];
      if (sample > 1.0) sample = 1.0;
      if (sample < -1.0) sample = -1.0;
      const intSample = sample < 0 ? Math.round(sample * 0x8000) : Math.round(sample * 0x7FFF);
      view.setInt16(offset, intSample, true);
      offset += 2;
    }
  }

  return new Blob([arrayBuffer], { type: 'audio/wav' });
}
