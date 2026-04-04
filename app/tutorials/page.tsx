import { getTutorials } from "@/lib/airtable";
import Header from "@/components/layout/Header";
import Link from "next/link";

function getYouTubeThumbnail(videoUrl?: string): string | null {
  if (!videoUrl) return null;
  const match = videoUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
  return match ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg` : null;
}

export default async function TutorialsPage() {
  const tutorials = await getTutorials();

  return (
    <div className="min-h-screen bg-page-bg">
      <Header />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Hero */}
        <section className="mb-10">
          <div className="inline-flex items-center gap-2 bg-primary/8 text-primary text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
            <span className="w-1.5 h-1.5 bg-primary rounded-full" />
            Video Tutorials
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-primary-dark leading-tight mb-3">
            Learn to use{" "}
            <span style={{ background: "linear-gradient(90deg, #5B56EB 0%, #BB63FF 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              AI in your classroom
            </span>
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl leading-relaxed">
            Step-by-step video tutorials, classroom-ready prompts, and downloadable resources — everything you need to get started with AI in ELT.
          </p>
        </section>

        {/* Tutorial grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tutorials.map((tutorial) => {
            const ytThumb = getYouTubeThumbnail(tutorial.videoUrl);
            const thumbUrl = tutorial.thumbnail || ytThumb;

            return (
              <Link
                key={tutorial.id}
                href={`/tutorials/${tutorial.id}`}
                className="bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-200 border border-gray-100 flex flex-col group"
              >
                {/* Thumbnail */}
                <div className="h-44 relative overflow-hidden flex-shrink-0">
                  {thumbUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={thumbUrl} alt={tutorial.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
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
                  {/* Play overlay on hover */}
                  <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                      <svg className="w-6 h-6 text-primary ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                  {/* Duration badge */}
                  <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/50 text-white text-xs px-2.5 py-1 rounded-full backdrop-blur-sm">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {tutorial.duration}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 flex flex-col gap-2 flex-1">
                  <h3 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2">{tutorial.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 flex-1">{tutorial.description}</p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                    {tutorial.resources && tutorial.resources.length > 0 && (
                      <span className="flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                        </svg>
                        {tutorial.resources.length} download{tutorial.resources.length !== 1 ? "s" : ""}
                      </span>
                    )}
                    {tutorial.promptIds && tutorial.promptIds.length > 0 && (
                      <span className="flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                        {tutorial.promptIds.length} prompt{tutorial.promptIds.length !== 1 ? "s" : ""}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </main>

      <footer className="mt-16 border-t border-gray-200 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm font-semibold text-primary-dark">ESLteacher.ai</p>
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <Link href="/" className="hover:text-primary transition-colors">← Back to prompts</Link>
            <Link href="/ai-in-elt" className="hover:text-primary transition-colors">AI in ELT</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
