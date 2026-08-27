'use client';

import React from 'react';
import { BookOpen, FileText, Bookmark, Code2 } from 'lucide-react';

export const TechnicalAccountVisual: React.FC = () => {
  return (
    <div className="relative flex h-[620px] w-full max-w-[700px] items-center justify-center pointer-events-none select-none">
      
      {/* ── BACKGROUND BLUEPRINT NETWORKS, ARCS & NODES ── */}
      <svg className="absolute inset-0 h-full w-full opacity-60" viewBox="0 0 700 620" fill="none">
        {/* Large faint technical arcs */}
        <circle cx="370" cy="300" r="240" stroke="rgba(74, 85, 98, 0.12)" strokeWidth="1" strokeDasharray="6 8" />
        <circle cx="370" cy="300" r="280" stroke="rgba(74, 85, 98, 0.08)" strokeWidth="1" />
        <circle cx="370" cy="300" r="180" stroke="rgba(74, 85, 98, 0.10)" strokeWidth="1" strokeDasharray="3 4" />

        {/* Top-left connector to STUDY HUB */}
        <path d="M 120 120 L 220 120 L 290 200" stroke="rgba(74, 85, 98, 0.18)" strokeWidth="1" />
        <circle cx="120" cy="120" r="2.5" fill="#4A5562" opacity="0.6" />
        <circle cx="290" cy="200" r="3" fill="#4A5562" opacity="0.7" />

        {/* Top-right connector to YOUR RESOURCES */}
        <path d="M 450 160 L 520 120 L 610 120" stroke="rgba(74, 85, 98, 0.18)" strokeWidth="1" />
        <circle cx="450" cy="160" r="3" fill="#4A5562" opacity="0.7" />
        <circle cx="610" cy="120" r="2.5" fill="#4A5562" opacity="0.6" />

        {/* Bottom-left connector to BOOKMARKS */}
        <path d="M 110 470 L 200 470 L 270 390" stroke="rgba(74, 85, 98, 0.18)" strokeWidth="1" strokeDasharray="4 4" />
        <circle cx="110" cy="470" r="2.5" fill="#4A5562" opacity="0.6" />
        <circle cx="270" cy="390" r="3" fill="#4A5562" opacity="0.7" />

        {/* Bottom-right connector to KEEP LEARNING */}
        <path d="M 480 390 L 550 480 L 630 480" stroke="rgba(74, 85, 98, 0.18)" strokeWidth="1" />
        <circle cx="480" cy="390" r="3" fill="#4A5562" opacity="0.7" />
        <circle cx="630" cy="480" r="2.5" fill="#4A5562" opacity="0.6" />

        {/* Geometric crosshairs & fine grid dots */}
        <g opacity="0.4">
          <circle cx="640" cy="80" r="1.5" fill="#4A5562" />
          <circle cx="655" cy="80" r="1.5" fill="#4A5562" />
          <circle cx="670" cy="80" r="1.5" fill="#4A5562" />
          <circle cx="640" cy="95" r="1.5" fill="#4A5562" />
          <circle cx="655" cy="95" r="1.5" fill="#4A5562" />
          <circle cx="670" cy="95" r="1.5" fill="#4A5562" />
          
          <line x1="50" y1="280" x2="70" y2="280" stroke="#4A5562" strokeWidth="1" />
          <line x1="60" y1="270" x2="60" y2="290" stroke="#4A5562" strokeWidth="1" />
        </g>
      </svg>

      {/* ── ISOMETRIC 3D FLOATING LAYERS & CENTRAL TILE ── */}
      <div 
        className="relative flex items-center justify-center"
        style={{
          perspective: '1200px',
        }}
      >
        <div 
          className="relative flex items-center justify-center transition-transform duration-700 hover:scale-[1.015]"
          style={{
            transform: 'rotateX(54deg) rotateZ(-32deg)',
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Layer 1: Bottom large translucent wireframe plane */}
          <div 
            className="absolute h-[340px] w-[370px] rounded-[32px] border border-[rgba(255,255,255,0.45)] bg-[rgba(255,255,255,0.18)] shadow-[0_30px_60px_rgba(0,0,0,0.03)]"
            style={{
              transform: 'translateZ(-40px)',
            }}
          />

          {/* Layer 2: Middle offset frosted blueprint panel */}
          <div 
            className="absolute h-[280px] w-[310px] rounded-[26px] border border-[rgba(60,68,78,0.14)] bg-[rgba(247,246,243,0.50)] shadow-[0_20px_45px_rgba(20,25,32,0.05)] backdrop-blur-sm"
            style={{
              transform: 'translateZ(-5px)',
            }}
          />

          {/* Layer 3: Central Raised 3D Dark Account Tile */}
          <div 
            className="relative flex h-[210px] w-[230px] items-center justify-center rounded-[32px] shadow-[0_35px_65px_rgba(12,18,26,0.38),0_12px_24px_rgba(12,18,26,0.20)]"
            style={{
              transform: 'translateZ(45px)',
              background: 'radial-gradient(circle at 35% 30%, #2A333F 0%, #171E28 85%)',
              border: '1px solid rgba(255, 255, 255, 0.16)',
            }}
          >
            {/* 3D Extrusion Side & Bottom Rim */}
            <div 
              className="absolute -bottom-[12px] -right-[8px] h-full w-full rounded-[32px] bg-[#0E141B] -z-10" 
            />

            {/* Subtle polygonal surface highlight */}
            <div 
              className="pointer-events-none absolute inset-0 rounded-[32px] opacity-20"
              style={{
                backgroundImage: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 60%)',
              }}
            />

            {/* Centered Outline User/Profile Icon */}
            <div 
              className="flex flex-col items-center justify-center select-none"
              style={{
                transform: 'rotateZ(32deg) rotateX(-15deg)', // Slight counter-tilt so icon faces viewer cleanly
              }}
            >
              <svg className="h-[96px] w-[96px] text-[#F3F4F2]" viewBox="0 0 100 100" fill="none" stroke="currentColor">
                {/* Circular head */}
                <circle cx="50" cy="36" r="17" strokeWidth="4" />
                {/* Curved shoulder line */}
                <path d="M 22 82 C 22 62, 34 58, 50 58 C 66 58, 78 62, 78 82" strokeWidth="4" strokeLinecap="round" />
              </svg>
            </div>

          </div>

        </div>
      </div>

      {/* ── 4 FLOATING TECHNICAL LABELS ── */}
      
      {/* 1. Top-Left: STUDY HUB */}
      <div 
        className="pointer-events-auto absolute left-[40px] top-[100px] flex h-[50px] items-center gap-[10px] rounded-[10px] border border-[rgba(21,27,36,0.08)] bg-[rgba(248,248,246,0.88)] px-[20px] shadow-[0_12px_30px_rgba(20,28,36,0.05)] backdrop-blur-md transition-transform duration-200 hover:-translate-y-0.5"
      >
        <BookOpen className="h-[17px] w-[17px] text-[#2F3741] stroke-[1.8]" />
        <span className="font-mono-spec text-[12px] font-[600] tracking-[0.08em] text-[#1E252E]">
          STUDY HUB
        </span>
      </div>

      {/* 2. Top-Right: YOUR RESOURCES */}
      <div 
        className="pointer-events-auto absolute right-[20px] top-[125px] flex h-[50px] items-center gap-[10px] rounded-[10px] border border-[rgba(21,27,36,0.08)] bg-[rgba(248,248,246,0.88)] px-[20px] shadow-[0_12px_30px_rgba(20,28,36,0.05)] backdrop-blur-md transition-transform duration-200 hover:-translate-y-0.5"
      >
        <FileText className="h-[17px] w-[17px] text-[#2F3741] stroke-[1.8]" />
        <span className="font-mono-spec text-[12px] font-[600] tracking-[0.08em] text-[#1E252E]">
          YOUR RESOURCES
        </span>
      </div>

      {/* 3. Bottom-Left: BOOKMARKS */}
      <div 
        className="pointer-events-auto absolute left-[30px] bottom-[140px] flex h-[50px] items-center gap-[10px] rounded-[10px] border border-[rgba(21,27,36,0.08)] bg-[rgba(248,248,246,0.88)] px-[20px] shadow-[0_12px_30px_rgba(20,28,36,0.05)] backdrop-blur-md transition-transform duration-200 hover:-translate-y-0.5"
      >
        <Bookmark className="h-[17px] w-[17px] text-[#2F3741] stroke-[1.8]" />
        <span className="font-mono-spec text-[12px] font-[600] tracking-[0.08em] text-[#1E252E]">
          BOOKMARKS
        </span>
      </div>

      {/* 4. Bottom-Right: KEEP LEARNING */}
      <div 
        className="pointer-events-auto absolute right-[25px] bottom-[135px] flex h-[50px] items-center gap-[10px] rounded-[10px] border border-[rgba(21,27,36,0.08)] bg-[rgba(248,248,246,0.88)] px-[20px] shadow-[0_12px_30px_rgba(20,28,36,0.05)] backdrop-blur-md transition-transform duration-200 hover:-translate-y-0.5"
      >
        <span className="font-mono-spec text-[15px] font-[650] text-[#1E252E]">&lt;/&gt;</span>
        <span className="font-mono-spec text-[12px] font-[600] tracking-[0.08em] text-[#1E252E]">
          KEEP LEARNING
        </span>
      </div>

    </div>
  );
};
