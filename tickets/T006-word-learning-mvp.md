# T006 — Word Learning MVP

## Goal
Deliver the MVP learning loop: level selection, learning session, forgotten review, and progress dashboard.

## Scope
- Mobile screens:
  - `HomeScreen`
  - `LevelSelectScreen`
  - `SessionScreen`
  - `SessionSummaryScreen`
  - `ReviewForgottenScreen`
- API endpoints for:
  - Target level get/set
  - Session word fetch (default N=20)
  - Word state updates
  - Forgotten review queue
  - Progress stats
- Persist state transitions in DB.

## Requirements
- Word states must support `Known`, `Learning`, `Forgotten`.
- Forgotten review should prioritize by `lastReviewedAt`/staleness.
- Keep API errors standardized.

## Deliverables
- End-to-end mobile + API + DB implementation for MVP loop.
- Tests for key state transitions and endpoint validation.

## Acceptance Criteria
- User can complete a full learning session and see summary.
- User can review forgotten words and reclassify states.
- Home screen shows chosen level and meaningful progress stats.
