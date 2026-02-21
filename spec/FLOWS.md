# User Flows (MVP)

## Flow 1: Sign up / Login (Email)
1. Open app
2. Enter email + password
3. If new -> create account
4. If existing -> login
5. Land on Home

## Flow 2: Select Target Level
1. Home -> Level Selection
2. Choose level A1..C2
3. Save selection
4. Home updates: shows progress for chosen level

## Flow 3: Start Learning Session
1. Home -> Start Session
2. App loads N words from chosen level (default N=20)
3. For each word user chooses:
   - Known
   - Learning
   - Forgotten
4. Session summary: counts + next steps

## Flow 4: Review Forgotten
1. Home -> Review Forgotten
2. App shows forgotten words (prioritized by last reviewed date)
3. User reclassifies word state
4. Progress updates

## Flow 5: Admin (minimal)
1. Admin login
2. View dataset status (words count by level)
3. Trigger dataset import/refresh (manual)
