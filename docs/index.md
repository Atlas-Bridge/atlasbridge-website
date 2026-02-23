# AtlasBridge

AtlasBridge is a deterministic governance runtime for AI CLI agents. It addresses a fundamental challenge in autonomous AI systems: ensuring that agents operating in production environments remain subject to structured, auditable, and predictable oversight. Without governance infrastructure, AI agents execute commands with unchecked autonomy, creating risk exposure that is difficult to observe, contain, or review after the fact.

AtlasBridge provides a policy-driven execution layer that evaluates every agent action against a deterministic rule set before permitting execution. Policies are defined in a human-readable DSL, evaluated locally, and enforced consistently regardless of the underlying AI model. When an action exceeds the boundaries defined by policy — based on risk classification, target sensitivity, or operational context — AtlasBridge triggers structured escalation, pausing execution and routing the decision to a human operator for explicit approval.

Every evaluation, decision, escalation, and override is recorded in an append-only audit log with integrity verification. This produces a complete, tamper-evident trail of all governance activity — suitable for internal review, incident investigation, and alignment with compliance workflows. AtlasBridge operates local-first by design: all policy evaluation and command execution occur within the local boundary, with cloud integration limited to observe-only telemetry when enabled.

## Documentation

- [Overview](./overview.md) — What AtlasBridge is, what it is not, and core design principles
- [Architecture](./architecture.md) — System components, execution boundaries, and data flow
- [Installation](./installation.md) — Setup and environment configuration
- [Quick Start](./quickstart.md) — Minimal working example
- [Policy Engine](./policy-engine.md) — Policy DSL, rule matching, and evaluation
- [Risk Engine](./risk-engine.md) — Risk scoring and command classification
- [Autonomy Modes](./autonomy-modes.md) — OFF, ASSIST, and FULL mode definitions
- [Audit Log](./audit-log.md) — Append-only logging and integrity verification
- [Replay](./replay.md) — Deterministic replay and session trace
- [Escalation](./escalation.md) — Human-in-the-loop triggers and override tracking
- [CLI Reference](./cli-reference.md) — Commands, flags, and usage examples
- [Dashboard](./dashboard.md) — Operator console and governance visibility
- [Cloud Observe Mode](./cloud-observe-mode.md) — Observe-only cloud architecture
- [Governance](./governance.md) — Deterministic governance philosophy
- [Security](./security.md) — Security model and threat boundaries
- [Compliance Alignment](./compliance-alignment.md) — Governance workflows and compliance considerations
- [Enterprise Guide](./enterprise-guide.md) — Multi-workspace and production deployment
- [FAQ](./faq.md) — Frequently asked questions
- [Glossary](./glossary.md) — Terminology and definitions
