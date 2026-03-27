# Phase 2a Database Repositories Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement Prisma-backed repository branches and seed scaffolding while keeping demo fallback intact.

**Architecture:** Repositories continue to select between demo mode and database mode via `lib/db.ts`. In database mode, they use a shared Prisma client singleton and map Prisma records into the existing view-model shapes used by the pages. Seed data mirrors the current demo family so preview deployments can be bootstrapped quickly once a database URL is configured.

**Tech Stack:** Next.js App Router, TypeScript, Prisma, Vitest

---

### Task 1: Add failing database-branch repository tests

### Task 2: Implement Prisma-backed profile and family repositories

### Task 3: Add seed scaffold and Prisma scripts

### Task 4: Verify test, lint, build, and Prisma generate
