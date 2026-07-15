# CI/CD Pipeline

Outmoni ships through GitHub Actions. The pipeline is split into three workflows:

| Workflow | File | Triggers | Purpose |
| --- | --- | --- | --- |
| **CI** | `.github/workflows/ci.yml` | push to `main`/`develop`, PRs to `main`/`develop` | Install, generate Prisma client, lint, typecheck, build all apps. |
| **Security** | `.github/workflows/security.yml` | push, PRs, weekly schedule | CodeQL SAST, gitleaks secret scan, dependency review, `yarn audit`. |
| **Deploy** | `.github/workflows/deploy.yml` | after **CI** succeeds on `main` | Deploy frontend to Vercel and backend to Render, then health-check the backend. |

```
push / PR ──▶ CI (lint · typecheck · build)
          └─▶ Security (CodeQL · gitleaks · dep-review · audit)

CI success on main ──▶ Deploy ──┬─▶ Vercel  (frontend)
                                └─▶ Render  (backend) ──▶ health check
```

## Why deploys are gated

`Deploy` uses `workflow_run` and only runs when the **CI** workflow finishes with
`conclusion == success` on `main`. Pull requests never deploy. This prevents
shipping code that failed lint, typecheck, or build.

## Security properties

- **Least privilege:** every workflow declares `permissions: contents: read` at
  the top; only the jobs that need more (CodeQL, dependency-review) widen it.
- **No secrets in code:** all credentials come from GitHub Encrypted Secrets and
  are injected as environment variables at run time.
- **Deploy hooks over API tokens:** deploys are triggered with Vercel/Render
  deploy-hook URLs. A hook can only *start a deploy* — it cannot read secrets,
  list projects, or change settings, so the blast radius if leaked is minimal.
- **Protected environment:** deploy jobs run in the `production` GitHub
  Environment, so you can add required reviewers / wait timers in repo settings.
- **Static + supply-chain scanning:** CodeQL, gitleaks, dependency-review and
  `yarn audit` run on every change.
- **Concurrency guards:** CI cancels superseded runs; deploys never overlap.

## Required GitHub configuration

Add these under **Settings → Secrets and variables → Actions**.

### Secrets

| Name | Used by | How to get it |
| --- | --- | --- |
| `VERCEL_DEPLOY_HOOK_URL` | Deploy | Vercel → Project → **Settings → Git → Deploy Hooks** → create a hook for the `main` branch, copy the URL. |
| `RENDER_DEPLOY_HOOK_URL` | Deploy | Render → Service → **Settings → Deploy Hook**, copy the URL. |
| `GITLEAKS_LICENSE` | Security | Only needed for GitHub **organisation** accounts. Public repos on personal accounts don't need it. |

### Variables (not secret)

| Name | Used by | Example |
| --- | --- | --- |
| `FRONTEND_URL` | Deploy (environment link) | `https://outmoni.vercel.app` |
| `BACKEND_URL` | Deploy (environment link + health check) | `https://outmoni-backend.onrender.com` |

## Application runtime environment variables

These are configured on the hosting platforms, **not** in GitHub.

### Frontend (Vercel → Project → Settings → Environment Variables)

| Variable | Notes |
| --- | --- |
| `NEXT_PUBLIC_SERVER_URL` | Public URL of the Render backend. |
| `NEXTAUTH_SECRET` | Must be identical to the backend's value. |
| `GOOGLE_CLIENT_ID` | Google OAuth client. |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret. |

Vercel project settings for this monorepo:
- **Root Directory:** `apps/frontend`
- **Framework Preset:** Next.js (build/install auto-detected)

### Backend (Render → Service → Environment)

| Variable | Notes |
| --- | --- |
| `DATABASE_URL` | MongoDB Atlas connection string (`mongodb+srv://...`). |
| `NEXTAUTH_SECRET` | Must match the frontend's value (used to verify JWTs). |
| `PORT` | Injected automatically by Render; the app reads `process.env.PORT`. |

Render service settings (see `render.yaml` for IaC):
- **Build Command:** `yarn install --frozen-lockfile && yarn workspace backend build`
  (the build runs `prisma generate` before `tsc`).
- **Start Command:** `yarn workspace backend start`
- **Health Check Path:** `/`
- **Auto-Deploy:** off (deploys come from GitHub Actions).

## MongoDB Atlas

- Store the connection string only in Render's `DATABASE_URL` env var.
- Under **Network Access**, allow Render's outbound IPs. The simplest option is
  `0.0.0.0/0` (allow from anywhere) since the DB is still protected by
  credentials; for tighter security, pin Render's static outbound IPs.
- Use a dedicated database user with least-privilege (read/write to the app DB
  only), not the Atlas admin user.
- The Prisma schema (`apps/backend/prisma/schema.prisma`) targets the `mongodb`
  provider; run `yarn workspace backend prisma db push` to sync schema changes.

## Local commands

```bash
yarn install
yarn workspace backend prisma generate
yarn turbo lint
yarn turbo check-types
yarn turbo build
```
