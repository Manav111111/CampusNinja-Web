'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Check, ChevronDown } from 'lucide-react';
import { getBranches, getSemesters } from '@/services/supabase';
import { Branch, Semester } from '@/types';
import { useAcademic } from '@/contexts/AcademicContext';
import { useToast } from '@/contexts/ToastContext';

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

export const HeroAcademicSelector: React.FC = () => {
  const router = useRouter();
  const { branchId, branchName, semesterId, semesterNum, updateAcademicSetup } = useAcademic();
  const { showToast } = useToast();
  const containerRef = useRef<HTMLDivElement>(null);

  const [branches, setBranches] = useState<Branch[]>(fallbackBranches);
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [course, setCourse] = useState('B.Tech');
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [selectedSem, setSelectedSem] = useState<Semester | null>(null);
  const [openDropdown, setOpenDropdown] = useState<'course' | 'branch' | 'semester' | null>(null);

  // Fetch branches from Supabase
  useEffect(() => {
    getBranches()
      .then((data) => {
        if (data?.length) setBranches(data);
      })
      .catch(() => undefined);
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
    getSemesters(selectedBranch.id)
      .then((data) => {
        if (!isMounted) return;
        const sems = data?.length ? data : [];
        setSemesters(sems);

        if (!sems.length) {
          setSelectedSem(null);
          return;
        }

        // Auto-select semester: prefer current semester number or context semesterNum or first semester
        const targetNum = selectedSem?.number || (semesterNum ? parseInt(semesterNum, 10) : 1);
        const matched = sems.find((s) => s.number === targetNum) || sems[0];
        setSelectedSem(matched);
      })
      .catch(() => {
        if (isMounted) setSemesters([]);
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

  const handleInitializeSession = () => {
    if (!selectedBranch || !selectedSem) {
      showToast({
        type: 'error',
        title: 'Selection required',
        message: 'Select your branch and semester to open a tailored study hub.',
      });
      return;
    }

    updateAcademicSetup(selectedBranch.id, selectedBranch.name, selectedSem.id, selectedSem.number.toString());
    showToast({
      type: 'success',
      title: 'Study hub configured',
      message: `${selectedBranch.name} / Semester ${selectedSem.number} is ready.`,
    });
    router.push('/subjects');
  };

  const courses = ['B.Tech'];
  const progress = [course, selectedBranch?.name, selectedSem ? `Sem ${selectedSem.number}` : null].filter(Boolean).length;

  return (
    <div ref={containerRef} className="spec-corners surface-card relative w-full rounded-lg p-5 text-left sm:p-7">
      <div className="mb-6 flex items-start justify-between gap-3">
        <div>
          <p className="font-mono-spec text-[11px] font-bold tracking-[0.1em] text-[var(--brand)]">FORM · CURRICULUM-01</p>
          <h2 className="font-display mt-2 text-2xl font-bold tracking-tight text-[var(--ink)]">Configure your study hub</h2>
          <p className="mt-1 text-sm text-[var(--muted)]">Three fields. That's the whole setup.</p>
        </div>
        <span className="font-mono-spec shrink-0 rounded-full border border-[var(--line-strong)] px-2.5 py-1 text-[11px] font-bold text-[var(--muted)]">
          {progress}/3
        </span>
      </div>

      <div className="grid gap-4">
        <Dropdown
          label="Course"
          value={course}
          open={openDropdown === 'course'}
          onOpen={() => setOpenDropdown(openDropdown === 'course' ? null : 'course')}
        >
          {courses.map((item) => (
            <DropdownItem key={item} selected={course === item} onClick={() => { setCourse(item); setOpenDropdown(null); }}>
              {item}
            </DropdownItem>
          ))}
        </Dropdown>

        <Dropdown
          label="Branch"
          value={selectedBranch?.name || 'Select branch'}
          muted={!selectedBranch}
          open={openDropdown === 'branch'}
          onOpen={() => setOpenDropdown(openDropdown === 'branch' ? null : 'branch')}
        >
          {branches.map((branch) => (
            <DropdownItem
              key={branch.id}
              selected={selectedBranch?.id === branch.id}
              onClick={() => {
                setSelectedBranch(branch);
                setOpenDropdown(null);
              }}
            >
              {branch.name}
            </DropdownItem>
          ))}
        </Dropdown>

        <Dropdown
          label="Semester"
          value={selectedSem ? `Semester ${selectedSem.number}` : 'Select semester'}
          muted={!selectedSem}
          open={openDropdown === 'semester'}
          onOpen={() => {
            if (!selectedBranch) {
              showToast({ type: 'info', title: 'Pick branch first', message: 'Semester options depend on your branch.' });
              return;
            }
            setOpenDropdown(openDropdown === 'semester' ? null : 'semester');
          }}
        >
          {semesters.map((semester) => (
            <DropdownItem
              key={semester.id}
              selected={selectedSem?.id === semester.id}
              onClick={() => {
                setSelectedSem(semester);
                setOpenDropdown(null);
              }}
            >
              Semester {semester.number}
            </DropdownItem>
          ))}
        </Dropdown>

        <button
          type="button"
          onClick={handleInitializeSession}
          className="primary-button focus-ring mt-2 flex h-[52px] items-center justify-center gap-2 rounded-md px-5 text-sm font-bold text-white transition duration-200 ease"
        >
          Open Study Hub
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

function Dropdown({
  label,
  value,
  muted,
  open,
  onOpen,
  children,
}: {
  label: string;
  value: string;
  muted?: boolean;
  open: boolean;
  onOpen: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <label className="mb-2 block font-mono-spec text-[10px] font-bold tracking-[0.1em] text-[var(--muted-2)]">{label.toUpperCase()}</label>
      <button
        type="button"
        onClick={onOpen}
        className="soft-input focus-ring flex h-[52px] w-full items-center justify-between gap-3 rounded-md border border-[var(--line)] px-4 text-left text-[15px] font-bold text-[var(--ink)] transition duration-200 ease hover:border-[var(--brand)]"
      >
        <span className={`truncate ${muted ? 'text-[var(--muted-2)]' : ''}`}>{value}</span>
        <ChevronDown className={`h-4 w-4 shrink-0 text-[var(--muted-2)] transition duration-200 ease ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="animate-soft-in absolute left-0 right-0 z-50 mt-2 max-h-72 overflow-y-auto rounded-md border border-[var(--line)] bg-white p-1.5 shadow-xl">
          {children}
        </div>
      )}
    </div>
  );
}

function DropdownItem({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-between rounded px-3 py-2.5 text-left text-sm font-medium text-[var(--muted)] transition duration-200 ease hover:bg-[var(--brand-50)] hover:text-[var(--brand)]"
    >
      <span>{children}</span>
      {selected && <Check className="h-4 w-4 text-[var(--brand)]" />}
    </button>
  );
}