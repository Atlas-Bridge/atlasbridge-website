# Quick Start

This guide walks through a minimal working example: installing AtlasBridge, running a supervised agent session, observing a policy decision, triggering an escalation, and inspecting the audit log.

## Prerequisites

- AtlasBridge installed (see [Installation](installation.md))
- A PostgreSQL database running and `DATABASE_URL` set
- A terminal with shell access

## Step 1: Initialize a Project

Create a working directory and run the setup command:

```bash
mkdir my-project && cd my-project
atlasbridge setup
```

This creates the default directory structure:

```
my-project/
  .atlasbridge.yaml
  policies/
    default.yaml
```

The default policy file (`policies/default.yaml`) contains a starter rule set:

```yaml
version: "1"
rules:
  - name: allow-read-operations
    match:
      action: read
    decision: allow

  - name: escalate-write-operations
    match:
      action: write
    decision: escalate

  - name: deny-destructive-operations
    match:
      action: delete
    decision: deny
```

## Step 2: Run a Supervised Session

Start a supervised agent session in `assist` mode:

```bash
atlasbridge run claude --policy strict --mode assist
```

Expected output:

```
[SYSTEM] Supervisor initialized.
[POLICY] Loaded 3 rules from policies/default.yaml
[POLICY] Mode: ASSIST
[TRACE]  Local execution boundary verified.
[READY]  Awaiting agent actions...
```

AtlasBridge is now intercepting agent actions and evaluating each one against your policy rules before allowing execution.

## Step 3: Observe a Policy Decision

When the agent attempts a read operation (e.g., listing files), the policy engine evaluates the action deterministically:

```
[ACTION] Agent requested: read file "README.md"
[EVAL]   Rule matched: allow-read-operations
[RESULT] ALLOW — action executed locally.
```

The action is allowed because it matches the `allow-read-operations` rule. The decision is deterministic: the same input always produces the same output.

## Step 4: Trigger an Escalation

When the agent attempts a write operation, the policy engine triggers an escalation:

```
[ACTION] Agent requested: write file "config.json"
[EVAL]   Rule matched: escalate-write-operations
[RESULT] ESCALATE — awaiting human approval.
```

If you configured a Telegram or Slack channel, you receive a notification:

```
AtlasBridge Escalation
Action: write file "config.json"
Rule: escalate-write-operations
Session: abc-123
Reply APPROVE or DENY
```

If no channel is configured (default `stdout` mode), the escalation prompt appears in your terminal:

```
? Approve action "write file config.json"? (y/n):
```

Type `y` to approve, `n` to deny. The decision is recorded in the audit log.

## Step 5: Inspect the Audit Log

After the session, review the audit log:

```bash
atlasbridge log --last 10
```

Example output:

```
TIMESTAMP            SESSION   ACTION                RULE                       RESULT
2025-01-15T10:32:01  abc-123   read "README.md"      allow-read-operations      ALLOW
2025-01-15T10:32:14  abc-123   write "config.json"   escalate-write-operations  ESCALATE
2025-01-15T10:32:28  abc-123   write "config.json"   human-override             APPROVED
```

Each entry is appended to the log. Entries are immutable once written.

To export the audit log as CSV:

```bash
atlasbridge log --export csv --output audit-export.csv
```

## Step 6: Verify a Denied Action

Attempt a destructive action to observe a denial:

```
[ACTION] Agent requested: delete file "database.sql"
[EVAL]   Rule matched: deny-destructive-operations
[RESULT] DENY — action blocked.
```

The agent is prevented from executing the action. The denial is recorded in the audit log. No escalation is triggered for denied actions; the policy decision is final.

## Summary

This example demonstrated the core AtlasBridge workflow:

1. **Policy definition** — Rules are written in YAML and loaded at startup.
2. **Deterministic evaluation** — Every agent action is matched against rules. The same input always produces the same decision.
3. **Local execution** — All actions execute within the local boundary. Nothing is sent to a remote server for execution.
4. **Structured escalation** — Actions that require human judgment are paused and routed to a configured channel.
5. **Audit traceability** — Every decision is logged in an append-only audit trail.

## Next Steps

- [Policy Engine](policy-engine.md) — Learn the full policy DSL and rule matching logic.
- [Risk Engine](risk-engine.md) — Understand how risk scores influence decisions.
- [Autonomy Modes](autonomy-modes.md) — Configure `off`, `assist`, and `full` modes.
- [Audit Log](audit-log.md) — Audit log structure, integrity verification, and export.
