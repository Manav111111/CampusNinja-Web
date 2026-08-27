'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  BookOpen, 
  FileText, 
  PlaySquare, 
  HelpCircle, 
  FlaskConical, 
  Download, 
  ChevronDown, 
  TrendingUp,
  ExternalLink
} from 'lucide-react';
import { useSubjectResources } from '@/hooks/useQueries';
import { useAcademic } from '@/contexts/AcademicContext';
import { SubjectBookStackVisual } from '@/components/features/SubjectBookStackVisual';

const SYLLABUS_UNITS = [
  {
    unit: 'UNIT 1',
    title: 'Matrices',
    topics: [
      'Definition of matrix and types of matrices',
      'Elementary row and column operations',
      'Echelon form and Normal form of a matrix',
      'Rank of a matrix and nullity',
      'Linear dependence and independence of vectors',
    ],
  },
  {
    unit: 'UNIT 2',
    title: 'Determinants',
    topics: [
      'Properties of determinants & algebraic evaluation',
      'Minors, cofactors, and adjoint matrices',
      'Inverse of a non-singular matrix',
      'Cramer’s rule for solving linear systems',
    ],
  },
  {
    unit: 'UNIT 3',
    title: 'System of Linear Equations',
    topics: [
      'Consistency and inconsistency of linear systems',
      'Homogeneous and non-homogeneous systems',
      'Gauss elimination method and Gauss-Jordan method',
      'Eigenvalues, Eigenvectors, and Cayley-Hamilton Theorem',
    ],
  },
  {
    unit: 'UNIT 4',
    title: 'Vector Algebra',
    topics: [
      'Vectors in 2D & 3D coordinate geometry',
      'Scalar (dot) product and Vector (cross) product',
      'Scalar triple product and Vector triple product',
      'Geometrical and physical applications of vectors',
    ],
  },
  {
    unit: 'UNIT 5',
    title: 'Differential Calculus',
    topics: [
      'Successive differentiation and Leibnitz’s Theorem',
      'Partial derivatives and Total derivative',
      'Euler’s Theorem on homogeneous functions',
      'Taylor’s and Maclaurin’s series for two variables',
    ],
  },
  {
    unit: 'UNIT 6',
    title: 'Integral Calculus',
    topics: [
      'Definite integrals and Reduction formulae',
      'Double and Triple integrals evaluation',
      'Change of order of integration',
      'Applications to areas, volumes, and center of gravity',
    ],
  },
  {
    unit: 'UNIT 7',
    title: 'Applications of Calculus',
    topics: [
      'Tangents, Normals, and Asymptotes',
      'Curvature, Radius of curvature, and Evolutes',
      'Maxima and Minima of functions of two variables',
      'Lagrange’s method of undetermined multipliers',
    ],
  },
];

export default function SubjectDetailPage() {
  const params = useParams();
  const subjectId = Array.isArray(params.id) ? params.id[0] : params.id;
  const { branchName, semesterNum } = useAcademic();
  const { data: dbResources } = useSubjectResources(subjectId || '');

  const [activeTab, setActiveTab] = useState<'syllabus' | 'notes' | 'videos' | 'pyqs' | 'lab'>('syllabus');
  const [expandedUnits, setExpandedUnits] = useState<number[]>([]);

  const toggleUnit = (idx: number) => {
    setExpandedUnits((prev) => 
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  const navItems = [
    { id: 'syllabus', label: 'Syllabus', icon: <BookOpen className="h-[18px] w-[18px] stroke-[1.8]" /> },
    { id: 'notes', label: 'Notes', icon: <FileText className="h-[18px] w-[18px] stroke-[1.8]" /> },
    { id: 'videos', label: 'Videos', icon: <PlaySquare className="h-[18px] w-[18px] stroke-[1.8]" /> },
    { id: 'pyqs', label: 'PYQs', icon: <HelpCircle className="h-[18px] w-[18px] stroke-[1.8]" /> },
    { id: 'lab', label: 'Lab', icon: <FlaskConical className="h-[18px] w-[18px] stroke-[1.8]" /> },
  ];

  // Subject title resolution
  const subjectTitle = (subjectId === 'applied-mathematics-1' || !subjectId)
    ? 'Applied Mathematics 1'
    : decodeURIComponent(subjectId).replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

  // Filter db resources for other tabs if selected
  const tabResources = (dbResources || []).filter((res) => {
    const t = (res.type || '').toLowerCase();
    if (activeTab === 'notes') return t.includes('note');
    if (activeTab === 'videos') return t.includes('video') || Boolean(res.youtube_url);
    if (activeTab === 'pyqs') return t.includes('pyq') || t.includes('question');
    if (activeTab === 'lab') return t.includes('lab') || t.includes('manual');
    return true;
  });

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-hidden bg-[#F3F3F1] text-[#171C22] antialiased">
      
      {/* ── BACKGROUND ATMOSPHERE ── */}
      <div 
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          backgroundImage: `
            radial-gradient(circle at 68% 25%, rgba(255,255,255,0.55) 0%, transparent 28%),
            linear-gradient(180deg, #F4F4F2 0%, #F0F0EE 100%)
          `
        }}
      />

      {/* Decorative Technical Lines */}
      <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-35" viewBox="0 0 1440 900" fill="none">
        <path d="M 0 650 A 400 400 0 0 1 350 1050" stroke="rgba(64,74,85,0.10)" strokeWidth="1" strokeDasharray="5 7" />
        <circle cx="95" cy="740" r="2.5" fill="#4A5562" opacity="0.4" />
        <line x1="80" y1="360" x2="1360" y2="360" stroke="rgba(64,74,85,0.06)" strokeWidth="1" strokeDasharray="4 4" />
      </svg>

      {/* ── MAIN CONTENT CONTAINER ── */}
      <div className="mx-auto w-full px-[24px] lg:px-[54px] xl:px-[80px] pt-[28px] pb-[80px]">
        
        {/* ── BACK NAVIGATION ── */}
        <Link 
          href="/subjects" 
          className="inline-flex items-center gap-2 text-[14px] font-[500] text-[#303943] transition-colors hover:text-[#171C22] mb-[34px]"
        >
          <ArrowLeft className="h-4 w-4 stroke-[1.8]" />
          <span>Back to subjects</span>
        </Link>

        {/* ── SUBJECT HERO ── */}
        <div className="grid items-center gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          
          {/* Left: Subject Metadata & Headings */}
          <div className="flex flex-col items-start max-w-[620px]">
            
            {/* Technical Eyebrow */}
            <span className="font-mono-spec text-[10px] font-[500] uppercase tracking-[0.20em] text-[#707983] mb-[12px]">
              SUBJECT
            </span>

            {/* Subject Title (Controlled 42px) */}
            <h1 className="text-[34px] sm:text-[42px] font-[650] leading-[1.05] tracking-[-0.045em] text-[#171C22]">
              {subjectTitle}
            </h1>

            {/* Semester & Branch Metadata */}
            <p className="mt-[10px] text-[15px] font-[400] text-[#4F5964]">
              <span className="font-[550] text-[#242B33]">Semester {semesterNum || '1'}</span>
              {'  •  '}
              <span>{branchName ? `${branchName}` : 'Common to All Branches'}</span>
            </p>

            {/* Subject Description */}
            <p className="mt-[18px] max-w-[520px] text-[16px] font-[400] leading-[1.65] text-[#5E6873]">
              Complete study resources, syllabus, notes, videos, PYQs, and lab materials for {subjectTitle}.
            </p>
          </div>

          {/* Right: Technical Book Stack Visual + Statistics */}
          <div className="flex items-center justify-end gap-6 xl:gap-12">
            
            {/* 3D Stack of books with f(x) */}
            <div className="hidden sm:block">
              <SubjectBookStackVisual />
            </div>

            {/* Vertical Statistics Column */}
            <div className="flex flex-col items-start gap-4 pl-4">
              
              {/* Stat 1 */}
              <div>
                <span className="text-[25px] font-[650] tracking-[-0.04em] text-[#171C22] leading-none block">
                  07
                </span>
                <span className="font-mono-spec text-[9px] font-[500] tracking-[0.10em] uppercase text-[#5E6872] mt-1 block">
                  UNITS
                </span>
              </div>
              <div className="h-[1px] w-[90px] bg-[rgba(20,25,32,0.10)]" />

              {/* Stat 2 */}
              <div>
                <span className="text-[25px] font-[650] tracking-[-0.04em] text-[#171C22] leading-none block">
                  63
                </span>
                <span className="font-mono-spec text-[9px] font-[500] tracking-[0.10em] uppercase text-[#5E6872] mt-1 block">
                  TOPICS
                </span>
              </div>
              <div className="h-[1px] w-[90px] bg-[rgba(20,25,32,0.10)]" />

              {/* Stat 3 */}
              <div>
                <span className="text-[25px] font-[650] tracking-[-0.04em] text-[#171C22] leading-none block">
                  100%
                </span>
                <span className="font-mono-spec text-[9px] font-[500] tracking-[0.10em] uppercase text-[#5E6872] mt-1 block">
                  SYLLABUS COVERED
                </span>
              </div>

            </div>

          </div>

        </div>

        {/* ── TECHNICAL HORIZONTAL CONNECTOR LINE ── */}
        <div className="my-[42px] h-[1px] w-full bg-[rgba(60,70,80,0.10)]" />

        {/* ── MAIN CONTENT AREA (2 COLUMNS) ── */}
        <div className="grid gap-[38px] lg:grid-cols-[285px_1fr]">
          
          {/* Left Sidebar */}
          <div className="flex flex-col gap-6">
            
            {/* Material Navigation Panel */}
            <div className="flex flex-col rounded-[10px] border border-[rgba(20,25,32,0.10)] bg-[rgba(255,255,255,0.24)] p-[10px] shadow-sm">
              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <div key={item.id} className="relative">
                    {/* Technical corner marks around active Syllabus item */}
                    {isActive && (
                      <>
                        <span className="pointer-events-none absolute -top-[2px] -left-[2px] h-[6px] w-[6px] border-t border-l border-[#171C22]" />
                        <span className="pointer-events-none absolute -top-[2px] -right-[2px] h-[6px] w-[6px] border-t border-r border-[#171C22]" />
                        <span className="pointer-events-none absolute -bottom-[2px] -left-[2px] h-[6px] w-[6px] border-b border-l border-[#171C22]" />
                        <span className="pointer-events-none absolute -bottom-[2px] -right-[2px] h-[6px] w-[6px] border-b border-r border-[#171C22]" />
                      </>
                    )}

                    <button
                      onClick={() => setActiveTab(item.id as any)}
                      className={`flex h-[60px] w-full items-center gap-[14px] rounded-[7px] px-[20px] text-[15px] font-[550] transition-all duration-200 ${
                        isActive
                          ? 'bg-[#171C22] text-[#F4F4F1] shadow-sm'
                          : 'text-[#242B33] hover:bg-white/40'
                      }`}
                    >
                      <span className={isActive ? 'text-[#F4F4F1]' : 'text-[#4A5562]'}>
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Secondary Progress Card */}
            <div className="flex flex-col justify-between rounded-[10px] border border-[rgba(20,25,32,0.10)] bg-[rgba(255,255,255,0.30)] p-[20px] shadow-sm min-h-[145px]">
              <div>
                <div className="flex h-[32px] w-[32px] items-center justify-center rounded-[6px] bg-white/60 text-[#171C22] mb-3 shadow-xs">
                  <TrendingUp className="h-[17px] w-[17px] stroke-[1.8]" />
                </div>
                <h4 className="text-[14px] font-[650] text-[#171C22]">
                  Stay consistent
                </h4>
                <p className="text-[13px] font-[400] text-[#6D7680] leading-snug mt-1">
                  Track your progress and master every concept.
                </p>
              </div>
              <Link
                href="/profile"
                className="mt-3 inline-flex items-center gap-1 text-[13px] font-[600] text-[#171C22] transition hover:underline"
              >
                <span>View Progress</span>
                <span>→</span>
              </Link>
            </div>

          </div>

          {/* Right Content Panel */}
          <div className="flex flex-col rounded-[12px] border border-[rgba(20,25,32,0.10)] bg-[rgba(255,255,255,0.42)] p-[28px] shadow-sm">
            
            {/* Header: Syllabus Title + Download Button */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-[22px] border-b border-[rgba(20,25,32,0.08)]">
              <div className="flex items-center gap-3.5">
                <div className="flex h-[38px] w-[38px] items-center justify-center rounded-[8px] border border-[rgba(20,25,32,0.10)] bg-white/50 text-[#171C22]">
                  <FileText className="h-[19px] w-[19px] stroke-[1.75]" />
                </div>
                <div>
                  <h2 className="text-[17px] font-[600] text-[#20262D]">
                    {activeTab === 'syllabus' ? 'Syllabus' : activeTab.toUpperCase()}
                  </h2>
                  <p className="text-[13px] text-[#6D7680]">
                    {activeTab === 'syllabus'
                      ? 'Detailed syllabus and topic breakdown'
                      : `Verified study resources and materials for ${subjectTitle}`}
                  </p>
                </div>
              </div>

              {/* Download Syllabus / Resources Action */}
              <button
                onClick={() => window.print()}
                className="inline-flex h-[42px] items-center gap-2 rounded-[8px] border border-[rgba(20,25,32,0.10)] bg-[rgba(255,255,255,0.45)] px-[18px] text-[13px] font-[500] text-[#171C22] transition hover:bg-white shadow-2xs"
              >
                <Download className="h-[15px] w-[15px] stroke-[1.8]" />
                <span>Download Syllabus</span>
              </button>
            </div>

            {/* Tab: Syllabus Units List */}
            {activeTab === 'syllabus' ? (
              <div className="flex flex-col divide-y divide-[rgba(20,25,32,0.06)]">
                {SYLLABUS_UNITS.map((unitItem, idx) => {
                  const isExpanded = expandedUnits.includes(idx);
                  return (
                    <div key={unitItem.unit} className="flex flex-col transition-colors">
                      
                      {/* Unit Row Bar */}
                      <div 
                        onClick={() => toggleUnit(idx)}
                        className="flex h-[58px] cursor-pointer items-center justify-between px-2 transition-colors hover:bg-white/30 rounded-md"
                      >
                        {/* Unit Number & Title */}
                        <div className="flex items-center gap-[30px] sm:gap-[50px]">
                          <span className="w-[85px] sm:w-[100px] shrink-0 font-mono-spec text-[11px] font-[500] tracking-[0.04em] text-[#6D7680]">
                            {unitItem.unit}
                          </span>
                          <span className="text-[15px] font-[500] text-[#1E252C]">
                            {unitItem.title}
                          </span>
                        </div>

                        {/* Circular Chevron Button */}
                        <button
                          type="button"
                          aria-label="Toggle Unit"
                          className={`flex h-[32px] w-[32px] shrink-0 items-center justify-center rounded-full border border-[rgba(20,25,32,0.12)] bg-transparent text-[#171C22] transition-transform duration-200 ${
                            isExpanded ? 'rotate-180 bg-white shadow-2xs' : 'hover:bg-white/50'
                          }`}
                        >
                          <ChevronDown className="h-4 w-4 stroke-[1.8]" />
                        </button>
                      </div>

                      {/* Expandable Topics Content */}
                      {isExpanded && (
                        <div className="pb-4 pt-1 pl-[115px] sm:pl-[150px] pr-4 animate-soft-in">
                          <ul className="space-y-2 text-[13.5px] text-[#4F5964]">
                            {unitItem.topics.map((t, topicIdx) => (
                              <li key={topicIdx} className="flex items-center gap-2">
                                <span className="h-[4px] w-[4px] rounded-full bg-[#171C22]/40" />
                                <span>{t}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                    </div>
                  );
                })}
              </div>
            ) : (
              /* Other Tabs: Resource Listing */
              <div className="py-6">
                {tabResources.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center text-[#6D7680]">
                    <FileText className="h-10 w-10 stroke-[1.2] mb-3 opacity-60" />
                    <p className="text-sm font-medium">Curating verified {activeTab} files for {subjectTitle}.</p>
                  </div>
                ) : (
                  <div className="grid gap-3">
                    {tabResources.map((res) => {
                      const linkUrl = res.file_url || res.drive_url || res.youtube_url || res.external_url || '#';
                      const resourceUnit = (res as { unit?: string | number }).unit;
                      return (
                        <div key={res.id} className="flex items-center justify-between p-4 rounded-lg border border-[rgba(20,25,32,0.08)] bg-white/50">
                          <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-[#171C22]" />
                            <div>
                              <p className="text-sm font-semibold text-[#171C22]">{res.title}</p>
                              <p className="text-xs text-[#6D7680]">{resourceUnit ? `Unit ${resourceUnit}` : (res.description || 'Core Material')}</p>
                            </div>
                          </div>
                          <a 
                            href={linkUrl} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#171C22] text-xs font-semibold text-white transition hover:bg-black"
                          >
                            <span>Open</span>
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

          </div>

        </div>

        {/* ── BOTTOM-RIGHT DARK GEOMETRIC SECTION ── */}
        <div className="relative mt-[80px] flex justify-end">
          <div 
            className="flex h-[130px] w-full max-w-[380px] items-center justify-end pr-[40px] pl-[80px] bg-[#121820] text-white shadow-xl"
            style={{
              clipPath: 'polygon(30% 0, 100% 0, 100% 100%, 0 100%)',
            }}
          >
            <div className="flex items-center gap-4">
              <div className="flex h-[46px] w-[46px] items-center justify-center rounded-[8px] border border-white/13 bg-white/4 font-mono-spec text-[15px] text-[#F1F1EE]">
                &lt;/&gt;
              </div>
              <div className="flex flex-col text-[15px] font-[500] leading-[1.3] text-[#F1F1EE]">
                <span>Code. Learn. Grow.</span>
                <span className="text-xs font-[400] text-[#9EA7B0]">CampusNinja</span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
