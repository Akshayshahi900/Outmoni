# Outmoni — CI/CD Pipeline Spec

This document specifies the secure CI/CD pipeline added to Outmoni and the app
configuration changes required to make it work. It reflects the changes shipped
in PR #8.

## Goals

- Run automated checks on every **push** and **pull request**.
- Deploy the **frontend to Vercel** and **backend to Render** (MongoDB Atlas as
  the database) only after checks pass on `main`.
- Follow security best practices (least privilege, no secrets in code, SAST,
  secret scanning, dependency scanning, protected deploys).

## Repository layout

Turborepo (yarn 1.22 workspaces), Node 22:

| Path | Stack | Deploy target |
| --- | --- | --- |
| `apps/frontend` | Next.js 15 | Vercel |
| `apps/backend` | Express 5 + Prisma (MongoDB) | Render |
| `apps/mobile` | Expo / React Native | not deployed by this pipeline |

## Workflows

```
push / PR ─▶ CI        (install → prisma generate → lint → check-types → build)
          └▶ Security  (CodeQL · gitleaks · dependency-review · yarn audit)

CI success on main ─▶ Deploy ─┬▶ Vercel  (frontend, deploy hook)
                              └▶ Render  (backend, deploy hook) ─▶ health check
```

### 1. CI — `.github/workflows/ci.yml`

- Triggers: `push` and `pull_request` to `main` / `develop`.
- `permissions: contents: read`; concurrency cancels superseded runs.
- Steps: checkout → setup Node 22 (+ yarn cache) → `yarn install --frozen-lockfile`
  → `yarn workspace backend prisma generate` → turbo cache → `lint` →
  `check-types` → `build`.

### 2. Security — `.github/workflows/security.yml`

- Triggers: `push`, `pull_request`, and a weekly `schedule`.
- Jobs:
  - **CodeQL (SAST)** — `javascript-typescript`, `security-and-quality` queries.
  - **Secret Scan** — gitleaks (full history).
  - **Dependency Review** — PR-only; fails on `high` severity. Currently
    `continue-on-error: true` until the repo's Dependency graph is enabled.
  - **Dependency Audit** — `yarn audit --level high` (report-only).

### 3. Deploy — `.github/workflows/deploy.yml`

- Trigger: `workflow_run` on **CI** completing with `success` on `main`
  (PRs never deploy).
- `concurrency: deploy-production` with `cancel-in-progress: false`.
- Jobs run in the `production` GitHub Environment:
  - **deploy-frontend** — `POST` to `VERCEL_DEPLOY_HOOK_URL`.
  - **deploy-backend** — `POST` to `RENDER_DEPLOY_HOOK_URL`, then poll
    `BACKEND_URL` for HTTP 200 (up to ~5 min).

## App configuration changes

- `apps/backend/package.json`
  - `build: "prisma generate && tsc"`
  - `check-types: "prisma generate && tsc --noEmit"`
- `apps/frontend/package.json`
  - `check-types: "tsc --noEmit -p tsconfig.typecheck.json"`
- `apps/frontend/tsconfig.typecheck.json` — excludes build-only `.next/types`
  so `tsc` runs cleanly on a fresh runner.
- `turbo.json` — add `dist/**` to build `outputs`.
- `.gitignore` — ignore `*.tsbuildinfo`.

### Bug fixes that unblocked CI

- `yarn install --immutable` → `--frozen-lockfile` (this repo is yarn classic).
- Backend build failed with `@prisma/client has no exported member 'User'` →
  `prisma generate` now runs before build/typecheck.
- 6 frontend lint errors fixed (no behavior change): `no-explicit-any` in
  `jwt.ts`, `sendToBackend.ts`, `addExpenseModal.tsx`, `route.ts`,
  `auth.config.ts`; unescaped `'` in `page.tsx`. The Next.js 15 route handler
  `params` type was corrected to `Promise<{ id: string }>`.

## Required GitHub configuration

Settings → Secrets and variables → Actions.

**Secrets**

| Name | Purpose |
| --- | --- |
| `VERCEL_DEPLOY_HOOK_URL` | Trigger the Vercel production deploy. |
| `RENDER_DEPLOY_HOOK_URL` | Trigger the Render production deploy. |
| `GITLEAKS_LICENSE` | Only for GitHub org accounts (not needed for public/personal repos). |

**Variables**

| Name | Purpose |
| --- | --- |
| `FRONTEND_URL` | Environment link for the frontend deploy. |
| `BACKEND_URL` | Environment link + backend health check target. |

## Runtime environment variables (set on the hosts, not GitHub)

- **Frontend (Vercel):** `NEXT_PUBLIC_SERVER_URL`, `NEXTAUTH_SECRET`,
  `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`. Root directory `apps/frontend`.
- **Backend (Render):** `DATABASE_URL` (MongoDB Atlas), `NEXTAUTH_SECRET`
  (must match the frontend), `PORT` (injected by Render). Build
  `yarn install --frozen-lockfile && yarn workspace backend build`, start
  `yarn workspace backend start`, health check path `/`. See `render.yaml`.

## Security properties

- Least-privilege `permissions` per workflow/job.
- No secrets in source; deploy hooks (least privilege) instead of API tokens.
- `production` environment enables optional required reviewers / wait timers.
- SAST (CodeQL), secret scanning (gitleaks), dependency scanning on every change.
- Concurrency guards prevent overlapping deploys and wasted CI.

## Follow-ups (optional hardening)

1. Enable **Dependency graph** and remove `continue-on-error` from the
   dependency-review job to make high-severity CVEs a hard gate.
2. Add required reviewers to the `production` GitHub Environment.
3. Promote `yarn audit` to a hard gate once the dependency tree is clean.

See `docs/ci-cd.md` for the full operator guide.
