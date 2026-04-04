"use client";

import Link from "next/link";
import { NewsCard as NewsCardType } from "@/types";

const categoryConfig = {
  interview: { label: "Interview", color: "bg-blue-100 text-blue-700" },
  ethics:    { label: "Ethics",    color: "bg-orange-100 text-orange-700" },
  classroom: { label: "Classroom Practice", color: "bg-green-100 text-green-700" },
  news:      { label: "News",      color: "bg-purple-100 text-purple-700" },
};

const categoryImages: Record<string, string> = {
  interview: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&h=240&fit=crop&auto=format",
  ethics:    "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&h=240&fit=crop&auto=format",
  classroom: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&h=240&fit=crop&auto=format",
  news:      "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=600&h=240&fit=crop&auto=format",
};

interface NewsCardProps {
  article: NewsCardType;
}

export default function NewsCard({ article }: NewsCardProps) {
  const config = categoryConfig[article.category];
  const imageUrl = article.coverImage ?? categoryImages[article.category];

  return (
    <Link
      href={`/ai-in-elt/${article.id}`}
      className="bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-200 border border-gray-100 flex flex-col"
    >
      {/* Cover image */}
      <div className="relative h-36 overflow-hidden bg-gray-100 flex-shrink-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt={article.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        <div className="absolute top-3 left-3">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm ${config.color}`}>
            {config.label}
          </span>
        </div>
      </div>

      {/* Card body */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>{article.author ?? "ESLteacher.ai"}</span>
          <span>{article.date}</span>
        </div>

        <h3 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2">
          {article.title}
        </h3>
        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
          {article.excerpt}
        </p>

        <span className="mt-auto flex items-center gap-1.5 text-sm font-medium text-primary group-hover:text-primary-dark transition-colors pt-2">
          Read article
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </span>
      </div>
    </Link>
  );
}
