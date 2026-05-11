/*
 * GOOGLE SHEETS SETUP for Newsletter tab:
 *
 * Add header row to Newsletter tab:
 * A1: Timestamp | B1: Email | C1: Source | D1: Status
 *
 * Source values will be:
 * "footer", "volunteer-form", "donate-form"
 *
 * Share the same sheet with the service account.
 * Use the same Sheet ID as CONTACT_SHEET_ID if using
 * the same Google Sheet — just set NEWSLETTER_SHEET_ID
 * to the same value.
 *
 * Required env vars:
 *   GOOGLE_SERVICE_ACCOUNT_EMAIL= (same as contact route)
 *   GOOGLE_PRIVATE_KEY= (same as contact route)
 *   NEWSLETTER_SHEET_ID= (can be same sheet, different tab)
 */

import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import { rateLimit } from "@/lib/monitoring/middleware";
import { getClientIP } from "@/lib/utils/ip";

function getGoogleSheetsClient() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  return google.sheets({ version: "v4", auth });
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting — 5 per minute per IP
    const ip = getClientIP(request);
    const { success } = rateLimit(ip, 5, 60 * 1000);
    if (!success) {
      return NextResponse.json(
        { success: false, message: "Too many requests." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { email, source = "footer" } = body;

    // Validation
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { success: false, message: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    // Validate source to prevent injection
    const allowedSources = ["footer", "volunteer-form", "donate-form"];
    const safeSource = allowedSources.includes(source) ? source : "unknown";

    const sheets = getGoogleSheetsClient();
    const timestamp = new Date().toISOString();

    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.NEWSLETTER_SHEET_ID,
      range: "Newsletter!A:D",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [
          [
            timestamp, // Column A: Timestamp
            email, // Column B: Email
            safeSource, // Column C: Source
            "Active", // Column D: Status
          ],
        ],
      },
    });

    return NextResponse.json({
      success: true,
      message: "You have been subscribed to CKSI updates.",
    });
  } catch (error) {
    console.error("[NEWSLETTER API] Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to subscribe. Please try again." },
      { status: 500 }
    );
  }
}
