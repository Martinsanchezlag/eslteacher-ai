"use client";

import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";

const VIDEO_ID = "_lQRuDPTRZQ";

function VideoModal({ onClose }: { onClose: () => void }) {
  // Close on Escape key
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      {/* Modal panel */}
      <div
        className="relative z-10 w-full max-w-3xl rounded-2xl overflow-hidden shadow-2xl bg-black"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 bg-black/60 hover:bg-black/80 text-white w-9 h-9 rounded-full flex items-center justify-center transition-all"
          aria-label="Close video"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* 16:9 responsive iframe wrapper */}
        <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
          <iframe
            className="absolute inset-0 w-full h-full"
            src={`https://www.youtube.com/embed/${VIDEO_ID}?autoplay=1&rel=0&modestbranding=1`}
            title="Watch quick guide — ESLteacher.ai"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        {/* Footer label */}
        <div className="px-4 py-3 bg-gray-950 flex items-center justify-between">
          <p className="text-white/70 text-xs font-medium">ESLteacher.ai — Quick Start Guide</p>
          <a
            href={`https://www.youtube.com/watch?v=${VIDEO_ID}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-white/40 hover:text-white/70 transition-colors"
          >
            Open on YouTube ↗
          </a>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default function BeginnerCard() {
  const [videoOpen, setVideoOpen] = useState(false);
  const closeVideo = useCallback(() => setVideoOpen(false), []);

  return (
    <>
      <div className="col-span-full rounded-2xl p-6 bg-gradient-to-r from-primary-dark via-primary to-accent text-white shadow-card relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-white/5 -translate-y-12 translate-x-12" />
        <div className="absolute bottom-0 left-1/2 w-32 h-32 rounded-full bg-white/5 translate-y-10" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="text-4xl">🚀</div>
          <div className="flex-1">
            <div className="inline-block bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full mb-2 tracking-wide uppercase">
              New to AI?
            </div>
            <h2 className="text-xl font-bold mb-1">Start here — your first AI prompt in 3 minutes</h2>
            <p className="text-white/80 text-sm leading-relaxed max-w-lg">
              You don&apos;t need to be a tech expert. Pick any prompt below, paste it into ChatGPT or Claude, and get a ready classroom activity instantly.
            </p>
          </div>
          <div className="flex flex-col sm:items-end gap-2">
            <button
              onClick={() => setVideoOpen(true)}
              className="inline-flex items-center gap-2 bg-white text-primary font-semibold px-5 py-2.5 rounded-xl text-sm hover:bg-cyan hover:text-primary-dark transition-all duration-200 shadow-md whitespace-nowrap group"
            >
              Watch quick guide
              {/* Animated play icon */}
              <span className="relative flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 group-hover:bg-primary-dark/10 transition-colors">
                <svg className="w-3 h-3 translate-x-px" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
            </button>
            <span className="text-white/60 text-xs">No account needed to browse</span>
          </div>
        </div>
      </div>

      {videoOpen && <VideoModal onClose={closeVideo} />}
    </>
  );
}
