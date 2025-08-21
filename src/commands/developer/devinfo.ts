import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { Command } from '../../types/Command';

class DevInfoCommand implements Command {
  metadata = {
    name: 'devinfo',
    category: 'developer',
    usage: '/devinfo',
    description: 'Shows detailed bot information for developers',
    developerOnly: true
  };

  data = new SlashCommandBuilder()
    .setName('devinfo')
    .setDescription('Shows detailed bot information for developers');

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const embed = new EmbedBuilder()
      .setColor(0x0099FF)
      .setTitle('Bot Developer Information')
      .setDescription('Detailed information about the bot for developers')
      .addFields(
        { name: 'Bot ID', value: interaction.client.user?.id || 'Unknown', inline: true },
        { name: 'Bot Name', value: interaction.client.user?.username || 'Unknown', inline: true },
        { name: 'Bot Version', value: this.getBotVersion(), inline: true },
        { name: 'Discord.js Version', value: this.getDiscordJsVersion(), inline: true },
        { name: 'Bot Created', value: interaction.client.user?.createdAt.toDateString() || 'Unknown', inline: true },
        { name: 'Uptime', value: this.formatUptime(interaction.client.uptime), inline: true },
        { name: 'API Latency', value: `${Math.round(interaction.client.ws.ping)}ms`, inline: true },
        { name: 'Memory Usage', value: this.formatMemoryUsage(process.memoryUsage()), inline: true },
        { name: 'Node Version', value: process.version, inline: true },
        { name: 'Platform', value: `${process.platform} (${process.arch})`, inline: true },
        { name: 'Guild Count', value: interaction.client.guilds.cache.size.toString(), inline: true },
        { name: 'Total Users', value: this.getTotalUsers(interaction.client), inline: true },
        { name: 'Environment', value: process.env.NODE_ENV || 'development', inline: true }
      )
      .setTimestamp()
      .setFooter({ text: 'Developer Command' });

    await interaction.reply({ embeds: [embed], ephemeral: true });
  }

  private getBotVersion(): string {
    try {
      const packageJson = require('../../../package.json');
      return packageJson.version || 'Unknown';
    } catch (error) {
      return 'Unknown';
    }
  }

  private getDiscordJsVersion(): string {
    try {
      const packageJson = require('../../../package.json');
      return packageJson.dependencies['discord.js'] || 'Unknown';
    } catch (error) {
      return 'Unknown';
    }
  }

  private getTotalUsers(client: any): string {
    try {
      let totalUsers = 0;
      client.guilds.cache.forEach((guild: any) => {
        totalUsers += guild.memberCount || 0;
      });
      return totalUsers.toLocaleString();
    } catch (error) {
      return 'Unknown';
    }
  }

  private formatUptime(uptime: number | null): string {
    if (!uptime) return 'Unknown';
    
    const days = Math.floor(uptime / (1000 * 60 * 60 * 24));
    const hours = Math.floor((uptime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((uptime % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((uptime % (1000 * 60)) / 1000);

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  }

  private formatMemoryUsage(memoryUsage: NodeJS.MemoryUsage): string {
    const rss = Math.round(memoryUsage.rss / 1024 / 1024);
    const heapUsed = Math.round(memoryUsage.heapUsed / 1024 / 1024);
    const heapTotal = Math.round(memoryUsage.heapTotal / 1024 / 1024);
    
    return `RSS: ${rss}MB | Heap: ${heapUsed}MB/${heapTotal}MB`;
  }
}

export default new DevInfoCommand();
