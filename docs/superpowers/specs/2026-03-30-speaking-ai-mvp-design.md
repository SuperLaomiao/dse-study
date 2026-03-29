# 2026-03-30 Speaking AI MVP Design

## Goal

Ship the first AI-assisted speaking loop in the learner product so students can upload one short response and immediately receive:

- examiner-style judgement
- coach-style next moves
- a parent-readable summary

The first slice focuses on speaking because it provides the fastest visible value for both the learner and the family admin.

## Product Shape

The MVP lives on `/practice/speaking` as **Speaking AI Studio**.

It supports two modes:

1. **Pattern mode**
   - used for shadowing, retelling, and reusable sentence-frame control
   - evaluates phrase control, rhythm, stability, and short-form clarity

2. **Exam mode**
   - used for DSE-style prompt response
   - evaluates whether the learner actually answers the question, stays organised, and sounds usable under pressure

Both modes share one evaluation engine so the learner and parent see a consistent output shape.

## Learner Flow

1. Select mode: `Pattern` or `Exam`
2. Review or edit the prompt text
3. Upload a short audio response
4. Submit for AI evaluation
5. See:
   - transcript
   - overall band signal
   - rubric scores
   - examiner notes
   - coach moves
   - parent summary

## Parent Surface

The parent does not need the full speaking transcript first. The most important artifact for MVP is the **parent summary** generated from the same analysis run.

The summary should answer:

- what the main speaking risk is
- whether the learner should stay in pattern practice or move into freer speaking
- what the next support action should be

## Technical Design

### Route

Add `POST /api/ai/speaking-evaluate`.

Input:

- `mode`
- `promptText`
- `audio`

Output:

- `transcript`
- `overallBand`
- `overallVerdict`
- `rubric`
- `examinerNotes`
- `coachMoves`
- `parentSummary`

### AI pipeline

1. Transcribe uploaded audio
2. Run structured speaking evaluation against the transcript and prompt
3. Return one compact JSON payload for the UI

### Failure behavior

If `OPENAI_API_KEY` is missing:

- do not crash the route
- return a clear configuration error
- keep the speaking page usable so product demos still load

## MVP Boundaries

Included now:

- audio upload based evaluation
- two speaking modes
- transcript display
- structured examiner and coach feedback
- parent summary

Deferred:

- browser-native recorder controls
- attempt persistence
- admin dashboard embedding of parent summaries
- speaking history and trend lines
- waveform UI or pronunciation segment highlight

## Verification

The MVP is considered healthy when:

- `/practice/speaking` renders the AI studio UI
- `POST /api/ai/speaking-evaluate` returns a friendly error when AI is not configured
- build, typecheck, and targeted practice tests remain green
