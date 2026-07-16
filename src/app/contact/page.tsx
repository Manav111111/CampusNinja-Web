'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Clock, Mail, MapPin, MessageSquare } from 'lucide-react';

export default function ContactPage() {
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
            <MessageSquare className="h-6 w-6" />
          </div>
          <div>
            <h1 className="font-display text-3xl font-bold tracking-tight text-[var(--ink)] sm:text-4xl">
              Contact Us
            </h1>
            <p className="mt-1 text-sm text-[var(--muted)]">
              Get direct assistance from our academic support desk and customer care team.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <section className="surface-card rounded-xl p-6 sm:p-8">
            <h2 className="font-display text-xl font-bold tracking-tight text-[var(--ink)]">
              Company &amp; Support Information
            </h2>
            <p className="mt-2 text-[15px] leading-7 text-[var(--muted)]">
              Whether you need assistance with digital study downloads, order tracking for marketplace deliverables, or payment receipt verification through Razorpay, our support team is ready to help.
            </p>

            <div className="mt-6 space-y-4">
              <div className="flex items-start gap-3.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--brand-50)] text-[var(--brand)]">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[var(--muted-2)]">Primary Support Emails</p>
                  <p className="mt-0.5 font-semibold text-[var(--ink)]">manavgupta236@gmail.com</p>
                  <p className="text-sm font-medium text-[var(--muted)]">support@campusninja.com</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--brand-50)] text-[var(--brand)]">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[var(--muted-2)]">Working Hours</p>
                  <p className="mt-0.5 font-semibold text-[var(--ink)]">Monday - Saturday (9:00 AM to 7:00 PM IST)</p>
                  <p className="text-sm text-[var(--muted)]">Standard email response turnaround: Within 24 hours</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--brand-50)] text-[var(--brand)]">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[var(--muted-2)]">Registered Business Details</p>
                  <p className="mt-0.5 font-semibold text-[var(--ink)]">CampusNinja Educational Services</p>
                  <p className="text-sm text-[var(--muted)]">New Delhi, India</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="surface-card flex flex-col justify-between rounded-xl p-6 sm:p-8">
          <div>
            <h2 className="font-display text-xl font-bold tracking-tight text-[var(--ink)]">
              Direct Inquiry Desk
            </h2>
            <p className="mt-2 text-[15px] leading-7 text-[var(--muted)]">
              To expedite your inquiry, please email our support desk directly with your full name, registered college email, and your order transaction reference (if applicable).
            </p>
            <div className="mt-6 space-y-3 rounded-lg border border-[var(--line)] bg-[var(--surface)] p-5">
              <p className="text-sm font-bold text-[var(--ink)]">When contacting us for Marketplace Orders:</p>
              <ul className="list-inside list-disc space-y-1.5 text-xs font-medium text-[var(--muted)]">
                <li>Include the exact Order ID from your dashboard</li>
                <li>Specify required file format adjustments or syllabus guidelines</li>
                <li>For payment verification, attach your Razorpay payment confirmation ID</li>
              </ul>
            </div>
          </div>

          <a
            href="mailto:manavgupta236@gmail.com?subject=CampusNinja%20Support%20Inquiry"
            className="primary-button mt-8 flex h-12 items-center justify-center rounded-lg text-sm font-bold text-white shadow-sm"
          >
            Send Email Inquiry
          </a>
        </div>
      </div>
    </div>
  );
}
