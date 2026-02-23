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
  pages/          - Route pages (home, login, dashboard, policies, audit-log)
  components/ui/  - shadcn/ui components
  lib/            - Utilities (queryClient, auth hook)
server/
  index.ts        - Express server setup
  routes.ts       - API routes (auth, policies, runs, audit logs)
  storage.ts      - Database storage layer (Drizzle)
  db.ts           - Database connection pool
shared/
  schema.ts       - Drizzle schema definitions
brand/            - Brand assets (SVG logos, PNGs, favicons)
```

## Data Model

- **users**: Authentication with username/password, role-based access
- **policies**: Governance policies with enforcement modes (strict/warn/escalate)
- **policyRuns**: Execution records of policy evaluations against agent commands
- **auditLogs**: Complete audit trail of all governance actions

## Brand Identity

- Navy (#0B2A3C), Dark Navy (#071D2B), Slate (#6E7A86), Teal (#1F8A8C)
- Font: Inter family
- Infrastructure-grade enterprise aesthetic

## Key Features

- Landing page showcasing the governance runtime
- User authentication (register/login with sessions)
- Governance dashboard with policy stats
- Policy CRUD management with enforcement modes
- Audit log with CSV export
- Local-first execution with cloud observe-only access
