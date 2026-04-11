"use client";

import { useMemo } from "react";
import { PromptCard as PromptCardType, TutorialCard as TutorialCardType, NewsCard as NewsCardType } from "@/types";
import PromptCard from "@/components/cards/PromptCard";
import TutorialCard from "@/components/cards/TutorialCard";
import NewsCard from "@/components/cards/NewsCard";
import BeginnerCard from "@/components/ui/BeginnerCard";

interface FeedProps {
  prompts: PromptCardType[];
  tutorials: TutorialCardType[];
  news: NewsCardType[];
  searchQuery: string;
  activeCategory: string;
  onPromptClick: (prompt: PromptCardType) => void;
}

function SectionHeader({
  title,
  icon,
  count,
  href,
  linkLabel,
}: {
  title: string;
  icon: string;
  count?: number;
  href: string;
  linkLabel: string;
}) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <span className="text-lg">{icon}</span>
        <h2 className="text-base font-bold text-gray-900">{title}</h2>
        {count !== undefined && (
          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
            {count}
          </span>
        )}
      </div>
      <a
        href={href}
        className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
      >
        {linkLabel}
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
        </svg>
      </a>
    </div>
  );
}

export default function Feed({
  prompts,
  tutorials,
  news,
  searchQuery,
  activeCategory,
  onPromptClick,
}: FeedProps) {
  const isFiltering = searchQuery.trim() || (activeCategory && activeCategory !== "All");

  const filteredPrompts = useMemo(() => {
    if (!isFiltering) return prompts;
    let result = prompts;
    if (activeCategory && activeCategory !== "All") {
      result = result.filter((p) => p.category === activeCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.preview.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q)) ||
          p.level.toLowerCase().includes(q)
      );
    }
    return result;
  }, [prompts, searchQuery, activeCategory, isFiltering]);

  // ── Filtered / search view ───────────────────────────────────────────────────
  if (isFiltering) {
    if (filteredPrompts.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No prompts found</h3>
          <p className="text-sm text-gray-400 max-w-xs">
            Try a different search term or{" "}
            <a href="/prompts" className="text-primary font-semibold hover:underline">
              browse all prompts
            </a>
            .
          </p>
        </div>
      );
    }

    return (
      <div>
        <p className="text-xs text-gray-400 mb-4">
          {filteredPrompts.length} prompt{filteredPrompts.length !== 1 ? "s" : ""}
          {activeCategory !== "All" && <span className="text-primary font-medium ml-1">in {activeCategory}</span>}
          {searchQuery && <span className="text-primary font-medium ml-1">matching &ldquo;{searchQuery}&rdquo;</span>}
          <a href="/prompts" className="ml-2 text-gray-400 hover:text-primary underline">See full library →</a>
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredPrompts.map((prompt) => (
            <PromptCard key={prompt.id} prompt={prompt} onClick={onPromptClick} />
          ))}
        </div>
      </div>
    );
  }

  // ── Default hub layout ───────────────────────────────────────────────────────
  const latestPrompts = prompts.slice(0, 8);        // newest 8
  const latestTutorials = tutorials.slice(0, 4);    // newest 4
  const latestNews = news.slice(0, 3);              // newest 3

  return (
    <div className="space-y-12">

      {/* Beginner card */}
      <BeginnerCard />

      {/* ── Latest Prompts ──────────────────────────────────────────────────── */}
      <section>
        <SectionHeader
          title="Latest Prompts"
          icon="✨"
          count={prompts.length}
          href="/prompts"
          linkLabel="Browse all"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {latestPrompts.map((prompt) => (
            <PromptCard key={prompt.id} prompt={prompt} onClick={onPromptClick} />
          ))}
        </div>
        {prompts.length > 8 && (
          <div className="mt-5 text-center">
            <a
              href="/prompts"
              className="inline-flex items-center gap-2 bg-primary/8 text-primary text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-primary hover:text-white transition-all duration-200"
            >
              See all {prompts.length} prompts
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        )}
      </section>

      {/* ── Latest Tutorials ────────────────────────────────────────────────── */}
      {latestTutorials.length > 0 && (
        <section>
          <SectionHeader
            title="Latest Tutorials"
            icon="🎬"
            count={tutorials.length}
            href="/tutorials"
            linkLabel="See all"
          />
          {/* Horizontally scrollable on mobile, 2-col grid on sm+ */}
          <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 sm:overflow-visible">
            {latestTutorials.map((tutorial) => (
              <div key={tutorial.id} className="min-w-[280px] sm:min-w-0">
                <TutorialCard tutorial={tutorial} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── AI in ESL ───────────────────────────────────────────────────────── */}
      {latestNews.length > 0 && (
        <section>
          <SectionHeader
            title="AI in ESL"
            icon="📰"
            count={news.length}
            href="/ai-in-elt"
            linkLabel="See all"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {latestNews.map((article) => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
