// app/api/storage/cloudinary/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { requireAdminAuth } from "@/lib/auth-helpers";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    await requireAdminAuth();

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const eventId = formData.get("eventId") as string;
    const mediaType = formData.get("mediaType") as string;

    if (!file || !eventId || !mediaType) {
      return NextResponse.json(
        { error: "File, eventId, and mediaType are required" },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Determine upload parameters based on media type
    const isVideo = mediaType === "VIDEO";
    const folder = `cksi/events/${eventId}/${isVideo ? "videos" : "images"}`;

    const uploadOptions = {
      folder,
      public_id: `${Date.now()}-${file.name.replace(/\.[^/.]+$/, "")}`, // Remove extension
      resource_type: (isVideo ? "video" : "image") as "video" | "image", // Type assertion fix
      quality: "auto",
      fetch_format: "auto",
      tags: ["cksi", "event", eventId, mediaType.toLowerCase()],
      ...(isVideo && {
        video_codec: "h264",
        audio_codec: "aac",
        quality: "80",
      }),
      ...(!isVideo && {
        transformation: [{ quality: "auto" }, { fetch_format: "auto" }],
      }),
    };

    // Upload to Cloudinary
    const result = (await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(uploadOptions, (error, result) => {
          if (error) reject(error);
          else resolve(result);
        })
        .end(buffer);
    })) as any;

    // Extract metadata
    const response = {
      url: result.secure_url,
      publicId: result.public_id,
      fileSize: result.bytes,
      width: result.width,
      height: result.height,
      format: result.format,
      resourceType: result.resource_type,
      ...(isVideo && {
        duration: result.duration,
        videoCodec: result.video?.codec,
        audioCodec: result.audio?.codec,
      }),
      ...(result.eager &&
        result.eager.length > 0 && {
          thumbnail: result.eager[0].secure_url,
        }),
    };

    return NextResponse.json(response);
  } catch (error: any) {
    console.error("Cloudinary upload error:", error);
    return NextResponse.json(
      { error: error.message || "Upload failed" },
      { status: 500 }
    );
  }
}

// Delete endpoint
export async function DELETE(request: NextRequest) {
  try {
    await requireAdminAuth();

    const { searchParams } = new URL(request.url);
    const publicId = searchParams.get("publicId");
    const resourceType = searchParams.get("resourceType") || "image";

    if (!publicId) {
      return NextResponse.json(
        { error: "publicId is required" },
        { status: 400 }
      );
    }

    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType as "image" | "video", // Type assertion fix here too
    });

    return NextResponse.json({ result });
  } catch (error: any) {
    console.error("Cloudinary delete error:", error);
    return NextResponse.json(
      { error: error.message || "Delete failed" },
      { status: 500 }
    );
  }
}
