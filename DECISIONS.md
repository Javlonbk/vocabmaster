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

## 2026-02-21 — T004 auth API implementation approach
- Added `bcryptjs` for password hashing and `jsonwebtoken` for signed auth tokens.
- Added `supertest` for API route tests with Node test runner.
- Added API route modularization (`createApp`, auth router, validation middleware, error helpers) to keep handlers testable and enforce standardized error responses.
- Rationale: satisfy ticket requirements for secure password handling, shared-schema validation, and happy/invalid-path API tests.

## 2026-02-21 — T005 mobile auth flow uses local screen switching
- Implemented Login/Signup/Home screens in `apps/mobile` with typed auth client integration.
- Used in-app mode switching and authenticated conditional rendering instead of adding a navigation library at this stage.
- Rationale: satisfy T005 flow requirements with minimal dependencies and keep foundation lightweight for subsequent MVP tickets.

## 2026-02-21 — T006 learning loop implementation strategy
- Added authenticated learning endpoints under `/v1/learning` for target level, session words, word-state updates, forgotten review queue, and progress stats.
- Authenticated API routes use JWT bearer verification middleware and keep standardized API error format.
- Mobile T006 flow uses local screen-state orchestration for `Home`, `LevelSelect`, `Session`, `SessionSummary`, and `ReviewForgotten` screens.
- Rationale: deliver full MVP learning loop without introducing additional navigation/state libraries before stabilization.

## 2026-02-22 — T007 onboarding persistence and gradient support
- Added `@react-native-async-storage/async-storage` for onboarding completion persistence across app launches.
- Added `expo-linear-gradient` to render the onboarding soft gradient background.
- Rationale: T007 requires first-time user detection with persistence and a soft gradient onboarding design.

## 2026-02-22 — T009 text-to-speech support
- Added `expo-speech` for on-device TTS playback of flashcards and reading content.
- Rationale: T009 requires audio playback for flashcards without introducing a custom backend audio pipeline.

## 2026-02-22 — T008 dashboard placeholders and streak tracking
- Added local AsyncStorage-backed streak tracking via `vocabmaster:streak` (updated on session completion and forgotten review completion).
- Dashboard activity chart and topic progress use local placeholder data pending API support.
- Rationale: T008 requires streak visibility and dashboard visuals before backend analytics endpoints exist.

## 2026-02-22 — T010 review exercises implementation
- Added review exercises screen with multiple choice and fill-in-blank modes, immediate feedback, and summary completion flow.
- Review pulls forgotten queue first, falls back to session words, and updates word state based on correctness.
- Rationale: deliver core exercise types without new backend endpoints while retaining existing forgotten queue review.

## 2026-02-22 — T017 dataset minimum reduced
- Reduced vocabulary seed minimum from 200 to 60 words for the initial dataset.
- Rationale: initial milestone only requires coverage breadth with a small validated set; larger datasets can follow later.

## 2026-02-22 — Review queue count cap
- Limited `count` query validation for session/review endpoints to a maximum of 60.
- Rationale: avoid oversized payloads while meeting the current product needs.

## 2026-02-22 — T011 topic-based learning routing
- Added topic browser screen with search and topic cards, plus optional topic filter for session word fetching.
- API session words endpoint now validates an optional topic query parameter and filters words by topic.
- Rationale: enable topic-based sessions without introducing new navigation libraries or endpoints.

## 2026-02-22 — T012 favorites persistence
- Added AsyncStorage-backed favorites list with add/remove and a dedicated favorites screen.
- Favorites can be toggled from flashcard sessions and forgotten review cards.
- Rationale: deliver favorites feature without new backend endpoints.

## 2026-02-22 — T013 stats visuals placeholders
- Added stats screen with overview cards and placeholder charts for progress, accuracy by level, and topic distribution.
- Stats currently derive from `ProgressStats` plus local placeholder series until analytics backend is available.
- Rationale: deliver core analytics UI while tracking data sources for future integration.

## 2026-02-22 — T014 profile and settings
- Added profile/settings screen with user info, settings toggles, daily goal, and reset progress flow.
- Settings persisted in AsyncStorage with defaults aligned to spec (audio on, daily goal 10, notifications off).
- Reset clears settings, streak, and favorites, plus local progress state.
- Rationale: support user personalization and data management without backend dependencies.

## 2026-02-22 — T015 spaced repetition scheduling
- Added spaced repetition scheduling (intervals 1/3/7/14/30/90 days) with ease factor adjustments and persisted review interval/ease factor on `UserWordState`.
- Added review queue and due count endpoints; dashboard now uses due review count for "To Review".
- Rationale: introduce adaptive review scheduling with minimal API changes while keeping performance predictable.

## 2026-02-22 — T016 reading mode
- Added reading passages, progress tracking, bookmarks, and tap-to-define UI with offline caching.
- Introduced reading endpoints (`/v1/reading`) and passage seeds with vocab tagging.
- Rationale: enable contextual learning with interactive passages and word actions.

## 2026-02-22 — T018 search and advanced filtering
- Added search endpoints with filtering, sorting, and mastery labels, plus DB indexes and frequency metadata.
- Added mobile search UI with filters, sorting, offline cache, and quick actions.
- Rationale: deliver fast cross-library search with configurable filters and offline access.
