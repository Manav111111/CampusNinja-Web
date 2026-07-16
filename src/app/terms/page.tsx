'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, FileText } from 'lucide-react';

export default function TermsPage() {
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
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <h1 className="font-display text-3xl font-bold tracking-tight text-[var(--ink)] sm:text-4xl">
              Terms &amp; Conditions
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
            1. Acceptance of Terms
          </h2>
          <p className="mt-3 text-[15px] leading-7 text-[var(--muted)]">
            By accessing or using CampusNinja, you agree to be bound by these Terms &amp; Conditions and all applicable laws and regulations governing digital educational platforms and e-commerce services in India. If you do not agree with any part of these terms, you may not access or use our services.
          </p>
        </section>

        <section className="surface-card rounded-xl p-6 sm:p-8">
          <h2 className="font-display text-xl font-bold tracking-tight text-[var(--ink)]">
            2. Services &amp; Digital Products
          </h2>
          <p className="mt-3 text-[15px] leading-7 text-[var(--muted)]">
            CampusNinja operates as an educational marketplace offering downloadable digital study resources (including notes, previous year question paper solutions, calculation tools, and curriculum syllabi) alongside custom academic services such as lab manual formatting and project reference source code.
          </p>
          <ul className="mt-3 list-inside list-disc space-y-2 text-[15px] leading-7 text-[var(--muted)]">
            <li>All digital study resources are provided for educational review, self-study, and reference purposes.</li>
            <li>Users agree not to redistribute, resell, or publicly broadcast purchased proprietary digital study packages without written consent.</li>
          </ul>
        </section>

        <section className="surface-card rounded-xl p-6 sm:p-8">
          <h2 className="font-display text-xl font-bold tracking-tight text-[var(--ink)]">
            3. Pricing &amp; Payments (Razorpay)
          </h2>
          <p className="mt-3 text-[15px] leading-7 text-[var(--muted)]">
            All prices listed on the CampusNinja marketplace are in Indian Rupees (INR) and are inclusive of applicable digital taxes unless stated otherwise. We use <strong>Razorpay</strong> as our secure payment gateway partner.
          </p>
          <ul className="mt-3 list-inside list-disc space-y-2 text-[15px] leading-7 text-[var(--muted)]">
            <li>Payment authorization occurs instantly via credit/debit cards, UPI, net banking, or approved digital wallets processed by Razorpay.</li>
            <li>CampusNinja does not store full credit card numbers or sensitive payment banking credentials on its local servers.</li>
          </ul>
        </section>

        <section className="surface-card rounded-xl p-6 sm:p-8">
          <h2 className="font-display text-xl font-bold tracking-tight text-[var(--ink)]">
            4. User Account &amp; Responsibilities
          </h2>
          <p className="mt-3 text-[15px] leading-7 text-[var(--muted)]">
            To purchase downloadable materials or request custom academic deliverables, you must authenticate securely via Google Sign-In through our authentication partner (Supabase). You are responsible for maintaining the confidentiality of your session and account details.
          </p>
        </section>

        <section className="surface-card rounded-xl p-6 sm:p-8">
          <h2 className="font-display text-xl font-bold tracking-tight text-[var(--ink)]">
            5. Intellectual Property
          </h2>
          <p className="mt-3 text-[15px] leading-7 text-[var(--muted)]">
            All educational summaries, structured lab formatting templates, calculation algorithms, and software code provided on CampusNinja remain the proprietary property of CampusNinja and its contributing academic experts.
          </p>
        </section>

        <section className="surface-card rounded-xl p-6 sm:p-8">
          <h2 className="font-display text-xl font-bold tracking-tight text-[var(--ink)]">
            6. Governing Law &amp; Jurisdiction
          </h2>
          <p className="mt-3 text-[15px] leading-7 text-[var(--muted)]">
            These Terms &amp; Conditions shall be governed by and construed in accordance with the laws of India. Any disputes arising from or related to the use of CampusNinja shall be subject to the exclusive jurisdiction of the courts in New Delhi, India.
          </p>
        </section>

        <section className="surface-card rounded-xl p-6 sm:p-8">
          <h2 className="font-display text-xl font-bold tracking-tight text-[var(--ink)]">
            7. Contact Information
          </h2>
          <p className="mt-3 text-[15px] leading-7 text-[var(--muted)]">
            If you have any questions, inquiries, or concerns regarding these Terms &amp; Conditions, please contact us at:
          </p>
          <div className="mt-3 rounded-lg border border-[var(--line)] bg-[var(--surface)] p-4 text-sm font-semibold text-[var(--ink)]">
            <p>Company Name: CampusNinja</p>
            <p className="mt-1">Email: manavgupta236@gmail.com / support@campusninja.com</p>
          </div>
        </section>
      </div>
    </div>
  );
}
