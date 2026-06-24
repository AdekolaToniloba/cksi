# CKSI Complete Codebase Context Prompt

Use this prompt with a coding agent that has read access to the entire CKSI repository.

---

## Prompt

You are a principal full-stack engineer performing a complete, evidence-based analysis of the CKSI codebase.

Your task is to inspect the entire repository and create or replace a root-level file named `PROJECT_CONTEXT.md`. That file must become the canonical technical context for both frontend and backend work. It must help a developer or AI agent understand the application without repeatedly rediscovering its architecture.

Do not modify application code during this task. Only create or update `PROJECT_CONTEXT.md`.

### Required inputs

Read these root documents first when they exist:

- `RULES.md`
- `BACKEND_AUDIT_CKSI.md`
- `BACKEND_FIX_EPICS.md`
- `README.md` and other root Markdown files
- `package.json` and the package-manager lockfile
- `next.config.*`
- `tsconfig.json`
- `tailwind.config.*`
- `components.json`
- `middleware.ts`
- `.env.example`
- `prisma/schema.prisma`
- Prisma migrations and seed scripts

Then inspect all project-owned source files under:

- `app/`
- `actions/`
- `components/`
- `hooks/`
- `lib/`
- `types/`
- `utils/`
- `data/`
- `prisma/`
- `scripts/`
- `public/`, using metadata or selective inspection for binary assets
- Test, CI, deployment, lint, formatting, and tooling directories

Do not analyze generated or vendored content line by line:

- `node_modules/`
- `.next/`
- build output
- coverage output
- generated Prisma client code
- package caches
- binary media files

You may inspect generated/build metadata only when it answers a specific unresolved question.

### Analysis method

1. Inventory the repository before forming conclusions.
2. Use searches to find all:
   - Next.js pages, layouts, loading/error boundaries, route handlers, and server actions
   - Client components using `"use client"`
   - Public and protected routes
   - Authentication and authorization checks
   - Prisma reads/writes, raw queries, transactions, and schema relations
   - External integrations and environment-variable reads
   - Forms, validation schemas, uploads, webhooks, scheduled jobs, and exports
   - Logging, metrics, health checks, rate limits, and audit events
   - Tests, scripts, and deployment configuration
3. Trace important features end to end from UI entry point to persistence/provider and back.
4. Distinguish confirmed facts from inference.
5. Cite repository-relative file paths for every substantial claim.
6. Include line numbers when they materially help locate a convention, risk, or entry point.
7. Never copy secrets or values from `.env`, local credentials, tokens, cookies, private keys, or production data.
8. Never treat folder names or client-side UI controls as proof of security. Verify server-side enforcement.
9. Do not claim a command passes unless you actually run it.
10. If safe and available, run:
    - the package manager’s type-check command
    - lint
    - tests
    - production build
11. Record the exact command and result. If a command cannot run, explain why.
12. Reconcile contradictions between documentation and code. The executable code is the source of truth, but record the mismatch.
13. Mark uncertain items as `Needs verification`; do not invent missing behavior.

### Required feature traces

At minimum, trace:

- Public homepage content and hero loading
- Admin authentication and session/role propagation
- Blog create, edit, publish, delete, and public rendering
- Donation creation, Paystack checkout, verification, webhook reconciliation, listing, and export
- Volunteer submission, deduplication, admin review, metrics, and deletion
- Gallery event creation, Cloudinary upload, media finalization, public display, and deletion
- Contact and newsletter Google Sheets submissions
- Admin dashboard statistics
- Health, logs, metrics, rate limiting, and any background or scheduled jobs

### Required `PROJECT_CONTEXT.md` structure

Generate the document using this exact top-level structure. Add lower-level sections where useful.

```markdown
# CKSI Project Context

## Document Metadata
## Executive Summary
## Product Purpose and User Roles
## Technology Stack
## Repository Map
## Runtime and Deployment Model
## Application Route Map
## Frontend Architecture
## Design System and Styling
## Accessibility and Responsive Behavior
## State Management and Data Fetching
## Forms and Client Validation
## Backend Architecture
## API and Server Action Catalog
## Authentication and Authorization
## Database and Data Model
## External Services and Integrations
## Feature Data Flows
## Validation and Error Handling
## Logging, Metrics, Audit, and Health
## Security Model and Trust Boundaries
## Performance and Caching
## Testing and Quality Gates
## Environment Variables
## Local Development Commands
## Build and Deployment Commands
## Known Issues, Risks, and Technical Debt
## Active Remediation Plan
## Safe Change Guide
## Glossary
## Evidence Index
```

### Section requirements

#### Document Metadata

Include:

- Analysis date in ISO format
- Git branch and commit SHA, if available
- Working-tree status summary
- Package manager and lockfile
- Framework and major dependency versions
- Whether commands were run
- Scope exclusions

#### Executive Summary

Summarize:

- What CKSI is
- Main public and admin capabilities
- Architectural style
- Current maturity
- Highest-risk constraints
- Most important conventions for future work

#### Product Purpose and User Roles

Identify:

- Public visitor
- Donor
- Volunteer applicant
- Newsletter/contact submitter
- Administrator
- External system actors such as Paystack webhooks and scheduled jobs
- What each actor can and cannot do

#### Technology Stack

Provide a table with:

- Layer
- Technology/package
- Version
- Purpose
- Important configuration file

Cover frontend, backend, database, authentication, UI, forms, validation, media, payments, analytics, monitoring, and testing.

#### Repository Map

Explain each project-owned root directory and important subdirectories. Do not paste an enormous raw file tree. Highlight naming conventions and duplicated/legacy paths.

#### Runtime and Deployment Model

Explain:

- Next.js App Router behavior
- Server Components versus Client Components
- Route-handler and server-action runtime assumptions
- Database connection behavior
- Serverless/multi-instance implications
- Static generation, dynamic rendering, caching, and revalidation
- Deployment provider when confirmed

#### Application Route Map

Provide separate tables for:

- Public pages
- Admin pages
- Public APIs
- Protected APIs
- Webhooks
- Server actions

For every route include method where applicable, purpose, authentication requirement, validation, data source, and implementation file.

#### Frontend Architecture

Document:

- Layout hierarchy
- Page/component composition
- Server/client boundaries
- Shared components and hooks
- Admin shell/navigation
- Loading, empty, error, and not-found behavior
- SEO and metadata strategy
- Analytics and cookie-consent behavior

#### Design System and Styling

Document:

- Tailwind and shadcn/ui configuration
- Design tokens, colors, typography, spacing, breakpoints, and themes
- Reusable UI primitives
- Icon library
- Animation approach
- Known inconsistencies or legacy branding

#### Accessibility and Responsive Behavior

Record confirmed patterns and gaps involving:

- Semantic structure
- Keyboard use and focus
- Form labeling and errors
- Dialog/sheet behavior
- Image alternatives
- color contrast
- Reduced motion
- zoom and viewport behavior
- Mobile navigation
- Small, medium, large, and extra-large layouts
- Tables and admin interfaces on narrow screens

#### State Management and Data Fetching

Explain:

- Server-side reads
- Browser `fetch` usage
- URL state
- local state
- Zustand or other global stores, if actually used
- caching, deduplication, retries, invalidation, and optimistic updates
- Avoidable waterfalls and duplicated requests

#### Forms and Client Validation

Inventory every major form and identify:

- Form library
- Client validation
- Server validation
- Submission target
- Success/error UX
- Personal data handled

#### Backend Architecture

Explain the actual layering in use:

- Routes
- server actions
- domain services
- query helpers
- Prisma clients
- provider adapters
- validation
- telemetry

Explicitly identify duplicated patterns and the intended target architecture from `RULES.md` and `BACKEND_FIX_EPICS.md`.

#### API and Server Action Catalog

For each endpoint/action provide:

- Method/name
- Path/file
- Public or protected
- Request schema
- Response shape
- Side effects
- Database models
- External services
- Rate limit
- Logs/metrics/audit events
- Known issue

#### Authentication and Authorization

Trace:

- Credentials login
- Password verification
- JWT callback
- Session callback
- role storage
- middleware behavior
- API guards
- page/action guards
- authorization gaps
- brute-force controls

#### Database and Data Model

For every Prisma model document:

- Purpose
- Important fields
- Relations
- Unique constraints
- indexes
- creation/update paths
- deletion/cascade behavior
- sensitive fields
- migration concerns

Include an accurate Mermaid entity-relationship diagram.

#### External Services and Integrations

For Paystack, Cloudinary, Google Sheets, analytics, email, Redis/Upstash, and monitoring providers:

- Purpose
- Entry points
- Authentication method
- Environment variables by name only
- timeout/retry behavior
- webhook/callback behavior
- failure behavior
- logs and metrics
- current risks

#### Feature Data Flows

For every required feature trace:

- Describe the flow step by step.
- Include a compact Mermaid sequence diagram when it clarifies the flow.
- Mark trust boundaries.
- Identify validation, authorization, persistence, provider calls, status changes, logging, and failure paths.

#### Logging, Metrics, Audit, and Health

Document:

- Event schema
- Log transports and retention
- redaction rules
- request/correlation IDs
- audit-event storage
- metric catalog/backend
- health endpoints
- admin logs/metrics/audit/operations pages
- alerting and scheduled cleanup
- Missing instrumentation by route

Never include actual sensitive log contents.

#### Security Model and Trust Boundaries

Cover:

- Public browser input
- admin browser input
- authentication/session boundary
- API authorization
- database boundary
- webhook signatures
- payment integrity
- upload verification
- formula injection
- XSS and rendering sanitation
- CSRF/same-origin assumptions
- secrets and public environment values
- rate limiting
- personal-data handling
- security headers and CSP

#### Performance and Caching

Cover:

- Async waterfalls
- parallelizable work
- RSC serialization
- Client bundle risks
- dynamic imports
- image optimization
- unbounded lists
- pagination
- database indexes
- connection pooling
- external-service latency
- caching/revalidation
- long-list rendering

#### Testing and Quality Gates

Inventory:

- Unit, integration, route, component, accessibility, E2E, security, migration, and load tests
- CI commands and required checks
- Missing coverage
- Whether lint/type errors can be bypassed

#### Environment Variables

Provide a table containing variable name, public/server-only classification, consumer files, purpose, required/optional status, and safe validation rule. Never include values.

#### Known Issues, Risks, and Technical Debt

Use a table:

| ID | Severity | Area | Confirmed issue | Evidence | Consequence | Planned fix |

Reconcile this with `BACKEND_AUDIT_CKSI.md` and `BACKEND_FIX_EPICS.md`. Note already-fixed findings separately.

#### Active Remediation Plan

Summarize epic status from `BACKEND_FIX_EPICS.md`: not started, in progress, blocked, or complete. Do not mark work complete without code and test evidence.

#### Safe Change Guide

Explain:

- Where new pages, components, schemas, services, routes, migrations, logs, and tests belong
- Which existing patterns are preferred
- Which legacy patterns must not be copied
- What must be tested for frontend, backend, database, payment, upload, and authentication changes
- Files requiring extra caution

#### Evidence Index

List the key files used to establish the context, grouped by area.

### Quality requirements

The completed `PROJECT_CONTEXT.md` must:

- Be specific to CKSI, not a generic Next.js guide.
- Be comprehensive but navigable.
- Use concise tables and diagrams where they improve understanding.
- Use repository-relative links such as `[schema](prisma/schema.prisma)`.
- Clearly label `Confirmed`, `Inferred`, and `Needs verification` statements.
- Avoid duplicating the full backend audit; summarize and link to it.
- Avoid stale counts where possible. If a count matters, include the analysis date.
- Describe current reality separately from target architecture.
- Include enough context that another agent can safely implement one task from `BACKEND_FIX_EPICS.md`.
- End with a short checklist titled `When to Refresh This Document`.

### Refresh triggers

Include these triggers in the final checklist:

- A route, page, Prisma model, provider, environment variable, or user role is added or removed.
- Authentication or authorization behavior changes.
- A backend-fix epic changes status.
- Logging, metrics, alerting, or admin operations behavior changes.
- Deployment, build, test, lint, or package-manager configuration changes.
- A major dependency is upgraded.

Before finishing, perform a consistency pass:

1. Verify every documented route exists.
2. Verify every environment-variable name is spelled exactly as used.
3. Verify public/protected classifications against server-side code.
4. Verify model fields and relations against the Prisma schema.
5. Verify commands against `package.json`.
6. Verify known issues are still present.
7. Confirm no secret value or unnecessary personal data appears in the document.

Return a concise completion summary and link to `PROJECT_CONTEXT.md`.

