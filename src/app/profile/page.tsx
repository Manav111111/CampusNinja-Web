'use client';

import React, { useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import Link from 'next/link';
import { GraduationCap, LogOut, Mail, ShieldCheck, Sparkles, User as UserIcon } from 'lucide-react';
import { Card } from '@/components/common/Card';
import { Skeleton } from '@/components/common/Skeleton';
import { useAcademic } from '@/contexts/AcademicContext';
import { useToast } from '@/contexts/ToastContext';
import { getCurrentSession, handleLogout, performGoogleLogin } from '@/services/auth';
import { supabase } from '@/services/supabase';

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

  return (
    <div className="page-shell animate-soft-in">
      <section className="surface-card rounded-3xl p-6 sm:p-8">
        <p className="eyebrow"><Sparkles className="h-3.5 w-3.5" /> Account</p>
        <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">Profile and settings</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
          Manage identity, academic profile, bookmarks, and marketplace request history.
        </p>
      </section>

      {loading ? (
        <Skeleton className="h-56 rounded-3xl" />
      ) : !session ? (
        <Card className="mx-auto max-w-2xl p-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-blue-50 text-blue-600"><UserIcon className="h-8 w-8" /></div>
          <h2 className="mt-5 text-2xl font-black text-slate-950">Sign in to CampusNinja</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
            Sync bookmarks, track marketplace requests, and receive personalized academic notifications.
          </p>
          <button onClick={onGoogleSignIn} className="mt-7 inline-flex h-12 items-center gap-2 rounded-2xl bg-slate-950 px-6 text-sm font-bold text-white transition hover:bg-blue-700">
            <ShieldCheck className="h-4 w-4" /> Continue with Google
          </button>
        </Card>
      ) : (
        <Card className="mx-auto w-full max-w-4xl p-6 sm:p-8">
          <div className="flex flex-col gap-5 border-b border-slate-100 pb-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-950 text-2xl font-black text-white">
                {session?.user?.user_metadata?.full_name?.charAt(0) || 'U'}
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-950">{session?.user?.user_metadata?.full_name || 'Verified Student'}</h2>
                <p className="mt-1 flex items-center gap-2 text-sm text-slate-500"><Mail className="h-4 w-4" /> {session?.user?.email}</p>
              </div>
            </div>
            <button onClick={onSignOut} className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 text-sm font-bold text-rose-700 transition hover:bg-rose-100">
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <GraduationCap className="h-5 w-5 text-blue-600" />
              <h3 className="mt-4 text-sm font-black text-slate-950">Academic profile</h3>
              <p className="mt-1 text-sm text-slate-600">{branchName ? `${branchName} / Semester ${semesterNum}` : 'Not configured'}</p>
              <Link href="/setup" className="mt-4 inline-flex text-sm font-bold text-blue-700">Update profile</Link>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <ShieldCheck className="h-5 w-5 text-emerald-600" />
              <h3 className="mt-4 text-sm font-black text-slate-950">Workspace sync</h3>
              <p className="mt-1 text-sm text-slate-600">Bookmarks and orders are connected to this account.</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
