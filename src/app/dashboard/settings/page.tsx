"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import DeleteAccountButton from "@/components/DeleteAccountButton";

// ---- password strength ----
interface StrengthResult {
  score: number;
  label: string;
  color: string;
  checks: { length: boolean; uppercase: boolean; number: boolean; special: boolean; };
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

const BAR_COLORS = ["bg-red-500", "bg-orange-400", "bg-emerald-500", "bg-emerald-500"];

// ---- days since a date ----
function daysSince(dateStr: string | null | undefined): number | null {
  if (!dateStr) return null;
  return Math.floor((Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24));
}

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isUpdatingEmail, setIsUpdatingEmail] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [emailMessage, setEmailMessage] = useState({ type: "", text: "" });
  const [passwordMessage, setPasswordMessage] = useState({ type: "", text: "" });

  // password tracking
  const [passwordLastChanged, setPasswordLastChanged] = useState<string | null>(null);
  const [bannerDismissed, setBannerDismissed] = useState(false);

  const strength = checkPasswordStrength(newPassword);
  const isPasswordStrong = strength.score >= 3;

  useEffect(() => {
    const frameId = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frameId);
  }, []);

  // load password_last_changed from profile
  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: profile } = await supabase
        .from("profiles")
        .select("password_last_changed")
        .eq("id", user.id)
        .single();
      if (profile) setPasswordLastChanged(profile.password_last_changed ?? null);
    };
    fetchProfile();
  }, []);

  // -- security banner logic --
  const dayCount = daysSince(passwordLastChanged);
  const showSecurityBanner =
    !bannerDismissed && passwordLastChanged === null;

  // --- update email ---
  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingEmail(true);
    setEmailMessage({ type: "", text: "" });
    const { error } = await supabase.auth.updateUser({ email: newEmail });
    if (error) {
      setEmailMessage({ type: "error", text: error.message });
    } else {
      setEmailMessage({
        type: "success",
        text: "Success! Check both your old and new email inboxes for confirmation links.",
      });
      setNewEmail("");
    }
    setIsUpdatingEmail(false);
  };

  // --- update password ---
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPasswordStrong) {
      setPasswordMessage({ type: "error", text: "Please choose a stronger password." });
      return;
    }
    setIsUpdatingPassword(true);
    setPasswordMessage({ type: "", text: "" });

    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.email) {
      setPasswordMessage({ type: "error", text: "Could not verify user." });
      setIsUpdatingPassword(false);
      return;
    }

    // verify current password first
    const { error: verifyError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: currentPassword,
    });
    if (verifyError) {
      setPasswordMessage({ type: "error", text: "Incorrect current password." });
      setIsUpdatingPassword(false);
      return;
    }

    // update to new password
    const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });
    if (updateError) {
      setPasswordMessage({ type: "error", text: updateError.message });
    } else {
      // update password_last_changed in profiles table
      const now = new Date().toISOString();
      await supabase.from("profiles").update({ password_last_changed: now }).eq("id", user.id);
      setPasswordLastChanged(now);

      setPasswordMessage({ type: "success", text: "Password updated successfully!" });
      setCurrentPassword("");
      setNewPassword("");
    }
    setIsUpdatingPassword(false);
  };

  if (!mounted) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-gray-500 font-medium animate-pulse">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto dark:text-white">
      <div className="max-w-2xl mx-auto">

        <div className="mb-10 text-center sm:text-left">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Settings
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-3 text-lg font-medium">Manage your account preferences.</p>
        </div>

        {/* Security banner */}
        {showSecurityBanner && (
          <div className="mb-8 flex items-start gap-4 p-5 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-2xl">
            <div className="shrink-0 w-9 h-9 flex items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-500/20 mt-0.5">
              <svg className="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-amber-800 dark:text-amber-300 mb-0.5">
                {passwordLastChanged === null ? "Password never updated" : `Password last changed ${dayCount} days ago`}
              </p>
              <p className="text-xs font-medium text-amber-700/80 dark:text-amber-400/80">
                For your security, we recommend updating your password regularly. Use a strong, unique password.
              </p>
            </div>
            <button
              onClick={() => setBannerDismissed(true)}
              className="shrink-0 text-amber-500 hover:text-amber-700 dark:hover:text-amber-300 transition-colors cursor-pointer mt-0.5"
              aria-label="Dismiss"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        <div className="space-y-8">

          {/* 1. Dark Mode Toggle */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200/60 dark:border-gray-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2rem] p-8 sm:p-10 transition-colors">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 border-b border-gray-100 dark:border-gray-800 pb-4">Appearance</h2>

            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-4">Theme Preference</label>
            <div className="grid grid-cols-3 gap-4 mb-2">
              <button
                onClick={() => setTheme("light")}
                className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-200 cursor-pointer ${theme === "light" ? "border-black dark:border-white bg-gray-50 dark:bg-gray-800 shadow-sm" : "border-gray-100 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-600"}`}
              >
                <svg className="w-6 h-6 mb-2 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Light</span>
              </button>

              <button
                onClick={() => setTheme("dark")}
                className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-200 cursor-pointer ${theme === "dark" ? "border-black dark:border-white bg-gray-50 dark:bg-gray-800 shadow-sm" : "border-gray-100 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-600"}`}
              >
                <svg className="w-6 h-6 mb-2 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Dark</span>
              </button>

              <button
                onClick={() => setTheme("system")}
                className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-200 cursor-pointer ${theme === "system" ? "border-black dark:border-white bg-gray-50 dark:bg-gray-800 shadow-sm" : "border-gray-100 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-600"}`}
              >
                <svg className="w-6 h-6 mb-2 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                <span className="text-xs font-bold text-gray-700 dark:text-gray-300">System</span>
              </button>
            </div>
          </div>

          {/* 2. Security */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200/60 dark:border-gray-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2rem] p-8 sm:p-10 transition-colors">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 border-b border-gray-100 dark:border-gray-800 pb-4">
              Security
            </h2>

            <div className="space-y-10">

              {/* Change Email Form */}
              <form onSubmit={handleUpdateEmail} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider ml-1 block mb-2">Change Email Address</label>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="email"
                      required
                      placeholder="Enter new email"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      className="w-full sm:max-w-md bg-gray-50/50 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 rounded-xl p-3.5 outline-none focus:border-black dark:focus:border-white focus:ring-1 focus:ring-black dark:focus:ring-white transition-all text-gray-900 dark:text-white shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] placeholder-gray-400 dark:placeholder-gray-500"
                    />
                    <button
                      type="submit"
                      disabled={isUpdatingEmail || !newEmail}
                      className="px-6 py-3.5 bg-black dark:bg-white text-white dark:text-black font-bold rounded-xl hover:bg-gray-900 dark:hover:bg-gray-200 disabled:opacity-50 transition-colors whitespace-nowrap active:scale-95 shadow-sm cursor-pointer"
                    >
                      {isUpdatingEmail ? "Updating..." : "Update Email"}
                    </button>
                  </div>
                  {emailMessage.text && (
                    <p className={`mt-3 text-sm font-medium ml-1 flex items-center gap-1.5 ${emailMessage.type === "error" ? "text-red-500" : "text-emerald-500"}`}>
                      {emailMessage.type === "error" ? (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      )}
                      {emailMessage.text}
                    </p>
                  )}
                </div>
              </form>

              {/* Change Password Form */}
              <form onSubmit={handleUpdatePassword} className="space-y-4 pt-6 border-t border-gray-100 dark:border-white/5">
                <div>
                  <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider ml-1 block mb-4">Change Password</label>

                  <div className="flex flex-col gap-3">
                    {/* Current password */}
                    <div className="relative">
                      <input
                        type={showCurrentPassword ? "text" : "password"}
                        required
                        placeholder="Current password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full sm:max-w-md bg-gray-50/50 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 rounded-xl p-3.5 pr-12 outline-none focus:border-black dark:focus:border-white focus:ring-1 focus:ring-black dark:focus:ring-white transition-all text-gray-900 dark:text-white shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] placeholder-gray-400 dark:placeholder-gray-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors duration-200 cursor-pointer sm:right-4"
                        style={{ right: "1rem" }}
                        aria-label={showCurrentPassword ? "Hide password" : "Show password"}
                      >
                        {showCurrentPassword ? (
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

                    {/* New password + strength meter */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="flex-1 sm:max-w-md space-y-2">
                        <div className="relative">
                          <input
                            type={showNewPassword ? "text" : "password"}
                            required
                            placeholder="New password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full bg-gray-50/50 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 rounded-xl p-3.5 pr-12 outline-none focus:border-black dark:focus:border-white focus:ring-1 focus:ring-black dark:focus:ring-white transition-all text-gray-900 dark:text-white shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] placeholder-gray-400 dark:placeholder-gray-500"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors duration-200 cursor-pointer"
                            aria-label={showNewPassword ? "Hide password" : "Show password"}
                          >
                            {showNewPassword ? (
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

                        {/* Strength meter */}
                        {newPassword.length > 0 && (
                          <div className="space-y-1.5">
                            <div className="flex gap-1.5">
                              {[0, 1, 2, 3].map((i) => (
                                <div
                                  key={i}
                                  className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                                    i < strength.score ? (BAR_COLORS[strength.score - 1] || "bg-emerald-500") : "bg-gray-200 dark:bg-white/10"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className={`text-xs font-bold ${strength.color}`}>{strength.label}</span>
                          </div>
                        )}
                      </div>

                      <button
                        type="submit"
                        disabled={isUpdatingPassword || !newPassword || !currentPassword || !isPasswordStrong}
                        className="px-6 py-3.5 bg-black dark:bg-white text-white dark:text-black font-bold rounded-xl hover:bg-gray-800 dark:hover:bg-gray-200 disabled:opacity-50 transition-colors whitespace-nowrap active:scale-95 shadow-sm w-full sm:w-auto cursor-pointer self-start"
                      >
                        {isUpdatingPassword ? "Updating..." : "Update Password"}
                      </button>
                    </div>
                  </div>

                  {passwordMessage.text && (
                    <p className={`mt-3 text-sm font-medium ml-1 flex items-center gap-1.5 ${passwordMessage.type === "error" ? "text-red-500" : "text-emerald-500"}`}>
                      {passwordMessage.type === "error" ? (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      )}
                      {passwordMessage.text}
                    </p>
                  )}
                </div>
              </form>

            </div>
          </div>

          {/* 3. Delete account */}
          <div className="bg-red-50/40 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 p-8 sm:p-10 rounded-[2rem]">
            <h3 className="text-xl font-bold text-red-800 dark:text-red-500 mb-2">Account Management</h3>
            <p className="text-red-600/80 dark:text-red-400/80 mb-6 text-sm font-medium leading-relaxed max-w-lg">
              Permanently remove your account, portfolio, and all case studies. This action cannot be reversed.
            </p>
            <DeleteAccountButton />
          </div>

        </div>
      </div>
    </div>
  );
}