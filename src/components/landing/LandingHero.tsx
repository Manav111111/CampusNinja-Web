'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, BookOpenText, FileStack, LogIn, PlayCircle, Sparkles, UserPlus } from 'lucide-react';
import { useAcademic } from '@/contexts/AcademicContext';
import { useToast } from '@/contexts/ToastContext';
import { performGoogleLogin } from '@/services/auth';
import { BranchQuickSelectorModal } from '@/components/features/BranchQuickSelectorModal';

const easeOut: [number, number, number, number] = [0.16, 1, 0.3, 1];

export const LandingHero: React.FC = () => {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const { branchId, branchName, semesterId } = useAcademic();
  const { showToast } = useToast();
  const [showBranchModal, setShowBranchModal] = useState(false);
  const [signingUp, setSigningUp] = useState(false);

  const handleStudyHubClick = () => {
    if (branchId && semesterId) {
      router.push('/subjects');
    } else {
      setShowBranchModal(true);
    }
  };

  /** Sign Up reuses the existing Supabase Google OAuth flow (no invented email/password flow). */
  const handleSignUp = async () => {
    setSigningUp(true);
    try {
      await performGoogleLogin('/setup');
    } catch {
      showToast({
        type: 'error',
        title: 'Sign-up error',
        message: 'Could not connect to Google OAuth.',
      });
      setSigningUp(false);
    }
  };

  return (
    <section className="relative w-full overflow-hidden bg-[#0A0A0B] text-zinc-100">
      {/* Ambient background: reused hero video + orange glows + grid */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        {!reduceMotion && (
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className="h-full w-full object-cover opacity-25"
          >
            <source src="/videos/hero-bg.mp4" type="video/mp4" />
          </video>
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-[#0A0A0B]/60 to-[#0A0A0B]" />
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 55% 40% at 18% 20%, rgba(255,122,26,0.16), transparent 70%), radial-gradient(ellipse 45% 35% at 85% 75%, rgba(255,61,0,0.12), transparent 70%)',
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.13]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.35) 1px, transparent 1px)',
            backgroundSize: '44px 44px',
            maskImage: 'radial-gradient(ellipse 80% 70% at 50% 40%, black, transparent)',
            WebkitMaskImage: 'radial-gradient(ellipse 80% 70% at 50% 40%, black, transparent)',
          }}
        />
      </div>

      <div className="relative mx-auto grid w-full max-w-[1240px] items-center gap-10 px-5 pb-16 pt-14 sm:px-10 sm:pt-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8 lg:px-12 lg:pb-24 lg:pt-24">
        {/* Left: brand, headline, auth actions */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: easeOut }}
          className="flex flex-col items-start"
        >
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#FF7A1A]/30 bg-[#FF7A1A]/10 px-3.5 py-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-[#FFB066]">
              <Sparkles className="h-3.5 w-3.5" />
              GGSIPU • Study Hub
            </span>
          </div>

          <div className="mt-6 flex items-center gap-3.5">
            <span className="overflow-hidden rounded-2xl shadow-[0_0_50px_rgba(255,122,26,0.35)]">
              <Image
                src="/brand/campusninja-logo.png"
                alt="CampusNinja logo"
                width={56}
                height={56}
                priority
                className="h-12 w-12 object-contain sm:h-14 sm:w-14"
              />
            </span>
            <span className="text-xl font-bold tracking-tight text-white sm:text-2xl">
              Campus<span className="text-[#FF7A1A]">Ninja</span>
            </span>
          </div>

          <h1 className="mt-6 text-[38px] font-extrabold leading-[1.04] tracking-[-0.04em] text-white sm:text-[56px] lg:text-[clamp(52px,4.6vw,76px)]">
            Code Your Future.
            <br />
            <span className="bg-gradient-to-r from-[#FFB066] via-[#FF7A1A] to-[#FF3D00] bg-clip-text text-transparent">
              Ninja Your Campus.
            </span>
          </h1>

          <p className="mt-5 max-w-[560px] text-[15.5px] font-normal leading-[1.65] text-zinc-400 sm:text-lg">
            Notes, PYQs, syllabus &amp; video lectures — organised semester → branch →
            subject for GGSIPU engineers. Move silent, strike at the syllabus.
          </p>

          {/* Login + Sign Up (existing Supabase Google OAuth only) */}
          <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={handleSignUp}
              disabled={signingUp}
              className="group flex h-[52px] items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#FF7A1A] to-[#FF3D00] px-7 text-[15px] font-bold text-white shadow-[0_10px_40px_rgba(255,122,26,0.4)] transition hover:brightness-110 active:scale-95 disabled:opacity-70 sm:h-[54px]"
            >
              <UserPlus className="h-[17px] w-[17px]" />
              <span>{signingUp ? 'Connecting…' : 'Sign Up with Google'}</span>
              <ArrowUpRight className="h-[17px] w-[17px] transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </button>
            <Link
              href="/login"
              className="flex h-[52px] items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-7 text-[15px] font-semibold text-zinc-100 backdrop-blur transition hover:border-white/30 hover:bg-white/10 active:scale-95 sm:h-[54px]"
            >
              <LogIn className="h-[17px] w-[17px] text-[#FFB066]" />
              <span>Log In</span>
            </Link>
          </div>

          <p className="mt-3 font-mono text-[11px] tracking-wide text-zinc-500 sm:text-xs">
            Secure Google sign-in via Supabase — no passwords stored here.
          </p>

          {/* Preserved Study Hub entry */}
          <div className="mt-6 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={handleStudyHubClick}
              className="group flex h-[50px] items-center justify-center gap-2 rounded-2xl bg-white px-6 text-[14.5px] font-bold text-[#101216] transition hover:bg-zinc-200 active:scale-95"
            >
              <BookOpenText className="h-[17px] w-[17px]" />
              <span>Explore Study Hub</span>
            </button>
            <button
              type="button"
              onClick={() => setShowBranchModal(true)}
              className="flex h-[50px] items-center justify-between gap-2 rounded-2xl border border-dashed border-white/20 bg-white/[0.03] px-5 text-[13.5px] text-zinc-300 transition hover:border-[#FF7A1A]/50 hover:bg-white/[0.06] sm:justify-start"
            >
              <span className="text-zinc-500">Branch:</span>
              <span className="max-w-[220px] truncate font-semibold text-zinc-100 sm:max-w-[280px]">
                {branchName || 'Choose your branch'}
              </span>
            </button>
          </div>

          <div className="mt-7 flex items-center gap-2.5 font-mono text-[12px] text-zinc-500 sm:text-[13px]">
            <span className="h-[7px] w-[7px] animate-pulse rounded-full bg-[#FF7A1A] shadow-[0_0_10px_#FF7A1A]" />
            <span>
              <span className="text-zinc-300">katana</span>
              <span className="text-zinc-600">.</span>
              <span className="text-[#FFB066]">unsheathe</span>
              <span className="text-zinc-600">()</span>
              <span className="text-zinc-600"> — syllabus mode: on</span>
            </span>
          </div>
        </motion.div>

        {/* Right: cinematic logo emblem + floating resource cards */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.15, ease: easeOut }}
          className="relative flex items-center justify-center"
        >
          <div
            aria-hidden="true"
            className="absolute h-[380px] w-[380px] rounded-full sm:h-[460px] sm:w-[460px]"
            style={{
              background:
                'radial-gradient(circle, rgba(255,122,26,0.28) 0%, rgba(255,61,0,0.1) 45%, transparent 70%)',
            }}
          />
          {/* orbit ring */}
          <div
            aria-hidden="true"
            className={`absolute h-[300px] w-[300px] rounded-full border border-dashed border-[#FF7A1A]/25 sm:h-[360px] sm:w-[360px] ${reduceMotion ? '' : 'animate-[spin-slow_40s_linear_infinite]'}`}
          />
          <motion.div
            animate={reduceMotion ? undefined : { y: [0, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            className="relative overflow-hidden rounded-[32px] border border-white/10 shadow-[0_0_100px_rgba(255,122,26,0.3)]"
          >
            <Image
              src="/brand/campusninja-logo.png"
              alt="CampusNinja emblem"
              width={320}
              height={320}
              priority
              className="h-[220px] w-[220px] object-contain sm:h-[300px] sm:w-[300px]"
            />
          </motion.div>

          {/* floating cards */}
          <motion.div
            animate={reduceMotion ? undefined : { y: [0, -12, 0] }}
            transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -left-1 top-6 flex items-center gap-2.5 rounded-2xl border border-white/10 bg-[#121216]/90 px-4 py-3 shadow-xl backdrop-blur sm:left-2"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FF7A1A]/15">
              <FileStack className="h-[18px] w-[18px] text-[#FFB066]" />
            </span>
            <span>
              <span className="block text-sm font-bold text-white">PYQs + Notes</span>
              <span className="block text-xs text-zinc-500">Subject-wise vault</span>
            </span>
          </motion.div>
          <motion.div
            animate={reduceMotion ? undefined : { y: [0, 12, 0] }}
            transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
            className="absolute -right-1 bottom-8 flex items-center gap-2.5 rounded-2xl border border-white/10 bg-[#121216]/90 px-4 py-3 shadow-xl backdrop-blur sm:right-2"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FF3D00]/15">
              <PlayCircle className="h-[18px] w-[18px] text-[#FF8A3D]" />
            </span>
            <span>
              <span className="block text-sm font-bold text-white">Video lectures</span>
              <span className="block text-xs text-zinc-500">Syllabus-mapped</span>
            </span>
          </motion.div>
        </motion.div>
      </div>

      <BranchQuickSelectorModal isOpen={showBranchModal} onClose={() => setShowBranchModal(false)} />
    </section>
  );
};
