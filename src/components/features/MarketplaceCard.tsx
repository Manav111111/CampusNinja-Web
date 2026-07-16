'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Briefcase, Heart, ShieldCheck } from 'lucide-react';
import { Product } from '@/types';

export const MarketplaceCard: React.FC<{ product: Product }> = ({ product }) => {
  const [wishlisted, setWishlisted] = useState(false);

  return (
    <article className="surface-card group flex h-full flex-col overflow-hidden rounded-lg">
      <Link href={`/marketplace/${product.id}`} className="relative block aspect-[16/10] overflow-hidden bg-blue-50">
        {product.thumbnail_url || product.image_url ? (
          <Image
            src={product.thumbnail_url || product.image_url || ''}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 100vw, 360px"
            className="object-cover transition duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-blue-50 text-blue-700">
            <Briefcase className="h-11 w-11" />
          </div>
        )}

        <button
          onClick={(e) => {
            e.preventDefault();
            setWishlisted((value) => !value);
          }}
          aria-label="Add service to wishlist"
          className="focus-ring absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-lg bg-white/90 text-slate-600 shadow-sm backdrop-blur hover:-translate-y-0.5 hover:text-rose-500"
        >
          <Heart className={`h-4 w-4 ${wishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>
      </Link>

      <div className="flex flex-1 flex-col justify-between p-5">
        <div>
          <div className="flex items-center justify-between gap-2">
            <span className="rounded-full border border-[#E2E8F0] bg-[#F8FAFC] px-2.5 py-1 text-[11px] font-bold tracking-wide text-[#475569]">
              {product.category || 'Academic service'}
            </span>
          </div>

          <Link href={`/marketplace/${product.id}`}>
            <h3 className="mt-4 line-clamp-2 text-lg font-bold leading-snug tracking-tight text-[#0F172A]">
              {product.title}
            </h3>
          </Link>

          <p className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-[#64748B]">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
            Verified CampusNinja partner
          </p>

          {product.description && (
            <p className="mt-3 line-clamp-2 text-sm leading-6 text-[#64748B]">{product.description}</p>
          )}
        </div>

        <div className="mt-5 flex items-end justify-between gap-3 border-t border-[#E2E8F0] pt-4">
          <div>
            <span className="block text-[10px] font-semibold tracking-wider text-[#94A3B8]">Starting at</span>
            <span className="text-2xl font-bold tracking-tight text-[#0F172A]">Rs. {product.price}</span>
          </div>
          <Link
            href={`/marketplace/${product.id}`}
            className="primary-button flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-xs font-bold text-white transition duration-250 ease"
          >
            Order <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
};
