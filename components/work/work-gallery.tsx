// components/work/work-gallery.tsx
// Server component — fetches ALL published gallery events from the API.
// Replaced the old hardcoded 3-item grid with live data.
// Removed the client-side category filter to stay server-only;
// filtering can be added as a separate client island if needed later.

import { getGalleryEvents } from "@/lib/gallery";
import { GalleryEventCard } from "@/components/gallery/gallery-event-card";

export async function WorkGallery() {
  const events = await getGalleryEvents();

  return (
    <section
      id="gallery"
      className="section-padding bg-cksi-warm"
      aria-labelledby="gallery-heading"
    >
      <div className="container-base">
        {/* ── Section header ───────────────────────── */}
        <div className="mb-3">
          <p className="eyebrow mb-3">Our Events</p>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-4">
          <h2
            id="gallery-heading"
            className="font-serif text-3xl md:text-4xl text-cksi-dark"
          >
            Our Impact in Pictures
          </h2>
          <p className="font-sans text-sm text-cksi-grey max-w-sm">
            Explore our journey through photos and videos showcasing the lives
            we&apos;ve touched across Nigeria.
          </p>
        </div>

        {/* Event count */}
        <p className="font-sans text-xs text-cksi-grey-muted mb-8">
          {events.length === 0
            ? "No events published yet"
            : `Showing ${events.length} event${events.length === 1 ? "" : "s"}`}
        </p>

        {/* ── Cards grid ───────────────────────────── */}
        {events.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event, index) => (
              <GalleryEventCard
                key={event.id}
                event={event}
                priority={index === 0}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-card bg-cksi-blue border border-cksi-blue-mid p-16 text-center">
            <p className="font-sans text-cksi-blue-dark">
              Our event gallery is coming soon.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
