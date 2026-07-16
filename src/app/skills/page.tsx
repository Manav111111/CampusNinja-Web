'use client';

import React from 'react';
import { ArrowRight, Award, BarChart3, BookOpen, PlayCircle, Rocket, Sparkles } from 'lucide-react';
import { Card } from '@/components/common/Card';
import { EmptyState } from '@/components/common/EmptyState';
import { Skeleton } from '@/components/common/Skeleton';
import { useSkills } from '@/hooks/useQueries';
import { Skill } from '@/types';

const fallbackSkills = [
  { id: 's-1', name: 'Full-Stack Web Development', difficulty_level: 'Intermediate', description: 'React, Next.js, Node, APIs, and production portfolio projects.', modules: 24, hours: '32h' },
  { id: 's-2', name: 'Data Structures and Algorithms', difficulty_level: 'Beginner to Advanced', description: 'Problem solving tracks for coding rounds and interviews.', modules: 36, hours: '48h' },
  { id: 's-3', name: 'Applied Generative AI', difficulty_level: 'All Levels', description: 'OpenAI APIs, prompt systems, and practical AI app workflows.', modules: 18, hours: '20h' },
  { id: 's-4', name: 'Embedded Systems and IoT', difficulty_level: 'Core Electronics', description: 'Arduino, ESP32, sensors, and practical hardware projects.', modules: 15, hours: '18h' },
];

export default function SkillsPage() {
  const { data: skills, isLoading } = useSkills();
  const listToShow = skills?.length ? skills : fallbackSkills;

  return (
    <div className="page-shell animate-soft-in">
      <section className="surface-card rounded-3xl p-6 sm:p-8">
        <p className="eyebrow"><Sparkles className="h-3.5 w-3.5" /> Skill academy</p>
        <h1 className="mt-4 max-w-4xl text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">Placement-ready tracks alongside your degree.</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
          Follow focused roadmaps for coding, web development, AI, and core engineering projects without mixing them into your semester resources.
        </p>
      </section>

      <section className="surface-card flex flex-col gap-5 rounded-3xl p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white">
            <PlayCircle className="h-7 w-7" />
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.12em] text-blue-700">In progress</p>
            <h2 className="text-xl font-black text-slate-950">Full-Stack Web Development Roadmap</h2>
            <div className="mt-2 flex items-center gap-3">
              <div className="h-2 w-32 rounded-full bg-slate-100"><div className="h-full w-2/3 rounded-full bg-blue-600" /></div>
              <span className="text-xs font-bold text-slate-500">65% complete</span>
            </div>
          </div>
        </div>
        <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 text-sm font-bold text-white transition hover:bg-blue-700">
          Resume track <ArrowRight className="h-4 w-4" />
        </a>
      </section>

      {isLoading ? (
        <div className="grid gap-5 md:grid-cols-2">
          {[1, 2, 3, 4].map((item) => <Skeleton key={item} className="h-64 rounded-2xl" />)}
        </div>
      ) : listToShow.length === 0 ? (
        <EmptyState icon={Rocket} title="No skill tracks published yet" />
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {listToShow.map((skill: Skill & { modules?: number; hours?: string }) => (
            <Card key={skill.id} hoverable className="flex h-full flex-col justify-between gap-6">
              <div>
                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-[11px] font-black uppercase tracking-[0.08em] text-blue-700">{skill.difficulty_level || 'All levels'}</span>
                  <span className="flex items-center gap-1 text-xs font-bold text-slate-500"><BarChart3 className="h-3.5 w-3.5" /> {skill.hours || '24h'}</span>
                </div>
                <h3 className="mt-4 text-xl font-black tracking-tight text-slate-950">{skill.name}</h3>
                {skill.description && <p className="mt-2 text-sm leading-6 text-slate-600">{skill.description}</p>}
              </div>
              <div className="flex items-center justify-between gap-4 border-t border-slate-100 pt-4">
                <span className="flex items-center gap-2 text-sm font-bold text-slate-600"><BookOpen className="h-4 w-4 text-blue-600" /> {skill.modules || 18} modules</span>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="inline-flex h-10 items-center gap-2 rounded-xl bg-slate-950 px-4 text-xs font-bold text-white transition hover:bg-blue-700">
                  Start <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </Card>
          ))}
        </div>
      )}

      <section className="grid gap-5 lg:grid-cols-3">
        {[
          [Award, 'Certificate-friendly', 'Built around visible learning outcomes and portfolio proof.'],
          [Rocket, 'Career-focused', 'Separate from semester resources so the product stays easy to scan.'],
          [BookOpen, 'Self-paced', 'Clear modules and predictable progression for busy college weeks.'],
        ].map(([Icon, title, description]) => (
          <div key={title as string} className="surface-card rounded-3xl p-6">
            <Icon className="h-6 w-6 text-blue-600" />
            <h3 className="mt-5 text-lg font-black text-slate-950">{title as string}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">{description as string}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
