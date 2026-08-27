'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, Check, ArrowRight, GraduationCap, Sparkles } from 'lucide-react';
import { useAcademic } from '@/contexts/AcademicContext';
import { useToast } from '@/contexts/ToastContext';
import { getBranches, getSemesters } from '@/services/supabase';
import { Branch, Semester } from '@/types';

const defaultBranches: Branch[] = [
  { id: '765cd1af-e85e-4312-b9b5-c7308a28ed84', name: 'Computer Science Engineering' },
  { id: 'bbeeda9b-4c51-41b1-85a0-7783c0eea999', name: 'Information Technology' },
  { id: '8e71adee-3752-4489-a46b-055eed8a534e', name: 'Artificial Intelligence & ML' },
  { id: '5f397ff9-1a9f-4584-924d-44ccf5bbebe4', name: 'Artificial Intelligence & Data Science' },
  { id: '933f3fce-3c07-4afd-9153-c8943165ecd0', name: 'Electronics & Communication' },
  { id: '1ea60456-3efd-4b86-bbec-148add0f14c1', name: 'Mechanical Engineering' },
  { id: '68e08958-2768-4472-9f97-4f7249dba26c', name: 'Civil Engineering' },
  { id: '8a4356cd-b6a0-40a9-a8a2-1fdb6c1f45af', name: 'Computer Science' },
];

interface BranchQuickSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BranchQuickSelectorModal: React.FC<BranchQuickSelectorModalProps> = ({
  isOpen,
  onClose,
}) => {
  const router = useRouter();
  const { branchId, branchName, semesterId, semesterNum, updateAcademicSetup } = useAcademic();
  const { showToast } = useToast();

  const [branches, setBranches] = useState<Branch[]>(defaultBranches);
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<Branch>(defaultBranches[0]);
  const [selectedSemNumber, setSelectedSemNumber] = useState<number>(1);
  const [loading, setLoading] = useState(false);

  // Fetch branches from Supabase
  useEffect(() => {
    getBranches()
      .then((data) => {
        if (data?.length) setBranches(data);
      })
      .catch(() => {});
  }, []);

  // Sync initial selection with context
  useEffect(() => {
    if (branchId && branches.length) {
      const match = branches.find((b) => b.id === branchId);
      if (match) setSelectedBranch(match);
    }
    if (semesterNum) {
      const num = parseInt(semesterNum, 10);
      if (!isNaN(num)) setSelectedSemNumber(num);
    }
  }, [branchId, semesterNum, branches]);

  // Fetch semesters when branch changes
  useEffect(() => {
    if (!selectedBranch?.id) return;
    setLoading(true);
    getSemesters(selectedBranch.id)
      .then((data) => {
        setSemesters(data || []);
        setLoading(false);
      })
      .catch(() => {
        setSemesters([]);
        setLoading(false);
      });
  }, [selectedBranch]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    const matchedSem = semesters.find((s) => s.number === selectedSemNumber) || semesters[0];
    const semIdToUse = matchedSem?.id || `sem-${selectedSemNumber}`;
    const semNumToUse = (matchedSem?.number || selectedSemNumber).toString();

    updateAcademicSetup(selectedBranch.id, selectedBranch.name, semIdToUse, semNumToUse);
    showToast({
      type: 'success',
      title: 'Branch selected',
      message: `Switched to ${selectedBranch.name} • Semester ${semNumToUse}`,
    });
    onClose();
    router.push('/subjects');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />

      {/* Modal Card */}
      <div className="relative z-10 w-full max-w-xl overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl transition-all sm:p-8 animate-soft-in">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-white">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight text-slate-950">Select Your Branch</h2>
              <p className="text-xs text-slate-500 font-medium">B.Tech Engineering Study Hub</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* 1. Branch Selector */}
        <div className="mt-5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
            1. Choose Engineering Branch
          </label>
          <div className="mt-2.5 grid grid-cols-1 gap-2 sm:grid-cols-2 max-h-56 overflow-y-auto pr-1">
            {branches.map((branch) => {
              const isSelected = selectedBranch.id === branch.id;
              return (
                <button
                  key={branch.id}
                  type="button"
                  onClick={() => setSelectedBranch(branch)}
                  className={`flex items-center justify-between rounded-xl border p-3 text-left text-xs font-bold transition-all ${
                    isSelected
                      ? 'border-slate-950 bg-slate-950 text-white shadow-sm'
                      : 'border-slate-200 bg-slate-50/50 text-slate-700 hover:border-slate-300 hover:bg-white'
                  }`}
                >
                  <span className="truncate pr-2">{branch.name}</span>
                  {isSelected && <Check className="h-4 w-4 shrink-0 text-white" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Semester Selector */}
        <div className="mt-6">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
            2. Choose Semester
          </label>
          <div className="mt-2.5 grid grid-cols-4 gap-2 sm:grid-cols-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => {
              const isSelected = selectedSemNumber === num;
              return (
                <button
                  key={num}
                  type="button"
                  onClick={() => setSelectedSemNumber(num)}
                  className={`flex h-11 flex-col items-center justify-center rounded-xl border text-xs font-black transition-all ${
                    isSelected
                      ? 'border-slate-950 bg-slate-950 text-white shadow-sm scale-105'
                      : 'border-slate-200 bg-slate-50/60 text-slate-700 hover:border-slate-300 hover:bg-white'
                  }`}
                >
                  <span>S{num}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Info & CTA Button */}
        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-slate-100 pt-5 sm:flex-row">
          <div className="text-xs text-slate-600">
            <span>Selected: </span>
            <strong className="text-slate-950">{selectedBranch.name}</strong>
            <span> • </span>
            <strong className="text-slate-900">Semester {selectedSemNumber}</strong>
          </div>

          <button
            type="button"
            onClick={handleConfirm}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-6 text-xs font-black text-white shadow-md transition duration-200 hover:bg-slate-800 sm:w-auto"
          >
            <span>Open Study Hub</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
