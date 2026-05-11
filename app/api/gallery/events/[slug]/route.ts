// app/api/gallery/events/[slug]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const event = await prisma.galleryEvent.findFirst({
      where: {
        slug,
        isPublished: true,
      },
      include: {
        mediaItems: {
          where: {
            isPublished: true,
          },
          orderBy: [{ orderIndex: "asc" }, { createdAt: "desc" }],
          select: {
            id: true,
            title: true,
            description: true,
            mediaUrl: true,
            mediaType: true,
            fileSize: true,
            mimeType: true,
            width: true,
            height: true,
            duration: true,
            orderIndex: true,
            createdAt: true,
          },
        },
      },
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    const eventData = {
      id: event.id,
      title: event.title,
      slug: event.slug,
      description: event.description,
      category: event.category,
      location: event.location,
      eventDate: event.eventDate?.toISOString() || null,
      coverImage: event.coverImage,
      createdAt: event.createdAt.toISOString(),
      mediaItems: event.mediaItems.map((item) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        mediaUrl: item.mediaUrl,
        mediaType: item.mediaType,
        fileSize: item.fileSize,
        mimeType: item.mimeType,
        width: item.width,
        height: item.height,
        duration: item.duration,
        orderIndex: item.orderIndex,
        createdAt: item.createdAt.toISOString(),
      })),
      mediaCount: event.mediaItems.length,
      imageCount: event.mediaItems.filter((item) => item.mediaType === "IMAGE")
        .length,
      videoCount: event.mediaItems.filter((item) => item.mediaType === "VIDEO")
        .length,
    };

    return NextResponse.json({ event: eventData });
  } catch (error) {
    console.error("Error fetching public gallery event:", error);
    return NextResponse.json(
      { error: "Failed to fetch gallery event" },
      { status: 500 }
    );
  }
}
