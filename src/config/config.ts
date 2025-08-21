import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

export interface BotConfig {
  token: string;
  developerId: string;
}

export const config: BotConfig = {
  token: process.env.DISCORD_TOKEN || '',
  developerId: '980280431322755082',
};

// Validate required configuration
if (!config.token) {
  throw new Error('DISCORD_TOKEN is required in environment variables');
}

