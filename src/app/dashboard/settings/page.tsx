"use client";

import { useTheme } from "next-themes";
import { useEffect, useLayoutEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import DeleteAccountButton from "@/components/shared/DeleteAccountButton";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";

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

  const [passwordLastChanged, setPasswordLastChanged] = useState<string | null>(null);
  const [bannerDismissed, setBannerDismissed] = useState(false);

  const strength = checkPasswordStrength(newPassword);
  const isPasswordStrong = strength.score >= 3;

  useLayoutEffect(() => {
    setMounted(true);
  }, []);

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

  const showSecurityBanner = !bannerDismissed && passwordLastChanged === null;

  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingEmail(true);
    setEmailMessage({ type: "", text: "" });
    const { error } = await supabase.auth.updateUser({ email: newEmail });
    if (error) {
      setEmailMessage({ type: "error", text: error.message });
    } else {
      setEmailMessage({ type: "success", text: "Check both your old and new email inboxes." });
      setNewEmail("");
    }
    setIsUpdatingEmail(false);
  };

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

    const { error: verifyError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: currentPassword,
    });
    if (verifyError) {
      setPasswordMessage({ type: "error", text: "Incorrect current password." });
      setIsUpdatingPassword(false);
      return;
    }

    const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });
    if (updateError) {
      setPasswordMessage({ type: "error", text: updateError.message });
    } else {
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
        <p className="text-gray-400 font-bold uppercase tracking-widest animate-pulse">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16 px-4 font-sans">
      <div className="max-w-3xl mx-auto space-y-12">
        
        <header className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">Settings</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-3 text-lg font-medium leading-relaxed">Manage your account preferences and security.</p>
        </header>

        {showSecurityBanner && (
          <Card border={false} className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 shadow-none flex items-start gap-4">
            <div className="shrink-0 w-10 h-10 flex items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-500/20">
              <svg className="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-extrabold text-amber-800 dark:text-amber-300 uppercase tracking-wider mb-1">Action Required</p>
              <p className="text-sm text-amber-700/80 dark:text-amber-400/80 font-medium">We recommend updating your password to keep your portfolio secure.</p>
            </div>
            <button onClick={() => setBannerDismissed(true)} className="text-amber-500 hover:text-amber-700 transition-colors cursor-pointer"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg></button>
          </Card>
        )}

        {/* 1. APPEARANCE */}
        <section className="space-y-6">
          <Badge>Appearance</Badge>
          <Card>
            <div className="grid grid-cols-3 gap-6">
              {[
                { name: "light", icon: <svg className="w-6 h-6 mb-2 text-yellow-500 font-bold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg> },
                { name: "dark", icon: <svg className="w-6 h-6 mb-2 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg> },
                { name: "system", icon: <svg className="w-6 h-6 mb-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg> }
              ].map((t) => (
                <button
                  key={t.name}
                  onClick={() => setTheme(t.name)}
                  className={`flex flex-col items-center justify-center p-6 rounded-3xl border-2 transition-all cursor-pointer ${theme === t.name ? "border-black dark:border-white bg-gray-50 dark:bg-white/5 shadow-md" : "border-gray-100 dark:border-white/5 hover:border-gray-300 dark:hover:border-white/10"}`}
                >
                  {t.icon}
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-gray-700 dark:text-gray-300">{t.name}</span>
                </button>
              ))}
            </div>
          </Card>
        </section>

        {/* 2. SECURITY */}
        <section className="space-y-6">
          <Badge>Security</Badge>
          <Card className="space-y-12">
            
            {/* Email Form */}
            <form onSubmit={handleUpdateEmail} className="space-y-5">
              <Input
                label="Email Address"
                placeholder="Enter new email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                error={emailMessage.type === "error" ? emailMessage.text : undefined}
                helperText={emailMessage.type === "success" ? emailMessage.text : "We'll send a confirmation link to both addresses."}
              />
              <Button type="submit" disabled={isUpdatingEmail || !newEmail} loading={isUpdatingEmail} className="w-full sm:w-auto">Update Email</Button>
            </form>

            <div className="h-px bg-gray-100 dark:bg-white/5" />

            {/* Password Form */}
            <form onSubmit={handleUpdatePassword} className="space-y-6">
              <label className="text-[10px] font-extrabold text-gray-400 dark:text-gray-500 uppercase tracking-widest block ml-1">Change Password</label>
              
              <div className="space-y-4">
                <div className="relative">
                  <Input
                    type={showCurrentPassword ? "text" : "password"}
                    placeholder="Current password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                  <button type="button" onClick={() => setShowCurrentPassword(!showCurrentPassword)} className="absolute right-5 top-[60%] -translate-y-1/2 text-gray-400 hover:text-black dark:hover:text-white cursor-pointer transition-colors"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">{showCurrentPassword ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />}</svg></button>
                </div>

                <div className="space-y-4">
                  <div className="relative">
                    <Input
                      type={showNewPassword ? "text" : "password"}
                      placeholder="New password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      error={passwordMessage.type === "error" ? passwordMessage.text : undefined}
                    />
                    <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-5 top-[60%] -translate-y-1/2 text-gray-400 hover:text-black dark:hover:text-white cursor-pointer transition-colors"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">{showNewPassword ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />}</svg></button>
                  </div>

                  {newPassword.length > 0 && (
                    <div className="px-4 space-y-3 animate-in fade-in duration-500">
                      <div className="flex gap-2">
                        {[0, 1, 2, 3].map((i) => (
                          <div key={i} className={`h-1 flex-1 rounded-full bg-gray-100 dark:bg-white/5 overflow-hidden`}><div className={`h-full transition-all duration-500 ${i < strength.score ? BAR_COLORS[strength.score - 1] : "w-0"}`} style={{ width: i < strength.score ? "100%" : "0%" }} /></div>
                        ))}
                      </div>
                      <span className={`text-[10px] font-extrabold uppercase tracking-widest ${strength.color}`}>{strength.label} Password</span>
                      
                      <div className="space-y-2 text-xs">
                        <div className="flex items-center gap-2">
                          <svg className={`w-4 h-4 shrink-0 ${strength.checks.length ? "text-emerald-500" : "text-gray-300 dark:text-gray-600"}`} fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                          <span className={strength.checks.length ? "text-gray-700 dark:text-gray-300" : "text-gray-500 dark:text-gray-500"}>At least 8 characters</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <svg className={`w-4 h-4 shrink-0 ${strength.checks.uppercase ? "text-emerald-500" : "text-gray-300 dark:text-gray-600"}`} fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                          <span className={strength.checks.uppercase ? "text-gray-700 dark:text-gray-300" : "text-gray-500 dark:text-gray-500"}>Contains uppercase letter</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <svg className={`w-4 h-4 shrink-0 ${strength.checks.number ? "text-emerald-500" : "text-gray-300 dark:text-gray-600"}`} fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                          <span className={strength.checks.number ? "text-gray-700 dark:text-gray-300" : "text-gray-500 dark:text-gray-500"}>Contains number</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <svg className={`w-4 h-4 shrink-0 ${strength.checks.special ? "text-emerald-500" : "text-gray-300 dark:text-gray-600"}`} fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                          <span className={strength.checks.special ? "text-gray-700 dark:text-gray-300" : "text-gray-500 dark:text-gray-500"}>Contains special character</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                <Button type="submit" disabled={isUpdatingPassword || !newPassword || !currentPassword || !isPasswordStrong} loading={isUpdatingPassword} className="w-full sm:w-auto">Update Password</Button>
                {passwordMessage.type === "success" && <Badge variant="success">{passwordMessage.text}</Badge>}
              </div>
            </form>
          </Card>
        </section>

        {/* 3. DANGER ZONE */}
        <section className="space-y-6 pt-12">
          <Badge variant="danger">Danger Zone</Badge>
          <Card border={false} className="bg-red-50/50 dark:bg-red-900/5 border border-red-200/50 dark:border-red-900/20">
            <h3 className="text-xl font-extrabold text-red-700 dark:text-red-500 tracking-tight mb-2">Account Management</h3>
            <p className="text-red-600/70 dark:text-red-400/70 text-sm font-medium leading-relaxed max-w-lg mb-8">Permanently remove your account, portfolio, and all case studies. This action cannot be reversed.</p>
            <DeleteAccountButton />
          </Card>
        </section>
      </div>
    </div>
  );
}