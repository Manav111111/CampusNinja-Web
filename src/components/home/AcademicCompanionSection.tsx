'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Play, Sparkles } from 'lucide-react';
import { useAcademic } from '@/contexts/AcademicContext';
import { FloatingResourceVisual } from './FloatingResourceVisual';
import { JourneySetupCard } from './JourneySetupCard';
import { CompanionFeatureStrip } from './CompanionFeatureStrip';
import { CompanionStats } from './CompanionStats';

export const AcademicCompanionSection: React.FC = () => {
  const router = useRouter();
  const { branchId, semesterId } = useAcademic();

  const handleExplore = () => {
    router.push('/subjects');
  };

  return (
    <section className="relative w-full overflow-hidden bg-[#F6F5F2] pt-[90px] pb-[80px] text-[#17202B] antialiased">
      
      {/* ── BACKGROUND SUBTLE TECHNICAL GRID & ATMOSPHERE ── */}
      <div 
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          backgroundImage: `
            radial-gradient(circle at 50% 20%, rgba(255,255,255,0.7) 0%, transparent 60%),
            linear-gradient(180deg, #F6F5F2 0%, #F1F0EC 100%)
          `
        }}
      />

      {/* Blueprint Grid Lines & Nodes */}
      <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-40" viewBox="0 0 1440 900" fill="none">
        <line x1="80" y1="120" x2="1360" y2="120" stroke="rgba(50,60,70,0.06)" strokeWidth="1" strokeDasharray="6 6" />
        <line x1="80" y1="520" x2="1360" y2="520" stroke="rgba(50,60,70,0.06)" strokeWidth="1" strokeDasharray="6 6" />
        <circle cx="80" cy="120" r="2.5" fill="#4B5663" opacity="0.3" />
        <circle cx="1360" cy="120" r="2.5" fill="#4B5663" opacity="0.3" />
      </svg>

      {/* ── MAIN CONTENT WRAPPER ── */}
      <div className="mx-auto w-full max-w-[1420px] px-6 sm:px-12 lg:px-16">
        
        {/* ── TOP HERO COMPOSITION (2 COLUMNS) ── */}
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] xl:grid-cols-[1.2fr_0.8fr] pb-[64px]">
          
          {/* Left Column: Headlines, CTAs, CN Floating Emblem */}
          <div className="flex flex-col items-start">
            
            {/* Pill Label */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(20,25,35,0.12)] bg-white/60 px-3.5 py-1.5 text-[13px] font-[550] text-[#2E7E5F] shadow-2xs mb-6">
              <Sparkles className="h-3.5 w-3.5 fill-[#2E7E5F]" />
              <span>Your All-in-One Academic Companion</span>
            </div>

            {/* Main 3-Line Headline */}
            <h2 className="text-[clamp(44px,4.3vw,68px)] font-[750] leading-[1.04] tracking-[-0.045em] text-[#15191F]">
              Learn Better.<br />
              Share Smarter.<br />
              <span className="relative inline-block text-[#2F7E64]">
                Grow Together.
                {/* Curved organic green underline */}
                <svg className="absolute -bottom-2.5 left-0 w-full h-[8px] opacity-70" viewBox="0 0 200 8" fill="none">
                  <path d="M 2 5 Q 100 1 198 6" stroke="#2F7E64" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </span>
            </h2>

            {/* Supporting Description */}
            <p className="mt-[24px] max-w-[520px] text-[17px] font-[400] leading-[1.62] text-[#5A6673]">
              Access the best study materials, PYQs, notes, videos, and more.<br />
              Built by students, for students. All in one place.
            </p>

            {/* CTA Buttons */}
            <div className="mt-[28px] flex flex-wrap items-center gap-4">
              {/* Primary CTA */}
              <button
                type="button"
                onClick={handleExplore}
                className="group flex h-[50px] items-center justify-center gap-2 rounded-[11px] bg-[#121822] px-6 text-[15px] font-[600] text-white shadow-sm transition hover:bg-black active:scale-[0.98]"
              >
                <span>Explore Study Hub</span>
                <ArrowRight className="h-4 w-4 stroke-[2] transition-transform group-hover:translate-x-1" />
              </button>

              {/* Secondary CTA */}
              <button
                type="button"
                onClick={handleExplore}
                className="flex h-[50px] items-center justify-center gap-2.5 rounded-[11px] border border-[rgba(20,25,35,0.14)] bg-white/50 px-6 text-[15px] font-[600] text-[#1D252E] transition hover:bg-white shadow-2xs"
              >
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#121822] text-white">
                  <Play className="h-2.5 w-2.5 fill-white translate-x-[0.5px]" />
                </div>
                <span>Watch How It Works</span>
              </button>
            </div>

            {/* Trust Statement & College Badges */}
            <div className="mt-[32px] flex flex-wrap items-center gap-3">
              <span className="text-[14px] font-[450] text-[#616D7C]">
                Trusted by 50,000+ students from 500+ colleges
              </span>
              
              {/* Institutional Badges */}
              <div className="flex items-center -space-x-1.5">
                <span className="flex h-[26px] items-center rounded-full border border-rose-200 bg-rose-50 px-2 font-mono-spec text-[10px] font-bold text-rose-700 shadow-2xs">
                  DTU
                </span>
                <span className="flex h-[26px] items-center rounded-full border border-blue-200 bg-blue-50 px-2 font-mono-spec text-[10px] font-bold text-blue-700 shadow-2xs">
                  NSUT
                </span>
                <span className="flex h-[26px] items-center rounded-full border border-emerald-200 bg-emerald-50 px-2 font-mono-spec text-[10px] font-bold text-emerald-700 shadow-2xs">
                  IIITD
                </span>
              </div>
            </div>

            {/* Central Floating Visual nested beneath for medium screens */}
            <div className="mt-8 hidden xl:flex w-full justify-center">
              <FloatingResourceVisual />
            </div>

          </div>

          {/* Right Column: Journey Setup Card + Floating Emblem */}
          <div className="flex flex-col items-center lg:items-end justify-center">
            <JourneySetupCard />
          </div>

        </div>

        {/* ── 4-COLUMN FEATURE STRIP ── */}
        <div className="mb-[36px]">
          <CompanionFeatureStrip />
        </div>

        {/* ── DARK 4-COLUMN STATISTICS CARD ── */}
        <div>
          <CompanionStats />
        </div>

      </div>

    </section>
  );
};
