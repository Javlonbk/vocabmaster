# T005 — Mobile Auth Flow

## Goal
Build the mobile authentication UX for email signup/login and session entry to Home.

## Scope
- Implement screens:
  - `LoginScreen`
  - `SignupScreen` (or combined auth screen)
- Add form validation and loading/error states.
- Integrate with auth API endpoints.
- On success, navigate to `HomeScreen`.

## Requirements
- Strong typing for API responses and app state.
- Show clear error messaging without leaking sensitive details.

## Deliverables
- Auth screens/components.
- API client integration for auth.
- Navigation wiring to Home.

## Acceptance Criteria
- User can sign up and log in from mobile app.
- Loading and error states are visible and correct.
- Typecheck/lint pass in mobile app.
