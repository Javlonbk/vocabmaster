# T007 — Onboarding & Placement Test

## Goal
Implement first-time user onboarding flow and adaptive placement test to recommend appropriate CEFR level.

## Scope
- Mobile screens:
  - `OnboardingScreen` with feature highlights and app benefits
  - `PlacementTestScreen` with adaptive question flow
  - Question progress indicator and navigation
- Placement test logic:
  - Start with B1 level questions
  - Adaptive difficulty based on performance
  - 10-15 questions total
  - Calculate recommended level from accuracy
- First-time user detection and routing
- Onboarding skip logic for returning users

## Requirements
- Placement test questions must cover vocabulary across all CEFR levels
- Algorithm should accurately assess user level based on responses
- Clean, inspiring onboarding design with soft gradients
- Exit confirmation modal for placement test
- Must follow MOBILE_UI_SPEC.md design system

## Deliverables
- `OnboardingScreen.tsx` with feature carousel/highlights
- `PlacementTestScreen.tsx` with question cards
- Placement test question dataset (minimum 30 questions)
- Level calculation algorithm
- Navigation guards for first-time vs returning users
- Tests for level calculation logic

## Acceptance Criteria
- First-time users see onboarding before other screens
- Returning users skip onboarding
- Placement test adapts difficulty based on answers
- Test accurately recommends CEFR level (A1-C2)
- User can exit test with confirmation warning
- Recommended level saves to user profile
- Typecheck and lint pass

## Dependencies
- T005 (auth flow for user detection)
- T006 (level selection integration)
