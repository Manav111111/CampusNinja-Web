'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, BookOpen, ClipboardList, FileText, PlayCircle } from 'lucide-react';

interface QuickAccessCardProps {
  title: string;
  type: 'notes' | 'pyqs' | 'syllabus' | 'videos';
  color?: string;
}

export const QuickAccessCard: React.FC<QuickAccessCardProps> = ({ title, type }) => {
  const iconMap = {
    notes: FileText,
    pyqs: BookOpen,
    syllabus: ClipboardList,
    videos: PlayCircle,
  };
  const Icon = iconMap[type];

  return (
    <Link
      href={`/subjects?tab=${type}`}
      className="surface-card group flex min-h-28 items-center justify-between rounded-lg p-4"
    >
      <div className="flex min-w-0 items-center gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#EEF4FF] text-[#2563EB] transition duration-250 ease group-hover:bg-[#2563EB] group-hover:text-white">
          <Icon className="h-5 w-5 stroke-[1.75]" />
        </div>
        <div className="min-w-0">
          <h4 className="truncate text-sm font-bold tracking-tight text-[#0F172A]">{title}</h4>
          <p className="mt-1 text-xs font-semibold text-[#64748B]">Verified material</p>
        </div>
      </div>
      <div className="flex h-8 w-8 shrink-0 items-center justify-center text-[#94A3B8] transition duration-250 ease group-hover:translate-x-1 group-hover:text-[#2563EB]">
        <ArrowRight className="h-4 w-4" />
      </div>
    </Link>
  );
};
