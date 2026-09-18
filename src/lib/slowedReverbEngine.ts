// ============================================================================
// SLOWED & REVERB AUDIO PROCESSING ENGINE
// High-Quality Client-Side Offline Audio Context Pipeline with Peak Limiting
// ============================================================================

export interface SlowedReverbOptions {
  speed: number; // e.g. 0.85x
  reverbPreset: 'light' | 'medium' | 'deep' | 'custom';
  reverbWetAmount?: number; // 0.0 to 0.5 (e.g., 0.15 for 15%)
  outputVolume?: number; // 0.1 to 1.0 (e.g. 0.95)
}

export interface ValidationResult {
  valid: boolean;
  error?: string;
  maxAmplitude: number;
  rms: number;
}

/**
 * Validates whether an AudioBuffer contains actual non-zero playable sound.
 */
export function validateAudioBuffer(buffer: AudioBuffer | null): ValidationResult {
  if (!buffer) {
    return { valid: false, error: 'No audio data found.', maxAmplitude: 0, rms: 0 };
  }
  if (buffer.length === 0 || buffer.duration <= 0.1 || buffer.numberOfChannels === 0 || buffer.sampleRate <= 0) {
    return { valid: false, error: 'Audio file metadata or duration is invalid.', maxAmplitude: 0, rms: 0 };
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
    return { valid: false, error: 'The processed audio contains complete silence (zero amplitude).', maxAmplitude: maxAmp, rms };
  }

  if (rms < 0.00001) {
    return { valid: false, error: 'The processed audio RMS level is silent or too low.', maxAmplitude: maxAmp, rms };
  }

  return { valid: true, maxAmplitude: maxAmp, rms };
}

/**
 * Generates a smooth, warm impulse response AudioBuffer for convolution reverb.
 */
export function createReverbImpulse(ctx: BaseAudioContext, durationSec: number, decay: number): AudioBuffer {
  const sampleRate = ctx.sampleRate;
  const length = Math.max(100, Math.ceil(sampleRate * durationSec));
  const impulse = ctx.createBuffer(2, length, sampleRate);
  const left = impulse.getChannelData(0);
  const right = impulse.getChannelData(1);

  let prevL = 0;
  let prevR = 0;

  for (let i = 0; i < length; i++) {
    const n = i / length;
    // Exponential decay with high-frequency dampening for warm acoustic spaciousness
    const expDecay = Math.pow(1 - n, decay);
    const highDamp = Math.pow(1 - n, decay * 1.6);

    const whiteL = (Math.random() * 2 - 1) * expDecay;
    const whiteR = (Math.random() * 2 - 1) * expDecay;

    // Gentle lowpass filter on impulse response
    prevL = prevL * 0.6 + whiteL * 0.4 * highDamp;
    prevR = prevR * 0.6 + whiteR * 0.4 * highDamp;

    left[i] = prevL;
    right[i] = prevR;
  }
  return impulse;
}

/**
 * Core Offline Audio Context Pipeline for Slowed & Reverb.
 */
export async function processSlowedAndReverb(
  inputBuffer: AudioBuffer,
  options: SlowedReverbOptions,
  onProgress?: (stage: string, percent: number) => void
): Promise<AudioBuffer> {
  // 1. Initial Input Validation
  const inputCheck = validateAudioBuffer(inputBuffer);
  if (!inputCheck.valid) {
    throw new Error(inputCheck.error || 'Could not process this audio. Please try another file.');
  }

  if (onProgress) onProgress('Initializing audio engine...', 10);

  const speed = Math.max(0.5, Math.min(1.2, options.speed || 0.85));
  const sampleRate = inputBuffer.sampleRate;
  const numChannels = Math.max(1, Math.min(2, inputBuffer.numberOfChannels));

  // Determine reverb parameters based on preset
  let wetGainVal = 0.15; // Default Medium ~15%
  let reverbDecaySec = 2.8;

  if (options.reverbPreset === 'light') {
    wetGainVal = 0.10;
    reverbDecaySec = 1.8;
  } else if (options.reverbPreset === 'deep') {
    wetGainVal = 0.24;
    reverbDecaySec = 4.2;
  } else if (options.reverbPreset === 'custom' && typeof options.reverbWetAmount === 'number') {
    wetGainVal = Math.max(0.02, Math.min(0.45, options.reverbWetAmount));
    reverbDecaySec = 2.8;
  }

  // Calculate slowed render duration & sample count (add extra 2.5s tail for reverb decay)
  const baseDuration = inputBuffer.duration / speed;
  const totalRenderDuration = baseDuration + (wetGainVal > 0 ? reverbDecaySec * 0.8 : 0.5);
  const totalRenderSamples = Math.ceil(totalRenderDuration * sampleRate);

  // 2. Instantiate Offline Context
  const offlineCtx = new OfflineAudioContext(numChannels, totalRenderSamples, sampleRate);

  if (onProgress) onProgress('Building slowed + reverb audio graph...', 30);

  // Buffer Source Node with Playback Speed
  const source = offlineCtx.createBufferSource();
  source.buffer = inputBuffer;
  source.playbackRate.value = speed; // Natural pitch + speed alteration

  // Reverb Convolver & Gains
  const dryGainNode = offlineCtx.createGain();
  const wetGainNode = offlineCtx.createGain();
  const convolver = offlineCtx.createConvolver();

  dryGainNode.gain.value = 1.0 - (wetGainVal * 0.4); // Keep dry signal strong
  wetGainNode.gain.value = wetGainVal;

  if (wetGainVal > 0) {
    convolver.buffer = createReverbImpulse(offlineCtx, reverbDecaySec, 2.5);
  }

  // Master Gain & Anti-Clipping Dynamics Compressor / Soft Limiter
  const masterVolume = Math.max(0.1, Math.min(1.0, options.outputVolume ?? 0.95));
  const masterGainNode = offlineCtx.createGain();
  masterGainNode.gain.value = masterVolume;

  const limiter = offlineCtx.createDynamicsCompressor();
  limiter.threshold.value = -3.0; // dBFS
  limiter.knee.value = 6;
  limiter.ratio.value = 12;
  limiter.attack.value = 0.003;
  limiter.release.value = 0.08;

  // Signal Routing
  // Source -> Dry Gain -> Master
  source.connect(dryGainNode);
  dryGainNode.connect(masterGainNode);

  // Source -> Convolver -> Wet Gain -> Master
  if (wetGainVal > 0) {
    source.connect(convolver);
    convolver.connect(wetGainNode);
    wetGainNode.connect(masterGainNode);
  }

  // Master -> Limiter -> Destination
  masterGainNode.connect(limiter);
  limiter.connect(offlineCtx.destination);

  if (onProgress) onProgress('Rendering slowed audio...', 60);

  // Start Source & Execute Render
  source.start(0);
  const renderedBuffer = await offlineCtx.startRendering();

  if (onProgress) onProgress('Validating rendered audio signal...', 85);

  // 3. Post-Render Quality & Amplitude Inspection
  const outputCheck = validateAudioBuffer(renderedBuffer);
  if (!outputCheck.valid) {
    throw new Error('Could not process this audio. Please try another file.');
  }

  // Normalized Peak Clipping Prevention Check
  const channelData = renderedBuffer.getChannelData(0);
  let maxPeak = 0;
  for (let i = 0; i < channelData.length; i += 10) {
    const val = Math.abs(channelData[i]);
    if (val > maxPeak) maxPeak = val;
  }

  // Target max peak is ~0.89 (-1 dBFS) to guarantee no clipping distortion
  if (maxPeak > 0.92) {
    const scaleFactor = 0.89 / maxPeak;
    for (let c = 0; c < renderedBuffer.numberOfChannels; c++) {
      const data = renderedBuffer.getChannelData(c);
      for (let i = 0; i < data.length; i++) {
        data[i] *= scaleFactor;
      }
    }
  }

  if (onProgress) onProgress('Slowed + Reverb complete!', 100);

  return renderedBuffer;
}
