import { supabase } from './supabase';
import { Session } from '@supabase/supabase-js';

export const getCurrentSession = async (): Promise<Session | null> => {
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    console.error('Error getting session:', error);
    return null;
  }
  return data.session;
};

export const performGoogleLogin = async (redirectTo?: string): Promise<boolean> => {
  try {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    if (!origin) throw new Error('Cannot determine window origin for OAuth redirect.');

    // Determine where the user should land AFTER authentication completes
    let finalDestination = '/profile';
    if (redirectTo) {
      if (redirectTo.startsWith('/')) {
        finalDestination = redirectTo;
      } else if (redirectTo.startsWith('http://') || redirectTo.startsWith('https://')) {
        // Extract just the pathname from an absolute URL on the same origin
        try {
          const url = new URL(redirectTo);
          finalDestination = url.pathname + url.search + url.hash;
        } catch {
          finalDestination = '/profile';
        }
      } else {
        finalDestination = `/${redirectTo}`;
      }
    }

    // Always redirect through /auth/callback so the PKCE code exchange happens reliably.
    // The callback page reads ?next= and redirects the user to their final destination.
    const callbackUrl = `${origin}/auth/callback?next=${encodeURIComponent(finalDestination)}`;

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: callbackUrl,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Google Login Error:', error);
    throw error;
  }
};

export const handleLogout = async (): Promise<void> => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};
