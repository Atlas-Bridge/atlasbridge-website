# Policy Engine

The AtlasBridge policy engine is a deterministic rule evaluation system that governs what actions an AI CLI agent is permitted to execute. Every agent command is evaluated against the active policy set before execution proceeds.

## Core Principles

- **Deterministic evaluation**: Given the same input and policy set, the engine always produces the same decision.
- **Local execution**: Policy evaluation runs entirely on the local machine. No external service is consulted during evaluation.
- **Fail-closed**: If no matching rule is found, the default behavior is to deny execution and escalate for human review.

## Policy Structure

A policy is a named collection of rules with an enforcement mode. Each policy contains:

| Field         | Type     | Description                                      |
|---------------|----------|--------------------------------------------------|
| `name`        | string   | Human-readable policy identifier                 |
| `description` | string   | Optional explanation of the policy's purpose      |
| `rules`       | array    | Ordered list of rule objects                      |
| `enforcement` | string   | One of `strict`, `warn`, or `escalate`            |
| `enabled`     | boolean  | Whether the policy is active during evaluation    |

## Rule Definition

Each rule within a policy specifies a matching condition and a resulting action. Rules are evaluated in order; the first matching rule determines the outcome.

### Example Policy (YAML representation)

```yaml
name: filesystem-protection
description: Restricts destructive filesystem operations
enforcement: strict
enabled: true
rules:
  - match:
      command: "rm -rf /*"
    action: deny
    reason: "Recursive root deletion is never permitted"

  - match:
      command_pattern: "rm -rf /home/*"
    action: escalate
    reason: "Home directory deletion requires human approval"

  - match:
      command_pattern: "rm *"
    action: warn
    reason: "File deletion flagged for review"

  - match:
      command_pattern: "chmod 777 *"
    action: deny
    reason: "World-writable permissions are not allowed"
```

### Rule Fields

| Field            | Type   | Description                                              |
|------------------|--------|----------------------------------------------------------|
| `match.command`  | string | Exact command string to match                            |
| `match.command_pattern` | string | Glob or pattern-based match against the command   |
| `action`         | string | One of `allow`, `deny`, `warn`, or `escalate`            |
| `reason`         | string | Human-readable explanation for the decision              |

## Evaluation Order

1. The agent submits a command for evaluation.
2. All enabled policies are loaded in creation order.
3. For each policy, rules are evaluated top-to-bottom.
4. The first matching rule produces the decision.
5. If no rule matches across all policies, the default action is `deny` with escalation.

```
Agent Command
     │
     ▼
┌─────────────┐
│ Load Active  │
│  Policies    │
└─────┬───────┘
      │
      ▼
┌─────────────┐     ┌──────────┐
│ Evaluate     │────▶│ Rule     │
│ Rules (order)│     │ Matched? │
└─────────────┘     └────┬─────┘
                         │
                    Yes  │  No
                    ┌────┘  └────┐
                    ▼            ▼
              ┌──────────┐  ┌──────────────┐
              │ Return    │  │ Next Rule /  │
              │ Decision  │  │ Default Deny │
              └──────────┘  └──────────────┘
```

## Enforcement Modes

Each policy operates in one of three enforcement modes:

### `strict`

The decision returned by the matching rule is enforced. If the decision is `deny`, the command is blocked. No override is available without changing the policy.

### `warn`

The decision is logged but execution is not blocked. This mode is useful for policy development and testing, allowing operators to observe what would be blocked without disrupting agent workflows.

### `escalate`

The decision triggers a human review workflow. The command is paused until a human operator approves or rejects execution. See [Escalation](escalation.md) for details.

## Rule Precedence

When multiple policies contain rules that match the same command:

1. Policies are evaluated in creation order.
2. The first matching rule across all policies wins.
3. More specific rules should be placed in earlier policies or higher in the rule list within a policy.

There is no implicit priority weighting. Rule order is the sole determinant of precedence.

## Default Fallback

If no rule in any active policy matches the submitted command, AtlasBridge applies a default `deny` decision. This ensures that unrecognized or novel commands are never silently permitted.

The default fallback also generates an audit log entry and, depending on the autonomy mode, may trigger escalation. See [Autonomy Modes](autonomy-modes.md).

## Policy Versioning

Policies are stored with their full rule set. When a policy is updated, the previous version is not automatically retained. For environments requiring version history:

- Export policies before modification using the audit log or API.
- Use external version control (e.g., Git) to track policy definition files.
- The audit log records all policy creation and modification events with the acting user.

## Related Documentation

- [Risk Engine](risk-engine.md) - How commands are classified by risk level
- [Autonomy Modes](autonomy-modes.md) - How autonomy settings interact with policy decisions
- [Escalation](escalation.md) - Human review workflow for flagged commands
- [Audit Log](audit-log.md) - Record of all policy evaluation outcomes
