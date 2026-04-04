import Link from "next/link";
import { TutorialCard as TutorialCardType } from "@/types";

interface TutorialCardProps {
  tutorial: TutorialCardType;
}

// Extract YouTube video ID to use as auto-thumbnail
function getYouTubeThumbnail(videoUrl?: string): string | null {
  if (!videoUrl) return null;
  const match = videoUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
  return match ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg` : null;
}

export default function TutorialCard({ tutorial }: TutorialCardProps) {
  const ytThumb = getYouTubeThumbnail(tutorial.videoUrl);
  const thumbUrl = tutorial.thumbnail || ytThumb;

  return (
    <Link
      href={`/tutorials/${tutorial.id}`}
      className="bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-200 border border-gray-100 flex flex-col group"
    >
      {/* Thumbnail */}
      <div className="h-40 relative overflow-hidden flex-shrink-0">
        {thumbUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={thumbUrl}
            alt={tutorial.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #112C70 0%, #5B56EB 100%)" }}>
            <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
              <svg className="w-7 h-7 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        )}

        {/* Play overlay */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
            <svg className="w-5 h-5 text-primary ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3">
          <span className="bg-cyan text-primary-dark text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
            Tutorial
          </span>
        </div>
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/50 text-white text-xs px-2.5 py-1 rounded-full backdrop-blur-sm">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {tutorial.duration}
        </div>
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <h3 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2">
          {tutorial.title}
        </h3>
        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 flex-1">
          {tutorial.description}
        </p>

        {/* Resource + prompt indicators */}
        <div className="flex items-center gap-2 mt-1">
          {tutorial.resources && tutorial.resources.length > 0 && (
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              </svg>
              {tutorial.resources.length} resource{tutorial.resources.length !== 1 ? "s" : ""}
            </span>
          )}
          {tutorial.promptIds && tutorial.promptIds.length > 0 && (
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              {tutorial.promptIds.length} prompt{tutorial.promptIds.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        <div className="mt-2 w-full flex items-center justify-center gap-2 bg-primary/8 text-primary group-hover:bg-primary group-hover:text-white text-sm font-semibold py-2.5 rounded-xl transition-all duration-200">
          <svg className="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
          Watch now
        </div>
      </div>
    </Link>
  );
}
