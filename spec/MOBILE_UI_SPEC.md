# Vocabulary Learning App - Technical Specification

## Project Overview

A modern, mobile-first vocabulary learning application for English learners based on CEFR levels (A1-C2). The app provides structured learning paths, interactive exercises, progress tracking, and gamification elements to enhance vocabulary acquisition.

**Target Audience**: Adult English learners seeking a professional, effective vocabulary learning experience

**Design Philosophy**: Modern, minimal, light theme with soft blue accents, rounded cards, and premium EdTech aesthetic - more mature and professional than Duolingo

---

## Data Structures

### VocabularyWord
```typescript
interface VocabularyWord {
  id: string;                    // Unique identifier
  word: string;                  // The English word
  phonetic: string;              // IPA pronunciation (e.g., "/həˈloʊ/")
  audio: string;                 // Audio file URL or TTS command
  definition: string;            // Clear, concise definition
  example: string;               // Example sentence using the word
  level: CEFRLevel;              // A1, A2, B1, B2, C1, C2
  topic: string;                 // e.g., "Travel", "Business", "Daily Life"
  partOfSpeech: PartOfSpeech;    // noun, verb, adjective, etc.
}

type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
type PartOfSpeech = 'noun' | 'verb' | 'adjective' | 'adverb' | 'preposition' | 'conjunction' | 'interjection';
```

### User Progress
```typescript
interface UserProgress {
  selectedLevel: CEFRLevel | null;
  completedPlacementTest: boolean;
  currentStreak: number;
  lastStudyDate: string;           // ISO date string
  totalWordsLearned: number;
  
  // Word-level tracking
  learnedWords: string[];          // Array of word IDs
  reviewedWords: string[];         // Array of word IDs
  favoriteWords: string[];         // Array of word IDs
  masteredWords: string[];         // Array of word IDs (100% accuracy)
  
  // Topic progress
  topicProgress: {
    [topic: string]: {
      total: number;
      learned: number;
      mastered: number;
    };
  };
  
  // Performance metrics
  accuracyByLevel: {
    [level in CEFRLevel]: number;  // Percentage
  };
  
  // Exercise history
  exerciseHistory: ExerciseResult[];
}

interface ExerciseResult {
  wordId: string;
  exerciseType: 'multiple-choice' | 'fill-in-blank' | 'flashcard';
  correct: boolean;
  timestamp: string;
  timeSpent: number;               // Milliseconds
}
```

### App Settings
```typescript
interface AppSettings {
  audioEnabled: boolean;
  dailyGoal: number;               // Words per day
  notifications: boolean;
  theme: 'light' | 'dark';         // Future: currently light only
}
```

---

## Screen Specifications

### 1. Onboarding Screen (`/onboarding`)
**Purpose**: Welcome new users and explain app benefits

**Components**:
- Hero section with app logo/illustration
- 3-4 feature highlights (flashcards, progress tracking, CEFR-based, etc.)
- "Get Started" CTA button
- Clean, inspiring design with soft gradients

**User Flow**: 
- First-time users → Onboarding
- Returning users → Skip to Dashboard or last screen

---

### 2. Level Selection (`/level-selection`)
**Purpose**: Let users choose their CEFR level or take a placement test

**Components**:
- CEFR level cards (A1-C2) with descriptions
  - A1: Beginner (Basic words and phrases)
  - A2: Elementary (Everyday expressions)
  - B1: Intermediate (Familiar topics)
  - B2: Upper Intermediate (Complex text)
  - C1: Advanced (Implicit meaning)
  - C2: Proficient (Native-like fluency)
- "Take Placement Test" button (prominent)
- Visual indicators showing difficulty progression

**Interactions**:
- Select level → Navigate to Dashboard
- Take test → Navigate to Placement Test

---

### 3. Placement Test (`/placement-test`)
**Purpose**: Assess user's vocabulary level through progressive testing

**Components**:
- Progress indicator (question X of Y)
- Question card with multiple choice options
- Navigation buttons (Next/Previous)
- Exit option with warning modal

**Logic**:
- Start with B1 level questions
- Adaptive difficulty based on performance
- 10-15 questions total
- Calculate final level based on accuracy
- Redirect to Dashboard with recommended level

**Question Format**:
```typescript
interface PlacementQuestion {
  word: string;
  question: string;
  options: string[];
  correctAnswer: number;
  level: CEFRLevel;
}
```

---

### 4. Dashboard (`/dashboard`)
**Purpose**: Central hub showing progress, streaks, and quick actions

**Layout Sections**:

#### Header
- Welcome message with user level
- Current streak (🔥 X days)
- Date/time

#### Stats Cards (Grid)
- Total words learned
- Words to review
- Mastered words
- Current level progress

#### Quick Actions
- Continue Learning (primary button)
- Review Words
- Browse Topics
- Favorites

#### Progress Chart
- Daily/Weekly learning activity
- Line or bar chart showing words learned over time

#### Topic Progress List
- Topic cards with progress bars
- Click to view topic-specific words

**Navigation**:
- Floating action button for quick learning
- Bottom navigation (Dashboard, Learn, Review, Stats, Profile)

---

### 5. Word Learning / Flashcard Screen (`/learn`)
**Purpose**: Present new vocabulary words in flashcard format

**Components**:

#### Flashcard Component
**Front Side**:
- Word in large, clear typography
- Phonetic transcription below
- Audio play button
- Part of speech tag
- Level & topic badges

**Back Side**:
- Definition
- Example sentence (word highlighted)
- Audio play button for word
- Translation option (future)

#### Controls
- Swipe or button to flip card
- "I know this" / "Still learning" buttons
- Progress indicator (card X of Y)
- Exit button

**Interactions**:
- Tap to flip card
- Swipe left: Still learning (show again)
- Swipe right: I know this (mark as learned)
- Audio plays word pronunciation
- Auto-advance after marking

**Data Flow**:
- Load words from selected level/topic
- Filter out already mastered words
- Randomize order
- Track completion in context

---

### 6. Review Screen (`/review`)
**Purpose**: Reinforce learned vocabulary through exercises

**Exercise Types**:

#### Multiple Choice
- Question: "What does [word] mean?"
- 4 definition options
- Immediate feedback (green/red)
- Explanation on wrong answer

#### Fill in the Blank
- Sentence with missing word
- Input field or word bank
- Letter hints option
- Check answer button

#### Matching (future enhancement)
- Match words to definitions
- Drag and drop interface

**Components**:
- Exercise type selector (tabs)
- Question card
- Answer options/input
- Feedback panel
- Progress tracker
- Results summary after completion

**Scoring**:
- Track correct/incorrect answers
- Calculate accuracy percentage
- Update word mastery levels
- Show encouraging messages

---

### 7. Reading Mode (`/reading`)
**Purpose**: Learn vocabulary in context through interactive passages

**Components**:
- Reading passage with highlighted vocabulary words
- Tap word to see definition popup
- Audio playback for passage
- Vocabulary list sidebar
- Difficulty filter (by CEFR level)

**Passage Format**:
```typescript
interface ReadingPassage {
  id: string;
  title: string;
  content: string;              // HTML with <vocab> tags
  level: CEFRLevel;
  topic: string;
  vocabularyWords: string[];    // Word IDs in passage
  estimatedTime: number;        // Minutes
}
```

**Interactions**:
- Tap highlighted word → Definition popup appears
- Play audio → TTS reads entire passage
- Mark words as learned from popup
- Save passage for later

---

### 8. Statistics Screen (`/stats`)
**Purpose**: Comprehensive progress visualization and insights

**Sections**:

#### Overview Cards
- Total study time
- Total words learned
- Current streak
- Best streak
- Average accuracy

#### Charts & Graphs
1. **Learning Progress Chart**
   - Line chart: Words learned over time
   - Timeframe selector (Week/Month/Year)

2. **Accuracy by Level**
   - Bar chart: Performance across CEFR levels
   - Color-coded by proficiency

3. **Topic Distribution**
   - Pie/donut chart: Words learned by topic
   - Tap segment to view topic details

4. **Activity Heatmap**
   - Calendar view showing daily activity
   - Color intensity = words learned

#### Detailed Metrics Table
- Words by level breakdown
- Words by topic breakdown
- Mastery percentage
- Average time per word

**Export Options** (future):
- Download progress report
- Share achievements

---

### 9. Profile / Settings (`/profile`)
**Purpose**: User preferences and account management

**Sections**:

#### User Info
- Display name
- Email (future)
- Selected CEFR level
- Member since date

#### Settings
- Audio enabled toggle
- Daily goal slider (5-50 words)
- Notification preferences
- Theme selection (future)

#### Data Management
- Reset progress (with confirmation)
- Export data
- Import data from CSV

#### About
- App version
- Tutorial/Help
- Privacy policy
- Contact support

---

### 10. Favorites (`/favorites`)
**Purpose**: Quick access to bookmarked words

**Components**:
- List of favorited words
- Search/filter functionality
- Sort options (alphabetical, level, date added)
- Word cards (same as learning screen)
- Unfavorite action

---

### 11. Topic Browser (`/topics`)
**Purpose**: Explore and select topic-based learning

**Components**:
- Topic cards grid
- Each card shows:
  - Topic name and icon
  - Word count
  - Progress percentage
  - Level distribution
- Filter by CEFR level
- Search topics

**Topics** (suggested):
- Daily Life
- Travel & Transportation
- Food & Dining
- Business & Work
- Education
- Health & Medicine
- Technology
- Arts & Culture
- Nature & Environment
- Sports & Hobbies
- Emotions & Feelings
- Time & Dates

---

## Component Architecture

### Layout Components

#### `AppLayout.tsx`
- Wraps all screens
- Contains navigation bar (mobile bottom nav or sidebar)
- Handles responsive layout

#### `BottomNav.tsx`
- 5 tabs: Dashboard, Learn, Review, Stats, Profile
- Active state indication
- Icons from lucide-react

### Shared Components

#### `WordCard.tsx`
```typescript
interface WordCardProps {
  word: VocabularyWord;
  showActions?: boolean;
  onFavorite?: () => void;
  onAudioPlay?: () => void;
  variant?: 'full' | 'compact' | 'list';
}
```

#### `ProgressBar.tsx`
```typescript
interface ProgressBarProps {
  current: number;
  total: number;
  color?: string;
  showLabel?: boolean;
  height?: 'sm' | 'md' | 'lg';
}
```

#### `StatCard.tsx`
```typescript
interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
}
```

#### `LevelBadge.tsx`
```typescript
interface LevelBadgeProps {
  level: CEFRLevel;
  size?: 'sm' | 'md' | 'lg';
}
```

#### `AudioButton.tsx`
```typescript
interface AudioButtonProps {
  audioUrl: string;
  word: string;
  autoPlay?: boolean;
  size?: 'sm' | 'md' | 'lg';
}
```

#### `Flashcard.tsx`
```typescript
interface FlashcardProps {
  word: VocabularyWord;
  isFlipped: boolean;
  onFlip: () => void;
  onKnow: () => void;
  onLearning: () => void;
}
```

#### `ExerciseCard.tsx`
```typescript
interface ExerciseCardProps {
  question: string;
  options: string[];
  correctAnswer: number;
  onAnswer: (index: number) => void;
  showFeedback: boolean;
}
```

---

## State Management (Context API)

### AppContext Structure

```typescript
interface AppContextType {
  // User state
  userProgress: UserProgress;
  settings: AppSettings;
  
  // Vocabulary data
  allWords: VocabularyWord[];
  filteredWords: VocabularyWord[];
  
  // Actions
  setSelectedLevel: (level: CEFRLevel) => void;
  markWordAsLearned: (wordId: string) => void;
  markWordAsReviewed: (wordId: string) => void;
  toggleFavorite: (wordId: string) => void;
  recordExerciseResult: (result: ExerciseResult) => void;
  updateStreak: () => void;
  resetProgress: () => void;
  
  // Filtering
  filterByLevel: (level: CEFRLevel) => void;
  filterByTopic: (topic: string) => void;
  searchWords: (query: string) => void;
  
  // Settings
  updateSettings: (settings: Partial<AppSettings>) => void;
  
  // Audio
  playWordAudio: (word: string, audioUrl?: string) => void;
}
```

### localStorage Keys
- `vocab_app_progress` - User progress data
- `vocab_app_settings` - App settings
- `vocab_app_words` - Custom/imported words (future)

---

## Design System

### Color Palette

#### Primary Colors
```css
--color-primary: #3B82F6;       /* Soft blue */
--color-primary-light: #60A5FA;
--color-primary-dark: #2563EB;
--color-primary-bg: #EFF6FF;    /* Very light blue background */
```

#### Secondary Colors
```css
--color-success: #10B981;       /* Green for correct answers */
--color-error: #EF4444;         /* Red for incorrect */
--color-warning: #F59E0B;       /* Orange for warnings */
--color-info: #6366F1;          /* Indigo for info */
```

#### Neutral Colors
```css
--color-gray-50: #F9FAFB;
--color-gray-100: #F3F4F6;
--color-gray-200: #E5E7EB;
--color-gray-300: #D1D5DB;
--color-gray-400: #9CA3AF;
--color-gray-500: #6B7280;
--color-gray-600: #4B5563;
--color-gray-700: #374151;
--color-gray-800: #1F2937;
--color-gray-900: #111827;
```

### Typography

#### Font Family
```css
--font-sans: system-ui, -apple-system, sans-serif;
--font-display: 'Inter', system-ui, sans-serif;  /* Optional: Import via Google Fonts */
```

#### Font Sizes
- Headings: Use default Tailwind (text-3xl, text-2xl, text-xl, text-lg)
- Body: text-base (16px)
- Small: text-sm (14px)
- Extra small: text-xs (12px)

#### Font Weights
- Regular: font-normal (400)
- Medium: font-medium (500)
- Semibold: font-semibold (600)
- Bold: font-bold (700)

### Spacing
- Use Tailwind spacing scale (0.25rem increments)
- Common gaps: gap-2, gap-4, gap-6
- Common padding: p-4, p-6, p-8
- Common margin: mb-4, mb-6, mb-8

### Border Radius
- Small: rounded-md (0.375rem)
- Medium: rounded-lg (0.5rem)
- Large: rounded-xl (0.75rem)
- Cards: rounded-2xl (1rem)
- Pills: rounded-full

### Shadows
- Small: shadow-sm
- Medium: shadow-md
- Large: shadow-lg
- Cards: shadow-md with hover:shadow-lg

### Animations
```css
/* Smooth transitions */
transition-all duration-200 ease-in-out

/* Hover effects */
hover:scale-105 transition-transform

/* Loading states */
animate-pulse
```

---

## Routing Structure

### Route Configuration
```typescript
// /src/app/routes.ts
const router = createBrowserRouter([
  {
    path: "/",
    Component: AppLayout,
    children: [
      { index: true, Component: Dashboard },
      { path: "onboarding", Component: Onboarding },
      { path: "level-selection", Component: LevelSelection },
      { path: "placement-test", Component: PlacementTest },
      { path: "dashboard", Component: Dashboard },
      { path: "learn", Component: LearnScreen },
      { path: "learn/:topic", Component: LearnScreen },
      { path: "review", Component: ReviewScreen },
      { path: "reading", Component: ReadingScreen },
      { path: "reading/:passageId", Component: ReadingDetail },
      { path: "stats", Component: StatsScreen },
      { path: "profile", Component: ProfileScreen },
      { path: "favorites", Component: FavoritesScreen },
      { path: "topics", Component: TopicBrowser },
      { path: "topics/:topicName", Component: TopicDetail },
      { path: "*", Component: NotFound },
    ],
  },
]);
```

### Navigation Guards
```typescript
// Redirect to onboarding if first visit
// Redirect to level selection if no level chosen
// Redirect to dashboard if placement test completed
```

---

## Features & Functionality

### 1. Daily Streak Tracking
- Increment streak when user studies (learns or reviews words)
- Reset streak if more than 24 hours pass
- Visual streak indicator (🔥 icon with number)
- Encourage messages for milestones (7, 30, 100 days)

### 2. Spaced Repetition (Simple)
- Words reviewed at intervals: 1 day, 3 days, 7 days, 14 days, 30 days
- Based on last reviewed date
- "Words to Review" count on dashboard
- Priority sorting in review screen

### 3. Audio Playback
- Play button on word cards
- Text-to-Speech API or pre-recorded audio
- Visual feedback during playback
- Settings toggle to enable/disable

### 4. Favorites System
- Heart icon on word cards
- Toggle favorite status
- Dedicated favorites screen
- Quick access from dashboard

### 5. Progress Tracking
- Words learned (exposed to word, marked as learned)
- Words reviewed (practiced in exercises)
- Words mastered (90%+ accuracy in exercises)
- Topic-based progress percentages

### 6. Gamification Elements
- Daily goals (customizable)
- Achievement badges (future)
- Leaderboards (future - requires backend)
- Reward animations for milestones

### 7. Search & Filtering
- Search words by text
- Filter by CEFR level
- Filter by topic
- Filter by part of speech
- Sort by alphabetical, level, date learned

### 8. Data Import/Export
- Import words from CSV
- Export progress as JSON
- Backup and restore functionality

---

## Mock Data Requirements

### Sample Vocabulary Dataset
Minimum 200 words covering:
- All CEFR levels (A1-C2)
- 10+ topics
- Various parts of speech
- Real definitions and example sentences

### CSV Structure
```csv
word,phonetic,audio,definition,example,level,topic,partOfSpeech
hello,/həˈloʊ/,tts:hello,A greeting or expression of goodwill,"Hello, how are you?",A1,Daily Life,interjection
restaurant,/ˈrɛstərɑnt/,tts:restaurant,A place where people pay to eat meals,"Let's meet at the restaurant.",A2,Food & Dining,noun
```

### Sample Topics Data
```typescript
const topics = [
  { name: "Daily Life", icon: "Home", wordCount: 150 },
  { name: "Travel", icon: "Plane", wordCount: 120 },
  { name: "Business", icon: "Briefcase", wordCount: 100 },
  // ... etc
];
```

---

## User Flows

### First-Time User Flow
1. Land on app → Onboarding screen
2. Read features → Click "Get Started"
3. Choose: Select level OR Take placement test
4. (If test) Complete 10-15 questions → Get recommended level
5. Arrive at Dashboard
6. Click "Start Learning" → Flashcard screen
7. Learn 5-10 words → Return to dashboard
8. See updated progress

### Returning User Flow
1. Open app → Dashboard (skip onboarding)
2. See streak and progress
3. Options:
   - Continue learning (new words)
   - Review words (spaced repetition)
   - Browse topics
   - Check statistics
4. Complete session
5. See updated stats and streak

### Learning Session Flow
1. Select topic or use default (current level)
2. See flashcard (word side)
3. Tap to flip → See definition & example
4. Mark "I know this" or "Still learning"
5. Repeat for X words
6. See session summary
7. Return to dashboard

### Review Session Flow
1. Click "Review Words" from dashboard
2. See words due for review
3. Choose exercise type (multiple choice / fill-in-blank)
4. Answer questions
5. Get immediate feedback
6. See results summary
7. Words answered correctly → Update mastery
8. Return to dashboard

---

## Performance Considerations

### Optimization Strategies
- Lazy load route components
- Virtualize long word lists (react-window if needed)
- Debounce search inputs
- Memoize expensive calculations (useMemo)
- Cache audio files
- Optimize re-renders with React.memo

### Data Loading
- Load vocabulary data once on app init
- Store in Context
- Filter/search in memory (fast for <1000 words)
- Consider IndexedDB for larger datasets (future)

---

## Accessibility

### Requirements
- Semantic HTML elements
- ARIA labels for icons and interactive elements
- Keyboard navigation support
- Focus visible states
- Sufficient color contrast (WCAG AA)
- Screen reader friendly
- Reduced motion option (future)

### Implementation
```tsx
// Example: Audio button
<button
  aria-label={`Play pronunciation of ${word}`}
  onClick={playAudio}
>
  <Volume2 size={20} />
</button>
```

---

## Testing Checklist

### Core Functionality
- [ ] Onboarding flow completes
- [ ] Level selection saves to localStorage
- [ ] Placement test calculates correct level
- [ ] Dashboard shows accurate stats
- [ ] Flashcards flip and advance
- [ ] Exercises mark correct/incorrect answers
- [ ] Favorites toggle on/off
- [ ] Audio plays (or TTS works)
- [ ] Streak increments daily
- [ ] Progress persists on reload
- [ ] Charts render with data
- [ ] Search filters words
- [ ] Navigation works across all routes

### Edge Cases
- [ ] Empty states (no words learned yet)
- [ ] No internet (offline audio fallback)
- [ ] localStorage full or disabled
- [ ] Invalid level selected
- [ ] Corrupt data in localStorage

---

## Future Enhancements

### Phase 2 Features
- Dark mode
- User authentication (Supabase)
- Cloud sync across devices
- Custom word lists
- Collaborative learning
- Community-created content

### Phase 3 Features
- AI-powered personalized learning paths
- Voice recording for pronunciation practice
- Image associations for words
- Social features (share progress)
- Premium content / subscription
- Native mobile apps

---

## File Structure

```
/src
  /app
    App.tsx                      # Main component with RouterProvider
    routes.ts                    # React Router configuration
    
    /components
      /layout
        AppLayout.tsx
        BottomNav.tsx
        Header.tsx
      
      /shared
        WordCard.tsx
        ProgressBar.tsx
        StatCard.tsx
        LevelBadge.tsx
        AudioButton.tsx
        Flashcard.tsx
        ExerciseCard.tsx
        Button.tsx
        Modal.tsx
        EmptyState.tsx
      
      /dashboard
        StatsOverview.tsx
        QuickActions.tsx
        TopicProgressList.tsx
        ActivityChart.tsx
      
      /learn
        FlashcardContainer.tsx
        FlashcardControls.tsx
      
      /review
        MultipleChoice.tsx
        FillInBlank.tsx
        ReviewResults.tsx
      
      /stats
        ProgressChart.tsx
        AccuracyChart.tsx
        TopicDistribution.tsx
        ActivityHeatmap.tsx
    
    /screens
      Onboarding.tsx
      LevelSelection.tsx
      PlacementTest.tsx
      Dashboard.tsx
      LearnScreen.tsx
      ReviewScreen.tsx
      ReadingScreen.tsx
      StatsScreen.tsx
      ProfileScreen.tsx
      FavoritesScreen.tsx
      TopicBrowser.tsx
      NotFound.tsx
    
    /context
      AppContext.tsx             # Global state management
      types.ts                   # TypeScript interfaces
    
    /data
      vocabulary.ts              # Mock vocabulary data
      topics.ts                  # Topic definitions
      placementQuestions.ts      # Placement test questions
      readingPassages.ts         # Reading mode content
    
    /utils
      localStorage.ts            # localStorage helpers
      audio.ts                   # Audio playback utilities
      streak.ts                  # Streak calculation
      spacedRepetition.ts        # Review scheduling
      level.ts                   # CEFR level helpers
    
    /hooks
      useLocalStorage.ts
      useAudio.ts
      useStreak.ts
      useExercise.ts
  
  /styles
    theme.css                    # Design tokens
    fonts.css                    # Font imports
  
  /public
    /audio                       # Audio files (if not using TTS)
```

---

## Getting Started (Development)

### Initial Setup
1. Create mock vocabulary data (200+ words)
2. Set up AppContext with localStorage persistence
3. Implement routing structure
4. Build Dashboard screen (central hub)
5. Build Flashcard learning screen
6. Build Review exercise screens
7. Add Statistics screen with charts
8. Implement onboarding flow
9. Polish UI and animations
10. Test thoroughly

### Development Order (Recommended)
1. **Data layer**: Create mock data and TypeScript types
2. **Context**: Set up AppContext with basic actions
3. **Routing**: Configure react-router with all routes
4. **Core screens**: Dashboard, Learn, Review
5. **Shared components**: WordCard, ProgressBar, etc.
6. **Secondary screens**: Stats, Profile, Topics
7. **Onboarding**: First-time user experience
8. **Polish**: Animations, audio, accessibility
9. **Testing**: Manual testing all flows

---

## Success Metrics

### MVP Criteria
- ✅ User can complete onboarding
- ✅ User can select or test into a CEFR level
- ✅ User can learn words via flashcards
- ✅ User can review words via exercises
- ✅ Progress persists across sessions
- ✅ Streak tracking works
- ✅ Statistics show accurate data
- ✅ Mobile-responsive design
- ✅ Audio playback functional

### Quality Benchmarks
- Fast initial load (<2s)
- Smooth animations (60fps)
- No console errors
- Accessible (keyboard + screen reader)
- Clean, professional design
- Intuitive navigation

---

## Appendix

### CEFR Level Descriptions

**A1 - Beginner**
- Basic words and phrases
- Simple everyday situations
- ~500-600 words

**A2 - Elementary**
- Everyday expressions
- Routine tasks
- ~1000-1200 words

**B1 - Intermediate**
- Familiar topics (work, school, leisure)
- Simple connected text
- ~2000-2500 words

**B2 - Upper Intermediate**
- Complex text on concrete/abstract topics
- Spontaneous interaction
- ~3500-4000 words

**C1 - Advanced**
- Wide range of texts
- Implicit meaning
- ~5000-6000 words

**C2 - Proficient**
- Virtually everything read/heard
- Near-native fluency
- ~8000-10000 words

### Sample Topics Breakdown

| Topic | A1 | A2 | B1 | B2 | C1 | C2 | Total |
|-------|----|----|----|----|----|----|-------|
| Daily Life | 30 | 25 | 20 | 15 | 5 | 5 | 100 |
| Travel | 20 | 20 | 15 | 10 | 10 | 5 | 80 |
| Food | 25 | 20 | 10 | 10 | 5 | 5 | 75 |
| Business | 5 | 10 | 20 | 25 | 15 | 10 | 85 |
| Technology | 10 | 15 | 20 | 20 | 15 | 10 | 90 |

---

**Document Version**: 1.0  
**Last Updated**: February 22, 2026  
**Status**: Ready for Development
