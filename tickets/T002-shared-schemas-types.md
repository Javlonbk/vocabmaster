# T002 — Shared Schemas & Types

## Goal
Define shared domain schemas and TypeScript types in `packages/shared` using Zod.

## Scope
- Create Zod schemas for:
  - Auth inputs (signup/login)
  - Level selection (A1..C2)
  - Word state (`Known`, `Learning`, `Forgotten`)
  - Session summary payloads
- Export inferred TS types from schemas.
- Add schema tests for valid/invalid input.

## Requirements
- Validate all API-facing inputs through shared schemas.
- Keep schema names and file names in kebab-case.

## Deliverables
- Shared schema modules in `packages/shared`.
- Barrel exports for package consumers.
- Unit tests for schema validation rules.

## Acceptance Criteria
- API/mobile can import shared schemas/types without duplication.
- Schema tests pass.
- Types are strictly inferred from Zod.
