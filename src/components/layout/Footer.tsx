import React from 'react';
import Link from 'next/link';
import { isReviewMode } from '@/config/reviewMode';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto border-t border-[var(--line)] bg-white/70 py-10 backdrop-blur-xl">
      <div className="mx-auto grid w-full max-w-[1320px] grid-cols-1 gap-8 px-5 sm:px-8 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div className="space-y-4">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-md border-2 border-[var(--ink)] bg-[var(--ink)] font-mono-spec text-[12px] font-bold text-white">
              CN
            </div>
            <div>
              <p className="font-display text-sm font-bold text-[var(--ink)]">CampusNinja</p>
              <p className="font-mono-spec text-[10px] font-semibold text-[var(--muted)]">ENGINEERING STUDY HUB</p>
            </div>
          </Link>
          <p className="max-w-sm text-sm leading-6 text-[var(--muted)]">
            A focused educational platform for notes, PYQs, syllabus, videos, assignments, and lab manuals.
          </p>
        </div>

        {[
          ['Study', [['Study Hub', '/subjects'], ['Search Library', '/search'], ['Skill Tracks', '/skills']]],
          ['Marketplace', [['Services', '/marketplace'], ['Track Orders', '/orders'], ['Bookmarks', '/bookmarks']]],
          ['Help & Info', [[isReviewMode() ? 'Help & FAQ' : 'Support & Community', '/support'], ['Contact Us', '/contact'], ['About Us', '/about']]],
          ['Legal & Policies', [['Privacy Policy', '/privacy-policy'], ['Terms & Conditions', '/terms'], ['Refund Policy', '/refund-policy'], ['Shipping Policy', '/shipping-policy']]],
        ].map(([title, links]) => (
          <div key={title as string}>
            <h4 className="mb-3 font-mono-spec text-[10px] font-bold tracking-[0.14em] text-[var(--muted-2)]">{(title as string).toUpperCase()}</h4>
            <ul className="space-y-2 text-sm font-medium text-[var(--muted)]">
              {(links as string[][]).map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="transition duration-200 ease-out hover:text-[var(--brand)]">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mx-auto mt-8 flex w-full max-w-[1320px] flex-col gap-3 border-t border-[var(--line)] px-5 pt-6 text-xs font-medium text-[var(--muted)] sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <span className="font-mono-spec text-[11px]">© {new Date().getFullYear()} CAMPUSNINJA — ALL RIGHTS RESERVED</span>
        <div className="flex flex-wrap gap-5">
          <Link href="/about" className="hover:text-[var(--ink)]">About</Link>
          <Link href="/contact" className="hover:text-[var(--ink)]">Contact</Link>
          <Link href="/privacy-policy" className="hover:text-[var(--ink)]">Privacy</Link>
          <Link href="/terms" className="hover:text-[var(--ink)]">Terms</Link>
          <Link href="/refund-policy" className="hover:text-[var(--ink)]">Refunds</Link>
          <Link href="/shipping-policy" className="hover:text-[var(--ink)]">Shipping & Delivery</Link>
        </div>
      </div>
    </footer>
  );
};