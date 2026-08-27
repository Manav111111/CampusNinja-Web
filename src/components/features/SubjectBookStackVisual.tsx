'use client';

import React from 'react';

export const SubjectBookStackVisual: React.FC = () => {
  return (
    <div className="relative flex h-[240px] w-[340px] items-center justify-center pointer-events-none select-none">
      
      {/* ── BACKGROUND BLUEPRINT TECHNICAL LINES & NODES ── */}
      <svg className="absolute inset-0 h-full w-full opacity-60" viewBox="0 0 340 240" fill="none">
        {/* Top-left target node */}
        <circle cx="50" cy="50" r="10" stroke="rgba(72,82,94,0.18)" strokeWidth="1" />
        <circle cx="50" cy="50" r="4" fill="#171C22" opacity="0.8" />
        <circle cx="50" cy="50" r="1" fill="#FFFFFF" />

        {/* Diagonal and horizontal technical construction lines */}
        <path d="M 50 50 L 140 50 L 220 20" stroke="rgba(72,82,94,0.14)" strokeWidth="1" strokeDasharray="3 3" />
        <path d="M 240 180 L 290 180 L 320 210" stroke="rgba(72,82,94,0.14)" strokeWidth="1" />
        <circle cx="290" cy="180" r="2" fill="#4A5562" opacity="0.6" />
        <circle cx="320" cy="210" r="2.5" fill="#4A5562" opacity="0.7" />

        {/* Faint dotted circle */}
        <circle cx="210" cy="120" r="110" stroke="rgba(72,82,94,0.09)" strokeWidth="1" strokeDasharray="4 6" />
      </svg>

      {/* ── 3D ISOMETRIC BOOK / MATERIAL STACK ── */}
      <div 
        className="relative flex items-center justify-center"
        style={{
          perspective: '1000px',
        }}
      >
        <div 
          className="relative flex items-center justify-center transition-transform duration-700 hover:scale-[1.02]"
          style={{
            transform: 'rotateX(52deg) rotateZ(-32deg)',
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Layer 0: Shadow plane */}
          <div 
            className="absolute h-[170px] w-[210px] rounded-[18px] bg-black/15 blur-xl"
            style={{
              transform: 'translateZ(-40px) translateY(20px)',
            }}
          />

          {/* Layer 1: Base sheet/book */}
          <div 
            className="absolute h-[160px] w-[200px] rounded-[16px] border border-[rgba(210,215,220,0.85)] bg-[#EAEBE7] shadow-[0_10px_20px_rgba(0,0,0,0.06)]"
            style={{
              transform: 'translateZ(-20px) translateX(6px) translateY(6px)',
            }}
          />

          {/* Layer 2: Second stacked book */}
          <div 
            className="absolute h-[155px] w-[195px] rounded-[15px] border border-[rgba(220,224,228,0.9)] bg-[#F1F2EE] shadow-[0_8px_16px_rgba(0,0,0,0.05)]"
            style={{
              transform: 'translateZ(-10px) translateX(3px) translateY(3px)',
            }}
          />

          {/* Layer 3: Third stacked book */}
          <div 
            className="absolute h-[150px] w-[190px] rounded-[14px] border border-[rgba(230,233,235,0.95)] bg-[#F6F6F4] shadow-[0_6px_14px_rgba(0,0,0,0.04)]"
            style={{
              transform: 'translateZ(0px)',
            }}
          />

          {/* Layer 4: Top book with f(x) inscription */}
          <div 
            className="relative flex h-[145px] w-[185px] items-center justify-center rounded-[14px] border border-[rgba(255,255,255,0.9)] bg-gradient-to-br from-[#FFFFFF] via-[#F9F9F7] to-[#EDEDE9] shadow-[0_15px_30px_rgba(20,25,32,0.12),0_4px_8px_rgba(20,25,32,0.04)]"
            style={{
              transform: 'translateZ(15px)',
            }}
          >
            {/* Spine ridge highlight */}
            <div className="absolute left-[12px] top-0 bottom-0 w-[1px] bg-black/8" />
            <div className="absolute left-[15px] top-0 bottom-0 w-[1px] bg-white/60" />

            {/* Corner metallic marker / bookmark notch */}
            <div className="absolute right-[14px] top-[14px] h-[5px] w-[5px] rounded-full bg-[#171C22]/25" />

            {/* f(x) Mathematical notation */}
            <span 
              className="italic font-serif text-[32px] font-[500] text-[#555E69] select-none tracking-tight"
              style={{
                fontFamily: '"Times New Roman", Times, serif',
                textShadow: '0 1px 2px rgba(255,255,255,0.8)',
              }}
            >
              f(x)
            </span>
          </div>

        </div>
      </div>

    </div>
  );
};
