import type { Metadata } from 'next';
import './globals.css';
import { QueryProvider } from '@/providers/QueryProvider';
import { AcademicProvider } from '@/contexts/AcademicContext';
import { ToastProvider } from '@/contexts/ToastContext';
import { MainLayout } from '@/components/layout/MainLayout';

export const metadata: Metadata = {
  title: 'CampusNinja - Engineering Study Hub',
  description: 'Access curated notes, previous year papers, syllabus, video lectures, and academic marketplace services.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased font-sans bg-surface text-slate-950">
        <QueryProvider>
          <AcademicProvider>
            <ToastProvider>
              <MainLayout>{children}</MainLayout>
            </ToastProvider>
          </AcademicProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
