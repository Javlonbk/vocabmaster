# T003 — Database Schema (Prisma)

## Goal
Create initial PostgreSQL schema with Prisma for users, words, learning states, and review tracking.

## Scope
- Set up Prisma in `apps/api`.
- Define models for:
  - User
  - LevelTarget (selected user level)
  - Word (with CEFR level)
  - UserWordState (`Known`, `Learning`, `Forgotten`)
  - Review metadata (last reviewed, counters)
- Add migrations and seed scaffold.

## Requirements
- Keep model naming and relationships explicit and normalized.
- Ensure indexes support level-based session queries and forgotten review queries.

## Deliverables
- `schema.prisma`
- Initial migration files
- Seed script scaffold for vocabulary import flow

## Acceptance Criteria
- Migration applies cleanly to local PostgreSQL.
- Prisma client generates successfully.
- Basic seed command runs.
