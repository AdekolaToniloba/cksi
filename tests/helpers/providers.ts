type JsonInit = {
  ok?: boolean;
  status?: number;
  headers?: HeadersInit;
};

type PaystackInitializeOverrides = Partial<{
  authorization_url: string;
  access_code: string;
  reference: string;
}>;

type PaystackVerifyOverrides = Partial<{
  status: "success" | "failed" | "abandoned" | "pending";
  reference: string;
  amount: number;
  currency: string;
  email: string;
}>;

export function createJsonResponse(body: unknown, init: JsonInit = {}) {
  return new Response(JSON.stringify(body), {
    status: init.status ?? (init.ok === false ? 500 : 200),
    headers: {
      "content-type": "application/json",
      ...init.headers,
    },
  });
}

export function createProviderTimeoutError(message: string) {
  const error = new Error(message);
  error.name = "AbortError";
  return error;
}

export function createProviderFailure(message: string) {
  return new Error(message);
}

export function createPaystackInitializeResponse(
  overrides: PaystackInitializeOverrides = {}
) {
  return {
    status: true,
    message: "Authorization URL created",
    data: {
      authorization_url:
        overrides.authorization_url ??
        "https://checkout.paystack.com/mock-authorization",
      access_code: overrides.access_code ?? "mock_access_code",
      reference: overrides.reference ?? "CKSI_ref_123",
    },
  };
}

export function createPaystackVerifyResponse(
  overrides: PaystackVerifyOverrides = {}
) {
  return {
    status: true,
    message: "Verification successful",
    data: {
      id: 12345,
      domain: "test",
      status: overrides.status ?? "success",
      reference: overrides.reference ?? "CKSI_ref_123",
      amount: overrides.amount ?? 250000,
      message: null,
      gateway_response: "Successful",
      paid_at: "2026-06-23T00:00:00.000Z",
      created_at: "2026-06-23T00:00:00.000Z",
      channel: "card",
      currency: overrides.currency ?? "NGN",
      ip_address: "127.0.0.1",
      metadata: {
        donation_id: "donation_123",
      },
      fees: 3750,
      customer: {
        id: 99,
        first_name: "Ada",
        last_name: "Example",
        email: overrides.email ?? "ada@example.test",
        customer_code: "CUS_mock",
        phone: null,
        metadata: {},
      },
      authorization: {
        authorization_code: "AUTH_mock",
        bin: "408408",
        last4: "4081",
        exp_month: "12",
        exp_year: "30",
        channel: "card",
        card_type: "visa",
        bank: "TEST BANK",
        country_code: "NG",
        brand: "visa",
        reusable: true,
        signature: "SIG_mock",
      },
    },
  };
}

export function createPaystackWebhookEvent(
  eventName = "charge.success",
  dataOverrides: Record<string, unknown> = {}
) {
  return {
    event: eventName,
    data: {
      reference: "CKSI_ref_123",
      customer: {
        email: "ada@example.test",
      },
      plan: {
        name: "Monthly Supporter",
        amount: 250000,
      },
      transaction: {
        reference: "CKSI_ref_123",
      },
      subscription_code: "SUB_mock",
      ...dataOverrides,
    },
  };
}

export function signPaystackWebhookPayload(payload: string, secret: string) {
  const crypto = require("node:crypto") as typeof import("node:crypto");
  return crypto.createHmac("sha512", secret).update(payload).digest("hex");
}

export function createCloudinaryUploadResult(
  overrides: Partial<{
    secure_url: string;
    public_id: string;
    bytes: number;
    width: number;
    height: number;
    format: string;
    resource_type: string;
    duration: number;
  }> = {}
) {
  return {
    secure_url:
      overrides.secure_url ??
      "https://res.cloudinary.com/demo/image/upload/v1/mock-image.jpg",
    public_id: overrides.public_id ?? "cksi/events/event_123/images/mock-image",
    bytes: overrides.bytes ?? 2048,
    width: overrides.width ?? 1200,
    height: overrides.height ?? 800,
    format: overrides.format ?? "jpg",
    resource_type: overrides.resource_type ?? "image",
    duration: overrides.duration,
  };
}

export function createCloudinaryDestroyResult(
  overrides: Partial<{
    result: string;
  }> = {}
) {
  return {
    result: overrides.result ?? "ok",
  };
}

export function createGoogleSheetsAppendResponse() {
  return {
    status: 200,
    statusText: "OK",
    data: {
      updates: {
        updatedRows: 1,
      },
    },
  };
}
