import { EventEmitter } from 'events';
import { vi } from 'vitest';
import { HaDiscoverableManager } from '../settings';

/** MQTT transport double used to inspect actual discovery and state publications. */
export function mqttTestContext() {
  const client = Object.assign(new EventEmitter(), {
    connected: false,
    publishAsync: vi.fn(async (topic: string, payload: string | Buffer, options?: unknown) => {
      void [topic, payload, options];
    }),
    subscribeAsync: vi.fn(async (topic: string, options?: unknown) => {
      void [topic, options];
      return [];
    }),
  });
  const manager = new HaDiscoverableManager(client as never);
  return { client, manager };
}
