# DSE_Study Phase 2a Database Repository Design

## Goal

Replace the repository placeholders with real Prisma-backed implementations for family and learner profile data, while preserving demo fallback when `DATABASE_URL` is missing.

## Scope

- Prisma-backed family dashboard repository
- Prisma-backed learner profile repository
- seed scaffold for the current demo family and learners
- Prisma scripts for generate and seed workflow
- documentation for switching from demo mode to database mode

## Constraints

- keep the app runnable without a database
- keep current tests green
- database branches should be implemented and mock-testable even if no live database is available locally

## Definition of Done

- repository database branches call Prisma instead of TODO placeholders
- seed file exists for the current demo family data
- project documents the handoff from demo mode to database mode
