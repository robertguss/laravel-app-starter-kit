# AGENTS.md

This repository designs and will eventually implement Robert Guss's
conventional Laravel application starter kit.

## Current phase

The repository is in a **documentation-only design phase**. Do not generate a
Laravel application, add dependencies, or implement application code until
Robert explicitly authorizes the implementation phase. Documentation work is
allowed when requested.

Start each session by reading:

1. `README.md`
2. `docs/README.md`
3. `docs/decision-register.md`
4. `docs/roadmap.md`
5. `docs/open-questions.md`

Then read the architecture or research documents relevant to the task.

## Governing principle

This starter exists to leverage Laravel's ecosystem, not to build a framework
on top of Laravel.

- Begin from the current official Laravel React starter.
- Preserve official generated authentication and UI behavior.
- Use controllers, Form Requests, Eloquent models/scopes, policies, jobs,
  events, listeners, notifications, resources, service providers, and Artisan
  commands conventionally.
- Use Laravel framework capabilities before adding a package.
- Prefer official Laravel packages, then mature trusted community packages.
- Add a package only when it removes substantial application code or supplies
  an enabled operational capability.
- Do not add generic repositories, CRUD services, dependency-injection layers,
  command buses, RBAC, multi-tenancy, or connector frameworks speculatively.
- Do not recreate the Rails kit's architecture when Laravel has a native
  convention.

## Settled boundaries

- One conventional starter; no custom runtime plugin, profile, or recipe
  engine.
- Optional packages are installed using their normal Composer and Artisan
  workflows and documented in a cookbook.
- Official Fortify authentication remains unchanged in the starter.
- PostgreSQL is the database.
- Database cache, sessions, and queues are the initial default.
- Laravel's HTTP client is the integration default; Saloon is optional.
- Nginx + PHP-FPM is the portable production runtime. Octane/FrankenPHP is an
  optional benchmark-driven capability.
- Laravel Boost is development-only and its MCP server must never be exposed in
  production or connected to production data.
- exe.dev, Fly.io, and Laravel Cloud are deployment adapters, not domain
  boundaries.

## Shared-state safety

Do not push, publish, deploy, change repository visibility, mutate production
services, or run production migrations without Robert's explicit approval for
that action.

## Planned verification

Implementation should preserve conventional Composer/npm/Artisan commands and
provide one truthful aggregate check. It must include formatting, static
analysis, PHP tests, frontend lint/type/format, production build, dependency
audits, and selected browser smoke tests.

Do not claim any command or service exists during the documentation-only phase.
