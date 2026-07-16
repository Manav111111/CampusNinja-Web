'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Bookmark, BookOpen } from 'lucide-react';
import { Subject } from '@/types';

const partNumber = (id: string, shortName?: string) => {
  const digits = id.replace(/\D/g, '').padStart(3, '0').slice(-3) || '000';
  return `${(shortName || 'SUB').toUpperCase().slice(0, 4)}-${digits}`;
};

export const SubjectCard: React.FC<{ subject: Subject }> = ({ subject }) => {
  const counts = subject.counts || { total: 0, notes: 0, pyqs: 0, videos: 0 };
  const total = counts.total || counts.notes + counts.pyqs + counts.videos;

  return (
    <article className="spec-corners surface-card group flex min-h-56 flex-col justify-between rounded-lg p-5">
      <div>
        <div className="mb-6 flex items-start justify-between gap-3">
          <div
            className="flex h-11 w-11 items-center justify-center rounded-md text-white"
            style={{ backgroundColor: subject.theme_color || 'var(--brand)' }}
          >
            <BookOpen className="h-5 w-5 stroke-[1.75]" />
          </div>
          <button
            onClick={(e) => e.preventDefault()}
            aria-label="Bookmark subject"
            className="focus-ring flex h-9 w-9 items-center justify-center rounded-md border border-[var(--line)] bg-white text-[var(--muted)] transition duration-200 ease hover:border-[var(--brand)] hover:bg-[var(--brand-50)] hover:text-[var(--brand)]"
          >
            <Bookmark className="h-4 w-4" />
          </button>
        </div>

        <span className="part-number">{partNumber(subject.id, subject.short_name)} · {total} RES</span>
        <h3 className="mt-4 font-display line-clamp-2 text-xl font-bold leading-tight tracking-tight text-[var(--ink)]">
          {subject.title || subject.name}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-[var(--muted)]">
          {subject.branch ? `${subject.branch}` : 'Department curriculum'}
          {subject.semester ? ` / Semester ${subject.semester}` : ''}
        </p>
      </div>

      <div className="mt-6 flex items-center justify-between gap-3 border-t border-[var(--line)] pt-4">
        <div className="flex gap-3 font-mono-spec text-[10px] font-semibold text-[var(--muted-2)]">
          <span>{counts.notes} NOTES</span>
          <span>{counts.pyqs} PYQS</span>
        </div>
        <Link
          href={`/subjects/${subject.id}`}
          className="flex items-center gap-2 text-sm font-bold text-[var(--ink)] transition duration-200 ease group-hover:text-[var(--brand)]"
        >
          Open <ArrowRight className="h-4 w-4 transition duration-200 ease group-hover:translate-x-1" />
        </Link>
      </div>
    </article>
  );
};