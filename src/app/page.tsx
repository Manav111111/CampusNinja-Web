'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  BookOpen,
  ClipboardList,
  GraduationCap,
  Handshake,
  ScrollText,
  Users,
} from 'lucide-react';
import { useAcademic } from '@/contexts/AcademicContext';
import { useMarketplaceServices, useSubjects } from '@/hooks/useQueries';
import { HeroAcademicSelector } from '@/components/features/HeroAcademicSelector';
import { MarketplaceCard } from '@/components/features/MarketplaceCard';
import { QuickAccessCard } from '@/components/features/QuickAccessCard';
import { SubjectCard } from '@/components/features/SubjectCard';
import { Skeleton } from '@/components/common/Skeleton';
import { isReviewMode } from '@/config/reviewMode';

const fallbackSubjects = [
  { id: 'sub-1', name: 'Engineering Physics', title: 'Engineering Physics', short_name: 'PHY', theme_color: '#2A4B8D', counts: { total: 12, notes: 5, pyqs: 4, videos: 3 } },
  { id: 'sub-2', name: 'Engineering Mathematics', title: 'Engineering Mathematics', short_name: 'MATH', theme_color: '#12233F', counts: { total: 18, notes: 8, pyqs: 6, videos: 4 } },
  { id: 'sub-3', name: 'Programming in C', title: 'Programming in C', short_name: 'C', theme_color: '#2A4B8D', counts: { total: 15, notes: 6, pyqs: 5, videos: 4 } },
  { id: 'sub-4', name: 'Basic Electrical Engineering', title: 'Basic Electrical Engineering', short_name: 'BEE', theme_color: '#C98A24', counts: { total: 10, notes: 4, pyqs: 4, videos: 2 } },
];

const fallbackMarketplace = [
  { id: 'm-1', title: 'Custom College Assignments & Practical Files', price: 149, category: 'Assignments', description: 'Clean solved files prepared against your exact brief.' },
  { id: 'm-2', title: 'Complete Verified Lab Manual Solutions', price: 99, category: 'Lab Manuals', description: 'Readings, diagrams, code, and formatted experiment sheets.' },
  { id: 'm-3', title: 'Minor / Major Projects with Source Code', price: 499, category: 'Projects', description: 'Working project packages with synopsis and presentation support.' },
];

const resourceTypes = [
  { title: 'Notes', type: 'notes' as const },
  { title: 'PYQs', type: 'pyqs' as const },
  { title: 'Videos', type: 'videos' as const },
  { title: 'Syllabus', type: 'syllabus' as const },
];

const extraResources = [
  { href: '/subjects?tab=assignments', title: 'Assignments', icon: ClipboardList },
  { href: '/subjects?tab=labs', title: 'Lab Manuals', icon: ScrollText },
];

export default function HomePage() {
  const { branchId, semesterId, branchName, semesterNum } = useAcademic();
  const { data: mySubjects, isLoading: subjectsLoading } = useSubjects(branchId, semesterId);
  const { data: marketplaceItems, isLoading: marketLoading } = useMarketplaceServices();

  const subjectsToShow = mySubjects?.length ? mySubjects : fallbackSubjects;
  const marketToShow = marketplaceItems?.length ? marketplaceItems : fallbackMarketplace;

  return (
    <div className="page-shell animate-soft-in">
      <section className="grid-paper relative grid min-h-[500px] items-center gap-10 rounded-xl border border-[var(--line)] px-5 py-10 lg:grid-cols-[1.05fr_0.95fr] lg:px-10 lg:py-12">
        <div className="max-w-2xl">
          <p className="eyebrow bg-white text-[var(--brand)]">
            DOC · 2026-B.TECH
          </p>
          <h1 className="font-display mt-5 text-4xl font-bold leading-[1.1] tracking-tight text-[var(--ink)] sm:text-5xl xl:text-[3.4rem]">
            Find the right semester material in seconds.
          </h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-[var(--muted)] sm:text-lg">
            Choose your course, branch, and semester. CampusNinja organizes notes, PYQs, videos, syllabus, assignments, and labs around the way students actually study.
          </p>

          {isReviewMode() ? (
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                href="/subjects"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-[var(--ink)] px-5 text-sm font-bold text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-[var(--brand)]"
              >
                <BookOpen className="h-4 w-4" />
                Explore Study Materials
              </Link>
              <Link
                href="/marketplace"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-[var(--line-strong)] bg-white px-5 text-sm font-bold text-[var(--ink)] shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-[var(--brand)] hover:text-[var(--brand)]"
              >
                <ClipboardList className="h-4 w-4" />
                Order Lab Manuals & Projects
              </Link>
            </div>
          ) : (
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-[#CC1F1F] px-5 text-sm font-bold text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-[#A81919]"
              >
                <YouTubeIcon className="h-4 w-4 fill-current" />
                YouTube
              </a>
              <a
                href="https://whatsapp.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-[#1F8A5A] px-5 text-sm font-bold text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-[#186E48]"
              >
                <WhatsAppIcon className="h-4 w-4 fill-current" />
                WhatsApp Community
              </a>
            </div>
          )}

          <div className="mt-7 flex flex-wrap items-center gap-2 font-mono-spec text-[11px] font-semibold text-[var(--muted)]">
            {['COURSE', 'BRANCH', 'SEMESTER', 'SUBJECT', 'RESOURCE'].map((item, index) => (
              <React.Fragment key={item}>
                <span className="rounded border border-[var(--line-strong)] bg-white px-2.5 py-1 text-[var(--ink-700)]">{item}</span>
                {index < 4 && <ArrowRight className="h-3 w-3 text-[var(--muted-2)]" />}
              </React.Fragment>
            ))}
          </div>
        </div>

        <HeroAcademicSelector />
      </section>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
        {resourceTypes.map((resource) => (
          <QuickAccessCard key={resource.type} title={resource.title} type={resource.type} />
        ))}
        {extraResources.map(({ href, title, icon: Icon }) => (
          <Link key={title} href={href} className="spec-corners surface-card group flex min-h-28 items-center justify-between rounded-lg p-4">
            <div>
              <Icon className="mb-4 h-5 w-5 text-[var(--brand)]" />
              <h3 className="text-sm font-bold text-[var(--ink)]">{title}</h3>
              <p className="mt-1 text-xs font-medium text-[var(--muted)]">Semester resources</p>
            </div>
            <ArrowRight className="h-4 w-4 text-[var(--muted-2)] transition duration-200 ease group-hover:translate-x-1 group-hover:text-[var(--brand)]" />
          </Link>
        ))}
      </section>

      <SectionHeader
        eyebrow={branchName ? `${branchName.toUpperCase()} · SEM ${semesterNum || 'ALL'}` : 'FEATURED SUBJECTS'}
        title="Start with a subject"
        description="A quieter subject grid with only the details needed to decide where to go next."
        href="/subjects"
      />
      {subjectsLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((item) => <Skeleton key={item} className="h-56 rounded-lg" />)}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {subjectsToShow.slice(0, 4).map((subject) => <SubjectCard key={subject.id} subject={subject} />)}
        </div>
      )}

      <section className="grid gap-4 lg:grid-cols-3">
        <Link href="/subjects" className="spec-corners surface-card group rounded-lg p-6">
          <BookOpen className="h-6 w-6 text-[var(--brand)]" />
          <h2 className="font-display mt-6 text-2xl font-bold tracking-tight text-[var(--ink)]">Study Hub</h2>
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">Move from semester to subject to resource without dashboard clutter.</p>
          <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[var(--ink)] transition duration-200 ease group-hover:text-[var(--brand)]">
            Browse resources <ArrowRight className="h-4 w-4 transition duration-200 ease group-hover:translate-x-1" />
          </span>
        </Link>
        <Link href="/skills" className="spec-corners surface-card group rounded-lg p-6">
          <GraduationCap className="h-6 w-6 text-[var(--brand)]" />
          <h2 className="font-display mt-6 text-2xl font-bold tracking-tight text-[var(--ink)]">Skills</h2>
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">Career tracks stay available, but they no longer compete with the study flow.</p>
          <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[var(--ink)] transition duration-200 ease group-hover:text-[var(--brand)]">
            View tracks <ArrowRight className="h-4 w-4 transition duration-200 ease group-hover:translate-x-1" />
          </span>
        </Link>
        {isReviewMode() ? (
          <Link href="/support" className="spec-corners surface-card group rounded-lg p-6">
            <ClipboardList className="h-6 w-6 text-[var(--brand)]" />
            <h2 className="font-display mt-6 text-2xl font-bold tracking-tight text-[var(--ink)]">Help & FAQ</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">Find answers to common academic questions, order delivery details, and study guidelines.</p>
            <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[var(--ink)] transition duration-200 ease group-hover:text-[var(--brand)]">
              Get support <ArrowRight className="h-4 w-4 transition duration-200 ease group-hover:translate-x-1" />
            </span>
          </Link>
        ) : (
          <Link href="/support" className="spec-corners surface-card group rounded-lg p-6">
            <Users className="h-6 w-6 text-[var(--brand)]" />
            <h2 className="font-display mt-6 text-2xl font-bold tracking-tight text-[var(--ink)]">Community</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">Ask for help, request missing material, and stay close to your batch.</p>
            <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[var(--ink)] transition duration-200 ease group-hover:text-[var(--brand)]">
              Join in <ArrowRight className="h-4 w-4 transition duration-200 ease group-hover:translate-x-1" />
            </span>
          </Link>
        )}
      </section>

      <SectionHeader
        eyebrow="MARKETPLACE"
        title="Academic help when you need it"
        description="Kept as a dedicated section so learning stays the priority."
        href="/marketplace"
      />
      {marketLoading ? (
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((item) => <Skeleton key={item} className="h-72 rounded-lg" />)}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          {marketToShow.slice(0, 3).map((item) => <MarketplaceCard key={item.id} product={item} />)}
        </div>
      )}

      <section className="spec-corners surface-card grid gap-6 rounded-lg p-6 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <p className="eyebrow"><Handshake className="h-3.5 w-3.5 text-[var(--brand)]" /> BUILT FOR DAILY STUDY</p>
          <h2 className="font-display mt-4 text-3xl font-bold tracking-tight text-[var(--ink)]">Calm enough for first years. Useful enough for finals.</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">
            CampusNinja keeps the first step obvious and lets deeper tools appear only when students ask for them.
          </p>
        </div>
        <Link href="/subjects" className="primary-button inline-flex h-12 items-center justify-center gap-2 rounded-md px-5 text-sm font-bold text-white transition duration-200 ease">
          Explore Study Hub <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </div>
  );
}

function SectionHeader({ eyebrow, title, description, href }: { eyebrow: string; title: string; description: string; href: string }) {
  return (
    <div className="flex flex-col gap-4 border-t border-[var(--line)] pt-8 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="font-mono-spec text-[11px] font-bold tracking-[0.1em] text-[var(--brand)]">{eyebrow}</p>
        <h2 className="font-display mt-2 text-3xl font-bold tracking-tight text-[var(--ink)]">{title}</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted)]">{description}</p>
      </div>
      <Link href={href} className="soft-input focus-ring inline-flex h-10 items-center justify-center gap-2 rounded-md border border-[var(--line)] px-4 text-sm font-bold text-[var(--ink)] transition duration-200 ease hover:border-[var(--brand)] hover:text-[var(--brand)]">
        View all <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

function YouTubeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1.824zm-3.423-14.416c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm.029 18.88c-1.161 0-2.305-.292-3.318-.844l-3.677.964.984-3.595c-.607-1.052-.927-2.246-.926-3.468.001-3.825 3.113-6.937 6.937-6.937 1.856.001 3.601.723 4.913 2.034 1.312 1.311 2.033 3.057 2.033 4.912-.001 3.824-3.114 6.934-6.946 6.934z" />
    </svg>
  );
}