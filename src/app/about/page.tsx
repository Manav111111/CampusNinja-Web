'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen, GraduationCap, ShieldCheck } from 'lucide-react';

export default function AboutPage() {
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
            <GraduationCap className="h-6 w-6" />
          </div>
          <div>
            <h1 className="font-display text-3xl font-bold tracking-tight text-[var(--ink)] sm:text-4xl">
              About CampusNinja
            </h1>
            <p className="mt-1 text-sm text-[var(--muted)]">
              Engineering Study Hub &amp; Digital Educational Marketplace
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 space-y-6">
        <section className="surface-card rounded-xl p-6 sm:p-8">
          <h2 className="font-display text-xl font-bold tracking-tight text-[var(--ink)]">
            Our Mission &amp; Purpose
          </h2>
          <p className="mt-3 text-[15px] leading-7 text-[var(--muted)]">
            CampusNinja is a structured digital educational study hub designed to simplify semester coursework for engineering students. We organize curriculum resources—including verified notes, previous year question paper (PYQ) solutions, digital calculators, lab manuals, and project references—directly around the exact branch, course, and semester requirements that students face daily.
          </p>
        </section>

        <div className="grid gap-6 sm:grid-cols-2">
          <section className="surface-card rounded-xl p-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--brand-50)] text-[var(--brand)]">
              <BookOpen className="h-5 w-5" />
            </div>
            <h3 className="font-display mt-4 text-lg font-bold text-[var(--ink)]">
              Structured Study Hub
            </h3>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
              We eliminate dashboard clutter by filtering educational downloads by specific subjects, syllabus units, and semester modules so you can find exactly what you need in seconds.
            </p>
          </section>

          <section className="surface-card rounded-xl p-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--brand-50)] text-[var(--brand)]">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="font-display mt-4 text-lg font-bold text-[var(--ink)]">
              Verified Academic Marketplace
            </h3>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
              Our marketplace enables students to purchase custom practical assignment solutions, lab manual sheets, and project source codes prepared by experienced subject matter experts with transparent pricing and secure checkout via Razorpay.
            </p>
          </section>
        </div>

        <section className="surface-card rounded-xl p-6 sm:p-8">
          <h2 className="font-display text-xl font-bold tracking-tight text-[var(--ink)]">
            Registered Entity Details
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 text-sm font-semibold text-[var(--ink)]">
            <div className="rounded-lg border border-[var(--line)] bg-[var(--surface)] p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-[var(--muted-2)]">Company Name</p>
              <p className="mt-1">CampusNinja Educational Services</p>
            </div>
            <div className="rounded-lg border border-[var(--line)] bg-[var(--surface)] p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-[var(--muted-2)]">Support Email</p>
              <p className="mt-1">manavgupta236@gmail.com</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
