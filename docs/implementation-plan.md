# Laravel Starter-Kit Implementation Plan

Status: accepted plan; implementation requires Robert's explicit approval

Last updated: 2026-08-24

## Outcome

Produce a conventional Laravel starter that can create an independent app, run
deterministically in Amp, pass a complete verification suite, and deploy to
exe.dev, Fly.io, or Laravel Cloud without a custom framework layer.

## Phase 0 — Documentation baseline

### Deliverables

- Vision, envelope, decisions, architecture, research, and package policy
- Implementation and comparison roadmaps
- Deployment and integration strategy
- Open implementation questions
- Private repository with documentation-only initial commit

### Exit criteria

- Robert reviews the captured baseline.
- No unresolved design blocker remains.
- Robert explicitly authorizes application implementation.

## Phase 1 — Official Laravel React foundation

1. Recheck current Laravel release/support and official starter manifests.
2. Resolve and lock compatible PHP, Composer, Node, npm, Laravel, Inertia,
   React, Vite, Tailwind, and starter dependencies.
3. Generate the official React starter using its supported workflow.
4. Preserve generated Fortify auth, Wayfinder, layouts, components, scripts,
   and tests.
5. Configure PostgreSQL without redesigning upstream architecture.
6. Record exact versions, sources, and any unavoidable adjustments.

Verification includes the generated auth flows, migrations, PHP/frontend
checks, production build, and responsive browser behavior.

## Phase 2 — Boost, quality, and Amp

1. Install Boost development-only with its official Amp integration.
2. Review and commit portable MCP configuration, AGENTS guidance, rules, and
   skills.
3. Add idempotent `.agents/setup`, `.agents/resume`, and `.amp/services.yaml`.
4. Preserve `composer run dev` and normal npm/Artisan commands.
5. Configure Pint, Larastan, PHPUnit, frontend lint/type/format, audits, and a
   focused Playwright suite.
6. Add one truthful aggregate verification command and CI from an empty
   PostgreSQL environment.

## Phase 3 — Operational foundation and image

1. Validate database cache, sessions, and queues on PostgreSQL.
2. Add independently supervised worker and singleton scheduler roles.
3. Verify failed jobs, graceful shutdown, process reload, and scheduling.
4. Validate framework mail/log, local filesystem, notifications, and HTTP
   client behavior without provider dependencies.
5. Build a multi-stage pinned Server Side Up Nginx/FPM image.
6. Verify non-root permissions, `/up`, static assets, signal handling, and
   web/worker/scheduler/release commands from one digest.

## Phase 4 — Deployment targets

1. Implement and restore-test exe.dev Docker Compose, persistent PostgreSQL,
   backup, migration, rollback, and upgrade documentation.
2. Implement Fly process groups, release command, health checks, managed
   PostgreSQL, and object-storage guidance.
3. Implement Laravel Cloud environment, database, workers, scheduler, object
   storage, build, and migration guidance without enabling Octane.
4. Prove the same application behavior on all targets.

Deployment, remote resource creation, and production writes require separate
approval at execution time.

## Phase 5 — Package cookbook

Write and verify selected official/community package entries. Do not install
the catalog in the starter and do not build a custom recipe engine.

Each entry must document the need threshold, package commands, configuration,
runtime/provider coupling, tests, security, update, and removal considerations.

## Phase 6 — Starter release verification

1. Create a fresh independent app through Laravel's current custom-starter
   workflow.
2. Run setup and full checks in a new Amp orb.
3. Build the production application/image.
4. Verify database, auth, jobs, scheduler, mail/log, storage, health, and
   browser smoke behavior.
5. Complete backup/restore evidence and deployment runbooks.

## Discipline

- Prefer upstream code and commands over local replacements.
- Separate behavior preservation from behavior changes.
- Do not add a package to solve a hypothetical future need.
- Treat package/runtime contradictions as evidence to document and review.
- Keep implementation commits phase-coherent and unpushed until reviewed.
