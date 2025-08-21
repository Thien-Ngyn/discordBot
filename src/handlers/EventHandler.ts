import { Collection, Client, ClientEvents } from 'discord.js';
import { readdirSync } from 'fs';
import { join } from 'path';

export interface Event<K extends keyof ClientEvents> {
  name: K;
  once?: boolean;
  execute: (client: Client, ...args: ClientEvents[K]) => Promise<void> | void;
}

export class EventHandler {
  private events: Collection<string, Event<any>> = new Collection();
  private readonly client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  public async loadEvents(): Promise<void> {
    try {
      const eventsPath = join(__dirname, '../events');
      const eventFiles = readdirSync(eventsPath)
        .filter(file => file.endsWith('.js') || file.endsWith('.ts'));

      for (const file of eventFiles) {
        try {
          const filePath = join(eventsPath, file);
          const event = require(filePath);
          
          if (event.default && this.isValidEvent(event.default)) {
            this.events.set(event.default.name, event.default);
            console.log(`Loaded event: ${event.default.name}`);
          }
        } catch (error) {
          console.error(`Error loading event from ${file}:`, error);
        }
      }

      console.log(`Successfully loaded ${this.events.size} events`);
    } catch (error) {
      console.error('Error loading events:', error);
      throw error;
    }
  }

  private isValidEvent(event: any): event is Event<any> {
    return (
      event.name &&
      typeof event.execute === 'function'
    );
  }

  public registerEvents(): void {
    try {
      for (const event of this.events.values()) {
        if (event.once) {
          this.client.once(event.name, (...args) => event.execute(this.client, ...args));
        } else {
          this.client.on(event.name, (...args) => event.execute(this.client, ...args));
        }
      }

      console.log(`Successfully registered ${this.events.size} events`);
    } catch (error) {
      console.error('Error registering events:', error);
      throw error;
    }
  }

  public getEvents(): Collection<string, Event<any>> {
    return this.events;
  }

  public getEvent(name: string): Event<any> | undefined {
    return this.events.get(name);
  }
}
