'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Bookmark,
  BookOpen,
  ChevronRight,
  HelpCircle,
  Home,
  PackageCheck,
  Search,
  ShoppingBag,
  User,
  X,
  Zap,
} from 'lucide-react';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const navGroups = [
  {
    group: 'LEARN',
    items: [
      { name: 'Dashboard', href: '/', icon: Home },
      { name: 'Study Hub', href: '/subjects', icon: BookOpen },
      { name: 'Skills Hub', href: '/skills', icon: Zap },
      { name: 'Search', href: '/search', icon: Search },
    ],
  },
  {
    group: 'WORKSPACE',
    items: [
      { name: 'Marketplace', href: '/marketplace', icon: ShoppingBag, badge: 'PRO' },
      { name: 'Orders', href: '/orders', icon: PackageCheck },
      { name: 'Bookmarks', href: '/bookmarks', icon: Bookmark },
    ],
  },
  {
    group: 'ACCOUNT',
    items: [
      { name: 'Support', href: '/support', icon: HelpCircle },
      { name: 'Profile', href: '/profile', icon: User },
    ],
  },
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();

  return (
    <>
      {isOpen && (
        <button
          type="button"
          aria-label="Close navigation overlay"
          onClick={onClose}
          className="fixed inset-0 z-50 bg-[var(--ink)]/40 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`fixed bottom-0 left-0 top-0 z-50 w-72 transition-transform duration-300 lg:sticky lg:top-20 lg:z-30 lg:h-[calc(100vh-6rem)] lg:w-64 lg:translate-x-0 lg:py-8 ${isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="glass-panel flex h-full flex-col overflow-hidden rounded-none border border-[var(--line)] lg:rounded-xl">
          <div className="flex h-16 items-center justify-between border-b border-[var(--line)] px-5 lg:hidden">
            <Link href="/" onClick={onClose} className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-md border-2 border-[var(--ink)] bg-[var(--ink)] font-mono-spec text-[12px] font-bold text-white">
                CN
              </div>
              <div>
                <p className="font-display text-sm font-bold text-[var(--ink)]">CampusNinja</p>
                <p className="font-mono-spec text-[10px] font-semibold text-[var(--brand)]">STUDY OS</p>
              </div>
            </Link>
            <button
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-md text-[var(--muted)] transition hover:bg-[var(--brand-50)] hover:text-[var(--ink)]"
              aria-label="Close navigation"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <div className="mb-5 hidden rounded-lg border border-[var(--line-strong)] bg-[var(--brand-50)] p-4 lg:block">
              <p className="font-mono-spec text-[10px] font-bold uppercase tracking-[0.1em] text-[var(--brand)]">
                Doc / 000
              </p>
              <p className="mt-2 text-sm leading-5 text-[var(--ink-700)]">
                Pick a course, continue resources, and manage academic work from one calm workspace.
              </p>
            </div>

            <div className="space-y-6">
              {navGroups.map((group) => (
                <div key={group.group} className="space-y-1.5">
                  <p className="px-3 font-mono-spec text-[10px] font-bold tracking-[0.14em] text-[var(--muted-2)]">{group.group}</p>
                  <nav className="space-y-1">
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));

                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={onClose}
                          className={`group flex items-center justify-between rounded-md px-3 py-2.5 text-[13px] font-semibold transition ${isActive
                            ? 'bg-[var(--ink)] text-white'
                            : 'text-[var(--muted)] hover:bg-[var(--brand-50)] hover:text-[var(--ink)]'
                            }`}
                        >
                          <span className="flex items-center gap-3">
                            <Icon className={`h-4 w-4 ${isActive ? 'text-[var(--amber)]' : 'text-[var(--muted-2)] group-hover:text-[var(--brand)]'}`} />
                            {item.name}
                          </span>
                          {item.badge ? (
                            <span className={`font-mono-spec rounded px-1.5 py-0.5 text-[9px] font-bold ${isActive ? 'bg-white/15 text-white' : 'bg-[var(--amber-50)] text-[var(--amber-600)]'}`}>
                              {item.badge}
                            </span>
                          ) : (
                            <ChevronRight className={`h-4 w-4 transition ${isActive ? 'text-white/40' : 'text-[var(--line-strong)] group-hover:text-[var(--muted-2)]'}`} />
                          )}
                        </Link>
                      );
                    })}
                  </nav>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-[var(--line)] p-4">
            <Link
              href="/setup"
              onClick={onClose}
              className="spec-corners flex items-center justify-between rounded-md border border-[var(--line)] bg-white p-3 transition hover:border-[var(--brand)]"
            >
              <span className="flex min-w-0 items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded bg-[var(--ink)] font-mono-spec text-[11px] font-bold text-white">
                  ID
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-bold text-[var(--ink)]">Academic profile</span>
                  <span className="block truncate text-xs font-medium text-[var(--muted)]">Branch and semester</span>
                </span>
              </span>
              <ChevronRight className="h-4 w-4 text-[var(--muted-2)]" />
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
};