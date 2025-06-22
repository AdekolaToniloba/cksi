// app/api/gallery/events/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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
          },
          select: {
            id: true,
            title: true,
            description: true,
            mediaUrl: true,
            mediaType: true,
            width: true,
            height: true,
            duration: true,
            orderIndex: true,
          },
          orderBy: {
            orderIndex: "asc",
          },
          take: 6, // Featured media preview
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
      imageCount: event.mediaItems.filter((item) => item.mediaType === "IMAGE")
        .length,
      videoCount: event.mediaItems.filter((item) => item.mediaType === "VIDEO")
        .length,
      featuredMedia: event.mediaItems.map((item) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        mediaUrl: item.mediaUrl,
        mediaType: item.mediaType,
        width: item.width,
        height: item.height,
        duration: item.duration,
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
