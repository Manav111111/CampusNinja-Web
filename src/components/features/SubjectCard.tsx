'use client';

import React from 'react';
import Link from 'next/link';

interface SubjectCardProps {
  number: string;
  title: string;
  href: string;
  className?: string;
}

export const SubjectCard: React.FC<SubjectCardProps> = ({
  number,
  title,
  href,
  className = '',
}) => {
  return (
    <Link
      href={href}
      className={`group relative block h-[142px] w-full select-none transition-all duration-200 hover:-translate-y-1 ${className}`}
      style={{
        background: 'rgba(247, 246, 243, 0.88)',
        boxShadow: '0 8px 24px rgba(20, 25, 32, 0.03)',
        clipPath: 'polygon(14px 0, calc(100% - 20px) 0, 100% 20px, 100% calc(100% - 12px), calc(100% - 12px) 100%, 12px 100%, 0 calc(100% - 12px), 0 14px)',
      }}
    >
      {/* ── TECHNICAL CLIPPED BORDER OVERLAY ── */}
      <div 
        className="pointer-events-none absolute inset-0 transition-colors duration-200 group-hover:border-[rgba(23,28,35,0.25)]"
        style={{
          border: '1px solid rgba(25, 32, 40, 0.12)',
          clipPath: 'polygon(14px 0, calc(100% - 20px) 0, 100% 20px, 100% calc(100% - 12px), calc(100% - 12px) 100%, 12px 100%, 0 calc(100% - 12px), 0 14px)',
        }}
      />

      {/* ── 1. TOP-LEFT: SMALL TECHNICAL SUBJECT NUMBER ── */}
      <div className="absolute top-[18px] left-[24px] flex items-center">
        <span className="font-mono-spec text-[12px] font-[500] tracking-[0.16em] text-[#76808E]">
          {number}
        </span>
      </div>

      {/* ── TOP-RIGHT: CORNER MARK ── */}
      <div className="absolute top-[18px] right-[24px]">
        <span className="block h-[5px] w-[5px] rounded-full bg-[rgba(25,32,40,0.18)]" />
      </div>

      {/* ── 2. MIDDLE CONTENT AREA: SUBJECT NAME (VERTICALLY CENTERED INSIDE CARD) ── */}
      <div className="absolute left-[24px] right-[58px] top-[54%] -translate-y-1/2 flex items-center">
        <h3 className="whitespace-pre-line text-[19px] font-[550] leading-[1.3] tracking-[-0.02em] text-[#1E242C] transition-colors group-hover:text-black">
          {title}
        </h3>
      </div>

      {/* ── 3. BOTTOM-RIGHT: MINIMAL TECHNICAL ARROW ── */}
      <div className="absolute right-[24px] bottom-[18px] flex items-center justify-center">
        <span className="text-[24px] font-[300] text-[#1E242C] leading-none transition-transform duration-200 group-hover:translate-x-1.5">
          →
        </span>
      </div>
    </Link>
  );
};