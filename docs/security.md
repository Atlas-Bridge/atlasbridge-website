# Security

AtlasBridge is designed to govern AI CLI agents operating in infrastructure environments where security is a primary concern. This document describes the security properties of the system, the architectural decisions that support them, and operational guidance for secure deployment.

## Local-First Architecture

All policy evaluation and decision-making in AtlasBridge occurs locally, within the operator's own infrastructure. Agent commands are never transmitted to external services for evaluation. This design eliminates several classes of risk:

- **Data exfiltration** — sensitive command content, directory paths, and environment details remain within the local boundary
- **External dependency** — governance decisions are not contingent on the availability or integrity of a remote service
- **Man-in-the-middle** — there is no network path between the agent and an external evaluator that could be intercepted

When cloud observe mode is enabled, AtlasBridge transmits read-only telemetry (decision summaries, aggregate metrics) to a central dashboard. No command content, secrets, or execution payloads are included in this telemetry. See [Cloud Observe Mode](./cloud-observe-mode.md) for details.

## Secret Handling

AtlasBridge requires API tokens and credentials for channel integrations (e.g., Telegram bot tokens) and database connections. The following practices apply:

- **Environment variables** — all secrets are loaded from environment variables. AtlasBridge does not read secrets from configuration files or command-line arguments.
- **No secret storage** — AtlasBridge does not persist secrets to disk, database, or log files. Secrets exist only in process memory during execution.
- **No secret logging** — the audit log and application logs are designed to exclude secret values. Policy evaluation inputs are logged, but environment variables and token values are redacted.

Operators should ensure that:

- Secrets are managed through a secrets manager or environment configuration that restricts access
- `.env` files, if used during development, are excluded from version control via `.gitignore`
- API tokens are scoped to the minimum required permissions

## Least Privilege

AtlasBridge operates on the principle of least privilege at multiple levels:

**Agent permissions.** Agents have no implicit permissions. Every command must be explicitly allowed by a policy rule. If no rule matches, the command is denied by default (fail-closed).

**User roles.** The system supports role-based access control. Users are assigned roles (`viewer`, `admin`) that determine their access to dashboard features, policy management, and audit log export. Authentication is handled through session-based login with password hashing (bcrypt).

**Database access.** The application connects to PostgreSQL using a single connection string. Operators should provision a database user with the minimum required permissions (read/write to application tables only).

## Audit Trace

Every policy evaluation, decision, escalation, and override is recorded in an append-only audit log. Each log entry includes:

- Timestamp
- Action type
- Actor identity
- Target resource
- Decision details
- Severity level

The audit log provides a complete record of all governance activity. It supports post-incident review, compliance evidence gathering, and operational diagnostics.

Audit log entries are stored in PostgreSQL and can be exported in CSV format for external analysis or archival. See [Audit Log](./audit-log.md) for details on the log structure and export functionality.

## Policy Validation

Policies are the primary security control in AtlasBridge. To ensure their correctness, the system provides:

- **Schema validation** — policy definitions are validated against a defined schema at creation time. Malformed policies are rejected before they can affect evaluation.
- **Enforcement modes** — policies specify an enforcement mode (`strict`, `warn`, `escalate`) that determines how matches are handled. This allows operators to introduce new policies in observation mode before enforcing them.
- **Enable/disable controls** — individual policies can be disabled without deletion, allowing operators to quickly respond to misconfigurations.

Operators should test policy changes against historical audit data before deploying them to production. The deterministic evaluation model ensures that test results are representative of production behavior.

## Risk Containment

The risk engine classifies commands based on their potential impact. High-risk commands trigger escalation, which pauses execution until a human operator provides explicit approval. This mechanism contains the blast radius of agent actions by:

- Preventing high-impact commands from executing without human review
- Providing operators with context (command details, risk score, matched policy) to make informed decisions
- Recording all escalation outcomes for accountability

Risk scoring considers command properties, directory sensitivity, and environment context. See [Risk Engine](./risk-engine.md) for details on the scoring model.

## Authentication and Session Management

AtlasBridge uses session-based authentication for the web dashboard:

- Passwords are hashed using bcrypt before storage
- Sessions are stored in PostgreSQL via `connect-pg-simple`
- Session cookies are configured with appropriate security flags
- Failed authentication attempts do not reveal whether a username exists

## Network Security

For production deployments, operators should:

- Deploy AtlasBridge behind a reverse proxy with TLS termination
- Restrict dashboard access to trusted networks or VPN
- Configure appropriate CORS policies if the dashboard is accessed from a different origin
- Monitor access logs for unauthorized access attempts

## Limitations

AtlasBridge governs agent commands at the policy evaluation layer. It does not:

- Sandbox agent execution at the operating system level
- Provide network-level isolation between agents
- Inspect the runtime behavior of executed commands after approval
- Guarantee that an agent cannot bypass the governance layer if it has direct access to the underlying system

Operators should deploy AtlasBridge as one component of a defense-in-depth strategy that includes OS-level access controls, network segmentation, and monitoring.

## Related Documentation

- [Architecture](./architecture.md) — system design and security boundaries
- [Governance](./governance.md) — governance model and execution boundaries
- [Audit Log](./audit-log.md) — audit trail and integrity verification
- [Cloud Observe Mode](./cloud-observe-mode.md) — telemetry scope and data boundaries
- [Compliance Alignment](./compliance-alignment.md) — governance workflows relevant to compliance efforts
