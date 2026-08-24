# Deployment and Operations

Status: accepted direction; not implemented

Last updated: 2026-08-24

## Portable image

Build one immutable OCI image using a pinned, reviewed Server Side Up
`fpm-nginx` base and separate Composer/frontend build stages.

Run separate roles from the same digest:

```text
web        Nginx + PHP-FPM
worker     php artisan queue:work
scheduler  php artisan schedule:work
release    php artisan migrate --force
```

One image does not mean one container. Roles need independent restart, health,
scaling, and failure behavior.

The image should be non-root, compile Vite assets at build time, contain no
development server, write logs to stdout/stderr, serve only `public/`, expose
`/up`, and handle graceful shutdown.

## exe.dev

Use Docker Compose with web, worker, scheduler, PostgreSQL, and one-shot release
services. Only the web port is proxied publicly. PostgreSQL remains private and
uses a persistent volume.

Small single-node applications may use persistent local upload storage, but
database and files need encrypted off-VM backups, checksums, failure visibility,
and a documented restore drill. Spatie Backup may be selected through the
cookbook when its application-managed approach fits.

## Fly.io

Use the same OCI image with web, worker, and scheduler process groups. Define
one release migration command and attach HTTP service/health checks only to the
web group. Use managed PostgreSQL and S3/Tigris-compatible uploads rather than
Machine-local persistence when scaling or replacement is possible.

## Laravel Cloud

Use Cloud's ordinary Laravel runtime, managed database, workers, scheduler,
object storage, environment configuration, and deployment lifecycle. No
application SDK is required for an ordinary Laravel app.

Octane/FrankenPHP remains disabled unless an application separately benchmarks
and validates persistent-worker safety.

## Migrations

Run `php artisan migrate --force` once before updated processes. Do not run
migrations in every web/worker startup. Use backward-compatible
expand/migrate/contract changes where old and new processes may overlap.

## Health

- `/up` verifies the application boots.
- Load-balancer health does not call third-party providers.
- Workers and scheduler require role-appropriate process/heartbeat visibility.
- Queue age, failed jobs, and scheduled-task freshness are operational signals,
  not web liveness checks.

## Secrets

- Commit `.env.example` with names and safe defaults only.
- Never expose server secrets through Vite variables.
- Use deployment environment/secrets systems.
- Amp setup never writes real provider credentials.
- Document owner, scope, rotation, verification, and rollback for each provider
  secret an application installs.

## Observability

Foundation uses Laravel logging, exceptions, correlation context, and `/up`.
Applications select one production observability provider or a self-hosted
Laravel package when needed. Avoid simultaneous Pulse, Telescope, Debugbar,
Nightwatch, Sentry, and Honeybadger installations without explicit roles.
