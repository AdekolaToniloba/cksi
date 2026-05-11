// lib/gallery.ts
// Centralised gallery data fetching — used by homepage and Our Work page.
// Both pages import from here so the cached fetch is shared within one render.

import { cache } from "react";

export type GalleryMediaItem = {
  id: string;
  title: string | null;
  description: string | null;
  mediaUrl: string;
  mediaType: "IMAGE" | "VIDEO";
  width: number | null;
  height: number | null;
  duration: number | null;
  orderIndex: number;
};

export type GalleryEvent = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  category: string;
  location: string | null;
  eventDate: string | null;
  coverImage: string | null;
  mediaCount: number;
  imageCount: number;
  videoCount: number;
  featuredMedia: GalleryMediaItem[];
};

export type GalleryEventDetail = GalleryEvent & {
  mediaItems: (GalleryMediaItem & {
    fileSize: number | null;
    mimeType: string | null;
    createdAt: string;
  })[];
  createdAt: string;
};

/**
 * Fetch all published gallery events.
 * Cached for the duration of a server render so the homepage and
 * Our Work page don't issue two identical fetches.
 */
export const getGalleryEvents = cache(async (): Promise<GalleryEvent[]> => {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/gallery/events`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.events ?? [];
  } catch {
    return [];
  }
});

/**
 * Fetch a single gallery event by slug.
 * Used on the individual event page /gallery/[slug].
 */
export const getGalleryEvent = cache(
  async (slug: string): Promise<GalleryEventDetail | null> => {
    try {
      const baseUrl =
        process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
      const res = await fetch(`${baseUrl}/api/gallery/events/${slug}`, {
        next: { revalidate: 60 },
      });
      if (!res.ok) return null;
      const data = await res.json();
      return data.event ?? null;
    } catch {
      return null;
    }
  }
);

/**
 * Format a raw category string (e.g. "HEALTH_CARE") for display.
 * Returns "Health Care".
 */
export function formatCategory(category: string): string {
  return category
    .split("_")
    .map(
      (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )
    .join(" ");
}

/**
 * Get the best cover image URL for a gallery event.
 * Prefers the explicit coverImage; falls back to the first IMAGE in featuredMedia.
 */
export function getEventCoverImage(event: GalleryEvent): string | null {
  if (event.coverImage) return event.coverImage;
  const firstImage = event.featuredMedia.find((m) => m.mediaType === "IMAGE");
  return firstImage?.mediaUrl ?? null;
}
