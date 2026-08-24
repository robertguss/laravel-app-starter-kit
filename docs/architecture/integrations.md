# Third-Party Integrations

Status: accepted direction

Last updated: 2026-08-24

## Default

Use Laravel's built-in HTTP client and ordinary application code. It already
supports authentication, timeouts, retries, middleware, events, concurrent
requests, fakes, sequences, assertions, and stray-request prevention.

Provider-specific organization may look like:

```text
app/Integrations/Canvas/CanvasClient.php
app/Integrations/Canvas/Data/CourseData.php
app/Integrations/Canvas/Exceptions/CanvasRateLimited.php
app/Jobs/Canvas/SyncCourses.php
```

Do not require every provider to implement a generic connector/resource
interface.

## Saloon threshold

Saloon is an optional cookbook package. Install it when an application has
enough endpoints, providers, OAuth lifecycle, pagination, DTO mapping, or
provider-specific middleware/errors that connector and request classes remove
meaningful duplication.

Keep orchestration in Laravel jobs/services even when Saloon describes HTTP
requests.

## Long-running workflows

Use conventional Laravel mechanisms:

1. Form Request/controller validates and authorizes.
2. Create a provider/workflow-specific run record when durable progress is
   useful.
3. Dispatch a job after the transaction commits.
4. Use one job, a chain, or `Bus::batch` according to ordering and parallelism.
5. Persist progress, heartbeat, counts, completion, and sanitized failure.
6. Poll an authenticated status endpoint when the UI needs progress.

Use `ShouldBeUnique`, `WithoutOverlapping`, `RateLimited`,
`ThrottlesExceptions`, job timeout/backoff, and scheduler overlap/one-server
controls where their documented semantics fit.

Do not add a universal operation table. Use a workflow-specific run model or
Laravel's batch model when the application needs one.

## Safety

- Set explicit HTTP timeouts shorter than job timeouts.
- Keep job timeout below queue `retry_after`.
- Retry only safe transient failures.
- Respect `Retry-After` by releasing jobs rather than sleeping workers.
- Require provider idempotency or reconciliation before retrying external
  writes.
- Distinguish job uniqueness from external mutation idempotency.
- Never log complete provider bodies or credentials by default.

## Tests

- Call `Http::preventStrayRequests()` in integration-focused tests.
- Fake by provider URL and use sequences for pagination/retry behavior.
- Assert method, URL, headers, body, and provider idempotency keys.
- Test success, malformed payload, auth failure, permanent 4xx, 429, timeout,
  transient 5xx, retry exhaustion, pagination termination, duplicate writes,
  and redaction.
- Use queue/bus fakes for dispatch and test job handlers independently.
