# CLI Reference

AtlasBridge provides a command-line interface for initialising workspaces, running policy evaluations, testing policies, and replaying sessions. All commands operate locally within the execution boundary.

## Global Options

| Flag                    | Description                                                   |
| ----------------------- | ------------------------------------------------------------- |
| `--config <path>`       | Path to configuration file. Defaults to `./atlasbridge.yaml`. |
| `--verbose`             | Enable verbose output for debugging.                          |
| `--quiet`               | Suppress non-essential output.                                |
| `--format <json\|text>` | Output format. Defaults to `text`.                            |
| `--no-color`            | Disable colored terminal output.                              |

## Commands

### `atlasbridge init`

Initialise a new AtlasBridge workspace in the current directory. Creates the default configuration file, policy directory, and audit log location.

```
atlasbridge init [--dir <path>]
```

**Flags:**

| Flag                | Description                                                                                 |
| ------------------- | ------------------------------------------------------------------------------------------- |
| `--dir <path>`      | Target directory. Defaults to current working directory.                                    |
| `--template <name>` | Use a predefined policy template (`minimal`, `standard`, `strict`). Defaults to `standard`. |

**Example:**

```bash
atlasbridge init --template strict
```

This creates:

- `atlasbridge.yaml` — workspace configuration
- `policies/` — directory for policy definitions
- `audit/` — directory for local audit log storage

### `atlasbridge run`

Evaluate a command against the active policy set. This is the primary entry point for agent integrations. The command is evaluated deterministically against all matching policies, a risk score is computed, and a decision is returned.

```
atlasbridge run <command> [flags]
```

**Flags:**

| Flag                | Description                                                      |
| ------------------- | ---------------------------------------------------------------- |
| `--agent <name>`    | Identifier for the agent submitting the command. Required.       |
| `--policy <id>`     | Evaluate against a specific policy only. Optional.               |
| `--env <key=value>` | Set environment tags for risk evaluation. Repeatable.            |
| `--dry-run`         | Evaluate without recording the result or enforcing the decision. |
| `--timeout <ms>`    | Maximum evaluation time in milliseconds. Defaults to `5000`.     |

**Example:**

```bash
atlasbridge run "rm -rf /tmp/build" --agent deployer --env environment=production
```

**Output (text):**

```
Decision: deny
Risk Score: 85
Policy: file-system-access-control
Reason: Destructive file operation in production environment
Duration: 12ms
```

**Output (json):**

```json
{
  "decision": "deny",
  "riskScore": 85,
  "policyId": "file-system-access-control",
  "reason": "Destructive file operation in production environment",
  "duration": 12,
  "agent": "deployer",
  "command": "rm -rf /tmp/build"
}
```

### `atlasbridge policy list`

List all policies in the workspace.

```
atlasbridge policy list [flags]
```

**Flags:**

| Flag                   | Description                                                |
| ---------------------- | ---------------------------------------------------------- |
| `--enabled`            | Show only enabled policies.                                |
| `--disabled`           | Show only disabled policies.                               |
| `--enforcement <mode>` | Filter by enforcement mode (`strict`, `warn`, `escalate`). |

**Example:**

```bash
atlasbridge policy list --enabled --format json
```

### `atlasbridge policy test`

Test a policy against a set of sample commands without recording results. Returns the evaluation outcome for each test case.

```
atlasbridge policy test <policy-file> [flags]
```

**Flags:**

| Flag              | Description                                                          |
| ----------------- | -------------------------------------------------------------------- |
| `--input <file>`  | Path to a test case file (YAML or JSON).                             |
| `--command <cmd>` | Single command to test. Repeatable.                                  |
| `--agent <name>`  | Agent identifier for test context. Defaults to `test-agent`.         |
| `--fail-on-deny`  | Exit with non-zero status if any test case is denied. Useful for CI. |

**Example:**

```bash
atlasbridge policy test policies/fs-access.yaml \
  --command "cat /etc/passwd" \
  --command "ls /tmp" \
  --agent ci-agent
```

**Output:**

```
Test 1: cat /etc/passwd
  Decision: deny
  Risk Score: 90
  Reason: Read access to sensitive system file

Test 2: ls /tmp
  Decision: allow
  Risk Score: 10
  Reason: Non-sensitive directory listing

Results: 1 allowed, 1 denied, 0 escalated
```

**Test case file format (YAML):**

```yaml
tests:
  - command: "cat /etc/passwd"
    expected: deny
  - command: "ls /tmp"
    expected: allow
  - command: "apt install nginx"
    expected: escalate
```

### `atlasbridge policy validate`

Validate policy syntax and rule structure without executing evaluations.

```
atlasbridge policy validate <policy-file>
```

**Example:**

```bash
atlasbridge policy validate policies/network-access.yaml
```

**Output:**

```
Policy: network-access
Rules: 4 defined
Syntax: valid
Warnings: 0
```

### `atlasbridge audit`

Query the local audit log.

```
atlasbridge audit [flags]
```

**Flags:**

| Flag                  | Description                                        |
| --------------------- | -------------------------------------------------- |
| `--limit <n>`         | Number of entries to return. Defaults to `50`.     |
| `--level <level>`     | Filter by log level (`info`, `warn`, `error`).     |
| `--action <pattern>`  | Filter by action pattern (supports glob matching). |
| `--agent <name>`      | Filter by agent identifier.                        |
| `--since <timestamp>` | Show entries after the given ISO 8601 timestamp.   |
| `--export <format>`   | Export results as `csv` or `json`.                 |

**Example:**

```bash
atlasbridge audit --level warn --since 2025-01-01T00:00:00Z --export csv > warnings.csv
```

### `atlasbridge audit verify`

Verify the integrity of the audit log by checking the hash chain.

```
atlasbridge audit verify [flags]
```

**Flags:**

| Flag          | Description                                  |
| ------------- | -------------------------------------------- |
| `--from <id>` | Start verification from a specific entry ID. |
| `--to <id>`   | End verification at a specific entry ID.     |

**Example:**

```bash
atlasbridge audit verify
```

**Output:**

```
Entries verified: 1,247
Chain status: intact
First entry: 2025-01-15T08:00:00Z
Last entry: 2025-06-20T14:32:00Z
```

### `atlasbridge replay`

> **Roadmap.** Deterministic replay is under active development. The command interface is defined here for reference.

Replay a recorded session using the policy version that was active at the time of execution, or against a different policy version for counterfactual analysis.

```
atlasbridge replay <session-id> [flags]
```

**Flags:**

| Flag                         | Description                                                     |
| ---------------------------- | --------------------------------------------------------------- |
| `--policy-version <version>` | Replay using a specific policy version instead of the original. |
| `--output <file>`            | Write replay results to a file.                                 |
| `--diff`                     | Show differences between original and replayed decisions.       |

**Example:**

```bash
atlasbridge replay session-abc123 --policy-version v2 --diff
```

### `atlasbridge status`

Display the current workspace status, including active policies, autonomy mode, and cloud observe connection state.

```
atlasbridge status
```

**Output:**

```
Workspace: /home/user/project
Config: atlasbridge.yaml
Autonomy Mode: ASSIST
Active Policies: 5 of 8
Audit Entries: 1,247
Cloud Observe: connected (read-only)
```

## Exit Codes

| Code | Meaning                                                                      |
| ---- | ---------------------------------------------------------------------------- |
| `0`  | Command completed successfully.                                              |
| `1`  | General error (invalid input, missing configuration).                        |
| `2`  | Policy evaluation resulted in `deny` (when `--fail-on-deny` is set).         |
| `3`  | Policy evaluation resulted in `escalate` and no human approval was received. |
| `10` | Audit log integrity verification failed.                                     |

## Environment Variables

| Variable                | Description                                                               |
| ----------------------- | ------------------------------------------------------------------------- |
| `ATLASBRIDGE_CONFIG`    | Path to configuration file. Overrides `--config` flag.                    |
| `ATLASBRIDGE_LOG_LEVEL` | Logging verbosity (`debug`, `info`, `warn`, `error`). Defaults to `info`. |
| `ATLASBRIDGE_AUDIT_DIR` | Directory for audit log storage. Overrides config value.                  |
| `DATABASE_URL`          | PostgreSQL connection string for persistent storage.                      |

## See Also

- [Installation](./installation.md) — Setup and environment configuration
- [Policy Engine](./policy-engine.md) — Policy DSL and rule matching
- [Risk Engine](./risk-engine.md) — Risk scoring and command classification
- [Audit Log](./audit-log.md) — Audit log structure and integrity verification
- [Replay](./replay.md) — Deterministic replay system
