# Escalation

Escalation is the mechanism by which AtlasBridge pauses autonomous agent execution and routes a decision to a human operator for explicit approval. Escalation is a core governance primitive — it ensures that high-risk, ambiguous, or policy-boundary actions are never executed without human oversight.

## When Escalation Occurs

Escalation is triggered when a policy evaluation determines that an agent action requires human review before proceeding. The specific conditions that trigger escalation are defined by the policy configuration and risk classification.

### Escalation Triggers

The following conditions can trigger escalation:

| Trigger                     | Description                                                            |
| --------------------------- | ---------------------------------------------------------------------- |
| **Risk threshold exceeded** | The computed risk score for a command exceeds the escalation threshold |
| **Policy enforcement mode** | The matching policy uses `escalate` enforcement rather than `strict`   |
| **Sensitive target**        | The command targets a directory or resource marked as sensitive        |
| **Unknown command pattern** | The command does not match any existing policy rule                    |
| **Autonomy mode boundary**  | The system is in `ASSIST` mode and the action requires `FULL` autonomy |

### Risk-Based Escalation

When the [Risk Engine](./risk-engine.md) classifies a command with a risk score above the escalation threshold but below the deny threshold, the action is escalated rather than automatically denied:

```
Risk Score Range     Decision
─────────────────────────────
0.0 – 0.3           allow
0.3 – 0.7           escalate
0.7 – 1.0           deny
```

The exact thresholds are configurable per policy. The ranges above are illustrative defaults.

### Policy-Based Escalation

Policies with `enforcement: "escalate"` route all matching commands to human review regardless of risk score. This is useful for categories of commands where organisational policy requires human sign-off regardless of technical risk:

```yaml
- name: "production-deployments"
  pattern: "deploy *"
  enforcement: escalate
  reason: "All production deployments require human approval"
```

## Escalation Flow

When escalation is triggered, the following sequence occurs:

```
Agent submits command
        │
        ▼
Policy Engine evaluates
        │
        ▼
Decision: ESCALATE
        │
        ▼
Agent execution paused
        │
        ▼
Escalation event recorded in audit log
        │
        ▼
Human operator notified
        │
        ▼
Operator reviews command + context
        │
        ├── APPROVE → Command executed, approval logged
        │
        └── REJECT  → Command blocked, rejection logged
```

### Pause Behaviour

When an action is escalated:

1. The agent's execution is suspended for the specific command. The agent does not proceed with the escalated action.
2. The escalation event is recorded in the [Audit Log](./audit-log.md) with full context.
3. The human operator is presented with the command, the triggering policy, the risk classification, and any relevant context.
4. The agent may continue executing other non-escalated commands if operating in a concurrent model.

## Human Approval

### Approval Context

When reviewing an escalated action, the operator sees:

- **Command**: The exact command the agent attempted to execute
- **Agent**: The agent identifier that initiated the action
- **Policy**: The policy and specific rule that triggered escalation
- **Risk score**: The computed risk classification
- **Risk factors**: The specific factors that contributed to the risk score (e.g., target directory sensitivity, command category)
- **Session history**: Recent commands from the same agent session for context

### Approval Actions

The operator can take one of the following actions:

| Action                | Effect                                                 |
| --------------------- | ------------------------------------------------------ |
| **Approve**           | The command is released for execution                  |
| **Reject**            | The command is permanently blocked for this request    |
| **Approve with note** | The command is approved with an attached justification |

Every approval or rejection is recorded as a separate audit log entry, creating a complete chain of accountability.

## Override Tracking

When a human operator approves an escalated action, this constitutes an override of the normal governance boundary. AtlasBridge tracks all overrides with the following metadata:

| Field           | Description                                        |
| --------------- | -------------------------------------------------- |
| `escalationId`  | Reference to the original escalation event         |
| `approver`      | The operator who approved or rejected the action   |
| `decision`      | `approve` or `reject`                              |
| `justification` | Optional free-text reason provided by the operator |
| `timestamp`     | When the override decision was made                |
| `originalRisk`  | The risk score that triggered the escalation       |

### Override Audit Trail

The override audit trail enables:

- **Accountability**: Every override is attributed to a specific operator.
- **Pattern analysis**: Identifying operators or command categories with high override frequency.
- **Policy refinement**: Commands that are routinely approved after escalation may indicate that the triggering policy is too restrictive and should be adjusted.
- **Incident review**: When investigating an incident, the override trail shows whether human approval preceded the problematic action.

## Escalation Graph

The escalation graph provides a visual representation of escalation patterns across the system. It aggregates escalation data to surface:

### Metrics

- **Escalation rate**: Percentage of total policy evaluations that result in escalation
- **Approval rate**: Percentage of escalated actions that are approved by operators
- **Mean response time**: Average time between escalation trigger and human decision
- **Escalation by policy**: Which policies generate the most escalations
- **Escalation by agent**: Which agents trigger the most escalations
- **Escalation by command category**: Which types of commands are most frequently escalated

### Operational Insights

The escalation graph helps operators answer questions such as:

- Are escalation rates increasing over time, suggesting policy drift or changing agent behaviour?
- Are specific policies generating excessive escalations, indicating they may need tuning?
- Are certain agents consistently triggering escalations, suggesting misconfiguration or scope creep?
- Is the mean response time for human approval acceptable, or is it creating operational bottlenecks?

### Dashboard Integration

Escalation metrics are surfaced in the [Dashboard](./dashboard.md) governance overview, providing real-time visibility into escalation patterns. The dashboard displays:

- Active escalations awaiting human review
- Recent escalation decisions with context
- Trend charts for escalation rate and approval rate over time

## Escalation Configuration

Escalation behaviour is configured at the policy level:

```yaml
policies:
  - name: "filesystem-write"
    pattern: "write *"
    enforcement: escalate
    riskThreshold: 0.4
    escalation:
      notify: ["ops-team"]
      timeout: 300 # seconds before auto-reject
      requireJustification: true
```

### Configuration Options

| Option                            | Description                                                  | Default  |
| --------------------------------- | ------------------------------------------------------------ | -------- |
| `enforcement`                     | Set to `escalate` to enable escalation for matching commands | `strict` |
| `riskThreshold`                   | Risk score above which escalation is triggered               | `0.3`    |
| `escalation.notify`               | Groups or channels to notify on escalation                   | `[]`     |
| `escalation.timeout`              | Seconds before an unresolved escalation is auto-rejected     | `600`    |
| `escalation.requireJustification` | Require the operator to provide a reason for approval        | `false`  |

## Integration

- Escalation decisions are recorded in the [Audit Log](./audit-log.md).
- Risk scores that trigger escalation are computed by the [Risk Engine](./risk-engine.md).
- Escalation thresholds are defined in the [Policy Engine](./policy-engine.md).
- Escalation behaviour varies by [Autonomy Mode](./autonomy-modes.md) — in `OFF` mode, all actions are effectively escalated; in `FULL` mode, only high-risk actions trigger escalation.
- Escalation events appear in the [Replay](./replay.md) session trace.

---

[Back to Documentation Index](./index.md)
