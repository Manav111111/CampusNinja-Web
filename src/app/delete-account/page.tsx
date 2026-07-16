'use client';

import React from 'react';
import Link from 'next/link';
import { Trash2, ArrowLeft, Mail, ShieldAlert, Clock, CheckCircle2, AlertTriangle } from 'lucide-react';
import { isReviewMode } from '@/config/reviewMode';

const DELETION_STEPS = [
  { step: 1, title: 'Open the CampusNinja App', description: 'Launch the CampusNinja app on your Android device.' },
  { step: 2, title: 'Go to Profile Tab', description: 'Tap the "Profile" tab in the bottom navigation bar.' },
  { step: 3, title: 'Find Delete Account', description: 'Scroll to the "Help & Legal" section and tap "Delete Account".' },
  { step: 4, title: 'First Confirmation', description: 'A dialog will appear asking if you want to delete your account. Tap "Delete Account" to proceed.' },
  { step: 5, title: 'Final Confirmation', description: 'A final warning dialog will appear. Type or confirm to permanently delete your account.' },
  { step: 6, title: 'Account Deleted', description: 'Your account and data are permanently deleted. You will be signed out and returned to the home screen.' },
];

const DELETED_DATA = [
  'Your authentication account and login session',
  'Your push notification device tokens',
  'Your uploaded order files (PDFs, images) from cloud storage',
  'Your device token entries in our database',
  'Your association with any orders (orders are anonymized)',
];

const getRetainedData = () => [
  'Anonymized order records may be retained for up to 2 years for legal and accounting compliance',
  ...(isReviewMode()
    ? ['Anonymized academic feedback or notes you submitted for curriculum improvement']
    : ['Community content you posted (if any) may remain with your name removed']),
  'Aggregated, non-identifiable usage statistics',
];

export default function DeleteAccountPage() {
  return (
    <div className="page-shell animate-soft-in">
      {/* Header */}
      <div>
        <Link
          href="/"
          className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-[var(--muted)] transition hover:text-[var(--ink)]"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Link>

        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-[var(--line)] bg-red-50 text-red-500 shadow-sm">
            <Trash2 className="h-7 w-7" />
          </div>
          <div>
            <p className="font-mono-spec text-[11px] font-bold tracking-[0.1em] text-red-500">
              ACCOUNT · DOC-DA-001
            </p>
            <h1 className="font-display mt-1 text-3xl font-bold tracking-tight text-[var(--ink)] sm:text-4xl">
              Delete Your Account
            </h1>
            <p className="mt-2 text-sm text-[var(--muted)]">
              How to permanently delete your CampusNinja account and associated data
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {/* Important Notice */}
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 sm:p-6">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
            <div>
              <p className="font-display font-bold text-amber-800">Important Notice</p>
              <p className="mt-1 text-[14px] leading-6 text-amber-700">
                Account deletion is <strong>permanent and irreversible</strong>. Once deleted, your account
                cannot be recovered. Please ensure you have saved any important order receipts or materials
                before proceeding.
              </p>
            </div>
          </div>
        </div>

        {/* Steps to Delete (In-App) */}
        <section className="surface-card rounded-xl p-6 sm:p-8">
          <div className="mb-6 flex items-center gap-3">
            <ShieldAlert className="h-6 w-6 text-[var(--brand)]" />
            <h2 className="font-display text-xl font-bold tracking-tight text-[var(--ink)]">
              Delete Account from the App
            </h2>
          </div>
          <p className="mb-6 text-[15px] leading-7 text-[var(--muted)]">
            The fastest way to delete your account is directly from the CampusNinja mobile app.
            Follow these steps:
          </p>
          <div className="space-y-4">
            {DELETION_STEPS.map((item) => (
              <div key={item.step} className="flex gap-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-[var(--brand)] bg-[var(--brand-50)] font-mono-spec text-sm font-bold text-[var(--brand)]">
                  {item.step}
                </div>
                <div className="pt-1">
                  <p className="font-display font-bold text-[var(--ink)]">{item.title}</p>
                  <p className="mt-0.5 text-[14px] text-[var(--muted)]">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Request Deletion via Email */}
        <section className="surface-card rounded-xl p-6 sm:p-8">
          <div className="mb-6 flex items-center gap-3">
            <Mail className="h-6 w-6 text-[var(--brand)]" />
            <h2 className="font-display text-xl font-bold tracking-tight text-[var(--ink)]">
              Request Deletion via Email
            </h2>
          </div>
          <p className="mb-4 text-[15px] leading-7 text-[var(--muted)]">
            If you are unable to delete your account from the app, you can request deletion by email.
            Please send an email from the address associated with your CampusNinja account to:
          </p>
          <a
            href="mailto:manavgupta236@gmail.com?subject=Account%20Deletion%20Request%20-%20CampusNinja&body=Hi%20CampusNinja%20Team%2C%0A%0AI%20would%20like%20to%20permanently%20delete%20my%20CampusNinja%20account.%0A%0AEmail%20associated%20with%20my%20account%3A%20%5Byour%20email%5D%0A%0AThank%20you."
            className="inline-flex items-center gap-2 rounded-lg border border-[var(--brand)] bg-[var(--brand-50)] px-5 py-3 font-display text-sm font-bold text-[var(--brand)] transition hover:bg-[var(--brand)] hover:text-white"
          >
            <Mail className="h-4 w-4" />
            manavgupta236@gmail.com
          </a>
          <p className="mt-4 text-[14px] text-[var(--muted)]">
            Please include the email address associated with your CampusNinja account in the body of the email.
            We will verify your identity and process your request.
          </p>
        </section>

        {/* What Gets Deleted */}
        <div className="grid gap-6 sm:grid-cols-2">
          <section className="surface-card rounded-xl p-6">
            <div className="mb-4 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-red-500" />
              <h3 className="font-display text-lg font-bold text-[var(--ink)]">Data Permanently Deleted</h3>
            </div>
            <ul className="space-y-2.5">
              {DELETED_DATA.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-[14px] leading-6 text-[var(--muted)]">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red-400" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section className="surface-card rounded-xl p-6">
            <div className="mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5 text-amber-500" />
              <h3 className="font-display text-lg font-bold text-[var(--ink)]">Data That May Be Retained</h3>
            </div>
            <ul className="space-y-2.5">
              {getRetainedData().map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-[14px] leading-6 text-[var(--muted)]">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
                  {item}
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Processing Time */}
        <section className="surface-card rounded-xl p-6 sm:p-8">
          <div className="mb-4 flex items-center gap-3">
            <Clock className="h-6 w-6 text-[var(--brand)]" />
            <h2 className="font-display text-xl font-bold tracking-tight text-[var(--ink)]">
              Processing Time
            </h2>
          </div>
          <div className="space-y-3 text-[15px] leading-7 text-[var(--muted)]">
            <p>
              <strong className="text-[var(--ink)]">In-App Deletion:</strong> Immediate. Your account is deleted
              instantly upon final confirmation.
            </p>
            <p>
              <strong className="text-[var(--ink)]">Email Request:</strong> We will process your request within
              <strong className="text-[var(--ink)]"> 7 business days</strong>. You will receive a confirmation email
              once deletion is complete.
            </p>
          </div>
        </section>

        {/* Confirmation */}
        <div className="rounded-xl border border-green-200 bg-green-50 p-5 sm:p-6">
          <div className="flex gap-3">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
            <div>
              <p className="font-display font-bold text-green-800">Confirmation</p>
              <p className="mt-1 text-[14px] leading-6 text-green-700">
                After your account is deleted (either in-app or via email), you will not be able to log in
                or access any previous data. You are free to create a new account at any time using Google Sign-In.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Support */}
        <section className="surface-card rounded-xl p-6 sm:p-8">
          <h2 className="font-display text-xl font-bold tracking-tight text-[var(--ink)]">
            Need Help?
          </h2>
          <p className="mt-3 text-[15px] leading-7 text-[var(--muted)]">
            If you have questions about account deletion or need assistance, contact our support team:
          </p>
          <div className="mt-4 rounded-lg border border-[var(--line)] bg-[var(--paper)] p-5">
            <p className="font-display font-bold text-[var(--ink)]">CampusNinja Support</p>
            <p className="mt-2 text-[var(--muted)]">
              Email:{' '}
              <a href="mailto:manavgupta236@gmail.com" className="font-semibold text-[var(--brand)] hover:underline">
                manavgupta236@gmail.com
              </a>
            </p>
          </div>
          <p className="mt-4 text-[13px] text-[var(--muted-2)]">
            Also see our{' '}
            <Link href="/privacy-policy" className="font-semibold text-[var(--brand)] hover:underline">
              Privacy Policy
            </Link>{' '}
            for full details on how your data is handled.
          </p>
        </section>
      </div>
    </div>
  );
}
