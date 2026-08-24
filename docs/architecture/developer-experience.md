# Developer Experience, Boost, and Amp

Status: accepted direction; not implemented

Last updated: 2026-08-24

## Conventional command surface

Preserve the official starter's Composer, Artisan, and npm commands. Prefer
standard commands such as:

```text
composer install
npm install
composer run dev
php artisan test
php artisan migrate
npm run build
```

An aggregate verification Composer script is acceptable, but do not create a
parallel task-runner vocabulary merely for symmetry with the Rails kit.

## Laravel Boost

Install Boost as a development dependency using its official installer:

```text
composer require laravel/boost --dev
php artisan boost:install
```

Let the current installer generate Amp MCP configuration, `AGENTS.md` guidance,
rules, and skills. Commit portable reviewed output rather than hand-writing a
stale approximation.

Boost is development-only. Its MCP server can inspect logs and schema, query
development data, and execute PHP through Tinker. Never expose it through HTTP,
connect it to production data, or enable it in production.

## Amp files

### `.agents/setup`

Idempotently install the selected PHP and extensions, Composer dependencies,
Node/npm dependencies, PostgreSQL client/service requirements, and Playwright
browser dependencies. Prepare deterministic development/test databases without
writing real secrets.

### `.agents/resume`

Repair a resumed orb quickly: confirm dependencies, generated Wayfinder/assets,
database connectivity, and migrations without performing a full reinstall.

### `.amp/services.yaml`

Run the conventional development command through Amp supervision, expose the
web service through an Amp Portal, declare readiness, and provide useful app
and health links. Do not maintain a second hidden development topology.

## Deterministic AI behavior

- Commit project-specific AGENTS guidance and Boost rules that capture durable
  non-default decisions.
- Do not duplicate the entire Laravel manual.
- Use fixture/development data only in orbs.
- Keep database names isolated across worktrees when parallel work is used.
- Require verification output before an agent claims completion.
