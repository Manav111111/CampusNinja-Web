'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, CheckCircle2, CreditCard, FileText, Loader2,
  LucideIcon, Mail, Phone, School, ShieldCheck, Sparkles,
  Truck, Upload, User, Wallet, XCircle
} from 'lucide-react';
import { Card } from '@/components/common/Card';
import { useToast } from '@/contexts/ToastContext';
import { useMarketplaceServices } from '@/hooks/useQueries';
import { useQueryClient } from '@tanstack/react-query';
import { getCurrentSession, performGoogleLogin } from '@/services/auth';
import { createOrder, uploadOrderFileWeb } from '@/services/supabase';
import { isReviewMode } from '@/config/reviewMode';

// ── Razorpay SDK type declarations ────────────────────────────
interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill: { name: string; email: string; contact: string };
  theme: { color: string };
  modal: { ondismiss: () => void };
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => { open: () => void };
  }
}

// ── Load Razorpay SDK script ──────────────────────────────────
function useRazorpayScript() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.Razorpay) {
      setLoaded(true);
      return;
    }

    const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
    if (existingScript) {
      existingScript.addEventListener('load', () => setLoaded(true));
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => setLoaded(true);
    script.onerror = () => console.error('Failed to load Razorpay SDK');
    document.body.appendChild(script);
  }, []);

  return loaded;
}

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
    payment_methods: ['cod', 'online'],
  };

  const razorpayReady = useRazorpayScript();

  // Determine enabled payment methods
  const paymentMethods: string[] = product.payment_methods || ['cod', 'online'];
  const codEnabled = paymentMethods.includes('cod');
  const onlineEnabled = paymentMethods.includes('online');

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [collegeName, setCollegeName] = useState('');
  const [requirement, setRequirement] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmittingCOD, setIsSubmittingCOD] = useState(false);
  const [isSubmittingOnline, setIsSubmittingOnline] = useState(false);
  const isSubmitting = isSubmittingCOD || isSubmittingOnline;

  // Duplicate submission guard
  const submittingRef = useRef(false);

  const validateForm = useCallback((): boolean => {
    if (!customerName.trim()) {
      showToast({ type: 'error', title: 'Missing name', message: 'Please enter your full name.' });
      return false;
    }
    if (!customerPhone.trim()) {
      showToast({ type: 'error', title: 'Missing phone', message: 'Please enter your phone number.' });
      return false;
    }
    if (!customerEmail.trim()) {
      showToast({ type: 'error', title: 'Missing email', message: 'Please enter your email address.' });
      return false;
    }
    if (!requirement.trim()) {
      showToast({ type: 'error', title: 'Missing requirements', message: 'Please describe what you need.' });
      return false;
    }
    return true;
  }, [customerName, customerPhone, customerEmail, requirement, showToast]);

  const getSessionOrRedirect = useCallback(async () => {
    const session = await getCurrentSession();
    if (!session || !session.user?.id) {
      showToast({
        type: 'info',
        title: 'Sign in required',
        message: 'You must be signed in to submit orders. Redirecting to secure login...'
      });
      await performGoogleLogin(typeof window !== 'undefined' ? window.location.pathname : '/profile');
      return null;
    }
    return session;
  }, [showToast]);

  // ── COD Order Flow ──────────────────────────────────────────
  const handleCODOrder = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateForm() || submittingRef.current) return;

    submittingRef.current = true;
    setIsSubmittingCOD(true);

    try {
      const session = await getSessionOrRedirect();
      if (!session) { submittingRef.current = false; setIsSubmittingCOD(false); return; }

      const fileUrl = selectedFile ? await uploadOrderFileWeb(selectedFile) : null;

      await createOrder({
        product_id: product.id,
        user_id: session.user.id,
        customer_name: customerName.trim(),
        customer_phone: customerPhone.trim(),
        customer_email: customerEmail.trim(),
        college_name: collegeName.trim() || null,
        requirement: requirement.trim(),
        payment_method: 'cod',
        payment_status: 'cod_pending',
        file_url: fileUrl,
      });

      showToast({
        type: 'success',
        title: 'Order placed!',
        message: isReviewMode()
          ? 'Our academic team will process your order soon.'
          : 'Our academic expert will contact you via WhatsApp soon.',
      });
      await queryClient.invalidateQueries({ queryKey: ['user-orders'] });
      router.push('/orders');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Please try again.';
      showToast({ type: 'error', title: 'Order failed', message });
    } finally {
      submittingRef.current = false;
      setIsSubmittingCOD(false);
    }
  };

  // ── Online Payment Flow ─────────────────────────────────────
  const handleOnlinePayment = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateForm() || submittingRef.current) return;

    if (!razorpayReady) {
      showToast({ type: 'error', title: 'Payment unavailable', message: 'Payment gateway is loading. Please try again in a moment.' });
      return;
    }

    submittingRef.current = true;
    setIsSubmittingOnline(true);

    try {
      const session = await getSessionOrRedirect();
      if (!session) { submittingRef.current = false; setIsSubmittingOnline(false); return; }

      const fileUrl = selectedFile ? await uploadOrderFileWeb(selectedFile) : null;

      // Step 1: Create Razorpay order from backend
      const createResponse = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_id: product.id }),
      });

      if (!createResponse.ok) {
        const errData = await createResponse.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to create payment order');
      }

      const orderData = await createResponse.json();

      // Step 2: Open Razorpay Checkout
      const options: RazorpayOptions = {
        key: orderData.key_id,
        amount: orderData.amount,
        currency: orderData.currency || 'INR',
        name: 'CampusNinja',
        description: product.title,
        order_id: orderData.order_id,
        handler: async (response: RazorpayResponse) => {
          // Step 3: Verify payment on backend
          try {
            const verifyResponse = await fetch('/api/razorpay/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                product_id: product.id,
                user_id: session.user.id,
                customer_name: customerName.trim(),
                customer_phone: customerPhone.trim(),
                customer_email: customerEmail.trim(),
                college_name: collegeName.trim() || null,
                requirement: requirement.trim(),
                file_url: fileUrl,
              }),
            });

            const verifyData = await verifyResponse.json();

            if (!verifyResponse.ok) {
              throw new Error(verifyData.error || 'Payment verification failed');
            }

            showToast({
              type: 'success',
              title: 'Payment successful!',
              message: `Order confirmed. Payment ID: ${response.razorpay_payment_id}`,
            });
            await queryClient.invalidateQueries({ queryKey: ['user-orders'] });
            router.push('/orders');
          } catch (verifyError: unknown) {
            const msg = verifyError instanceof Error ? verifyError.message : 'Verification failed';
            showToast({
              type: 'error',
              title: 'Payment verification failed',
              message: `${msg}. If money was deducted, contact support.`,
            });
          } finally {
            submittingRef.current = false;
            setIsSubmittingOnline(false);
          }
        },
        prefill: {
          name: customerName.trim(),
          email: customerEmail.trim(),
          contact: customerPhone.trim(),
        },
        theme: { color: '#12233F' },
        modal: {
          ondismiss: () => {
            submittingRef.current = false;
            setIsSubmittingOnline(false);
            showToast({
              type: 'info',
              title: 'Payment cancelled',
              message: 'You closed the payment window. No charges were made.',
            });
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error: unknown) {
      submittingRef.current = false;
      setIsSubmittingOnline(false);
      const message = error instanceof Error ? error.message : 'Please try again.';
      showToast({ type: 'error', title: 'Payment failed', message });
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

          {/* Payment methods indicator */}
          <Card className="space-y-3">
            <h2 className="flex items-center gap-2 text-sm font-black text-slate-950">
              <Wallet className="h-4 w-4 text-blue-600" /> Payment options
            </h2>
            {codEnabled && (
              <p className="flex items-center gap-2 text-sm text-slate-600">
                <Truck className="h-4 w-4 text-emerald-500" /> Cash on Delivery available
              </p>
            )}
            {onlineEnabled && (
              <p className="flex items-center gap-2 text-sm text-slate-600">
                <CreditCard className="h-4 w-4 text-blue-500" /> Online Payment (UPI, Cards, Wallets)
              </p>
            )}
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

          <form onSubmit={(e) => e.preventDefault()} className="mt-6 space-y-4">
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

            {/* ── Payment Buttons ──────────────────────────────── */}
            <div className="flex flex-col gap-3 pt-2">
              {codEnabled && (
                <button
                  type="button"
                  onClick={handleCODOrder}
                  disabled={isSubmitting}
                  className={`flex h-12 w-full items-center justify-center gap-2 rounded-2xl text-sm font-bold text-white transition ${
                    isSubmitting
                      ? 'cursor-not-allowed bg-slate-400'
                      : 'bg-emerald-600 hover:bg-emerald-700'
                  }`}
                >
                  {isSubmittingCOD ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Placing order...</>
                  ) : (
                    <><Truck className="h-4 w-4" /> {onlineEnabled ? 'Buy with Cash on Delivery' : `Confirm request — pay Rs. ${product.price} on delivery`}</>
                  )}
                </button>
              )}

              {onlineEnabled && (
                <button
                  type="button"
                  onClick={handleOnlinePayment}
                  disabled={isSubmitting}
                  className={`flex h-12 w-full items-center justify-center gap-2 rounded-2xl text-sm font-bold text-white transition ${
                    isSubmitting
                      ? 'cursor-not-allowed bg-slate-400'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {isSubmittingOnline ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Processing payment...</>
                  ) : (
                    <><CreditCard className="h-4 w-4" /> {codEnabled ? 'Pay Online' : `Pay Rs. ${product.price} Online`}</>
                  )}
                </button>
              )}
            </div>
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
