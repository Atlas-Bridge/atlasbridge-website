# Compliance Alignment

AtlasBridge provides governance workflows and audit capabilities that may support organisations in their compliance efforts. This document describes how specific features of AtlasBridge align with common compliance frameworks and where they may contribute to broader compliance programs.

**Important:** AtlasBridge is not a compliance product and does not certify, guarantee, or ensure compliance with any regulatory framework or standard. Compliance is an organisational responsibility that encompasses people, processes, and technology. AtlasBridge is one component that may contribute to a compliance program when deployed and operated appropriately.

## Governance Controls and Compliance Workflows

The following sections describe how AtlasBridge features relate to control objectives found in common compliance frameworks. These mappings are informational and do not constitute compliance advice.

### Access Control and Authorisation

AtlasBridge enforces explicit authorisation for agent commands through its policy evaluation pipeline. Every command must be permitted by a matching policy rule before execution is allowed.

Relevant framework areas:

- **ISO 27001 (A.9)** — Access control policies and procedures. AtlasBridge's policy-driven authorisation model provides a structured approach to controlling what actions AI agents can perform.
- **SOC 2 (CC6.1)** — Logical and physical access controls. The fail-closed default and role-based dashboard access support the principle of least privilege.

### Audit Trail

AtlasBridge maintains an append-only audit log of all policy evaluations, decisions, escalations, and overrides. Each entry includes a timestamp, actor identity, action type, and decision details.

Relevant framework areas:

- **ISO 27001 (A.12.4)** — Logging and monitoring. The audit log provides a record of governance-relevant events that can support monitoring and review activities.
- **SOC 2 (CC7.2)** — System monitoring. Audit log entries can be exported and integrated with external monitoring and alerting systems.

### Change Management

Policies in AtlasBridge are versioned and can be tested against historical data before deployment. The escalation mechanism provides a structured approval process for high-risk changes.

Relevant framework areas:

- **ISO 27001 (A.12.1.2)** — Change management. Policy versioning and testing capabilities support controlled change processes.
- **SOC 2 (CC8.1)** — Change management controls. The ability to review, test, and approve policy changes before enforcement supports change management workflows.

### Risk Assessment

The risk engine classifies agent commands based on their potential impact and triggers escalation for high-risk actions. Risk scoring considers command properties, directory sensitivity, and environment context.

Relevant framework areas:

- **ISO 27001 (A.8)** — Asset management and risk assessment. Risk classification provides a structured approach to evaluating the potential impact of agent actions.
- **SOC 2 (CC3.2)** — Risk assessment processes. The risk engine provides automated risk evaluation that can feed into broader risk assessment activities.

### Incident Response

Audit logs, escalation records, and decision traces provide the evidence base for investigating governance-related incidents. Audit data can be exported for external analysis.

Relevant framework areas:

- **ISO 27001 (A.16)** — Information security incident management. Audit records support incident investigation and root cause analysis.
- **SOC 2 (CC7.3, CC7.4)** — Incident detection and response. Decision traces and escalation records provide evidence for incident timelines.

## What AtlasBridge Provides

The following capabilities may contribute to compliance programs:

| Capability                        | Description                                                                                                |
| --------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Deterministic policy evaluation   | Same input and policy version produce the same decision, supporting reproducibility and evidence gathering |
| Append-only audit log             | Chronological record of all governance actions, exportable in CSV format                                   |
| Role-based access control         | Dashboard access restricted by user role (viewer, admin)                                                   |
| Escalation with approval tracking | High-risk actions require explicit human approval with recorded rationale                                  |
| Fail-closed default               | Unmatched commands are denied, preventing unauthorised actions                                             |
| Local-first execution             | Policy evaluation occurs locally without transmitting sensitive data externally                            |
| Policy versioning                 | Policies can be reviewed, tested, and tracked over time                                                    |

## What AtlasBridge Does Not Provide

To set appropriate expectations:

- AtlasBridge does not perform compliance assessments or gap analyses
- AtlasBridge does not generate compliance reports in framework-specific formats
- AtlasBridge does not monitor compliance status or provide compliance scoring
- AtlasBridge does not replace the need for organisational policies, training, or process documentation
- AtlasBridge has not been independently audited against any compliance framework
- Use of AtlasBridge does not imply or guarantee compliance with any standard

## Integrating AtlasBridge into a Compliance Program

Organisations seeking to incorporate AtlasBridge into their compliance programs should:

1. **Map controls** — identify which organisational controls AtlasBridge supports and document how the tool is used within each control's implementation
2. **Define retention** — establish audit log retention policies that align with regulatory and framework requirements
3. **Document procedures** — create operational procedures for policy management, escalation handling, and audit log review
4. **Review regularly** — periodically review policy configurations, escalation outcomes, and audit logs as part of ongoing compliance monitoring
5. **Maintain evidence** — export and archive audit logs according to organisational retention schedules

## Related Documentation

- [Governance](./governance.md) — governance model and deterministic evaluation
- [Security](./security.md) — security architecture and operational guidance
- [Audit Log](./audit-log.md) — audit trail structure and export
- [Risk Engine](./risk-engine.md) — risk classification and scoring
- [Escalation](./escalation.md) — escalation triggers and approval workflows
