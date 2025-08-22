import { Client, GatewayIntentBits } from 'discord.js';
import { config } from '../config/config';
import { CommandHandler } from '../handlers/CommandHandler';
import { EventHandler } from '../handlers/EventHandler';

export class DiscordClient extends Client {
  public commandHandler: CommandHandler;
  public eventHandler: EventHandler;

  constructor() {
    super({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
      ],
    });

    this.commandHandler = new CommandHandler(this);
    this.eventHandler = new EventHandler(this);
  }

  public async start(): Promise<void> {
    try {
      // Load events first
      await this.eventHandler.loadEvents();
      this.eventHandler.registerEvents();

      // Load commands
      await this.commandHandler.loadCommands();

      // Login to Discord
      await this.login(config.token);

      // Wait a bit for the client to be ready
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Register slash commands after login
      await this.commandHandler.registerCommands();

      console.log(`Shard ${this.shard?.ids.join(', ') || 'Unknown'} started successfully`);
    } catch (error) {
      console.error(`Failed to start shard ${this.shard?.ids.join(', ') || 'Unknown'}:`, error);
      process.exit(1);
    }
  }

  public getShardInfo(): { id: number | null; total: number | null } {
    if (!this.shard) {
      return { id: null, total: null };
    }
    
    return {
      id: this.shard.ids[0] || null,
      total: null // We can't get total shards from individual shard in Discord.js v14
    };
  }
}
