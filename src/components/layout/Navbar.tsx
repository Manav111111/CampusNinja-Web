'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ChevronDown,
  Search,
  User,
} from 'lucide-react';
import { useAcademic } from '@/contexts/AcademicContext';
import { getCurrentSession } from '@/services/auth';
import { supabase } from '@/services/supabase';
import { isReviewMode } from '@/config/reviewMode';

export const Navbar: React.FC = () => {
  const router = useRouter();
  const { branchName, semesterNum } = useAcademic();
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const navItems = [
    { href: '/subjects', label: 'Study Hub' },
    { href: '/marketplace', label: 'Marketplace' },
    { href: '/skills', label: 'Skills' },
    { href: '/support', label: isReviewMode() ? 'Help & FAQ' : 'Community' },
    { href: '/orders', label: 'Premium' },
  ];

  useEffect(() => {
    let mounted = true;
    getCurrentSession().then((session) => {
      if (!mounted) return;
      if (session?.user) {
        setUserName(session.user.user_metadata?.full_name?.split(' ')[0] || '');
        setUserEmail(session.user.email || '');
      } else {
        setUserName('');
        setUserEmail('');
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;
      if (session?.user) {
        setUserName(session.user.user_metadata?.full_name?.split(' ')[0] || '');
        setUserEmail(session.user.email || '');
      } else {
        setUserName('');
        setUserEmail('');
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[var(--line)] bg-white/85 backdrop-blur-xl">
      <div className="mx-auto flex h-[68px] w-full max-w-[1320px] items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex min-w-fit items-center gap-2.5" aria-label="CampusNinja home">
          <div className="flex h-9 w-9 items-center justify-center rounded-md border-2 border-[var(--ink)] bg-[var(--ink)] font-mono-spec text-[13px] font-bold text-white">
            CN
          </div>
          <span className="font-display text-[17px] font-bold tracking-tight text-[var(--ink)]">
            CampusNinja
          </span>
        </Link>

        <nav className="hidden items-center gap-7 px-2 text-[13px] font-semibold text-[var(--muted)] lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="relative py-1 transition duration-200 ease hover:text-[var(--ink)] after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-0 after:bg-[var(--brand)] after:transition-all after:duration-200 hover:after:w-full"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <form onSubmit={handleSearchSubmit} className="ml-auto hidden min-w-0 max-w-sm flex-1 md:block">
          <div className="group relative">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted-2)] transition duration-200 ease group-focus-within:text-[var(--brand)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search subjects, PYQs, notes…"
              className="soft-input focus-ring h-10 w-full rounded-md border border-[var(--line)] pl-10 pr-4 text-[13px] font-medium text-[var(--ink)] placeholder:text-[var(--muted-2)] focus:border-[var(--brand)]"
            />
          </div>
        </form>

        <div className="flex shrink-0 items-center gap-2">
          <Link
            href="/setup"
            className="soft-input focus-ring hidden h-10 items-center gap-2 rounded-md border border-[var(--line)] px-3 text-[12px] font-mono-spec font-semibold text-[var(--muted)] transition duration-200 ease hover:border-[var(--brand)] hover:text-[var(--ink)] md:flex"
          >
            <span className="max-w-[170px] truncate">
              {branchName ? `${branchName.toUpperCase()} · S${semesterNum || '—'}` : 'SET CURRICULUM'}
            </span>
            <ChevronDown className="h-3.5 w-3.5 text-[var(--muted-2)]" />
          </Link>

          <div className="relative">
            <button
              onClick={() => setShowProfileMenu((value) => !value)}
              className="soft-input focus-ring flex h-10 items-center gap-2 rounded-md border border-[var(--line)] px-2 text-[var(--muted)] transition duration-200 ease hover:border-[var(--brand)] hover:text-[var(--ink)]"
              aria-label="Account menu"
            >
              <div className="flex h-6.5 w-6.5 h-[26px] w-[26px] items-center justify-center rounded bg-[var(--ink)] text-[11px] font-bold text-white">
                {userName ? userName.charAt(0).toUpperCase() : <User className="h-3.5 w-3.5" />}
              </div>
              <span className="hidden max-w-[84px] truncate text-[13px] font-medium sm:block">{userName || 'Student'}</span>
              <ChevronDown className="hidden h-3.5 w-3.5 text-[var(--muted-2)] sm:block" />
            </button>

            {showProfileMenu && (
              <div className="glass-panel animate-soft-in absolute right-0 mt-3 w-72 rounded-lg border border-[var(--line)] bg-white p-3 shadow-xl">
                <div className="border-b border-[var(--line)] px-3 pb-3">
                  <p className="text-sm font-bold text-[var(--ink)]">{userName ? `Hi, ${userName}` : 'Student profile'}</p>
                  <p className="mt-0.5 truncate text-xs text-[var(--muted)]">{userEmail || 'Sign in to sync your resources'}</p>
                </div>
                <div className="py-2">
                  {[
                    { href: '/profile', label: 'Profile and settings' },
                    { href: '/orders', label: 'Orders and requests' },
                    { href: '/bookmarks', label: 'Saved materials' },
                  ].map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setShowProfileMenu(false)}
                      className="block rounded-md px-3 py-2.5 text-sm font-medium text-[var(--muted)] transition duration-200 ease hover:bg-[var(--brand-50)] hover:text-[var(--ink)]"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
                <Link
                  href="/setup"
                  onClick={() => setShowProfileMenu(false)}
                  className="primary-button block rounded-md px-3 py-2.5 text-center text-xs font-bold text-white transition duration-200 ease"
                >
                  Update academic profile
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};