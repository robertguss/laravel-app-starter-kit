# Optional Package Cookbook

Status: curated recipes; no package in this document is a baseline dependency

Last updated: 2026-08-24

## How to use this cookbook

These commands are **recipes to run in a derived application**, not commands
that have been run in this design repository and not dependencies of the
starter. Start with Laravel's framework facilities. Install only after the
stated need exists; never install a dormant dashboard, collector, worker,
provider, migration, or authorization model.

Package and framework releases move independently. Before every installation,
re-resolve exact Laravel 13, PHP, Node, database, and service compatibility from
the linked documentation and package metadata. The intentionally unbounded
Composer/npm package names below let the package manager select a currently
compatible release; review the proposed lockfile, release notes, licenses,
scripts, runtime floors, and `composer audit` / `npm audit` output before
accepting it. Run publish/install command `--help` first because tags and
installers can change. Commit reviewed config and migrations; keep secrets in
the deployment secret store, not source control.

After adding or removing any recipe, run the application's focused tests and its
complete aggregate check, build a production artifact, and verify the affected
web/worker/scheduler/release roles in a non-production environment. Never
blindly delete tables or provider data during removal.

## Official Laravel packages

### Horizon

- **Need threshold:** install only when the application has selected Redis for
  queues and needs Horizon's balancing, metrics, and dashboard. Database queues
  remain the starter default.
- **Identity:** [`laravel/horizon`](https://laravel.com/docs/13.x/horizon)
  ([source and MIT license](https://github.com/laravel/horizon)).
- **Recipe:** `composer require laravel/horizon`, then
  `php artisan horizon:install` and `php artisan migrate`. Configure the Redis
  queue connection and `config/horizon.php`; run `php artisan horizon` as a
  supervised worker and terminate it during deploys with
  `php artisan horizon:terminate`.
- **Coupling/config:** requires a supported Redis client/server and queue
  connection; tune environments, supervisors, queues, balancing, waits, and
  `HORIZON_PREFIX`. Authorize the `/horizon` gate outside `local`.
- **Verify/security:** feature-test dashboard authorization and a real queued
  job, failed-job handling, retry, deploy restart, and worker health. Job
  payloads, tags, failures, and metrics can expose personal data or secrets;
  restrict the dashboard and scrub payloads.
- **Upgrade/removal:** read Horizon/Laravel/Redis upgrade notes and drain jobs
  before changing worker versions. To remove, stop supervisors, replace Redis
  queue configuration if appropriate, remove Horizon provider/config/routes,
  `composer remove laravel/horizon`, and deliberately retain or retire Redis and
  historical data.

### Pulse

- **Need threshold:** use for self-hosted aggregate application-performance
  visibility when its storage and sampling costs are justified; do not overlap
  it speculatively with another APM.
- **Identity:** [`laravel/pulse`](https://laravel.com/docs/13.x/pulse)
  ([source and MIT license](https://github.com/laravel/pulse)).
- **Recipe:** `composer require laravel/pulse`, then
  `php artisan vendor:publish --provider="Laravel\Pulse\PulseServiceProvider"`
  and `php artisan migrate`. Configure `config/pulse.php`; run
  `php artisan pulse:work` only for recorders that require ingestion workers.
- **Coupling/config:** couples to its database/Redis storage, recorders,
  sampling, queue, and optional worker. Configure dashboard authorization and
  environment-specific capture; publish dashboard assets only if current docs
  require it.
- **Verify/security:** test dashboard denial/allowance, recorder sampling,
  pruning, worker restart, and representative slow request/job capture. URLs,
  user IDs, queries, exceptions, and cache keys may be sensitive; redact,
  sample, restrict access, and set retention.
- **Upgrade/removal:** review schema/recorder changes and retention before an
  upgrade. Stop `pulse:work`, remove provider/config/custom cards and package,
  then drop Pulse tables only after retention/export requirements are met.

### Telescope

- **Need threshold:** use for short-lived local or tightly controlled staging
  diagnosis when detailed request/job/query/mail inspection is worth storing
  sensitive events. Prefer logs and tests for routine debugging.
- **Identity:** [`laravel/telescope`](https://laravel.com/docs/13.x/telescope)
  ([source and MIT license](https://github.com/laravel/telescope)).
- **Recipe:** normally development-only:
  `composer require laravel/telescope --dev`, then
  `php artisan telescope:install` and `php artisan migrate`. Register its
  provider only in intended environments; configure watchers, pruning, and the
  `/telescope` gate.
- **Coupling/config:** writes to the application database and observes HTTP,
  commands, queries, jobs, cache, mail, notifications, logs, and dumps. Schedule
  `php artisan telescope:prune` where enabled.
- **Verify/security:** test environment registration and dashboard
  authorization, capture one safe request/job, and verify pruning. Telescope can
  store headers, bodies, SQL bindings, mail, and user data; disable noisy
  watchers, hide sensitive request parameters/headers, and never expose it
  publicly.
- **Upgrade/removal:** check watcher/schema changes. Disable capture first,
  remove provider/config/package and scheduled prune, then explicitly archive or
  drop Telescope tables.

### Nightwatch

- **Need threshold:** select when the application deliberately chooses Laravel's
  hosted observability service; do not run it beside another APM without a
  documented signal/ownership split.
- **Identity:** [`laravel/nightwatch`](https://nightwatch.laravel.com/docs)
  ([source and MIT license](https://github.com/laravel/nightwatch)).
- **Recipe:** follow the current Nightwatch project onboarding; ordinarily
  `composer require laravel/nightwatch` and configure the issued
  `NIGHTWATCH_TOKEN`. Run the documented agent/worker command as a supervised
  process if the selected release requires one; do not invent a publish step.
- **Coupling/config:** couples runtime telemetry and billing/retention to the
  Nightwatch SaaS, network egress, project token, sampling, and ignored paths.
- **Verify/security:** in staging, generate a marked request, exception, query,
  and job and confirm ingestion, release/environment labels, filtering, and
  deploy restart. Treat telemetry and the token as sensitive; review data
  residency, subprocess permissions, scrubbing, access, retention, and cost.
- **Upgrade/removal:** coordinate package and hosted-agent changes. Revoke the
  token, stop its process, remove config/instrumentation and
  `composer remove laravel/nightwatch`; confirm billing and retained SaaS data
  are handled separately.

### Reverb and Echo

- **Need threshold:** add only for real server-pushed WebSocket behavior after
  ordinary requests or polling are inadequate.
- **Identity:** [`laravel/reverb`](https://laravel.com/docs/13.x/reverb)
  ([source/license](https://github.com/laravel/reverb)) and
  [`laravel-echo`](https://laravel.com/docs/13.x/broadcasting#client-side-installation)
  ([source/license](https://github.com/laravel/echo)); both MIT.
- **Recipe:** `composer require laravel/reverb`, then
  `php artisan reverb:install`; install the client with
  `npm install --save-dev laravel-echo pusher-js`. Configure broadcasting and
  Echo from `VITE_REVERB_APP_KEY`, `VITE_REVERB_HOST`, `VITE_REVERB_PORT`, and
  `VITE_REVERB_SCHEME`. Run `php artisan reverb:start` as a supervised service
  and `php artisan reverb:restart` on deploy.
- **Coupling/config:** requires long-lived WebSocket ingress/proxying, queue
  workers for broadcast events, channel authorization, allowed origins, and
  `REVERB_APP_ID`, `REVERB_APP_KEY`, `REVERB_APP_SECRET`; horizontal scaling may
  require Redis.
- **Verify/security:** test private/presence channel authorization and event
  payloads, then browser-test connect, reconnect, duplicate delivery, queued
  broadcast, proxy TLS, and deploy restart. Never place the app secret in
  `VITE_*`; minimize payloads, validate origins, rate-limit, and authorize every
  private channel.
- **Upgrade/removal:** coordinate PHP/JS protocol dependencies and rolling
  restarts. Stop Reverb, remove Echo bootstrap/listeners, broadcasting config
  and secrets, `npm uninstall laravel-echo pusher-js`, and
  `composer remove laravel/reverb`; remove Redis/proxy rules only if unused.

### Socialite

- **Need threshold:** install after a named OAuth/OIDC social-login provider and
  account-linking policy are selected. Do not replace the starter's Fortify
  flows speculatively.
- **Identity:** [`laravel/socialite`](https://laravel.com/docs/13.x/socialite)
  ([source and MIT license](https://github.com/laravel/socialite)).
- **Recipe:** `composer require laravel/socialite`; add the provider to
  `config/services.php` with provider-specific client ID, secret, and redirect
  URI. Add explicit redirect/callback routes and application-owned account
  linking; no publish or migration command is normally required.
- **Coupling/config:** depends on the chosen provider's OAuth API, scopes,
  redirect allowlist, credentials, outage/rate limits, and possibly a separate
  SocialiteProviders adapter for non-core providers.
- **Verify/security:** fake/mock provider responses and test state validation,
  denial, callback failure, duplicate email, linking/unlinking, revoked access,
  and a staging round trip. Keep secrets/tokens encrypted, request minimum
  scopes, do not trust provider email without its verification semantics, and
  prevent account takeover through automatic linking.
- **Upgrade/removal:** track provider API and scope changes as well as package
  releases. Remove routes/provider config/package and revoke credentials;
  preserve users and define how formerly social-only users regain access.

### Sanctum

- **Need threshold:** use when a mobile app, external token consumer, or
  decoupled first-party SPA needs Sanctum. A normal Inertia application already
  uses session authentication and does not need it.
- **Identity:** [`laravel/sanctum`](https://laravel.com/docs/13.x/sanctum)
  ([source and MIT license](https://github.com/laravel/sanctum)).
- **Recipe:** `composer require laravel/sanctum`, then use the current framework
  installer (normally `php artisan install:api`) and `php artisan migrate`.
  Configure stateful domains/CORS/session middleware for SPA auth or
  `HasApiTokens` and abilities for personal tokens.
- **Coupling/config:** couples to session cookies/CSRF for stateful SPAs or the
  `personal_access_tokens` table for bearer tokens; configure
  `SANCTUM_STATEFUL_DOMAINS`, cookie domain, HTTPS, expiration, and pruning.
- **Verify/security:** feature-test CSRF/login, unauthenticated responses,
  abilities, ownership, expiration/revocation, and cross-origin behavior.
  Hashing does not make displayed bearer tokens recoverable; never log them, use
  least privilege, rotate/revoke, and protect cookie/CORS settings.
- **Upgrade/removal:** inspect middleware and migration changes. Revoke/delete
  tokens, remove traits/routes/config/middleware and package, and drop the token
  table only after audit/retention decisions.

### Scout

- **Need threshold:** start with PostgreSQL full-text/trigram queries or
  ordinary Eloquent. Add Scout when model indexing, external-engine semantics,
  or cross-record relevance materially exceeds them.
- **Identity:** [`laravel/scout`](https://laravel.com/docs/13.x/scout)
  ([source and MIT license](https://github.com/laravel/scout)).
- **Recipe:** `composer require laravel/scout`, then
  `php artisan vendor:publish --provider="Laravel\Scout\ScoutServiceProvider"`.
  Set `SCOUT_DRIVER`, add `Searchable` only to selected models, configure an
  engine/credentials, and intentionally backfill with
  `php artisan scout:import "App\Models\Model"`.
- **Coupling/config:** database/collection engines have different capabilities;
  Algolia, Meilisearch, Typesense, and others add packages/services, indexes,
  credentials, queues, schemas, and billing. Prefer queued indexing in
  production and define `toSearchableArray` explicitly.
- **Verify/security:** fake Scout in model tests, test searchable data and
  filtering, then verify create/update/delete, backfill, queue retry, relevance,
  and zero-downtime index changes against staging engine. Do not index secrets
  or unauthorized fields; search filters are not authorization.
- **Upgrade/removal:** review engine adapter/schema compatibility and plan
  reindex/rollback. Stop indexing, drain jobs, remove traits/config/package and
  credentials, then delete remote indexes only after retention approval.

### Pennant

- **Need threshold:** use when a real staged rollout, cohort, or experiment
  requires persistent feature decisions. Prefer ordinary config or domain state
  for simple permanent choices.
- **Identity:** [`laravel/pennant`](https://laravel.com/docs/13.x/pennant)
  ([source and MIT license](https://github.com/laravel/pennant)).
- **Recipe:** `composer require laravel/pennant`, then
  `php artisan vendor:publish --provider="Laravel\Pennant\PennantServiceProvider"`
  and `php artisan migrate`. Define features in application code and select the
  array or database store in `config/pennant.php`.
- **Coupling/config:** database-backed flags couple decisions to the features
  table and scope identity; Octane/queues require care around request/job scope
  and cached state.
- **Verify/security:** test active/inactive variants, scope resolution,
  persistence, rollout, purge, and fallback. Never use a flag as the sole
  authorization control; avoid exposing confidential rollout names or personal
  cohort data.
- **Upgrade/removal:** graduate or delete flags promptly and review store/schema
  changes. Resolve every call site to its permanent behavior, remove config and
  package, then archive/drop feature records deliberately.

### Cashier: Stripe or Paddle

- **Need threshold:** choose exactly one after the product has selected Stripe
  Billing or Paddle Billing and Cashier's subscriptions/invoices materially fit
  the billing model. Billing is not a starter concern.
- **Identity:** [`laravel/cashier`](https://laravel.com/docs/13.x/billing)
  ([Stripe source/license](https://github.com/laravel/cashier-stripe)) or
  [`laravel/cashier-paddle`](https://laravel.com/docs/13.x/cashier-paddle)
  ([Paddle source/license](https://github.com/laravel/cashier-paddle)); MIT.
- **Recipe:** Stripe: `composer require laravel/cashier`, then
  `php artisan vendor:publish --tag="cashier-migrations"` and
  `php artisan migrate`. Paddle: `composer require laravel/cashier-paddle`,
  publish the current package's migrations/config as documented, then migrate.
  Add the documented billable trait, webhook route/handler, provider IDs, keys,
  prices, currency, and webhook secret; use each provider CLI/dashboard to
  register webhooks.
- **Coupling/config:** deeply coupled to the selected provider's customer,
  price, tax, checkout, subscription, webhook, and API-version semantics plus
  queues and local billing tables. Use provider-specific env names from current
  docs (`STRIPE_*` or `PADDLE_*`); do not mix recipes.
- **Verify/security:** use provider sandbox clocks/fixtures to test checkout,
  webhook signature and replay/idempotency, renewals, failures, cancellation,
  refunds, taxes, and authorization. Never handle card data directly or log
  keys/webhook bodies indiscriminately; document PCI, tax, privacy, and webhook
  retention responsibilities.
- **Upgrade/removal:** billing upgrades require provider API/migration review
  and webhook compatibility. Stop new sales, preserve statutory records, resolve
  active subscriptions/refunds, revoke keys/webhooks, remove code and package;
  never drop billing data merely because Composer removed Cashier.

### Octane

- **Need threshold:** install only after production-like benchmarks identify PHP
  bootstrap as a material bottleneck and state-leak/memory tests justify a
  persistent runtime. Nginx + PHP-FPM remains the portable default.
- **Identity:** [`laravel/octane`](https://laravel.com/docs/13.x/octane)
  ([source and MIT license](https://github.com/laravel/octane)).
- **Recipe:** install one supported server and Octane, for example
  `composer require laravel/octane` plus the documented FrankenPHP/RoadRunner
  dependency, then `php artisan octane:install`. Configure `config/octane.php`
  and supervise `php artisan octane:start --server=...`; use
  `php artisan octane:reload` during deploys.
- **Coupling/config:** couples the image/process manager and health/shutdown
  behavior to the selected server. Tune workers, max requests, task workers,
  timeouts, proxies, and memory; audit singletons, static state,
  request/container injection, locale, auth, and third-party package state.
- **Verify/security:** run the full suite repeatedly in one worker, cross-user
  state-leak tests, concurrency/load/memory benchmarks, graceful deploy/reload,
  queue/scheduler interaction, and proxy/TLS checks. Persistent memory can leak
  one request's credentials or user data into another.
- **Upgrade/removal:** coordinate Laravel, Octane, server binary/extensions, and
  image changes with benchmark regression and rolling restart. Revert
  process/proxy/health configuration to FPM, remove Octane/server dependencies
  and config, and re-run the same load tests.

### Flysystem AWS S3 adapter

- **Need threshold:** add when uploads/backups require S3 or an S3-compatible
  object store; keep Laravel's local disk where durable local storage suffices.
- **Identity:**
  [`league/flysystem-aws-s3-v3`](https://laravel.com/docs/13.x/filesystem#s3-driver-configuration)
  ([source and MIT license](https://github.com/thephpleague/flysystem-aws-s3-v3)).
- **Recipe:** `composer require league/flysystem-aws-s3-v3`; configure Laravel's
  existing `s3` disk with `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`,
  `AWS_DEFAULT_REGION`, `AWS_BUCKET`, `AWS_URL`, and `AWS_ENDPOINT` as needed.
  No publish or migrate step is normally required.
- **Coupling/config:** couples file operations to bucket policy, region,
  endpoint, path-style setting, CORS, lifecycle/versioning, egress, and provider
  consistency/limits. Prefer workload identity/short-lived credentials where
  available and keep disks application-owned.
- **Verify/security:** use `Storage::fake()` for behavior tests, then
  staging-test put/read/delete, visibility, temporary URLs, multipart limits,
  CORS, outage, lifecycle, and backup/restore. Default private; least-privilege
  bucket IAM, encryption, MIME/content validation, random keys, malware
  controls, and no secret-bearing public URLs.
- **Upgrade/removal:** review AWS SDK/Flysystem changes and inventory/copy data
  before switching disks. Change application writes first, migrate/verify
  objects, remove credentials/config and package, then retire the bucket only
  after retention and restore obligations.

### Provider mail transports

- **Need threshold:** Laravel SMTP is sufficient until a selected provider's API
  transport provides required reliability, observability, or deliverability.
  Choose one transport, not a collection.
- **Identity:** Laravel's
  [mail documentation](https://laravel.com/docs/13.x/mail) lists supported
  Symfony transports: Mailgun
  ([`symfony/mailgun-mailer`, MIT](https://github.com/symfony/mailgun-mailer)),
  Postmark
  ([`symfony/postmark-mailer`, MIT](https://github.com/symfony/postmark-mailer)),
  Resend ([`resend/resend-php`, MIT](https://github.com/resend/resend-php)), and
  Amazon SES
  ([`aws/aws-sdk-php`, Apache-2.0](https://github.com/aws/aws-sdk-php)).
- **Recipe:** install only the provider named by current Laravel docs:
  `composer require symfony/mailgun-mailer symfony/http-client`, or
  `composer require symfony/postmark-mailer symfony/http-client`, or
  `composer require resend/resend-php`, or `composer require aws/aws-sdk-php`.
  Configure that mailer in `config/mail.php` / `config/services.php` with its
  documented env keys, domain/region, endpoint, and `MAIL_MAILER`; no migration
  is normally needed.
- **Coupling/config:** couples sends, webhooks/suppression, credentials, quotas,
  regions, DNS identity (SPF, DKIM, DMARC), queues, and retention to the chosen
  provider. Queue mail through Laravel where appropriate.
- **Verify/security:** retain `Mail::fake()` content/recipient tests, then send
  to a provider sandbox and test worker retry, bounce/complaint/suppression,
  tags, reply-to, and HTML/text rendering. Restrict keys, verify webhook
  signatures, avoid sensitive mail/log content, and establish consent,
  unsubscribe, and retention rules.
- **Upgrade/removal:** review Laravel/Symfony/provider API changes. Switch and
  verify the replacement mailer, drain queued mail, revoke keys/webhooks, remove
  provider config/package, and retain delivery/suppression records as legally
  required.

## Trusted community packages

### Saloon

- **Need threshold:** first use Laravel's HTTP client and a provider-specific
  class. Add Saloon only when many endpoints, OAuth, pagination, DTO mapping,
  middleware, or provider errors make connectors/requests materially clearer.
- **Identity:** [`saloonphp/saloon`](https://docs.saloon.dev) and Laravel plugin
  [`saloonphp/laravel-plugin`](https://github.com/saloonphp/laravel-plugin)
  ([MIT licenses](https://github.com/saloonphp/saloon)).
- **Recipe:** `composer require saloonphp/laravel-plugin`; use its documented
  Artisan generators for connectors/requests only after checking `artisan list`.
  Publish plugin config only if customization requires it. Put provider base
  URL/credentials in `config/services.php` and inject them into a connector.
- **Coupling/config:** adds Saloon/Guzzle version and plugin/SDK coupling;
  optional OAuth/pagination/cache plugins add more. Saloon owns transport
  description; Laravel jobs/services still own orchestration, authorization, and
  persistence.
- **Verify/security:** use Saloon's mock client/fixtures for status, headers,
  timeout, retry, pagination, OAuth refresh, DTO, and error tests, forbid stray
  requests, then make a staging smoke call. Redact tokens/bodies, set explicit
  timeouts, verify TLS/webhooks, limit scopes, and make write retries
  idempotent.
- **Upgrade/removal:** inspect Saloon, Guzzle, and plugin major changes. Replace
  connector/request call sites with Laravel HTTP client before removing
  packages; revoke unused credentials and delete recorded fixtures containing
  sensitive data.

### Spatie Backup

- **Need threshold:** use when an application needs package-managed
  database/file backup orchestration and monitoring; first confirm the
  deployment provider's native backup and restore guarantees. A backup is
  accepted only after restore drills.
- **Identity:** [`spatie/laravel-backup`](https://spatie.be/docs/laravel-backup)
  ([source and MIT license](https://github.com/spatie/laravel-backup)).
- **Recipe:** `composer require spatie/laravel-backup`, then
  `php artisan vendor:publish --provider="Spatie\Backup\BackupServiceProvider"`.
  Configure `config/backup.php`, filesystem destination, database dump binary,
  encryption/password and notifications; schedule `backup:run`, `backup:clean`,
  and `backup:monitor` with overlap protection.
- **Coupling/config:** requires database client binaries, temporary disk space,
  scheduler, destination disk (often S3), notification channels, retention, and
  an independently held encryption key.
- **Verify/security:** run a staging backup, inspect/monitor it, and restore
  into an isolated database/storage on a schedule. Backups contain the
  application's most sensitive data: encrypt in transit/at rest, isolate
  credentials and tenant, restrict logs/downloads, test deletion/retention, and
  keep copies off-host.
- **Upgrade/removal:** review dump-command/config changes without interrupting
  retention. Establish replacement backups and a successful restore first;
  unschedule commands, remove package/config/credentials, but retain or destroy
  archives according to policy—not Composer lifecycle.

### Spatie Health

- **Need threshold:** add when deploy/runtime operators need a composed health
  model, notifications, or a dashboard beyond a minimal framework health route.
- **Identity:** [`spatie/laravel-health`](https://spatie.be/docs/laravel-health)
  ([source and MIT license](https://github.com/spatie/laravel-health)).
- **Recipe:** `composer require spatie/laravel-health`, publish only needed
  config/migrations/views using the current documented tags, run
  `php artisan migrate` if using database result storage, register checks, and
  schedule `php artisan health:check`.
- **Coupling/config:** checks couple to database/cache/queue/disk/services;
  result storage, notifications, scheduler, and dashboard are optional. Keep
  shallow liveness separate from dependency-aware readiness.
- **Verify/security:** unit-test custom checks and failure thresholds; in
  staging break one safe dependency and verify exit status, endpoint, alert,
  recovery, and no alert storm. Do not expose versions, host paths, credentials,
  internal topology, or unrestricted health details publicly.
- **Upgrade/removal:** review check/result migrations and alert semantics.
  Replace required probes first, unschedule and remove routes/checks/config and
  package, then archive/drop result tables intentionally.

### Spatie Activitylog

- **Need threshold:** use for a concrete product/audit history requirement that
  its event model satisfies; it is not a substitute for security logs or a
  speculative record of every model mutation.
- **Identity:**
  [`spatie/laravel-activitylog`](https://spatie.be/docs/laravel-activitylog)
  ([source and MIT license](https://github.com/spatie/laravel-activitylog)).
- **Recipe:** `composer require spatie/laravel-activitylog`, publish its
  migrations/config using the current documented tags, `php artisan migrate`,
  then instrument only named events/models with explicit fields and causer.
- **Coupling/config:** couples domain writes and retention to an activity table,
  Eloquent hooks, auth context, queue context, and optional pruning command.
- **Verify/security:** feature-test event name, subject, causer, old/new values,
  no-op suppression, queued/system actions, authorization, and pruning. Avoid
  passwords, tokens, health/financial secrets, and unnecessary personal data;
  activity logs can be tampered with by a compromised app and are not inherently
  immutable/compliance-grade.
- **Upgrade/removal:** inspect serialization/schema changes. Stop new writes,
  remove traits/calls/UI/config/package, and export/archive/drop records only
  according to audit and privacy retention policy.

### Spatie Media Library

- **Need threshold:** install when models need named media collections,
  conversions, responsive images, and storage lifecycle that would otherwise
  create substantial application code. Use Laravel Storage for simple files.
- **Identity:**
  [`spatie/laravel-medialibrary`](https://spatie.be/docs/laravel-medialibrary)
  ([source and MIT license](https://github.com/spatie/laravel-medialibrary)).
- **Recipe:** `composer require spatie/laravel-medialibrary`, publish the
  package migration/config with current documented tags, `php artisan migrate`,
  implement its media interface/trait, define collections/conversions, and run
  conversion jobs on a supervised queue where configured.
- **Coupling/config:** couples models to media tables, filesystem disks, image
  drivers/binaries, queues, URL generation, and object-store CORS/lifecycle.
- **Verify/security:** fake disks for collection/cleanup tests and staging-test
  upload, conversion, queue failure/retry, temporary/private URL, deletion, and
  restore. Validate actual MIME/size/content, randomize names, prevent script
  execution and SVG abuse, authorize downloads, scan where required, and strip
  metadata.
- **Upgrade/removal:** major versions can require migrations and regeneration.
  Inventory originals/conversions, move files and references to replacement
  ownership, drain conversion jobs, remove package code/config, then retain or
  delete tables/objects deliberately.

### Spatie Laravel Data

- **Need threshold:** use when many typed request/resource/DTO transformations
  benefit from one maintained model. Prefer Form Requests, API Resources, and
  small PHP value objects for ordinary endpoints.
- **Identity:** [`spatie/laravel-data`](https://spatie.be/docs/laravel-data)
  ([source and MIT license](https://github.com/spatie/laravel-data)).
- **Recipe:** `composer require spatie/laravel-data`; publish config only when
  defaults are insufficient, then add explicit data classes. There is normally
  no migration or runtime worker.
- **Coupling/config:** couples public payloads and validation/casting to package
  attributes, transformers, TypeScript generation if selected, and reflection
  caches.
- **Verify/security:** test construction, validation errors, casts, optional
  fields, authorization boundary, serialization shape, and frontend generated
  types if used. Explicitly whitelist output; typed DTOs do not prevent mass
  assignment or accidental secret serialization.
- **Upgrade/removal:** inspect attribute, optional, cast, and TypeScript
  changes. Replace each data class at its boundaries with Form
  Requests/Resources/value objects, remove generation/cache/config and package;
  no stored data should be package-owned.

### Spatie Query Builder

- **Need threshold:** use for a public, documented API requiring allowlisted
  filters, sorts, includes, and fields across many endpoints. Prefer direct
  Eloquent scopes for a few fixed queries.
- **Identity:**
  [`spatie/laravel-query-builder`](https://spatie.be/docs/laravel-query-builder)
  ([source and MIT license](https://github.com/spatie/laravel-query-builder)).
- **Recipe:** `composer require spatie/laravel-query-builder`; optionally
  publish config with its current tag, then define allowed
  filters/sorts/includes per endpoint. No migration or process is normally
  required.
- **Coupling/config:** query-string API semantics become coupled to package
  operators and Eloquent relationships; database indexes and pagination still
  belong to the application.
- **Verify/security:** feature-test every allowed operation, rejected fields,
  policies/tenant scope, null/partial/exact behavior, pagination, query count,
  and worst-case performance. Allowlists are mandatory; never permit arbitrary
  columns/relations, and apply authorization independently of filtering.
- **Upgrade/removal:** query parsing changes can be an API breaking change.
  Freeze contract tests, replace builders with Eloquent/scopes while preserving
  URL behavior, then remove config/package.

### Spatie Settings

- **Need threshold:** install for typed, database-backed application settings
  that administrators change at runtime. Use Laravel config/env for deploy-time
  operational configuration and normal models for rich domain data.
- **Identity:**
  [`spatie/laravel-settings`](https://spatie.be/docs/laravel-settings)
  ([source and MIT license](https://github.com/spatie/laravel-settings)).
- **Recipe:** `composer require spatie/laravel-settings`, publish its config and
  migration with current documented tags, `php artisan migrate`, create typed
  settings and package settings migrations, then run migrations. Configure the
  repository and cache explicitly.
- **Coupling/config:** couples boot/runtime reads to a repository table and
  serializer/cache; setting migrations become deployment ordering concerns.
- **Verify/security:** test defaults, validation, authorization, serialization,
  cache invalidation, migration forward/back, and concurrent updates. Do not
  store deployment secrets here by default; encrypt genuinely sensitive values,
  avoid exposing settings wholesale, and audit admin changes.
- **Upgrade/removal:** preserve setting names/types through package changes.
  Move values into config/domain tables and update callers before removing
  caches/config/package; archive/drop settings tables only after migration and
  retention review.

### Spatie Permission

- **Need threshold:** only when the application explicitly chooses reusable RBAC
  with persisted roles/permissions. Prefer Laravel policies/gates for domain
  authorization; never install generic RBAC in the starter.
- **Identity:**
  [`spatie/laravel-permission`](https://spatie.be/docs/laravel-permission)
  ([source and MIT license](https://github.com/spatie/laravel-permission)).
- **Recipe:** `composer require spatie/laravel-permission`, publish config and
  migrations using the current documented tag, `php artisan migrate`, add
  `HasRoles` to the authenticatable model, choose one guard/team model, and seed
  named roles/permissions idempotently.
- **Coupling/config:** authorization couples to package pivot tables, guards,
  cache, optional teams, middleware, and deployment seed/order. Policies should
  remain the domain-facing boundary.
- **Verify/security:** feature-test each role/permission matrix, direct versus
  inherited grants, wrong guard/team, cache reset, privilege revocation, and
  policy denial. Enforce least privilege and protected admin changes; prevent
  mass assignment/self-escalation and log privileged grants.
- **Upgrade/removal:** review schema/cache/middleware changes carefully. Build a
  mapping to policies or replacement RBAC, migrate grants and verify every
  matrix before removing trait/config/package; retain authorization audit data
  as required.

### Sentry or Honeybadger

- **Need threshold:** choose one hosted error/APM provider when central
  alerting, traces, deploy correlation, and retention justify sending telemetry
  off-site. Do not combine with Nightwatch or another APM without explicit
  boundaries.
- **Identity:** Sentry
  [`sentry/sentry-laravel`](https://docs.sentry.io/platforms/php/guides/laravel/)
  ([source, MIT](https://github.com/getsentry/sentry-laravel)); Honeybadger
  [`honeybadger-io/honeybadger-laravel`](https://docs.honeybadger.io/lib/php/integration/laravel/)
  ([source, MIT](https://github.com/honeybadger-io/honeybadger-laravel)).
- **Recipe:** choose one. Sentry: `composer require sentry/sentry-laravel`, then
  run its current `sentry:publish` command and set `SENTRY_LARAVEL_DSN`.
  Honeybadger: `composer require honeybadger-io/honeybadger-laravel`, publish
  config using its documented provider/tag and set `HONEYBADGER_API_KEY`.
  Configure environment, release, traces/sample rates, ignored exceptions, and
  queue monitoring; no database migration is normally required.
- **Coupling/config:** couples exception/reporting and optional tracing/session
  data to provider SDK, SaaS ingestion, billing, egress, release uploads, and
  retention. Browser SDKs are separate dependencies and privacy decisions.
- **Verify/security:** send the provider's documented staging test event and a
  queued failure; verify grouping, source/release mapping, alert routing,
  scrubbing, sampling, and deploy health without deliberately breaking
  production. Filter request bodies, headers, cookies, SQL, user PII, and
  secrets; restrict DSN/key, source-map access, memberships, and retention.
- **Upgrade/removal:** SDK hooks and tracing defaults can change. Disable
  ingestion/alerts, remove handler/bootstrap/config/package and release upload,
  revoke credentials, then separately export/delete SaaS data and close billing.

### Rector Laravel

- **Need threshold:** add as a development-only tool for a planned, reviewed
  modernization or recurring Laravel-aware refactoring policy—not merely to
  create churn. Pint and Larastan serve different purposes.
- **Identity:**
  [`driftingly/rector-laravel`](https://github.com/driftingly/rector-laravel)
  ([MIT license](https://github.com/driftingly/rector-laravel/blob/main/LICENSE));
  built on [`rector/rector`](https://getrector.com/documentation).
- **Recipe:** `composer require --dev driftingly/rector-laravel`; create a
  reviewed `rector.php` using rules/sets compatible with the installed Laravel
  and PHP, preview with `vendor/bin/rector process --dry-run`, and only then run
  `vendor/bin/rector process`. No migration/runtime config exists.
- **Coupling/config:** development CI is coupled to selected Rector rules and
  PHP/parser versions. Pin behavior through the lockfile and adopt a narrowly
  scoped command rather than enabling every set.
- **Verify/security:** inspect every diff; run Pint, Larastan, focused/full PHP
  tests, browser smoke tests, and production build. Generated rewrites can be
  syntactically valid but semantically or authorization-wise wrong; do not feed
  secrets/vendor/generated code into unnecessary transformations.
- **Upgrade/removal:** update in isolated PRs because rules can alter output.
  Commit accepted source transformations, remove its CI/config and
  `composer remove --dev driftingly/rector-laravel`; application runtime is
  unaffected.

### Pest

- **Need threshold:** choose only if a derived application deliberately adopts
  Pest's test style and will maintain it. The starter standard remains PHPUnit;
  do not keep duplicate examples for stylistic novelty.
- **Identity:** [`pestphp/pest`](https://pestphp.com/docs/installation)
  ([source and MIT license](https://github.com/pestphp/pest)) with
  [`pestphp/pest-plugin-laravel`](https://github.com/pestphp/pest-plugin-laravel)
  (MIT).
- **Recipe:** re-resolve the Pest major compatible with the installed PHPUnit,
  then `composer require --dev pestphp/pest pestphp/pest-plugin-laravel` and
  `php artisan pest:install` (or the current documented installer). Keep the
  Composer plugin allowlist reviewed; run `vendor/bin/pest` and update the
  aggregate test script intentionally.
- **Coupling/config:** test code and plugins couple to Pest/PHPUnit majors,
  `tests/Pest.php`, architecture rules, and parallel/coverage extensions; no
  production provider or migration.
- **Verify/security:** port one representative feature test and confirm filters,
  database isolation, parallel mode if used, coverage, CI exit code, and IDE
  discovery. Tests must still cover authorization/failures and must not use
  production credentials or leak secrets in datasets/snapshots.
- **Upgrade/removal:** coordinate Pest, plugins, PHPUnit, Collision, and PHP
  majors. Convert Pest tests/hooks/datasets to PHPUnit before removing config,
  allowlist entries, and packages; ensure the aggregate command still discovers
  every test.

### Vitest and Testing Library

- **Need threshold:** add when substantial React component behavior merits fast
  DOM-level tests. Keep PHPUnit for server behavior and Playwright for a few
  real-browser journeys; do not duplicate those suites.
- **Identity:** [`vitest`](https://vitest.dev/guide/)
  ([source, MIT](https://github.com/vitest-dev/vitest)),
  [`@testing-library/react`](https://testing-library.com/docs/react-testing-library/intro/)
  ([source, MIT](https://github.com/testing-library/react-testing-library)), and
  [`@testing-library/jest-dom`](https://github.com/testing-library/jest-dom)
  (MIT).
- **Recipe:**
  `npm install --save-dev vitest jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event`.
  Add a Vite-compatible test config/setup, explicit `test`/`test:watch` scripts,
  DOM cleanup/matchers, and include the non-watch command in the aggregate
  check. No Composer package, provider, or migration is involved.
- **Coupling/config:** couples tests to Vite, React, jsdom, TypeScript aliases,
  CSS/assets mocks, and DOM emulation; browser-only APIs may still require
  Playwright.
- **Verify/security:** test an accessible user interaction, validation/error,
  async state, and Inertia boundary with network/router fakes; verify CI exits
  and does not hang in watch mode. Query by roles/names rather than internals;
  prevent real network calls and never place secrets or production responses in
  fixtures/snapshots.
- **Upgrade/removal:** coordinate Node, Vite, Vitest, jsdom, React, and Testing
  Library releases. Move uniquely valuable cases to PHPUnit/Playwright or
  another runner, remove scripts/config/setup/dependencies, run `npm install` to
  refresh the lockfile, and ensure aggregate checks still cover frontend logic.

## Installation decision checklist

Before accepting any recipe, record the concrete capability and owner, compare
it with Laravel's built-in option, select only one provider for the concern, and
prove operational ownership (process, health, backup, retention, alerts, cost,
and removal). Re-check official docs and package metadata, review the lockfile
and licenses, run migrations first against a disposable/staging copy, and add
focused tests. If those answers are not available, reject the speculative
installation.
