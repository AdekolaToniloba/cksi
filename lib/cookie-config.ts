// lib/cookie-config.ts (Fixed import)
import { CookieDetails } from "@/types/cookies";

export const COOKIE_CATEGORIES = {
  strictly_necessary: {
    title: "Strictly Necessary Cookies",
    description:
      "These are cookies that are required for the operation of our sites. They include, for example, cookies that enable you to log into secure areas of our sites. You may disable these by changing your browser settings, but this will affect how the website functions.",
    required: true,
  },
  analytical: {
    title: "Analytical or Performance Cookies",
    description:
      "These cookies allow us to recognize and count the number of visitors and to see how visitors move around our sites when they are using them. This helps us to improve the way our sites work, for example, by ensuring that users are finding what they are looking for easily.",
    required: false,
  },
  targeting: {
    title: "Targeting Cookies",
    description:
      "These cookies may be set through our site by our advertising partners. They may be used by those companies to build a profile of your interests and show you relevant adverts on other sites. They do not store directly personal information, but are based on uniquely identifying your browser and internet device.",
    required: false,
  },
  functional: {
    title: "Functional Cookies",
    description:
      "These cookies are used to recognize you when you return to our sites. This enables us to personalize our content for you, greet you by name and remember your preferences (for example, your choice of language or region).",
    required: false,
  },
};

export const COOKIE_DETAILS: CookieDetails[] = [
  {
    name: "_session",
    host: "yourngo.org",
    duration: "Session",
    type: "First Party",
    category: "strictly_necessary",
    description: "Essential for user session management",
  },
  {
    name: "_ga",
    host: "yourngo.org",
    duration: "730 Days",
    type: "First Party",
    category: "analytical",
    description: "Google Analytics - tracks user interactions",
  },
  {
    name: "_fbp",
    host: "yourngo.org",
    duration: "89 Days",
    type: "First Party",
    category: "targeting",
    description: "Facebook Pixel for advertising",
  },
];
