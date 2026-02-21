# DECISIONS

This file logs technical and product decisions that are not fully specified in `spec/*`.

## 2026-02-21 — Initial repository scaffolding baseline
- Created required monorepo directories from `PROJECT_RULES.md`:
  - `apps/mobile`
  - `apps/api`
  - `packages/shared`
  - `tickets`
- Rationale: align the repository with the mandatory structure before ticketed implementation starts.

## 2026-02-21 — Ticket template and sequencing
- Added implementation tickets `T001` through `T006` under `tickets/`.
- Sequence strictly follows `PROJECT_RULES.md` build order.
- Rationale: ensure deterministic execution order and reduce ambiguity when implementing the MVP.

## 2026-02-21 — No additional libraries introduced at planning stage
- No runtime/build dependencies were added in this change.
- Rationale: this PR focuses on planning/scaffolding only.

## 2026-02-21 — T001 foundation tooling choices
- Package manager/workspaces: npm workspaces at repository root.
- API framework: Express for a minimal HTTP service baseline.
- Mobile baseline: Expo + React Native TypeScript starter structure.
- Shared package runtime validation dependency: Zod.
- Linting: ESLint with TypeScript + React plugins at the workspace root.
- Rationale: satisfy T001 requirements with broadly adopted defaults that match `PROJECT_RULES.md` stack constraints and keep all packages runnable with strict TypeScript.

## 2026-02-21 — Align React Native patch version with Expo SDK 54 expectations
- Updated `apps/mobile` dependency `react-native` from `0.81.4` to `0.81.5`.
- Rationale: Expo SDK 54 runtime warns and recommends `0.81.5` for best compatibility.

## 2026-02-21 — Use explicit mobile entrypoint in monorepo/workspace setup
- Changed `apps/mobile` package `main` from `expo/AppEntry` to local `index.js` and added `apps/mobile/index.js` that registers `./App`.
- Rationale: in workspace/hoisted installs, `expo/AppEntry` may resolve from the root `node_modules` and import `../../App` from the wrong directory, causing bundling failure.

## 2026-02-21 — T002 shared schema module boundaries
- Added separate schema modules in `packages/shared/src` for auth, level selection, word state, and session summary.
- Added cross-field validation on session summary to enforce count and results consistency.
- Added Node test runner coverage for valid and invalid payloads.
- Rationale: keep API/mobile contracts centralized and strictly inferred from Zod.

## 2026-02-21 — T003 Prisma stack in API workspace
- Added `prisma` and `@prisma/client` dependencies in `apps/api`.
- Added PostgreSQL Prisma schema with normalized `User`, `LevelTarget`, `Word`, and `UserWordState` models plus CEFR/word-state enums.
- Added initial SQL migration and seed scaffold wired through Prisma seed command.
- Rationale: establish DB foundation and indexes for session-by-level and forgotten-review queries.
