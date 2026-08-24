# Open Questions

Last updated: 2026-08-24

No unresolved starter implementation blocker remains. Phase 1–6 research answers
and adjustments are captured in the implementation record and decision register.
The remaining questions require a real target or product slice and must not be
answered by adding speculative starter code.

## Resolved implementation research

- Exact runtime and dependency locks: recorded in
  [implementation-record.md](implementation-record.md) and the lockfiles.
- Official source: Laravel 13's React/Fortify starter, standard authentication,
  PHPUnit, npm, and PostgreSQL installer choices.
- Starter consumption: Laravel installer's `--using` Git URL path was exercised;
  Packagist publication remains deliberately absent.
- Boost: development-only Amp MCP, guidelines, and six generated skill groups
  are committed.
- Production: pinned Server Side Up 8.3 FPM/Nginx v4.5.1; the derived image
  overrides only the container stop signal to satisfy s6 graceful shutdown.
- Upstream scripts: normal command vocabulary retained; aggregate checks and
  PostgreSQL-specific setup are additive.

## exe.dev deployment

1. Production PostgreSQL operated in Compose versus an external managed service
2. Off-VM backup destination, encryption key ownership, retention, and restore
   schedule
3. Whether uploads remain on local persistent disk or select object storage
4. SMTP provider for apps that send production mail
5. Domain/proxy-header and trusted-proxy configuration
6. OS/image update responsibility and maintenance cadence

## Fly.io deployment

1. Current managed PostgreSQL choice and backup guarantees
2. Scheduler process mechanism and singleton enforcement
3. Object storage choice when uploads exist
4. Minimum machine sizing after representative memory measurement

## Laravel Cloud deployment

1. Current custom starter/build support and deploy-command configuration
2. Managed queue versus database queue behavior and visibility
3. PostgreSQL backup/export and restore-drill procedure
4. Object-storage and mail configuration details

## Comparison applications

1. Exact personal slice journey and data model
2. Exact internal provider workflow and safe fixture data
3. Whether Saloon is compared on the same provider after the Laravel HTTP client
   implementation
4. Minimum evidence required before starting full Event Horizon/LX rebuilds

## Repository administration

- Select a license only before a public release.
- Keep the repository private during initial implementation and comparison.
- Register the repository as an Amp project after the initial branch exists.
