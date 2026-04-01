import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#050505] selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black font-sans flex flex-col text-gray-900 transition-colors duration-300 relative z-0">
      {/* Background radial gradient */}
      <div className="absolute inset-0 z-[-1] bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-white dark:from-[#0A0A0A] via-[#FAFAFA] dark:via-[#050505] to-[#F2F2F2] dark:to-[#000000] transition-colors duration-300" />
      {/* 1. NAVIGATION BAR */}
      <nav className="flex items-center justify-between px-6 md:px-12 py-5 md:py-6 max-w-7xl mx-auto w-full z-10 sticky top-0 bg-[#FAFAFA]/80 dark:bg-[#050505]/80 backdrop-blur-md border-b border-gray-200/40 dark:border-white/5 transition-colors duration-300">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-black dark:bg-white rounded-xl flex items-center justify-center shadow-md transform transition-all hover:scale-110 hover:shadow-lg duration-300 group cursor-pointer">
            <div className="w-3.5 h-3.5 bg-white dark:bg-black rounded-sm rotate-45 transform group-hover:rotate-90 transition-transform duration-500" />
          </div>
          <span className="text-lg md:text-xl font-extrabold tracking-tight text-gray-900 dark:text-white">DevVault</span>
        </div>

        <div className="flex items-center gap-4 md:gap-6 text-sm font-medium">
          <Link href="/login" className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors duration-200 cursor-pointer tracking-wide">
            Sign In
          </Link>
          <Link
            href="/register"
            className="bg-black dark:bg-white text-white dark:text-black px-5 md:px-6 py-2.5 md:py-3 rounded-xl hover:bg-gray-900 dark:hover:bg-gray-100 hover:scale-[1.03] hover:-translate-y-0.5 active:scale-95 cursor-pointer font-bold text-sm transition-all duration-200 shadow-md hover:shadow-lg"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* 2. HERO SECTION */}
      <main className="max-w-7xl mx-auto px-6 pt-20 md:pt-32 pb-24 md:pb-40 text-center flex-1 w-full flex flex-col items-center justify-center relative overflow-hidden">

        {/* Subtle grid background */}
        <div className="absolute inset-0 -z-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PHBhdGggZD0iTTAgMGg0MHY0MEgwem0yMCAyMGgyMHYyMEgyMHoiIGZpbGw9IiMwMDAwMDAwMiIgZmlsbC1ydWxlPSJldmVub2RkIi8+PC9zdmc+')] dark:opacity-[0.05] opacity-[0.15] pointer-events-none transition-opacity duration-300"></div>

        {/* Glow behind hero */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 md:w-125 h-87.5 md:h-112.5 bg-white dark:bg-white/5 blur-[120px] rounded-full -z-10 pointer-events-none opacity-60 transition-colors duration-300"></div>

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-xs text-gray-700 dark:text-gray-300 font-semibold mb-8 cursor-default uppercase tracking-widest relative z-10 shadow-sm hover:shadow-md transition-all duration-300">
          <span className="flex h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.6)]"></span>
          Now available for developers
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-transparent bg-clip-text bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-black via-gray-800 to-gray-600 dark:from-white dark:via-zinc-200 dark:to-zinc-500 tracking-tight mb-6 md:mb-8 max-w-5xl mx-auto leading-[1.1] relative z-10">
          The ultimate command center for your developer journey.
        </h1>

        <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-10 md:mb-14 max-w-2xl mx-auto leading-relaxed font-medium relative z-10">
          Store your favorite coding resources, build stunning case studies, and showcase your projects to the community—all from one beautiful dashboard.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4 w-full sm:w-auto relative z-10">
          <Link
            href="/register"
            className="w-full sm:w-auto bg-black dark:bg-white text-white dark:text-black px-8 md:px-10 py-3 md:py-4 rounded-xl font-bold text-base md:text-lg hover:bg-gray-900 dark:hover:bg-gray-100 hover:scale-[1.03] hover:-translate-y-0.5 transition-all active:scale-95 shadow-lg hover:shadow-xl flex justify-center cursor-pointer duration-200 border border-black dark:border-white"
          >
            Start Building Free
          </Link>
          <Link
            href="/dashboard/projects"
            className="w-full sm:w-auto bg-white dark:bg-black text-black dark:text-white border border-gray-300 dark:border-white/10 px-8 md:px-10 py-3 md:py-4 rounded-xl font-bold text-base md:text-lg hover:bg-gray-50 dark:hover:bg-white/5 hover:border-gray-400 dark:hover:border-white/20 transition-all active:scale-95 shadow-sm hover:shadow-md flex justify-center cursor-pointer duration-200"
          >
            Explore Public Projects
          </Link>
        </div>
      </main>

      {/* 3. FEATURES GRID */}
      <section className="bg-white/60 dark:bg-[#0A0A0A]/40 backdrop-blur-3xl border-y border-gray-200/50 dark:border-white/5 py-24 md:py-32 px-6 relative overflow-hidden transition-colors duration-300">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="mb-16 md:mb-20">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-tight mb-4 md:mb-6">Everything you need to grow.</h2>
            <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 font-medium max-w-2xl leading-relaxed">Built specifically for software engineers and designers who demand excellence.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {/* Feature 1 */}
            <div className="group relative">
              <div className="bg-white/60 dark:bg-black/40 backdrop-blur-3xl p-6 sm:p-8 md:p-12 rounded-[2rem] border border-gray-200/50 dark:border-white/5 hover:border-black/10 dark:hover:border-white/20 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)] hover:-translate-y-1 transition-all duration-500 relative z-10 overflow-hidden flex flex-col h-full">
                <div className="w-16 h-16 bg-white dark:bg-white/5 text-gray-700 dark:text-gray-300 border border-gray-200/50 dark:border-white/10 rounded-2xl flex items-center justify-center mb-8 md:mb-10 shadow-sm group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black group-hover:shadow-md transition-all duration-500">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-3 md:mb-4 tracking-tight">Resource Bookmarking</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed font-medium text-base">
                  Never lose a helpful tutorial or documentation link again. Save, categorize, and access your favorite tools instantly.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="group relative">
              <div className="bg-white/60 dark:bg-black/40 backdrop-blur-3xl p-6 sm:p-8 md:p-12 rounded-[2rem] border border-gray-200/50 dark:border-white/5 hover:border-black/10 dark:hover:border-white/20 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)] hover:-translate-y-1 transition-all duration-500 relative z-10 overflow-hidden flex flex-col h-full">
                <div className="w-16 h-16 bg-white dark:bg-white/5 text-gray-700 dark:text-gray-300 border border-gray-200/50 dark:border-white/10 rounded-2xl flex items-center justify-center mb-8 md:mb-10 shadow-sm group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black group-hover:shadow-md transition-all duration-500">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-3 md:mb-4 tracking-tight">Project Case Studies</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed font-medium text-base">
                  Go beyond a simple link. Document the problem, process, and solution to build a professional engineering portfolio.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="group relative">
              <div className="bg-white/60 dark:bg-black/40 backdrop-blur-3xl p-6 sm:p-8 md:p-12 rounded-[2rem] border border-gray-200/50 dark:border-white/5 hover:border-black/10 dark:hover:border-white/20 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)] hover:-translate-y-1 transition-all duration-500 relative z-10 overflow-hidden flex flex-col h-full">
                <div className="w-16 h-16 bg-white dark:bg-white/5 text-gray-700 dark:text-gray-300 border border-gray-200/50 dark:border-white/10 rounded-2xl flex items-center justify-center mb-8 md:mb-10 shadow-sm group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black group-hover:shadow-md transition-all duration-500">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-3 md:mb-4 tracking-tight">Community Driven</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed font-medium text-base">
                  Share your public projects and approved resources with other developers. Learn, collaborate, and grow together.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FOOTER CTA */}
      <footer className="bg-black dark:bg-[#050505] text-white py-20 md:py-28 px-6 text-center border-t border-gray-800 dark:border-white/5 relative overflow-hidden transition-colors duration-300">
        {/* Subtle glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 md:w-96 h-62.5 md:h-87.5 bg-white/5 blur-[100px] rounded-full -z-10 pointer-events-none transition-opacity duration-500"></div>

        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight max-w-4xl mx-auto leading-tight">Ready to organize your code?</h2>
        <p className="text-gray-300 dark:text-zinc-500 mb-8 md:mb-10 max-w-xl mx-auto text-base md:text-lg font-medium leading-relaxed">
          Join DevVault today and start building the ultimate developer portfolio and resource hub.
        </p>
        <Link
          href="/register"
          className="inline-block bg-white text-black px-8 md:px-10 py-3 md:py-4 rounded-xl font-extrabold text-base hover:bg-zinc-100 hover:scale-[1.03] hover:-translate-y-0.5 active:scale-95 transition-all duration-200 shadow-lg hover:shadow-xl cursor-pointer border border-white"
        >
          Create Free Account
        </Link>
        <div className="mt-12 md:mt-16 text-zinc-600 dark:text-zinc-500 text-xs font-semibold tracking-wider uppercase">
          © {new Date().getFullYear()} DevVault
        </div>
      </footer>

    </div>
  );
}