'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import {
  isIntroAudioEnabled,
  setIntroAudioEnabled,
  soundImpact,
  soundReveal,
  stopIntroBed,
  unlockIntroAudio,
} from './introSound';

/**
 * Cinematic intro overlay — real 3D ninja (Three.js/WebGL) walk-in, diagonal
 * katana slash, screen split synchronised to the blade crossing frame centre,
 * ember burst, then the real CampusNinja logo reveal.
 *
 * Asset: CC0 "NINJA CHARACTER" by styloo (`public/models/ninja/`, CREDITS.md).
 * Walk + slash are procedurally authored on the rig (stylised, no mocap claims).
 *
 * Sound: fully procedural Web Audio (`introSound.ts`, no audio files or
 * licenses). Browsers forbid audio before a user gesture, so the intro starts
 * silent with a visible "Sound on" button; all cues fire from the 3D scene
 * clock and are silent no-ops until the user enables sound.
 *
 * Safety / accessibility:
 * - Always skippable (Skip button, Escape), auto-dismisses via sequence end
 *   plus an absolute failsafe; Login / Sign Up stay mounted behind it.
 * - Reduced-motion users never render this (parent gate).
 * - WebGL/load failure or `?no3d=1` → honest degraded cinematic (slash beam +
 *   split + logo, no ninja) instead of a stuck loader. Never waits indefinitely.
 */

const NinjaScene = dynamic(() => import('./NinjaScene'), { ssr: false });

type Phase = 'loading' | 'cinema' | 'split' | 'reveal' | 'fallback-slash' | 'fallback-split' | 'fallback-reveal';

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

const LOAD_TIMEOUT_MS = 8000;

export const IntroOverlay: React.FC<IntroOverlayProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<Phase>('loading');
  const [visible, setVisible] = useState(true);
  const [degraded, setDegraded] = useState(false);
  const [audioOn, setAudioOn] = useState(false);
  const playedCues = useRef<Set<string>>(new Set());
  const shards = useMemo(() => buildShards(26), []);
  const freezeAt = useMemo(() => {
    if (typeof window === 'undefined') return null;
    const v = new URLSearchParams(window.location.search).get('freeze');
    const n = v == null ? NaN : Number(v);
    return Number.isFinite(n) ? n : null;
  }, []);
  const forceFallback = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return new URLSearchParams(window.location.search).get('no3d') === '1';
  }, []);

  const finish = useCallback(() => {
    setVisible(false);
    stopIntroBed();
    window.setTimeout(onComplete, 450);
  }, [onComplete]);

  const toggleAudio = useCallback(() => {
    if (isIntroAudioEnabled()) {
      setIntroAudioEnabled(false);
      setAudioOn(false);
    } else {
      setAudioOn(unlockIntroAudio());
    }
  }, []);

  const enterFallback = useCallback(() => {
    setDegraded(true);
    setPhase((p) => (p === 'reveal' || p === 'fallback-reveal' ? p : 'fallback-slash'));
  }, []);

  // Fallback choreography (no 3D): slash beam → split → logo → finish.
  useEffect(() => {
    if (!degraded) return;
    const timers: number[] = [];
    if (phase === 'fallback-slash') {
      timers.push(window.setTimeout(() => setPhase('fallback-split'), 900));
    } else if (phase === 'fallback-split') {
      timers.push(window.setTimeout(() => setPhase('fallback-reveal'), 900));
    } else if (phase === 'fallback-reveal') {
      timers.push(window.setTimeout(finish, 1500));
    }
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [degraded, phase, finish]);

  // Sound the visual beats. The main-path impact is played inside the 3D
  // scene on the exact blade-crossing frame; here we cover the fallback path
  // and the logo reveal. All are silent no-ops until sound is enabled.
  useEffect(() => {
    if (phase === 'fallback-split' && !playedCues.current.has('split')) {
      playedCues.current.add('split');
      soundImpact();
    }
    if (
      (phase === 'reveal' || phase === 'fallback-reveal') &&
      !playedCues.current.has('reveal')
    ) {
      playedCues.current.add('reveal');
      soundReveal();
    }
  }, [phase]);

  // Absolute failsafe + Escape + load timeout → degraded path (never stuck).
  useEffect(() => {
    const failsafe = window.setTimeout(finish, 11000);
    const loadTimer = window.setTimeout(() => {
      setPhase((p) => {
        if (p === 'loading') enterFallback();
        return p;
      });
    }, LOAD_TIMEOUT_MS);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') finish();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.clearTimeout(failsafe);
      window.clearTimeout(loadTimer);
      window.removeEventListener('keydown', onKey);
    };
  }, [finish, enterFallback]);

  useEffect(() => {
    if (forceFallback) enterFallback();
  }, [forceFallback, enterFallback]);

  const handleSceneError = useCallback(() => {
    enterFallback();
  }, [enterFallback]);

  const handleSlashImpact = useCallback(() => {
    // Split fires on the exact blade-crossing frame; the logo reveal fires on
    // the scene's sequence-end event (never on an independent timer, so DOM
    // and WebGL can never desynchronise on slow GPUs).
    setPhase('split');
  }, []);

  const handleSequenceEnd = useCallback(() => {
    setPhase((p) => (p === 'cinema' || p === 'split' ? 'reveal' : p));
  }, []);

  // Reveal hold → finish.
  useEffect(() => {
    if (phase !== 'reveal') return;
    const timer = window.setTimeout(finish, 1500);
    return () => window.clearTimeout(timer);
  }, [phase, finish]);

  const showSplit = phase === 'split' || phase === 'reveal';
  const showFallbackSplit = phase === 'fallback-split' || phase === 'fallback-reveal';
  const showLogo = phase === 'reveal' || phase === 'fallback-reveal';
  const splitting = showSplit || showFallbackSplit;

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
          {/* ── 3D ninja stage (dissolves as the screen splits) ── */}
          {!degraded && (
            <motion.div
              className="absolute inset-0"
              initial={{ opacity: 1 }}
              // The 3D stage smoulders through the split, then dissolves for the logo.
              animate={{ opacity: showLogo && freezeAt == null ? 0 : 1 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              <NinjaScene
                freezeAt={freezeAt}
                onReady={() => setPhase((p) => (p === 'loading' ? 'cinema' : p))}
                onSlashImpact={handleSlashImpact}
                onSequenceEnd={handleSequenceEnd}
                onError={handleSceneError}
              />
            </motion.div>
          )}

          {/* Loading veil (lifts the moment the scene is ready) */}
          {phase === 'loading' && !degraded && (
            <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-4 bg-[#060607]">
              <span className="overflow-hidden rounded-2xl shadow-[0_0_50px_rgba(255,122,26,0.35)]">
                <Image
                  src="/brand/campusninja-logo.png"
                  alt=""
                  width={56}
                  height={56}
                  priority
                  className="h-14 w-14 animate-pulse object-contain"
                />
              </span>
              <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-zinc-500">
                Summoning the ninja…
              </p>
            </div>
          )}

          {/* ── Diagonal screen-split panels (seam matches the slash diagonal:
              blade travels screen top-left → bottom-right).
              Transparent until the cut so the 3D stage stays visible.
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

          {/* Fallback slash beam (degraded path only — the 3D blade owns the real slash) */}
          {degraded && phase === 'fallback-slash' && (
            <>
              <motion.div
                aria-hidden="true"
                className="absolute left-1/2 top-1/2 z-20 h-[6px] w-[150%]"
                style={{
                  background: 'linear-gradient(90deg, transparent, #FFF7ED 30%, #FF7A1A 55%, #FF3D00 75%, transparent)',
                  boxShadow: '0 0 40px 8px rgba(255,122,26,0.8), 0 0 120px 30px rgba(255,61,0,0.4)',
                  transform: 'translate(-50%, -50%) rotate(45deg)',
                }}
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: [0, 1, 1, 0] }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
              />
              <motion.div
                aria-hidden="true"
                className="absolute inset-0 z-20 bg-[#FFF3E6]"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.9, 0] }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              />
            </>
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

          {/* Caption + sound + skip (always available) */}
          <div className="absolute inset-x-0 top-0 z-40 flex items-start justify-between p-4 sm:p-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-500 sm:text-xs">
              Cinematic intro — skippable
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleAudio}
                aria-pressed={audioOn}
                aria-label={audioOn ? 'Mute intro sound' : 'Enable intro sound'}
                className="rounded-full border border-white/20 bg-white/5 px-4 py-2 text-xs font-semibold text-zinc-200 backdrop-blur transition hover:border-[#FF7A1A]/60 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF7A1A] sm:text-sm"
              >
                {audioOn ? 'Sound on' : 'Sound off'}
              </button>
              <button
                type="button"
                onClick={finish}
                className="rounded-full border border-white/20 bg-white/5 px-4 py-2 text-xs font-semibold text-zinc-200 backdrop-blur transition hover:border-[#FF7A1A]/60 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF7A1A] sm:text-sm"
              >
                Skip intro →
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
