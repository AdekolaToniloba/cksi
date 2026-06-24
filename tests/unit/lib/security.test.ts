import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";

import { SecurityUtils } from "@/lib/security";

describe("SecurityUtils", () => {
  it("generates random tokens with the requested byte length", () => {
    const firstToken = SecurityUtils.generateSecureToken(16);
    const secondToken = SecurityUtils.generateSecureToken(16);

    expect(firstToken).toMatch(/^[a-f0-9]{32}$/);
    expect(secondToken).toMatch(/^[a-f0-9]{32}$/);
    expect(firstToken).not.toBe(secondToken);
  });

  it("hashes data with SHA-256", () => {
    const input = "backend-test-toolchain";
    const expected = createHash("sha256").update(input).digest("hex");

    expect(SecurityUtils.hashData(input)).toBe(expected);
  });

  it("escapes markup-sensitive characters", () => {
    expect(SecurityUtils.sanitizeInput(`<a href="/">'test'</a>`)).toBe(
      "&lt;a href=&quot;&#x2F;&quot;&gt;&#x27;test&#x27;&lt;&#x2F;a&gt;"
    );
  });
});
