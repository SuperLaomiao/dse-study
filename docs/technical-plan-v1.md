# DSE_Study Technical Plan v1

## Product Goal

Build a mobile-first family English learning web app focused on long-term DSE preparation, with separate learner accounts for older brother and younger sister, plus a family admin account for mom.

## User Roles

- Older brother: F3 learner, DSE track, long-term goal of DSE English 5*
- Younger sister: P5 learner, foundation-to-DSE track
- Mom: family admin, plus companion learner

## MVP Scope

- Family and account system
- Baseline assessment
- Bi-weekly review
- Daily learning flow
- Vocabulary Loop
- Reading module
- Listening & Integrated Skills module
- Speaking Phrase Loop
- Writing basics module
- Progress dashboard
- Family admin dashboard

## Architecture Principles

- Mobile-first UX
- English-first UI
- Highly modular domain boundaries
- Content-driven design
- DSE-aligned analytics
- Upgrade-friendly toward stronger AI evaluation and stronger adaptation later

## Suggested Tech Stack

### Frontend

- Next.js App Router
- TypeScript
- Tailwind CSS
- Component-driven design system

### Backend

- Next.js server routes for MVP
- PostgreSQL for durable product data
- Object storage for audio files

### Auth

- Email-based sign-in
- Family creation by mom
- Family invite flow for brother and sister

### Deployment

- Frontend and backend together in one web app deployment
- Database on managed Postgres
- Audio files on object storage

## Core Modules

### 1. Auth and Family Module

Responsibilities:

- Sign-in
- Family creation
- Invitations
- Role assignment
- Session management

Key entities:

- User
- Family
- FamilyMembership
- Role

### 2. Learner Profile Module

Responsibilities:

- Track selection
- Grade and age context
- Study target settings
- DSE goal settings
- Voice preferences and study preferences

Key entities:

- LearnerProfile
- GoalProfile
- StudyPreference

### 3. Assessment Engine

Responsibilities:

- Baseline assessment
- Bi-weekly review
- Section scoring
- Reference Level estimation
- Internal Band estimation
- Action-plan generation

Key entities:

- Assessment
- AssessmentSection
- AssessmentAttempt
- AssessmentResult
- SkillScore
- LevelEstimate

### 4. Daily Learning Flow Module

Responsibilities:

- Generate recommended daily session
- Schedule review items
- Mix core training and transfer tasks
- Respect time budget

Key entities:

- DailyPlan
- DailyTask
- RecommendationReason

### 5. Vocabulary Module

Responsibilities:

- Run Vocabulary Loop
- Track word mastery
- Schedule spaced review
- Support listen, record, replay, recall, quick test, and use-it tasks

Key entities:

- VocabularyPack
- VocabularyItem
- VocabularyAttempt
- VocabularyMastery
- ReviewSchedule

### 6. Reading Module

Responsibilities:

- Deliver reading drills and timed reading
- Track subskills such as inference and tone
- Store wrong-reason analysis

Key entities:

- ReadingSet
- ReadingPassage
- ReadingQuestion
- ReadingAttempt
- ReadingErrorTag

### 7. Listening and Integrated Skills Module

Responsibilities:

- Deliver listening drills
- Deliver integrated tasks
- Track note capture and transfer weaknesses

Key entities:

- ListeningSet
- AudioAsset
- ListeningQuestion
- IntegratedTask
- ListeningAttempt

### 8. Speaking Module

Responsibilities:

- Run Speaking Phrase Loop
- Store recordings
- Support prompt-based mini speaking tasks
- Track phrase usability and speaking confidence

Key entities:

- SpeakingPhrasePack
- SpeakingPrompt
- SpeakingAttempt
- AudioRecording

### 9. Writing Module

Responsibilities:

- Support planning mode
- Support writing mode
- Reserve path for voice-to-draft
- Provide DSE-style structured feedback

Key entities:

- WritingPrompt
- WritingDraft
- WritingAttempt
- WritingFeedback

### 10. DSE Analytics Module

Responsibilities:

- Component dashboard
- B1/B2 readiness
- DSE-style progress summaries
- Goal tracking toward 5*

Key entities:

- ComponentReadiness
- B1B2Recommendation
- ProgressSnapshot

### 11. Family Admin Module

Responsibilities:

- Family overview
- Learner detail view
- Alerts
- Useful reminders for mom

Key entities:

- FamilyDashboardSnapshot
- LearnerAlert
- ReminderSuggestion

## Content Bank Architecture

The content system should be treated as a structured content platform, not a loose collection of questions.

### Content Buckets

- Vocabulary Packs
- Speaking Phrase Packs
- Reading Sets
- Listening and Integrated Sets
- Writing Prompt Sets
- Assessment Sets

### Content Types

- official_anchor
- dse_style_original
- official_review

### Required Metadata

- skill
- subskill
- track
- reference_level_range
- internal_band_range
- difficulty
- topic
- genre
- purpose
- estimated_time
- output_type
- source_type
- exam_similarity_score
- status

### Content Status

- draft
- active
- review_needed
- retired

## Content Strategy

### DSE Alignment Rule

Use official HKEAA materials as calibration anchors:

- sample papers
- practice papers
- public descriptions
- exam reports
- level descriptors

Use those anchors to design high-similarity original training content and parallel review sets.

### Why not rely only on past papers

- Need parallel forms for repeated reviews
- Need modular drills for daily practice
- Need difficulty-controlled variants for different learner tracks
- Need to respect source and licensing boundaries

## Content Update Pipeline

### Stage 1: Content blueprint

- Define skill map
- Define question and task templates
- Define topic packs
- Define DSE alignment reference notes

### Stage 2: Core content production

- Create first training bank manually using templates
- Create baseline and bi-weekly review content
- Create vocabulary and phrase starter packs

### Stage 3: Content QA

- Review clarity
- Review difficulty
- Review DSE similarity
- Review track appropriateness

### Stage 4: Publish

- Mark content active
- Attach release notes if needed

### Stage 5: Post-use review

- Watch correctness rate
- Watch completion rate
- Watch discrimination quality
- Retire or revise weak content

## Level System

### Public display

- Reference Level
- Internal Band

Examples:

- Lv3 + 3B4
- Lv4 + 4B2

### Band logic

Estimate Internal Band from:

- recent assessments
- recent practice performance
- retention stability
- section-level balance

Upgrades should require stability. Downgrades should be conservative.

## Audio Scope for MVP

- Record audio
- Replay audio
- Basic speech-to-text where useful
- Store audio safely

Not in MVP:

- heavy pronunciation scoring
- advanced speaking grading
- advanced voice-to-draft rewriting

## Notifications for MVP

- In-app reminders only
- review due
- study streak warning
- family admin alerts

## Suggested Delivery Sequence

### Phase 1

- Project setup
- Auth and family model
- Learner profile model
- Content schema

### Phase 2

- Baseline assessment
- Daily learning flow
- Vocabulary module

### Phase 3

- Reading module
- Listening and Integrated module
- Speaking module

### Phase 4

- Writing basics
- Progress dashboard
- Family admin dashboard

### Phase 5

- Bi-weekly review
- DSE analytics
- B1/B2 readiness

## Upgrade Path Toward Version 3

- stronger adaptation engine
- stronger speech analysis
- stronger writing feedback
- AI study companion
- AI-assisted content generation and QA
- richer family insights
