// app/api/admin/stats/gallery/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminAuth } from "@/lib/auth-helpers";

export async function GET() {
  try {
    await requireAdminAuth();

    const [totalEvents, totalMedia, publishedEvents] = await Promise.all([
      prisma.galleryEvent.count(),
      prisma.galleryMedia.count(),
      prisma.galleryEvent.count({ where: { isPublished: true } }),
    ]);

    const stats = {
      totalEvents,
      totalMedia,
      publishedEvents,
      draftEvents: totalEvents - publishedEvents,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching gallery stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch gallery stats" },
      { status: 500 }
    );
  }
}
