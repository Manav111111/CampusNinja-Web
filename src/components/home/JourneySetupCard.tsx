'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  GraduationCap, 
  BookOpen, 
  Calendar, 
  ChevronDown, 
  ArrowRight, 
  ShieldCheck 
} from 'lucide-react';
import { useAcademic } from '@/contexts/AcademicContext';
import { BranchQuickSelectorModal } from '@/components/features/BranchQuickSelectorModal';

export const JourneySetupCard: React.FC = () => {
  const router = useRouter();
  const { branchId, branchName, semesterId, semesterNum } = useAcademic();
  const [showModal, setShowModal] = useState(false);

  const handleEnter = () => {
    if (branchId && semesterId) {
      router.push('/subjects');
    } else {
      setShowModal(true);
    }
  };

  return (
    <>
      <div className="w-full max-w-[430px] rounded-[20px] border border-[rgba(20,25,35,0.10)] bg-white/75 p-7 shadow-[0_12px_32px_rgba(20,25,35,0.035)] backdrop-blur-md">
        
        {/* Step Indicator Pill */}
        <div className="mb-5 inline-flex items-center rounded-full border border-[rgba(20,25,35,0.12)] bg-white/60 px-3 py-1 text-[12px] font-mono-spec font-[600] text-[#55606E]">
          1 / 3
        </div>

        {/* Heading */}
        <h3 className="text-[26px] font-[700] tracking-[-0.03em] text-[#17202B] leading-snug">
          Start Your Journey
        </h3>

        {/* Description */}
        <p className="mt-2 text-[14px] leading-[1.55] text-[#616D7C]">
          Select your course, branch and semester to personalize your study hub.
        </p>

        {/* Stacked Form Fields */}
        <div className="mt-6 flex flex-col space-y-4">
          
          {/* Field 1: Course */}
          <div>
            <label className="mb-1.5 block font-mono-spec text-[11px] font-[600] uppercase tracking-[0.10em] text-[#717E8C]">
              COURSE
            </label>
            <div className="flex h-[48px] items-center justify-between rounded-[10px] border border-[rgba(20,25,35,0.12)] bg-white/60 px-3.5 text-[14px] font-[500] text-[#17202B]">
              <div className="flex items-center gap-2.5">
                <GraduationCap className="h-[18px] w-[18px] text-[#4A5565] stroke-[1.8]" />
                <span>B.Tech</span>
              </div>
              <ChevronDown className="h-4 w-4 text-[#8C95A0]" />
            </div>
          </div>

          {/* Field 2: Branch */}
          <div>
            <label className="mb-1.5 block font-mono-spec text-[11px] font-[600] uppercase tracking-[0.10em] text-[#717E8C]">
              BRANCH
            </label>
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="flex h-[48px] w-full items-center justify-between rounded-[10px] border border-[rgba(20,25,35,0.12)] bg-white/60 px-3.5 text-[14px] font-[500] text-[#17202B] transition hover:bg-white text-left"
            >
              <div className="flex items-center gap-2.5 overflow-hidden">
                <BookOpen className="h-[18px] w-[18px] text-[#4A5565] stroke-[1.8] shrink-0" />
                <span className="truncate">
                  {branchName || 'Select your branch'}
                </span>
              </div>
              <ChevronDown className="h-4 w-4 text-[#8C95A0] shrink-0" />
            </button>
          </div>

          {/* Field 3: Semester */}
          <div>
            <label className="mb-1.5 block font-mono-spec text-[11px] font-[600] uppercase tracking-[0.10em] text-[#717E8C]">
              SEMESTER
            </label>
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="flex h-[48px] w-full items-center justify-between rounded-[10px] border border-[rgba(20,25,35,0.12)] bg-white/60 px-3.5 text-[14px] font-[500] text-[#17202B] transition hover:bg-white text-left"
            >
              <div className="flex items-center gap-2.5">
                <Calendar className="h-[18px] w-[18px] text-[#4A5565] stroke-[1.8]" />
                <span>
                  {semesterNum ? `Semester ${semesterNum}` : 'Select semester'}
                </span>
              </div>
              <ChevronDown className="h-4 w-4 text-[#8C95A0]" />
            </button>
          </div>

        </div>

        {/* Primary Enter CTA Button */}
        <button
          type="button"
          onClick={handleEnter}
          className="mt-6 flex h-[48px] w-full items-center justify-center gap-2 rounded-[10px] bg-[#121922] text-[15px] font-[600] text-white shadow-sm transition hover:bg-black active:scale-[0.99]"
        >
          <span>Enter CampusNinja</span>
          <ArrowRight className="h-4 w-4 stroke-[2]" />
        </button>

        {/* Free Reassurance Text */}
        <div className="mt-4 flex items-center justify-center gap-1.5 text-[12.5px] font-[500] text-[#6E7B88]">
          <ShieldCheck className="h-4 w-4 text-[#35A47A] stroke-[2]" />
          <span>100% Free Forever</span>
        </div>

      </div>

      <BranchQuickSelectorModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </>
  );
};
