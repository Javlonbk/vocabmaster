# T011 — Topic-Based Learning

## Goal
Enable users to browse and learn vocabulary organized by topics (Daily Life, Travel, Food, Business, etc.).

## Scope
- Topic browser screen:
  - Grid of topic cards with icons
  - Each card shows: name, icon, word count, progress %, level distribution
  - Filter by CEFR level
  - Search topics functionality
- Topic detail screen:
  - List of words in selected topic
  - Progress indicator for topic
  - Start learning button for topic-specific session
  - Filter by learned/unlearned
- Topic data structure:
  - Define 12+ topics (Daily Life, Travel, Food & Dining, Business, Education, Health, Technology, Arts & Culture, Nature, Sports, Emotions, Time & Dates)
  - Assign words to topics in database
  - Track progress per topic
- API endpoints:
  - Get all topics with metadata
  - Get words by topic
  - Get topic progress for user
  - Start topic-specific learning session

## Requirements
- Minimum 12 topics covering diverse vocabulary domains
- Each topic should have 50-150 words across CEFR levels
- Topic icons should be clear and recognizable (using lucide-react-native or similar)
- Progress calculation should be real-time from user word states
- Follow MOBILE_UI_SPEC.md design for topic cards and badges
- Support topic filtering and search

## Deliverables
- Screens:
  - `TopicBrowserScreen.tsx` with grid layout
  - `TopicDetailScreen.tsx` with word list
- Components:
  - `TopicCard.tsx` with icon, stats, progress bar
  - `TopicFilterBar.tsx` for level filtering
- Topic data definitions and seeds
- Database schema updates for topic assignments
- API routes for topic operations
- Topic progress calculation service
- Tests for topic filtering and progress calculation

## Acceptance Criteria
- Topic browser displays all topics with accurate stats
- Topic cards show word count and completion percentage
- Filter by CEFR level works correctly
- Search finds topics by name
- Topic detail shows all words in topic
- Starting topic session loads only topic words
- Progress updates when words are learned
- Topic icons are visually clear
- Typecheck and lint pass

## Dependencies
- T006 (learning session screen)
- T017 (vocabulary data with topic assignments)
