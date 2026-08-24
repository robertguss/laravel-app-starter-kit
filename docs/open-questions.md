# Open Questions

Last updated: 2026-08-24

No unresolved product-architecture blocker remains. These implementation and
deployment facts must be resolved from current evidence when their phase starts.

## Implementation-time research

1. Exact current Laravel, PHP, Composer, Node, npm, Inertia, React, Vite,
   Tailwind, Boost, and package versions
2. Exact official custom-starter creation/distribution mechanism
3. Current official starter generation choices and resulting auth/component
   manifest
4. Current Boost installer output for Amp, guidance, MCP tools, and skills
5. Exact Server Side Up image variant, license, tag, digest, PHP extensions,
   shutdown behavior, and health contract
6. Whether upstream scripts require any minimal adjustment for PostgreSQL or
   Amp without replacing their command vocabulary

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
3. Whether Saloon is compared on the same provider after the Laravel HTTP
   client implementation
4. Minimum evidence required before starting full Event Horizon/LX rebuilds

## Repository administration

- Select a license only before a public release.
- Keep the repository private during initial implementation and comparison.
- Register the repository as an Amp project after the initial branch exists.
