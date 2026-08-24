# HTTP Integration Research

Status: research snapshot informing accepted decisions

Last updated: 2026-08-24

## Laravel HTTP client

Laravel's first-party HTTP client wraps Guzzle and supports authentication,
timeouts, retries, middleware, events, concurrency, fakes, sequences,
assertions, and stray-request prevention. It remains the conventional default.

References:

- [Laravel HTTP client documentation](https://laravel.com/docs/13.x/http-client)
- [PendingRequest implementation](https://github.com/laravel/framework/blob/13.x/src/Illuminate/Http/Client/PendingRequest.php)
- [HTTP factory and fakes](https://github.com/laravel/framework/blob/13.x/src/Illuminate/Http/Client/Factory.php)

## Saloon

[Saloon](https://github.com/saloonphp/saloon) and its
[Laravel integration](https://github.com/saloonphp/laravel-plugin) are mature,
MIT-licensed community packages with active Laravel support and substantial
adoption.

Saloon adds first-class connectors/requests, OAuth helpers, DTO conversion,
pagination plugins, provider exception mapping, middleware structure, and rich
testing fixtures. Those benefits matter for complex integrations but add a
dependency/plugin upgrade surface. At the research snapshot, Saloon also
constrained Guzzle more narrowly than Laravel's allowed range.

## Decision threshold

Start with Laravel's client and a provider-specific application class. Install
Saloon when many endpoints, providers, OAuth, pagination, DTOs, or custom
middleware/errors make connector/request classes materially clearer and less
duplicative.

Saloon requests describe transport. Laravel jobs/services continue to own
application orchestration, persistence, progress, and authorization.

## Queue patterns

Use Laravel's documented jobs, chains, batches, uniqueness, overlap/rate-limit
middleware, failed jobs, and scheduler. Persist workflow-specific run state
only when a user-facing process needs durable progress or history. Do not add a
universal integration framework to the starter.
