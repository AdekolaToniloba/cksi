// app/api/volunteer/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { VolunteerStatus } from "@/types/volunteer";
// Task 11: Import shared logger — removed duplicate local function
import { logVolunteerActivity } from "@/lib/monitoring/volunteer-logger";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const volunteer = await prisma.volunteer.findUnique({
      where: { id },
    });

    if (!volunteer) {
      return NextResponse.json(
        {
          success: false,
          message: "Volunteer not found",
          error: "NOT_FOUND",
        },
        { status: 404 }
      );
    }

    logVolunteerActivity("volunteer_retrieved", {
      volunteerId: volunteer.id,
      status: volunteer.status,
    });

    return NextResponse.json({
      success: true,
      data: volunteer,
    });
  } catch (error) {
    logVolunteerActivity(
      "volunteer_retrieve_error",
      {
        volunteerId: (await params).id,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      "error"
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to retrieve volunteer",
        error: "FETCH_ERROR",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    // Validate status
    if (status && !Object.values(VolunteerStatus).includes(status)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid status value",
          error: "INVALID_STATUS",
        },
        { status: 400 }
      );
    }

    // Check if volunteer exists
    const existingVolunteer = await prisma.volunteer.findUnique({
      where: { id },
    });

    if (!existingVolunteer) {
      return NextResponse.json(
        {
          success: false,
          message: "Volunteer not found",
          error: "NOT_FOUND",
        },
        { status: 404 }
      );
    }

    // Update volunteer
    const updatedVolunteer = await prisma.volunteer.update({
      where: { id },
      data: {
        status,
        updatedAt: new Date(),
      },
    });

    logVolunteerActivity("volunteer_status_updated", {
      volunteerId: updatedVolunteer.id,
      oldStatus: existingVolunteer.status,
      newStatus: updatedVolunteer.status,
      email: updatedVolunteer.email,
    });

    // TODO: Send email notification to volunteer about status change

    return NextResponse.json({
      success: true,
      message: "Volunteer status updated successfully",
      data: updatedVolunteer,
    });
  } catch (error) {
    logVolunteerActivity(
      "volunteer_update_error",
      {
        volunteerId: "unknown",
        error: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      },
      "error"
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update volunteer",
        error: "UPDATE_ERROR",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // Check if volunteer exists
    const existingVolunteer = await prisma.volunteer.findUnique({
      where: { id },
    });

    if (!existingVolunteer) {
      return NextResponse.json(
        {
          success: false,
          message: "Volunteer not found",
          error: "NOT_FOUND",
        },
        { status: 404 }
      );
    }

    // Delete volunteer
    await prisma.volunteer.delete({
      where: { id },
    });

    logVolunteerActivity("volunteer_deleted", {
      volunteerId: id,
      email: existingVolunteer.email,
      status: existingVolunteer.status,
    });

    return NextResponse.json({
      success: true,
      message: "Volunteer deleted successfully",
    });
  } catch (error) {
    logVolunteerActivity(
      "volunteer_delete_error",
      {
        volunteerId: "unknown",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      "error"
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete volunteer",
        error: "DELETE_ERROR",
      },
      { status: 500 }
    );
  }
}
