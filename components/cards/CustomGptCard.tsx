import { CustomGpt } from "@/types";

// Unsplash fallback images per category
const categoryImages: Record<string, string> = {
  Vocabulary:
    "https://images.unsplash.com/photo-1546521343-4eb2c01aa44b?w=480&h=200&fit=crop&auto=format",
  Grammar:
    "https://images.unsplash.com/photo-1503676382389-4809596d5290?w=480&h=200&fit=crop&auto=format",
  Speaking:
    "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=480&h=200&fit=crop&auto=format",
  Writing:
    "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=480&h=200&fit=crop&auto=format",
  Reading:
    "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=480&h=200&fit=crop&auto=format",
  Listening:
    "https://images.unsplash.com/photo-1516397281156-ca07cf9746fc?w=480&h=200&fit=crop&auto=format",
  IELTS:
    "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=480&h=200&fit=crop&auto=format",
  "Lesson Planning":
    "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=480&h=200&fit=crop&auto=format",
};

const fallbackImage =
  "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=480&h=200&fit=crop&auto=format";

interface CustomGptCardProps {
  gpt: CustomGpt;
}

export default function CustomGptCard({ gpt }: CustomGptCardProps) {
  const imageUrl =
    gpt.thumbnail ?? categoryImages[gpt.category] ?? fallbackImage;

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-200 border border-gray-100 flex flex-col min-w-[240px] sm:min-w-0">

      {/* Photo header */}
      <div className="relative h-36 overflow-hidden bg-gray-100 flex-shrink-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt={gpt.category}
          className="w-full h-full object-cover"
        />
        {/* Dark gradient so badges are readable */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

        {/* GPT robot badge — top left */}
        <div className="absolute top-3 left-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-md"
            style={{ background: "linear-gradient(135deg, #5B56EB 0%, #BB63FF 100%)" }}>
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2h-2" />
            </svg>
          </div>
        </div>

        {/* Level badge — top right */}
        <div className="absolute top-3 right-3">
          <span className="text-xs font-semibold bg-black/50 text-white px-2.5 py-1 rounded-full backdrop-blur-sm">
            {gpt.level}
          </span>
        </div>

        {/* Category — bottom left over gradient */}
        <div className="absolute bottom-3 left-3">
          <span className="text-xs font-semibold text-white/90 bg-white/15 border border-white/20 px-2.5 py-1 rounded-full backdrop-blur-sm">
            {gpt.category}
          </span>
        </div>
      </div>

      {/* Card body */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <h3 className="font-semibold text-gray-900 text-sm leading-snug">
          {gpt.title}
        </h3>
        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 flex-1">
          {gpt.preview}
        </p>

        <a
          href={gpt.customGptUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="mt-2 flex items-center justify-center gap-1.5 text-xs font-bold text-white px-3 py-2 rounded-xl transition-colors duration-150 w-full"
          style={{ background: "linear-gradient(90deg, #5B56EB 0%, #BB63FF 100%)" }}
        >
          Open GPT
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>
    </div>
  );
}
