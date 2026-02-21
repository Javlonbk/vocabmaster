# PROJECT_RULES (Must Follow)

## 1) Tech Stack (Locked unless explicitly changed)
- Mobile: React Native (Expo) + TypeScript
- API: Node.js + TypeScript
- DB: PostgreSQL (default) using Prisma
- Shared: Zod schemas + inferred TS types in packages/shared

## 2) Monorepo Structure (Do not change)
- apps/mobile
- apps/api
- packages/shared
- spec
- tickets

## 3) Source of Truth
- Product truth = spec/*
- Implementation work = one ticket at a time from tickets/*
- Decisions not specified must be written into DECISIONS.md

## 4) Output Rules for Codex
When implementing a ticket, output in this order:
1) Summary of what changed (1–5 bullets)
2) File tree of changed/new files
3) Minimal diffs or full file contents for new files
4) Commands to run to verify (lint/typecheck/tests/dev)

## 5) Constraints
- Do NOT introduce new libraries without listing them and justifying in DECISIONS.md.
- No TODO/FIXME left behind in production code.
- Use strict typing. No `any` unless documented in DECISIONS.md.
- Standardize errors: return `{ error: { code, message, details? } }` on API failures.

## 6) Security Basics
- Never log passwords/tokens.
- Validate all API inputs with Zod (directly or via shared schemas).

## 7) Naming Conventions
- Files: kebab-case
- React components: PascalCase
- Functions/vars: camelCase
- API routes: /v1/...

## 8) Build Order (Do in this order)
T001 foundation -> T002 shared schemas/types -> T003 DB schema -> T004 auth API -> T005 mobile auth -> T006 word learning MVP
