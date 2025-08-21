import { Client, Events, Interaction } from 'discord.js';
import { Event } from '../handlers/EventHandler';
import { CommandHandler } from '../handlers/CommandHandler';

class InteractionCreateEvent implements Event<typeof Events.InteractionCreate> {
  name: typeof Events.InteractionCreate = Events.InteractionCreate;
  once = false;

  async execute(client: Client, interaction: Interaction): Promise<void> {
    console.log(`Interaction received: ${interaction.type}`);
    
    if (!interaction.isChatInputCommand()) {
      console.log('Interaction is not a chat input command');
      return;
    }

    console.log(`Command interaction: ${interaction.commandName}`);
    
    const commandHandler = (client as any).commandHandler as CommandHandler;
    if (commandHandler) {
      console.log('Command handler found, executing command');
      await commandHandler.handleInteraction(interaction);
    } else {
      console.log('Command handler not found');
    }
  }
}

export default new InteractionCreateEvent();
