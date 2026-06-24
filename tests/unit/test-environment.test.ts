import { describe, expect, it } from "vitest";

describe("test environment safeguards", () => {
  it("maps only explicit test database URLs", () => {
    expect(process.env.DATABASE_URL).toBe(process.env.TEST_DATABASE_URL);
    expect(process.env.DIRECT_URL).toBe(
      process.env.TEST_DIRECT_URL ?? process.env.TEST_DATABASE_URL
    );
  });

  it("removes real provider credentials", () => {
    expect(process.env.PAYSTACK_SECRET_KEY).toBeUndefined();
    expect(process.env.CLOUDINARY_API_SECRET).toBeUndefined();
    expect(process.env.GOOGLE_PRIVATE_KEY).toBeUndefined();
  });

  it("blocks unmocked external HTTP requests", async () => {
    await expect(fetch("https://example.com")).rejects.toThrow(
      "External HTTP is disabled in tests."
    );
  });
});
