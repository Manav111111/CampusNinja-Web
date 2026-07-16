'use client';

import React from 'react';
import { ExternalLink, LifeBuoy, MessageCircle, Search } from 'lucide-react';
import { Card } from '@/components/common/Card';
import { Skeleton } from '@/components/common/Skeleton';
import { useCommunityLinks, useSocialLinks } from '@/hooks/useQueries';
import { isReviewMode } from '@/config/reviewMode';

export default function SupportPage() {
  const { data: communityLinks, isLoading: commLoading } = useCommunityLinks();
  const { data: socialLinks, isLoading: socLoading } = useSocialLinks();

  return (
    <div className="page-shell animate-soft-in">
      <section className="surface-card rounded-3xl p-6 sm:p-8">
        <p className="eyebrow"><LifeBuoy className="h-3.5 w-3.5" /> Help center</p>
        <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
          {isReviewMode() ? 'Academic Help & Support' : 'Support and communities'}
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
          {isReviewMode()
            ? 'Find quick solutions for marketplace orders, assignment requirements, lab manual guidelines, and general study material queries.'
            : 'Join official study groups, social channels, or find the right support path for marketplace and academic questions.'}
        </p>
        <div className="relative mt-6 max-w-2xl">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input
            className="focus-ring h-12 w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-4 text-sm font-semibold"
            placeholder={isReviewMode() ? 'Search study guides, delivery details, or academic FAQs...' : 'Search FAQs, guides, or community links...'}
          />
        </div>
      </section>

      {isReviewMode() && (
        <section className="space-y-6">
          <div className="surface-card rounded-2xl border border-blue-100 bg-blue-50/30 p-6">
            <h2 className="text-xl font-bold text-slate-950">Direct Academic Service Desk</h2>
            <p className="mt-2 text-sm text-slate-600">
              If you have questions about custom lab manual orders, assignment deliveries, or need priority upload of previous year question papers for your branch, reach out to our dedicated support team directly.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm font-bold text-slate-900">
              <span className="rounded-lg border border-slate-200 bg-white px-4 py-2 shadow-sm">Email: support@campusninja.com</span>
              <span className="rounded-lg border border-slate-200 bg-white px-4 py-2 shadow-sm">Working Hours: Mon - Sat (9:00 AM - 7:00 PM)</span>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-black tracking-tight text-slate-950">Frequently Asked Questions</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                {
                  q: 'How do I download notes and previous year question papers?',
                  a: 'Navigate to Study Hub, choose your engineering branch and semester, and select any subject to instantly read or download verified study materials.'
                },
                {
                  q: 'How does the Academic Marketplace work?',
                  a: 'You can order custom practical assignments, verified lab manual solutions, and project source code. All deliverables are prepared by subject experts within the promised delivery timeline.'
                },
                {
                  q: 'How do I track my marketplace orders?',
                  a: 'Visit the Orders tab from the navigation menu or your account dashboard to view real-time status updates and download your completed deliverables.'
                },
                {
                  q: 'Are digital calculators and syllabus guides included?',
                  a: 'Yes, semester curriculums, formula guides, and calculation utilities are integrated directly into your branch study hub for daily coursework support.'
                }
              ].map((faq, idx) => (
                <Card key={idx} className="space-y-2 p-5">
                  <h3 className="text-sm font-bold text-slate-950">{faq.q}</h3>
                  <p className="text-xs leading-5 text-slate-600">{faq.a}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {!isReviewMode() && (
        <>
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
        </>
      )}
    </div>
  );
}
