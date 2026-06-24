import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const prismaMock = vi.hoisted(() => ({
  donation: {
    findUnique: vi.fn(),
    update: vi.fn(),
  },
}));

vi.mock("@/lib/prisma", () => ({
  prisma: prismaMock,
}));

import { POST } from "@/app/api/webhooks/paystack/route";
import {
  createPaystackWebhookEvent,
  signPaystackWebhookPayload,
} from "@/tests/helpers/providers";

describe("POST /api/webhooks/paystack", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.PAYSTACK_SECRET_KEY = "paystack_test_secret";
  });

  it("accepts a signed mocked webhook payload", async () => {
    prismaMock.donation.findUnique.mockResolvedValue({
      id: "donation_123",
      paymentReference: "CKSI_ref_123",
    });
    prismaMock.donation.update.mockResolvedValue({
      id: "donation_123",
      status: "COMPLETED",
    });

    const payload = JSON.stringify(
      createPaystackWebhookEvent("charge.success", {
        reference: "CKSI_ref_123",
      })
    );

    const request = new NextRequest(
      "http://localhost/api/webhooks/paystack",
      {
        method: "POST",
        headers: {
          "x-paystack-signature": signPaystackWebhookPayload(
            payload,
            "paystack_test_secret"
          ),
        },
        body: payload,
      }
    );

    const response = await POST(request);

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ status: "success" });
    expect(prismaMock.donation.findUnique).toHaveBeenCalledWith({
      where: { paymentReference: "CKSI_ref_123" },
    });
    expect(prismaMock.donation.update).toHaveBeenCalledWith({
      where: { id: "donation_123" },
      data: {
        status: "COMPLETED",
        paystackReference: "CKSI_ref_123",
      },
    });
  });

  it("rejects invalid mocked webhook signatures", async () => {
    const payload = JSON.stringify(createPaystackWebhookEvent());
    const request = new NextRequest(
      "http://localhost/api/webhooks/paystack",
      {
        method: "POST",
        headers: {
          "x-paystack-signature": "invalid-signature",
        },
        body: payload,
      }
    );

    const response = await POST(request);

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: "Invalid signature",
    });
    expect(prismaMock.donation.update).not.toHaveBeenCalled();
  });
});
