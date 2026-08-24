# Production Runtime Research

Status: research snapshot informing accepted decisions

Last updated: 2026-08-24

## Compared options

- Nginx + PHP-FPM
- FrankenPHP classic mode
- Laravel Octane + FrankenPHP worker mode

## Findings

Laravel's current deployment documentation continues to provide conventional
[Nginx/FastCGI guidance](https://github.com/laravel/docs/blob/master/deployment.md).
It has the broadest extension/package compatibility, request isolation, and
operational history.

FrankenPHP classic mode is now officially documented and legitimate. It offers
a simple Caddy/PHP web process but still boots Laravel for each request, so its
main advantage is topology rather than Octane's persistent-worker performance.

Octane's official FrankenPHP integration boots Laravel once and reuses workers.
Laravel documents important
[persistent-state and memory cautions](https://github.com/laravel/docs/blob/master/octane.md).
Static/global/singleton state can leak across requests and third-party packages
may assume PHP exits after each request. It requires cross-request tests,
finite recycling, memory observation, and benchmark evidence.

Fly's Laravel tooling defaults to Nginx/PHP-FPM while supporting optional
Octane. Laravel Cloud offers an opt-in Octane runtime rather than requiring it.

## Community image evidence

[Server Side Up's PHP images](https://github.com/serversideup/docker-php)
describe their `fpm-nginx` variant as the common balance of compatibility,
stability, and performance. The image supplies non-root execution, process
supervision, health behavior, permissions, and role-oriented Laravel guidance.

## Decision

- Default to a pinned Server Side Up Nginx/FPM image.
- Verify the exact image, license, digest, shutdown, permissions, and health
  behavior during implementation.
- Keep Octane/FrankenPHP as an optional benchmark-driven cookbook capability.
- Do not support multiple production runtimes in the starter baseline.
