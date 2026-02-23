# T018 — Search & Advanced Filtering

## Goal
Implement comprehensive search and filtering system for exploring vocabulary across the app.

## Scope
- Global search functionality:
  - Search bar accessible from main screens
  - Search across word text, definition, example sentences
  - Real-time search results as user types
  - Debounced API calls for performance
  - Highlight matching terms in results
- Advanced filtering:
  - **By CEFR Level**: A1, A2, B1, B2, C1, C2 (multi-select)
  - **By Topic**: All available topics (multi-select)
  - **By Part of Speech**: noun, verb, adjective, etc. (multi-select)
  - **By Word State**: Known, Learning, Forgotten, Not Started (multi-select)
  - **By Mastery**: Mastered (90%+ accuracy), In Progress, Struggling
- Sort options:
  - Alphabetical (A-Z, Z-A)
  - By CEFR level (ascending/descending)
  - By date learned (newest/oldest)
  - By frequency/usage (most/least common)
  - By accuracy (highest/lowest)
- Filter UI:
  - Filter button/icon with badge showing active filter count
  - Filter modal or drawer with all options
  - Clear all filters button
  - Apply filters button
  - Visual indicators for active filters
- Search results screen:
  - List of matching words with preview
  - Quick actions: learn, favorite, play audio
  - Empty state for no results
  - Loading state during search
  - Pagination or infinite scroll for many results

## Requirements
- Search must be fast (<200ms response time)
- Support partial word matching (e.g., "run" matches "running", "runner")
- Filters should combine logically (AND/OR as appropriate)
- FilterUI must be intuitive and mobile-friendly
- Results should respect user privacy (only show user's own data)
- Follow MOBILE_UI_SPEC.md design for search and filter components
- Support offline search (cached vocabulary)

## Deliverables
- `SearchScreen.tsx` with search bar and results
- Components:
  - `SearchBar.tsx` with debounced input
  - `FilterModal.tsx` with all filter options
  - `FilterBadge.tsx` for showing active filters
  - `SearchResultCard.tsx` for result display
  - `SortPicker.tsx` for sort options
- API endpoints:
  - Search words with filters
  - Get filter options (available topics, levels, etc.)
- Search service with debouncing
- Filter and sort utilities
- Offline search implementation
- Database indexes for search performance
- Tests for search logic and filter combinations

## Acceptance Criteria
- Search bar accepts text input and shows results in real-time
- Search finds words by text, definition, or example
- Partial matches work correctly
- Filters apply correctly (multi-select for all filter types)
- Multiple filters combine logically
- Sort options reorder results correctly
- Active filters display with badges
- Clear filters removes all selections
- Empty state shows when no results found
- Search works offline with cached data
- Search is fast (<200ms for typical queries)
- Pagination/infinite scroll works smoothly
- Typecheck and lint pass

## Dependencies
- T006 (word data and states)
- T011 (topic data)
- T017 (complete vocabulary dataset)

## Notes
Consider adding saved search/filter presets in future enhancement (e.g., "My difficult B2 words" or "Business vocabulary to review").
