// app/api/admin/stats/blog/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminAuth } from "@/lib/auth-helpers";

export async function GET() {
  try {
    await requireAdminAuth();

    // For now, return empty stats since blog functionality might not be implemented yet
    const stats = {
      total: 0,
      published: 0,
      drafts: 0,
      recentPosts: [],
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching blog stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog stats" },
      { status: 500 }
    );
  }
}
