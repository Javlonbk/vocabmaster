# T009 — Flashcard UI & Audio

## Goal
Implement interactive flashcard component with flip animations, swipe gestures, and audio pronunciation.

## Scope
- Enhanced flashcard component with:
  - Front side: word, phonetic transcription, part of speech, level/topic badges
  - Back side: definition, example sentence (word highlighted), translation slot
  - Smooth flip animation (tap or button)
  - Swipe gestures:
    - Swipe right: "I know this" → mark as Known
    - Swipe left: "Still learning" → keep in Learning queue
  - Audio play button with TTS integration
  - Progress indicator (card X of Y)
  - Visual feedback during interactions
- Audio playback system:
  - Text-to-Speech API integration (Web Speech API or external TTS service)
  - Audio file support for pre-recorded pronunciations
  - Settings toggle for audio enable/disable
  - Visual feedback during playback (animated icon)
- Design components:
  - `Flashcard.tsx` with flip/swipe logic
  - `AudioButton.tsx` reusable audio player
  - `LevelBadge.tsx` for CEFR level display
  - `PartOfSpeechTag.tsx` for word type display

## Requirements
- Animations must be smooth (60fps on device)
- Swipe gestures should have clear visual feedback
- Audio must work with/without internet (cache/TTS fallback)
- Follow MOBILE_UI_SPEC.md design system (soft blue, rounded cards)
- Support both gesture and button interactions for accessibility
- Phonetic transcription must display in IPA format

## Deliverables
- `Flashcard.tsx` with flip/swipe animations
- `AudioButton.tsx` with TTS integration
- Audio playback service/utility
- Badge components for level and topic
- Swipe gesture handlers
- Audio settings integration
- Tests for flashcard state transitions
- Audio playback tests (mocked)

## Acceptance Criteria
- Flashcard flips smoothly on tap
- Swipe left/right triggers correct actions with visual feedback
- Audio plays word pronunciation when button pressed
- Progress indicator shows current position
- Level and topic badges display correctly
- Audio can be disabled in settings
- Works in offline mode (TTS fallback)
- Animations are smooth on target devices
- Accessible via buttons for non-swipe users
- Typecheck and lint pass

## Dependencies
- T006 (learning session screen)
- T014 (settings for audio toggle)
