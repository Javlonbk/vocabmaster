# T016 — Reading Mode

## Goal
Enable contextual vocabulary learning through interactive reading passages with tap-to-define functionality.

## Scope
- Reading mode screen:
  - Display reading passages with highlighted vocabulary words
  - Tap word to see definition popup/modal
  - Audio playback for entire passage (TTS)
  - Progress indicator (how much read)
  - Vocabulary list sidebar/drawer
  - Bookmark passage for later
- Reading passage library:
  - Browse passages by CEFR level
  - Filter by topic
  - Show estimated reading time
  - Display difficulty level
  - Search passages by title/keywords
- Interactive word popup:
  - Word definition
  - Example sentence
  - Phonetic pronunciation
  - Audio play button
  - "Mark as Learned" button
  - "Add to Favorites" button
- Passage creation format:
  - HTML/Markdown with tagged vocabulary words
  - Auto-highlight words from user's target level
  - Support for embedded images (optional)
- API endpoints:
  - Get reading passages (filtered by level/topic)
  - Get passage by ID with highlighted words
  - Track reading progress
  - Mark words as learned from reading context

## Requirements
- Minimum 10 reading passages covering A1-C2 levels
- Passages should be engaging and age-appropriate for adult learners
- Vocabulary highlighting should be visually subtle but clear
- Definition popup must not obstruct reading flow
- Audio playback quality must be clear
- Follow MOBILE_UI_SPEC.md design for reading interface
- Support offline reading (cached passages)

## Deliverables
- Screens:
  - `ReadingLibraryScreen.tsx` for browsing passages
  - `ReadingScreen.tsx` for reading view
- Components:
  - `ReadingPassage.tsx` with highlighted words
  - `WordDefinitionPopup.tsx` for tap interactions
  - `ReadingControls.tsx` (audio, progress, bookmark)
- Reading passage data structure and seeds (10+ passages)
- Word highlighting algorithm
- Tap detection and popup positioning logic
- TTS integration for passage audio
- Database schema for passages and reading progress
- API routes for passage operations
- Tests for word highlighting and tap interactions

## Acceptance Criteria
- User can browse reading passages by level/topic
- Passages display with vocabulary words highlighted
- Tapping a word shows definition popup
- Popup includes word info and actions (learn, favorite, audio)
- Audio plays full passage with TTS
- Reading progress tracks per passage
- Can bookmark passages for later
- Works offline with cached passages
- Popup positioning adapts to screen edges
- Typecheck and lint pass

## Dependencies
- T006 (word state tracking)
- T009 (audio system)
- T011 (topic organization)
- T012 (favorites system)
