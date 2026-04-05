"use client";

import { useState, useEffect } from "react";
import { PromptCard as PromptCardType } from "@/types";

// Curated Unsplash classroom photos per category
const categoryImages: Record<string, string> = {
  Warmers:
    "https://images.unsplash.com/photo-1529390079861-591de354faf5?w=480&h=200&fit=crop&auto=format",
  Energisers:
    "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=480&h=200&fit=crop&auto=format",
  Speaking:
    "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=480&h=200&fit=crop&auto=format",
  Writing:
    "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=480&h=200&fit=crop&auto=format",
  Reading:
    "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=480&h=200&fit=crop&auto=format",
  Listening:
    "https://images.unsplash.com/photo-1516397281156-ca07cf9746fc?w=480&h=200&fit=crop&auto=format",
  Grammar:
    "https://images.unsplash.com/photo-1503676382389-4809596d5290?w=480&h=200&fit=crop&auto=format",
  Vocabulary:
    "https://images.unsplash.com/photo-1546521343-4eb2c01aa44b?w=480&h=200&fit=crop&auto=format",
  IELTS:
    "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=480&h=200&fit=crop&auto=format",
  "PPT Design":
    "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=480&h=200&fit=crop&auto=format",
  "Lesson Planning":
    "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=480&h=200&fit=crop&auto=format",
  Assessment:
    "https://images.unsplash.com/photo-1606761568499-6d2451b23c66?w=480&h=200&fit=crop&auto=format",
  Homework:
    "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=480&h=200&fit=crop&auto=format",
};

const categoryColors: Record<string, string> = {
  Warmers: "bg-orange-100 text-orange-700",
  Energisers: "bg-yellow-100 text-yellow-700",
  Speaking: "bg-blue-100 text-blue-700",
  Writing: "bg-green-100 text-green-700",
  Reading: "bg-teal-100 text-teal-700",
  Listening: "bg-indigo-100 text-indigo-700",
  Grammar: "bg-purple-100 text-purple-700",
  Vocabulary: "bg-pink-100 text-pink-700",
  IELTS: "bg-red-100 text-red-700",
  "PPT Design": "bg-cyan-100 text-cyan-700",
  "Lesson Planning": "bg-primary/10 text-primary",
  Assessment: "bg-accent/10 text-accent",
  Homework: "bg-gray-100 text-gray-600",
};

interface PromptCardProps {
  prompt: PromptCardType;
  onClick: (prompt: PromptCardType) => void;
}

export default function PromptCard({ prompt, onClick }: PromptCardProps) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(prompt.likes);
  const [copied, setCopied] = useState(false);
  const [imgSrc, setImgSrc] = useState(
    prompt.thumbnail || categoryImages[prompt.category] || ""
  );
  const [imgFailed, setImgFailed] = useState(false);

  const categoryClass = categoryColors[prompt.category] ?? "bg-gray-100 text-gray-600";

  function handleImgError() {
    // If thumbnail failed, try the category fallback image
    const fallback = categoryImages[prompt.category];
    if (fallback && imgSrc !== fallback) {
      setImgSrc(fallback);
    } else {
      setImgFailed(true);
    }
  }

  // Restore liked state from localStorage on mount (avoids SSR mismatch)
  useEffect(() => {
    const stored = localStorage.getItem(`liked_${prompt.id}`);
    if (stored === "true") setLiked(true);
  }, [prompt.id]);

  function handleLike(e: React.MouseEvent) {
    e.stopPropagation();
    const newLiked = !liked;
    setLiked(newLiked);
    setLikeCount((c) => newLiked ? c + 1 : Math.max(0, c - 1));

    // Persist to localStorage so the like survives page reloads
    if (newLiked) {
      localStorage.setItem(`liked_${prompt.id}`, "true");
    } else {
      localStorage.removeItem(`liked_${prompt.id}`);
    }

    // Call the API if this prompt came from Airtable (has a real rec... ID)
    if (prompt.airtableId) {
      fetch(`/api/like/${prompt.airtableId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: newLiked ? "like" : "unlike" }),
      })
        .then((res) => res.json())
        .then((data) => {
          // Sync with the server's authoritative count
          if (typeof data.likes === "number") setLikeCount(data.likes);
        })
        .catch(() => {
          // Revert optimistic update on network error
          setLiked(!newLiked);
          setLikeCount((c) => newLiked ? Math.max(0, c - 1) : c + 1);
        });
    }
  }

  function handleCopy(e: React.MouseEvent) {
    e.stopPropagation();
    navigator.clipboard.writeText(prompt.fullPrompt).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div
      onClick={() => onClick(prompt)}
      className="bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-200 cursor-pointer border border-gray-100 flex flex-col"
    >
      {/* Photo thumbnail */}
      <div className="relative h-44 overflow-hidden bg-gray-100 flex-shrink-0">
        {imgSrc && !imgFailed ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imgSrc}
            alt={prompt.category}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={handleImgError}
          />
        ) : (
          // Gradient fallback only if all images fail
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #112C70 0%, #5B56EB 100%)" }}
          >
            <span className="text-5xl">📚</span>
          </div>
        )}

        {/* Category badge overlaid on image */}
        <div className="absolute top-3 left-3">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm ${categoryClass}`}>
            {prompt.category}
          </span>
        </div>

        {/* Time badge */}
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/50 text-white text-xs px-2.5 py-1 rounded-full backdrop-blur-sm">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {prompt.time}
        </div>
      </div>

      {/* Card body */}
      <div className="p-4 flex flex-col gap-2.5 flex-1">
        <div>
          <h3 className="font-semibold text-gray-900 text-sm leading-snug mb-1.5 line-clamp-2">
            {prompt.title}
          </h3>
          <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
            {prompt.preview}
          </p>
        </div>

        {/* Tags + level */}
        <div className="flex flex-wrap gap-1.5">
          {prompt.tags.slice(0, 2).map((tag) => (
            <span key={tag} className="text-xs text-gray-400 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-full">
              #{tag}
            </span>
          ))}
          <span className="text-xs text-primary bg-primary/5 border border-primary/15 px-2 py-0.5 rounded-full font-medium">
            {prompt.level}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-50 mt-auto">
          <button
            onClick={handleLike}
            className={`flex items-center gap-1.5 text-xs font-medium transition-colors duration-150 ${liked ? "text-accent" : "text-gray-400 hover:text-accent"}`}
          >
            <svg
              className={`w-4 h-4 transition-transform duration-150 ${liked ? "scale-110" : ""}`}
              fill={liked ? "currentColor" : "none"}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            {likeCount}
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all duration-200 ${
                copied ? "bg-green-100 text-green-700" : "bg-primary/8 text-primary hover:bg-primary hover:text-white"
              }`}
            >
              {copied ? (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy
                </>
              )}
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onClick(prompt); }}
              className="text-xs font-medium text-gray-400 hover:text-primary transition-colors px-2 py-1.5"
            >
              View →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
