"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { PromptCard as PromptCardType } from "@/types";
import { categories } from "@/data/categories";
import Header from "@/components/layout/Header";
import CategoryPill from "@/components/ui/CategoryPill";
import PromptCard from "@/components/cards/PromptCard";
import PromptModal from "@/components/ui/PromptModal";

interface PromptsPageProps {
  prompts: PromptCardType[];
}

// Inner component — uses useSearchParams (must be inside Suspense)
function PromptsContent({ prompts }: PromptsPageProps) {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") ?? "All";

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [selectedPrompt, setSelectedPrompt] = useState<PromptCardType | null>(null);

  // If the URL query changes (e.g. back/forward nav) keep state in sync
  useEffect(() => {
    const cat = searchParams.get("category") ?? "All";
    setActiveCategory(cat);
  }, [searchParams]);

  function handleCategoryClick(cat: string) {
    setActiveCategory(cat);
    setSearchQuery("");
  }

  function handleSearchChange(value: string) {
    setSearchQuery(value);
    if (value) setActiveCategory("All");
  }

  const filtered = useMemo(() => {
    let result = prompts;
    if (activeCategory !== "All") {
      result = result.filter((p) => p.category === activeCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.preview.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return result;
  }, [prompts, activeCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-page-bg">
      <Header searchQuery={searchQuery} onSearchChange={handleSearchChange} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Page header */}
        <section className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <a href="/" className="text-xs text-gray-400 hover:text-primary transition-colors">Home</a>
            <svg className="w-3 h-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-xs text-gray-500 font-medium">Prompts</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-primary-dark leading-tight">
            AI Prompt Library
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            {prompts.length} prompts for English teachers — browse, copy, and teach.
          </p>
        </section>

        {/* Category pills */}
        <section className="mb-6 -mx-4 sm:mx-0">
          <div className="flex items-center gap-2.5 overflow-x-auto pills-scroll px-4 sm:px-0 pb-1">
            {categories.map((cat) => (
              <CategoryPill
                key={cat}
                label={cat}
                active={activeCategory === cat && !searchQuery}
                onClick={() => handleCategoryClick(cat)}
              />
            ))}
          </div>
        </section>

        {/* Results count + sort hint */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs text-gray-400">
            {filtered.length === prompts.length
              ? `All ${prompts.length} prompts`
              : `${filtered.length} of ${prompts.length} prompts`}
            {activeCategory !== "All" && !searchQuery && (
              <span className="ml-1 text-primary font-medium">in {activeCategory}</span>
            )}
            {searchQuery && (
              <span className="ml-1 text-primary font-medium">matching &ldquo;{searchQuery}&rdquo;</span>
            )}
          </p>
          {(activeCategory !== "All" || searchQuery) && (
            <button
              onClick={() => { setActiveCategory("All"); setSearchQuery(""); }}
              className="text-xs text-gray-400 hover:text-primary transition-colors flex items-center gap-1"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Clear filter
            </button>
          )}
        </div>

        {/* Prompts grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((prompt) => (
              <PromptCard key={prompt.id} prompt={prompt} onClick={setSelectedPrompt} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-base font-semibold text-gray-700 mb-1">No prompts found</h3>
            <p className="text-sm text-gray-400 mb-4">
              Try a different search term or category.
            </p>
            <button
              onClick={() => { setActiveCategory("All"); setSearchQuery(""); }}
              className="text-sm font-semibold text-primary hover:underline"
            >
              Show all prompts
            </button>
          </div>
        )}

      </main>

      <footer className="mt-16 border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-primary-dark">ESLteacher.ai</p>
              <p className="text-xs text-gray-400 mt-0.5">AI prompts built for English language teachers</p>
            </div>
            <div className="flex items-center gap-4 text-xs text-gray-400">
              <a href="/" className="hover:text-primary transition-colors">Home</a>
              <a href="#" className="hover:text-primary transition-colors">Submit a prompt</a>
              <a href="#" className="hover:text-primary transition-colors">Privacy</a>
            </div>
          </div>
        </div>
      </footer>

      <PromptModal prompt={selectedPrompt} onClose={() => setSelectedPrompt(null)} />
    </div>
  );
}

// Outer export — wraps inner component in Suspense to satisfy Next.js App Router
export default function PromptsPage({ prompts }: PromptsPageProps) {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-page-bg flex items-center justify-center">
        <div className="text-gray-400 text-sm">Loading prompts…</div>
      </div>
    }>
      <PromptsContent prompts={prompts} />
    </Suspense>
  );
}
