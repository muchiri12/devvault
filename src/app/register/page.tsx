"use client";

import { useState, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import Link from "next/link";

// ---- password strength logic ----
interface StrengthResult {
  score: number; // 0-4
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

const barColors = [
  "bg-gray-200 dark:bg-white/10",
  "bg-red-500",
  "bg-orange-400",
  "bg-emerald-500",
  "bg-emerald-500",
];

import { LegalLinks } from "@/components/shared/LegalLinks";

export default function RegisterPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const strength = checkPasswordStrength(password);
  const isPasswordStrong = strength.score >= 3;

  const handleRegister = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPasswordStrong) {
      setError("Please choose a stronger password before continuing.");
      return;
    }
    if (!agreedToTerms) {
      setError("You must agree to the Terms of Service to create an account.");
      return;
    }
    setIsLoading(true);
    setError("");

    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error || !data.user) {
      setError(error?.message || "Signup failed");
      setIsLoading(false);
      return;
    }

    // Mark password as set now — so new users don't see the "never changed" security banner
    await supabase.from("profiles").update({
      password_last_changed: new Date().toISOString()
    }).eq("id", data.user.id);

    router.push("/onboarding");
  }, [email, password, isPasswordStrong, agreedToTerms, router]);

  const handleGoogleSignup = async () => {
    setIsGoogleLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      setError(error.message);
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#FAFAFA] dark:bg-[#050505] text-black dark:text-white relative z-0 px-4 sm:px-6 transition-colors duration-300">

      {/* Background soft linear gradient */}
      <div className="absolute inset-0 z-[-1] bg-linear-to-b from-white dark:from-[#0A0A0A] via-[#FAFAFA] dark:via-[#050505] to-[#F2F2F2] dark:to-[#000000] transition-colors duration-300" />

      <div className="w-full max-w-md relative z-10 text-center sm:text-left">
        <form
          onSubmit={handleRegister}
          className="p-8 sm:p-12 bg-white/70 dark:bg-black/40 backdrop-blur-3xl border border-gray-200/50 dark:border-white/5 rounded-[2.5rem] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] space-y-7 transition-all"
        >
          <div className="flex flex-col items-center text-center space-y-4">
            {/* Minimalist Logo */}
            <div className="w-12 h-12 bg-black dark:bg-white rounded-2xl flex items-center justify-center shadow-lg transform transition-transform hover:scale-105 duration-300">
              <div className="w-4 h-4 bg-white dark:bg-black rounded-sm rotate-45" />
            </div>

            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                Create an account
              </h1>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Enter your details to get started
              </p>
            </div>
          </div>

          {error && (
            <div className="p-4 text-sm font-medium text-black dark:text-white bg-gray-100 dark:bg-white/5 border-l-4 border-black dark:border-white rounded-r-xl">
              {error}
            </div>
          )}

          {/* Google OAuth Button */}
          <button
            type="button"
            onClick={handleGoogleSignup}
            disabled={isGoogleLoading}
            className="w-full flex items-center justify-center gap-3 bg-white dark:bg-white/5 border border-gray-200/80 dark:border-white/10 text-gray-700 dark:text-gray-300 font-bold text-[15px] p-4 rounded-xl transition-all duration-300 hover:bg-gray-50 dark:hover:bg-white/10 hover:border-gray-300 dark:hover:border-white/20 hover:shadow-md active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
          >
            {isGoogleLoading ? (
              <span className="tracking-wide">Connecting...</span>
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                <span className="tracking-wide">Continue with Google</span>
              </>
            )}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-gray-200 dark:bg-white/10" />
            <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">or</span>
            <div className="flex-1 h-px bg-gray-200 dark:bg-white/10" />
          </div>

          <div className="space-y-5 text-left">
            {/* Email */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-900 dark:text-gray-400 uppercase tracking-wider ml-1">Email</label>
              <input
                type="email"
                placeholder="name@example.com"
                className="w-full bg-gray-50/50 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 rounded-xl p-4 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 outline-none transition-all duration-300 hover:bg-white dark:hover:bg-white/10 focus:bg-white dark:focus:bg-white/10 focus:border-black dark:focus:border-white focus:ring-1 focus:ring-black dark:focus:ring-white shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password + Strength */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-900 dark:text-gray-400 uppercase tracking-wider ml-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full bg-gray-50/50 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 rounded-xl p-4 pr-12 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 outline-none transition-all duration-300 hover:bg-white dark:hover:bg-white/10 focus:bg-white dark:focus:bg-white/10 focus:border-black dark:focus:border-white focus:ring-1 focus:ring-black dark:focus:ring-white shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]"
                  onChange={(e) => setPassword(e.target.value)}
                  required
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

              {/* Strength meter — only show if user started typing */}
              {password.length > 0 && (
                <div className="space-y-2 pt-1">
                  {/* Bars */}
                  <div className="flex gap-1.5">
                    {[0, 1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                          i < strength.score ? barColors[strength.score] : "bg-gray-200 dark:bg-white/10"
                        }`}
                      />
                    ))}
                  </div>
                  {/* Label + requirements */}
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold transition-colors duration-200 ${strength.color}`}>
                      {strength.label}
                    </span>
                  </div>
                  <ul className="grid grid-cols-2 gap-x-4 gap-y-1 mt-1">
                    {[
                      { key: "length", label: "8+ characters" },
                      { key: "uppercase", label: "Uppercase letter" },
                      { key: "number", label: "Number" },
                      { key: "special", label: "Special character" },
                    ].map(({ key, label }) => (
                      <li key={key} className={`flex items-center gap-1.5 text-xs font-medium transition-colors duration-200 ${
                        strength.checks[key as keyof typeof strength.checks]
                          ? "text-emerald-500"
                          : "text-gray-400 dark:text-gray-500"
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
          </div>

          {/* Terms of Service Checkbox */}
          <label className="flex items-start gap-3 cursor-pointer group">
            <div className="relative mt-0.5 shrink-0">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="sr-only peer"
              />
              <div className={`w-5 h-5 rounded-md border-2 transition-all duration-200 flex items-center justify-center ${
                agreedToTerms
                  ? "bg-black dark:bg-white border-black dark:border-white"
                  : "border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 group-hover:border-gray-400 dark:group-hover:border-white/40"
              }`}>
                {agreedToTerms && (
                  <svg className="w-3 h-3 text-white dark:text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </div>
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 leading-relaxed">
              I agree to the{" "}
              <Link href="/terms" className="text-black dark:text-white font-bold underline underline-offset-2 hover:no-underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-black dark:text-white font-bold underline underline-offset-2 hover:no-underline">
                Privacy Policy
              </Link>
            </span>
          </label>

          <button
            disabled={isLoading || !agreedToTerms || !isPasswordStrong}
            className="w-full flex items-center justify-center gap-3 relative group overflow-hidden bg-black dark:bg-white text-white dark:text-black font-bold text-[15px] p-4 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_5px_15px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_25px_rgba(0,0,0,0.15)] active:scale-[0.98]"
          >
            {/* Hover shine effect */}
            <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/20 dark:via-black/10 to-transparent group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />

            <span className="relative z-10 flex items-center justify-center gap-2 tracking-wide">
              {isLoading ? "Creating account..." : "Continue to Setup"}
              {!isLoading && (
                <svg className="w-4 h-4 opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              )}
            </span>
          </button>

          <p className="text-center text-sm font-medium text-gray-500 dark:text-gray-400">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => router.push("/login")}
              className="text-black dark:text-white font-extrabold hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200 focus:outline-none px-1 py-0.5 rounded focus:ring-2 focus:ring-gray-200 dark:focus:ring-white/20"
            >
              Log in
            </button>
          </p>
        </form>

        <footer className="mt-10">
          <LegalLinks />
        </footer>
      </div>
    </div>
  );
}