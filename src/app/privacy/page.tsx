"use client";

import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { LegalLinks } from "@/components/shared/LegalLinks";

export default function PrivacyPage() {
  const handleOpenPreferences = () => {
    window.dispatchEvent(new CustomEvent("devvault:open-privacy"));
  };

  const sections = [
    {
      title: "Data We Collect",
      content: "We collect minimal information required to provide our developer showcase services. This includes your email (via Supabase Auth), public profile information (username, bio), and the assets you upload to your portfolio (images, project details)."
    },
    {
      title: "How We Track Views",
      content: "To help you measure your portfolio visibility, we track 'Profile Views' and 'Project Views'. This is done using a lean, first-party tracking system that identifies unique interactions without cross-site tracking or selling your data to third-party advertisers."
    },
    {
      title: "Security & Storage",
      content: "All data and media assets are stored securely via Supabase (PostgreSQL & Storage). We use industry-standard encryption and security protocols to ensure your intellectual property and personal information are protected from unauthorized access."
    },
    {
      title: "Third-Party Services",
      content: "We use Supabase for authentication, database, and storage management. When you use DevVault, your infrastructure data is governed by our security standards and Supabase's privacy controls."
    },
    {
      title: "Cookie Commitment",
      content: "We use three distinct categories of cookies to provide our services:\n\n1. Strictly Necessary: Essential for authentication and security.\n2. Analytical Insights: Used to track profile and project interaction metrics.\n3. Marketing & Updates: Used for community announcements and personalized recommendations.\n\nYou have full granular control over these categories via our Privacy Settings modal."
    }
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#050505] text-black dark:text-white py-16 px-4 sm:px-6 relative z-0 transition-colors duration-300 font-sans">
      
      {/* Background radial gradient */}
      <div className="absolute inset-0 z-[-1] bg-[radial-gradient(circle_at_top,_var(--tw-gradient-from)_0%,_transparent_50%)] from-gray-100 dark:from-white/5 pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        
        <Button variant="ghost" size="sm" href="/" className="mb-12 group">
          <svg className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          <span className="uppercase tracking-widest text-[10px] font-extrabold">Return Home</span>
        </Button>

        <header className="mb-16 space-y-4 text-center sm:text-left">
          <Badge variant="default">Legal Framework</Badge>
          <h1 className="text-5xl sm:text-6xl font-black text-gray-900 dark:text-white tracking-tighter leading-tight">Privacy Policy</h1>
          <p className="text-lg text-gray-500 dark:text-gray-400 font-medium max-w-2xl leading-relaxed">
            Protecting your developer identity and the integrity of your hard work is our highest priority at DevVault. Last Privacy Audit: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}.
          </p>
        </header>

        <section className="mb-16">
          <Card className="p-8 md:p-12 border-emerald-500/20 bg-emerald-500/5 dark:bg-emerald-500/5 rounded-[3rem]">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
              <div className="space-y-2 flex-1">
                <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-widest italic">Granular Consent Control</h3>
                <ul className="space-y-3 text-zinc-600 dark:text-zinc-400">
                  <li className="flex gap-3">
                    <span className="text-black dark:text-white mt-1">•</span>
                    <span><strong>Security & Authentication:</strong> Essential cookies to keep you signed in and protect your account.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-black dark:text-white mt-1">•</span>
                    <span><strong>Essential Platform Metrics:</strong> We log basic view counts for profiles and projects to ensure creators have accurate traffic data. This is a core functional requirement of the showcase service. No personal identity is attached to these metrics unless you grant explicit consent.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-black dark:text-white mt-1">•</span>
                    <span><strong>Preferences:</strong> Saving your dark mode and cookie consent choices.</span>
                  </li>
                </ul>
              </div>
              <Button size="lg" onClick={handleOpenPreferences} className="px-10 rounded-2xl shadow-xl shadow-emerald-500/10">
                Manage Preferences
              </Button>
            </div>
          </Card>
        </section>

        <div className="space-y-10 mb-20">
          {sections.map((section, idx) => (
            <section key={idx} className="space-y-4">
              <h2 className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight uppercase border-l-4 border-black dark:border-white pl-4">
                {section.title}
              </h2>
              <Card className="p-8 md:p-12 border-gray-100 dark:border-white/5 bg-white dark:bg-black/40">
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed font-medium text-lg italic whitespace-pre-wrap">
                  "{section.content}"
                </p>
              </Card>
            </section>
          ))}
        </div>

        <footer className="pt-16 border-t border-gray-200/50 dark:border-white/5">
          <LegalLinks />
        </footer>
      </div>
    </div>
  );
}
