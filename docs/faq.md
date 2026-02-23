# Frequently Asked Questions

## General

### What is AtlasBridge?

AtlasBridge is a deterministic governance runtime for AI CLI agents. It evaluates agent actions against a defined policy set, classifies risk, enforces escalation when thresholds are exceeded, and records every decision in an append-only audit log. It is designed to provide structured oversight for autonomous agent operations.

See [Overview](./overview.md) for a full description.

### Is AtlasBridge a SaaS product?

No. AtlasBridge is designed for local-first execution. All policy evaluation, risk classification, and command enforcement occur within the local execution boundary. Cloud integration, when enabled, is limited to observe-only telemetry — no remote execution or policy override occurs from the cloud.

See [Cloud Observe Mode](./cloud-observe-mode.md) for details on the cloud architecture.

### Does AtlasBridge execute commands remotely?

No. AtlasBridge does not execute commands on remote systems. It operates as a governance layer within the local environment where the AI agent is running. The runtime evaluates and enforces policy locally. It does not receive, queue, or execute instructions from external sources.

### Is AtlasBridge tied to a specific AI model or provider?

No. AtlasBridge is model-agnostic. It operates at the command execution layer, evaluating the actions that an agent attempts to perform regardless of which AI model generated those actions. Any CLI agent that routes its commands through AtlasBridge is subject to governance evaluation.

### Is AtlasBridge open source?

Yes. AtlasBridge is open source and available for inspection, modification, and self-hosted deployment. There is no proprietary runtime component required for governance evaluation.

## Policy Engine

### How are policies defined?

Policies are defined in a human-readable DSL using YAML configuration files. Each policy specifies match conditions (command patterns, target paths, environment tags), an enforcement mode (strict, warn, or escalate), and the action to take when a match occurs.

See [Policy Engine](./policy-engine.md) for the full DSL reference.

### Are policy evaluations deterministic?

Yes. Given the same policy version, the same input action, and the same environmental context, AtlasBridge produces the same governance decision every time. There is no probabilistic reasoning, model inference, or non-deterministic logic in the evaluation path. This is a core design principle.

### Can I test policies before deploying them?

Yes. Policies can be tested against historical sessions using the replay system to verify that they produce expected outcomes before being deployed to a production workspace. Additionally, the CLI provides a `policy test` command for evaluating policies against specific inputs.

See [CLI Reference](./cli-reference.md) for testing commands and [Replay](./replay.md) for session-based policy testing.

### What happens if no policy matches an action?

When no policy rule matches an incoming action, the default fallback behavior applies. The default can be configured as `allow`, `deny`, or `escalate` depending on the organization's risk tolerance. In most production configurations, the recommended default is `escalate`.

### Can policies be versioned?

Yes. Every policy change is recorded with a version identifier, timestamp, and author. Policy versions can be pinned in production to prevent unintended behavioral changes. See [Enterprise Guide](./enterprise-guide.md) for policy version pinning.

## Risk Engine

### How is risk scored?

Risk scoring is based on a deterministic evaluation of multiple factors: the command being executed, the target path or resource, environment sensitivity tags, and configured risk modifiers. Each factor contributes to a numeric risk score that is compared against the configured threshold.

See [Risk Engine](./risk-engine.md) for the scoring methodology.

### What is the blast radius?

Blast radius is a classification of the potential impact scope of an action. A command that affects a single file has a smaller blast radius than a command that modifies system-wide configuration. Blast radius contributes to the overall risk score.

See [Glossary](./glossary.md) for the formal definition.

### Can risk thresholds be customized?

Yes. Risk thresholds are configurable per workspace and can be segmented by environment (production, staging, development) and team role. Lower thresholds trigger escalation more frequently; higher thresholds allow more actions to proceed without human review.

## Escalation

### What triggers an escalation?

An escalation is triggered when a policy evaluation results in an `escalate` decision. This occurs when the action's risk score exceeds the configured threshold, when the action matches a policy rule with `escalate` enforcement, or when the default fallback is set to `escalate` and no specific policy matches.

See [Escalation](./escalation.md) for the full trigger specification.

### What happens during an escalation?

When an escalation is triggered, execution is paused. The action details, risk assessment, and relevant context are presented to a human operator through the configured escalation channel (e.g., dashboard, Telegram). The operator can approve or deny the action. The decision and the operator's identity are recorded in the audit log.

### Can escalations be auto-approved?

No. Escalations require explicit human approval by design. Automatic approval would undermine the purpose of the escalation mechanism. If actions are being escalated too frequently, the appropriate response is to adjust risk thresholds or refine policy rules — not to bypass human review.

## Audit Log

### Is the audit log tamper-evident?

The audit log is append-only. Entries cannot be modified or deleted through normal operation. Integrity verification is supported through hash chaining, where each entry includes a hash of the previous entry, enabling detection of any gaps or modifications in the log sequence.

See [Audit Log](./audit-log.md) for details on integrity verification.

### Can audit logs be exported?

Yes. Audit logs can be exported in CSV and JSON formats, filtered by time range, workspace, action type, decision outcome, and other fields. Exports are suitable for ingestion into SIEM systems, compliance platforms, or internal review tools.

### How long are audit logs retained?

Retention is determined by your database storage and backup configuration. AtlasBridge does not automatically delete audit log entries. Retention policies should be configured based on your organization's requirements.

## Replay

### What is deterministic replay?

Deterministic replay allows you to re-evaluate a historical session against a policy set — either the original policy version or a different one. Because evaluation is deterministic, replaying a session with the same policy version produces the same sequence of decisions. Replaying with a modified policy enables counterfactual analysis.

Note: Replay functionality is on the product roadmap. See [Replay](./replay.md) for the planned capabilities.

### Can replay be used for policy testing?

Yes. Replay against historical sessions is one of the primary methods for validating policy changes before production deployment. By replaying past sessions with a proposed policy version, you can observe how the new policy would have affected governance decisions.

## Dashboard

### What does the dashboard show?

The dashboard provides operational visibility into governance activity: evaluation volume, escalation rates, risk score distributions, policy coverage, and governance metrics. It is an operator console, not a control plane — it does not issue commands or modify policy.

See [Dashboard](./dashboard.md) for the full feature description.

### Can the dashboard control agent execution?

No. The dashboard is read-only with respect to agent execution. It displays governance data and metrics. Policy management (create, edit, disable) is available through the dashboard, but the dashboard does not execute, queue, or schedule agent actions.

## Deployment

### What are the infrastructure requirements?

AtlasBridge requires Node.js, PostgreSQL 14+, and minimal compute resources (1 CPU core, 256 MB memory minimum). It is designed for lightweight local execution alongside the AI agent it governs.

See [Installation](./installation.md) for setup requirements and [Enterprise Guide](./enterprise-guide.md) for production deployment guidance.

### Does AtlasBridge require an internet connection?

No. AtlasBridge operates entirely locally for core governance functions (policy evaluation, risk scoring, escalation, audit logging). An internet connection is only required if cloud observe mode is enabled for remote telemetry visibility.

## Related Documentation

- [Overview](./overview.md) — What AtlasBridge is and is not
- [Architecture](./architecture.md) — System components and execution boundaries
- [Glossary](./glossary.md) — Terminology and definitions
