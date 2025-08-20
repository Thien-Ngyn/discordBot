# Discord Bot

A basic Discord bot built with TypeScript and Discord.js.

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Environment Configuration**
   - Copy `env.example` to `.env`
   - Add your Discord bot token
   ```bash
   cp env.example .env
   ```

3. **Get Discord Bot Token**
   - Go to [Discord Developer Portal](https://discord.com/developers/applications)
   - Create a new application
   - Go to the "Bot" section
   - Copy the bot token and paste it in your `.env` file

4. **Run the bot**
   ```bash
   # Development mode
   npm run dev
   
   # Build and run production
   npm run build
   npm start
   ```

## Project Structure

```
src/
├── client/
│   └── DiscordClient.ts    # Main Discord client class
├── config/
│   └── config.ts           # Configuration and environment variables
└── index.ts                # Application entry point
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DISCORD_TOKEN` | Your Discord bot token | Yes |

