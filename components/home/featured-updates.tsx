// components/home/featured-updates.tsx
// Server component — fetches gallery data at render time.
// Replaces the client-side FeaturedEvents carousel with a
// statically-cached 3-card grid aligned with the CKSI design system.

import Link from "next/link";
import { getGalleryEvents } from "@/lib/gallery";
import { GalleryEventCard } from "@/components/gallery/gallery-event-card";

export async function FeaturedUpdates() {
  const events = await getGalleryEvents();
  // Show only the 3 most recent events on the homepage
  const featured = events.slice(0, 3);

  return (
    <section
      className="section-padding bg-cksi-warm"
      aria-labelledby="featured-updates-heading"
    >
      <div className="container-base">
        {/* ── Section header ───────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <p className="eyebrow mb-3">From the Field</p>
            <h2
              id="featured-updates-heading"
              className="font-serif text-3xl md:text-4xl text-cksi-dark"
            >
              Latest from CKSI
            </h2>
          </div>
          <Link
            href="/our-work#gallery"
            className="font-sans text-sm font-medium text-cksi-red hover:text-cksi-red-hover flex items-center gap-1.5 transition-colors duration-150 whitespace-nowrap"
            aria-label="View all events in the gallery"
          >
            View all events →
          </Link>
        </div>

        {/* ── Cards grid ───────────────────────────── */}
        {featured.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((event, index) => (
              <GalleryEventCard
                key={event.id}
                event={event}
                priority={index === 0}
              />
            ))}
          </div>
        ) : (
          // Empty state — shown when no events are published yet
          <div className="rounded-card bg-cksi-blue border border-cksi-blue-mid p-12 text-center">
            <p className="font-sans text-cksi-blue-dark text-sm">
              Events and updates will appear here soon.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
