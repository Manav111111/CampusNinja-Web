'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Check, CheckCircle2, ChevronDown, GraduationCap, Sparkles, BookOpen, Layers } from 'lucide-react';
import { useAcademic } from '@/contexts/AcademicContext';
import { useToast } from '@/contexts/ToastContext';
import { getBranches, getSemesters } from '@/services/supabase';
import { Branch, Semester } from '@/types';
import { Skeleton } from '@/components/common/Skeleton';

const fallbackBranches: Branch[] = [
  { id: '765cd1af-e85e-4312-b9b5-c7308a28ed84', name: 'Computer Science Engineering' },
  { id: 'bbeeda9b-4c51-41b1-85a0-7783c0eea999', name: 'Information Technology' },
  { id: '8e71adee-3752-4489-a46b-055eed8a534e', name: 'Artificial Intelligence and Machine Learning' },
  { id: '5f397ff9-1a9f-4584-924d-44ccf5bbebe4', name: 'Artificial Intelligence and Data Science' },
  { id: '933f3fce-3c07-4afd-9153-c8943165ecd0', name: 'Electronics and Communication Engineering' },
  { id: '1ea60456-3efd-4b86-bbec-148add0f14c1', name: 'Mechanical Engineering' },
  { id: '68e08958-2768-4472-9f97-4f7249dba26c', name: 'Civil Engineering' },
  { id: '8a4356cd-b6a0-40a9-a8a2-1fdb6c1f45af', name: 'Computer Science ' },
  { id: '684780f7-017c-4e9c-91d7-b0d4a1207391', name: 'Computer Science and Technology' },
];

export default function SetupPage() {
  const router = useRouter();
  const { branchId, branchName, semesterId, semesterNum, updateAcademicSetup } = useAcademic();
  const { showToast } = useToast();
  const containerRef = useRef<HTMLDivElement>(null);

  const [branches, setBranches] = useState<Branch[]>(fallbackBranches);
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [loadingBranches, setLoadingBranches] = useState(true);
  const [loadingSemesters, setLoadingSemesters] = useState(false);

  const [course, setCourse] = useState('B.Tech');
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [selectedSem, setSelectedSem] = useState<Semester | null>(null);
  const [openDropdown, setOpenDropdown] = useState<'course' | 'branch' | 'semester' | null>(null);

  // Fetch branches from Supabase
  useEffect(() => {
    getBranches()
      .then((data) => {
        if (data?.length) setBranches(data);
        setLoadingBranches(false);
      })
      .catch(() => setLoadingBranches(false));
  }, []);

  // Initialize selectedBranch on mount from context or fallback to first branch
  useEffect(() => {
    if (!branches.length) return;

    if (selectedBranch) {
      const match = branches.find((b) => b.id === selectedBranch.id);
      if (match && match !== selectedBranch) {
        setSelectedBranch(match);
      }
      return;
    }

    let initialBranch: Branch | undefined;
    if (branchId) {
      initialBranch = branches.find((b) => b.id === branchId);
    }
    if (!initialBranch && branchName) {
      const norm = branchName.toLowerCase().replace(/[^a-z0-9]/g, '');
      initialBranch = branches.find((b) => b.name.toLowerCase().replace(/[^a-z0-9]/g, '') === norm);
    }
    if (!initialBranch) {
      initialBranch = branches[0];
    }
    setSelectedBranch(initialBranch);
  }, [branches, branchId, branchName]);

  // Fetch semesters whenever selectedBranch changes and auto-select semester
  useEffect(() => {
    if (!selectedBranch?.id) return;

    let isMounted = true;
    setLoadingSemesters(true);
    getSemesters(selectedBranch.id)
      .then((data) => {
        if (!isMounted) return;
        const sems = data?.length ? data : [];
        setSemesters(sems);

        if (!sems.length) {
          setSelectedSem(null);
          setLoadingSemesters(false);
          return;
        }

        // Auto-select semester: prefer current semester number or context semesterNum or first semester
        const targetNum = selectedSem?.number || (semesterNum ? parseInt(semesterNum, 10) : 1);
        const matched = sems.find((s) => s.number === targetNum) || sems[0];
        setSelectedSem(matched);
        setLoadingSemesters(false);
      })
      .catch(() => {
        if (isMounted) {
          setSemesters([]);
          setLoadingSemesters(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [selectedBranch?.id]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSaveSetup = () => {
    if (!selectedBranch || !selectedSem) {
      showToast({
        type: 'error',
        title: 'Selection incomplete',
        message: 'Please select both your engineering branch and semester.',
      });
      return;
    }
    updateAcademicSetup(selectedBranch.id, selectedBranch.name, selectedSem.id, selectedSem.number.toString());
    showToast({
      type: 'success',
      title: 'Academic profile saved',
      message: `${selectedBranch.name} / Semester ${selectedSem.number} configured.`,
    });
    router.push('/subjects');
  };

  const courses = ['B.Tech'];

  return (
    <div className="page-shell animate-soft-in">
      <section className="surface-card rounded-3xl p-6 text-center sm:p-10">
        <p className="eyebrow mx-auto"><Sparkles className="h-3.5 w-3.5" /> Academic setup</p>
        <h1 className="mx-auto mt-4 max-w-3xl text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
          Select your curriculum
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600">
          Choose your course, branch, and semester below. CampusNinja uses this profile to curate tailored notes, PYQs, syllabus files, and recommendations.
        </p>
      </section>

      <div ref={containerRef} className="surface-card relative mx-auto max-w-4xl rounded-3xl p-6 sm:p-10">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1.5 rounded-t-3xl bg-gradient-to-r from-blue-600 via-sky-400 to-orange-300" />
        
        <div className="mb-8 flex items-center justify-between border-b border-slate-100 pb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-700 text-white shadow-[0_16px_30px_-20px_rgba(37,99,235,0.95)]">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-950">Curriculum Configuration</h2>
              <p className="text-sm text-slate-500">Click any field below to open the selection widget.</p>
            </div>
          </div>
          {selectedBranch && selectedSem && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 border border-emerald-200">
              <CheckCircle2 className="h-4 w-4" /> Ready to explore
            </span>
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <SetupDropdown
            step="1"
            label="Course"
            value={course}
            open={openDropdown === 'course'}
            onOpen={() => setOpenDropdown(openDropdown === 'course' ? null : 'course')}
          >
            {courses.map((item) => (
              <SetupDropdownItem
                key={item}
                selected={course === item}
                onClick={() => {
                  setCourse(item);
                  setOpenDropdown(null);
                }}
              >
                {item}
              </SetupDropdownItem>
            ))}
          </SetupDropdown>

          <SetupDropdown
            step="2"
            label="Branch"
            value={selectedBranch?.name || 'Select branch'}
            muted={!selectedBranch}
            open={openDropdown === 'branch'}
            onOpen={() => setOpenDropdown(openDropdown === 'branch' ? null : 'branch')}
            loading={loadingBranches}
          >
            {branches.map((branch) => (
              <SetupDropdownItem
                key={branch.id}
                selected={selectedBranch?.id === branch.id}
                onClick={() => {
                  setSelectedBranch(branch);
                  setOpenDropdown(null);
                }}
              >
                {branch.name}
              </SetupDropdownItem>
            ))}
          </SetupDropdown>

          <SetupDropdown
            step="3"
            label="Semester"
            value={selectedSem ? `Semester ${selectedSem.number}` : 'Select semester'}
            muted={!selectedSem}
            open={openDropdown === 'semester'}
            onOpen={() => {
              if (!selectedBranch) {
                showToast({
                  type: 'info',
                  title: 'Select branch first',
                  message: 'Please pick your engineering branch before selecting a semester.',
                });
                return;
              }
              setOpenDropdown(openDropdown === 'semester' ? null : 'semester');
            }}
            loading={loadingSemesters}
          >
            {semesters.map((semester) => (
              <SetupDropdownItem
                key={semester.id}
                selected={selectedSem?.id === semester.id}
                onClick={() => {
                  setSelectedSem(semester);
                  setOpenDropdown(null);
                }}
              >
                Semester {semester.number}
              </SetupDropdownItem>
            ))}
          </SetupDropdown>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-slate-100 pt-6 sm:flex-row">
          <div className="text-sm text-slate-600">
            {selectedBranch && selectedSem ? (
              <span>Selected: <strong className="text-slate-950">{selectedBranch.name}</strong> &bull; <strong className="text-blue-600">Semester {selectedSem.number}</strong></span>
            ) : (
              <span>Please complete all three selections to proceed.</span>
            )}
          </div>

          <button
            type="button"
            onClick={handleSaveSetup}
            disabled={!selectedBranch || !selectedSem}
            className={`inline-flex h-14 items-center justify-center gap-3 rounded-2xl px-8 text-base font-black shadow-lg transition duration-250 ease-out ${
              selectedBranch && selectedSem
                ? 'bg-blue-600 text-white hover:-translate-y-0.5 hover:bg-blue-700 shadow-blue-500/25'
                : 'cursor-not-allowed bg-slate-200 text-slate-400 shadow-none'
            }`}
          >
            Save and open study hub
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

function SetupDropdown({
  step,
  label,
  value,
  muted,
  open,
  onOpen,
  loading,
  children,
}: {
  step: string;
  label: string;
  value: string;
  muted?: boolean;
  open: boolean;
  onOpen: () => void;
  loading?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <div className="mb-2 flex items-center gap-2">
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-xs font-black text-blue-700">
          {step}
        </span>
        <label className="block text-xs font-black uppercase tracking-[0.08em] text-slate-500">{label}</label>
      </div>
      <button
        type="button"
        onClick={onOpen}
        className="soft-input focus-ring flex h-14 w-full items-center justify-between gap-3 rounded-2xl border px-4 text-left text-sm font-bold text-slate-950 transition hover:border-blue-300 hover:bg-blue-50/30"
      >
        <span className={`truncate ${muted ? 'text-slate-400 font-medium' : ''}`}>{value}</span>
        <ChevronDown className={`h-4 w-4 shrink-0 text-slate-400 transition duration-250 ${open ? 'rotate-180 text-blue-600' : ''}`} />
      </button>
      {open && (
        <div className="animate-soft-in absolute left-0 right-0 z-50 mt-2 max-h-72 overflow-y-auto rounded-2xl border border-blue-100 bg-white p-2 shadow-[0_24px_60px_-24px_rgba(15,23,42,0.65)]">
          {loading ? (
            <div className="space-y-2 p-1">
              <Skeleton className="h-10 w-full rounded-xl" />
              <Skeleton className="h-10 w-full rounded-xl" />
            </div>
          ) : (
            children
          )}
        </div>
      )}
    </div>
  );
}

function SetupDropdownItem({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center justify-between rounded-xl px-3.5 py-3 text-left text-sm font-semibold transition duration-200 ease-out ${
        selected ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-700 hover:bg-slate-50 hover:text-blue-600'
      }`}
    >
      <span className="truncate pr-2">{children}</span>
      {selected && <Check className="h-4 w-4 shrink-0 text-blue-600" />}
    </button>
  );
}
