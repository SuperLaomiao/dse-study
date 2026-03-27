# DSE_Study Phase 1 Family and Account Core Design

## Goal

Turn the Phase 0 scaffold into a role-aware app foundation with real session flow and future-safe family/account data boundaries.

This phase should make the app behave like a product with user identity, even if the first persistence layer still relies on demo-backed loaders.

## Scope

Phase 1 includes:

- Prisma schema for identity and family tables
- typed auth and family domain models
- cookie-based session handling for local product flow
- sign-in server action for known demo users
- role-aware landing behavior after sign-in
- interactive family create and family join forms
- route guards/helpers for learner and admin surfaces
- replacing the old “pure placeholder” sign-in and family setup pages

Phase 1 does not include:

- production email delivery
- real invite email sending
- full database-backed mutations
- external auth provider integration
- profile onboarding persistence

## Recommended Approach

### Option A: Custom local session layer over demo-backed identity data

Use signed or structured cookies plus server actions and route guards, while keeping user/family records in typed in-repo fixtures for now.

Pros:

- fastest path to a believable working identity flow
- no external provider or email service required
- keeps UI and route behavior testable immediately

Cons:

- not final auth architecture
- still needs later replacement for persistent mutations

### Option B: Full Auth.js email flow immediately

Add Auth.js and email sign-in now with a database adapter.

Pros:

- closer to final production stack

Cons:

- blocked on email transport and adapter setup
- more moving parts before core family behavior is validated

### Option C: Wait for real database before any session flow

Only write schema and boundaries now, leave pages mostly static.

Pros:

- fewer temporary behaviors

Cons:

- slower learning loop
- route behavior remains fake

## Recommendation

Use Option A.

It creates a real working flow now, preserves the future Prisma/Auth boundary, and keeps the next slice focused on database-backed replacement rather than redesign.

## Architecture

Phase 1 adds four pieces:

1. `prisma/schema.prisma` for the canonical identity and family schema
2. `lib/auth/*` for session cookie parsing, current user resolution, and role checks
3. `app/(auth actions)` or server-action modules for sign-in, create-family, and join-family flow
4. route-level helpers that choose the correct learner/admin experience from the current session

The UI should continue consuming typed view models rather than reaching directly into cookies or raw fixture objects.

## User Flow

### Sign-in

The user enters one of the known demo emails.

If the email matches a known demo user:

- a session cookie is written
- the user is redirected by role
- mom goes to `/admin/family`
- learner users go to `/home`

If the email is unknown:

- the sign-in form shows a clear inline error

### Create Family

Mom can open `/family/create`, review what the setup flow is for, and submit a starter family form.

For this phase, submission does not permanently create a new database row. It confirms the server action and returns a success state that matches the future behavior boundary.

### Join Family

Learners can open `/family/join`, enter a code and email, and receive a validated success or failure state.

This will still use a demo join rule set in Phase 1, but it must behave like a real flow from the user perspective.

## Route Guard Rules

- learner pages require a learner session
- admin pages require an admin session
- public setup pages stay public
- when a signed-in user opens `/sign-in`, redirect them to their role home
- when an unauthorized user opens a protected page, redirect them to `/sign-in`

## Prisma Scope

The first schema should include:

- `User`
- `Family`
- `FamilyMembership`
- `FamilyInvite`
- `LearnerProfile`

This schema is the contract for the next persistence slice even if current writes are still demo-backed.

## Testing

Phase 1 should add tests for:

- session parsing and current-user lookup
- role guard behavior
- sign-in success for admin and learner users
- sign-in rejection for unknown emails
- create-family and join-family server action validation

## Definition of Done

Phase 1 core is done when:

- the app can identify a signed-in demo user through a cookie-backed session
- admin and learner routes respect role boundaries
- sign-in is interactive and redirects correctly
- family create and join pages submit against real server actions
- Prisma schema for family/account identity exists and matches the agreed product model
