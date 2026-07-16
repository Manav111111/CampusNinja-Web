'use client';

import React from 'react';
import Link from 'next/link';
import { Shield, ChevronRight, ArrowLeft, ExternalLink } from 'lucide-react';
import { isReviewMode } from '@/config/reviewMode';

const TOC_ITEMS = [
  { id: 'information-collected', label: '1. Information We Collect' },
  { id: 'how-used', label: '2. How We Use Your Information' },
  { id: 'authentication', label: '3. Authentication & Sign-In' },
  { id: 'push-notifications', label: '4. Push Notifications' },
  { id: 'analytics', label: '5. Analytics' },
  { id: 'third-party', label: '6. Third-Party Services' },
  { id: 'cookies', label: '7. Cookies & Local Storage' },
  { id: 'user-rights', label: '8. Your Rights' },
  { id: 'data-retention', label: '9. Data Retention' },
  { id: 'security', label: '10. Security' },
  { id: 'children', label: '11. Children\'s Privacy' },
  { id: 'account-deletion', label: '12. Account Deletion' },
  { id: 'changes', label: '13. Changes to This Policy' },
  { id: 'contact', label: '14. Contact Us' },
];

export default function PrivacyPolicyPage() {
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
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-[var(--line)] bg-[var(--brand-50)] text-[var(--brand)] shadow-sm">
            <Shield className="h-7 w-7" />
          </div>
          <div>
            <p className="font-mono-spec text-[11px] font-bold tracking-[0.1em] text-[var(--brand)]">
              LEGAL · DOC-PP-001
            </p>
            <h1 className="font-display mt-1 text-3xl font-bold tracking-tight text-[var(--ink)] sm:text-4xl">
              Privacy Policy
            </h1>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Last Updated: <strong className="text-[var(--ink)]">July 16, 2026</strong> · Effective immediately
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
        {/* Table of Contents — Sidebar */}
        <aside className="lg:sticky lg:top-24 lg:h-fit lg:w-72 lg:shrink-0">
          <div className="surface-card spec-corners rounded-xl p-5">
            <p className="font-mono-spec mb-3 text-[10px] font-bold tracking-[0.14em] text-[var(--muted-2)]">
              TABLE OF CONTENTS
            </p>
            <nav className="space-y-1">
              {TOC_ITEMS.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className="group flex items-center gap-2 rounded-md px-3 py-2 text-[13px] font-medium text-[var(--muted)] transition hover:bg-[var(--brand-50)] hover:text-[var(--ink)]"
                >
                  <ChevronRight className="h-3 w-3 shrink-0 text-[var(--line-strong)] transition group-hover:text-[var(--brand)]" />
                  {item.label}
                </a>
              ))}
            </nav>
          </div>
        </aside>

        {/* Content */}
        <article className="min-w-0 flex-1 space-y-10">
          {/* Introduction */}
          <section className="surface-card rounded-xl p-6 sm:p-8">
            <p className="text-[15px] leading-7 text-[var(--ink-700)]">
              CampusNinja (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) operates the CampusNinja mobile application
              and the CampusNinja website (collectively, the &quot;Service&quot;). This Privacy Policy explains how we
              collect, use, disclose, and safeguard your information when you use our Service.
            </p>
            <p className="mt-4 text-[15px] leading-7 text-[var(--ink-700)]">
              By using our Service, you agree to the collection and use of information in accordance with this
              Privacy Policy. If you do not agree, please do not use the Service.
            </p>
          </section>

          {/* Section 1 */}
          <section id="information-collected" className="surface-card rounded-xl p-6 sm:p-8">
            <h2 className="font-display text-xl font-bold tracking-tight text-[var(--ink)]">
              1. Information We Collect
            </h2>
            <div className="mt-4 space-y-5 text-[15px] leading-7 text-[var(--ink-700)]">
              <div>
                <h3 className="font-display mb-2 text-base font-bold text-[var(--ink)]">
                  a) Information You Provide
                </h3>
                <ul className="list-inside list-disc space-y-1.5 text-[var(--muted)]">
                  <li><strong className="text-[var(--ink)]">Account Information:</strong> When you sign in with Google, we receive your name, email address, and profile picture from your Google account.</li>
                  <li><strong className="text-[var(--ink)]">Academic Preferences:</strong> Your selected course (B.Tech), engineering branch, and semester.</li>
                  <li><strong className="text-[var(--ink)]">Order Information:</strong> When placing marketplace orders, you provide your name, email, phone number, college name, delivery address, and any uploaded files (PDFs, images).</li>
                  <li><strong className="text-[var(--ink)]">Support Requests:</strong> Any messages or emails you send to our support team.</li>
                </ul>
              </div>
              <div>
                <h3 className="font-display mb-2 text-base font-bold text-[var(--ink)]">
                  b) Information Collected Automatically
                </h3>
                <ul className="list-inside list-disc space-y-1.5 text-[var(--muted)]">
                  <li><strong className="text-[var(--ink)]">Device Information:</strong> Device type, operating system, platform (Android/iOS), and a unique device push notification token (FCM token).</li>
                  <li><strong className="text-[var(--ink)]">Usage Data:</strong> App open events, subject views, resource downloads, marketplace interactions, and search queries (logged locally for analytics).</li>
                  <li><strong className="text-[var(--ink)]">Installation Timestamp:</strong> The date and time the app was first installed on your device.</li>
                </ul>
              </div>
              <div>
                <h3 className="font-display mb-2 text-base font-bold text-[var(--ink)]">
                  c) Information We Do NOT Collect
                </h3>
                <ul className="list-inside list-disc space-y-1.5 text-[var(--muted)]">
                  <li>Location data (GPS, network-based)</li>
                  <li>Contacts or phone book data</li>
                  <li>Camera or microphone data</li>
                  <li>Payment card or financial information (all orders are Cash on Delivery)</li>
                  <li>Health, fitness, or biometric data</li>
                  <li>Advertising identifiers or cross-app tracking data</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 2 */}
          <section id="how-used" className="surface-card rounded-xl p-6 sm:p-8">
            <h2 className="font-display text-xl font-bold tracking-tight text-[var(--ink)]">
              2. How We Use Your Information
            </h2>
            <ul className="mt-4 list-inside list-disc space-y-2 text-[15px] leading-7 text-[var(--muted)]">
              <li><strong className="text-[var(--ink)]">Personalized Academic Content:</strong> To display subjects, notes, PYQs, video lectures, and syllabus relevant to your selected branch and semester.</li>
              <li><strong className="text-[var(--ink)]">Order Fulfillment:</strong> To process, track, and deliver your marketplace orders.</li>
              <li><strong className="text-[var(--ink)]">Push Notifications:</strong> {isReviewMode() ? 'To send you academic updates, new resource alerts, and order status changes.' : 'To send you academic updates, new resource alerts, order status changes, and community announcements.'}</li>
              <li><strong className="text-[var(--ink)]">Service Improvement:</strong> To understand usage patterns (anonymized) and improve the app experience.</li>
              <li><strong className="text-[var(--ink)]">Authentication:</strong> To verify your identity and maintain your session across app restarts.</li>
              <li><strong className="text-[var(--ink)]">Customer Support:</strong> To respond to your inquiries and resolve issues.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section id="authentication" className="surface-card rounded-xl p-6 sm:p-8">
            <h2 className="font-display text-xl font-bold tracking-tight text-[var(--ink)]">
              3. Authentication & Sign-In
            </h2>
            <div className="mt-4 space-y-3 text-[15px] leading-7 text-[var(--ink-700)]">
              <p>
                CampusNinja uses <strong>Google Sign-In</strong> via <strong>Supabase Authentication</strong> as the sole
                sign-in method. When you sign in, we receive:
              </p>
              <ul className="list-inside list-disc space-y-1.5 text-[var(--muted)]">
                <li>Your Google account name and email address</li>
                <li>Your Google profile picture URL</li>
                <li>A unique user identifier</li>
              </ul>
              <p>
                We do <strong>not</strong> receive or store your Google account password. Authentication tokens are
                securely stored on your device and refreshed automatically by Supabase.
              </p>
              <p>
                Signing in is optional. The app can be used without an account for browsing subjects, notes, and
                study resources. An account is required only for placing marketplace orders.
              </p>
            </div>
          </section>

          {/* Section 4 */}
          <section id="push-notifications" className="surface-card rounded-xl p-6 sm:p-8">
            <h2 className="font-display text-xl font-bold tracking-tight text-[var(--ink)]">
              4. Push Notifications
            </h2>
            <div className="mt-4 space-y-3 text-[15px] leading-7 text-[var(--ink-700)]">
              <p>
                We use <strong>Firebase Cloud Messaging (FCM)</strong> via <strong>Expo Notifications</strong> to send
                push notifications. When you grant notification permission, we obtain:
              </p>
              <ul className="list-inside list-disc space-y-1.5 text-[var(--muted)]">
                <li>An Expo push token (for the Expo notification service)</li>
                <li>A native FCM device token (for Firebase Cloud Messaging)</li>
              </ul>
              <p>
                These tokens are stored in our Supabase database (in the <code className="rounded bg-[var(--brand-50)] px-1.5 py-0.5 font-mono-spec text-[13px]">device_tokens</code> table)
                alongside your user ID (if signed in), selected branch, semester, and platform type.
              </p>
              <p>
                You can disable push notifications at any time through your device&apos;s system settings.
                When you sign out, your device token is automatically removed from our servers.
              </p>
            </div>
          </section>

          {/* Section 5 */}
          <section id="analytics" className="surface-card rounded-xl p-6 sm:p-8">
            <h2 className="font-display text-xl font-bold tracking-tight text-[var(--ink)]">
              5. Analytics
            </h2>
            <div className="mt-4 space-y-3 text-[15px] leading-7 text-[var(--ink-700)]">
              <p>
                CampusNinja uses basic event tracking to understand how the app is used. Events tracked include:
              </p>
              <ul className="list-inside list-disc space-y-1.5 text-[var(--muted)]">
                <li>App open events</li>
                <li>Subject and resource views</li>
                <li>PDF downloads</li>
                <li>Marketplace interactions</li>
                <li>Order creation events</li>
              </ul>
              <p>
                Currently, analytics events are logged locally on the device for debugging purposes.
                Firebase Analytics JS SDK is not active in the React Native environment. No analytics
                data is transmitted to third-party analytics services.
              </p>
              <p>
                We do <strong>not</strong> use any advertising identifiers, cross-app tracking, or third-party
                analytics SDKs that profile users.
              </p>
            </div>
          </section>

          {/* Section 6 */}
          <section id="third-party" className="surface-card rounded-xl p-6 sm:p-8">
            <h2 className="font-display text-xl font-bold tracking-tight text-[var(--ink)]">
              6. Third-Party Services
            </h2>
            <div className="mt-4 space-y-5 text-[15px] leading-7 text-[var(--ink-700)]">
              <p>We use the following third-party services, each with their own privacy policies:</p>

              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  {
                    name: 'Supabase',
                    purpose: 'Database, authentication, file storage, and real-time data',
                    url: 'https://supabase.com/privacy',
                  },
                  {
                    name: 'Firebase (Google)',
                    purpose: 'Cloud Messaging (FCM) for push notifications',
                    url: 'https://firebase.google.com/support/privacy',
                  },
                  {
                    name: 'Google Sign-In',
                    purpose: 'OAuth authentication provider',
                    url: 'https://policies.google.com/privacy',
                  },
                  {
                    name: 'Expo',
                    purpose: 'App framework, OTA updates, push notification relay',
                    url: 'https://expo.dev/privacy',
                  },
                ].map((service) => (
                  <div key={service.name} className="rounded-lg border border-[var(--line)] bg-[var(--paper)] p-4">
                    <p className="font-display font-bold text-[var(--ink)]">{service.name}</p>
                    <p className="mt-1 text-[13px] text-[var(--muted)]">{service.purpose}</p>
                    <a
                      href={service.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex items-center gap-1 text-[12px] font-semibold text-[var(--brand)] hover:underline"
                    >
                      Privacy Policy <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                ))}
              </div>

              <p>
                We do not sell, trade, or rent your personal information to any third party. Data shared
                with the above services is limited to what is necessary for their operation as described.
              </p>
            </div>
          </section>

          {/* Section 7 */}
          <section id="cookies" className="surface-card rounded-xl p-6 sm:p-8">
            <h2 className="font-display text-xl font-bold tracking-tight text-[var(--ink)]">
              7. Cookies & Local Storage
            </h2>
            <div className="mt-4 space-y-3 text-[15px] leading-7 text-[var(--ink-700)]">
              <p><strong>Mobile App:</strong> The CampusNinja mobile app uses AsyncStorage (device-local storage) to store:</p>
              <ul className="list-inside list-disc space-y-1.5 text-[var(--muted)]">
                <li>Your academic setup preferences (branch, semester)</li>
                <li>Onboarding completion status</li>
                <li>Recent search history</li>
                <li>Authentication session tokens</li>
                <li>Installation timestamp</li>
              </ul>
              <p>This data is stored locally on your device and is not transmitted to any server unless explicitly stated.</p>
              <p><strong>Website:</strong> The CampusNinja website may use essential cookies and local storage for session management and functionality. We do not use advertising or tracking cookies.</p>
            </div>
          </section>

          {/* Section 8 */}
          <section id="user-rights" className="surface-card rounded-xl p-6 sm:p-8">
            <h2 className="font-display text-xl font-bold tracking-tight text-[var(--ink)]">
              8. Your Rights
            </h2>
            <div className="mt-4 space-y-3 text-[15px] leading-7 text-[var(--ink-700)]">
              <p>
                Under applicable data protection laws, including the <strong>General Data Protection Regulation (GDPR)</strong>{' '}
                and the <strong>Indian Digital Personal Data Protection Act (DPDP Act, 2023)</strong>, you have the right to:
              </p>
              <ul className="list-inside list-disc space-y-1.5 text-[var(--muted)]">
                <li><strong className="text-[var(--ink)]">Access:</strong> Request a copy of the personal data we hold about you.</li>
                <li><strong className="text-[var(--ink)]">Correction:</strong> Request correction of inaccurate or incomplete data.</li>
                <li><strong className="text-[var(--ink)]">Deletion:</strong> Request permanent deletion of your account and associated data (see Section 12).</li>
                <li><strong className="text-[var(--ink)]">Portability:</strong> Request your data in a structured, machine-readable format.</li>
                <li><strong className="text-[var(--ink)]">Withdraw Consent:</strong> Withdraw consent for data processing at any time by deleting your account or contacting us.</li>
                <li><strong className="text-[var(--ink)]">Grievance Redressal:</strong> Under the DPDP Act, you may raise a grievance with us and, if unresolved, with the Data Protection Board of India.</li>
              </ul>
              <p>
                To exercise any of these rights, please contact us at{' '}
                <a href="mailto:manavgupta236@gmail.com" className="font-semibold text-[var(--brand)] hover:underline">
                  manavgupta236@gmail.com
                </a>.
              </p>
            </div>
          </section>

          {/* Section 9 */}
          <section id="data-retention" className="surface-card rounded-xl p-6 sm:p-8">
            <h2 className="font-display text-xl font-bold tracking-tight text-[var(--ink)]">
              9. Data Retention
            </h2>
            <div className="mt-4 space-y-3 text-[15px] leading-7 text-[var(--ink-700)]">
              <p>We retain your personal data only for as long as necessary to provide our Service:</p>
              <ul className="list-inside list-disc space-y-1.5 text-[var(--muted)]">
                <li><strong className="text-[var(--ink)]">Account Data:</strong> Retained until you delete your account.</li>
                <li><strong className="text-[var(--ink)]">Order Records:</strong> Retained for up to 2 years after order completion for record-keeping and dispute resolution, then anonymized.</li>
                <li><strong className="text-[var(--ink)]">Device Tokens:</strong> Removed when you sign out, delete your account, or uninstall the app.</li>
                <li><strong className="text-[var(--ink)]">Uploaded Files:</strong> Order-related files are retained for the duration of the order lifecycle and deleted upon account deletion.</li>
                <li><strong className="text-[var(--ink)]">Local Storage:</strong> Cleared when you delete the app from your device.</li>
              </ul>
            </div>
          </section>

          {/* Section 10 */}
          <section id="security" className="surface-card rounded-xl p-6 sm:p-8">
            <h2 className="font-display text-xl font-bold tracking-tight text-[var(--ink)]">
              10. Security
            </h2>
            <div className="mt-4 space-y-3 text-[15px] leading-7 text-[var(--ink-700)]">
              <p>We take the security of your data seriously and implement the following measures:</p>
              <ul className="list-inside list-disc space-y-1.5 text-[var(--muted)]">
                <li><strong className="text-[var(--ink)]">Encryption in Transit:</strong> All data transmitted between your device and our servers uses TLS/HTTPS encryption.</li>
                <li><strong className="text-[var(--ink)]">Encryption at Rest:</strong> Supabase encrypts all stored data at rest using AES-256 encryption.</li>
                <li><strong className="text-[var(--ink)]">Row-Level Security:</strong> Supabase Row-Level Security (RLS) policies ensure users can only access their own data.</li>
                <li><strong className="text-[var(--ink)]">Secure Authentication:</strong> OAuth 2.0 via Google Sign-In with token-based session management.</li>
                <li><strong className="text-[var(--ink)]">No Password Storage:</strong> We never store user passwords; authentication is delegated entirely to Google.</li>
              </ul>
              <p>
                While we strive to use commercially acceptable means to protect your data, no method of
                electronic storage or transmission is 100% secure. We cannot guarantee absolute security.
              </p>
            </div>
          </section>

          {/* Section 11 */}
          <section id="children" className="surface-card rounded-xl p-6 sm:p-8">
            <h2 className="font-display text-xl font-bold tracking-tight text-[var(--ink)]">
              11. Children&apos;s Privacy
            </h2>
            <div className="mt-4 space-y-3 text-[15px] leading-7 text-[var(--ink-700)]">
              <p>
                CampusNinja is designed for engineering college students and is not directed at children under the
                age of 13 (or 18 in jurisdictions where applicable). We do not knowingly collect personal information
                from children under 13.
              </p>
              <p>
                If you are a parent or guardian and believe your child has provided us with personal data, please
                contact us at{' '}
                <a href="mailto:manavgupta236@gmail.com" className="font-semibold text-[var(--brand)] hover:underline">
                  manavgupta236@gmail.com
                </a>{' '}
                and we will promptly delete such information.
              </p>
            </div>
          </section>

          {/* Section 12 */}
          <section id="account-deletion" className="surface-card rounded-xl p-6 sm:p-8">
            <h2 className="font-display text-xl font-bold tracking-tight text-[var(--ink)]">
              12. Account Deletion
            </h2>
            <div className="mt-4 space-y-3 text-[15px] leading-7 text-[var(--ink-700)]">
              <p>
                You can permanently delete your CampusNinja account at any time through the mobile app:
              </p>
              <ol className="list-inside list-decimal space-y-1.5 text-[var(--muted)]">
                <li>Open the CampusNinja app</li>
                <li>Go to <strong className="text-[var(--ink)]">Profile</strong> tab</li>
                <li>Scroll to <strong className="text-[var(--ink)]">Help & Legal</strong> section</li>
                <li>Tap <strong className="text-[var(--ink)]">Delete Account</strong></li>
                <li>Confirm deletion in the two-step confirmation dialog</li>
              </ol>
              <p>Upon account deletion, we permanently remove:</p>
              <ul className="list-inside list-disc space-y-1.5 text-[var(--muted)]">
                <li>Your authentication account and session</li>
                <li>Your push notification device tokens</li>
                <li>Your uploaded order files from cloud storage</li>
                <li>Your order records (anonymized for legal compliance)</li>
              </ul>
              <p>
                You may also request account deletion by emailing us at{' '}
                <a href="mailto:manavgupta236@gmail.com" className="font-semibold text-[var(--brand)] hover:underline">
                  manavgupta236@gmail.com
                </a>. Deletion requests are processed within 7 business days.
              </p>
              <p>
                For detailed instructions, visit our{' '}
                <Link href="/delete-account" className="font-semibold text-[var(--brand)] hover:underline">
                  Account Deletion page
                </Link>.
              </p>
            </div>
          </section>

          {/* Section 13 */}
          <section id="changes" className="surface-card rounded-xl p-6 sm:p-8">
            <h2 className="font-display text-xl font-bold tracking-tight text-[var(--ink)]">
              13. Changes to This Policy
            </h2>
            <div className="mt-4 space-y-3 text-[15px] leading-7 text-[var(--ink-700)]">
              <p>
                We may update this Privacy Policy from time to time. When we do, we will update the &quot;Last Updated&quot;
                date at the top of this page and notify users through a push notification or in-app banner
                for material changes.
              </p>
              <p>
                We encourage you to review this Privacy Policy periodically. Your continued use of the Service
                after any changes constitutes acceptance of the updated policy.
              </p>
            </div>
          </section>

          {/* Section 14 */}
          <section id="contact" className="surface-card rounded-xl p-6 sm:p-8">
            <h2 className="font-display text-xl font-bold tracking-tight text-[var(--ink)]">
              14. Contact Us
            </h2>
            <div className="mt-4 text-[15px] leading-7 text-[var(--ink-700)]">
              <p>If you have any questions or concerns about this Privacy Policy, please contact us:</p>
              <div className="mt-4 rounded-lg border border-[var(--line)] bg-[var(--paper)] p-5">
                <p className="font-display font-bold text-[var(--ink)]">CampusNinja</p>
                <p className="mt-2 text-[var(--muted)]">
                  Email:{' '}
                  <a href="mailto:manavgupta236@gmail.com" className="font-semibold text-[var(--brand)] hover:underline">
                    manavgupta236@gmail.com
                  </a>
                </p>
                <p className="mt-1 text-[var(--muted)]">
                  Website:{' '}
                  <a href="https://campusninja-web.vercel.app" className="font-semibold text-[var(--brand)] hover:underline">
                    campusninja-web.vercel.app
                  </a>
                </p>
                <p className="mt-3 text-[13px] text-[var(--muted-2)]">
                  For data protection grievances under the Indian DPDP Act, you may contact the Data Protection Board of India
                  if your grievance is not resolved within 30 days.
                </p>
              </div>
            </div>
          </section>
        </article>
      </div>
    </div>
  );
}
