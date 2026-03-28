# DSE_Study Phase 2b CloudBase MySQL Migration Design

## Goal

Replace the current PostgreSQL/Neon database assumption with a CloudBase MySQL-compatible persistence path while keeping the app preview-safe through demo fallback behavior.

## Scope

This slice includes:

- Prisma datasource migration from PostgreSQL to MySQL
- MySQL-shaped connection examples and deployment docs
- test coverage that locks the repo onto CloudBase MySQL expectations
- preserving demo fallback when the runtime database is unavailable

This slice does not include:

- removing demo fallback
- running production data migration from Neon to CloudBase MySQL
- tablet layout polish

## Design

The application already treats `DATABASE_URL` as the switch between demo mode and database mode. That boundary should remain unchanged. The migration should only update the storage contract behind that boundary:

- `prisma/schema.prisma` uses `mysql`
- local and deployment docs use CloudBase MySQL connection strings
- repository tests and fallback tests stop assuming PostgreSQL URLs

The runtime safety rule stays the same: if Prisma cannot connect, the repository layer should log and fall back to demo data so preview environments remain usable.

## Why this order

This keeps the migration narrow and reversible:

- route and form behavior remain untouched
- repository APIs stay stable
- deployment risk is reduced because CloudBase can still serve preview traffic with demo fallback until MySQL is reachable

## Definition of Done

- Prisma datasource is MySQL-based
- docs and env examples point to CloudBase MySQL
- tests lock in MySQL expectations
- app still supports demo fallback when the database is unavailable
