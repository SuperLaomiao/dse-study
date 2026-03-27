# DSE_Study Phase 0 Foundation Design

## Goal

Build the first runnable version of `DSE_Study` as a mobile-first web application shell.

This phase should make the product feel real in the browser without depending on live auth, database, or storage services yet.

## Scope

Phase 0 includes:

- Next.js App Router application scaffold
- TypeScript setup
- Tailwind CSS setup
- shared layout shell for mobile-first navigation
- route placeholders for the key MVP pages
- demo data used to render realistic learner and admin states
- clear service boundaries for future auth, database, and storage integration

Phase 0 does not include:

- real sign-in
- persistent database storage
- file uploads
- audio recording
- real assessment or scoring logic
- full design polish

## User Outcome

At the end of this phase, we should be able to open the app locally and move through the main product surfaces with believable sample content.

The app should communicate the structure of the family learning system clearly enough that future module work can attach to stable routes, shared UI, and shared domain models.

## Architecture

The app will be built as a single Next.js App Router project inside `DSE_Study/`.

The implementation will separate concerns into four simple layers:

1. route segments under `app/` for page entry points
2. presentational and layout components under `components/`
3. demo domain data and view-model helpers under `lib/`
4. shared styling and tokens under the app global styles

Real infrastructure will be represented by thin interfaces only. The initial implementation will read from in-repo demo fixtures so the UI can move forward without backend coupling.

## Page Surface for Phase 0

The first scaffold will include these route shells:

- `/`
- `/sign-in`
- `/family/create`
- `/family/join`
- `/onboarding/profile`
- `/assessment/baseline`
- `/assessment/result`
- `/home`
- `/learn`
- `/practice`
- `/practice/vocabulary`
- `/practice/reading`
- `/practice/listening`
- `/practice/speaking`
- `/practice/writing`
- `/progress`
- `/review/biweekly`
- `/review/result`
- `/dse`
- `/dse/b1-b2`
- `/admin/family`
- `/admin/learner/[id]`
- `/admin/alerts`

Each page will initially show:

- a clear title
- a short purpose summary
- realistic demo cards or list content where appropriate
- obvious next-step CTAs for the future full flow

## Shared UI Requirements

The shell should feel mobile-first before it feels complete.

The first version should include:

- top app header with role and current surface context
- bottom navigation for learner-facing routes
- lightweight section cards
- a route-aware page wrapper
- status pills for learner/admin/demo state

The UI direction should be clean, warm, and study-focused, not generic SaaS-heavy.

## Demo Data Strategy

Demo data should represent the three known users:

- older brother on DSE track
- younger sister on foundation-to-DSE track
- mom as family admin

The fixture layer should include:

- family summary
- learner profile summaries
- daily plan preview
- progress snapshots
- admin alert examples

The fixtures should be typed so later replacement with database-backed loaders is straightforward.

## Service Boundaries

Phase 0 should define boundary modules for future integration:

- auth provider boundary
- family data boundary
- learner dashboard data boundary
- admin dashboard data boundary

Each boundary should return typed data in a shape that the current UI can consume from demo fixtures.

That keeps the UI stable when real services are introduced later.

## Error Handling

This phase will not simulate every backend failure mode, but it should include safe placeholder states:

- empty state cards for unfinished modules
- not-found handling for invalid learner detail ids
- a simple fallback message for missing demo sections

## Testing

Phase 0 should include automated tests for the behaviors that define the scaffold:

- key routes render successfully
- shared layout renders expected navigation
- learner and admin demo surfaces display the correct role-specific content
- invalid learner detail routes show a safe fallback state

Tests should be written before implementation for each new behavior.

## Definition of Done

Phase 0 is done when:

- the app installs and runs locally
- the main route structure exists
- the shared mobile shell is working
- demo fixtures render believable learner and admin states
- the first route tests pass
- the codebase is ready for Phase 1 auth and family implementation without major restructuring
