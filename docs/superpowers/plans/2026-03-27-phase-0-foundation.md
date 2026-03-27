# Phase 0 Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a runnable mobile-first `DSE_Study` app shell with demo data, key MVP route placeholders, and a shared learner/admin layout foundation.

**Architecture:** Use a single Next.js App Router app with a shared route shell, typed demo fixtures, and route-level page modules that consume the fixtures through small loader helpers. Keep real auth, database, and storage behind future-friendly boundary modules so Phase 1 can replace demo loaders without rewriting the UI.

**Tech Stack:** Next.js App Router, React, TypeScript, Tailwind CSS, Vitest, Testing Library

---

### Task 1: Scaffold the app toolchain

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.ts`
- Create: `postcss.config.js`
- Create: `components.json`
- Create: `app/globals.css`
- Create: `.gitignore`

- [ ] **Step 1: Write the initial configuration files**

Create `package.json` with app, test, and lint scripts plus runtime and dev dependencies for Next.js, React, TypeScript, Tailwind, Vitest, jsdom, and Testing Library.

Create `tsconfig.json`, `next.config.ts`, and `postcss.config.js` for a standard App Router TypeScript setup.

- [ ] **Step 2: Install dependencies**

Run: `npm install`
Expected: install completes and creates `node_modules/` and `package-lock.json`

- [ ] **Step 3: Verify the toolchain can load**

Run: `npm run lint`
Expected: command runs successfully or reports only missing source-file warnings that will disappear after source files are added

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json tsconfig.json next.config.ts postcss.config.js components.json app/globals.css .gitignore
git commit -m "chore: scaffold phase 0 app toolchain"
```

### Task 2: Add the first failing route and layout tests

**Files:**
- Create: `tests/app-shell.test.tsx`
- Create: `tests/setup.ts`
- Modify: `package.json`

- [ ] **Step 1: Write the failing tests**

Write tests for:

- the shared app shell rendering learner navigation items
- the learner home page showing the demo learner title
- the admin family page showing the family summary heading
- the invalid learner detail path returning a safe fallback state

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm run test -- --run`
Expected: FAIL because the route modules, shell components, and demo loaders do not exist yet

- [ ] **Step 3: Add Vitest setup**

Update `package.json` test scripts and create `tests/setup.ts` with Testing Library and `next/navigation` mocks needed for route-aware components.

- [ ] **Step 4: Commit**

```bash
git add package.json tests/app-shell.test.tsx tests/setup.ts
git commit -m "test: add phase 0 shell route coverage"
```

### Task 3: Implement typed demo fixtures and data boundaries

**Files:**
- Create: `lib/types.ts`
- Create: `lib/demo-data.ts`
- Create: `lib/data/family.ts`
- Create: `lib/data/learner.ts`
- Create: `lib/data/admin.ts`

- [ ] **Step 1: Write the failing type-driven test adjustment**

Extend `tests/app-shell.test.tsx` expectations to check for demo-specific strings such as the older brother learner card, mom admin summary, and invalid learner fallback copy.

- [ ] **Step 2: Run the tests to verify the richer expectations still fail**

Run: `npm run test -- --run tests/app-shell.test.tsx`
Expected: FAIL because the typed fixture and loader modules are not implemented

- [ ] **Step 3: Write the minimal fixture and loader implementation**

Create strongly typed demo objects for family summary, learners, progress, daily plan, and alerts. Expose tiny read functions such as `getDemoFamilySummary()`, `getDemoLearnerById()`, and `getDemoAdminSnapshot()`.

- [ ] **Step 4: Run tests**

Run: `npm run test -- --run tests/app-shell.test.tsx`
Expected: still FAIL, but now only on missing UI and routes

- [ ] **Step 5: Commit**

```bash
git add lib/types.ts lib/demo-data.ts lib/data/family.ts lib/data/learner.ts lib/data/admin.ts tests/app-shell.test.tsx
git commit -m "feat: add typed phase 0 demo data boundaries"
```

### Task 4: Build the shared mobile shell

**Files:**
- Create: `components/app-shell.tsx`
- Create: `components/bottom-nav.tsx`
- Create: `components/page-card.tsx`
- Create: `components/status-pill.tsx`
- Create: `app/layout.tsx`
- Modify: `app/globals.css`

- [ ] **Step 1: Keep the shell tests red**

Re-run the route shell tests before implementation.

Run: `npm run test -- --run tests/app-shell.test.tsx`
Expected: FAIL because the shell components and root layout are still missing

- [ ] **Step 2: Implement the minimal shared shell**

Create a root layout with app metadata and global styles. Create an `AppShell` component with header, content container, and learner/admin variants. Add a bottom nav for learner routes and lightweight card/pill primitives.

- [ ] **Step 3: Run tests**

Run: `npm run test -- --run tests/app-shell.test.tsx`
Expected: some tests pass, remaining failures point to missing route pages

- [ ] **Step 4: Commit**

```bash
git add components/app-shell.tsx components/bottom-nav.tsx components/page-card.tsx components/status-pill.tsx app/layout.tsx app/globals.css
git commit -m "feat: add shared mobile app shell"
```

### Task 5: Implement route placeholders for learner and public flows

**Files:**
- Create: `app/page.tsx`
- Create: `app/sign-in/page.tsx`
- Create: `app/family/create/page.tsx`
- Create: `app/family/join/page.tsx`
- Create: `app/onboarding/profile/page.tsx`
- Create: `app/assessment/baseline/page.tsx`
- Create: `app/assessment/result/page.tsx`
- Create: `app/home/page.tsx`
- Create: `app/learn/page.tsx`
- Create: `app/practice/page.tsx`
- Create: `app/practice/vocabulary/page.tsx`
- Create: `app/practice/reading/page.tsx`
- Create: `app/practice/listening/page.tsx`
- Create: `app/practice/speaking/page.tsx`
- Create: `app/practice/writing/page.tsx`
- Create: `app/progress/page.tsx`
- Create: `app/review/biweekly/page.tsx`
- Create: `app/review/result/page.tsx`
- Create: `app/dse/page.tsx`
- Create: `app/dse/b1-b2/page.tsx`
- Create: `lib/routes.ts`

- [ ] **Step 1: Add one more failing assertion for route content**

Update `tests/app-shell.test.tsx` to assert learner home shows the daily plan label and practice hub shows module labels such as Vocabulary Loop and Reading.

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm run test -- --run tests/app-shell.test.tsx`
Expected: FAIL because the learner pages still do not exist

- [ ] **Step 3: Implement minimal route pages**

Create a route helper map and implement each route page using shared cards plus demo fixture content. Keep copy clear and realistic, but avoid wiring unfinished behavior.

- [ ] **Step 4: Run tests**

Run: `npm run test -- --run tests/app-shell.test.tsx`
Expected: learner and public route tests pass, admin detail still missing

- [ ] **Step 5: Commit**

```bash
git add app/page.tsx app/sign-in/page.tsx app/family/create/page.tsx app/family/join/page.tsx app/onboarding/profile/page.tsx app/assessment/baseline/page.tsx app/assessment/result/page.tsx app/home/page.tsx app/learn/page.tsx app/practice/page.tsx app/practice/vocabulary/page.tsx app/practice/reading/page.tsx app/practice/listening/page.tsx app/practice/speaking/page.tsx app/practice/writing/page.tsx app/progress/page.tsx app/review/biweekly/page.tsx app/review/result/page.tsx app/dse/page.tsx app/dse/b1-b2/page.tsx lib/routes.ts
git commit -m "feat: add learner and public phase 0 routes"
```

### Task 6: Implement admin routes and learner detail fallback

**Files:**
- Create: `app/admin/family/page.tsx`
- Create: `app/admin/learner/[id]/page.tsx`
- Create: `app/admin/alerts/page.tsx`

- [ ] **Step 1: Re-run the failing admin route tests**

Run: `npm run test -- --run tests/app-shell.test.tsx`
Expected: FAIL on admin route rendering and invalid learner fallback state

- [ ] **Step 2: Implement minimal admin surfaces**

Create the family overview page, alerts page, and learner detail page. The learner detail route must safely handle unknown ids with a clear fallback card and a link back to the family overview.

- [ ] **Step 3: Run tests**

Run: `npm run test -- --run tests/app-shell.test.tsx`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add app/admin/family/page.tsx app/admin/learner/[id]/page.tsx app/admin/alerts/page.tsx
git commit -m "feat: add admin phase 0 routes"
```

### Task 7: Verify the whole scaffold

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Document local development**

Update `README.md` with install, dev, and test commands plus a short description of the Phase 0 scaffold boundaries.

- [ ] **Step 2: Run the full check**

Run: `npm run test -- --run`
Expected: PASS

Run: `npm run lint`
Expected: PASS

Run: `npm run dev`
Expected: local app starts successfully

- [ ] **Step 3: Commit**

```bash
git add README.md
git commit -m "docs: document phase 0 scaffold workflow"
```
