"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface StrengthResult {
  score: number;
  label: string;
  color: string;
  checks: {
    length: boolean;
    uppercase: boolean;
    number: boolean;
    special: boolean;
  };
}

function checkPasswordStrength(password: string): StrengthResult {
  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
  };
  const score = Object.values(checks).filter(Boolean).length;
  const labels = ["", "Weak", "Fair", "Strong", "Very Strong"];
  const colors = ["", "text-red-500", "text-orange-400", "text-emerald-500", "text-emerald-600"];
  return { score, label: labels[score] || "", color: colors[score] || "", checks };
}

const barColors = ["bg-red-500", "bg-orange-400", "bg-emerald-500", "bg-emerald-500"];

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [isVerifying, setIsVerifying] = useState(true);
  const [hasSession, setHasSession] = useState(false);

  const strength = checkPasswordStrength(password);
  const isPasswordStrong = strength.score >= 3;

  // 1. Verify session on mount
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setHasSession(!!session);
      setIsVerifying(false);
    };
    checkSession();
  }, []);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPasswordStrong) {
      setError("Please choose a stronger password.");
      return;
    }
    setIsLoading(true);
    setError("");

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError(error.message);
      setIsLoading(false);
      return;
    }

    setSuccess(true);
    setTimeout(() => router.push("/dashboard"), 2500);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#FAFAFA] dark:bg-[#050505] text-black dark:text-white relative z-0 px-4 sm:px-6 transition-colors duration-300">
      <div className="absolute inset-0 z-[-1] bg-linear-to-b from-white dark:from-[#0A0A0A] via-[#FAFAFA] dark:via-[#050505] to-[#F2F2F2] dark:to-[#000000] transition-colors duration-300" />

      <div className="w-full max-w-md relative z-10">
        <div className="p-8 sm:p-12 bg-white/70 dark:bg-black/40 backdrop-blur-3xl border border-gray-200/50 dark:border-white/5 rounded-[2.5rem] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] transition-all">

          {/* Logo + title */}
          <div className="flex flex-col items-center text-center space-y-4 mb-8">
            <div className="w-12 h-12 bg-black dark:bg-white rounded-2xl flex items-center justify-center shadow-lg">
              <div className="w-4 h-4 bg-white dark:bg-black rounded-sm rotate-45" />
            </div>
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                Set new password
              </h1>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {success ? "Password updated! Redirecting..." : "Choose a strong password for your account."}
              </p>
            </div>
          </div>

          {isVerifying ? (
            <div className="flex flex-col items-center gap-4 text-center py-8">
              <div className="w-10 h-10 border-4 border-black/10 dark:border-white/10 border-t-black dark:border-t-white rounded-full animate-spin" />
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Verifying your link...</p>
            </div>
          ) : !hasSession ? (
            <div className="flex flex-col items-center gap-6 text-center">
              <div className="w-16 h-16 bg-red-50 dark:bg-red-500/10 rounded-2xl flex items-center justify-center border border-red-100 dark:border-red-500/20">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-bold text-gray-900 dark:text-white">Invalid or Expired Link</p>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  This reset link is either missing, has already been used, or has expired.
                </p>
              </div>
              <Link
                href="/forgot-password"
                className="w-full bg-black dark:bg-white text-white dark:text-black font-bold text-sm p-4 rounded-xl transition-all hover:bg-gray-800 dark:hover:bg-gray-100 text-center"
              >
                Request New Link
              </Link>
            </div>
          ) : success ? (
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl flex items-center justify-center border border-emerald-100 dark:border-emerald-500/20">
                <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Your password has been updated successfully. Taking you to your dashboard...
              </p>
            </div>
          ) : (
            <form onSubmit={handleReset} className="space-y-6">
              {error && (
                <div className="p-4 text-sm font-medium text-black dark:text-white bg-gray-100 dark:bg-white/5 border-l-4 border-black dark:border-white rounded-r-xl">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-900 dark:text-gray-400 uppercase tracking-wider ml-1 block">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full bg-gray-50/50 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 rounded-xl p-4 pr-12 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 outline-none transition-all duration-300 hover:bg-white dark:hover:bg-white/10 focus:bg-white dark:focus:bg-white/10 focus:border-black dark:focus:border-white focus:ring-1 focus:ring-black dark:focus:ring-white shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors duration-200 cursor-pointer"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>

                {password.length > 0 && (
                  <div className="space-y-2 pt-1">
                    <div className="flex gap-1.5">
                      {[0, 1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                            i < strength.score ? barColors[strength.score - 1] || "bg-emerald-500" : "bg-gray-200 dark:bg-white/10"
                          }`}
                        />
                      ))}
                    </div>
                    <span className={`text-xs font-bold transition-colors duration-200 ${strength.color}`}>
                      {strength.label}
                    </span>
                    <ul className="grid grid-cols-2 gap-x-4 gap-y-1">
                      {[
                        { key: "length", label: "8+ characters" },
                        { key: "uppercase", label: "Uppercase letter" },
                        { key: "number", label: "Number" },
                        { key: "special", label: "Special character" },
                      ].map(({ key, label }) => (
                        <li key={key} className={`flex items-center gap-1.5 text-xs font-medium transition-colors duration-200 ${
                          strength.checks[key as keyof typeof strength.checks] ? "text-emerald-500" : "text-gray-400 dark:text-gray-500"
                        }`}>
                          <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {strength.checks[key as keyof typeof strength.checks] ? (
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                            ) : (
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            )}
                          </svg>
                          {label}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading || !isPasswordStrong}
                className="w-full flex items-center justify-center gap-3 relative group overflow-hidden bg-black dark:bg-white text-white dark:text-black font-bold text-[15px] p-4 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_5px_15px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_25px_rgba(0,0,0,0.15)] active:scale-[0.98]"
              >
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 dark:via-black/10 to-transparent group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
                <span className="relative z-10 tracking-wide">
                  {isLoading ? "Updating..." : "Update Password"}
                </span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
