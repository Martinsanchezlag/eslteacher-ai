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

export default function Feed({
  prompts,
  tutorials,
  news,
  searchQuery,
  activeCategory,
  onPromptClick,
}: FeedProps) {
  const filteredPrompts = useMemo(() => {
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
  }, [prompts, searchQuery, activeCategory]);

  const isFiltering = searchQuery.trim() || (activeCategory && activeCategory !== "All");

  if (isFiltering) {
    if (filteredPrompts.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No prompts found</h3>
          <p className="text-sm text-gray-400 max-w-xs">
            Try a different search term or clear the filter to browse all prompts.
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filteredPrompts.map((prompt) => (
          <PromptCard key={prompt.id} prompt={prompt} onClick={onPromptClick} />
        ))}
      </div>
    );
  }

  // Default mixed feed layout
  const feedItems: React.ReactNode[] = [];
  let promptIndex = 0;
  let tutorialIndex = 0;
  let newsIndex = 0;

  // Beginner card — full width
  feedItems.push(
    <div key="beginner" className="col-span-full">
      <BeginnerCard />
    </div>
  );

  // 3 prompt cards
  for (let i = 0; i < 3 && promptIndex < prompts.length; i++, promptIndex++) {
    feedItems.push(
      <PromptCard key={`p-${prompts[promptIndex].id}-1`} prompt={prompts[promptIndex]} onClick={onPromptClick} />
    );
  }

  // 1 tutorial card — spans 1 column
  if (tutorialIndex < tutorials.length) {
    feedItems.push(
      <TutorialCard key={`t-${tutorials[tutorialIndex].id}-1`} tutorial={tutorials[tutorialIndex]} />
    );
    tutorialIndex++;
  }

  // 3 prompt cards
  for (let i = 0; i < 3 && promptIndex < prompts.length; i++, promptIndex++) {
    feedItems.push(
      <PromptCard key={`p-${prompts[promptIndex].id}-2`} prompt={prompts[promptIndex]} onClick={onPromptClick} />
    );
  }

  // 1 news card
  if (newsIndex < news.length) {
    feedItems.push(
      <NewsCard key={`n-${news[newsIndex].id}-1`} article={news[newsIndex]} />
    );
    newsIndex++;
  }

  // 3 prompt cards
  for (let i = 0; i < 3 && promptIndex < prompts.length; i++, promptIndex++) {
    feedItems.push(
      <PromptCard key={`p-${prompts[promptIndex].id}-3`} prompt={prompts[promptIndex]} onClick={onPromptClick} />
    );
  }

  // 1 tutorial card
  if (tutorialIndex < tutorials.length) {
    feedItems.push(
      <TutorialCard key={`t-${tutorials[tutorialIndex].id}-2`} tutorial={tutorials[tutorialIndex]} />
    );
    tutorialIndex++;
  }

  // 3 more prompt cards
  for (let i = 0; i < 3 && promptIndex < prompts.length; i++, promptIndex++) {
    feedItems.push(
      <PromptCard key={`p-${prompts[promptIndex].id}-4`} prompt={prompts[promptIndex]} onClick={onPromptClick} />
    );
  }

  // 1 news card
  if (newsIndex < news.length) {
    feedItems.push(
      <NewsCard key={`n-${news[newsIndex].id}-2`} article={news[newsIndex]} />
    );
    newsIndex++;
  }

  // Remaining prompts
  while (promptIndex < prompts.length) {
    feedItems.push(
      <PromptCard key={`p-${prompts[promptIndex].id}-5`} prompt={prompts[promptIndex]} onClick={onPromptClick} />
    );
    promptIndex++;
  }

  // Any remaining tutorials and news
  while (tutorialIndex < tutorials.length) {
    feedItems.push(
      <TutorialCard key={`t-${tutorials[tutorialIndex].id}-3`} tutorial={tutorials[tutorialIndex]} />
    );
    tutorialIndex++;
  }
  while (newsIndex < news.length) {
    feedItems.push(
      <NewsCard key={`n-${news[newsIndex].id}-3`} article={news[newsIndex]} />
    );
    newsIndex++;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {feedItems}
    </div>
  );
}
