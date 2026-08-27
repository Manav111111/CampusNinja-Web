'use client';

import React from 'react';
import { Code2, Grid, Users, TrendingUp } from 'lucide-react';

const features = [
  {
    icon: <Code2 className="h-[18px] w-[18px] text-[#424C56]" strokeWidth={1.8} />,
    title: 'Coding Focused',
  },
  {
    icon: <Grid className="h-[18px] w-[18px] text-[#424C56]" strokeWidth={1.8} />,
    title: 'Curated Resources',
  },
  {
    icon: <Users className="h-[18px] w-[18px] text-[#424C56]" strokeWidth={1.8} />,
    title: 'Student Community',
  },
  {
    icon: <TrendingUp className="h-[18px] w-[18px] text-[#424C56]" strokeWidth={1.8} />,
    title: 'Career Growth',
  },
];

export const FeatureStrip: React.FC = () => {
  return (
    <div className="w-full border-t border-[rgba(150,155,158,0.18)]">
      <div className="mx-auto grid h-auto min-h-0 lg:min-h-[95px] w-full grid-cols-2 lg:grid-cols-4 divide-y divide-[rgba(150,155,158,0.14)] sm:divide-y-0">
        {features.map((feature, idx) => (
          <div
            key={idx}
            className={`flex items-center justify-center gap-2.5 sm:gap-[12px] py-3 sm:py-4 lg:py-0 ${
              idx !== features.length - 1 ? 'lg:border-r lg:border-[rgba(150,155,158,0.18)]' : ''
            }`}
          >
            <div className="flex items-center justify-center shrink-0">
              {feature.icon}
            </div>
            <span className="text-[13px] sm:text-[14px] font-[500] text-[#52606D] text-center sm:text-left">
              {feature.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
