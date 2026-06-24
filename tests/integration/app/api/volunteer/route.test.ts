import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    volunteer: {
      findFirst: vi.fn(),
      create: vi.fn(),
      findMany: vi.fn(),
      count: vi.fn(),
    },
  },
}));

vi.mock("@/lib/monitoring/middleware", () => ({
  rateLimit: vi.fn(() => ({ success: true })),
}));

vi.mock("@/lib/utils/ip", () => ({
  getClientIP: vi.fn(() => "127.0.0.1"),
}));

vi.mock("@/lib/monitoring/volunteer-logger", () => ({
  logVolunteerActivity: vi.fn(),
}));

import { POST } from "@/app/api/volunteer/route";
import { prisma } from "@/lib/prisma";
import { logVolunteerActivity } from "@/lib/monitoring/volunteer-logger";
import { expectValidationFailure } from "@/tests/helpers/assertions";
import { createRouteRequest } from "@/tests/helpers/routes";

describe("POST /api/volunteer", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns a validation failure for invalid JSON input", async () => {
    const response = await POST(
      createRouteRequest("/api/volunteer", {
        method: "POST",
        json: {},
      })
    );

    const body = await expectValidationFailure(response);

    expect(body.success).toBe(false);
    expect(prisma.volunteer.findFirst).not.toHaveBeenCalled();
    expect(prisma.volunteer.create).not.toHaveBeenCalled();
    expect(logVolunteerActivity).toHaveBeenCalledWith(
      "volunteer_validation_error",
      expect.objectContaining({
        duration: expect.any(Number),
        errors: expect.any(Array),
      }),
      "warn"
    );
  });
});
