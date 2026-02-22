# T015 — Spaced Repetition Algorithm

## Goal
Implement intelligent spaced repetition scheduling system to optimize long-term vocabulary retention.

## Scope
- Spaced repetition algorithm:
  - Review intervals: 1 day, 3 days, 7 days, 14 days, 30 days, 90 days
  - Calculate next review date based on current interval and performance
  - Priority scoring for review queue (overdue items prioritized)
  - Adjust intervals based on accuracy:
    - Mastered (90%+ accuracy): increase interval
    - Learning (50-89% accuracy): maintain interval
    - Struggling (<50% accuracy): decrease interval
- Review queue optimization:
  - Prioritize by staleness (last reviewed date)
  - Mix of difficulty levels in each session
  - Cap review sessions to prevent overwhelm (e.g., max 30 words/session)
  - Smart scheduling based on user's peak learning times (optional)
- Due words tracking:
  - Calculate words due for review today
  - Show due count on dashboard "Words to Review"
  - Notifications for due reviews (if enabled)
- API endpoints:
  - Get review queue with priority sorting
  - Update review schedule after exercise
  - Get due words count
  - Get upcoming reviews calendar

## Requirements
- Algorithm must be based on proven spaced repetition research (e.g., SM-2, Leitner)
- Review schedule should adapt to individual performance
- Must handle edge cases (words not reviewed for months, perfect accuracy, etc.)
- Performance: efficiently calculate due dates for large word lists
- Follow best practices for retention optimization

## Deliverables
- Spaced repetition algorithm implementation
- Review scheduling service
- Database schema updates:
  - `nextReviewDate` field on `UserWordState`
  - `repetitionInterval` (days)
  - `easeFactor` for SM-2 algorithm
- Priority queue calculation logic
- API routes for review scheduling
- Review notification system integration
- Tests for interval calculation and queue prioritization

## Acceptance Criteria
- Words are scheduled for review at appropriate intervals
- Intervals adjust based on user performance (correct/incorrect)
- Review queue prioritizes overdue and difficult words
- Dashboard shows accurate count of words due today
- "Words to Review" only shows words actually due
- Algorithm handles edge cases correctly
- Performance is acceptable for 1000+ word vocabularies
- Review schedule persists correctly after exercises
- Typecheck and lint pass

## Dependencies
- T006 (word state tracking)
- T010 (exercise results for performance data)
- T008 (dashboard integration for due count)
