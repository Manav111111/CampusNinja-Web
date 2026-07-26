'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Clock, CreditCard, PackageCheck, RefreshCw, ShoppingBag, Sparkles, Truck, XCircle } from 'lucide-react';
import { Card } from '@/components/common/Card';
import { EmptyState } from '@/components/common/EmptyState';
import { Skeleton } from '@/components/common/Skeleton';
import { useUserOrders } from '@/hooks/useQueries';
import { getCurrentSession } from '@/services/auth';
import { supabase } from '@/services/supabase';
import { isReviewMode } from '@/config/reviewMode';

// ── Payment badge helpers ─────────────────────────────────────
function paymentMethodBadge(method?: string) {
  if (method === 'online') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.08em] text-blue-700">
        <CreditCard className="h-3 w-3" /> Online
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.08em] text-slate-600">
      <Truck className="h-3 w-3" /> COD
    </span>
  );
}

function paymentStatusBadge(status?: string) {
  switch (status) {
    case 'paid':
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.08em] text-emerald-700">
          <CheckCircle2 className="h-3 w-3" /> Paid
        </span>
      );
    case 'failed':
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.08em] text-rose-700">
          <XCircle className="h-3 w-3" /> Failed
        </span>
      );
    case 'cod_pending':
    default:
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.08em] text-amber-700">
          <Clock className="h-3 w-3" /> Pending
        </span>
      );
  }
}

export default function MyOrdersPage() {
  const [userId, setUserId] = useState<string | undefined>(undefined);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    let mounted = true;
    getCurrentSession().then((session) => {
      if (!mounted) return;
      setUserId(session?.user?.id || undefined);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;
      setUserId(session?.user?.id || undefined);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const { data: orders, isLoading, refetch } = useUserOrders(userId);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };

  return (
    <div className="page-shell animate-soft-in">
      <section className="surface-card rounded-3xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="eyebrow"><Sparkles className="h-3.5 w-3.5" /> Service desk</p>
            <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">Orders and requests</h1>
          </div>
          {userId && (
            <button
              onClick={handleRefresh}
              disabled={isLoading || isRefreshing}
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 self-start sm:self-auto"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing || isLoading ? 'animate-spin text-blue-600' : ''}`} />
              Refresh
            </button>
          )}
        </div>
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
              <Card key={order.id} className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex-1">
                  {/* Status badges row */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.08em] ${completed ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                      {completed ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Clock className="h-3.5 w-3.5" />}
                      {order.status || 'Pending'}
                    </span>
                    {paymentMethodBadge(order.payment_method)}
                    {paymentStatusBadge(order.payment_status)}
                  </div>

                  <h2 className="mt-3 text-lg font-black text-slate-950">{order.products?.title || 'Custom service'}</h2>
                  {order.requirement && <p className="mt-1 line-clamp-1 max-w-2xl text-sm text-slate-600">{order.requirement}</p>}

                  {/* Payment details */}
                  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">
                    <span>Placed {order.created_at ? new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'recently'}</span>
                    {order.razorpay_payment_id && (
                      <span className="font-mono text-[10px]">Pay ID: {order.razorpay_payment_id}</span>
                    )}
                    {order.transaction_time && (
                      <span>Paid on {new Date(order.transaction_time).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4 border-t border-slate-100 pt-4 sm:block sm:shrink-0 sm:border-0 sm:pt-0 sm:text-right">
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
