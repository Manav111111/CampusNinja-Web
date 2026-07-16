'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Filter, Search, ShieldCheck, ShoppingBag, SlidersHorizontal, Sparkles, Truck, Zap } from 'lucide-react';
import { useMarketplaceServices } from '@/hooks/useQueries';
import { EmptyState } from '@/components/common/EmptyState';
import { Skeleton } from '@/components/common/Skeleton';
import { MarketplaceCard } from '@/components/features/MarketplaceCard';
import { isReviewMode } from '@/config/reviewMode';

const fallbackMarketplace = [
  { id: 'm-1', title: 'Custom College Assignments & Practical Files', description: 'Handwritten or printed solutions tailored to your exact question list.', price: 149, category: 'Assignments' },
  { id: 'm-2', title: 'Complete Verified Lab Manual Solutions', description: 'Verified readings, diagrams, and code for computer and electrical labs.', price: 99, category: 'Lab Manuals' },
  { id: 'm-3', title: 'Final Year Minor / Major Projects with Source Code', description: 'Complete working software or hardware projects with synopsis and PPT.', price: 499, category: 'Projects' },
  { id: 'm-4', title: 'CAD / Engineering Drawing Sheet Preparation', description: 'AutoCAD designs and manual drawing sheet submissions.', price: 199, category: 'Drawings' },
];

export default function MarketplacePage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'popular' | 'price_asc' | 'price_desc'>('popular');
  const { data: services, isLoading } = useMarketplaceServices();

  const listToShow = services?.length ? services : fallbackMarketplace;
  const categories = ['All', 'Assignments', 'Lab Manuals', 'Projects', 'Drawings'];
  const filteredList = listToShow
    .filter((item) => {
      const matchesCat = selectedCategory === 'All' || (item.category || '').toLowerCase() === selectedCategory.toLowerCase();
      const matchesSearch = !searchQuery.trim() || (item.title || '').toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'price_asc') return Number(a.price) - Number(b.price);
      if (sortBy === 'price_desc') return Number(b.price) - Number(a.price);
      return 0;
    });

  return (
    <div className="page-shell animate-soft-in">
      <section className="grid gap-5 xl:grid-cols-[1fr_360px]">
        <div className="surface-card rounded-3xl p-6 sm:p-8">
          <p className="eyebrow"><Sparkles className="h-3.5 w-3.5" /> Academic marketplace</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
            Professional services for assignments, labs, drawings, and projects.
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
            Order verified academic support with clear pricing, delivery expectations, and a cleaner request workflow built for busy semester weeks.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {[
              [ShieldCheck, 'Verified experts'],
              [Truck, '24h delivery options'],
              [Zap, isReviewMode() ? 'Instant order processing' : 'Fast WhatsApp follow-up'],
            ].map(([Icon, label]) => (
              <span key={label as string} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700">
                <Icon className="h-4 w-4 text-blue-600" />
                {label as string}
              </span>
            ))}
          </div>
        </div>
        <div className="surface-card flex flex-col justify-between rounded-3xl p-6">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.12em] text-slate-400">Service desk</p>
            <h2 className="mt-2 text-2xl font-black text-slate-950">Need something custom?</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">Send the exact requirement and files through any service checkout.</p>
          </div>
          <Link href="/support" className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 text-sm font-bold text-white transition hover:bg-blue-700">
            Contact support <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <div className="sticky top-16 z-30 rounded-3xl border border-slate-200/80 bg-white/82 p-3 backdrop-blur-xl">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex gap-2 overflow-x-auto">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`h-10 shrink-0 rounded-xl px-4 text-xs font-bold transition ${
                  selectedCategory === category ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-600 hover:bg-blue-50 hover:text-blue-700'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative sm:w-72">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search services..."
                className="focus-ring h-10 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm font-semibold text-slate-900 transition focus:border-blue-300"
              />
            </div>
            <div className="relative">
              <SlidersHorizontal className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'popular' | 'price_asc' | 'price_desc')}
                aria-label="Sort marketplace services"
                className="focus-ring h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-8 text-sm font-bold text-slate-700 transition focus:border-blue-300 sm:w-52"
              >
                <option value="popular">Most popular</option>
                <option value="price_asc">Price low to high</option>
                <option value="price_desc">Price high to low</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => <Skeleton key={item} className="h-96 rounded-2xl" />)}
        </div>
      ) : filteredList.length === 0 ? (
        <EmptyState
          icon={ShoppingBag}
          title="No services match your filters"
          description="Try another category or reset the search field."
          action={
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="inline-flex h-11 items-center gap-2 rounded-2xl bg-slate-950 px-5 text-sm font-bold text-white transition hover:bg-blue-700"
            >
              <Filter className="h-4 w-4" /> Reset filters
            </button>
          }
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {filteredList.map((item) => <MarketplaceCard key={item.id} product={item} />)}
        </div>
      )}
    </div>
  );
}
