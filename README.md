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

## Getting Started
1. Install dependencies:
   ```bash
   npm install
   ```
2. Run type checks across all workspaces:
   ```bash
   npm run typecheck
   ```
3. Run lint across all workspaces:
   ```bash
   npm run lint
   ```

## Development Commands
- Start API:
  ```bash
  npm run dev --workspace @vocabmaster/api
  ```
- Start mobile app:
  ```bash
  npm run dev --workspace @vocabmaster/mobile
  ```
- Build shared package:
  ```bash
  npm run build --workspace @vocabmaster/shared
  ```
- Run shared schema tests:
  ```bash
  npm run test --workspace @vocabmaster/shared
  ```
- Generate Prisma client:
  ```bash
  npm run prisma:generate --workspace @vocabmaster/api
  ```
- Apply initial Prisma migration:
  ```bash
  npm run prisma:migrate --workspace @vocabmaster/api
  ```
- Run Prisma seed scaffold:
  ```bash
  npm run prisma:seed --workspace @vocabmaster/api
  ```

## Running the Mobile App (Expo Go)
1. Start Metro from repo root:
   ```bash
   npm run dev --workspace @vocabmaster/mobile
   ```
2. Install **Expo Go** on your phone.
3. Ensure phone and computer are on the same Wi-Fi network.
4. Scan the QR code shown in terminal:
   - Android: from Expo Go app
   - iOS: from Camera app
5. Useful keyboard controls in terminal:
   - `a` open Android emulator
   - `w` open web build
   - `r` reload app
   - `m` open dev menu

If Expo prints dependency mismatch warnings, run:
```bash
npx expo install --fix
```

For monorepo/workspace setups, this project uses `apps/mobile/index.js` as the explicit Expo entrypoint to avoid hoisted `node_modules` path resolution issues.

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
