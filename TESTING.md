# Backend testing

CKSI uses Vitest for Node-based unit and integration tests.

## Commands

```bash
pnpm test
pnpm test:watch
pnpm test:coverage
```

Tests live under `tests/`. Shared test setup belongs in `tests/setup/`, and
backend unit tests mirror their application path under `tests/unit/`.
Reusable test helpers belong in `tests/helpers/`, including provider fixtures
and mocked payload builders. Test-only TypeScript configuration is defined in
`tsconfig.test.json`.

## Environment isolation

Vitest runs in `test` mode and loads `tests/setup/environment.ts` before test
modules. The setup removes runtime database and provider credentials, disables
unmocked HTTP requests, and maps only these test-specific variables:

- `TEST_DATABASE_URL` to `DATABASE_URL`
- `TEST_DIRECT_URL` to `DIRECT_URL`

Copy `.env.test.example` to the ignored `.env.test.local` file when a local
integration test needs PostgreSQL. The guard rejects non-PostgreSQL URLs and
database names that do not contain `test`. Unit tests should mock repositories
and provider adapters and should not need any database URL or provider secret.
Paystack, Cloudinary, and Google Sheets mocks should reuse the shared fixtures
in `tests/helpers/providers.ts` instead of open-coding provider payloads in
each test file.

CI runs the sample service test without database credentials or external
provider credentials. A test that needs a provider must supply an explicit
mock; unmocked `fetch` calls fail.

## Database isolation and reset

Database integration tests must use a disposable database dedicated to the
current developer or CI job. Never point `TEST_DATABASE_URL` or
`TEST_DIRECT_URL` at production, staging, or a shared development database.

Apply committed Prisma migrations to the disposable database before the test
suite. Prefer transaction rollback for tests that stay on one connection. For
route tests that span connections, delete or truncate only the fixtures created
by that test in `afterEach`, respecting foreign-key order. CI should provision a
fresh database per job and discard it after the job.

Do not run `prisma migrate reset` automatically from the test command. A reset
is destructive and must remain an explicit action against a verified disposable
test database.
