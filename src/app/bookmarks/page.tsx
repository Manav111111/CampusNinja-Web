'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Bookmark, Sparkles } from 'lucide-react';
import { EmptyState } from '@/components/common/EmptyState';

export default function BookmarksPage() {
  return (
    <div className="page-shell animate-soft-in">
      <section className="surface-card rounded-3xl p-6 sm:p-8">
        <p className="eyebrow"><Sparkles className="h-3.5 w-3.5" /> Saved workspace</p>
        <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">Bookmarked materials</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
          Pin important notes, PYQs, and videos here for fast revision before exams.
        </p>
      </section>
      <EmptyState
        icon={Bookmark}
        title="No bookmarks pinned yet"
        description="While browsing the Study Hub, save important resources to make revision faster."
        action={
          <Link href="/subjects" className="inline-flex h-11 items-center gap-2 rounded-2xl bg-blue-600 px-5 text-sm font-bold text-white transition hover:bg-blue-700">
            Explore study hub <ArrowRight className="h-4 w-4" />
          </Link>
        }
      />
    </div>
  );
}
