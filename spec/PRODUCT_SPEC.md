# VocabMaster - Mobile Product Specification

## Overview

VocabMaster is a React Native (Expo) mobile application for structured English vocabulary learning based on CEFR levels (A1-C2). The app provides flashcard-based learning, spaced repetition, interactive exercises, reading passages, and comprehensive progress tracking.

**Platform**: iOS & Android (React Native with Expo SDK 54)
**Backend**: Node.js REST API with PostgreSQL
**Target Users**: Adult English learners at all proficiency levels

---

## Core Features

### 1. Authentication
- Email/password signup and login
- JWT bearer token authentication
- Secure password hashing (bcrypt)
- Session persistence

### 2. Onboarding & Level Selection
- First-time user welcome experience
- Adaptive placement test (10-15 questions)
- Manual CEFR level selection (A1-C2)
- Onboarding completion tracking (AsyncStorage)

### 3. Word Learning (Flashcards)
- Session-based learning with configurable word count
- Flashcard UI with word, phonetic, definition, example
- Three-state classification: Known / Learning / Forgotten
- Topic-based filtering
- Text-to-speech audio playback (expo-speech)
- Session summary with progress breakdown

### 4. Review System
- **Forgotten Queue**: Review previously marked forgotten words
- **Spaced Repetition**: Due-based review with intervals (1/3/7/14/30/90 days)
- **Review Exercises**:
  - Multiple choice (definition matching)
  - Fill-in-blank (sentence completion)
  - Immediate feedback with correct/incorrect indication
- Adaptive ease factor adjustments based on performance

### 5. Reading Mode
- Interactive reading passages tagged with vocabulary
- Tap-to-define functionality with inline popups
- Progress tracking (completion percentage)
- Bookmarking system
- Filter by CEFR level
- Vocabulary list view with quick actions
- Offline caching (AsyncStorage)

### 6. Topic-Based Learning
- 12+ curated topics (Travel, Business, Daily Life, Food, etc.)
- Topic browser with search and cards
- Topic-specific learning sessions
- Progress tracking per topic

### 7. Favorites System
- Bookmark words for quick access
- Favorites screen with search/sort
- Toggle favorites from flashcards and exercises
- Persistent storage (AsyncStorage)

### 8. Search & Advanced Filtering
- Full-text word search
- Multi-filter support:
  - CEFR level
  - Topic
  - Mastery status (learning/mastered/forgotten)
  - Part of speech
- Sorting options (alphabetical, frequency, date learned)
- Quick actions from search results
- Offline result caching

### 9. Statistics & Analytics
- **Overview Cards**: total words, learning, mastered, to review
- **Progress Charts**: learning over time
- **Accuracy by Level**: performance visualization
- **Topic Distribution**: completion breakdown
- **Streak Tracking**: daily study streak with 🔥 indicator
- Due review count for spaced repetition

### 10. Profile & Settings
- User info display
- Settings persistence:
  - Audio enabled toggle
  - Daily goal (words per day)
  - Notifications preferences
- Reset progress with confirmation
- Data management

---

## Data Models

### VocabularyWord
```typescript
{
  id: number
  word: string
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'
  phonetic: string
  definition: string
  exampleSentence: string
  topic: string
  partOfSpeech: string
  frequency?: number
}
```

### UserWordState
```typescript
{
  wordId: number
  state: 'LEARNING' | 'KNOWN' | 'FORGOTTEN'
  reviewInterval?: number
  nextReviewDate?: Date
  easeFactor?: number
  consecutiveCorrect?: number
}
```

### ReadingPassage
```typescript
{
  id: number
  title: string
  content: string
  level: CefrLevel
  topic: string
  vocabularyTags: string[] // Word IDs in passage
  estimatedMinutes: number
}
```

### ProgressStats
```typescript
{
  totalWords: number
  knownWords: number
  learningWords: number
  forgottenWords: number
  masteredWords: number
  targetLevel: CefrLevel | null
  progressByLevel: {
    [level: string]: { learned: number; total: number }
  }
  progressByTopic: {
    [topic: string]: { learned: number; total: number }
  }
}
```

---

## API Endpoints

### Authentication (`/v1/auth`)
- `POST /signup` - Create new user account
- `POST /login` - Authenticate and receive JWT token

### Learning (`/v1/learning`)
- `GET /target-level` - Get user's selected CEFR level
- `PUT /target-level` - Update target level
- `GET /session/words?count=20&topic=Travel` - Fetch learning session words
- `PATCH /words/:wordId/state` - Update word state (known/learning/forgotten)
- `GET /review/forgotten?count=20` - Fetch forgotten words queue
- `GET /review/queue?count=20` - Fetch due review words (spaced repetition)
- `GET /review/due-count` - Get count of words due for review
- `GET /progress` - Fetch comprehensive progress statistics

### Reading (`/v1/reading`)
- `GET /passages?level=B1&limit=10` - List reading passages
- `GET /passages/:passageId` - Get passage details
- `PUT /passages/:passageId/progress` - Update reading progress
- `POST /passages/:passageId/bookmark` - Toggle bookmark
- `POST /words/:wordId/learned` - Mark word as learned from reading

### Search (`/v1/search`)
- `GET /search?q=word&level=B1&topic=Travel&mastery=learning&sort=alpha` - Search with filters
- `GET /filters` - Get available filter options

---

## Mobile Screens

### Authentication Flow
1. **LoginScreen** - Email/password login
2. **SignupScreen** - New user registration

### Onboarding Flow
3. **OnboardingScreen** - Welcome and feature introduction (soft gradient background)
4. **PlacementTestScreen** - Adaptive level assessment (optional)
5. **LevelSelectScreen** - Manual CEFR level selection

### Main App Screens
6. **HomeScreen** - Dashboard with stats, streak, quick actions, topic progress
7. **SessionScreen** - Flashcard learning interface
8. **SessionSummaryScreen** - Post-session results breakdown
9. **ReviewForgottenScreen** - Review forgotten words flashcards
10. **ReviewExercisesScreen** - Multiple choice and fill-in-blank exercises
11. **TopicBrowserScreen** - Topic selection grid with search
12. **ReadingLibraryScreen** - List of reading passages
13. **ReadingScreen** - Interactive reading with tap-to-define
14. **FavoritesScreen** - Bookmarked words list
15. **SearchScreen** - Advanced search with filters
16. **StatsScreen** - Detailed analytics and charts
17. **ProfileScreen** - Settings and user management

---

## User Flows

### First-Time User
1. Open app → **OnboardingScreen**
2. Click "Get Started" → **PlacementTestScreen** or **LevelSelectScreen**
3. Complete placement test (adaptive 10-15 questions) OR select level manually
4. Navigate to **HomeScreen**
5. Click "Start Learning" → **SessionScreen** (flashcards)
6. Complete session → **SessionSummaryScreen**
7. Return to **HomeScreen** with updated progress

### Daily Learning Session
1. Open app → **HomeScreen** (skip onboarding)
2. View current streak 🔥 and progress stats
3. Options:
   - **Continue Learning** → New words flashcards
   - **Review Due Words** → Spaced repetition exercises
   - **Browse Topics** → Topic-specific sessions
   - **Read Passages** → Interactive reading
4. Complete activity → Update streak and progress
5. Return to dashboard

### Review Flow (Spaced Repetition)
1. **HomeScreen** → See "X words to review"
2. Click "Review" → **ReviewExercisesScreen**
3. Answer multiple choice or fill-in-blank questions
4. Receive immediate feedback (correct/incorrect)
5. View results summary
6. Words answered correctly → Schedule next review
7. Incorrect words → Shortened interval or marked forgotten

### Reading Mode Flow
1. **HomeScreen** → **ReadingLibraryScreen**
2. Filter by level and browse passages
3. Select passage → **ReadingScreen**
4. Tap highlighted word → Popup with definition
5. Quick actions: Mark learned, Add to favorites, Hear pronunciation
6. Complete reading → Progress saved
7. Bookmark for later if needed

---

## Technical Implementation

### Frontend Stack
- **Framework**: React Native 0.81.5
- **Runtime**: Expo SDK 54
- **Language**: TypeScript 5.9
- **State Management**: React hooks + Context API (minimal)
- **Storage**: @react-native-async-storage/async-storage
- **Audio**: expo-speech (text-to-speech)
- **UI**: expo-linear-gradient for backgrounds

### Backend Stack
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Auth**: JWT tokens with bcryptjs
- **Validation**: Zod schemas (shared package)
- **Testing**: Node test runner with supertest

### Monorepo Structure
```
apps/
  mobile/          # React Native app
  api/             # Node.js backend
packages/
  shared/          # Zod schemas, shared types
```

### Key Storage Keys (AsyncStorage)
- `vocabmaster:onboarding-completed` - Boolean
- `vocabmaster:favorites` - Array of word IDs
- `vocabmaster:streak` - Streak data object
- `vocabmaster:settings` - User preferences
- `vocabmaster:reading-cache-{id}` - Cached passages
- `vocabmaster:search-cache-{hash}` - Search results

### API Error Format
```json
{
  "error": {
    "code": "INVALID_INPUT",
    "message": "Human-readable error message",
    "details": { /* optional */ }
  }
}
```

---

## Spaced Repetition Algorithm

### Review Intervals
- First review: 1 day
- Second review: 3 days
- Third review: 7 days
- Fourth review: 14 days
- Fifth review: 30 days
- Sixth review: 90 days

### Ease Factor Adjustments
- **Correct answer**: Increase ease factor (max 2.5)
- **Incorrect answer**: Decrease ease factor (min 1.3), reset interval
- **Consecutive correct**: Increase interval multiplier

### Priority Queue
Words are queued for review when `nextReviewDate <= currentDate`, sorted by:
1. Forgotten words (highest priority)
2. Overdue words (past due date)
3. Due today
4. New words never reviewed

---

## Design Principles

### Visual Style
- Clean, minimal interface
- Soft blue primary color (#3B82F6)
- Rounded cards and smooth shadows
- Gradient backgrounds for onboarding
- Professional EdTech aesthetic

### Typography
- System fonts for cross-platform consistency
- Clear hierarchy (headings, body, labels)
- Adequate font sizes for readability

### Interactions
- Tap-to-flip flashcards
- Swipe gestures for quick actions
- Immediate feedback on user actions
- Smooth animations and transitions
- Loading states for async operations

### Accessibility
- Adequate color contrast
- Touch target sizes (minimum 44x44 points)
- Screen reader support (future enhancement)
- Clear visual feedback

---

## Feature Priority (Implemented)

### ✅ Foundation (T001-T006)
- Monorepo setup
- Shared schemas and types
- Database schema and migrations
- Auth API and mobile flows
- Basic word learning MVP

### ✅ Core UX (T007-T010)
- Onboarding and placement test
- Enhanced dashboard with streak tracking
- Flashcard UI with audio (TTS)
- Exercise types (multiple choice, fill-in-blank)

### ✅ Feature Richness (T011-T014)
- Topic-based learning
- Favorites system
- Statistics and analytics
- Profile and settings

### ✅ Advanced Features (T015-T018)
- Spaced repetition scheduling
- Reading mode with interactive passages
- Vocabulary data seeding (60+ words across levels/topics)
- Search with advanced filtering

---

## Future Enhancements

### Phase 2 (Post-MVP)
- Speech recognition for pronunciation practice
- Image associations for better memory retention
- Expanded vocabulary database (1000+ words)
- Custom word lists (user-created)
- Offline mode with full data sync
- Achievement badges and gamification

### Phase 3 (Advanced)
- Social features (share progress, compete with friends)
- AI-powered personalized learning paths
- Video lessons and native speaker interviews
- Premium content subscription
- Multi-language support (learn from other languages)

---

## Success Metrics

### MVP Goals
- ✅ User can complete signup/login
- ✅ User can select or test into a CEFR level
- ✅ User can learn words via flashcards
- ✅ User can review words with exercises
- ✅ User can track progress and streak
- ✅ User can read interactive passages
- ✅ User can search and filter vocabulary
- ✅ Progress persists across sessions

### Quality Benchmarks
- Fast app launch (<3 seconds)
- Smooth animations (60fps)
- Responsive UI (no blocking operations)
- No crashes or critical errors
- Data persistence reliability
- Intuitive navigation

---

**Document Version**: 2.0  
**Last Updated**: February 24, 2026  
**Implementation Status**: MVP Complete (T001-T018)
