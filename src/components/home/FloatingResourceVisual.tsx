'use client';

import React from 'react';
import { FileText, HelpCircle, Code2, PlaySquare } from 'lucide-react';

export const FloatingResourceVisual: React.FC = () => {
  return (
    <div className="relative flex h-[340px] w-full max-w-[420px] items-center justify-center select-none pointer-events-none">
      
      {/* ── BACKGROUND BLUEPRINT HEXAGON & CONNECTOR LINES ── */}
      <svg className="absolute inset-0 h-full w-full opacity-60" viewBox="0 0 420 340" fill="none">
        {/* Outer Hexagon outline */}
        <polygon 
          points="210,35 340,105 340,235 210,305 80,235 80,105" 
          stroke="rgba(60, 70, 80, 0.12)" 
          strokeWidth="1.2" 
          strokeDasharray="4 4" 
        />
        {/* Inner concentric Hexagon outline */}
        <polygon 
          points="210,75 295,125 295,215 210,265 125,215 125,125" 
          stroke="rgba(60, 70, 80, 0.08)" 
          strokeWidth="1" 
        />

        {/* Diagonal and horizontal connectors to satellite cards */}
        {/* To Top (Notes) */}
        <line x1="210" y1="120" x2="210" y2="50" stroke="rgba(60, 70, 80, 0.18)" strokeWidth="1" />
        <circle cx="210" cy="50" r="2" fill="#5A6673" opacity="0.6" />

        {/* To Left (PYQs) */}
        <line x1="150" y1="170" x2="80" y2="170" stroke="rgba(60, 70, 80, 0.18)" strokeWidth="1" />
        <circle cx="80" cy="170" r="2" fill="#5A6673" opacity="0.6" />

        {/* To Right (Videos) */}
        <line x1="270" y1="170" x2="340" y2="170" stroke="rgba(60, 70, 80, 0.18)" strokeWidth="1" />
        <circle cx="340" cy="170" r="2" fill="#5A6673" opacity="0.6" />

        {/* To Bottom (Projects) */}
        <line x1="210" y1="220" x2="210" y2="285" stroke="rgba(60, 70, 80, 0.18)" strokeWidth="1" />
        <circle cx="210" cy="285" r="2" fill="#5A6673" opacity="0.6" />

        {/* Corner target nodes */}
        <circle cx="80" cy="105" r="2.5" fill="#35A47A" opacity="0.7" />
        <circle cx="340" cy="105" r="2.5" fill="#35A47A" opacity="0.7" />
        <circle cx="210" cy="305" r="2.5" fill="#35A47A" opacity="0.7" />
      </svg>

      {/* ── CENTRAL 3D HEXAGONAL CN EMBLEM ── */}
      <div className="relative flex items-center justify-center">
        {/* Layer 1: Ambient outer aura */}
        <div className="absolute h-[140px] w-[140px] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.8)_0%,transparent_70%)]" />

        {/* Layer 2: Translucent geometric back-layer */}
        <div 
          className="absolute h-[115px] w-[115px] rounded-[22px] border border-white/80 bg-white/45 shadow-[0_15px_30px_rgba(20,25,35,0.06)] backdrop-blur-xs"
          style={{
            clipPath: 'polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)',
          }}
        />

        {/* Layer 3: Main Dark Hexagon Tile */}
        <div 
          className="relative flex h-[95px] w-[95px] items-center justify-center shadow-[0_12px_28px_rgba(15,22,32,0.30)]"
          style={{
            background: 'linear-gradient(145deg, #27303C 0%, #10161F 100%)',
            clipPath: 'polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)',
          }}
        >
          <span className="font-mono-spec text-[24px] font-[700] tracking-[-0.04em] text-white">
            CN
          </span>
        </div>
      </div>

      {/* ── 4 SATELLITE FLOATING RESOURCE CARDS ── */}

      {/* Card 1: Notes (Top) */}
      <div className="absolute top-[18px] flex items-center gap-1.5 rounded-[9px] border border-[rgba(20,25,35,0.10)] bg-white/90 px-3 py-1.5 shadow-[0_6px_16px_rgba(0,0,0,0.04)]">
        <FileText className="h-[14px] w-[14px] text-[#35A47A] stroke-[2]" />
        <span className="text-[12px] font-[600] text-[#1E252D]">Notes</span>
      </div>

      {/* Card 2: PYQs (Left) */}
      <div className="absolute left-[8px] flex items-center gap-1.5 rounded-[9px] border border-[rgba(20,25,35,0.10)] bg-white/90 px-3 py-1.5 shadow-[0_6px_16px_rgba(0,0,0,0.04)]">
        <HelpCircle className="h-[14px] w-[14px] text-[#4A5565] stroke-[2]" />
        <span className="text-[12px] font-[600] text-[#1E252D]">PYQs</span>
      </div>

      {/* Card 3: Videos (Right) */}
      <div className="absolute right-[8px] flex items-center gap-1.5 rounded-[9px] border border-[rgba(20,25,35,0.10)] bg-white/90 px-3 py-1.5 shadow-[0_6px_16px_rgba(0,0,0,0.04)]">
        <PlaySquare className="h-[14px] w-[14px] text-[#35A47A] stroke-[2]" />
        <span className="text-[12px] font-[600] text-[#1E252D]">Videos</span>
      </div>

      {/* Card 4: Projects (Bottom) */}
      <div className="absolute bottom-[18px] flex items-center gap-1.5 rounded-[9px] border border-[rgba(20,25,35,0.10)] bg-white/90 px-3 py-1.5 shadow-[0_6px_16px_rgba(0,0,0,0.04)]">
        <Code2 className="h-[14px] w-[14px] text-[#1E252D] stroke-[2]" />
        <span className="text-[12px] font-[600] text-[#1E252D]">Projects</span>
      </div>

    </div>
  );
};
