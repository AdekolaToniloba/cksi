import { afterEach, vi } from "vitest";

const DATABASE_VARIABLES = [
  ["TEST_DATABASE_URL", "DATABASE_URL"],
  ["TEST_DIRECT_URL", "DIRECT_URL"],
] as const;

const PROVIDER_CREDENTIAL_VARIABLES = [
  "PAYSTACK_SECRET_KEY",
  "NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY",
  "CLOUDINARY_URL",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
  "NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET",
  "GOOGLE_SERVICE_ACCOUNT_EMAIL",
  "GOOGLE_PRIVATE_KEY",
  "CONTACT_SHEET_ID",
  "NEWSLETTER_SHEET_ID",
] as const;

function assertTestDatabaseUrl(variableName: string, value: string): void {
  let databaseUrl: URL;

  try {
    databaseUrl = new URL(value);
  } catch {
    throw new Error(`${variableName} must be a valid PostgreSQL URL.`);
  }

  const databaseName = databaseUrl.pathname.replace(/^\//, "").toLowerCase();
  const isPostgres =
    databaseUrl.protocol === "postgres:" ||
    databaseUrl.protocol === "postgresql:";

  if (!isPostgres || !databaseName.includes("test")) {
    throw new Error(
      `${variableName} must use PostgreSQL and a database name containing "test".`
    );
  }
}

for (const [testVariable, runtimeVariable] of DATABASE_VARIABLES) {
  const testValue = process.env[testVariable]?.trim();
  delete process.env[runtimeVariable];

  if (testValue) {
    assertTestDatabaseUrl(testVariable, testValue);
    process.env[runtimeVariable] = testValue;
  }
}

if (process.env.TEST_DATABASE_URL && !process.env.TEST_DIRECT_URL) {
  process.env.DIRECT_URL = process.env.TEST_DATABASE_URL;
}

for (const variableName of PROVIDER_CREDENTIAL_VARIABLES) {
  delete process.env[variableName];
}

const blockedFetch = vi.fn(async () => {
  throw new Error(
    "External HTTP is disabled in tests. Provide an explicit test mock."
  );
});

vi.stubGlobal("fetch", blockedFetch);

afterEach(() => {
  vi.clearAllMocks();
  vi.stubGlobal("fetch", blockedFetch);
});
