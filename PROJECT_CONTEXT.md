# CKSI Project Context

## Document Metadata

| Field | Value |
|---|---|
| Analysis date | 2026-06-23 |
| Repository root | `cksi/` |
| Git branch | `dev` |
| Commit | `8e79872e72cc09b8ebeb0f2aee20c3d1c7d26af2` |
| Working tree | Pre-existing/user-owned changes preserved: `components/layout/header/navbar.tsx`, `prisma/schema.prisma`, and untracked planning/context documents. BE-0001 adds the Vitest toolchain, test environment/docs, sample tests, and a test-only GitHub Actions workflow. BE-0002 adds reusable `tests/helpers` auth/request/assertion utilities plus route tests for admin auth and validation paths. BE-0003 adds reusable provider fixtures and focused Paystack, Cloudinary, and Google Sheets tests. |
| Package manager | pnpm, lockfile [`pnpm-lock.yaml`](pnpm-lock.yaml) |
| Framework | Next.js 15.2.8, React/React DOM 19.2.0, TypeScript 5 |
| Database tooling | Prisma 5.22.0, PostgreSQL |
| Commands run | `pnpm test tests/unit/helpers/backend-test-helpers.test.ts tests/integration/app/api/donations/list/route.test.ts tests/integration/app/api/volunteer/route.test.ts`; `pnpm test tests/unit/lib/paystack.test.ts tests/integration/app/api/webhooks/paystack/route.test.ts tests/integration/app/api/storage/cloudinary/upload/route.test.ts tests/integration/app/api/google-sheets-routes.test.ts`; `pnpm test`; `CI=1 pnpm test`; `pnpm test:coverage`; `pnpm exec tsc --noEmit --pretty false -p tsconfig.test.json`; `pnpm exec tsc --noEmit --pretty false --incremental false`; `CI=1 pnpm lint`; `pnpm build` |
| Scope exclusions | `node_modules/`, `.next/`, generated Prisma client code, caches, and binary contents were not analyzed line by line. Public binary assets were inspected only for type, dimensions, and size. No `.env` values were read into this document. |

Status labels used below:

- **Confirmed:** directly established from executable code, configuration, or command output.
- **Inferred:** strongly suggested by repository evidence but not explicitly configured.
- **Needs verification:** depends on deployment/provider state or information not present in the repository.

## Executive Summary

**Confirmed:** CKSI is a coupled public website and content-administration application for Couples and Kids Social Initiatives. Public capabilities include organizational information, programs/work pages, a searchable blog, gallery pages, volunteer applications, donations through Paystack, and newsletter/contact surfaces. Administrators can manage blog posts, gallery events/media, homepage records, donation records, volunteer review, and a media library.

The application uses the Next.js App Router as both frontend and backend. Server Components perform several direct Prisma reads, Client Components call route handlers with `fetch`, server actions mutate blog data, and route handlers integrate PostgreSQL, Paystack, Cloudinary, and Google Sheets. This is a working full-stack monolith, but its backend layering is inconsistent: direct Prisma access, service classes, query helpers, and provider calls coexist. Two Prisma singleton modules are active.

The codebase is at prototype-to-early-production maturity. Strong foundations include Prisma relations, NextAuth credentials/JWT sessions, Zod validation in volunteer and blog flows, Paystack webhook signature verification, responsive Tailwind layouts, shadcn/Radix primitives, and some caching/rate limiting. Highest-risk constraints are:

1. Payment verification does not bind Paystack reference, amount, currency, and donor identity to the local donation.
2. Several private or mutating APIs have no server-side admin guard.
3. Upload limits/type checks are client-only and uploads can leave Cloudinary/PostgreSQL inconsistent.
4. Predictable admin credentials remain in scripts.
5. Type checking fails, lint is not configured, broad backend coverage is still absent, and builds skip type/lint validation. BE-0001 now supplies a safe Vitest runner, sample service/environment tests, and test-only CI execution, BE-0002 adds reusable auth fixtures and request/assertion helpers, and BE-0003 adds shared provider fixtures plus focused Paystack, Cloudinary, and Google Sheets coverage.
6. Logs, metrics, and rate limits are process-local and unreliable under serverless scaling.
7. The public homepage does not consume the database-backed homepage/hero records managed by the admin UI.

Future work must follow [`RULES.md`](RULES.md) and the target flow in [`BACKEND_FIX_EPICS.md`](BACKEND_FIX_EPICS.md): route/action → authorization → Zod validation → domain service → one Prisma/provider adapter → typed response → durable telemetry.

## Product Purpose and User Roles

| Actor | Confirmed capabilities | Boundaries and gaps |
|---|---|---|
| Public visitor | Browse informational pages, blog, gallery, and static program/work content | No account is required. Some routes show fallback/demo content when backend reads fail, masking outages. |
| Donor | Create a pending donation and complete Paystack Inline checkout | Browser initiates Paystack. Donation verification integrity is incomplete; monthly selection does not create a real subscription. |
| Volunteer applicant | Submit personal/contact data and volunteering preferences | Server Zod validation and a 24-hour duplicate check exist. No confirmation email is implemented. |
| Contact submitter | Fill the visible contact form | **Confirmed gap:** the rendered form only simulates submission; it does not call `/api/contact`. |
| Newsletter subscriber | Open a Substack subscription page from newsletter UI | `/api/newsletter` writes to Google Sheets but no inspected UI calls it. |
| Partnership submitter | Fill a partnership proposal form | **Confirmed gap:** submission is simulated and not persisted or sent. |
| Administrator | Credentials login; blog/gallery/homepage/donation/volunteer management | Middleware protects `/admin/**` pages. API authorization is route-by-route and incomplete. |
| Paystack | Sends signed webhook events; serves verification API and Inline checkout | Webhook signature is verified, but event processing is not durably idempotent. |
| Cloudinary | Stores images/videos and returns media metadata | Upload and DB finalization are two independent steps; cleanup is incomplete. |
| Google Sheets | Receives contact/newsletter rows through service-account auth | Formula injection, timeout, and retry controls are missing. |
| Scheduled/background actor | None confirmed | No cron configuration, queue, worker, or scheduled endpoint exists. Stale donation and media cleanup jobs are planned only. |

## Technology Stack

Versions below use installed lockfile versions where material.

| Layer | Technology/package | Version | Purpose | Configuration/evidence |
|---|---|---:|---|---|
| Framework | Next.js | 15.2.8 | App Router, route handlers, server actions, build/runtime | [`package.json`](package.json), [`next.config.mjs`](next.config.mjs) |
| UI runtime | React / React DOM | 19.2.0 | Server and Client Components | [`pnpm-lock.yaml`](pnpm-lock.yaml) |
| Language | TypeScript | 5.x | Strict typed application code | [`tsconfig.json`](tsconfig.json) |
| Styling | Tailwind CSS | 3.4.18 installed | Utilities and CKSI tokens | [`tailwind.config.ts`](tailwind.config.ts), [`app/globals.css`](app/globals.css) |
| UI primitives | shadcn/ui + Radix | mixed pinned versions | Forms, dialogs, sheets, tables, menus | [`components/ui/`](components/ui), [`components.json`](components.json) |
| Icons | Lucide React | 0.454.0 installed | Interface icons | component imports |
| Motion | Framer Motion | 12.23.25 installed | Nav, carousel, page/card transitions | client components |
| Forms | React Hook Form | 7.67.0 installed | Blog and volunteer forms | [`components/blog/blog-form.tsx`](components/blog/blog-form.tsx), [`components/volunteer/volunteer-form.tsx`](components/volunteer/volunteer-form.tsx) |
| Validation | Zod | 3.25.76 installed | Auth, volunteer, blog schemas; partial shared schemas | [`lib/validations/volunteer.ts`](lib/validations/volunteer.ts), [`utils/validation.ts`](utils/validation.ts) |
| Database | PostgreSQL + Prisma | Prisma 5.22.0 | Relational persistence and queries | [`prisma/schema.prisma`](prisma/schema.prisma) |
| Auth | NextAuth credentials + bcryptjs | NextAuth 4.24.13 | Admin login, JWT session, role propagation | [`lib/auth.ts`](lib/auth.ts), [`middleware.ts`](middleware.ts) |
| Rich text | Tiptap | 3.11.1 | Blog authoring | [`components/blog/tiptap-editor.tsx`](components/blog/tiptap-editor.tsx) |
| Media | Cloudinary | SDK 2.8.0 installed | Image/video storage, transformations, deletion | [`lib/cloudinary.ts`](lib/cloudinary.ts), upload routes/components |
| Payments | Paystack HTTP/Inline | external | Donation checkout, verification, webhook events | [`components/donate/donate-form.tsx`](components/donate/donate-form.tsx), [`app/api/webhooks/paystack/route.ts`](app/api/webhooks/paystack/route.ts) |
| Forms storage | Google Sheets API | googleapis 171.4.0 | Contact/newsletter row append | contact/newsletter routes |
| Analytics | Google Analytics / GTM helpers | `@next/third-parties` 16.0.6 installed | Page analytics and donation events | [`app/layout.tsx`](app/layout.tsx), donate form |
| Client global state | Zustand | 5.0.9 installed | Global alert-dialog store only | [`hooks/use-alert-dialog.tsx`](hooks/use-alert-dialog.tsx) |
| Monitoring | Custom in-memory logger/metrics | project code | Console logging, health, counters | [`lib/monitoring/`](lib/monitoring) |
| Rate limiting | In-memory `Map`; Upstash packages unused | project code | Per-process request limits | [`lib/monitoring/middleware.ts`](lib/monitoring/middleware.ts) |
| Testing | Vitest + V8 coverage | 4.1.9 | Node unit/integration runner, guarded test environment, coverage | [`vitest.config.ts`](vitest.config.ts), [`tests/`](tests), [`TESTING.md`](TESTING.md) |

## Repository Map

| Path | Role and notable conventions |
|---|---|
| [`app/`](app) | App Router pages, layouts, boundaries, route handlers. Public and admin UI live together. |
| [`app/api/`](app/api) | HTTP backend. Resource-style and action-style paths coexist. Protection is not inherited from folder names. |
| [`actions/`](actions) | Next.js server actions; currently blog create/update/delete only. |
| [`components/`](components) | Public/admin feature components plus a large shadcn/Radix primitive set. |
| [`components/layout/`](components/layout) | Public shell and active navbar. [`components/header.tsx`](components/header.tsx) is a separate legacy/unused header implementation. |
| [`hooks/`](hooks) | Alert, cookie, mobile, and toast hooks. Some duplicate similarly named UI hooks under `components/ui/`. |
| [`lib/`](lib) | Auth, provider adapters, monitoring, utilities, validation, and backend services. |
| [`lib/db/`](lib/db) | Domain-like service classes using `lib/db/index.ts`; many live routes instead use `lib/prisma.ts` directly. |
| [`types/`](types) | Shared interfaces/enums and NextAuth augmentation. Several manually duplicated database types currently produce type errors. |
| [`utils/`](utils) | Shared Zod schemas; overlaps conceptually with `lib/validations/`. |
| [`data/`](data) | Static presentation data for programs, impact, partners, testimonials, and legacy blog/gallery data. |
| [`prisma/`](prisma) | Schema and seed scripts. No tracked `prisma/migrations/` directory exists. |
| [`scripts/`](scripts) | Admin provisioning/checking and historical Supabase-to-Neon migration/export utilities. Several are unsafe/legacy. |
| [`tests/`](tests) | Vitest setup, reusable `tests/helpers/` auth/request/assertion/provider utilities, and unit/integration route tests. `tests/setup/environment.ts` strips runtime credentials, maps only test database URLs, and blocks unmocked HTTP. |
| [`.github/workflows/backend-tests.yml`](.github/workflows/backend-tests.yml) | Test-only CI workflow for pushes and pull requests; the broader BE-0004 quality gate is not implemented. |
| [`public/`](public) | CKSI logo (500×500 PNG, about 104 KB) and small placeholder files. |
| Root Markdown | Engineering rules, backend audit/fix backlog, setup/design notes. Documentation includes stale Supabase/NITHUB references. |

Duplicated/legacy paths to avoid copying:

- `lib/prisma.ts` and `lib/db/index.ts` are competing Prisma clients.
- `lib/db/donations.ts`, `lib/db-queries.ts`, and donation route logic overlap.
- `components/header.tsx` and `components/layout/header/navbar.tsx` are separate headers; the latter is active through `MainLayout`.
- `hooks/use-toast.ts`, `components/ui/use-toast.ts`, Sonner `Toast`, and legacy Radix-style `Toaster` are inconsistent.
- `utils/validation.ts` and `lib/validations/` split schemas.
- Supabase setup/migration material remains although runtime persistence is Prisma/PostgreSQL.

## Runtime and Deployment Model

**Confirmed:** Next.js App Router renders Server Components by default; files marked `"use client"` own state, effects, browser APIs, or event handlers. [`app/layout.tsx`](app/layout.tsx) mounts session, cookie, theme, analytics, alert, and toast providers. [`components/layout/main-layout.tsx`](components/layout/main-layout.tsx) uses `usePathname` to select the public navbar/footer shell or allow the nested admin layout to supply its own shell.

Server rendering patterns:

- Public blog pages query Prisma directly as Server Components.
- Gallery detail/homepage featured events call same-origin APIs through cached helpers in [`lib/gallery.ts`](lib/gallery.ts).
- Many admin pages are Client Components that fetch internal APIs after mount.
- Blog writes use server actions and `revalidatePath`.
- Route handlers use the Node runtime implicitly; upload and crypto code rely on Node APIs.

Caching/rendering:

- `/api/gallery/events` exports `revalidate = 60`.
- `getGalleryEvents` and `getGalleryEvent` use `React.cache` plus `fetch(..., { next: { revalidate: 60 } })`.
- The build classified `/`, `/work`, and `/api/gallery/events` with one-minute revalidation.
- Donation lists force dynamic rendering.
- Blog pages are server-rendered on demand.
- Most browser fetches have no explicit cache, retry, or deduplication policy.

Database connections:

- [`lib/prisma.ts`](lib/prisma.ts) and [`lib/db/index.ts`](lib/db/index.ts) can each instantiate a Prisma client/pool.
- `DATABASE_URL` is used for runtime; the current working schema also requires `DIRECT_URL`.
- **Inferred:** comments and admin copy indicate Neon and Vercel/serverless deployment, but no `vercel.json` or deployment workflow confirms the provider.
- Multi-instance/serverless implications: process-local logs, metrics, and rate limits are fragmented and reset on cold start/redeployment.

Images:

- `next/image` is widely used, but [`next.config.mjs`](next.config.mjs) sets `images.unoptimized: true`, so Next.js image transformation is disabled.
- Cloudinary is an allowed remote host.

## Application Route Map

### Public pages

| Route | Purpose | Data/rendering | File |
|---|---|---|---|
| `/` | Homepage | Static hero/program content plus server-fetched latest gallery events | [`app/page.tsx`](app/page.tsx) |
| `/about` | Organization story | Static components/metadata | [`app/(about)/about/page.tsx`](<app/(about)/about/page.tsx>) |
| `/about/faq` | FAQ | Static accordion-style content | [`app/(about)/about/faq/page.tsx`](<app/(about)/about/faq/page.tsx>) |
| `/about/leadership` | Leadership/board | Static components | [`app/(about)/about/leadership/page.tsx`](<app/(about)/about/leadership/page.tsx>) |
| `/work` | Work overview | Static sections plus cached gallery helper | [`app/work/page.tsx`](app/work/page.tsx) |
| `/work/places` | Places | Minimal static page | [`app/work/places/page.tsx`](app/work/places/page.tsx) |
| `/programs` | Program cards/filter | Client state over static data; does not query `Program` | [`app/programs/page.tsx`](app/programs/page.tsx) |
| `/gallery` | Search/filter gallery | Client fetch to public gallery API; injects demo data on failure | [`app/gallery/page.tsx`](app/gallery/page.tsx) |
| `/gallery/[slug]` | Event media/detail/lightbox | Server cached API fetch, client lightbox | [`app/gallery/[slug]/page.tsx`](app/gallery/[slug]/page.tsx) |
| `/blog` | Published blog search/filter/pagination | Server Prisma queries; URL query state | [`app/blog/page.tsx`](app/blog/page.tsx) |
| `/blog/[slug]` | Article and SEO metadata | Server Prisma query; sanitized rich HTML | [`app/blog/[slug]/page.tsx`](app/blog/[slug]/page.tsx) |
| `/contact` | Contact information/form | Visible form currently simulates submission | [`app/contact/page.tsx`](app/contact/page.tsx) |
| `/donate` | Donation checkout | Client API calls + Paystack Inline | [`app/donate/page.tsx`](app/donate/page.tsx) |
| `/donate/demo` | Demo donation UI | Simulated flow | [`app/donate/demo/page.tsx`](app/donate/demo/page.tsx) |
| `/donate/success` | Donation confirmation UI | Client effects/confetti | [`app/donate/success/page.tsx`](app/donate/success/page.tsx) |
| `/volunteer` | Volunteer information/application | React Hook Form + shared Zod + API | [`app/volunteer/page.tsx`](app/volunteer/page.tsx) |
| `/partnerships` | Partnership information/proposal | Visible proposal form simulates submission | [`app/partnerships/page.tsx`](app/partnerships/page.tsx) |

### Admin pages

All `/admin/:path*` page requests are matched by [`middleware.ts`](middleware.ts). Most client pages also inspect `useSession`; server blog pages/actions call `requireAdminAuth`.

| Route | Purpose | Main backend |
|---|---|---|
| `/admin/login` | Credentials login | NextAuth `signIn("credentials")` |
| `/admin` | Dashboard | Four admin stats APIs; substitutes demo data on failure |
| `/admin/blog` | List/delete posts | Direct server Prisma + blog server action |
| `/admin/blog/new` | Create post | Blog server action |
| `/admin/blog/edit/[id]` | Edit post | Direct Prisma read + blog server action |
| `/admin/gallery` | Event list/create-state/delete/publish | Admin gallery APIs |
| `/admin/gallery/events/new` | Create event | Admin gallery API |
| `/admin/gallery/events/edit/[id]` | Edit/delete event | Admin gallery API |
| `/admin/gallery/events/[id]` | Event/media management | Admin event/media APIs |
| `/admin/gallery/events/[id]/upload` | Batch media upload/finalization | Cloudinary upload API then media API |
| `/admin/media` | General media uploader | Cloudinary upload API |
| `/admin/homepage` | Homepage/hero record management | Publicly exposed homepage/hero APIs |
| `/admin/donations` | Donation records/filter | Protected donation list API; export button is not wired |
| `/admin/volunteers` | Volunteer list/metrics/status/export | Mixed protected and unprotected volunteer APIs |

### Public APIs

| Method/path | Purpose | Validation | Data/provider | File |
|---|---|---|---|---|
| `GET/POST /api/auth/[...nextauth]` | NextAuth protocol/login | Login Zod inside credentials provider | User + JWT | [`app/api/auth/[...nextauth]/route.ts`](app/api/auth/[...nextauth]/route.ts) |
| `POST /api/contact` | Append contact row | Manual required/email/message checks | Google Sheets | [`app/api/contact/route.ts`](app/api/contact/route.ts) |
| `POST /api/newsletter` | Append subscriber row | Manual email/source allowlist | Google Sheets | [`app/api/newsletter/route.ts`](app/api/newsletter/route.ts) |
| `POST /api/donations/create` | Create pending donation | Manual amount/email; ingest-time encoding | Donation | [`app/api/donations/create/route.ts`](app/api/donations/create/route.ts) |
| `POST /api/donations/verify` | Verify Paystack result/update status | Presence only | Donation + Paystack | [`app/api/donations/verify/route.ts`](app/api/donations/verify/route.ts) |
| `GET /api/gallery/events` | Published event summaries | None | GalleryEvent/Media | [`app/api/gallery/events/route.ts`](app/api/gallery/events/route.ts) |
| `GET /api/gallery/events/[slug]` | Published event detail | Slug used directly | GalleryEvent/Media | [`app/api/gallery/events/[slug]/route.ts`](app/api/gallery/events/[slug]/route.ts) |
| `GET /api/hero` | Active hero records | None | HeroCarousel | [`app/api/hero/route.ts`](app/api/hero/route.ts) |
| `POST /api/hero` | Create hero record | None | HeroCarousel | same file; **authorization gap** |
| `PUT/DELETE /api/hero/[id]` | Update/delete hero | None | HeroCarousel | [`app/api/hero/[id]/route.ts`](app/api/hero/[id]/route.ts); **authorization gap** |
| `GET /api/homepage` | Homepage records | None | HomepageContent | [`app/api/homepage/route.ts`](app/api/homepage/route.ts) |
| `POST /api/homepage` | Create homepage record | None | HomepageContent | same file; **authorization gap** |
| `PUT /api/homepage/[id]` | Update homepage record | None | HomepageContent | [`app/api/homepage/[id]/route.ts`](app/api/homepage/[id]/route.ts); **authorization gap** |
| `POST /api/volunteer` | Create application | Shared Zod + duplicate lookup | Volunteer | [`app/api/volunteer/route.ts`](app/api/volunteer/route.ts) |
| `GET/PATCH/DELETE /api/volunteer/[id]` | Read/review/delete applicant | Status-only manual check on PATCH | Volunteer | [`app/api/volunteer/[id]/route.ts`](app/api/volunteer/[id]/route.ts); **authorization/PII gap** |
| `GET /api/volunteer/metrics` | Counts/recent applicants | Unbounded `days` parsing | Volunteer | [`app/api/volunteer/metrics/route.ts`](app/api/volunteer/metrics/route.ts); **authorization/PII gap** |

### Protected APIs

| Method/path | Guard | Side effects/response | Known issue |
|---|---|---|---|
| `GET /api/donations/list` | `requireAdminAuthAPI` | Paginated records + total raised | Unbounded caller limit; shape uses `meta` |
| `GET /api/donations/export` | `requireAdminAuthAPI` | CSV/JSON, max 5,000 rows | Date/status validation and CSV formula hardening absent |
| `GET /api/volunteer` | `requireAdminAuthAPI` | Filtered/paginated applicant list | Filter/page bounds absent |
| `GET/POST /api/admin/gallery/events` | redirecting `requireAdminAuth` | List/create events | Auth redirects can become 500 in broad catch |
| `GET/PATCH/DELETE /api/admin/gallery/events/[id]` | redirecting guard | Read/update/delete event | DB cascade does not remove Cloudinary files |
| `GET/POST /api/admin/gallery/events/[id]/media` | redirecting guard | List/finalize media | Body largely trusted |
| `PATCH/DELETE /api/admin/gallery/events/[id]/media/[mediaId]` | redirecting guard | Update/delete media | Cloudinary cleanup failure is swallowed |
| `POST/DELETE /api/storage/cloudinary/upload` | redirecting guard | Upload/delete Cloudinary asset | Server type/size checks absent; full buffering |
| `GET /api/admin/stats/*` | redirecting guard | Dashboard stats | Blog/program/donation stats are placeholders; response mismatches dashboard expectations |

`GET /api/admin/health` and `GET /api/admin/metrics` are named administrative but have **no auth guard**.

### Webhooks

| Method/path | Trust mechanism | Events | Persistence |
|---|---|---|---|
| `POST /api/webhooks/paystack` | HMAC-SHA512 of raw body using Paystack secret | `charge.success`, `charge.failed`, subscription/invoice events | Donation status updates; subscription events are log-only. Handler-level DB failures are swallowed. |

### Server actions

| Action | Protection/validation | Side effects | File |
|---|---|---|---|
| `createBlogPost` | `requireAdminAuth` + `blogPostSchema.safeParse` | Slug check, BlogPost insert, path revalidation | [`actions/blog.ts`](actions/blog.ts) |
| `updateBlogPost` | Same | BlogPost update, publish timestamp reset, revalidation | same |
| `deleteBlogPost` | `requireAdminAuth`; no schema | BlogPost delete, revalidation | same |

## Frontend Architecture

Layout hierarchy:

```text
app/layout.tsx
  SessionProvider
  CookieProvider
  CookieConsentManager (also mounted inside CookieProvider)
  ThemeProvider
  MainLayout
    public: Navbar -> main -> Footer
    admin: child AdminLayout supplies sidebar/top bar/main
  GlobalAlertDialog
  Sonner Toast
  Paystack script + Google Analytics
```

Key boundaries and composition:

- Public pages are mostly Server Components composed from feature components.
- Interactive forms, galleries, carousels, navbar, cookie UI, and admin pages are Client Components.
- The public navbar is [`components/layout/header/navbar.tsx`](components/layout/header/navbar.tsx); it has shared desktop dropdown state, a standalone Blog link, mobile sheet navigation, keyboard Escape handling, focus states, and reduced-motion handling.
- Admin navigation is embedded in [`app/admin/layout.tsx`](app/admin/layout.tsx); Volunteers is not included in its navigation array even though the page exists.
- Global loading/error/not-found files exist, plus blog-specific loading/error and admin blog/gallery/donation loading states.
- SEO uses root/page metadata, dynamic metadata for blog/gallery details, `sitemap.ts`, and `robots.txt`. [`lib/seo.ts`](lib/seo.ts) exists but is not the universal metadata path.
- Cookie consent is duplicated in the root tree and uses stale placeholder domains/routes.
- Analytics is mounted regardless of the consent code's result; **Needs verification:** whether Google consent defaults prevent collection before consent in the deployed tag configuration.

Known frontend inconsistencies:

- The homepage contains a nested `<main>` because `MainLayout` wraps `app/page.tsx`, which returns another `<main>`.
- Public homepage hero/program sections are hard-coded and do not use admin-managed DB records.
- `/programs` uses static data despite a `Program` model/service.
- Several links target nonexistent routes such as `/about/scd` and program detail paths; verify before relying on them.
- Gallery and dashboard inject demo data on request failures, hiding operational problems.

## Design System and Styling

**Confirmed:** Tailwind uses class-based dark mode, CSS variables for shadcn semantics, DM Serif Display for serif headings, and Plus Jakarta Sans for body text. CKSI tokens include red, blue, warm, dark, body, spacing, radii, and reusable classes such as `.container-base`, `.section-padding`, `.btn-primary`, and `.card-base`.

Inconsistencies:

- `tailwind.config.ts` still contains a complete unrelated “NITHUB” green/deep-blue palette mapped to `primary`/`secondary`.
- Components mix CKSI semantic tokens, shadcn variables, raw Tailwind colors, and one-off hex values.
- `app/globals.css` initially sets `body` to Arial before later Tailwind/font classes apply.
- Dark variables exist, but most CKSI pages use fixed light colors; dark-mode completeness is not established.
- `transition-all` remains in multiple components despite [`RULES.md`](RULES.md) forbidding it.
- `images.unoptimized: true` prevents Next.js optimization despite extensive `next/image` usage.

Reusable primitives live in [`components/ui/`](components/ui). Lucide is the standard icon library. Framer Motion and CSS transitions provide animation; motion behavior is not consistently reduced-motion aware outside the navbar.

## Accessibility and Responsive Behavior

Confirmed strengths:

- Radix/shadcn dialogs, sheets, selects, and form primitives provide baseline keyboard semantics.
- Most forms have visible labels; React Hook Form surfaces field messages.
- The active navbar supports focus-visible, Escape, mobile sheet navigation, icon labels, and reduced motion.
- Gallery lightbox supports Escape and arrow keys.
- Responsive Tailwind grids and breakpoints are used broadly (`sm`, `md`, `lg`, occasional `xl/2xl`).

Confirmed gaps:

- No skip link is mounted, despite an accessibility utility existing.
- The homepage has nested `main` landmarks.
- Some icon-only buttons rely on `title` or have no accessible label.
- Cookie preferences are hand-built as a visual overlay rather than a focus-trapped dialog; the close “×” lacks an accessible label.
- Several animations use `transition-all`, autoplay, pulsing, or layout animation without honoring `prefers-reduced-motion`.
- Hero carousel controls lack explicit labels and autoplay is enabled by default.
- Some plain `<img>` usage remains in admin blog.
- Contact/partnership success messages are not connected to a real submission or explicit live region.
- Admin tables can overflow narrow screens; no consistent responsive table wrapper was confirmed.
- Root viewport does not disable zoom, which is good. Color contrast has not been measured; **Needs verification** through automated/manual WCAG checks.

## State Management and Data Fetching

- Server reads: direct Prisma in blog/admin blog, service classes in sitemap/homepage APIs, and cached same-origin fetches for gallery.
- Browser reads: ad hoc `fetch` in gallery and most admin pages, generally from `useEffect`.
- URL state: blog search/category/page uses `searchParams`; most admin filters are local state and not shareable.
- Local state: dominant approach for forms, dialogs, loading, filters, carousel, and upload progress.
- Zustand: only the global alert dialog.
- No SWR/React Query usage, request deduplication, standardized retry, or optimistic update framework.
- Independent dashboard requests correctly use `Promise.all`; event detail also fetches event/media in parallel.
- Gallery `/gallery` duplicates data-fetch behavior already available through the server helper.
- Homepage gallery helper uses `React.cache`, but self-fetching the application's own API adds an HTTP layer compared with direct service/Prisma access.
- Admin homepage independently fetches homepage content then hero data; this can be parallelized.
- Error behavior is inconsistent: alerts/toasts, silent catches, console logs, demo fallback data, or empty arrays.

## Forms and Client Validation

| Form | Library/client validation | Server target/validation | Personal data | UX/current gap |
|---|---|---|---|---|
| Admin login | Controlled state; HTML email/required | NextAuth credentials; Zod + bcrypt + ADMIN role | Email/password | Generic invalid-credentials message; no login rate limit/audit |
| Blog create/edit | RHF + Zod resolver | Server action + same Zod | Admin-authored content | Rich editor bundle is large; image upload uses API |
| Volunteer | RHF + shared Zod | `/api/volunteer` + same Zod | Name, email, phone, location, free text | Good validation; success scrolls page; no email |
| Donation | Controlled/manual checks | create/verify routes with manual checks | Donor contact and payment metadata | Provider integrity gap; receipt/newsletter flags are discarded |
| Contact | HTML required/email only | **No call**; simulated timer | Name, email, phone, message | Backend exists but UI does not use it |
| Newsletter signup/popup | HTML email | Opens Substack; no `/api/newsletter` call | Email | Google Sheets API is orphaned from UI |
| Partnership | HTML required only | **No backend**; simulated timer | Organization/contact/proposal | False success state |
| Gallery create/edit | Controlled manual state | Admin gallery APIs; partial manual validation | Content metadata | No shared Zod contract |
| Media upload | Browser MIME/size/dropzone | Cloudinary upload route; weak server checks | Files/metadata | Partial-failure/orphan risk |
| Homepage/hero | Controlled manual state | Publicly exposed APIs; no schema | Site content/media URLs | Not reflected by current public homepage |

## Backend Architecture

Current reality:

```text
route/action/page
  ├─ direct Prisma via lib/prisma.ts
  ├─ service class via lib/db/index.ts
  ├─ standalone query helper
  └─ provider fetch/SDK inline
```

Examples:

- Donation, volunteer, and gallery routes call Prisma directly.
- Homepage/hero routes call `HomepageService`.
- Blog public/admin pages and actions call direct Prisma despite `BlogService`.
- `PaystackAPI` exists, but verification is reimplemented inside the route.
- Cloudinary configuration/deletion appears in shared helpers and multiple routes.

Target architecture from [`RULES.md`](RULES.md) and [`BACKEND_FIX_EPICS.md`](BACKEND_FIX_EPICS.md):

```text
route/server action
  -> request ID and telemetry
  -> authentication/authorization
  -> shared Zod schema
  -> domain service with business invariants
  -> one Prisma repository/client or provider adapter
  -> typed result/error mapping
  -> durable logs, audit event, and metrics
```

Do not add new work to duplicated legacy paths. Consolidation is tracked in Epics 6, 7, 8, and 10.

## API and Server Action Catalog

The route maps above are the canonical endpoint inventory as of the analysis date. Cross-cutting catalog:

| Domain | Request/response pattern | Rate limit | Logs/metrics | Main known issue |
|---|---|---|---|---|
| Auth | NextAuth protocol | None explicit | Ad hoc auth error only | Brute force and security event visibility |
| Contact | JSON → `{success,message}` | 3/min/IP process-local | `console.error` | UI disconnected; formula injection; no timeout |
| Newsletter | JSON → `{success,message}` | 5/min/IP process-local | `console.error` | UI disconnected; duplicates/formula injection |
| Donations | Mixed bare and `{success,data/meta}` | Create 10/min/IP; verify none | Some custom logger/metrics; verify/webhook console | Payment binding and state-transition integrity |
| Volunteers | Typed create response; list pagination differs | Create 5/min/IP | JSON console activity | Detail/metrics authorization gaps |
| Gallery | `{events}`, `{event}`, `{media}` | None | Console only | Unbounded reads, weak validation, cleanup |
| Homepage/hero | `{success,data}` | None | Service logger | Mutations public; read failures return empty success |
| Diagnostics | Health object / metric array | Process-local | Self-referential | Public detail, mock metrics |
| Blog actions | `ActionState` | None | Console on create only | Error swallowing, duplicated service path |

## Authentication and Authorization

1. Login form calls `signIn("credentials", { redirect: false })`.
2. NextAuth credentials provider parses email/password with Zod.
3. Prisma loads the user by unique email and bcrypt compares the hash.
4. Non-`ADMIN` users are rejected even if credentials are valid.
5. JWT callback stores `id` and `role`; session callback copies them to `session.user`.
6. Type augmentation is in [`types/next-auth.d.ts`](types/next-auth.d.ts).
7. Middleware matches only `/admin/:path*`, allowing `/admin/login` and requiring a token/admin role for other admin pages.
8. Page/server-action guard redirects; API-safe guard returns JSON 401.

Critical rule: middleware does not match API routes. `app/api/admin/**` is not automatically protected.

Confirmed gaps:

- Volunteer detail/mutation and metrics routes have no guard.
- Hero/homepage mutations have no guard.
- Admin health/metrics have no guard.
- Many protected APIs use redirecting page guard inside broad catches, potentially converting auth failures to 500.
- API-safe guard conflates unauthenticated and non-admin as 401; target behavior is 401 vs 403.
- Admin login has no shared rate limit, lockout, failed-attempt audit, or alerting.
- Client/session checks improve UX but are not security controls.

## Database and Data Model

### Entity relationship diagram

```mermaid
erDiagram
    User ||--o{ Account : has
    User ||--o{ Session : has
    User ||--o{ BlogPost : authors
    GalleryEvent ||--o{ GalleryMedia : contains

    User {
      string id PK
      string email UK
      string password "sensitive"
      Role role
    }
    Account {
      string id PK
      string userId FK
      string provider
      string providerAccountId
    }
    Session {
      string id PK
      string sessionToken UK
      string userId FK
      datetime expires
    }
    VerificationToken {
      string identifier
      string token UK
      datetime expires
    }
    BlogPost {
      string id PK
      string slug UK
      string authorId FK
      PostStatus status
      string content
    }
    GalleryEvent {
      string id PK
      string slug UK
      boolean isPublished
    }
    GalleryMedia {
      string id PK
      string eventId FK
      string mediaUrl
      string cloudinaryPublicId
    }
    Volunteer {
      string id PK
      string email
      string phone
      VolunteerStatus status
    }
    Donation {
      string id PK
      string paymentReference UK
      float amount
      DonationStatus status
    }
    Program {
      string id PK
      string slug UK
      ProgramStatus status
    }
    HeroCarousel {
      string id PK
      int orderIndex
      boolean isActive
    }
    HomepageContent {
      string id PK
      string section
      int orderIndex
    }
```

### Model inventory

| Model | Purpose/relations | Constraints/indexes | Write/delete paths and sensitivity |
|---|---|---|---|
| `User` | Admin identity; parent of accounts/sessions/posts | Unique email | Seed/scripts/AuthService; password hash is sensitive |
| `Account` | NextAuth OAuth-compatible account record | Unique provider+providerAccountId; cascade on user delete | Credentials flow does not actively use provider accounts |
| `Session` | NextAuth DB session schema | Unique token; cascade on user delete | JWT strategy means DB sessions are not primary runtime storage |
| `VerificationToken` | NextAuth verification support | Unique token and identifier+token | No active email provider flow confirmed |
| `BlogPost` | Rich articles authored by User | Unique slug; indexes slug/status/featured | Server actions; user deletion has no explicit cascade |
| `HeroCarousel` | Admin-managed hero records | indexes orderIndex/isActive | HomepageService; not consumed by current public homepage |
| `Program` | Structured programs | Unique slug; indexes slug/status | Seed/service; public `/programs` uses static data |
| `GalleryEvent` | Event metadata | Unique slug; category/slug indexes | Admin gallery APIs; DB cascade deletes media rows |
| `GalleryMedia` | Cloudinary-linked event media | event/mediaType/publicId indexes | Admin media APIs; cascade does not delete Cloudinary assets |
| `Volunteer` | Applicant PII and review status | indexes email/status/capacity/createdAt | Public create; admin list; currently public detail/mutation |
| `Donation` | Donor/payment state | Unique paymentReference; donorEmail/status indexes | Create/verify/webhook; amount uses unsafe `Float` |
| `HomepageContent` | Generic editable sections | No uniqueness; no section/order index | Admin homepage APIs; not consumed by current homepage |

Index and migration concerns are detailed in [`BACKEND_AUDIT_CKSI.md`](BACKEND_AUDIT_CKSI.md). No migrations are tracked. Current `prisma/schema.prisma` is modified relative to Git and adds `DIRECT_URL`; deployed-schema equivalence **Needs verification**.

## External Services and Integrations

| Service | Entry points/auth | Timeout/retry | Failure behavior and risk |
|---|---|---|---|
| Paystack | Public key in browser; secret Bearer verification; HMAC webhook | No explicit timeout/retry | Verify route marks temporary errors failed; webhook DB failures can be acknowledged; monthly flow incomplete |
| Cloudinary | API key/secret server upload/delete; public unsigned preset in `MediaUpload` | No explicit timeout/retry | Full server buffering, client-only policy, two-step orphan risk |
| Google Sheets | Service account email/private key + sheet IDs | No explicit timeout/retry | Route returns 500; `USER_ENTERED` formula risk; visible UI does not call APIs |
| Google Analytics | `GoogleAnalytics` in root; GTM donation events | Managed script behavior | Consent ordering **Needs verification**; GA variables beyond public ID are unused |
| Substack | Browser opens subscription URL | Browser/new-tab only | Separate from `/api/newsletter`; no confirmed CKSI-owned server record |
| Email | Template generator only | No transport configured | Receipt, volunteer, and admin notifications are TODOs |
| Upstash Redis | Packages installed | Not used | Rate limiting remains process-local |
| Neon/PostgreSQL | Prisma `DATABASE_URL`, schema `DIRECT_URL` | Prisma defaults | Two client pools; direct/pooled deployment behavior needs verification |
| Supabase | Historical setup/migration scripts | Script-specific | Runtime no longer uses it; docs are stale and export script embeds infrastructure identifiers |
| Monitoring provider | None | — | Console/process memory only; no durable store, tracing, or alerting |

## Feature Data Flows

### Public homepage content and hero loading

```mermaid
sequenceDiagram
    Browser->>Next page: GET /
    Next page->>HeroSection: render hard-coded hero
    Next page->>FeaturedUpdates: render server component
    FeaturedUpdates->>getGalleryEvents: cached helper
    getGalleryEvents->>/api/gallery/events: HTTP fetch, revalidate 60s
    API->>PostgreSQL: published GalleryEvent query
    API-->>Homepage: event summaries
```

**Confirmed:** `HomepageContent` and `HeroCarousel` are not read by `app/page.tsx`. Admin changes through `/api/homepage` and `/api/hero` do not control the visible homepage hero. Helper failures return empty content rather than a typed outage.

### Admin authentication/session propagation

```mermaid
sequenceDiagram
    Admin browser->>NextAuth: credentials signIn
    NextAuth->>Zod: parse email/password
    NextAuth->>PostgreSQL: find User
    NextAuth->>bcrypt: compare password
    NextAuth->>JWT: add user id + role
    JWT-->>SessionProvider: session.user.id/role
    Middleware->>Admin page: require token and ADMIN role
    API route->>Shared guard: only when route explicitly calls it
```

### Blog lifecycle

1. Admin list server page calls `requireAdminAuth`, then Prisma lists posts/authors.
2. New/edit form uses RHF/Zod and Tiptap.
3. Submit constructs `FormData` and calls create/update server action.
4. Server action rechecks admin, validates Zod, generates/checks slug, writes Prisma, and revalidates blog/admin paths.
5. Delete action rechecks admin and deletes.
6. Public list queries published posts, supports `q`, `category`, and page.
7. Public detail loads by slug, hides drafts only in production, sanitizes HTML, and renders it.

Risks: dynamic blog detail params violate the Next.js 15 async contract; image upload can orphan media; edit publish timestamp is reset whenever saved as published; no transactional audit trail.

### Donation and Paystack

```mermaid
sequenceDiagram
    Donor->>/api/donations/create: amount/contact/type
    API->>PostgreSQL: create PENDING Donation
    API-->>Browser: id + internal reference
    Browser->>Paystack Inline: public key, amount, reference
    Paystack-->>Browser: callback reference
    Browser->>/api/donations/verify: reference + donation_id
    API->>Paystack: verify reference with secret
    API->>PostgreSQL: COMPLETED or FAILED
    Paystack->>/api/webhooks/paystack: signed event
    Webhook->>PostgreSQL: reconcile by paymentReference
```

Trust boundary: all browser fields are untrusted. Completion currently does not prove reference/amount/currency/customer match. Listing/export are admin-protected. The admin export endpoint exists, but its UI button is not connected.

### Volunteer

1. RHF and shared Zod validate client-side.
2. Public API repeats Zod validation and applies process-local IP limit.
3. API checks same email in prior 24 hours, then inserts.
4. Admin list API is protected and paginated.
5. Metrics API returns counts plus recent full records without auth.
6. Detail/status/delete API has no auth.
7. Admin UI filters current page locally, updates status, and exports current loaded records to CSV.

### Gallery and Cloudinary

```mermaid
sequenceDiagram
    Admin->>Gallery API: create event
    Gallery API->>PostgreSQL: GalleryEvent
    Admin->>Upload API: multipart file
    Upload API->>Cloudinary: upload stream
    Cloudinary-->>Admin: URL/publicId/metadata
    Admin->>Media API: finalize metadata
    Media API->>PostgreSQL: GalleryMedia
    Visitor->>Public Gallery API: event/media read
    Visitor->>Gallery page: cards/lightbox
```

The Cloudinary and DB writes are not atomic. Event cascade deletion removes rows only. Individual media deletion continues after Cloudinary failure. Public event list is cached but unpaginated.

### Contact and newsletter

- Contact API: public JSON → manual validation/rate limit → Google Sheets `Contact!A:H`.
- Newsletter API: public JSON → email/source validation/rate limit → Google Sheets `Newsletter!A:D`.
- **Confirmed UI mismatch:** contact UI simulates success; newsletter UI opens Substack. Neither inspected UI calls these APIs.

### Admin dashboard statistics

The dashboard requests four APIs in parallel. Gallery API returns real keys (`totalEvents`, etc.), while the dashboard expects `count`; blog/program/donation APIs return placeholder zero objects with different keys. The dashboard therefore displays zeros or substitutes demo data on request failure. This is not an authoritative operations dashboard.

### Health, logs, metrics, rate limits, jobs

- Health checks DB, Paystack bank endpoint, and a Cloudinary sample, then returns recent process logs and system metrics.
- Metrics are in an in-memory array; `active_connections` is random.
- Rate limits are an in-memory map with periodic cleanup.
- Logging middleware is defined but not wired and would not observe the final route response.
- No scheduled jobs are configured.

## Validation and Error Handling

Good patterns:

- Volunteer client/server share one Zod schema.
- Blog action validates before write.
- Auth parses credentials.
- Meaningful 201/409/429/503 statuses exist in selected routes.

Gaps:

- Most route bodies/query strings are not schema-validated.
- Pagination values are unbounded.
- Ingest-time HTML encoding is used for donation fields.
- Broad catches convert conflicts/not-found/auth/dependency errors to 500.
- Homepage services return empty arrays on DB error, producing false success.
- Provider calls have no timeouts.
- Demo data and silent catches obscure outages.
- API envelopes, pagination keys, and error codes differ by domain.
- No error correlation/request ID exists.

## Logging, Metrics, Audit, and Health

| Capability | Current state |
|---|---|
| Event schema | Generic `level/message/timestamp/metadata`; volunteer has separate `action` JSON shape |
| Transport | Console plus in-memory arrays |
| Retention | Last 1,000 logs/10,000 metrics per process; lost on restart |
| Redaction | No central recursive redaction policy |
| Request/correlation IDs | None |
| Audit storage | None |
| Metrics backend | Process memory |
| Health | Public `/api/admin/health`; includes recent logs and details |
| Metrics API | Public `/api/admin/metrics` |
| Admin pages | No logs, metrics, audit, or operations pages |
| Alerting | None |
| Scheduled cleanup | None |

Missing instrumentation is broad: auth outcomes, authorization failures, payment mismatches/retries, webhook identity/duplicates, upload policy/cleanup, Google dependency latency, admin actor mutations, DB query latency, and end-to-end route statuses.

## Security Model and Trust Boundaries

- Public/admin browser inputs are untrusted and require server validation.
- Admin page visibility is enforced by middleware, but API access requires explicit guards.
- JWT session contains user ID/role; secret/cookie management is delegated to NextAuth.
- Prisma parameterizes application queries. Tagged raw SQL health/version queries have no user input.
- Paystack webhooks verify HMAC before parsing.
- Payment verification integrity is incomplete.
- Uploads trust client type/size and can exhaust memory.
- Google Sheets `USER_ENTERED` allows spreadsheet formula interpretation.
- Blog HTML is sanitized with `sanitize-html`, but style/class attributes are broadly allowed.
- Same-origin browser behavior is relied upon; no permissive CORS configuration exists.
- Custom CSRF helpers exist but are not integrated; NextAuth supplies its own protections for auth routes.
- Secrets are environment-based and `.env*` is ignored. Public variables intentionally enter client bundles.
- Predictable admin credentials remain in tracked scripts.
- PII includes donor contact data, volunteer applications, contact rows, and newsletter emails. Access/audit/retention policies are not documented.
- Security headers include HSTS, frame denial, MIME sniff protection, referrer policy, and CSP. CSP permits `'unsafe-inline'` and `'unsafe-eval'`, weakening script/style protection.

## Performance and Caching

- Good: parallel blog/dashboard/event fetches; React cache for gallery; 60-second gallery revalidation; paginated blog/donation/volunteer lists; capped donation export.
- Risks: unbounded gallery/media/program/homepage reads; caller-controlled limits; client-side gallery refetch; duplicate Prisma pools; full upload buffering; provider calls without timeout; real-time aggregate counts.
- Client bundles: admin blog editor is about 295 KB first-load JS; gallery/volunteer pages are also comparatively heavy. Dynamic import is not used for Tiptap.
- RSC serialization is generally limited, but gallery detail passes full media collections to a Client Component.
- Next images are unoptimized globally.
- Long admin tables are not virtualized; gallery media is not paginated.
- Composite indexes matching actual filter/order patterns are missing.

## Testing and Quality Gates

### Inventory

| Test type | State |
|---|---|
| Unit/integration | Vitest 4.1.9 configured for Node/TypeScript; twenty-nine tests pass across environment safeguards, helper units, provider adapters/fixtures, and focused route coverage |
| Route/auth/provider | Reusable auth fixtures, route request/context builders, response assertions, and shared provider fixtures now exist under `tests/helpers/`. Route coverage proves current admin-route `401` behavior on donations, validation failure handling on volunteer create, signed Paystack webhook handling, mocked Cloudinary upload/delete behavior, and mocked Google Sheets writes. |
| Component/accessibility | None |
| E2E | None |
| Security/migration/load | None |
| CI | `.github/workflows/backend-tests.yml` runs `pnpm test` on pull requests and pushes to `dev`/`main`; full BE-0004 gates are not present |
| ESLint config | None found |
| Formatter config | None found |

### Commands run on 2026-06-23

| Command | Result |
|---|---|
| `pnpm test tests/unit/helpers/backend-test-helpers.test.ts tests/integration/app/api/donations/list/route.test.ts tests/integration/app/api/volunteer/route.test.ts` | **Passed.** Three files and eight tests passed for the new helper layer and focused route coverage. |
| `pnpm test tests/unit/lib/paystack.test.ts tests/integration/app/api/webhooks/paystack/route.test.ts tests/integration/app/api/storage/cloudinary/upload/route.test.ts tests/integration/app/api/google-sheets-routes.test.ts` | **Passed.** Four files and fifteen tests passed for Paystack, Cloudinary, and Google Sheets provider mocks and route coverage. |
| `pnpm test` | **Passed.** Nine files and twenty-nine tests passed, including the new provider-mock coverage. |
| `CI=1 pnpm test` | **Passed.** The same twenty-nine tests passed in non-watch CI mode. |
| `env DATABASE_URL=... DIRECT_URL=... PAYSTACK_SECRET_KEY=... CLOUDINARY_API_SECRET=... GOOGLE_PRIVATE_KEY=... pnpm test` | **Passed.** Safeguard tests confirmed runtime database/provider values were removed before test modules loaded. Placeholder values only were used. |
| `pnpm test:coverage` | **Passed.** V8 coverage output was generated under ignored `coverage/`; current sample coverage is intentionally narrow. |
| `pnpm exec tsc --noEmit --pretty false -p tsconfig.test.json` | **Passed.** Test configuration, NextAuth test typing, helper modules, and auth/provider route tests type-check independently. |
| `pnpm exec tsc --noEmit --pretty false --incremental false` | **Failed before the build completed because the repository `tsconfig.json` includes `.next/types/**/*.ts` and the generated files were absent at that moment.** |
| `pnpm exec tsc --noEmit --pretty false --incremental false` (after `pnpm build`) | **Failed on pre-existing application errors.** Errors include Next.js 15 route/page params in hero/homepage/blog, implicit `any` in admin homepage, blog form optional string mismatch, broken toast exports/types, value imports exported as types in DB services, and broken `types/blogs.ts`. No BE-0001, BE-0002, or BE-0003 file appeared in the error output. |
| `CI=1 pnpm lint` | **Failed on the pre-existing missing ESLint configuration.** `next lint` opened the configuration prompt and exited 1. |
| `pnpm build` | **Passed.** Prisma generated and Next built 47 pages/routes. Output still states “Skipping validation of types” and “Skipping linting”; prerender also attempted the configured gallery/database path and logged its existing unavailable-dependency fallback. |

BE-0001 establishes a runnable safety-net foundation, not broad route/provider coverage or the complete CI gate. The green production build remains an invalid type/lint quality signal and still contradicts [`RULES.md`](RULES.md).

## Environment Variables

Names only; no values were copied.

| Variable | Class | Consumers/purpose | Required state / safe validation |
|---|---|---|---|
| `NEXTAUTH_URL` | Server/runtime config | NextAuth canonical URL | Required by deployment; valid HTTPS production URL |
| `NEXTAUTH_SECRET` | Secret | JWT/session signing | Required; high-entropy, non-public |
| `DATABASE_URL` | Secret | Prisma runtime and migration script | Required; PostgreSQL URL |
| `DIRECT_URL` | Secret | Prisma direct connection | Required by current schema; missing from `.env.example` |
| `TEST_DATABASE_URL` | Test-only secret | Vitest setup maps this to `DATABASE_URL` for integration tests | Optional; PostgreSQL URL whose database name contains `test`; never production/staging/shared development |
| `TEST_DIRECT_URL` | Test-only secret | Vitest setup maps this to `DIRECT_URL` | Optional; same safety rules as `TEST_DATABASE_URL`; falls back to the test database URL |
| `NEXT_PUBLIC_SITE_URL` | Public | Server gallery self-fetch base URL | Missing from example; valid origin |
| `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` | Public | Paystack Inline | Required for donations; expected public-key prefix |
| `PAYSTACK_SECRET_KEY` | Secret | Verify, webhook HMAC, health | Required for payments; never client-exposed |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Public | URLs/upload configuration/health | Required for media |
| `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` | Public | Unsigned browser upload | Optional fallback exists; preset must be tightly restricted |
| `CLOUDINARY_API_KEY` | Server credential | Cloudinary SDK | Required for server management |
| `CLOUDINARY_API_SECRET` | Secret | Cloudinary SDK | Required; never client-exposed |
| `CLOUDINARY_URL` | Secret-ish composite | Listed in example; no direct code consumer found | Optional/legacy; remove if unused |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | Server credential | Sheets auth | Required for contact/newsletter APIs |
| `GOOGLE_PRIVATE_KEY` | Secret | Sheets auth | Required; preserve newline encoding |
| `CONTACT_SHEET_ID` | Server identifier | Contact tab | Required if API is used |
| `NEWSLETTER_SHEET_ID` | Server identifier | Newsletter tab | Required if API is used |
| `NEXT_PUBLIC_GA_ID` | Public | Google Analytics | Optional; guard missing configuration |
| `GA_PROPERTY_ID`, `GA_CLIENT_EMAIL`, `GA_PRIVATE_KEY` | Server | Example only; no code consumer found | Optional/legacy |
| `HEALTH_CHECK_TOKEN` | Secret | Example only; health route does not use it | Intended but currently ineffective |
| `EMAIL_FROM`, `EMAIL_SERVER_*` | Secret/server | Example only; no mail transport exists | Optional/unused |
| `SUPABASE_URL` | Secret/server | Historical migration script | Script-only; not in `.env.example` |
| `SUPABASE_SERVICE_ROLE_KEY` | Secret | Migration script | Script-only; highly sensitive |
| `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public | Stale `SETUP.md`; no runtime consumer | Legacy documentation |
| `NODE_ENV` | Runtime | Logging, cookies, draft visibility | Framework-managed |

## Local Development Commands

Verified against [`package.json`](package.json):

```bash
pnpm install
pnpm dev
pnpm test
pnpm test:watch
pnpm test:coverage
pnpm db:generate
pnpm db:push
pnpm db:migrate
pnpm db:seed
pnpm db:studio
```

Notes:

- `pnpm lint` is declared but not usable until ESLint is configured.
- No typecheck script exists; use `pnpm exec tsc --noEmit`.
- Backend test conventions and database isolation/reset rules are documented in [`TESTING.md`](TESTING.md). Copy [`.env.test.example`](.env.test.example) to ignored `.env.test.local` only when an integration test needs a disposable PostgreSQL database.
- `pnpm exec tsc --noEmit -p tsconfig.test.json` type-checks the test harness independently of existing application errors.
- `db:push` bypasses migration history and should not be the production schema workflow.

## Build and Deployment Commands

```bash
pnpm build   # prisma generate && next build
pnpm start
```

**Confirmed:** current builds ignore type and lint failures. Remove the ignore flags only after fixing errors and configuring ESLint. Google Fonts require network access during build because `next/font/google` is used.

**CI:** [`.github/workflows/backend-tests.yml`](.github/workflows/backend-tests.yml) installs with pnpm 10.16.1 on Node 22 and runs `pnpm test`. Type checking, linting, builds, migration checks, and coverage artifacts remain in BE-0004 scope.

**Inferred deployment:** likely Vercel + Neon based on comments, serverless dependencies, and admin copy. **Needs verification:** production provider, runtime regions, pooled/direct DB URLs, webhook URL, cron support, backups, environment separation, and secret rotation.

## Known Issues, Risks, and Technical Debt

This table summarizes current high-value issues. See [`BACKEND_AUDIT_CKSI.md`](BACKEND_AUDIT_CKSI.md) for reasoning and [`BACKEND_FIX_EPICS.md`](BACKEND_FIX_EPICS.md) for implementation tasks.

| ID | Severity | Area | Confirmed issue | Evidence | Consequence | Planned fix |
|---|---|---|---|---|---|---|
| CTX-001 | Critical | Payments | Verification can complete unrelated donation and ignores amount/currency/email match | donation verify route | Untrustworthy financial records | BE-0301–0305 |
| CTX-002 | Critical | Authorization | Volunteer record and metrics APIs expose/mutate PII without guard | volunteer routes | Data exposure/deletion | BE-0102–0103 |
| CTX-003 | Critical | Authorization | Hero/homepage mutations are public | hero/homepage routes | Public content compromise | BE-0104–0105 |
| CTX-004 | Critical | Credentials | Admin scripts contain predictable credentials | seed/admin scripts | Privileged compromise | BE-0201 |
| CTX-005 | Important | Uploads | Client-only policy, full buffering, non-atomic finalization | upload page/route | Abuse, OOM, orphan storage | Epic 4 |
| CTX-006 | Important | Webhooks | Handler errors swallowed; no event idempotency | Paystack webhook | Lost retries/inconsistent state | BE-0304 |
| CTX-007 | Important | Database | Float money, no migrations, two clients | schema/Prisma modules | Rounding/deployment/connection risk | Epic 6 |
| CTX-008 | Important | Quality | Type/lint failures remain hidden in build; BE-0001 added the initial test runner, BE-0002 added reusable auth/route helpers, and BE-0003 added provider mocks, but the full CI gate is still missing | command results/config/tests workflow | Unchecked types and skipped lint/build validation can still regress | BE-0004 |
| CTX-009 | Important | Observability | Process-local logs/metrics/rate limits; random connection metric | monitoring code | Misleading operations | Epics 7–9 |
| CTX-010 | Important | Homepage | Admin-managed hero/content not rendered publicly | page vs homepage service | Admin edits appear ineffective | Needs product/frontend remediation |
| CTX-011 | Important | Forms | Contact/partnership simulate success; newsletter API disconnected | client components | Lost submissions/false UX | Needs integration task |
| CTX-012 | Important | Dashboard | Placeholder/mismatched stats and demo fallback | admin dashboard/stats APIs | Misleading admin data | BE-0907 |
| CTX-013 | Important | Validation | Most external boundaries lack shared schemas/bounds | API catalog | Invalid/expensive requests | Epic 5 |
| CTX-014 | Important | Security | Google Sheets formula injection; CSP unsafe directives | Sheets routes/config | Staff/browser risk | BE-0505 + CSP hardening |
| CTX-015 | Important | Privacy | Cookie manager mounted twice; analytics consent behavior unclear | root/CookieProvider | Duplicate UI, consent uncertainty | Needs verification/fix |
| CTX-016 | Nice-to-have | Frontend | Duplicate legacy components/tokens/toast systems | repository map | Maintenance inconsistency | Safe cleanup after quality gate |
| CTX-017 | Important | Routing | Blog detail uses synchronous params under Next 15 | typecheck output | Type failure/runtime fragility | BE-0506 |
| CTX-018 | Important | Performance | Unbounded gallery/media and unoptimized images | gallery/config | Payload and bandwidth growth | Epic 11 |

Already-present partial mitigations, not completed epics:

- API-safe admin guard exists and is used for donation list/export and volunteer list.
- Volunteer create has shared Zod, rate limit, duplicate response, and structured activity events.
- Paystack webhook signature verification exists.
- Gallery public list has one-minute revalidation and limits preview media to one image.
- Donation export is capped at 5,000 rows.
- Navbar stability/accessibility improvements are present in the dirty working tree.

## Active Remediation Plan

BE-0001, BE-0002, and BE-0003 are complete with code-and-test evidence. All later tasks remain unchecked; partial foundations outside the selected tasks are not classified as completed epics.

| Epic | Priority | Status | Dependency/first useful outcome |
|---|---|---|---|
| 0 Testing safety net | P0 | In progress — BE-0001, BE-0002, and BE-0003 complete | Add the full CI quality gate |
| 1 Authorization/PII | P0 | Not started | Protect volunteer/content/diagnostics routes |
| 2 Admin credentials/login | P0 | Not started | Remove predictable scripts, shared login limit/events |
| 3 Donation reconciliation | P0 | Not started | Central invariant and durable webhooks |
| 4 Media security | P1 | Not started | Signed direct uploads and compensation |
| 5 Validation/contracts | P1 | Not started | Shared Zod, bounded pagination, response envelope |
| 6 Database foundations | P1 | Not started | Baseline migration, exact money, one Prisma client |
| 7 Logging/audit | P1 | Not started | Durable structured events and request IDs |
| 8 Metrics/rate limit/health | P1 | Not started | Shared backend, real values, split diagnostics |
| 9 Admin operations UI | P2 | Not started | Protected logs/metrics/audit/health pages |
| 10 Service cleanup | P2 | Not started | Thin routes and one invariant path |
| 11 Performance | P2 | Not started | Pagination, limits, provider resilience |
| 12 Production readiness | P1/P2 | Not started | Runbooks and final security/load/recovery checks |

Recommended execution order is the dependency order in the epic file: establish tests, close P0 authorization/credential gaps, establish DB foundations, fix payments, then uploads/contracts/observability.

## Safe Change Guide

### Preferred placement

- New page/layout/boundary: `app/<route>/`.
- Shared feature UI: `components/<feature>/`.
- Primitive wrapper: `components/ui/` only when it is truly generic.
- Client behavior: `hooks/`.
- Request schemas: `lib/validations/<domain>.ts`, inferred types exported from Zod.
- Domain invariant: `lib/<domain>/service.ts` or an agreed domain directory introduced under BE-1001.
- Provider adapter: one module per provider under `lib/`.
- Database schema/migration: `prisma/schema.prisma` plus reviewed `prisma/migrations/`.
- Tests: use top-level `tests/`; mirror backend paths under `tests/unit/` or `tests/integration/`, place shared safeguards in `tests/setup/`, and keep reusable auth/request/assertion helpers in `tests/helpers/` as documented in [`TESTING.md`](TESTING.md).
- Logs/metrics: shared telemetry contract/wrapper, never raw console bodies.

### Do not copy

- Direct Prisma from new route handlers when a domain service should own the rule.
- Redirecting `requireAdminAuth` inside APIs.
- Browser-only authorization, validation, upload limits, or destructive confirmation.
- `any`, request-body casts, process-local production controls, demo fallback data, silent empty-array errors, or hard-coded credentials.
- New use of `lib/db-queries.ts`, the second Prisma client, legacy toast system, Supabase docs, or unrelated NITHUB tokens.

### Minimum verification by change type

- Frontend: keyboard/focus, responsive breakpoints, reduced motion, empty/loading/error states, TypeScript, lint, component/accessibility test.
- Backend: anonymous/user/admin authorization, Zod failures, status/error code, provider timeout/failure, structured logs/metrics.
- Database: migration on production-like copy, rollback/backup notes, index/query plan, data backfill verification.
- Payment: reference/amount/currency/email mismatch, duplicate/out-of-order webhook, timeout, idempotency.
- Upload: MIME spoof, magic bytes, byte/dimension/duration limits, duplicate finalization, Cloudinary failure/cleanup.
- Auth: generic errors, brute-force limit, JWT/session role, page and API enforcement.

### Extra-caution files

- [`prisma/schema.prisma`](prisma/schema.prisma)
- [`lib/auth.ts`](lib/auth.ts), [`middleware.ts`](middleware.ts), [`lib/auth-helpers.ts`](lib/auth-helpers.ts)
- donation create/verify/webhook routes
- Cloudinary upload/delete routes
- volunteer record/metrics routes
- [`next.config.mjs`](next.config.mjs)
- root layout/provider/cookie/analytics files
- admin seed/provisioning/migration scripts

## Implementation Activity Log

### 2026-06-23 — BE-0001: Add the backend test toolchain

**Status:** Complete

**Objective**

- Add a Next.js 15/TypeScript-compatible backend unit/integration test runner, required scripts, safe test environment strategy, database isolation/reset documentation, a sample service test, and test-only CI execution.

**Actions taken**

1. Freshly read `PROJECT_CONTEXT.md`, `RULES.md`, `BACKEND_FIX_EPICS.md`, the complete Epic 0 requirements, and BE-0001 before implementation inspection.
2. Inspected Git status, `package.json`, `pnpm-lock.yaml`, `.gitignore`, `.env.example`, `tsconfig.json`, existing backend modules, environment consumers, and the absence of existing tests/workflows. Preserved the user-owned `components/layout/header/navbar.tsx` and `prisma/schema.prisma` changes and unrelated untracked planning files.
3. Selected Vitest with V8 coverage, a top-level `tests/` convention, and a separate `tsconfig.test.json`. Added `test`, `test:watch`, and `test:coverage` scripts and pinned the existing pnpm version for reproducible CI setup.
4. Added a pre-test environment safeguard that removes runtime database/provider credentials, maps only `TEST_DATABASE_URL`/`TEST_DIRECT_URL`, rejects non-PostgreSQL or non-test database names, and blocks unmocked HTTP requests.
5. Added sample `SecurityUtils` service tests and direct safeguard tests. No database query, Paystack call, Cloudinary call, Google Sheets call, or other external HTTP request is made.
6. Added `.env.test.example`, documented test variables in `.env.example`, ignored generated coverage, and documented disposable-database migration, transaction rollback, fixture cleanup, and explicit-reset rules in `TESTING.md`.
7. Added `.github/workflows/backend-tests.yml` to run `pnpm test` on pull requests and pushes to `dev`/`main`. Deliberately left type/lint/build/migration/coverage publication to BE-0004.
8. Reviewed the task diff for whitespace, secrets, generated coverage, unrelated edits, and task-boundary violations. No application runtime path, schema, migration, log, metric, or audit event changed.
9. Updated BE-0001 status/evidence in `BACKEND_FIX_EPICS.md` and revised canonical testing, environment, commands, risks, remediation status, safe-change guidance, and evidence sections in this document.

**Files changed**

- `package.json` — added pnpm metadata, Vitest scripts, and test dependencies.
- `pnpm-lock.yaml` — locked Vitest 4.1.9 and V8 coverage dependencies.
- `vitest.config.ts` — configured Node tests, `@` alias resolution, setup, and coverage output.
- `tsconfig.test.json` — added an independent TypeScript gate for the test harness.
- `tests/setup/environment.ts` — added database/provider isolation and external HTTP blocking.
- `tests/unit/lib/security.test.ts` — added the sample backend service test.
- `tests/unit/test-environment.test.ts` — verified environment and network safeguards.
- `.env.test.example` — defined blank test-only database variable names.
- `.env.example` — documented blank test database variable names.
- `.gitignore` — allowed committed environment examples and ignored coverage output.
- `TESTING.md` — documented commands, conventions, environment isolation, and database reset strategy.
- `.github/workflows/backend-tests.yml` — added test-only CI execution.
- `BACKEND_FIX_EPICS.md` — marked only BE-0001 complete and recorded evidence.
- `PROJECT_CONTEXT.md` — updated the canonical project state and this activity log.

**Commands and verification**

- `pnpm add -D vitest @vitest/coverage-v8` — failed because sandbox DNS was unavailable and pnpm selected a different store.
- `pnpm --store-dir /Users/naijaghost/Library/pnpm/store/v10 add -D vitest @vitest/coverage-v8` — passed after approved network access; existing unrelated peer warnings were reported.
- `pnpm test` — passed; two files and six tests.
- `env DATABASE_URL='postgresql://prod:prod@production.invalid:5432/cksi' DIRECT_URL='postgresql://prod:prod@production.invalid:5432/cksi' PAYSTACK_SECRET_KEY='production-placeholder' CLOUDINARY_API_SECRET='production-placeholder' GOOGLE_PRIVATE_KEY='production-placeholder' pnpm test` — passed; placeholder runtime values were stripped and no connection/request occurred.
- `pnpm test:coverage` — passed; V8 coverage generated.
- `pnpm exec tsc --noEmit --pretty false vitest.config.ts tests/setup/environment.ts tests/unit/lib/security.test.ts --module esnext --moduleResolution bundler --target es2022 --skipLibCheck --strict --esModuleInterop --types node,vitest/globals` — failed because the one-off command did not load the repository path alias; resolved by adding `tsconfig.test.json`.
- `pnpm exec tsc --noEmit --pretty false -p tsconfig.test.json` — passed.
- `CI=1 pnpm test` — passed; two files and six tests.
- `pnpm exec tsc --noEmit --pretty false --incremental false` — failed on the pre-existing application errors listed in Testing and Quality Gates; no BE-0001 file failed.
- `CI=1 pnpm lint` — failed because the pre-existing ESLint configuration is absent and `next lint` opened its setup prompt.
- `pnpm build` — passed and built 47 pages/routes; it still skipped type/lint checks and logged the existing unavailable gallery/database dependency during prerender.
- `git diff --check` — passed.

**Migrations and data actions**

- None. No schema edit, migration, seed, reset, or data write was performed. `pnpm build` executed the existing prerender path, which attempted and failed an existing gallery database read before its fallback allowed the build to finish.

**Security and privacy**

- Test startup removes runtime database and provider credentials, accepts only explicitly named test database URLs with a `test` database name, blocks unmocked HTTP, and stores no secret values in committed examples. No personal data is used.

**Observability**

- No change. BE-0001 adds test infrastructure only and does not introduce a production backend path.

**Remaining issues**

- BE-0002 authentication helpers, BE-0003 provider mocks, and BE-0004 full CI gates remain incomplete. Repository-wide TypeScript and lint failures remain under CTX-008.

### 2026-06-23 — BE-0002: Add reusable authentication test helpers

**Status:** Complete

**Objective**

- Add reusable test-only fixtures for anonymous, normal-user, and admin sessions; route request/context builders for JSON bodies and query strings; and shared assertions for auth, validation, and successful admin JSON responses.

**Actions taken**

1. Freshly read `PROJECT_CONTEXT.md`, `RULES.md`, `BACKEND_FIX_EPICS.md`, the complete Epic 0 requirements, and BE-0002 before implementation inspection.
2. Inspected `git status`, `lib/auth.ts`, `lib/auth-helpers.ts`, `types/next-auth.d.ts`, `tests/setup/environment.ts`, `vitest.config.ts`, `tsconfig.test.json`, `app/api/donations/list/route.ts`, `app/api/donations/export/route.ts`, `app/api/donations/verify/route.ts`, `app/api/volunteer/route.ts`, `app/api/volunteer/[id]/route.ts`, `app/api/volunteer/metrics/route.ts`, and `prisma/schema.prisma` role enums to match the helper layer to the current session and route contracts.
3. Preserved the pre-existing/user-owned `components/layout/header/navbar.tsx` and `prisma/schema.prisma` changes and unrelated untracked planning/context files.
4. Added `tests/helpers/auth.ts` with `anonymousSession`, `userSession`, and `adminSession` fixtures plus a `mockSession` helper bound to mocked `getSession`.
5. Added `tests/helpers/routes.ts` with reusable `createRouteRequest` and async `createRouteContext` builders for route handlers that accept query parameters, JSON bodies, and dynamic `params`.
6. Added `tests/helpers/assertions.ts` with reusable `expectUnauthorized`, `expectForbidden`, `expectValidationFailure`, and `expectAdminJsonSuccess` assertions that future route tests can reuse without duplicating response parsing logic.
7. Added `tests/unit/helpers/backend-test-helpers.test.ts` to verify the session fixtures, request/context builders, and reusable assertions, including a direct `403` response assertion without changing production auth behavior.
8. Added focused route tests in `tests/integration/app/api/donations/list/route.test.ts` and `tests/integration/app/api/volunteer/route.test.ts` to prove the helpers against real route entry points for anonymous/non-admin rejection, admin access with query parameters, and volunteer validation failure with JSON input.
9. Updated `tsconfig.test.json` to include `types/**/*.d.ts` so the NextAuth session augmentation applies to the test helper and route-test imports.
10. Reviewed the task diff for scope, secrets, whitespace, and overlap with later epic tasks. No application runtime path, schema, migration, provider integration, log, metric, or audit behavior changed.
11. Updated BE-0002 status/evidence in `BACKEND_FIX_EPICS.md` and revised canonical testing, remediation-status, safe-change, and evidence sections in this document.

**Files changed**

- `tests/helpers/auth.ts` — added reusable session fixtures and mocked-session utility.
- `tests/helpers/routes.ts` — added request and dynamic-route context builders.
- `tests/helpers/assertions.ts` — added reusable response assertions for auth, validation, and admin JSON success.
- `tests/unit/helpers/backend-test-helpers.test.ts` — verified helper behavior directly.
- `tests/integration/app/api/donations/list/route.test.ts` — added focused admin-auth route coverage using the new helpers.
- `tests/integration/app/api/volunteer/route.test.ts` — added focused validation-failure coverage using the new JSON request helper.
- `tsconfig.test.json` — included NextAuth augmentation types for test-harness type checking.
- `BACKEND_FIX_EPICS.md` — marked only BE-0002 complete and recorded evidence.
- `PROJECT_CONTEXT.md` — updated the canonical project state and this activity log.

**Commands and verification**

- `pnpm test tests/unit/helpers/backend-test-helpers.test.ts tests/integration/app/api/donations/list/route.test.ts tests/integration/app/api/volunteer/route.test.ts` — failed initially because one helper test asserted the mocked session function was called once after three deliberate calls; resolved by removing the incorrect call-count assertion.
- `pnpm exec tsc --noEmit --pretty false -p tsconfig.test.json` — failed initially because `types/next-auth.d.ts` was not included in the test TypeScript program; resolved by adding `types/**/*.d.ts` to `tsconfig.test.json`.
- `pnpm test tests/unit/helpers/backend-test-helpers.test.ts tests/integration/app/api/donations/list/route.test.ts tests/integration/app/api/volunteer/route.test.ts` — passed; three files and eight tests.
- `pnpm test` — passed; five files and fourteen tests.
- `CI=1 pnpm test` — passed; five files and fourteen tests in CI mode.
- `pnpm exec tsc --noEmit --pretty false -p tsconfig.test.json` — passed; test helper and route-test typing succeeded.
- `pnpm exec tsc --noEmit --pretty false --incremental false` — failed before the build completed because the repository `tsconfig.json` includes `.next/types/**/*.ts` and the generated files were absent at that moment.
- `pnpm build` — passed and built 47 pages/routes; it still skipped type/lint checks and logged the existing sandbox `fetch failed` messages plus the existing gallery/database fallback during prerender.
- `pnpm exec tsc --noEmit --pretty false --incremental false` — failed again on the pre-existing application errors listed in Testing and Quality Gates; no BE-0001 or BE-0002 file failed.
- `CI=1 pnpm lint` — failed because the pre-existing ESLint configuration is absent and `next lint` opened its setup prompt.
- `git diff --check` — passed.

**Migrations and data actions**

- None. No schema edit, migration, seed, reset, or application data write was performed.

**Security and privacy**

- The helper layer adds deterministic anonymous, `USER`, and `ADMIN` fixtures without using real credentials or personal data. Route tests continue to use mocked sessions, mocked Prisma calls, and the existing blocked-network test environment.

**Observability**

- No change. BE-0002 adds test-only helpers and route coverage, not a production backend path.

**Remaining issues**

- BE-0003 provider mocks and BE-0004 full CI quality gates remain incomplete. Repository-wide application TypeScript and lint failures remain under CTX-008.

### 2026-06-23 — BE-0003: Add provider mocks

**Status:** Complete

**Objective**

- Add reusable test-only mocks and fixtures for Paystack, Cloudinary, and Google Sheets so backend tests can cover provider success, timeout, invalid-response, and failure paths without real external calls.

**Actions taken**

1. Freshly read `PROJECT_CONTEXT.md`, `RULES.md`, `BACKEND_FIX_EPICS.md`, the complete Epic 0 requirements, and BE-0003 before implementation inspection.
2. Inspected `git status`, `lib/paystack.ts`, `lib/cloudinary.ts`, `app/api/webhooks/paystack/route.ts`, `app/api/storage/cloudinary/upload/route.ts`, `app/api/contact/route.ts`, `app/api/newsletter/route.ts`, `tests/helpers/routes.ts`, `tests/setup/environment.ts`, and `TESTING.md` to align the mock surface with the real provider entry points.
3. Preserved the pre-existing/user-owned `components/layout/header/navbar.tsx` and `prisma/schema.prisma` changes and unrelated untracked planning/context files.
4. Added `tests/helpers/providers.ts` with shared JSON-response helpers, timeout/failure builders, Paystack initialization/verification fixtures, signed webhook payload helpers, Cloudinary upload/delete fixtures, and Google Sheets append fixtures.
5. Added `tests/unit/lib/paystack.test.ts` to mock `fetch` against `lib/paystack.ts` and cover success, timeout, failure, and invalid-response behavior for Paystack adapter calls.
6. Added `tests/integration/app/api/webhooks/paystack/route.test.ts` to exercise a signed mocked Paystack webhook payload and invalid-signature rejection against the real webhook route with mocked Prisma.
7. Added `tests/integration/app/api/storage/cloudinary/upload/route.test.ts` to mock Cloudinary upload/delete behavior for the real upload route across success, timeout, invalid-response, and failure cases with mocked admin auth.
8. Added `tests/integration/app/api/google-sheets-routes.test.ts` to mock `googleapis` writes for the contact and newsletter routes across success, timeout, invalid-response, and failure cases while keeping rate limiting and IP extraction mocked.
9. Updated `TESTING.md` to document that provider fixtures live under `tests/helpers/providers.ts` and should be reused rather than re-created ad hoc.
10. Reviewed the task diff for scope, secrets, whitespace, and overlap with later epic tasks. No application runtime path, schema, migration, environment contract, log, metric, or audit behavior changed.
11. Updated BE-0003 status/evidence in `BACKEND_FIX_EPICS.md` and revised canonical testing, remediation-status, risks, and evidence sections in this document.

**Files changed**

- `tests/helpers/providers.ts` — added shared Paystack, Cloudinary, and Google Sheets fixtures and provider-error builders.
- `tests/unit/lib/paystack.test.ts` — added Paystack adapter mock coverage.
- `tests/integration/app/api/webhooks/paystack/route.test.ts` — added signed webhook payload coverage with mocked Prisma.
- `tests/integration/app/api/storage/cloudinary/upload/route.test.ts` — added mocked Cloudinary upload/delete route coverage.
- `tests/integration/app/api/google-sheets-routes.test.ts` — added mocked contact/newsletter Google Sheets route coverage.
- `TESTING.md` — documented reusable provider fixtures.
- `BACKEND_FIX_EPICS.md` — marked only BE-0003 complete and recorded evidence.
- `PROJECT_CONTEXT.md` — updated the canonical project state and this activity log.

**Commands and verification**

- `pnpm test tests/unit/lib/paystack.test.ts tests/integration/app/api/webhooks/paystack/route.test.ts tests/integration/app/api/storage/cloudinary/upload/route.test.ts tests/integration/app/api/google-sheets-routes.test.ts` — failed initially because the mocked `google.auth.GoogleAuth` implementation was not constructible; resolved by replacing the arrow implementation with a function-style constructor mock.
- `pnpm test tests/unit/lib/paystack.test.ts tests/integration/app/api/webhooks/paystack/route.test.ts tests/integration/app/api/storage/cloudinary/upload/route.test.ts tests/integration/app/api/google-sheets-routes.test.ts` — passed; four files and fifteen tests.
- `pnpm test` — passed; nine files and twenty-nine tests.
- `CI=1 pnpm test` — passed; nine files and twenty-nine tests in CI mode.
- `pnpm exec tsc --noEmit --pretty false -p tsconfig.test.json` — passed; test helper and provider-mock typing succeeded.
- `pnpm exec tsc --noEmit --pretty false --incremental false` — failed before the build completed because the repository `tsconfig.json` includes `.next/types/**/*.ts` and the generated files were absent at that moment.
- `CI=1 pnpm lint` — failed because the pre-existing ESLint configuration is absent and `next lint` opened its setup prompt.
- `pnpm build` — passed and built 47 pages/routes; it still skipped type/lint checks and logged the existing gallery/database fallback plus sandbox `fetch failed` messages during prerender.
- `pnpm exec tsc --noEmit --pretty false --incremental false` — failed again on the pre-existing application errors listed in Testing and Quality Gates; no BE-0001, BE-0002, or BE-0003 file failed.
- `git diff --check` — passed.

**Migrations and data actions**

- None. No schema edit, migration, seed, reset, or application data write was performed.

**Security and privacy**

- The provider-mock layer uses only synthetic fixtures, mocked sessions/auth, mocked Prisma, mocked Cloudinary, and mocked `googleapis`; no real provider credentials, webhook secrets, or personal data are embedded in test files.

**Observability**

- No change. BE-0003 adds test-only provider fixtures and coverage, not a production backend path.

**Remaining issues**

- BE-0004 full CI quality gates remain incomplete. Repository-wide application TypeScript and lint failures remain under CTX-008.

## Glossary

| Term | CKSI meaning |
|---|---|
| App Router | Next.js filesystem routing under `app/`, including pages, layouts, server actions, and route handlers. |
| Server Component | Component rendered on the server by default; can safely query DB when kept server-only. |
| Client Component | `"use client"` component shipped to the browser for state/effects/events. |
| Reconciliation | Matching a Paystack result to the exact pending donation and applying an allowed state transition. |
| Idempotency | Repeating the same request/event produces one durable outcome rather than duplicates. |
| Compensation | Undoing a successful first external write when a later step fails, such as deleting an orphan Cloudinary upload. |
| N+1 | Repeated child queries per parent row; no obvious explicit loop exists, but some relation payloads are over-fetched. |
| PII | Personal data such as volunteer/donor names, email, phone, location, and free text. |
| Liveness | Minimal proof the process responds; should not disclose dependency/log details. |
| Readiness | Whether critical dependencies are available for traffic. |
| Audit event | Append-only record of who/system changed which entity, when, and with what outcome. |

## Evidence Index

### Governance and planning

- [`RULES.md`](RULES.md)
- [`BACKEND_AUDIT_CKSI.md`](BACKEND_AUDIT_CKSI.md)
- [`BACKEND_FIX_EPICS.md`](BACKEND_FIX_EPICS.md)
- [`DESIGN.md`](DESIGN.md)
- [`SETUP.md`](SETUP.md)

### Runtime/configuration

- [`package.json`](package.json), [`pnpm-lock.yaml`](pnpm-lock.yaml)
- [`next.config.mjs`](next.config.mjs)
- [`tsconfig.json`](tsconfig.json)
- [`tailwind.config.ts`](tailwind.config.ts)
- [`components.json`](components.json)
- [`app/layout.tsx`](app/layout.tsx)
- [`components/layout/main-layout.tsx`](components/layout/main-layout.tsx)
- [`middleware.ts`](middleware.ts)
- [`.env.example`](.env.example)

### Testing

- [`vitest.config.ts`](vitest.config.ts), [`tsconfig.test.json`](tsconfig.test.json)
- [`tests/helpers/auth.ts`](tests/helpers/auth.ts), [`tests/helpers/routes.ts`](tests/helpers/routes.ts), [`tests/helpers/assertions.ts`](tests/helpers/assertions.ts)
- [`tests/helpers/providers.ts`](tests/helpers/providers.ts)
- [`tests/setup/environment.ts`](tests/setup/environment.ts)
- [`tests/unit/helpers/backend-test-helpers.test.ts`](tests/unit/helpers/backend-test-helpers.test.ts)
- [`tests/unit/lib/paystack.test.ts`](tests/unit/lib/paystack.test.ts)
- [`tests/integration/app/api/donations/list/route.test.ts`](tests/integration/app/api/donations/list/route.test.ts)
- [`tests/integration/app/api/volunteer/route.test.ts`](tests/integration/app/api/volunteer/route.test.ts)
- [`tests/integration/app/api/webhooks/paystack/route.test.ts`](tests/integration/app/api/webhooks/paystack/route.test.ts)
- [`tests/integration/app/api/storage/cloudinary/upload/route.test.ts`](tests/integration/app/api/storage/cloudinary/upload/route.test.ts)
- [`tests/integration/app/api/google-sheets-routes.test.ts`](tests/integration/app/api/google-sheets-routes.test.ts)
- [`tests/unit/lib/security.test.ts`](tests/unit/lib/security.test.ts)
- [`tests/unit/test-environment.test.ts`](tests/unit/test-environment.test.ts)
- [`TESTING.md`](TESTING.md), [`.env.test.example`](.env.test.example)
- [`.github/workflows/backend-tests.yml`](.github/workflows/backend-tests.yml)

### Frontend

- [`app/page.tsx`](app/page.tsx)
- [`components/layout/header/navbar.tsx`](components/layout/header/navbar.tsx)
- [`app/admin/layout.tsx`](app/admin/layout.tsx)
- [`app/blog/`](app/blog), [`components/blog/`](components/blog)
- [`app/gallery/`](app/gallery), [`components/gallery/`](components/gallery)
- [`components/contact/contact-form.tsx`](components/contact/contact-form.tsx)
- [`components/donate/donate-form.tsx`](components/donate/donate-form.tsx)
- [`components/volunteer/volunteer-form.tsx`](components/volunteer/volunteer-form.tsx)
- [`components/cookies/`](components/cookies)
- [`app/globals.css`](app/globals.css)

### Backend/auth/data

- [`app/api/`](app/api)
- [`actions/blog.ts`](actions/blog.ts)
- [`lib/auth.ts`](lib/auth.ts), [`lib/auth-helpers.ts`](lib/auth-helpers.ts)
- [`lib/prisma.ts`](lib/prisma.ts), [`lib/db/index.ts`](lib/db/index.ts)
- [`lib/db/`](lib/db)
- [`prisma/schema.prisma`](prisma/schema.prisma)
- [`prisma/seed.ts`](prisma/seed.ts), [`scripts/`](scripts)

### Providers and operations

- [`lib/paystack.ts`](lib/paystack.ts)
- [`lib/cloudinary.ts`](lib/cloudinary.ts)
- Paystack webhook and Cloudinary upload routes
- Contact/newsletter Google Sheets routes
- [`lib/monitoring/`](lib/monitoring)
- [`types/monitoring.ts`](types/monitoring.ts)

## When to Refresh This Document

- [ ] A route, page, Prisma model, provider, environment variable, or user role is added or removed.
- [ ] Authentication or authorization behavior changes.
- [ ] A backend-fix epic changes status.
- [ ] Logging, metrics, alerting, or admin operations behavior changes.
- [ ] Deployment, build, test, lint, or package-manager configuration changes.
- [ ] A major dependency is upgraded.
