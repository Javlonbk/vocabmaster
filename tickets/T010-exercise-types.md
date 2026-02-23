# T010 — Exercise Types

## Goal
Implement multiple exercise types for vocabulary review with immediate feedback and scoring.

## Scope
- Exercise types:
  - **Multiple Choice**: "What does [word] mean?" with 4 definition options
  - **Fill in the Blank**: Sentence with missing word, input field or word bank
  - (Future: Matching - drag-and-drop word-to-definition pairs)
- Exercise UI components:
  - Exercise type selector (tabs)
  - Question card with clear typography
  - Answer options/input field
  - Check answer button
  - Immediate feedback (green for correct, red for incorrect)
  - Explanation panel for wrong answers
  - Progress tracker
  - Results summary screen after completion
- Scoring system:
  - Track correct/incorrect answers per session
  - Calculate accuracy percentage
  - Update word mastery levels in database
  - Show encouraging messages based on performance
- API endpoints:
  - Generate exercise questions for review words
  - Submit exercise results
  - Update word mastery based on performance

## Requirements
- Questions must have varying difficulty based on word level
- Incorrect answer options should be plausible distractors
- Immediate visual feedback on answer selection
- Results persist to database for progress tracking
- Follow MOBILE_UI_SPEC.md design (success green, error red colors)
- Support keyboard input for fill-in-blank on mobile

## Deliverables
- Exercise components:
  - `MultipleChoiceExercise.tsx`
  - `FillInBlankExercise.tsx`
  - `ExerciseCard.tsx` shared wrapper
  - `ExerciseFeedback.tsx` for immediate response
  - `ReviewResultsScreen.tsx` for session summary
- API routes for exercise generation and scoring
- Question generation algorithms
- Scoring and mastery calculation logic
- Encouraging message templates
- Tests for exercise logic and scoring

## Acceptance Criteria
- User can select exercise type (tabs work)
- Multiple choice shows 4 plausible options
- Fill-in-blank validates user input
- Immediate feedback shows correct/incorrect with color coding
- Wrong answers display explanation
- Progress tracker updates in real-time
- Results summary shows accurate statistics
- Word mastery updates in database after session
- Encouraging messages appear based on performance
- Typecheck and lint pass

## Dependencies
- T006 (review screen foundation)
- T017 (vocabulary data with definitions and examples)
