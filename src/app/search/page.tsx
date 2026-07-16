'use client';

import React, { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowRight, BookOpen, FileText, LucideIcon, Rocket, Search as SearchIcon, ShoppingBag, Sparkles } from 'lucide-react';
import { EmptyState } from '@/components/common/EmptyState';
import { Skeleton } from '@/components/common/Skeleton';
import { searchAll } from '@/services/supabase';
import { SearchResults } from '@/types';

function SearchContent() {
  const searchParams = useSearchParams();
  const queryParam = searchParams.get('q') || '';
  const [query, setQuery] = useState(queryParam);
  const [results, setResults] = useState<SearchResults | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!queryParam) return;
    setLoading(true);
    searchAll(queryParam).then((data) => {
      setResults(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [queryParam]);

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    searchAll(query.trim()).then((data) => {
      setResults(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  const totalCount = results ? results.subjects.length + results.resources.length + results.skills.length + results.services.length : 0;

  return (
    <div className="page-shell animate-soft-in">
      <section className="surface-card rounded-3xl p-6 sm:p-8">
        <p className="eyebrow"><Sparkles className="h-3.5 w-3.5" /> Universal search</p>
        <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">Search the whole workspace</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
          Find subjects, notes, PYQs, videos, skill tracks, and marketplace services in one fast interface.
        </p>
        <form onSubmit={handleSearchSubmit} className="mt-6 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Try Mathematics, Physics, Python, assignment..."
              className="focus-ring h-12 w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-4 text-sm font-semibold text-slate-950 transition focus:border-blue-300"
            />
          </div>
          <button type="submit" className="inline-flex h-12 items-center justify-center rounded-2xl bg-blue-600 px-6 text-sm font-bold text-white transition hover:bg-blue-700">
            Search library
          </button>
        </form>
      </section>

      {loading ? (
        <div className="space-y-4">{[1, 2, 3, 4].map((item) => <Skeleton key={item} className="h-24 rounded-2xl" />)}</div>
      ) : !results ? (
        <EmptyState icon={SearchIcon} title="Start with any keyword" description="Search across the complete CampusNinja academic and marketplace library." />
      ) : totalCount === 0 ? (
        <EmptyState icon={SearchIcon} title={`No results for "${query}"`} description="Try a simpler query or browse marketplace services for custom work." />
      ) : (
        <div className="space-y-8">
          <ResultSection title="Subjects" icon={BookOpen} count={results.subjects.length}>
            {results.subjects.map((subject) => <ResultLink key={subject.id} href={`/subjects/${subject.id}`} title={subject.name} caption="Subject hub" />)}
          </ResultSection>
          <ResultSection title="Resources" icon={FileText} count={results.resources.length}>
            {results.resources.map((resource) => <ResultAnchor key={resource.id} href={resource.file_url || resource.drive_url || resource.youtube_url || '#'} title={resource.title} caption={resource.type} />)}
          </ResultSection>
          <ResultSection title="Skill tracks" icon={Rocket} count={results.skills.length}>
            {results.skills.map((skill) => <ResultLink key={skill.id} href="/skills" title={skill.name} caption="Career roadmap" />)}
          </ResultSection>
          <ResultSection title="Marketplace" icon={ShoppingBag} count={results.services.length}>
            {results.services.map((service) => <ResultLink key={service.id} href={`/marketplace/${service.id}`} title={service.title} caption={`Rs. ${service.price}`} />)}
          </ResultSection>
        </div>
      )}
    </div>
  );
}

function ResultSection({ title, icon: Icon, count, children }: { title: string; icon: LucideIcon; count: number; children: React.ReactNode }) {
  if (count === 0) return null;
  return (
    <section className="space-y-3">
      <h2 className="flex items-center gap-2 text-lg font-black text-slate-950"><Icon className="h-5 w-5 text-blue-600" /> {title} ({count})</h2>
      <div className="grid gap-3 md:grid-cols-2">{children}</div>
    </section>
  );
}

function ResultLink({ href, title, caption }: { href: string; title: string; caption: string }) {
  return (
    <Link href={href} className="surface-card group flex items-center justify-between rounded-2xl p-5 transition hover:border-blue-300">
      <span className="min-w-0">
        <span className="block truncate text-sm font-bold text-slate-950">{title}</span>
        <span className="mt-1 block text-xs font-semibold uppercase tracking-[0.08em] text-slate-400">{caption}</span>
      </span>
      <ArrowRight className="h-4 w-4 shrink-0 text-slate-300 group-hover:text-blue-600" />
    </Link>
  );
}

function ResultAnchor({ href, title, caption }: { href: string; title: string; caption: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="surface-card group flex items-center justify-between rounded-2xl p-5 transition hover:border-blue-300">
      <span className="min-w-0">
        <span className="block truncate text-sm font-bold text-slate-950">{title}</span>
        <span className="mt-1 block text-xs font-semibold uppercase tracking-[0.08em] text-slate-400">{caption}</span>
      </span>
      <ArrowRight className="h-4 w-4 shrink-0 text-slate-300 group-hover:text-blue-600" />
    </a>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<Skeleton className="h-64 rounded-3xl" />}>
      <SearchContent />
    </Suspense>
  );
}
