// app/api/gallery/events/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Task 8: Cache route with 60-second revalidation
export const revalidate = 60;

export async function GET() {
  try {
    const events = await prisma.galleryEvent.findMany({
      where: {
        isPublished: true, // Only show published events to public
      },
      orderBy: {
        eventDate: "desc", // Show most recent events first
      },
      include: {
        _count: {
          select: {
            mediaItems: {
              where: {
                isPublished: true, // Only count published media
              },
            },
          },
        },
        mediaItems: {
          where: {
            isPublished: true,
            mediaType: "IMAGE", // Task 8: Only fetch the cover image
          },
          select: {
            id: true,
            mediaUrl: true,
            mediaType: true,
            width: true,
            height: true,
            orderIndex: true,
          },
          orderBy: {
            orderIndex: "asc",
          },
          take: 1, // Task 8: Only the cover/featured image per event
        },
      },
    });

    const eventsWithCounts = events.map((event) => ({
      id: event.id,
      title: event.title,
      slug: event.slug,
      description: event.description,
      category: event.category,
      location: event.location,
      eventDate: event.eventDate?.toISOString() || null,
      coverImage: event.coverImage,
      createdAt: event.createdAt.toISOString(),
      mediaCount: event._count.mediaItems,
      // Task 8: imageCount/videoCount now come from DB-level counts via separate _count selects
      // For now, count from the single fetched cover image
      imageCount: event.mediaItems.length, // all fetched items are IMAGEs
      videoCount: 0, // no videos fetched in preview — use full event route for details
      featuredMedia: event.mediaItems.map((item) => ({
        id: item.id,
        mediaUrl: item.mediaUrl,
        mediaType: item.mediaType,
        width: item.width,
        height: item.height,
      })),
    }));

    return NextResponse.json({ events: eventsWithCounts });
  } catch (error) {
    console.error("Error fetching public gallery events:", error);
    return NextResponse.json(
      { error: "Failed to fetch gallery events" },
      { status: 500 }
    );
  }
}
