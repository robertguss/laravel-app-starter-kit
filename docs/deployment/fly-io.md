# Fly.io Deployment

Status: artifact implemented and statically validated; no Fly resources created

Last verified: 2026-08-24

The root [`fly.toml`](../../fly.toml) builds the portable image, runs `web`,
`worker`, and singleton `scheduler` process groups, executes one release
migration, exposes only `web` on port 8080, and checks `/up`.

Authoritative sources:

- [Fly application configuration](https://fly.io/docs/reference/configuration/)
- [Fly process groups](https://fly.io/docs/launch/processes/)
- [Fly Managed Postgres](https://fly.io/docs/mpg/)
- [Tigris object storage](https://fly.io/docs/tigris/)

## Provisioning plan

These commands mutate Fly resources and were not run while implementing the
starter.

1. Install and authenticate current `flyctl`. Create an app without deploying,
   replace the placeholder `app` and `primary_region` in `fly.toml`, then run
   `fly config validate`.
2. Create Fly Managed Postgres in the same region. Managed Postgres is the
   current supported production choice; the older Fly Postgres product is
   explicitly unmanaged. Attach the application using `DB_URL` as the custom
   connection variable name. Laravel's current PostgreSQL configuration reads
   `DB_URL`; Fly's default attachment name is `DATABASE_URL`.
3. Set secrets without placing values in shell history or source control:
   `APP_KEY`, mail/provider credentials, and any object-storage credentials. Set
   `APP_URL` to the final HTTPS origin. Confirm `APP_DEBUG=false`.
4. Deploy the reviewed commit. The release command runs
   `php artisan migrate --force --no-interaction` in a temporary Machine and
   blocks deployment on failure.
5. Pin the intended topology explicitly:

    ```bash
    fly scale count web=1 worker=1 scheduler=1
    fly checks list
    fly status
    ```

    Keep exactly one scheduler Machine. Scale the worker independently only
    after measuring database and downstream-provider concurrency.

6. Verify HTTPS `/up`, auth/browser smoke behavior, queue processing, scheduler
   freshness, and graceful restarts from Fly logs.

## Files and object storage

Fly Machine root filesystems are replaceable. The starter's local filesystem
driver is acceptable only while the application has no durable user files.
Before implementing uploads in a derived app, install the conventional Laravel
S3 adapter as documented in the package cookbook, create a private Tigris
bucket, map its generated variables to Laravel's `AWS_*` filesystem variables,
set `FILESYSTEM_DISK=s3`, and verify upload/download/temporary URL/CORS
behavior. Do not attach one Machine volume to multiple process groups as shared
storage.

## Database recovery

Fly Managed Postgres currently documents automatic backups/recovery, high
availability, failover, encryption, pooling, and support ownership. Before a
production launch, record the selected plan's retention and recovery objective
from the dashboard/support contract. Perform a restore into an isolated target,
connect a staging app, run migrations/status and application invariants, and
only then document the measured recovery time. Never test by overwriting the
live database.

## Operations and rollback

- Monitor web checks, process status, logs, failed jobs, queue age, scheduler
  freshness, database metrics, and provider error rates.
- Roll code back to a previously reviewed image/commit through a normal Fly
  deployment. Do not reverse schema automatically.
- Use expand/migrate/contract schema changes because rolling deployments can
  overlap old and new Machines.
- Verify worker SIGTERM handling during a deploy and allow the configured
  30-second kill timeout.
- Review Machine sizes and counts per process; the checked-in 1 GB shared-CPU
  values are conservative starting points, not capacity claims.

Local validation covers TOML parsing, one-image process commands, image health,
and termination behavior. Managed database recovery, Tigris, Fly Proxy HTTPS,
and live rollout behavior remain pending target authorization and credentials.
