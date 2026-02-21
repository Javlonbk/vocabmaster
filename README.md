# VocabLevel (Working Title)

A mobile app to learn English vocabulary using a complete A1–C2 word database.
Goal: quickly identify gaps in a target level (e.g., B2) and learn/refresh words in a structured way, instead of random learning from books/articles.

## Repo Structure
- apps/mobile — React Native (Expo) app
- apps/api — Node.js API
- packages/shared — shared types/schemas (Zod), API client helpers
- spec/ — product specs (source of truth)
- tickets/ — implementation tickets (Codex works from these)
- DECISIONS.md — architectural/product decisions log
- PROJECT_RULES.md — rules Codex must follow

## How we build (Codex workflow)
1) Read PROJECT_RULES.md
2) Read relevant spec/* docs
3) Implement one ticket from tickets/*
4) Output: file tree + minimal diffs + how to run checks

## MVP Summary
- Email login (simple)
- Choose target level (A1…C2)
- Learn words via sessions (flashcards)
- Mark each word: Known / Learning / Forgotten
- Review Forgotten + spaced repetition later
- Progress dashboard by level

See spec/PRD.md for details.
