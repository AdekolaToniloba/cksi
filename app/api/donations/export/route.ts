// app/api/donations/export/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse query parameters
    const status = searchParams.get("status");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const format = searchParams.get("format") || "csv";

    // Build filters
    const where: any = {};

    if (status && status !== "all") {
      where.status = status;
    }

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        where.createdAt.gte = new Date(startDate);
      }
      if (endDate) {
        where.createdAt.lte = new Date(endDate);
      }
    }

    // Fetch all donations matching filters (no limit for export)
    const donations = await prisma.donation.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    if (format === "csv") {
      // Generate CSV content
      const headers = [
        "Date",
        "Donor Name",
        "Email",
        "Phone",
        "Amount (₦)",
        "Currency",
        "Status",
        "Type",
        "Reference",
        "Campaign",
        "Anonymous",
      ];

      const csvRows = [
        headers.join(","),
        ...donations.map((donation) =>
          [
            new Date(donation.createdAt).toLocaleDateString(),
            donation.donorName || "Anonymous",
            donation.donorEmail,
            donation.donorPhone || "",
            donation.amount.toString(),
            donation.currency,
            donation.status,
            donation.donationType.replace("_", " "),
            donation.paymentReference,
            donation.campaignId || "General Fund",
            donation.isAnonymous ? "Yes" : "No",
          ]
            .map((field) => `"${field}"`)
            .join(",")
        ),
      ];

      const csvContent = csvRows.join("\n");

      // Generate filename with date range
      const startDateStr = startDate
        ? new Date(startDate).toISOString().split("T")[0]
        : "all";
      const endDateStr = endDate
        ? new Date(endDate).toISOString().split("T")[0]
        : "all";
      const filename = `cksi-donations-${startDateStr}-to-${endDateStr}.csv`;

      return new NextResponse(csvContent, {
        status: 200,
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="${filename}"`,
        },
      });
    }

    // Default to JSON if format is not CSV
    return NextResponse.json({
      success: true,
      data: donations,
      count: donations.length,
      filters: {
        status,
        startDate,
        endDate,
      },
    });
  } catch (error) {
    console.error("Error exporting donations:", error);
    return NextResponse.json(
      { success: false, error: "Failed to export donations" },
      { status: 500 }
    );
  }
}
