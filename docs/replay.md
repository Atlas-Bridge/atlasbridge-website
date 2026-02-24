# Replay

AtlasBridge's replay system enables deterministic reconstruction of past governance sessions from the audit log. Replay allows operators to review the exact sequence of policy evaluations, decisions, and escalations that occurred during a given time window or agent session — and to evaluate how different policy configurations would have changed the outcome.

## Purpose

Replay serves three distinct operational needs:

1. **Incident investigation**: When a governance failure or unexpected decision occurs, replay reconstructs the exact sequence of events that led to the outcome.
2. **Policy validation**: Before deploying policy changes, operators can replay historical sessions against proposed policy versions to observe the effect.
3. **Compliance evidence**: Replay produces a verifiable, ordered trace of governance activity suitable for review by auditors or compliance stakeholders.

## Session Trace

A session trace is an ordered sequence of audit log entries associated with a single agent session or a defined time window. The trace includes:

- All policy evaluation events (allow, deny, escalate)
- Escalation triggers and human responses
- Override decisions and their justifications
- Policy state at the time of each evaluation

### Trace Reconstruction

Replay reconstructs a session trace by:

1. Querying the audit log for all entries matching the specified agent identifier or time range.
2. Ordering entries chronologically by `createdAt` timestamp.
3. Resolving the policy version active at each evaluation point.
4. Presenting the ordered sequence with full event metadata.

```
Session: cursor-agent | 2025-01-15 14:00 – 14:45 UTC
─────────────────────────────────────────────────────
14:02:11  policy.run.allow   cmd="git status"           policy=default-v3
14:05:33  policy.run.allow   cmd="cat src/index.ts"     policy=default-v3
14:12:07  policy.run.escalate cmd="npm install axios"   policy=default-v3
14:12:45  escalation.approve  approver=admin             override=false
14:18:22  policy.run.deny    cmd="rm -rf node_modules"  policy=default-v3
14:30:01  policy.run.allow   cmd="git diff"             policy=default-v3
```

## Deterministic Replay

Because AtlasBridge evaluates policies deterministically — the same input, policy state, and risk classification always produce the same decision — replay can guarantee that re-evaluation of a historical event against the same policy version will yield the identical result.

This property enables:

- **Verification**: Confirming that a past decision was correct given the policy state at the time.
- **Debugging**: Identifying which specific rule or risk threshold caused an unexpected decision.
- **Regression testing**: Ensuring that policy changes do not inadvertently alter decisions for previously evaluated commands.

### Requirements for Deterministic Replay

Deterministic replay depends on:

- Complete audit log entries with full event metadata
- Policy version history (the exact policy definition active at each evaluation point)
- Risk classification inputs (command text, target directory, environment tags)

## Counterfactual Evaluation (Roadmap)

Counterfactual evaluation extends replay by answering "what if" questions: given a historical session, what decisions would have been made under a different policy configuration?

### Use Cases

- **Policy testing**: Before deploying a new policy version, replay historical sessions to identify decisions that would change.
- **Risk tuning**: Adjust risk thresholds and observe the effect on past evaluations without impacting live operations.
- **Escalation analysis**: Determine whether a proposed policy change would have prevented a past escalation or introduced new ones.

### Workflow (Planned)

```
1. Select a historical session or time range
2. Provide the candidate policy version
3. Re-evaluate each event against the candidate policy
4. Compare decisions: original vs. candidate
5. Report differences with full context
```

Example output:

```
Counterfactual: default-v3 → default-v4
──────────────────────────────────────────
14:12:07  cmd="npm install axios"
          Original:  escalate (risk=medium, rule=package-install)
          Candidate: allow    (risk=low, rule=package-install-revised)

14:18:22  cmd="rm -rf node_modules"
          Original:  deny     (risk=high, rule=destructive-commands)
          Candidate: deny     (risk=high, rule=destructive-commands)
          No change.

Summary: 1 of 5 decisions changed. 0 new denials. 1 escalation removed.
```

This feature is not yet implemented. It is planned as part of the policy versioning and replay infrastructure.

## Policy Version Comparison (Roadmap)

Policy version comparison provides a structured diff between two policy versions, showing:

- Rules added, removed, or modified
- Changes to risk thresholds or enforcement modes
- Affected command categories

Combined with counterfactual evaluation, policy version comparison allows operators to understand both the structural differences between policy versions and the practical impact of those differences on historical governance decisions.

### Comparison Output (Planned)

```
Policy: default
Version: v3 → v4
───────────────────────────
Added:    rule "allow-dev-dependencies" (risk=low)
Modified: rule "package-install" threshold medium → low
Removed:  rule "legacy-npm-audit" (deprecated)
Unchanged: 12 rules
```

## Current Implementation Status

| Feature                      | Status      |
| ---------------------------- | ----------- |
| Audit log query and ordering | Implemented |
| Session trace reconstruction | Implemented |
| Deterministic re-evaluation  | Roadmap     |
| Counterfactual evaluation    | Roadmap     |
| Policy version comparison    | Roadmap     |
| Replay CLI command           | Roadmap     |
| Replay dashboard view        | Roadmap     |

Session trace reconstruction is available through the audit log query interface. Full deterministic replay with re-evaluation and counterfactual analysis is planned for a future release.

## Integration

- The replay system reads from the [Audit Log](./audit-log.md) as its primary data source.
- Policy versions are resolved from the [Policy Engine](./policy-engine.md) version history.
- Risk classifications are reproduced using the [Risk Engine](./risk-engine.md).
- Escalation events in the trace are documented in [Escalation](./escalation.md).

---

[Back to Documentation Index](./index.md)
