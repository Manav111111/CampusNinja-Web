'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Grid, 
  Code2, 
  Cpu, 
  Sparkles, 
  Layers, 
  Terminal, 
  SlidersHorizontal,
  ArrowLeft,
  ExternalLink
} from 'lucide-react';
import { useSkills } from '@/hooks/useQueries';
import { SkillHeroVisual } from '@/components/features/SkillHeroVisual';

const DEFAULT_SKILLS = [
  {
    number: '01',
    title: 'Full-Stack\nWeb Development',
    category: 'web',
    level: 'Intermediate',
    modules: '24 Modules',
    hours: '32h',
    url: 'https://www.youtube.com/results?search_query=full+stack+web+development+roadmap',
  },
  {
    number: '02',
    title: 'Data Structures\n& Algorithms',
    category: 'dsa',
    level: 'Beginner to Advanced',
    modules: '36 Modules',
    hours: '48h',
    url: 'https://www.youtube.com/results?search_query=dsa+roadmap+for+placements',
  },
  {
    number: '03',
    title: 'Applied\nGenerative AI',
    category: 'ai',
    level: 'All Levels',
    modules: '18 Modules',
    hours: '20h',
    url: 'https://www.youtube.com/results?search_query=generative+ai+course+full',
  },
  {
    number: '04',
    title: 'Embedded Systems\n& IoT',
    category: 'systems',
    level: 'Core Electronics',
    modules: '15 Modules',
    hours: '18h',
    url: 'https://www.youtube.com/results?search_query=embedded+systems+iot+course',
  },
  {
    number: '05',
    title: 'System Design\n& Architecture',
    category: 'web',
    level: 'Advanced',
    modules: '20 Modules',
    hours: '26h',
    url: 'https://www.youtube.com/results?search_query=system+design+roadmap',
  },
  {
    number: '06',
    title: 'Cloud Computing\n& DevOps',
    category: 'cloud',
    level: 'Intermediate',
    modules: '22 Modules',
    hours: '28h',
    url: 'https://www.youtube.com/results?search_query=devops+roadmap',
  },
  {
    number: '07',
    title: 'Mobile App\nDevelopment',
    category: 'web',
    level: 'All Levels',
    modules: '16 Modules',
    hours: '22h',
    url: 'https://www.youtube.com/results?search_query=react+native+course',
  },
];

export default function SkillsPage() {
  const { data: dbSkills } = useSkills();
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All Tracks', icon: <Grid className="h-[17px] w-[17px]" /> },
    { id: 'web', label: 'Web Dev', icon: <Code2 className="h-[17px] w-[17px]" /> },
    { id: 'dsa', label: 'DSA & Coding', icon: <Cpu className="h-[17px] w-[17px]" /> },
    { id: 'ai', label: 'Applied AI', icon: <Sparkles className="h-[17px] w-[17px]" /> },
    { id: 'systems', label: 'Systems & IoT', icon: <Layers className="h-[17px] w-[17px]" /> },
    { id: 'cloud', label: 'Cloud & DevOps', icon: <Terminal className="h-[17px] w-[17px]" /> },
  ];

  // Merge db skills or fallback to curated default tracks
  const displaySkills = (dbSkills && dbSkills.length > 0)
    ? dbSkills.map((s, idx) => ({
        number: String(idx + 1).padStart(2, '0'),
        title: s.name.replace(/\s+/g, '\n'),
        category: 'web',
        level: s.difficulty_level || 'All Levels',
        modules: `${(s as any).modules || 18} Modules`,
        hours: `${(s as any).hours || '24h'}`,
        url: (s as any).video_url || 'https://www.youtube.com/results?search_query=programming+tutorial',
      }))
    : DEFAULT_SKILLS;

  const filteredSkills = activeCategory === 'all'
    ? displaySkills
    : displaySkills.filter((s) => s.category === activeCategory);

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
        <path d="M -50 700 A 450 450 0 0 1 400 1150" stroke="rgba(50,60,70,0.14)" strokeWidth="1" strokeDasharray="6 8" />
        <line x1="84" y1="420" x2="1356" y2="420" stroke="rgba(60,70,80,0.06)" strokeWidth="1" strokeDasharray="4 4" />
        <circle cx="84" cy="420" r="2.5" fill="#606876" opacity="0.4" />
        <circle cx="1356" cy="420" r="2.5" fill="#606876" opacity="0.4" />
      </svg>

      {/* ── MAIN CONTENT CONTAINER ── */}
      <div className="mx-auto w-full px-4 sm:px-6 lg:px-[54px] xl:px-[84px] pt-4 sm:pt-6 lg:pt-[32px] pb-12 sm:pb-16 lg:pb-[80px]">
        
        {/* ── BACK LINK ── */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-[13.5px] sm:text-[14px] font-[500] text-[#5F6873] transition-colors hover:text-[#171B21] mb-4 sm:mb-[24px]"
        >
          <ArrowLeft className="h-4 w-4 stroke-[1.8]" />
          <span>Back to Home</span>
        </Link>

        {/* ── HERO SECTION ── */}
        <div className="grid items-center gap-6 lg:gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          
          {/* Left: Typography & Headings */}
          <div className="flex flex-col items-start">
            <span className="font-mono-spec text-[11px] font-[500] uppercase tracking-[0.25em] text-[#7C8490] mb-3 sm:mb-[18px]">
              03 — INDUSTRY ROADMAPS
            </span>

            <h1 className="text-[32px] sm:text-[46px] lg:text-[clamp(44px,4.2vw,68px)] font-[650] leading-[1.04] tracking-[-0.045em] text-[#20252B]">
              Engineering Skills.<br />
              Career Roadmaps.
            </h1>

            <p className="mt-3 sm:mt-[20px] text-[15px] sm:text-[17px] font-[400] leading-[1.6] text-[#5F6873] max-w-[580px]">
              Placement-ready tracks, curated coding roadmaps, and hands-on project tutorials built to level up your engineering career.
            </p>
          </div>

          {/* Right: Technical 3D Visual with Floating Tile */}
          <div className="flex w-full items-center justify-center lg:justify-end">
            <SkillHeroVisual />
          </div>

        </div>

        {/* ── CATEGORY FILTER NAVIGATION ── */}
        <div className="mt-6 sm:mt-[36px] flex flex-col gap-3.5 sm:gap-4 sm:flex-row sm:items-center sm:justify-between">
          
          {/* Left Horizontal Category Tabs */}
          <div className="flex items-center gap-2.5 sm:gap-[14px] overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <div key={cat.id} className="relative shrink-0">
                  {/* Subtle Technical Corner Brackets */}
                  {isActive && (
                    <>
                      <span className="pointer-events-none absolute -top-[3px] -left-[3px] h-[7px] w-[7px] border-t border-l border-[#171C22]" />
                      <span className="pointer-events-none absolute -top-[3px] -right-[3px] h-[7px] w-[7px] border-t border-r border-[#171C22]" />
                      <span className="pointer-events-none absolute -bottom-[3px] -left-[3px] h-[7px] w-[7px] border-b border-l border-[#171C22]" />
                      <span className="pointer-events-none absolute -bottom-[3px] -right-[3px] h-[7px] w-[7px] border-b border-r border-[#171C22]" />
                    </>
                  )}

                  <button
                    onClick={() => setActiveCategory(cat.id)}
                    className={`flex h-[42px] sm:h-[48px] items-center gap-2 sm:gap-[10px] rounded-[8px] px-3.5 sm:px-[22px] text-[13px] sm:text-[14px] font-[500] transition-all duration-200 ${
                      isActive
                        ? 'bg-[#171C22] text-[#F4F3F0] shadow-sm'
                        : 'border border-[rgba(23,27,33,0.12)] bg-[rgba(255,255,255,0.30)] text-[#3E4852] hover:bg-white/60'
                    }`}
                  >
                    <span className={isActive ? 'text-[#F4F3F0]' : 'text-[#5F6873]'}>
                      {cat.icon}
                    </span>
                    <span>{cat.label}</span>
                  </button>
                </div>
              );
            })}
          </div>

          {/* Right Filter Button */}
          <button
            onClick={() => setActiveCategory('all')}
            className="flex h-[38px] sm:h-[44px] items-center gap-2 self-start sm:self-auto rounded-[6px] bg-[#171C22] px-3.5 sm:px-[20px] text-[13px] sm:text-[14px] font-[500] text-white transition hover:bg-black shadow-sm"
          >
            <span>All Tracks</span>
            <SlidersHorizontal className="h-[14px] w-[14px] sm:h-[15px] sm:w-[15px] stroke-[2]" />
          </button>

        </div>

        {/* ── SKILL CARDS 3-COLUMN GRID ── */}
        <div className="mt-6 sm:mt-[36px] grid grid-cols-1 gap-x-6 sm:gap-x-10 lg:gap-x-[72px] gap-y-3.5 sm:gap-y-6 lg:gap-y-[38px] sm:grid-cols-2 lg:grid-cols-3">
          {filteredSkills.map((track, idx) => {
            // Center the 7th item in column 2 on desktop
            const isSeventh = idx === 6;
            return (
              <div 
                key={track.number}
                className={isSeventh ? 'lg:col-start-2' : ''}
              >
                <a
                  href={track.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex min-h-[145px] flex-col justify-between p-[22px_28px] transition-all duration-200 hover:-translate-y-1 block"
                  style={{
                    background: 'rgba(247, 246, 243, 0.70)',
                    boxShadow: '0 12px 30px rgba(20, 25, 32, 0.025)',
                    clipPath: 'polygon(16px 0, calc(100% - 24px) 0, 100% 24px, 100% calc(100% - 14px), calc(100% - 14px) 100%, 14px 100%, 0 calc(100% - 14px), 0 16px)',
                  }}
                >
                  {/* Outer border matching polygon */}
                  <div 
                    className="pointer-events-none absolute inset-0 transition-colors duration-200 group-hover:border-[rgba(23,27,33,0.22)]"
                    style={{
                      border: '1px solid rgba(30, 37, 45, 0.10)',
                      clipPath: 'polygon(16px 0, calc(100% - 24px) 0, 100% 24px, 100% calc(100% - 14px), calc(100% - 14px) 100%, 14px 100%, 0 calc(100% - 14px), 0 16px)',
                    }}
                  />

                  {/* Top Left Number & Level */}
                  <div className="flex items-center justify-between">
                    <span className="font-mono-spec text-[12px] font-[500] tracking-[0.15em] text-[#7B8490]">
                      {track.number}
                    </span>
                    <span className="font-mono-spec text-[11px] font-[600] tracking-[0.06em] text-[#55606D] uppercase bg-white/60 px-2 py-0.5 rounded">
                      {track.level}
                    </span>
                  </div>

                  {/* Title & Arrow */}
                  <div className="mt-4 flex items-end justify-between gap-4">
                    <div>
                      <h3 className="whitespace-pre-line text-[19px] font-[600] leading-[1.35] tracking-[-0.02em] text-[#252A30] transition-colors group-hover:text-black">
                        {track.title}
                      </h3>
                      <p className="mt-1 font-mono-spec text-[11px] text-[#7B8490]">
                        {track.modules} · {track.hours}
                      </p>
                    </div>
                    
                    <span className="text-[26px] font-[300] text-[#252A30] transition-transform duration-200 group-hover:translate-x-1.5 leading-none mb-0.5">
                      →
                    </span>
                  </div>
                </a>
              </div>
            );
          })}
        </div>

        {/* ── BOTTOM EDITORIAL & DARK GEOMETRIC SECTION ── */}
        <div className="relative mt-[80px] flex flex-col md:flex-row md:items-end md:justify-between">
          
          {/* Left Motivational Detail */}
          <div className="flex flex-col items-start max-w-[340px]">
            <span className="font-mono-spec text-[11px] font-[500] tracking-[0.18em] text-[#3F4852] mb-2">
              // CODE. BUILD. SHIP.
            </span>
            <p className="text-[14px] font-[400] leading-[1.55] text-[#68717B] mb-4">
              Master real-world tech stacks and build an extraordinary portfolio.
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

    </div>
  );
}
