"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient"; 
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if(error){
      setError(error.message);
      setIsLoading(false);
      return;
    }

    router.push("/dashboard");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#FAFAFA] dark:bg-[#050505] text-black dark:text-white relative z-0 px-4 sm:px-6 transition-colors duration-300">
      
      {/* Background soft linear gradient (Tailwind v4 compatible) */}
      <div className="absolute inset-0 z-[-1] bg-linear-to-b from-white dark:from-[#0A0A0A] via-[#FAFAFA] dark:via-[#050505] to-[#F2F2F2] dark:to-[#000000] transition-colors duration-300" />

      <div className="w-full max-w-md relative z-10 text-center sm:text-left">
        <form
          onSubmit={handleLogin}
          className="p-8 sm:p-12 bg-white/70 dark:bg-black/40 backdrop-blur-3xl border border-gray-200/50 dark:border-white/5 rounded-[2.5rem] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] space-y-8 transition-all"
        >
          <div className="flex flex-col items-center text-center space-y-4">
            {/* Minimalist Logo */}
            <div className="w-12 h-12 bg-black dark:bg-white rounded-2xl flex items-center justify-center shadow-lg transform transition-transform hover:scale-105 duration-300">
              <div className="w-4 h-4 bg-white dark:bg-black rounded-sm rotate-45" />
            </div>

            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                Welcome back
              </h1>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Enter your details to sign in
              </p>
            </div>
          </div>

          {error && (
            <div className="p-4 text-sm font-medium text-black dark:text-white bg-gray-100 dark:bg-white/5 border-l-4 border-black dark:border-white rounded-r-xl">
              {error}
            </div>
          )}

          <div className="space-y-5 text-left">
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

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-bold text-gray-900 dark:text-gray-400 uppercase tracking-wider">Password</label>
              </div>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full bg-gray-50/50 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 rounded-xl p-4 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 outline-none transition-all duration-300 hover:bg-white dark:hover:bg-white/10 focus:bg-white dark:focus:bg-white/10 focus:border-black dark:focus:border-white focus:ring-1 focus:ring-black dark:focus:ring-white shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button 
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 relative group overflow-hidden bg-black dark:bg-white text-white dark:text-black font-bold text-[15px] p-4 rounded-xl transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_5px_15px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_25px_rgba(0,0,0,0.15)] active:scale-[0.98]"
          >
            {/* Hover shine effect */}
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 dark:via-black/10 to-transparent group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
            
            <span className="relative z-10 flex items-center justify-center gap-2 tracking-wide">
              {isLoading ? "Signing in..." : "Sign In"}
              {!isLoading && (
                <svg className="w-4 h-4 opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              )}
            </span>
          </button>

          <p className="text-center text-sm font-medium text-gray-500 dark:text-gray-400">
            Don't have an account?{" "}
            <button 
              type="button"
              onClick={() => router.push("/register")}
              className="text-black dark:text-white font-extrabold hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200 focus:outline-none px-1 py-0.5 rounded focus:ring-2 focus:ring-gray-200 dark:focus:ring-white/20"
            >
              Sign up
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}