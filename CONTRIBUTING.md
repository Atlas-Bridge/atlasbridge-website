# Contributing to AtlasBridge Website

## Development Setup

### Prerequisites
- Node.js 22+
- npm 10+
- PostgreSQL (for backend features; landing page works without it)

### Install & Run
```bash
npm install
npm run dev          # Start dev server on http://localhost:5000
```

### Available Scripts
| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server (Express + Vite) |
| `npm run build` | Build production artifacts |
| `npm run check` | TypeScript type checking |
| `npm run lint` | Run ESLint |
| `npm run format:check` | Check Prettier formatting |
| `npm run format` | Auto-fix Prettier formatting |
| `npm test` | Run unit/integration tests (Vitest) |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run e2e` | Run Playwright E2E tests |

---

## Testing

### Unit & Integration Tests
Tests live in `client/src/__tests__/` and use **Vitest** + **React Testing Library**.

```bash
npm test              # Single run
npm run test:watch    # Watch mode
npm run test:coverage # With coverage report
```

When adding new features:
- Add tests for utility functions and schema validation
- Add render tests for new page components
- Keep test data free of sensitive or personal information

### E2E Tests
E2E tests live in `e2e/` and use **Playwright**.

```bash
npm run e2e           # Headless (auto-starts dev server)
npm run e2e:ui        # Interactive UI mode
```

E2E tests cover:
- Landing page rendering and navigation
- Static pages (privacy, terms, security, 404)
- Accessibility (axe-core scans)

---

## CI Pipeline

CI runs automatically on **pull requests** and **pushes to main** via GitHub Actions.

### What CI Checks
1. **Lint** — ESLint with TypeScript + React rules
2. **Format** — Prettier formatting verification
3. **Typecheck** — TypeScript strict mode compilation
4. **Unit tests** — Vitest with coverage reporting
5. **Build** — Production artifact compilation (client + server)
6. **E2E tests** — Playwright (on push to main only)
7. **Security** — gitleaks secret scanning + npm audit

All checks except E2E must pass before a PR can be merged.

### Reading CI Results
- Go to the **Actions** tab on the PR
- Each job shows pass/fail independently
- Failed E2E tests upload screenshots and traces as artifacts

---

## CD Pipeline

Deployment runs on **push to main** or **version tags** (`v*`).

### How It Works
1. CI checks are re-verified
2. Production artifacts are built and uploaded
3. Deploy step executes (currently a placeholder — see `cd.yml`)

### Deployment Guardrails
- Deploys only from `Atlas-Bridge/atlasbridge-website` (not forks)
- Uses `environment: production` protection
- One deploy at a time (concurrency lock)
- Build artifacts are archived for 30 days

---

## Branch Protection (Recommended)

To enforce quality gates, enable these settings on `main`:

1. Go to **Settings > Branches > Add rule** for `main`
2. Enable:
   - **Require a pull request before merging**
   - **Require status checks to pass before merging**
     - Required checks: `Lint / Format / Typecheck`, `Unit & Integration Tests`, `Build`
   - **Require branches to be up to date before merging**
   - **Do not allow bypassing the above settings**

---

## Security Guidelines

- Never commit secrets, API keys, or credentials
- Use `.env` for local secrets (already in `.gitignore`)
- Do not include personal or sensitive data in test fixtures
- Keep test data generic and business-appropriate
- Report security concerns privately to the maintainers
