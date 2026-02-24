# Audit Log

AtlasBridge maintains an append-only audit log that records every governance event — policy evaluations, escalation decisions, human overrides, policy changes, and authentication events. The audit log serves as the authoritative record of all actions taken within and against the governance runtime.

## Design Principles

The audit log is designed around three constraints:

1. **Append-only**: Events are inserted sequentially. No log entry is modified or deleted during normal operation.
2. **Structured events**: Every entry follows a consistent schema with typed fields, enabling programmatic analysis and filtering.
3. **Completeness**: All governance-relevant actions produce audit entries, including actions that result in denials or errors.

## Event Structure

Each audit log entry contains the following fields:

| Field       | Type        | Description                                                         |
| ----------- | ----------- | ------------------------------------------------------------------- |
| `id`        | `string`    | Unique identifier (UUID v4), generated at write time                |
| `action`    | `string`    | Event type identifier (e.g., `policy.create`, `policy.run.deny`)    |
| `actor`     | `string`    | The entity that initiated the action (username or agent identifier) |
| `target`    | `string`    | The resource affected by the action (policy ID, user ID, etc.)      |
| `details`   | `object`    | Structured metadata specific to the event type                      |
| `level`     | `string`    | Severity classification: `info`, `warn`, or `error`                 |
| `createdAt` | `timestamp` | Timestamp of the event in UTC                                       |

### Example Entry

```json
{
  "id": "a3f1c9e2-7b4d-4e8a-9f12-3c5d7e8b1a2f",
  "action": "policy.run.deny",
  "actor": "cursor-agent",
  "target": "policy-7d3a1b2c",
  "details": {
    "command": "rm -rf /var/data",
    "decision": "deny"
  },
  "level": "warn",
  "createdAt": "2025-01-15T14:32:07.000Z"
}
```

## Action Types

The following action types are recorded in the audit log:

| Action                | Level  | Description                            |
| --------------------- | ------ | -------------------------------------- |
| `user.register`       | `info` | New user account created               |
| `user.login`          | `info` | User authenticated successfully        |
| `policy.create`       | `info` | New policy created                     |
| `policy.update`       | `info` | Existing policy modified               |
| `policy.delete`       | `warn` | Policy removed from the system         |
| `policy.run.allow`    | `info` | Policy evaluation resulted in allow    |
| `policy.run.deny`     | `warn` | Policy evaluation resulted in deny     |
| `policy.run.escalate` | `warn` | Policy evaluation triggered escalation |

Policy deletion events are logged at `warn` level because they alter the governance posture of the system. Deny and escalate decisions are also logged at `warn` level to support filtering for high-priority review.

## Severity Levels

- **`info`**: Normal operational events. No action required.
- **`warn`**: Events that indicate elevated risk or governance-relevant decisions (denials, escalations, policy deletions).
- **`error`**: System failures or unexpected conditions during governance evaluation.

## Integrity Verification

### Hash Chain (Roadmap)

A planned enhancement is the addition of a cryptographic hash chain to the audit log. In this model, each log entry includes a hash computed from the entry contents and the hash of the preceding entry. This produces a tamper-evident chain: modifying or removing any entry invalidates all subsequent hashes.

The hash chain design will follow this structure:

```
entry[n].hash = SHA-256(entry[n].action + entry[n].actor + entry[n].target + entry[n].createdAt + entry[n-1].hash)
```

This feature is not yet implemented. The current audit log relies on database-level append-only semantics and access control for integrity.

### Verification Process (Roadmap)

Once the hash chain is implemented, verification will involve:

1. Reading the full audit log in chronological order.
2. Recomputing each entry's hash from its contents and the previous entry's hash.
3. Comparing the computed hash against the stored hash.
4. Reporting the first entry where the computed and stored hashes diverge, if any.

A divergence indicates that an entry was modified, inserted, or removed outside the normal append path.

## Querying the Audit Log

The audit log is accessible through the API at `GET /api/audit-logs`. The endpoint accepts a `limit` query parameter to control the number of entries returned (default: 100).

```
GET /api/audit-logs?limit=50
```

Results are returned in reverse chronological order (most recent first).

### Filtering

The dashboard provides filtering by:

- **Action type**: View only specific event categories (e.g., policy evaluations, authentication events).
- **Severity level**: Filter by `info`, `warn`, or `error`.
- **Time range**: Restrict results to a specific time window.

## Audit Export

The audit log supports export to CSV format through the dashboard interface. The exported file includes all fields for the selected entries, suitable for:

- Internal governance reviews
- Incident investigation and root cause analysis
- Providing evidence artifacts for compliance workflows
- Archival in external log management systems

### Export Format

The CSV export includes the following columns:

```
id,action,actor,target,details,level,createdAt
```

The `details` column contains the JSON-serialized metadata object.

## Retention

The current implementation retains all audit log entries indefinitely within the PostgreSQL database. For production deployments with high event volume, operators should consider:

- Periodic export and archival of older entries
- Database-level partitioning by time range
- External log shipping to dedicated log management infrastructure

## Integration with Other Components

The audit log is written to by multiple components:

- **Authentication**: Login and registration events
- **Policy management**: Create, update, and delete operations
- **Policy evaluation**: Every run decision (allow, deny, escalate)
- **Escalation**: Human approval and override events (see [Escalation](./escalation.md))

The audit log is consumed by:

- **Dashboard**: Real-time governance visibility (see [Dashboard](./dashboard.md))
- **Replay**: Session reconstruction from audit trail (see [Replay](./replay.md))

---

[Back to Documentation Index](./index.md)
