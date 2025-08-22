import { ShardingManager as DiscordShardingManager } from 'discord.js';
import { config } from './config/config';

export class ShardingManager {
  private manager: DiscordShardingManager;

  constructor() {
    this.manager = new DiscordShardingManager('./dist/shard.js', {
      token: config.token,
      totalShards: 'auto',
      respawn: true
    });

    this.setupEventHandlers();
  }

  private setupEventHandlers(): void {
    this.manager.on('shardCreate', (shard) => {
      console.log(`Launched shard ${shard.id}`);
    });

    // Note: Discord.js v14 ShardingManager only supports 'shardCreate' event
    // Other shard events are handled by the individual shard instances
  }

  public async spawn(): Promise<void> {
    try {
      await this.manager.spawn();
      const totalShards = this.manager.totalShards;
      console.log(`Sharding manager spawned ${totalShards} shards`);
    } catch (error) {
      console.error('Failed to spawn shards:', error);
      process.exit(1);
    }
  }

  public getManager(): DiscordShardingManager {
    return this.manager;
  }

  public getTotalShards(): number | 'auto' {
    return this.manager.totalShards;
  }

  public getShards(): Map<number, any> {
    return this.manager.shards;
  }
}
