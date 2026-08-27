'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  ArrowRight, 
  ArrowUpRight, 
  Check, 
  CheckCircle2, 
  GraduationCap, 
  GitBranch, 
  Calendar, 
  Code2, 
  Cpu, 
  Radio, 
  Zap, 
  Cog, 
  Building2, 
  Plane, 
  Brain, 
  BookOpen, 
  Layers, 
  Sparkles, 
  HelpCircle,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { useAcademic } from '@/contexts/AcademicContext';
import { useToast } from '@/contexts/ToastContext';
import { getBranches, getSemesters } from '@/services/supabase';
import { Branch, Semester } from '@/types';

// Helper to map branch name to clean technical icon
const getBranchIcon = (name: string) => {
  const n = (name || '').toLowerCase();
  if (n.includes('artificial') || n.includes('ai') || n.includes('data science') || n.includes('machine learning')) {
    return <Brain className="h-5 w-5 stroke-[1.6]" />;
  }
  if (n.includes('computer') || n.includes('cse') || n.includes('software')) {
    return <Code2 className="h-5 w-5 stroke-[1.6]" />;
  }
  if (n.includes('information') || n.includes('it')) {
    return <Cpu className="h-5 w-5 stroke-[1.6]" />;
  }
  if (n.includes('electronic') || n.includes('ece') || n.includes('communication')) {
    return <Radio className="h-5 w-5 stroke-[1.6]" />;
  }
  if (n.includes('electrical') || n.includes('eee')) {
    return <Zap className="h-5 w-5 stroke-[1.6]" />;
  }
  if (n.includes('mechanical')) {
    return <Cog className="h-5 w-5 stroke-[1.6]" />;
  }
  if (n.includes('civil') || n.includes('construction')) {
    return <Building2 className="h-5 w-5 stroke-[1.6]" />;
  }
  if (n.includes('aero') || n.includes('aviation')) {
    return <Plane className="h-5 w-5 stroke-[1.6]" />;
  }
  return <BookOpen className="h-5 w-5 stroke-[1.6]" />;
};

export default function SetupPage() {
  const router = useRouter();
  const { branchId, branchName, semesterId, semesterNum, updateAcademicSetup } = useAcademic();
  const { showToast } = useToast();
  const semesterSectionRef = useRef<HTMLDivElement>(null);

  const [branches, setBranches] = useState<Branch[]>([]);
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [loadingBranches, setLoadingBranches] = useState(true);
  const [loadingSemesters, setLoadingSemesters] = useState(false);
  const [branchesError, setBranchesError] = useState<string | null>(null);

  const [course, setCourse] = useState('B.Tech');
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [selectedSem, setSelectedSem] = useState<Semester | null>(null);

  // Load branches dynamically from Supabase
  const fetchBranchesList = async () => {
    try {
      setLoadingBranches(true);
      setBranchesError(null);
      const data = await getBranches();
      if (data && data.length > 0) {
        setBranches(data);
      } else {
        setBranches([]);
      }
    } catch (err: any) {
      console.error('Error fetching branches:', err);
      setBranchesError('Unable to load engineering branches. Please check your connection.');
    } finally {
      setLoadingBranches(false);
    }
  };

  useEffect(() => {
    fetchBranchesList();
  }, []);

  // Initialize selectedBranch on mount from context
  useEffect(() => {
    if (!branches.length) return;

    if (selectedBranch) {
      const match = branches.find((b) => b.id === selectedBranch.id);
      if (match && match !== selectedBranch) {
        setSelectedBranch(match);
      }
      return;
    }

    if (branchId) {
      const match = branches.find((b) => b.id === branchId);
      if (match) {
        setSelectedBranch(match);
        return;
      }
    }

    if (branchName) {
      const norm = branchName.toLowerCase().replace(/[^a-z0-9]/g, '');
      const match = branches.find((b) => b.name.toLowerCase().replace(/[^a-z0-9]/g, '') === norm);
      if (match) {
        setSelectedBranch(match);
      }
    }
  }, [branches, branchId, branchName]);

  // Fetch semesters dynamically when selectedBranch changes
  useEffect(() => {
    if (!selectedBranch?.id) {
      setSemesters([]);
      setSelectedSem(null);
      return;
    }

    let isMounted = true;
    setLoadingSemesters(true);
    getSemesters(selectedBranch.id)
      .then((data) => {
        if (!isMounted) return;
        const sems = data?.length ? data : [];
        setSemesters(sems);

        // Retain current semester selection or auto-select from context
        if (sems.length > 0) {
          const targetNum = selectedSem?.number || (semesterNum ? parseInt(semesterNum, 10) : null);
          if (targetNum) {
            const matched = sems.find((s) => s.number === targetNum);
            if (matched) setSelectedSem(matched);
          }
        } else {
          setSelectedSem(null);
        }
      })
      .catch((err) => {
        console.error('Error fetching semesters:', err);
        if (isMounted) setSemesters([]);
      })
      .finally(() => {
        if (isMounted) setLoadingSemesters(false);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedBranch?.id]);

  const handleBranchSelect = (branch: Branch) => {
    setSelectedBranch(branch);
    // Smooth scroll to semester section on user interaction
    setTimeout(() => {
      semesterSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 150);
  };

  const handleSemesterSelect = (sem: Semester) => {
    setSelectedSem(sem);
  };

  const handleSaveSetup = () => {
    if (!selectedBranch || !selectedSem) {
      showToast({
        type: 'error',
        title: 'Selection incomplete',
        message: 'Please select both your engineering branch and current semester.',
      });
      return;
    }

    updateAcademicSetup(
      selectedBranch.id, 
      selectedBranch.name, 
      selectedSem.id, 
      selectedSem.number.toString()
    );

    showToast({
      type: 'success',
      title: 'Academic profile saved',
      message: `${selectedBranch.name} · Semester ${selectedSem.number} configured.`,
    });

    router.push('/subjects');
  };

  // Determine current active step
  const currentStep = !selectedBranch ? 2 : !selectedSem ? 3 : 3;

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-hidden bg-[#F7F7F5] text-[#151B24] antialiased">
      
      {/* ── BACKGROUND ATMOSPHERE & TECHNICAL BLUEPRINT LINES ── */}
      <div 
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          backgroundImage: `
            radial-gradient(circle at 50% 15%, rgba(255,255,255,0.7) 0%, transparent 40%),
            linear-gradient(180deg, #F8F8F6 0%, #F5F5F2 100%)
          `
        }}
      />

      {/* Decorative Technical Vector Geometry */}
      <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-40" viewBox="0 0 1440 900" fill="none">
        {/* Upper Circuit Connectors */}
        <path d="M 0 280 L 140 280 L 220 340 L 520 340" stroke="rgba(20,25,32,0.06)" strokeWidth="1" strokeDasharray="4 4" />
        <circle cx="220" cy="340" r="3" fill="#151B24" opacity="0.25" />
        <circle cx="520" cy="340" r="3" fill="#151B24" opacity="0.25" />

        <path d="M 920 340 L 1220 340 L 1300 280 L 1440 280" stroke="rgba(20,25,32,0.06)" strokeWidth="1" strokeDasharray="4 4" />
        <circle cx="920" cy="340" r="3" fill="#151B24" opacity="0.25" />
        <circle cx="1220" cy="340" r="3" fill="#151B24" opacity="0.25" />

        {/* Lower Corner Accents */}
        <path d="M 0 740 L 120 740 L 180 820 L 400 820" stroke="rgba(20,25,32,0.05)" strokeWidth="1" />
        <circle cx="180" cy="820" r="2.5" fill="#151B24" opacity="0.2" />

        <path d="M 1040 820 L 1260 820 L 1320 740 L 1440 740" stroke="rgba(20,25,32,0.05)" strokeWidth="1" />
        <circle cx="1260" cy="820" r="2.5" fill="#151B24" opacity="0.2" />
      </svg>

      {/* ── MAIN CONTAINER ── */}
      <div className="mx-auto w-full max-w-[1380px] px-4 sm:px-8 lg:px-12 pt-4 sm:pt-6 lg:pt-8 pb-14 sm:pb-20">
        
        {/* ── TOP BACK NAVIGATION ── */}
        <div className="mb-4 sm:mb-6 flex items-center justify-between">
          <Link 
            href="/subjects" 
            className="group inline-flex items-center gap-2 text-[13px] sm:text-[13.5px] font-[500] text-[#55606E] transition-colors hover:text-[#151B24]"
          >
            <ArrowLeft className="h-4 w-4 stroke-[1.8] transition-transform duration-200 group-hover:-translate-x-1" />
            <span>Back to Courses</span>
          </Link>
        </div>

        {/* ── HERO & STEP INDICATOR SECTION ── */}
        <div className="relative mb-6 sm:mb-10 grid items-center gap-6 sm:gap-8 lg:grid-cols-[1.3fr_auto_1fr]">
          
          {/* Left: Main Heading & Eyebrow */}
          <div className="flex flex-col items-start">
            {/* Technical Eyebrow */}
            <div className="flex items-center gap-3 mb-2 sm:mb-2.5">
              <span className="font-mono text-[10.5px] sm:text-[11px] font-[600] uppercase tracking-[0.20em] sm:tracking-[0.22em] text-[#717E8C]">
                01 &nbsp;—&nbsp; ACADEMIC SETUP &nbsp;·&nbsp; STEP {currentStep} OF 3
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-[30px] sm:text-[44px] lg:text-[50px] font-[650] leading-[1.08] tracking-[-0.04em] text-[#151B24]">
              Select your branch
            </h1>

            {/* Description */}
            <p className="mt-2.5 sm:mt-3.5 max-w-[540px] text-[14.5px] sm:text-[16px] font-[400] leading-[1.6] text-[#55606E]">
              Choose your branch to get subjects, notes, PYQs, syllabus and resources tailored for you.
            </p>
          </div>

          {/* Center: Futuristic Hexagonal Academic Emblem */}
          <div className="hidden lg:flex items-center justify-center">
            <div className="relative flex items-center justify-center">
              {/* Surrounding Concentric Circuit Ring */}
              <div 
                className="absolute h-[150px] w-[150px] rounded-full border border-[rgba(20,25,32,0.06)] opacity-70 pointer-events-none" 
              />
              <div 
                className="absolute h-[190px] w-[190px] rounded-full border border-dashed border-[rgba(20,25,32,0.05)] pointer-events-none" 
              />
              
              {/* Center Hexagonal Badge */}
              <div 
                className="flex h-[100px] w-[100px] items-center justify-center border border-[rgba(20,25,32,0.12)] bg-white/80 backdrop-blur-xs shadow-sm transition-transform duration-300 hover:scale-105"
                style={{
                  clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                }}
              >
                <GraduationCap className="h-10 w-10 stroke-[1.4] text-[#151B24]" />
              </div>
            </div>
          </div>

          {/* Right: Step Progress Indicator */}
          <div className="flex items-center justify-start lg:justify-end">
            <div className="flex items-center gap-3 sm:gap-4">
              
              {/* Step 1: Course (Completed) */}
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#E5E7EB] text-[#151B24]">
                  <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                </div>
                <span className="text-[13px] font-[600] text-[#151B24]">Course</span>
              </div>

              {/* Connecting Line 1 */}
              <div className="h-[1px] w-6 sm:w-10 bg-[#D1D5DB]" />

              {/* Step 2: Branch (Active) */}
              <div className="flex items-center gap-2">
                <div className={`flex h-7 w-7 items-center justify-center rounded-full font-mono text-[12px] font-[700] transition-colors ${
                  selectedBranch ? 'bg-[#151B24] text-white' : 'bg-[#151B24] text-white shadow-xs'
                }`}>
                  {selectedBranch ? <Check className="h-3.5 w-3.5 stroke-[2.5]" /> : '2'}
                </div>
                <span className="text-[13px] font-[600] text-[#151B24]">Branch</span>
              </div>

              {/* Connecting Line 2 */}
              <div className="h-[1px] w-6 sm:w-10 bg-[#D1D5DB]" />

              {/* Step 3: Semester */}
              <div className="flex items-center gap-2">
                <div className={`flex h-7 w-7 items-center justify-center rounded-full font-mono text-[12px] font-[700] transition-colors ${
                  selectedSem ? 'bg-[#151B24] text-white' : 'border border-[#D1D5DB] bg-white/60 text-[#717E8C]'
                }`}>
                  {selectedSem ? <Check className="h-3.5 w-3.5 stroke-[2.5]" /> : '3'}
                </div>
                <span className={`text-[13px] font-[500] ${selectedSem ? 'font-[600] text-[#151B24]' : 'text-[#717E8C]'}`}>
                  Semester
                </span>
              </div>

            </div>
          </div>

        </div>

        {/* ── 3-STAGE ACADEMIC SELECTION STRIP ── */}
        <div className="mb-12 rounded-[20px] border border-[rgba(20,25,32,0.10)] bg-white/75 p-5 sm:p-6 shadow-2xs backdrop-blur-xs">
          <div className="grid gap-6 md:grid-cols-3 md:divide-x md:divide-[rgba(20,25,32,0.08)]">
            
            {/* Stage 1: COURSE */}
            <div className="flex items-center justify-between pr-0 md:pr-6">
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#151B24] text-white shadow-2xs">
                  <GraduationCap className="h-5 w-5 stroke-[1.8]" />
                </div>
                <div>
                  <span className="font-mono text-[10px] font-[600] uppercase tracking-[0.16em] text-[#717E8C]">
                    COURSE
                  </span>
                  <h3 className="text-[16px] font-[650] text-[#151B24]">
                    {course}
                  </h3>
                  <p className="text-[12px] text-[#717E8C]">
                    Bachelor of Technology
                  </p>
                </div>
              </div>
              <Check className="h-4 w-4 stroke-[2.5] text-emerald-600 shrink-0" />
            </div>

            {/* Stage 2: BRANCH */}
            <div className="flex items-center justify-between px-0 md:px-6">
              <div className="flex items-center gap-4 overflow-hidden pr-2">
                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors ${
                  selectedBranch ? 'bg-[#151B24] text-white shadow-2xs' : 'bg-[#151B24] text-white'
                }`}>
                  <GitBranch className="h-5 w-5 stroke-[1.8]" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="font-mono text-[10px] font-[600] uppercase tracking-[0.16em] text-[#717E8C]">
                    BRANCH
                  </span>
                  <h3 className="text-[16px] font-[650] text-[#151B24] truncate">
                    {selectedBranch ? selectedBranch.name : 'Select your branch'}
                  </h3>
                  <p className="text-[12px] text-[#717E8C] truncate">
                    {selectedBranch ? 'Specialization chosen' : 'Choose your specialization'}
                  </p>
                </div>
              </div>
              <ArrowRight className={`h-4 w-4 shrink-0 transition-colors ${
                selectedBranch ? 'text-[#151B24]' : 'text-[#9AA5B1]'
              }`} />
            </div>

            {/* Stage 3: SEMESTER */}
            <div className="flex items-center justify-between pl-0 md:pl-6">
              <div className="flex items-center gap-4 overflow-hidden pr-2">
                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors ${
                  selectedSem 
                    ? 'bg-[#151B24] text-white shadow-2xs' 
                    : selectedBranch 
                      ? 'bg-[#151B24]/90 text-white' 
                      : 'bg-slate-200 text-slate-400'
                }`}>
                  <Calendar className="h-5 w-5 stroke-[1.8]" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="font-mono text-[10px] font-[600] uppercase tracking-[0.16em] text-[#717E8C]">
                    SEMESTER
                  </span>
                  <h3 className={`text-[16px] font-[650] truncate ${
                    selectedSem ? 'text-[#151B24]' : selectedBranch ? 'text-[#151B24]' : 'text-slate-400'
                  }`}>
                    {selectedSem 
                      ? `Semester ${selectedSem.number}` 
                      : selectedBranch 
                        ? 'Select semester' 
                        : 'Select branch first'}
                  </h3>
                  <p className="text-[12px] text-[#717E8C] truncate">
                    {selectedSem 
                      ? 'Current academic term' 
                      : selectedBranch 
                        ? 'Pick your current semester' 
                        : 'Pick branch to unlock'}
                  </p>
                </div>
              </div>
              <ArrowRight className={`h-4 w-4 shrink-0 transition-colors ${
                selectedSem ? 'text-emerald-600' : selectedBranch ? 'text-[#151B24]' : 'text-slate-300'
              }`} />
            </div>

          </div>
        </div>

        {/* ── SECTION HEADER: AVAILABLE BRANCHES ── */}
        <div className="mb-6 flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#151B24]" />
            <h2 className="font-mono text-[11.5px] font-[650] uppercase tracking-[0.16em] text-[#151B24]">
              AVAILABLE BRANCHES
            </h2>
          </div>
          <div className="h-[1px] flex-1 bg-[rgba(20,25,32,0.08)]" />
        </div>

        {/* ── BRANCH CARDS GRID (DYNAMIC FROM SUPABASE) ── */}
        {loadingBranches ? (
          /* Skeletons */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-14">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div 
                key={n} 
                className="h-[145px] rounded-[16px] border border-[rgba(20,25,32,0.08)] bg-white/50 p-5 animate-pulse flex flex-col justify-between"
              >
                <div className="h-3.5 w-6 bg-slate-200 rounded" />
                <div className="flex items-center gap-3.5">
                  <div className="h-10 w-10 rounded-xl bg-slate-200 shrink-0" />
                  <div className="h-4 flex-1 bg-slate-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : branchesError ? (
          /* Error State */
          <div className="mb-14 flex flex-col items-center justify-center rounded-2xl border border-rose-200 bg-rose-50/70 p-8 text-center">
            <AlertCircle className="h-8 w-8 text-rose-600 mb-2" />
            <p className="text-sm font-semibold text-rose-900">{branchesError}</p>
            <button
              onClick={fetchBranchesList}
              className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#151B24] text-xs font-semibold text-white hover:bg-black transition"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Retry</span>
            </button>
          </div>
        ) : branches.length === 0 ? (
          /* Empty State */
          <div className="mb-14 flex flex-col items-center justify-center rounded-2xl border border-[rgba(20,25,32,0.10)] bg-white/60 p-12 text-center">
            <BookOpen className="h-10 w-10 text-slate-400 mb-3" />
            <h3 className="text-base font-bold text-[#151B24]">No branches available yet</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm">
              There are currently no branches configured for {course}. Please check back later.
            </p>
          </div>
        ) : (
          /* Real Dynamic Branch Cards Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-14">
            {branches.map((branch, idx) => {
              const isSelected = selectedBranch?.id === branch.id;
              const indexStr = String(idx + 1).padStart(2, '0');

              return (
                <button
                  key={branch.id}
                  type="button"
                  onClick={() => handleBranchSelect(branch)}
                  className={`group relative flex h-[145px] sm:h-[155px] w-full flex-col justify-between p-5 text-left rounded-[16px] border transition-all duration-200 ${
                    isSelected
                      ? 'border-[#151B24] bg-white ring-1.5 ring-[#151B24] shadow-sm'
                      : 'border-[rgba(20,25,32,0.10)] bg-white/70 hover:border-[rgba(20,25,32,0.22)] hover:bg-white hover:-translate-y-0.5 hover:shadow-2xs'
                  }`}
                  style={{
                    clipPath: 'polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))',
                  }}
                >
                  {/* Top Row: Index & Mounting Accent */}
                  <div className="flex items-center justify-between w-full">
                    <span className="font-mono text-[11.5px] font-[600] text-[#717E8C]">
                      {indexStr}
                    </span>
                    {/* Tiny Chamfer Cut Accent Notch */}
                    <span className={`h-1.5 w-1.5 rounded-full transition-colors ${
                      isSelected ? 'bg-[#151B24]' : 'bg-[rgba(20,25,32,0.15)] group-hover:bg-[#151B24]/40'
                    }`} />
                  </div>

                  {/* Bottom Content: Icon, Branch Name, Arrow */}
                  <div className="flex items-center gap-3 w-full">
                    {/* Outline Icon Box */}
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition-colors ${
                      isSelected
                        ? 'border-[#151B24] bg-[#151B24] text-white shadow-xs'
                        : 'border-[rgba(20,25,32,0.12)] bg-slate-50/70 text-[#151B24] group-hover:border-[#151B24]/30 group-hover:bg-white'
                    }`}>
                      {getBranchIcon(branch.name)}
                    </div>

                    {/* Branch Title */}
                    <span className="text-[14.5px] sm:text-[15.5px] font-[600] text-[#151B24] leading-snug flex-1 line-clamp-2">
                      {branch.name}
                    </span>

                    {/* Arrow Indicator */}
                    <ArrowRight className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
                      isSelected 
                        ? 'text-[#151B24] translate-x-0.5' 
                        : 'text-[#9AA5B1] group-hover:text-[#151B24] group-hover:translate-x-1'
                    }`} />
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* ── STEP 2: DYNAMIC SEMESTER SELECTION SECTION ── */}
        <div ref={semesterSectionRef} className="scroll-mt-6">
          {selectedBranch && (
            <div className="mb-14 animate-soft-in">
              {/* Section Header */}
              <div className="mb-4 flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#151B24]" />
                  <h2 className="font-mono text-[11.5px] font-[650] uppercase tracking-[0.16em] text-[#151B24]">
                    02 &nbsp;—&nbsp; CHOOSE YOUR SEMESTER
                  </h2>
                </div>
                <div className="h-[1px] flex-1 bg-[rgba(20,25,32,0.08)]" />
              </div>

              {/* Semester Heading */}
              <div className="mb-6">
                <h2 className="text-[26px] sm:text-[32px] font-[650] tracking-[-0.035em] text-[#151B24]">
                  Which semester are you in?
                </h2>
                <p className="text-[14.5px] text-[#55606E] mt-1">
                  Select your current semester for <strong className="text-[#151B24]">{selectedBranch.name}</strong> to personalize your subjects and notes.
                </p>
              </div>

              {/* Semester Cards Grid */}
              {loadingSemesters ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                    <div key={n} className="h-24 rounded-xl border border-[rgba(20,25,32,0.08)] bg-white/50 animate-pulse" />
                  ))}
                </div>
              ) : semesters.length === 0 ? (
                <div className="rounded-xl border border-[rgba(20,25,32,0.10)] bg-white/60 p-6 text-center text-sm text-slate-500">
                  No semesters found for this branch.
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
                  {semesters.map((sem, idx) => {
                    const isSelected = selectedSem?.id === sem.id || selectedSem?.number === sem.number;
                    const semIndexStr = String(sem.number).padStart(2, '0');

                    return (
                      <button
                        key={sem.id || idx}
                        type="button"
                        onClick={() => handleSemesterSelect(sem)}
                        className={`group relative flex h-[100px] flex-col justify-between p-3.5 rounded-[14px] border text-left transition-all duration-200 ${
                          isSelected
                            ? 'border-[#151B24] bg-white ring-1.5 ring-[#151B24] shadow-sm -translate-y-0.5'
                            : 'border-[rgba(20,25,32,0.10)] bg-white/70 hover:border-[#151B24]/30 hover:bg-white hover:-translate-y-0.5'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="font-mono text-[10px] font-bold text-[#717E8C]">
                            {semIndexStr}
                          </span>
                          {isSelected && (
                            <Check className="h-3 w-3 stroke-[2.5] text-[#151B24]" />
                          )}
                        </div>

                        <div className="flex items-center justify-between w-full">
                          <span className="text-[13.5px] font-[650] text-[#151B24]">
                            Semester {sem.number}
                          </span>
                          <ArrowRight className={`h-3.5 w-3.5 transition-transform ${
                            isSelected ? 'text-[#151B24]' : 'text-slate-400 group-hover:translate-x-0.5'
                          }`} />
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── BOTTOM CONFIRMATION / PROCEED STRIP ── */}
        {selectedBranch && selectedSem && (
          <div className="mb-10 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-[20px] border border-[#151B24] bg-[#151B24] p-5 sm:p-6 text-white shadow-xl animate-soft-in">
            <div className="flex items-center gap-3.5 text-center sm:text-left">
              <div className="hidden sm:flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <span className="font-mono text-[10px] font-[600] uppercase tracking-[0.16em] text-white/70 block">
                  SELECTED ACADEMIC PROFILE
                </span>
                <p className="text-[15.5px] font-[600] text-white mt-0.5">
                  {course} &nbsp;·&nbsp; {selectedBranch.name} &nbsp;·&nbsp; Semester {selectedSem.number}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSaveSetup}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-white px-6 text-sm font-[650] text-[#151B24] shadow-sm transition hover:bg-slate-100 active:scale-[0.98] shrink-0 w-full sm:w-auto"
            >
              <span>Save & Open Study Hub</span>
              <ArrowRight className="h-4 w-4 stroke-[2]" />
            </button>
          </div>
        )}

        {/* ── BOTTOM REFERENCE HELP STRIP ── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-[20px] border border-[rgba(20,25,32,0.10)] bg-white/80 p-4 sm:p-5 shadow-2xs backdrop-blur-xs">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            {/* Dark Hexagonal Question Icon Box */}
            <div 
              className="flex h-12 w-12 shrink-0 items-center justify-center bg-[#151B24] text-white shadow-xs"
              style={{
                clipPath: 'polygon(30% 0, 100% 0, 100% 100%, 0 100%, 0 30%)',
                borderRadius: '8px',
              }}
            >
              <HelpCircle className="h-5 w-5 stroke-[1.8]" />
            </div>
            <div>
              <h4 className="text-[14.5px] font-[650] text-[#151B24]">
                Not sure which branch to choose?
              </h4>
              <p className="text-[12.5px] text-[#717E8C]">
                Check out all subjects and syllabus before selecting.
              </p>
            </div>
          </div>

          <Link
            href="/subjects"
            className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl bg-[#151B24] px-5 text-[13px] font-[600] text-white transition hover:bg-black active:scale-[0.98] w-full sm:w-auto shrink-0 shadow-2xs"
          >
            <span>View All Subjects</span>
            <ArrowUpRight className="h-3.5 w-3.5 stroke-[2]" />
          </Link>
        </div>

      </div>

    </div>
  );
}
