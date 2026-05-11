// app/api/admin/gallery/events/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminAuth } from "@/lib/auth-helpers";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdminAuth();
    const { id } = await params;

    const event = await prisma.galleryEvent.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            mediaItems: true,
          },
        },
      },
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

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
        mediaCount: event._count.mediaItems,
      },
    });
  } catch (error) {
    console.error("Error fetching gallery event:", error);
    return NextResponse.json(
      { error: "Failed to fetch gallery event" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdminAuth();
    const { id } = await params;

    const body = await request.json();
    const {
      title,
      description,
      category,
      location,
      eventDate,
      coverImage,
      isPublished,
    } = body;

    const event = await prisma.galleryEvent.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(category && { category }),
        ...(location !== undefined && { location }),
        ...(eventDate !== undefined && {
          eventDate: eventDate ? new Date(eventDate) : null,
        }),
        ...(coverImage !== undefined && { coverImage }),
        ...(isPublished !== undefined && { isPublished }),
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
    console.error("Error updating gallery event:", error);
    return NextResponse.json(
      { error: "Failed to update gallery event" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdminAuth();
    const { id } = await params;

    // Delete the event (cascade will delete associated media)
    await prisma.galleryEvent.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting gallery event:", error);
    return NextResponse.json(
      { error: "Failed to delete gallery event" },
      { status: 500 }
    );
  }
}
