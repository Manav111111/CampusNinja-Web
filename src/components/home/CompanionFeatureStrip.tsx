'use client';

import React from 'react';
import { BookOpen, Users, Rocket, Shield } from 'lucide-react';

export const CompanionFeatureStrip: React.FC = () => {
  const features = [
    {
      title: 'Comprehensive\nStudy Hub',
      desc: 'Notes, PYQs, videos, assignments, and more – organized for your success.',
      icon: <BookOpen className="h-[22px] w-[22px] text-[#2E7E5F] stroke-[1.8]" />,
      bg: 'bg-[#EBF6F0]',
    },
    {
      title: 'Community\nPowered',
      desc: 'Learn together, share resources, and grow with your peers.',
      icon: <Users className="h-[22px] w-[22px] text-[#6355A4] stroke-[1.8]" />,
      bg: 'bg-[#F2EFFB]',
    },
    {
      title: 'Skill & Project\nDevelopment',
      desc: 'Build real-world skills with projects, labs, and expert resources.',
      icon: <Rocket className="h-[22px] w-[22px] text-[#D96B27] stroke-[1.8]" />,
      bg: 'bg-[#FDF3EA]',
    },
    {
      title: 'Smart AI\nAssistant',
      desc: 'Get instant answers, explanations, and study help anytime.',
      icon: <Shield className="h-[22px] w-[22px] text-[#2C6ECB] stroke-[1.8]" />,
      bg: 'bg-[#EBF3FD]',
    },
  ];

  return (
    <div className="w-full rounded-[18px] border border-[rgba(20,25,35,0.08)] bg-white/70 p-4 sm:p-6 md:p-8 shadow-[0_10px_30px_rgba(20,25,35,0.025)] backdrop-blur-sm">
      <div className="grid grid-cols-1 gap-5 sm:gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:divide-x lg:divide-[rgba(20,25,35,0.08)]">
        {features.map((item, idx) => (
          <div 
            key={item.title} 
            className={`flex items-start gap-3.5 sm:gap-4 ${idx > 0 ? 'lg:pl-8' : ''}`}
          >
            <div className={`flex h-11 w-11 sm:h-[52px] sm:w-[52px] shrink-0 items-center justify-center rounded-[12px] sm:rounded-[14px] ${item.bg} shadow-2xs`}>
              {item.icon}
            </div>
            <div className="flex flex-col">
              <h4 className="whitespace-normal sm:whitespace-pre-line text-[15px] sm:text-[16px] font-[650] leading-[1.3] text-[#17202B]">
                {item.title}
              </h4>
              <p className="mt-1 sm:mt-2 text-[12.5px] sm:text-[13px] leading-[1.55] text-[#616D7C]">
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
