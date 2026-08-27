'use client';

import React from 'react';
import { BookOpen, FileText, Code2, PlaySquare } from 'lucide-react';
import Link from 'next/link';

interface HeroCodeVisualProps {
  onOpenStudyHub?: () => void;
}

export const HeroCodeVisual: React.FC<HeroCodeVisualProps> = ({ onOpenStudyHub }) => {
  return (
    <div className="relative flex h-[320px] sm:h-[420px] lg:h-[500px] w-[320px] sm:w-[420px] lg:w-[500px] max-w-full items-center justify-center pointer-events-none select-none mx-auto scale-[0.78] sm:scale-90 lg:scale-100 origin-center">
      
      {/* ── PERSPECTIVE TECHNICAL FLOOR ── */}
      <div 
        className="absolute bottom-[-15px] left-1/2 w-[680px] h-[240px] -translate-x-1/2"
        style={{
          perspective: '800px',
        }}
      >
        <div 
          className="h-full w-full"
          style={{
            transform: 'rotateX(65deg) translateY(20px)',
            transformOrigin: 'center bottom',
          }}
        >
          {/* Subtle grid and floor lines */}
          <svg className="w-full h-full opacity-[0.08]" viewBox="0 0 700 240" preserveAspectRatio="none">
            <path d="M0 50 L700 50 M0 100 L700 100 M0 150 L700 150 M0 200 L700 200" stroke="#5a6573" strokeWidth="1" />
            <path d="M350 0 L70 240 M350 0 L210 240 M350 0 L350 240 M350 0 L490 240 M350 0 L630 240" stroke="#5a6573" strokeWidth="1.2" />
            <rect x="220" y="80" width="130" height="40" fill="none" stroke="#5a6573" strokeWidth="1.2" />
            <rect x="350" y="120" width="130" height="70" fill="none" stroke="#5a6573" strokeWidth="1" strokeDasharray="3 3" />
          </svg>
        </div>
      </div>

      {/* ── CENTRAL TECHNICAL CIRCULAR BLUEPRINT SYSTEM ── */}
      <svg className="absolute inset-0 h-[500px] w-[500px]" viewBox="0 0 500 500" fill="none">
        
        {/* Ring 1: Outer dashed construction circle */}
        <circle cx="250" cy="250" r="235" stroke="#AEB5B9" strokeOpacity="0.22" strokeWidth="1" strokeDasharray="4 6" />
        
        {/* Ring 2: Secondary circle */}
        <circle cx="250" cy="250" r="195" stroke="#AEB5B9" strokeOpacity="0.18" strokeWidth="1" />
        
        {/* Ring 3: Main ring - Partial circular arcs */}
        <path d="M 105 105 A 195 195 0 0 1 445 250" stroke="#AEB5B9" strokeOpacity="0.45" strokeWidth="1.8" />
        <path d="M 55 250 A 195 195 0 0 0 250 445" stroke="#AEB5B9" strokeOpacity="0.35" strokeWidth="1.8" strokeDasharray="4 6" />
        
        {/* Ring 4: Inner dotted rings */}
        <circle cx="250" cy="250" r="150" stroke="#AEB5B9" strokeOpacity="0.20" strokeWidth="1" strokeDasharray="2 3" />
        <circle cx="250" cy="250" r="140" stroke="#AEB5B9" strokeOpacity="0.30" strokeWidth="1" />

        {/* Thick segmented technical arc (Top-Right) */}
        <path d="M 250 30 A 220 220 0 0 1 470 250" stroke="#606775" strokeOpacity="0.20" strokeWidth="10" strokeLinecap="butt" strokeDasharray="60 16 30 8 130 24" />
        
        {/* Thick segmented technical arc (Left) */}
        <path d="M 55 250 A 195 195 0 0 1 105 115" stroke="#606775" strokeOpacity="0.14" strokeWidth="6" />

        {/* ── TECHNICAL CONNECTORS & NODES ── */}
        <g stroke="#AEB5B9" strokeOpacity="0.45" strokeWidth="1">
          {/* To Notes (Top Left) */}
          <path d="M 140 140 L 110 140 L 110 110" />
          <circle cx="110" cy="110" r="2.5" fill="#66717e" opacity="0.8" stroke="none" />
          
          {/* To PYQs (Top Right) */}
          <path d="M 360 140 L 390 140 L 390 100" />
          <circle cx="360" cy="140" r="2.5" fill="#66717e" opacity="0.8" stroke="none" />
          <circle cx="390" cy="100" r="2.5" fill="#66717e" opacity="0.8" stroke="none" />

          {/* To Projects (Bottom Left) */}
          <path d="M 110 360 L 80 360 L 80 380" strokeDasharray="3 3" />
          <circle cx="110" cy="360" r="2.5" fill="#66717e" opacity="0.8" stroke="none" />

          {/* To Videos (Bottom Right) */}
          <path d="M 390 390 L 425 390 L 425 370" />
          <circle cx="425" cy="370" r="2.5" fill="#66717e" opacity="0.8" stroke="none" />
        </g>
      </svg>

      {/* ── CENTRAL 3D CODE SYMBOL < / > (SLIM & BALANCED) ── */}
      <div 
        className="relative z-10 flex items-center justify-center transition-transform duration-700 hover:scale-[1.02]"
        style={{ filter: 'drop-shadow(0 8px 14px rgba(20, 25, 32, 0.08))' }}
      >
        <svg 
          width="320" 
          height="215" 
          viewBox="0 0 420 280" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* < (Left Chevron) - Refined Slim Geometry */}
          {/* Extrusion / Dark side surface */}
          <path 
            d="M 135 45 L 45 140 L 135 235 L 153 217 L 80 140 L 153 63 Z" 
            fill="#171C22" 
            transform="translate(2, 3)"
          />
          {/* Front Face */}
          <path 
            d="M 135 45 L 45 140 L 135 235 L 153 217 L 80 140 L 153 63 Z" 
            fill="#20262D" 
            stroke="rgba(255,255,255,0.06)" 
            strokeWidth="0.8"
          />
          {/* Secondary Top Surface Highlight */}
          <path 
            d="M 135 45 L 45 140 L 80 140 L 153 63 Z" 
            fill="#2B323B" 
          />

          {/* / (Center Slash) - Refined Slim Width (23px) */}
          {/* Extrusion / Dark side surface */}
          <path 
            d="M 235 20 L 185 260 L 208 260 L 258 20 Z" 
            fill="#171C22" 
            transform="translate(2, 3)"
          />
          {/* Front Face */}
          <path 
            d="M 235 20 L 185 260 L 208 260 L 258 20 Z" 
            fill="#20262D" 
            stroke="rgba(255,255,255,0.06)" 
            strokeWidth="0.8"
          />
          {/* Secondary Top Surface Highlight */}
          <path 
            d="M 235 20 L 185 260 L 196 260 L 246 20 Z" 
            fill="#2B323B" 
          />

          {/* > (Right Chevron) - Refined Slim Geometry */}
          {/* Extrusion / Dark side surface */}
          <path 
            d="M 285 45 L 375 140 L 285 235 L 267 217 L 340 140 L 267 63 Z" 
            fill="#171C22" 
            transform="translate(2, 3)"
          />
          {/* Front Face */}
          <path 
            d="M 285 45 L 375 140 L 285 235 L 267 217 L 340 140 L 267 63 Z" 
            fill="#20262D" 
            stroke="rgba(255,255,255,0.06)" 
            strokeWidth="0.8"
          />
          {/* Secondary Top Surface Highlight */}
          <path 
            d="M 285 45 L 375 140 L 340 140 L 267 63 Z" 
            fill="#2B323B" 
          />
        </svg>
      </div>

      {/* ── FLOATING RESOURCE LABELS ── */}
      
      {/* Top Left: Notes */}
      <div className="absolute top-[60px] left-[20px] z-20 pointer-events-auto">
        <button
          onClick={onOpenStudyHub}
          className="flex h-[46px] items-center gap-[9px] rounded-[14px] border border-[rgba(215,218,218,0.75)] bg-[rgba(250,250,248,0.82)] px-[18px] text-[14px] font-[500] text-[#39424d] shadow-[0_8px_22px_rgba(20,25,30,0.05)] backdrop-blur-[8px] transition hover:-translate-y-0.5 hover:bg-white"
        >
          <BookOpen className="h-[17px] w-[17px] text-[#4f5964]" />
          <span>Notes</span>
        </button>
      </div>

      {/* Top Right: PYQs */}
      <div className="absolute top-[50px] right-[15px] z-20 pointer-events-auto">
        <button
          onClick={onOpenStudyHub}
          className="flex h-[46px] items-center gap-[9px] rounded-[14px] border border-[rgba(215,218,218,0.75)] bg-[rgba(250,250,248,0.82)] px-[18px] text-[14px] font-[500] text-[#39424d] shadow-[0_8px_22px_rgba(20,25,30,0.05)] backdrop-blur-[8px] transition hover:-translate-y-0.5 hover:bg-white"
        >
          <FileText className="h-[17px] w-[17px] text-[#4f5964]" />
          <span>PYQs</span>
        </button>
      </div>

      {/* Bottom Left: Projects */}
      <div className="absolute bottom-[75px] left-[0px] z-20 pointer-events-auto">
        <Link
          href="/skills"
          className="flex h-[46px] items-center gap-[9px] rounded-[14px] border border-[rgba(215,218,218,0.75)] bg-[rgba(250,250,248,0.82)] px-[18px] text-[14px] font-[500] text-[#39424d] shadow-[0_8px_22px_rgba(20,25,30,0.05)] backdrop-blur-[8px] transition hover:-translate-y-0.5 hover:bg-white"
        >
          <Code2 className="h-[17px] w-[17px] text-[#4f5964]" />
          <span>Projects</span>
        </Link>
      </div>

      {/* Bottom Right: Videos */}
      <div className="absolute bottom-[50px] right-[25px] z-20 pointer-events-auto">
        <button
          onClick={onOpenStudyHub}
          className="flex h-[46px] items-center gap-[9px] rounded-[14px] border border-[rgba(215,218,218,0.75)] bg-[rgba(250,250,248,0.82)] px-[18px] text-[14px] font-[500] text-[#39424d] shadow-[0_8px_22px_rgba(20,25,30,0.05)] backdrop-blur-[8px] transition hover:-translate-y-0.5 hover:bg-white"
        >
          <PlaySquare className="h-[17px] w-[17px] text-[#4f5964]" />
          <span>Videos</span>
        </button>
      </div>

    </div>
  );
};
