"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";
import { toast } from "sonner";

export default function EditProfilePage() {

  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [existingAvatar, setExistingAvatar] = useState("");
  const [shouldRemoveAvatar, setShouldRemoveAvatar] = useState(false);

  const [website, setWebsite] = useState("");
  const [github, setGithub] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [twitter, setTwitter] = useState("");
  const [initialUsername, setInitialUsername] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // FETCH PROFILE
  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) return;

      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (data) {
        setUsername(data.username);
        setInitialUsername(data.username);
        setBio(data.bio || "");
        setExistingAvatar(data.avatar_url || "");
        
        // Populate social links
        setWebsite(data.website || "");
        setGithub(data.github || "");
        setLinkedin(data.linkedin || "");
        setTwitter(data.twitter || "");
      }

      setIsLoading(false);
    };

    fetchProfile();
  }, []);

  // HANDLE AVATAR PREVIEW
  const handleAvatarChange = (file: File | null) => {
    if (!file) return;
    setAvatar(file);
    setAvatarPreview(URL.createObjectURL(file));
    setShouldRemoveAvatar(false);
  };

  const handleRemoveAvatar = () => {
    setAvatar(null);
    setAvatarPreview("");
    setExistingAvatar("");
    setShouldRemoveAvatar(true);
  };

  // SUBMIT
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const cleanUsername = username.toLowerCase().trim();

    // VALIDATE USERNAME
    if (cleanUsername !== initialUsername) {
      if (!cleanUsername) {
        toast.error("Username is required");
        setIsSubmitting(false);
        return;
      }

      const isValid = /^[a-z0-9_]{3,20}$/.test(cleanUsername);
      if (!isValid) {
        toast.error("Username must be 3-20 characters, lowercase letters, numbers, or underscores.");
        setIsSubmitting(false);
        return;
      }

      // CHECK UNIQUENESS
      const { data: existing } = await supabase
        .from("profiles")
        .select("id")
        .eq("username", cleanUsername)
        .neq("id", user.id)
        .maybeSingle();

      if (existing) {
        toast.error("That username is already taken by another developer!");
        setIsSubmitting(false);
        return;
      }

      // RECORD HISTORY
      const { error: historyError } = await supabase
        .from("username_history")
        .insert({
          old_username: initialUsername,
          user_id: user.id
        });

      if (historyError) {
        console.error("History recording error:", historyError);
        // We continue anyway, but log it.
      }
    }

    let avatarUrl = existingAvatar;

    // UPLOAD NEW AVATAR
    if (avatar) {
      const fileExt = avatar.name.split(".").pop();
      const filePath = `${user.id}/avatar.${fileExt}`;

      // SWEEP OLD AVATARS: Delete anything inside this user's folder to prevent trailing ghost formats (e.g. .png vs .jpg)
      const { data: existingFiles } = await supabase.storage.from("avatars").list(user.id);
      if (existingFiles && existingFiles.length > 0) {
        const filesToRemove = existingFiles.map((x) => `${user.id}/${x.name}`);
        await supabase.storage.from("avatars").remove(filesToRemove);
      }

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, avatar, { upsert: true });

      if (uploadError) {
        console.error(uploadError);
        toast.error("Failed to upload avatar image");
        setIsSubmitting(false);
        return;
      }

      const { data } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      // Append a timestamp to completely bust the browser's image cache!
      avatarUrl = `${data.publicUrl}?t=${Date.now()}`;
    } else if (shouldRemoveAvatar) {
      // SWEEP OLD AVATARS: User explicitly wants to delete their avatar entirely
      const { data: existingFiles } = await supabase.storage.from("avatars").list(user.id);
      if (existingFiles && existingFiles.length > 0) {
        const filesToRemove = existingFiles.map((x) => `${user.id}/${x.name}`);
        await supabase.storage.from("avatars").remove(filesToRemove);
      }
      avatarUrl = "";
    }

    // UPDATE PROFILE
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        bio,
        avatar_url: avatarUrl,
        username: cleanUsername,
        website,  
        github,   
        linkedin, 
        twitter,  
      })
      .eq("id", user.id);

    if (updateError) {
      console.error("Profile Update Error:", updateError);
      toast.error("Database rejected update: " + updateError.message);
      setIsSubmitting(false);
      return;
    }

    toast.success("Profile updated successfully");
    // Use window.location instead of router to force a hard page refresh bypassing Next.js cache
    window.location.href = `/u/${cleanUsername}`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-gray-500 font-medium animate-pulse">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="max-w-2xl mx-auto">

        <div className="mb-10 text-center sm:text-left">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Profile Settings
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-3 text-lg font-medium">Update your public portfolio presence.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-[#0A0A0A] border border-gray-200/60 dark:border-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-4xl p-8 sm:p-12 space-y-10 transition-colors duration-300">

          {/* AVATAR SECTION */}
          <div className="border-b border-gray-100 dark:border-white/5 pb-10">
            <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider ml-1 mb-4 block">Profile Picture</label>
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 relative rounded-full overflow-hidden bg-white dark:bg-gray-800 border-4 border-white dark:border-[#0A0A0A] shadow-[0_8px_16px_rgba(0,0,0,0.08)] shrink-0">
                {(avatarPreview || existingAvatar) ? (
                  <Image
                    src={avatarPreview || existingAvatar}
                    alt="avatar"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300 dark:text-gray-600 bg-gray-50 dark:bg-white/5">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                )}
              </div>

              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  id="avatarUpload"
                  className="hidden"
                  onChange={(e) => handleAvatarChange(e.target.files?.[0] || null)}
                />
                <label
                  htmlFor="avatarUpload"
                  className="inline-block bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white font-bold px-5 py-2.5 rounded-xl cursor-pointer transition-all shadow-sm text-sm active:scale-95 hover:bg-gray-50 dark:hover:bg-white/10 hover:border-gray-900 dark:hover:border-white/20"
                >
                  Change Avatar
                </label>
                {(avatarPreview || existingAvatar) && (
                  <button
                    type="button"
                    onClick={handleRemoveAvatar}
                    className="inline-block ml-3 bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 font-bold px-5 py-2.5 rounded-xl cursor-pointer hover:bg-red-100 dark:hover:bg-red-900/20 transition-all shadow-sm text-sm active:scale-95"
                  >
                    Remove
                  </button>
                )}
                <p className="text-xs text-gray-400 dark:text-gray-500 font-medium mt-3">Recommended: Square JPG or PNG, max 2MB.</p>
              </div>
            </div>
          </div>

          {/* USERNAME SECTION */}
          <div className="border-b border-gray-100 dark:border-white/5 pb-10">
            <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider ml-1 mb-3 block">Username</label>
            <div className="flex items-center w-full border border-gray-200/80 dark:border-white/10 rounded-2xl bg-gray-50/50 dark:bg-white/5 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden transition-all focus-within:border-gray-900 dark:focus-within:border-white focus-within:ring-4 focus-within:ring-black/5 dark:focus-within:ring-white/5">
              <span className="pl-4 sm:pl-5 py-4 text-gray-400 dark:text-gray-500 text-sm sm:text-base font-medium select-none whitespace-nowrap border-r border-gray-100 dark:border-white/5 pr-4 mr-4 bg-gray-100/50 dark:bg-white/5">
                devvault.com/u/
              </span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-transparent px-1 py-4 outline-none text-gray-900 dark:text-white text-sm sm:text-base font-bold"
              />
            </div>
            <p className="text-xs text-gray-400 dark:text-gray-500 font-medium mt-3 ml-1">
              Your unique handle and public portfolio address.
            </p>
          </div>

          {/* BIO SECTION */}
          <div className="border-b border-gray-100 dark:border-white/5 pb-10">
            <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider ml-1 mb-3 block">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              placeholder="Frontend Developer specializing in React and Next.js..."
              className="w-full bg-gray-50/50 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 rounded-2xl p-4 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 outline-none transition-all duration-300 hover:bg-white dark:hover:bg-white/10 focus:bg-white dark:focus:bg-[#0A0A0A] focus:border-gray-900 dark:focus:border-white focus:ring-4 focus:ring-black/5 dark:focus:ring-white/5 shadow-[inset_0_2px_4_rgba(0,0,0,0.02)] resize-none"
            />
          </div>

          {/* SOCIAL LINKS SECTION */}
          <div>
            <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider ml-1 mb-6 block">Social & Connect</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300 ml-1">Personal Website</label>
                <input
                  type="url"
                  placeholder="https://yourdomain.com"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="w-full bg-gray-50/50 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 rounded-2xl p-4 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 outline-none transition-all duration-300 hover:bg-white dark:hover:bg-white/10 focus:bg-white dark:focus:bg-[#0A0A0A] focus:border-gray-900 dark:focus:border-white focus:ring-4 focus:ring-black/5 dark:focus:ring-white/5 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300 ml-1">GitHub Profile</label>
                <input
                  type="url"
                  placeholder="https://github.com/username"
                  value={github}
                  onChange={(e) => setGithub(e.target.value)}
                  className="w-full bg-gray-50/50 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 rounded-2xl p-4 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 outline-none transition-all duration-300 hover:bg-white dark:hover:bg-white/10 focus:bg-white dark:focus:bg-[#0A0A0A] focus:border-gray-900 dark:focus:border-white focus:ring-4 focus:ring-black/5 dark:focus:ring-white/5 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300 ml-1">LinkedIn Profile</label>
                <input
                  type="url"
                  placeholder="https://linkedin.com/in/username"
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                  className="w-full bg-gray-50/50 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 rounded-2xl p-4 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 outline-none transition-all duration-300 hover:bg-white dark:hover:bg-white/10 focus:bg-white dark:focus:bg-[#0A0A0A] focus:border-gray-900 dark:focus:border-white focus:ring-4 focus:ring-black/5 dark:focus:ring-white/5 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300 ml-1">X / Twitter</label>
                <input
                  type="url"
                  placeholder="https://x.com/username"
                  value={twitter}
                  onChange={(e) => setTwitter(e.target.value)}
                  className="w-full bg-gray-50/50 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 rounded-2xl p-4 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 outline-none transition-all duration-300 hover:bg-white dark:hover:bg-white/10 focus:bg-white dark:focus:bg-[#0A0A0A] focus:border-gray-900 dark:focus:border-white focus:ring-4 focus:ring-black/5 dark:focus:ring-white/5 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]"
                />
              </div>

            </div>
          </div>

          <div className="flex justify-end pt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full sm:w-auto px-8 sm:px-10 py-4 rounded-xl font-bold text-white dark:text-black transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer ${isSubmitting
                ? "bg-gray-400 cursor-not-allowed! shadow-none"
                : "bg-black dark:bg-white hover:bg-gray-900 dark:hover:bg-gray-100 shadow-md"
                }`}
            >
              {isSubmitting ? "Saving Changes..." : "Save Profile"}
              {!isSubmitting && (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          </div>

        </form>



      </div>
    </div>
  );
}