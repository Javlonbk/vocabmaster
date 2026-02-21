# T004 — Auth API (Email)

## Goal
Implement minimal email/password authentication API in `apps/api`.

## Scope
- Add `/v1/auth/signup` and `/v1/auth/login` routes.
- Use shared Zod schemas for request validation.
- Hash passwords securely.
- Return standardized API errors:
  - `{ error: { code, message, details? } }`

## Requirements
- Never log passwords/tokens.
- Keep response contracts consistent and documented.

## Deliverables
- Auth routes/controllers/services.
- Validation middleware integration.
- Basic tests for happy/invalid-path behavior.

## Acceptance Criteria
- Signup/login works end-to-end against DB.
- Invalid requests return standardized error object.
- Tests pass.
