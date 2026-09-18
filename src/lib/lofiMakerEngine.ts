// ============================================================================
// AUTOMATIC LOFI AUDIO MAKER ENGINE
// One-click tuned offline audio processing pipeline
// ============================================================================

import { validateAudioBuffer } from './slowedReverbEngine';

export interface LofiOptions {
  speed?: number; // e.g. 0.83 (17% slowed)
  reverbWet?: number; // e.g. 0.30 (30% wet reverb)
  lowPassCutoff?: number; // e.g. 3200 Hz
  highPassCutoff?: number; // e.g. 50 Hz
  vinylNoiseVolume?: number; // e.g. 0.15
  reverbDecaySec?: number; // e.g. 3.8s
}

export interface LofiMakerResult {
  renderedBuffer: AudioBuffer;
}

/**
 * Creates a rich, warm impulse response for vinyl/lofi space reverb
 */
function createLofiImpulseResponse(ctx: BaseAudioContext, durationSec: number = 3.8, decay: number = 2.2): AudioBuffer {
  const sampleRate = ctx.sampleRate;
  const length = Math.max(100, Math.ceil(sampleRate * durationSec));
  const impulse = ctx.createBuffer(2, length, sampleRate);
  const left = impulse.getChannelData(0);
  const right = impulse.getChannelData(1);

  let prevL = 0;
  let prevR = 0;

  for (let i = 0; i < length; i++) {
    const n = i / length;
    const expDecay = Math.pow(1 - n, decay);
    const highDamp = Math.pow(1 - n, decay * 1.5);

    const whiteL = (Math.random() * 2 - 1) * expDecay;
    const whiteR = (Math.random() * 2 - 1) * expDecay;

    // Smooth stereo diffusion
    prevL = prevL * 0.62 + whiteL * 0.38 * highDamp;
    prevR = prevR * 0.62 + whiteR * 0.38 * highDamp;

    left[i] = prevL;
    right[i] = prevR;
  }
  return impulse;
}

/**
 * Creates an analog tape saturation wave shaper curve
 */
function createTapeSaturationCurve(): Float32Array {
  const nSamples = 44100;
  const curve = new Float32Array(nSamples);
  const drive = 1.35; // Gentle warm saturation

  for (let i = 0; i < nSamples; ++i) {
    const x = (i * 2) / nSamples - 1;
    curve[i] = Math.tanh(x * drive);
  }
  return curve;
}

/**
 * Creates a subtle background vinyl noise buffer
 */
function createSubtleVinylBuffer(ctx: BaseAudioContext, durationSec: number): AudioBuffer {
  const sampleRate = ctx.sampleRate;
  const length = Math.ceil(sampleRate * Math.max(1, durationSec));
  const buffer = ctx.createBuffer(2, length, sampleRate);
  const left = buffer.getChannelData(0);
  const right = buffer.getChannelData(1);

  let b0L = 0, b1L = 0, b2L = 0;
  let b0R = 0, b1R = 0, b2R = 0;

  for (let i = 0; i < length; i++) {
    const whiteL = Math.random() * 2 - 1;
    const whiteR = Math.random() * 2 - 1;

    b0L = 0.992 * b0L + whiteL * 0.05;
    b1L = 0.95 * b1L + whiteL * 0.08;
    b2L = 0.85 * b2L + whiteL * 0.12;

    b0R = 0.992 * b0R + whiteR * 0.05;
    b1R = 0.95 * b1R + whiteR * 0.08;
    b2R = 0.85 * b2R + whiteR * 0.12;

    let sampleL = (b0L + b1L + b2L) * 0.003;
    let sampleR = (b0R + b1R + b2R) * 0.003;

    // Rare soft crackle
    if (Math.random() < 0.0004) {
      const click = (Math.random() > 0.5 ? 1 : -1) * 0.018;
      sampleL += click;
      sampleR += click * 0.85;
    }

    left[i] = sampleL;
    right[i] = sampleR;
  }
  return buffer;
}

/**
 * Automatic / Customizable Lofi & Slowed Reverb Processing Pipeline
 */
export async function processAutomaticLofi(
  inputBuffer: AudioBuffer,
  options: LofiOptions = {},
  onProgress?: (stage: string, percent: number) => void
): Promise<AudioBuffer> {
  // Validate input
  const val = validateAudioBuffer(inputBuffer);
  if (!val.valid) {
    throw new Error(val.error || 'Sorry, we couldn\'t process this audio. Please try another file.');
  }

  if (onProgress) onProgress('Creating Lofi version...', 20);

  // Tuned Audioalter-style Slowed & Reverb Lofi parameters
  const speed = Math.max(0.60, Math.min(1.0, options.speed ?? 0.85)); // 0.85x speed (15% slowed down, perfect Audioalter pitch drop)
  const lowPassCutoff = Math.max(1000, Math.min(15000, options.lowPassCutoff ?? 4500)); // 4.5 kHz warm filter
  const highPassCutoff = Math.max(20, Math.min(200, options.highPassCutoff ?? 50)); // Clean sub mud
  const reverbWet = Math.max(0.0, Math.min(0.60, options.reverbWet ?? 0.35)); // 35% wet atmospheric space reverb
  const reverbDecaySec = Math.max(1.0, Math.min(6.0, options.reverbDecaySec ?? 3.8)); // 3.8s rich hall decay
  const vinylNoiseVolume = Math.max(0.0, Math.min(0.50, options.vinylNoiseVolume ?? 0.10));
  const masterVolume = 0.95;

  const sampleRate = inputBuffer.sampleRate;
  const numChannels = Math.max(1, Math.min(2, inputBuffer.numberOfChannels));
  const renderDuration = (inputBuffer.duration / speed) + (reverbWet > 0 ? reverbDecaySec : 1.0);
  const renderLength = Math.ceil(renderDuration * sampleRate);

  const offlineCtx = new OfflineAudioContext(numChannels, renderLength, sampleRate);

  // 1. Source Node
  const source = offlineCtx.createBufferSource();
  source.buffer = inputBuffer;
  source.playbackRate.value = speed; // Natural pitch + speed reduction

  // 2. High-Pass Filter
  const highPass = offlineCtx.createBiquadFilter();
  highPass.type = 'highpass';
  highPass.frequency.value = highPassCutoff;

  // 3. Low-Pass Filter (Warm vintage muffle)
  const lowPass = offlineCtx.createBiquadFilter();
  lowPass.type = 'lowpass';
  lowPass.frequency.value = lowPassCutoff;
  lowPass.Q.value = 0.8;

  // 4. Subtle Tape Saturation
  const waveShaper = offlineCtx.createWaveShaper();
  waveShaper.curve = createTapeSaturationCurve();
  waveShaper.oversample = '2x';

  // 5. Warm Space Reverb
  const convolver = offlineCtx.createConvolver();
  convolver.buffer = createLofiImpulseResponse(offlineCtx, reverbDecaySec, 2.2);

  const dryGain = offlineCtx.createGain();
  const wetGain = offlineCtx.createGain();

  dryGain.gain.value = Math.max(0.3, 1.0 - (reverbWet * 0.4));
  wetGain.gain.value = reverbWet;

  // 6. Master Volume & Dynamics Compressor / Limiter
  const masterGain = offlineCtx.createGain();
  masterGain.gain.value = masterVolume;

  const limiter = offlineCtx.createDynamicsCompressor();
  limiter.threshold.value = -2.5; // dBFS
  limiter.knee.value = 8;
  limiter.ratio.value = 10;
  limiter.attack.value = 0.005;
  limiter.release.value = 0.1;

  // Signal Routing
  source.connect(highPass);
  highPass.connect(lowPass);
  lowPass.connect(waveShaper);

  // Split dry and reverb wet
  waveShaper.connect(dryGain);
  dryGain.connect(masterGain);

  if (reverbWet > 0) {
    waveShaper.connect(convolver);
    convolver.connect(wetGain);
    wetGain.connect(masterGain);
  }

  masterGain.connect(limiter);
  limiter.connect(offlineCtx.destination);

  // 7. Add Subtle Vinyl Surface Noise Layer if enabled
  if (vinylNoiseVolume > 0) {
    const vinylBuf = createSubtleVinylBuffer(offlineCtx, renderDuration);
    const vinylSource = offlineCtx.createBufferSource();
    vinylSource.buffer = vinylBuf;
    const vinylGain = offlineCtx.createGain();
    vinylGain.gain.value = vinylNoiseVolume * 0.12;
    vinylSource.connect(vinylGain);
    vinylGain.connect(limiter);
    vinylSource.start(0);
  }

  if (onProgress) onProgress('Creating Slowed & Reverb Lofi version...', 50);

  // Start source & render
  source.start(0);
  const renderedBuffer = await offlineCtx.startRendering();

  if (onProgress) onProgress('Validating Lofi audio...', 80);

  // Post-render validation
  const outputCheck = validateAudioBuffer(renderedBuffer);
  if (!outputCheck.valid) {
    throw new Error('Sorry, we couldn\'t process this audio. Please try another file.');
  }

  // Peak Normalization / Soft Safety Scaling
  const channelData = renderedBuffer.getChannelData(0);
  let maxPeak = 0;
  for (let i = 0; i < channelData.length; i += 10) {
    const val = Math.abs(channelData[i]);
    if (val > maxPeak) maxPeak = val;
  }

  if (maxPeak > 0.90) {
    const scaleFactor = 0.88 / maxPeak; // Ceiling at -1 dBFS
    for (let c = 0; c < renderedBuffer.numberOfChannels; c++) {
      const data = renderedBuffer.getChannelData(c);
      for (let i = 0; i < data.length; i++) {
        data[i] *= scaleFactor;
      }
    }
  }

  if (onProgress) onProgress('Lofi version ready!', 100);

  return renderedBuffer;
}
