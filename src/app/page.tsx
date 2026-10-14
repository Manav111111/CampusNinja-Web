'use client';

import React, { useEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { IntroOverlay } from '@/components/landing/IntroOverlay';
import { LandingHero } from '@/components/landing/LandingHero';
import { NoticesSection } from '@/components/landing/NoticesSection';
import { EventsSection } from '@/components/landing/EventsSection';
import { StudyPathSection } from '@/components/landing/StudyPathSection';

const INTRO_SEEN_KEY = 'cn-intro-seen';

export default function HomePage() {
  const reduceMotion = useReducedMotion();
  const [showIntro, setShowIntro] = useState(false);

  useEffect(() => {
    // Reduced-motion users never get the cinematic intro.
    if (reduceMotion) {
      setShowIntro(false);
      return;
    }
    try {
      if (!window.sessionStorage.getItem(INTRO_SEEN_KEY)) {
        setShowIntro(true);
      }
    } catch {
      setShowIntro(true);
    }
  }, [reduceMotion]);

  const handleIntroComplete = () => {
    setShowIntro(false);
    try {
      window.sessionStorage.setItem(INTRO_SEEN_KEY, '1');
    } catch {
      // sessionStorage unavailable (private mode) — intro simply replays next visit.
    }
  };

  return (
    <div className="flex w-full flex-col bg-[#0A0A0B] text-zinc-100 antialiased">
      {showIntro && <IntroOverlay onComplete={handleIntroComplete} />}

      <main>
        <LandingHero />
        <NoticesSection />
        <EventsSection />
        <StudyPathSection />
      </main>
    </div>
  );
}
