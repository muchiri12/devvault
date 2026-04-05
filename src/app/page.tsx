import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabaseServer";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { LegalLinks } from "@/components/shared/LegalLinks";

export default async function LandingPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#050505] selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black font-sans flex flex-col text-gray-900 transition-colors duration-300 relative z-0">
      {/* Background soft linear gradient */}
      <div className="absolute inset-0 z-[-1] bg-linear-to-b from-white dark:from-[#0A0A0A] via-[#FAFAFA] dark:via-[#050505] to-[#F2F2F2] dark:to-[#000000] transition-colors duration-300" />
      
      {/* 1. NAVIGATION BAR */}
      <div className="sticky top-0 z-50 w-full bg-[#FAFAFA]/90 dark:bg-[#050505]/90 backdrop-blur-md border-b border-gray-200/40 dark:border-white/5 transition-colors duration-300">
        <nav className="flex items-center justify-between px-5 md:px-12 py-4 md:py-5 max-w-7xl mx-auto w-full">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 md:w-10 md:h-10 bg-black dark:bg-white rounded-xl flex items-center justify-center shadow-md transform transition-all group-hover:scale-110 group-hover:rotate-6 duration-300 shrink-0">
              <div className="w-3 h-3 md:w-3.5 md:h-3.5 bg-white dark:bg-black rounded-sm rotate-45 transform" />
            </div>
            <span className="text-lg md:text-xl font-extrabold tracking-tight text-gray-900 dark:text-white">DevVault</span>
          </Link>

          <div className="flex items-center gap-2 md:gap-6 text-sm font-medium">
            <Button variant="ghost" href="/login" size="sm" className="hidden sm:inline-flex">
              Sign In
            </Button>
            <Button href="/register" size="sm">
              Get Started
            </Button>
          </div>
        </nav>
      </div>

      {/* 2. HERO SECTION */}
      <main className="max-w-7xl mx-auto px-6 pt-20 md:pt-32 pb-24 md:pb-40 text-center flex-1 w-full flex flex-col items-center justify-center relative overflow-hidden">
        {/* Subtle grid background */}
        <div className="absolute inset-0 -z-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PHBhdGggZD0iTTAgMGg0MHY0MEgwem0yMCAyMGgyMHYyMEgyMHoiIGZpbGw9IiMwMDAwMDAwMiIgZmlsbC1ydWxlPSJldmVub2RkIi8+PC9zdmc+')] dark:opacity-[0.05] opacity-[0.15] pointer-events-none transition-opacity duration-300" />
        
        {/* Glow behind hero */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 md:w-[500px] h-[350px] md:h-[450px] bg-white dark:bg-white/5 blur-[120px] rounded-full -z-10 pointer-events-none opacity-60 transition-colors duration-300" />

        <Badge variant="success" className="mb-8">
          Now available for developers
        </Badge>

        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-transparent bg-clip-text bg-linear-to-b from-black via-gray-800 to-gray-600 dark:from-white dark:via-zinc-200 dark:to-zinc-500 tracking-tight mb-6 md:mb-8 max-w-5xl mx-auto leading-[1.1] relative z-10">
          The ultimate command center for your developer journey.
        </h1>

        <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-10 md:mb-14 max-w-2xl mx-auto leading-relaxed font-medium relative z-10">
          Store your favorite coding resources, build stunning case studies, and showcase your projects to the community—all from one beautiful dashboard.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4 w-full sm:w-auto relative z-10">
          <Button href="/register" size="lg" className="w-full sm:w-auto">
            Start Building Free
          </Button>
          <Button href="/explore" variant="secondary" size="lg" className="w-full sm:w-auto">
            Explore Public Projects
          </Button>
        </div>
      </main>

      {/* 3. FEATURES GRID */}
      <section className="bg-white/60 dark:bg-[#0A0A0A]/40 backdrop-blur-3xl border-y border-gray-200/50 dark:border-white/5 py-24 md:py-32 px-6 relative overflow-hidden transition-colors duration-300">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="mb-16 md:mb-20">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-tight mb-4 md:mb-6 leading-[1.1]">Everything you need to grow.</h2>
            <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 font-medium max-w-2xl leading-relaxed">Built specifically for software engineers and designers who demand excellence.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            <Card className="flex flex-col h-full">
              <div className="w-16 h-16 bg-white dark:bg-white/5 text-gray-700 dark:text-gray-300 border border-gray-200/50 dark:border-white/10 rounded-2xl flex items-center justify-center mb-8 md:mb-10 shadow-sm transition-all duration-500">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              </div>
              <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-3 md:mb-4 tracking-tight">Resource Bookmarking</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed font-medium text-base">
                Never lose a helpful tutorial or documentation link again. Save, categorize, and access your favorite tools instantly.
              </p>
            </Card>

            <Card className="flex flex-col h-full">
              <div className="w-16 h-16 bg-white dark:bg-white/5 text-gray-700 dark:text-gray-300 border border-gray-200/50 dark:border-white/10 rounded-2xl flex items-center justify-center mb-8 md:mb-10 shadow-sm transition-all duration-500">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-3 md:mb-4 tracking-tight">Project Case Studies</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed font-medium text-base">
                Go beyond a simple link. Document the problem, process, and solution to build a professional engineering portfolio.
              </p>
            </Card>

            <Card className="flex flex-col h-full">
              <div className="w-16 h-16 bg-white dark:bg-white/5 text-gray-700 dark:text-gray-300 border border-gray-200/50 dark:border-white/10 rounded-2xl flex items-center justify-center mb-8 md:mb-10 shadow-sm transition-all duration-500">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-3 md:mb-4 tracking-tight">Community Driven</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed font-medium text-base">
                Share your public projects and approved resources with other developers. Learn, collaborate, and grow together.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* 4. FOOTER CTA */}
      <footer className="bg-black dark:bg-[#050505] text-white py-20 md:py-28 px-6 text-center border-t border-gray-800 dark:border-white/5 relative overflow-hidden transition-colors duration-300">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 md:w-96 h-[250px] md:h-[350px] bg-white/5 blur-[100px] rounded-full -z-10 pointer-events-none opacity-50 transition-opacity duration-500" />

        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight max-w-4xl mx-auto leading-tight">Ready to organize your code?</h2>
        <p className="text-gray-300 dark:text-zinc-500 mb-8 md:mb-10 max-w-xl mx-auto text-base md:text-lg font-medium leading-relaxed">
          Join DevVault today and start building the ultimate developer portfolio and resource hub.
        </p>
        <Button href="/register" variant="secondary" size="lg">
          Create Free Account
        </Button>
        <div className="mt-12 md:mt-16">
          <LegalLinks />
        </div>
      </footer>
    </div>
  );
}