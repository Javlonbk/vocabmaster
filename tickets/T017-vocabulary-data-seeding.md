# T017 — Vocabulary Data Seeding

## Goal
Create and import a comprehensive, high-quality vocabulary dataset covering all CEFR levels and topics.

## Scope
- Vocabulary dataset requirements:
  - Minimum 60 words (target: 200+ for comprehensive coverage)
  - Coverage across all CEFR levels:
    - A1: 60-80 words (basic/beginner)
    - A2: 60-80 words (elementary)
    - B1: 50-70 words (intermediate)
    - B2: 50-70 words (upper intermediate)
    - C1: 40-60 words (advanced)
    - C2: 30-50 words (proficient)
  - Coverage across 12+ topics:
    - Daily Life, Travel, Food & Dining, Business, Work, Education, Health & Medicine, Technology, Arts & Culture, Nature & Environment, Sports & Hobbies, Emotions & Feelings, Time & Dates
  - All parts of speech: noun, verb, adjective, adverb, preposition, conjunction, interjection
- Word data structure:
  - Word (text)
  - Phonetic transcription (IPA format)
  - Audio URL or TTS command
  - Clear, concise definition
  - Example sentence using the word
  - CEFR level
  - Topic(s) - words can belong to multiple topics
  - Part of speech
  - Frequency/commonness indicator (optional)
- Data sources:
  - Open vocabulary databases (e.g., Oxford 3000/5000, CEFR-J Wordlist)
  - Public domain resources
  - Manual curation for quality
- Import system:
  - CSV/JSON import script
  - Data validation (required fields, valid enums)
  - Duplicate detection
  - Batch import capability
  - Admin interface for imports (simple CLI or API endpoint)

## Requirements
- All words must have accurate definitions and example sentences
- Example sentences should be realistic and contextual
- Phonetic transcriptions must be in standard IPA format
- CEFR level assignments should be accurate per standard
- Topic assignments should be logical and useful
- No duplicate words in dataset
- Data quality: no typos, grammatical errors, or inappropriate content
- Must be licensable for commercial use (if future monetization planned)

## Deliverables
- Vocabulary dataset files:
  - `vocabulary-seeds.csv` or `vocabulary-seeds.json`
  - Organized by level and topic
- Database seed scripts:
  - Prisma seed update to import vocabulary
  - Validation logic for data integrity
- Import utilities:
  - CSV/JSON parser and validator
  - Batch import functions
  - Duplicate detection
- Admin endpoint or CLI command for importing words
- Documentation for vocabulary data format
- Tests for import validation and duplicate detection

## Acceptance Criteria
- Dataset contains minimum 60 words (target 200+)
- All CEFR levels represented with appropriate distribution
- All 12+ topics covered
- All words have complete data (word, phonetic, definition, example, level, topic, part of speech)
- Phonetic transcriptions are in valid IPA format
- Example sentences are natural and grammatically correct
- Import script successfully loads all words into database
- Validation catches malformed or incomplete data
- No duplicate words exist in database
- Seed script is documented and reproducible
- Typecheck and lint pass for import code

## Dependencies
- T003 (database schema for words)
- T011 (topic definitions)

## Notes
This is a critical foundation ticket - quality of vocabulary data directly impacts user learning experience. Consider enlisting language teachers or learners to review word selections and example sentences for appropriateness and accuracy.
