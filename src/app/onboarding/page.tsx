"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function OnboardingPage() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);

    // Grab the user ID as soon as they land here after signup
    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUserId(user.id);
            } else {
                router.push("/register"); // Kick them back if they bypassed signup
            }
        };
        fetchUser();
    }, [router]);

    const handleClaim = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userId) return; // Safety check

        setIsLoading(true);
        setError("");

        const cleanUsername = username.toLowerCase().trim();

        if (!cleanUsername) {
            setError("Username is required");
            setIsLoading(false);
            return;
        }

        const isValid = /^[a-z0-9_]{3,20}$/.test(cleanUsername);
        if (!isValid) {
            setError("Username must be 3-20 characters, lowercase letters, numbers, or underscores.");
            setIsLoading(false);
            return;
        }

        // 1. Check if username is already taken
        const { data: existing } = await supabase
            .from("profiles")
            .select("id")
            .eq("username", cleanUsername)
            .maybeSingle();

        if (existing) {
            setError("That username is already taken by another developer!");
            setIsLoading(false);
            return;
        }

        // 2. Create or update the profile row in the database
        const { error: insertError } = await supabase
            .from("profiles")
            .upsert({
                id: userId,
                username: cleanUsername,
            });

        if (insertError) {
            console.error("Profile error:", insertError);
            setError("Failed to claim username. Please try again.");
            setIsLoading(false);
            return;
        }

        // 3. Unlock the dashboard
        router.push("/dashboard/projects");
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-[#FAFAFA] dark:bg-[#050505] text-black dark:text-white relative z-0 px-4 sm:px-6 transition-colors duration-300">

            {/* Background soft linear gradient (Tailwind v4 compatible) */}
            <div className="absolute inset-0 z-[-1] bg-linear-to-b from-white dark:from-[#0A0A0A] via-[#FAFAFA] dark:via-[#050505] to-[#F2F2F2] dark:to-[#000000] transition-colors duration-300" />

            <div className="w-full max-w-md relative z-10 text-center sm:text-left">
                <form
                    onSubmit={handleClaim}
                    className="p-8 sm:p-12 bg-white/70 dark:bg-black/40 backdrop-blur-3xl border border-gray-200/50 dark:border-white/5 rounded-[2.5rem] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] space-y-8 transition-all"
                >
                    <div className="flex flex-col items-center text-center space-y-4">
                        {/* Minimalist Logo */}
                        <div className="w-12 h-12 bg-black dark:bg-white rounded-2xl flex items-center justify-center shadow-lg transform transition-transform hover:scale-105 duration-300">
                            <div className="w-4 h-4 bg-white dark:bg-black rounded-sm rotate-45" />
                        </div>

                        <div className="space-y-1">
                            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                                Claim your URL
                            </h1>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 leading-relaxed">
                                Choose a unique username for your public developer portfolio.
                            </p>
                        </div>
                    </div>

                    {error && (
                        <div className="p-4 text-sm font-medium text-black dark:text-white bg-gray-100 dark:bg-white/5 border-l-4 border-black dark:border-white rounded-r-xl">
                            {error}
                        </div>
                    )}

                    <div className="space-y-2 text-left">
                        <label className="text-xs font-bold text-gray-900 dark:text-gray-400 uppercase tracking-wider ml-1">Public Username</label>
                        <div className="flex items-center w-full bg-gray-50/50 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 rounded-xl overflow-hidden shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] transition-all duration-300 focus-within:bg-white dark:focus-within:bg-white/10 focus-within:border-black dark:focus-within:border-white focus-within:ring-1 focus-within:ring-black dark:focus-within:ring-white">
                            <span className="pl-4 py-4 text-gray-400 dark:text-gray-500 font-medium select-none text-sm sm:text-base">
                                devvault.com/u/
                            </span>
                            <input
                                type="text"
                                placeholder="dennis_dev"
                                className="w-full bg-transparent pr-4 py-4 outline-none text-gray-900 dark:text-white font-bold text-sm sm:text-base placeholder-gray-400 dark:placeholder-gray-600"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <button
                        disabled={isLoading || !username}
                        className="w-full flex items-center justify-center gap-3 relative group overflow-hidden bg-black dark:bg-white text-white dark:text-black font-bold text-[15px] p-4 rounded-xl transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_5px_15px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_25px_rgba(0,0,0,0.15)] active:scale-[0.98] mt-4"
                    >
                        {/* Hover shine effect */}
                        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 dark:via-black/10 to-transparent group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />

                        <span className="relative z-10 flex items-center justify-center gap-2 tracking-wide">
                            {isLoading ? "Setting up portfolio..." : "Complete Setup"}
                            {!isLoading && (
                                <svg className="w-4 h-4 opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                            )}
                        </span>
                    </button>

                </form>
            </div>
        </div>
    );
}