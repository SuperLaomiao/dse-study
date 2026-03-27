# Phase 1b Profile and Data Boundary Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add typed learner profile data boundaries and turn onboarding into a real interactive form backed by server-side validation.

**Architecture:** Extend the demo data model to include learner profile records and goal fields, then expose those through repository helpers and a small validation module. The onboarding route consumes the repository data and submits through a server action, keeping page code separate from validation and storage details.

**Tech Stack:** Next.js App Router, React, TypeScript, Tailwind CSS, Vitest

---

### Task 1: Add failing profile validation and repository tests

### Task 2: Extend domain types and demo profile data

### Task 3: Implement profile validation and onboarding action

### Task 4: Build interactive onboarding profile form

### Task 5: Verify tests, lint, and build
