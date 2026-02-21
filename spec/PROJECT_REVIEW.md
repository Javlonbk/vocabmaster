# Initial Project Review

## What this project is
VocabLevel is a mobile-first vocabulary learning app focused on level-based progression (A1-C2), with an MVP centered on daily learning and retention improvement.

## Product understanding (from specs)
- Core problem: random vocabulary discovery during reading is inefficient and demotivating.
- MVP target: one primary learner + minimal admin capability.
- Main loop:
  1. Authenticate
  2. Pick a target level
  3. Complete a word session
  4. Revisit forgotten words
  5. Track progress over time
- Required word states: `Known`, `Learning`, `Forgotten`.

## Technical constraints currently defined
- Stack is fixed for now: Expo (React Native) + TypeScript, Node.js + TypeScript API, PostgreSQL + Prisma, shared Zod schemas.
- Monorepo target structure is now scaffolded (`apps/mobile`, `apps/api`, `packages/shared`, `tickets`) and ready for implementation tickets.
- API error format is standardized as:
  - `{ error: { code, message, details? } }`

## Current repository status
The repository now includes initial scaffolding for required monorepo directories:
- `apps/mobile`
- `apps/api`
- `packages/shared`
- `tickets`

At this stage, implementation code is not yet started; the repository is prepared for ticket-by-ticket delivery.

## Suggested immediate next actions
1. Execute `T001` to initialize runnable workspace/app/package baselines.
2. Execute `T002` to define shared Zod schemas before API/mobile endpoint integration.
3. Continue sequentially through `T003`..`T006` as defined in `tickets/`.
4. Keep `DECISIONS.md` updated whenever implementation choices are not explicitly specified in `spec/*`.

## Known gaps / clarifications to decide early
- Auth strategy details (session/JWT, refresh flow, password reset approach)
- Spaced-repetition policy specifics for `Forgotten` review cadence
- Initial vocabulary dataset source and import format
- Admin access model (separate role, allowlist, or internal-only flag)
