# Phase 1 Family and Account Core Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add role-aware session flow, interactive account setup pages, and a future-safe Prisma identity schema on top of the Phase 0 scaffold.

**Architecture:** Keep the UI on typed loaders and view models while introducing a small `lib/auth` session layer and a canonical Prisma schema. Server actions will validate user input and update cookie-backed session state, but family/account mutations remain demo-backed for now so we can validate product flow without introducing full persistence yet.

**Tech Stack:** Next.js App Router, React, TypeScript, Tailwind CSS, Prisma schema, Vitest, Testing Library

---

### Task 1: Add Prisma identity schema

**Files:**
- Create: `prisma/schema.prisma`

- [ ] **Step 1: Write the schema for identity and family tables**
- [ ] **Step 2: Run type/build verification**
- [ ] **Step 3: Commit**

### Task 2: Add auth/session red tests

**Files:**
- Create: `tests/auth-session.test.ts`

- [ ] **Step 1: Write failing tests for session lookup, role checks, and sign-in validation**
- [ ] **Step 2: Run tests to verify they fail**
- [ ] **Step 3: Commit**

### Task 3: Implement cookie-backed auth helpers

**Files:**
- Create: `lib/auth/session.ts`
- Create: `lib/auth/demo-users.ts`
- Create: `lib/auth/guards.ts`

- [ ] **Step 1: Implement minimal session types and helpers**
- [ ] **Step 2: Re-run targeted tests**
- [ ] **Step 3: Commit**

### Task 4: Implement sign-in and family server actions

**Files:**
- Create: `app/actions/account.ts`

- [ ] **Step 1: Extend tests for sign-in and family action validation**
- [ ] **Step 2: Implement minimal passing server actions**
- [ ] **Step 3: Re-run targeted tests**
- [ ] **Step 4: Commit**

### Task 5: Wire interactive pages

**Files:**
- Modify: `app/sign-in/page.tsx`
- Modify: `app/family/create/page.tsx`
- Modify: `app/family/join/page.tsx`
- Create: `components/account/email-sign-in-form.tsx`
- Create: `components/account/family-create-form.tsx`
- Create: `components/account/family-join-form.tsx`

- [ ] **Step 1: Keep relevant route tests red where needed**
- [ ] **Step 2: Implement interactive form pages**
- [ ] **Step 3: Run tests**
- [ ] **Step 4: Commit**

### Task 6: Add protected route behavior

**Files:**
- Modify: `app/home/page.tsx`
- Modify: `app/admin/family/page.tsx`
- Modify: `app/admin/alerts/page.tsx`
- Modify: `app/admin/learner/[id]/page.tsx`

- [ ] **Step 1: Add tests for role-aware protected routes if needed**
- [ ] **Step 2: Implement session-aware route checks**
- [ ] **Step 3: Run test, lint, and build verification**
- [ ] **Step 4: Commit**
