# Ticket Roadmap

This document outlines the implementation sequence for VocabMaster features.

## ✅ Completed (Foundation MVP)
- **T001** — Foundation Setup
- **T002** — Shared Schemas & Types
- **T003** — Database Schema (Prisma)
- **T004** — Auth API (Email)
- **T005** — Mobile Auth Flow
- **T006** — Word Learning MVP

## 🎯 High Priority (Core UX Enhancement)
Build these to deliver a polished, competitive product:

- **T007** — Onboarding & Placement Test
  - First-time user experience
  - Adaptive level assessment
  - Dependencies: T005, T006
  
- **T008** — Enhanced Dashboard & Progress
  - Streak tracking (🔥 days)
  - Stats cards and quick actions
  - Activity charts
  - Dependencies: T006, T011

- **T009** — Flashcard UI & Audio
  - Flip animations and swipe gestures
  - TTS audio integration
  - Visual polish
  - Dependencies: T006, T014

- **T010** — Exercise Types
  - Multiple choice questions
  - Fill-in-the-blank
  - Immediate feedback & scoring
  - Dependencies: T006, T017

## 📊 Medium Priority (Feature Richness)
Add these for a comprehensive learning platform:

- **T011** — Topic-Based Learning
  - 12+ topics with icons
  - Topic browser and filtering
  - Topic-specific sessions
  - Dependencies: T006, T017

- **T012** — Favorites System
  - Bookmark words
  - Favorites screen with search/filter
  - Quick access everywhere
  - Dependencies: T006, T009

- **T013** — Statistics & Analytics
  - Comprehensive charts and graphs
  - Activity heatmap
  - Detailed breakdowns
  - Dependencies: T006, T008, T011

- **T014** — Profile & Settings
  - User preferences
  - Audio/goal settings
  - Data export/import
  - Dependencies: T004, T008, T009

## 🚀 Lower Priority (Advanced Features)
Enhance after core features are stable:

- **T015** — Spaced Repetition Algorithm
  - Intelligent review scheduling
  - Adaptive intervals based on performance
  - Dependencies: T006, T010, T008

- **T016** — Reading Mode
  - Interactive reading passages
  - Contextual learning
  - Tap-to-define
  - Dependencies: T006, T009, T011, T012

- **T017** — Vocabulary Data Seeding
  - 200-500+ quality words
  - All CEFR levels and topics
  - Professional definitions
  - Dependencies: T003, T011
  - **Note**: Can be started anytime; critical for quality

- **T018** — Search & Advanced Filtering
  - Global search
  - Multi-filter combinations
  - Complex queries
  - Dependencies: T006, T011, T017

## 📋 Recommended Implementation Sequence

### Phase 1: Foundation (Completed ✅)
T001 → T002 → T003 → T004 → T005 → T006

### Phase 2: Core UX Polish
**Start with:** T017 (vocabulary data - can run in parallel)  
**Then:** T007 → T009 → T008 → T010

### Phase 3: Feature Expansion
T011 → T012 → T014 → T013

### Phase 4: Advanced Features
T015 → T018 → T016

## 🎓 Notes

- **T017 (Vocabulary Data)** is critical and can be started early in parallel with other tickets
- **T008** depends on T011 for topic progress, but can implement dashboard basics without it
- **T015 (Spaced Repetition)** enhances T006's basic review, but not blocking for other features
- **T016 (Reading Mode)** is independent and can be built anytime after foundation

## 🔄 Iterative Development

After completing Phase 2, you'll have a competitive vocabulary app with:
- ✨ Professional onboarding
- 🎴 Interactive flashcards with audio
- 📊 Progress tracking and streaks
- 🎯 Multiple exercise types
- 💪 Word mastery system

Each subsequent phase adds significant value but isn't blocking for core functionality.
