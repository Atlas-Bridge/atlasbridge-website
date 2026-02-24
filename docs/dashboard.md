# Dashboard

The AtlasBridge dashboard is a web-based operator console that provides visibility into governance activity, policy status, agent evaluations, and audit events. It is designed for operators and administrators who need to monitor policy enforcement, review agent decisions, and manage governance configuration through a graphical interface.

The dashboard connects to the same PostgreSQL database used by the CLI and runtime, providing a consistent view of all governance data.

## Setup and Access

### Prerequisites

Before accessing the dashboard, ensure the following are in place:

- A running PostgreSQL 14+ instance
- The `DATABASE_URL` environment variable set to your PostgreSQL connection string
- Node.js 18 or later installed

### Running the Dashboard Locally

1. Clone the repository:

```bash
git clone https://github.com/Atlas-Bridge/atlasbridge.git
cd atlasbridge
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the project root with your database connection:

```bash
DATABASE_URL=postgresql://user:password@localhost:5432/atlasbridge
SESSION_SECRET=your-session-secret
```

4. Push the database schema:

```bash
npm run db:push
```

5. Start the development server:

```bash
npm run dev
```

The dashboard is now accessible at `http://localhost:3000`. Navigate to `/login` to create an account or sign in.

### Accessing the Hosted Dashboard

If your organization has deployed AtlasBridge to a hosted environment (e.g., Vercel), access the dashboard at your configured domain. Contact your administrator for the URL and credentials.

### First-Time Setup

1. Navigate to the login page and click **Register** to create your first account.
2. The first registered user receives **admin** privileges by default.
3. After registration, you are automatically signed in and redirected to the dashboard overview.

## Authentication

Access to the dashboard requires authentication. Users register with a username and password, and sessions are maintained server-side using secure, HTTP-only cookies. Role-based access control determines which operations a user can perform.

Supported roles:

- **viewer** — Read-only access to dashboard data, audit logs, and policy runs.
- **admin** — Full access including policy creation, modification, and deletion.

Authentication events (login, registration, logout) are recorded in the audit log.

## Overview Page

The overview page is the default landing view after authentication. It presents a summary of governance activity across four primary metrics:

- **Active Policies** — The number of currently enabled policies, with the total policy count for context.
- **Total Runs** — The total number of policy evaluations that have been executed.
- **Allowed** — The number of evaluations that resulted in an `allow` decision, indicating the command passed all governance checks.
- **Denied / Escalated** — The combined count of evaluations that resulted in `deny` or `escalate` decisions, with individual counts displayed below.

These metrics update in real time as new evaluations are recorded.

Below the summary metrics, the overview page displays two feeds:

### Recent Policy Runs

A chronological list of the most recent policy evaluations. Each entry shows:

- The command that was evaluated
- The agent that submitted the command
- The evaluation duration in milliseconds
- The decision outcome (`ALLOW`, `DENY`, or `ESCALATE`) with color-coded status

### Recent Audit Activity

A feed of the most recent audit log entries. Each entry shows:

- The action that was performed (e.g., `policy.create`, `user.login`, `policy.run.deny`)
- The actor who performed the action
- The timestamp
- A severity indicator (green for info, amber for warn, red for error)

## Policies Page

The policies page provides full management of governance policies. Operators can view, create, enable, disable, and delete policies from this interface.

### Policy List

Each policy is displayed as a card showing:

- **Name** — The human-readable policy identifier.
- **Description** — A summary of what the policy governs.
- **Enforcement Mode** — One of three modes, displayed as a color-coded badge:
  - `STRICT` (red) — Violations result in immediate denial.
  - `WARN` (amber) — Violations are logged but execution is permitted.
  - `ESCALATE` (blue) — Violations trigger human approval before execution.
- **Enabled/Disabled Toggle** — Policies can be enabled or disabled without deletion.
- **Delete** — Permanently removes the policy. This action is recorded in the audit log.

### Creating a Policy

The policy creation dialog collects:

- **Policy Name** — A descriptive identifier (e.g., "File System Access Control").
- **Description** — An explanation of what the policy governs and its intended scope.
- **Enforcement Mode** — The enforcement behavior when a violation is detected.
- **Rules** — The rule set is initialized as empty and can be configured after creation.

Policy creation and modification events are recorded in the audit log with the actor, target, and timestamp.

## Audit Log Page

The audit log page displays a complete, chronological record of all governance actions. This is the primary interface for reviewing operational history and investigating incidents.

### Log Table

The audit log is presented as a table with the following columns:

| Column    | Description                                                                                          |
| --------- | ---------------------------------------------------------------------------------------------------- |
| Timestamp | ISO 8601 timestamp of when the event occurred, displayed in local time.                              |
| Action    | The governance action (e.g., `user.register`, `policy.create`, `policy.run.allow`, `policy.delete`). |
| Actor     | The user or agent that performed the action.                                                         |
| Target    | The resource affected by the action (policy ID, user ID, or similar identifier).                     |
| Level     | Severity indicator: green (info), amber (warn), red (error).                                         |

### CSV Export

The audit log can be exported as a CSV file for external analysis, archival, or compliance review. The export includes all visible entries with the following fields:

- Timestamp (ISO 8601)
- Action
- Actor
- Target
- Level

The exported file is named with the current date: `atlasbridge-audit-YYYY-MM-DD.csv`.

## Sessions and Runs

Policy runs represent individual evaluation events where an agent command was assessed against the active policy set. The dashboard displays runs in context within the overview page and audit log.

Each run record contains:

- **Command** — The exact command string submitted by the agent.
- **Agent** — The identifier of the agent that submitted the command.
- **Policy** — The policy that was evaluated (if applicable).
- **Decision** — The outcome: `allow`, `deny`, or `escalate`.
- **Reason** — A human-readable explanation of why the decision was made.
- **Duration** — The time taken for evaluation, in milliseconds.
- **Timestamp** — When the evaluation occurred.

## Risk Visibility

The dashboard surfaces risk-related information through the decision outcomes displayed in policy runs. Commands that are denied or escalated indicate higher risk evaluations. The enforcement mode of each policy determines how risk boundaries are applied:

- Policies in `strict` mode represent hard risk boundaries — violations are denied.
- Policies in `warn` mode represent advisory risk signals — violations are logged for review.
- Policies in `escalate` mode represent conditional risk boundaries — violations require human judgment.

The ratio of allowed to denied/escalated runs, visible in the overview metrics, serves as a governance health indicator for the workspace.

## Governance Score

The overview metrics collectively provide a governance posture summary:

- A high ratio of active policies to total policies indicates consistent governance coverage.
- A low denied/escalated rate relative to total runs suggests well-calibrated policies that permit legitimate operations while catching violations.
- A high denied/escalated rate may indicate overly restrictive policies or agents operating outside defined boundaries.

These metrics are not prescriptive — interpretation depends on the operational context and risk tolerance of the deployment.

## Navigation

The dashboard navigation bar provides consistent access to all sections:

- **Dashboard** — Overview page with summary metrics and recent activity.
- **Policies** — Policy management interface.
- **Audit Log** — Complete governance event history.

The navigation bar also displays the authenticated username and provides a logout action. All navigation and authentication state changes are recorded in the audit log.

## See Also

- [CLI Reference](./cli-reference.md) — Command-line interface for programmatic access
- [Audit Log](./audit-log.md) — Audit log structure and integrity verification
- [Policy Engine](./policy-engine.md) — Policy DSL and rule matching
- [Cloud Observe Mode](./cloud-observe-mode.md) — Observe-only cloud access to dashboard data
