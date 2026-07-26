'use client';

import React from 'react';
import Link from 'next/link';
import { CreditCard, Package, ShoppingBag, Sparkles } from 'lucide-react';
import { Card } from '@/components/common/Card';

const adminLinks = [
  {
    title: 'Orders',
    description: 'View all orders, filter by payment method and status, update order status.',
    href: '/admin/orders',
    icon: ShoppingBag,
    color: 'bg-emerald-50 text-emerald-700',
  },
  {
    title: 'Products & Payment Methods',
    description: 'Configure payment methods (COD, Online, Both) for each marketplace product.',
    href: '/admin/products',
    icon: Package,
    color: 'bg-blue-50 text-blue-700',
  },
];

export default function AdminDashboardPage() {
  return (
    <div className="page-shell animate-soft-in">
      <section className="surface-card rounded-3xl p-6 sm:p-8">
        <p className="eyebrow"><Sparkles className="h-3.5 w-3.5" /> Admin Panel</p>
        <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">Admin Dashboard</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
          Manage orders, products, and payment configuration for CampusNinja.
        </p>
      </section>

      <div className="grid gap-5 sm:grid-cols-2">
        {adminLinks.map((link) => (
          <Link key={link.href} href={link.href}>
            <Card hoverable className="h-full cursor-pointer">
              <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${link.color}`}>
                <link.icon className="h-5 w-5" />
              </div>
              <h2 className="mt-4 text-lg font-black text-slate-950">{link.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{link.description}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
