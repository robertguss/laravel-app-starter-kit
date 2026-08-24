# Laravel Ecosystem and AI Tooling Research

Status: research snapshot informing accepted decisions

Last updated: 2026-08-24

## Official starter

The current official React starter combines Laravel, Inertia, React,
TypeScript, Vite, Tailwind, shadcn/Radix, Wayfinder, and Fortify. Its manifests
are the implementation-time source of truth:

- [React starter repository](https://github.com/laravel/react-starter-kit)
- [Composer manifest](https://github.com/laravel/react-starter-kit/blob/main/composer.json)
- [Frontend manifest](https://github.com/laravel/react-starter-kit/blob/main/package.json)
- [Vite configuration](https://github.com/laravel/react-starter-kit/blob/main/vite.config.ts)

Breeze, Jetstream, and Laravel UI are not the basis for a new React starter.

## Boost and MCP

[Laravel Boost](https://github.com/laravel/boost) is an official development
package that depends on the official [Laravel MCP package](https://github.com/laravel/mcp).
It provides version-aware documentation search, application/package
information, logs/errors, route/URL information, database/schema tools,
browser logs, rules, and Tinker-backed execution.

Boost includes a first-party
[Amp installer](https://github.com/laravel/boost/blob/main/src/Install/Agents/Amp.php)
that understands `.amp/settings.json`, `AGENTS.md`, and `.agents/skills`.

Security implications:

- development dependency only;
- local stdio MCP only;
- never production ingress or production credentials;
- review Tinker/database/browser-log capabilities;
- commit only portable reviewed configuration and guidance.

## Package classification findings

### Foundation/development

- Fortify and Wayfinder as emitted by the official starter
- Tinker, Pint, Pail, PHPUnit, Collision, Faker, Mockery
- Larastan at upstream strictness
- Boost for AI development
- Playwright added for focused browser smoke tests

### Strong official cookbook packages

- Horizon, Pulse, Telescope, Nightwatch, Reverb/Echo
- Socialite, Sanctum, Scout, Pennant, Cashier
- Octane
- S3-compatible Flysystem adapter

### Strong community cookbook packages

- Saloon
- Spatie Backup, Health, Activitylog, Media Library, Laravel Data, Query
  Builder, Settings, and Permission
- Sentry/Honeybadger integrations
- Rector Laravel
- Pest and Vitest/Testing Library

Package versions can raise PHP/runtime floors independently of Laravel. Resolve
compatibility at installation time and avoid a static catalog of assumed
versions.

## Anti-bloat evidence

Laravel already includes Eloquent, validation, authorization, HTTP, queues,
scheduling, caching, sessions, mail, notifications, filesystem, logging, and
events. Packages that duplicate those capabilities need a concrete application
benefit.

Composer and npm audits are the security baseline. Old security-checker
wrappers and incompatible audit suites should not be added speculatively.
