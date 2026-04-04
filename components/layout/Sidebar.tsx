"use client";

import { collections } from "@/data/categories";
import { PromptCard } from "@/types";

interface SidebarProps {
  onPromptClick: (prompt: PromptCard) => void;
  allPrompts: PromptCard[];
}

export default function Sidebar({ onPromptClick, allPrompts }: SidebarProps) {
  // Real trending: top 6 prompts sorted by like count
  const trending = [...allPrompts]
    .sort((a, b) => b.likes - a.likes)
    .slice(0, 6);

  return (
    <aside className="hidden lg:block w-72 flex-shrink-0">
      <div className="sticky top-24 space-y-5">

        {/* Trending prompts — sorted by real likes */}
        <div className="bg-white rounded-2xl p-4 shadow-card border border-gray-100">
          <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
            <span className="text-base">🔥</span>
            Trending this week
          </h3>
          <ul className="space-y-2">
            {trending.map((prompt, i) => (
              <li key={prompt.id}>
                <button
                  onClick={() => onPromptClick(prompt)}
                  className="w-full text-left flex items-start gap-2.5 p-2 rounded-xl hover:bg-gray-50 transition-colors group"
                >
                  <span className="text-xs font-bold text-gray-300 w-4 flex-shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-700 group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                      {prompt.title}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">{prompt.category}</p>
                  </div>
                  <span className="flex items-center gap-0.5 text-xs text-gray-400 flex-shrink-0">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                    {prompt.likes}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Collections */}
        <div className="bg-white rounded-2xl p-4 shadow-card border border-gray-100">
          <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
            <span className="text-base">📚</span>
            Prompt collections
          </h3>
          <ul className="space-y-2">
            {collections.map((col) => (
              <li key={col.id}>
                <a
                  href="#"
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition-colors group"
                >
                  <div
                    className="w-8 h-8 rounded-lg flex-shrink-0"
                    style={{ backgroundColor: col.color + "22", borderLeft: `3px solid ${col.color}` }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-800 group-hover:text-primary transition-colors">
                      {col.title}
                    </p>
                    <p className="text-xs text-gray-400">{col.promptCount} prompts</p>
                  </div>
                  <svg className="w-3.5 h-3.5 text-gray-300 group-hover:text-primary transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Quick start CTA */}
        <div className="bg-gradient-to-br from-primary to-accent rounded-2xl p-4 text-white">
          <div className="text-2xl mb-2">✨</div>
          <h3 className="font-bold text-sm mb-1">Submit your own prompt</h3>
          <p className="text-white/75 text-xs leading-relaxed mb-3">
            Share a prompt that works in your class and help other teachers.
          </p>
          <a
            href="#"
            className="inline-block bg-white text-primary text-xs font-bold px-3 py-2 rounded-lg hover:bg-cyan hover:text-primary-dark transition-all duration-200"
          >
            Submit a prompt →
          </a>
        </div>

      </div>
    </aside>
  );
}
