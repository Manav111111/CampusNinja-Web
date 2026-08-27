'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface CampusNinjaLogoProps {
  size?: number;
  className?: string;
  showWordmark?: boolean;
  href?: string;
  variant?: 'light' | 'dark';
}

export const CampusNinjaLogo: React.FC<CampusNinjaLogoProps> = ({
  size = 46,
  className = '',
  showWordmark = true,
  href = '/',
  variant = 'dark',
}) => {
  const content = (
    <div className={`flex items-center gap-3.5 group select-none ${className}`}>
      {/* Official App Logo Icon Image */}
      <div 
        className="relative shrink-0 overflow-hidden rounded-[13px] shadow-[0_4px_12px_rgba(0,0,0,0.12)] transition-transform duration-200 group-hover:scale-[1.02]"
        style={{
          width: `${size}px`,
          height: `${size}px`,
        }}
      >
        <Image
          src="/brand/campusninja-logo.png"
          alt="CampusNinja Logo"
          fill
          sizes={`${size}px`}
          priority
          className="object-contain"
        />
      </div>

      {/* Brand Wordmark Text */}
      {showWordmark && (
        <span 
          className={`text-[21px] font-[650] tracking-[-0.025em] transition-colors ${
            variant === 'light' 
              ? 'text-[#F3F4F6] group-hover:text-white' 
              : 'text-[#252B31] group-hover:text-black'
          }`}
        >
          CampusNinja
        </span>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} aria-label="CampusNinja Home" className="inline-flex items-center">
        {content}
      </Link>
    );
  }

  return content;
};
