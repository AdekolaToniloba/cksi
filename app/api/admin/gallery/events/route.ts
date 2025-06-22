// app/api/admin/gallery/events/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminAuth } from "@/lib/auth-helpers";

export async function GET() {
  try {
    await requireAdminAuth();

    const events = await prisma.galleryEvent.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        _count: {
          select: {
            mediaItems: true,
          },
        },
        mediaItems: {
          select: {
            mediaType: true,
          },
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
      isPublished: event.isPublished,
      createdAt: event.createdAt.toISOString(),
      updatedAt: event.updatedAt.toISOString(),
      mediaCount: event._count.mediaItems,
      imageCount: event.mediaItems.filter((item) => item.mediaType === "IMAGE")
        .length,
      videoCount: event.mediaItems.filter((item) => item.mediaType === "VIDEO")
        .length,
    }));

    return NextResponse.json({ events: eventsWithCounts });
  } catch (error) {
    console.error("Error fetching gallery events:", error);
    return NextResponse.json(
      { error: "Failed to fetch gallery events" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdminAuth();

    const body = await request.json();
    const { title, description, category, location, eventDate, coverImage } =
      body;

    if (!title || !category) {
      return NextResponse.json(
        { error: "Title and category are required" },
        { status: 400 }
      );
    }

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();

    const event = await prisma.galleryEvent.create({
      data: {
        title,
        slug,
        description,
        category,
        location,
        eventDate: eventDate ? new Date(eventDate) : null,
        coverImage,
      },
    });

    return NextResponse.json({
      event: {
        id: event.id,
        title: event.title,
        slug: event.slug,
        description: event.description,
        category: event.category,
        location: event.location,
        eventDate: event.eventDate?.toISOString() || null,
        coverImage: event.coverImage,
        isPublished: event.isPublished,
        createdAt: event.createdAt.toISOString(),
        updatedAt: event.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("Error creating gallery event:", error);
    return NextResponse.json(
      { error: "Failed to create gallery event" },
      { status: 500 }
    );
  }
}
