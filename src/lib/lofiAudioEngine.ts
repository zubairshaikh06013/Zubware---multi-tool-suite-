// ============================================================================
// LOFI AUDIO ENGINE & PROCESSING UTILITIES
// High-Quality Client-Side Web Audio API Offline Renderer & PCM 16-Bit WAV Encoder
// ============================================================================

import { LofiEffects, AmbienceSettings, CreatorSettings } from '../types';

// ----------------------------------------------------------------------------
// 1. PCM 16-BIT WAV ENCODER
// ----------------------------------------------------------------------------

export function encodeAudioBufferToWav(buffer: AudioBuffer): ArrayBuffer {
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const format = 1; // PCM
  const bitDepth = 16;
  const bytesPerSample = bitDepth / 8; // 2 bytes
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

  /* RIFF chunk descriptor */
  writeString(0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true); // ChunkSize
  writeString(8, 'WAVE');

  /* "fmt " sub-chunk */
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true); // Subchunk1Size (16 for PCM)
  view.setUint16(20, format, true); // AudioFormat (1 = PCM)
  view.setUint16(22, numChannels, true); // NumChannels
  view.setUint32(24, sampleRate, true); // SampleRate
  view.setUint32(28, sampleRate * blockAlign, true); // ByteRate
  view.setUint16(32, blockAlign, true); // BlockAlign
  view.setUint16(34, bitDepth, true); // BitsPerSample

  /* "data" sub-chunk */
  writeString(36, 'data');
  view.setUint32(40, dataSize, true); // Subchunk2Size

  // Get channel data references
  const channels: Float32Array[] = [];
  for (let c = 0; c < numChannels; c++) {
    channels.push(buffer.getChannelData(c));
  }

  // Interleave channels & write 16-bit PCM samples with soft-clipping safety
  let offset = 44;
  for (let i = 0; i < numSamples; i++) {
    for (let c = 0; c < numChannels; c++) {
      let sample = channels[c][i];
      // Soft clip with hyperbolic tangent if exceeding peak to eliminate harsh digital distortion
      if (sample > 1.0 || sample < -1.0) {
        sample = Math.tanh(sample);
      }
      // Convert float sample [-1.0, 1.0] to 16-bit signed integer [-32768, 32767]
      const intSample = sample < 0 ? Math.round(sample * 0x8000) : Math.round(sample * 0x7FFF);
      view.setInt16(offset, intSample, true);
      offset += 2;
    }
  }

  return arrayBuffer;
}

// ----------------------------------------------------------------------------
// 2. AUDIO BUFFER VALIDATION
// ----------------------------------------------------------------------------

export function validateAudioBuffer(buffer: AudioBuffer | null): {
  valid: boolean;
  error?: string;
  maxAmplitude: number;
  rms: number;
} {
  if (!buffer) {
    return { valid: false, error: 'No audio data found.', maxAmplitude: 0, rms: 0 };
  }
  if (buffer.length === 0 || buffer.duration <= 0.1 || buffer.numberOfChannels === 0 || buffer.sampleRate <= 0) {
    return { valid: false, error: 'Audio file duration or metadata is invalid.', maxAmplitude: 0, rms: 0 };
  }

  const channelData = buffer.getChannelData(0);
  let maxAmp = 0;
  let sumSq = 0;
  const checkStep = Math.max(1, Math.floor(channelData.length / 10000));

  for (let i = 0; i < channelData.length; i += checkStep) {
    const absVal = Math.abs(channelData[i]);
    if (absVal > maxAmp) maxAmp = absVal;
    sumSq += absVal * absVal;
  }

  const checkedCount = Math.ceil(channelData.length / checkStep);
  const rms = Math.sqrt(sumSq / (checkedCount || 1));

  if (maxAmp < 0.00001) {
    return { valid: false, error: 'The processed audio buffer contains complete silence (zero amplitude).', maxAmplitude: maxAmp, rms };
  }

  if (rms < 0.00001) {
    return { valid: false, error: 'The processed audio buffer RMS level is too low (silent audio).', maxAmplitude: maxAmp, rms };
  }

  return { valid: true, maxAmplitude: maxAmp, rms };
}

// ----------------------------------------------------------------------------
// 3. WARM IMPULSE RESPONSE & ANALOG TAPE SATURATION
// ----------------------------------------------------------------------------

/**
 * Creates a smooth, warm room/hall impulse response for Lofi reverb without metallic digital harshness.
 */
export function createImpulseResponse(ctx: BaseAudioContext, durationSec: number, decay: number): AudioBuffer {
  const sampleRate = ctx.sampleRate;
  const length = Math.max(100, Math.ceil(sampleRate * durationSec));
  const impulse = ctx.createBuffer(2, length, sampleRate);
  const left = impulse.getChannelData(0);
  const right = impulse.getChannelData(1);

  let prevL = 0;
  let prevR = 0;

  for (let i = 0; i < length; i++) {
    const n = i / length;
    // Exponential decay with frequency dampening (highs decay faster)
    const expDecay = Math.pow(1 - n, decay);
    const highDamp = Math.pow(1 - n, decay * 1.8);

    const whiteL = (Math.random() * 2 - 1) * expDecay;
    const whiteR = (Math.random() * 2 - 1) * expDecay;

    // Gentle lowpass filter on impulse response to remove harsh digital static
    prevL = prevL * 0.65 + whiteL * 0.35 * highDamp;
    prevR = prevR * 0.65 + whiteR * 0.35 * highDamp;

    left[i] = prevL;
    right[i] = prevR;
  }
  return impulse;
}

/**
 * Creates a smooth analog tape saturation curve using hyperbolic tangent (tanh) soft-clipping.
 */
export function createDistortionCurve(amount: number): Float32Array {
  const drive = 1 + Math.max(0, amount) * 3;
  const nSamples = 44100;
  const curve = new Float32Array(nSamples);

  for (let i = 0; i < nSamples; ++i) {
    const x = (i * 2) / nSamples - 1;
    // Tanh soft-clipping gives warm analog harmonics without harsh digital clipping
    curve[i] = Math.tanh(x * drive);
  }
  return curve;
}

// ----------------------------------------------------------------------------
// 4. ORGANIC VINYL & AMBIENCE NOISE GENERATORS
// ----------------------------------------------------------------------------

export function createVinylNoiseBuffer(
  ctx: BaseAudioContext,
  durationSec: number,
  crackle: number,
  hiss: number,
  pop: number
): AudioBuffer {
  const sampleRate = ctx.sampleRate;
  const length = Math.ceil(sampleRate * Math.max(1, durationSec));
  const buffer = ctx.createBuffer(2, length, sampleRate);
  const left = buffer.getChannelData(0);
  const right = buffer.getChannelData(1);

  const hissVol = 0.004 * Math.min(1, hiss);
  const crackleVol = 0.08 * Math.min(1, crackle);
  const popVol = 0.15 * Math.min(1, pop);

  let b0L = 0, b1L = 0, b2L = 0;
  let b0R = 0, b1R = 0, b2R = 0;

  for (let i = 0; i < length; i++) {
    // Pink noise filter for warm analog vinyl surface hiss
    const whiteL = Math.random() * 2 - 1;
    const whiteR = Math.random() * 2 - 1;

    b0L = 0.992 * b0L + whiteL * 0.05;
    b1L = 0.95 * b1L + whiteL * 0.08;
    b2L = 0.85 * b2L + whiteL * 0.12;

    b0R = 0.992 * b0R + whiteR * 0.05;
    b1R = 0.95 * b1R + whiteR * 0.08;
    b2R = 0.85 * b2R + whiteR * 0.12;

    let sampleL = (b0L + b1L + b2L) * 0.15 * hissVol;
    let sampleR = (b0R + b1R + b2R) * 0.15 * hissVol;

    // Organic crackles (softened exponential bursts)
    if (crackle > 0 && Math.random() < 0.0008 * crackle) {
      const click = (Math.random() > 0.5 ? 1 : -1) * (0.02 + Math.random() * crackleVol);
      sampleL += click;
      sampleR += click * 0.85;
    }

    // Occasional subtle vinyl dust pop
    if (pop > 0 && Math.random() < 0.00015 * pop) {
      const p = (Math.random() > 0.5 ? 1 : -1) * (0.04 + Math.random() * popVol);
      sampleL += p;
      sampleR += p * 0.9;
    }

    left[i] = sampleL;
    right[i] = sampleR;
  }
  return buffer;
}

export function createAmbienceBuffer(
  ctx: BaseAudioContext,
  durationSec: number,
  type: AmbienceSettings['type']
): AudioBuffer | null {
  if (type === 'none') return null;

  const sampleRate = ctx.sampleRate;
  const length = Math.ceil(sampleRate * Math.max(1, durationSec));
  const buffer = ctx.createBuffer(2, length, sampleRate);
  const left = buffer.getChannelData(0);
  const right = buffer.getChannelData(1);

  let lastOutL = 0;
  let lastOutR = 0;

  for (let i = 0; i < length; i++) {
    const whiteL = Math.random() * 2 - 1;
    const whiteR = Math.random() * 2 - 1;

    if (type === 'rain') {
      // Soft warm rain acoustics
      lastOutL = lastOutL * 0.95 + whiteL * 0.05;
      lastOutR = lastOutR * 0.95 + whiteR * 0.05;
      let rainL = lastOutL * 0.35;
      let rainR = lastOutR * 0.35;
      if (Math.random() < 0.0001) {
        rainL += (Math.random() * 2 - 1) * 0.04;
      }
      left[i] = rainL;
      right[i] = rainR;
    } else if (type === 'fireplace') {
      // Gentle fire rumble & crackle
      lastOutL = lastOutL * 0.98 + whiteL * 0.02;
      lastOutR = lastOutR * 0.98 + whiteR * 0.02;
      let fireL = lastOutL * 0.4;
      let fireR = lastOutR * 0.4;
      if (Math.random() < 0.0005) {
        const pop = (Math.random() > 0.5 ? 1 : -1) * (0.02 + Math.random() * 0.08);
        fireL += pop;
        fireR += pop * 0.8;
      }
      left[i] = fireL;
      right[i] = fireR;
    } else if (type === 'night') {
      // Soft ambient night air breeze
      lastOutL = lastOutL * 0.97 + whiteL * 0.03;
      lastOutR = lastOutR * 0.97 + whiteR * 0.03;
      left[i] = lastOutL * 0.2;
      right[i] = lastOutR * 0.2;
    } else {
      // Warm room tone
      lastOutL = lastOutL * 0.94 + whiteL * 0.06;
      lastOutR = lastOutR * 0.94 + whiteR * 0.06;
      left[i] = lastOutL * 0.2;
      right[i] = lastOutR * 0.2;
    }
  }

  return buffer;
}

// ----------------------------------------------------------------------------
// 5. OFFLINE LOFI RENDERING ENGINE
// ----------------------------------------------------------------------------

export async function renderLofiAudioOffline(params: {
  inputBuffer: AudioBuffer;
  effects: LofiEffects;
  ambience: AmbienceSettings;
  onProgress?: (msg: string, pct: number) => void;
}): Promise<AudioBuffer> {
  const { inputBuffer, effects, ambience, onProgress } = params;

  if (onProgress) onProgress('Initializing offline audio context...', 10);

  const numChannels = Math.max(1, inputBuffer.numberOfChannels);
  const sampleRate = inputBuffer.sampleRate;
  const speed = Math.max(0.5, Math.min(1.5, effects.speed || 0.90));
  const renderDuration = Math.max(1, inputBuffer.duration / speed);
  const renderLength = Math.ceil(renderDuration * sampleRate);

  const offlineCtx = new OfflineAudioContext(numChannels, renderLength, sampleRate);

  if (onProgress) onProgress('Building high-quality Lofi filter graph...', 25);

  // 1. Source Node
  const source = offlineCtx.createBufferSource();
  source.buffer = inputBuffer;
  source.playbackRate.value = speed;
  if (effects.pitch !== 0) {
    source.detune.value = (effects.pitch || 0) * 100; // Semitones to cents
  }

  // 2. High-Pass Filter (Clean sub mud)
  const highPass = offlineCtx.createBiquadFilter();
  highPass.type = 'highpass';
  highPass.frequency.value = Math.max(20, Math.min(1000, effects.highPassFreq || 80));

  // 3. Low-Pass Filter (Warm vintage muffle with slight subtle resonance Q)
  const lowPass = offlineCtx.createBiquadFilter();
  lowPass.type = 'lowpass';
  lowPass.frequency.value = Math.max(500, Math.min(18000, effects.lowPassFreq || 7000));
  lowPass.Q.value = 0.7; // Warm musical resonance bump

  // 4. EQ Shelving Filters
  const bassFilter = offlineCtx.createBiquadFilter();
  bassFilter.type = 'lowshelf';
  bassFilter.frequency.value = 250;
  bassFilter.gain.value = Math.max(-12, Math.min(12, effects.bassGain || 0));

  const trebleFilter = offlineCtx.createBiquadFilter();
  trebleFilter.type = 'highshelf';
  trebleFilter.frequency.value = 4000;
  trebleFilter.gain.value = Math.max(-12, Math.min(12, effects.trebleGain || 0));

  // 5. Tape Saturation
  const tapeSaturationVal = effects.tapeSaturation || 0;
  const waveShaper = offlineCtx.createWaveShaper();
  if (tapeSaturationVal > 0) {
    waveShaper.curve = createDistortionCurve(tapeSaturationVal);
    waveShaper.oversample = '2x';
  }

  // 6. Space Reverb
  const reverbWet = effects.reverbWet || 0;
  const convolver = offlineCtx.createConvolver();
  const dryGain = offlineCtx.createGain();
  const wetGain = offlineCtx.createGain();

  if (reverbWet > 0) {
    convolver.buffer = createImpulseResponse(offlineCtx, effects.reverbDecay || 2.0, 2.5);
    wetGain.gain.value = reverbWet * 0.35;
    dryGain.gain.value = 1.0 - reverbWet * 0.25;
  } else {
    dryGain.gain.value = 1.0;
    wetGain.gain.value = 0.0;
  }

  // 7. Delay / Echo
  const delayWet = effects.delayWet || 0;
  const delayNode = offlineCtx.createDelay(1.0);
  const delayFeedback = offlineCtx.createGain();
  const delayGain = offlineCtx.createGain();

  if (delayWet > 0) {
    delayNode.delayTime.value = Math.max(0.05, Math.min(1.0, effects.delayTime || 0.3));
    delayFeedback.gain.value = Math.max(0, Math.min(0.6, effects.delayFeedback || 0.3));
    delayGain.gain.value = delayWet * 0.25;
  } else {
    delayGain.gain.value = 0.0;
  }

  // 8. Master Bus Gain & Compressor (Soft limiter prevents clipping)
  const masterGain = offlineCtx.createGain();
  masterGain.gain.value = Math.max(0.1, Math.min(1.0, effects.volume || 0.85));

  const compressor = offlineCtx.createDynamicsCompressor();
  compressor.threshold.value = -12; // dB
  compressor.knee.value = 10;
  compressor.ratio.value = 4;
  compressor.attack.value = 0.005;
  compressor.release.value = 0.1;

  // Connect Main Signal Chain
  let currentChain: AudioNode = source;

  currentChain.connect(highPass);
  currentChain = highPass;

  currentChain.connect(lowPass);
  currentChain = lowPass;

  currentChain.connect(bassFilter);
  currentChain = bassFilter;

  currentChain.connect(trebleFilter);
  currentChain = trebleFilter;

  if (tapeSaturationVal > 0) {
    currentChain.connect(waveShaper);
    currentChain = waveShaper;
  }

  // Reverb Split
  currentChain.connect(dryGain);
  dryGain.connect(masterGain);

  if (reverbWet > 0) {
    currentChain.connect(convolver);
    convolver.connect(wetGain);
    wetGain.connect(masterGain);
  }

  // Delay Loop
  if (delayWet > 0) {
    currentChain.connect(delayNode);
    delayNode.connect(delayFeedback);
    delayFeedback.connect(delayNode);
    delayNode.connect(delayGain);
    delayGain.connect(masterGain);
  }

  // Master -> Compressor -> Destination
  masterGain.connect(compressor);
  compressor.connect(offlineCtx.destination);

  // 9. Vinyl Noise Layer
  if ((effects.vinylCrackle || 0) > 0 || (effects.vinylHiss || 0) > 0 || (effects.vinylPop || 0) > 0) {
    if (onProgress) onProgress('Generating organic vinyl layer...', 45);
    const vinylBuf = createVinylNoiseBuffer(
      offlineCtx,
      renderDuration,
      effects.vinylCrackle || 0,
      effects.vinylHiss || 0,
      effects.vinylPop || 0
    );
    const vinylSource = offlineCtx.createBufferSource();
    vinylSource.buffer = vinylBuf;
    const vinylGainNode = offlineCtx.createGain();
    vinylGainNode.gain.value = Math.min(0.4, ((effects.vinylCrackle || 0) + (effects.vinylHiss || 0) + (effects.vinylPop || 0)) * 0.25);
    vinylSource.connect(vinylGainNode);
    vinylGainNode.connect(compressor);
    vinylSource.start(0);
  }

  // 10. Ambience Layer
  if (ambience.type !== 'none' && !ambience.muted) {
    if (onProgress) onProgress(`Synthesizing ${ambience.type} background ambience...`, 60);
    const ambBuf = createAmbienceBuffer(offlineCtx, renderDuration, ambience.type);
    if (ambBuf) {
      const ambSource = offlineCtx.createBufferSource();
      ambSource.buffer = ambBuf;
      const ambGainNode = offlineCtx.createGain();
      ambGainNode.gain.value = Math.min(0.35, (ambience.volume || 0.3) * 0.25);
      ambSource.connect(ambGainNode);
      ambGainNode.connect(compressor);
      ambSource.start(0);
    }
  }

  if (onProgress) onProgress('Rendering offline audio graph...', 75);

  // Start Main Source
  source.start(0);

  // Execute Offline Rendering
  const renderedBuffer = await offlineCtx.startRendering();

  if (onProgress) onProgress('Validating rendered audio samples...', 90);

  // Validate Rendered Audio
  const validation = validateAudioBuffer(renderedBuffer);
  if (!validation.valid) {
    throw new Error(validation.error || 'Rendered audio buffer was empty or silent.');
  }

  if (onProgress) onProgress('Audio rendering complete!', 100);

  return renderedBuffer;
}

// ----------------------------------------------------------------------------
// 6. SYNTHESIZE ORIGINAL HIGH-QUALITY LOFI TRACK (MODE 2 OFFLINE)
// ----------------------------------------------------------------------------

export async function synthesizeOriginalLofiTrack(params: {
  creator: CreatorSettings;
  onProgress?: (msg: string, pct: number) => void;
}): Promise<AudioBuffer> {
  const { creator, onProgress } = params;

  if (onProgress) onProgress('Initializing synthesizer engine...', 10);

  const durationSec = Math.max(10, Math.min(600, creator.durationSec || 60));
  const sampleRate = 44100;
  const offlineCtx = new OfflineAudioContext(2, Math.ceil(durationSec * sampleRate), sampleRate);

  const noteFreqs: Record<string, number> = {
    'C': 261.63, 'C#': 277.18, 'D': 293.66, 'D#': 311.13,
    'E': 329.63, 'F': 349.23, 'F#': 369.99, 'G': 392.00,
    'G#': 415.30, 'A': 440.00, 'A#': 466.16, 'B': 493.88
  };

  const rootFreq = noteFreqs[creator.key] || 440.0;
  const bpm = Math.max(50, Math.min(140, creator.bpm || 78));
  const beatSec = 60 / bpm;
  const totalBeats = Math.floor(durationSec / beatSec);

  // Master Gain & Limiter
  const synthMaster = offlineCtx.createGain();
  synthMaster.gain.value = 0.7;

  const masterCompressor = offlineCtx.createDynamicsCompressor();
  masterCompressor.threshold.value = -10;
  masterCompressor.knee.value = 8;
  masterCompressor.ratio.value = 3;
  masterCompressor.attack.value = 0.005;
  masterCompressor.release.value = 0.1;

  synthMaster.connect(masterCompressor);
  masterCompressor.connect(offlineCtx.destination);

  // Warm Rhodes/Piano Synthesizer with dual-oscillator warmth and smooth envelope
  function scheduleNote(freq: number, startTime: number, duration: number, type: string, gainVal: number) {
    const osc1 = offlineCtx.createOscillator();
    const osc2 = offlineCtx.createOscillator();
    const gain = offlineCtx.createGain();
    const filter = offlineCtx.createBiquadFilter();

    if (type === 'soft_piano' || type === 'electric_piano' || type === 'warm_keys') {
      osc1.type = 'triangle';
      osc2.type = 'sine';

      // Subtle detune for analog chorus warmth
      osc1.frequency.setValueAtTime(freq, startTime);
      osc2.frequency.setValueAtTime(freq * 1.002, startTime);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1400, startTime);
      filter.frequency.exponentialRampToValueAtTime(400, startTime + duration);

      // Soft attack, warm decay envelope
      gain.gain.setValueAtTime(0.0001, startTime);
      gain.gain.linearRampToValueAtTime(gainVal, startTime + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
    } else if (type === 'soft_bass') {
      osc1.type = 'sine';
      osc2.type = 'triangle';

      osc1.frequency.setValueAtTime(freq, startTime);
      osc2.frequency.setValueAtTime(freq * 0.5, startTime); // Sub octave

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(320, startTime);

      gain.gain.setValueAtTime(0.0001, startTime);
      gain.gain.linearRampToValueAtTime(gainVal * 0.8, startTime + 0.025);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
    } else {
      // Synth pad / bell / pluck
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(freq, startTime);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2000, startTime);

      gain.gain.setValueAtTime(0.0001, startTime);
      gain.gain.linearRampToValueAtTime(gainVal * 0.6, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      osc1.connect(filter);
      filter.connect(gain);
    }

    gain.connect(synthMaster);

    osc1.start(startTime);
    if (type === 'soft_piano' || type === 'electric_piano' || type === 'warm_keys' || type === 'soft_bass') {
      osc2.start(startTime);
      osc2.stop(startTime + duration + 0.1);
    }
    osc1.stop(startTime + duration + 0.1);
  }

  // Realistic Lofi Drum Synthesizer (Kick, Snare, HiHat)
  function scheduleDrum(type: 'kick' | 'snare' | 'hihat', startTime: number, gainVal: number) {
    if (type === 'kick') {
      // Warm punchy kick: pitch sweep sine + subtle body
      const osc = offlineCtx.createOscillator();
      const gain = offlineCtx.createGain();

      osc.frequency.setValueAtTime(110, startTime);
      osc.frequency.exponentialRampToValueAtTime(35, startTime + 0.1);

      gain.gain.setValueAtTime(gainVal * 0.9, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.16);

      osc.connect(gain);
      gain.connect(synthMaster);

      osc.start(startTime);
      osc.stop(startTime + 0.16);
    } else if (type === 'snare') {
      // Lofi Snare: 180Hz body tone + soft bandpassed noise rim
      const bodyOsc = offlineCtx.createOscillator();
      const bodyGain = offlineCtx.createGain();

      bodyOsc.frequency.setValueAtTime(180, startTime);
      bodyOsc.frequency.exponentialRampToValueAtTime(80, startTime + 0.08);

      bodyGain.gain.setValueAtTime(gainVal * 0.5, startTime);
      bodyGain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.09);

      bodyOsc.connect(bodyGain);
      bodyGain.connect(synthMaster);

      bodyOsc.start(startTime);
      bodyOsc.stop(startTime + 0.09);

      const noiseLen = offlineCtx.sampleRate * 0.14;
      const noiseBuffer = offlineCtx.createBuffer(1, noiseLen, offlineCtx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < output.length; i++) output[i] = Math.random() * 2 - 1;

      const noise = offlineCtx.createBufferSource();
      noise.buffer = noiseBuffer;

      const filter = offlineCtx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1200, startTime);
      filter.Q.value = 1.2;

      const noiseGain = offlineCtx.createGain();
      noiseGain.gain.setValueAtTime(gainVal * 0.4, startTime);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.12);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(synthMaster);

      noise.start(startTime);
    } else if (type === 'hihat') {
      // Soft Lofi Hihat: High pass filtered metallic noise
      const noiseLen = offlineCtx.sampleRate * 0.04;
      const noiseBuffer = offlineCtx.createBuffer(1, noiseLen, offlineCtx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < output.length; i++) output[i] = Math.random() * 2 - 1;

      const noise = offlineCtx.createBufferSource();
      noise.buffer = noiseBuffer;

      const filter = offlineCtx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(7000, startTime);

      const gain = offlineCtx.createGain();
      gain.gain.setValueAtTime(gainVal * 0.25, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.04);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(synthMaster);

      noise.start(startTime);
    }
  }

  if (onProgress) onProgress('Composing chord progression & rhythm...', 30);

  // Jazzy Minor 7th & Major 7th Lofi chord progressions
  const progressions = [
    [0, 3, 7, 10],  // i7 (e.g., Am7)
    [5, 8, 12, 15], // iv7 (e.g., Dm7)
    [7, 10, 14, 17], // v7 (e.g., Em7)
    [8, 12, 15, 19]  // VI7 (e.g., Fmaj7)
  ];

  const swingOffset = (creator.swing || 0.3) * 0.05;

  for (let b = 0; b < totalBeats; b++) {
    const time = b * beatSec;
    if (time >= durationSec - 0.5) break;

    const barIndex = Math.floor(b / 4) % progressions.length;
    const currentChord = progressions[barIndex];

    // Humanized velocity & micro timing jitter (+/- 2ms)
    const humanJitter = (Math.random() - 0.5) * 0.004;

    // Drums
    if (creator.enableDrums) {
      if (b % 2 === 0) scheduleDrum('kick', time + humanJitter, 0.28);
      if (b % 4 === 2) scheduleDrum('snare', time + humanJitter, 0.22);
      scheduleDrum('hihat', time + (b % 2 === 1 ? swingOffset : 0) + humanJitter, 0.12);
    }

    // Chords (played on beat 1 with soft strumming delay across chord notes)
    if (creator.enableChords && b % 4 === 0) {
      currentChord.forEach((semi, idx) => {
        const freq = rootFreq * Math.pow(2, semi / 12);
        const strumDelay = idx * 0.015; // Realistic keyboard strumming
        scheduleNote(freq, time + strumDelay, beatSec * 3.6, creator.instrument, 0.13);
      });
    }

    // Bass
    if (creator.enableBass && b % 2 === 0) {
      const bassSemi = currentChord[0] - 12; // Octave lower
      const freq = rootFreq * Math.pow(2, bassSemi / 12);
      scheduleNote(freq, time, beatSec * 1.8, 'soft_bass', 0.2);
    }

    // Melody line
    if (creator.enableMelody && b % 2 === 1 && Math.random() < 0.65) {
      const melSemi = currentChord[Math.floor(Math.random() * currentChord.length)] + 12; // Octave higher
      const freq = rootFreq * Math.pow(2, melSemi / 12);
      scheduleNote(freq, time + swingOffset + humanJitter, beatSec * 0.8, creator.instrument, 0.11);
    }
  }

  if (onProgress) onProgress('Synthesizing audio samples...', 70);

  const synthesizedBuffer = await offlineCtx.startRendering();

  const validation = validateAudioBuffer(synthesizedBuffer);
  if (!validation.valid) {
    throw new Error(validation.error || 'Failed to synthesize audio buffer.');
  }

  if (onProgress) onProgress('Original track synthesized successfully!', 100);

  return synthesizedBuffer;
}
