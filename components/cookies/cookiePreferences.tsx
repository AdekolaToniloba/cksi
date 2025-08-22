"use client";

// components/CookiePreferences.tsx
import React, { useState } from "react";
import { useCookieConsent } from "@/hooks/use-cookie-consent";
import { COOKIE_CATEGORIES, COOKIE_DETAILS } from "@/lib/cookie-config";
import { CookiePreferences as CookiePreferencesType } from "@/types/cookies";

export function CookiePreferences() {
  const {
    showPreferences,
    preferences,
    acceptSelected,
    closePreferences,
    updatePreference,
  } = useCookieConsent();

  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set()
  );

  if (!showPreferences) return null;

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const getCookiesForCategory = (category: keyof CookiePreferencesType) => {
    return COOKIE_DETAILS.filter((cookie) => cookie.category === category);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Privacy Preference Center
              </h2>
              <p className="text-sm text-gray-600 mt-2">
                Our sites may store or retrieve information on your browser,
                generally in the form of cookies. This information is used to
                improve your experience while you navigate the site and inform
                us on how the site is being used. You can choose to opt-out of
                some types of cookies, however, this may impact your experience
                on the site and the services we are able to provide. "Strictly
                necessary cookies" are accepted by default because they are
                essential for the working of basic functionalities of the
                website.
              </p>
            </div>
            <button
              onClick={closePreferences}
              className="text-gray-400 hover:text-gray-600 text-2xl font-semibold"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Manage Consent Preferences
          </h3>

          <div className="space-y-4">
            {Object.entries(COOKIE_CATEGORIES).map(([key, config]) => {
              const categoryKey = key as keyof CookiePreferencesType;
              const isExpanded = expandedCategories.has(key);
              const categoryPreference = preferences[categoryKey];
              const cookiesInCategory = getCookiesForCategory(categoryKey);

              return (
                <div key={key} className="border border-gray-200 rounded-lg">
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                          {config.title}
                          {config.required && (
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                              Always Active
                            </span>
                          )}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {config.description}
                        </p>
                      </div>

                      {!config.required && (
                        <label className="flex items-center ml-4">
                          <input
                            type="checkbox"
                            checked={categoryPreference}
                            onChange={(e) =>
                              updatePreference(categoryKey, e.target.checked)
                            }
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                        </label>
                      )}
                    </div>

                    <button
                      onClick={() => toggleCategory(key)}
                      className="text-blue-600 hover:underline text-sm mt-2"
                    >
                      Cookies Details {isExpanded ? "▲" : "▼"}
                    </button>

                    {isExpanded && cookiesInCategory.length > 0 && (
                      <div className="mt-4 bg-gray-50 rounded-md p-3">
                        <div className="grid gap-3">
                          {cookiesInCategory.map((cookie, index) => (
                            <div key={index} className="text-xs space-y-1">
                              <div className="font-medium text-gray-900">
                                {cookie.name}
                              </div>
                              <div className="text-gray-600">
                                <div>Host: {cookie.host}</div>
                                <div>Duration: {cookie.duration}</div>
                                <div>Type: {cookie.type}</div>
                                <div>Description: {cookie.description}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
            <button
              onClick={closePreferences}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={acceptSelected}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
            >
              Save Preferences
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
