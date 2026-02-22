# T012 — Favorites System

## Goal
Allow users to bookmark words for quick access and focused review.

## Scope
- Favorite functionality:
  - Heart icon on word cards (toggle favorite/unfavorite)
  - Visual feedback on toggle (animation, color change)
  - Persist favorites to database per user
- Favorites screen:
  - List of all favorited words
  - Search within favorites
  - Filter options (by level, topic, part of speech)
  - Sort options (alphabetical, by level, date added, date learned)
  - Word cards with same display as learning screen
  - Unfavorite action (swipe or button)
  - Empty state when no favorites
- Quick access:
  - Favorites button on dashboard
  - Favorites count displayed
  - Deep link to favorites from word cards
- API endpoints:
  - Toggle favorite status
  - Get all favorites for user
  - Batch favorite operations

## Requirements
- Favorites must sync immediately to database
- Heart icon must show current favorite status
- Support for favoriting from multiple contexts (learning, review, search)
- Follow MOBILE_UI_SPEC.md design for favorites list
- Performance: handle large favorite lists (100+ words) smoothly
- Offline support: queue favorite toggles when offline

## Deliverables
- `FavoritesScreen.tsx` with search/filter/sort
- `FavoriteButton.tsx` reusable component
- `FavoriteWordCard.tsx` with unfavorite action
- Database schema updates (favorites table or column)
- API routes for favorite operations
- Favorite service with offline queue
- Filter and sort utilities
- Tests for favorite toggle and list operations

## Acceptance Criteria
- Heart icon toggles favorite status with animation
- Favorited words appear in favorites screen
- Search filters favorites list in real-time
- Filter by level/topic/part of speech works
- Sort options reorder list correctly
- Unfavorite action removes from list immediately
- Empty state displays when no favorites
- Dashboard shows correct favorites count
- Works offline with sync on reconnect
- Typecheck and lint pass

## Dependencies
- T006 (word display and learning screens)
- T009 (word card components)
