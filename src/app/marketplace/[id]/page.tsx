'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, FileText, LucideIcon, Mail, Phone, School, ShieldCheck, Sparkles, Upload, User } from 'lucide-react';
import { Card } from '@/components/common/Card';
import { useToast } from '@/contexts/ToastContext';
import { useMarketplaceServices } from '@/hooks/useQueries';
import { useQueryClient } from '@tanstack/react-query';
import { getCurrentSession, performGoogleLogin } from '@/services/auth';
import { createOrder, uploadOrderFileWeb } from '@/services/supabase';
import { isReviewMode } from '@/config/reviewMode';

export default function MarketplaceOrderPage() {
  const params = useParams();
  const router = useRouter();
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const productId = typeof params?.id === 'string' ? params.id : Array.isArray(params?.id) ? params.id[0] : 'm-1';
  const { data: services } = useMarketplaceServices();
  const product = services?.find((service) => service.id === productId) || {
    id: productId || 'm-1',
    title: 'Custom College Service Request',
    price: '149',
    description: 'Provide your questions or instruction manual below for rapid verified submission.',
    category: 'Academic Help',
  };

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [collegeName, setCollegeName] = useState('');
  const [requirement, setRequirement] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitOrder = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!customerName || !customerPhone || !customerEmail || !requirement) {
      showToast({ type: 'error', title: 'Missing details', message: 'Fill in name, phone, email, and requirements.' });
      return;
    }
    setIsSubmitting(true);
    try {
      const session = await getCurrentSession();
      if (!session || !session.user?.id) {
        showToast({
          type: 'info',
          title: 'Sign in required',
          message: 'You must be signed in to submit orders. Redirecting to secure login...'
        });
        await performGoogleLogin(typeof window !== 'undefined' ? window.location.pathname : '/profile');
        return;
      }

      const fileUrl = selectedFile ? await uploadOrderFileWeb(selectedFile) : null;
      await createOrder({
        product_id: product.id,
        user_id: session.user.id,
        customer_name: customerName,
        customer_phone: customerPhone,
        customer_email: customerEmail,
        college_name: collegeName,
        requirement,
        payment_method: 'cod',
        file_url: fileUrl,
      });
      showToast({
        type: 'success',
        title: 'Order placed',
        message: isReviewMode()
          ? 'Our academic team will process your order soon.'
          : 'Our academic expert will contact you via WhatsApp soon.'
      });
      await queryClient.invalidateQueries({ queryKey: ['user-orders'] });
      router.push('/orders');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Please try again.';
      showToast({ type: 'error', title: 'Order submission failed', message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-shell animate-soft-in">
      <Link href="/marketplace" className="inline-flex w-fit items-center gap-2 text-sm font-bold text-slate-500 transition hover:text-blue-700">
        <ArrowLeft className="h-4 w-4" /> Back to marketplace
      </Link>

      <section className="grid gap-5 lg:grid-cols-[360px_1fr]">
        <div className="space-y-5">
          <Card className="bg-slate-950 text-white">
            <p className="inline-flex rounded-full bg-white/10 px-3 py-1 text-[11px] font-black uppercase tracking-[0.08em] text-blue-200">{product.category || 'Service'}</p>
            <h1 className="mt-5 text-2xl font-black tracking-tight text-white">{product.title}</h1>
            <p className="mt-3 text-sm leading-6 text-slate-300">{product.description}</p>
            <div className="mt-6 flex items-end justify-between border-t border-white/10 pt-5">
              <span className="text-sm font-bold text-slate-400">Total</span>
              <span className="text-3xl font-black text-white">Rs. {product.price}</span>
            </div>
          </Card>
          <Card className="space-y-3">
            <h2 className="flex items-center gap-2 text-sm font-black text-slate-950"><ShieldCheck className="h-4 w-4 text-blue-600" /> Why order here?</h2>
            {['Verified subject specialists', 'Confidential request handling', 'Revisions when requirements change'].map((item) => (
              <p key={item} className="flex items-center gap-2 text-sm text-slate-600"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> {item}</p>
            ))}
          </Card>
        </div>

        <Card className="p-6 sm:p-8">
          <p className="eyebrow"><Sparkles className="h-3.5 w-3.5" /> Request form</p>
          <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950">Submit service request</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">Attach reference files and describe the exact output you need.</p>

          <form onSubmit={handleSubmitOrder} className="mt-6 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field icon={User} label="Full name" required value={customerName} onChange={setCustomerName} placeholder="Rahul Sharma" />
              <Field icon={Phone} label={isReviewMode() ? "Phone number" : "WhatsApp number"} required value={customerPhone} onChange={setCustomerPhone} placeholder="+91 9876543210" />
              <Field icon={Mail} label="Email address" required type="email" value={customerEmail} onChange={setCustomerEmail} placeholder="rahul@college.edu" />
              <Field icon={School} label="College name" value={collegeName} onChange={setCollegeName} placeholder="College or university" />
            </div>

            <label className="block">
              <span className="mb-1.5 flex items-center gap-2 text-xs font-black uppercase tracking-[0.08em] text-slate-500"><FileText className="h-3.5 w-3.5" /> Instructions *</span>
              <textarea
                rows={5}
                required
                value={requirement}
                onChange={(event) => setRequirement(event.target.value)}
                placeholder="Mention experiment titles, deadline, formatting, code language, or any faculty instructions..."
                className="focus-ring w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-950 transition focus:border-blue-300"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 flex items-center gap-2 text-xs font-black uppercase tracking-[0.08em] text-slate-500"><Upload className="h-3.5 w-3.5" /> Attach reference file</span>
              <input
                type="file"
                onChange={(event) => setSelectedFile(event.target.files?.[0] || null)}
                className="w-full rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600 file:mr-4 file:rounded-xl file:border-0 file:bg-slate-950 file:px-4 file:py-2 file:text-xs file:font-bold file:text-white"
              />
            </label>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`h-12 w-full rounded-2xl text-sm font-bold text-white transition ${isSubmitting ? 'cursor-not-allowed bg-slate-400' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              {isSubmitting ? 'Submitting request...' : `Confirm request - pay Rs. ${product.price} on delivery`}
            </button>
          </form>
        </Card>
      </section>
    </div>
  );
}

function Field({
  icon: Icon,
  label,
  required,
  value,
  onChange,
  placeholder,
  type = 'text',
}: {
  icon: LucideIcon;
  label: string;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center gap-2 text-xs font-black uppercase tracking-[0.08em] text-slate-500">
        <Icon className="h-3.5 w-3.5" /> {label}{required ? ' *' : ''}
      </span>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="focus-ring h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-950 transition focus:border-blue-300"
      />
    </label>
  );
}
