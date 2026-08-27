'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

export const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const isFullBleed = 
    pathname === '/' || 
    pathname.startsWith('/subjects') || 
    pathname.startsWith('/skills') || 
    pathname === '/profile' || 
    pathname === '/login';

  return (
    <div className="flex min-h-screen flex-col bg-[var(--bg-main)] font-sans text-[var(--ink)] antialiased">
      <Navbar />

      <div className="w-full flex-1">
        {isFullBleed ? (
          children
        ) : (
          <main className="mx-auto w-full px-[54px] lg:px-[72px] xl:px-[clamp(56px,5vw,88px)] py-10">
            {children}
          </main>
        )}
      </div>

      <Footer />
    </div>
  );
};