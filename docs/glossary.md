# Glossary

This glossary defines key terms used throughout the AtlasBridge documentation. Terms are listed alphabetically.

---

### Action

A command or operation that an AI agent attempts to execute. Actions are the input to the governance evaluation pipeline. Each action is evaluated against the active policy set before execution is permitted or denied.

### Append-Only Log

A log structure where entries can only be added, never modified or deleted. The AtlasBridge audit log uses this structure to ensure that the historical record of governance decisions is preserved intact. See [Audit Log](./audit-log.md).

### Audit Log

The persistent record of every governance evaluation, decision, escalation, and override performed by the AtlasBridge runtime. The audit log is append-only and supports integrity verification through hash chaining. See [Audit Log](./audit-log.md).

### Autonomy Mode

The operational mode that determines how much independent action an AI agent is permitted. AtlasBridge defines three autonomy modes: OFF, ASSIST, and FULL. See [Autonomy Modes](./autonomy-modes.md).

- **OFF**: All agent actions are denied. The agent cannot execute any commands.
- **ASSIST**: Agent actions are evaluated against policy. Actions within policy boundaries are permitted; others are escalated.
- **FULL**: Agent actions are evaluated but permitted unless explicitly denied by policy. Audit logging continues.

### Blast Radius

A classification of the potential impact scope of an action. Commands that affect a single file have a small blast radius. Commands that modify system-wide configuration, delete directories recursively, or alter database schemas have a large blast radius. Blast radius is a factor in risk score computation. See [Risk Engine](./risk-engine.md).

### Cloud Observe Mode

An optional operating mode where governance telemetry is transmitted to a cloud endpoint for remote visibility. In cloud observe mode, the cloud component is strictly read-only — it receives and displays data but cannot execute commands, modify policies, or override governance decisions. See [Cloud Observe Mode](./cloud-observe-mode.md).

### Decision

The outcome of a governance evaluation. Possible decisions are:

- **Allow**: The action is permitted to execute.
- **Deny**: The action is blocked from execution.
- **Escalate**: The action is paused pending human review and approval.

### Deterministic Evaluation

An evaluation process that produces the same output given the same inputs, every time. AtlasBridge policy evaluation is deterministic: the same action, evaluated against the same policy version with the same environmental context, always produces the same governance decision. There is no probabilistic reasoning or model inference in the evaluation path.

### Enforcement Mode

The behavior specified by a policy rule when a match occurs:

- **Strict**: Matching actions are denied without escalation.
- **Warn**: Matching actions are permitted but flagged in the audit log.
- **Escalate**: Matching actions are paused and routed to a human operator for approval.

### Environment Tag

A label applied to the execution environment (e.g., `production`, `staging`, `development`) that influences risk scoring and policy evaluation. Environment tags allow the same policy set to produce different governance behaviors based on operational context.

### Escalation

The process of pausing agent execution and routing a governance decision to a human operator for explicit approval or denial. Escalation is triggered when an action's risk score exceeds the configured threshold, when a policy rule specifies `escalate` enforcement, or when the default fallback is `escalate`. See [Escalation](./escalation.md).

### Escalation Channel

The communication mechanism through which escalation notifications are delivered to human operators. Supported channels include the AtlasBridge dashboard and messaging integrations (e.g., Telegram).

### Governance Decision

See [Decision](#decision).

### Governance Runtime

The execution environment that evaluates agent actions against policy and enforces governance decisions. AtlasBridge is a governance runtime — it sits between the AI agent and the system, intercepting actions for evaluation before they are executed.

### Governance Score

A composite metric reflecting the overall governance posture of a workspace. Computed from policy coverage, escalation response time, override frequency, and audit log integrity. The governance score is an operational indicator, not a compliance certification.

### Hash Chain

A data integrity mechanism where each audit log entry includes a cryptographic hash of the previous entry. This creates a chain where any modification to a historical entry invalidates the hash of all subsequent entries, enabling detection of tampering or gaps in the log sequence.

### Human-in-the-Loop

A design pattern where human judgment is required at specific decision points. In AtlasBridge, human-in-the-loop is implemented through the escalation mechanism: when an action exceeds governance boundaries, a human operator must explicitly approve or deny it before execution proceeds.

### Integrity Verification

The process of validating that the audit log has not been modified, truncated, or had entries inserted or removed. Integrity verification uses the hash chain to detect any inconsistencies in the log sequence.

### Local-First

A design principle where all critical operations occur within the local execution environment. In AtlasBridge, policy evaluation, risk scoring, enforcement, and audit logging all execute locally. No external service is required for governance decisions.

### Override

An action taken by a human operator to approve an escalated action that would otherwise be denied or held. Overrides are recorded in the audit log with the operator's identity and timestamp, maintaining full accountability.

### Policy

A set of rules that define governance behavior for specific action patterns. Policies specify which actions match, what enforcement mode applies, and under what conditions escalation is triggered. See [Policy Engine](./policy-engine.md).

### Policy DSL

The domain-specific language used to define AtlasBridge policies. The DSL uses YAML syntax and supports match conditions based on command patterns, target paths, environment tags, and risk thresholds. See [Policy Engine](./policy-engine.md).

### Policy Evaluation

The process of comparing an incoming agent action against the active policy set to determine the governance decision. Policy evaluation is deterministic and occurs locally.

### Policy Version

An identifier associated with a specific state of the policy configuration. Policy versions are recorded in the audit log alongside each evaluation, enabling precise identification of which rules were active at any point in time.

### Replay

The capability to re-evaluate a historical agent session against a policy set. Deterministic replay produces the same decisions when using the original policy version, or different decisions when evaluating against a modified policy — enabling counterfactual analysis and policy validation. Replay is on the product roadmap. See [Replay](./replay.md).

### Risk Score

A numeric value representing the assessed risk of an agent action. The risk score is computed deterministically from the command type, target path sensitivity, environment tags, and configured risk modifiers. Actions with risk scores exceeding the configured threshold trigger escalation. See [Risk Engine](./risk-engine.md).

### Risk Threshold

The configured boundary above which an action's risk score triggers escalation. Risk thresholds are configurable per workspace and can be segmented by environment and team role.

### Sensitive Path

A file system path or resource location that is classified as high-sensitivity in the risk configuration. Actions targeting sensitive paths receive elevated risk scores.

### Session

A sequence of agent actions that occur within a single operational context. Sessions group related actions for audit review, replay, and incident investigation.

### Telemetry

Operational data transmitted to the cloud observe endpoint when cloud observe mode is enabled. Telemetry includes governance metrics, evaluation summaries, and escalation events. Telemetry is read-only — it flows outward from the local runtime and does not enable remote control.

### Workspace

An isolated governance boundary within an AtlasBridge deployment. Each workspace maintains its own policies, risk configuration, and audit log. See [Enterprise Guide](./enterprise-guide.md) for multi-workspace usage.

---

## Related Documentation

- [Overview](./overview.md) — Core concepts and design principles
- [Architecture](./architecture.md) — System components and data flow
- [FAQ](./faq.md) — Frequently asked questions
