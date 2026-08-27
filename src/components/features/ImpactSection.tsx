'use client';

import React from 'react';
import { Users, FileStack, Building2, Code2 } from 'lucide-react';

const stats = [
  {
    icon: <Users className="h-[20px] w-[20px] text-[#9ba4af]" strokeWidth={1.5} />,
    value: '50K+',
    label: 'Active Students',
  },
  {
    icon: <FileStack className="h-[20px] w-[20px] text-[#9ba4af]" strokeWidth={1.5} />,
    value: '100K+',
    label: 'Resources',
  },
  {
    icon: <Building2 className="h-[20px] w-[20px] text-[#9ba4af]" strokeWidth={1.5} />,
    value: '500+',
    label: 'Colleges',
  },
  {
    icon: <Code2 className="h-[20px] w-[20px] text-[#9ba4af]" strokeWidth={1.5} />,
    value: 'Thousands',
    label: 'Projects Built',
  },
];

export const ImpactSection: React.FC = () => {
  return (
    <section 
      className="relative w-full bg-[#101419] -mt-[6vw]"
      style={{
        clipPath: 'polygon(0 6vw, 100% 0, 100% 100%, 0 100%)',
      }}
    >
      <div className="mx-auto w-full px-5 sm:px-10 lg:px-[72px] xl:px-[clamp(56px,5vw,88px)] pt-[calc(44px+5vw)] sm:pt-[calc(64px+5vw)] lg:pt-[calc(100px+6vw)] pb-10 sm:pb-16 lg:pb-[100px]">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 sm:gap-10 lg:gap-12">
          
          {/* ── Left Side: Impact Header ── */}
          <div className="flex flex-col flex-shrink-0">
            <span className="font-mono-spec text-[11px] sm:text-[12px] font-[500] tracking-[0.18em] text-[#8793a2] mb-2.5 sm:mb-4 lg:mb-[20px]">
              // IMPACT
            </span>
            <h2 className="text-[28px] sm:text-[34px] lg:text-[40px] font-[750] leading-[1.15] tracking-[-0.04em] text-[#f0eeea]">
              <span className="text-[#5a6573] font-mono-spec mr-[6px] sm:mr-[8px]">{'{'}</span>
              Built for learners.
              <br />
              Driven by future.
              <span className="text-[#5a6573] font-mono-spec ml-[6px] sm:ml-[8px]">{'}'}</span>
            </h2>
          </div>

          {/* ── Right Side: Horizontal Statistics ── */}
          <div className="grid grid-cols-2 gap-x-5 gap-y-6 sm:flex sm:flex-row sm:flex-wrap lg:flex-nowrap items-start sm:items-center sm:gap-x-10 lg:gap-x-[48px] sm:gap-y-8 lg:gap-y-[48px]">
            {stats.map((stat, idx) => (
              <React.Fragment key={idx}>
                <div className="flex flex-col gap-2.5 sm:gap-[16px]">
                  {/* Icon Square */}
                  <div className="flex h-10 w-10 sm:h-[48px] sm:w-[48px] items-center justify-center rounded-xl sm:rounded-[14px] border border-[rgba(255,255,255,0.10)] bg-[rgba(255,255,255,0.025)]">
                    {stat.icon}
                  </div>
                  
                  {/* Text Data */}
                  <div className="flex flex-col gap-1 sm:gap-[4px]">
                    <span className="text-[26px] sm:text-[32px] lg:text-[36px] font-[750] tracking-[-0.04em] text-[#f2f0eb] leading-tight">
                      {stat.value}
                    </span>
                    <span className="text-[12.5px] sm:text-[14px] font-[400] text-[#929ba6]">
                      {stat.label}
                    </span>
                  </div>
                </div>

                {/* Vertical separator (hide on mobile and last item) */}
                {idx < stats.length - 1 && (
                  <div className="hidden lg:flex flex-col items-center self-stretch py-2">
                    <div className="h-2 w-[1px] bg-transparent" />
                    <div className="h-1 w-1 rounded-full bg-[rgba(255,255,255,0.15)]" />
                    <div className="flex-1 w-[1px] bg-[rgba(255,255,255,0.08)] my-1" />
                    <div className="h-1 w-1 rounded-full bg-[rgba(255,255,255,0.15)]" />
                    <div className="h-2 w-[1px] bg-transparent" />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
