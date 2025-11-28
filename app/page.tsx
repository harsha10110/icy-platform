"use client";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 relative overflow-hidden">
      {/* subtle gradient background blob */}
      <div className="pointer-events-none absolute -top-40 -right-40 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-violet-500/15 blur-3xl" />

      {/* Top nav */}
      <header className="relative z-10 border-b border-slate-800/60 bg-slate-950/80 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-blue-500 to-cyan-400 flex items-center justify-center text-sm font-bold">
              IC
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-semibold tracking-tight text-sm">
                ICY Platform
              </span>
              <span className="text-[11px] text-slate-400">
                Creator Collaboration OS
              </span>
            </div>
          </div>

          {/* Nav actions */}
          <div className="flex items-center gap-3">
            <a
              href="/login"
              className="text-xs sm:text-sm text-slate-300 hover:text-white"
            >
              Login
            </a>
            <a
              href="/signup"
              className="text-xs sm:text-sm px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 font-medium shadow-sm shadow-blue-900/40"
            >
              Get started
            </a>
          </div>
        </div>
      </header>

      {/* Main hero section */}
      <main className="relative z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-20 flex flex-col md:flex-row items-center gap-12">
          {/* Left: Hero copy */}
          <section className="flex-1 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/60 px-3 py-1 text-[11px] text-slate-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Live capstone build · v1.0
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight">
                Match brands with
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                  the right creators.
                </span>
              </h1>
              <p className="text-sm sm:text-[15px] text-slate-400 max-w-xl">
                ICY is a lightweight collaboration hub for brands and
                influencers: structured profiles, campaign briefs, and a
                smart match score that surfaces who should work together.
              </p>
            </div>

            {/* Primary CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <a
                href="/signup"
                className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium hover:bg-blue-700 shadow-md shadow-blue-900/40"
              >
                Create an account
              </a>
              <a
                href="/login"
                className="inline-flex items-center justify-center rounded-lg border border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-200 hover:bg-slate-900"
              >
                I already have an account
              </a>
            </div>

            {/* Roles summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 text-xs">
              <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-3">
                <p className="font-medium mb-1 flex items-center gap-2">
                  <span className="text-blue-400 text-base">◆</span>
                  For brands
                </p>
                <ul className="space-y-1 text-slate-400">
                  <li>• Create campaign briefs</li>
                  <li>• Discover & filter influencers</li>
                  <li>• Send structured collaboration requests</li>
                </ul>
              </div>
              <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-3">
                <p className="font-medium mb-1 flex items-center gap-2">
                  <span className="text-emerald-400 text-base">◆</span>
                  For influencers
                </p>
                <ul className="space-y-1 text-slate-400">
                  <li>• Build a profile once</li>
                  <li>• Get campaign-aligned requests</li>
                  <li>• Accept / reject in a simple inbox</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Right: Product preview card */}
          <aside className="flex-1 w-full max-w-md">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-2xl shadow-black/60">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-xs text-slate-400">Preview</p>
                  <p className="text-sm font-medium text-slate-100">
                    Brand Dashboard
                  </p>
                </div>
                <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 text-[11px] text-emerald-300">
                  Live matching
                </span>
              </div>

              <div className="space-y-2 mb-3">
                {/* fake stat row */}
                <div className="flex items-center justify-between rounded-lg bg-slate-950/70 border border-slate-800 px-3 py-2">
                  <div className="flex flex-col text-xs">
                    <span className="text-slate-400">Active campaign</span>
                    <span className="text-slate-100 font-medium">
                      Summer Drop UGC
                    </span>
                  </div>
                  <div className="text-right text-xs">
                    <span className="text-slate-400">Match range</span>
                    <span className="block text-blue-400 font-semibold">
                      68–92%
                    </span>
                  </div>
                </div>

                {/* fake list of influencers */}
                <div className="space-y-1.5 text-xs">
                  {[
                    { name: "arya.studio", match: 92 },
                    { name: "cityrunclub", match: 81 },
                    { name: "minimal.desk", match: 73 },
                  ].map((item) => (
                    <div
                      key={item.name}
                      className="flex items-center justify-between rounded-lg bg-slate-950/60 border border-slate-850/60 px-3 py-2"
                    >
                      <div>
                        <p className="text-slate-100 font-medium">
                          @{item.name}
                        </p>
                        <p className="text-slate-500 text-[11px]">
                          Lifestyle · IG + Reels
                        </p>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-[11px] text-slate-400">
                          Match
                        </span>
                        <span className="text-emerald-400 font-semibold text-sm">
                          {item.match}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800 mt-2">
                <p className="text-[11px] text-slate-500">
                  Built for quick discovery, not endless scrolling.
                </p>
                <span className="text-[10px] text-slate-500">
                  ICY · prototype
                </span>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
