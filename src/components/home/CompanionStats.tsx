'use client';

import React from 'react';
import { Users, FileText, GraduationCap, Zap } from 'lucide-react';

export const CompanionStats: React.FC = () => {
  const stats = [
    {
      value: '50K+',
      label: 'Active Students',
      sub: 'Growing every day',
      icon: <Users className="h-5 w-5 text-[#35A47A] stroke-[1.8]" />,
    },
    {
      value: '100K+',
      label: 'Study Resources',
      sub: 'Notes, PYQs, Videos & more',
      icon: <FileText className="h-5 w-5 text-[#8E9AAF] stroke-[1.8]" />,
    },
    {
      value: '500+',
      label: 'Colleges',
      sub: 'Across India',
      icon: <GraduationCap className="h-5 w-5 text-[#E5A869] stroke-[1.8]" />,
    },
    {
      value: '10M+',
      label: 'Resources Accessed',
      sub: 'And counting',
      icon: <Zap className="h-5 w-5 text-[#5C94EB] stroke-[1.8]" />,
    },
  ];

  return (
    <div className="relative w-full overflow-hidden rounded-[18px] bg-[#111822] p-7 md:p-8 text-white shadow-xl">
      
      {/* Decorative background contour lines */}
      <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-20" viewBox="0 0 1200 160" fill="none">
        <path d="M 0 80 Q 300 140 600 80 T 1200 80" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
        <circle cx="600" cy="80" r="2.5" fill="#fff" opacity="0.4" />
      </svg>

      <div className="relative grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:divide-x lg:divide-white/[0.08]">
        {stats.map((item, idx) => (
          <div 
            key={item.label}
            className={`flex items-center gap-4 ${idx > 0 ? 'lg:pl-8' : ''}`}
          >
            {/* Glass Icon Box */}
            <div className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] shadow-inner">
              {item.icon}
            </div>

            {/* Numbers & Label */}
            <div className="flex flex-col">
              <span className="text-[28px] font-[700] tracking-[-0.03em] text-white leading-none">
                {item.value}
              </span>
              <span className="mt-1 text-[15px] font-[600] text-[#E0E5EC]">
                {item.label}
              </span>
              <span className="text-[12px] text-[#8692A2]">
                {item.sub}
              </span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
