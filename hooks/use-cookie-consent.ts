"use client";

// hooks/useCookieConsent.ts
import { useState, useEffect } from "react";
import { CookiePreferences } from "../types/cookies";
import { CookieManager } from "../lib/cookie-manager";

export function useCookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>(
    CookieManager.getDefaultPreferences()
  );

  useEffect(() => {
    const { hasConsent, preferences: savedPreferences } =
      CookieManager.getConsent();

    if (!hasConsent) {
      setShowBanner(true);
    } else if (savedPreferences) {
      setPreferences(savedPreferences);
      CookieManager.applyCookiePreferences(savedPreferences);
    }
  }, []);

  const acceptAll = () => {
    const allAccepted: CookiePreferences = {
      strictly_necessary: true,
      analytical: true,
      targeting: true,
      functional: true,
    };

    setPreferences(allAccepted);
    CookieManager.setConsent(allAccepted);
    setShowBanner(false);
    setShowPreferences(false);
  };

  const acceptSelected = () => {
    CookieManager.setConsent(preferences);
    setShowBanner(false);
    setShowPreferences(false);
  };

  const rejectAll = () => {
    const onlyNecessary = CookieManager.getDefaultPreferences();
    setPreferences(onlyNecessary);
    CookieManager.setConsent(onlyNecessary);
    setShowBanner(false);
    setShowPreferences(false);
  };

  const openPreferences = () => {
    setShowPreferences(true);
  };

  const closePreferences = () => {
    setShowPreferences(false);
  };

  const updatePreference = (
    category: keyof CookiePreferences,
    value: boolean
  ) => {
    setPreferences((prev) => ({
      ...prev,
      [category]: category === "strictly_necessary" ? true : value,
    }));
  };

  return {
    showBanner,
    showPreferences,
    preferences,
    acceptAll,
    acceptSelected,
    rejectAll,
    openPreferences,
    closePreferences,
    updatePreference,
  };
}
