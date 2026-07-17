'use client';

import React, { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/services/supabase';
import { Loader2 } from 'lucide-react';

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    let mounted = true;
    const nextUrl = searchParams.get('next') || searchParams.get('redirectTo') || '/profile';
    const code = searchParams.get('code');

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;
      if (session) {
        if (typeof window !== 'undefined' && window.location.search.includes('code=')) {
          window.history.replaceState({}, document.title, window.location.pathname);
        }
        router.replace(nextUrl);
      }
    });

    const resolveSession = async () => {
      try {
        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) {
            console.warn('exchangeCodeForSession note (may have been handled by detectSessionInUrl):', error.message);
          }
        }

        const { data: { session } } = await supabase.auth.getSession();
        if (!mounted) return;

        if (session) {
          if (typeof window !== 'undefined' && window.location.search.includes('code=')) {
            window.history.replaceState({}, document.title, window.location.pathname);
          }
          router.replace(nextUrl);
        } else {
          setTimeout(() => {
            if (mounted) {
              supabase.auth.getSession().then(({ data }) => {
                if (mounted) {
                  router.replace(data.session ? nextUrl : '/profile');
                }
              });
            }
          }, 3500);
        }
      } catch (err) {
        console.error('Auth callback error:', err);
        if (mounted) router.replace('/profile');
      }
    };

    resolveSession();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [router, searchParams]);

  return (
    <div className="flex min-h-[60vh] w-full flex-col items-center justify-center gap-4 text-center">
      <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      <p className="font-display text-base font-bold text-slate-700">Completing secure authentication...</p>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-[60vh] w-full flex-col items-center justify-center gap-4 text-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  );
}
