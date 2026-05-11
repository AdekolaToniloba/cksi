/*
 * GOOGLE SHEETS SETUP — run once manually
 *
 * 1. Go to console.cloud.google.com
 * 2. Create a new project or use existing
 * 3. Enable the Google Sheets API
 * 4. Go to IAM → Service Accounts → Create Service Account
 * 5. Name it "cksi-sheets-writer"
 * 6. Create and download the JSON key
 * 7. Copy client_email → GOOGLE_SERVICE_ACCOUNT_EMAIL in .env
 * 8. Copy private_key → GOOGLE_PRIVATE_KEY in .env
 *    (keep the \n characters as-is in the .env file)
 *
 * 9. Create a Google Sheet with two tabs:
 *    - "Contact" (for this route)
 *    - "Newsletter" (for the newsletter route)
 *
 * 10. Add header row to Contact tab:
 *     A1: Timestamp | B1: First Name | C1: Last Name |
 *     D1: Email | E1: Phone | F1: Subject | G1: Message | H1: Status
 *
 * 11. Share the sheet with the service account email
 *     (share as Editor)
 *
 * 12. Copy the Sheet ID from the URL → CONTACT_SHEET_ID in .env
 *
 * Required env vars:
 *   GOOGLE_SERVICE_ACCOUNT_EMAIL=
 *   GOOGLE_PRIVATE_KEY=
 *   CONTACT_SHEET_ID=
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
    // Rate limiting — 3 submissions per minute per IP
    const ip = getClientIP(request);
    const { success } = rateLimit(ip, 3, 60 * 1000);
    if (!success) {
      return NextResponse.json(
        { success: false, message: "Too many requests." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { firstName, lastName, email, phone, subject, message } = body;

    // Validation
    if (!firstName || !lastName || !email || !subject || !message) {
      return NextResponse.json(
        { success: false, message: "Please fill in all required fields." },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { success: false, message: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    if (message.length < 10) {
      return NextResponse.json(
        {
          success: false,
          message: "Message must be at least 10 characters.",
        },
        { status: 400 }
      );
    }

    // Write to Google Sheets
    const sheets = getGoogleSheetsClient();
    const timestamp = new Date().toISOString();

    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.CONTACT_SHEET_ID,
      range: "Contact!A:H",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [
          [
            timestamp, // Column A: Timestamp
            firstName, // Column B: First Name
            lastName, // Column C: Last Name
            email, // Column D: Email
            phone || "", // Column E: Phone (optional)
            subject, // Column F: Subject
            message, // Column G: Message
            "New", // Column H: Status (for CKSI team to update)
          ],
        ],
      },
    });

    return NextResponse.json({
      success: true,
      message:
        "Thank you for reaching out. We will get back to you within 2 business days.",
    });
  } catch (error) {
    console.error("[CONTACT API] Error:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          "Something went wrong. Please try again or email us directly at info@cksi.org",
      },
      { status: 500 }
    );
  }
}
