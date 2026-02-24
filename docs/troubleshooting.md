# Troubleshooting

This guide covers common issues encountered when installing, configuring, and running AtlasBridge, along with their solutions.

## Installation Issues

### `atlasbridge: command not found`

The CLI binary is not on your system PATH.

- If installed via pip, ensure your Python `bin` directory is in PATH:

```bash
export PATH="$HOME/.local/bin:$PATH"
```

- If installed from source, verify the install completed:

```bash
pip install -e .
atlasbridge --version
```

### Dependency conflicts during `pip install`

AtlasBridge requires Python 3.10+. Check your version:

```bash
python3 --version
```

If you have multiple Python versions, use a virtual environment:

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install atlasbridge
```

## Database Issues

### `DATABASE_URL must be set`

AtlasBridge requires a PostgreSQL connection string. Set it in your environment or `.env` file:

```bash
export DATABASE_URL=postgresql://user:password@localhost:5432/atlasbridge
```

### Connection refused / database does not exist

1. Verify PostgreSQL is running:

```bash
pg_isready
```

2. Create the database if it does not exist:

```bash
createdb atlasbridge
```

3. Verify the connection string is correct and the user has appropriate permissions.

### Schema migration errors

If you see table-related errors on startup, push the schema:

```bash
npm run db:push
```

For the CLI runtime, run:

```bash
atlasbridge setup --migrate
```

## Dashboard Issues

### Cannot access the dashboard

- **Local development:** The dashboard runs on port 3000 by default. Ensure the dev server is running with `npm run dev` and navigate to `http://localhost:3000`.
- **Hosted deployment:** Verify your DNS records point to the correct hosting provider. If using Vercel, check that Deployment Protection is disabled for production domains.

### Login or registration fails

- Ensure the `SESSION_SECRET` environment variable is set in production.
- Verify the PostgreSQL database is accessible and the session table exists (it is created automatically on first use).
- Check that cookies are not being blocked by your browser. The dashboard requires HTTP-only session cookies.

### Dashboard shows no data

- Confirm the dashboard is connected to the same database as the CLI runtime.
- Run a policy evaluation via the CLI to generate audit data, then refresh the dashboard.

## Policy Engine Issues

### Policies not loading

- Verify the policy directory exists and contains `.yaml` files:

```bash
ls policies/
```

- Check the `ATLASBRIDGE_POLICY_DIR` environment variable if using a custom directory.
- Validate YAML syntax:

```bash
atlasbridge policy validate
```

### Unexpected DENY decisions

- Review the matched rule in the audit log using `atlasbridge log --last 10`.
- Check rule precedence — rules are evaluated in order, and the first match wins.
- The default fallback policy is DENY. If no rule matches, the action is denied. Add an explicit catch-all rule if needed.

## Escalation Issues

### Escalation notifications not received

- Verify the channel is configured:

```bash
echo $ATLASBRIDGE_CHANNEL
```

- For Telegram: confirm `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` are set, and that you have started a conversation with the bot.
- For Slack: confirm `SLACK_WEBHOOK_URL` is set and the webhook is active.
- Use `stdout` mode for testing:

```bash
export ATLASBRIDGE_CHANNEL=stdout
```

### Escalation timeout

If escalations are timing out without a response, check that the operator has access to the configured notification channel. Escalations remain pending until explicitly approved or denied.

## Performance Issues

### Slow policy evaluation

- Reduce the number of active rules where possible.
- Use specific pattern matching instead of broad wildcards.
- Check database query performance if audit log writes are slow.

### High memory usage

- Review the number of concurrent agent sessions.
- Ensure audit log retention is configured — unbounded log growth can increase memory usage over time.

## Getting Help

If your issue is not covered here:

- Review the [FAQ](./faq.md) for common questions.
- Check the [GitHub repository](https://github.com/Atlas-Bridge/atlasbridge) for open issues.
- Open a new issue with details about your environment, the error message, and steps to reproduce.
