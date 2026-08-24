# Vision and Principles

Status: accepted direction

Last updated: 2026-08-24

## Vision

Create the default Laravel foundation Robert can use for personal/family apps
and small internal tools when AI writes and maintains most application code.

The kit should make the conventional Laravel path fast, reproducible,
deployable, and legible without insulating the application from Laravel.

## Primary principles

### Laravel is the architecture

Prefer Laravel's official starter, framework facilities, file locations,
commands, lifecycle, and extension points. Do not create a Robert-specific
framework on top.

### The ecosystem is leverage

Choose official Laravel packages first. Use mature community packages when
they remove real application code or provide an enabled operational feature.
Popularity alone is insufficient.

### Keep the core small

The starter should contain only broadly useful, actively exercised behavior.
Redis, Horizon, Octane, Reverb, Scout, billing, social auth, media processing,
RBAC, and provider SDKs remain absent until an application needs them.

### Generated apps are normal apps

A new project must be understandable through standard Laravel documentation.
Packages are installed through Composer and Artisan; no runtime feature registry
or custom recipe engine is allowed.

### Provider portability remains valuable

Laravel Cloud is a first-class target but not an application boundary. The same
application must remain deployable to an owned Linux VM and Fly.io using
standard PostgreSQL, filesystem, queue, mail, and environment configuration.

### AI needs executable context

Laravel Boost, AGENTS guidance, Amp skills, deterministic setup, static
analysis, tests, and browser smoke flows should constrain AI-generated code
without replacing human review.

### Compare outcomes, not syntax

The Laravel and Rails starters should solve the same representative product
problems using their own conventions. The comparison includes Robert's
subjective experience reading, debugging, deploying, and evolving AI-written
code.

## Package admission rule

A package enters the starter only when all are true:

1. The capability is enabled in every generated application.
2. Laravel does not already solve it adequately.
3. The package removes substantial bespoke code or operations.
4. It is actively maintained and compatible with the selected Laravel/PHP
   versions.
5. Its provider coupling, runtime services, migrations, and security boundary
   are understood and verified.

Otherwise it belongs in the cookbook or in a specific application.
