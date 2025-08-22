// components/CookieConsentManager.tsx
import React from "react";
import { CookieBanner } from "./cookieBanner";
import { CookiePreferences } from "./cookiePreferences";

export function CookieConsentManager() {
  return (
    <>
      <CookieBanner />
      <CookiePreferences />
    </>
  );
}
