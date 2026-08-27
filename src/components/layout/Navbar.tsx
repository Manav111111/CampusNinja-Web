'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Search, User, Menu, X } from 'lucide-react';
import { useAcademic } from '@/contexts/AcademicContext';
import { getCurrentSession } from '@/services/auth';
import { supabase } from '@/services/supabase';
import { GlobalSearchDropdown } from '@/components/features/GlobalSearchDropdown';
import { CampusNinjaLogo } from '@/components/common/CampusNinjaLogo';

export const Navbar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { branchName } = useAcademic();
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Exact 3 navigation links (Home is accessed via the official CampusNinja logo)
  const navLinks = [
    { href: '/subjects', label: 'Study Hub' },
    { href: '/skills', label: 'Skills' },
    { href: '/about', label: 'About' },
  ];

  useEffect(() => {
    let mounted = true;
    getCurrentSession().then((session) => {
      if (!mounted) return;
      if (session?.user) {
        setUserName(session.user.user_metadata?.full_name?.split(' ')[0] || '');
        setUserEmail(session.user.email || '');
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

  // Handle click outside to close search dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Do not redirect to /search. Open dropdown instead if not already open
    setIsSearchOpen(true);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[rgba(150,155,158,0.18)] bg-[var(--bg-main)]/92 backdrop-blur-md">
      <div className="mx-auto flex h-[68px] sm:h-[80px] w-full items-center justify-between px-4 sm:px-6 lg:px-[5%]">
        
        {/* Left: Official CampusNinja Logo */}
        <CampusNinjaLogo size={42} />

        {/* Center Nav Links (Desktop) */}
        <nav className="hidden items-center gap-[36px] text-[15px] font-[450] text-[#3E4852] lg:flex ml-8 xl:ml-12">
          {navLinks.map((item) => {
            const isActive = pathname === item.href || (item.href === '/subjects' && pathname.startsWith('/subjects')) || (item.href === '/skills' && pathname.startsWith('/skills'));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex flex-col items-center transition-colors duration-200 hover:text-[#15191F] ${
                  isActive ? 'font-[600] text-[#15191F]' : ''
                }`}
              >
                <span>{item.label}</span>
                {isActive && (
                  <span className="absolute -bottom-[12px] h-[4px] w-[4px] rounded-full bg-[#182029]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Center-Right: Global Search Bar with Live Floating Dropdown */}
        <div ref={searchContainerRef} className="relative hidden lg:block ml-auto mr-6">
          <form onSubmit={handleSearchSubmit}>
            <div className="group relative w-[420px] xl:w-[460px]">
              <Search className="absolute left-4 top-1/2 h-[17px] w-[17px] -translate-y-1/2 text-[#7A838B] stroke-[1.8px] transition group-focus-within:text-[#182029]" />
              <input
                type="text"
                value={searchQuery}
                onFocus={() => setIsSearchOpen(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchOpen(true);
                }}
                placeholder="Search subjects, notes, PYQs, videos..."
                className="h-[48px] w-full rounded-full border border-[#D0D3D3] bg-[rgba(255,255,255,0.28)] pl-[46px] pr-[18px] text-[14px] font-[400] text-[#15191F] placeholder:text-[#7A838B] shadow-[0_3px_10px_rgba(0,0,0,0.02)] transition focus:border-[rgba(100,110,120,0.4)] focus:bg-white/80 focus:outline-none"
              />
            </div>
          </form>

          {/* Floating Live Results Dropdown */}
          <GlobalSearchDropdown
            query={searchQuery}
            isOpen={isSearchOpen}
            onClose={() => setIsSearchOpen(false)}
            onSelect={() => setIsSearchOpen(false)}
          />
        </div>

        {/* Right Actions: Login Button + Mobile Toggle (Desktop Menu Button Removed!) */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          {userName ? (
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu((v) => !v)}
                className="flex h-[38px] sm:h-[46px] items-center gap-1.5 sm:gap-2 rounded-full border border-[rgba(38,47,59,0.14)] bg-transparent px-3 sm:px-[20px] text-[13px] sm:text-[14px] font-semibold text-[#11161b] transition hover:bg-[rgba(0,0,0,0.03)]"
              >
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#11161b] text-[10px] text-[#f5f3ee]">
                  {userName.charAt(0).toUpperCase()}
                </div>
                <span className="hidden max-w-[80px] truncate sm:inline">{userName}</span>
              </button>

              {showProfileMenu && (
                <div className="animate-soft-in absolute right-0 mt-2 w-60 sm:w-64 rounded-[14px] border border-slate-200 bg-white p-3 shadow-xl z-50">
                  <div className="border-b border-slate-100 px-3 pb-3">
                    <p className="text-sm font-bold text-slate-950">{userName}</p>
                    <p className="text-xs text-slate-500 truncate">{userEmail}</p>
                  </div>
                  <div className="py-2 text-sm font-medium text-slate-700">
                    <Link href="/profile" onClick={() => setShowProfileMenu(false)} className="block rounded-lg px-3 py-2 hover:bg-slate-50">Profile & Settings</Link>
                    <Link href="/setup" onClick={() => setShowProfileMenu(false)} className="block rounded-lg px-3 py-2 text-blue-600 hover:bg-blue-50">Change Branch & Sem</Link>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/profile"
              className="flex h-[38px] sm:h-[46px] items-center justify-center gap-1.5 sm:gap-2 rounded-full bg-[#151A20] px-4 sm:px-[22px] text-[13px] sm:text-[14px] font-[600] text-[#FFFFFF] transition duration-200 hover:bg-[#000]"
            >
              <User className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span>Login</span>
            </Link>
          )}

          {/* Menu Drawer Toggle ONLY ON MOBILE (Hidden on desktop) */}
          <button
            onClick={() => setMobileMenuOpen((v) => !v)}
            className="flex h-[38px] w-[38px] sm:h-[44px] sm:w-[44px] items-center justify-center rounded-full border border-[rgba(38,47,59,0.14)] bg-transparent text-[#11161b] transition hover:bg-[rgba(0,0,0,0.03)] lg:hidden"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="h-[17px] w-[17px] sm:h-[18px] sm:w-[18px]" /> : <Menu className="h-[17px] w-[17px] sm:h-[18px] sm:w-[18px]" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-[rgba(38,47,59,0.10)] bg-[var(--bg-main)] px-4 sm:px-6 py-4 sm:py-5 lg:hidden animate-soft-in">
          <div className="relative mb-3.5">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#78818c]" />
              <input
                type="text"
                value={searchQuery}
                onFocus={() => setIsSearchOpen(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchOpen(true);
                }}
                placeholder="Search subjects, notes, PYQs, videos..."
                className="h-[44px] w-full rounded-full border border-[rgba(38,47,59,0.13)] bg-[rgba(255,255,255,0.4)] pl-10 pr-4 text-xs sm:text-sm font-medium text-slate-900 shadow-sm"
              />
            </div>
            <GlobalSearchDropdown
              query={searchQuery}
              isOpen={isSearchOpen}
              onClose={() => setIsSearchOpen(false)}
              onSelect={() => {
                setIsSearchOpen(false);
                setMobileMenuOpen(false);
              }}
            />
          </div>
          <div className="flex flex-col space-y-1.5 font-semibold text-sm text-[#4e5966]">
            {navLinks.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setMobileMenuOpen(false)} className="rounded-lg px-3 py-2.5 hover:bg-[rgba(0,0,0,0.03)] transition">
                {item.label}
              </Link>
            ))}
            <Link href="/setup" onClick={() => setMobileMenuOpen(false)} className="rounded-lg px-3 py-2.5 text-[#11161b] hover:bg-[rgba(0,0,0,0.03)] transition">
              Academic Profile {branchName ? `(${branchName})` : ''}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};