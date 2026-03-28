# DSE_Study

Mobile-first family English learning system focused on long-term DSE English improvement.

## Phase 0 scaffold

This repository now includes a runnable Phase 0 Next.js scaffold with:

- mobile-first shared app shell
- learner and admin route placeholders
- typed demo data for the three core family users
- Vitest coverage for the initial shell and key demo routes
- Phase 1 account core with cookie-backed demo sign-in and family setup forms

Current Phase 0 intentionally does not include real auth, database storage, or audio features yet.

## Local development

```bash
npm install
npm run prisma:generate
npm run dev
```

Open `http://localhost:3000` after the dev server starts.

## Demo sign-in

Current sign-in is demo-backed and uses a session cookie.

- admin: `mom@example.com`
- learner: `brother@example.com`
- learner: `sister@example.com`

Current demo join code:

- `CHAN-FAMILY`

## Verification

```bash
npm run test -- --run
npm run lint
npm run prisma:generate
```

For one-command repository verification:

```bash
npm run ci
```

For deployed CloudBase smoke checks:

```bash
SMOKE_BASE_URL="https://your-service.run.tcloudbase.com" npm run smoke:cloudbase
```

## Database setup

Database-backed repositories are now prepared for CloudBase MySQL, but they still fall back to demo mode until `DATABASE_URL` is set and reachable.

1. Copy `.env.example` to `.env.local`
2. Set `DATABASE_URL` to your CloudBase MySQL connection string, for example `mysql://root:password@host:3306/dse_study`
3. Run `npm run prisma:generate`
4. Run `npm run prisma:seed` after the database is reachable

## Current scope

- Student accounts for independent learning progress
- Family admin dashboard for parent oversight
- Baseline assessment and bi-weekly review loop
- Vocabulary Loop and Speaking Phrase Loop
- DSE-aligned practice and progress tracking

## Directory guide

- `designs/`: wireframes, flowcharts, product drafts
- `docs/`: product notes and future specs
- `.superpowers/brainstorm/`: local visual companion assets

## Notes

- This project is separate from the existing game prototype in the parent directory.
- The current visual draft was copied here from the brainstorming session so future work can stay in one place.
