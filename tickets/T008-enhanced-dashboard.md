# T008 — Enhanced Dashboard & Progress

## Goal
Build a comprehensive dashboard with progress visualization, streak tracking, and quick actions.

## Scope
- Enhanced `HomeScreen`/`DashboardScreen` with:
  - Welcome header with user level and current date
  - Streak indicator (🔥 X days) with visual feedback
  - Stats cards grid:
    - Total words learned
    - Words to review
    - Mastered words
    - Current level progress
  - Quick action buttons (Continue Learning, Review Words, Browse Topics, Favorites)
  - Progress chart showing daily/weekly learning activity
  - Topic progress list with progress bars
- API endpoints:
  - Get user streak data
  - Get dashboard stats summary
  - Get topic progress breakdown
  - Update streak on activity
- Streak calculation logic:
  - Increment on daily study activity
  - Reset if >24 hours pass without activity
  - Milestone messages (7, 30, 100 days)

## Requirements
- Stats must reflect real-time progress from database
- Charts should use react-native-chart-kit or similar
- Streak tracking must be timezone-aware
- Follow MOBILE_UI_SPEC.md design with stat cards and progress bars
- Smooth animations for stat updates
- Pull-to-refresh functionality

## Deliverables
- Enhanced dashboard UI components:
  - `StatsOverview.tsx`
  - `StreakIndicator.tsx`
  - `QuickActions.tsx`
  - `ActivityChart.tsx`
  - `TopicProgressList.tsx`
- API routes for dashboard data
- Streak calculation service
- Database schema updates for streak tracking
- Tests for streak logic and dashboard data aggregation

## Acceptance Criteria
- Dashboard displays accurate real-time stats
- Streak increments correctly on daily activity
- Streak resets after 24-hour inactivity
- Progress chart shows learning activity over time
- Topic progress list displays all topics with percentages
- Quick actions navigate to correct screens
- Pull-to-refresh updates all data
- Loading and error states handled gracefully
- Typecheck and lint pass

## Dependencies
- T006 (existing mobile screens and learning flow)
- T011 (topic data for progress tracking)
