'use client';

import React from 'react';
import { Bell, CheckCircle2, Sparkles } from 'lucide-react';
import { Card } from '@/components/common/Card';
import { isReviewMode } from '@/config/reviewMode';

export default function NotificationsPage() {
  const sampleNotifications = [
    { id: 'n-1', title: 'Midterm PYQ solutions uploaded', message: 'New solved papers for Engineering Mathematics and Physics have been added.', date: 'Today', unread: true },
    { id: 'n-2', title: 'Marketplace assignment window open', message: 'Custom practical files can now be requested with 24-hour delivery.', date: 'Yesterday', unread: false },
    ...(!isReviewMode() ? [{ id: 'n-3', title: 'Semester study groups active', message: 'Join the official CampusNinja WhatsApp study network for your university.', date: '2 days ago', unread: false }] : []),
  ];

  return (
    <div className="page-shell animate-soft-in">
      <section className="surface-card rounded-3xl p-6 sm:p-8">
        <p className="eyebrow"><Sparkles className="h-3.5 w-3.5" /> Alerts</p>
        <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">Notifications</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
          Exam updates, new materials, and order activity stay grouped in one readable feed.
        </p>
      </section>
      <div className="space-y-3">
        {sampleNotifications.map((notification) => (
          <Card key={notification.id} className={`flex items-start gap-4 ${notification.unread ? 'border-blue-200 bg-blue-50/60' : ''}`}>
            <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${notification.unread ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
              {notification.unread ? <Sparkles className="h-5 w-5" /> : <Bell className="h-5 w-5" />}
            </div>
            <div className="flex-1">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="text-sm font-bold text-slate-950">{notification.title}</h3>
                <span className="text-xs font-bold text-slate-400">{notification.date}</span>
              </div>
              <p className="mt-1 text-sm leading-6 text-slate-600">{notification.message}</p>
            </div>
            {!notification.unread && <CheckCircle2 className="h-5 w-5 text-slate-300" />}
          </Card>
        ))}
      </div>
    </div>
  );
}
