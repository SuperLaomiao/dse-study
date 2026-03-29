# DSE_Study Open Decisions v1

## 1. Purpose

This document closes the main remaining product and implementation ambiguities for MVP execution.

It records:

- the decision area
- the recommended default decision
- the reason for the decision
- notes for future revision

## 2. Final MVP Tech Stack Decision

### Decision

Adopt the following stack for MVP:

- frontend and app shell: Next.js App Router
- language: TypeScript
- styling: Tailwind CSS
- database: PostgreSQL
- ORM: Prisma
- auth: NextAuth or Auth.js email sign-in
- object storage: S3-compatible storage
- deployment: Vercel for app, managed Postgres for database, S3-compatible bucket for audio

### Why

- Next.js supports fast MVP delivery with one project for UI and server routes
- TypeScript improves long-term maintainability
- Tailwind keeps the UI system fast and modular
- PostgreSQL is reliable for structured learning, content, and analytics data
- Prisma makes schema iteration easier during early product development
- email sign-in is simpler and more family-friendly than GitHub or developer-oriented providers
- S3-compatible storage keeps audio handling flexible if deployment changes later

### Future revision

- auth provider can expand later
- storage provider can be swapped without changing the data model

## 3. Internal Band Calculation Rule

### Decision

Reference Level and Internal Band should be estimated from a weighted combination of:

- baseline or bi-weekly assessments
- recent practice performance
- retention stability
- component balance

### Default scoring weights

#### Baseline stage

- assessment performance: 70%
- recent practice performance: 10%
- retention stability: 10%
- component balance: 10%

#### Ongoing stage after enough usage

- recent assessments: 50%
- recent practice performance: 20%
- retention stability: 15%
- component balance: 15%

### Band promotion rule

Promote a learner’s Internal Band only if:

- there is evidence from at least 2 meaningful scoring windows
- the learner is not highly unstable across key components
- recent performance is not driven by only one strong skill while others remain far behind

### Band demotion rule

Demote a learner’s Internal Band only if:

- there is decline across more than one data point
- the decline lasts across at least 2 review windows or strongly repeated weak practice signals

### Why

- this keeps level changes believable
- avoids random jumps from one strong day
- avoids discouraging learners with overly sensitive drops

### Future revision

- the weighting system can become more data-driven after real usage data is collected

## 4. First Content Scope for MVP

### Decision

Freeze the MVP seed content to the following first batch:

- Vocabulary Packs: 10
- Speaking Phrase Packs: 6
- Reading Sets: 8
- Listening and Integrated Sets: 8
- Writing Prompt Sets: 8
- Baseline Assessment Forms: 2
- Bi-weekly Review Forms: 4

### Why

- enough to make the product feel real
- still manageable for first implementation
- supports both learner tracks without exploding scope

### Future revision

- add topic-based monthly expansion packs
- add stronger parallel forms for assessment over time

## 5. Content Production Workflow

### Decision

Use a template-first manual production workflow for MVP.

Production stages:

1. define content template
2. draft content in structured format
3. review for DSE alignment or foundation fit
4. assign metadata
5. publish as active content

### Required content template fields

- title
- content type
- target track
- target skill
- target subskill
- reference level range
- internal band range
- topic
- genre
- purpose
- answer key
- explanation or feedback notes
- source type
- exam similarity score

### Naming conventions

- vocabulary: `VOC-<track>-<theme>-<number>`
- reading: `READ-<track>-<topic>-<number>`
- listening: `LIS-<track>-<topic>-<number>`
- speaking: `SPK-<track>-<function>-<number>`
- writing: `WRI-<track>-<genre>-<number>`
- assessment: `ASM-<type>-<track>-<number>`

### Why

- helps content stay organized
- makes content imports easier
- reduces confusion during review and expansion

### Future revision

- add internal content QA dashboard
- add AI-assisted draft generation once the template system is stable

## 6. Audio Feature Boundaries for MVP

### Decision

Audio in MVP will support:

- play model audio
- record learner audio
- replay learner audio
- basic speech-to-text on supported speaking and writing-support flows

Audio in MVP will not support:

- advanced pronunciation scoring
- phoneme-level correction
- full speaking score prediction
- full voice-first writing workflow

### Page support

- vocabulary session
- speaking phrase session
- selected speaking prompts
- optional writing support preview path only

### Default limits

- vocabulary clip recording limit: 15 seconds
- speaking phrase practice limit: 30 seconds
- short response speaking prompt limit: 60 seconds

### Audio retention

- keep learner recordings for product use and review during MVP
- allow user re-record before final submission where the page design supports it

### Why

- keeps scope manageable
- still delivers strong mobile value

### Future revision

- add richer scoring and smarter audio review

## 7. Mom Admin Visibility Scope

### Decision

Mom should see summary-first learner information in MVP.

Mom can view:

- learner Reference Level and Internal Band
- progress trends
- weak areas
- completion rate
- alerts
- recent review summaries

Mom should not deeply inspect in MVP:

- full answer-by-answer mistakes for all tasks
- all raw audio recordings by default
- internal weighting formulas

### Why

- protects learner privacy and emotional comfort
- keeps admin pages clean and practical
- reduces implementation complexity

### Future revision

- add opt-in deeper review views later if useful

## 8. Learning Flow Recovery Rules

### Decision

If a learner misses study days:

- keep overdue review items visible
- regenerate a lighter restart plan on next login
- do not punish with immediate band drops

If a learner skips bi-weekly review:

- continue access to the app
- show persistent reminder
- do not refresh the strongest next-cycle recommendations until the review is completed

### Why

- supports habit recovery without turning the app punitive
- keeps the review system important without locking the learner out

## 9. Definition of Done by Major Surface

### Baseline assessment is done when

- learner can complete all sections
- result page shows Reference Level and Internal Band
- 2-week study focus is generated

### Daily learning flow is done when

- home dashboard loads a plan
- learner can complete at least one full daily session
- completed tasks update progress state

### Vocabulary module is done when

- a learner can study one vocabulary pack end to end
- record and replay work
- spaced review entries are created

### Reading module is done when

- reading passage and questions render correctly on mobile
- answers submit successfully
- result feedback shows weak areas

### Listening module is done when

- audio playback works
- answer capture works
- integrated mini task can be submitted

### Speaking module is done when

- model audio plays
- learner recording works
- prompt submission is saved

### Writing module is done when

- learner can plan and draft
- structured feedback block renders

### Progress surface is done when

- learner sees updated level and trend cards

### Admin dashboard is done when

- mom sees family overview
- mom sees learner summaries
- alerts display useful reasons

## 10. Recommended Default Data Seeding Order

### Step 1

- create users and family demo fixtures

### Step 2

- seed vocabulary packs and speaking phrase packs

### Step 3

- seed reading and listening sets

### Step 4

- seed writing prompt sets

### Step 5

- seed baseline and bi-weekly review sets

## 11. Remaining Low-Risk Unknowns

These are not blockers for starting development:

- exact visual tone refinement
- long-term content release cadence
- future push notification behavior
- richer writing AI feedback
- deeper speaking history, persistence, and trend analysis beyond the first AI MVP

## 12. Conclusion

The main planning ambiguity for MVP is now low enough to begin implementation safely.

The project can proceed with:

- the current PRD
- the technical plan
- the implementation plan
- the database schema draft
- the module task list
- this decision log
