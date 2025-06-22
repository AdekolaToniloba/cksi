// app/api/donations/create/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createDonation } from "@/lib/db-queries";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      amount,
      donor_name,
      donor_email,
      donor_phone,
      campaign_id,
      is_anonymous,
      donation_type,
    } = body;

    // Validate required fields
    if (!amount || !donor_email) {
      return NextResponse.json(
        { error: "Amount and email are required" },
        { status: 400 }
      );
    }

    // Generate payment reference
    const payment_reference = `CKSI_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    // Create donation record
    const donation = await createDonation({
      amount,
      donor_name: is_anonymous ? null : donor_name,
      donor_email,
      donor_phone,
      is_anonymous: is_anonymous || false,
      donation_type: donation_type || "one-time",
      payment_reference,
      status: "pending",
      currency: "NGN",
      campaign_id: campaign_id === "general" ? null : campaign_id,
      paystack_reference: null,
    });

    return NextResponse.json({
      id: donation.id,
      payment_reference: donation.payment_reference,
      amount: donation.amount,
    });
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { error: "Server error occurred" },
      { status: 500 }
    );
  }
}
