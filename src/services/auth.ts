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
    const returnUrl = redirectTo || `${origin}/profile`;

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: returnUrl,
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
