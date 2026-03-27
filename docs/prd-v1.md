# DSE_Study PRD v1

## 1. Product Overview

### Product Name

DSE_Study

### Product Vision

DSE_Study is a mobile-first family English learning web app designed to help learners improve systematically over time, with a special focus on DSE English readiness for the older brother, strong foundation building for the younger sister, and lightweight oversight from the mother as family admin.

### Product Positioning

This is not a generic vocabulary app or a simple question bank.

It is a structured English growth system built around:

- baseline assessment
- daily guided study
- bi-weekly review
- progress tracking
- DSE-aligned analytics
- modular content and future upgrade paths

## 2. Target Users

### Primary Users

#### Older Brother

- current stage: F3
- target: long-term DSE English 5*
- needs:
  - DSE-focused progression
  - strong vocabulary development
  - reading and listening strategy
  - speaking and writing transfer
  - clear progress tracking

#### Younger Sister

- current stage: P5
- target: improve school English and gradually build toward future DSE readiness
- needs:
  - clear and manageable learning flow
  - foundation vocabulary and sentence-building
  - listening and reading comprehension
  - confidence and consistency

### Secondary User

#### Mom

- role: family admin and companion learner
- needs:
  - overview of both children’s learning status
  - meaningful reminders and alerts
  - progress visibility without excessive complexity

## 3. Product Goals

### Core Product Goals

- help the older brother progress toward DSE English excellence over multiple years
- help the younger sister steadily improve English fundamentals while preparing for future higher-level learning
- make daily English study sustainable on mobile
- turn assessment results into actionable study plans
- support family oversight without making the product feel heavy

### MVP Goals

- establish a reliable learning loop
- provide role-based access for family use
- launch DSE-aligned but age-appropriate study experiences
- create a modular foundation for future AI upgrades

## 4. Non-Goals for MVP

- full AI grading for writing and speaking
- heavy social or community features
- gamified leaderboard systems
- full teacher-facing platform
- full push notification infrastructure
- large-scale automated content generation pipeline

## 5. Product Principles

- mobile-first by default
- English-first UI
- clear, calm, growth-oriented experience
- DSE-specific where it matters most
- modular systems over hard-coded flows
- measurable progress over vague motivation
- structured learning over random practice

## 6. User Roles and Permissions

### Older Brother

- student account
- can view only his own learning data
- receives DSE-focused recommendations

### Younger Sister

- student account
- can view only her own learning data
- receives foundation-to-DSE recommendations

### Mom

- family admin account
- can view family overview and both learners’ progress
- can also use companion learning mode

### Permission Boundaries for MVP

Mom can:

- view family overview
- view learner progress summaries
- view component-level strengths and weaknesses
- view alerts and suggested reminders

Mom cannot in MVP:

- deeply edit content
- manually re-score assessments
- view overly detailed internal system scoring logic

## 7. Core User Problems

### Older Brother Problems

- does not yet have a system for long-term DSE English growth
- needs more than just random vocabulary study
- needs clear evidence of progress over time
- needs DSE-relevant reading, listening, writing, and speaking support

### Younger Sister Problems

- needs strong English fundamentals without being overwhelmed
- needs age-appropriate tasks that still build long-term readiness
- benefits from guided and repeatable study sessions

### Mom Problems

- wants visibility into children’s learning without managing a complex platform
- needs useful signals, not just raw study time

## 8. Core Experience Loop

The product is built around one main loop:

1. baseline assessment
2. system-generated study plan
3. daily guided study sessions
4. spaced review and skill reinforcement
5. bi-weekly review
6. updated plan and level signal

## 9. Core Features in MVP

### 9.1 Family and Account System

Users can:

- sign in with email-based authentication
- create or join a family
- access role-specific views

Default setup:

- Mom creates the family
- Older brother and younger sister join the family

### 9.2 Baseline Assessment

The first-time learner experience includes a 30-40 minute assessment covering:

- vocabulary
- reading
- listening
- writing
- speaking

Output includes:

- Reference Level
- Internal Band
- top weak areas
- initial 2-week study focus

### 9.3 Daily Learning Flow

Each learner receives a recommended daily study flow designed for:

- 40-60 minutes
- 6 days per week
- half-adaptive flexibility

Daily flow should typically include:

- warm start
- one core module
- one transfer module
- review items
- closeout

### 9.4 Vocabulary Loop

The vocabulary system includes:

- listen
- shadow
- replay
- meaning in context
- active recall
- quick test
- use-it task
- spaced review scheduling

Mastery tracking includes:

- recognize
- understand in context
- pronounce
- produce

### 9.5 Reading Module

The reading module supports:

- reading drills
- timed reading
- question-type practice
- wrong-reason analysis

Subskills include:

- skimming
- scanning
- inference
- tone
- writer attitude
- vocabulary in context

### 9.6 Listening and Integrated Skills Module

This module supports:

- listening drills
- note capture
- information transfer
- integrated mini tasks

Subskills include:

- main idea
- detail capture
- speaker attitude
- signal words
- note-taking
- listen-read-write transfer

### 9.7 Speaking Phrase Loop

The speaking module includes:

- phrase model audio
- shadowing
- replay
- meaning and use-case explanation
- substitution exercise
- mini speaking prompt

It focuses on practical DSE-relevant speaking functions such as:

- giving opinions
- agreeing
- disagreeing politely
- making suggestions
- comparing options
- giving reasons

### 9.8 Writing Basics Module

The writing module supports:

- planning mode
- writing mode
- structured DSE-style feedback

MVP feedback dimensions:

- task fulfilment
- audience and purpose
- organization
- language range
- language accuracy

Voice-to-draft is reserved for later iteration, not full MVP dependency.

### 9.9 Progress Dashboard

Each learner can see:

- Reference Level
- Internal Band
- component-level progress
- recent trend
- weak areas
- recent review results

### 9.10 DSE Analytics

For the older brother especially, the system includes:

- DSE component readiness view
- Paper 1 / 2 / 3 / 4 / SBA framing
- B1/B2 readiness guidance

### 9.11 Family Admin Dashboard

Mom can see:

- family overview
- learner detail
- alerts
- useful reminder suggestions

## 10. DSE-Specific Design Requirements

Because DSE is a major product goal, the product must reflect the actual exam structure and learner needs.

Requirements:

- treat Reading and Listening/Integrated as first-class modules
- include DSE-style writing and speaking structures
- align content to DSE topics, genres, and purposes
- make Paper 3 an especially visible training priority
- support B1/B2 readiness guidance
- show progress in a way that supports long-term movement toward 5*

## 11. Level System

### Public Level Model

Each learner sees:

- Reference Level
- Internal Band

Example:

- Lv3 + 3B4
- Lv4 + 4B2

### Internal Band Purpose

Internal Band provides finer progress granularity within a larger level so learners can see smaller wins while still tracking toward larger milestones.

### Band Update Logic

Band changes should consider:

- recent assessment results
- recent practice quality
- retention stability
- skill balance

Band increases should require consistency.
Band decreases should be conservative.

## 12. Content Bank Strategy

### Content Philosophy

The question bank should be highly aligned with DSE, especially for the older brother’s track.

However, the system should not depend only on directly copying past papers.

### Content Structure

Main content buckets:

- Vocabulary Packs
- Speaking Phrase Packs
- Reading Sets
- Listening and Integrated Sets
- Writing Prompt Sets
- Assessment Sets

### DSE Alignment Model

Use official HKEAA materials as calibration anchors:

- sample papers
- practice papers
- public descriptions
- exam reports
- level descriptors

Daily training content should primarily be:

- DSE-style high-similarity original content
- parallel review sets
- modular drills

Later, the system may include a separate official-paper review mode.

### Content Metadata

Each content unit should include:

- skill
- subskill
- track
- reference level range
- internal band range
- difficulty
- topic
- genre
- purpose
- estimated time
- output type
- source type
- exam similarity score
- status

## 13. Notifications in MVP

MVP should include in-app reminders only:

- study due
- review due
- streak at risk
- family alerts for mom

## 14. Success Metrics

### Product Health Metrics

- weekly active learners
- 7-day retention
- average weekly study completion rate
- bi-weekly review completion rate

### Learning Metrics

- vocabulary retention rate
- reading accuracy trend
- listening and integrated accuracy trend
- speaking participation rate
- writing completion rate
- movement in Reference Level and Internal Band over time

### Family Metrics

- admin dashboard usage rate
- alert response rate

## 15. MVP Functional Boundaries

### In Scope

- family auth and role structure
- baseline assessment
- bi-weekly review
- daily learning flow
- vocabulary loop
- reading module
- listening and integrated mini tasks
- speaking phrase loop
- writing basics
- learner progress dashboard
- family admin dashboard

### Out of Scope

- advanced AI scoring
- full teacher dashboards
- heavy push notifications
- full content authoring platform
- advanced social features

## 16. Risks and Constraints

### Content Risk

If content quality is weak, the system will feel generic and not sufficiently DSE-specific.

### Product Scope Risk

If too many features enter MVP, delivery quality and speed may suffer.

### Audio Risk

Speech-related features can become technically heavy if expanded too fast.

### Assessment Trust Risk

If levels and bands feel unstable or unclear, learners may lose trust in the system.

## 17. Future Expansion Direction

Future versions may include:

- stronger AI speaking analysis
- stronger AI writing analysis
- voice-to-draft writing flow
- richer adaptive recommendation engine
- AI-assisted content generation and QA
- deeper family insight features
- official-paper review mode
