'use client';

import React, { useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import Link from 'next/link';
import { GraduationCap, LogOut, Mail, ShieldCheck, User as UserIcon } from 'lucide-react';
import { Skeleton } from '@/components/common/Skeleton';
import { useAcademic } from '@/contexts/AcademicContext';
import { useToast } from '@/contexts/ToastContext';
import { getCurrentSession, handleLogout, performGoogleLogin } from '@/services/auth';
import { supabase } from '@/services/supabase';
import { TechnicalAccountVisual } from '@/components/features/TechnicalAccountVisual';
import { LoginFeatureStrip } from '@/components/features/LoginFeatureStrip';

export default function ProfilePage() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { branchName, semesterNum } = useAcademic();
  const { showToast } = useToast();

  useEffect(() => {
    let mounted = true;
    getCurrentSession().then((data) => {
      if (!mounted) return;
      setSession(data);
      setLoading(false);
    }).catch(() => {
      if (mounted) setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
      if (!mounted) return;
      setSession(newSession);
      setLoading(false);
      if (newSession && typeof window !== 'undefined' && window.location.search.includes('code=')) {
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const onGoogleSignIn = async () => {
    try {
      await performGoogleLogin();
    } catch {
      showToast({ type: 'error', title: 'Login error', message: 'Could not connect to Google OAuth.' });
    }
  };

  const onSignOut = async () => {
    try {
      await handleLogout();
      setSession(null);
      showToast({ type: 'info', title: 'Signed out', message: 'You have logged out successfully.' });
    } catch {
      showToast({ type: 'error', title: 'Logout failed' });
    }
  };

  if (loading) {
    return (
      <div className="mx-auto flex min-h-[70vh] w-full max-w-5xl items-center justify-center px-6 py-20">
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  // Not signed in -> Render exact reference Login Experience
  if (!session) {
    return (
      <div className="relative flex min-h-screen w-full flex-col overflow-hidden bg-[#F5F5F3] text-[#17202B] antialiased">
        {/* Background gradient */}
        <div 
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            backgroundImage: `
              radial-gradient(circle at 75% 35%, rgba(255,255,255,0.45) 0%, transparent 40%),
              linear-gradient(180deg, #F7F7F5 0%, #F3F3F1 100%)
            `
          }}
        />

        {/* Hero Section */}
        <div className="mx-auto flex w-full flex-1 flex-col justify-between px-[24px] lg:px-[64px] pt-[56px] lg:pt-[80px] pb-[40px]">
          <div className="grid items-center gap-12 lg:grid-cols-[46%_54%]">
            
            {/* Left Column */}
            <div className="flex flex-col items-start max-w-[650px]">
              
              {/* Technical Eyebrow */}
              <div className="flex items-center gap-[12px] mb-[42px] lg:mb-[52px]">
                <span className="font-mono-spec text-[14px] font-[500] tracking-[0.04em] text-[#3D4854]">
                  02
                </span>
                <span className="h-[1px] w-[34px] bg-[rgba(21,27,36,0.30)]" />
                <span className="font-mono-spec text-[13px] font-[500] tracking-[0.16em] uppercase text-[#596572]">
                  ACCOUNT ACCESS
                </span>
              </div>

              {/* Main Headline */}
              <h1 className="text-[clamp(44px,4.3vw,68px)] font-[720] leading-[1.06] tracking-[-0.055em] text-[#17202B]">
                Welcome back.<br />
                Enter your Campus.
              </h1>

              {/* Description */}
              <p className="mt-[28px] lg:mt-[30px] max-w-[620px] text-[18px] lg:text-[20px] font-[400] leading-[1.7] text-[#617080]">
                Sign in to access your study materials, bookmarks,<br className="hidden sm:inline" />
                learning progress, and everything built for your future.
              </p>

              {/* Continue With & Google Button */}
              <div className="mt-[48px] lg:mt-[62px] w-full max-w-[470px]">
                <div className="flex items-center gap-4">
                  <span className="font-mono-spec text-[13px] font-[500] tracking-[0.15em] uppercase text-[#5B6672] shrink-0">
                    CONTINUE WITH
                  </span>
                  <span className="h-[1px] flex-1 bg-[rgba(21,27,36,0.12)]" />
                </div>

                <button
                  onClick={onGoogleSignIn}
                  className="group mt-[22px] flex h-[68px] w-full items-center justify-between rounded-[8px] bg-[#111925] px-[24px] text-white shadow-[0_10px_25px_rgba(15,22,30,0.14)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#1A2330]"
                >
                  <div className="flex shrink-0 items-center justify-center">
                    <svg className="h-[22px] w-[22px]" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z" />
                      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.35 24 12 24z" />
                      <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.16 0 9.97 0 12s.45 3.84 1.25 5.42l4.03-3.15z" />
                      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
                    </svg>
                  </div>
                  <span className="text-[17px] font-[600] text-[#F6F6F3]">
                    Continue with Google
                  </span>
                  <span className="text-[20px] font-[300] text-white/80 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                    ↗
                  </span>
                </button>

                <p className="mt-[22px] text-[15px] font-[400] leading-relaxed text-[#697584]">
                  By continuing, you agree to our{' '}
                  <Link href="/terms" className="text-[#3D4854] underline decoration-[rgba(21,27,36,0.35)] underline-offset-4 transition hover:text-black">
                    Terms of Use
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy-policy" className="text-[#3D4854] underline decoration-[rgba(21,27,36,0.35)] underline-offset-4 transition hover:text-black">
                    Privacy Policy
                  </Link>
                  .
                </p>
              </div>

              {/* Code detail */}
              <div className="mt-[50px] lg:mt-[65px] flex items-center gap-[10px]">
                <span className="h-[7px] w-[7px] rounded-full bg-[#4AA07B]" />
                <span className="font-mono-spec text-[13px] font-[400] tracking-[0.02em] text-[#697584]">
                  ready.when.you.are();
                </span>
              </div>

            </div>

            {/* Right Column: Visual */}
            <div className="flex w-full items-center justify-center lg:justify-end">
              <TechnicalAccountVisual />
            </div>

          </div>
        </div>

        {/* Feature Strip */}
        <LoginFeatureStrip />
      </div>
    );
  }

  // Signed in User Profile Dashboard (Exact same futuristic technical UI with dynamic data)
  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-hidden bg-[#F5F5F3] text-[#17202B] antialiased">
      
      {/* ── BACKGROUND ATMOSPHERE ── */}
      <div 
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          backgroundImage: `
            radial-gradient(circle at 75% 35%, rgba(255,255,255,0.45) 0%, transparent 40%),
            linear-gradient(180deg, #F7F7F5 0%, #F3F3F1 100%)
          `
        }}
      />

      <div className="mx-auto flex w-full flex-1 flex-col justify-between px-[24px] lg:px-[64px] pt-[48px] lg:pt-[64px] pb-[40px]">
        
        {/* ── DASHBOARD HEADER ── */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 border-b border-[rgba(21,27,36,0.10)] pb-[36px]">
          <div className="flex flex-col items-start max-w-[700px]">
            
            {/* Technical Eyebrow */}
            <div className="flex items-center gap-[12px] mb-[18px]">
              <span className="font-mono-spec text-[14px] font-[500] tracking-[0.04em] text-[#3D4854]">
                02
              </span>
              <span className="h-[1px] w-[34px] bg-[rgba(21,27,36,0.30)]" />
              <span className="font-mono-spec text-[13px] font-[500] tracking-[0.16em] uppercase text-[#596572]">
                STUDENT DASHBOARD
              </span>
            </div>

            {/* User Greeting */}
            <h1 className="text-[clamp(36px,3.8vw,56px)] font-[720] leading-[1.08] tracking-[-0.05em] text-[#17202B]">
              Welcome back,<br />
              {session?.user?.user_metadata?.full_name || 'Verified Ninja'}.
            </h1>

            <p className="mt-[16px] text-[16px] text-[#617080]">
              Logged in with <span className="font-semibold text-[#17202B]">{session?.user?.email}</span>. Your materials, bookmarks, and curriculum are synced.
            </p>
          </div>

          {/* Quick Sign Out Action */}
          <button 
            onClick={onSignOut} 
            className="inline-flex h-[46px] items-center justify-center gap-2 rounded-[8px] border border-[rgba(21,27,36,0.14)] bg-white/60 px-5 text-sm font-semibold text-[#17202B] transition hover:bg-white shadow-2xs"
          >
            <LogOut className="h-4 w-4 stroke-[1.8]" />
            <span>Sign out</span>
          </button>
        </div>

        {/* ── LIVE ACADEMIC STATUS & CURRICULUM PANEL ── */}
        <div className="my-[42px] grid gap-6 md:grid-cols-3">
          
          {/* Card 1: Branch & Semester */}
          <div className="flex flex-col justify-between rounded-[12px] border border-[rgba(21,27,36,0.10)] bg-white/40 p-6 shadow-sm">
            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-[8px] bg-[#141A21] text-white mb-4 shadow-xs">
                <GraduationCap className="h-5 w-5" />
              </div>
              <span className="font-mono-spec text-[11px] font-[600] tracking-[0.10em] uppercase text-[#718091]">
                ACTIVE CURRICULUM
              </span>
              <h3 className="mt-1 text-lg font-[650] text-[#17202B]">
                {branchName || 'Computer Science Engineering'}
              </h3>
              <p className="mt-1 font-mono-spec text-sm font-semibold text-[#4A5562]">
                Semester {semesterNum || '1'}
              </p>
            </div>
            <Link 
              href="/setup" 
              className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-[#17202B] transition hover:underline"
            >
              <span>Change Curriculum</span>
              <span>→</span>
            </Link>
          </div>

          {/* Card 2: Cloud Workspace Sync */}
          <div className="flex flex-col justify-between rounded-[12px] border border-[rgba(21,27,36,0.10)] bg-white/40 p-6 shadow-sm">
            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-[8px] bg-[#35A47A] text-white mb-4 shadow-xs">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <span className="font-mono-spec text-[11px] font-[600] tracking-[0.10em] uppercase text-[#718091]">
                CLOUD SYNC ACTIVE
              </span>
              <h3 className="mt-1 text-lg font-[650] text-[#17202B]">
                Verified Student Access
              </h3>
              <p className="mt-1 text-sm text-[#617080]">
                All PYQs, lecture notes, and saved materials are live.
              </p>
            </div>
            <Link 
              href="/bookmarks" 
              className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-[#17202B] transition hover:underline"
            >
              <span>View Saved Resources</span>
              <span>→</span>
            </Link>
          </div>

          {/* Card 3: Quick Navigation to Study Hub */}
          <div className="flex flex-col justify-between rounded-[12px] border border-[rgba(21,27,36,0.10)] bg-[#111925] text-white p-6 shadow-sm">
            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-[8px] border border-white/20 bg-white/10 text-white font-mono-spec font-bold text-sm mb-4">
                &lt;/&gt;
              </div>
              <span className="font-mono-spec text-[11px] font-[600] tracking-[0.10em] uppercase text-slate-400">
                STUDY HUB ACCESS
              </span>
              <h3 className="mt-1 text-lg font-[650] text-[#F6F6F3]">
                Open Subjects
              </h3>
              <p className="mt-1 text-sm text-slate-300">
                Jump directly to your semester 1 syllabus and resources.
              </p>
            </div>
            <Link 
              href="/subjects" 
              className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-white transition hover:underline"
            >
              <span>Explore Study Hub</span>
              <span>↗</span>
            </Link>
          </div>

        </div>

      </div>

      {/* ── FEATURE STRIP ── */}
      <LoginFeatureStrip />

    </div>
  );
}
