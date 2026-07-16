'use client';

import React from 'react';
import { ExternalLink, LifeBuoy, MessageCircle, Search } from 'lucide-react';
import { Card } from '@/components/common/Card';
import { Skeleton } from '@/components/common/Skeleton';
import { useCommunityLinks, useSocialLinks } from '@/hooks/useQueries';

export default function SupportPage() {
  const { data: communityLinks, isLoading: commLoading } = useCommunityLinks();
  const { data: socialLinks, isLoading: socLoading } = useSocialLinks();

  return (
    <div className="page-shell animate-soft-in">
      <section className="surface-card rounded-3xl p-6 sm:p-8">
        <p className="eyebrow"><LifeBuoy className="h-3.5 w-3.5" /> Help center</p>
        <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">Support and communities</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
          Join official study groups, social channels, or find the right support path for marketplace and academic questions.
        </p>
        <div className="relative mt-6 max-w-2xl">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input className="focus-ring h-12 w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-4 text-sm font-semibold" placeholder="Search FAQs, guides, or community links..." />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-black tracking-tight text-slate-950">WhatsApp study networks</h2>
        {commLoading ? (
          <div className="grid gap-4 sm:grid-cols-2">{[1, 2].map((item) => <Skeleton key={item} className="h-24 rounded-2xl" />)}</div>
        ) : !communityLinks?.length ? (
          <Card className="text-center text-sm text-slate-600">WhatsApp links are being updated for the upcoming semester.</Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {communityLinks.map((link) => (
              <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className="surface-card group flex items-center justify-between rounded-2xl p-5 transition hover:border-blue-300">
                <span className="flex items-center gap-4">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600"><MessageCircle className="h-5 w-5" /></span>
                  <span>
                    <span className="block text-sm font-bold text-slate-950">{link.title}</span>
                    {link.subtitle && <span className="mt-1 block text-xs text-slate-500">{link.subtitle}</span>}
                  </span>
                </span>
                <ExternalLink className="h-4 w-4 text-slate-300 group-hover:text-blue-600" />
              </a>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-black tracking-tight text-slate-950">Social channels</h2>
        {socLoading ? (
          <div className="grid gap-4 sm:grid-cols-2">{[1, 2].map((item) => <Skeleton key={item} className="h-20 rounded-2xl" />)}</div>
        ) : !socialLinks?.length ? (
          <Card className="text-center text-sm text-slate-600">No active social links published at the moment.</Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {socialLinks.map((social) => (
              <a key={social.id} href={social.url} target="_blank" rel="noopener noreferrer" className="surface-card flex items-center justify-between rounded-2xl p-5 transition hover:border-blue-300">
                <span className="text-sm font-bold text-slate-950">{social.title}</span>
                <span className="text-xs font-black uppercase tracking-[0.08em] text-blue-700">{social.platform}</span>
              </a>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
