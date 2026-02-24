# Autonomy Modes

AtlasBridge operates in one of three autonomy modes that determine how much independent action an AI agent is permitted. The autonomy mode governs the relationship between risk assessment, policy evaluation, and human oversight.

## Mode Summary

| Mode     | Agent Authority         | Human Involvement                    |
| -------- | ----------------------- | ------------------------------------ |
| `OFF`    | No autonomous execution | All commands require approval        |
| `ASSIST` | Low-risk commands only  | Medium and above escalated           |
| `FULL`   | Low and medium commands | High-risk escalated, critical denied |

## OFF Mode

In `OFF` mode, the agent has no autonomous execution capability. Every command submitted by the agent is held for human review, regardless of risk score or policy evaluation.

**Behavior:**

- All commands are queued for human approval.
- No command executes without explicit human authorization.
- Policy evaluation still runs; results are logged but not acted upon.
- Risk scores are computed and recorded for audit purposes.

**Use case:** Initial deployment, high-security environments, or situations where full human control is required. This mode provides complete visibility into agent behavior before granting any autonomy.

```
Agent submits command
        │
        ▼
  ┌───────────┐
  │ Evaluate   │
  │ Policy &   │
  │ Risk Score │
  └─────┬─────┘
        │
        ▼
  ┌───────────┐
  │ HOLD for   │
  │ Human      │
  │ Approval   │
  └───────────┘
```

## ASSIST Mode

In `ASSIST` mode, the agent can autonomously execute commands classified as low risk (score 0–25). All other commands are escalated for human review.

**Behavior:**

- Low-risk commands (0–25): Executed automatically if permitted by policy.
- Medium-risk commands (26–50): Escalated for human approval.
- High-risk commands (51–75): Escalated for human approval.
- Critical-risk commands (76–100): Denied outright.

**Use case:** Standard operating mode for most deployments. The agent handles routine, low-impact operations while humans review anything with meaningful impact.

```
Agent submits command
        │
        ▼
  ┌───────────┐
  │ Evaluate   │
  │ Risk Score │
  └─────┬─────┘
        │
   ┌────┴────────────────┐
   │         │            │
   ▼         ▼            ▼
 Low      Medium/High  Critical
(0-25)    (26-75)      (76-100)
   │         │            │
   ▼         ▼            ▼
 Allow    Escalate      Deny
```

## FULL Mode

In `FULL` mode, the agent can autonomously execute commands classified as low or medium risk. High-risk commands are escalated, and critical-risk commands are denied.

**Behavior:**

- Low-risk commands (0–25): Executed automatically if permitted by policy.
- Medium-risk commands (26–50): Executed automatically if permitted by policy.
- High-risk commands (51–75): Escalated for human approval.
- Critical-risk commands (76–100): Denied outright.

**Use case:** Trusted environments where the agent has demonstrated reliable behavior and the operator is comfortable with a broader execution scope. Typically used in development environments or with well-tested policy sets.

```
Agent submits command
        │
        ▼
  ┌───────────┐
  │ Evaluate   │
  │ Risk Score │
  └─────┬─────┘
        │
   ┌────┴────────────┐
   │         │        │
   ▼         ▼        ▼
Low/Med    High    Critical
(0-50)    (51-75)  (76-100)
   │         │        │
   ▼         ▼        ▼
 Allow    Escalate   Deny
```

## Interaction with Policy Engine

The autonomy mode operates alongside the policy engine, not as a replacement. The evaluation order is:

1. **Risk engine** computes a risk score for the command.
2. **Autonomy mode** determines whether the risk level permits autonomous execution.
3. **Policy engine** evaluates the command against active rules.
4. The most restrictive outcome between autonomy mode and policy engine is applied.

If the autonomy mode would allow a command but a policy rule denies it, the command is denied. If a policy rule would allow a command but the autonomy mode requires escalation, the command is escalated.

```
Command
   │
   ▼
┌──────────┐    ┌──────────────┐    ┌──────────────┐
│ Risk     │───▶│ Autonomy     │───▶│ Policy       │
│ Engine   │    │ Mode Check   │    │ Evaluation   │
└──────────┘    └──────────────┘    └──────────────┘
                                           │
                                           ▼
                                    Most Restrictive
                                      Decision
```

## Escalation Conditions

Escalation occurs when a command falls into a risk range that the current autonomy mode does not permit for autonomous execution. The specific triggers are:

| Condition                                | Result   |
| ---------------------------------------- | -------- |
| OFF mode, any command                    | Escalate |
| ASSIST mode, risk score > 25             | Escalate |
| ASSIST mode, risk score > 75             | Deny     |
| FULL mode, risk score > 50               | Escalate |
| FULL mode, risk score > 75               | Deny     |
| Any mode, policy rule returns `escalate` | Escalate |
| Any mode, policy rule returns `deny`     | Deny     |

For details on the escalation workflow, see [Escalation](escalation.md).

## Changing Modes

The autonomy mode is a system-level setting. Changing the mode:

- Takes effect immediately for all subsequent command evaluations.
- Does not affect commands already in the escalation queue.
- Is recorded in the audit log with the identity of the operator who made the change.
- Requires appropriate user permissions (typically `admin` role).

## Recommendations

- Start with `OFF` mode when deploying AtlasBridge for the first time. Review agent behavior through the audit log before increasing autonomy.
- Move to `ASSIST` mode after establishing confidence in the policy set and agent behavior patterns.
- Use `FULL` mode only in environments with well-tested policies and established trust in the agent's operational scope.
- In production environments, `ASSIST` mode is generally the appropriate default.

## Related Documentation

- [Policy Engine](policy-engine.md) - How policies interact with autonomy decisions
- [Risk Engine](risk-engine.md) - How risk scores are computed
- [Escalation](escalation.md) - What happens when commands are escalated
- [Governance](governance.md) - Broader governance philosophy
