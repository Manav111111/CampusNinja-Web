'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Landmark, School, Users } from 'lucide-react';

interface EventCard {
  icon: React.ReactNode;
  kicker: string;
  title: string;
  description: string;
  href: string;
  cta: string;
}

/**
 * Current Events — honest by design. There is no automated Instagram/YouTube
 * scraping integration and none is assumed; no specific events are invented.
 * Cards route users to the verifiable official sources where GGSIPU and
 * affiliated-college events are actually published.
 */
const CARDS: EventCard[] = [
  {
    icon: <Landmark className="h-5 w-5 text-[#FFB066]" />,
    kicker: 'Official university portal',
    title: 'GGSIPU Announcements',
    description:
      'Fests, seminars, workshops and official event circulars appear on the university website and notice board first.',
    href: 'https://ipu.ac.in/',
    cta: 'Open ipu.ac.in',
  },
  {
    icon: <School className="h-5 w-5 text-[#FFB066]" />,
    kicker: 'Affiliated colleges & societies',
    title: 'College & Society Pages',
    description:
      'Tech fests, hackathons and society events are published on each affiliated college’s own official site and notice board.',
    href: 'https://ipu.ac.in/notices.php',
    cta: 'Browse official notices',
  },
  {
    icon: <Users className="h-5 w-5 text-[#FFB066]" />,
    kicker: 'Inside CampusNinja',
    title: 'Community Study Jams',
    description:
      'Skill sessions, study jams and peer meetups organised for CampusNinja members — announced in-app and on support.',
    href: '/support',
    cta: 'Contact / support',
  },
];

export const EventsSection: React.FC = () => {
  return (
    <section id="events" className="relative w-full bg-[#0C0C0E] py-16 text-zinc-100 sm:py-20 lg:py-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 50% 35% at 82% 15%, rgba(255,122,26,0.1), transparent 70%)',
        }}
      />
      <div className="relative mx-auto w-full max-w-[1240px] px-5 sm:px-10 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="font-mono text-[11px] font-medium uppercase tracking-[0.25em] text-[#FF7A1A] sm:text-xs">
            02 — Current Events
          </p>
          <h2 className="mt-3 max-w-[640px] text-[28px] font-extrabold leading-[1.12] tracking-[-0.03em] text-white sm:text-[38px]">
            Never miss a campus beat. <span className="text-zinc-500">Verified sources only.</span>
          </h2>
          <p className="mt-3 max-w-[620px] text-[14.5px] leading-relaxed text-zinc-400 sm:text-base">
            We don&apos;t scrape Instagram or YouTube and we don&apos;t invent event listings — use
            these official starting points to find what&apos;s actually on.
          </p>
        </motion.div>

        <div className="mt-8 grid gap-4 md:grid-cols-3 lg:mt-10">
          {CARDS.map((card, i) => (
            <motion.a
              key={card.title}
              href={card.href}
              {...(card.href.startsWith('http')
                ? { target: '_blank', rel: 'noopener noreferrer' }
                : {})}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="group flex flex-col rounded-2xl border border-white/10 bg-gradient-to-b from-[#141417] to-[#0E0E11] p-6 transition hover:-translate-y-1 hover:border-[#FF7A1A]/50 hover:shadow-[0_16px_50px_rgba(255,122,26,0.18)]"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#FF7A1A]/20 bg-[#FF7A1A]/10">
                {card.icon}
              </span>
              <p className="mt-4 font-mono text-[10.5px] uppercase tracking-[0.18em] text-zinc-500">
                {card.kicker}
              </p>
              <h3 className="mt-1.5 text-lg font-bold text-white">{card.title}</h3>
              <p className="mt-2 flex-1 text-[14px] leading-relaxed text-zinc-400">{card.description}</p>
              <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[#FFB066]">
                {card.cta}
                <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </span>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};
