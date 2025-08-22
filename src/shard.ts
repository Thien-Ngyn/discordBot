import { DiscordClient } from './client/DiscordClient';

async function main(): Promise<void> {
  try {
    const client = new DiscordClient();
    await client.start();
  } catch (error) {
    console.error('Failed to start shard:', error);
    process.exit(1);
  }
}

// Handle process termination gracefully
process.on('SIGINT', () => {
  console.log('Received SIGINT, shutting down shard gracefully...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('Received SIGTERM, shutting down shard gracefully...');
  process.exit(0);
});

// Start the shard
main();
