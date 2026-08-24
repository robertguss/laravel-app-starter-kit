# Implementation and Release Record

Status: Phases 1–6 complete; locally certified; no live deployment

Last verified: 2026-08-24

## Authoritative inputs

- [Laravel 13 release policy](https://laravel.com/docs/13.x/releases): Laravel
  13 was released March 17, 2026, requires PHP 8.3, supports PHP 8.3–8.5,
  receives bug fixes through Q3 2027, and security fixes through March 17, 2028.
- [Laravel 13 starter-kit documentation](https://laravel.com/docs/13.x/starter-kits):
  the official React starter is Inertia 3, React 19, TypeScript, Tailwind 4,
  shadcn/ui, Wayfinder, and Fortify. Standard Laravel authentication is the
  default; WorkOS is a separately selected variant.
- Official React starter commit
  [`a2426c360c004e50c2d7a58148ecb3bb91be8b6f`](https://github.com/laravel/react-starter-kit/tree/a2426c360c004e50c2d7a58148ecb3bb91be8b6f),
  including its exact
  [`composer.json`](https://raw.githubusercontent.com/laravel/react-starter-kit/a2426c360c004e50c2d7a58148ecb3bb91be8b6f/composer.json)
  and
  [`package.json`](https://raw.githubusercontent.com/laravel/react-starter-kit/a2426c360c004e50c2d7a58148ecb3bb91be8b6f/package.json).
- Laravel Installer 5.31.1 at commit
  [`934a12759f5b1b2b4ddbb68b390fdeb1a570b0c3`](https://github.com/laravel/installer/tree/934a12759f5b1b2b4ddbb68b390fdeb1a570b0c3)
  generated the app. Installer behavior was rechecked against its current main
  commit
  [`d9f4e8017cb4897e766c86dd8cce15dc2bc96be5`](https://github.com/laravel/installer/tree/d9f4e8017cb4897e766c86dd8cce15dc2bc96be5).
- The official starter's current CI selects PHP 8.3 and Node 22. Node 22 remains
  an official LTS line, and Vite 8.2.2 requires Node `^20.19.0 || >=22.12.0`.
  See [Node releases](https://nodejs.org/en/about/previous-releases) and the
  [Vite 8.2.2 manifest](https://github.com/vitejs/vite/blob/v8.2.2/package.json).
- Production runtime: Server Side Up
  [`8.3-fpm-nginx-v4.5.1`](https://github.com/serversideup/docker-php/releases/tag/v4.5.1)
  (GPL-3.0-or-later source) and its
  [documented image behavior](https://serversideup.net/open-source/docker-php/docs/).
- Platform sources are linked from the checked-in
  [exe.dev](deployment/exe-dev.md), [Fly.io](deployment/fly-io.md), and
  [Laravel Cloud](deployment/laravel-cloud.md) runbooks.

## Exact generation and integration

The official starter was generated in a disposable directory with:

```bash
/home/user/.config/composer/vendor/bin/laravel new laravel-app-starter-kit \
  --react --phpunit --npm --database=pgsql --no-boost --no-interaction
```

Choices were React, standard first-party Laravel/Fortify authentication (not
WorkOS), PHPUnit, npm, PostgreSQL, and no installer-time Boost. The generated
tree was copied into the existing repository while excluding `.env`, upstream
README content, `.git`, installed dependencies, and build/cache output. The
original 20 documentation files were retained. This avoided deleting design
history or hand-recreating upstream code.

Phase 6 certified the pushed application snapshot
[`6911bf6b303368944e604ec98d11aafc29095b3b`](https://github.com/robertguss/laravel-app-starter-kit/commit/6911bf6b303368944e604ec98d11aafc29095b3b)
as an independent app with:

```bash
/home/user/.config/composer/vendor/bin/laravel new \
  laravel-starter-phase6-proof \
  --using='https://github.com/robertguss/laravel-app-starter-kit --mode=git' \
  --phpunit --npm --database=pgsql --no-boost --no-interaction
```

The repository is private. Laravel Installer 5.31.1 delegates URL starters to
Tiged but does not expose Tiged's private-repository mode; the documented
[`--mode=git` option](https://github.com/tiged/tiged#private-repositories) was
therefore included in the `--using` value so Tiged used the orb's existing
authenticated SSH access. No credential was embedded or printed. A public
release uses the ordinary URL without that mode option. The generated app had no
inherited `.git` directory and its PostgreSQL database was correctly renamed to
`laravel_starter_phase6_proof` by Laravel Installer.

Laravel Chisel's generated feature-selection hook removed installer-only files
after the selected features were applied. Boost was then installed separately
through its official workflow so its exact development-only output could be
reviewed:

```bash
composer require 'laravel/boost:^2.5' --dev \
  --with-all-dependencies --no-interaction
php artisan boost:install --no-interaction
```

Boost is configured only for Amp. `boost.json`, `.amp/settings.json`, generated
guidelines in `AGENTS.md`, and six generated skill groups are committed. The MCP
command is `php artisan boost:mcp`; it is absent from the production image and
must never be exposed over HTTP or connected to production data.

## Locked platform

| Tool/runtime                              | Selected version                        |
| ----------------------------------------- | --------------------------------------- |
| PHP requirement / local CLI / OCI runtime | `^8.3` / 8.3.33 / 8.3.32                |
| Composer                                  | 2.10.2                                  |
| Laravel Installer                         | 5.31.1                                  |
| Node.js                                   | 22.23.2                                 |
| npm                                       | 10.9.8                                  |
| PostgreSQL deployment/CI                  | 18.6                                    |
| Playwright browser                        | Chromium installed by Playwright 1.62.1 |
| Server Side Up image                      | 8.3 FPM/Nginx v4.5.1                    |

`.node-version`, `.nvmrc`, npm `engines`, and `packageManager` record Node/npm.
The setup script downloads the official Node archive with SHA-256
`d60acfe00a2932254bb0ad20e01b0d74397a0875595de719654b214f4b03f307` and Composer
with its pinned official SHA-256. `composer.lock` and `package-lock.json` are
authoritative for the complete transitive graph.

### Direct Composer locks

| Package                     | Version |
| --------------------------- | ------- |
| `fakerphp/faker`            | 1.24.1  |
| `inertiajs/inertia-laravel` | 3.3.1   |
| `larastan/larastan`         | 3.10.0  |
| `laravel/boost`             | 2.5.5   |
| `laravel/chisel`            | 0.1.1   |
| `laravel/fortify`           | 1.38.0  |
| `laravel/framework`         | 13.26.1 |
| `laravel/pail`              | 1.2.7   |
| `laravel/pao`               | 1.1.4   |
| `laravel/pint`              | 1.30.5  |
| `laravel/sail`              | 1.67.0  |
| `laravel/tinker`            | 3.0.2   |
| `laravel/wayfinder`         | 0.1.21  |
| `mockery/mockery`           | 1.6.15  |
| `nunomaduro/collision`      | 8.9.5   |
| `phpunit/phpunit`           | 12.5.33 |

Fortify's passkey support locks transitive `laravel/passkeys` 0.2.1.

### Direct application and build npm locks

| Package                           | Version | Package                          | Version |
| --------------------------------- | ------: | -------------------------------- | ------: |
| `@inertiajs/react`                |   3.7.0 | `@inertiajs/vite`                |   3.7.0 |
| `@laravel/passkeys`               |   0.2.0 | `@laravel/vite-plugin-wayfinder` |   0.1.7 |
| `@tailwindcss/vite`               |   4.3.3 | `tailwindcss`                    |   4.3.3 |
| `@vitejs/plugin-react`            |   5.2.0 | `vite`                           |   8.2.2 |
| `react`                           |  19.2.8 | `react-dom`                      |  19.2.8 |
| `typescript`                      |   5.9.3 | `laravel-vite-plugin`            |   3.2.0 |
| `@types/react`                    | 19.2.18 | `@types/react-dom`               |  19.2.5 |
| `@radix-ui/react-avatar`          |   1.2.6 | `@radix-ui/react-checkbox`       |  1.3.11 |
| `@radix-ui/react-collapsible`     |  1.1.20 | `@radix-ui/react-dialog`         |  1.1.23 |
| `@radix-ui/react-dropdown-menu`   |  2.1.24 | `@radix-ui/react-label`          |  2.1.15 |
| `@radix-ui/react-navigation-menu` |  1.2.22 | `@radix-ui/react-select`         |   2.3.7 |
| `@radix-ui/react-separator`       |  1.1.15 | `@radix-ui/react-slot`           |   1.3.3 |
| `@radix-ui/react-toggle`          |  1.1.18 | `@radix-ui/react-toggle-group`   |  1.1.19 |
| `@radix-ui/react-tooltip`         |  1.2.16 | `class-variance-authority`       |   0.7.1 |
| `clsx`                            |   2.1.1 | `concurrently`                   |  10.0.5 |
| `globals`                         | 15.15.0 | `input-otp`                      |   1.5.0 |
| `lucide-react`                    | 0.475.0 | `sonner`                         |   2.0.8 |
| `tailwind-merge`                  |   3.6.0 | `tw-animate-css`                 |   1.4.0 |

The official optional build locks are `@laravel/multiplex` 0.4.3, Rollup native
4.9.5, Tailwind Oxide native 4.3.3, and Lightning CSS native 1.33.0 for the
declared Linux/Windows platforms.

### Direct frontend quality locks

| Package                             | Version | Package                       | Version |
| ----------------------------------- | ------: | ----------------------------- | ------: |
| `@playwright/test`                  |  1.62.1 | `@types/node`                 | 22.20.1 |
| `@eslint/js`                        |  9.39.5 | `eslint`                      |  9.39.5 |
| `@stylistic/eslint-plugin`          |  5.10.0 | `eslint-config-prettier`      |  10.1.8 |
| `eslint-import-resolver-typescript` |   4.4.5 | `eslint-plugin-import`        |  2.32.0 |
| `eslint-plugin-react`               |  7.37.5 | `eslint-plugin-react-hooks`   |   7.1.1 |
| `prettier`                          |   3.9.6 | `prettier-plugin-tailwindcss` |  0.6.14 |
| `typescript-eslint`                 |  8.67.0 | `babel-plugin-react-compiler` |   1.0.0 |

ESLint 9.39.5 is the newest release satisfying the official starter's ESLint 9
constraint even though npm now marks that major unsupported; moving to ESLint 10
is an upstream-compatibility upgrade, not a release-certification special case.

## Integrated application architecture

- Official `app/Actions/Fortify`, user model/traits, Fortify provider, settings
  controllers/requests, middleware, routes, and five migrations.
- Registration, password login/reset/confirmation, verification feature and
  pages, confirmed TOTP 2FA, passkey login/confirmation/management, profile,
  password/security/appearance settings, account deletion, rate limits, and
  generated PHP tests.
- Twelve official Inertia pages, all upstream app/auth/settings layouts,
  Wayfinder generation, Vite fonts, and 26 generated UI component files.
- PostgreSQL connection defaults plus database-backed cache, sessions, queues,
  jobs, batches, and failed jobs.
- Conventional framework HTTP client, mail/notifications, logs, local
  filesystem, queues, scheduler, and `/up`; no provider abstraction layer.
- `.agents/setup`, `.agents/resume`, `.amp/services.yaml`, pinned CI service,
  Dependabot, aggregate checks, and three focused Playwright browser journeys.
- One multi-stage OCI image and separate web, worker, singleton scheduler, and
  one-shot release roles.
- exe.dev Compose/backup/restore artifacts, Fly process configuration, Laravel
  Cloud runbook, and a 26-category optional package cookbook.

## Necessary upstream adjustments

1. PostgreSQL is the only application database. `.env.example`, PHPUnit,
   Playwright, CI, setup, and deployment files use it; the generated SQLite file
   creation hook was removed.
2. The generated database cache/session/queue defaults were retained. No Redis
   service, Redis client package, or Horizon was added. The selected production
   base happens to contain its standard Redis PHP extension, but the app does
   not configure or require Redis.
3. Current upstream auth includes passkeys and 2FA. It also enables the email
   verification feature while leaving `MustVerifyEmail` commented on `User`;
   this exact policy was preserved.
4. Laravel 13's conventional `composer run dev` delegates to `artisan dev` and
   `@laravel/multiplex`, rather than the older hand-written Composer concurrency
   script assumed during design.
5. Playwright is the only added browser dependency. Dusk, Vitest, and Testing
   Library remain optional cookbook choices.
6. `bootstrap/app.php` trusts all proxy addresses because every supported
   production topology exposes the web process only behind a private/managed
   proxy. Deployments must not expose the container port directly to untrusted
   clients.
7. The derived Server Side Up image retains the upstream entrypoint and `/init`
   supervision but uses container-facing `SIGTERM`. The image's inherited
   `SIGQUIT` failed to stop s6 within 30 seconds locally; `SIGTERM` exited
   cleanly in 3 seconds while s6 retained service-specific graceful signals.
8. Optional packages remain cookbook-only. No recipe/profile runtime, hosted
   auth, custom auth model, grants, invitations, owners, RBAC, teams, Socialite,
   Redis/Horizon, Octane/FrankenPHP, Reverb, deployment SDK, or product-domain
   code was added.
9. The checked-in database example keeps Laravel's conventional `laravel`
   placeholder so the custom-starter installer can rename it for each generated
   app. Amp setup validates and creates that generated database name instead of
   assuming the source repository's name.
10. Current Laravel Installer supports public Git URL starters directly. While
    this repository remains private, its Tiged adapter requires the documented
    Git mode adjustment shown above. No package was published and repository
    visibility was not changed.

## Verification evidence

The decisive release run uses locked installs and a fresh PostgreSQL database:

| Check                                                      | Result                                                                        |
| ---------------------------------------------------------- | ----------------------------------------------------------------------------- |
| Laravel `--using` independent app generation               | Passed from source commit `6911bf6`; PHPUnit/npm/PostgreSQL choices           |
| `.agents/setup` / `.agents/resume` from empty dependencies | Passed; locked installs, generated database, assets, browser, services        |
| PostgreSQL 18.6 fresh app and separate restore database    | Passed; 5 migrations and isolated Compose restore drill                       |
| `php artisan test`                                         | 42 passed, 149 assertions, including auth/settings/security/operations        |
| Pint / Larastan                                            | Passed with no baseline or ignored errors                                     |
| ESLint / Prettier / TypeScript                             | Passed                                                                        |
| `npm run build`                                            | Passed; 2,311 modules transformed                                             |
| strict Composer validation                                 | Valid                                                                         |
| Composer audit / npm audit                                 | No advisories or vulnerabilities                                              |
| Playwright Chromium                                        | 3 journeys passed: auth/logout, mobile shell, 404                             |
| Application and `/up`                                      | Laravel 13 booted; framework `Application up` response returned 200           |
| Independent OCI image                                      | Built; `www-data`, writable paths, OPcache, PDO PostgreSQL, no Node/npm/Boost |
| Compose topology                                           | PostgreSQL, web, worker, scheduler healthy; release migration passed          |
| Backup/restore                                             | Custom-format dump checksum and isolated restore drill passed                 |
| Signals                                                    | web, worker, and scheduler terminate/restart cleanly within grace period      |

For the independent proof, dependency directories, generated assets, `.env`, and
all three disposable databases were removed after installer generation. Setup
restored them from the committed locks and example, migrated the absent
application database, and started `/up`. The aggregate check then regenerated
Wayfinder output before type checking and passed from that clean app. The
independent image retained the Server Side Up entrypoint, became healthy,
returned 200 from `/up`, and exited 0 three seconds after `SIGTERM`.

## Validation boundary

The OCI image, Compose topology, migration role, PostgreSQL 18.6 backup/restore,
process health, shutdown, Fly TOML parsing, shell syntax, and Cloud commands
were validated locally. No exe.dev VM, Fly app/database/Tigris bucket, Laravel
Cloud application/database/bucket, domain, DNS, mail provider, managed backup,
secret, or paid resource was created or changed. HTTPS proxying, live rollouts,
platform-managed restore drills, monitoring, and target capacity therefore
remain pending explicit target authorization and credentials.
