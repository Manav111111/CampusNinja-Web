'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, BellRing, CalendarDays, ClipboardList, FileText } from 'lucide-react';

interface NoticeCard {
  icon: React.ReactNode;
  kicker: string;
  title: string;
  description: string;
  href: string;
  meta: string;
}

/**
 * Notices & Circulars — links ONLY to verified official GGSIPU portals.
 * No live notices are fabricated: cards describe the official source hubs and
 * cite the kind of entries observed there (with a "verify on official site"
 * disclaimer). Last observed 14 Oct 2026.
 */
const CARDS: NoticeCard[] = [
  {
    icon: <FileText className="h-5 w-5 text-[#FFB066]" />,
    kicker: 'ipu.ac.in • Official',
    title: 'Examination Datesheets',
    description:
      'Theory & practical datesheets, including the B.Tech odd-semester (Nov 2026 / Jan 2027) proposals listed on the official portal.',
    href: 'https://ipu.ac.in/exam_datesheet.php',
    meta: 'Source hub • verify dates on site',
  },
  {
    icon: <ClipboardList className="h-5 w-5 text-[#FFB066]" />,
    kicker: 'ipu.ac.in • Official',
    title: 'Examination Notices',
    description:
      'Result rechecking updates, exam circulars and evaluation notices published by the Examination Division.',
    href: 'https://www.ipu.ac.in/exam_notices.php',
    meta: 'Source hub • verify dates on site',
  },
  {
    icon: <BellRing className="h-5 w-5 text-[#FFB066]" />,
    kicker: 'ipu.ac.in • Official',
    title: 'University Notices & Circulars',
    description:
      'Mid-term evaluations, supplementary-exam schedules, scholarships (incl. EWS) and general circulars.',
    href: 'https://ipu.ac.in/notices.php',
    meta: 'Source hub • verify dates on site',
  },
  {
    icon: <CalendarDays className="h-5 w-5 text-[#FFB066]" />,
    kicker: 'ipu.ac.in • Official PDF',
    title: 'Academic Calendar 2026–27',
    description:
      'The official session calendar for the academic year 2026–27 (PDF) — term dates, vacations and exam windows.',
    href: 'https://www.ipu.ac.in/acadcalendar.php',
    meta: 'PDF • uploaded 01-07-2026',
  },
];

export const NoticesSection: React.FC = () => {
  return (
    <section id="notices" className="relative w-full bg-[#0A0A0B] py-16 text-zinc-100 sm:py-20 lg:py-24">
      <div className="mx-auto w-full max-w-[1240px] px-5 sm:px-10 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="font-mono text-[11px] font-medium uppercase tracking-[0.25em] text-[#FF7A1A] sm:text-xs">
            01 — Notices &amp; Circulars
          </p>
          <h2 className="mt-3 max-w-[640px] text-[28px] font-extrabold leading-[1.12] tracking-[-0.03em] text-white sm:text-[38px]">
            Official GGSIPU updates, <span className="text-zinc-500">straight from the source.</span>
          </h2>
          <p className="mt-3 max-w-[620px] text-[14.5px] leading-relaxed text-zinc-400 sm:text-base">
            CampusNinja doesn&apos;t mirror or invent notices — every card below opens the verified
            official portal in a new tab. Last observed 14 Oct 2026.
          </p>
        </motion.div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:mt-10 lg:grid-cols-4">
          {CARDS.map((card, i) => (
            <motion.a
              key={card.title}
              href={card.href}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="group flex flex-col rounded-2xl border border-white/10 bg-gradient-to-b from-[#141417] to-[#0E0E11] p-5 transition hover:-translate-y-1 hover:border-[#FF7A1A]/50 hover:shadow-[0_16px_50px_rgba(255,122,26,0.18)]"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#FF7A1A]/20 bg-[#FF7A1A]/10">
                {card.icon}
              </span>
              <p className="mt-4 font-mono text-[10.5px] uppercase tracking-[0.18em] text-zinc-500">
                {card.kicker}
              </p>
              <h3 className="mt-1.5 text-[17px] font-bold leading-snug text-white">{card.title}</h3>
              <p className="mt-2 flex-1 text-[13.5px] leading-relaxed text-zinc-400">{card.description}</p>
              <span className="mt-4 flex items-center justify-between border-t border-white/[0.07] pt-3.5">
                <span className="font-mono text-[11px] text-zinc-500">{card.meta}</span>
                <ArrowUpRight className="h-4 w-4 text-[#FF7A1A] transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </span>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};
