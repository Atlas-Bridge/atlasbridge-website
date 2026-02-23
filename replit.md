# AtlasBridge

An open-source deterministic governance runtime for AI CLI agents. This application provides a production-ready console for policy-driven execution, structured escalation, and audit-grade traceability.

## Architecture

- **Frontend**: React + TypeScript + Tailwind CSS + shadcn/ui, using wouter for routing and TanStack Query for data fetching
- **Backend**: Express.js with session-based authentication (bcrypt + connect-pg-simple)
- **Database**: PostgreSQL with Drizzle ORM
- **Shared**: TypeScript types and Drizzle schemas in `shared/schema.ts`

## Project Structure

```
client/src/
  pages/          - Route pages (home, login, dashboard, policies, audit-log, docs, privacy, terms, security-page)
  components/ui/  - shadcn/ui components
  hooks/          - Custom hooks (use-scroll-animation for Intersection Observer animations)
  lib/            - Utilities (queryClient, auth hook)
server/
  index.ts        - Express server setup (compression, security headers)
  routes.ts       - API routes (auth, policies, runs, audit logs, docs)
  storage.ts      - Database storage layer (Drizzle)
  static.ts       - Production static file serving with cache headers
  db.ts           - Database connection pool
shared/
  schema.ts       - Drizzle schema definitions
docs/             - Markdown documentation files (20+ docs)
brand/            - Brand assets (SVG logos, PNGs, favicons)
```

## Data Model

- **users**: Authentication with username/password, role-based access
- **policies**: Governance policies with enforcement modes (strict/warn/escalate)
- **policyRuns**: Execution records of policy evaluations against agent commands
- **auditLogs**: Complete audit trail of all governance actions

## Brand Identity

- Navy (#0B2A3C), Dark Navy (#071D2B), Slate (#6E7A86), Teal (#1F8A8C)
- Font: Inter (body) + JetBrains Mono (code)
- Infrastructure-grade enterprise aesthetic

## Key Features

- Landing page with 3D animations, scroll effects, and terminal typing
- User authentication (register/login with sessions)
- Governance dashboard with policy stats
- Policy CRUD management with enforcement modes
- Audit log with CSV export and mobile card views
- Full documentation viewer (20+ markdown docs)
- Compliance pages: /privacy, /terms, /security
- Local-first execution with cloud observe-only access
- Mobile-responsive across all pages with hamburger menus

## Performance & Security

- **Fonts**: Optimized to Inter + JetBrains Mono only (was 25+ families)
- **Code splitting**: Lazy-loaded pages with React.lazy + Suspense
- **Compression**: gzip/brotli via compression middleware
- **Security headers**: X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy, CSP (production), HSTS (production)
- **Caching**: Immutable 1yr cache for hashed /assets, 1hr for other static, no-cache for HTML
- **Session cookies**: httpOnly, secure in production, sameSite: lax
- **Accessibility**: Skip-to-content link, ARIA labels, semantic landmarks, keyboard-navigable
