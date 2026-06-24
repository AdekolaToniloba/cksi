import { beforeEach, describe, expect, it, vi } from "vitest";

import { PaystackAPI } from "@/lib/paystack";
import {
  createJsonResponse,
  createPaystackInitializeResponse,
  createPaystackVerifyResponse,
  createProviderTimeoutError,
} from "@/tests/helpers/providers";

describe("PaystackAPI", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("uses mocked success responses for transaction initialization", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      createJsonResponse(createPaystackInitializeResponse())
    );

    const api = new PaystackAPI("sk_test_mock");
    const result = await api.initializeTransaction({
      email: "ada@example.test",
      amount: 250000,
      reference: "CKSI_ref_123",
    });

    expect(result.data.reference).toBe("CKSI_ref_123");
    expect(fetch).toHaveBeenCalledWith(
      "https://api.paystack.co/transaction/initialize",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          Authorization: "Bearer sk_test_mock",
          "Content-Type": "application/json",
        }),
      })
    );
  });

  it("surfaces provider timeout errors through mocked fetch", async () => {
    vi.mocked(fetch).mockRejectedValueOnce(
      createProviderTimeoutError("Paystack request timed out")
    );

    const api = new PaystackAPI("sk_test_mock");

    await expect(api.listTransactions({ page: 2 })).rejects.toThrow(
      "Paystack request timed out"
    );
  });

  it("throws the mocked provider failure message for non-ok responses", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      createJsonResponse(
        {
          message: "Paystack verification failed",
        },
        { status: 502 }
      )
    );

    const api = new PaystackAPI("sk_test_mock");

    await expect(api.verifyTransaction("CKSI_ref_123")).rejects.toThrow(
      "Paystack verification failed"
    );
  });

  it("allows invalid mocked provider payloads to be exercised in tests", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      createJsonResponse({
        status: true,
        message: "ok",
      })
    );

    const api = new PaystackAPI("sk_test_mock");
    const result = await api.verifyTransaction("CKSI_ref_123");

    expect("data" in result).toBe(false);
  });
});
