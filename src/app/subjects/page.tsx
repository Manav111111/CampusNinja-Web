'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft,
  SlidersHorizontal
} from 'lucide-react';
import { useAcademic } from '@/contexts/AcademicContext';
import { useSubjects } from '@/hooks/useQueries';
import { SubjectCard } from '@/components/features/SubjectCard';
import { SubjectHeroVisual } from '@/components/features/SubjectHeroVisual';
import { BranchQuickSelectorModal } from '@/components/features/BranchQuickSelectorModal';

const DEFAULT_SUBJECTS = [
  { number: '01', title: 'Environmental\nScience', slug: 'environmental-science' },
  { number: '02', title: 'Applied\nMathematics 1', slug: 'applied-mathematics-1' },
  { number: '03', title: 'Communication\nSkills', slug: 'communication-skills' },
  { number: '04', title: 'Manufacturing\nProcesses', slug: 'manufacturing-processes' },
  { number: '05', title: 'Engineering\nGraphics', slug: 'engineering-graphics' },
  { number: '06', title: 'Applied\nPhysics 1', slug: 'applied-physics-1' },
  { number: '07', title: 'Workshop\nPractice', slug: 'workshop-practice' },
];

export default function SubjectsPage() {
  const { branchId, semesterId, branchName, semesterNum } = useAcademic();
  const { data: dbSubjects, isLoading } = useSubjects(branchId, semesterId);
  const [showFilterModal, setShowFilterModal] = useState(false);

  // Format subjects list
  const displaySubjects = (dbSubjects && dbSubjects.length > 0)
    ? dbSubjects.map((sub, idx) => ({
        number: String(idx + 1).padStart(2, '0'),
        title: sub.title || sub.name || '',
        id: sub.id,
      }))
    : DEFAULT_SUBJECTS.map((sub) => ({
        number: sub.number,
        title: sub.title,
        id: sub.slug,
      }));

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-hidden bg-[#E7E6E2] text-[#171B21] antialiased">
      
      {/* ── BACKGROUND BLUEPRINT ATMOSPHERE ── */}
      <div 
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          backgroundImage: `
            radial-gradient(circle at 65% 25%, rgba(255,255,255,0.40) 0%, transparent 32%),
            linear-gradient(180deg, #E9E8E5 0%, #E5E4E0 100%)
          `
        }}
      />

      {/* Decorative Faint Technical Arc & Connectors */}
      <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-35" viewBox="0 0 1440 900" fill="none">
        {/* Left side quarter-circle arc */}
        <path d="M -50 700 A 450 450 0 0 1 400 1150" stroke="rgba(50,60,70,0.14)" strokeWidth="1" strokeDasharray="6 8" />
        <path d="M -80 700 A 480 480 0 0 1 400 1180" stroke="rgba(50,60,70,0.08)" strokeWidth="1" />
        
        {/* Horizontal construction line through grid */}
        <line x1="84" y1="420" x2="1356" y2="420" stroke="rgba(60,70,80,0.06)" strokeWidth="1" strokeDasharray="4 4" />
        <circle cx="84" cy="420" r="2.5" fill="#606876" opacity="0.4" />
        <circle cx="1356" cy="420" r="2.5" fill="#606876" opacity="0.4" />
        
        <circle cx="430" cy="720" r="2" fill="#606876" opacity="0.4" />
        <circle cx="940" cy="700" r="2" fill="#606876" opacity="0.4" />
      </svg>

      {/* ── MAIN CONTENT CONTAINER ── */}
      <div className="mx-auto w-full px-[24px] lg:px-[54px] xl:px-[84px] pt-[24px] lg:pt-[32px] pb-[80px]">
        
        {/* ── BACK LINK & SWITCH BRANCH ── */}
        <div className="mb-[24px] flex items-center justify-between">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-[14px] font-[500] text-[#5F6873] transition-colors hover:text-[#171B21]"
          >
            <ArrowLeft className="h-4 w-4 stroke-[1.8]" />
            <span>Back to Home</span>
          </Link>

          <button
            onClick={() => setShowFilterModal(true)}
            className="inline-flex items-center gap-1.5 rounded-[8px] border border-[rgba(23,27,33,0.12)] bg-white/40 px-3 py-1.5 text-[12.5px] font-[500] text-[#3E4852] transition hover:bg-white/80"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span>Change Branch / Sem</span>
          </button>
        </div>

        {/* ── HERO SECTION ── */}
        <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          
          {/* Left: Typography & Headings */}
          <div className="flex flex-col items-start">
            {/* Small Technical System Eyebrow */}
            <span className="font-mono-spec text-[11px] font-[500] uppercase tracking-[0.25em] text-[#7C8490] mb-[18px]">
              SUBJECT MATERIALS
            </span>

            {/* Exact 2-Line Controlled Heading */}
            <h1 className="text-[clamp(44px,4.2vw,68px)] font-[650] leading-[0.98] tracking-[-0.055em] text-[#20252B]">
              {branchName || 'Computer Science'}<br />
              Semester {semesterNum || '1'}
            </h1>

            {/* Subtitle */}
            <p className="mt-[20px] text-[17px] font-[400] leading-[1.6] text-[#5F6873]">
              Everything you need to learn, practice, and excel.
            </p>
          </div>

          {/* Right: Technical 3D Visual with Floating Tile */}
          <div className="flex w-full items-center justify-center lg:justify-end">
            <SubjectHeroVisual />
          </div>

        </div>

        {/* ── SUBJECT CARDS 3-COLUMN GRID ── */}
        <div className="mt-[54px] grid grid-cols-1 gap-x-[72px] gap-y-[38px] sm:grid-cols-2 lg:grid-cols-3">
          {displaySubjects.map((sub, idx) => {
            // Place 7th card specifically in column 2 on desktop!
            const isSeventh = idx === 6;
            return (
              <div 
                key={sub.number}
                className={isSeventh ? 'lg:col-start-2' : ''}
              >
                <SubjectCard
                  number={sub.number}
                  title={sub.title}
                  href={`/subjects/${sub.id}`}
                />
              </div>
            );
          })}
        </div>

        {/* ── BOTTOM EDITORIAL & DARK GEOMETRIC SECTION ── */}
        <div className="relative mt-[80px] flex flex-col md:flex-row md:items-end md:justify-between">
          
          {/* Left Motivational Detail */}
          <div className="flex flex-col items-start max-w-[340px]">
            <span className="font-mono-spec text-[11px] font-[500] tracking-[0.18em] text-[#3F4852] mb-2">
              // CODE. LEARN. GROW.
            </span>
            <p className="text-[14px] font-[400] leading-[1.55] text-[#68717B] mb-4">
              Stay consistent, keep coding, and make your future extraordinary.
            </p>
            <div className="h-[1.5px] w-[40px] bg-[#171B21]" />
          </div>

          {/* Right Dark Geometric Angular Section */}
          <div 
            className="relative mt-8 md:mt-0 flex h-[130px] w-full max-w-[380px] items-center justify-end pr-[40px] pl-[80px] bg-[#13181F] text-white"
            style={{
              clipPath: 'polygon(25% 100%, 100% 100%, 100% 0, 48% 0)',
            }}
          >
            <div className="flex items-center gap-4">
              <div className="flex h-[36px] w-[36px] items-center justify-center rounded-[8px] border border-white/20 bg-white/5 font-mono-spec text-[13px] text-white">
                &lt;/&gt;
              </div>
              <div className="flex flex-col text-[14px] font-[500] leading-[1.3] text-[#F0F1EE]">
                <span>Keep learning.</span>
                <span>Keep growing.</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* ── Branch & Semester Selector Modal ── */}
      <BranchQuickSelectorModal
        isOpen={showFilterModal}
        onClose={() => setShowFilterModal(false)}
      />
    </div>
  );
}
