// lib/cookie-manager.ts
import { CookiePreferences } from "../types/cookies";

const CONSENT_COOKIE_NAME = "cookie_consent";
const PREFERENCES_COOKIE_NAME = "cookie_preferences";

export class CookieManager {
  static setConsent(preferences: CookiePreferences): void {
    const consentData = {
      preferences,
      timestamp: new Date().toISOString(),
      version: "1.0",
    };

    // Set consent cookie (expires in 1 year)
    const expires = new Date();
    expires.setFullYear(expires.getFullYear() + 1);

    document.cookie = `${CONSENT_COOKIE_NAME}=true; expires=${expires.toUTCString()}; path=/; secure; samesite=lax`;
    document.cookie = `${PREFERENCES_COOKIE_NAME}=${JSON.stringify(
      consentData
    )}; expires=${expires.toUTCString()}; path=/; secure; samesite=lax`;

    // Apply preferences immediately
    this.applyCookiePreferences(preferences);
  }

  static getConsent(): {
    hasConsent: boolean;
    preferences?: CookiePreferences;
  } {
    if (typeof window === "undefined") return { hasConsent: false };

    const hasConsent = document.cookie.includes(`${CONSENT_COOKIE_NAME}=true`);

    if (!hasConsent) return { hasConsent: false };

    const preferencesMatch = document.cookie.match(
      new RegExp(`${PREFERENCES_COOKIE_NAME}=([^;]+)`)
    );

    if (preferencesMatch) {
      try {
        const data = JSON.parse(decodeURIComponent(preferencesMatch[1]));
        return { hasConsent: true, preferences: data.preferences };
      } catch (e) {
        return { hasConsent: false };
      }
    }

    return { hasConsent: false };
  }

  static clearConsent(): void {
    document.cookie = `${CONSENT_COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    document.cookie = `${PREFERENCES_COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }

  static applyCookiePreferences(preferences: CookiePreferences): void {
    // Google Analytics
    if (preferences.analytical && typeof window !== "undefined") {
      // Enable Google Analytics
      (window as any).gtag?.("consent", "update", {
        analytics_storage: "granted",
      });
    } else {
      // Disable Google Analytics
      (window as any).gtag?.("consent", "update", {
        analytics_storage: "denied",
      });
    }

    // Facebook Pixel
    if (preferences.targeting && typeof window !== "undefined") {
      // Enable Facebook Pixel
      (window as any).fbq?.("consent", "grant");
    } else {
      // Disable Facebook Pixel
      (window as any).fbq?.("consent", "revoke");
    }

    // Add other third-party service controls here
  }

  static getDefaultPreferences(): CookiePreferences {
    return {
      strictly_necessary: true,
      analytical: false,
      targeting: false,
      functional: false,
    };
  }
}
