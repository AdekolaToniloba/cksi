// app/api/donations/verify/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Paystack API utility
const verifyPaystackTransaction = async (
  reference: string,
  secretKey: string
) => {
  const response = await fetch(
    `https://api.paystack.co/transaction/verify/${reference}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${secretKey}`,
      },
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to verify transaction");
  }

  return response.json();
};

export async function POST(request: NextRequest) {
  try {
    const { reference, donation_id } = await request.json();

    if (!reference || !donation_id) {
      return NextResponse.json(
        { error: "Reference and donation ID are required" },
        { status: 400 }
      );
    }

    // Check if Paystack secret key is available
    const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;
    if (!paystackSecretKey) {
      return NextResponse.json(
        { error: "Paystack configuration missing" },
        { status: 500 }
      );
    }

    // Initialize Paystack verification
    try {
      // Verify payment with Paystack
      const verification = await verifyPaystackTransaction(
        reference,
        paystackSecretKey
      );

      if (!verification.status || verification.data.status !== "success") {
        // Update donation status to failed
        await prisma.donation.update({
          where: { id: donation_id },
          data: {
            status: "FAILED",
            paystackReference: reference,
          },
        });

        return NextResponse.json(
          {
            success: false,
            error: "Payment verification failed",
            data: verification.data,
          },
          { status: 400 }
        );
      }

      // Update donation status to completed
      await prisma.donation.update({
        where: { id: donation_id },
        data: {
          status: "COMPLETED",
          paystackReference: reference,
        },
      });

      // TODO: Send email receipt if requested
      // TODO: Subscribe to newsletter if requested

      return NextResponse.json({
        success: true,
        message: "Payment verified successfully",
        data: {
          amount: verification.data.amount / 100, // Convert from kobo to naira
          reference: verification.data.reference,
          status: verification.data.status,
          paid_at: verification.data.paid_at,
        },
      });
    } catch (paystackError: any) {
      console.error("Paystack verification error:", paystackError);

      // Update donation status to failed
      await prisma.donation.update({
        where: { id: donation_id },
        data: {
          status: "FAILED",
          paystackReference: reference,
        },
      });

      return NextResponse.json(
        {
          success: false,
          error: paystackError.message || "Payment verification failed",
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json(
      { success: false, error: "Server error during verification" },
      { status: 500 }
    );
  }
}
