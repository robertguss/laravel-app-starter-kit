# Documentation Index

Status: implementation Phases 1–6 complete

Last updated: 2026-08-24

This is the durable entry point for future Amp sessions and fresh orbs.

The runnable application is the source of truth for code and locked versions.
The implementation record links the exact upstream inputs and records where
current Laravel behavior changed a design-time assumption.

## Product and decisions

- [Vision and principles](vision-and-principles.md)
- [Product and deployment envelope](product-envelope.md)
- [Decision register](decision-register.md)
- [Open questions](open-questions.md)

## Architecture

- [Baseline architecture](architecture/baseline.md)
- [Authentication](architecture/authentication.md)
- [Developer experience and Amp](architecture/developer-experience.md)
- [Packages and cookbook](architecture/packages-and-cookbook.md)
- [Testing and quality](architecture/testing-and-quality.md)
- [Third-party integrations](architecture/integrations.md)
- [Deployment and operations](architecture/deployment-and-operations.md)

## Research

- [Laravel ecosystem and AI tooling](research/laravel-ecosystem-and-ai.md)
- [Production runtime](research/production-runtime.md)
- [HTTP integrations and Saloon](research/http-integrations.md)

## Execution and comparison

- [Implementation plan](implementation-plan.md)
- [Implementation and release record](implementation-record.md)
- [Combined roadmap](roadmap.md)
- [Rails/Laravel comparison scorecard](comparison-scorecard.md)
- [Optional package cookbook](package-cookbook.md)

## Deployments

- [exe.dev](deployment/exe-dev.md)
- [Fly.io](deployment/fly-io.md)
- [Laravel Cloud](deployment/laravel-cloud.md)

## Status language

- **Accepted direction**: Robert approved the design direction.
- **Implemented baseline**: present in the runnable starter and covered by its
  checks.
- **Optional cookbook entry**: not installed in the starter; documented for an
  application that needs it.
- **Deferred**: intentionally absent until a real requirement appears.

## Sources

- Laravel starter design thread:
  [`T-01a02fe7-70cd-768a-87aa-3eefa8e4132c`](https://ampcode.com/threads/T-01a02fe7-70cd-768a-87aa-3eefa8e4132c)
- Rails starter:
  [`robertguss/rails-app-starter-kit`](https://github.com/robertguss/rails-app-starter-kit)
- Rails Phase 1 implementation thread:
  [`T-01a03154-8940-7659-92f5-36a47a00c02b`](https://ampcode.com/threads/T-01a03154-8940-7659-92f5-36a47a00c02b)
- Official Laravel React starter:
  [`laravel/react-starter-kit`](https://github.com/laravel/react-starter-kit)

Exact selected versions and authoritative snapshots are in the
[implementation record](implementation-record.md). Re-resolve compatibility
before a future dependency upgrade; do not substitute old design guesses for the
lockfiles.
