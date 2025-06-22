// app/api/admin/gallery/events/[id]/media/[mediaId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminAuth } from "@/lib/auth-helpers";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string; mediaId: string } }
) {
  try {
    await requireAdminAuth();

    const body = await request.json();
    const { title, description, isPublished, orderIndex } = body;

    const media = await prisma.galleryMedia.update({
      where: {
        id: params.mediaId,
        eventId: params.id,
      },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(isPublished !== undefined && { isPublished }),
        ...(orderIndex !== undefined && { orderIndex }),
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
        createdAt: media.createdAt.toISOString(),
        updatedAt: media.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("Error updating media:", error);
    return NextResponse.json(
      { error: "Failed to update media" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; mediaId: string } }
) {
  try {
    await requireAdminAuth();

    // Get media details first
    const media = await prisma.galleryMedia.findUnique({
      where: {
        id: params.mediaId,
        eventId: params.id,
      },
    });

    if (!media) {
      return NextResponse.json({ error: "Media not found" }, { status: 404 });
    }

    // Delete from Cloudinary if we have the public ID
    if (media.cloudinaryPublicId) {
      try {
        const resourceType = media.mediaType === "VIDEO" ? "video" : "image";
        await cloudinary.uploader.destroy(media.cloudinaryPublicId, {
          resource_type: resourceType as "image" | "video",
        });
      } catch (cloudinaryError) {
        console.error("Failed to delete from Cloudinary:", cloudinaryError);
        // Continue with database deletion even if Cloudinary deletion fails
      }
    }

    // Delete from database
    await prisma.galleryMedia.delete({
      where: {
        id: params.mediaId,
        eventId: params.id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting media:", error);
    return NextResponse.json(
      { error: "Failed to delete media" },
      { status: 500 }
    );
  }
}
