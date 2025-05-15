import { MqttClient, OnMessageCallback } from 'mqtt';
import { setImmediate } from 'timers/promises';
import { DiscoverableLogger, noopLogger } from './discoverable-logger';
import { MessageCallback, MessageWrapper } from './message-callback';
import { HaDiscoverableMqttSettings } from './ha-discoverable-mqtt-settings';
import { HaDiscoverableGlobalSettingsProperties } from './ha-discoverable-global-settings-properties';
import type { Discoverable } from '../discoverable';
import type { EntityInfo } from '../entity-info';

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

  private messageCallbacks: Map<
    string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    { cb: MessageCallback<any>; sensor: Discoverable<EntityInfo> }
  > = new Map();

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
  }

  /**
   * This method adds a message callback to the manager
   * Internally, our message callback listens to all messages, and ignores the ones that are not registered.
   * @internal
   */
  addMessageCallback<T extends Discoverable<EntityInfo>>(
    topic: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    cb: MessageCallback<any, any>,
    sensor: T,
  ): void {
    this.messageCallbacks.set(topic, { cb, sensor });
  }

  /**
   * This method adds a connect callback to the manager
   * It will be called when the client connects to the broker.
   * If the client is already connected, it will be called immediately, and potential error will be emitted as `error` event on the client.
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
  register(discoverable: Discoverable<EntityInfo>) {
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
    const data = this.messageCallbacks.get(topic);
    if (!data) {
      return;
    }
    const { cb, sensor } = data;
    const str = payload.toString('utf8');
    let wrapper: MessageWrapper<unknown> = {
      isJson: false,
      str: str,
      json: null,
    };
    const parseAsJson = data.cb.parse ?? true;
    if (parseAsJson) {
      try {
        wrapper = {
          isJson: true,
          str: str,
          json: JSON.parse(str),
        };
      } catch {}
    }

    return cb(wrapper, sensor, topic, {
      raw: payload,
      client: this.client,
      entity: sensor.entity,
      packet: packet,
    });
  };
}
