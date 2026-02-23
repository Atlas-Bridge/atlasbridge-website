# Risk Engine

The AtlasBridge risk engine classifies agent commands by their potential impact before policy evaluation. Risk scoring provides a structured, deterministic assessment of what a command could affect if executed.

## Purpose

The risk engine exists to answer a specific question: **what is the potential blast radius of this command?**

Risk scores are not predictions or probabilistic estimates. They are deterministic classifications derived from known command characteristics, target directories, and environment context.

## Risk Score

Every evaluated command receives a numeric risk score from 0 to 100:

| Range   | Level      | Description                                       |
|---------|------------|---------------------------------------------------|
| 0–25    | `low`      | Read-only or informational commands               |
| 26–50   | `medium`   | Modifications with limited scope                  |
| 51–75   | `high`     | Destructive or broadly scoped modifications       |
| 76–100  | `critical` | System-level changes, irreversible operations     |

## Classification Factors

The risk engine evaluates multiple factors to produce a score. Each factor contributes independently to the total.

### Command Classification

Commands are classified by their operation type:

| Category         | Examples                        | Base Risk |
|------------------|---------------------------------|-----------|
| Read             | `ls`, `cat`, `grep`, `find`     | 5         |
| Write            | `echo > file`, `cp`, `mv`      | 30        |
| Delete           | `rm`, `rm -r`                   | 55        |
| System modify    | `chmod`, `chown`, `mount`       | 60        |
| Package manage   | `apt install`, `npm install`    | 45        |
| Network          | `curl -X POST`, `wget`         | 40        |
| Process control  | `kill`, `systemctl stop`        | 65        |
| Destructive      | `rm -rf /`, `dd if=/dev/zero`   | 95        |

### Directory Sensitivity

The target path of a command modifies the risk score:

| Directory          | Modifier | Rationale                            |
|--------------------|----------|--------------------------------------|
| `/tmp`, `/var/tmp` | -10      | Temporary, expected to be ephemeral  |
| User home          | +0       | Standard working directory           |
| `/etc`             | +20      | System configuration                 |
| `/usr`, `/bin`     | +25      | System binaries                      |
| `/`                | +30      | Root filesystem                      |
| `/boot`, `/proc`   | +35      | Critical system paths                |

### Environment Tags

The execution environment can further adjust the risk assessment:

| Tag           | Modifier | Description                                |
|---------------|----------|--------------------------------------------|
| `development` | -10      | Local development environment              |
| `staging`     | +0       | Pre-production environment                 |
| `production`  | +15      | Live production environment                |
| `critical`    | +25      | Designated critical infrastructure         |

## Score Calculation

The final risk score is computed as:

```
risk_score = base_command_risk + directory_modifier + environment_modifier
```

The result is clamped to the 0–100 range.

### Example

```
Command:     rm -r /etc/nginx/conf.d/
Base risk:   55  (delete)
Directory:   +20 (/etc)
Environment: +15 (production)
─────────────────────
Total:       90  (critical)
```

## Risk Thresholds

Risk thresholds determine how the system responds to different risk levels. These interact with the current [autonomy mode](autonomy-modes.md):

| Autonomy Mode | Low (0–25) | Medium (26–50) | High (51–75) | Critical (76–100) |
|----------------|------------|-----------------|---------------|---------------------|
| OFF            | Deny all   | Deny all        | Deny all      | Deny all            |
| ASSIST         | Allow      | Escalate        | Escalate      | Deny                |
| FULL           | Allow      | Allow           | Escalate      | Deny                |

## Risk Override Logic

In specific circumstances, the computed risk score may be overridden:

1. **Policy override**: A policy rule with an explicit `action: allow` for a matching command takes precedence over the risk score. The override is logged.
2. **Human approval**: A human operator can approve an escalated command regardless of its risk score. The approval, approver identity, and timestamp are recorded in the audit log.
3. **No silent overrides**: Every override is recorded. There is no mechanism to bypass risk classification without an audit trail.

## Limitations

The risk engine operates on static command analysis. It does not:

- Execute commands in a sandbox to observe behavior
- Analyze command output or side effects
- Predict the runtime impact of scripts or piped commands
- Evaluate commands inside shell scripts passed as arguments

Commands that invoke scripts or complex shell expressions receive a default elevated risk score, as their actual impact cannot be statically determined.

## Related Documentation

- [Policy Engine](policy-engine.md) - How policies use risk scores in evaluation
- [Autonomy Modes](autonomy-modes.md) - How autonomy levels interact with risk thresholds
- [Escalation](escalation.md) - What happens when risk triggers human review
- [Audit Log](audit-log.md) - How risk assessments are recorded
