// app/gallery/[slug]/page.tsx
// Individual gallery event page — server component.
// Fetches event by slug and delegates rendering to GalleryEventDetail (client).

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getGalleryEvent, formatCategory } from "@/lib/gallery";
import { GalleryEventDetail } from "@/components/gallery/gallery-event-detail";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const event = await getGalleryEvent(slug);

  if (!event) {
    return { title: "Event Not Found — CKSI" };
  }

  const description =
    event.description ??
    `Photos and videos from ${event.title} by CKSI in ${event.location ?? "Nigeria"}.`;

  return {
    title: `${event.title} — CKSI Gallery`,
    description,
    openGraph: {
      title: event.title,
      description,
      images: event.coverImage ? [{ url: event.coverImage }] : [],
    },
  };
}

export default async function GalleryEventPage({ params }: Props) {
  const { slug } = await params;
  const event = await getGalleryEvent(slug);

  if (!event) notFound();

  return <GalleryEventDetail event={event} />;
}
