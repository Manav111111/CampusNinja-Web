import React from 'react';
import Link from 'next/link';
import { 
  BookOpen, 
  GraduationCap, 
  ShoppingBag, 
  Info, 
  HelpCircle, 
  Users, 
  Presentation,
  ArrowRight, 
  ArrowUpRight 
} from 'lucide-react';
import { CampusNinjaLogo } from '@/components/common/CampusNinjaLogo';

const InstagramIcon: React.FC<{ className?: string }> = ({ className = 'h-5 w-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const LinkedInIcon: React.FC<{ className?: string }> = ({ className = 'h-5 w-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export const Footer: React.FC = () => {
  return (
    <footer className="relative mt-auto w-full overflow-hidden bg-[#111923] text-[#E5E7EB] antialiased">
      
      {/* ── TOP-LEFT ANGULAR CUT DECORATION (SVG OVERLAY / CLIP-PATH) ── */}
      <div 
        className="pointer-events-none absolute top-0 left-0 w-full h-[45px] sm:h-[65px] lg:h-[90px] -z-0"
        style={{
          background: 'var(--bg-main)',
          clipPath: 'polygon(0 0, 130px 0, 0 85px)',
        }}
      />

      {/* ── BACKGROUND TECHNICAL BLUEPRINT LINES & NODES ── */}
      <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-40 select-none" viewBox="0 0 1440 700" fill="none">
        {/* Top-left circuit trace */}
        <path d="M 90 45 L 230 45 L 300 100 L 460 100" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
        <circle cx="460" cy="100" r="2.5" fill="#FFFFFF" opacity="0.6" />

        {/* Lower-right circuit connector */}
        <path d="M 1200 520 L 1310 420 L 1400 420" stroke="rgba(255,255,255,0.14)" strokeWidth="1" />
        <circle cx="1200" cy="520" r="2" fill="#FFFFFF" opacity="0.5" />
        <circle cx="1310" cy="420" r="3.5" stroke="rgba(255,255,255,0.5)" strokeWidth="1" fill="none" />
      </svg>

      {/* Left Dotted Grid Matrix */}
      <div className="pointer-events-none absolute left-[40px] top-[240px] hidden sm:grid grid-cols-4 gap-[8px] opacity-20 select-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <span key={i} className="h-[2px] w-[2px] rounded-full bg-white" />
        ))}
      </div>

      {/* Right Dotted Grid Matrix */}
      <div className="pointer-events-none absolute right-[50px] top-[220px] hidden sm:grid grid-cols-5 gap-[8px] opacity-20 select-none">
        {Array.from({ length: 25 }).map((_, i) => (
          <span key={i} className="h-[2px] w-[2px] rounded-full bg-white" />
        ))}
      </div>

      {/* Large Subtle Background Watermark Symbol </> */}
      <div className="pointer-events-none absolute right-[40px] lg:right-[100px] top-[50px] select-none font-mono-spec text-[120px] lg:text-[200px] font-[700] tracking-[-0.08em] text-white/[0.03]">
        &lt;/&gt;
      </div>

      {/* ── MAIN CONTENT CONTAINER ── */}
      <div className="relative mx-auto w-full max-w-[1240px] px-5 sm:px-12 pt-12 sm:pt-16 lg:pt-[120px] pb-6 sm:pb-8 lg:pb-[40px]">
        
        {/* ── 3-COLUMN LAYOUT ── */}
        <div className="grid grid-cols-1 gap-8 sm:gap-10 lg:grid-cols-[1.25fr_0.9fr_1fr] lg:gap-16">
          
          {/* ── COLUMN 1: BRAND AREA ── */}
          <div className="flex flex-col items-start">
            
            {/* Logo Row */}
            <div className="sm:hidden">
              <CampusNinjaLogo size={44} variant="light" />
            </div>
            <div className="hidden sm:block">
              <CampusNinjaLogo size={58} variant="light" />
            </div>

            {/* Engineering Study Hub Label */}
            <span className="mt-4 sm:mt-6 lg:mt-[34px] font-mono-spec text-[12px] sm:text-[14px] font-[500] uppercase tracking-[0.20em] sm:tracking-[0.22em] text-[#7A8593]">
              ENGINEERING STUDY HUB
            </span>

            {/* Controlled Width Description */}
            <p className="mt-2 sm:mt-4 lg:mt-[28px] max-w-[340px] text-[14.5px] sm:text-[17px] font-[400] leading-[1.6] text-[#9EA8B4]">
              Everything you need to learn,<br className="hidden sm:inline" />
              build projects, explore skills,<br className="hidden sm:inline" />
              and grow your future.
            </p>

            {/* Thin Decorative Horizontal Line with Terminal Node */}
            <div className="mt-3.5 sm:mt-5 lg:mt-[32px] flex items-center">
              <span className="h-[1px] w-[90px] sm:w-[130px] bg-white/18" />
              <span className="h-[5px] w-[5px] rounded-full border border-white/60 bg-transparent -ml-[1px]" />
            </div>

            {/* Bottom Brand Tagline */}
            <div className="mt-3 sm:mt-4 lg:mt-[26px] font-mono-spec text-[13px] sm:text-[15px] font-[500] tracking-[0.16em] sm:tracking-[0.18em]">
              <span className="text-[#35A47A] mr-2">//</span>
              <span className="text-[#9EA8B4]">CODE. LEARN. GROW.</span>
            </div>

          </div>

          {/* ── COLUMN 2: EXPLORE ── */}
          <div className="flex flex-col">
            
            {/* Heading */}
            <span className="font-mono-spec text-[13.5px] sm:text-[15px] font-[600] uppercase tracking-[0.18em] sm:tracking-[0.20em] text-[#A2ACB8]">
              EXPLORE
            </span>
            <div className="mt-2 h-[2px] w-[36px] sm:w-[42px] bg-white/25" />

            {/* Links List */}
            <div className="mt-4 sm:mt-6 lg:mt-8 flex flex-col space-y-2.5 sm:space-y-4">
              {[
                { label: 'Study Hub', href: '/subjects', icon: <BookOpen className="h-[18px] w-[18px] sm:h-[20px] sm:w-[20px] stroke-[1.6]" /> },
                { label: 'Skills', href: '/skills', icon: <GraduationCap className="h-[18px] w-[18px] sm:h-[20px] sm:w-[20px] stroke-[1.6]" /> },
                { label: 'Marketplace', href: '/marketplace', icon: <ShoppingBag className="h-[18px] w-[18px] sm:h-[20px] sm:w-[20px] stroke-[1.6]" /> },
                { label: 'About', href: '/about', icon: <Info className="h-[18px] w-[18px] sm:h-[20px] sm:w-[20px] stroke-[1.6]" /> },
                { label: 'Help & FAQ', href: '/support', icon: <HelpCircle className="h-[18px] w-[18px] sm:h-[20px] sm:w-[20px] stroke-[1.6]" /> },
              ].map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="group flex items-center justify-between py-1 text-[15px] sm:text-[17px] font-[500] text-[#E5E7EB] transition-colors hover:text-white"
                >
                  <div className="flex items-center gap-3 sm:gap-3.5">
                    <span className="text-[#A2ACB8] transition-colors group-hover:text-white">
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#7A8593] transition-transform duration-200 group-hover:translate-x-1 group-hover:text-white" />
                </Link>
              ))}
            </div>

          </div>

          {/* ── COLUMN 3: CONNECT ── */}
          <div className="flex flex-col">
            
            {/* Heading */}
            <span className="font-mono-spec text-[13.5px] sm:text-[15px] font-[600] uppercase tracking-[0.18em] sm:tracking-[0.20em] text-[#A2ACB8]">
              CONNECT
            </span>
            <div className="mt-2 h-[2px] w-[36px] sm:w-[42px] bg-white/25" />

            {/* Social / Community Rows */}
            <div className="mt-4 sm:mt-6 lg:mt-8 flex flex-col divide-y divide-white/[0.09]">
              {[
                { 
                  label: 'Google Classroom', 
                  href: 'https://classroom.google.com', 
                  isExternal: true, 
                  icon: <Presentation className="h-[17px] w-[17px] sm:h-[18px] sm:w-[18px] stroke-[1.6]" /> 
                },
                { 
                  label: 'LinkedIn', 
                  href: 'https://www.linkedin.com/company/campusninja', 
                  isExternal: true, 
                  icon: <LinkedInIcon className="h-[17px] w-[17px] sm:h-[18px] sm:w-[18px]" /> 
                },
                { 
                  label: 'Instagram', 
                  href: 'https://www.instagram.com/campusninja.in', 
                  isExternal: true, 
                  icon: <InstagramIcon className="h-[17px] w-[17px] sm:h-[18px] sm:w-[18px]" /> 
                },
                { 
                  label: 'Join Community', 
                  href: '/support', 
                  isExternal: false, 
                  icon: <Users className="h-[17px] w-[17px] sm:h-[18px] sm:w-[18px] stroke-[1.6]" /> 
                },
              ].map((row) => {
                const Content = (
                  <div className="group flex items-center justify-between py-2 sm:py-3 transition-colors hover:bg-white/[0.02] -mx-2 px-2 rounded-lg">
                    <div className="flex items-center gap-3 sm:gap-3.5">
                      <div className="flex h-9 w-9 sm:h-[46px] sm:w-[46px] items-center justify-center rounded-[8px] sm:rounded-[10px] border border-white/12 bg-white/[0.02] text-[#E5E7EB] transition-colors group-hover:border-white/25 group-hover:text-white">
                        {row.icon}
                      </div>
                      <span className="text-[15px] sm:text-[17px] font-[500] text-[#E5E7EB] transition-colors group-hover:text-white">
                        {row.label}
                      </span>
                    </div>
                    <ArrowUpRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#7A8593] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white" />
                  </div>
                );

                return row.isExternal ? (
                  <a key={row.label} href={row.href} target="_blank" rel="noopener noreferrer">
                    {Content}
                  </a>
                ) : (
                  <Link key={row.label} href={row.href}>
                    {Content}
                  </Link>
                );
              })}
            </div>

          </div>

        </div>

        {/* ── BOTTOM LEGAL & STATUS BAR ── */}
        <div className="mt-8 sm:mt-12 lg:mt-[68px] flex flex-col gap-4 sm:gap-6 border-t border-white/10 pt-4 sm:pt-[32px] sm:flex-row sm:items-center sm:justify-between text-[13.5px] sm:text-[15px] text-[#7A8593]">
          
          {/* Left: Copyright */}
          <div>
            © {new Date().getFullYear()} CampusNinja. All rights reserved.
          </div>

          {/* Center: Privacy & Terms */}
          <div className="flex items-center gap-4 text-[#9EA8B4]">
            <Link href="/privacy-policy" className="transition-colors hover:text-white">
              Privacy
            </Link>
            <span className="text-white/20">|</span>
            <Link href="/terms" className="transition-colors hover:text-white">
              Terms
            </Link>
          </div>

          {/* Right: Live Learning Status Indicator */}
          <div className="flex items-center gap-2 font-mono-spec text-[11.5px] sm:text-[13px] tracking-[0.14em] sm:tracking-[0.16em] uppercase text-[#9EA8B4]">
            <span className="h-[6px] w-[6px] sm:h-[7px] sm:w-[7px] rounded-full bg-[#35A47A] shadow-[0_0_8px_#35A47A]" />
            <span>ALL SYSTEMS LEARNING</span>
          </div>

        </div>

      </div>

    </footer>
  );
};