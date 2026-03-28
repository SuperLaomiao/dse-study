# DSE_Study Phase 2c Automation and CI Design

## Goal

Add an automated verification path so every push can prove the project still installs, type-checks, tests, and builds without relying on manual inspection.

## Scope

This slice includes:

- a GitHub Actions CI workflow for install, Prisma client generation, tests, lint, and build
- a lightweight smoke-check script that can hit a deployed base URL and verify key routes
- package scripts and docs that make local and hosted verification consistent

This slice does not include:

- CloudBase-specific deployment triggers
- browser-driven authenticated end-to-end tests
- alerting integrations

## Design

The automation should have two layers:

- CI on every push and pull request to catch broken code before deployment
- reusable smoke script that can run against the deployed CloudBase URL once a deployment is available

The smoke script should stay intentionally simple and fast. It should check that:

- `/`
- `/sign-in`
- `/admin/family`
- `/admin/system`

return successful HTML responses and contain expected page text where possible.

## Why this order

CI gives immediate protection with no new infrastructure. The smoke script establishes the contract for future deployment verification without forcing us to solve full browser authentication in the same slice.

## Definition of Done

- GitHub Actions runs install, Prisma generate, test, lint, and build on push and PR
- a smoke script can verify a deployed base URL from the command line
- README explains how to use both paths
