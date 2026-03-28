# Phase 2b CloudBase MySQL Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate the repository from Neon/PostgreSQL assumptions to CloudBase MySQL while preserving preview-safe demo fallback behavior.

**Architecture:** Keep the existing `DATABASE_URL`-driven data access boundary and repository APIs, but retarget Prisma and deployment docs to MySQL. Validate the migration with config-focused tests first, then update schema and docs, and finally rerun the project verification suite.

**Tech Stack:** Next.js App Router, Prisma, MySQL, TypeScript, Vitest, CloudBase CloudRun

---

### Task 1: Add failing migration coverage

### Task 2: Switch Prisma and test fixtures to MySQL assumptions

### Task 3: Update CloudBase and local setup documentation

### Task 4: Verify tests, lint, and build

