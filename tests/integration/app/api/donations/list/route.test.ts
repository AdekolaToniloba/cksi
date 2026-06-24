import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/auth", () => ({
  getSession: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    donation: {
      findMany: vi.fn(),
      count: vi.fn(),
      aggregate: vi.fn(),
    },
  },
}));

vi.mock("@/lib/monitoring/logger", () => ({
  logger: {
    info: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock("@/lib/monitoring/metrics", () => ({
  metrics: {
    collect: vi.fn(),
  },
}));

import { GET } from "@/app/api/donations/list/route";
import { logger } from "@/lib/monitoring/logger";
import { metrics } from "@/lib/monitoring/metrics";
import { prisma } from "@/lib/prisma";
import {
  adminSession,
  anonymousSession,
  mockSession,
  userSession,
} from "@/tests/helpers/auth";
import {
  expectAdminJsonSuccess,
  expectUnauthorized,
} from "@/tests/helpers/assertions";
import { createRouteRequest } from "@/tests/helpers/routes";

describe("GET /api/donations/list", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rejects anonymous requests with a reusable 401 assertion", async () => {
    mockSession(anonymousSession);

    const response = await GET(createRouteRequest("/api/donations/list"));
    const body = await expectUnauthorized(response);

    expect(body.error).toBe("Unauthorized. Admin access required.");
  });

  it("rejects non-admin sessions with the current API guard", async () => {
    mockSession(userSession);

    const response = await GET(createRouteRequest("/api/donations/list"));
    const body = await expectUnauthorized(response);

    expect(body.error).toBe("Unauthorized. Admin access required.");
  });

  it("allows admins to call the route with query params", async () => {
    mockSession(adminSession);
    vi.mocked(prisma.donation.findMany).mockResolvedValue([
      {
        id: "donation_123",
        donorName: "Ada Example",
        donorEmail: "ada@example.test",
        donorPhone: null,
        amount: 2500,
        currency: "NGN",
        status: "COMPLETED",
        donationType: "ONE_TIME",
        paymentReference: "ref_123",
        paystackReference: "ps_ref_123",
        campaignId: null,
        isAnonymous: false,
        createdAt: new Date("2026-01-01T00:00:00.000Z"),
        updatedAt: new Date("2026-01-01T00:00:00.000Z"),
      },
    ]);
    vi.mocked(prisma.donation.count).mockResolvedValue(1);
    vi.mocked(prisma.donation.aggregate).mockResolvedValue({
      _sum: { amount: 2500 },
      _avg: { amount: null },
      _count: { amount: 0, _all: 0 },
      _min: { amount: null },
      _max: { amount: null },
    });

    const response = await GET(
      createRouteRequest("/api/donations/list", {
        query: {
          status: "COMPLETED",
          limit: 2,
          offset: 0,
        },
      })
    );

    const body = await expectAdminJsonSuccess<{
      success: true;
      data: Array<{ id: string }>;
      meta: { total: number; total_raised: number; page: number };
    }>(response);

    expect(body.data).toHaveLength(1);
    expect(body.data[0]?.id).toBe("donation_123");
    expect(body.meta).toEqual({
      total: 1,
      total_raised: 2500,
      page: 1,
    });
    expect(prisma.donation.findMany).toHaveBeenCalledWith({
      where: { status: "COMPLETED" },
      orderBy: { createdAt: "desc" },
      take: 2,
      skip: 0,
    });
    expect(metrics.collect).toHaveBeenCalledTimes(2);
    expect(logger.info).toHaveBeenCalledWith("Admin accessed donation list", {
      count: 1,
    });
  });
});
