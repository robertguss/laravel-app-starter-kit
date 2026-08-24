# Baseline Architecture

Status: accepted direction

Last updated: 2026-08-24

## Upstream

Generate from the current official Laravel React starter and preserve its
structure. Do not independently recreate its authentication, layouts,
components, route generation, or frontend build.

Exact package versions will be resolved from the current starter and official
compatibility constraints when implementation begins.

## Stack

| Layer | Baseline |
|---|---|
| Framework | Laravel monolith |
| UI | Inertia + React + TypeScript |
| Frontend build | Vite and official starter scripts |
| Styling | Tailwind and official starter shadcn/Radix components |
| Typed routes | Wayfinder |
| Database | PostgreSQL with Eloquent and Laravel migrations |
| Auth | Official starter Fortify behavior |
| Cache/session/queue | Laravel database drivers on PostgreSQL |
| HTTP | Laravel HTTP client |
| Jobs/scheduler | Laravel queues, batches/chains, middleware, and scheduler |
| Files | Laravel Filesystem; local default, S3-compatible when selected |
| Mail | Laravel Mail/Notifications; log default, provider configured per app |
| PHP tests | PHPUnit feature/unit tests |
| Static/format | Larastan and Pint |
| Browser | Small Playwright smoke suite |
| AI | Laravel Boost MCP, guidance, and Amp skills in development |
| Production web | Nginx + PHP-FPM |

## Conventional ownership boundaries

- Controllers coordinate HTTP and Inertia responses.
- Form Requests validate and authorize request data where appropriate.
- Policies and Gates own application authorization.
- Eloquent models, relationships, scopes, casts, and database constraints own
  persistence behavior.
- Jobs, batches, chains, events, listeners, and notifications own asynchronous
  workflows.
- Service classes are justified for a real workflow or external boundary, not
  as wrappers around every model call.
- Provider-specific clients may live under `app/Integrations/<Provider>` while
  remaining ordinary application code.

Do not add repository interfaces, a dependency-injection container, a command
bus, generic CRUD services, or domain modules before an application supplies a
real boundary.

## Frontend ownership

- Preserve official Inertia page and layout conventions.
- Use Laravel validation and Inertia form errors for server-owned forms.
- Use Wayfinder rather than hand-maintained route strings.
- Keep TypeScript strict according to the upstream starter.
- Add client state libraries only for demonstrated interaction complexity.
- Do not add a separate public API or frontend server-state architecture for
  ordinary Inertia pages.

## PostgreSQL conventions

- Use foreign keys, unique constraints, check constraints, and transactions for
  durable invariants.
- Use normal Laravel migrations and documented expand/migrate/contract changes
  for non-atomic production evolution.
- Run production migrations once in the release role.
- Start with PostgreSQL search before installing an external search engine.

## Keep upstream visible

Starter-specific documentation may explain decisions, but generated
applications should not require a starter namespace or runtime package. A
developer should be able to use normal Laravel documentation for application
work.
