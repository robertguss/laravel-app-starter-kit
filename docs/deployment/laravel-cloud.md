# Laravel Cloud Deployment

Status: current runbook implemented; no Cloud resources created

Last verified: 2026-08-24

Laravel Cloud should use its ordinary managed Laravel runtime, not the portable
OCI image. No application SDK or Cloud-specific domain layer is required.
Octane, Inertia SSR, Nightwatch, managed queues, and object storage remain
deliberate opt-ins rather than silent starter dependencies.

Authoritative sources:

- [Environments and build/deploy commands](https://laravel.com/cloud/docs/environments.md)
- [Deployments](https://laravel.com/cloud/docs/deployments.md)
- [Compute](https://laravel.com/cloud/docs/compute.md)
- [Queues](https://laravel.com/cloud/docs/queues.md)
- [Scheduled tasks](https://laravel.com/cloud/docs/scheduled-tasks.md)
- [Serverless Postgres](https://laravel.com/cloud/docs/resources/databases/postgres.md)
- [Object storage](https://laravel.com/cloud/docs/resources/object-storage.md)

## Environment plan

Creating an application, environment, compute, database, bucket, secrets, or
deployment changes external state and was not authorized during implementation.
For an approved target:

1. Connect the repository and reviewed branch. Select **PHP 8.3** and **Node
   22** to match the starter's locked runtime policy. Leave **Use Octane as
   runtime** and Inertia SSR disabled.
2. Attach a Laravel Serverless Postgres 18 database in the same region. Cloud
   injects `DB_HOST`, `DB_USERNAME`, `DB_PASSWORD`, and `DB_DATABASE`; set
   `DB_CONNECTION=pgsql`. Review the selected PITR retention rather than
   assuming a default.
3. Add application variables: `APP_NAME`, production `APP_ENV`, final HTTPS
   `APP_URL`, locale, mail sender, and any non-secret provider settings. Put
   `APP_KEY` and provider credentials in Cloud's encrypted secrets. Keep
   `APP_DEBUG=false`, database cache/session/queue drivers, and secure session
   cookies.
4. Use locked build commands:

    ```bash
    composer install --no-dev --no-interaction --prefer-dist --optimize-autoloader
    npm ci
    npm run build
    php artisan optimize
    ```

    Use only this deploy command:

    ```bash
    php artisan migrate --force --no-interaction
    ```

    Cloud automatically restarts queue workers after deployment. Do not add
    `queue:restart`, `optimize:clear`, or `storage:link` deploy commands.

5. Preserve the starter's database queue by adding one `queue:work` background
   process to a dedicated Worker cluster. Start with one process and the same
   timeout/retry policy used by the image; scale only from measured queue age,
   job memory, and downstream concurrency. Managed queues are not the baseline:
   enabling them requires `aws/aws-sdk-php` and switches the environment to the
   `cloud` queue connection.
6. Enable Cloud's **Scheduler** toggle on one cluster. Cloud invokes
   `schedule:run` each minute; do not also run `schedule:work`. If the cluster
   has multiple replicas, derived-app schedules that must be singleton use
   Laravel's `onOneServer` convention.
7. Deploy, then verify the Cloud HTTPS origin, `/up`, generated authentication,
   queue processing/failed jobs, scheduler freshness, logs, and a fresh browser
   session.

## Persistent files

Cloud filesystems are ephemeral and replica-local. The starter has no durable
upload feature, so the local driver remains until a derived app needs one.
Before adding uploads, install `league/flysystem-aws-s3-v3` using the cookbook,
attach a private Laravel Object Storage bucket, accept Cloud's injected
`FILESYSTEM_DISK` and S3-compatible variables, and verify bucket-level
visibility, temporary URLs, size/content validation, and CORS. Cloud's R2
buckets do not support per-object ACL visibility.

## Backup, restore, and rollback

Choose and record Serverless Postgres PITR retention (the current API supports
0–30 days). Cloud supports manual/scheduled snapshots and restores a snapshot or
point in time into a **new** database. A production restore drill therefore:

1. selects a retained snapshot/time;
2. restores to a newly named database;
3. attaches it to an isolated staging environment;
4. runs migration status and application-level row/invariant checks;
5. records recovery time and cleans up only after evidence is retained.

Roll back application code through a normal deployment of the last reviewed
commit. Do not automatically reverse migrations; use forward repairs and
expand/migrate/contract changes across Cloud's zero-downtime overlap.

## Operational acceptance

Before launch, set owners and alerts for deployment failures, HTTP errors, logs,
database utilization/storage/PITR age, queue failures and age, scheduler
freshness, email/provider errors, object storage, security updates, and spend.
The runbook and commands are locally reviewed, but no Cloud build, deployment,
database restore, worker, scheduler, domain, or bucket was live-verified because
no external resource mutation was authorized.
