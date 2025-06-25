// app/api/donations/create/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Generate payment reference function
const generatePaymentReference = (prefix = "CKSI"): string => {
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substr(2, 9);
  return `${prefix}_${timestamp}_${randomStr}`;
};

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
      wants_receipt,
      wants_newsletter,
    } = body;

    // Validate required fields
    if (!amount || !donor_email) {
      return NextResponse.json(
        { error: "Amount and email are required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(donor_email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Validate amount
    if (Number(amount) < 100) {
      return NextResponse.json(
        { error: "Minimum donation amount is ₦100" },
        { status: 400 }
      );
    }

    // Generate payment reference
    const payment_reference = generatePaymentReference();

    // Create donation record
    const donation = await prisma.donation.create({
      data: {
        donorName: is_anonymous ? null : donor_name,
        donorEmail: donor_email,
        donorPhone: donor_phone,
        amount: Number(amount),
        currency: "NGN",
        campaignId: campaign_id === "general" ? null : campaign_id,
        paymentReference: payment_reference,
        status: "PENDING",
        isAnonymous: is_anonymous || false,
        donationType: donation_type === "one-time" ? "ONE_TIME" : "MONTHLY",
      },
    });

    return NextResponse.json({
      id: donation.id,
      payment_reference: donation.paymentReference,
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
