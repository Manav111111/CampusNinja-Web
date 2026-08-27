'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useQueryClient } from '@tanstack/react-query';
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  MoveUp, 
  MoveDown, 
  Save, 
  Upload, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  BookOpen,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { useAllSubjects, useSubjectSyllabus } from '@/hooks/useQueries';
import { saveSubjectSyllabus, uploadSyllabusFile } from '@/services/supabase';
import { Subject, SyllabusUnitPayload, SyllabusTopicPayload } from '@/types';

export default function AdminSyllabusPage() {
  const queryClient = useQueryClient();
  const { data: allSubjects, isLoading: isSubjectsLoading } = useAllSubjects();

  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('');
  const { data: currentSyllabus, isLoading: isSyllabusLoading, refetch: refetchSyllabus } = useSubjectSyllabus(selectedSubjectId);

  // Editable Form State
  const [fileName, setFileName] = useState<string>('');
  const [fileUrl, setFileUrl] = useState<string>('');
  const [filePath, setFilePath] = useState<string>('');
  const [units, setUnits] = useState<SyllabusUnitPayload[]>([]);
  
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Auto-select first subject when loaded
  useEffect(() => {
    if (allSubjects && allSubjects.length > 0 && !selectedSubjectId) {
      setSelectedSubjectId(allSubjects[0].id);
    }
  }, [allSubjects, selectedSubjectId]);

  // Sync form state when syllabus query loads or changes
  useEffect(() => {
    if (currentSyllabus) {
      setFileName(currentSyllabus.file_name || '');
      setFileUrl(currentSyllabus.file_url || '');
      setFilePath(currentSyllabus.file_path || '');
      setUnits(
        (currentSyllabus.units || []).map((u) => ({
          id: u.id.startsWith('fb-') ? undefined : u.id,
          unit_number: u.unit_number,
          title: u.title,
          description: u.description || null,
          sort_order: u.sort_order,
          topics: (u.topics || []).map((t) => ({
            id: t.id.startsWith('fb-') ? undefined : t.id,
            title: t.title,
            description: t.description || null,
            sort_order: t.sort_order,
          })),
        }))
      );
    } else {
      setFileName('');
      setFileUrl('');
      setFilePath('');
      setUnits([]);
    }
  }, [currentSyllabus]);

  // Unit handlers
  const handleAddUnit = () => {
    const nextNumber = units.length + 1;
    setUnits([
      ...units,
      {
        unit_number: nextNumber,
        title: `Unit ${nextNumber} Title`,
        description: '',
        sort_order: nextNumber,
        topics: [
          { title: 'Core topic introduction', sort_order: 1 },
          { title: 'Key properties and methodology', sort_order: 2 },
        ],
      },
    ]);
  };

  const handleDeleteUnit = (uIdx: number) => {
    if (window.confirm('Are you sure you want to remove this unit and its topics?')) {
      const updated = units.filter((_, idx) => idx !== uIdx).map((u, idx) => ({
        ...u,
        unit_number: idx + 1,
        sort_order: idx + 1,
      }));
      setUnits(updated);
    }
  };

  const handleMoveUnit = (uIdx: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && uIdx === 0) || 
      (direction === 'down' && uIdx === units.length - 1)
    ) {
      return;
    }
    const targetIdx = direction === 'up' ? uIdx - 1 : uIdx + 1;
    const copy = [...units];
    const temp = copy[uIdx];
    copy[uIdx] = copy[targetIdx];
    copy[targetIdx] = temp;

    // Renumber
    const reordered = copy.map((u, idx) => ({
      ...u,
      unit_number: idx + 1,
      sort_order: idx + 1,
    }));
    setUnits(reordered);
  };

  const handleUnitTitleChange = (uIdx: number, newTitle: string) => {
    const copy = [...units];
    copy[uIdx].title = newTitle;
    setUnits(copy);
  };

  // Topic handlers
  const handleAddTopic = (uIdx: number) => {
    const copy = [...units];
    const unitTopics = copy[uIdx].topics || [];
    copy[uIdx].topics = [
      ...unitTopics,
      { title: '', sort_order: unitTopics.length + 1 },
    ];
    setUnits(copy);
  };

  const handleDeleteTopic = (uIdx: number, tIdx: number) => {
    const copy = [...units];
    copy[uIdx].topics = copy[uIdx].topics.filter((_, idx) => idx !== tIdx).map((t, idx) => ({
      ...t,
      sort_order: idx + 1,
    }));
    setUnits(copy);
  };

  const handleTopicTitleChange = (uIdx: number, tIdx: number, newTitle: string) => {
    const copy = [...units];
    copy[uIdx].topics[tIdx].title = newTitle;
    setUnits(copy);
  };

  // File Upload Handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedSubjectId) return;

    try {
      setIsUploading(true);
      setErrorMessage('');
      const uploaded = await uploadSyllabusFile(selectedSubjectId, file);
      setFileUrl(uploaded.url);
      setFileName(uploaded.name);
      setFilePath(uploaded.path);
    } catch (err: any) {
      setErrorMessage(`File upload failed: ${err?.message || 'Storage error'}`);
    } finally {
      setIsUploading(false);
    }
  };

  // Save & Publish
  const handleSave = async () => {
    if (!selectedSubjectId) {
      setErrorMessage('Please select a subject first.');
      return;
    }

    try {
      setIsSaving(true);
      setErrorMessage('');
      setSaveSuccess(false);

      await saveSubjectSyllabus(selectedSubjectId, {
        file_url: fileUrl || null,
        file_name: fileName || null,
        file_path: filePath || null,
        units,
      });

      // Invalidate React Query cache
      queryClient.invalidateQueries({ queryKey: ['subject-syllabus'] });
      refetchSyllabus();

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err: any) {
      setErrorMessage(`Failed to save syllabus: ${err?.message || 'Database error'}`);
    } finally {
      setIsSaving(false);
    }
  };

  const selectedSubject = (allSubjects || []).find((s) => s.id === selectedSubjectId);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 antialiased">
      
      {/* ── TOP HEADER ── */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link 
            href="/admin" 
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition mb-2"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Admin Dashboard</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-950">
            Syllabus & Units Manager
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Configure dynamic units, topics, and upload official syllabus documents for any subject.
          </p>
        </div>

        {/* Save CTA */}
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving || !selectedSubjectId}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-slate-950 px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-black active:scale-[0.98] disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          <span>{isSaving ? 'Saving...' : 'Save & Publish'}</span>
        </button>
      </div>

      {/* Notifications */}
      {saveSuccess && (
        <div className="mb-6 flex items-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 animate-soft-in">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>Syllabus changes successfully published to Supabase and live across Web and Mobile!</span>
        </div>
      )}

      {errorMessage && (
        <div className="mb-6 flex items-center gap-2.5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800 animate-soft-in">
          <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* ── SUBJECT SELECTOR CARD ── */}
      <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
          Select Subject to Manage
        </label>

        {isSubjectsLoading ? (
          <div className="h-10 rounded-lg bg-slate-100 animate-pulse" />
        ) : (
          <div className="relative">
            <select
              value={selectedSubjectId}
              onChange={(e) => setSelectedSubjectId(e.target.value)}
              className="w-full h-12 appearance-none rounded-xl border border-slate-300 bg-slate-50 px-4 pr-10 text-sm font-medium text-slate-900 focus:border-slate-950 focus:bg-white focus:outline-none transition"
            >
              {(allSubjects || []).map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.name || sub.title} — {sub.branch || 'B.Tech'} (Semester {sub.semester || '1'})
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          </div>
        )}

        {selectedSubject && (
          <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
            <span className="font-semibold text-slate-700">{selectedSubject.name || selectedSubject.title || 'Selected Subject'}</span>
            <span>•</span>
            <span>{selectedSubject.branch || 'B.Tech'} Semester {selectedSubject.semester || '1'}</span>
            <span>•</span>
            <Link 
              href={`/subjects/${selectedSubject.id}`} 
              target="_blank"
              className="inline-flex items-center gap-1 font-medium text-blue-600 hover:underline"
            >
              <span>Preview Public Subject Page</span>
              <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
        )}
      </div>

      {/* ── SYLLABUS PDF DOCUMENT CARD ── */}
      <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-800">
              <FileText className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Official Syllabus Document</h3>
              <p className="text-xs text-slate-500">Attach a PDF syllabus file for download by students.</p>
            </div>
          </div>

          <label className="cursor-pointer inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition">
            <Upload className="h-3.5 w-3.5" />
            <span>{isUploading ? 'Uploading...' : 'Upload PDF'}</span>
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>

        {fileUrl ? (
          <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3.5">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span className="text-xs font-medium text-slate-800 truncate">
                {fileName || 'Syllabus_Document.pdf'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-blue-600 hover:underline"
              >
                View
              </a>
              <button
                type="button"
                onClick={() => {
                  setFileUrl('');
                  setFileName('');
                  setFilePath('');
                }}
                className="text-xs text-rose-600 hover:underline"
              >
                Remove
              </button>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-slate-300 p-4 text-center text-xs text-slate-500">
            No syllabus PDF attached yet. Click &quot;Upload PDF&quot; above to add one.
          </div>
        )}
      </div>

      {/* ── DYNAMIC UNIT & TOPIC BUILDER ── */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Structured Units & Topics ({units.length} Units)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Add any number of units and topic breakdown items.
            </p>
          </div>

          <button
            type="button"
            onClick={handleAddUnit}
            className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-black transition"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Unit</span>
          </button>
        </div>

        {isSyllabusLoading ? (
          <div className="space-y-4 py-4 animate-pulse">
            <div className="h-24 rounded-xl bg-slate-100" />
            <div className="h-24 rounded-xl bg-slate-100" />
          </div>
        ) : units.length === 0 ? (
          <div className="py-12 text-center">
            <BookOpen className="h-10 w-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700">No units configured yet</p>
            <p className="text-xs text-slate-500 mt-1 mb-4">Click &quot;Add Unit&quot; to begin building this syllabus.</p>
            <button
              type="button"
              onClick={handleAddUnit}
              className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-black"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Create First Unit</span>
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {units.map((unit, uIdx) => (
              <div 
                key={unit.id || uIdx}
                className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 sm:p-5 transition hover:border-slate-300"
              >
                {/* Unit Header Row */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-slate-200">
                  <div className="flex items-center gap-3 flex-1">
                    <span className="flex h-7 items-center rounded-md bg-slate-200 px-2 font-mono text-[11px] font-bold text-slate-700">
                      UNIT {unit.unit_number || uIdx + 1}
                    </span>
                    <input
                      type="text"
                      value={unit.title}
                      onChange={(e) => handleUnitTitleChange(uIdx, e.target.value)}
                      placeholder="e.g. Matrices & Vector Algebra"
                      className="flex-1 h-9 rounded-lg border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-900 focus:border-slate-950 focus:outline-none"
                    />
                  </div>

                  {/* Unit Action Controls */}
                  <div className="flex items-center gap-1 self-end sm:self-auto">
                    <button
                      type="button"
                      onClick={() => handleMoveUnit(uIdx, 'up')}
                      disabled={uIdx === 0}
                      title="Move Unit Up"
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-30"
                    >
                      <MoveUp className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMoveUnit(uIdx, 'down')}
                      disabled={uIdx === units.length - 1}
                      title="Move Unit Down"
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-30"
                    >
                      <MoveDown className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteUnit(uIdx)}
                      title="Delete Unit"
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Topics Section inside Unit */}
                <div className="mt-4 pl-0 sm:pl-2">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Topics in this unit ({(unit.topics || []).length})
                    </span>
                    <button
                      type="button"
                      onClick={() => handleAddTopic(uIdx)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800"
                    >
                      <Plus className="h-3 w-3" />
                      <span>Add Topic</span>
                    </button>
                  </div>

                  <div className="space-y-2">
                    {(unit.topics || []).map((topic, tIdx) => (
                      <div key={topic.id || tIdx} className="flex items-center gap-2">
                        <span className="text-xs text-slate-400 font-mono w-4 text-center">
                          {tIdx + 1}.
                        </span>
                        <input
                          type="text"
                          value={topic.title}
                          onChange={(e) => handleTopicTitleChange(uIdx, tIdx, e.target.value)}
                          placeholder="e.g. Types of matrices, Rank, and Nullity"
                          className="flex-1 h-8 rounded-lg border border-slate-200 bg-white px-2.5 text-xs text-slate-800 focus:border-slate-900 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => handleDeleteTopic(uIdx, tIdx)}
                          className="text-slate-400 hover:text-rose-600 p-1"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>

    </div>
  );
}
