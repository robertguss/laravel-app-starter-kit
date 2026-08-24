# Packages and Cookbook

Status: policy and cookbook implemented; optional packages remain uninstalled

Last updated: 2026-08-24

## Selection order

1. Laravel framework capability
2. Official Laravel package
3. Mature trusted community package
4. Small application-local code

Do not install a package merely because it is popular.

## Foundation and development packages

Preserve the current official React starter manifest. Add only development
infrastructure that every generated application exercises:

- Laravel Boost
- Pint
- Larastan/PHPStan
- PHPUnit and upstream testing dependencies
- Pail, Tinker, Collision, Faker, and Mockery as emitted/required upstream
- Playwright for selected browser smoke flows

Keep Sail if the current starter emits it, but do not make Sail or Herd an Amp
requirement.

## Official optional packages

| Capability                   | Package                  | Include when                                                  |
| ---------------------------- | ------------------------ | ------------------------------------------------------------- |
| Redis queue dashboard        | Horizon                  | Redis queues and operational dashboard are required           |
| Performance dashboard        | Pulse                    | Self-hosted aggregate application metrics are wanted          |
| Request/job debugging        | Telescope                | Local/staging event recording justifies sensitive storage     |
| Hosted Laravel observability | Nightwatch               | The application selects Laravel's SaaS telemetry              |
| Realtime                     | Reverb + Echo            | Actual WebSocket behavior exists                              |
| Social identity              | Socialite                | An application selects OAuth login                            |
| API tokens                   | Sanctum                  | An external API/mobile/decoupled client exists                |
| Search                       | Scout                    | Search indexing semantics exceed ordinary PostgreSQL/Eloquent |
| Feature rollout              | Pennant                  | A real rollout/experiment needs flags                         |
| Billing                      | Cashier Stripe/Paddle    | The product selects that billing provider                     |
| Persistent runtime           | Octane                   | Measurements and state-safety tests justify it                |
| S3 storage                   | Flysystem AWS S3 adapter | Uploads require object storage                                |

## Trusted community cookbook

Document conventional installation and removal considerations for:

- Saloon
- Spatie Backup
- Spatie Health
- Spatie Activitylog
- Spatie Media Library
- Spatie Laravel Data
- Spatie Query Builder
- Spatie Settings
- Spatie Permission only for an application that explicitly chooses RBAC
- Sentry or Honeybadger
- Rector Laravel
- Pest or Vitest/Testing Library as alternate/added testing styles

## Cookbook entry requirements

Each entry records:

- authoritative package and license links;
- compatibility and runtime requirements;
- the threshold for installing it;
- normal Composer/Artisan commands;
- migrations, configuration, and environment names;
- process/provider coupling;
- security and sensitive-data implications;
- focused tests and deployment verification;
- update and removal considerations.

The cookbook is documentation, not executable remote code or a second package
manager.

The implemented catalog is [`docs/package-cookbook.md`](../package-cookbook.md).

## Anti-bloat rules

- One provider per concern.
- No dormant dashboard, collector, worker, service provider, or migration.
- No speculative Redis, Horizon, Octane, Reverb, Scout, or billing.
- No duplicate debugging stacks.
- No PHPStan baseline in a new application.
- Review runtime floors before packages silently raise PHP requirements.
- Run Composer/npm audits and lockfile review for dependency changes.
