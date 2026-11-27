import { SoundProfile } from '@/shared';

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const AudioContextClass =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!AudioContextClass) return null;

  if (!audioCtx) {
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    void audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Plays a lightweight synthesized keystroke sound using the Web Audio API.
 */
export function playKeystrokeSound(
  profile: SoundProfile,
  volume: number,
  isError: boolean,
  playErrorTone = true,
): void {
  if (profile === SoundProfile.OFF || volume <= 0) return;

  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const gainLevel = Math.min(1, Math.max(0, volume)) * 0.25;

  if (isError && playErrorTone) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(165, now);
    osc.frequency.exponentialRampToValueAtTime(110, now + 0.065);
    gain.gain.setValueAtTime(gainLevel * 0.9, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.075);
    return;
  }

  // Short filtered noise burst for tactile switch feel
  const bufferSize = Math.floor(ctx.sampleRate * 0.03);
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.28));
  }

  const noise = ctx.createBufferSource();
  noise.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  const noiseGain = ctx.createGain();

  const osc = ctx.createOscillator();
  const oscGain = ctx.createGain();

  if (profile === SoundProfile.MECHANICAL) {
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1900, now);
    filter.Q.setValueAtTime(1.4, now);
    noiseGain.gain.setValueAtTime(gainLevel * 0.95, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(85, now + 0.025);
    oscGain.gain.setValueAtTime(gainLevel * 0.65, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.028);
  } else if (profile === SoundProfile.THOCK) {
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(420, now);
    noiseGain.gain.setValueAtTime(gainLevel * 0.75, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(145, now);
    osc.frequency.exponentialRampToValueAtTime(52, now + 0.038);
    oscGain.gain.setValueAtTime(gainLevel * 0.95, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
  } else if (profile === SoundProfile.SOFT) {
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(650, now);
    noiseGain.gain.setValueAtTime(gainLevel * 0.45, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(70, now + 0.02);
    oscGain.gain.setValueAtTime(gainLevel * 0.45, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.022);
  } else if (profile === SoundProfile.POP) {
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(900, now);
    noiseGain.gain.setValueAtTime(gainLevel * 0.2, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.018);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(260, now);
    osc.frequency.exponentialRampToValueAtTime(540, now + 0.024);
    oscGain.gain.setValueAtTime(gainLevel * 0.75, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.028);
  } else if (profile === SoundProfile.BEEP) {
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1200, now);
    noiseGain.gain.setValueAtTime(0.001, now);

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(680, now);
    osc.frequency.exponentialRampToValueAtTime(440, now + 0.025);
    oscGain.gain.setValueAtTime(gainLevel * 0.5, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
  } else if (profile === SoundProfile.CRYSTAL) {
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(3200, now);
    noiseGain.gain.setValueAtTime(gainLevel * 0.25, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1320, now);
    osc.frequency.exponentialRampToValueAtTime(980, now + 0.035);
    oscGain.gain.setValueAtTime(gainLevel * 0.45, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
  } else {
    // TYPEWRITER
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(2400, now);
    noiseGain.gain.setValueAtTime(gainLevel * 1.1, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.026);

    osc.type = 'square';
    osc.frequency.setValueAtTime(520, now);
    osc.frequency.exponentialRampToValueAtTime(180, now + 0.018);
    oscGain.gain.setValueAtTime(gainLevel * 0.22, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);
  }

  noise.connect(filter);
  filter.connect(noiseGain);
  noiseGain.connect(ctx.destination);

  osc.connect(oscGain);
  oscGain.connect(ctx.destination);

  noise.start(now);
  noise.stop(now + 0.03);
  osc.start(now);
  osc.stop(now + 0.03);
}

