"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import DeleteAccountButton from "@/components/DeleteAccountButton";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  
  const [currentPassword, setCurrentPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isUpdatingEmail, setIsUpdatingEmail] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [emailMessage, setEmailMessage] = useState({ type: "", text: "" });
  const [passwordMessage, setPasswordMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    const frameId = requestAnimationFrame(() => {
      setMounted(true);
    });
    return () => cancelAnimationFrame(frameId);
  }, []);

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
        text: "Success! Check both your old and new email inboxes for confirmation links."
      });
      setNewEmail("");
    }
    setIsUpdatingEmail(false);
  };

  // --- UPdate password ---
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingPassword(true);
    setPasswordMessage({ type: "", text: "" });

    // 1. Get the current user's email
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user?.email) {
      setPasswordMessage({ type: "error", text: "Could not verify user." });
      setIsUpdatingPassword(false);
      return;
    }

    // 2. Verify the CURRENT password by attempting to sign in
    const { error: verifyError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: currentPassword,
    });

    if (verifyError) {
      setPasswordMessage({ type: "error", text: "Incorrect current password." });
      setIsUpdatingPassword(false);
      return;
    }

    // 3. If verification passes, update to the NEW password
    const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });

    if (updateError) {
      setPasswordMessage({ type: "error", text: updateError.message });
    } else {
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

        <div className="space-y-8">

          {/* 1. Dark Mode Toggle */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200/60 dark:border-gray-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-4xl8 sm:p-10 transition-colors">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 border-b border-gray-100 dark:border-gray-800 pb-4">Appearance</h2>

            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-4">Theme Preference</label>
            <div className="grid grid-cols-3 gap-4 mb-2">

              <button
                onClick={() => setTheme("light")}
                className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-200 cursor-pointer ${theme === "light"
                  ? "border-black dark:border-white bg-gray-50 dark:bg-gray-800 shadow-sm"
                  : "border-gray-100 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-600"
                  }`}
              >
                <svg className="w-6 h-6 mb-2 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Light</span>
              </button>

              <button
                onClick={() => setTheme("dark")}
                className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-200 cursor-pointer ${theme === "dark"
                  ? "border-black dark:border-white bg-gray-50 dark:bg-gray-800 shadow-sm"
                  : "border-gray-100 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-600"
                  }`}
              >
                <svg className="w-6 h-6 mb-2 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Dark</span>
              </button>

              <button
                onClick={() => setTheme("system")}
                className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-200 cursor-pointer ${theme === "system"
                  ? "border-black dark:border-white bg-gray-50 dark:bg-gray-800 shadow-sm"
                  : "border-gray-100 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-600"
                  }`}
              >
                <svg className="w-6 h-6 mb-2 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                <span className="text-xs font-bold text-gray-700 dark:text-gray-300">System</span>
              </button>

            </div>
          </div>

          {/* 2. Security */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200/60 dark:border-gray-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-4xl p-8 sm:p-10 transition-colors">
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
                    <input
                      type="password"
                      required
                      placeholder="Current password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full sm:max-w-md bg-gray-50/50 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 rounded-xl p-3.5 outline-none focus:border-black dark:focus:border-white focus:ring-1 focus:ring-black dark:focus:ring-white transition-all text-gray-900 dark:text-white shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] placeholder-gray-400 dark:placeholder-gray-500"
                    />
                    
                    <div className="flex flex-col sm:flex-row gap-3">
                      <input
                        type="password"
                        required
                        minLength={6}
                        placeholder="New password (min. 6 chars)"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full sm:max-w-md bg-gray-50/50 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 rounded-xl p-3.5 outline-none focus:border-black dark:focus:border-white focus:ring-1 focus:ring-black dark:focus:ring-white transition-all text-gray-900 dark:text-white shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] placeholder-gray-400 dark:placeholder-gray-500"
                      />
                      <button
                        type="submit"
                        disabled={isUpdatingPassword || !newPassword || !currentPassword}
                        className="px-6 py-3.5 bg-black dark:bg-white text-white dark:text-black font-bold rounded-xl hover:bg-gray-800 dark:hover:bg-gray-200 disabled:opacity-50 transition-colors whitespace-nowrap active:scale-95 shadow-sm w-full sm:w-auto cursor-pointer"
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
          <div className="bg-red-50/40 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 p-8 sm:p-10 rounded-4xl">
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