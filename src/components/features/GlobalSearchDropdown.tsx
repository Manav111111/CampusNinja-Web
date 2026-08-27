'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  BookOpen, 
  FileText, 
  PlaySquare, 
  HelpCircle, 
  Code2, 
  ArrowRight,
  ExternalLink,
  Layers,
  Sparkles
} from 'lucide-react';
import { getAllSubjects, getPopularResources, getSkills } from '@/services/supabase';
import { Subject, Resource, Skill } from '@/types';

const FALLBACK_SUBJECTS = [
  { id: 'environmental-science', name: 'Environmental Science', short_name: 'EVS', semester: '1' },
  { id: 'applied-mathematics-1', name: 'Applied Mathematics 1', short_name: 'AM-1', semester: '1' },
  { id: 'communication-skills', name: 'Communication Skills', short_name: 'CS', semester: '1' },
  { id: 'manufacturing-processes', name: 'Manufacturing Processes', short_name: 'MP', semester: '1' },
  { id: 'engineering-graphics', name: 'Engineering Graphics', short_name: 'EG', semester: '1' },
  { id: 'applied-physics-1', name: 'Applied Physics 1', short_name: 'AP-1', semester: '1' },
  { id: 'workshop-practice', name: 'Workshop Practice', short_name: 'WP', semester: '1' },
];

const FALLBACK_SKILLS = [
  { id: 's-1', name: 'Full-Stack Web Development', difficulty_level: 'Intermediate', url: '/skills' },
  { id: 's-2', name: 'Data Structures & Algorithms', difficulty_level: 'Beginner to Advanced', url: '/skills' },
  { id: 's-3', name: 'Applied Generative AI', difficulty_level: 'All Levels', url: '/skills' },
  { id: 's-4', name: 'Embedded Systems & IoT', difficulty_level: 'Core Electronics', url: '/skills' },
  { id: 's-5', name: 'Cloud Computing & DevOps', difficulty_level: 'Intermediate', url: '/skills' },
];

interface SearchResultItem {
  id: string;
  title: string;
  category: 'SUBJECT' | 'NOTE' | 'VIDEO' | 'PYQ' | 'SKILL';
  subtitle?: string;
  href: string;
  isExternal?: boolean;
}

interface GlobalSearchDropdownProps {
  query: string;
  isOpen: boolean;
  onClose: () => void;
  onSelect: () => void;
}

export const GlobalSearchDropdown: React.FC<GlobalSearchDropdownProps> = ({
  query,
  isOpen,
  onClose,
  onSelect,
}) => {
  const router = useRouter();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load searchable data
  useEffect(() => {
    let mounted = true;
    getAllSubjects().then((data) => {
      if (mounted && data?.length) setSubjects(data);
    }).catch(() => {});

    getPopularResources(30).then((data) => {
      if (mounted && data?.length) setResources(data);
    }).catch(() => {});

    getSkills().then((data) => {
      if (mounted && data?.length) setSkills(data);
    }).catch(() => {});

    return () => {
      mounted = false;
    };
  }, []);

  // Compute matched items
  const q = query.trim().toLowerCase();

  const allSubjects = subjects.length > 0 ? subjects : (FALLBACK_SUBJECTS as any);
  const allSkills = skills.length > 0 ? skills : (FALLBACK_SKILLS as any);

  let results: SearchResultItem[] = [];

  if (q) {
    // 1. Match Subjects
    const matchedSubjects = allSubjects
      .filter((s: Subject) => (s.name || s.title || '').toLowerCase().includes(q) || (s.short_name || '').toLowerCase().includes(q))
      .slice(0, 4)
      .map((s: Subject) => ({
        id: `sub-${s.id}`,
        title: s.name || s.title || '',
        category: 'SUBJECT' as const,
        subtitle: s.short_name ? `${s.short_name} · Semester 1` : 'Curriculum Subject',
        href: `/subjects/${s.id || 'applied-mathematics-1'}`,
      }));

    // 2. Match Resources (Notes, PYQs, Videos)
    const matchedResources = resources
      .filter((r) => (r.title || '').toLowerCase().includes(q) || (r.type || '').toLowerCase().includes(q))
      .slice(0, 4)
      .map((r) => {
        const isVid = (r.type || '').toLowerCase().includes('video') || Boolean(r.youtube_url);
        const isPyq = (r.type || '').toLowerCase().includes('pyq') || (r.type || '').toLowerCase().includes('question');
        return {
          id: `res-${r.id}`,
          title: r.title,
          category: (isVid ? 'VIDEO' : isPyq ? 'PYQ' : 'NOTE') as any,
          subtitle: r.subjects?.name || 'Study Material',
          href: r.file_url || r.drive_url || r.youtube_url || r.external_url || `/subjects/${r.subject_id}`,
          isExternal: Boolean(r.file_url || r.drive_url || r.youtube_url || r.external_url),
        };
      });

    // 3. Match Skills
    const matchedSkills = allSkills
      .filter((s: Skill) => (s.name || '').toLowerCase().includes(q))
      .slice(0, 3)
      .map((s: Skill) => ({
        id: `skill-${s.id}`,
        title: s.name,
        category: 'SKILL' as const,
        subtitle: s.difficulty_level || 'Career Roadmap',
        href: '/skills',
      }));

    results = [...matchedSubjects, ...matchedResources, ...matchedSkills];
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
      } else if (e.key === 'Enter') {
        if (selectedIndex >= 0 && selectedIndex < results.length) {
          e.preventDefault();
          const target = results[selectedIndex];
          if (target.isExternal) {
            window.open(target.href, '_blank');
          } else {
            router.push(target.href);
          }
          onSelect();
        }
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex, router, onSelect, onClose]);

  if (!isOpen) return null;

  const quickLinks = [
    { label: 'Browse All Subjects', subtitle: 'B.Tech Semester Curriculum', href: '/subjects', icon: <BookOpen className="h-4 w-4" /> },
    { label: 'Engineering Mathematics', subtitle: 'Matrices, Calculus & Differential', href: '/subjects/applied-mathematics-1', icon: <Layers className="h-4 w-4" /> },
    { label: 'Notes & Syllabus Modules', subtitle: 'Unit-wise Breakdown', href: '/subjects/applied-mathematics-1', icon: <FileText className="h-4 w-4" /> },
    { label: 'Placement & Skill Tracks', subtitle: 'Web Dev, DSA & Generative AI', href: '/skills', icon: <Code2 className="h-4 w-4" /> },
  ];

  return (
    <div 
      ref={containerRef}
      className="animate-soft-in absolute left-0 top-[calc(100%+10px)] z-50 w-full min-w-[480px] max-w-[540px] rounded-[18px] border border-[rgba(21,27,36,0.10)] bg-[#F7F7F5]/96 p-3 shadow-[0_20px_45px_rgba(15,22,30,0.14),0_4px_12px_rgba(15,22,30,0.04)] backdrop-blur-xl"
    >
      
      {/* ── STATE 1: EMPTY QUERY (QUICK ACCESS) ── */}
      {!q ? (
        <div className="flex flex-col">
          <div className="flex items-center justify-between px-3 pt-2 pb-1.5 border-b border-[rgba(21,27,36,0.06)]">
            <span className="font-mono-spec text-[10px] font-[600] tracking-[0.16em] uppercase text-[#7D8792]">
              QUICK ACCESS
            </span>
            <span className="font-mono-spec text-[10px] text-[#A0A7B0]">
              ESC to close
            </span>
          </div>

          <div className="mt-2 flex flex-col space-y-1">
            {quickLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={onSelect}
                className="group flex items-center justify-between rounded-[10px] p-2.5 transition-colors hover:bg-[rgba(21,27,36,0.05)]"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-[7px] bg-white/70 text-[#17202B] shadow-2xs group-hover:bg-white">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-[13.5px] font-[600] text-[#17202B] group-hover:text-black">
                      {item.label}
                    </p>
                    <p className="text-[11.5px] text-[#6E7985]">
                      {item.subtitle}
                    </p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-[#8C95A0] opacity-0 transition group-hover:opacity-100 group-hover:translate-x-0.5" />
              </Link>
            ))}
          </div>
        </div>
      ) : results.length === 0 ? (
        /* ── STATE 2: NO RESULTS ── */
        <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/60 text-[#7D8792] mb-3 shadow-2xs">
            <Search className="h-5 w-5 stroke-[1.8]" />
          </div>
          <h4 className="text-[15px] font-[650] text-[#17202B]">
            No results for &quot;{query}&quot;
          </h4>
          <p className="mt-1 text-[13px] text-[#6E7985] max-w-[280px]">
            Try searching for subjects, notes, PYQs, videos, or skill roadmaps.
          </p>
        </div>
      ) : (
        /* ── STATE 3: MATCHED RESULTS ── */
        <div className="flex flex-col">
          <div className="flex items-center justify-between px-3 pt-2 pb-1.5 border-b border-[rgba(21,27,36,0.06)]">
            <span className="font-mono-spec text-[10px] font-[600] tracking-[0.16em] uppercase text-[#7D8792]">
              SEARCH RESULTS ({results.length})
            </span>
            <span className="font-mono-spec text-[10px] text-[#A0A7B0]">
              ↑ ↓ to navigate · Enter to open
            </span>
          </div>

          <div className="mt-2 flex flex-col space-y-1 max-h-[360px] overflow-y-auto">
            {results.map((item, index) => {
              const isSelected = selectedIndex === index;
              return (
                <div key={item.id}>
                  {item.isExternal ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={onSelect}
                      className={`flex items-center justify-between rounded-[10px] p-2.5 transition-colors ${
                        isSelected ? 'bg-[rgba(21,27,36,0.08)]' : 'hover:bg-[rgba(21,27,36,0.04)]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-[7px] bg-white/80 text-[#17202B] shadow-2xs">
                          {item.category === 'VIDEO' ? (
                            <PlaySquare className="h-4 w-4 stroke-[1.8]" />
                          ) : item.category === 'PYQ' ? (
                            <HelpCircle className="h-4 w-4 stroke-[1.8]" />
                          ) : item.category === 'SKILL' ? (
                            <Code2 className="h-4 w-4 stroke-[1.8]" />
                          ) : (
                            <FileText className="h-4 w-4 stroke-[1.8]" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-[13.5px] font-[600] text-[#17202B]">
                              {item.title}
                            </p>
                            <span className="font-mono-spec text-[9px] font-[600] uppercase tracking-[0.08em] bg-[rgba(21,27,36,0.06)] text-[#505B66] px-1.5 py-0.5 rounded">
                              {item.category}
                            </span>
                          </div>
                          {item.subtitle && (
                            <p className="text-[11.5px] text-[#6E7985]">
                              {item.subtitle}
                            </p>
                          )}
                        </div>
                      </div>
                      <ExternalLink className="h-3.5 w-3.5 text-[#8C95A0]" />
                    </a>
                  ) : (
                    <Link
                      href={item.href}
                      onClick={onSelect}
                      className={`flex items-center justify-between rounded-[10px] p-2.5 transition-colors ${
                        isSelected ? 'bg-[rgba(21,27,36,0.08)]' : 'hover:bg-[rgba(21,27,36,0.04)]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-[7px] bg-white/80 text-[#17202B] shadow-2xs">
                          {item.category === 'SUBJECT' ? (
                            <BookOpen className="h-4 w-4 stroke-[1.8]" />
                          ) : item.category === 'SKILL' ? (
                            <Code2 className="h-4 w-4 stroke-[1.8]" />
                          ) : (
                            <FileText className="h-4 w-4 stroke-[1.8]" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-[13.5px] font-[600] text-[#17202B]">
                              {item.title}
                            </p>
                            <span className="font-mono-spec text-[9px] font-[600] uppercase tracking-[0.08em] bg-[rgba(21,27,36,0.06)] text-[#505B66] px-1.5 py-0.5 rounded">
                              {item.category}
                            </span>
                          </div>
                          {item.subtitle && (
                            <p className="text-[11.5px] text-[#6E7985]">
                              {item.subtitle}
                            </p>
                          )}
                        </div>
                      </div>
                      <ArrowRight className="h-3.5 w-3.5 text-[#8C95A0]" />
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};
