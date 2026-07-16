'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, RefreshCw } from 'lucide-react';

export default function RefundPolicyPage() {
  return (
    <div className="page-shell animate-soft-in">
      <div>
        <Link
          href="/"
          className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-[var(--muted)] transition hover:text-[var(--ink)]"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Link>

        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--brand-50)] text-[var(--brand)]">
            <RefreshCw className="h-6 w-6" />
          </div>
          <div>
            <h1 className="font-display text-3xl font-bold tracking-tight text-[var(--ink)] sm:text-4xl">
              Refund &amp; Cancellation Policy
            </h1>
            <p className="mt-1 text-sm text-[var(--muted)]">
              Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 space-y-6">
        <section className="surface-card rounded-xl p-6 sm:p-8">
          <h2 className="font-display text-xl font-bold tracking-tight text-[var(--ink)]">
            1. Digital Products (Instant Downloads)
          </h2>
          <p className="mt-3 text-[15px] leading-7 text-[var(--muted)]">
            Because CampusNinja delivers downloadable digital study resources (such as PDF notes, previous year question paper solutions, and calculation utilities) immediately upon successful online payment authorization via Razorpay, our general policy states that instant digital downloads are non-refundable once accessed or downloaded.
          </p>
        </section>

        <section className="surface-card rounded-xl p-6 sm:p-8">
          <h2 className="font-display text-xl font-bold tracking-tight text-[var(--ink)]">
            2. Custom Academic Services &amp; Order Cancellations
          </h2>
          <p className="mt-3 text-[15px] leading-7 text-[var(--muted)]">
            For custom service requests submitted through our Academic Marketplace (such as lab manual formatting or project source code preparation):
          </p>
          <ul className="mt-3 list-inside list-disc space-y-2 text-[15px] leading-7 text-[var(--muted)]">
            <li><strong>Order Cancellation Before Processing:</strong> You may request a full cancellation and refund within 2 hours of placing an order, provided an academic expert has not commenced work on your files.</li>
            <li><strong>Delivery Discrepancies:</strong> If a delivered service fails to match the documented instructions provided at checkout or contains verified technical defects, you may request free revisions or a full/partial refund within 7 calendar days of delivery.</li>
          </ul>
        </section>

        <section className="surface-card rounded-xl p-6 sm:p-8">
          <h2 className="font-display text-xl font-bold tracking-tight text-[var(--ink)]">
            3. Duplicate Payments &amp; Gateway Errors
          </h2>
          <p className="mt-3 text-[15px] leading-7 text-[var(--muted)]">
            If your bank account or payment card is charged twice for the same digital product or order due to network drops, UPI timeouts, or Razorpay payment gateway failures, please contact our support desk with your transaction reference number. Verified duplicate charges will be automatically refunded to your original payment method within 5 to 7 business days.
          </p>
        </section>

        <section className="surface-card rounded-xl p-6 sm:p-8">
          <h2 className="font-display text-xl font-bold tracking-tight text-[var(--ink)]">
            4. How to Initiate a Refund
          </h2>
          <p className="mt-3 text-[15px] leading-7 text-[var(--muted)]">
            To request a refund or report a delivery discrepancy, please contact us immediately:
          </p>
          <div className="mt-3 rounded-lg border border-[var(--line)] bg-[var(--surface)] p-4 text-sm font-semibold text-[var(--ink)]">
            <p>Company Name: CampusNinja</p>
            <p className="mt-1">Support Desk: manavgupta236@gmail.com / support@campusninja.com</p>
            <p className="mt-1">Response Time: Within 24 to 48 business hours</p>
          </div>
        </section>
      </div>
    </div>
  );
}
