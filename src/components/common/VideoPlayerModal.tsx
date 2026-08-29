'use client';

import React from 'react';
import { X, ExternalLink, PlaySquare, AlertCircle } from 'lucide-react';

interface VideoPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  videoUrl: string;
  subjectTitle?: string;
  description?: string;
}

const extractYouTubeId = (url?: string): string | null => {
  if (!url) return null;
  const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

export function VideoPlayerModal({
  isOpen,
  onClose,
  title,
  videoUrl,
  subjectTitle,
  description
}: VideoPlayerModalProps) {
  if (!isOpen || !videoUrl) return null;

  const videoId = extractYouTubeId(videoUrl);
  const directYouTubeUrl = videoId 
    ? `https://www.youtube.com/watch?v=${videoId}` 
    : videoUrl;

  const embedUrl = videoId
    ? `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`
    : null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-3 sm:p-6 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative flex flex-col w-full max-w-4xl rounded-2xl bg-white border border-[#E2E8F0] shadow-2xl overflow-hidden max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#F1F5F9] bg-[#FAFAFA]">
          <div className="flex items-center gap-3 overflow-hidden mr-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600">
              <PlaySquare className="h-4 w-4 stroke-[2]" />
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
            <a
              href={directYouTubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-red-600 text-[12.5px] font-[600] text-white hover:bg-red-700 transition-colors shadow-2xs"
            >
              <ExternalLink className="h-3.5 w-3.5 stroke-[2]" />
              <span>Open in YouTube ↗</span>
            </a>

            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E2E8F0] bg-white text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#0F172A] transition-colors"
              title="Close video"
            >
              <X className="h-4 w-4 stroke-[2]" />
            </button>
          </div>
        </div>

        {/* 16:9 Video Canvas */}
        <div className="relative w-full aspect-video bg-black">
          {embedUrl ? (
            <iframe
              src={embedUrl}
              title={title}
              className="w-full h-full border-none"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center text-white">
              <AlertCircle className="h-10 w-10 text-red-500 mb-3" />
              <h4 className="text-base font-bold">In-app playback unavailable</h4>
              <p className="text-xs text-gray-300 mt-1 max-w-sm">
                This video link cannot be embedded directly. You can watch it on YouTube.
              </p>
              <a
                href={directYouTubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-xs font-semibold text-white hover:bg-red-700 transition"
              >
                <span>Watch on YouTube</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          )}
        </div>

        {/* Metadata Footer */}
        {description && (
          <div className="px-5 py-3 bg-[#F8FAFC] border-t border-[#F1F5F9]">
            <p className="text-xs text-[#475569] leading-relaxed">
              {description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
