# Discord Bot

A basic Discord bot built with TypeScript and Discord.js.

## Features

- Basic Discord bot structure
- TypeScript support
- Environment variable configuration
- Graceful error handling
- Process termination handling

## Prerequisites

- Node.js 16.9.0 or higher
- npm or yarn
- A Discord bot token

## Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd discordBot
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   - Copy `env.example` to `.env`
   - Fill in your Discord bot token and other configuration values
   ```bash
   cp env.example .env
   ```

4. **Configure your Discord Bot**
   - Go to [Discord Developer Portal](https://discord.com/developers/applications)
   - Create a new application
   - Go to the "Bot" section
   - Copy the bot token and paste it in your `.env` file

5. **Build and Run**
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

## Available Scripts

- `npm run dev` - Run in development mode with ts-node
- `npm run build` - Build the TypeScript project
- `npm start` - Run the built JavaScript
- `npm run watch` - Watch for changes and rebuild

## Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `DISCORD_TOKEN` | Your Discord bot token | Yes | - |
| `BOT_PREFIX` | Command prefix for the bot | No | `!` |
| `BOT_STATUS` | Bot's status | No | `online` |
| `GUILD_ID` | Guild ID for development | No | - |
| `CLIENT_ID` | Bot's client ID | No | - |

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details

