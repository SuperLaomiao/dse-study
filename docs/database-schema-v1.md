# DSE_Study Database Schema v1

## 1. Purpose

This document defines the first-pass database schema for the DSE_Study MVP.

Goals:

- support family-based account structure
- support separate learner tracks
- support modular content delivery
- support assessments and daily learning
- support progress tracking and family admin views
- preserve clean boundaries for future upgrades

## 2. Schema Design Principles

- keep identity separate from learner state
- keep content separate from user progress
- keep attempts append-only where possible
- derive dashboards from snapshots instead of recomputing everything in the UI
- allow future AI features without rewriting the core schema

## 3. Core Identity Tables

### `users`

Stores account-level identity.

Columns:

- `id` UUID primary key
- `email` text unique not null
- `display_name` text not null
- `preferred_ui_language` text not null default `'en'`
- `created_at` timestamptz not null default now()
- `updated_at` timestamptz not null default now()

Notes:

- One user can belong to one family in MVP.
- Future versions may allow more complex membership patterns.

### `families`

Stores the family container.

Columns:

- `id` UUID primary key
- `name` text not null
- `created_by_user_id` UUID not null references `users(id)`
- `created_at` timestamptz not null default now()
- `updated_at` timestamptz not null default now()

### `family_memberships`

Stores family membership and role.

Columns:

- `id` UUID primary key
- `family_id` UUID not null references `families(id)`
- `user_id` UUID not null references `users(id)`
- `role` text not null
- `status` text not null default `'active'`
- `joined_at` timestamptz not null default now()

Constraints:

- unique `(family_id, user_id)`
- `role` in `('mom_admin', 'learner')`
- `status` in `('invited', 'active', 'inactive')`

### `family_invites`

Stores invitation flow for learners joining the family.

Columns:

- `id` UUID primary key
- `family_id` UUID not null references `families(id)`
- `email` text not null
- `role` text not null default `'learner'`
- `invite_token` text unique not null
- `expires_at` timestamptz not null
- `accepted_at` timestamptz null
- `created_at` timestamptz not null default now()

## 4. Learner Profile Tables

### `learner_profiles`

Stores learner-specific identity and track settings.

Columns:

- `id` UUID primary key
- `user_id` UUID not null unique references `users(id)`
- `family_id` UUID not null references `families(id)`
- `profile_name` text not null
- `track` text not null
- `school_stage` text not null
- `study_minutes_per_day` integer not null default 45
- `study_days_per_week` integer not null default 6
- `is_admin_view_only` boolean not null default false
- `created_at` timestamptz not null default now()
- `updated_at` timestamptz not null default now()

Constraints:

- `track` in `('dse', 'foundation_to_dse', 'companion')`
- `school_stage` in `('p5', 'f3', 'adult', 'other')`

Notes:

- Mom will also have a learner profile if companion learning is enabled.

### `goal_profiles`

Stores learner goals.

Columns:

- `id` UUID primary key
- `learner_profile_id` UUID not null unique references `learner_profiles(id)`
- `target_reference_level` text null
- `target_internal_band` text null
- `target_exam` text null
- `goal_notes` text null
- `created_at` timestamptz not null default now()
- `updated_at` timestamptz not null default now()

## 5. Content System Tables

### `content_units`

Base table for all content objects.

Columns:

- `id` UUID primary key
- `content_type` text not null
- `title` text not null
- `description` text null
- `source_type` text not null
- `exam_similarity_score` numeric(4,2) not null default 0
- `status` text not null default `'draft'`
- `estimated_minutes` integer null
- `created_at` timestamptz not null default now()
- `updated_at` timestamptz not null default now()

Constraints:

- `content_type` in `('vocabulary_pack', 'speaking_phrase_pack', 'reading_set', 'listening_set', 'integrated_set', 'writing_prompt_set', 'assessment_set')`
- `source_type` in `('official_anchor', 'dse_style_original', 'official_review')`
- `status` in `('draft', 'active', 'review_needed', 'retired')`

### `content_metadata`

Stores shared metadata for routing and recommendation.

Columns:

- `id` UUID primary key
- `content_unit_id` UUID not null unique references `content_units(id)`
- `skill` text not null
- `subskill` text null
- `track` text not null
- `reference_level_min` text null
- `reference_level_max` text null
- `internal_band_min` text null
- `internal_band_max` text null
- `difficulty_score` integer not null default 1
- `topic` text null
- `genre` text null
- `purpose` text not null
- `output_type` text not null

Constraints:

- `skill` in `('vocabulary', 'reading', 'listening', 'integrated', 'speaking', 'writing', 'assessment')`
- `track` in `('dse', 'foundation_to_dse', 'companion')`
- `purpose` in `('practice', 'review', 'assessment', 'diagnostic')`

### `content_releases`

Tracks publishing and revision history.

Columns:

- `id` UUID primary key
- `content_unit_id` UUID not null references `content_units(id)`
- `version_number` integer not null
- `release_notes` text null
- `released_at` timestamptz not null default now()

Constraints:

- unique `(content_unit_id, version_number)`

## 6. Content Detail Tables

### `vocabulary_packs`

Columns:

- `id` UUID primary key
- `content_unit_id` UUID not null unique references `content_units(id)`
- `focus_theme` text null
- `word_count` integer not null default 0

### `vocabulary_items`

Columns:

- `id` UUID primary key
- `vocabulary_pack_id` UUID not null references `vocabulary_packs(id)`
- `term` text not null
- `part_of_speech` text null
- `phonetic_text` text null
- `meaning_en` text null
- `meaning_zh` text null
- `example_sentence` text null
- `difficulty_score` integer not null default 1
- `sort_order` integer not null default 0

### `speaking_phrase_packs`

Columns:

- `id` UUID primary key
- `content_unit_id` UUID not null unique references `content_units(id)`
- `focus_function` text not null

### `speaking_phrases`

Columns:

- `id` UUID primary key
- `speaking_phrase_pack_id` UUID not null references `speaking_phrase_packs(id)`
- `phrase_text` text not null
- `usage_note` text null
- `substitution_hint` text null
- `sort_order` integer not null default 0

### `reading_sets`

Columns:

- `id` UUID primary key
- `content_unit_id` UUID not null unique references `content_units(id)`
- `time_limit_minutes` integer null

### `reading_passages`

Columns:

- `id` UUID primary key
- `reading_set_id` UUID not null references `reading_sets(id)`
- `title` text null
- `body_text` text not null
- `passage_order` integer not null default 0

### `reading_questions`

Columns:

- `id` UUID primary key
- `reading_set_id` UUID not null references `reading_sets(id)`
- `question_type` text not null
- `prompt_text` text not null
- `answer_key` jsonb not null
- `explanation_text` text null
- `sort_order` integer not null default 0

### `listening_sets`

Columns:

- `id` UUID primary key
- `content_unit_id` UUID not null unique references `content_units(id)`
- `time_limit_minutes` integer null
- `is_integrated` boolean not null default false

### `audio_assets`

Columns:

- `id` UUID primary key
- `owner_type` text not null
- `owner_id` UUID not null
- `storage_path` text not null
- `duration_seconds` integer null
- `transcript_text` text null
- `created_at` timestamptz not null default now()

### `listening_questions`

Columns:

- `id` UUID primary key
- `listening_set_id` UUID not null references `listening_sets(id)`
- `question_type` text not null
- `prompt_text` text not null
- `answer_key` jsonb not null
- `explanation_text` text null
- `sort_order` integer not null default 0

### `writing_prompt_sets`

Columns:

- `id` UUID primary key
- `content_unit_id` UUID not null unique references `content_units(id)`
- `genre` text not null
- `target_length_words` integer null

### `writing_prompts`

Columns:

- `id` UUID primary key
- `writing_prompt_set_id` UUID not null references `writing_prompt_sets(id)`
- `prompt_text` text not null
- `audience_hint` text null
- `purpose_hint` text null
- `tone_hint` text null

### `assessment_sets`

Columns:

- `id` UUID primary key
- `content_unit_id` UUID not null unique references `content_units(id)`
- `assessment_type` text not null
- `target_duration_minutes` integer not null

Constraints:

- `assessment_type` in `('baseline', 'biweekly_review')`

## 7. Attempt Tables

### `assessment_attempts`

Columns:

- `id` UUID primary key
- `learner_profile_id` UUID not null references `learner_profiles(id)`
- `assessment_set_id` UUID not null references `assessment_sets(id)`
- `status` text not null default `'in_progress'`
- `started_at` timestamptz not null default now()
- `submitted_at` timestamptz null

Constraints:

- `status` in `('in_progress', 'submitted', 'scored')`

### `assessment_section_results`

Columns:

- `id` UUID primary key
- `assessment_attempt_id` UUID not null references `assessment_attempts(id)`
- `skill` text not null
- `raw_score` numeric(6,2) null
- `normalized_score` numeric(6,2) null
- `feedback_summary` text null

### `daily_plans`

Columns:

- `id` UUID primary key
- `learner_profile_id` UUID not null references `learner_profiles(id)`
- `plan_date` date not null
- `target_minutes` integer not null
- `status` text not null default `'active'`
- `created_at` timestamptz not null default now()

Constraints:

- unique `(learner_profile_id, plan_date)`
- `status` in `('active', 'completed', 'skipped')`

### `daily_tasks`

Columns:

- `id` UUID primary key
- `daily_plan_id` UUID not null references `daily_plans(id)`
- `content_unit_id` UUID null references `content_units(id)`
- `task_type` text not null
- `task_order` integer not null
- `recommended_minutes` integer null
- `recommendation_reason` text null
- `status` text not null default `'pending'`

Constraints:

- `status` in `('pending', 'started', 'completed', 'skipped')`

### `task_attempts`

Columns:

- `id` UUID primary key
- `daily_task_id` UUID null references `daily_tasks(id)`
- `learner_profile_id` UUID not null references `learner_profiles(id)`
- `content_unit_id` UUID null references `content_units(id)`
- `skill` text not null
- `result_payload` jsonb not null default '{}'::jsonb
- `started_at` timestamptz not null default now()
- `completed_at` timestamptz null

## 8. Progress Tables

### `vocabulary_mastery`

Columns:

- `id` UUID primary key
- `learner_profile_id` UUID not null references `learner_profiles(id)`
- `vocabulary_item_id` UUID not null references `vocabulary_items(id)`
- `recognize_score` integer not null default 0
- `context_score` integer not null default 0
- `pronounce_score` integer not null default 0
- `produce_score` integer not null default 0
- `last_reviewed_at` timestamptz null
- `next_review_due_at` timestamptz null

Constraints:

- unique `(learner_profile_id, vocabulary_item_id)`

### `review_schedules`

Columns:

- `id` UUID primary key
- `learner_profile_id` UUID not null references `learner_profiles(id)`
- `content_unit_id` UUID null references `content_units(id)`
- `vocabulary_item_id` UUID null references `vocabulary_items(id)`
- `due_at` timestamptz not null
- `review_type` text not null
- `status` text not null default `'due'`
- `created_at` timestamptz not null default now()

Constraints:

- `review_type` in `('spaced_review', 'weakness_review', 'biweekly_followup')`
- `status` in `('due', 'completed', 'expired')`

### `progress_snapshots`

Columns:

- `id` UUID primary key
- `learner_profile_id` UUID not null references `learner_profiles(id)`
- `snapshot_date` date not null
- `reference_level` text null
- `internal_band` text null
- `reading_score` numeric(6,2) null
- `writing_score` numeric(6,2) null
- `listening_score` numeric(6,2) null
- `speaking_score` numeric(6,2) null
- `vocabulary_score` numeric(6,2) null
- `summary_text` text null

Constraints:

- unique `(learner_profile_id, snapshot_date)`

## 9. Admin and Alert Tables

### `learner_alerts`

Columns:

- `id` UUID primary key
- `learner_profile_id` UUID not null references `learner_profiles(id)`
- `family_id` UUID not null references `families(id)`
- `severity` text not null
- `alert_type` text not null
- `message_text` text not null
- `is_active` boolean not null default true
- `created_at` timestamptz not null default now()

Constraints:

- `severity` in `('low', 'medium', 'high')`

### `family_dashboard_snapshots`

Columns:

- `id` UUID primary key
- `family_id` UUID not null references `families(id)`
- `snapshot_date` date not null
- `dashboard_payload` jsonb not null
- `created_at` timestamptz not null default now()

Constraints:

- unique `(family_id, snapshot_date)`

## 10. Audio Tables

### `audio_recordings`

Columns:

- `id` UUID primary key
- `learner_profile_id` UUID not null references `learner_profiles(id)`
- `linked_skill` text not null
- `linked_entity_type` text not null
- `linked_entity_id` UUID not null
- `storage_path` text not null
- `duration_seconds` integer null
- `created_at` timestamptz not null default now()

### `audio_transcripts`

Columns:

- `id` UUID primary key
- `audio_recording_id` UUID not null unique references `audio_recordings(id)`
- `transcript_text` text not null
- `transcript_source` text not null
- `created_at` timestamptz not null default now()

Constraints:

- `transcript_source` in `('manual', 'system_stt')`

## 11. Recommended Indexes

- index `family_memberships(user_id)`
- index `family_memberships(family_id, role)`
- index `learner_profiles(family_id, track)`
- index `content_units(content_type, status)`
- index `content_metadata(skill, track, purpose)`
- index `content_metadata(topic, genre)`
- index `assessment_attempts(learner_profile_id, started_at desc)`
- index `daily_plans(learner_profile_id, plan_date desc)`
- index `review_schedules(learner_profile_id, due_at, status)`
- index `progress_snapshots(learner_profile_id, snapshot_date desc)`
- index `learner_alerts(family_id, is_active, severity)`

## 12. Schema Notes for Future Versions

- Add rubric-level scoring tables for stronger writing and speaking analysis
- Add content-authoring workflow tables for editorial review
- Add richer recommendation state for stronger adaptive sequencing
- Add teacher-facing access only if product scope expands beyond family use
