# CKSI Backend Fix Epics

## Purpose

This document converts the findings in `BACKEND_AUDIT_CKSI.md` into an ordered implementation backlog. Each task is intended to be small enough to implement, review, test, and deploy independently.

The plan has four primary outcomes:

1. Close authorization, payment, upload, and data-exposure vulnerabilities.
2. Make backend behavior consistent, validated, and testable.
3. Record durable structured logs, audit events, and operational metrics for every backend flow.
4. Provide protected admin pages for logs, metrics, health, and operational investigation.

## Priority definitions

- **P0 — Release blocker:** exploitable authorization issue, payment-integrity issue, exposed personal data, or predictable privileged credentials.
- **P1 — High:** reliability or security weakness likely to cause data loss, inconsistent state, abuse, or an undiagnosed outage.
- **P2 — Medium:** scalability, maintainability, or contract issue that should be completed after P0/P1 work.
- **P3 — Improvement:** valuable hardening that can follow the core remediation.

## Working rules

- Implement tasks in dependency order unless a task explicitly says it can run in parallel.
- Each task should include code, automated tests, logging/metrics instrumentation, and documentation changes relevant to that task.
- No sensitive route is considered fixed until an authorization test proves anonymous and non-admin access is rejected.
- No backend flow is considered complete until success, failure, latency, and relevant business outcomes are observable.
- Logs must not contain passwords, session tokens, authorization headers, Paystack secrets, raw webhook signatures, or unnecessary personal data.
- Use stable event names and metric names. Do not build dashboards from message text.
- Prefer thin route handlers over business logic embedded directly in `route.ts`.

## Target backend flow

```text
Request
  -> request ID / telemetry wrapper
  -> authentication and authorization
  -> Zod request validation
  -> domain service
  -> Prisma repository or external-provider adapter
  -> structured response
  -> durable log, audit event, and metric recording
```

## Global definition of done

A task is complete when:

- [ ] The implementation is merged without weakening existing authorization.
- [ ] Unit or integration tests cover the happy path and relevant failure paths.
- [ ] Type checking, linting, tests, and production build pass.
- [ ] Expected errors return a stable error code and appropriate HTTP status.
- [ ] Logs are structured, redacted, and include a request/correlation ID.
- [ ] Relevant counters and latency measurements are recorded.
- [ ] Database changes include a reviewed Prisma migration and rollback notes.
- [ ] New environment variables are documented in `.env.example`.
- [ ] User-facing or operational behavior is documented where needed.

---

# Epic 0 — Testing and remediation safety net

**Priority:** P0  
**Goal:** Establish enough automated coverage to fix critical routes without introducing regressions.

## BE-0001: Add the backend test toolchain

- [x] Add a unit/integration test runner compatible with Next.js 15 and TypeScript.
- [x] Add scripts for `test`, `test:watch`, and `test:coverage`.
- [x] Add a separate test environment file strategy.
- [x] Document how tests isolate or reset database data.

**Acceptance criteria**

- A sample route/service test runs locally and in CI.
- Tests do not connect to the production database or real external providers.

**Implementation status:** Complete — 2026-06-23

**Evidence:** `vitest.config.ts`, `tests/setup/environment.ts`, `tests/unit/lib/security.test.ts`, `tests/unit/test-environment.test.ts`, `.github/workflows/backend-tests.yml`, `TESTING.md`

**Verification:** `pnpm test`, `CI=1 pnpm test`, `pnpm test:coverage`, `pnpm exec tsc --noEmit --pretty false -p tsconfig.test.json`, `pnpm build`

**Notes:** The test setup removes runtime database/provider credentials, accepts only explicitly named PostgreSQL test URLs whose database name contains `test`, and blocks unmocked HTTP. Repository-wide TypeScript and lint gates still fail on pre-existing issues tracked under CTX-008; BE-0004 remains unstarted.

## BE-0002: Add reusable authentication test helpers

- [x] Add fixtures for anonymous, normal-user, and admin sessions.
- [x] Add helpers for calling route handlers with query parameters and JSON bodies.
- [x] Add assertions for `401`, `403`, validation failures, and successful admin access.

**Implementation status:** Complete — 2026-06-23

**Evidence:** `tests/helpers/auth.ts`, `tests/helpers/routes.ts`, `tests/helpers/assertions.ts`, `tests/unit/helpers/backend-test-helpers.test.ts`, `tests/integration/app/api/donations/list/route.test.ts`, `tests/integration/app/api/volunteer/route.test.ts`

**Verification:** `pnpm test tests/unit/helpers/backend-test-helpers.test.ts tests/integration/app/api/donations/list/route.test.ts tests/integration/app/api/volunteer/route.test.ts`, `pnpm test`, `CI=1 pnpm test`, `pnpm exec tsc --noEmit --pretty false -p tsconfig.test.json`, `pnpm build`

**Notes:** The reusable auth fixtures and route helpers now cover current `401` admin-route behavior and are already shaped for future `403` route assertions once BE-0101 standardizes the API guard. Repository-wide TypeScript and lint gates still fail on pre-existing issues tracked under CTX-008 and do not block the helper layer itself.

## BE-0003: Add provider mocks

- [x] Mock Paystack verification and webhook payloads.
- [x] Mock Cloudinary upload/delete behavior.
- [x] Mock Google Sheets writes.
- [x] Cover provider success, timeout, invalid response, and failure.

**Implementation status:** Complete — 2026-06-23

**Evidence:** `tests/helpers/providers.ts`, `tests/unit/lib/paystack.test.ts`, `tests/integration/app/api/webhooks/paystack/route.test.ts`, `tests/integration/app/api/storage/cloudinary/upload/route.test.ts`, `tests/integration/app/api/google-sheets-routes.test.ts`, `TESTING.md`

**Verification:** `pnpm test tests/unit/lib/paystack.test.ts tests/integration/app/api/webhooks/paystack/route.test.ts tests/integration/app/api/storage/cloudinary/upload/route.test.ts tests/integration/app/api/google-sheets-routes.test.ts`, `pnpm test`, `CI=1 pnpm test`, `pnpm exec tsc --noEmit --pretty false -p tsconfig.test.json`, `pnpm build`

**Notes:** The shared provider fixtures now cover Paystack adapter responses and signed webhook payloads, Cloudinary upload/delete behavior, and Google Sheets append writes across success, timeout, invalid-response, and failure paths without touching runtime code. Repository-wide TypeScript and lint gates still fail on pre-existing issues tracked under CTX-008; BE-0004 remains unstarted.

## BE-0004: Add the CI quality gate

- [ ] Run type checking, linting, tests, and `next build`.
- [ ] Fail CI when a migration is required but missing.
- [ ] Publish test results and coverage artifacts.

---

# Epic 1 — Close authorization and personal-data exposure

**Priority:** P0  
**Depends on:** BE-0001, BE-0002  
**Goal:** Enforce server-side authorization on every private route.

## BE-0101: Standardize API authorization

- [ ] Make `requireAdminAuthAPI` the single guard for protected route handlers.
- [ ] Return `401` when no valid session exists.
- [ ] Return `403` when a valid user lacks the `ADMIN` role.
- [ ] Keep redirect-based authorization only for pages and server actions.
- [ ] Add a helper or wrapper that makes forgetting the API guard difficult.

**Acceptance criteria**

- Redirect exceptions cannot be caught and converted into `500` responses in API routes.
- Authorization failures produce a structured log and increment an authorization-failure metric.

## BE-0102: Protect volunteer record routes

**Files:** `app/api/volunteer/[id]/route.ts`

- [ ] Protect `GET`, `PATCH`, and `DELETE`.
- [ ] Validate the volunteer ID and patch body.
- [ ] Record an audit event for status changes and deletion.
- [ ] Do not include unnecessary personal fields in logs.

**Tests**

- [ ] Anonymous requests receive `401`.
- [ ] Non-admin requests receive `403`.
- [ ] Admin requests can read and update a record.
- [ ] Missing records return `404`.

## BE-0103: Protect and minimize volunteer metrics

**Files:** `app/api/volunteer/metrics/route.ts`

- [ ] Require admin authorization.
- [ ] Return aggregate counts by default.
- [ ] Remove full volunteer objects from `recentSubmissions`.
- [ ] If recent activity is needed, return only ID, status, capacity, and timestamp.

## BE-0104: Protect hero mutations

**Files:** `app/api/hero/route.ts`, `app/api/hero/[id]/route.ts`

- [ ] Keep public reads public.
- [ ] Require admin access for `POST`, `PUT`/`PATCH`, and `DELETE`.
- [ ] Audit create, update, reorder, activation, and deletion actions.

## BE-0105: Protect homepage mutations

**Files:** `app/api/homepage/route.ts`, `app/api/homepage/[id]/route.ts`

- [ ] Keep public reads public.
- [ ] Require admin access for every mutation.
- [ ] Audit create, update, reorder, and deletion actions.

## BE-0106: Protect administrative health, metrics, and future logs routes

**Files:** `app/api/admin/health/route.ts`, `app/api/admin/metrics/route.ts`

- [ ] Require admin authorization for diagnostic details.
- [ ] Create a minimal public liveness endpoint that exposes no logs, metrics, configuration, or dependency details.
- [ ] Add a checklist requiring explicit authorization to every new `app/api/admin/**` route.

## BE-0107: Create an authorization route inventory test

- [ ] Maintain a list of protected routes and methods.
- [ ] Automatically test anonymous rejection for every listed route.
- [ ] Fail tests when a newly added admin route is not classified.

---

# Epic 2 — Remove predictable credentials and harden admin login

**Priority:** P0  
**Depends on:** Epic 1  
**Goal:** Remove default privileged credentials and reduce credential-guessing risk.

## BE-0201: Remove hard-coded admin passwords

**Files:** `prisma/seed.ts`, `scripts/create-admin.js`

- [ ] Remove `admin123` and every other default password.
- [ ] Require admin email and password through protected environment variables or secure interactive input.
- [ ] Enforce a strong minimum password length.
- [ ] Stop logging the created user object or password hash.
- [ ] Fail safely when credentials are missing.

## BE-0202: Add shared login rate limiting

- [ ] Rate-limit by trusted client IP.
- [ ] Add a second limit keyed by normalized email/account.
- [ ] Use the shared Redis/Upstash limiter from Epic 8.
- [ ] Return a generic login error that does not reveal whether an account exists.

## BE-0203: Record authentication security events

- [ ] Record successful login, failed login, logout, rate-limit rejection, and disabled/unauthorized-role login.
- [ ] Store actor ID when known and a one-way hash or masked form of the attempted email when unknown.
- [ ] Add `auth.login.success`, `auth.login.failed`, and `auth.login.rate_limited` metrics.
- [ ] Never record passwords, cookies, JWTs, or full request headers.

---

# Epic 3 — Make donation and Paystack reconciliation trustworthy

**Priority:** P0  
**Depends on:** Epic 0, Epic 6 database foundations  
**Goal:** Ensure only the correct successful Paystack transaction can complete a donation.

## BE-0301: Define donation state transitions

- [ ] Document allowed state transitions.
- [ ] Add `VERIFICATION_ERROR`, `ABANDONED`, and any required refund/reversal states.
- [ ] Make `COMPLETED` terminal except through an explicit refund/reversal operation.
- [ ] Add a migration and transition tests.

## BE-0302: Create a central payment reconciliation service

- [ ] Move completion logic out of route handlers.
- [ ] Fetch the pending donation by its generated unique payment reference.
- [ ] Verify provider status, reference, expected amount in kobo, currency, and customer email where available.
- [ ] Return typed mismatch reasons.
- [ ] Perform the state update atomically and safely under concurrent calls.

**Acceptance criteria**

- A successful Paystack reference cannot complete a different donation.
- Mismatched amount or currency never updates the donation to `COMPLETED`.
- Repeated successful reconciliation is idempotent.

## BE-0303: Fix the browser verification route

**Files:** `app/api/donations/verify/route.ts`

- [ ] Stop trusting an unrelated `donation_id` supplied by the browser.
- [ ] Call the central reconciliation service.
- [ ] Apply request validation and rate limiting.
- [ ] Add an explicit Paystack request timeout.
- [ ] Keep the donation pending or mark `VERIFICATION_ERROR` on provider/network failure.
- [ ] Return `503` for temporary provider outages.

## BE-0304: Make webhook processing durable and idempotent

**Files:** `app/api/webhooks/paystack/route.ts`

- [ ] Continue verifying the Paystack signature before parsing/processing the event.
- [ ] Persist a stable provider event identifier or deterministic event fingerprint.
- [ ] Reject or safely acknowledge duplicates.
- [ ] Use the central reconciliation service for successful charges.
- [ ] Enforce allowed state transitions for failed charges.
- [ ] Rethrow durable-processing failures and return non-2xx so Paystack can retry.
- [ ] Store processing attempts, timestamps, and final outcomes.

## BE-0305: Add payment integrity logging and metrics

- [ ] Log donation ID, internal reference, provider reference, provider status, duration, and outcome.
- [ ] Never log secret keys, raw signatures, or full provider payloads containing personal data.
- [ ] Record counters for verification success, mismatch by reason, provider failure, webhook duplicate, webhook retry, and illegal state transition.
- [ ] Record Paystack latency distributions.
- [ ] Create an alert condition for any amount/reference/currency mismatch.

## BE-0306: Add stale-payment reconciliation

- [ ] Add a protected scheduled endpoint or deployment-platform cron job.
- [ ] Find stale `PENDING` and `VERIFICATION_ERROR` donations in bounded batches.
- [ ] Recheck Paystack with retries and backoff.
- [ ] Mark genuinely abandoned attempts according to the transition policy.
- [ ] Record job start, finish, scanned count, repaired count, failed count, and duration.

## BE-0307: Resolve the monthly-donation product gap

- [ ] Decide whether recurring donations are in scope now.
- [ ] If yes, model Paystack customer, plan/subscription, authorization, invoice, and cancellation data.
- [ ] If no, remove or clearly disable the monthly option until it is implemented.
- [ ] Add end-to-end tests for the selected behavior.

---

# Epic 4 — Secure and reconcile media uploads

**Priority:** P1  
**Depends on:** Epic 1, Epic 5  
**Goal:** Prevent upload abuse, memory exhaustion, and Cloudinary/database divergence.

## BE-0401: Add server-side upload policy

- [ ] Define allowed image/video MIME types and extensions.
- [ ] Define separate maximum byte sizes for images and videos.
- [ ] Define maximum image dimensions and video duration where practical.
- [ ] Normalize and validate `eventId`, filenames, and media metadata.
- [ ] Reject unknown or conflicting `mediaType` values.

## BE-0402: Inspect actual file content

- [ ] Validate magic bytes/file signatures.
- [ ] Decode or probe supported images where practical.
- [ ] Do not rely on browser MIME type or filename extension.
- [ ] Add malformed, spoofed, oversized, and unsupported-file tests.

## BE-0403: Move to signed direct Cloudinary uploads

- [ ] Create an admin-only endpoint that issues short-lived signed upload parameters.
- [ ] Verify the gallery event exists before issuing a signature.
- [ ] Restrict folder, resource type, file size, format, and transformation options.
- [ ] Avoid buffering entire uploads in Next.js server memory.
- [ ] Lock down or remove unsigned public upload presets.

## BE-0404: Add upload finalization and compensation

- [ ] Create a finalization endpoint/service that verifies the Cloudinary result.
- [ ] Store the database media row once.
- [ ] Use an idempotency key to prevent duplicate retry records.
- [ ] Delete the Cloudinary asset if database finalization fails.
- [ ] Record cleanup failures for retry.

## BE-0405: Make media and event deletion consistent

- [ ] Fetch associated Cloudinary public IDs before database deletion.
- [ ] Define whether storage deletion or database deletion occurs first.
- [ ] Record failed cleanup in a durable cleanup queue/table.
- [ ] Add a retry job for failed Cloudinary deletions.
- [ ] Test event cascade deletion and partial Cloudinary failure.

## BE-0406: Add upload observability

- [ ] Record actor ID, event ID, resource type, bytes, duration, Cloudinary result, database result, and cleanup result.
- [ ] Add metrics for accepted/rejected uploads, rejected reason, bytes, latency, provider failures, and orphan cleanup.
- [ ] Do not store signed upload parameters or secrets in logs.

---

# Epic 5 — Enforce validation and safe API contracts

**Priority:** P1  
**Depends on:** Epic 0  
**Goal:** Validate every server entry point and return predictable errors.

## BE-0501: Create shared request/query schemas

- [ ] Add Zod schemas for donations, contact, newsletter, gallery, media, hero, homepage, and admin filters.
- [ ] Reuse the existing volunteer schema.
- [ ] Enforce string lengths, normalized emails, URLs, dates, enum values, currencies, and positive amounts.
- [ ] Validate request bodies before sanitization or database access.

## BE-0502: Bound pagination and filters

- [ ] Coerce and validate page, cursor, offset, and limit.
- [ ] Set a default and hard maximum page size.
- [ ] Reject negative, zero, `NaN`, and extreme values.
- [ ] Prefer cursor pagination for growing datasets.

## BE-0503: Standardize response envelopes

- [ ] Define shared success, error, and pagination shapes.
- [ ] Include a stable machine-readable error code and request ID.
- [ ] Map validation to `400`, unauthenticated to `401`, unauthorized to `403`, missing to `404`, conflict to `409`, rate limit to `429`, dependency failure to `503`, and unexpected errors to `500`.
- [ ] Use `201` for resource creation.

## BE-0504: Stop ingest-time HTML encoding

- [ ] Store validated original text.
- [ ] Escape content at the rendering boundary.
- [ ] Sanitize only fields intentionally supporting HTML.
- [ ] Add tests for legitimate names/text containing punctuation and special characters.

## BE-0505: Prevent Google Sheets formula injection

**Files:** contact and newsletter routes

- [ ] Use `RAW` writes where compatible.
- [ ] Otherwise prefix/escape values beginning with `=`, `+`, `-`, or `@`.
- [ ] Apply length limits and normalization before writing.
- [ ] Add provider timeout and failure handling.

## BE-0506: Fix dynamic route parameter handling

- [ ] Update Next.js 15 dynamic handlers to await `params` consistently.
- [ ] Add route tests proving IDs are read correctly.

## BE-0507: Establish API compatibility/versioning

- [ ] Document current contracts as implicit v1.
- [ ] Keep business services independent from route path/version.
- [ ] Add `/api/v1` wrappers when contracts are standardized.
- [ ] Reserve v2 for intentionally breaking changes.

---

# Epic 6 — Establish safe database foundations

**Priority:** P1  
**Goal:** Make schema changes reproducible and eliminate unsafe money storage and duplicate clients.

## BE-0601: Baseline Prisma migrations

- [ ] Compare the deployed database with `prisma/schema.prisma`.
- [ ] Create and review a baseline migration without destroying production data.
- [ ] Commit all future migrations.
- [ ] Document deployment, rollback, backup, and recovery steps.
- [ ] Document `DIRECT_URL` in `.env.example`.

## BE-0602: Replace floating-point donation amounts

- [ ] Select integer kobo as the canonical storage format, or use a fixed-precision decimal.
- [ ] Add the new field without immediately removing the old field.
- [ ] Backfill and verify every existing donation.
- [ ] Temporarily dual-read/dual-write if needed for a safe deployment.
- [ ] Switch reconciliation and reporting to exact values.
- [ ] Remove the old float field in a later migration.

## BE-0603: Consolidate Prisma clients

**Files:** `lib/prisma.ts`, `lib/db/index.ts`

- [ ] Select one singleton implementation.
- [ ] Migrate every import to it.
- [ ] Remove the second connection pool.
- [ ] Keep consistent query logging and environment behavior.
- [ ] Verify health checks and all services use the same client.

## BE-0604: Add query-driven indexes

- [ ] Add `Donation(status, createdAt)`.
- [ ] Add `Volunteer(email, createdAt)`.
- [ ] Add `Volunteer(status, createdAt)` and evaluate `(capacity, createdAt)`.
- [ ] Add `GalleryEvent(isPublished, eventDate)`.
- [ ] Add `GalleryMedia(eventId, isPublished, orderIndex)`.
- [ ] Add `BlogPost(status, createdAt)` and evaluate `(category, status, createdAt)`.
- [ ] Add `HeroCarousel(isActive, orderIndex)`.
- [ ] Add `HomepageContent(section, orderIndex)`.
- [ ] Add missing foreign-key indexes.
- [ ] Remove redundant indexes already provided by unique constraints.

## BE-0605: Fix check-then-insert races

- [ ] Define the intended volunteer duplicate rule.
- [ ] Add a database-backed idempotency or uniqueness strategy.
- [ ] Handle unique conflicts as `409`.
- [ ] Make blog/gallery slug creation retry on unique collision.
- [ ] Test simultaneous submissions.

---

# Epic 7 — Durable structured logging and audit trail

**Priority:** P1  
**Depends on:** Epic 6  
**Goal:** Replace process-local logging with searchable, durable, redacted operational and audit data.

## Architecture decision

Use two distinct event types:

- **Operational logs:** application behavior, request failures, provider calls, jobs, and diagnostics. These have a limited retention period and may later be exported to a managed observability provider.
- **Audit events:** durable records of security-sensitive admin and system actions. These have stricter retention and are not editable from the admin UI.

The first implementation may use PostgreSQL for searchable admin logs, provided writes are bounded, indexed, retention-controlled, and non-blocking. Keep the logger transport-based so production can later add Sentry, Axiom, Datadog, OpenTelemetry, or another managed provider without changing route code.

## BE-0701: Define the structured event contract

- [ ] Define fields: event name, severity, timestamp, request ID, trace ID, route, method, status, duration, actor ID, actor role, entity type, entity ID, outcome, safe metadata, environment, and release.
- [ ] Define stable event-name conventions such as `donation.verify.completed`.
- [ ] Define severity and outcome enums.
- [ ] Define which fields are searchable and indexable.

## BE-0702: Define redaction and data-classification rules

- [ ] Create a denylist for passwords, tokens, cookies, authorization headers, secrets, signatures, and provider credentials.
- [ ] Mask or hash email, phone, and IP fields where full values are unnecessary.
- [ ] Prevent raw request/response bodies from being logged by default.
- [ ] Add unit tests proving sensitive keys are removed recursively.
- [ ] Define who can view operational logs versus audit logs.

## BE-0703: Add durable log and audit models

- [ ] Add Prisma models for operational logs and audit events, or configure the selected external log store.
- [ ] Add indexes for timestamp, level, event name, request ID, actor ID, entity, route, and outcome.
- [ ] Make audit records append-only at the application layer.
- [ ] Add retention fields/policies.
- [ ] Add a migration and realistic query-volume test.

## BE-0704: Replace the in-memory logger with transports

**Files:** `lib/monitoring/logger.ts`

- [ ] Keep one structured logging interface.
- [ ] Add console JSON output for platform ingestion.
- [ ] Add a durable asynchronous transport.
- [ ] Make logging failure non-fatal to the business request while emitting a fallback console error.
- [ ] Batch or buffer writes safely to avoid one blocking database query per low-value log.
- [ ] Remove the process-local `logs` array as the source of truth.

## BE-0705: Add request IDs and correlation

- [ ] Accept a trusted incoming request ID only when appropriate; otherwise generate one.
- [ ] Return the request ID in response headers and error envelopes.
- [ ] Pass correlation context through routes, services, Prisma operations, provider adapters, and jobs.
- [ ] Include Paystack references and Cloudinary public IDs only as safe correlation fields.

## BE-0706: Create a route instrumentation wrapper

- [ ] Wrap route handlers without hiding their final response status.
- [ ] Record route, method, status, duration, request ID, actor, and outcome.
- [ ] Record uncaught errors with normalized error type and stack in server-only storage.
- [ ] Avoid duplicate logs when domain services already record the business event.
- [ ] Replace or remove the existing inaccurate/unused monitoring middleware.

## BE-0707: Instrument every backend domain

- [ ] Authentication and authorization.
- [ ] Donations, verification, webhooks, exports, and reconciliation jobs.
- [ ] Volunteers and admin review actions.
- [ ] Gallery events, media uploads, finalization, and cleanup.
- [ ] Hero and homepage changes.
- [ ] Blog and program mutations.
- [ ] Contact and newsletter submissions.
- [ ] Google Sheets, Paystack, Cloudinary, and database dependency failures.
- [ ] Health checks and scheduled jobs.

**Acceptance criteria**

- Every route records request count, status, and latency.
- Every admin mutation produces an audit event with actor and target.
- Every external-provider call records provider, operation, duration, and outcome.
- Sensitive data tests pass.

## BE-0708: Add log retention and cleanup

- [ ] Define retention by severity and event type.
- [ ] Add a scheduled bounded cleanup/archive job.
- [ ] Never let cleanup delete protected audit records earlier than policy permits.
- [ ] Log and measure cleanup execution.

---

# Epic 8 — Durable metrics, rate limiting, health, and alerting

**Priority:** P1  
**Depends on:** Epic 7  
**Goal:** Make operational metrics representative across all processes and deployments.

## BE-0801: Define the metric catalog

- [ ] Define names, descriptions, units, labels, owners, and alert thresholds.
- [ ] Avoid unbounded/high-cardinality labels such as raw email, request ID, or database ID.
- [ ] Standardize request, provider, business, security, upload, and job metrics.

**Minimum catalog**

- HTTP requests, errors, and latency by route/method/status.
- Database query/error/connection-pool metrics where available.
- Paystack verification/webhook success, failure, duplicate, mismatch, and latency.
- Pending-donation age and stale count.
- Upload count, rejected count/reason, bytes, latency, and orphan cleanup.
- Login failure, authorization failure, and rate-limit rejection.
- Google Sheets, Cloudinary, and Paystack dependency latency/failure.
- Admin mutation and audit-event counts.

## BE-0802: Replace the process-local metric collector

**Files:** `lib/monitoring/metrics.ts`

- [ ] Select a durable/shared metrics backend or time-bucket aggregation model.
- [ ] Support counters, gauges, and latency histograms/distributions.
- [ ] Remove the in-memory array as the source of truth.
- [ ] Remove randomized `active_connections`.
- [ ] Measure only values that can be obtained accurately.

## BE-0803: Add shared Upstash rate limiting

- [ ] Create named limit policies for public submissions, login, donation verification, uploads, exports, health, and admin diagnostics.
- [ ] Use trusted platform IP extraction.
- [ ] Add account/email keys where appropriate.
- [ ] Return standard `429` errors and rate-limit headers.
- [ ] Record allowed/rejected metrics without logging raw sensitive identifiers.

## BE-0804: Split liveness, readiness, and private diagnostics

- [ ] Public liveness only confirms the process can respond.
- [ ] Readiness checks critical dependencies without exposing detail publicly.
- [ ] Private admin diagnostics show dependency status, latency, and last failure.
- [ ] Add strict timeouts so health checks do not hang.
- [ ] Do not include raw recent logs in public health responses.

## BE-0805: Configure alerts

- [ ] Alert on elevated `5xx` rate and latency.
- [ ] Alert on payment mismatch events.
- [ ] Alert on webhook processing failures/backlog.
- [ ] Alert on stale pending donations.
- [ ] Alert on repeated admin login failures and authorization failures.
- [ ] Alert on upload cleanup backlog and provider outage.
- [ ] Document alert owner and first-response runbook.

---

# Epic 9 — Admin logs, metrics, and operations pages

**Priority:** P1  
**Depends on:** Epics 1, 7, and 8  
**Goal:** Give authorized administrators a useful and safe operational console.

## BE-0901: Add protected log-query API

**Suggested route:** `GET /api/admin/logs`

- [ ] Require admin authorization.
- [ ] Support cursor pagination.
- [ ] Filter by time range, severity, event name, route, status, outcome, request ID, actor, and entity.
- [ ] Apply a hard maximum page size and maximum time range.
- [ ] Return only redacted fields.
- [ ] Record access to logs as an audit event.

## BE-0902: Add protected log-detail API

**Suggested route:** `GET /api/admin/logs/[id]`

- [ ] Return one redacted log plus correlated events by request ID.
- [ ] Show related audit event/entity links where authorized.
- [ ] Do not expose stack traces or internal metadata that should remain server-only unless explicitly allowed.

## BE-0903: Build the admin Logs page

**Suggested page:** `app/admin/logs/page.tsx`

- [ ] Add “Logs” to desktop and mobile admin navigation.
- [ ] Show timestamp, severity, event, route, status, duration, outcome, and request ID.
- [ ] Add search/filter controls matching the API.
- [ ] Add cursor pagination and empty/error/loading states.
- [ ] Add severity and outcome badges.
- [ ] Add an expandable detail panel with correlated events.
- [ ] Make the table usable on mobile and keyboard accessible.
- [ ] Never provide a UI action to edit or delete individual audit records.

## BE-0904: Build the admin Metrics page

**Suggested page:** `app/admin/metrics/page.tsx`

- [ ] Add “Metrics” to admin navigation.
- [ ] Add selectable time ranges.
- [ ] Show request volume, error rate, latency percentiles, login failures, payment outcomes, stale donations, upload outcomes, and dependency health.
- [ ] Use real measured values only.
- [ ] Make charts resilient to missing time buckets.
- [ ] Link anomalous metric periods to filtered logs where possible.

## BE-0905: Build the admin Audit Trail page

**Suggested page:** `app/admin/audit/page.tsx`

- [ ] Show admin/system actor, action, target, outcome, timestamp, and request ID.
- [ ] Filter by actor, action, entity type, outcome, and time range.
- [ ] Provide a before/after summary for safe fields on mutations.
- [ ] Keep sensitive field values redacted.

## BE-0906: Build the admin Operations/Health page

- [ ] Show database, Paystack, Cloudinary, Google Sheets, rate-limiter, logging, and metrics-store status.
- [ ] Show last successful check, latest failure, and measured latency.
- [ ] Show background-job status and cleanup/reconciliation backlog.
- [ ] Link failures to relevant logs and runbooks.

## BE-0907: Add dashboard operational summaries

**Files:** `app/admin/page.tsx`

- [ ] Remove demo data that masks backend/database failures.
- [ ] Show a clear unavailable state instead.
- [ ] Add cards for error rate, failed logins, stale donations, payment mismatches, and failed cleanup jobs.
- [ ] Link each card to filtered logs or metrics.

## BE-0908: Secure and test the operations UI

- [ ] Confirm unauthenticated users cannot render or fetch operational data.
- [ ] Confirm non-admin sessions receive `403`.
- [ ] Test filter validation and pagination.
- [ ] Test that secrets and personal data never appear in rendered log details.
- [ ] Add an accessibility check for tables, filters, dialogs, badges, and charts.

---

# Epic 10 — Service-layer and code-organization cleanup

**Priority:** P2  
**Depends on:** Critical route fixes  
**Goal:** Make secure behavior reusable instead of duplicating it across route handlers.

## BE-1001: Define backend module boundaries

- [ ] Use route/server action -> schema/auth -> domain service -> repository/provider adapter.
- [ ] Define where typed errors, telemetry, and transactions live.
- [ ] Document the pattern for new backend features.

## BE-1002: Consolidate donation code

- [ ] Remove duplicated direct Prisma/query-helper/service logic.
- [ ] Use one donation service and one Paystack adapter.
- [ ] Keep reconciliation rules in one place.

## BE-1003: Consolidate gallery/media code

- [ ] Centralize event creation, media finalization, ordering, and deletion.
- [ ] Centralize Cloudinary adapter and cleanup behavior.

## BE-1004: Consolidate volunteer and content mutations

- [ ] Move volunteer review/deletion into a domain service.
- [ ] Move hero/homepage mutation rules into services.
- [ ] Ensure services emit audit events rather than relying on UI callers.

## BE-1005: Add typed domain errors

- [ ] Add validation, unauthorized, forbidden, not-found, conflict, dependency, and invariant error types.
- [ ] Map them to API responses in one place.
- [ ] Preserve internal causes in server logs without exposing them to clients.

---

# Epic 11 — Performance and scalability hardening

**Priority:** P2  
**Depends on:** Epics 5, 6, and 8  
**Goal:** Prevent memory, payload, connection, and synchronous-provider bottlenecks.

## BE-1101: Paginate gallery and media reads

- [ ] Paginate public event lists.
- [ ] Separate event summaries from full media detail.
- [ ] Paginate large event media collections.
- [ ] Add stable ordering and cursor tests.

## BE-1102: Optimize gallery admin counts

- [ ] Replace transfer-and-count logic with database counts/grouping.
- [ ] Return only fields needed by list pages.

## BE-1103: Bound all bulk operations

- [ ] Keep donation export capped and make the cap explicit.
- [ ] Process jobs and cleanup in bounded batches.
- [ ] Add time-range limits to logs, metrics, and exports.

## BE-1104: Add external-provider resilience

- [ ] Add explicit timeouts to Paystack, Cloudinary, and Google APIs.
- [ ] Retry only safe/idempotent operations with exponential backoff and jitter.
- [ ] Add circuit-breaking or temporary suppression if a provider repeatedly fails.
- [ ] Record timeout/retry/circuit metrics.

## BE-1105: Review database connection behavior

- [ ] Verify the single Prisma client is appropriate for Neon/serverless deployment.
- [ ] Document pooled versus direct URLs.
- [ ] Measure connection saturation rather than inventing values.

---

# Epic 12 — Error handling, documentation, and production readiness

**Priority:** P2  
**Depends on:** All earlier epics  
**Goal:** Finish remediation with predictable failure behavior and operational documentation.

## BE-1201: Stop silent database failures

- [ ] Make homepage/content services propagate typed dependency errors.
- [ ] Return `503` or a deliberate cached fallback.
- [ ] Ensure empty content and unavailable content are distinguishable.

## BE-1202: Add runbooks

- [ ] Payment mismatch or webhook backlog.
- [ ] Stale pending donations.
- [ ] Cloudinary orphan cleanup backlog.
- [ ] Database outage or connection exhaustion.
- [ ] Google Sheets outage.
- [ ] Suspected account attack or repeated authorization failures.
- [ ] Logging/metrics pipeline failure.

## BE-1203: Add security and operations documentation

- [ ] Document route authorization policy.
- [ ] Document log redaction and retention.
- [ ] Document audit-log access policy.
- [ ] Document metric names and alert thresholds.
- [ ] Document secret rotation and admin provisioning.

## BE-1204: Run the final security regression

- [ ] Verify every protected route with anonymous, user, and admin sessions.
- [ ] Attempt payment-reference, amount, currency, and email mismatches.
- [ ] Attempt duplicate/out-of-order webhooks.
- [ ] Attempt MIME spoofing and oversized uploads.
- [ ] Attempt formula injection in contact/newsletter fields.
- [ ] Attempt extreme pagination and filter values.
- [ ] Verify no secret or prohibited personal data appears in logs.

## BE-1205: Run production-readiness verification

- [ ] Apply migrations to a production-like copy of the database.
- [ ] Verify backup and rollback procedures.
- [ ] Load-test high-risk routes and admin log queries.
- [ ] Verify alerts fire in a controlled test.
- [ ] Confirm log and metric retention jobs work.
- [ ] Confirm the admin operations pages remain usable during partial dependency failure.

---

# Recommended implementation sequence

## Milestone 1 — Immediate release blockers

1. Epic 0: testing safety net.
2. Epic 1: authorization and personal-data protection.
3. Epic 2: remove predictable credentials and instrument login security.
4. BE-0601 and BE-0602: migration baseline and exact money storage.
5. Epic 3: payment reconciliation and webhook correctness.

## Milestone 2 — Upload and input hardening

1. Epic 5: shared validation and response contracts.
2. Epic 4: signed uploads, file verification, and storage reconciliation.
3. BE-0603 through BE-0605: Prisma consolidation, indexes, and race fixes.

## Milestone 3 — Full observability

1. Epic 7: durable structured logs and audit trail.
2. Epic 8: durable metrics, shared rate limits, health, and alerts.
3. Epic 9: admin logs, metrics, audit, and operations pages.

## Milestone 4 — Maintainability and scale

1. Epic 10: service-layer cleanup.
2. Epic 11: performance and scalability.
3. Epic 12: runbooks, security regression, and production verification.

---

# Completion checklist

The full backend remediation is complete only when:

- [ ] Every sensitive route has enforced and tested server-side authorization.
- [ ] No predictable admin credential remains.
- [ ] Donation completion requires matching provider reference, amount, currency, status, and expected identity.
- [ ] Webhook processing is idempotent, durable, observable, and retryable.
- [ ] Upload limits and content checks are enforced server-side.
- [ ] Cloudinary and PostgreSQL cannot silently diverge without a recorded cleanup task.
- [ ] Every request body and query is validated and pagination is bounded.
- [ ] Money is stored exactly and schema migrations are tracked.
- [ ] One Prisma client and one domain path exist per feature.
- [ ] Shared rate limiting works across instances.
- [ ] Every backend route records request count, response status, latency, and errors.
- [ ] Every external-provider call records latency and outcome.
- [ ] Every admin mutation creates a durable audit event.
- [ ] Logs are durable, searchable, redacted, retained, and correlated by request ID.
- [ ] Metrics are durable/shared and contain no mock values.
- [ ] Protected admin Logs, Metrics, Audit Trail, and Operations pages are live.
- [ ] Alerts and incident runbooks cover payments, authentication, uploads, dependencies, and observability failures.
- [ ] Final security, migration, load, and recovery verification passes.
