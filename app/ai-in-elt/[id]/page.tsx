import { getNews } from "@/lib/airtable";
import Header from "@/components/layout/Header";
import Link from "next/link";
import { notFound } from "next/navigation";

const categoryConfig = {
  interview: { label: "Interview", color: "bg-blue-100 text-blue-700" },
  ethics:    { label: "Ethics",    color: "bg-orange-100 text-orange-700" },
  classroom: { label: "Classroom Practice", color: "bg-green-100 text-green-700" },
  news:      { label: "News",      color: "bg-purple-100 text-purple-700" },
};

const categoryImages: Record<string, string> = {
  interview: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1400&h=500&fit=crop&auto=format",
  ethics:    "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1400&h=500&fit=crop&auto=format",
  classroom: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1400&h=500&fit=crop&auto=format",
  news:      "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=1400&h=500&fit=crop&auto=format",
};

export default async function ArticlePage({ params }: { params: { id: string } }) {
  const articles = await getNews();
  const article = articles.find((a) => a.id === params.id);

  if (!article) notFound();

  const config = categoryConfig[article.category];
  const imageUrl = article.coverImage ?? categoryImages[article.category];

  // Related articles: same category, excluding this one
  const related = articles
    .filter((a) => a.id !== article.id && a.category === article.category)
    .slice(0, 3);

  // Render body: split on blank lines into paragraphs
  const paragraphs = article.body
    ? article.body.split(/\n\n+/).filter((p) => p.trim())
    : [];

  return (
    <div className="min-h-screen bg-page-bg">
      <Header />

      {/* Cover image hero */}
      <div className="relative h-64 sm:h-80 lg:h-96 overflow-hidden bg-gray-200">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt={article.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Back link */}
        <div className="absolute top-5 left-5">
          <Link
            href="/ai-in-elt"
            className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-full hover:bg-white/25 transition-all"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
            AI in ELT
          </Link>
        </div>

        {/* Category + title overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
          <div className="max-w-3xl mx-auto">
            <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full mb-3 ${config.color}`}>
              {config.label}
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-snug">
              {article.title}
            </h1>
            <p className="text-white/70 text-sm mt-2">
              {article.author ?? "ESLteacher.ai"} · {article.date}
            </p>
          </div>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Excerpt — styled as a pull quote */}
        <p className="text-lg sm:text-xl text-gray-600 leading-relaxed border-l-4 border-primary pl-5 mb-8 italic">
          {article.excerpt}
        </p>

        {/* Article body */}
        {paragraphs.length > 0 ? (
          <div className="prose prose-gray max-w-none space-y-5">
            {paragraphs.map((para, i) => (
              <p key={i} className="text-gray-700 leading-relaxed text-base sm:text-lg">
                {para}
              </p>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 italic">Full article coming soon.</p>
        )}

        {/* Back link */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <Link
            href="/ai-in-elt"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-dark transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to AI in ELT
          </Link>
        </div>

        {/* Related articles */}
        {related.length > 0 && (
          <section className="mt-12">
            <h2 className="text-lg font-bold text-primary-dark mb-5">More from AI in ELT</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {related.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/ai-in-elt/${rel.id}`}
                  className="bg-white rounded-xl p-4 border border-gray-100 shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 flex gap-3"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={rel.coverImage ?? categoryImages[rel.category]}
                    alt={rel.title}
                    className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                  />
                  <div>
                    <p className="text-xs text-gray-400 mb-1">{rel.date}</p>
                    <p className="text-sm font-semibold text-gray-800 leading-snug line-clamp-2">{rel.title}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      <footer className="mt-16 border-t border-gray-200 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
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
