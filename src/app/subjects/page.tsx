'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, BookOpen, CheckCircle2, Filter, GraduationCap, Search } from 'lucide-react';
import { useAcademic } from '@/contexts/AcademicContext';
import { useSubjects } from '@/hooks/useQueries';
import { EmptyState } from '@/components/common/EmptyState';
import { Skeleton } from '@/components/common/Skeleton';
import { SubjectCard } from '@/components/features/SubjectCard';

export default function SubjectsPage() {
  const { branchId, semesterId, branchName, semesterNum } = useAcademic();
  const { data: subjects, isLoading } = useSubjects(branchId, semesterId);
  const [activeTab, setActiveTab] = useState<'all' | 'core' | 'labs'>('all');
  const [filterQuery, setFilterQuery] = useState('');

  const filteredSubjects = (subjects || []).filter((subject) => {
    if (!filterQuery.trim()) return true;
    const q = filterQuery.toLowerCase();
    return (subject.title || subject.name || '').toLowerCase().includes(q) || (subject.short_name || '').toLowerCase().includes(q);
  });

  return (
    <div className="page-shell animate-soft-in">
      <section className="border-b border-stone-300 pb-8">
        <div className="grid gap-6 xl:grid-cols-[1fr_auto] xl:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">Study hub</p>
            <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-950 sm:text-6xl">
              {branchName ? `${branchName} curriculum` : 'Choose your semester'}
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
              Browse subjects for your selected branch and semester. Open a subject to find notes, PYQs, videos, labs, assignments, and syllabus.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-2 rounded-lg border border-stone-300 bg-white/70 px-3 py-1.5 text-xs font-bold text-slate-700">
                <GraduationCap className="h-4 w-4 text-blue-600" />
                {branchName ? `${branchName} / Sem ${semesterNum || 'All'}` : 'No profile selected'}
              </span>
              {subjects?.length ? (
                <span className="inline-flex items-center gap-2 rounded-lg border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
                  <CheckCircle2 className="h-4 w-4" />
                  {subjects.length} subjects active
                </span>
              ) : null}
            </div>
          </div>
          <Link href="/setup" className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-slate-950 px-5 text-sm font-black text-white transition hover:bg-slate-800">
            <Filter className="h-4 w-4" /> Change profile
          </Link>
        </div>
      </section>

      <div className="sticky top-[72px] z-30 -mx-1 border border-stone-300 bg-[#f6f4ef]/88 p-3 backdrop-blur-xl">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex gap-2 overflow-x-auto">
            {[
              ['all', `All subjects (${subjects?.length || 0})`],
              ['core', 'Core theory'],
              ['labs', 'Practicals and labs'],
            ].map(([id, label]) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as 'all' | 'core' | 'labs')}
                className={`h-10 shrink-0 rounded-xl px-4 text-xs font-bold transition ${
                  activeTab === id ? 'bg-slate-950 text-white' : 'text-slate-600 hover:bg-white hover:text-slate-950'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="relative w-full lg:w-80">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Filter subjects..."
              className="focus-ring h-10 w-full rounded-lg border border-stone-300 bg-white/80 pl-10 pr-4 text-sm font-semibold text-slate-900 transition focus:border-slate-400"
            />
          </div>
        </div>
      </div>

      {!branchId || !semesterId ? (
        <EmptyState
          icon={GraduationCap}
          title="Set your academic profile"
          description="Choose your engineering branch and semester to unlock the exact subjects and resources for your curriculum."
          action={
            <Link href="/setup" className="inline-flex h-11 items-center gap-2 rounded-lg bg-slate-950 px-5 text-sm font-black text-white transition hover:bg-slate-800">
              Set profile <ArrowRight className="h-4 w-4" />
            </Link>
          }
        />
      ) : isLoading ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => <Skeleton key={item} className="h-56 rounded-lg" />)}
        </div>
      ) : filteredSubjects.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title={filterQuery ? `No results for "${filterQuery}"` : 'No subjects found'}
          description={filterQuery ? 'Try a subject name or short code.' : 'We are still digitizing this semester. Marketplace services remain available.'}
          action={
            filterQuery ? (
              <button onClick={() => setFilterQuery('')} className="inline-flex h-11 items-center rounded-lg bg-slate-950 px-5 text-sm font-black text-white transition hover:bg-slate-800">
                Reset filter
              </button>
            ) : (
              <Link href="/marketplace" className="inline-flex h-11 items-center gap-2 rounded-lg bg-slate-950 px-5 text-sm font-black text-white transition hover:bg-slate-800">
                Explore marketplace <ArrowRight className="h-4 w-4" />
              </Link>
            )
          }
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {filteredSubjects.map((subject) => <SubjectCard key={subject.id} subject={subject} />)}
        </div>
      )}

      <section className="surface-card rounded-lg p-6">
        <h2 className="text-xl font-black tracking-tight text-slate-950">Need a different semester?</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">Change your curriculum once and the subject grid will update around your branch and semester.</p>
        <Link href="/setup" className="mt-5 inline-flex items-center gap-2 text-sm font-black text-slate-950">
          Update curriculum <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </div>
  );
}
