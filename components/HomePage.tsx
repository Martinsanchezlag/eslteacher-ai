"use client";

import { useState } from "react";
import { PromptCard as PromptCardType, TutorialCard, NewsCard, Banner, CustomGpt } from "@/types";
import { categories } from "@/data/categories";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import CategoryPill from "@/components/ui/CategoryPill";
import PromptModal from "@/components/ui/PromptModal";
import FeaturedBanners from "@/components/ui/FeaturedBanners";
import CustomGptCard from "@/components/cards/CustomGptCard";
import Feed from "@/components/feed/Feed";

interface HomePageProps {
  prompts: PromptCardType[];
  tutorials: TutorialCard[];
  news: NewsCard[];
  banners: Banner[];
  customGpts: CustomGpt[];
}

export default function HomePage({ prompts, tutorials, news, banners, customGpts }: HomePageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedPrompt, setSelectedPrompt] = useState<PromptCardType | null>(null);

  function handleCategoryClick(cat: string) {
    setActiveCategory(cat);
    setSearchQuery("");
  }

  function handleSearchChange(value: string) {
    setSearchQuery(value);
    if (value) setActiveCategory("All");
  }

  return (
    <div className="min-h-screen bg-page-bg">
      <Header searchQuery={searchQuery} onSearchChange={handleSearchChange} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Hero */}
        <section className="mb-8">
          <div className="inline-flex items-center gap-2 bg-primary/8 text-primary text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
            <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
            Free to browse — no account needed
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight mb-3 text-primary-dark">
            The AI prompt library for{" "}
            <span
              style={{ background: "linear-gradient(90deg, #5B56EB 0%, #BB63FF 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}
            >
              English teachers
            </span>
          </h1>
          <p className="text-gray-400 text-base sm:text-lg">
            Browse, copy, and teach — in seconds.
          </p>
        </section>

        {/* Featured banners — data comes from Airtable (or local fallback) */}
        <FeaturedBanners
          banners={banners}
          onPromptClick={setSelectedPrompt}
          allPrompts={prompts}
        />

        {/* Custom GPTs strip */}
        {customGpts.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, #5B56EB 0%, #BB63FF 100%)" }}>
                  <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2h-2" />
                  </svg>
                </div>
                <h2 className="text-sm font-bold text-gray-800">Custom GPTs</h2>
                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                  Ready-to-use AI bots for your classroom
                </span>
              </div>
            </div>
            {/* Horizontally scrollable on mobile, grid on desktop */}
            <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 sm:overflow-visible">
              {customGpts.map((gpt) => (
                <CustomGptCard key={gpt.id} gpt={gpt} />
              ))}
            </div>
          </section>
        )}

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

        {/* Main content: feed + sidebar */}
        <section className="flex gap-6 items-start">
          <div className="flex-1 min-w-0" id="prompts">
            <Feed
              prompts={prompts}
              tutorials={tutorials}
              news={news}
              searchQuery={searchQuery}
              activeCategory={activeCategory}
              onPromptClick={setSelectedPrompt}
            />
          </div>
          <Sidebar onPromptClick={setSelectedPrompt} allPrompts={prompts} />
        </section>

        {/* Mobile collections */}
        <section className="lg:hidden mt-8 pt-6 border-t border-gray-200">
          <h2 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
            <span>📚</span> Prompt Collections
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { title: "Beginner AI Kit", count: 10, color: "#56E1E9", category: "All" },
              { title: "IELTS Prep Pack", count: 12, color: "#BB63FF", category: "IELTS" },
              { title: "Writing Boosters", count: 8, color: "#5B56EB", category: "Writing" },
              { title: "Grammar Essentials", count: 9, color: "#112C70", category: "Grammar" },
            ].map((col) => (
              <a
                key={col.title}
                href={`/prompts?category=${encodeURIComponent(col.category)}`}
                className="bg-white rounded-xl p-3 border border-gray-100 shadow-card hover:shadow-card-hover transition-all duration-200"
                style={{ borderLeft: `4px solid ${col.color}` }}
              >
                <p className="text-xs font-semibold text-gray-800">{col.title}</p>
                <p className="text-xs text-gray-400 mt-0.5">{col.count} prompts</p>
              </a>
            ))}
          </div>
        </section>

      </main>

      <footer className="mt-16 border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-primary-dark">ESLteacher.ai</p>
              <p className="text-xs text-gray-400 mt-0.5">AI prompts built for English language teachers</p>
            </div>
            <div className="flex items-center gap-4 text-xs text-gray-400">
              <a href="#" className="hover:text-primary transition-colors">About</a>
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
