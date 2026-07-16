'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Truck } from 'lucide-react';

export default function ShippingPolicyPage() {
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
            <Truck className="h-6 w-6" />
          </div>
          <div>
            <h1 className="font-display text-3xl font-bold tracking-tight text-[var(--ink)] sm:text-4xl">
              Shipping &amp; Delivery Policy
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
            1. Digital Products Delivery (Instant Access)
          </h2>
          <p className="mt-3 text-[15px] leading-7 text-[var(--muted)]">
            CampusNinja is an online educational marketplace specializing in digital study materials. Because all products offered in our Study Hub and digital download library are electronic items (such as PDF notes, previous year question paper solutions, syllabus guides, and calculation utilities), zero physical shipping occurs.
          </p>
          <ul className="mt-3 list-inside list-disc space-y-2 text-[15px] leading-7 text-[var(--muted)]">
            <li><strong>Instant Access:</strong> Immediately upon successful online payment authorization via our payment gateway partner (Razorpay), your digital items become instantly accessible right within your CampusNinja account dashboard and order history.</li>
            <li><strong>No Shipping Charges:</strong> There are no courier, shipping, or physical handling charges on any digital resource purchases.</li>
          </ul>
        </section>

        <section className="surface-card rounded-xl p-6 sm:p-8">
          <h2 className="font-display text-xl font-bold tracking-tight text-[var(--ink)]">
            2. Custom Academic Services Fulfillment Timelines
          </h2>
          <p className="mt-3 text-[15px] leading-7 text-[var(--muted)]">
            For custom service orders placed through our Academic Marketplace (including custom lab manual solution formatting, practical assignment sheets, and project reference code packages):
          </p>
          <ul className="mt-3 list-inside list-disc space-y-2 text-[15px] leading-7 text-[var(--muted)]">
            <li><strong>Electronic Delivery:</strong> All completed deliverables are securely uploaded directly to your verified CampusNinja user dashboard (`/orders`) and notified via account alerts and your registered email address.</li>
            <li><strong>Delivery Timelines:</strong> Standard orders are fulfilled within <strong>24 to 72 business hours</strong> depending on project complexity. Expedited 24-hour priority delivery options are clearly marked during checkout when available.</li>
          </ul>
        </section>

        <section className="surface-card rounded-xl p-6 sm:p-8">
          <h2 className="font-display text-xl font-bold tracking-tight text-[var(--ink)]">
            3. Delivery Troubleshooting &amp; Support
          </h2>
          <p className="mt-3 text-[15px] leading-7 text-[var(--muted)]">
            If you experience any network drops, browser interruptions, or delay in accessing your purchased digital materials after receiving a successful payment confirmation from Razorpay or your bank, please reach out immediately:
          </p>
          <div className="mt-3 rounded-lg border border-[var(--line)] bg-[var(--surface)] p-4 text-sm font-semibold text-[var(--ink)]">
            <p>Company Name: CampusNinja</p>
            <p className="mt-1">Support Desk: manavgupta236@gmail.com / support@campusninja.com</p>
            <p className="mt-1">Response Time: Within 24 hours</p>
          </div>
        </section>
      </div>
    </div>
  );
}
