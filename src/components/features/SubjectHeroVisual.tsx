'use client';

import React from 'react';

export const SubjectHeroVisual: React.FC = () => {
  return (
    <div className="relative flex h-[280px] w-full max-w-[480px] items-center justify-center pointer-events-none select-none">
      
      {/* ── BACKGROUND BLUEPRINT LINES & NODES ── */}
      <svg className="absolute inset-0 h-full w-full opacity-60" viewBox="0 0 480 280" fill="none">
        {/* Top/Right Angular connectors */}
        <path d="M 270 35 L 360 35 L 450 80" stroke="rgba(60, 68, 78, 0.14)" strokeWidth="1" />
        <circle cx="270" cy="35" r="2.5" fill="#606876" opacity="0.6" />
        <circle cx="450" cy="80" r="2.5" fill="#606876" opacity="0.6" />

        <path d="M 40 180 L 140 180 L 220 225" stroke="rgba(60, 68, 78, 0.12)" strokeWidth="1" strokeDasharray="3 3" />
        <circle cx="40" cy="180" r="2" fill="#606876" opacity="0.5" />

        {/* Right dotted grid pattern */}
        <g opacity="0.35">
          <circle cx="460" cy="140" r="1.5" fill="#606876" />
          <circle cx="470" cy="140" r="1.5" fill="#606876" />
          <circle cx="460" cy="150" r="1.5" fill="#606876" />
          <circle cx="470" cy="150" r="1.5" fill="#606876" />
          <circle cx="460" cy="160" r="1.5" fill="#606876" />
          <circle cx="470" cy="160" r="1.5" fill="#606876" />
        </g>
      </svg>

      {/* ── ISOMETRIC PERSPECTIVE FLOATING LAYERS ── */}
      <div 
        className="relative flex items-center justify-center"
        style={{
          perspective: '1000px',
        }}
      >
        <div 
          className="relative flex items-center justify-center transition-transform duration-700 hover:scale-[1.02]"
          style={{
            transform: 'rotateX(55deg) rotateZ(-30deg)',
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Layer 1: Bottom large translucent wireframe plane */}
          <div 
            className="absolute h-[240px] w-[260px] rounded-[24px] border border-[rgba(60,68,78,0.12)] bg-[rgba(255,255,255,0.22)] shadow-[0_25px_50px_rgba(0,0,0,0.04)]"
            style={{
              transform: 'translateZ(-30px)',
            }}
          />

          {/* Layer 2: Middle offset glossy panel */}
          <div 
            className="absolute h-[190px] w-[210px] rounded-[20px] border border-[rgba(255,255,255,0.6)] bg-[rgba(247,246,243,0.55)] shadow-[0_15px_35px_rgba(20,25,32,0.06)] backdrop-blur-sm"
            style={{
              transform: 'translateZ(0px)',
            }}
          />

          {/* Layer 3: Top Floating 3D Dark Tile with </> */}
          <div 
            className="relative flex h-[130px] w-[150px] items-center justify-center rounded-[18px] shadow-[0_20px_40px_rgba(15,20,28,0.35)]"
            style={{
              transform: 'translateZ(35px)',
              background: 'linear-gradient(145deg, #333A43 0%, #151A20 100%)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
            }}
          >
            {/* Extrusion side edge */}
            <div 
              className="absolute -bottom-[6px] -right-[4px] h-full w-full rounded-[18px] bg-[#0E1217] -z-10" 
            />

            {/* Centered code symbol */}
            <span 
              className="font-mono-spec text-[38px] font-[600] tracking-[-0.08em] text-[#F0F1EE] select-none"
              style={{
                textShadow: '0 2px 8px rgba(0,0,0,0.5)',
              }}
            >
              &lt;/&gt;
            </span>
          </div>

        </div>
      </div>

    </div>
  );
};
