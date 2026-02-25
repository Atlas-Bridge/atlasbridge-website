# Governance

AtlasBridge enforces governance over AI CLI agents through deterministic policy evaluation, structured escalation, and auditable decision records. This document describes the governance model, its design rationale, and how it operates in practice.

## Why Deterministic Governance

AI agents operating in infrastructure environments make decisions that affect production systems. Without governance, an agent may execute destructive commands, access sensitive directories, or bypass established change-management workflows.

Traditional approaches to governing automated systems rely on probabilistic controls—rate limiting, anomaly detection, or post-hoc review. These methods introduce uncertainty: the same input may produce different outcomes depending on timing, model state, or external factors.

AtlasBridge takes a different approach. Every agent command is evaluated against a defined policy set using deterministic logic. The same command, evaluated against the same policy version, produces the same decision every time. This property is essential for auditability, reproducibility, and trust.

## Governance Model

The AtlasBridge governance model consists of four components:

1. **Policy definitions** — structured rules that classify agent commands and assign enforcement behaviour
2. **Risk classification** — a scoring mechanism that evaluates the potential impact of a command based on its properties
3. **Escalation paths** — defined workflows for commands that require human review before execution
4. **Audit records** — append-only logs that capture every evaluation, decision, and override

These components operate together in a single evaluation pipeline. When an agent submits a command, the pipeline evaluates all applicable policies, computes a risk score, determines whether escalation is required, and records the outcome.

## Structured Policy

Policies in AtlasBridge are explicit, versioned, and human-readable. Each policy defines:

- A set of matching rules (command patterns, directory scopes, environment tags)
- An enforcement mode (`strict`, `warn`, or `escalate`)
- Enablement state

Policies are not inferred or learned. They are authored by operators and applied consistently. This ensures that governance behaviour is predictable and reviewable.

See [Policy Engine](./policy-engine.md) for details on the policy DSL and evaluation logic.

## Human Override

AtlasBridge supports human-in-the-loop decision-making through its escalation mechanism. When a command triggers an escalation-mode policy or exceeds a risk threshold, execution is paused until a human operator provides an explicit approval or denial.

Override decisions are recorded in the audit log with the identity of the approver and any attached rationale. This creates a traceable chain of accountability for every action that deviates from automated policy evaluation.

Overrides do not modify the underlying policy. They represent a one-time exception for a specific command in a specific context. To change ongoing behaviour, operators modify the policy definitions directly.

See [Escalation](./escalation.md) for details on escalation triggers and approval workflows.

## Execution Boundaries

AtlasBridge defines clear boundaries around what an agent is permitted to do:

- **Local execution** — all policy evaluation and decision-making occurs locally, within the operator's infrastructure. No commands are sent to external services for evaluation.
- **No implicit permissions** — an agent has no default authority to execute commands. All permissions are granted through explicit policy rules.
- **Fail-closed behaviour** — if no policy matches a command, the default behaviour is to deny execution. This prevents unclassified commands from bypassing governance.

These boundaries ensure that the governance system cannot be circumvented by novel or unexpected agent behaviour.

## Why Determinism Matters

Deterministic evaluation provides several properties that are difficult to achieve with probabilistic or heuristic-based systems:

**Reproducibility.** Given the same policy version and input, any evaluator produces the same decision. This allows operators to test policy changes against historical data and predict their effect.

**Auditability.** Every decision can be traced back to a specific policy rule and input. There are no hidden factors or model weights influencing the outcome.

**Predictability.** Operators can reason about how the system will behave in specific scenarios. This is critical when governing agents that interact with production infrastructure.

**Testability.** Policies can be validated against test cases before deployment. Operators can verify that a policy change produces the expected behaviour without running it in production.

## Governance Metrics

AtlasBridge tracks governance metrics to provide visibility into the system's operation:

- Total policy evaluations
- Decision distribution (allow, deny, escalate)
- Escalation rate and resolution time
- Policy coverage (percentage of commands matched by at least one rule)
- Override frequency

These metrics are available through the [Dashboard](./dashboard.md) and can be exported for external analysis.

## Related Documentation

- [Architecture](./architecture.md) — system design and component interactions
- [Policy Engine](./policy-engine.md) — policy definition and evaluation
- [Risk Engine](./risk-engine.md) — risk scoring and classification
- [Escalation](./escalation.md) — escalation triggers and human approval
- [Audit Log](./audit-log.md) — audit trail structure and integrity
