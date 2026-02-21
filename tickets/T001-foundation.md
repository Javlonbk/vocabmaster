# T001 — Foundation Setup

## Goal
Initialize the monorepo foundation for mobile app, API, and shared package with TypeScript-first tooling.

## Scope
- Create workspace-level package manager/workspace config.
- Initialize `apps/mobile` (Expo + TypeScript baseline).
- Initialize `apps/api` (Node + TypeScript baseline).
- Initialize `packages/shared` (TypeScript package baseline).
- Add common scripts for lint/typecheck/test/dev where applicable.

## Requirements
- Must preserve directory layout in `PROJECT_RULES.md`.
- No `any` usage unless justified in `DECISIONS.md`.
- No TODO/FIXME in production files.

## Deliverables
- Workspace root configuration files.
- Minimal runnable skeletons in mobile/api/shared.
- Readme updates with setup/run commands.

## Acceptance Criteria
- Repo installs dependencies successfully.
- `typecheck` succeeds for all initialized packages.
- `lint` command runs successfully.
