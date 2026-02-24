# Installation

This guide covers installing AtlasBridge, configuring your environment, and connecting escalation channels.

## Requirements

- Python 3.10 or later
- pip (Python package manager)
- A supported operating system: Linux, macOS, or Windows (WSL recommended)
- A PostgreSQL 14+ instance (for audit log persistence)

Optional:

- A Telegram bot token (for escalation notifications)
- A Slack webhook URL (for escalation notifications)

## Install AtlasBridge

Install the latest stable release from PyPI:

```bash
pip install atlasbridge
```

To install a specific version:

```bash
pip install atlasbridge==0.8.0
```

To install from source:

```bash
git clone https://github.com/atlasbridge/atlasbridge.git
cd atlasbridge
pip install -e .
```

## Verify Installation

After installation, confirm the CLI is available:

```bash
atlasbridge --version
```

Expected output:

```
atlasbridge v0.8.x
```

## Environment Setup

AtlasBridge reads configuration from environment variables and an optional `.atlasbridge.yaml` file in your project root.

### Environment Variables

| Variable                 | Required    | Description                                                                      |
| ------------------------ | ----------- | -------------------------------------------------------------------------------- |
| `ATLASBRIDGE_POLICY_DIR` | No          | Path to the directory containing policy YAML files. Defaults to `./policies`.    |
| `ATLASBRIDGE_LOG_DIR`    | No          | Path to the directory where audit logs are written. Defaults to `./logs`.        |
| `ATLASBRIDGE_MODE`       | No          | Default autonomy mode: `off`, `assist`, or `full`. Defaults to `assist`.         |
| `DATABASE_URL`           | Yes         | PostgreSQL connection string for audit log persistence.                          |
| `ATLASBRIDGE_CHANNEL`    | No          | Escalation channel type: `telegram`, `slack`, or `stdout`. Defaults to `stdout`. |
| `TELEGRAM_BOT_TOKEN`     | Conditional | Required when `ATLASBRIDGE_CHANNEL=telegram`.                                    |
| `TELEGRAM_CHAT_ID`       | Conditional | Required when `ATLASBRIDGE_CHANNEL=telegram`.                                    |
| `SLACK_WEBHOOK_URL`      | Conditional | Required when `ATLASBRIDGE_CHANNEL=slack`.                                       |

### Configuration File

You can also provide configuration via `.atlasbridge.yaml` in your project root:

```yaml
mode: assist
policy_dir: ./policies
log_dir: ./logs
channel: telegram
```

Environment variables take precedence over values in the configuration file.

## Channel Configuration

AtlasBridge supports escalation channels for human-in-the-loop notifications. When the policy engine determines that an action requires human approval, the configured channel receives the escalation request.

### Telegram

1. Create a Telegram bot via [BotFather](https://t.me/BotFather).
2. Copy the bot token.
3. Start a conversation with your bot and retrieve the chat ID.
4. Set the environment variables:

```bash
export ATLASBRIDGE_CHANNEL=telegram
export TELEGRAM_BOT_TOKEN=<your-bot-token>
export TELEGRAM_CHAT_ID=<your-chat-id>
```

### Slack

1. Create a Slack Incoming Webhook for your workspace.
2. Copy the webhook URL.
3. Set the environment variables:

```bash
export ATLASBRIDGE_CHANNEL=slack
export SLACK_WEBHOOK_URL=<your-webhook-url>
```

### Standard Output

For local development or testing, escalations can be printed to stdout:

```bash
export ATLASBRIDGE_CHANNEL=stdout
```

This is the default behavior when no channel is configured.

## Database Setup

AtlasBridge requires a PostgreSQL database for audit log persistence.

1. Create a database:

```bash
createdb atlasbridge
```

2. Set the connection string:

```bash
export DATABASE_URL=postgresql://user:password@localhost:5432/atlasbridge
```

3. Run the schema migration:

```bash
atlasbridge setup --migrate
```

## Security Best Practices

> **Warning:** Never commit API tokens, bot tokens, database credentials, or any secrets to version control.

- Store all secrets in environment variables or a `.env` file that is listed in `.gitignore`.
- Use a secrets manager (e.g., HashiCorp Vault, AWS Secrets Manager) in production environments.
- Restrict database credentials to least-privilege access. AtlasBridge requires `INSERT` and `SELECT` permissions on audit tables.
- Rotate API tokens and credentials on a regular schedule.
- Review the [Security](security.md) documentation for additional guidance on securing your AtlasBridge deployment.

## Directory Structure

After setup, your project directory should look like this:

```
project/
  .atlasbridge.yaml       # Optional configuration
  .env                    # Secrets (do not commit)
  policies/
    default.yaml          # Default policy rules
  logs/
    audit.log             # Append-only audit log
```

## Next Steps

- [Quick Start](quickstart.md) - Run your first supervised agent session.
- [Policy Engine](policy-engine.md) - Define governance rules.
- [Autonomy Modes](autonomy-modes.md) - Configure execution modes.
