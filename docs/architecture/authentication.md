# Authentication

Status: accepted implementation default

Last updated: 2026-08-24

## Rule

Leave the official Laravel React starter's authentication behavior and UI
unchanged.

Retain whatever the selected current official starter normally generates,
including its Fortify configuration, login, registration, password reset,
email verification, password confirmation, rate limiting, account settings,
and generated security features.

Use the standard first-party Laravel authentication variant, not an optional
hosted identity variant.

## Why

The purpose of this starter is to evaluate Laravel's native conventions and
ecosystem. Replacing the official lifecycle with grants, invitation semantics,
owner roles, custom sessions, Google Workspace policy, or generic RBAC would
turn the experiment into a custom framework comparison.

## Per-application changes

An application may deliberately add or change:

- public-registration policy;
- invitations or allowlists;
- Socialite providers;
- roles, teams, policies, or ownership;
- passkeys or 2FA policy;
- session administration;
- audit requirements.

Those changes remain in the application repository and are not part of this
starter's default behavior.

## Production review warning

Every application must review the generated auth configuration before launch,
especially whether public registration is enabled. Documentation should call
out that responsibility without silently changing upstream behavior.
