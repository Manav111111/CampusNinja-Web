'use client';

/**
 * Procedural cinematic sound for the ninja intro.
 *
 * 100% synthesized with the Web Audio API — zero external audio files, so
 * there are no sample licenses, royalties, or attribution obligations.
 *
 * Autoplay rules are respected: nothing is created until the user presses the
 * "Sound on" button (a real user gesture). All cue functions are safe no-ops
 * until then, so the intro is always visually complete when silent.
 *
 * Sync model: `NinjaScene` owns the cinematic clock and calls the cue
 * functions at exact timeline crossings (footfalls, draw, strike start,
 * blade impact), so sound can never drift from the picture. Enabling sound
 * mid-intro simply starts future cues from the current frame — past cues are
 * skipped, never piled up.
 */

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let noiseBuf: AudioBuffer | null = null;
let bedStop: (() => void) | null = null;
let enabled = false;

function ensureCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (ctx) {
    if (ctx.state === 'suspended') void ctx.resume();
    return ctx;
  }
  try {
    const AC =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.42;
    // Gentle limiter so layered transients can never clip painfully.
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -18;
    comp.knee.value = 12;
    comp.ratio.value = 8;
    comp.attack.value = 0.003;
    comp.release.value = 0.24;
    master.connect(comp);
    comp.connect(ctx.destination);
    // Shared 2s white-noise buffer for all filtered-noise cues.
    noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const data = noiseBuf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  } catch {
    ctx = null;
    master = null;
  }
  return ctx;
}

function live(): boolean {
  return enabled && !!ctx && !!master && ctx.state === 'running';
}

function noiseSource(when: number, dur: number): AudioBufferSourceNode | null {
  if (!ctx || !noiseBuf) return null;
  const src = ctx.createBufferSource();
  src.buffer = noiseBuf;
  src.loop = true;
  src.start(when, Math.random() * 1.2);
  src.stop(when + dur + 0.05);
  return src;
}

function blip(
  freqFrom: number,
  freqTo: number,
  dur: number,
  gain: number,
  type: OscillatorType = 'sine',
  delay = 0,
): void {
  if (!ctx || !master) return;
  const t = ctx.currentTime + delay;
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(Math.max(20, freqFrom), t);
  osc.frequency.exponentialRampToValueAtTime(Math.max(20, freqTo), t + dur);
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(gain, t + 0.008);
  g.gain.exponentialRampToValueAtTime(0.0004, t + dur);
  osc.connect(g);
  g.connect(master);
  osc.start(t);
  osc.stop(t + dur + 0.05);
}

function noiseHit(
  filterType: BiquadFilterType,
  freqFrom: number,
  freqTo: number,
  dur: number,
  gain: number,
  q = 1,
  delay = 0,
): void {
  if (!ctx || !master) return;
  const t = ctx.currentTime + delay;
  const src = noiseSource(t, dur);
  if (!src) return;
  const f = ctx.createBiquadFilter();
  f.type = filterType;
  f.Q.value = q;
  f.frequency.setValueAtTime(freqFrom, t);
  f.frequency.exponentialRampToValueAtTime(Math.max(30, freqTo), t + dur);
  const g = ctx.createGain();
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(gain, t + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0004, t + dur);
  src.connect(f);
  f.connect(g);
  g.connect(master);
}

/** User gesture: build/resume the context and start the ambience bed. */
export function unlockIntroAudio(): boolean {
  const c = ensureCtx();
  if (!c || !master) return false;
  enabled = true;
  if (c.state !== 'running') {
    // Resume is async; the toggle reflects intent while `live()` keeps every
    // cue gated on the context actually running.
    void c.resume().then(() => {
      if (enabled) startBed();
    });
    return true;
  }
  startBed();
  return true;
}

export function setIntroAudioEnabled(on: boolean): void {
  enabled = on;
  if (!ctx) return;
  if (on) {
    void ctx.resume().then(() => {
      if (enabled) startBed();
    });
  } else {
    stopIntroBed();
    void ctx.suspend();
  }
}

export function isIntroAudioEnabled(): boolean {
  return enabled;
}

/** Dark room-tone bed: lowpassed noise + faint sub drone with a slow swell. */
function startBed(): void {
  if (!ctx || !master || bedStop) return;
  const c = ctx;
  const m = master;
  const src = c.createBufferSource();
  if (!noiseBuf) return;
  src.buffer = noiseBuf;
  src.loop = true;
  const lp = c.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.value = 200;
  const g = c.createGain();
  g.gain.value = 0.05;
  const lfo = c.createOscillator();
  lfo.frequency.value = 0.13;
  const lfoGain = c.createGain();
  lfoGain.gain.value = 0.02;
  lfo.connect(lfoGain);
  lfoGain.connect(g.gain);
  src.connect(lp);
  lp.connect(g);
  g.connect(m);
  src.start();
  lfo.start();
  const drone = c.createOscillator();
  drone.type = 'sine';
  drone.frequency.value = 48;
  const dg = c.createGain();
  dg.gain.value = 0.016;
  drone.connect(dg);
  dg.connect(m);
  drone.start();
  bedStop = () => {
    try {
      const t = c.currentTime;
      g.gain.linearRampToValueAtTime(0, t + 0.4);
      dg.gain.linearRampToValueAtTime(0, t + 0.4);
      src.stop(t + 0.5);
      lfo.stop(t + 0.5);
      drone.stop(t + 0.5);
    } catch {
      // already stopped
    }
    bedStop = null;
  };
}

export function stopIntroBed(): void {
  bedStop?.();
}

/** Measured footstep: pitch-dropping thump, alternating stereo placement. */
export function soundFootstep(left: boolean): void {
  if (!live() || !ctx || !master) return;
  const t = ctx.currentTime;
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(72, t);
  osc.frequency.exponentialRampToValueAtTime(36, t + 0.14);
  g.gain.setValueAtTime(0.5, t);
  g.gain.exponentialRampToValueAtTime(0.0004, t + 0.16);
  let tail: AudioNode = g;
  try {
    const pan = ctx.createStereoPanner();
    pan.pan.value = left ? -0.4 : 0.4;
    g.connect(pan);
    tail = pan;
  } catch {
    g.connect(master);
    return;
  }
  osc.connect(g);
  tail.connect(master);
  osc.start(t);
  osc.stop(t + 0.2);
  noiseHit('lowpass', 500, 140, 0.09, 0.12);
}

/** Faint cloth/armor swish between strides. */
export function soundCloth(): void {
  if (!live()) return;
  noiseHit('bandpass', 1400, 700, 0.2, 0.05, 0.8);
}

/** Katana draw: metallic shing with an upward partial sweep. */
export function soundDraw(): void {
  if (!live()) return;
  noiseHit('highpass', 2600, 5200, 0.28, 0.1);
  noiseHit('bandpass', 1700, 4900, 0.24, 0.12, 6);
  blip(5900, 6400, 0.3, 0.02, 'sine');
}

/** Accelerating air-cut whoosh across the strike window. */
export function soundWhoosh(dur = 0.45): void {
  if (!live()) return;
  noiseHit('bandpass', 320, 4600, dur, 0.22, 1.4);
  blip(160, 60, dur, 0.1, 'sine');
}

/** Blade-crossing moment: crisp cut transient + deep impact + embers. */
export function soundImpact(): void {
  if (!live()) return;
  // Crisp cutting transient.
  noiseHit('highpass', 3200, 7000, 0.1, 0.2);
  blip(300, 90, 0.06, 0.25, 'square');
  // Metallic tail (inharmonic partials, fast decay — not a neon synth).
  blip(2093, 2080, 0.5, 0.05);
  blip(2960, 2940, 0.38, 0.035);
  blip(5231, 5200, 0.26, 0.02);
  // Low-frequency screen-split weight.
  blip(130, 34, 0.55, 0.4);
  noiseHit('lowpass', 900, 90, 0.4, 0.28);
  // Scattered fragment ticks.
  for (let i = 0; i < 5; i++) {
    noiseHit('highpass', 4500 + i * 700, 6500, 0.05, 0.05, 1, 0.05 + i * 0.07);
  }
}

/** Logo reveal resonance: low swell + soft metallic shimmer. */
export function soundReveal(): void {
  if (!live() || !ctx || !master) return;
  const t = ctx.currentTime;
  const swell = ctx.createOscillator();
  swell.type = 'sine';
  swell.frequency.value = 55;
  const sg = ctx.createGain();
  sg.gain.setValueAtTime(0, t);
  sg.gain.linearRampToValueAtTime(0.22, t + 0.4);
  sg.gain.exponentialRampToValueAtTime(0.0004, t + 1.8);
  swell.connect(sg);
  sg.connect(master);
  swell.start(t);
  swell.stop(t + 1.9);
  blip(110, 108, 1.6, 0.08, 'sine', 0.05);
  blip(880, 876, 1.2, 0.025, 'sine', 0.1);
  blip(1318, 1310, 1.0, 0.018, 'sine', 0.16);
  noiseHit('bandpass', 900, 2400, 0.8, 0.04, 0.7, 0.05);
}
