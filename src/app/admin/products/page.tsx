'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import {
  ArrowLeft, CheckCircle2, CreditCard, Edit3, Loader2,
  Package, RefreshCw, Save, Sparkles, Truck, X
} from 'lucide-react';
import { Card } from '@/components/common/Card';
import { Skeleton } from '@/components/common/Skeleton';
import { EmptyState } from '@/components/common/EmptyState';
import { useToast } from '@/contexts/ToastContext';
import { supabase } from '@/services/supabase';

interface AdminProduct {
  id: string;
  title: string;
  description?: string;
  price: number | string;
  category?: string;
  thumbnail_url?: string;
  is_active?: boolean;
  payment_methods?: string[];
  created_at?: string;
}

export default function AdminProductsPage() {
  const { showToast } = useToast();
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editPaymentMethods, setEditPaymentMethods] = useState<string[]>([]);
  const [savingProductId, setSavingProductId] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching products:', error);
      showToast({ type: 'error', title: 'Failed to load products', message: error.message });
      return;
    }
    setProducts(data || []);
  }, [showToast]);

  useEffect(() => {
    setIsLoading(true);
    fetchProducts().finally(() => setIsLoading(false));
  }, [fetchProducts]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchProducts();
    setIsRefreshing(false);
  };

  const startEditing = (product: AdminProduct) => {
    setEditingProductId(product.id);
    setEditPaymentMethods(product.payment_methods || ['cod', 'online']);
  };

  const cancelEditing = () => {
    setEditingProductId(null);
    setEditPaymentMethods([]);
  };

  const togglePaymentMethod = (method: string) => {
    setEditPaymentMethods((prev) => {
      if (prev.includes(method)) {
        const next = prev.filter((m) => m !== method);
        // At least one method must be selected
        return next.length > 0 ? next : prev;
      }
      return [...prev, method];
    });
  };

  const handleSave = async (productId: string) => {
    if (editPaymentMethods.length === 0) {
      showToast({ type: 'error', title: 'Validation error', message: 'At least one payment method must be selected.' });
      return;
    }

    setSavingProductId(productId);
    const { error } = await supabase
      .from('products')
      .update({ payment_methods: editPaymentMethods })
      .eq('id', productId);

    if (error) {
      showToast({ type: 'error', title: 'Update failed', message: error.message });
    } else {
      showToast({ type: 'success', title: 'Payment methods updated', message: `Now accepting: ${editPaymentMethods.join(', ')}` });
      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, payment_methods: editPaymentMethods } : p))
      );
      setEditingProductId(null);
    }
    setSavingProductId(null);
  };

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
            <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">Products & Payment Methods</h1>
            <p className="mt-2 text-sm text-slate-600">Configure which payment methods are available for each product.</p>
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
      </section>

      {/* Products List */}
      {isLoading ? (
        <div className="space-y-4">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-28 rounded-2xl" />)}</div>
      ) : products.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No products found"
          description="Add products via the Supabase Dashboard."
        />
      ) : (
        <div className="space-y-4">
          {products.map((product) => {
            const isEditing = editingProductId === product.id;
            const currentMethods: string[] = product.payment_methods || ['cod', 'online'];

            return (
              <Card key={product.id} className="space-y-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      {product.category && (
                        <span className="inline-flex rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-[0.08em] text-blue-700">
                          {product.category}
                        </span>
                      )}
                      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-[0.08em] ${product.is_active !== false ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                        {product.is_active !== false ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <h2 className="mt-2 text-lg font-black text-slate-950">{product.title}</h2>
                    {product.description && (
                      <p className="mt-1 text-sm text-slate-600 line-clamp-1">{product.description}</p>
                    )}
                    <p className="mt-1 text-xl font-black text-blue-700">Rs. {product.price}</p>
                  </div>

                  {/* Payment Methods Display / Edit */}
                  <div className="sm:min-w-[260px]">
                    <p className="text-[10px] font-black uppercase tracking-[0.08em] text-slate-400 mb-2">Payment Methods</p>

                    {isEditing ? (
                      <div className="space-y-3">
                        <label className="flex items-center gap-3 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={editPaymentMethods.includes('cod')}
                            onChange={() => togglePaymentMethod('cod')}
                            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                          />
                          <span className="flex items-center gap-1.5 text-sm font-medium text-slate-700 group-hover:text-slate-950">
                            <Truck className="h-3.5 w-3.5 text-emerald-500" /> Cash on Delivery
                          </span>
                        </label>

                        <label className="flex items-center gap-3 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={editPaymentMethods.includes('online')}
                            onChange={() => togglePaymentMethod('online')}
                            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                          />
                          <span className="flex items-center gap-1.5 text-sm font-medium text-slate-700 group-hover:text-slate-950">
                            <CreditCard className="h-3.5 w-3.5 text-blue-500" /> Online Payment (Razorpay)
                          </span>
                        </label>

                        {editPaymentMethods.length === 0 && (
                          <p className="text-xs text-rose-500 font-medium">At least one method must be selected</p>
                        )}

                        <div className="flex items-center gap-2 pt-1">
                          <button
                            onClick={() => handleSave(product.id)}
                            disabled={savingProductId === product.id || editPaymentMethods.length === 0}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-1.5 text-xs font-bold text-white transition hover:bg-blue-700 disabled:opacity-50"
                          >
                            {savingProductId === product.id ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <Save className="h-3.5 w-3.5" />
                            )}
                            Save
                          </button>
                          <button
                            onClick={cancelEditing}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-bold text-slate-600 transition hover:bg-slate-50"
                          >
                            <X className="h-3.5 w-3.5" /> Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-wrap items-center gap-2">
                        {currentMethods.includes('cod') && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.08em] text-slate-600">
                            <Truck className="h-3 w-3" /> COD
                          </span>
                        )}
                        {currentMethods.includes('online') && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.08em] text-blue-700">
                            <CreditCard className="h-3 w-3" /> Online
                          </span>
                        )}
                        <button
                          onClick={() => startEditing(product)}
                          className="inline-flex items-center gap-1 rounded-lg bg-slate-50 px-2 py-1 text-[10px] font-bold text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
                        >
                          <Edit3 className="h-3 w-3" /> Edit
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
