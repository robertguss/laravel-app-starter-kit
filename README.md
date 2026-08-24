# Laravel App Starter Kit

Design repository for Robert Guss's conventional, AI-friendly Laravel
application starter.

The project is currently in a **documentation-only design phase**. No Laravel
application has been generated. Application implementation requires a separate
explicit approval after this baseline is reviewed.

## Purpose

This starter will provide a fast default foundation for personal/family apps
and small internal tools while leaning heavily on Laravel's official starter,
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

1. [Documentation index](docs/README.md)
2. [Vision and principles](docs/vision-and-principles.md)
3. [Product and deployment envelope](docs/product-envelope.md)
4. [Decision register](docs/decision-register.md)
5. [Baseline architecture](docs/architecture/baseline.md)
6. [Implementation plan](docs/implementation-plan.md)
7. [Roadmap](docs/roadmap.md)
8. [Open questions](docs/open-questions.md)

## Status

- Documentation baseline: captured; awaiting review
- Laravel application: not generated
- Implementation authorization: not yet granted
- Repository visibility: private

## License

No license has been selected. Keep the repository private until Robert
explicitly decides whether it should be published.
