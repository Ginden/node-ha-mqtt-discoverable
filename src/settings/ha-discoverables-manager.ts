import { MqttClient, OnMessageCallback } from 'mqtt';
import { setImmediate } from 'timers/promises';
import { DiscoverableLogger, noopLogger } from './discoverable-logger';
import { HaDiscoverableMqttSettings } from './ha-discoverable-mqtt-settings';
import { HaDiscoverableGlobalSettingsProperties } from './ha-discoverable-global-settings-properties';
import type { Discoverable } from '../discoverable';
import type { EntityInfo } from '../entity-info';
import { Subscriber } from '../subscriber';

/**
 * This class manages everything related to the discoverable entities.
 */
export class HaDiscoverableManager {
  /**
   * Creates a new instance of the HaDiscoverableManager from properties.
   */
  static withSettings(properties: HaDiscoverableGlobalSettingsProperties): HaDiscoverableManager {
    return new HaDiscoverableManager(
      properties.client,
      properties.mqttSettings,
      properties.manualAvailability,
      properties.logger ?? noopLogger,
    );
  }

  private discoverables: Set<Discoverable<EntityInfo>> = new Set();
  readonly client: MqttClient;
  readonly mqttSettings: HaDiscoverableMqttSettings;
  readonly manualAvailability: boolean;
  readonly logger: DiscoverableLogger;

  private commandCallbacks: Map<string, { subscriber: Subscriber<EntityInfo> }> = new Map();

  constructor(
    client: MqttClient,
    mqttSettings = new HaDiscoverableMqttSettings(),
    manualAvailability: boolean = false,
    logger: DiscoverableLogger = noopLogger,
  ) {
    this.client = client;
    this.mqttSettings = mqttSettings ?? new HaDiscoverableMqttSettings();
    this.manualAvailability = manualAvailability;
    this.logger = logger;
    this.client.on('message', this.messageCallback);
    this.addConnectCallback(() => {
      this.logger.info(`HaDiscoverableManager connected to MQTT broker`);
    });
  }

  /**
   * This method adds a message callback to the manager
   * Internally, our message callback listens to all messages, and ignores the ones that are not registered.
   * @internal
   */
  addCommandCallback<T extends Subscriber<EntityInfo>>(topic: string, subscriber: T) {
    this.commandCallbacks.set(topic, { subscriber });
  }

  /**
   * This method adds a connect callback to the manager
   * It will be called when the client connects to the broker.
   * If the client is already connected, it will be called immediately, and a potential error will be emitted as `error` event on the client.
   * This is not an elegant solution, but async constructors don't exist in JS.
   */
  addConnectCallback(callback: (client: MqttClient) => unknown) {
    if (this.client.connected) {
      setImmediate(this.client)
        .then(callback)
        .catch((e) => this.client.emit('error', e));
    } else {
      this.client.once('connect', () => {
        return callback(this.client);
      });
    }
  }

  /**
   * This method registers a discoverable entity.
   * It's called in `Discoverable` constructor, and not intended to be called by the user.
   * @internal
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register(discoverable: Discoverable<EntityInfo, any>) {
    this.discoverables.add(discoverable);
  }

  /**
   * Get all currently registered discoverable entities
   */
  getEntities(): Discoverable<EntityInfo>[] {
    return Array.from(this.discoverables);
  }

  /**
   * Delete all discoverable from Home Assistant
   * You need to call this method before disconnecting from the broker.
   * `AggregateError` will be thrown if any of the unregistering fails.
   */
  async unregisterAll() {
    this.logger.debug(`Unregistering all discoverables...`);
    const aggregateErrors: Error[] = [];
    for (const discoverable of this.discoverables) {
      try {
        await discoverable.unregister();
      } catch (e) {
        aggregateErrors.push(e as Error);
      }
    }
    if (aggregateErrors.length > 0) {
      throw new AggregateError(aggregateErrors);
    }
  }

  protected readonly messageCallback: OnMessageCallback = (topic, payload, packet) => {
    const data = this.commandCallbacks.get(topic);
    if (!data) {
      this.logger.debug(`Received message on topic ${topic}, but no callback registered`);
      return;
    }
    const { subscriber } = data;
    this.logger.debug(
      `Received message on topic ${topic} for subscriber ${subscriber.constructor.name}`,
    );

    const details = {
      raw: payload,
      client: this.client,
      entity: subscriber.entity,
      packet: packet,
    };

    if (!subscriber.isBuffer) {
      const str = payload.toString('utf8');

      subscriber.emitVoid('command.string', str, subscriber, topic, details);
      this.logger.debug(`Emitting command.string from ${topic} for ${subscriber.constructor.name}`);
      if (subscriber.parseJson) {
        try {
          const parsed = JSON.parse(str);
          subscriber.emitVoid('command.json', parsed, subscriber, topic, details);
          this.logger.debug(
            `Emitting command.json from ${topic} for ${subscriber.constructor.name}`,
          );
        } catch (err) {
          subscriber.emitVoid('command.raw', payload, subscriber, topic, details);
          this.logger.warn(
            `Emitting command.raw from ${topic} (invalid JSON) for ${subscriber.constructor.name}. If this occurs often, consider setting parseJson to false.`,
            {
              err,
            },
          );
        }
      }
    } else {
      subscriber.emitVoid('command.raw', payload, subscriber, topic, details);
      this.logger.debug(`Emitting command.raw from ${topic}`);
    }
  };
}
