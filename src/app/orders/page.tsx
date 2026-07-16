'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Clock, PackageCheck, ShoppingBag, Sparkles } from 'lucide-react';
import { Card } from '@/components/common/Card';
import { EmptyState } from '@/components/common/EmptyState';
import { Skeleton } from '@/components/common/Skeleton';
import { useUserOrders } from '@/hooks/useQueries';
import { getCurrentSession } from '@/services/auth';
import { isReviewMode } from '@/config/reviewMode';

export default function MyOrdersPage() {
  const [userId, setUserId] = useState<string | undefined>(undefined);

  useEffect(() => {
    getCurrentSession().then((session) => {
      if (session?.user?.id) setUserId(session.user.id);
    });
  }, []);

  const { data: orders, isLoading } = useUserOrders(userId);

  return (
    <div className="page-shell animate-soft-in">
      <section className="surface-card rounded-3xl p-6 sm:p-8">
        <p className="eyebrow"><Sparkles className="h-3.5 w-3.5" /> Service desk</p>
        <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">Orders and requests</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
          Track assignment files, lab manuals, project packages, and delivery status from one workspace.
        </p>
      </section>

      {!userId ? (
        <EmptyState
          icon={PackageCheck}
          title="Sign in to view orders"
          description={isReviewMode() ? "Log into your account to monitor status updates and access your deliverables." : "Log into your account to monitor status updates and communicate with experts."}
          action={<Link href="/profile" className="inline-flex h-11 items-center gap-2 rounded-2xl bg-blue-600 px-5 text-sm font-bold text-white transition hover:bg-blue-700">Go to profile <ArrowRight className="h-4 w-4" /></Link>}
        />
      ) : isLoading ? (
        <div className="space-y-4">{[1, 2, 3].map((item) => <Skeleton key={item} className="h-32 rounded-2xl" />)}</div>
      ) : !orders?.length ? (
        <EmptyState
          icon={ShoppingBag}
          title="No orders yet"
          description="You have not requested any custom assignment or lab manual service yet."
          action={<Link href="/marketplace" className="inline-flex h-11 items-center gap-2 rounded-2xl bg-blue-600 px-5 text-sm font-bold text-white transition hover:bg-blue-700">Browse marketplace <ArrowRight className="h-4 w-4" /></Link>}
        />
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const completed = order.status === 'completed';
            return (
              <Card key={order.id} className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.08em] ${completed ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                      {completed ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Clock className="h-3.5 w-3.5" />}
                      {order.status || 'Pending'}
                    </span>
                    <span className="text-xs font-semibold text-slate-400">Placed {order.created_at ? new Date(order.created_at).toLocaleDateString() : 'recently'}</span>
                  </div>
                  <h2 className="mt-3 text-lg font-black text-slate-950">{order.products?.title || 'Custom service'}</h2>
                  {order.requirement && <p className="mt-1 line-clamp-1 max-w-2xl text-sm text-slate-600">{order.requirement}</p>}
                </div>
                <div className="flex items-center justify-between gap-4 border-t border-slate-100 pt-4 sm:block sm:border-0 sm:pt-0 sm:text-right">
                  <span className="text-xl font-black text-slate-950">Rs. {order.products?.price || '---'}</span>
                  <Link href="/support" className="block text-sm font-bold text-blue-700">Need help?</Link>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
