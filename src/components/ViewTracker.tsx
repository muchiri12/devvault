"use client";

import { useEffect, useRef } from "react";
import { logProfileView } from "@/app/actions/analyticsActions";

export default function ViewTracker({ profileId }: { profileId: string }) {
  const hasLogged = useRef(false);

  useEffect(() => {
    // React StrictMode fires useEffect twice in development.
    // This ref ensures we only hit your database once.
    if (!hasLogged.current) {
      logProfileView(profileId);
      hasLogged.current = true;
    }
  }, [profileId]);

  return null; // This component renders absolutely nothing to the screen
}
