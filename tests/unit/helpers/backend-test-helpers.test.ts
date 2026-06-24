import { NextResponse } from "next/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/auth", () => ({
  getSession: vi.fn(),
}));

import { getSession } from "@/lib/auth";
import {
  adminSession,
  anonymousSession,
  mockSession,
  resetSessionMock,
  userSession,
} from "@/tests/helpers/auth";
import {
  expectAdminJsonSuccess,
  expectForbidden,
  expectUnauthorized,
  expectValidationFailure,
} from "@/tests/helpers/assertions";
import {
  createRouteContext,
  createRouteRequest,
} from "@/tests/helpers/routes";

describe("backend test helpers", () => {
  it("provides reusable anonymous, user, and admin session fixtures", async () => {
    mockSession(adminSession);
    expect(await getSession()).toEqual(adminSession);

    mockSession(userSession);
    expect(await getSession()).toEqual(userSession);

    mockSession(anonymousSession);
    expect(await getSession()).toBeNull();

    resetSessionMock();
  });

  it("builds route requests with query params and JSON bodies", async () => {
    const request = createRouteRequest("/api/donations/list", {
      method: "POST",
      query: {
        status: "COMPLETED",
        limit: 25,
        tag: ["finance", "admin"],
      },
      json: {
        reference: "ref_123",
      },
      headers: {
        "x-test-request": "true",
      },
    });

    const url = new URL(request.url);

    expect(request.method).toBe("POST");
    expect(request.headers.get("content-type")).toBe("application/json");
    expect(request.headers.get("x-test-request")).toBe("true");
    expect(url.searchParams.get("status")).toBe("COMPLETED");
    expect(url.searchParams.get("limit")).toBe("25");
    expect(url.searchParams.getAll("tag")).toEqual(["finance", "admin"]);
    await expect(request.json()).resolves.toEqual({ reference: "ref_123" });
  });

  it("builds async route params contexts for dynamic handlers", async () => {
    const context = createRouteContext({ id: "volunteer_123" });

    await expect(context.params).resolves.toEqual({ id: "volunteer_123" });
  });

  it("asserts auth, validation, and admin success responses", async () => {
    await expectUnauthorized(
      NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    );

    await expectForbidden(
      NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 })
    );

    await expectValidationFailure(
      NextResponse.json(
        { success: false, error: "Validation failed" },
        { status: 400 }
      )
    );

    const successBody = await expectAdminJsonSuccess<{
      success: true;
      data: { id: string };
    }>(
      NextResponse.json(
        {
          success: true,
          data: { id: "donation_123" },
        },
        { status: 200 }
      )
    );

    expect(successBody.data.id).toBe("donation_123");
  });
});
