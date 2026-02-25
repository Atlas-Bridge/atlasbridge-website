# Cloud Observe Mode

AtlasBridge supports an optional cloud observe mode that provides read-only visibility into governance activity from a remote endpoint. This mode is designed for teams that need centralized monitoring across multiple workspaces without compromising the local execution boundary that is fundamental to the AtlasBridge architecture.

## Design Principle

Cloud observe mode follows a strict observe-only constraint: the cloud endpoint can read governance data but cannot modify policies, trigger evaluations, execute commands, or alter any local state. All policy evaluation, risk scoring, and decision enforcement remain within the local execution boundary. The cloud layer is a consumer of telemetry data, not a participant in the governance process.

This separation is intentional. AtlasBridge is designed so that the correctness and security of governance decisions never depend on network availability, cloud service uptime, or remote authorisation. A workspace with cloud observe mode disabled operates identically to one with it enabled — the only difference is whether telemetry is transmitted.

## What Cloud Observe Mode Provides

When enabled, cloud observe mode transmits the following data to the configured remote endpoint:

- **Policy evaluation outcomes** — Decision, risk score, agent, command (optionally redacted), and duration for each evaluation.
- **Audit log events** — Action, actor, target, level, and timestamp for governance events.
- **Policy metadata** — Policy names, descriptions, enforcement modes, and enabled/disabled status. Rule definitions can be excluded from transmission if configured.
- **Workspace status** — Autonomy mode, active policy count, and aggregate metrics.

## What Cloud Observe Mode Does Not Provide

- **Remote policy modification** — Policies cannot be created, updated, enabled, disabled, or deleted from the cloud endpoint.
- **Remote command execution** — No mechanism exists for the cloud layer to submit commands for evaluation or execute actions within the local boundary.
- **Decision override** — Cloud observe mode cannot alter, reverse, or influence governance decisions made locally.
- **Escalation resolution** — Human approval for escalated decisions must occur within the local boundary or through configured local channels (e.g., Telegram). The cloud endpoint does not participate in escalation workflows.
- **Secret or credential access** — API tokens, database credentials, and session secrets are never transmitted.

## Architecture

```
┌─────────────────────────────────────────────┐
│              Local Boundary                  │
│                                              │
│  ┌──────────┐    ┌──────────┐    ┌────────┐ │
│  │  Policy   │───▶│  Risk    │───▶│Decision│ │
│  │  Engine   │    │  Engine  │    │        │ │
│  └──────────┘    └──────────┘    └───┬────┘ │
│                                      │      │
│  ┌──────────┐    ┌──────────────┐    │      │
│  │  Audit   │◀───│  Evaluation  │◀───┘      │
│  │  Log     │    │  Record      │           │
│  └────┬─────┘    └──────────────┘           │
│       │                                      │
│       ▼                                      │
│  ┌──────────────┐                            │
│  │  Telemetry   │──── outbound only ────┐   │
│  │  Transmitter │                       │   │
│  └──────────────┘                       │   │
│                                         │   │
└─────────────────────────────────────────┼───┘
                                          │
                                          ▼
                              ┌───────────────────┐
                              │  Cloud Observe     │
                              │  Endpoint          │
                              │                    │
                              │  • Read-only views │
                              │  • Aggregate stats │
                              │  • Alert routing   │
                              │  • No execution    │
                              └───────────────────┘
```

The telemetry transmitter operates on an outbound-only channel. The cloud endpoint has no inbound path to the local boundary. There is no listener, webhook receiver, or remote procedure call endpoint within the local workspace that accepts instructions from the cloud.

## Configuration

Cloud observe mode is configured in the workspace configuration file:

```yaml
cloud:
  enabled: true
  endpoint: "https://observe.example.com/v1/telemetry"
  api_key_env: "ATLASBRIDGE_CLOUD_API_KEY"
  transmit:
    evaluations: true
    audit_events: true
    policy_metadata: true
    policy_rules: false
    workspace_status: true
  redaction:
    commands: false
    targets: false
  interval_seconds: 30
  retry:
    max_attempts: 3
    backoff_seconds: 5
```

### Configuration Fields

| Field                | Description                                                                                                                         |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `enabled`            | Whether cloud observe mode is active. Defaults to `false`.                                                                          |
| `endpoint`           | The HTTPS URL of the cloud observe endpoint.                                                                                        |
| `api_key_env`        | Name of the environment variable containing the API key. The key itself is never stored in the configuration file.                  |
| `transmit.*`         | Controls which data categories are transmitted. Each can be independently enabled or disabled.                                      |
| `redaction.commands` | When `true`, command strings are hashed before transmission. The cloud endpoint receives a hash rather than the plain text command. |
| `redaction.targets`  | When `true`, target identifiers in audit events are hashed before transmission.                                                     |
| `interval_seconds`   | How frequently telemetry is batched and transmitted. Defaults to `30`.                                                              |
| `retry.*`            | Retry behaviour when transmission fails. Failed transmissions do not affect local operation.                                        |

## Security Considerations

### No Remote Execution Surface

Cloud observe mode does not create any listening socket, HTTP server, or inbound network path on the local workspace. The communication channel is strictly outbound. An attacker who compromises the cloud endpoint gains read access to transmitted telemetry but cannot influence local governance decisions.

### API Key Management

The cloud API key is referenced by environment variable name, not stored directly in the configuration file. This prevents accidental exposure through version control. The API key should be treated as a secret and rotated according to organisational security policy.

### Data Minimization

Each telemetry category can be independently disabled. Organisations that require cloud visibility for audit events but consider command strings sensitive can enable `audit_events` while disabling `evaluations` or enabling command redaction. This allows operators to match the telemetry surface to their data classification requirements.

### Transport Security

All communication with the cloud endpoint uses HTTPS. Certificate validation is enforced and cannot be disabled. Self-signed certificates are not supported in production configurations.

### Failure Isolation

If the cloud endpoint is unreachable, telemetry transmission fails silently after the configured retry attempts. Local governance operations continue without interruption. No evaluation is delayed, blocked, or altered due to cloud connectivity issues. Failed transmissions are logged locally at the `warn` level.

## Disabling Cloud Observe Mode

Cloud observe mode can be disabled at any time by setting `cloud.enabled` to `false` in the configuration file or by removing the cloud configuration section entirely. Disabling cloud observe mode:

- Stops all outbound telemetry transmission immediately.
- Does not affect local policy evaluation, risk scoring, or audit logging.
- Does not delete any data that was previously transmitted to the cloud endpoint.
- Does not require a restart — the change takes effect on the next telemetry interval.

## Relationship to the Dashboard

The local dashboard and cloud observe mode serve complementary purposes:

- The **local dashboard** provides direct access to all governance data, including policy management, audit log review, and real-time metrics. It operates entirely within the local boundary.
- **Cloud observe mode** provides a subset of this data to a remote endpoint for centralized monitoring. It does not replicate the policy management or configuration capabilities of the local dashboard.

Organisations using cloud observe mode typically use it for aggregate visibility across multiple workspaces, alerting on anomalous governance patterns, or feeding governance telemetry into existing monitoring infrastructure.

## See Also

- [Architecture](./architecture.md) — System components and execution boundaries
- [Dashboard](./dashboard.md) — Local operator console
- [Security](./security.md) — Security model and threat boundaries
- [Audit Log](./audit-log.md) — Audit log structure and integrity verification
