'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

/**
 * Cinematic intro overlay — pre-rendered 3D samurai cinematic (Blender/Eevee).
 *
 * Source: `Documents/CampusNinja-Cine/grab3d/cine_full.blend` (kept outside the
 * repo). Character: Grab3D "Samurai" (CC0 1.0, no attribution required;
 * bundled LICENSE.txt in the external workspace). Katana: Poly Haven
 * "Antique Katana" (CC0). Scabbard modelled in Blender. All sound is
 * procedurally synthesised original audio embedded in the video file — zero
 * third-party samples, zero licenses, zero royalties.
 *
 * Timeline (video clock, verified against rendered frames):
 * - 0.0s  establishing push-in over the burning fortress courtyard
 * - ~2.0s  samurai walk-in (mocap walk action, constant-speed root travel)
 * - ~5.4s  hand grips hilt, katana draw along the scabbard axis
 * - ~6.7s  diagonal slash, screen top-left → bottom-right
 * - 7.083s IMPACT (frame 170): fullscreen flash; DOM screen-split fires here
 * - 8.0s  video ends over settling embers; logo reveal follows
 *
 * Sound is part of the video file, so it can never desynchronise. Browsers
 * forbid autoplay with sound, so playback starts from an explicit
 * "Enter Campus Ninja" gesture. Reduced-motion users never render this
 * (parent gate in `src/app/page.tsx`).
 *
 * Safety / accessibility:
 * - Always skippable (Skip button, Escape, gate-level skip link).
 * - Absolute failsafe timer; video error/crash → immediate finish (landing
 *   page is never trapped behind the intro).
 * - Login / Sign Up stay mounted behind the overlay the whole time.
 * - `?nocine=1` forces the silent fallback path (logo + split, no video).
 */

const VIDEO_SRC = '/videos/cn-intro.mp4';
const POSTER_SRC = '/videos/cn-intro-poster.jpg';
/** Blade-crossing frame 170 @ 24fps, verified against rendered frames. */
const IMPACT_T = 170 / 24;
const FAILSAFE_MS = 20000;
const REVEAL_HOLD_MS = 1400;

type Phase = 'gate' | 'cinema' | 'split' | 'reveal' | 'fallback-split' | 'fallback-reveal';

interface IntroOverlayProps {
  onComplete: () => void;
}

interface Shard {
  left: string;
  top: string;
  size: number;
  driftX: number;
  driftY: number;
  delay: number;
  duration: number;
  round: boolean;
}

/** Deterministic pseudo-random shards (no Math.random in render → no hydration mismatch). */
function buildShards(count: number): Shard[] {
  return Array.from({ length: count }, (_, i) => {
    const a = (i * 137.5) % 100;
    const b = (i * 89.3) % 100;
    const c = (i * 53.7) % 100;
    return {
      left: `${8 + (a / 100) * 84}%`,
      top: `${12 + (b / 100) * 76}%`,
      size: 2 + ((c / 100) * 5),
      driftX: (a > 50 ? 1 : -1) * (30 + (b / 100) * 130),
      driftY: (b > 50 ? 1 : -1) * (20 + (c / 100) * 110),
      delay: (i % 7) * 0.04,
      duration: 0.7 + ((c / 100) * 0.9),
      round: i % 3 === 0,
    };
  });
}

export const IntroOverlay: React.FC<IntroOverlayProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<Phase>('gate');
  const [visible, setVisible] = useState(true);
  const [failed, setFailed] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const finishedRef = useRef(false);
  const shards = useMemo(() => buildShards(26), []);
  const forceFallback = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return new URLSearchParams(window.location.search).get('nocine') === '1';
  }, []);

  const finish = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    // Guarantee silence: stop the video before unmounting the overlay.
    try {
      videoRef.current?.pause();
      videoRef.current?.removeAttribute('src');
      videoRef.current?.load();
    } catch {
      // best-effort cleanup only
    }
    setVisible(false);
    window.setTimeout(onComplete, 450);
  }, [onComplete]);

  const startPlayback = useCallback(() => {
    const video = videoRef.current;
    if (!video) {
      setFailed(true);
      return;
    }
    setPhase('cinema');
    // User gesture → playback with sound is permitted.
    video.muted = false;
    video.volume = 1;
    video.play().catch(() => {
      // Blocked or undecodable → never trap the visitor.
      setFailed(true);
    });
  }, []);

  // Fallback choreography (video unavailable or ?nocine=1): split → logo → finish.
  useEffect(() => {
    if (!failed && !forceFallback) return;
    const timers: number[] = [];
    if (phase === 'gate' || phase === 'cinema') {
      timers.push(window.setTimeout(() => setPhase('fallback-split'), 500));
    } else if (phase === 'fallback-split') {
      timers.push(window.setTimeout(() => setPhase('fallback-reveal'), 900));
    } else if (phase === 'fallback-reveal') {
      timers.push(window.setTimeout(finish, 1500));
    }
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [failed, forceFallback, phase, finish]);

  // Absolute failsafe + Escape (never stuck, never trapped).
  useEffect(() => {
    const failsafe = window.setTimeout(finish, FAILSAFE_MS);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') finish();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.clearTimeout(failsafe);
      window.removeEventListener('keydown', onKey);
    };
  }, [finish]);

  // Reveal hold → finish.
  useEffect(() => {
    if (phase !== 'reveal') return;
    const timer = window.setTimeout(finish, REVEAL_HOLD_MS);
    return () => window.clearTimeout(timer);
  }, [phase, finish]);

  const handleTimeUpdate = useCallback(() => {
    const t = videoRef.current?.currentTime ?? 0;
    // Split fires on the verified blade-crossing frame, driven by the video
    // clock itself so DOM and picture can never desynchronise.
    if (t >= IMPACT_T) {
      setPhase((p) => (p === 'cinema' ? 'split' : p));
    }
  }, []);

  const handleEnded = useCallback(() => {
    setPhase((p) => (p === 'split' || p === 'cinema' ? 'reveal' : p));
  }, []);

  const handleVideoError = useCallback(() => {
    setFailed(true);
  }, []);

  const showSplit = phase === 'split' || phase === 'reveal';
  const showFallbackSplit = phase === 'fallback-split' || phase === 'fallback-reveal';
  const showLogo = phase === 'reveal' || phase === 'fallback-reveal';
  const splitting = showSplit || showFallbackSplit;
  const inGate = phase === 'gate' && !failed && !forceFallback;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="CampusNinja cinematic intro. Press Escape or activate Skip to continue to the site."
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-[#060607]"
          exit={{ opacity: 0, transition: { duration: 0.45, ease: 'easeInOut' } }}
        >
          {/* ── Cinematic video stage (dissolves as the screen splits) ── */}
          {!failed && !forceFallback && (
            <motion.div
              className="absolute inset-0"
              initial={{ opacity: 1 }}
              animate={{ opacity: showLogo ? 0 : 1 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              <video
                ref={videoRef}
                className="h-full w-full object-cover"
                src={VIDEO_SRC}
                poster={POSTER_SRC}
                preload="auto"
                playsInline
                disablePictureInPicture
                controls={false}
                aria-label="Campus Ninja 3D cinematic: a samurai crosses a burning fortress courtyard and slashes the screen."
                onTimeUpdate={handleTimeUpdate}
                onEnded={handleEnded}
                onError={handleVideoError}
              />
            </motion.div>
          )}

          {/* ── Enter gate (also the poster/loading state) ── */}
          {inGate && (
            <div className="absolute inset-0 z-30">
              <Image
                src={POSTER_SRC}
                alt=""
                fill
                priority
                className="object-cover"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80" />
              <div className="relative flex h-full flex-col items-center justify-center gap-5 px-6 text-center">
                <span className="overflow-hidden rounded-[28px] shadow-[0_0_80px_rgba(255,122,26,0.45)]">
                  <Image
                    src="/brand/campusninja-logo.png"
                    alt="CampusNinja logo"
                    width={72}
                    height={72}
                    priority
                    className="h-[72px] w-[72px] object-contain"
                  />
                </span>
                <p className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                  Campus<span className="text-[#FF7A1A]">Ninja</span>
                </p>
                <p className="font-mono text-[11px] font-medium uppercase tracking-[0.3em] text-zinc-400 sm:text-xs">
                  A cinematic intro plays with sound
                </p>
                <button
                  type="button"
                  onClick={startPlayback}
                  autoFocus
                  className="mt-2 rounded-full bg-[#FF7A1A] px-8 py-3 text-sm font-bold text-black shadow-[0_0_40px_rgba(255,122,26,0.5)] transition hover:bg-[#ff8f3d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:text-base"
                >
                  Enter Campus Ninja →
                </button>
                <button
                  type="button"
                  onClick={finish}
                  className="font-mono text-[11px] uppercase tracking-[0.25em] text-zinc-500 transition hover:text-zinc-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF7A1A]"
                >
                  Skip intro
                </button>
              </div>
            </div>
          )}

          {/* ── Diagonal screen-split panels (seam matches the slash diagonal:
              blade travels screen top-left → bottom-right, verified at the
              7.083s impact frame).
              Transparent until the cut so the video stage stays visible.
              Panels tip in 3D perspective as they part, and each carries its
              own cut-edge glow that fades out — the split reads as fractured
              matter, not sliding rectangles. ── */}
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-[#101014] via-[#0A0A0D] to-[#060607]"
            style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%)', transformPerspective: 900 }}
            initial={{ opacity: 0 }}
            animate={
              splitting
                ? { x: '14%', y: '-14%', opacity: 0.88, rotateX: -10, rotateY: 12 }
                : { x: '0%', y: '0%', opacity: 0, rotateX: 0, rotateY: 0 }
            }
            transition={{ duration: 0.8, ease: [0.7, 0, 0.2, 1] }}
          >
            {splitting && (
              <motion.div
                aria-hidden="true"
                className="absolute left-1/2 top-1/2 h-[4px] w-[145%]"
                style={{
                  background: 'linear-gradient(90deg, transparent, #FFF7ED 35%, #FF7A1A 60%, transparent)',
                  boxShadow: '0 0 24px 5px rgba(255,122,26,0.85)',
                  transform: 'translate(-50%, -50%) rotate(45deg)',
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 1, 0] }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
              />
            )}
          </motion.div>
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-[#141013] via-[#0D0A0B] to-[#060607]"
            style={{ clipPath: 'polygon(0 0, 100% 100%, 0 100%)', transformPerspective: 900 }}
            initial={{ opacity: 0 }}
            animate={
              splitting
                ? { x: '-14%', y: '14%', opacity: 0.88, rotateX: 10, rotateY: -12 }
                : { x: '0%', y: '0%', opacity: 0, rotateX: 0, rotateY: 0 }
            }
            transition={{ duration: 0.8, ease: [0.7, 0, 0.2, 1] }}
          >
            {splitting && (
              <motion.div
                aria-hidden="true"
                className="absolute left-1/2 top-1/2 h-[4px] w-[145%]"
                style={{
                  background: 'linear-gradient(90deg, transparent, #FF7A1A 40%, #FFF7ED 65%, transparent)',
                  boxShadow: '0 0 24px 5px rgba(255,122,26,0.85)',
                  transform: 'translate(-50%, -50%) rotate(45deg)',
                  transformOrigin: 'center',
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 1, 0] }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
              />
            )}
          </motion.div>

          {/* Seam flash along the cut */}
          {splitting && (
            <motion.div
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-1/2 z-20 h-[5px] w-[160%]"
              style={{
                background: 'linear-gradient(90deg, transparent, #FFF7ED 30%, #FF7A1A 55%, #FF3D00 75%, transparent)',
                boxShadow: '0 0 40px 8px rgba(255,122,26,0.8), 0 0 120px 30px rgba(255,61,0,0.4)',
                transform: 'translate(-50%, -50%) rotate(45deg)',
              }}
              initial={{ opacity: 0, scaleX: 0.4 }}
              animate={{ opacity: [0, 1, 0.85, 0], scaleX: 1 }}
              transition={{ duration: 1.1, ease: 'easeOut' }}
            />
          )}

          {/* Ember / shard burst */}
          {splitting && (
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-20">
              {shards.map((s, i) => (
                <motion.span
                  key={i}
                  className="absolute"
                  style={{
                    left: s.left,
                    top: s.top,
                    width: s.size,
                    height: s.round ? s.size : s.size * 2.6,
                    borderRadius: s.round ? 999 : 1,
                    background: i % 4 === 0 ? '#FFF7ED' : i % 4 === 1 ? '#FFB066' : i % 4 === 2 ? '#FF7A1A' : '#FF3D00',
                    boxShadow: '0 0 10px 2px rgba(255,122,26,0.7)',
                  }}
                  initial={{ opacity: 0, x: 0, y: 0, rotate: 0, scale: 0.4 }}
                  animate={{ opacity: [0, 1, 0], x: s.driftX, y: s.driftY, rotate: 260, scale: 1 }}
                  transition={{ duration: s.duration, delay: s.delay, ease: 'easeOut' }}
                />
              ))}
            </div>
          )}

          {/* Logo reveal — the actual brand mark */}
          {showLogo && (
            <motion.div
              className="relative z-30 flex flex-col items-center px-6 text-center"
              initial={{ opacity: 0, scale: 0.82 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <div
                aria-hidden="true"
                className="absolute left-1/2 top-1/2 -z-10 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{
                  background: 'radial-gradient(circle, rgba(255,122,26,0.35) 0%, rgba(255,61,0,0.12) 45%, transparent 70%)',
                }}
              />
              <motion.div
                initial={{ rotate: -6, scale: 0.9 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ type: 'spring', stiffness: 160, damping: 14 }}
                className="overflow-hidden rounded-[28px] shadow-[0_0_80px_rgba(255,122,26,0.45)]"
              >
                <Image
                  src="/brand/campusninja-logo.png"
                  alt="CampusNinja logo"
                  width={120}
                  height={120}
                  priority
                  className="h-[104px] w-[104px] object-contain sm:h-[120px] sm:w-[120px]"
                />
              </motion.div>
              <p className="mt-5 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                Campus<span className="text-[#FF7A1A]">Ninja</span>
              </p>
              <p className="mt-2 font-mono text-[11px] font-medium uppercase tracking-[0.3em] text-zinc-400 sm:text-xs">
                Code • Learn • Grow
              </p>
            </motion.div>
          )}

          {/* Caption + skip (always available once past the gate choice) */}
          {!inGate && (
            <div className="absolute inset-x-0 top-0 z-40 flex items-start justify-between p-4 sm:p-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-500 sm:text-xs">
                Cinematic intro — skippable
              </p>
              <button
                type="button"
                onClick={finish}
                className="rounded-full border border-white/20 bg-white/5 px-4 py-2 text-xs font-semibold text-zinc-200 backdrop-blur transition hover:border-[#FF7A1A]/60 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF7A1A] sm:text-sm"
              >
                Skip intro →
              </button>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
