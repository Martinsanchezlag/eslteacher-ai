"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Banner, PromptCard } from "@/types";

interface FeaturedBannersProps {
  banners: Banner[];
  onPromptClick?: (prompt: PromptCard) => void;
  allPrompts?: PromptCard[];
}

const tagStyles: Record<string, string> = {
  cyan:   "bg-cyan-400/25 text-cyan-100 border border-cyan-300/40",
  purple: "bg-purple-400/25 text-purple-100 border border-purple-300/40",
  green:  "bg-emerald-400/25 text-emerald-100 border border-emerald-300/40",
  blue:   "bg-blue-400/25 text-blue-100 border border-blue-300/40",
  orange: "bg-orange-400/25 text-orange-100 border border-orange-300/40",
};

export default function FeaturedBanners({ banners, onPromptClick, allPrompts = [] }: FeaturedBannersProps) {
  const [current, setCurrent] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const [showArrows, setShowArrows] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = useCallback((index: number) => {
    if (transitioning) return;
    setTransitioning(true);
    setTimeout(() => {
      setCurrent(index);
      setTransitioning(false);
    }, 350);
  }, [transitioning]);

  const next = useCallback(() => {
    goTo((current + 1) % banners.length);
  }, [current, banners.length, goTo]);

  const prev = useCallback(() => {
    goTo((current - 1 + banners.length) % banners.length);
  }, [current, banners.length, goTo]);

  // Auto-advance every 6 s; reset timer on manual nav
  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (banners.length <= 1) return;
    timerRef.current = setInterval(next, 6000);
  }, [next, banners.length]);

  useEffect(() => {
    resetTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [resetTimer]);

  if (banners.length === 0) return null;

  const banner = banners[current];
  const tagClass = tagStyles[banner.tagColor] ?? tagStyles.cyan;

  function handleCtaClick(e: React.MouseEvent) {
    if (banner.promptId && onPromptClick) {
      e.preventDefault();
      const target = allPrompts.find((p) => p.id === banner.promptId);
      if (target) onPromptClick(target);
    }
  }

  function handleManualNav(fn: () => void) {
    fn();
    resetTimer();
  }

  return (
    <section className="mb-10">
      <div
        className="relative rounded-2xl overflow-hidden shadow-xl cursor-pointer group"
        style={{ height: "clamp(260px, 38vw, 420px)" }}
        onMouseEnter={() => setShowArrows(true)}
        onMouseLeave={() => setShowArrows(false)}
      >
        {/* ── Slides (stack + crossfade) ───────────────────────────────────── */}
        {banners.map((b, i) => (
          <div
            key={b.id}
            className="absolute inset-0 transition-opacity duration-500 ease-in-out"
            style={{ opacity: i === current && !transitioning ? 1 : 0, zIndex: i === current ? 1 : 0 }}
          >
            {/* Photo */}
            {b.backgroundImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={b.backgroundImage}
                alt=""
                aria-hidden
                className="absolute inset-0 w-full h-full object-cover object-center"
              />
            ) : (
              /* Gradient-only fallback */
              <div
                className="absolute inset-0"
                style={{ background: `linear-gradient(${b.gradient})` }}
              />
            )}

            {/* Bottom-up scrim — always present, creates readable text zone */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10" />

            {/* Optional colour tint for branded feel */}
            {b.backgroundImage && (
              <div
                className="absolute inset-0 mix-blend-multiply opacity-40"
                style={{ background: `linear-gradient(${b.gradient})` }}
              />
            )}
          </div>
        ))}

        {/* ── Content — bottom-left anchored ───────────────────────────────── */}
        <div
          className="absolute inset-0 z-10 flex flex-col justify-end p-5 sm:p-8 lg:p-10 transition-opacity duration-350"
          style={{ opacity: transitioning ? 0 : 1 }}
        >
          <div className="max-w-2xl">
            {/* Tag pill */}
            <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full mb-3 backdrop-blur-sm ${tagClass}`}>
              {banner.tag}
            </span>

            {/* Title */}
            <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-extrabold text-white leading-tight mb-3 drop-shadow-md">
              {banner.title}
            </h2>

            {/* Description — hidden on small screens */}
            <p className="hidden sm:block text-white/75 text-sm lg:text-base leading-relaxed mb-5 max-w-xl">
              {banner.description}
            </p>

            {/* CTA */}
            <a
              href={banner.promptId ? "#" : banner.ctaUrl}
              onClick={handleCtaClick}
              className="inline-flex items-center gap-2 bg-white text-primary font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-cyan hover:text-primary-dark transition-all duration-200 shadow-lg"
            >
              {banner.ctaText}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>

        {/* ── Prev / Next arrows — appear on hover ─────────────────────────── */}
        {banners.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); handleManualNav(prev); }}
              className={`absolute left-3 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/65 backdrop-blur-sm text-white w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${showArrows ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"}`}
              aria-label="Previous"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); handleManualNav(next); }}
              className={`absolute right-3 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/65 backdrop-blur-sm text-white w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${showArrows ? "opacity-100 translate-x-0" : "opacity-0 translate-x-2"}`}
              aria-label="Next"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* ── Dot indicators — bottom-right ────────────────────────────────── */}
        {banners.length > 1 && (
          <div className="absolute bottom-4 right-5 z-20 flex gap-1.5 items-center">
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={() => handleManualNav(() => goTo(i))}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === current ? "bg-white w-6" : "bg-white/40 w-1.5 hover:bg-white/70"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        )}

        {/* ── Progress bar — thin auto-advance indicator ───────────────────── */}
        {banners.length > 1 && (
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/10 z-20">
            <div
              key={current}
              className="h-full bg-white/50 origin-left"
              style={{ animation: "progressBar 6s linear forwards" }}
            />
          </div>
        )}
      </div>

      <style>{`
        @keyframes progressBar {
          from { width: 0% }
          to   { width: 100% }
        }
      `}</style>
    </section>
  );
}
