'use client';

import React, { useState } from 'react';
import { X, Download, ExternalLink, RefreshCw, FileText, AlertCircle, Loader2 } from 'lucide-react';

interface PDFViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  fileUrl: string;
  subjectTitle?: string;
}

export function PDFViewerModal({
  isOpen,
  onClose,
  title,
  fileUrl,
  subjectTitle
}: PDFViewerModalProps) {
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [key, setKey] = useState(0);

  if (!isOpen || !fileUrl) return null;

  // Decide embed URL: direct PDF or Google Docs Viewer fallback for remote storage URLs
  const viewerUrl = fileUrl.includes('drive.google.com') || fileUrl.includes('/storage/v1/object/public/')
    ? `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(fileUrl)}`
    : `${fileUrl}#toolbar=1&view=FitH`;

  const handleDownload = () => {
    let downloadUrl = fileUrl;
    const driveMatch = downloadUrl.match(/(?:\/file\/d\/|id=)([a-zA-Z0-9_-]+)/);
    if (driveMatch && driveMatch[1]) {
      downloadUrl = `https://drive.google.com/uc?export=download&id=${driveMatch[1]}`;
    } else if (downloadUrl.includes('/storage/v1/object/public/') && !downloadUrl.includes('download=')) {
      const cleanTitle = title.replace(/[^a-zA-Z0-9._-]/g, '_');
      const filename = cleanTitle.toLowerCase().endsWith('.pdf') ? cleanTitle : `${cleanTitle}.pdf`;
      const separator = downloadUrl.includes('?') ? '&' : '?';
      downloadUrl = `${downloadUrl}${separator}download=${encodeURIComponent(filename)}`;
    }

    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = `${title}.pdf`;
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleRetry = () => {
    setHasError(false);
    setLoading(true);
    setKey((prev) => prev + 1);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:p-5 md:p-8 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative flex flex-col w-full max-w-5xl h-[88vh] rounded-2xl bg-white border border-[#E2E8F0] shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#F1F5F9] bg-[#FAFAFA]">
          <div className="flex items-center gap-3 overflow-hidden mr-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#FFF7ED] text-[#FF6B00]">
              <FileText className="h-4 w-4 stroke-[2]" />
            </div>
            <div className="overflow-hidden">
              <h3 className="text-[14.5px] font-[700] text-[#0F172A] truncate">
                {title}
              </h3>
              {subjectTitle && (
                <p className="text-[11.5px] text-[#64748B] truncate">
                  {subjectTitle}
                </p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#FFF7ED] text-[12.5px] font-[600] text-[#FF6B00] hover:bg-[#FFEDD5] transition-colors"
              title="Download PDF to your computer"
            >
              <Download className="h-3.5 w-3.5 stroke-[2]" />
              <span className="hidden sm:inline">Download</span>
            </button>

            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E2E8F0] bg-white text-[12.5px] font-[500] text-[#475569] hover:bg-[#F8FAFC] transition-colors"
              title="Open in new tab"
            >
              <ExternalLink className="h-3.5 w-3.5 stroke-[1.8]" />
              <span className="hidden sm:inline">Open in Tab</span>
            </a>

            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E2E8F0] bg-white text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#0F172A] transition-colors"
              title="Close reader"
            >
              <X className="h-4 w-4 stroke-[2]" />
            </button>
          </div>
        </div>

        {/* Reader Canvas */}
        <div className="relative flex-1 w-full bg-[#F8FAFC]">
          {loading && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/80 backdrop-blur-xs">
              <Loader2 className="h-8 w-8 animate-spin text-[#FF6B00]" />
              <p className="mt-3 text-[13px] font-[500] text-[#64748B]">Loading document preview...</p>
            </div>
          )}

          {hasError ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-white">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-500 mb-3">
                <AlertCircle className="h-6 w-6 stroke-[1.8]" />
              </div>
              <h4 className="text-base font-bold text-[#0F172A]">Unable to display document preview</h4>
              <p className="text-xs text-[#64748B] mt-1 max-w-sm">
                You can download the file or open it directly in a new browser window.
              </p>
              <div className="mt-5 flex items-center gap-3">
                <button
                  onClick={handleRetry}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#FF6B00] text-xs font-semibold text-white hover:bg-[#EA580C] transition"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span>Retry</span>
                </button>
                <a
                  href={fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-[#E2E8F0] bg-white text-xs font-semibold text-[#0F172A] hover:bg-[#F8FAFC] transition"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>Open Directly</span>
                </a>
              </div>
            </div>
          ) : (
            <iframe
              key={key}
              src={viewerUrl}
              className="w-full h-full border-none"
              title={title}
              onLoad={() => setLoading(false)}
              onError={() => {
                setLoading(false);
                setHasError(true);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
