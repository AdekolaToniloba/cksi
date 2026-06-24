# Backend Audit: CKSI

## Architecture Overview

CKSI is a Next.js App Router application whose backend lives in the same repository as the frontend. HTTP endpoints are implemented as `route.ts` files under `app/api`, while blog administration also uses Next.js server actions in `actions/blog.ts`. PostgreSQL is accessed through Prisma. Authentication uses NextAuth's credentials provider with bcrypt password checks and JWT-backed sessions. Paystack handles donation payments, Cloudinary stores gallery and blog media, and Google Sheets stores contact and newsletter submissions.

The backend currently mixes two architectural styles. Some route handlers call Prisma directly, such as the donation, volunteer, and gallery APIs. Other features call service classes under `lib/db`, such as `HomepageService`. There are also two Prisma singleton implementations (`lib/prisma.ts` and `lib/db/index.ts`) and several overlapping donation abstractions. This works at the current scale, but it makes the expected path for new backend code unclear: a developer could reasonably put business logic in a route, a service class, or a standalone query helper.

The strongest foundations are the relational schema, Prisma's parameterized queries, NextAuth's role-bearing session, Paystack webhook signature verification, Zod validation on volunteers and blog posts, and some pagination and rate limiting. The most serious weaknesses are authorization gaps on several write and personal-data endpoints, insufficient binding between a successful Paystack transaction and the donation being marked complete, server-only validation gaps on uploads, and monitoring that is process-local rather than durable. This audit is based on the working tree as inspected; `prisma/schema.prisma` already contained uncommitted changes, which were not altered.

## Data Flow Walkthroughs

### 1. Donation submission and payment verification

1. The donor fills in `DonateForm` in `components/donate/donate-form.tsx`. `handleDonation` performs basic client checks for an email and a minimum amount of ₦100.
2. The browser sends `POST /api/donations/create` with snake_case fields such as `donor_email`, `donor_name`, and `donation_type`.
3. `POST` in `app/api/donations/create/route.ts` applies the in-memory `rateLimit` helper at 10 attempts per minute per detected IP. It parses JSON, manually checks the amount and email, HTML-encodes several strings through `SecurityUtils.sanitizeInput`, generates a payment reference, and inserts a `Donation` through `prisma.donation.create`.
4. The route returns the database ID, generated payment reference, and amount. It also records `donation_initiated` and `api_latency` in the in-memory metrics collector.
5. The browser opens Paystack Inline using `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY`, the generated reference, and an amount converted to kobo. This payment initialization occurs in the browser rather than through `PaystackAPI.initializeTransaction`.
6. Paystack's browser callback calls `verifyPayment`, which sends `POST /api/donations/verify` with the Paystack `reference` and the database `donation_id`.
7. `POST` in `app/api/donations/verify/route.ts` fetches the donation by ID, calls Paystack's transaction verification API with the server-side secret, and marks the donation `COMPLETED` or `FAILED`.
8. Independently, Paystack can send a signed event to `POST /api/webhooks/paystack`. That route verifies the HMAC signature and looks up the donation by its unique `paymentReference` before updating its status.

The intended design is sensible: create a pending local record first, let Paystack process the money, then reconcile the local status using both a browser callback and a webhook. The important integrity gap is in step 7. The verification route proves only that the supplied Paystack reference succeeded. It does not prove that `reference === donation.paymentReference`, nor does it compare Paystack's amount, currency, or customer email with the stored donation. A caller who obtains any successful reference and any donation ID could mark the wrong donation complete. The webhook path binds by reference and is safer, but it also does not compare amount or currency.

There is also a consistency issue around failures. A timeout or temporary Paystack error is treated as a definite failed payment and writes `FAILED`. A later webhook may correct that to `COMPLETED`, but webhook handlers swallow database errors and still let the outer route return success, so a failed update may never be retried.

### 2. Admin gallery image upload

1. An admin selects files in `app/admin/gallery/events/[id]/upload/page.tsx`. `handleFileSelect` accepts browser-reported image or video MIME types and rejects files larger than 100 MB.
2. `uploadSingleFile` first sends the file as multipart form data to `POST /api/storage/cloudinary/upload`, including `eventId` and a client-selected `mediaType`.
3. The upload route calls `requireAdminAuth`, reads the complete file into a Node.js `Buffer`, chooses Cloudinary's `image` or `video` resource type from the submitted `mediaType`, and uploads it into a folder derived from `eventId`.
4. Cloudinary returns the URL, public ID, dimensions, format, and file size. The browser then makes a second request to `POST /api/admin/gallery/events/[id]/media`.
5. The media route again calls `requireAdminAuth`, checks that the event exists, and creates a `GalleryMedia` row containing the Cloudinary URL and metadata.

This is an understandable two-stage design because Cloudinary owns the binary while PostgreSQL owns searchable metadata. The tradeoff is that the two writes are not atomic. If Cloudinary accepts the file but the database request fails, the asset remains in Cloudinary with no database record. Retrying can upload another copy. The route also relies on client-only type and size checks: a direct caller can bypass the 100 MB limit, claim an arbitrary `mediaType`, and make the server buffer the entire payload in memory. Cloudinary may reject some invalid content, but the application itself does not enforce an allowlist, inspect file signatures, scan content, or verify that the event exists before uploading.

Authentication is present, but the route uses the page-oriented `requireAdminAuth`, which redirects by throwing. Because the route catches every error, an unauthenticated request can be converted into a generic 500 response instead of a clean 401. The API-safe `requireAdminAuthAPI` already exists and demonstrates the intended API behavior.

### 3. Volunteer application and admin review

1. The public form in `components/volunteer/volunteer-form.tsx` uses the shared Zod schema from `lib/validations/volunteer.ts` and sends `POST /api/volunteer`.
2. `POST` in `app/api/volunteer/route.ts` rate-limits the detected IP to five submissions per minute and validates the body again with the same server-side Zod schema.
3. The route searches for the same email submitted in the previous 24 hours. If found, it returns 409; otherwise it creates the `Volunteer` and returns 201.
4. The admin list calls `GET /api/volunteer`, which uses `requireAdminAuthAPI`, supports status/capacity filters, and paginates with `skip` and `take`.
5. The admin UI updates a record through `PATCH /api/volunteer/[id]`.

Steps 1–4 show a good pattern: shared validation, server revalidation, a meaningful duplicate response, pagination, and an API-safe admin guard. The pattern breaks at step 5. `GET`, `PATCH`, and `DELETE` in `app/api/volunteer/[id]/route.ts` contain no authentication or authorization check. Anyone who can discover or obtain a volunteer CUID can read the applicant's name, email, phone, location, and free-text response, change the review status, or delete the record. `GET /api/volunteer/metrics` is also unauthenticated and returns `recentSubmissions`, including full volunteer records. This is both an access-control and personal-data exposure issue.

The 24-hour duplicate check is helpful for user experience but is not guaranteed by the database. Two requests for the same email can both pass the check before either insert commits. That is a race condition: application-level checking reduces duplicates but cannot fully prevent them without a database-backed idempotency or uniqueness strategy.

## Findings by Category

### 1. Data Flow

The main request flows are easy to follow because each feature has a recognizable entry point under `app/api`. Prisma calls are explicit, and external services are visible at the point of use. Volunteers have the most complete flow: shared Zod validation, a duplicate check, a database write, structured activity logs, and a 201 response.

Donation processing deliberately uses two completion paths: browser verification for immediate feedback and a signed webhook for eventual reconciliation. That is a sound payment architecture in principle because the browser alone should never be trusted as proof of payment. The implementation needs a stricter invariant: a donation may become `COMPLETED` only when the provider reference, expected amount, currency, and preferably customer identity all match the pending record. That invariant is not centralized, so the verification route and multiple webhook handlers update status independently.

Uploads use two separate remote writes—Cloudinary followed by PostgreSQL—with no compensation step. A compensation step means undoing the first action when the second fails, such as deleting the Cloudinary asset if the database insert fails. Without it, the system can accumulate orphaned paid storage.

### 2. API Design

Route organization is partly resource-oriented:

- `/api/gallery/events` and `/api/admin/gallery/events/[id]/media` model resources clearly.
- `/api/volunteer/[id]` uses `GET`, `PATCH`, and `DELETE` appropriately.
- `/api/donations/create`, `/api/donations/verify`, `/api/donations/list`, and `/api/donations/export` are action-oriented names. They are understandable, but a more consistent resource design would use `POST /donations`, `GET /donations`, and a clearly named payment verification or reconciliation subresource.
- `/api/hero` and `/api/homepage` mix public reads with administrative writes on the same route without enforcing admin access.

HTTP methods are generally meaningful rather than making every action a POST. There is some inconsistency between `PUT` for hero/homepage updates and `PATCH` for gallery/volunteer partial updates, even though all of these handlers accept partial bodies. On Next.js 15, the hero and homepage dynamic handlers also type `params` synchronously, while newer routes correctly await `Promise<{ id: string }>`. This inconsistency can produce undefined route parameters or build-time route type errors depending on the framework's generated types.

Status codes are mixed:

- Good examples include 201 for volunteer creation, 400 for validation, 404 for missing resources, 409 for a duplicate volunteer submission, 429 for rate limits, and 503 for unhealthy status.
- Donation and gallery creation return 200 rather than 201.
- Several update/delete handlers turn Prisma "record not found" errors into 500 instead of 404.
- Routes using `requireAdminAuth` can turn an authentication redirect into a caught 500. Routes using `requireAdminAuthAPI` correctly return 401.
- A temporary Paystack/network error is reported as 400, even though the client request may be valid and the dependency is unavailable.

Response shapes are not standardized. The code uses `{ success, data, error }`, `{ error }`, `{ events }`, `{ event }`, raw stat objects, and the bare upload response. Pagination is called `pagination` in the volunteer API and `meta` in donations. This forces every client to learn a different contract and makes cross-cutting error handling harder.

There is no API versioning strategy. A breaking rename such as changing donation snake_case fields to camelCase, changing an error envelope, or adding stricter validation would immediately affect the deployed frontend and any external consumer. A low-disruption approach would be:

1. Treat current routes as an implicit v1 and document their request/response contracts.
2. Move business logic into shared services and schemas so routes become thin adapters.
3. Add `/api/v1/...` routes that call those shared services while keeping current paths as compatibility wrappers.
4. Introduce `/api/v2/...` only for intentionally breaking contracts, then deprecate old paths with telemetry and a stated removal date.

### 3. Database Design

The Prisma schema models the main domains clearly:

- `User`, `Account`, `Session`, and `VerificationToken` support NextAuth.
- `BlogPost` belongs to a `User`.
- `GalleryEvent` owns many `GalleryMedia` records with cascade deletion in PostgreSQL.
- `Donation`, `Volunteer`, `Program`, `HeroCarousel`, and `HomepageContent` are independent feature entities.

Relations are normalized where relations genuinely exist. PostgreSQL arrays for blog tags, program achievements, and Cloudinary tags are a pragmatic denormalization: they avoid extra tables for values that are mostly displayed as a group. The cost is limited relational querying and validation of individual values. `HomepageContent` is deliberately generic, which makes sections flexible but gives the database little ability to prevent duplicate sections/order positions or malformed content. `campaignId` is a free string rather than a relation because there is no `Campaign` model.

The most important data-type issue is `Donation.amount Float`. Binary floating-point values can produce rounding errors and should not be the authoritative representation of money. An integer number of kobo or Prisma `Decimal` with a fixed database precision would preserve exact amounts.

Existing indexes cover many single-field filters, but several are redundant because `@unique` already creates an index (`BlogPost.slug`, `Program.slug`, and `GalleryEvent.slug`). More useful indexes would match actual multi-column query shapes:

- `Donation(status, createdAt)` for status-filtered lists, monthly counts, and ordered reporting.
- `Volunteer(email, createdAt)` for the 24-hour duplicate lookup.
- `Volunteer(status, createdAt)` and possibly `(capacity, createdAt)` for filtered admin lists.
- `GalleryEvent(isPublished, eventDate)` for the public event list.
- `GalleryMedia(eventId, isPublished, orderIndex)` for event detail ordering.
- `BlogPost(status, createdAt)` and possibly `(category, status, createdAt)` for published lists.
- `HeroCarousel(isActive, orderIndex)` and `HomepageContent(section, orderIndex)`.
- Foreign-key indexes such as `BlogPost.authorId`, `Account.userId`, and `Session.userId`, especially as those tables grow.

No `prisma/migrations` history is tracked. The package scripts include both `prisma db push` and `prisma migrate dev`, but the repository provides no incremental migration record showing how production reached the current schema. That makes schema changes difficult to review, reproduce, roll back, or deploy safely. The current working schema also differs from the committed version and adds `DIRECT_URL`, while `.env.example` does not document `DIRECT_URL`.

### 4. Authentication & Authorization

Authentication uses NextAuth Credentials:

- `lib/auth.ts` validates login input with Zod.
- It fetches the user by email and compares the bcrypt hash.
- It rejects non-admin users at login.
- The JWT callback stores `id` and `role`; the session callback exposes them to server and client code.
- `middleware.ts` protects `/admin/:path*` pages and checks for the `ADMIN` role.

Authentication (who the user is) and authorization (what the user may do) are conceptually separate: the session establishes identity, while role checks enforce admin access. In practice they are inconsistently applied. The middleware only matches `/admin/:path*`; it does not match `/api/admin/:path*`, `/api/hero`, `/api/homepage`, or `/api/volunteer`. Therefore, every sensitive API route must enforce authorization itself.

There are three guard styles:

- `requireAdminAuth` redirects and is appropriate for server-rendered pages/actions.
- `requireAdminAuthAPI` returns a 401 JSON response and is appropriate for APIs.
- Some routes perform no guard at all.

The most serious missing guards are:

- All methods in `app/api/volunteer/[id]/route.ts`.
- `GET` in `app/api/volunteer/metrics/route.ts`.
- Administrative writes in `app/api/hero/route.ts` and `app/api/hero/[id]/route.ts`.
- Administrative writes in `app/api/homepage/route.ts` and `app/api/homepage/[id]/route.ts`.
- `GET /api/admin/health` and `GET /api/admin/metrics`, despite their `/admin` names.

The gallery and admin-stat routes do call a guard, but many use the redirecting page guard inside broad `try/catch` blocks. That can hide an unauthorized request as a server error. The risk when adding a new route is high because the folder name does not confer protection; a developer can place a file under `app/api/admin` and reasonably—but incorrectly—assume middleware covers it.

The login endpoint has no explicit brute-force rate limit, lockout, or failed-login audit event. NextAuth provides secure session mechanics, but it does not automatically solve credential-guessing abuse.

### 5. Security

#### Input validation

Validation quality varies by feature:

- Volunteers and blog server actions use Zod server-side.
- Authentication uses Zod before querying.
- Donations, contact, newsletter, gallery, media metadata, hero, and homepage updates use partial manual checks or trust the body.
- Shared schemas exist in `utils/validation.ts` for donations, contacts, galleries, and homepage content, but most corresponding routes do not use them.

Concrete gaps include unbounded strings, arbitrary currencies/categories/URLs, invalid dates, invalid enum values reaching Prisma, negative or extreme pagination values, and unchecked upload metadata. `SecurityUtils.sanitizeInput(donor_email)` is called before confirming that `donor_email` is a string, so a missing email can throw and return 500 instead of 400. HTML encoding on ingestion is not a substitute for schema validation and can also corrupt legitimate stored data.

#### Payment integrity

`app/api/donations/verify/route.ts` does not bind the verified transaction to the local donation. Before setting `COMPLETED`, it should require all expected facts to match:

- Provider reference equals the donation's generated reference.
- Provider amount in kobo equals the stored expected amount.
- Provider currency equals the stored currency.
- Provider status is successful.
- Optionally, provider customer email equals the normalized donor email.

Without these comparisons, the local record is not trustworthy as a financial ledger.

#### File uploads

The browser checks MIME prefix and a 100 MB size, but the server does neither. The server trusts `mediaType`, buffers the entire request, and uses user-supplied `eventId` in the Cloudinary folder. There is no magic-byte inspection, strict extension/MIME allowlist, image decoding, malware scanning, video duration/dimension cap, or per-admin upload quota. `components/media-upload.tsx` also performs unsigned direct browser uploads using a public Cloudinary preset; the security of that path depends entirely on the Cloudinary preset's restrictions.

#### Secrets

Server secrets are read from environment variables, and `.env*` is ignored by Git. The inspected `.env` file is not tracked. Public browser values correctly use `NEXT_PUBLIC_`. No raw secret value was found hard-coded in application code.

Two tracked admin-creation scripts do hard-code the default password `admin123`: `prisma/seed.ts` and `scripts/create-admin.js`. If either is run against a reachable environment and the password is not immediately changed, it creates a predictable admin credential. The seed also logs the created user object, which includes the password hash.

#### Injection, CORS, and cross-site concerns

Prisma is used for application queries and parameterizes normal queries. The only raw SQL calls are tagged-template health/version queries with no user input, so SQL injection risk is low. There is no custom permissive CORS configuration; same-origin browser behavior is therefore the default, which is appropriate for this coupled frontend/backend. Webhooks do not depend on CORS because server-to-server requests are not subject to browser CORS.

Google Sheets writes use `valueInputOption: "USER_ENTERED"` with unescaped user fields. A value beginning with `=`, `+`, `-`, or `@` may be interpreted as a spreadsheet formula. That is a spreadsheet-formula injection risk for staff who open the sheet. Contact and newsletter routes also lack deduplication and comprehensive length limits.

#### Rate limiting

Donation creation, volunteer submission, contact, newsletter, health, and metrics routes use an in-memory `Map`. This is useful in local development but weak in a serverless or multi-instance deployment:

- Each process has a separate counter.
- Restarting or scaling resets/bypasses limits.
- The map is not shared across regions.
- The code trusts forwarding headers for the client IP, subject to the hosting platform's header normalization.

The project already depends on Upstash rate-limit packages, but they are not used. Login, payment verification, webhook processing, and uploads have no explicit application rate limits.

### 6. Logging & Observability

There are three logging patterns:

- The `logger` in `lib/monitoring/logger.ts` creates structured objects in memory and also writes to the console.
- `logVolunteerActivity` writes JSON-prefixed console records.
- Many routes use ad-hoc `console.log` and `console.error`.

The structured logger is a good start because entries have level, message, timestamp, and metadata. It is not durable: logs are limited to the latest 1,000 entries in one process, disappear on restart, and differ across serverless instances. Console output will go to the hosting provider's logs, but there is no configured log aggregation, retention, alerting, trace ID, request ID, user/admin ID, release identifier, or third-party error tracker.

Error context is uneven. Volunteer errors include event names, duration, and sometimes stack traces. Donation creation logs a reference and amount, but payment verification uses ad-hoc logs and does not record the donation ID, expected amount, provider status, or retry outcome in a consistent structure. Admin mutations generally log only a broad error string. Some service logs include full input objects, which could expose personal data if used with donations, volunteers, or auth.

Important missing events include:

- Failed and successful admin logins, with safe anti-brute-force context.
- Authorization failures.
- Payment verification mismatch reasons and Paystack dependency latency.
- Webhook event IDs, deduplication decisions, processing duration, and final state transition.
- Upload attempt, size/type, Cloudinary result, database-link result, and orphan cleanup.
- Contact/newsletter Google Sheets failures and latency.
- Audit logs for which admin changed or deleted volunteer, gallery, homepage, and blog data.

`createLoggingMiddleware` is defined but not wired into `middleware.ts` or route handlers. Even if it were wired as written, it creates `NextResponse.next()` itself and records that response's status, not the eventual route's real status, so it would not provide accurate end-to-end response measurements.

### 7. Metrics

Business-facing metrics currently include:

- Donation initiation count and route latency.
- Admin donation list views/latency.
- Donation list total and total completed amount.
- Gallery counts.
- Volunteer counts by status/capacity and recent submissions.
- Placeholder zero-valued blog, program, and donation dashboard stat endpoints.

Most database dashboard numbers are calculated in real time through `count`, `aggregate`, or `groupBy`. They are not pre-aggregated. Public gallery data has a 60-second revalidation setting, but operational and admin metrics are otherwise uncached.

The custom metrics collector is in memory only, so it does not represent the whole deployment. Metric names are also inconsistent: `getSystemMetrics` averages only `response_time`, while donation creation records `api_latency` and the donation list records `admin_donation_list_latency`. `active_connections` is a random number, not a measured value. Because the logging middleware is unused, `response_time` may remain empty. The public `/api/admin/metrics` endpoint can expose whatever the current process happens to have collected.

A production system would want durable counters, rates, and distributions for:

- Request count, latency percentiles, and error rate by route/status.
- Database query latency, connection-pool pressure, and failure rate.
- Paystack verification and webhook success/failure/retry rates.
- Time spent in `PENDING` and the number of stale donations.
- Payment amount mismatches and duplicate webhook events.
- Upload bytes, duration, success/failure, rejected type/size, and orphan cleanup.
- Login failures, authorization failures, and rate-limit rejections.
- Google Sheets write latency and failure rate.

These should be sent to an external metrics/observability service rather than stored in a process array.

### 8. Error Handling & Edge Cases

Payment handling has the most consequential edge cases:

- A Paystack timeout is written as `FAILED`, although the payment may still complete.
- The verify route can mark the wrong donation complete because it does not bind reference/amount/currency.
- A `charge.failed` event arriving after `charge.success` can move a completed donation back to failed; there is no enforced state-transition rule.
- Webhook helper functions catch database errors and do not rethrow, so the webhook route returns 200 and Paystack may not retry.
- There is no webhook event table or idempotency key. Repeated events usually repeat the same update harmlessly, but there is no durable record proving which events were processed.
- Monthly donation selection only stores `MONTHLY`; the browser still opens a normal transaction and no subscription/plan record is created. Subscription creation is only logged.
- A donor closing the Paystack window leaves a `PENDING` row indefinitely.

Uploads can fail between Cloudinary and PostgreSQL, leaving orphaned assets. Deleting a gallery event cascades media rows in PostgreSQL but does not delete the corresponding Cloudinary assets. Deleting one media item attempts Cloudinary first but continues to delete the database row when Cloudinary deletion fails, also creating an orphan.

Several broad catches hide useful distinctions. Validation, unique-slug conflicts, missing records, dependency outages, and programmer errors often all become 500. `HomepageService.getContent` and `getHeroItems` catch database failures and return empty arrays, so the API can return `{ success: true, data: [] }` during an outage. That is a silent failure: consumers cannot distinguish "there is no content" from "the database failed."

Pagination parameters are not bounded or validated. Negative pages, negative offsets, zero limits, very large limits, and `NaN` can reach Prisma or produce confusing metadata. Gallery slugs can collide and return 500 on creation. Blog slug collision handling checks then inserts, so concurrent requests can still race.

### 9. Code Organization

The codebase contains useful domain services (`BlogService`, `DonationService`, `GalleryService`, `HomepageService`, `ProgramService`, and `AuthService`), but routes do not consistently use them. Donations are handled through direct Prisma calls in routes, `DonationService`, and `lib/db-queries.ts`. Paystack verification is implemented locally in the route even though `PaystackAPI.verifyTransaction` exists. This duplication increases the chance that one path gains validation, logging, or security fixes while another does not.

There are also two Prisma clients:

- `lib/prisma.ts`, used by many routes and actions.
- `lib/db/index.ts`, used by service classes and health checks.

Each module has its own global singleton key and logging configuration. In one process they can create two connection pools, which is unnecessary and can matter on a connection-limited hosted PostgreSQL database.

Business logic is frequently embedded in route handlers: donation state transitions, volunteer deduplication, CSV generation, slug generation, and Cloudinary metadata handling. A clearer layering would be:

`route/server action → request schema and auth guard → domain service → single Prisma/data-access module → external provider adapter`

Under that design, every entry point would reuse the same rule for completing a payment, creating a gallery asset, or updating a volunteer. Today, the pattern for a new feature is not obvious because all three styles—direct route logic, service classes, and standalone helpers—are present.

### 10. Performance & Scalability

There is no clear application-level N+1 loop where each returned row triggers another explicit Prisma call. Prisma relation includes may perform more than one SQL query internally, but the code generally asks for relations in one Prisma operation. The admin gallery list does fetch every media item's `mediaType` solely to calculate image/video counts in JavaScript. As galleries grow, database-level grouped counts would avoid transferring all those child rows.

Unbounded or potentially large reads include:

- All published gallery events in `app/api/gallery/events/route.ts`.
- Every published media item for one public event.
- All admin gallery events and every media item for one admin event.
- All programs in `ProgramService.getPrograms`.
- All homepage content and active hero items.

Donation and volunteer lists are paginated, and donation export has a useful hard cap of 5,000 rows. However, caller-provided list limits have no maximum.

At roughly 10× load, the first likely pressure points are:

1. **Uploads:** complete files are buffered in application memory, and three uploads may run concurrently in the browser. Large videos can exceed serverless body, memory, or execution-time limits.
2. **Database connections:** two Prisma client modules can maintain separate pools, while bursty serverless instances multiply connections.
3. **External synchronous writes:** contact/newsletter requests wait for Google Sheets, and payment verification waits for Paystack without explicit timeouts or retry policy.
4. **Unbounded gallery payloads:** event and media response size grows with the dataset.
5. **Process-local controls:** rate limits, logs, and metrics become inconsistent across instances precisely when the application scales out.
6. **Real-time aggregate dashboards:** repeated full counts and sums become more expensive as tables grow, especially without composite indexes or caching.

## Gaps & Edge Cases

| Gap | Why it matters | Severity | Suggested fix | Rough effort |
|---|---|---|---|---|
| Paystack verification does not match reference, amount, currency, and customer to the pending donation | Any successful transaction reference could be used to complete the wrong local record, making financial data unreliable | Critical | Centralize a payment-completion service that locks/fetches by the generated reference and validates all provider fields before an allowed state transition | 1–2 days |
| Volunteer detail/update/delete routes have no admin guard | Exposes applicant PII and permits unauthorized status changes or deletion | Critical | Apply the API-safe admin guard to every method and add authorization tests | 0.5 day |
| Hero and homepage write endpoints are unauthenticated | Anyone can alter or delete public site content | Critical | Require admin authorization on every mutating method; keep only public GETs open | 0.5 day |
| Hard-coded `admin123` in admin creation scripts | Running the scripts can create a predictable privileged credential | Critical | Require password/email from protected environment or interactive input, enforce strong length, and never log the user object/hash | 0.5 day |
| Webhook handlers swallow database failures but return 200 | Paystack may consider a failed event processed and not retry it, leaving payment state wrong | Important | Rethrow processing failures, record provider event IDs, and return non-2xx when durable processing fails | 1–2 days |
| Payment state transitions can regress from `COMPLETED` to `FAILED` | Duplicate or out-of-order events can corrupt settled payment status | Important | Define allowed transitions and make `COMPLETED` terminal except through an explicit refund/reversal flow | 1 day |
| Temporary Paystack errors mark donations failed | A network outage is not proof of payment failure | Important | Keep status pending/verification-error on dependency failures and reconcile through retry/webhook | 0.5–1 day |
| Monthly donation is only a label; no subscription model or initialization exists | The UI promises recurring behavior that the backend does not actually establish or track | Important | Implement Paystack plans/subscriptions and store subscription/customer/invoice records, or remove/label the option until supported | 3–5 days |
| Upload type and 100 MB size limits exist only in the browser | Direct callers can bypass them; buffering large payloads can exhaust memory | Important | Enforce server-side byte limits, allowlisted MIME/extensions, magic-byte inspection, and direct signed Cloudinary uploads where appropriate | 1–3 days |
| Cloudinary upload and database insert are separate with no cleanup | Partial failure creates orphaned paid storage and duplicate retry uploads | Important | Add a compensation delete on DB failure or use a pending-upload record/finalization workflow | 1–2 days |
| Deleting gallery events/media can leave Cloudinary files behind | Database and storage diverge and storage cost grows | Important | Enumerate associated public IDs and perform retryable cleanup; track cleanup failures | 1–2 days |
| Redirecting page auth helper is used in API routes | Unauthorized requests may become 500 responses and obscure access-control behavior | Important | Use one API guard returning 401/403 in all route handlers; reserve redirects for pages/actions | 0.5–1 day |
| Admin health and metrics endpoints are unauthenticated | Health returns recent logs and service details; metrics expose internal activity | Important | Require admin or a dedicated health token; split minimal public liveness from private diagnostics | 0.5 day |
| Volunteer metrics is unauthenticated and includes recent full records | Leaks applicant data even without knowing record IDs | Critical | Require admin and return aggregate/select fields only, not full volunteer rows | 0.5 day |
| In-memory rate limiting is per process and login is not limited | Abuse controls are easy to bypass under serverless scaling; admin credentials can be brute-forced | Important | Use shared Redis/Upstash limits keyed by trusted platform IP and account/email; add login failure throttling | 1–2 days |
| `Donation.amount` uses `Float` | Floating-point rounding is unsafe for authoritative money calculations | Important | Store integer kobo or a fixed-precision decimal and migrate existing values carefully | 1–2 days |
| No tracked Prisma migrations | Production schema changes are not reproducible, reviewable, or safely rollable | Important | Baseline the current database and commit incremental migrations for future changes | 1–2 days |
| Missing composite indexes for actual filter/order patterns | Counts and ordered lists will slow as donations, volunteers, blog posts, and media grow | Important | Add indexes such as donation `(status, createdAt)` and media `(eventId, isPublished, orderIndex)` after checking query plans | 0.5–1 day |
| Two Prisma singleton modules and duplicate data-access paths | Can create extra connection pools and inconsistent behavior | Important | Standardize on one Prisma client and one domain service/query path per feature | 1–3 days |
| Monitoring data is process-local and `active_connections` is random | Dashboards cannot describe the deployment or support reliable incident response | Important | Send structured logs, traces, and metrics to a durable external service; remove mock metrics | 2–4 days |
| Logging middleware is unused and would not capture final route status | Response-time/error metrics are incomplete and potentially misleading | Important | Instrument at a layer that observes completed handlers or wrap handlers with a shared telemetry function | 1–2 days |
| Contact/newsletter writes use Sheets `USER_ENTERED` with raw input | Spreadsheet formulas can execute when staff open submitted data | Important | Prefix/escape formula-leading values or use `RAW`, plus enforce server-side length schemas | 0.5 day |
| API request and response contracts are inconsistent | Clients require endpoint-specific handling and future changes are risky | Nice-to-have | Adopt shared success/error envelopes, error codes, pagination, and Zod response/request contracts | 2–4 days |
| No explicit API versioning | Breaking payload changes affect all consumers immediately | Nice-to-have | Establish an implicit v1 contract, add `/api/v1` wrappers, and reserve v2 for breaking changes | 1–3 days |
| Public and admin gallery reads are unbounded | Payload size and query cost grow directly with content volume | Important | Add cursor/page pagination and return summaries separately from media detail | 1–2 days |
| Generic catches convert not-found/conflict/dependency errors to 500 | Clients cannot respond correctly, and operational alerts lose meaning | Nice-to-have | Map known Prisma, validation, auth, conflict, and dependency errors to specific status/error codes | 1–2 days |
| Homepage read services return empty arrays on database failure | Outages look like valid empty content and may go unnoticed | Important | Propagate a typed dependency error, log it, and return 503 or serve a deliberate cached fallback | 0.5–1 day |
| Duplicate volunteer and slug checks are check-then-insert races | Concurrent requests can pass both checks and create duplicates/conflicts | Nice-to-have | Add database-backed idempotency/uniqueness where required and handle unique conflicts explicitly | 1–2 days |
| Pagination inputs have no bounds | Huge, negative, zero, or invalid limits can cause expensive queries or errors | Important | Parse with Zod/coercion, set minimums and hard maximums, and prefer cursor pagination for large tables | 0.5–1 day |
| Stale pending donations are never reconciled or expired | Reporting accumulates abandoned attempts and support cannot distinguish them | Nice-to-have | Add an expiry/reconciliation job and a status such as `ABANDONED` or `VERIFICATION_ERROR` | 1–2 days |

## What I'd Explain in an Interview

I built the backend inside Next.js so the public site, admin interface, and API could share types and deployment infrastructure. PostgreSQL and Prisma provide the core data model, while NextAuth uses JWT sessions with an admin role for protected operations. Donations are created as pending records and reconciled with Paystack through both browser verification and signed webhooks, although I would now tighten that design by matching the provider reference, amount, and currency before completing a record. Media is stored in Cloudinary and linked to relational gallery metadata, which keeps the database lean but creates a two-step consistency problem that needs cleanup on partial failure. I used Zod well in the volunteer and blog flows, but the audit showed me that validation and authorization need to be enforced uniformly at every server entry point rather than relying on the admin UI or folder naming. The current service layer is only partially adopted, so my next architectural step would be thin routes over shared domain services and a single Prisma client. At production scale, I would also move rate limits, logs, and metrics out of process memory and into shared infrastructure.
