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
  ExternalLink,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { useSubjectResources, useSubjectSyllabus, useSubjectDetails } from '@/hooks/useQueries';
import { useAcademic } from '@/contexts/AcademicContext';
import { SubjectBookStackVisual } from '@/components/features/SubjectBookStackVisual';
import { PDFViewerModal } from '@/components/common/PDFViewerModal';
import { VideoPlayerModal } from '@/components/common/VideoPlayerModal';

const isUUIDString = (str?: string): boolean => {
  if (!str) return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
};

export default function SubjectDetailPage() {
  const params = useParams();
  const subjectId = Array.isArray(params.id) ? params.id[0] : params.id;
  const { branchName, semesterNum } = useAcademic();
  
  const { data: subjectDetails, isLoading: isSubjectLoading } = useSubjectDetails(subjectId || '');
  const { data: dbResources } = useSubjectResources(subjectId || '');
  const { 
    data: syllabusData, 
    isLoading: isSyllabusLoading, 
    isError: isSyllabusError, 
    refetch: refetchSyllabus 
  } = useSubjectSyllabus(subjectId || '');

  const [activeTab, setActiveTab] = useState<'syllabus' | 'notes' | 'videos' | 'pyqs' | 'lab'>('syllabus');
  const [expandedUnits, setExpandedUnits] = useState<number[]>([0]); // First unit expanded by default

  const [pdfModal, setPdfModal] = useState<{ isOpen: boolean; title: string; fileUrl: string }>({
    isOpen: false,
    title: '',
    fileUrl: '',
  });

  const [videoModal, setVideoModal] = useState<{ isOpen: boolean; title: string; videoUrl: string; description?: string }>({
    isOpen: false,
    title: '',
    videoUrl: '',
    description: '',
  });

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

  // Subject title resolution: NEVER output a raw UUID!
  const resolvedSubjectName = subjectDetails?.name || subjectDetails?.title || 
    (dbResources && dbResources.length > 0 && dbResources[0]?.subjects?.name ? dbResources[0].subjects.name : null);

  const subjectTitle = resolvedSubjectName || 
    (subjectId && !isUUIDString(subjectId)
      ? decodeURIComponent(subjectId).replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
      : (isSubjectLoading ? 'Loading Subject...' : 'Subject Workspace'));

  const currentSemester = subjectDetails?.semester || semesterNum || '1';
  const currentBranch = subjectDetails?.branch || (branchName ? `${branchName}` : 'Common to All Branches');

  // Dynamic calculations from database syllabus
  const units = syllabusData?.units || [];
  const unitsCount = units.length;
  const totalTopicsCount = units.reduce((acc, u) => acc + (u.topics?.length || 0), 0);

  // Filter db resources for other tabs if selected
  const tabResources = (dbResources || []).filter((res) => {
    const t = (res.type || '').toLowerCase();
    if (activeTab === 'notes') return t.includes('note');
    if (activeTab === 'videos') return t.includes('video') || Boolean(res.youtube_url);
    if (activeTab === 'pyqs') return t.includes('pyq') || t.includes('question');
    if (activeTab === 'lab') return t.includes('lab') || t.includes('manual');
    return true;
  });

  const handleDownloadSyllabus = () => {
    if (syllabusData?.file_url) {
      window.open(syllabusData.file_url, '_blank');
    } else {
      window.print();
    }
  };

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
      <div className="mx-auto w-full px-[24px] lg:px-[54px] xl:px-[80px] pt-[24px] lg:pt-[32px] pb-[80px]">
        
        {/* ── BACK NAVIGATION ── */}
        <Link 
          href="/subjects" 
          className="inline-flex items-center gap-2 text-[14px] font-[500] text-[#303943] transition-colors hover:text-[#171C22] mb-[28px]"
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
              SUBJECT WORKSPACE
            </span>

            {/* Subject Title */}
            <h1 className="text-[34px] sm:text-[42px] font-[650] leading-[1.05] tracking-[-0.045em] text-[#171C22]">
              {subjectTitle}
            </h1>

            {/* Semester & Branch Metadata */}
            <p className="mt-[10px] text-[15px] font-[400] text-[#4F5964]">
              <span className="font-[550] text-[#242B33]">Semester {currentSemester}</span>
              {'  •  '}
              <span>{currentBranch}</span>
            </p>

            {/* Subject Description */}
            <p className="mt-[18px] max-w-[520px] text-[16px] font-[400] leading-[1.65] text-[#5E6873]">
              Complete study resources, syllabus, notes, videos, PYQs, and lab materials for {subjectTitle}.
            </p>
          </div>

          {/* Right: Technical Book Stack Visual + Dynamic Statistics */}
          <div className="flex items-center justify-end gap-6 xl:gap-12">
            
            {/* 3D Stack of books with f(x) */}
            <div className="hidden sm:block">
              <SubjectBookStackVisual />
            </div>

            {/* Dynamic Vertical Statistics Column */}
            <div className="flex flex-col items-start gap-4 pl-4">
              
              {/* Stat 1: Dynamic Units Count */}
              <div>
                <span className="text-[25px] font-[650] tracking-[-0.04em] text-[#171C22] leading-none block">
                  {isSyllabusLoading ? '--' : String(unitsCount).padStart(2, '0')}
                </span>
                <span className="font-mono-spec text-[9px] font-[500] tracking-[0.10em] uppercase text-[#5E6872] mt-1 block">
                  UNITS
                </span>
              </div>
              <div className="h-[1px] w-[90px] bg-[rgba(20,25,32,0.10)]" />

              {/* Stat 2: Dynamic Topics Count */}
              <div>
                <span className="text-[25px] font-[650] tracking-[-0.04em] text-[#171C22] leading-none block">
                  {isSyllabusLoading ? '--' : String(totalTopicsCount).padStart(2, '0')}
                </span>
                <span className="font-mono-spec text-[9px] font-[500] tracking-[0.10em] uppercase text-[#5E6872] mt-1 block">
                  TOPICS
                </span>
              </div>
              <div className="h-[1px] w-[90px] bg-[rgba(20,25,32,0.10)]" />

              {/* Stat 3: Curriculum Coverage */}
              <div>
                <span className="text-[25px] font-[650] tracking-[-0.04em] text-[#171C22] leading-none block">
                  {unitsCount > 0 ? '100%' : 'PENDING'}
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
                    {/* Technical corner marks around active item */}
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

            {/* Secondary Motivational Card */}
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
          <div className="flex flex-col rounded-[12px] border border-[rgba(20,25,32,0.10)] bg-[rgba(255,255,255,0.42)] p-[28px] shadow-sm min-h-[420px]">
            
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
                      ? 'Detailed unit and topic breakdown from database'
                      : `Verified study resources and materials for ${subjectTitle}`}
                  </p>
                </div>
              </div>

              {/* Download Syllabus / Resources Action */}
              <div className="flex items-center gap-2">
                {syllabusData?.file_url && (
                  <button
                    onClick={() => setPdfModal({
                      isOpen: true,
                      title: 'Official Syllabus Document',
                      fileUrl: syllabusData.file_url || '',
                    })}
                    className="inline-flex h-[40px] items-center gap-2 rounded-[8px] border border-[#FF6B00]/30 bg-[#FFF7ED] px-[16px] text-[13px] font-[600] text-[#FF6B00] transition hover:bg-[#FFEDD5] shadow-2xs cursor-pointer"
                  >
                    <BookOpen className="h-[15px] w-[15px] stroke-[2]" />
                    <span>Read Syllabus PDF</span>
                  </button>
                )}

                <button
                  onClick={handleDownloadSyllabus}
                  className="inline-flex h-[40px] items-center gap-2 rounded-[8px] border border-[rgba(20,25,32,0.10)] bg-[rgba(255,255,255,0.45)] px-[16px] text-[13px] font-[500] text-[#171C22] transition hover:bg-white shadow-2xs cursor-pointer"
                >
                  <Download className="h-[15px] w-[15px] stroke-[1.8]" />
                  <span>Download</span>
                </button>
              </div>
            </div>

            {/* Tab: Dynamic Syllabus Accordion */}
            {activeTab === 'syllabus' ? (
              <div className="py-2">
                
                {/* 1. Loading Skeleton */}
                {isSyllabusLoading && (
                  <div className="flex flex-col space-y-4 py-4 animate-pulse">
                    {[1, 2, 3, 4].map((n) => (
                      <div key={n} className="flex h-[58px] items-center justify-between px-3 rounded-md bg-black/[0.04]">
                        <div className="flex items-center gap-8">
                          <div className="h-4 w-16 bg-black/[0.08] rounded" />
                          <div className="h-4 w-48 bg-black/[0.08] rounded" />
                        </div>
                        <div className="h-8 w-8 rounded-full bg-black/[0.08]" />
                      </div>
                    ))}
                  </div>
                )}

                {/* 2. Error State */}
                {isSyllabusError && (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <AlertCircle className="h-10 w-10 text-amber-600 mb-3" />
                    <h3 className="text-base font-semibold text-[#1E252C]">Unable to load syllabus</h3>
                    <p className="text-sm text-[#6D7680] mt-1 max-w-sm">
                      There was an error connecting to the curriculum database.
                    </p>
                    <button
                      onClick={() => refetchSyllabus()}
                      className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#171C22] text-sm font-semibold text-white transition hover:bg-black"
                    >
                      <RefreshCw className="h-4 w-4" />
                      <span>Retry</span>
                    </button>
                  </div>
                )}

                {/* 3. Empty State (No Syllabus / No Units in DB) */}
                {!isSyllabusLoading && !isSyllabusError && units.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-14 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-black/[0.04] text-[#6D7680] mb-3">
                      <BookOpen className="h-6 w-6 stroke-[1.5]" />
                    </div>
                    <h3 className="text-base font-semibold text-[#1E252C]">Syllabus not available yet</h3>
                    <p className="text-sm text-[#6D7680] mt-1.5 max-w-sm">
                      Study material and structured units for this subject will be published soon.
                    </p>
                  </div>
                )}

                {/* 4. Dynamic Units & Topics Accordion */}
                {!isSyllabusLoading && !isSyllabusError && units.length > 0 && (
                  <div className="flex flex-col divide-y divide-[rgba(20,25,32,0.06)]">
                    {units.map((unitItem, idx) => {
                      const isExpanded = expandedUnits.includes(idx);
                      const unitNumberLabel = `UNIT ${unitItem.unit_number || (idx + 1)}`;
                      const topics = unitItem.topics || [];

                      return (
                        <div key={unitItem.id || idx} className="flex flex-col transition-colors">
                          
                          {/* Unit Row Bar */}
                          <button
                            type="button"
                            onClick={() => toggleUnit(idx)}
                            aria-expanded={isExpanded}
                            className="flex h-[58px] w-full cursor-pointer items-center justify-between px-2 text-left transition-colors hover:bg-white/30 rounded-md"
                          >
                            {/* Unit Number & Title */}
                            <div className="flex items-center gap-[30px] sm:gap-[50px] overflow-hidden pr-4">
                              <span className="w-[85px] sm:w-[100px] shrink-0 font-mono-spec text-[11px] font-[500] tracking-[0.04em] text-[#6D7680]">
                                {unitNumberLabel}
                              </span>
                              <span className="text-[15px] font-[500] text-[#1E252C] truncate">
                                {unitItem.title}
                              </span>
                            </div>

                            {/* Circular Chevron Indicator */}
                            <div
                              className={`flex h-[32px] w-[32px] shrink-0 items-center justify-center rounded-full border border-[rgba(20,25,32,0.12)] bg-transparent text-[#171C22] transition-transform duration-200 ${
                                isExpanded ? 'rotate-180 bg-white shadow-2xs' : 'hover:bg-white/50'
                              }`}
                            >
                              <ChevronDown className="h-4 w-4 stroke-[1.8]" />
                            </div>
                          </button>

                          {/* Expandable Topics Content */}
                          {isExpanded && (
                            <div className="pb-4 pt-1 pl-[115px] sm:pl-[150px] pr-4 animate-soft-in">
                              {unitItem.description && (
                                <p className="text-xs text-[#5E6873] mb-3 italic">
                                  {unitItem.description}
                                </p>
                              )}
                              {topics.length === 0 ? (
                                <p className="text-xs text-[#8692A2] italic">No topic details added for this unit yet.</p>
                              ) : (
                                <ul className="space-y-2 text-[13.5px] text-[#4F5964]">
                                  {topics.map((topic, topicIdx) => (
                                    <li key={topic.id || topicIdx} className="flex items-start gap-2.5">
                                      <span className="h-[4px] w-[4px] rounded-full bg-[#171C22]/40 mt-2 shrink-0" />
                                      <span>{topic.title}</span>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          )}

                        </div>
                      );
                    })}
                  </div>
                )}

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
                      const isVideo = (res.type || '').toLowerCase().includes('video') || Boolean(res.youtube_url);

                      return (
                        <div 
                          key={res.id} 
                          className="flex items-center justify-between p-4 rounded-xl border border-[rgba(20,25,32,0.08)] bg-white/60 hover:bg-white transition-all shadow-2xs"
                        >
                          <div 
                            className="flex items-center gap-3.5 flex-1 cursor-pointer"
                            onClick={() => {
                              if (isVideo) {
                                setVideoModal({
                                  isOpen: true,
                                  title: res.title,
                                  videoUrl: linkUrl,
                                  description: res.description,
                                });
                              } else {
                                setPdfModal({
                                  isOpen: true,
                                  title: res.title,
                                  fileUrl: linkUrl,
                                });
                              }
                            }}
                          >
                            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                              isVideo ? 'bg-red-50 text-red-600' : 'bg-[#FFF7ED] text-[#FF6B00]'
                            }`}>
                              {isVideo ? (
                                <PlaySquare className="h-5 w-5 stroke-[1.8]" />
                              ) : (
                                <FileText className="h-5 w-5 stroke-[1.8]" />
                              )}
                            </div>
                            <div>
                              <p className="text-[14.5px] font-[650] text-[#171C22] hover:text-[#FF6B00] transition-colors">
                                {res.title}
                              </p>
                              <p className="text-xs text-[#6D7680] mt-0.5">
                                {resourceUnit ? `Unit ${resourceUnit}` : (res.description || (isVideo ? 'YouTube Lecture' : 'PDF Study Material'))}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0 ml-4">
                            <button 
                              onClick={() => {
                                if (isVideo) {
                                  setVideoModal({
                                    isOpen: true,
                                    title: res.title,
                                    videoUrl: linkUrl,
                                    description: res.description,
                                  });
                                } else {
                                  setPdfModal({
                                    isOpen: true,
                                    title: res.title,
                                    fileUrl: linkUrl,
                                  });
                                }
                              }}
                              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                                isVideo 
                                  ? 'bg-red-600 text-white hover:bg-red-700' 
                                  : 'bg-[#171C22] text-white hover:bg-black'
                              }`}
                            >
                              <span>{isVideo ? 'Watch' : 'Read'}</span>
                              <ExternalLink className="h-3.5 w-3.5" />
                            </button>

                            {!isVideo && (
                              <a
                                href={linkUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                download
                                className="flex h-8 w-8 items-center justify-center rounded-lg border border-[rgba(20,25,32,0.10)] bg-white/70 text-[#475569] hover:bg-white hover:text-[#171C22] transition shadow-2xs"
                                title="Download PDF"
                              >
                                <Download className="h-3.5 w-3.5 stroke-[1.8]" />
                              </a>
                            )}
                          </div>
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

      {/* ── MODALS: IN-BROWSER PDF VIEWER & YOUTUBE PLAYER ── */}
      <PDFViewerModal
        isOpen={pdfModal.isOpen}
        onClose={() => setPdfModal({ isOpen: false, title: '', fileUrl: '' })}
        title={pdfModal.title}
        fileUrl={pdfModal.fileUrl}
        subjectTitle={subjectTitle}
      />

      <VideoPlayerModal
        isOpen={videoModal.isOpen}
        onClose={() => setVideoModal({ isOpen: false, title: '', videoUrl: '' })}
        title={videoModal.title}
        videoUrl={videoModal.videoUrl}
        subjectTitle={subjectTitle}
        description={videoModal.description}
      />

    </div>
  );
}
