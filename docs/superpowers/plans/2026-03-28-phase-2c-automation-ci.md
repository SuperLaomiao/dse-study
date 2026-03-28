# Phase 2c Automation and CI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add automated CI and a reusable smoke-check command so verification no longer depends on manual page inspection.

**Architecture:** Use GitHub Actions for repository-level verification on push and pull request, and add a Node-based smoke script that checks key deployed routes over HTTP using a configurable base URL. Keep the smoke script read-only and deterministic so it can later be reused in deployment workflows.

**Tech Stack:** GitHub Actions, Node.js, TypeScript, Prisma, Vitest, Next.js

---

### Task 1: Add failing tests that lock CI and smoke automation expectations

### Task 2: Add package scripts and smoke-check implementation

### Task 3: Add GitHub Actions workflow and docs

### Task 4: Verify tests, lint, and build

