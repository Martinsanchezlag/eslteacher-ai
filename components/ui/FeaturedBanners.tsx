"use client";

import { useState, useEffect, useCallback } from "react";
import { Banner, PromptCard } from "@/types";

interface FeaturedBannersProps {
  banners: Banner[];
  onPromptClick?: (prompt: PromptCard) => void;
  allPrompts?: PromptCard[];
}

const tagStyles: Record<string, string> = {
  cyan:   "bg-cyan-300/30 text-cyan-100 border border-cyan-300/40",
  purple: "bg-purple-300/30 text-purple-100 border border-purple-300/40",
  green:  "bg-green-300/30 text-green-100 border border-green-300/40",
  blue:   "bg-blue-300/30 text-blue-100 border border-blue-300/40",
  orange: "bg-orange-300/30 text-orange-100 border border-orange-300/40",
};

export default function FeaturedBanners({ banners, onPromptClick, allPrompts = [] }: FeaturedBannersProps) {
  const [current, setCurrent] = useState(0);
  const [fading, setFading] = useState(false);

  const goTo = useCallback((index: number) => {
    setFading(true);
    setTimeout(() => {
      setCurrent(index);
      setFading(false);
    }, 250);
  }, []);

  const next = useCallback(() => {
    goTo((current + 1) % banners.length);
  }, [current, banners.length, goTo]);

  const prev = useCallback(() => {
    goTo((current - 1 + banners.length) % banners.length);
  }, [current, banners.length, goTo]);

  // Auto-advance every 6 seconds
  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next, banners.length]);

  if (banners.length === 0) return null;

  const banner = banners[current];
  const tagClass = tagStyles[banner.tagColor] ?? tagStyles.cyan;

  function handleCtaClick(e: React.MouseEvent) {
    // If this banner links to a specific prompt, open the modal instead of navigating
    if (banner.promptId && onPromptClick) {
      e.preventDefault();
      const target = allPrompts.find((p) => p.id === banner.promptId);
      if (target) onPromptClick(target);
    }
  }

  return (
    <section className="mb-8">
      <div className="relative rounded-2xl overflow-hidden shadow-lg" style={{ minHeight: "260px" }}>

        {/* Background photo (optional) */}
        {banner.backgroundImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={banner.backgroundImage}
            alt=""
            aria-hidden
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
            style={{ opacity: fading ? 0 : 1 }}
          />
        )}

        {/* Dark base overlay — only when a photo is present, ensures text is always readable */}
        {banner.backgroundImage && (
          <div
            className="absolute inset-0 transition-opacity duration-500"
            style={{ background: "rgba(10,35,83,0.62)", opacity: fading ? 0 : 1 }}
          />
        )}

        {/* Gradient — full background when no photo, or a colour-tint overlay on top of the dark layer */}
        <div
          className="absolute inset-0 transition-opacity duration-500"
          style={{
            background: `linear-gradient(${banner.gradient})`,
            opacity: fading ? 0 : banner.backgroundImage ? 0.55 : 1,
          }}
        />

        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-white/5 -translate-y-20 translate-x-20 pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-48 h-48 rounded-full bg-white/5 translate-y-16 pointer-events-none" />

        {/* Content */}
        <div
          className="relative z-10 flex flex-col lg:flex-row items-center gap-6 p-7 lg:p-10 transition-opacity duration-250"
          style={{ opacity: fading ? 0 : 1 }}
        >
          {/* Emoji */}
          <div className="text-6xl lg:text-7xl flex-shrink-0 select-none">{banner.emoji}</div>

          {/* Text */}
          <div className="flex-1 text-center lg:text-left">
            <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full mb-3 ${tagClass}`}>
              {banner.tag}
            </span>
            <h2 className="text-xl lg:text-2xl xl:text-3xl font-extrabold text-white leading-snug mb-2">
              {banner.title}
            </h2>
            <p className="text-white/75 text-sm lg:text-base leading-relaxed max-w-2xl">
              {banner.description}
            </p>
          </div>

          {/* CTA */}
          <div className="flex-shrink-0">
            <a
              href={banner.promptId ? "#prompts" : banner.ctaUrl}
              onClick={handleCtaClick}
              className="inline-flex items-center gap-2 bg-white text-primary font-bold px-6 py-3 rounded-xl hover:bg-cyan hover:text-navy transition-all duration-200 shadow-md text-sm whitespace-nowrap"
            >
              {banner.ctaText}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>

        {/* Prev / Next arrows */}
        {banners.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/15 hover:bg-white/30 text-white w-9 h-9 rounded-full flex items-center justify-center transition-all z-20"
              aria-label="Previous"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/15 hover:bg-white/30 text-white w-9 h-9 rounded-full flex items-center justify-center transition-all z-20"
              aria-label="Next"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Dot indicators */}
        {banners.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === current ? "bg-white w-6" : "bg-white/40 w-2 hover:bg-white/60"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
