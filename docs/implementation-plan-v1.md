# DSE_Study Implementation Plan v1

## 1. Objective

Turn the current PRD into a staged, buildable MVP plan with clear delivery order, modular boundaries, and future-safe technical structure.

## 2. Delivery Strategy

Build the MVP in vertical slices, not as disconnected technical layers.

Each phase should produce something testable and progressively closer to real user value.

Guiding principles:

- keep modules loosely coupled
- keep content schema stable early
- ship the learner core before polishing advanced analytics
- avoid heavy AI dependencies in MVP

## 3. Recommended Build Order

### Phase 0: Foundation

Goal:

- set up the application and core development conventions

Deliverables:

- app scaffold
- shared UI primitives
- routing structure
- environment configuration
- database setup
- auth setup
- file storage strategy for audio
- initial seed script support

### Phase 1: Family and Account Core

Goal:

- make the app usable by the three target roles

Deliverables:

- sign-in flow
- family creation flow
- join-family flow
- role-based access
- learner profile setup

User-visible result:

- Mom can create the family
- Older brother and younger sister can join
- Each user lands in the correct role-specific experience

### Phase 2: Content and Assessment Backbone

Goal:

- establish structured content delivery and the first real learning entry point

Deliverables:

- content schema
- content metadata system
- baseline assessment framework
- section rendering for vocabulary, reading, listening, speaking, and writing
- scoring pipeline
- initial Reference Level and Internal Band estimation rules
- assessment result page

User-visible result:

- A learner can complete the first baseline assessment and receive a personalized result

### Phase 3: Daily Learning Flow and Vocabulary Loop

Goal:

- create the first repeatable daily study experience

Deliverables:

- home dashboard
- daily plan generator
- daily task list
- vocabulary packs
- Vocabulary Loop flow
- review scheduling
- vocabulary mastery tracking

User-visible result:

- A learner can log in daily, receive a guided plan, complete a vocabulary session, and see progress

### Phase 4: Reading and Listening Modules

Goal:

- add the most important DSE-supporting study modules after vocabulary

Deliverables:

- reading drills
- reading question rendering
- reading mistake tagging
- listening task player
- listening and integrated mini tasks
- section-specific result capture

User-visible result:

- Learners can train DSE-relevant reading and listening skills inside the daily flow and practice views

### Phase 5: Speaking and Writing Basics

Goal:

- support productive output in manageable MVP form

Deliverables:

- Speaking Phrase Loop
- audio recording and replay
- speaking prompt submissions
- writing planning mode
- writing draft mode
- basic structured feedback display

User-visible result:

- Learners can practice spoken phrase patterns and complete simple writing tasks with guided structure

### Phase 6: Progress, Admin, and Bi-weekly Review

Goal:

- close the loop for long-term use and parent oversight

Deliverables:

- progress dashboard
- component trend cards
- bi-weekly review flow
- review result page
- family overview dashboard
- learner detail page
- alerts view for mom

User-visible result:

- Mom can monitor learning trends, and learners can see real change over time

### Phase 7: DSE Analytics Layer

Goal:

- strengthen the exam-specific differentiation of the product

Deliverables:

- DSE component dashboard
- Paper 1 / 2 / 3 / 4 / SBA framing
- B1/B2 readiness logic and screen
- DSE-specific recommendation signals for the older brother

User-visible result:

- The product clearly feels DSE-aware and not like a generic English app

## 4. Route Map

Recommended route structure:

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

## 5. Module Boundaries

### Auth and Family

Owns:

- identity
- family membership
- role checks

Does not own:

- content rules
- learning recommendations
- scoring logic

### Learner Profile

Owns:

- learner settings
- track
- grade
- goals

Does not own:

- assessment scoring
- content storage

### Content System

Owns:

- content units
- metadata
- publishing status

Does not own:

- final learner scoring
- account permissions

### Assessment Engine

Owns:

- assessments
- scoring
- level estimates
- review result generation

Does not own:

- long-term content authoring workflows

### Daily Learning Engine

Owns:

- daily plans
- task ordering
- recommendation reasons

Does not own:

- user auth
- raw content definitions

### Practice Modules

Own:

- task rendering
- attempt capture
- skill-specific result details

Do not own:

- family access rules
- level estimation rules

### Analytics and Admin

Own:

- trend snapshots
- family overview views
- alert generation

Do not own:

- raw learning interaction capture

## 6. Suggested Database Model

### Core identity tables

- `users`
- `families`
- `family_memberships`
- `learner_profiles`
- `goal_profiles`

### Content tables

- `content_units`
- `content_tags`
- `content_unit_tags`
- `vocabulary_packs`
- `reading_sets`
- `listening_sets`
- `speaking_phrase_packs`
- `writing_prompt_sets`
- `assessment_sets`

### Attempt and progress tables

- `assessment_attempts`
- `assessment_section_results`
- `daily_plans`
- `daily_tasks`
- `task_attempts`
- `vocabulary_mastery`
- `review_schedules`
- `progress_snapshots`
- `learner_alerts`

### Media tables

- `audio_recordings`
- `audio_transcripts`

## 7. Initial API / Service Surface

### Auth and family

- create family
- invite learner
- accept invite
- get current session

### Profile

- create learner profile
- update learner profile
- fetch learner profile

### Content

- list content for module
- fetch content unit
- fetch recommended content

### Assessment

- start baseline assessment
- submit section attempt
- finalize assessment
- fetch result

### Daily flow

- generate daily plan
- fetch daily plan
- complete daily task

### Progress

- fetch learner progress
- fetch recent reviews
- fetch component trend

### Admin

- fetch family overview
- fetch learner detail
- fetch alerts

## 8. Content Production Plan for MVP

### First content set

Build a small but well-structured first library:

- 8-12 vocabulary packs
- 4-6 speaking phrase packs
- 6-8 reading sets
- 6-8 listening or integrated mini sets
- 6-8 writing prompt sets
- 2 baseline assessment forms
- 3-4 bi-weekly review forms

### Production rules

- use DSE structure and topic patterns as reference
- create parallel items instead of repeated clones
- keep metadata complete from the start
- review all assessment content manually

## 9. Internal Logic Rules

### Daily plan generation

Daily plans should consider:

- current track
- recent assessment result
- due review items
- weak skills
- available study time

### Band update

Band update should consider:

- last 2-3 assessment cycles
- recent skill stability
- retention and completion signals
- imbalance between components

### Alert generation

Alerts should focus on:

- overdue review
- sudden drop in completion
- persistent weakness in one major module
- unbalanced study pattern

## 10. QA and Verification Approach

### Product QA

- verify role-based access
- verify mobile layout quality
- verify core daily flow completion
- verify assessment submission and result rendering

### Learning QA

- verify content difficulty labels
- verify content-track fit
- verify DSE similarity expectations
- verify band logic sanity

### Audio QA

- verify recording and replay on mobile
- verify transcript handling when available

## 11. Risks to Watch During Build

### Scope risk

Too many smart behaviors too early may slow delivery.

### Content risk

If content is too generic, the app loses DSE credibility.

### Level trust risk

If band changes appear arbitrary, learners may stop trusting progress metrics.

### Audio complexity risk

Voice features can expand rapidly beyond MVP if not bounded clearly.

## 12. Definition of MVP Completion

The MVP can be considered complete when:

- all three roles can sign in and use the correct views
- a learner can complete onboarding and baseline assessment
- a learner can receive and complete daily plans
- vocabulary, reading, listening, speaking, and writing basics are usable
- bi-weekly review works end to end
- progress pages show meaningful learner changes
- mom can view family overview and alerts
- DSE-specific screens exist for the older brother’s track

## 13. Immediate Next Tasks

### Product and planning

- review PRD and implementation plan together
- freeze MVP scope
- finalize route map

### Technical setup

- choose final stack and project structure
- set up app
- set up database schema migration workflow

### Content setup

- define metadata schema
- create first content templates
- draft first calibration-aligned content packs
