# CKSI Engineering Rules

## Purpose and precedence

These rules govern all frontend, backend, database, security, testing, and operational changes in the CKSI repository.

Apply instructions in this order:

1. Explicit task requirements.
2. Security, privacy, payment-integrity, and data-loss protections in this document.
3. Existing public behavior and documented API compatibility.
4. Established project conventions.
5. General framework best practices.

When rules conflict, choose the safer behavior and document the trade-off. Never silently weaken security, accessibility, data integrity, or quality gates to complete a task.

Normative terms:

- **MUST / MUST NOT:** required.
- **SHOULD / SHOULD NOT:** expected unless a documented exception exists.
- **MAY:** optional.

## Project baseline

- Framework: Next.js 15 App Router with React 19 and TypeScript.
- UI: Tailwind CSS, shadcn/ui/Radix primitives, Lucide icons, and Framer Motion where needed.
- Backend: Next.js route handlers and server actions.
- Database: PostgreSQL through Prisma.
- Authentication: NextAuth credentials with JWT sessions and role-based authorization.
- External services: Paystack, Cloudinary, Google Sheets, and analytics.
- Path alias: use `@/` for project-root imports.
- Source of truth for backend remediation: `BACKEND_AUDIT_CKSI.md` and `BACKEND_FIX_EPICS.md`.
- Canonical architecture/context document: `PROJECT_CONTEXT.md` after it is generated.

---

# 1. General change rules

## You MUST

- Read relevant existing code, tests, `PROJECT_CONTEXT.md`, and active fix epics before changing behavior.
- Preserve unrelated user changes and work safely in a dirty working tree.
- Keep each change scoped, reviewable, and independently testable.
- Prefer the smallest complete change over unrelated cleanup.
- Use descriptive names and explicit types at external and domain boundaries.
- Update documentation, tests, logs, metrics, and environment examples when behavior changes.
- Use repository-relative documentation links.
- State assumptions when requirements are ambiguous.
- Leave the project in a buildable state.

## You MUST NOT

- Invent APIs, database fields, environment variables, or provider behavior without verifying them.
- Modify generated files, `.next/`, `node_modules/`, or package-manager caches.
- Commit `.env` files, credentials, tokens, private keys, cookies, production data, or personal data.
- Disable tests, lint rules, type checking, security checks, or accessibility checks to make a change pass.
- use `any` as a shortcut around a type error. Use `unknown`, validation, narrowing, or a specific type.
- Perform broad refactors during a security fix unless required for correctness.
- Delete or rewrite user-owned changes without explicit authorization.
- Log secrets or unnecessary personal data.

---

# 2. Required quality gates

Every production change MUST pass the applicable checks:

- TypeScript type checking.
- ESLint.
- Unit/integration tests.
- Production build.
- Accessibility checks for UI changes.
- Authorization and validation tests for protected backend changes.
- Migration validation for schema changes.

The following current configuration patterns MUST be removed and MUST NOT be reintroduced:

- `typescript.ignoreBuildErrors: true`
- `eslint.ignoreDuringBuilds: true`

A build failure MUST be fixed at its source. It MUST NOT be hidden through configuration.

New functionality MUST include tests. A bug fix SHOULD include a regression test that fails before the fix.

---

# 3. Repository and module organization

Use this target backend path:

```text
route/server action
  -> authentication and authorization
  -> Zod validation
  -> domain service
  -> one Prisma repository/client or provider adapter
  -> typed response
  -> logs, audit event, and metrics
```

## Placement rules

- Pages, layouts, route handlers, loading states, error boundaries, and metadata belong under `app/`.
- Reusable presentation and interaction components belong under `components/`.
- shadcn/Radix primitives belong under `components/ui/`; feature behavior SHOULD wrap rather than heavily fork primitives.
- Reusable React behavior belongs under `hooks/`.
- Domain services, adapters, authentication helpers, validation helpers, telemetry, and shared server code belong under `lib/`.
- Shared TypeScript types belong under `types/` when they are not naturally inferred from Zod or Prisma.
- Shared validation schemas SHOULD live under `lib/validations/`.
- Database schema and migrations belong under `prisma/`.
- Administrative scripts belong under `scripts/` and MUST fail safely.

## Duplication rules

- There MUST be one Prisma singleton.
- There MUST be one authoritative service for each business invariant.
- Payment reconciliation MUST NOT be duplicated across routes and webhooks.
- Cloudinary upload/deletion rules MUST NOT be duplicated across UI and routes.
- Authorization MUST use shared guards.
- Request/response schemas MUST be shared where frontend and backend use the same contract.
- Do not copy a legacy pattern merely because it already exists. Follow the target architecture.

---

# 4. TypeScript rules

- Keep `strict: true`.
- Public functions, route boundaries, provider adapters, and domain-service results MUST have clear types.
- Parse untrusted data into trusted types; never cast request bodies with `as`.
- Use discriminated unions for domain outcomes and state transitions.
- Use enums/unions for controlled values rather than arbitrary strings.
- Prefer inference within local implementation details.
- Use `unknown` in `catch` and narrow safely.
- Do not use non-null assertions unless an invariant is locally proven and documented.
- Prefer immutable transformations. Do not mutate props or shared state.
- Use `satisfies` when checking object shapes without losing inference.
- Do not manually duplicate Prisma model types if `Prisma.*` types or selected payload types are suitable.

---

# 5. Next.js and React architecture

## Server and client boundaries

- Components MUST be Server Components by default.
- Add `"use client"` only when browser APIs, client state, effects, or event handlers are required.
- Keep client boundaries as low and small as practical.
- Do not pass secrets, database records with unnecessary fields, or large objects into Client Components.
- Serialize only fields the client actually renders.
- Server Actions MUST enforce authentication, authorization, and validation exactly like API routes.
- Dynamic route `params` MUST follow the Next.js 15 async contract consistently.

## Data fetching

- Fetch on the server when the data is needed for initial rendering, SEO, authorization, or secure access.
- Start independent asynchronous work together and await it with `Promise.all`.
- Avoid sequential request waterfalls.
- Defer an `await` until the branch that needs it.
- Use `React.cache()` for per-request server deduplication where appropriate.
- Use explicit caching/revalidation rules; do not depend on accidental framework defaults.
- Client-side fetching MUST handle loading, empty, error, stale, and retry states.
- Repeated client reads SHOULD use a deduplicating strategy rather than multiple ad hoc effects.
- URL query parameters SHOULD represent filters, tabs, search, sorting, and pagination so state is shareable and reload-safe.

## Rendering and bundles

- Do not import a large library into a Client Component when a server or lightweight alternative is possible.
- Import directly from packages when barrel imports materially increase bundles.
- Dynamically import heavy editors, charts, uploaders, and other below-the-fold tools.
- Defer non-critical analytics and third-party scripts.
- Use Suspense boundaries where streaming improves useful paint without harmful layout shift.
- Hoist static JSX and constants outside component render functions.
- Large lists MUST be paginated, virtualized, or use `content-visibility`.
- Avoid expensive work and layout reads during render.
- Use functional state updates when derived from previous state.
- Use lazy `useState` initialization for expensive initial values.
- Use `startTransition` for non-urgent UI updates where it improves responsiveness.

## React correctness

- Effects MUST synchronize with external systems, not compute ordinary derived state.
- Effect dependencies MUST be complete and as narrow as possible.
- Timers, subscriptions, observers, and event listeners MUST be cleaned up.
- Global event listeners MUST not be duplicated across component instances.
- Scroll/touch listeners SHOULD be passive when they do not call `preventDefault`.
- Conditional rendering involving numeric values MUST use an explicit ternary or boolean check rather than accidentally rendering `0`.
- Browser storage data MUST be minimal, versioned, and read safely.

---

# 6. Frontend design-system rules

- Reuse existing shadcn/Radix primitives and Tailwind tokens before creating new primitives.
- Do not hard-code a one-off color when an appropriate semantic token exists.
- New brand tokens MUST be named by purpose or approved brand meaning and documented.
- Remove or resolve contradictory/legacy brand tokens rather than expanding inconsistency.
- Use `cn()` for conditional class composition where established.
- Keep spacing, typography, radius, shadows, and controls visually consistent.
- Components MUST support long text, empty text, and realistic user-generated content.
- Flex children containing truncatable text MUST use `min-w-0`.
- Use `truncate`, `line-clamp-*`, or `break-words` intentionally.
- Destructive, success, warning, and informational states MUST use consistent semantic styling.
- Do not use color as the only way to communicate status.

---

# 7. Accessibility rules

Target WCAG 2.2 AA.

## Structure and semantics

- Every page MUST have one clear `main` landmark.
- Provide a keyboard-visible skip link to main content.
- Use semantic elements before ARIA: `button`, `a`, `nav`, `header`, `main`, `section`, `article`, `table`, and proper headings.
- Heading levels MUST be hierarchical and MUST NOT be selected for visual size alone.
- Landmark and navigation labels MUST be unique where multiple instances exist.
- Heading anchors SHOULD use `scroll-margin-top`.

## Keyboard and focus

- Every interaction MUST be operable with a keyboard.
- Use `<button>` for actions and `<Link>`/`<a>` for navigation.
- Do not attach click behavior to non-interactive `div` or `span` elements.
- Visible focus indicators MUST use `:focus-visible` or an equivalent.
- `outline: none` / `outline-none` is forbidden without an accessible replacement.
- Focus MUST move predictably when dialogs open/close and when validation fails.
- Destructive actions MUST require confirmation or offer a safe undo.
- Do not use positive `tabIndex`.

## Forms

- Every input MUST have a programmatic, visible label unless the design has a justified accessible alternative.
- Labels MUST be associated with controls using `htmlFor`/`id` or wrapping.
- Controls MUST have meaningful `name`, `type`, `inputMode`, and `autoComplete`.
- Email, codes, and usernames SHOULD disable spellcheck.
- Paste MUST never be blocked.
- Validation errors MUST appear next to the affected field, be announced, and explain how to fix the issue.
- Submission MUST focus or scroll to the first invalid field.
- Submit buttons remain available until submission starts, then expose progress and prevent duplicate submission.
- Async success/errors MUST be announced through an appropriate live region.
- Placeholder text MUST NOT replace labels.

## Images and media

- Informative images MUST have meaningful alt text.
- Decorative images/icons MUST use empty alt text or `aria-hidden="true"`.
- Icon-only buttons MUST have an `aria-label`.
- Videos MUST provide captions when they contain speech and an accessible fallback.
- Autoplaying media MUST be muted and controllable; avoid autoplay when unnecessary.

## Motion

- Honor `prefers-reduced-motion`.
- Animations MUST be interruptible.
- Animate `transform` and `opacity` rather than layout properties when possible.
- `transition: all` is forbidden.
- Do not use flashing content that can trigger seizures.

## Zoom, contrast, and touch

- Never disable browser zoom with `user-scalable=no` or restrictive maximum scale.
- Text and controls MUST meet WCAG AA contrast.
- Interactive targets SHOULD be at least 44 by 44 CSS pixels.
- Hover behavior MUST have keyboard and touch equivalents.
- Use `touch-action: manipulation` where suitable.
- Dialogs, sheets, and drawers SHOULD contain overscroll.

---

# 8. Responsive-layout rules

- Design mobile-first.
- Every page MUST work at approximately 320 px width without horizontal page scrolling.
- Verify layouts at small phone, large phone, tablet, laptop, and wide desktop sizes.
- Use CSS grid/flexbox and responsive utilities rather than JavaScript measurements for layout.
- Full-bleed fixed UI MUST account for safe-area insets.
- Do not hide required functionality on smaller screens.
- Navigation MUST be keyboard accessible and usable by touch.
- Tables MUST have a deliberate small-screen strategy: horizontal scroll with context, responsive rows/cards, or reduced columns.
- Dialogs and sheets MUST fit the viewport and keep actions reachable.
- Text, buttons, and form controls MUST not overlap or clip at 200% zoom.
- Use responsive image sizing and stable aspect ratios.
- Test very short and very long content at every breakpoint.

---

# 9. Images, fonts, and Core Web Vitals

- Use `next/image` for supported application images.
- Images MUST have explicit dimensions or a stable aspect-ratio container.
- Critical above-the-fold images MAY use `priority`; below-the-fold images SHOULD load lazily.
- Supply accurate responsive `sizes`.
- Cloudinary transformations SHOULD request appropriately sized modern formats.
- Global `images.unoptimized: true` MUST NOT remain the long-term default; exceptions require documentation.
- Avoid layout shifts by reserving space for images, embeds, banners, and async content.
- Use `next/font` or an equivalently optimized font strategy with `font-display: swap`.
- Keep LCP content server-rendered where practical.
- Defer third-party scripts that do not block core functionality.
- Add `preconnect` only for origins used early enough to benefit.

---

# 10. Content, locale, and hydration

- Use active, concise language and specific action labels.
- Errors MUST state what happened and the next safe action.
- Loading copy SHOULD use the ellipsis character: `Loading…`.
- Use `Intl.DateTimeFormat`, `Intl.NumberFormat`, and currency formatting rather than hard-coded formatting.
- Do not infer language or locale from IP.
- Wrap brand names and code identifiers with `translate="no"` where machine translation would corrupt them.
- Server and client output MUST be hydration-stable.
- `suppressHydrationWarning` requires a narrow, documented reason.
- Controlled inputs MUST have `onChange`; otherwise use `defaultValue`.
- Dates rendered on both server and client MUST use a strategy that prevents timezone hydration mismatches.

---

# 11. API and server-action rules

- Every route MUST explicitly classify itself as public, authenticated, admin-only, webhook, or scheduled-system access.
- Folder names do not provide authorization.
- Every protected method MUST enforce authorization inside the route/action or a shared wrapper.
- Use the API-safe auth guard for APIs; redirecting guards belong only in page navigation.
- Every untrusted body, query, path parameter, header-derived value, and provider payload MUST be validated.
- Use shared Zod schemas and bounded coercion.
- Return stable JSON envelopes with machine-readable error codes and request IDs.
- Use appropriate status codes:
  - `200` successful read/update
  - `201` successful creation
  - `204` successful no-content deletion where appropriate
  - `400` invalid input
  - `401` unauthenticated
  - `403` authenticated but forbidden
  - `404` missing resource
  - `409` conflict/idempotency violation
  - `422` only when deliberately standardized
  - `429` rate limited
  - `503` dependency temporarily unavailable
  - `500` unexpected internal failure
- Do not expose internal stack traces, Prisma messages, provider responses, or secrets to clients.
- Public list APIs MUST use pagination and hard maximum limits.
- State-changing routes MUST be idempotent where retries are possible.
- Route handlers SHOULD be thin; business invariants belong in services.

---

# 12. Authentication and authorization rules

- Authentication proves identity; authorization MUST independently prove permission.
- Admin pages and every admin API mutation/read MUST verify the `ADMIN` role server-side.
- Client-side session checks are UX only and MUST NOT be treated as security.
- Server Actions MUST verify the session and role within the action.
- Anonymous requests receive `401`; authenticated users without permission receive `403`.
- Authorization failures MUST be logged safely and counted.
- Login MUST use shared, cross-instance rate limiting by trusted IP and normalized account identifier.
- Login responses MUST not reveal whether an account exists.
- Passwords MUST be strongly hashed using the approved algorithm and parameters.
- Default or hard-coded admin passwords are forbidden.
- Admin provisioning MUST require protected input and MUST never print a password or hash.
- Cookies and sessions MUST use secure production settings.
- Authorization tests MUST cover anonymous, ordinary user, and admin cases.
- Sensitive admin actions SHOULD require recent authentication when risk justifies it.

---

# 13. Validation, sanitization, and output safety

- Validate first, then normalize.
- Sanitization MUST NOT replace validation.
- Do not HTML-encode ordinary data before storing it.
- Escape untrusted text when rendering.
- Rich HTML MUST pass through a strict allowlist sanitizer at a clearly defined boundary.
- String fields MUST have minimum/maximum lengths appropriate to the domain.
- Emails MUST be normalized consistently.
- URLs MUST be parsed and restricted to approved schemes.
- Dates MUST be validated for existence and sensible range.
- Enum-like values MUST be explicit.
- Pagination MUST reject negative, zero, NaN, and excessive limits.
- Spreadsheet-bound values MUST use `RAW` mode or neutralize formula-leading characters.
- Never rely solely on browser-side validation.

---

# 14. Database and Prisma rules

- Use one Prisma client singleton.
- All schema changes MUST use committed, reviewed migrations.
- `prisma db push` MUST NOT be the production schema-deployment process.
- Back up and test a migration on production-like data before destructive or monetary changes.
- Money MUST be stored as integer minor units, preferably kobo, or an approved fixed-precision decimal. `Float` is forbidden for authoritative money.
- Foreign keys and frequent filter/order combinations SHOULD have query-driven indexes.
- Do not add redundant indexes already covered by `@unique`.
- Use transactions for changes that must succeed or fail together.
- Application check-then-write logic MUST be backed by a database uniqueness, idempotency, lock, or transactional strategy when concurrency matters.
- Select only required fields, especially for personal data and Client Component props.
- Pagination and batch jobs MUST be bounded.
- Raw SQL MUST use parameterized/tagged APIs and MUST NOT interpolate user input.
- Cascade deletion MUST account for external resources such as Cloudinary assets.
- Record-not-found and unique-conflict errors MUST map to `404` and `409`, not generic `500`.

---

# 15. Payment rules

Payment integrity is release-critical.

- The browser is never proof of payment.
- A donation may become `COMPLETED` only through the central reconciliation service.
- The verified provider reference MUST equal the stored internal payment reference.
- Provider amount in kobo MUST equal the expected stored amount.
- Currency and successful provider status MUST match.
- Customer identity SHOULD match the normalized donor identity where available.
- Reconciliation MUST be atomic and idempotent.
- `COMPLETED` MUST be terminal except through an explicit refund/reversal flow.
- A provider timeout or network error MUST NOT mark a donation `FAILED`.
- Webhook signatures MUST be verified before trusting or processing payloads.
- Webhook events MUST be deduplicated durably.
- Webhook processing failures MUST return non-2xx so the provider can retry.
- Raw webhook signatures, secrets, and full personal payloads MUST NOT be logged.
- Payment mismatches, illegal transitions, provider latency, and reconciliation outcomes MUST be logged and measured.
- Stale pending payments MUST be reconciled by a bounded scheduled job.
- The UI MUST NOT promise recurring donations unless subscriptions are actually created and tracked.

---

# 16. Upload and Cloudinary rules

- Upload authorization, type, size, event ownership/existence, and metadata MUST be validated server-side.
- Client MIME type and file extension are untrusted.
- Validate magic bytes or decode/probe content where practical.
- Prefer short-lived signed direct-to-Cloudinary uploads over buffering large files in Next.js.
- Signed upload parameters MUST restrict folder, resource type, format, size, and transformation options.
- Unsigned presets MUST be tightly restricted or removed.
- Database finalization MUST verify the Cloudinary result and be idempotent.
- If database finalization fails, the new Cloudinary asset MUST be deleted or recorded for durable cleanup.
- Event/media deletion MUST not silently leave orphaned provider assets.
- Cleanup failures MUST enter a retryable queue/table and be visible in admin operations.
- Upload logs MUST not contain signatures or secrets.
- Record upload bytes, type, duration, rejection reason, provider outcome, finalization, and cleanup metrics.

---

# 17. External-service rules

- All provider calls MUST use explicit timeouts.
- Retry only safe/idempotent operations.
- Retries MUST use bounded exponential backoff with jitter.
- Provider adapters MUST normalize errors into typed dependency errors.
- Temporary provider outages SHOULD return `503` where the client can retry.
- Do not hide dependency failure as valid empty data.
- Secrets MUST remain server-only; only intentionally public values use `NEXT_PUBLIC_`.
- `.env.example` MUST list every required variable by name without values.
- Environment variables MUST be validated at startup or first safe server boundary.
- Provider operation, latency, outcome, and retry count MUST be observed.

---

# 18. Logging, audit, metrics, and health rules

Every backend flow MUST be observable.

## Structured logging

- Use one structured logger with stable event names.
- Every request MUST have a request/correlation ID returned to the client.
- Route logs MUST include method, route template, status, duration, request ID, and outcome.
- Provider logs MUST include provider, operation, duration, outcome, and safe correlation fields.
- Unexpected errors MUST preserve server-side cause/stack while clients receive a safe message.
- Operational logs MUST use a durable/shared store or managed provider. A process-local array is not a source of truth.
- Logging failure MUST not corrupt the business operation; emit a safe fallback.

## Redaction

- Never log passwords, password hashes, tokens, cookies, authorization headers, secrets, private keys, webhook signatures, signed upload parameters, or raw credentials.
- Do not log full request/response bodies by default.
- Mask, hash, or omit email, phone, IP, names, and free text unless a justified operational need exists.
- Redaction MUST be recursive and tested.

## Audit trail

- Every admin create, update, publish, status change, reorder, export, and delete MUST produce an append-only audit event.
- Audit events MUST include actor, action, target, outcome, timestamp, and request ID.
- Safe before/after summaries MAY be recorded; secrets and unnecessary personal values MUST be excluded.
- Individual audit events MUST NOT be editable or deletable from the admin UI.

## Metrics

- Metrics MUST be shared/durable across instances.
- Support counters, gauges, and latency histograms/distributions.
- Labels MUST be bounded. Never label metrics with raw email, request ID, or database ID.
- Mock or random production metrics are forbidden.
- Every route records request count, errors, status, and latency.
- Business/security metrics MUST cover payment outcomes, stale donations, login failures, authorization failures, rate-limit rejections, uploads, cleanup, provider failures, and scheduled jobs.

## Health and admin operations

- Public liveness MUST reveal no private diagnostic detail.
- Readiness MUST use strict timeouts.
- Detailed logs, metrics, health, and audit APIs/pages MUST require admin authorization.
- The admin UI MUST provide Logs, Metrics, Audit Trail, and Operations/Health pages.
- Operational pages MUST support bounded filters and cursor/time pagination.
- Access to sensitive operational data MUST itself be audited.
- Retention and cleanup policies MUST be documented and automated.

---

# 19. Rate-limiting and abuse rules

- Production rate limits MUST use shared Redis/Upstash or an equivalent cross-instance store.
- In-memory `Map` rate limits are development-only.
- Use trusted hosting-platform client-IP headers according to deployment configuration.
- Protect login, public forms, donation creation/verification, uploads, exports, logs/metrics queries, health diagnostics, and expensive endpoints.
- Use account/email and IP dimensions where appropriate.
- Return `429` with standard retry/rate-limit information.
- Record rejections without storing raw sensitive identifiers in metric labels.
- Webhooks SHOULD use signature verification, idempotency, and sensible abuse controls without blocking legitimate provider retries.

---

# 20. Error-handling rules

- Expected failures MUST use typed domain errors.
- Broad catches MUST classify or rethrow errors; they MUST NOT flatten everything into `500`.
- Never report success with empty data when the database/provider actually failed.
- User-facing errors MUST be safe, actionable, and non-technical.
- Server logs MUST carry the request ID and internal diagnostic context.
- Loading, empty, validation, authorization, not-found, conflict, dependency, and unexpected states MUST be distinguishable.
- Background jobs MUST record start, finish, duration, scanned count, success count, failure count, and retry state.
- Partial multi-system failures MUST have compensation or durable repair work.

---

# 21. Security headers and browser security

- Maintain HSTS, `X-Content-Type-Options`, an appropriate referrer policy, and clickjacking protection.
- CSP changes MUST be minimal, tested, and documented.
- Avoid `'unsafe-inline'` and `'unsafe-eval'`; work toward nonce/hash-based CSP where provider constraints permit.
- New external origins MUST not be added to CSP without a verified feature requirement.
- Do not enable permissive CORS for the coupled same-origin app.
- State-changing cross-origin use cases require explicit CSRF analysis.
- Never use `dangerouslySetInnerHTML` without a reviewed sanitizer and documented content source.
- External links opened in a new tab MUST use safe `rel` behavior where needed.
- Prevent open redirects by restricting callback and redirect destinations.

---

# 22. Privacy and data-handling rules

- Collect only fields required by the feature.
- Personal data MUST be selected, returned, displayed, logged, and exported on a least-privilege basis.
- Public metrics MUST never include volunteer, donor, contact, or newsletter records.
- Admin lists SHOULD show minimized fields; sensitive detail belongs behind deliberate access.
- Data exports MUST be admin-only, bounded, logged, and audited.
- Define retention/deletion behavior for volunteers, donors, contacts, newsletters, logs, and audit events.
- Use anonymized or synthetic fixtures in tests and documentation.
- Never include production personal data in screenshots, logs, seed data, or bug reports.

---

# 23. Testing rules

## Required test layers

- Unit tests for schemas, redaction, state transitions, and pure domain logic.
- Service/integration tests for Prisma-backed operations.
- Route tests for validation, status codes, authorization, and response contracts.
- Provider-adapter tests for success, timeout, malformed response, and failure.
- Component tests for forms and critical interactions.
- Accessibility tests for interactive UI.
- End-to-end tests for admin login, donation, volunteer, gallery, and operational pages.

## Security regression tests

- Anonymous, normal-user, and admin access to every protected route.
- Payment reference, amount, currency, status, and identity mismatch.
- Duplicate and out-of-order webhooks.
- Upload MIME spoofing and oversized files.
- Spreadsheet formula injection.
- Extreme pagination/filter input.
- Log-redaction coverage.
- Duplicate/idempotent submissions and concurrent writes.

## Test isolation

- Tests MUST NOT contact production databases or real providers.
- Provider behavior MUST be mocked or run against explicit test/sandbox services.
- Test data MUST be deterministic and cleaned up.
- Time-dependent behavior SHOULD use a controlled clock.

---

# 24. Migration and deployment rules

- Every schema migration MUST include purpose, data-migration steps, risk, rollback/forward-fix plan, and verification query.
- Destructive migrations MUST use expand/migrate/contract phases.
- Monetary migrations MUST verify row counts and totals before and after.
- Production deployment MUST run the reviewed migration command, not `migrate dev` or `db push`.
- Deployments SHOULD preserve backward compatibility during rolling releases.
- New environment variables MUST be deployed before code that requires them.
- Scheduled jobs and webhook endpoints MUST be verified after deployment.
- High-risk releases MUST include monitoring and rollback criteria.

---

# 25. Git and review rules

- Keep commits focused and explain the reason for the change.
- Do not mix generated artifacts or unrelated formatting with feature/security changes.
- Review database migrations as carefully as application code.
- Security-sensitive changes require tests demonstrating the previous exploit or failure is blocked.
- UI reviews MUST include keyboard, mobile, zoom, loading, empty, error, and long-content checks.
- Backend reviews MUST include authentication, authorization, validation, idempotency, errors, logs, metrics, and personal-data exposure.
- Any exception to a MUST rule requires a documented reason, owner, expiration/revisit date, and safer follow-up task.

---

# 26. Definition of done

A change is complete only when:

- The requested behavior works through the real entry point.
- Relevant types, validation, and authorization are enforced.
- Happy path and important failure paths are tested.
- Logs, metrics, and audit events exist where required.
- No sensitive data is exposed or logged.
- Loading, empty, error, success, and responsive states are handled.
- Accessibility requirements are met.
- Type check, lint, tests, and production build pass.
- Database migrations and environment examples are included when needed.
- `PROJECT_CONTEXT.md` and remediation epic status are updated when architecture or project state changes.

## Sources informing these rules

- Repository code and configuration.
- `BACKEND_AUDIT_CKSI.md`.
- `BACKEND_FIX_EPICS.md`.
- Vercel React best-practice guidance.
- Vercel Web Interface Guidelines.
- WCAG 2.2 AA principles.

