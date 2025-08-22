// app/api/hero/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { HomepageService } from "@/lib/db/homepage";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    const item = await HomepageService.updateHeroItem(params.id, data);
    return NextResponse.json({ success: true, data: item });
  } catch (error) {
    console.error("Failed to update hero item:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update hero item" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await HomepageService.deleteHeroItem(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete hero item:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete hero item" },
      { status: 500 }
    );
  }
}
