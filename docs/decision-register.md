# Decision Register

Last updated: 2026-08-24

Implementation state is explicit below. Optional and deferred items remain
absent even when they are documented.

## Implemented decisions

| Area                 | Decision                                                                                                                                           | Rationale                                                                                                   |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| Framework            | Use the current official Laravel React starter as upstream                                                                                         | Tests Laravel's ecosystem and avoids maintaining parallel scaffolding                                       |
| Source shape         | One runnable conventional starter, consumed through Laravel's supported custom-starter workflow                                                    | Keeps generated apps normal and independent without a custom generator framework                            |
| Versions             | Laravel 13.26.1 on PHP 8.3; Node 22.23.2/npm 10.9.8; exact Composer/npm locks                                                                      | Matches current official starter requirements and its PHP 8.3/Node 22 CI choices                            |
| Frontend             | Preserve the official starter's Inertia, React, TypeScript, Vite, Tailwind, shadcn/Radix, and Wayfinder choices                                    | Framework-native frontend conventions are part of the comparison                                            |
| Package manager      | Keep npm and the official starter's scripts/lockfile                                                                                               | Avoids changing tooling merely for parity with Rails                                                        |
| Database             | PostgreSQL                                                                                                                                         | Portable across all deployment targets and appropriate for queues, cache, sessions, and application data    |
| Authentication       | Preserve official generated Fortify authentication and UI                                                                                          | Auth should test Laravel's standard experience; application-specific changes happen per repository          |
| Framework facilities | Use Laravel's Eloquent, validation, policies, jobs, batches, scheduler, HTTP client, mail, notifications, filesystem, cache, and sessions directly | Avoids unnecessary wrappers and dependencies                                                                |
| Queue/cache/session  | Use database drivers on PostgreSQL initially                                                                                                       | Conventional small-app default without mandatory Redis                                                      |
| AI tooling           | Install Laravel Boost development-only through its official Amp integration                                                                        | Supplies version-aware docs, MCP tools, guidelines, and skills                                              |
| PHP quality          | PHPUnit, Pint, and Larastan at the official starter's current strictness                                                                           | Preserves upstream conventions and strong AI guardrails                                                     |
| Browser tests        | Add a small Playwright smoke suite                                                                                                                 | Fits React, Amp artifacts, and cross-browser verification without Dusk duplication                          |
| HTTP integrations    | Use Laravel's HTTP client and provider-specific application classes                                                                                | First-party transport, retries, middleware, fakes, and concurrency are sufficient for ordinary integrations |
| Complex HTTP recipe  | Document Saloon as optional when connectors/requests/OAuth/pagination materially reduce code                                                       | Saloon is strong but not required by every application                                                      |
| Production runtime   | Nginx + PHP-FPM                                                                                                                                    | Most mature and compatible Laravel/PHP production baseline                                                  |
| OCI base             | Pin a reviewed Server Side Up `fpm-nginx` image and digest                                                                                         | Reuses maintained non-root supervision, permissions, health, and shutdown behavior                          |
| Process model        | One immutable image with separate web, worker, scheduler, and one-shot release roles                                                               | Independent health, scaling, and failure isolation from one build                                           |
| Deployments          | First-class exe.dev, Fly.io, and Laravel Cloud documentation                                                                                       | Matches Robert's actual personal and work deployment options                                                |
| Laravel Cloud        | Use the ordinary managed runtime; Octane remains opt-in                                                                                            | Cloud should not force persistent-worker semantics on the portable app                                      |
| Optional packages    | Install through normal Composer/Artisan commands and document in a cookbook                                                                        | Leverages the ecosystem without inventing a recipe runtime                                                  |
| Validation           | Complete the starter, then build personal and internal integration slices before full app comparisons                                              | Provides enough evidence to compare framework ownership and operations                                      |

## Implementation adjustments from current upstream evidence

| Design-time assumption                                   | Implemented adjustment                                                                                                                              | Evidence                                                     |
| -------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| Versions would be selected later                         | Laravel 13, Inertia 3, React 19, Vite 8, Tailwind 4 and all direct locks are recorded                                                               | Official manifests and lockfiles                             |
| Generated auth might be a narrower Fortify set           | Current standard starter also generates confirmed 2FA and passkeys; both remain unchanged                                                           | Generated routes, model traits, pages, migrations, and tests |
| Email verification was expected as active behavior       | Fortify's feature/routes/pages/tests are generated, but the current upstream `User` model does not implement `MustVerifyEmail` by default           | Official generated model and starter FAQ                     |
| Installer scripts were conventional Composer concurrency | Laravel 13 now owns `artisan dev` and uses `@laravel/multiplex`; `composer run dev` remains the public command                                      | Framework `DevCommand` and generated manifest                |
| PostgreSQL version was not selected                      | PostgreSQL 18.6 is pinned for CI and deployments; database cache/session/queue remain the baseline                                                  | Current PostgreSQL image and local Compose proof             |
| The base image's graceful stop metadata was sufficient   | The derived image uses container-facing `SIGTERM`, allowing s6 to send service-level graceful signals; inherited `SIGQUIT` timed out in local proof | Server Side Up v4.5.1/s6 contract and measured stop test     |
| Proxy handling could remain implicit                     | Laravel trusts all proxy addresses because all supported web processes are reachable only through their managed/private proxy boundary              | Laravel middleware configuration and deployment topologies   |
| Community starter distribution implied a package release | The installer-supported Git URL path is certified; no Packagist package or custom generator was published                                           | Installer `--using` behavior and release certification       |

The PostgreSQL-specific starter removes the generated SQLite-file creation step
from `post-create-project-cmd`. Boost replaces the upstream feature-installer
post-update hook after its official install. The aggregate checks and Playwright
smoke suite are additive; normal Composer, Artisan, and npm commands remain.

## Optional cookbook categories

- Redis and Horizon
- Pulse, Telescope, Nightwatch, Sentry, or Honeybadger
- Socialite and Sanctum
- Scout and search engines
- Pennant
- Cashier Stripe/Paddle
- Reverb and Echo
- S3-compatible storage and provider mail transports
- Saloon
- Spatie backup, health, activity log, media library, data, query builder, and
  settings
- Octane/FrankenPHP
- Pest, Vitest/Testing Library, and Rector Laravel

## Rejected as starter defaults

| Choice                                | Reason                                                                          |
| ------------------------------------- | ------------------------------------------------------------------------------- |
| Rails-style profile/recipe engine     | Conflicts with normal Laravel/Composer/Artisan package workflows                |
| Custom authentication model           | Prevents a fair evaluation of the official Laravel starter                      |
| Breeze, Jetstream, or Laravel UI      | Superseded or mismatched with the current official React starter                |
| Generic repository/service layers     | Hide conventional Eloquent/controller/job seams without demonstrated value      |
| Mandatory Redis/Horizon               | Adds a service before database queues prove insufficient                        |
| Octane/FrankenPHP                     | Persistent workers add lifecycle and memory complexity without measured need    |
| Reverb/WebSockets                     | Polling and normal request flows are sufficient until realtime is required      |
| Sanctum for Inertia                   | Normal Inertia applications already use session authentication                  |
| Generic RBAC/multi-tenancy            | Applications can add authorization suited to their actual domain                |
| Saloon in every app                   | Its structure helps complex integrations but is unnecessary for a few endpoints |
| Multiple observability/debug packages | Duplicates instrumentation and expands sensitive-data retention                 |
| Dusk plus Playwright                  | Two browser stacks add cost without extra starter value                         |

## Deferred

- Billing, AI product features, public APIs, OAuth server behavior
- Social login modifications
- Vector search
- Offline-first synchronization
- Kubernetes and cloud-specific infrastructure as code
- Full Event Horizon and LX rebuilds until representative slices are compared
