# Berachain Governance Alerter

This project is a program to detect new Bera governance vote and alert with Pagerduty or Discord or Telegram.

The program checks all ProposalCreated events and save it to a database (Postgresql).

When launching the program the first time, no alerts will be triggered, but subsequents proposals created will trigger alerts.

## Config

The configuration is done in a .env file.

The program will trigger an alert on Pagerduty if the config key PAGERDUTY_INTEGRATION_KEY is set.

The program will trigger an alert on Discord if the config key DISCORD_WEBHOOK_URL is set.

The program will trigger an alert on Telegram if the config key TELEGRAM_BOT_TOKEN is set.

## Docker

To use the project, you can use the docker compose provided:
```bash
   docker compose up -d
```

## Without Docker

If you want to launch it without Docker:
```bash
    yarn install
    npm run start
```
To create the database structure:
```bash
    npx prisma migrate deploy
```

## TODO
Auto resolves in Pagerduty based on the status of the proposal
