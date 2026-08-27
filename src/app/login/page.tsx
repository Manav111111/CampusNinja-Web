'use client';

import React from 'react';
import Link from 'next/link';
import { performGoogleLogin } from '@/services/auth';
import { useToast } from '@/contexts/ToastContext';
import { TechnicalAccountVisual } from '@/components/features/TechnicalAccountVisual';
import { LoginFeatureStrip } from '@/components/features/LoginFeatureStrip';

export default function LoginPage() {
  const { showToast } = useToast();

  const handleGoogleSignIn = async () => {
    try {
      await performGoogleLogin();
    } catch {
      showToast({ 
        type: 'error', 
        title: 'Login error', 
        message: 'Could not connect to Google OAuth.' 
      });
    }
  };

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

      {/* ── HERO SECTION (LEFT 46% / RIGHT 54%) ── */}
      <div className="mx-auto flex w-full flex-1 flex-col justify-between px-[24px] lg:px-[64px] pt-[56px] lg:pt-[80px] pb-[40px]">
        
        <div className="grid items-center gap-12 lg:grid-cols-[46%_54%]">
          
          {/* Left Column Content */}
          <div className="flex flex-col items-start max-w-[650px]">
            
            {/* Technical Eyebrow: 02 ───── ACCOUNT ACCESS */}
            <div className="flex items-center gap-[12px] mb-[42px] lg:mb-[52px]">
              <span className="font-mono-spec text-[14px] font-[500] tracking-[0.04em] text-[#3D4854]">
                02
              </span>
              <span className="h-[1px] w-[34px] bg-[rgba(21,27,36,0.30)]" />
              <span className="font-mono-spec text-[13px] font-[500] tracking-[0.16em] uppercase text-[#596572]">
                ACCOUNT ACCESS
              </span>
            </div>

            {/* Main 2-Line Headline */}
            <h1 className="text-[clamp(44px,4.3vw,68px)] font-[720] leading-[1.06] tracking-[-0.055em] text-[#17202B]">
              Welcome back.<br />
              Enter your Campus.
            </h1>

            {/* Description Secondary Copy */}
            <p className="mt-[28px] lg:mt-[30px] max-w-[620px] text-[18px] lg:text-[20px] font-[400] leading-[1.7] text-[#617080]">
              Sign in to access your study materials, bookmarks,<br className="hidden sm:inline" />
              learning progress, and everything built for your future.
            </p>

            {/* Continue With & Google Button */}
            <div className="mt-[48px] lg:mt-[62px] w-full max-w-[470px]">
              
              {/* Monospace Section Label with Extending Line */}
              <div className="flex items-center gap-4">
                <span className="font-mono-spec text-[13px] font-[500] tracking-[0.15em] uppercase text-[#5B6672] shrink-0">
                  CONTINUE WITH
                </span>
                <span className="h-[1px] flex-1 bg-[rgba(21,27,36,0.12)]" />
              </div>

              {/* Google Button */}
              <button
                onClick={handleGoogleSignIn}
                className="group mt-[22px] flex h-[68px] w-full items-center justify-between rounded-[8px] bg-[#111925] px-[24px] text-white shadow-[0_10px_25px_rgba(15,22,30,0.14)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#1A2330]"
              >
                {/* Google Multicolor Logo */}
                <div className="flex shrink-0 items-center justify-center">
                  <svg className="h-[22px] w-[22px]" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.35 24 12 24z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.16 0 9.97 0 12s.45 3.84 1.25 5.42l4.03-3.15z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                    />
                  </svg>
                </div>

                {/* Button Text */}
                <span className="text-[17px] font-[600] text-[#F6F6F3]">
                  Continue with Google
                </span>

                {/* Up-Right Arrow */}
                <span className="text-[20px] font-[300] text-white/80 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                  ↗
                </span>
              </button>

              {/* Terms of Use & Privacy Policy */}
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

            {/* Code Detail at Bottom Left */}
            <div className="mt-[50px] lg:mt-[65px] flex items-center gap-[10px]">
              <span className="h-[7px] w-[7px] rounded-full bg-[#4AA07B]" />
              <span className="font-mono-spec text-[13px] font-[400] tracking-[0.02em] text-[#697584]">
                ready.when.you.are();
              </span>
            </div>

          </div>

          {/* Right Column: Technical Blueprint Illustration */}
          <div className="flex w-full items-center justify-center lg:justify-end">
            <TechnicalAccountVisual />
          </div>

        </div>

      </div>

      {/* ── BOTTOM FEATURE STRIP ── */}
      <LoginFeatureStrip />

    </div>
  );
}
