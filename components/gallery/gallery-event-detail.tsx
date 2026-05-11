// components/gallery/gallery-event-detail.tsx
// Client component — requires useState/useEffect for lightbox interactions.
// Rendered inside the server page app/gallery/[slug]/page.tsx.

"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  Calendar,
  Images,
  X,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";
import {
  GalleryEventDetail as GalleryEventDetailType,
  formatCategory,
} from "@/lib/gallery";

interface Props {
  event: GalleryEventDetailType;
}

export function GalleryEventDetail({ event }: Props) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const imageItems = event.mediaItems.filter((m) => m.mediaType === "IMAGE");
  const category = formatCategory(event.category);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const goToPrev = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex(
      lightboxIndex === 0 ? imageItems.length - 1 : lightboxIndex - 1
    );
  };

  const goToNext = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex(
      lightboxIndex === imageItems.length - 1 ? 0 : lightboxIndex + 1
    );
  };

  // Keyboard navigation for the lightbox
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") goToPrev();
      if (e.key === "ArrowRight") goToNext();
    };
    if (lightboxIndex !== null) {
      document.addEventListener("keydown", handleKey);
    }
    return () => document.removeEventListener("keydown", handleKey);
  }, [lightboxIndex]); // eslint-disable-line react-hooks/exhaustive-deps

  const eventYear = event.eventDate
    ? new Date(event.eventDate).getFullYear()
    : "—";

  const eventCity = event.location?.split(",")[0] ?? "Nigeria";

  return (
    <>
      {/* ── PAGE HERO ─────────────────────────────── */}
      <section className="bg-cksi-dark pt-8 pb-12 md:pt-12 md:pb-16">
        <div className="container-base">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex items-center gap-2 text-xs font-sans text-white/50 flex-wrap">
              <li>
                <Link
                  href="/our-work"
                  className="hover:text-white transition-colors duration-150"
                >
                  Our Work
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link
                  href="/our-work#gallery"
                  className="hover:text-white transition-colors duration-150"
                >
                  Gallery
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-white" aria-current="page">
                {event.title}
              </li>
            </ol>
          </nav>

          {/* Hero content — two-column on desktop */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10 items-start">
            {/* Left: Text */}
            <div>
              {/* Category badge */}
              <span className="inline-block bg-cksi-red text-white text-[10px] font-sans font-medium uppercase tracking-[0.08em] rounded-pill px-3 py-1 mb-5">
                {category}
              </span>

              {/* Title */}
              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-white leading-tight mb-5">
                {event.title}
              </h1>

              {/* Meta row */}
              <div className="flex flex-wrap gap-5 mb-6">
                {event.location && (
                  <div className="flex items-center gap-2 text-white/60 text-sm font-sans">
                    <MapPin
                      className="w-4 h-4 text-cksi-red flex-shrink-0"
                      aria-hidden="true"
                    />
                    {event.location}
                  </div>
                )}
                {event.eventDate && (
                  <div className="flex items-center gap-2 text-white/60 text-sm font-sans">
                    <Calendar
                      className="w-4 h-4 text-white/40 flex-shrink-0"
                      aria-hidden="true"
                    />
                    {new Date(event.eventDate).toLocaleDateString("en-NG", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                )}
              </div>

              {/* Description */}
              {event.description && (
                <p className="font-sans text-white/70 text-base leading-relaxed max-w-[520px] mb-8">
                  {event.description}
                </p>
              )}

              {/* Action buttons */}
              <div className="flex flex-wrap gap-3">
                <a href="#photos" className="btn-primary">
                  View All Photos
                </a>
                <Link href="/our-work#gallery" className="btn-ghost-white">
                  <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                  Back to Gallery
                </Link>
              </div>
            </div>

            {/* Right: Cover image */}
            <div className="relative rounded-card-lg overflow-hidden aspect-square w-full bg-cksi-blue-mid">
              {event.coverImage || imageItems[0] ? (
                <Image
                  src={event.coverImage ?? imageItems[0].mediaUrl}
                  alt={event.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 380px"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Images
                    className="w-16 h-16 text-cksi-blue-dark opacity-30"
                    aria-hidden="true"
                  />
                </div>
              )}

              {/* Photo count badge */}
              {event.imageCount > 0 && (
                <div className="absolute bottom-3 left-3 bg-cksi-dark/80 text-white text-xs font-sans font-medium rounded-pill px-3 py-1.5 flex items-center gap-1.5">
                  <Images className="w-3.5 h-3.5" aria-hidden="true" />
                  {event.imageCount} Photo{event.imageCount !== 1 ? "s" : ""}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ─────────────────────────────── */}
      <div className="bg-cksi-warm border-b border-cksi-grey-light">
        <div className="container-base py-6">
          <div className="grid grid-cols-3 gap-0 divide-x divide-cksi-grey-light">
            <div className="text-center px-4">
              <p className="stat-number text-2xl">{event.imageCount}</p>
              <p className="stat-label">Photos</p>
            </div>
            <div className="text-center px-4">
              <p className="stat-number text-2xl">{eventYear}</p>
              <p className="stat-label">Year</p>
            </div>
            <div className="text-center px-4">
              <p className="font-serif text-2xl text-cksi-dark leading-none">
                {eventCity}
              </p>
              <p className="stat-label">Location</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── PHOTO GRID ────────────────────────────── */}
      <section
        id="photos"
        className="section-padding bg-white"
        aria-labelledby="photos-heading"
      >
        <div className="container-base">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2
                id="photos-heading"
                className="font-serif text-2xl md:text-3xl text-cksi-dark"
              >
                Event Photos
              </h2>
              <p className="font-sans text-sm text-cksi-grey-muted mt-1">
                {imageItems.length} photo{imageItems.length !== 1 ? "s" : ""}{" "}
                from this event — click any to view full size
              </p>
            </div>
          </div>

          {imageItems.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {imageItems.map((item, index) => (
                <button
                  key={item.id}
                  onClick={() => openLightbox(index)}
                  className="group relative aspect-square w-full rounded-xl overflow-hidden bg-cksi-blue focus-visible:ring-2 focus-visible:ring-cksi-red focus-visible:outline-none"
                  aria-label={`View photo ${index + 1} of ${imageItems.length}${item.title ? `: ${item.title}` : ""}`}
                >
                  <Image
                    src={item.mediaUrl}
                    alt={item.title ?? `Event photo ${index + 1}`}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.05]"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-cksi-dark/0 group-hover:bg-cksi-dark/30 transition-all duration-200 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white/20 rounded-full p-2">
                      <Images className="w-5 h-5 text-white" aria-hidden="true" />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="rounded-card bg-cksi-blue border border-cksi-blue-mid p-16 text-center">
              <p className="font-sans text-cksi-blue-dark text-sm">
                Photos for this event will be uploaded soon.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ── BACK CTA ──────────────────────────────── */}
      <section className="section-padding bg-cksi-dark">
        <div className="container-base text-center">
          <h2 className="font-serif text-2xl md:text-3xl text-white mb-3">
            Want to join our next event?
          </h2>
          <p className="font-sans text-white/60 text-sm mb-8">
            Follow our work and be the first to know about upcoming programs
            and events.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/volunteer" className="btn-primary">
              Get Involved
            </Link>
            <Link href="/our-work#gallery" className="btn-ghost-white">
              Back to Gallery
            </Link>
          </div>
        </div>
      </section>

      {/* ── LIGHTBOX ──────────────────────────────── */}
      {lightboxIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Photo ${lightboxIndex + 1} of ${imageItems.length}`}
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-10 bg-white/10 hover:bg-white/20 text-white rounded-full p-2 transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
            aria-label="Close lightbox"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Prev button */}
          {imageItems.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToPrev();
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/10 hover:bg-white/20 text-white rounded-full p-3 transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
              aria-label="Previous photo"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}

          {/* Image container — click stops propagation (doesn't close) */}
          <div
            className="relative max-h-[85vh] max-w-[90vw] w-full h-full rounded-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={imageItems[lightboxIndex].mediaUrl}
              alt={
                imageItems[lightboxIndex].title ??
                `Photo ${lightboxIndex + 1}`
              }
              fill
              className="object-contain"
              sizes="90vw"
              priority
            />
          </div>

          {/* Next button */}
          {imageItems.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/10 hover:bg-white/20 text-white rounded-full p-3 transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
              aria-label="Next photo"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}

          {/* Counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-xs font-sans bg-black/50 rounded-pill px-3 py-1.5 pointer-events-none">
            {lightboxIndex + 1} / {imageItems.length}
          </div>
        </div>
      )}
    </>
  );
}
