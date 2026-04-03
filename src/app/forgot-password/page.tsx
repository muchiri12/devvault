"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      setError(error.message);
      setIsLoading(false);
      return;
    }

    setSent(true);
    setIsLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#FAFAFA] dark:bg-[#050505] text-black dark:text-white relative z-0 px-4 sm:px-6 transition-colors duration-300">

      {/* Background gradient */}
      <div className="absolute inset-0 z-[-1] bg-linear-to-b from-white dark:from-[#0A0A0A] via-[#FAFAFA] dark:via-[#050505] to-[#F2F2F2] dark:to-[#000000] transition-colors duration-300" />

      <div className="w-full max-w-md relative z-10">
        <div className="p-8 sm:p-12 bg-white/70 dark:bg-black/40 backdrop-blur-3xl border border-gray-200/50 dark:border-white/5 rounded-[2.5rem] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] transition-all">

          {/* Logo */}
          <div className="flex flex-col items-center text-center space-y-4 mb-8">
            <div className="w-12 h-12 bg-black dark:bg-white rounded-2xl flex items-center justify-center shadow-lg">
              <div className="w-4 h-4 bg-white dark:bg-black rounded-sm rotate-45" />
            </div>
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                Reset password
              </h1>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {sent
                  ? "Check your email for a reset link."
                  : "Enter your email and we'll send you a reset link."}
              </p>
            </div>
          </div>

          {sent ? (
            /* Success state */
            <div className="space-y-6 text-center">
              <div className="w-16 h-16 mx-auto bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl flex items-center justify-center border border-emerald-100 dark:border-emerald-500/20">
                <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium leading-relaxed">
                We sent a reset link to <span className="font-bold text-black dark:text-white">{email}</span>. 
                It may take a few minutes to arrive. Check your spam folder if you don&apos;t see it.
              </p>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors duration-200"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Sign In
              </Link>
            </div>
          ) : (
            /* Form state */
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 text-sm font-medium text-black dark:text-white bg-gray-100 dark:bg-white/5 border-l-4 border-black dark:border-white rounded-r-xl">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-900 dark:text-gray-400 uppercase tracking-wider ml-1 block">
                  Email address
                </label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-gray-50/50 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 rounded-xl p-4 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 outline-none transition-all duration-300 hover:bg-white dark:hover:bg-white/10 focus:bg-white dark:focus:bg-white/10 focus:border-black dark:focus:border-white focus:ring-1 focus:ring-black dark:focus:ring-white shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading || !email}
                className="w-full flex items-center justify-center gap-3 relative group overflow-hidden bg-black dark:bg-white text-white dark:text-black font-bold text-[15px] p-4 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_5px_15px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_25px_rgba(0,0,0,0.15)] active:scale-[0.98]"
              >
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 dark:via-black/10 to-transparent group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
                <span className="relative z-10 tracking-wide">
                  {isLoading ? "Sending..." : "Send Reset Link"}
                </span>
              </button>

              <p className="text-center text-sm font-medium text-gray-500 dark:text-gray-400">
                Remember your password?{" "}
                <Link href="/login" className="text-black dark:text-white font-extrabold hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200">
                  Sign in
                </Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
