// components/cookies/cookie-banner.tsx (Fixed)
"use client";

import React from "react";
import { useCookieConsent } from "@/hooks/use-cookie-consent";

export function CookieBanner() {
  const { showBanner, acceptAll, rejectAll, openPreferences } =
    useCookieConsent();

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              We value your privacy
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              We use strictly necessary cookies to make our site work. We and
              our partners also use (with your consent) additional cookies and
              similar technologies to collect information when you interact with
              our site to improve your experience. By clicking "Accept All," you
              consent to the placement of these additional cookies and similar
              technologies. You can change and manage your cookie settings at
              any time by clicking "Manage Cookies". By using the site you
              acknowledge the privacy practices described in our{" "}
              <a href="/privacy" className="text-blue-600 hover:underline">
                Privacy & Cookies Notice
              </a>{" "}
              and agree to our site{" "}
              <a href="/terms" className="text-blue-600 hover:underline">
                Terms of Use
              </a>
              .
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 min-w-fit">
            <button
              onClick={rejectAll}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Reject All
            </button>
            <button
              onClick={openPreferences}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Manage Cookies
            </button>
            <button
              onClick={acceptAll}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
            >
              Accept All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
