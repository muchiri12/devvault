"use client";

import { useEffect, useRef } from "react";
import { logProfileView } from "@/app/actions/analyticsActions";

export default function ViewTracker({ profileId }: { profileId: string }) {
  const hasLogged = useRef(false);

  useEffect(() => {
    // 1. Check for cookie consent before logging (Real-world compliance)
    const savedConsent = localStorage.getItem("devvault_cookie_consent_granular");
    const consent = savedConsent ? JSON.parse(savedConsent) : null;
    
    // We ALWAYS track the view for accurate counts (re-categorized as essential baseline)
    // But we ONLY log the personal identity if analytical consent is NOT explicitly false
    const shouldLogIdentity = consent ? consent.analytical !== false : true;

    // 2. React StrictMode fires useEffect twice in development.
    // This ref ensures we only hit your database once per session.
    if (!hasLogged.current) {
      logProfileView(profileId, shouldLogIdentity);
      hasLogged.current = true;
    }
  }, [profileId]);

  return null; // This component renders absolutely nothing to the screen
}
