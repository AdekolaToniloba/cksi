// app/api/homepage/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { HomepageService } from "@/lib/db/homepage";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    const content = await HomepageService.updateContent(params.id, data);
    return NextResponse.json({ success: true, data: content });
  } catch (error) {
    console.error("Failed to update homepage content:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update content" },
      { status: 500 }
    );
  }
}
