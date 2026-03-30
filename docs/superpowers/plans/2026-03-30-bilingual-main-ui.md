# Bilingual Main UI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a lightweight Chinese/English locale switch with Chinese as the default and wire bilingual static copy into the main product paths.

**Architecture:** Keep the current route structure intact and introduce a minimal locale layer built from cookie-backed server helpers, a client locale provider, and a shared translation dictionary. Reuse the shared shell and page composition patterns so the first slice covers the highest-traffic paths with minimal churn.

**Tech Stack:** Next.js App Router, React, TypeScript, Vitest, Testing Library

---

### Task 1: Add failing tests for locale defaults and shell switching

**Files:**
- Create: `tests/i18n.test.ts`
- Modify: `tests/app-shell.test.tsx`

- [ ] Add tests that lock the default locale to `zh`, validate fallback behavior for invalid locale values, and assert that the shared shell can render translated role and navigation labels.
- [ ] Run `npm test -- --runInBand tests/i18n.test.ts tests/app-shell.test.tsx` and confirm the new assertions fail before implementation.

### Task 2: Build the lightweight locale infrastructure

**Files:**
- Create: `lib/i18n/config.ts`
- Create: `lib/i18n/server.ts`
- Create: `lib/i18n/dictionaries.ts`
- Create: `components/language-toggle.tsx`
- Create: `components/locale-provider.tsx`
- Modify: `app/layout.tsx`
- Modify: `lib/routes.ts`

- [ ] Add locale constants, cookie names, a safe server-side locale resolver, and a dictionary shape for shared shell text and main-path page copy.
- [ ] Add a client locale provider plus toggle component that updates React state, `document.cookie`, and `localStorage`.
- [ ] Update the root layout to seed the initial locale from cookies and wrap the app with the provider.
- [ ] Convert shared route labels to locale-aware lookups instead of fixed English strings.

### Task 3: Wire bilingual copy into the shared shell and main-path pages

**Files:**
- Modify: `components/app-shell.tsx`
- Modify: `components/bottom-nav.tsx`
- Modify: `components/placeholder-page.tsx`
- Modify: `app/page.tsx`
- Modify: `app/sign-in/page.tsx`
- Modify: `app/family/create/page.tsx`
- Modify: `app/family/join/page.tsx`
- Modify: `app/onboarding/profile/page.tsx`
- Modify: `app/home/page.tsx`
- Modify: `app/learn/page.tsx`
- Modify: `app/practice/page.tsx`
- Modify: `app/practice/speaking/page.tsx`
- Modify: `app/practice/reading/page.tsx`
- Modify: `app/practice/listening/page.tsx`
- Modify: `app/practice/writing/page.tsx`
- Modify: `app/practice/vocabulary/page.tsx`
- Modify: `app/progress/page.tsx`
- Modify: `app/assessment/baseline/page.tsx`
- Modify: `app/assessment/result/page.tsx`
- Modify: `app/review/result/page.tsx`
- Modify: `app/admin/family/page.tsx`
- Modify: `app/admin/alerts/page.tsx`
- Modify: `app/admin/system/page.tsx`
- Modify: `app/admin/learner/[id]/page.tsx`

- [ ] Pass locale-aware titles, descriptions, buttons, section headings, and empty-state text into the main product paths.
- [ ] Keep dynamic learner data such as names, stages, and tracks intact while translating surrounding UI labels.
- [ ] Update shared shells so the toggle is consistently visible on public, learner, and admin pages.

### Task 4: Cover interactive practice UI and verify representative pages

**Files:**
- Modify: `components/practice/speaking-ai-studio.tsx`
- Modify: `tests/practice-pages.test.tsx`
- Modify: `tests/sign-in-page.test.tsx`
- Modify: `tests/public-and-dse-pages.test.tsx`

- [ ] Translate the core static labels inside the speaking AI studio without attempting to auto-translate model output.
- [ ] Add representative page tests that assert Chinese default rendering and English switch rendering where practical.
- [ ] Run the targeted test set, fix regressions, and leave any intentionally deferred translation gaps documented in the final handoff.
