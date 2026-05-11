// components/gallery/gallery-event-card.tsx
// Shared card used on the homepage FeaturedUpdates section
// and the Our Work page gallery section.
// Server-safe — no state or browser APIs.

import Link from "next/link";
import Image from "next/image";
import { MapPin, Images } from "lucide-react";
import {
  GalleryEvent,
  formatCategory,
  getEventCoverImage,
} from "@/lib/gallery";

interface GalleryEventCardProps {
  event: GalleryEvent;
  /** Pass true for the first card in a section to optimise LCP */
  priority?: boolean;
}

export function GalleryEventCard({
  event,
  priority = false,
}: GalleryEventCardProps) {
  const coverImage = getEventCoverImage(event);
  const category = formatCategory(event.category);

  // Map category string to a colour pair using CKSI design tokens
  const cat = event.category.toLowerCase();
  const categoryStyle =
    cat.includes("health") || cat.includes("care")
      ? "bg-cksi-red-light text-cksi-brand-red"
      : cat.includes("community")
        ? "bg-cksi-blue-mid text-cksi-blue-dark"
        : "bg-cksi-grey-divider text-cksi-grey";

  const mediaLabel =
    event.imageCount > 0
      ? `${event.imageCount} photo${event.imageCount === 1 ? "" : "s"}`
      : event.videoCount > 0
        ? `${event.videoCount} video${event.videoCount === 1 ? "" : "s"}`
        : `${event.mediaCount} item${event.mediaCount === 1 ? "" : "s"}`;

  return (
    <Link
      href={`/gallery/${event.slug}`}
      className="group block rounded-card border border-cksi-grey-light bg-white overflow-hidden hover:border-cksi-blue-mid transition-all duration-200 hover:scale-[1.01]"
      aria-label={`View gallery: ${event.title}`}
    >
      {/* ── Image area ──────────────────────────────── */}
      <div className="relative aspect-video w-full overflow-hidden bg-cksi-blue">
        {coverImage ? (
          <Image
            src={coverImage}
            alt={event.title}
            fill
            className="object-cover object-center transition-transform duration-300 group-hover:scale-[1.03]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            priority={priority}
          />
        ) : (
          // Placeholder when no image is available
          <div className="absolute inset-0 flex items-center justify-center bg-cksi-blue">
            <Images className="w-10 h-10 text-cksi-blue-dark opacity-40" />
          </div>
        )}

        {/* Photo / video count badge — top right */}
        <div className="absolute top-3 right-3 bg-cksi-dark/75 text-white text-[10px] font-sans font-medium rounded-pill px-2.5 py-1 flex items-center gap-1.5">
          <Images className="w-3 h-3" aria-hidden="true" />
          {mediaLabel}
        </div>
      </div>

      {/* ── Card body ───────────────────────────────── */}
      <div className="p-5">
        {/* Category badge */}
        <span
          className={`inline-block text-[10px] font-sans font-medium uppercase tracking-[0.08em] rounded-pill px-2.5 py-1 mb-3 ${categoryStyle}`}
        >
          {category}
        </span>

        {/* Title */}
        <h3 className="font-serif text-[17px] text-cksi-dark leading-snug mb-2 group-hover:text-cksi-red transition-colors duration-150">
          {event.title}
        </h3>

        {/* Location */}
        {event.location && (
          <div className="flex items-center gap-1.5 text-cksi-grey-muted text-xs font-sans">
            <MapPin className="w-3 h-3 flex-shrink-0" aria-hidden="true" />
            <span>{event.location}</span>
          </div>
        )}

        {/* Footer row */}
        <div className="mt-4 pt-4 border-t border-cksi-grey-divider flex items-center justify-between">
          <span className="text-cksi-red text-sm font-sans font-medium flex items-center gap-1.5 transition-all duration-150">
            View Gallery
            <span
              className="transition-transform duration-150 group-hover:translate-x-1 inline-block"
              aria-hidden="true"
            >
              →
            </span>
          </span>
        </div>
      </div>
    </Link>
  );
}
