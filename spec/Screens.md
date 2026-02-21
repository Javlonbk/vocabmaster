# Screens (MVP)

## Auth
- LoginScreen
  - inputs: email, password
  - states: loading, error
- SignupScreen (optional; can be combined)

## Main
- HomeScreen
  - shows: selected level, quick stats, buttons: Start Session, Review Forgotten, Change Level
- LevelSelectScreen
  - list of A1..C2
- SessionScreen
  - flashcard: word + (optional) definition/example later
  - actions: Known / Learning / Forgotten
  - states: loading, error, empty
- SessionSummaryScreen
  - stats: counts by state
- ReviewForgottenScreen
  - list/flashcards
- SettingsScreen
  - logout, account info

## Admin (MVP minimal)
- AdminDashboardScreen (optional in MVP)
  - dataset status
  - import trigger
