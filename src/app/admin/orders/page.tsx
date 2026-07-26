'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import {
  ArrowLeft, CheckCircle2, Clock, CreditCard, Filter,
  Loader2, Package, RefreshCw, Search, Sparkles, Truck, XCircle
} from 'lucide-react';
import { Card } from '@/components/common/Card';
import { Skeleton } from '@/components/common/Skeleton';
import { EmptyState } from '@/components/common/EmptyState';
import { useToast } from '@/contexts/ToastContext';
import { supabase } from '@/services/supabase';

interface AdminOrder {
  id: string;
  product_id: string;
  user_id?: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  requirement?: string;
  college_name?: string;
  payment_method?: string;
  payment_status?: string;
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  transaction_time?: string;
  status?: string;
  created_at?: string;
  products?: {
    title?: string;
    price?: number | string;
    thumbnail_url?: string;
  };
}

const ORDER_STATUSES = ['pending', 'contacted', 'in_progress', 'completed', 'cancelled'] as const;

function statusBadge(status?: string) {
  const map: Record<string, string> = {
    pending: 'bg-amber-50 text-amber-700',
    contacted: 'bg-sky-50 text-sky-700',
    in_progress: 'bg-violet-50 text-violet-700',
    completed: 'bg-emerald-50 text-emerald-700',
    cancelled: 'bg-slate-100 text-slate-500',
  };
  return map[status || 'pending'] || map.pending;
}

function paymentStatusColor(status?: string) {
  switch (status) {
    case 'paid': return 'bg-emerald-50 text-emerald-700';
    case 'failed': return 'bg-rose-50 text-rose-700';
    default: return 'bg-amber-50 text-amber-700';
  }
}

export default function AdminOrdersPage() {
  const { showToast } = useToast();
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  // Filters
  const [paymentMethodFilter, setPaymentMethodFilter] = useState<string>('all');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchOrders = useCallback(async () => {
    let query = supabase
      .from('orders')
      .select('*, products(title, price, thumbnail_url)')
      .order('created_at', { ascending: false })
      .limit(200);

    if (paymentMethodFilter !== 'all') {
      query = query.eq('payment_method', paymentMethodFilter);
    }
    if (paymentStatusFilter !== 'all') {
      query = query.eq('payment_status', paymentStatusFilter);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching admin orders:', error);
      showToast({ type: 'error', title: 'Failed to load orders', message: error.message });
      return;
    }
    setOrders(data || []);
  }, [paymentMethodFilter, paymentStatusFilter, showToast]);

  useEffect(() => {
    setIsLoading(true);
    fetchOrders().finally(() => setIsLoading(false));
  }, [fetchOrders]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchOrders();
    setIsRefreshing(false);
  };

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    setUpdatingOrderId(orderId);
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', orderId);

    if (error) {
      showToast({ type: 'error', title: 'Update failed', message: error.message });
    } else {
      showToast({ type: 'success', title: 'Order updated', message: `Status changed to ${newStatus}` });
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
    }
    setUpdatingOrderId(null);
  };

  // Client-side search filter
  const filteredOrders = orders.filter((o) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      (o.customer_name || '').toLowerCase().includes(q) ||
      (o.customer_email || '').toLowerCase().includes(q) ||
      (o.customer_phone || '').includes(q) ||
      (o.products?.title || '').toLowerCase().includes(q) ||
      (o.razorpay_payment_id || '').toLowerCase().includes(q) ||
      (o.razorpay_order_id || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="page-shell animate-soft-in">
      {/* Header */}
      <section className="surface-card rounded-3xl p-6 sm:p-8">
        <Link href="/admin" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 transition hover:text-blue-700 mb-4">
          <ArrowLeft className="h-4 w-4" /> Admin Panel
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="eyebrow"><Sparkles className="h-3.5 w-3.5" /> Admin</p>
            <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">All Orders</h1>
          </div>
          <button
            onClick={handleRefresh}
            disabled={isLoading || isRefreshing}
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 self-start sm:self-auto"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin text-blue-600' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Filters */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent outline-none placeholder:text-slate-400 w-48"
            />
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm">
            <Filter className="h-4 w-4 text-slate-400" />
            <select
              value={paymentMethodFilter}
              onChange={(e) => setPaymentMethodFilter(e.target.value)}
              className="bg-transparent outline-none text-slate-700 font-medium cursor-pointer"
            >
              <option value="all">All Methods</option>
              <option value="cod">COD</option>
              <option value="online">Online</option>
            </select>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm">
            <Filter className="h-4 w-4 text-slate-400" />
            <select
              value={paymentStatusFilter}
              onChange={(e) => setPaymentStatusFilter(e.target.value)}
              className="bg-transparent outline-none text-slate-700 font-medium cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="paid">Paid</option>
              <option value="cod_pending">COD Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          <span className="text-xs font-bold text-slate-400">{filteredOrders.length} orders</span>
        </div>
      </section>

      {/* Orders List */}
      {isLoading ? (
        <div className="space-y-4">{[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-40 rounded-2xl" />)}</div>
      ) : filteredOrders.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No orders found"
          description="No orders match your current filters."
        />
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <Card key={order.id} className="space-y-4">
              {/* Top row: badges */}
              <div className="flex flex-wrap items-center gap-2">
                <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.08em] ${statusBadge(order.status)}`}>
                  {order.status === 'completed' ? <CheckCircle2 className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                  {order.status || 'pending'}
                </span>
                <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.08em] ${order.payment_method === 'online' ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>
                  {order.payment_method === 'online' ? <CreditCard className="h-3 w-3" /> : <Truck className="h-3 w-3" />}
                  {order.payment_method || 'cod'}
                </span>
                <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.08em] ${paymentStatusColor(order.payment_status)}`}>
                  {order.payment_status === 'paid' ? <CheckCircle2 className="h-3 w-3" /> : order.payment_status === 'failed' ? <XCircle className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                  {order.payment_status || 'cod_pending'}
                </span>
              </div>

              {/* Content grid */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {/* Customer */}
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.08em] text-slate-400">Customer</p>
                  <p className="mt-1 text-sm font-bold text-slate-950">{order.customer_name}</p>
                  <p className="text-xs text-slate-500">{order.customer_email}</p>
                  <p className="text-xs text-slate-500">{order.customer_phone}</p>
                  {order.college_name && <p className="text-xs text-slate-400">{order.college_name}</p>}
                </div>

                {/* Product */}
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.08em] text-slate-400">Product</p>
                  <p className="mt-1 text-sm font-bold text-slate-950">{order.products?.title || 'Unknown'}</p>
                  <p className="text-sm font-black text-blue-700">Rs. {order.products?.price || '—'}</p>
                </div>

                {/* Payment IDs */}
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.08em] text-slate-400">Payment Details</p>
                  {order.razorpay_payment_id && (
                    <p className="mt-1 font-mono text-xs text-slate-600">Pay: {order.razorpay_payment_id}</p>
                  )}
                  {order.razorpay_order_id && (
                    <p className="font-mono text-xs text-slate-500">Order: {order.razorpay_order_id}</p>
                  )}
                  {order.transaction_time && (
                    <p className="text-xs text-slate-400">
                      {new Date(order.transaction_time).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                    </p>
                  )}
                  {!order.razorpay_payment_id && !order.razorpay_order_id && (
                    <p className="mt-1 text-xs text-slate-400">Cash on Delivery</p>
                  )}
                </div>
              </div>

              {/* Requirement */}
              {order.requirement && (
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.08em] text-slate-400">Requirement</p>
                  <p className="mt-1 text-sm text-slate-700 line-clamp-2">{order.requirement}</p>
                </div>
              )}

              {/* Status update */}
              <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3">
                <span className="text-xs font-bold text-slate-400 mr-1">Update status:</span>
                {ORDER_STATUSES.map((s) => (
                  <button
                    key={s}
                    disabled={order.status === s || updatingOrderId === order.id}
                    onClick={() => handleStatusUpdate(order.id, s)}
                    className={`rounded-lg px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider transition ${
                      order.status === s
                        ? 'bg-slate-950 text-white cursor-default'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200 cursor-pointer'
                    } ${updatingOrderId === order.id ? 'opacity-50' : ''}`}
                  >
                    {updatingOrderId === order.id && order.status !== s ? (
                      <Loader2 className="h-3 w-3 animate-spin inline" />
                    ) : (
                      s.replace('_', ' ')
                    )}
                  </button>
                ))}
              </div>

              {/* Timestamp */}
              <p className="text-[10px] text-slate-400">
                Created {order.created_at ? new Date(order.created_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : 'recently'}
              </p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
