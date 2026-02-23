# Overview

## What AtlasBridge Is

AtlasBridge is a deterministic governance runtime that supervises AI CLI agents. It interposes a policy evaluation layer between an AI agent's intent and actual command execution, ensuring that every action is classified, evaluated, and either permitted, denied, or escalated to a human operator before it runs.

The runtime operates on a local-first execution model. All policy evaluation, risk classification, and command execution happen within the local environment. There is no remote execution path. Cloud integration, when enabled, is limited to observe-only telemetry — the cloud can see what happened, but it cannot initiate or modify execution.

AtlasBridge uses a deterministic policy model. Given the same input (agent command, policy version, environment context), the system produces the same evaluation result every time. This property is fundamental to auditability: reviewers can verify that a decision was correct by replaying the same inputs against the same policy and confirming the output matches.

The system supports structured human-in-the-loop escalation. When an agent action exceeds its authorized scope — as defined by policy rules, risk thresholds, or operational boundaries — execution pauses automatically and the decision is routed to a human operator through a configured channel (e.g., Telegram). The operator can approve, deny, or modify the action, and the decision is recorded in the audit log.

## What AtlasBridge Is Not

AtlasBridge is not a cloud execution platform. It does not run agent commands on remote servers or in hosted environments. Execution remains local.

AtlasBridge is not an AI model, chatbot, or conversational assistant. It does not generate responses, answer questions, or produce content. It governs the execution of agents that do.

AtlasBridge is not remote-control automation. It does not provide a mechanism for external systems to trigger commands on local machines. The control flow is strictly local-to-local.

AtlasBridge is not a black-box hosted service. The policy evaluation logic is transparent, deterministic, and inspectable. Policies are defined by the operator, not by the platform.

## Core Design Principles

**Local-first execution.** All policy evaluation and command execution occur within the local boundary. No agent action is ever routed through or executed by a remote system.

**Deterministic evaluation.** Policy decisions are reproducible. The same inputs always produce the same output, enabling verification, replay, and audit.

**Policy-driven control.** Agent behavior is governed by explicit, human-readable policy rules — not by probabilistic model outputs or opaque heuristics.

**Structured escalation.** When actions fall outside authorized scope, execution pauses and a human operator is consulted. Escalation is a first-class mechanism, not an error state.

**Audit traceability.** Every evaluation, decision, escalation, and override is recorded in an append-only log. The audit trail is the system of record for all governance activity.

See [Architecture](./architecture.md) for details on how these principles are implemented in the runtime. Return to the [documentation index](./index.md) for a full list of available guides.
