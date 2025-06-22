// app/api/admin/gallery/events/[id]/media/route.ts (Updated for Cloudinary)
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminAuth } from "@/lib/auth-helpers";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdminAuth();

    const media = await prisma.galleryMedia.findMany({
      where: { eventId: params.id },
      orderBy: [{ orderIndex: "asc" }, { createdAt: "desc" }],
    });

    return NextResponse.json({
      media: media.map((item) => ({
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
        isPublished: item.isPublished,
        cloudinaryPublicId: item.cloudinaryPublicId,
        cloudinaryFolder: item.cloudinaryFolder,
        cloudinaryFormat: item.cloudinaryFormat,
        cloudinaryTags: item.cloudinaryTags,
        createdAt: item.createdAt.toISOString(),
        updatedAt: item.updatedAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error("Error fetching event media:", error);
    return NextResponse.json(
      { error: "Failed to fetch event media" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdminAuth();

    const body = await request.json();
    const {
      title,
      description,
      mediaUrl,
      mediaType,
      fileSize,
      mimeType,
      width,
      height,
      duration,
      orderIndex,
      cloudinaryPublicId,
      cloudinaryFolder,
      cloudinaryFormat,
      cloudinaryTags,
    } = body;

    if (!mediaUrl || !mediaType) {
      return NextResponse.json(
        { error: "Media URL and type are required" },
        { status: 400 }
      );
    }

    // Verify event exists
    const event = await prisma.galleryEvent.findUnique({
      where: { id: params.id },
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // Extract Cloudinary info from public ID if not provided
    let finalCloudinaryFolder = cloudinaryFolder;
    let finalCloudinaryFormat = cloudinaryFormat;

    if (cloudinaryPublicId && !cloudinaryFolder) {
      const pathParts = cloudinaryPublicId.split("/");
      finalCloudinaryFolder = pathParts.slice(0, -1).join("/");
    }

    if (cloudinaryPublicId && !cloudinaryFormat) {
      finalCloudinaryFormat = cloudinaryPublicId.split(".").pop() || "jpg";
    }

    const media = await prisma.galleryMedia.create({
      data: {
        eventId: params.id,
        title,
        description,
        mediaUrl,
        mediaType: mediaType as "IMAGE" | "VIDEO",
        fileSize,
        mimeType,
        width,
        height,
        duration,
        orderIndex: orderIndex || 0,
        cloudinaryPublicId,
        cloudinaryFolder: finalCloudinaryFolder,
        cloudinaryFormat: finalCloudinaryFormat,
        cloudinaryTags: cloudinaryTags || ["cksi", "event", params.id],
      },
    });

    return NextResponse.json({
      media: {
        id: media.id,
        title: media.title,
        description: media.description,
        mediaUrl: media.mediaUrl,
        mediaType: media.mediaType,
        fileSize: media.fileSize,
        mimeType: media.mimeType,
        width: media.width,
        height: media.height,
        duration: media.duration,
        orderIndex: media.orderIndex,
        isPublished: media.isPublished,
        cloudinaryPublicId: media.cloudinaryPublicId,
        cloudinaryFolder: media.cloudinaryFolder,
        cloudinaryFormat: media.cloudinaryFormat,
        cloudinaryTags: media.cloudinaryTags,
        createdAt: media.createdAt.toISOString(),
        updatedAt: media.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("Error creating media:", error);
    return NextResponse.json(
      { error: "Failed to create media" },
      { status: 500 }
    );
  }
}
