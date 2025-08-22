// types/cookies.ts
export interface CookiePreferences {
  strictly_necessary: boolean;
  analytical: boolean;
  targeting: boolean;
  functional: boolean;
}

export interface CookieDetails {
  name: string;
  host: string;
  duration: string;
  type: "First Party" | "Third Party";
  category: keyof CookiePreferences;
  description: string;
}

export interface CookieConsentData {
  preferences: CookiePreferences;
  timestamp: string;
  version: string;
}
