import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { Command } from '../../types/Command';
import { DiscordClient } from '../../client/DiscordClient';
import { config } from '../../config/config';

class HelpCommand implements Command {
  metadata = {
    name: 'help',
    category: 'general',
    usage: '/help [command]',
    description: 'Shows all available commands or detailed help for a specific command',
    developerOnly: false
  };

  data = new SlashCommandBuilder()
    .setName('help')
    .setDescription('Shows all available commands or detailed help for a specific command')
    .addStringOption(option =>
      option
        .setName('command')
        .setDescription('The specific command to get help for')
        .setRequired(false)
    ) as SlashCommandBuilder;

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const commandName = interaction.options.getString('command');
    
    if (commandName) {
      await this.showCommandHelp(interaction, commandName);
    } else {
      await this.showGeneralHelp(interaction);
    }
  }

  private async showGeneralHelp(interaction: ChatInputCommandInteraction): Promise<void> {
    const client = interaction.client as DiscordClient;
    const commands = client.commandHandler.getCommands();
    const isDeveloper = interaction.user.id === config.developerId;
    
    // Group commands by category, filtering based on user permissions
    const categories = new Map<string, Command[]>();
    
    commands.forEach(command => {
      // Only show developer commands to developers
      if (command.metadata.developerOnly && !isDeveloper) {
        return;
      }
      
      const category = command.metadata.category;
      if (!categories.has(category)) {
        categories.set(category, []);
      }
      categories.get(category)!.push(command);
    });

    const embed = new EmbedBuilder()
      .setColor(0x0099FF)
      .setTitle('Discord Bot Help')
      .setDescription('Here are all the available commands organized by category.')
      .setTimestamp()
      .setFooter({ text: 'Use /help <command> for detailed information about a specific command' });

    // Add each category
    categories.forEach((categoryCommands, categoryName) => {
      const categoryTitle = categoryName.charAt(0).toUpperCase() + categoryName.slice(1);
      const commandList = categoryCommands
        .map(cmd => `\`${cmd.metadata.name}\` - ${cmd.metadata.description}`)
        .join('\n');
      
      embed.addFields({
        name: `${categoryTitle} Commands`,
        value: commandList,
        inline: false
      });
    });

    await interaction.reply({ embeds: [embed], ephemeral: true });
  }

  private async showCommandHelp(interaction: ChatInputCommandInteraction, commandName: string): Promise<void> {
    const client = interaction.client as DiscordClient;
    const commands = client.commandHandler.getCommands();
    const isDeveloper = interaction.user.id === config.developerId;
    
    if (!commands.has(commandName)) {
      await interaction.reply({
        content: `❌ Command \`${commandName}\` not found. Use \`/help\` to see all available commands.`,
        ephemeral: true
      });
      return;
    }

    const command = commands.get(commandName)!;
    
    // Check if user can access this command
    if (command.metadata.developerOnly && !isDeveloper) {
      await interaction.reply({
        content: '❌ This command is restricted to developers only.',
        ephemeral: true
      });
      return;
    }

    const embed = new EmbedBuilder()
      .setColor(0x0099FF)
      .setTitle(`Help: /${command.metadata.name}`)
      .setDescription(command.metadata.description)
      .addFields(
        { name: 'Usage', value: `\`${command.metadata.usage}\``, inline: false },
        { name: 'Category', value: command.metadata.category.charAt(0).toUpperCase() + command.metadata.category.slice(1), inline: true },
        { name: 'Developer Only', value: command.metadata.developerOnly ? 'Yes' : 'No', inline: true }
      )
      .setTimestamp();

    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
}

export default new HelpCommand();
