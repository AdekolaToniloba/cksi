// lib/cookies/server.ts - Fixed version
import { cookies } from "next/headers";
import { CookiePreferences, CookieConsentData } from "@/types";

const CONSENT_COOKIE_NAME = "cookie_consent";
const PREFERENCES_COOKIE_NAME = "cookie_preferences";

export class ServerCookieManager {
  static async getConsent(): Promise<{
    hasConsent: boolean;
    preferences?: CookiePreferences;
  }> {
    try {
      const cookieStore = await cookies(); // Add await here
      const consentCookie = cookieStore.get(CONSENT_COOKIE_NAME);
      const preferencesCookie = cookieStore.get(PREFERENCES_COOKIE_NAME);

      if (!consentCookie || consentCookie.value !== "true") {
        return { hasConsent: false };
      }

      if (preferencesCookie) {
        const data: CookieConsentData = JSON.parse(preferencesCookie.value);
        return { hasConsent: true, preferences: data.preferences };
      }

      return { hasConsent: false };
    } catch (error) {
      console.error("Failed to get cookie consent:", error);
      return { hasConsent: false };
    }
  }

  static async setConsent(preferences: CookiePreferences): Promise<void> {
    try {
      const cookieStore = await cookies(); // Add await here
      const expires = new Date();
      expires.setFullYear(expires.getFullYear() + 1);

      const consentData: CookieConsentData = {
        preferences,
        timestamp: new Date().toISOString(),
        version: "1.0",
      };

      cookieStore.set(CONSENT_COOKIE_NAME, "true", {
        expires,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      });

      cookieStore.set(PREFERENCES_COOKIE_NAME, JSON.stringify(consentData), {
        expires,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      });
    } catch (error) {
      console.error("Failed to set cookie consent:", error);
      throw new Error("Failed to set cookie consent");
    }
  }

  static async clearConsent(): Promise<void> {
    try {
      const cookieStore = await cookies(); // Add await here

      cookieStore.delete(CONSENT_COOKIE_NAME);
      cookieStore.delete(PREFERENCES_COOKIE_NAME);
    } catch (error) {
      console.error("Failed to clear cookie consent:", error);
      throw new Error("Failed to clear cookie consent");
    }
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
