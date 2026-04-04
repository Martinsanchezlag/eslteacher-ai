import { getNews } from "@/lib/airtable";
import Header from "@/components/layout/Header";
import Link from "next/link";

const categoryConfig = {
  interview: { label: "Interview", color: "bg-blue-100 text-blue-700", border: "border-blue-200" },
  ethics:    { label: "Ethics",    color: "bg-orange-100 text-orange-700", border: "border-orange-200" },
  classroom: { label: "Classroom Practice", color: "bg-green-100 text-green-700", border: "border-green-200" },
  news:      { label: "News",      color: "bg-purple-100 text-purple-700", border: "border-purple-200" },
};

const categoryImages: Record<string, string> = {
  interview: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=360&fit=crop&auto=format",
  ethics:    "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=360&fit=crop&auto=format",
  classroom: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&h=360&fit=crop&auto=format",
  news:      "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&h=360&fit=crop&auto=format",
};

export default async function AiInEltPage() {
  const articles = await getNews();

  return (
    <div className="min-h-screen bg-page-bg">
      <Header />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Page hero */}
        <section className="mb-10">
          <div className="inline-flex items-center gap-2 bg-primary/8 text-primary text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
            <span className="w-1.5 h-1.5 bg-primary rounded-full" />
            AI in ELT
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-primary-dark leading-tight mb-3">
            AI in English{" "}
            <span
              style={{ background: "linear-gradient(90deg, #5B56EB 0%, #BB63FF 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}
            >
              Language Teaching
            </span>
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl leading-relaxed">
            Interviews, classroom stories, ethical debates, and the latest news about AI in ELT — written for teachers, by teachers.
          </p>
        </section>

        {/* Featured article (first one) */}
        {articles[0] && (
          <Link
            href={`/ai-in-elt/${articles[0].id}`}
            className="block mb-10 group"
          >
            <div className="bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-200 border border-gray-100">
              <div className="relative h-64 sm:h-80 overflow-hidden bg-gray-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={articles[0].coverImage ?? categoryImages[articles[0].category]}
                  alt={articles[0].title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full mb-2 ${categoryConfig[articles[0].category].color}`}>
                    {categoryConfig[articles[0].category].label}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-white leading-snug line-clamp-2">
                    {articles[0].title}
                  </h2>
                  <p className="text-white/75 text-sm mt-1">
                    {articles[0].author ?? "ESLteacher.ai"} · {articles[0].date}
                  </p>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-500 leading-relaxed line-clamp-2">{articles[0].excerpt}</p>
                <span className="inline-flex items-center gap-1.5 mt-3 text-sm font-semibold text-primary">
                  Read article
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </div>
          </Link>
        )}

        {/* Rest of articles grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.slice(1).map((article) => {
            const config = categoryConfig[article.category];
            const imageUrl = article.coverImage ?? categoryImages[article.category];
            return (
              <Link
                key={article.id}
                href={`/ai-in-elt/${article.id}`}
                className="bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-200 border border-gray-100 flex flex-col group"
              >
                <div className="relative h-40 overflow-hidden bg-gray-100 flex-shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imageUrl}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  <div className="absolute top-3 left-3">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm ${config.color}`}>
                      {config.label}
                    </span>
                  </div>
                </div>
                <div className="p-4 flex flex-col gap-2 flex-1">
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>{article.author ?? "ESLteacher.ai"}</span>
                    <span>{article.date}</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2">{article.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{article.excerpt}</p>
                  <span className="mt-auto pt-2 flex items-center gap-1 text-xs font-semibold text-primary">
                    Read article
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
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
