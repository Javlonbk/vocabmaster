# T014 — Profile & Settings

## Goal
Implement user profile management and app settings configuration.

## Scope
- Profile screen sections:
  - **User Info**: Display name, email, selected CEFR level, member since date, profile avatar (optional)
  - **Settings**:
    - Audio enabled toggle (affects flashcard audio)
    - Daily goal slider (5-50 words per day)
    - Notification preferences toggle
    - Theme selection (light/dark - light only for MVP, dark future)
  - **Data Management**:
    - Reset progress (with confirmation modal)
    - Export data (JSON download)
    - Import data from export file
    - Clear cache
  - **About**:
    - App version and build info
    - Tutorial/Help link
    - Privacy policy link
    - Contact support
    - Terms of service
- Settings persistence:
  - Store settings in database per user
  - Apply settings across app (audio, theme, notifications)
  - Sync settings on login
- API endpoints:
  - Get user profile
  - Update user profile
  - Get/update settings
  - Reset progress
  - Export user data
  - Import user data

## Requirements
- Settings must persist across sessions and devices
- Reset progress requires explicit confirmation (modal with warning)
- Export includes all user data (progress, favorites, settings)
- Import validates data structure before applying
- Audio toggle affects all audio playback immediately
- Daily goal affects dashboard goal tracking
- Follow MOBILE_UI_SPEC.md design for settings UI
- Profile edits must validate input

## Deliverables
- `ProfileScreen.tsx` with all sections
- Components:
  - `SettingsSection.tsx` with toggles and sliders
  - `DataManagementSection.tsx` with actions
  - `ConfirmationModal.tsx` for destructive actions
- API routes for profile and settings operations
- Settings service for global access
- Data export/import utilities
- Progress reset service
- Tests for settings persistence and data operations

## Acceptance Criteria
- User info displays correctly
- Audio toggle affects flashcard audio immediately
- Daily goal slider updates and persists (5-50 range)
- Reset progress shows confirmation modal
- Reset progress clears all user data except account
- Export data downloads complete JSON file
- Import data validates and applies successfully
- App version displays correctly
- All settings persist after app restart
- Settings sync across devices (when logged in)
- Typecheck and lint pass

## Dependencies
- T004 (user authentication and profile)
- T009 (audio system integration)
- T008 (daily goal integration with dashboard)
