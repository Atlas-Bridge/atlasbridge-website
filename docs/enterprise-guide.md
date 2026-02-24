# Enterprise Guide

This guide covers production deployment patterns, multi-workspace configurations, and operational practices for running AtlasBridge at scale within enterprise environments.

## Multi-Workspace Usage

AtlasBridge supports independent governance configurations across multiple workspaces. Each workspace maintains its own policy set, risk thresholds, and audit log, enabling teams to operate under governance rules tailored to their operational context without affecting other teams.

### Workspace Isolation

Each workspace operates as an independent governance boundary:

- **Policy scope**: Policies are evaluated within the workspace where they are defined. A policy in Workspace A has no effect on evaluations in Workspace B.
- **Audit separation**: Audit logs are scoped to the workspace that generated them. Cross-workspace log aggregation is handled at the export layer, not within the runtime.
- **Risk configuration**: Risk thresholds and sensitivity classifications are configured per workspace.

### Recommended Structure

```
organization/
├── workspaces/
│   ├── infrastructure/
│   │   ├── policies/
│   │   └── config.yaml
│   ├── application-dev/
│   │   ├── policies/
│   │   └── config.yaml
│   └── data-engineering/
│       ├── policies/
│       └── config.yaml
└── shared/
    └── base-policies/
```

Shared base policies can be referenced by individual workspaces while allowing workspace-specific overrides.

## Policy Version Pinning

In production environments, policy changes should be versioned and pinned to prevent unintended behavioral changes during active operations.

### Version Pinning Configuration

```yaml
policy:
  version: "2.4.1"
  pin: true
  auto_update: false
```

When `pin` is enabled, the runtime uses the specified policy version regardless of newer versions being available. This ensures that governance behavior is predictable and changes are applied through an explicit update process.

### Policy Promotion Workflow

1. **Draft**: New or modified policies are authored and reviewed in a staging workspace.
2. **Test**: Policies are evaluated against historical sessions using replay to verify expected outcomes.
3. **Approve**: Policy changes are reviewed and approved through the organization's change management process.
4. **Pin**: The approved policy version is pinned in the production workspace configuration.
5. **Deploy**: The updated configuration is applied to the production workspace.

### Version History

Every policy version is recorded with a timestamp, author, and diff from the previous version. This enables precise identification of which policy version was active during any historical evaluation.

## Risk Segmentation

Enterprise deployments benefit from segmenting risk configurations based on operational context. Different teams, environments, and infrastructure tiers have different risk profiles.

### Environment-Based Segmentation

```yaml
risk:
  segments:
    production:
      base_threshold: 0.3
      sensitive_paths:
        - /etc/
        - /var/lib/
        - /opt/production/
      restricted_commands:
        - rm -rf
        - DROP TABLE
        - systemctl stop
    staging:
      base_threshold: 0.6
      sensitive_paths:
        - /opt/staging/config/
      restricted_commands:
        - DROP TABLE
    development:
      base_threshold: 0.8
      sensitive_paths: []
      restricted_commands: []
```

### Team-Based Segmentation

Risk thresholds can be adjusted based on team role and responsibility scope:

| Team Role               | Suggested Threshold | Rationale                                          |
| ----------------------- | ------------------- | -------------------------------------------------- |
| Infrastructure          | 0.3                 | Direct access to production systems                |
| Application Development | 0.6                 | Primarily operates in staging/dev environments     |
| Data Engineering        | 0.4                 | Handles sensitive data pipelines                   |
| Security Operations     | 0.2                 | Highest sensitivity due to security tooling access |

These thresholds determine when escalation is triggered. Lower thresholds result in more frequent escalation and human review.

## Incident Response

AtlasBridge audit logs provide structured data for incident investigation. When an incident occurs, the audit trail enables precise reconstruction of the sequence of governance decisions.

### Investigation Workflow

1. **Identify timeframe**: Determine the time window relevant to the incident.
2. **Export audit logs**: Export logs for the relevant workspace and timeframe.
3. **Filter by action type**: Narrow the log to relevant action categories (e.g., escalations, overrides, denials).
4. **Trace session**: Follow the session identifier to reconstruct the full sequence of agent actions and governance decisions.
5. **Review policy version**: Confirm which policy version was active during the incident window.
6. **Evaluate counterfactuals** _(roadmap)_: Use replay to evaluate whether different policy configurations would have produced different outcomes.

### Audit Log Fields for Incident Review

| Field            | Purpose                                                  |
| ---------------- | -------------------------------------------------------- |
| `timestamp`      | When the evaluation occurred                             |
| `session_id`     | Groups related evaluations within a single agent session |
| `action`         | The agent command or action being evaluated              |
| `risk_score`     | The computed risk classification                         |
| `decision`       | The governance outcome (allow, deny, escalate)           |
| `policy_version` | The policy version used for evaluation                   |
| `escalation_id`  | Links to the escalation record if applicable             |
| `override_by`    | The operator who approved an override, if applicable     |

## Audit Export

Audit logs can be exported for integration with external systems, long-term archival, or compliance review.

### Export Formats

- **CSV**: Tabular export suitable for spreadsheet analysis and SIEM ingestion.
- **JSON**: Structured export preserving full event detail including nested fields.

### Export Filtering

Exports can be filtered by:

- Time range
- Workspace
- Action type
- Decision outcome
- Risk score range
- Session identifier

### Integration Patterns

| Target System                | Integration Method                                  |
| ---------------------------- | --------------------------------------------------- |
| SIEM (Splunk, Elastic)       | CSV or JSON export, ingested via file or API        |
| Ticketing (Jira, ServiceNow) | Escalation events forwarded via webhook _(roadmap)_ |
| Compliance platforms         | Periodic JSON export with integrity verification    |
| Internal dashboards          | Direct database query against audit log tables      |

## Governance Metrics

The AtlasBridge dashboard provides governance metrics that enable operational visibility into how the governance runtime is performing across workspaces.

### Key Metrics

| Metric                            | Description                                                             |
| --------------------------------- | ----------------------------------------------------------------------- |
| **Evaluation volume**             | Total number of policy evaluations over a given period                  |
| **Escalation rate**               | Percentage of evaluations that triggered escalation                     |
| **Override rate**                 | Percentage of escalations where a human operator approved the action    |
| **Denial rate**                   | Percentage of evaluations that resulted in action denial                |
| **Mean escalation response time** | Average time between escalation trigger and human response              |
| **Policy coverage**               | Percentage of observed action types covered by at least one policy rule |
| **Risk distribution**             | Distribution of risk scores across evaluations                          |

### Governance Score

The governance score is a composite metric reflecting overall governance posture. It is computed from:

- Policy coverage breadth
- Escalation response time
- Override frequency relative to escalation volume
- Audit log integrity status

The governance score is not a compliance certification. It is an operational indicator intended to help teams identify areas where governance coverage may need attention.

### Alerting

Governance metrics can be monitored for anomalies:

- Sudden increase in escalation rate may indicate a policy gap or environmental change.
- High override rate may suggest that risk thresholds are too conservative for the operational context.
- Gaps in audit log continuity may indicate a logging infrastructure issue.

## Deployment Considerations

### Resource Requirements

AtlasBridge is designed for lightweight local execution. Resource requirements scale with evaluation volume and audit log retention:

| Component         | Minimum                   | Recommended                 |
| ----------------- | ------------------------- | --------------------------- |
| CPU               | 1 core                    | 2 cores                     |
| Memory            | 256 MB                    | 512 MB                      |
| Disk (audit logs) | 1 GB per 100K evaluations | Depends on retention policy |
| PostgreSQL        | 14+                       | 15+                         |

### High Availability

AtlasBridge operates local-first. High availability is achieved through standard infrastructure practices:

- Multiple agent instances can operate independently with their own local AtlasBridge runtime.
- Audit logs can be aggregated centrally via export.
- Policy configurations can be distributed via configuration management tools.

### Backup and Recovery

- **Policies**: Store policy files in version control. Recovery is a configuration deployment.
- **Audit logs**: Back up the PostgreSQL database on a regular schedule. Audit log integrity can be verified after restoration.
- **Configuration**: Store workspace configurations in version control alongside policies.

## Related Documentation

- [Governance](./governance.md) — Governance philosophy and design principles
- [Security](./security.md) — Security model and operational boundaries
- [Audit Log](./audit-log.md) — Audit logging and integrity verification
- [Policy Engine](./policy-engine.md) — Policy DSL and evaluation
- [Dashboard](./dashboard.md) — Operator console and metrics visibility
- [Compliance Alignment](./compliance-alignment.md) — Compliance workflow considerations
