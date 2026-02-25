# Architecture

AtlasBridge is structured as a set of cooperating components that collectively enforce governance over AI CLI agent execution. This document describes the system architecture, execution boundaries, and data flow.

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     LOCAL EXECUTION BOUNDARY                    │
│                                                                 │
│  ┌──────────┐    ┌──────────────┐    ┌───────────────────────┐  │
│  │ AI Agent │───▶│  Policy      │───▶│  Risk Classification  │  │
│  │ (Claude, │    │  Evaluation  │    │  Engine               │  │
│  │  GPT,    │    │  Layer       │    │                       │  │
│  │  etc.)   │    └──────┬───────┘    └───────────┬───────────┘  │
│  └──────────┘           │                        │              │
│                         ▼                        ▼              │
│               ┌─────────────────┐     ┌──────────────────┐      │
│               │   Decision      │     │   Escalation     │      │
│               │   Engine        │◀────│   Mechanism      │      │
│               │                 │     │                  │      │
│               │  ALLOW │ DENY   │     │  ┌────────────┐  │      │
│               │  ESCALATE       │     │  │  Human     │  │      │
│               └────────┬────────┘     │  │  Operator  │  │      │
│                        │              │  └────────────┘  │      │
│                        ▼              └──────────────────┘      │
│               ┌─────────────────┐                               │
│               │  Command        │                               │
│               │  Execution      │                               │
│               └────────┬────────┘                               │
│                        │                                        │
│                        ▼                                        │
│               ┌─────────────────┐                               │
│               │  Audit Log      │                               │
│               │  (append-only)  │                               │
│               └─────────────────┘                               │
│                                                                 │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                   observe-only telemetry
                            │
                            ▼
                 ┌─────────────────────┐
                 │  Cloud Observe      │
                 │  (read-only)        │
                 │  - Dashboard        │
                 │  - Metrics          │
                 │  - Audit viewer     │
                 └─────────────────────┘
```

## Components

### Local Execution Boundary

The local execution boundary is the security perimeter within which all governance-critical operations occur. Policy evaluation, risk classification, decision-making, command execution, and audit logging all happen inside this boundary. No component outside the boundary can initiate or modify execution.

This boundary is enforced at the architectural level. The runtime does not expose execution APIs, does not accept remote commands, and does not delegate decisions to external services.

### Policy Evaluation Layer

The policy evaluation layer receives agent actions (commands, file operations, network requests) and evaluates them against the active policy set. Evaluation is deterministic: the same action evaluated against the same policy version produces the same result.

```
Agent Action
    │
    ▼
┌──────────────────────────────────┐
│        Policy Evaluation         │
│                                  │
│  1. Match action against rules   │
│  2. Apply rule precedence        │
│  3. Evaluate conditions          │
│  4. Determine action category    │
│  5. Return evaluation result     │
│                                  │
│  Result: ALLOW | DENY | ESCALATE │
└──────────────────────────────────┘
```

Policies are defined in a YAML-based DSL. The evaluator walks the rule set in precedence order, applies pattern matching against the action, evaluates any conditional expressions, and returns a deterministic result. If no rule matches, the default fallback policy applies (configurable; defaults to DENY).

See [Policy Engine](./policy-engine.md) for the full policy specification.

### Risk Classification Engine

The risk classification engine assigns a numeric risk score to each agent action based on:

- **Command type:** Destructive operations (e.g., `rm -rf`, `DROP TABLE`) score higher than read operations.
- **Target sensitivity:** Actions targeting configuration files, secrets, or system directories carry elevated risk.
- **Environment context:** Production environments are weighted higher than development or staging.
- **Blast radius:** Operations affecting multiple files, services, or systems score higher than isolated changes.

The risk score is used by the decision engine to determine whether an action should be automatically permitted, denied, or escalated.

```
┌──────────────────────────────────────────┐
│          Risk Classification             │
│                                          │
│  Input:  agent command + context         │
│                                          │
│  Factors:                                │
│    ├── Command type        (weight: 0.3) │
│    ├── Target sensitivity  (weight: 0.3) │
│    ├── Environment context (weight: 0.2) │
│    └── Blast radius        (weight: 0.2) │
│                                          │
│  Output: risk score (0.0 – 1.0)          │
│                                          │
│  Thresholds:                             │
│    0.0 – 0.3  LOW    → auto-permit       │
│    0.3 – 0.7  MEDIUM → policy-dependent  │
│    0.7 – 1.0  HIGH   → escalate          │
└──────────────────────────────────────────┘
```

See [Risk Engine](./risk-engine.md) for scoring details and threshold configuration.

### Escalation Mechanism

When the decision engine determines that an action requires human approval (based on policy evaluation, risk score, or autonomy mode), the escalation mechanism is activated.

Escalation pauses agent execution and sends a structured notification to the configured channel (e.g., Telegram). The notification includes the action details, risk assessment, and policy context. The human operator can then approve, deny, or modify the action. The operator's decision is recorded in the audit log along with the original escalation event.

```
Escalation Flow:

  Agent Action ──▶ Policy: ESCALATE
                        │
                        ▼
              ┌─────────────────┐
              │  Pause Agent    │
              │  Execution      │
              └────────┬────────┘
                       │
                       ▼
              ┌─────────────────┐
              │  Notify Human   │
              │  Operator       │
              │  (Telegram,     │
              │   etc.)         │
              └────────┬────────┘
                       │
              ┌────────┴────────┐
              │                 │
              ▼                 ▼
        ┌──────────┐     ┌──────────┐
        │ APPROVE  │     │  DENY    │
        └────┬─────┘     └────┬─────┘
             │                │
             ▼                ▼
        ┌──────────┐     ┌──────────┐
        │ Execute  │     │  Block   │
        │ Action   │     │  Action  │
        └────┬─────┘     └────┬─────┘
             │                │
             └────────┬───────┘
                      │
                      ▼
              ┌─────────────────┐
              │  Audit Log      │
              │  (record both   │
              │   escalation &  │
              │   decision)     │
              └─────────────────┘
```

See [Escalation](./escalation.md) for trigger conditions and override tracking.

### Audit Logging

Every governance event is recorded in an append-only audit log. The log captures:

- Policy evaluations (input, matched rule, result)
- Risk classifications (input, score, factors)
- Escalation events (trigger, notification, response)
- Operator decisions (approve, deny, override)
- Command executions (command, outcome, duration)

Entries are written sequentially and are immutable once written. The log supports integrity verification to detect tampering or truncation.

See [Audit Log](./audit-log.md) for event structure and export formats.

### Replay System (Roadmap)

The replay system enables deterministic re-evaluation of historical sessions. Given a recorded session trace and a policy version, the replay engine re-executes the evaluation pipeline and produces the same sequence of decisions. This supports:

- Post-incident review of agent behaviour
- Policy change impact analysis (counterfactual evaluation)
- Governance verification and testing

The replay system is on the pre-GA roadmap. See [Replay](./replay.md) for the planned specification.

### Cloud Observe Mode

Cloud observe mode provides read-only visibility into governance activity without granting any execution capability. When enabled, the local runtime streams telemetry (evaluation results, risk scores, audit events) to a cloud dashboard.

The cloud component cannot:

- Initiate or modify command execution
- Change policy definitions
- Override escalation decisions
- Access local secrets or credentials

This architecture ensures that cloud integration does not compromise the local execution boundary.

See [Cloud Observe Mode](./cloud-observe-mode.md) for configuration and security implications.

## Data Flow

The following sequence describes the end-to-end flow for a single agent action:

```
1. Agent submits action (command, file operation, etc.)
2. Policy evaluation layer matches action against active rules
3. Risk classification engine scores the action
4. Decision engine combines policy result and risk score:
   a. ALLOW → proceed to execution
   b. DENY  → block execution, log event
   c. ESCALATE → pause execution, notify operator
5. If escalated: operator approves or denies
6. If permitted: command executes within local boundary
7. Audit log records the complete evaluation chain
8. If cloud observe is enabled: telemetry is streamed (read-only)
```

## Technology Stack

- **Runtime:** Node.js / TypeScript
- **Backend:** Express.js with session-based authentication
- **Database:** PostgreSQL with Drizzle ORM
- **Frontend:** React, Tailwind CSS, shadcn/ui
- **Routing:** wouter (frontend), Express (backend)

See [Overview](./overview.md) for design principles and [Installation](./installation.md) for setup instructions. Return to the [documentation index](./index.md) for a full list of available guides.
