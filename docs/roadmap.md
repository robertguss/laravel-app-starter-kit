# Combined Roadmap

Status: starter implementation complete; comparison slices deferred

Last updated: 2026-08-24

## Sequence

```text
Documentation and decision record
              |
              v
Conventional Laravel starter foundation
              |
              v
Boost/Amp, verification, operations, deployments, cookbook
              |
              v
Personal and internal representative slices
              |
              v
Rails/Laravel comparison and starter corrections
              |
              v
Optional full Event Horizon and LX rebuilds
```

## Milestone A — Documentation baseline

- Private repository
- Accepted architecture, package policy, implementation plan, and scorecard
- No Laravel application code

Completed at documentation commit `b567fa936df49e37b7d861339f5f3dbb13efc480`.

## Milestone B — Laravel foundation

- Current official React starter
- PostgreSQL
- Upstream authentication and frontend behavior preserved
- Locked dependencies and documented implementation adjustments

Completed. Upstream starter flows and production build pass.

## Milestone C — AI-ready development

- Boost MCP and Amp integration
- Deterministic orb setup/resume/services
- PHPUnit, Larastan, Pint, frontend checks, Playwright, audits, and CI

Completed. Setup, resume, supervised services, CI, and aggregate checks are
checked in and independently exercised.

## Milestone D — Production and deployments

- Database queues/cache/sessions
- Web/worker/scheduler/release roles
- Pinned Nginx/FPM image
- exe.dev, Fly.io, and Laravel Cloud runbooks and verification
- Backups, restore, migrations, rollback, secrets, and health

Artifacts complete. The image and exe.dev topology were locally exercised;
Fly.io and Laravel Cloud configuration/runbooks were validated without creating
external resources. Live target acceptance remains a separately authorized
deployment activity.

## Milestone E — Package cookbook and starter release

- Curated official/community package guidance
- Independent application creation using Laravel's supported custom-starter
  mechanism
- Complete clean-environment certification

Completed. The cookbook is documentation-only and a clean independent starter
install passes the release checks. Robert may now review readiness for the
separate comparison slices.

## Milestone F — Personal slice

Build one Event Horizon-style parent/child mission flow using normal Laravel
models, controllers, policies, Inertia pages, jobs, files, and tests.

Do not promote family-specific code into the starter.

## Milestone G — Internal integration slice

Build one LX-style third-party API workflow using Laravel's HTTP client,
database jobs, progress, retries, and standard queue middleware. Optionally
implement the same provider through Saloon and compare the resulting code.

## Milestone H — Comparison and correction

- Score Rails and Laravel using the documented evidence categories.
- Record AI mistakes and human review friction.
- Promote only universal starter improvements.
- Decide whether Robert prefers one default or maintains both.

## Milestone I — Full applications, if approved

Only after the slices:

- consider a full Event Horizon Laravel rebuild;
- consider a full LX Laravel rebuild;
- plan migration/cutover independently;
- require explicit approval for provider writes, deployments, and production
  data changes.
