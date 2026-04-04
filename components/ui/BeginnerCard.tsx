"use client";

export default function BeginnerCard() {
  return (
    <div className="col-span-full rounded-2xl p-6 bg-gradient-to-r from-primary-dark via-primary to-accent text-white shadow-card relative overflow-hidden">
      <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-white/5 -translate-y-12 translate-x-12" />
      <div className="absolute bottom-0 left-1/2 w-32 h-32 rounded-full bg-white/5 translate-y-10" />

      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="text-4xl">🚀</div>
        <div className="flex-1">
          <div className="inline-block bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full mb-2 tracking-wide uppercase">
            New to AI?
          </div>
          <h2 className="text-xl font-bold mb-1">Start here — your first AI prompt in 3 minutes</h2>
          <p className="text-white/80 text-sm leading-relaxed max-w-lg">
            You don&apos;t need to be a tech expert. Pick any prompt below, paste it into ChatGPT or Claude, and get a ready classroom activity instantly.
          </p>
        </div>
        <div className="flex flex-col sm:items-end gap-2">
          <a
            href="#"
            className="inline-flex items-center gap-2 bg-white text-primary font-semibold px-5 py-2.5 rounded-xl text-sm hover:bg-cyan hover:text-primary-dark transition-all duration-200 shadow-md whitespace-nowrap"
          >
            Watch quick guide
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </a>
          <span className="text-white/60 text-xs">No account needed to browse</span>
        </div>
      </div>
    </div>
  );
}
