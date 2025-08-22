import { Client, Events, Interaction } from 'discord.js';
import { Event } from '../handlers/EventHandler';
import { CommandHandler } from '../handlers/CommandHandler';

class InteractionCreateEvent implements Event<typeof Events.InteractionCreate> {
  name: typeof Events.InteractionCreate = Events.InteractionCreate;
  once = false;

  async execute(client: Client, interaction: Interaction): Promise<void> {
    if (!interaction.isChatInputCommand()) {
      return;
    }
    
    const discordClient = client as any;
    if (discordClient.commandHandler) {
      await discordClient.commandHandler.handleInteraction(interaction);
    }
  }
}

export default new InteractionCreateEvent();
