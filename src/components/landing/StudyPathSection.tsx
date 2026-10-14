'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, GraduationCap, Layers, LibraryBig } from 'lucide-react';

/**
 * Study-path strip — preserves and advertises the existing
 * semester → branch → subjects → notes/videos/PYQs/syllabus flow.
 * Links route into the untouched academic functionality (/setup, /subjects).
 */
const STEPS = [
  {
    icon: <GraduationCap className="h-5 w-5 text-[#FFB066]" />,
    step: 'Step 01',
    title: 'Pick semester & branch',
    description: 'Set your academic profile once — everything filters around it.',
    href: '/setup',
    cta: 'Open setup',
  },
  {
    icon: <Layers className="h-5 w-5 text-[#FFB066]" />,
    step: 'Step 02',
    title: 'Open your subjects',
    description: 'Every subject in your semester, organised and searchable.',
    href: '/subjects',
    cta: 'Browse subjects',
  },
  {
    icon: <LibraryBig className="h-5 w-5 text-[#FFB066]" />,
    step: 'Step 03',
    title: 'Strike the syllabus',
    description: 'Notes, videos, PYQs and syllabus — per subject, per unit.',
    href: '/subjects',
    cta: 'Enter Study Hub',
  },
];

export const StudyPathSection: React.FC = () => {
  return (
    <section className="relative w-full border-t border-white/[0.07] bg-[#0A0A0B] py-16 text-zinc-100 sm:py-20 lg:py-24">
      <div className="mx-auto w-full max-w-[1240px] px-5 sm:px-10 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <p className="font-mono text-[11px] font-medium uppercase tracking-[0.25em] text-[#FF7A1A] sm:text-xs">
              03 — Your study path
            </p>
            <h2 className="mt-3 max-w-[620px] text-[28px] font-extrabold leading-[1.12] tracking-[-0.03em] text-white sm:text-[38px]">
              Semester → branch → subject. <span className="text-zinc-500">Zero hunting.</span>
            </h2>
          </div>
          <Link
            href="/subjects"
            className="group inline-flex h-[48px] shrink-0 items-center gap-2 rounded-2xl bg-white px-6 text-sm font-bold text-[#101216] transition hover:bg-zinc-200"
          >
            Go to Study Hub
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </motion.div>

        <div className="mt-8 grid gap-4 md:grid-cols-3 lg:mt-10">
          {STEPS.map((s, i) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#121215] p-6"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -right-3 -top-5 font-mono text-[88px] font-bold leading-none text-white/[0.05]"
              >
                {i + 1}
              </span>
              <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#FF7A1A]/20 bg-[#FF7A1A]/10">
                {s.icon}
              </span>
              <p className="mt-4 font-mono text-[10.5px] uppercase tracking-[0.18em] text-[#FF7A1A]">
                {s.step}
              </p>
              <h3 className="mt-1.5 text-lg font-bold text-white">{s.title}</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-zinc-400">{s.description}</p>
              <Link
                href={s.href}
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[#FFB066] hover:text-white"
              >
                {s.cta}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
