import { beforeEach, describe, expect, it, vi } from "vitest";

const googleSheetsMock = vi.hoisted(() => ({
  append: vi.fn(),
  GoogleAuth: vi.fn(function GoogleAuthMock() {
    return { kind: "google-auth-mock" };
  }),
  sheets: vi.fn(() => ({
    spreadsheets: {
      values: {
        append: googleSheetsMock.append,
      },
    },
  })),
}));

vi.mock("googleapis", () => ({
  google: {
    auth: {
      GoogleAuth: googleSheetsMock.GoogleAuth,
    },
    sheets: googleSheetsMock.sheets,
  },
}));

vi.mock("@/lib/monitoring/middleware", () => ({
  rateLimit: vi.fn(() => ({ success: true })),
}));

vi.mock("@/lib/utils/ip", () => ({
  getClientIP: vi.fn(() => "127.0.0.1"),
}));

import { POST as postContact } from "@/app/api/contact/route";
import { POST as postNewsletter } from "@/app/api/newsletter/route";
import {
  createGoogleSheetsAppendResponse,
  createProviderFailure,
  createProviderTimeoutError,
} from "@/tests/helpers/providers";
import { createRouteRequest } from "@/tests/helpers/routes";

describe("Google Sheets route mocks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.CONTACT_SHEET_ID = "contact-sheet-id";
    process.env.NEWSLETTER_SHEET_ID = "newsletter-sheet-id";
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL = "sheets@example.test";
    process.env.GOOGLE_PRIVATE_KEY = "mock-private-key";
  });

  it("uses mocked Google Sheets success writes for contact submissions", async () => {
    googleSheetsMock.append.mockResolvedValueOnce(
      createGoogleSheetsAppendResponse()
    );

    const response = await postContact(
      createRouteRequest("/api/contact", {
        method: "POST",
        json: {
          firstName: "Ada",
          lastName: "Example",
          email: "ada@example.test",
          phone: "08000000000",
          subject: "Support",
          message: "We would like to learn more about volunteering.",
        },
      })
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      success: true,
      message:
        "Thank you for reaching out. We will get back to you within 2 business days.",
    });
    expect(googleSheetsMock.append).toHaveBeenCalledWith(
      expect.objectContaining({
        spreadsheetId: "contact-sheet-id",
        range: "Contact!A:H",
      })
    );
  });

  it("covers mocked Google Sheets timeout errors for contact submissions", async () => {
    googleSheetsMock.append.mockRejectedValueOnce(
      createProviderTimeoutError("Google Sheets timed out")
    );

    const response = await postContact(
      createRouteRequest("/api/contact", {
        method: "POST",
        json: {
          firstName: "Ada",
          lastName: "Example",
          email: "ada@example.test",
          subject: "Support",
          message: "This message is long enough.",
        },
      })
    );

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({
      success: false,
      message:
        "Something went wrong. Please try again or email us directly at info@cksi.org",
    });
  });

  it("covers mocked invalid Google Sheets responses for newsletter writes", async () => {
    googleSheetsMock.append.mockResolvedValueOnce({});

    const response = await postNewsletter(
      createRouteRequest("/api/newsletter", {
        method: "POST",
        json: {
          email: "ada@example.test",
          source: "footer",
        },
      })
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      success: true,
      message: "You have been subscribed to CKSI updates.",
    });
    expect(googleSheetsMock.append).toHaveBeenCalledWith(
      expect.objectContaining({
        spreadsheetId: "newsletter-sheet-id",
        range: "Newsletter!A:D",
      })
    );
  });

  it("covers mocked Google Sheets failures for newsletter writes", async () => {
    googleSheetsMock.append.mockRejectedValueOnce(
      createProviderFailure("Google Sheets append failed")
    );

    const response = await postNewsletter(
      createRouteRequest("/api/newsletter", {
        method: "POST",
        json: {
          email: "ada@example.test",
          source: "donate-form",
        },
      })
    );

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({
      success: false,
      message: "Failed to subscribe. Please try again.",
    });
  });
});
