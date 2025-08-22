import { ShardingManager } from './ShardingManager';

async function main(): Promise<void> {
  try {
    const shardingManager = new ShardingManager();
    await shardingManager.spawn();
  } catch (error) {
    console.error('Failed to start sharding manager:', error);
    process.exit(1);
  }
}

// Handle process termination gracefully
process.on('SIGINT', () => {
  console.log('Received SIGINT, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('Received SIGTERM, shutting down gracefully...');
  process.exit(0);
});

// Start the bot with sharding (always)
main();

