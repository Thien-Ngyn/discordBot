import { Client, Events } from 'discord.js';
import { Event } from '../handlers/EventHandler';

class ReadyEvent implements Event<typeof Events.ClientReady> {
  name: typeof Events.ClientReady = Events.ClientReady;
  once = true;

  async execute(client: Client): Promise<void> {
    console.log(`Logged in as ${client.user?.tag}`);
    console.log(`Bot is ready and serving ${client.guilds.cache.size} guilds`);
  }
}

export default new ReadyEvent();
