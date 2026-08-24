# Rails and Laravel Comparison Scorecard

Status: accepted evaluation framework

Last updated: 2026-08-24

## Rule

Compare equivalent product outcomes while allowing each framework to remain
idiomatic. Do not penalize Laravel for not resembling Rails or Rails for not
using Laravel packages.

## Evidence to collect

### Initial implementation

- elapsed agent time and number of interventions;
- dependency count and lockfile size;
- generated/modified file count;
- framework assumptions that required correction;
- quality failures caught before browser testing.

### Code ownership

- Robert's ability to understand and safely edit AI-written code;
- visibility of authentication, authorization, persistence, and jobs;
- amount of custom infrastructure;
- package indirection and upgrade surface;
- consistency of file placement and naming.

### Verification

- setup, static-analysis, test, and build duration;
- quality and specificity of failure messages;
- unit/feature/browser coverage needed for confidence;
- false positives, ignored errors, or flaky checks;
- cross-user and security-negative test effectiveness.

### Runtime and operations

- idle and representative web/worker memory;
- image size and cold start;
- deployment steps and failure modes;
- migration/release safety;
- worker/scheduler visibility;
- backup/restore complexity;
- provider and platform coupling.

### AI experience

- quality of Boost/MCP versus Rails documentation/context;
- frequency of non-conventional generated code;
- ease of correcting framework mistakes;
- ability of a fresh orb/thread to resume work;
- package discovery and version-specific guidance.

### Product slices

- personal workflow implementation speed and UI quality;
- third-party client, pagination, retry, progress, and audit clarity;
- amount of glue needed around jobs and providers;
- application-specific customization friction;
- subjective enjoyment and trust.

## Decision output

The final comparison should identify:

- Robert's preferred default for new ideas;
- workloads where the other framework remains preferable;
- starter improvements supported by evidence;
- operational responsibilities Robert is willing to own;
- whether maintaining both kits is worth the update cost.
