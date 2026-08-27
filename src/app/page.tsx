'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowUpRight, Code2 } from 'lucide-react';
import { useAcademic } from '@/contexts/AcademicContext';
import { HeroCodeVisual } from '@/components/features/HeroCodeVisual';
import { FeatureStrip } from '@/components/features/FeatureStrip';
import { ImpactSection } from '@/components/features/ImpactSection';
import { AcademicCompanionSection } from '@/components/home/AcademicCompanionSection';
import { BranchQuickSelectorModal } from '@/components/features/BranchQuickSelectorModal';

export default function HomePage() {
  const router = useRouter();
  const { branchId, branchName, semesterId } = useAcademic();
  const [showBranchModal, setShowBranchModal] = useState(false);

  const handleStudyHubClick = () => {
    if (branchId && semesterId) {
      router.push('/subjects');
    } else {
      setShowBranchModal(true);
    }
  };

  return (
    <div className="flex w-full flex-col bg-[var(--bg-main)] text-[var(--ink)] antialiased">
      {/* ── UPPER LIGHT HERO SECTION ── */}
      <section className="relative w-full overflow-hidden min-h-0 lg:min-h-[660px] px-4 sm:px-6 lg:px-[5%] pt-6 sm:pt-8 lg:pt-[42px] pb-8 sm:pb-10 lg:pb-[40px]">
        <div className="mx-auto w-full">
          <div className="grid items-start lg:grid-cols-[50%_50%] gap-8 lg:gap-6">
            
            {/* ── Left Column: Editorial Typography & CTAs ── */}
            <div className="flex flex-col items-start z-10 relative pt-0 lg:pt-[10px] max-w-[760px]">
              
              {/* Technical index label: 01 ─────── CODE • LEARN • GROW */}
              <div className="mb-4 sm:mb-6 flex items-center gap-3 sm:gap-[16px]">
                <span className="font-mono-spec text-[12px] sm:text-[13px] font-[500] text-[#59616B]">
                  01
                </span>
                <span className="h-[1px] w-6 sm:w-[42px] bg-[#B8BDC2]" />
                <span className="font-mono-spec text-[10.5px] sm:text-[12px] font-[500] tracking-[0.14em] sm:tracking-[0.16em] text-[#59616B] uppercase">
                  CODE • LEARN • GROW
                </span>
              </div>

              {/* Controlled, Elegant 2-Line Headline */}
              <h1 className="text-[36px] sm:text-[48px] md:text-[56px] lg:text-[clamp(52px,4.5vw,76px)] font-[700] leading-[1.06] tracking-[-0.04em] text-[#15191F]">
                Code Your Future.<br />
                Ninja Your Campus.
              </h1>

              {/* Light & Calm Subtitle */}
              <p className="mt-3.5 sm:mt-5 lg:mt-[24px] max-w-[590px] text-[15px] sm:text-[17px] lg:text-[18px] font-[400] leading-[1.55] text-[#66707B]">
                Your all-in-one platform for coding, study materials, projects, and skills to level up your career.
              </p>

              {/* Action Buttons */}
              <div className="mt-5 sm:mt-7 lg:mt-[28px] flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 lg:gap-[20px] w-full sm:w-auto">
                {/* Primary CTA */}
                <button
                  type="button"
                  onClick={handleStudyHubClick}
                  className="group flex h-[50px] sm:h-[54px] w-full sm:w-auto items-center justify-center gap-2 rounded-[14px] sm:rounded-[17px] bg-[#151A20] px-6 sm:px-[28px] text-[14.5px] sm:text-[15px] font-[600] text-[#F7F7F4] transition-all hover:bg-[#000] active:scale-95 shadow-sm"
                >
                  <span>Explore Study Hub</span>
                  <ArrowUpRight className="h-[16px] w-[16px] sm:h-[17px] sm:w-[17px] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>

                {/* Secondary CTA */}
                <Link
                  href="/skills"
                  className="flex h-[50px] sm:h-[54px] w-full sm:w-auto items-center justify-center gap-2 rounded-[14px] sm:rounded-[17px] border border-[#D2D5D5] bg-[rgba(255,255,255,0.28)] px-6 sm:px-[28px] text-[14.5px] sm:text-[15px] font-[600] text-[#303841] transition-all hover:bg-white active:scale-95"
                >
                  <span>Explore Skills</span>
                  <Code2 className="h-[16px] w-[16px] sm:h-[17px] sm:w-[17px] text-[#4a5568]" />
                </Link>
              </div>

              {/* Branch Box */}
              <div className="mt-3.5 sm:mt-4 lg:mt-[18px] w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setShowBranchModal(true)}
                  className="flex h-[48px] sm:h-[54px] w-full sm:w-auto items-center justify-between sm:justify-start gap-2 rounded-[14px] sm:rounded-[16px] border border-dashed border-[#BFC4C7] bg-[rgba(255,255,255,0.10)] px-4 sm:px-[22px] text-[13px] sm:text-[14px] text-[#252B31] hover:bg-[rgba(255,255,255,0.25)] transition"
                >
                  <span className="text-[#717A82] font-[400]">Branch:</span>
                  <span className="font-[600] text-[#252B31] truncate max-w-[240px] sm:max-w-none">{branchName || 'Artificial Intelligence and Data Science'}</span>
                </button>
              </div>

              {/* Subtle Monospace Coding Detail */}
              <div className="mt-5 sm:mt-6 lg:mt-[28px] flex items-center gap-[10px] font-mono-spec text-[12px] sm:text-[13px] font-[400] tracking-[-0.01em]">
                <span className="h-[7px] w-[7px] rounded-full bg-[#35A47A]" />
                <span className="truncate">
                  <span className="text-[#2C333A]">print</span><span className="text-[#68717A]">(</span><span className="text-[#4F806A]">&quot;Keep Learning. Keep Coding.&quot;</span><span className="text-[#68717A]">)</span>
                </span>
              </div>
            </div>

            {/* ── Right Column: Scaled-Down Balanced 3D Code Visual & HUD ── */}
            <div className="flex w-full items-center justify-center relative z-0 lg:pl-2">
              <HeroCodeVisual onOpenStudyHub={handleStudyHubClick} />
            </div>

          </div>

          {/* ── Bottom Feature Strip ── */}
          <div className="mt-[90px]">
            <FeatureStrip />
          </div>
        </div>
      </section>

      {/* ── LOWER DARK IMPACT SECTION WITH ANGULAR CUTOUT ── */}
      <ImpactSection />

      {/* ── NEW FULL ACADEMIC COMPANION SECTION BEFORE FOOTER ── */}
      <AcademicCompanionSection />

      {/* ── Quick Branch & Semester Modal ── */}
      <BranchQuickSelectorModal
        isOpen={showBranchModal}
        onClose={() => setShowBranchModal(false)}
      />
    </div>
  );
}