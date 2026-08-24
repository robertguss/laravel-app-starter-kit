# Laravel App Starter Kit

Robert Guss's conventional, AI-friendly Laravel application starter.

The repository is a runnable Laravel 13 application generated from Laravel's
official React starter. It keeps the official Fortify, Inertia, React,
TypeScript, Wayfinder, Tailwind, and shadcn/Radix foundation visible while
adding PostgreSQL, Laravel Boost/Amp support, complete quality checks, a
portable production image, deployment runbooks, and an optional-package
cookbook.

## Purpose

This starter provides a fast default foundation for personal/family apps and
small internal tools while leaning heavily on Laravel's official starter,
framework conventions, first-party packages, and trusted community ecosystem.

It is also a controlled comparison with the
[`rails-app-starter-kit`](https://github.com/robertguss/rails-app-starter-kit).
The Laravel version should not imitate Rails. Each kit should express its own
framework's strengths, then be compared through representative applications.

## Accepted direction

- Current official Laravel React starter as upstream
- Inertia, React, TypeScript, Vite, Tailwind, and the starter's shadcn/Radix UI
- PostgreSQL
- Official generated Fortify authentication left unchanged
- Laravel's database cache, session, and queue defaults on PostgreSQL
- Laravel's HTTP client, jobs, scheduler, mail, notifications, and filesystem
- Laravel Boost and its MCP/Amp support as development infrastructure
- PHPUnit, Larastan, Pint, frontend checks, and a small Playwright smoke suite
- Nginx + PHP-FPM in a pinned Server Side Up production image
- exe.dev, Fly.io, and Laravel Cloud deployment documentation
- One conventional starter, not a custom profile or recipe runtime
- Optional packages installed through normal Composer and Artisan commands

## Start here

1. Copy `.env.example` to `.env` and configure a PostgreSQL database.
2. Run `composer install`, `npm ci`, `php artisan key:generate`, and
   `php artisan migrate`.
3. Start normal local development with `composer run dev`.
4. Run the complete check with `composer ci:check`.

In an Amp orb, the executable `.agents/setup` installs the locked toolchain,
prepares disposable PostgreSQL databases, installs Playwright Chromium, builds
assets, and starts the supervised services. `.agents/resume` repairs the
services after a pause.

See the [documentation index](docs/README.md),
[implementation record](docs/implementation-record.md), and
[decision register](docs/decision-register.md) before changing the foundation.

## Status

- Implementation Phases 1–6: complete and locally certified
- Deployment artifacts: implemented and locally validated
- Live exe.dev, Fly.io, and Laravel Cloud deployments: not performed
- Representative personal/internal product slices: deferred follow-up work
- Repository visibility: private

## License

No license has been selected. Keep the repository private until Robert
explicitly decides whether it should be published.
