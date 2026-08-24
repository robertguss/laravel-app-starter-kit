# Testing and Quality

Status: implemented

Last updated: 2026-08-24

## PHP tests

Use the current official starter's PHPUnit configuration and style. Most tests
should be Laravel feature tests covering:

- routes and middleware;
- validation and authorization;
- database effects and constraints;
- Inertia responses and props;
- dispatched jobs, events, mail, and notifications;
- official authentication flows.

Use unit tests for isolated logic where booting Laravel adds no value.

Pest is an optional cookbook choice, not a second baseline syntax.

## Static analysis and formatting

- Keep Larastan at the official starter's current meaningful strictness.
- Do not accept a baseline of ignored errors in a new app.
- Use Pint with the Laravel preset and minimal configuration.
- Preserve upstream TypeScript strictness, ESLint, and Prettier/Tailwind
  formatting.

## Browser tests

Use Playwright for a small black-box suite because it integrates well with
React, Amp screenshots/traces, and multiple browser engines.

Initial smoke flows should cover only representative behavior:

1. guest can load authentication;
2. standard registration works if enabled upstream;
3. user can log in;
4. authenticated dashboard renders;
5. user can log out;
6. responsive shell and one error state remain usable.

Do not install Laravel Dusk and Playwright together. Add frontend Vitest and
Testing Library only when meaningful client-owned logic exists.

## Aggregate verification

`composer ci:check` includes:

- Pint check;
- Larastan;
- PHPUnit;
- frontend lint, type, and format checks;
- production frontend/application build;
- Composer and npm audits;
- selected Playwright smoke flows.

CI starts from an empty environment with PostgreSQL and locked dependencies.
