'use client';

import React from 'react';
import { LayoutGrid, BookOpen, TrendingUp, Rocket } from 'lucide-react';

export const LoginFeatureStrip: React.FC = () => {
  const features = [
    {
      num: '01',
      icon: <LayoutGrid className="h-[22px] w-[22px] text-[#18202B] stroke-[1.75]" />,
      title: 'CURATED RESOURCES',
      desc: 'Handpicked for your success.',
    },
    {
      num: '02',
      icon: <BookOpen className="h-[22px] w-[22px] text-[#18202B] stroke-[1.75]" />,
      title: 'STUDY MATERIALS',
      desc: 'Notes, videos, PYQs & more.',
    },
    {
      num: '03',
      icon: <TrendingUp className="h-[22px] w-[22px] text-[#18202B] stroke-[1.75]" />,
      title: 'TRACK YOUR LEARNING',
      desc: 'Monitor progress, stay ahead.',
    },
    {
      num: '04',
      icon: <Rocket className="h-[22px] w-[22px] text-[#18202B] stroke-[1.75]" />,
      title: 'GROW YOUR FUTURE',
      desc: 'Skills today, impact tomorrow.',
    },
  ];

  return (
    <section className="w-full border-t border-[rgba(21,27,36,0.10)] bg-[var(--bg-main)]">
      <div className="mx-auto grid w-full grid-cols-1 md:grid-cols-2 xl:grid-cols-4 px-[24px] lg:px-[64px] py-[32px]">
        {features.map((item, idx) => (
          <div
            key={item.num}
            className={`flex items-center gap-4 py-4 xl:py-0 ${
              idx > 0 ? 'xl:border-l xl:border-[rgba(21,27,36,0.10)] xl:pl-[44px]' : ''
            }`}
          >
            {/* Number Badge Box */}
            <div className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-[8px] border border-[rgba(21,27,36,0.15)] bg-white/40 font-mono-spec text-[13px] font-[650] text-[#18202B]">
              {item.num}
            </div>

            {/* Feature Icon */}
            <div className="shrink-0 flex items-center justify-center text-[#18202B]">
              {item.icon}
            </div>

            {/* Feature Headings & Copy */}
            <div className="flex flex-col">
              <h4 className="font-mono-spec text-[13px] font-[650] tracking-[0.08em] text-[#18202B]">
                {item.title}
              </h4>
              <p className="text-[14px] font-[400] text-[#718091] mt-0.5">
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
