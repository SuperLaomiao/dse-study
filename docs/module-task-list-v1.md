# DSE_Study Module and Page Task List v1

## 1. Purpose

This document breaks MVP work into concrete module and page tasks.

It is intended to guide implementation after planning is complete.

## 2. Module Task List

### Module A: Auth and Family

Goals:

- support mom-created family setup
- support learner invitation and join flow
- enforce role-based visibility

Tasks:

- define auth model and session flow
- build sign-in page
- build family creation page
- build invite acceptance flow
- build session guard for role-based routes
- verify brother and sister cannot see each other’s private learner pages
- verify mom can access admin pages

### Module B: Learner Profiles

Goals:

- create learner-specific settings and track identity

Tasks:

- define learner profile form fields
- build onboarding profile page
- save track, school stage, and study target settings
- create default goal profiles for each learner type
- render profile summary in app

### Module C: Content Infrastructure

Goals:

- establish stable metadata-driven content delivery

Tasks:

- define content unit schema
- define metadata schema
- define content detail models for each module type
- create seed format for content imports
- add content status handling
- add exam similarity and source tracking

### Module D: Baseline Assessment

Goals:

- deliver first meaningful learner entry point

Tasks:

- build baseline assessment landing page
- build assessment question renderer for each section type
- support multi-step assessment flow
- store section results
- compute first Reference Level and Internal Band
- build result page with top weak areas and 2-week study focus

### Module E: Daily Learning Flow

Goals:

- give learners a simple, repeatable study session

Tasks:

- build home dashboard
- build learn page
- generate daily plans from learner state
- attach reasons to recommended tasks
- support task completion states
- show review due items

### Module F: Vocabulary Loop

Goals:

- create the strongest repeatable daily module

Tasks:

- build vocabulary pack loader
- build vocabulary session UI
- support audio play
- support audio record and replay
- support recall and quick test interactions
- store vocabulary mastery changes
- generate spaced review schedule

### Module G: Reading

Goals:

- deliver DSE-relevant reading practice with better diagnostics

Tasks:

- build reading practice page
- render passage and question blocks cleanly on mobile
- support timed and untimed modes
- store question-level results
- attach wrong-reason tags
- show reading result feedback

### Module H: Listening and Integrated Skills

Goals:

- create strong Paper 3 support from MVP stage

Tasks:

- build listening practice page
- support audio player and question flow
- support note capture fields
- support short integrated responses
- store listening and transfer results
- show listening result feedback

### Module I: Speaking Phrase Loop

Goals:

- build a low-friction productive speaking module

Tasks:

- build speaking practice page
- render phrase pack sequence
- support listen, shadow, replay flow
- support mini prompt submission
- store audio attempts
- show simple speaking feedback
- support AI speaking studio with `Pattern` and `Exam` modes
- upload one short audio file and return transcript plus structured feedback
- generate parent-facing summary from the same AI run

### Module J: Writing Basics

Goals:

- support structured written output without overbuilding AI grading

Tasks:

- build writing prompt page
- build planning mode
- build draft mode
- save draft attempts
- render structured feedback view
- reserve hook for future voice-to-draft

### Module K: Progress and Analytics

Goals:

- make improvement visible and trustworthy

Tasks:

- build progress dashboard
- show Reference Level and Internal Band
- show component trend cards
- show recent review history
- show weak-area summary
- build DSE dashboard
- build B1/B2 readiness page for older brother track

### Module L: Bi-weekly Review

Goals:

- close the long-term learning loop

Tasks:

- build bi-weekly review trigger logic
- build review page
- build review result page
- update progress snapshots on review completion
- refresh study priorities for next cycle

### Module M: Family Admin

Goals:

- help mom monitor learning meaningfully

Tasks:

- build family overview page
- build learner detail page
- build alerts page
- generate useful alert messages
- render suggested reminder actions

## 3. Page Task List

### Public and setup pages

- `/sign-in`
- `/family/create`
- `/family/join`
- `/onboarding/profile`

Tasks:

- define mobile layout
- define empty, loading, and error states
- verify family setup flow end to end

### Assessment pages

- `/assessment/baseline`
- `/assessment/result`
- `/review/biweekly`
- `/review/result`

Tasks:

- build section navigation
- support save-and-continue where needed
- define result summary layout
- show action-focused next steps

### Learner pages

- `/home`
- `/learn`
- `/practice`
- `/practice/vocabulary`
- `/practice/reading`
- `/practice/listening`
- `/practice/speaking`
- `/practice/writing`
- `/progress`

Tasks:

- keep navigation consistent
- keep page hierarchy clear on mobile
- keep task CTAs strong and simple

### DSE pages

- `/dse`
- `/dse/b1-b2`

Tasks:

- explain DSE component structure
- show readiness states
- show what to improve next

### Admin pages

- `/admin/family`
- `/admin/learner/[id]`
- `/admin/alerts`

Tasks:

- keep summaries concise
- prioritize useful alerts over raw data
- prevent cross-account private detail leaks

## 4. Suggested Implementation Order by User Value

### Highest-value learner flow

1. sign in
2. create or join family
3. create learner profile
4. finish baseline assessment
5. view result
6. start first daily plan
7. complete vocabulary session
8. view progress snapshot

### Highest-value admin flow

1. mom creates family
2. learners join
3. mom sees family overview
4. mom sees learner status after baseline
5. mom sees alerts after enough usage data

## 5. Testing Checklist by Module

### Auth and family

- correct role routing
- invite acceptance works
- family membership is stable across sign-in

### Assessment

- section progress saves correctly
- result generation uses expected learner context
- result page shows correct level and weak areas

### Daily flow

- daily plan generates once per day
- completed tasks update progress
- review due items appear correctly

### Vocabulary

- audio works on mobile
- mastery updates correctly
- review schedule is created

### Reading

- passage layout remains readable
- answers and mistake tags save correctly

### Listening

- audio playback is stable
- note capture and integrated answers save correctly

### Speaking

- recording and replay work reliably
- phrase sequence progresses correctly

### Writing

- plans and drafts save correctly
- structured feedback renders correctly

### Progress and admin

- learners only see their own data
- mom sees all learners in her family
- alerts appear only when conditions are met

## 6. Recommended Next Step After This Task List

After this task list, the next implementation artifact should be:

- actual database migration files or SQL schema
- route scaffold
- initial component map
