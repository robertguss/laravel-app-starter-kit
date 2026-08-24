# exe.dev Deployment

Status: artifacts implemented and locally restore-tested; no live VM deployed

Last verified: 2026-08-24

This target owns the full stack on one persistent exe.dev VM. The checked-in
Compose file runs the same application image as three independent roles, a
one-shot release role, and PostgreSQL 18.6. exe.dev terminates TLS and proxies
only loopback port 8000; PostgreSQL has no host port.

## Before production

- Choose the VM region and capacity from measured load.
- Decide whether the HTTPS proxy remains private, is shared with named users, or
  is public. Do not use exe.dev identity headers as application auth; the
  generated Fortify authentication remains authoritative.
- Assign owners for OS and Docker updates, database upgrades, monitoring, backup
  failures, retention, restore drills, and incident response.
- Choose an encrypted off-VM backup repository. A persistent VM disk is not an
  independent backup.
- Use object storage instead of the local `app_storage` volume when files must
  survive a VM-level loss or be shared across hosts.

Authoritative platform source:
[exe.dev documentation](https://exe.dev/docs/all). It documents persistent VM
disks, normal Docker/Compose support, the HTTPS proxy, private-by-default
access, port selection, and custom domains.

## Initial release

These are operator instructions; they create resources and were not run while
implementing the starter.

1. Create an ordinary exeuntu VM, connect over SSH, clone the repository, and
   check out the reviewed commit.
2. Build and tag the immutable application image:

    ```bash
    docker build --pull --tag laravel-app-starter-kit:RELEASE_SHA .
    ```

3. Prepare deployment configuration without committing it:

    ```bash
    cd deploy/exe-dev
    cp .env.example .env
    chmod 600 .env
    ```

    Set `APP_IMAGE` to the release tag, `APP_URL` to the VM's HTTPS URL, a
    random `POSTGRES_PASSWORD`, and a persistent Laravel `APP_KEY`. Generate an
    application key with the reviewed image:

    ```bash
    docker run --rm laravel-app-starter-kit:RELEASE_SHA \
      php artisan key:generate --show
    ```

4. Start PostgreSQL, run the release migration once, then start roles:

    ```bash
    docker compose up -d postgres
    docker compose --profile release run --rm release
    docker compose up -d web worker scheduler
    docker compose ps
    curl --fail --show-error --silent http://127.0.0.1:8000/up
    ```

5. From a machine authenticated to exe.dev, point the HTTPS proxy at port 8000
   and choose access deliberately:

    ```bash
    ssh exe.dev share port VM_NAME 8000
    ssh exe.dev share show VM_NAME
    ```

    `share set-public`, sharing, custom domains, and DNS are external changes;
    perform them only after review.

## Release, upgrade, and rollback

Build a new immutable tag, run checks against it, then:

```bash
cd deploy/exe-dev
docker compose pull                         # when APP_IMAGE is registry-backed
docker compose --profile release run --rm release
docker compose up -d --remove-orphans web worker scheduler
curl --fail --show-error --silent http://127.0.0.1:8000/up
```

The release service is the only migration owner. Never enable image startup
migrations. Use backward-compatible expand/migrate/contract changes while old
and new containers may overlap. To roll application code back, restore the
previous `APP_IMAGE` and recreate the roles. Do not automatically roll database
migrations back; deploy a forward repair unless a reviewed migration-specific
recovery plan says otherwise.

Laravel workers honor termination and are recycled after `--max-time=3600`.
Compose gives each role 30 seconds to stop. Run exactly one scheduler service.

## Database backup and restore drill

Create a PostgreSQL custom-format dump and checksum:

```bash
deploy/exe-dev/bin/backup-database
```

The local file is mode-restricted but not encrypted. Immediately transfer it to
an encrypted, access-controlled off-VM repository with retention and failure
alerts. For example, Restic encrypts content before upload; configure its
repository and credentials outside the repository, then back up both dump and
checksum:

```bash
restic backup deploy/exe-dev/backups
restic check
```

Test every retained backup in a different database without touching the
configured application database:

```bash
deploy/exe-dev/bin/restore-drill deploy/exe-dev/backups/FILE.dump
```

The script verifies the checksum, refuses the configured application database,
restores with `--exit-on-error`, and queries the restored migrations table. Run
application smoke checks against that disposable database before dropping it.
Record timestamps, source backup, restored row-level invariants, operator, and
cleanup. A successful upload is not a backup proof; only a restore drill is.

For disaster recovery, stop web/worker/scheduler, restore into a new database,
verify it, change `POSTGRES_DB` to that database, run the reviewed image's
`php artisan migrate:status`, and recreate roles. Preserve the failed database
until the incident owner authorizes deletion.

## Operational checks

- `docker compose ps` and `docker compose logs --since=15m ROLE`
- HTTPS `/up` through exe.dev, not only loopback
- queue age and `php artisan queue:failed`
- scheduler execution freshness from application-owned scheduled work
- PostgreSQL disk, connection, lock, and backup age alerts
- filesystem capacity and off-VM backup success
- monthly restore drill and documented application-level invariants
- dependency/image rebuild cadence and VM OS security updates

The implementation validates Compose and restore behavior locally. Public HTTPS,
custom domains, off-VM storage, alerts, and a live restore remain target owner
responsibilities because no exe.dev resource was authorized.
