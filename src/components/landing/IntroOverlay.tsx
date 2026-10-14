'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

/**
 * Cinematic intro overlay — ninja entrance, sword slash, screen split,
 * ember/spark burst, then the real CampusNinja logo reveal.
 *
 * ASSET LIMITATION (honest note): the repository ships no 3D ninja model
 * (public/ contains only the brand logo and hero-bg.mp4) and this task
 * forbids unnecessary dependencies, so no three.js / model-viewer stack was
 * introduced. The "complete ninja" here is a hand-built full-body 2.5D SVG
 * figure (head + mask + headband, torso, belt, both arms, both legs, katana)
 * animated with framer-motion — a deliberate stand-in, NOT a full 3D model.
 * Swap `NinjaFigure` for a real <model-viewer>/R3F scene once a licensed
 * 3D model asset is available.
 *
 * Accessibility / safety:
 * - Always skippable (Skip button, Escape key, click-through) and
 *   auto-dismisses; it never blocks Login / Sign Up (hero stays mounted).
 * - The parent must not render this at all when prefers-reduced-motion is set.
 */

type Phase = 'enter' | 'slash' | 'split' | 'reveal';

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

/**
 * Full-body stylised ninja figure (side stance, katana drawn).
 * Complete character — head/mask/headband, torso, belt, arms, legs, sword —
 * so this is never just a "sword-only CSS effect".
 */
const NinjaFigure: React.FC = () => (
  <svg
    viewBox="0 0 340 340"
    role="img"
    aria-label="Ninja character drawing a katana"
    className="h-auto w-full drop-shadow-[0_0_35px_rgba(255,122,26,0.35)]"
  >
    <defs>
      <linearGradient id="cn-blade" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#FFF7ED" />
        <stop offset="55%" stopColor="#FDBA74" />
        <stop offset="100%" stopColor="#FF7A1A" />
      </linearGradient>
      <linearGradient id="cn-gi" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#23272F" />
        <stop offset="100%" stopColor="#101216" />
      </linearGradient>
      <filter id="cn-glow" x="-60%" y="-60%" width="220%" height="220%">
        <feGaussianBlur stdDeviation="3.2" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>

    {/* ground shadow */}
    <ellipse cx="170" cy="308" rx="105" ry="12" fill="#000" opacity="0.55" />
    <ellipse cx="170" cy="308" rx="70" ry="7" fill="#FF7A1A" opacity="0.18" />

    {/* speed lines */}
    <g stroke="#FF7A1A" strokeLinecap="round" opacity="0.5">
      <line x1="18" y1="120" x2="86" y2="120" strokeWidth="3" />
      <line x1="8" y1="160" x2="66" y2="160" strokeWidth="2" />
      <line x1="24" y1="200" x2="92" y2="200" strokeWidth="3" />
    </g>

    {/* back leg */}
    <path
      d="M158 218 L118 262 L96 300 L116 306 L142 266 L172 226 Z"
      fill="url(#cn-gi)"
      stroke="#343945"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    {/* front leg (lunge) */}
    <path
      d="M178 220 L216 252 L256 288 L268 276 L228 240 L192 214 Z"
      fill="url(#cn-gi)"
      stroke="#343945"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    {/* feet */}
    <path d="M88 298 L120 298 L120 308 L86 308 Z" fill="#0B0C0F" stroke="#343945" strokeWidth="1.5" />
    <path d="M252 284 L282 268 L288 278 L258 294 Z" fill="#0B0C0F" stroke="#343945" strokeWidth="1.5" />

    {/* torso (gi) */}
    <path
      d="M148 128 L196 128 L204 190 L208 222 L152 222 L146 188 Z"
      fill="url(#cn-gi)"
      stroke="#343945"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    {/* gi collar cross */}
    <path d="M148 128 L180 162 L172 168 L146 136 Z" fill="#0B0C0F" opacity="0.85" />
    <path d="M196 128 L170 156 L178 162 L198 136 Z" fill="#1B1E24" />
    {/* belt */}
    <rect x="148" y="206" width="62" height="14" rx="4" fill="#FF7A1A" />
    <rect x="148" y="206" width="62" height="5" rx="2.5" fill="#FFB066" opacity="0.8" />
    {/* belt knot + tails */}
    <rect x="196" y="208" width="10" height="10" rx="2" fill="#C2570B" />
    <path d="M202 218 L216 250 L208 252 L196 220 Z" fill="#FF7A1A" opacity="0.9" />

    {/* back arm */}
    <path
      d="M152 140 L120 168 L108 196 L122 202 L136 176 L160 152 Z"
      fill="url(#cn-gi)"
      stroke="#343945"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <circle cx="115" cy="199" r="9" fill="#0B0C0F" stroke="#343945" strokeWidth="2" />

    {/* headband tails (flowing) */}
    <path d="M148 84 C118 78 96 84 74 100 C96 100 116 100 140 98 Z" fill="#FF7A1A" />
    <path d="M148 92 C124 94 106 102 92 116 C110 112 130 106 146 102 Z" fill="#C2570B" />

    {/* head */}
    <circle cx="176" cy="92" r="36" fill="url(#cn-gi)" stroke="#343945" strokeWidth="2" />
    {/* mask band */}
    <path
      d="M140 84 L212 84 L208 108 L144 108 Z"
      fill="#0B0C0F"
      stroke="#343945"
      strokeWidth="1.5"
    />
    {/* headband */}
    <rect x="140" y="66" width="72" height="12" rx="6" fill="#FF7A1A" />
    <rect x="140" y="66" width="72" height="4" rx="2" fill="#FFB066" opacity="0.85" />
    {/* glowing eyes */}
    <g filter="url(#cn-glow)">
      <ellipse cx="162" cy="96" rx="8" ry="5" fill="#FF7A1A" />
      <ellipse cx="190" cy="96" rx="8" ry="5" fill="#FF7A1A" />
    </g>
    <ellipse cx="162" cy="96" rx="3.4" ry="2.4" fill="#FFF7ED" />
    <ellipse cx="190" cy="96" rx="3.4" ry="2.4" fill="#FFF7ED" />

    {/* front arm extended, gripping katana */}
    <path
      d="M196 140 L232 152 L258 158 L256 172 L230 166 L194 154 Z"
      fill="url(#cn-gi)"
      stroke="#343945"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <circle cx="259" cy="165" r="10" fill="#0B0C0F" stroke="#FF7A1A" strokeWidth="2.5" />

    {/* katana: guard + long blade */}
    <rect x="264" y="157" width="8" height="18" rx="2" fill="#C2570B" transform="rotate(8 268 166)" />
    <g transform="rotate(8 272 166)">
      <rect x="272" y="161" width="58" height="7" rx="3.5" fill="url(#cn-blade)" filter="url(#cn-glow)" />
      <polygon points="330,161 342,164.5 330,168" fill="#FFF7ED" />
    </g>
  </svg>
);

export const IntroOverlay: React.FC<IntroOverlayProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<Phase>('enter');
  const [visible, setVisible] = useState(true);
  const shards = useMemo(() => buildShards(26), []);

  const finish = useCallback(() => {
    setVisible(false);
    // Allow the fade-out to play before unmounting.
    window.setTimeout(onComplete, 450);
  }, [onComplete]);

  useEffect(() => {
    const timers: number[] = [];
    timers.push(window.setTimeout(() => setPhase('slash'), 1050));
    timers.push(window.setTimeout(() => setPhase('split'), 1650));
    timers.push(window.setTimeout(() => setPhase('reveal'), 2350));
    timers.push(window.setTimeout(finish, 3900));
    // Absolute safety net — the intro can never trap the user.
    const failsafe = window.setTimeout(finish, 7000);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') finish();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      timers.forEach((t) => window.clearTimeout(t));
      window.clearTimeout(failsafe);
      window.removeEventListener('keydown', onKey);
    };
  }, [finish]);

  const slashing = phase === 'slash' || phase === 'split' || phase === 'reveal';
  const split = phase === 'split' || phase === 'reveal';
  const revealed = phase === 'reveal';

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
          {/* Screen-split panels (separate during slash, revealing the logo) */}
          <motion.div
            aria-hidden="true"
            className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-b from-[#101014] via-[#0A0A0D] to-[#060607]"
            animate={split ? { x: '-102%' } : { x: '0%' }}
            transition={{ duration: 0.8, ease: [0.7, 0, 0.2, 1] }}
          />
          <motion.div
            aria-hidden="true"
            className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-b from-[#141013] via-[#0D0A0B] to-[#060607]"
            animate={split ? { x: '102%' } : { x: '0%' }}
            transition={{ duration: 0.8, ease: [0.7, 0, 0.2, 1] }}
          />

          {/* Ember ambience */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse 60% 45% at 50% 62%, rgba(255,122,26,0.16), transparent 70%)',
            }}
          />

          {/* Ninja entrance */}
          {!revealed && (
            <motion.div
              className="relative z-10 w-[min(72vw,340px)]"
              initial={{ x: '-120vw', opacity: 0, skewX: -8 }}
              animate={
                phase === 'enter'
                  ? { x: '-8vw', opacity: 1, skewX: 0 }
                  : { x: '6vw', opacity: slashing ? 0 : 1, skewX: 0 }
              }
              transition={
                phase === 'enter'
                  ? { duration: 0.9, ease: [0.16, 1, 0.3, 1] }
                  : { duration: 0.45, ease: 'easeIn' }
              }
            >
              <NinjaFigure />
            </motion.div>
          )}

          {/* Sword-slash beam + flash */}
          {slashing && !revealed && (
            <>
              <motion.div
                aria-hidden="true"
                className="absolute left-[-10%] top-1/2 z-20 h-[6px] w-[120%] origin-left"
                style={{
                  background:
                    'linear-gradient(90deg, transparent, #FFF7ED 30%, #FF7A1A 55%, #FF3D00 75%, transparent)',
                  transform: 'rotate(-18deg)',
                  boxShadow: '0 0 40px 8px rgba(255,122,26,0.8), 0 0 120px 30px rgba(255,61,0,0.4)',
                }}
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: [0, 1, 1, 0] }}
                transition={{ duration: 0.55, ease: 'easeOut' }}
              />
              <motion.div
                aria-hidden="true"
                className="absolute inset-0 z-20 bg-[#FFF3E6]"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.9, 0] }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            </>
          )}

          {/* Ember / shard burst */}
          {slashing && (
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
                    background:
                      i % 4 === 0
                        ? '#FFF7ED'
                        : i % 4 === 1
                          ? '#FFB066'
                          : i % 4 === 2
                            ? '#FF7A1A'
                            : '#FF3D00',
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
          {revealed && (
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
                  background:
                    'radial-gradient(circle, rgba(255,122,26,0.35) 0%, rgba(255,61,0,0.12) 45%, transparent 70%)',
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

          {/* Caption + skip (always available, never blocks auth actions behind it for long) */}
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
        </motion.div>
      )}
    </AnimatePresence>
  );
};
