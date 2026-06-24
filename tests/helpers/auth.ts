import type { Session } from "next-auth";
import { vi } from "vitest";

import { getSession } from "@/lib/auth";

const FIXTURE_EXPIRY = "2099-01-01T00:00:00.000Z";

export const anonymousSession = null;

export const userSession = {
  user: {
    id: "user-test-id",
    name: "Regular User",
    email: "user@example.test",
    role: "USER",
  },
  expires: FIXTURE_EXPIRY,
} satisfies Session;

export const adminSession = {
  user: {
    id: "admin-test-id",
    name: "Admin User",
    email: "admin@example.test",
    role: "ADMIN",
  },
  expires: FIXTURE_EXPIRY,
} satisfies Session;

function getSessionMock() {
  if (!vi.isMockFunction(getSession)) {
    throw new Error(
      'Session test helpers require vi.mock("@/lib/auth", () => ({ getSession: vi.fn() })) in the test file.'
    );
  }

  return vi.mocked(getSession);
}

export function mockSession(session: Session | null) {
  const mockedGetSession = getSessionMock();
  mockedGetSession.mockResolvedValue(session);
  return mockedGetSession;
}

export function resetSessionMock() {
  getSessionMock().mockReset();
}
