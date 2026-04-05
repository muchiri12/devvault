"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./Button";
import { Card } from "./Card";
import { supabase } from "@/lib/supabaseClient";

const CONSENT_KEY = "devvault_cookie_consent_granular";
const CONSENT_VERSION = "1.1"; // Bumped version for the new granular system

const AUTH_ROUTES = ["/", "/login", "/register", "/forgot-password", "/reset-password", "/onboarding"];

interface ConsentState {
  necessary: boolean;
  analytical: boolean;
  marketing: boolean;
}

export function CookieBanner() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [preferences, setPreferences] = useState<ConsentState>({
    necessary: true, // Always true
    analytical: true,
    marketing: false,
  });

  useEffect(() => {
    async function checkAuthAndShow() {
      const { data: { user } } = await supabase.auth.getUser();
      
      // ONLY show auto-popup if user is logged in and not on an auth route
      if (!user) return;

      const savedConsent = localStorage.getItem(CONSENT_KEY);
      const savedVersion = localStorage.getItem(`${CONSENT_KEY}_version`);
      const isAuthRoute = AUTH_ROUTES.includes(pathname);

      if (savedConsent && savedVersion === CONSENT_VERSION) {
        setPreferences(JSON.parse(savedConsent));
      }

      if ((!savedConsent || savedVersion !== CONSENT_VERSION) && !isAuthRoute) {
        // Premium entrance delay for Logged-In Users
        const timer = setTimeout(() => setIsVisible(true), 2500);
        return () => clearTimeout(timer);
      }
    }

    const cleanupPromise = checkAuthAndShow();
    return () => {
      // Cleanup if timer was set
      cleanupPromise.then(cleanup => {
        if (typeof cleanup === 'function') cleanup();
      });
    };
  }, [pathname]);

  // 2. Global Event Listener for "Opting-In" again (Real-world compliance)
  useEffect(() => {
    const handleOpenPrivacy = () => {
      // Re-sync with latest saved state before opening
      const saved = localStorage.getItem(CONSENT_KEY);
      if (saved) setPreferences(JSON.parse(saved));
      
      setIsVisible(true);
      setIsModalOpen(true);
    };

    window.addEventListener("devvault:open-privacy", handleOpenPrivacy);
    return () => window.removeEventListener("devvault:open-privacy", handleOpenPrivacy);
  }, []);

  // 3. Real-time Hide on External Choice (e.g. from TrafficTable)
  useEffect(() => {
    const handleRemoteUpdate = () => {
      setIsVisible(false);
      setIsModalOpen(false);
    };

    window.addEventListener("devvault:consent-updated", handleRemoteUpdate);
    return () => window.removeEventListener("devvault:consent-updated", handleRemoteUpdate);
  }, []);

  const saveConsent = (state: ConsentState) => {
    localStorage.setItem(CONSENT_KEY, JSON.stringify(state));
    localStorage.setItem(`${CONSENT_KEY}_version`, CONSENT_VERSION);
    setPreferences(state); // Final state sync
    
    // Dispatch global event for real-time unblurring/sync
    window.dispatchEvent(new CustomEvent("devvault:consent-updated", { detail: state }));
    
    setIsVisible(false);
    setIsModalOpen(false);
  };

  const handleAcceptAll = () => {
    saveConsent({ necessary: true, analytical: true, marketing: true });
  };

  const handleRejectAll = () => {
    saveConsent({ necessary: true, analytical: false, marketing: false });
  };

  if (!isVisible) return null;

  return (
    <>
      {/* 1. COMPACT FLOATING BANNER */}
      <div className="fixed bottom-6 right-6 z-[100] w-[calc(100%-3rem)] sm:w-[320px] animate-in fade-in slide-in-from-bottom-10 duration-1000">
        <Card className="!p-4 bg-white/90 dark:bg-black/80 backdrop-blur-3xl border-gray-200/50 dark:border-white/10 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.3)] ring-1 ring-black/5 dark:ring-white/5 rounded-[2rem]">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-black dark:bg-white flex items-center justify-center shrink-0 shadow-lg">
                <svg className="w-4 h-4 text-white dark:text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-[10px] font-black text-gray-900 dark:text-white uppercase tracking-[0.2em]">Privacy Controls</h3>
            </div>

            <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium leading-relaxed px-1">
              Choose your privacy settings to continue exploring DevVault.
            </p>

            <div className="grid grid-cols-2 gap-2">
              <Button size="sm" onClick={handleAcceptAll} className="rounded-xl h-9 text-[10px] uppercase tracking-widest font-black shadow-lg shadow-black/5 transition-transform active:scale-95">
                Accept All
              </Button>
              <Button variant="secondary" size="sm" onClick={handleRejectAll} className="rounded-xl h-9 text-[10px] uppercase tracking-widest font-black border-gray-200/60 transition-transform active:scale-95">
                Reject All
              </Button>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-white/5 px-1">
              <button 
                onClick={() => setIsModalOpen(true)}
                className="text-[9px] uppercase font-bold tracking-widest text-gray-400 dark:text-gray-500 hover:text-black dark:hover:text-white transition-colors flex items-center gap-1.5 group"
              >
                <svg className="w-3 h-3 transition-transform group-hover:rotate-90 duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                Preferences
              </button>
              <Link 
                href="/privacy" 
                className="text-[9px] uppercase font-bold tracking-widest text-gray-400 dark:text-gray-500 hover:text-black dark:hover:text-white transition-colors"
              >
                Policy
              </Link>
            </div>
          </div>
        </Card>
      </div>

      {/* 2. PREFERENCES MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 sm:p-12 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-md" onClick={() => setIsModalOpen(false)} />
          <Card className="relative w-full max-w-lg p-8 sm:p-12 bg-white/95 dark:bg-[#0A0A0A]/95 rounded-[3rem] border-white/20 shadow-2xl overflow-hidden scale-in duration-500">
            <header className="mb-10 text-center sm:text-left">
              <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter mb-2">Cookie Preferences</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Control how your developer data and activity is processed.</p>
            </header>

            <div className="space-y-8 mb-12">
              {/* CATEGORY: NECESSARY */}
              <div className="flex items-center justify-between gap-6 pb-6 border-b border-gray-100 dark:border-white/5">
                <div>
                  <h4 className="text-[11px] font-black uppercase tracking-widest text-gray-900 dark:text-white mb-1">Strictly Necessary</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium leading-relaxed">Essential for authentication, security, and profile management.</p>
                </div>
                <div className="w-10 h-6 bg-black dark:bg-white rounded-full opacity-50 cursor-not-allowed flex items-center px-1">
                  <div className="w-4 h-4 bg-white dark:bg-black rounded-full translate-x-4" />
                </div>
              </div>

              {/* CATEGORY: ANALYTICAL */}
              <div className="flex items-center justify-between gap-6 pb-6 border-b border-gray-100 dark:border-white/5">
                <div>
                  <h4 className="text-[11px] font-black uppercase tracking-widest text-gray-900 dark:text-white mb-1">Analytical Insights</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium leading-relaxed">Used to track profile views and project interaction metrics.</p>
                </div>
                <button 
                  onClick={() => setPreferences((p: ConsentState) => ({...p, analytical: !p.analytical}))}
                  className={`w-12 h-7 rounded-full flex items-center px-1 transition-all duration-500 ${preferences.analytical ? 'bg-black dark:bg-white' : 'bg-gray-200 dark:bg-white/10'}`}
                >
                  <div className={`w-5 h-5 bg-white dark:bg-black rounded-full shadow-lg transition-transform duration-500 ${preferences.analytical ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>

              {/* CATEGORY: MARKETING */}
              <div className="flex items-center justify-between gap-6">
                <div>
                  <h4 className="text-[11px] font-black uppercase tracking-widest text-gray-900 dark:text-white mb-1">Marketing & Updates</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium leading-relaxed">Personalized recommendations and community announcements.</p>
                </div>
                <button 
                  onClick={() => setPreferences((p: ConsentState) => ({...p, marketing: !p.marketing}))}
                  className={`w-12 h-7 rounded-full flex items-center px-1 transition-all duration-500 ${preferences.marketing ? 'bg-black dark:bg-white' : 'bg-gray-200 dark:bg-white/10'}`}
                >
                  <div className={`w-5 h-5 bg-white dark:bg-black rounded-full shadow-lg transition-transform duration-500 ${preferences.marketing ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="flex-1 rounded-2xl h-14 uppercase tracking-widest font-black" onClick={() => saveConsent(preferences)}>
                Save My Choice
              </Button>
              <Button variant="ghost" className="flex-1 rounded-2xl h-14 uppercase tracking-widest font-black" onClick={() => setIsModalOpen(false)}>
                Go Back
              </Button>
            </div>
          </Card>
        </div>
      )}
    </>
  );
}
