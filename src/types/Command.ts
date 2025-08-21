import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';

export interface CommandMetadata {
  name: string;
  category: string;
  usage: string;
  description: string;
  developerOnly: boolean;
}

export interface Command {
  metadata: CommandMetadata;
  data: SlashCommandBuilder;
  execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
}
