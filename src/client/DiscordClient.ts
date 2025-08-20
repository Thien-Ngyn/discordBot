import { Client, GatewayIntentBits } from 'discord.js';
import { config } from '../config/config';

export class DiscordClient extends Client {
  constructor() {
    super({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
      ],
    });
  }

  public async start(): Promise<void> {
    try {
      await this.login(config.token);
      console.log('Bot started successfully');
    } catch (error) {
      console.error('Failed to start bot:', error);
      process.exit(1);
    }
  }
}
