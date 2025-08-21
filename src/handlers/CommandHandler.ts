import { Collection, REST, Routes, Client, ChatInputCommandInteraction } from 'discord.js';
import { readdirSync } from 'fs';
import { join } from 'path';
import { Command } from '../types/Command';
import { config } from '../config/config';

export class CommandHandler {
  private commands: Collection<string, Command> = new Collection();
  private readonly client: Client;
  private readonly developerId: string;

  constructor(client: Client) {
    this.client = client;
    this.developerId = config.developerId;
  }

  public async loadCommands(): Promise<void> {
    try {
      const commandsPath = join(__dirname, '../commands');
      const categoryFolders = readdirSync(commandsPath, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);

      for (const category of categoryFolders) {
        const categoryPath = join(commandsPath, category);
        const commandFiles = readdirSync(categoryPath)
          .filter(file => file.endsWith('.js') || file.endsWith('.ts'));

        for (const file of commandFiles) {
          try {
            const filePath = join(categoryPath, file);
            const command = require(filePath);
            
            if (command.default && this.isValidCommand(command.default)) {
              this.commands.set(command.default.metadata.name, command.default);
            }
          } catch (error) {
            console.error(`Error loading command from ${file}:`, error);
          }
        }
      }


    } catch (error) {
      console.error('Error loading commands:', error);
      throw error;
    }
  }

  private isValidCommand(command: any): command is Command {
    return (
      command.metadata &&
      command.metadata.name &&
      command.metadata.category &&
      command.metadata.usage &&
      command.metadata.description &&
      typeof command.metadata.developerOnly === 'boolean' &&
      command.data &&
      command.execute &&
      typeof command.execute === 'function'
    );
  }

  public async registerCommands(): Promise<void> {
    try {
      const rest = new REST({ version: '10' }).setToken(config.token);
      const commands = Array.from(this.commands.values()).map(cmd => cmd.data.toJSON());

      // Clear existing commands first to prevent duplicates
      await rest.put(
        Routes.applicationCommands(this.client.user!.id),
        { body: [] }
      );

      // Register new commands globally
      await rest.put(
        Routes.applicationCommands(this.client.user!.id),
        { body: commands }
      );

      console.log(`Successfully registered ${commands.length} slash commands globally`);
    } catch (error) {
      console.error('Error registering commands:', error);
      throw error;
    }
  }

  public async handleInteraction(interaction: ChatInputCommandInteraction): Promise<void> {
    try {
      const commandName = interaction.commandName;
      const command = this.commands.get(commandName);

      if (!command) {
        await interaction.reply({
          content: 'Command not found',
          ephemeral: true
        });
        return;
      }

      // Check if command is developer-only
      if (command.metadata.developerOnly && interaction.user.id !== this.developerId) {
        await interaction.reply({
          content: 'This command is restricted to developers only',
          ephemeral: true
        });
        return;
      }

      await command.execute(interaction);
    } catch (error) {
      console.error(`Error executing command ${interaction.commandName}:`, error);
      
      const errorMessage = 'An error occurred while executing this command';
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ content: errorMessage, ephemeral: true });
      } else {
        await interaction.reply({ content: errorMessage, ephemeral: true });
      }
    }
  }

  public getCommands(): Collection<string, Command> {
    return this.commands;
  }

  public getCommand(name: string): Command | undefined {
    return this.commands.get(name);
  }
}
