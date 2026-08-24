# Product and Deployment Envelope

Status: accepted direction

Last updated: 2026-08-24

## Target applications

### Personal and family apps

- Small explicitly known audience
- Rich Inertia/React interaction where useful
- PostgreSQL-backed application data
- Optional uploads, notifications, scheduled work, and PWA behavior
- Usually one deployment owned by Robert

### Small internal tools

- One bounded tool per team or department
- Standard Laravel authentication unless an application deliberately changes it
- Third-party API reads and user-triggered writes
- Background jobs, imports/exports, reports, and operational visibility
- Deployment to Laravel Cloud, Fly.io, or an owned VM

## Deployment targets

### exe.dev

Validates self-hosting, Docker Compose, locally operated PostgreSQL, persistent
volumes, backups, and full infrastructure responsibility.

### Fly.io

Validates the portable OCI image, process groups, release migrations, managed
PostgreSQL, object storage, and horizontal deployment assumptions.

### Laravel Cloud

Validates Laravel's first-party managed experience. Cloud-specific services are
configured through the platform and do not enter the domain model.

## Expected scale

- One application deployment per bounded product/team
- Modest user counts and traffic initially
- Database queues sufficient until measured pressure requires Redis
- One web role, one or more workers, and exactly one scheduler
- PostgreSQL and object storage capable of growing without a rewrite

## Non-goals

- Generic organizations, teams, tenancy, or RBAC
- A package distribution platform or custom framework
- Public API by default
- Microservices or Kubernetes
- Mandatory Redis, WebSockets, semantic search, billing, or AI
- Hosted authentication or deployment lock-in
- Supporting every package combination in CI

## Ownership tradeoff

Self-hosting PostgreSQL, uploads, processes, backups, secrets, and operating
system updates on exe.dev creates real operational responsibility. Laravel
Cloud and Fly reduce parts of that burden but do not remove the need for tested
migrations, backups, authorization, and dependency maintenance.
