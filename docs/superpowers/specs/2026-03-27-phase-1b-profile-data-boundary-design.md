# DSE_Study Phase 1b Profile and Data Boundary Design

## Goal

Move the family/account foundation one step closer to real persistence by introducing typed learner profile data boundaries and an interactive onboarding profile flow.

## Scope

This slice includes:

- richer learner profile domain types
- demo-backed profile repository helpers shaped like future database loaders
- onboarding profile validation and server action
- interactive onboarding profile form
- session-aware onboarding route behavior

This slice does not include:

- real Prisma client reads and writes
- automatic post-sign-in onboarding redirects
- complete admin editing of learner profiles

## Design

The page should no longer be a placeholder. It should render a real form with:

- profile name
- track
- school stage
- study minutes per day
- study days per week
- target reference level
- target internal band

The new profile repository layer should expose typed read helpers for the current demo learners and a write-like action return shape that mirrors what the real persistence layer will later return.

## Why this order

This keeps the next database slice narrow:

- current UI and validation get stabilized now
- future Prisma work only needs to swap storage behind the same shapes
- learner-specific onboarding can start influencing downstream pages later

## Definition of Done

- onboarding profile page is interactive
- profile validation is covered by tests
- learner profile repository returns typed data
- current demo learners have profile records, not just dashboard summaries
