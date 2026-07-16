'use client';

import React from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

export const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--paper)] font-sans text-[var(--ink)] antialiased">
      <Navbar />

      <div className="w-full flex-1">
        <main className="mx-auto flex w-full max-w-[1320px] flex-col px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
          {children}
        </main>
      </div>

      <Footer />
    </div>
  );
};