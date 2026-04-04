import { getTutorials, getPrompts } from "@/lib/airtable";
import Header from "@/components/layout/Header";
import CopyButton from "@/components/ui/CopyButton";
import Link from "next/link";
import { notFound } from "next/navigation";

// Convert any YouTube/Vimeo URL to an embeddable URL
function getEmbedUrl(url: string): string {
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}?rel=0&modestbranding=1`;

  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;

  return url; // already an embed URL
}

const fileTypeIcons: Record<string, string> = {
  PDF: "📄",
  PPTX: "📊",
  DOCX: "📝",
  ZIP: "📦",
};

export default async function TutorialPage({ params }: { params: { id: string } }) {
  const [tutorials, allPrompts] = await Promise.all([getTutorials(), getPrompts()]);
  const tutorial = tutorials.find((t) => t.id === params.id);

  if (!tutorial) notFound();

  // Resolve related prompt objects
  const relatedPrompts = (tutorial.promptIds ?? [])
    .map((pid) => allPrompts.find((p) => p.id === pid))
    .filter(Boolean) as typeof allPrompts;

  // Related tutorials (excluding current)
  const related = tutorials.filter((t) => t.id !== tutorial.id).slice(0, 3);

  const paragraphs = tutorial.body
    ? tutorial.body.split(/\n\n+/).filter((p) => p.trim())
    : [];

  const embedUrl = tutorial.videoUrl ? getEmbedUrl(tutorial.videoUrl) : null;

  return (
    <div className="min-h-screen bg-page-bg">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Back link */}
        <Link
          href="/tutorials"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-primary transition-colors mb-6"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Tutorials
        </Link>

        {/* Title + meta */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-cyan text-primary-dark text-xs font-bold px-2.5 py-1 rounded-full">Tutorial</span>
            <span className="flex items-center gap-1 text-xs text-gray-400">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {tutorial.duration}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-primary-dark leading-tight mb-2">
            {tutorial.title}
          </h1>
          <p className="text-gray-500 text-lg leading-relaxed">{tutorial.description}</p>
        </div>

        {/* ── VIDEO ── */}
        {embedUrl ? (
          <div className="mb-8 rounded-2xl overflow-hidden shadow-lg bg-black aspect-video">
            <iframe
              src={embedUrl}
              title={tutorial.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        ) : (
          <div className="mb-8 rounded-2xl overflow-hidden shadow-lg aspect-video flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #112C70 0%, #5B56EB 100%)" }}>
            <div className="text-center text-white/80">
              <div className="w-20 h-20 rounded-full bg-white/15 flex items-center justify-center mx-auto mb-3">
                <svg className="w-10 h-10 ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <p className="text-sm font-medium">Video coming soon</p>
              <p className="text-xs text-white/50 mt-1">Add a YouTube URL in Airtable or data/tutorials.ts</p>
            </div>
          </div>
        )}

        {/* ── NOTES / BODY ── */}
        {paragraphs.length > 0 && (
          <section className="mb-10">
            <h2 className="text-lg font-bold text-primary-dark mb-4 flex items-center gap-2">
              <span className="w-1 h-5 bg-primary rounded-full inline-block" />
              About this tutorial
            </h2>
            <div className="space-y-4">
              {paragraphs.map((para, i) => (
                <p key={i} className="text-gray-600 leading-relaxed text-base">
                  {para}
                </p>
              ))}
            </div>
          </section>
        )}

        {/* ── PROMPTS USED ── */}
        {relatedPrompts.length > 0 && (
          <section className="mb-10">
            <h2 className="text-lg font-bold text-primary-dark mb-4 flex items-center gap-2">
              <span className="w-1 h-5 bg-accent rounded-full inline-block" />
              Prompts used in this tutorial
            </h2>
            <div className="space-y-4">
              {relatedPrompts.map((prompt) => (
                <div key={prompt.id} className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden">
                  <div className="flex items-center justify-between px-5 py-3 border-b border-gray-50">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm">{prompt.title}</h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-gray-400">{prompt.category}</span>
                        <span className="text-gray-200">·</span>
                        <span className="text-xs text-primary font-medium">{prompt.level}</span>
                      </div>
                    </div>
                    <CopyButton text={prompt.fullPrompt} />
                  </div>
                  <pre className="px-5 py-4 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap font-sans bg-gray-50">
                    {prompt.fullPrompt}
                  </pre>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── RESOURCES ── */}
        {tutorial.resources && tutorial.resources.length > 0 && (
          <section className="mb-10">
            <h2 className="text-lg font-bold text-primary-dark mb-4 flex items-center gap-2">
              <span className="w-1 h-5 bg-cyan rounded-full inline-block" />
              Downloads &amp; resources
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {tutorial.resources.map((resource, i) => (
                <a
                  key={i}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl px-4 py-3 shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200"
                >
                  <span className="text-2xl flex-shrink-0">
                    {fileTypeIcons[resource.fileType ?? ""] ?? "📎"}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">{resource.title}</p>
                    {resource.fileType && (
                      <p className="text-xs text-gray-400">{resource.fileType}</p>
                    )}
                  </div>
                  <svg className="w-4 h-4 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                  </svg>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* ── MORE TUTORIALS ── */}
        {related.length > 0 && (
          <section className="mt-10 pt-8 border-t border-gray-200">
            <h2 className="text-lg font-bold text-primary-dark mb-5">More tutorials</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {related.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/tutorials/${rel.id}`}
                  className="bg-white rounded-xl border border-gray-100 shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 overflow-hidden group"
                >
                  <div className="h-24 relative overflow-hidden"
                    style={{ background: "linear-gradient(135deg, #112C70 0%, #5B56EB 100%)" }}>
                    <div className="absolute inset-0 flex items-center justify-center opacity-60">
                      <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                    <div className="absolute top-2 right-2 bg-black/40 text-white text-xs px-2 py-0.5 rounded-full">
                      {rel.duration}
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="text-xs font-semibold text-gray-800 line-clamp-2 leading-snug">
                      {rel.title}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Back link bottom */}
        <div className="mt-10 pt-6 border-t border-gray-200">
          <Link href="/tutorials"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-dark transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to all tutorials
          </Link>
        </div>
      </main>

      <footer className="mt-16 border-t border-gray-200 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm font-semibold text-primary-dark">ESLteacher.ai</p>
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <Link href="/" className="hover:text-primary transition-colors">← Prompts</Link>
            <Link href="/tutorials" className="hover:text-primary transition-colors">Tutorials</Link>
            <Link href="/ai-in-elt" className="hover:text-primary transition-colors">AI in ELT</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
