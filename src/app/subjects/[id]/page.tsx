'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, BookOpen, ClipboardList, Download, ExternalLink, FileText, FlaskConical, PlayCircle, Video } from 'lucide-react';
import { EmptyState } from '@/components/common/EmptyState';
import { Skeleton } from '@/components/common/Skeleton';
import { useSubjectResources } from '@/hooks/useQueries';
import { Resource } from '@/types';

type TabId = 'notes' | 'pyq' | 'video' | 'lab' | 'assignments' | 'syllabus';

export default function SubjectDetailPage() {
  const params = useParams();
  const subjectId = Array.isArray(params.id) ? params.id[0] : params.id;
  const [activeTab, setActiveTab] = useState<TabId>('notes');
  const { data: resources, isLoading } = useSubjectResources(subjectId || '');

  const filterResources = (type: TabId): Resource[] => {
    if (!resources) return [];
    return resources.filter((resource) => {
      const value = (resource.type || '').toLowerCase();
      if (type === 'notes') return value === 'notes' || value === 'note';
      if (type === 'pyq') return value === 'pyqs' || value === 'pyq';
      if (type === 'video') return value === 'video' || value === 'videos';
      if (type === 'lab') return value === 'lab' || value === 'labs' || value === 'manual';
      if (type === 'assignments') return value === 'assignment' || value === 'assignments';
      return value === 'syllabus';
    });
  };

  const tabs = [
    { id: 'notes' as TabId, label: 'Notes', icon: FileText, count: filterResources('notes').length },
    { id: 'pyq' as TabId, label: 'PYQs', icon: BookOpen, count: filterResources('pyq').length },
    { id: 'video' as TabId, label: 'Videos', icon: Video, count: filterResources('video').length },
    { id: 'lab' as TabId, label: 'Lab', icon: FlaskConical, count: filterResources('lab').length },
    { id: 'assignments' as TabId, label: 'Assignments', icon: ClipboardList, count: filterResources('assignments').length },
    { id: 'syllabus' as TabId, label: 'Syllabus', icon: ClipboardList, count: filterResources('syllabus').length },
  ];
  const currentList = filterResources(activeTab);

  return (
    <div className="page-shell animate-soft-in">
      <Link href="/subjects" className="inline-flex w-fit items-center gap-2 text-sm font-bold text-slate-500 transition hover:text-slate-950">
        <ArrowLeft className="h-4 w-4" /> Back to study hub
      </Link>

      <section className="border-b border-stone-300 pb-8">
        <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">Subject</p>
        <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-950 sm:text-6xl">Course materials</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
          Notes, PYQs, videos, lab files, assignments, and syllabus in one focused place.
        </p>
      </section>

      <div className="sticky top-[72px] z-30 border border-stone-300 bg-[#f6f4ef]/88 p-1.5 backdrop-blur-xl">
        <div className="flex gap-2 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex h-11 shrink-0 items-center gap-2 rounded-md px-4 text-sm font-black transition ${
                  isSelected ? 'bg-slate-950 text-white' : 'text-slate-600 hover:bg-white hover:text-slate-950'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
                <span className={`rounded-full px-2 py-0.5 text-[10px] ${isSelected ? 'bg-white/15 text-white' : 'bg-white text-slate-500'}`}>{tab.count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {[1, 2, 3, 4].map((item) => <Skeleton key={item} className="h-24 rounded-lg" />)}
        </div>
      ) : currentList.length === 0 ? (
        <EmptyState
          icon={FileText}
          title={`No ${tabs.find((tab) => tab.id === activeTab)?.label} available yet`}
          description="This folder is being updated with verified instructor notes and solutions."
        />
      ) : (
        <div className="grid gap-3">
          {currentList.map((item) => {
            const linkUrl = item.file_url || item.drive_url || item.youtube_url || item.external_url || '#';
            const isVideo = activeTab === 'video' || Boolean(item.youtube_url);
            return (
              <article key={item.id} className="surface-card flex items-center justify-between gap-4 rounded-lg p-4 transition hover:border-slate-400">
                <div className="flex min-w-0 items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-stone-100 text-slate-600">
                    {isVideo ? <PlayCircle className="h-6 w-6" /> : <FileText className="h-6 w-6" />}
                  </div>
                  <div className="min-w-0">
                    <h4 className="line-clamp-2 text-sm font-bold text-slate-950">{item.title}</h4>
                    {item.description && <p className="mt-1 line-clamp-1 text-xs text-slate-500">{item.description}</p>}
                    <span className="mt-2 block text-[10px] font-black uppercase tracking-[0.08em] text-slate-400">{item.storage_type || 'Verified resource'}</span>
                  </div>
                </div>
                <a href={linkUrl} target="_blank" rel="noopener noreferrer" className="flex shrink-0 items-center gap-1.5 rounded-lg bg-slate-950 px-4 py-2.5 text-xs font-black text-white transition hover:bg-slate-800">
                  {isVideo ? 'Watch' : 'Open'} {isVideo ? <ExternalLink className="h-3.5 w-3.5" /> : <Download className="h-3.5 w-3.5" />}
                </a>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
