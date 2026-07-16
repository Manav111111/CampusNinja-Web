'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Check, ChevronDown } from 'lucide-react';
import { getBranches, getSemesters } from '@/services/supabase';
import { Branch, Semester } from '@/types';
import { useAcademic } from '@/contexts/AcademicContext';
import { useToast } from '@/contexts/ToastContext';

const fallbackBranches: Branch[] = [
  { id: 'b-cse', name: 'Computer Science & Engineering' },
  { id: 'b-it', name: 'Information Technology' },
  { id: 'b-ece', name: 'Electronics & Communication Engineering' },
  { id: 'b-mech', name: 'Mechanical Engineering' },
  { id: 'b-civil', name: 'Civil Engineering' },
  { id: 'b-ee', name: 'Electrical Engineering' },
];

const fallbackSemesters: Semester[] = Array.from({ length: 8 }, (_, index) => ({
  id: `s-${index + 1}`,
  branch_id: 'all',
  number: index + 1,
}));

export const HeroAcademicSelector: React.FC = () => {
  const router = useRouter();
  const { branchId, semesterId, updateAcademicSetup } = useAcademic();
  const { showToast } = useToast();
  const containerRef = useRef<HTMLDivElement>(null);

  const [branches, setBranches] = useState<Branch[]>(fallbackBranches);
  const [semesters, setSemesters] = useState<Semester[]>(fallbackSemesters);
  const [course, setCourse] = useState('B.Tech');
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [selectedSem, setSelectedSem] = useState<Semester | null>(null);
  const [openDropdown, setOpenDropdown] = useState<'course' | 'branch' | 'semester' | null>(null);

  useEffect(() => {
    getBranches()
      .then((data) => {
        if (data?.length) setBranches(data);
      })
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    if (!selectedBranch) return;
    if (selectedBranch.id.startsWith('b-')) {
      setSemesters(fallbackSemesters);
      return;
    }
    getSemesters(selectedBranch.id)
      .then((data) => setSemesters(data?.length ? data : fallbackSemesters))
      .catch(() => setSemesters(fallbackSemesters));
  }, [selectedBranch]);

  useEffect(() => {
    if (branchId && branches.length) {
      const found = branches.find((branch) => branch.id === branchId);
      if (found) setSelectedBranch(found);
    }
    if (semesterId && semesters.length) {
      const found = semesters.find((semester) => semester.id === semesterId);
      if (found) setSelectedSem(found);
    }
  }, [branchId, semesterId, branches, semesters]);

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
                setSelectedSem(null);
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