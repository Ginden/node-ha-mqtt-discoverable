import { EntityInfo } from './entity-info';
import { HaDiscoverableManager } from './settings/ha-discoverables-manager';
import { MqttClient } from 'mqtt';
import { assert } from 'tsafe';
import { cleanString } from './utils/clean-string';
import { CustomEventEmitter } from './custom-event-emitter';

export type DiscoverableEvents = {
  connected: [Discoverable<EntityInfo>];
  'write-config': [Discoverable<EntityInfo>, config: Record<string, unknown>];
  error: [Error];
};

/**
 * Base class for making MQTT discoverable objects
 */
export abstract class Discoverable<
  E extends EntityInfo,
  Events extends DiscoverableEvents = DiscoverableEvents,
> extends CustomEventEmitter<Events> {
  public readonly entity: E;
  protected readonly settings: HaDiscoverableManager;
  protected entityTopic: string;
  protected configTopic: string;
  protected stateTopic: string;
  protected attributesTopic: string;
  protected availabilityTopic?: string;
  protected wroteConfiguration: boolean = false;

  /**
   */
  constructor(
    settings: HaDiscoverableManager,
    entityInfo: E,
    onConnect?: (client: MqttClient) => void,
  ) {
    super({
      captureRejections: true,
    });
    this.entity = entityInfo;
    this.settings = settings;
    this.settings.addConnectCallback(async () => {
      await this.writeConfig();
      this.emitVoid('connected', this);
    });
    if (onConnect) {
      this.settings.addConnectCallback(onConnect);
    }
    this.settings.register(this);
    this.initTopics();
  }

  protected get mqtt() {
    return this.settings.client;
  }

  protected get logger() {
    return this.settings.logger;
  }

  /**
   * Register the entity within Home Assistant
   */
  public async register() {
    await this.writeConfig();
  }

  /**
   * Unregister the entity from Home Assistant
   */
  public async unregister() {
    for (const topic of [
      this.configTopic,
      this.stateTopic,
      this.attributesTopic,
      this.availabilityTopic,
    ].filter(Boolean)) {
      await this.mqtt.publishAsync(topic!, '', { retain: true });
    }
  }

  /**
   * Writes the configuration to the MQTT broker
   */
  async writeConfig() {
    this.wroteConfiguration = true;
    try {
      const configMessage = this.generateConfig();
      const configTopic = this.configTopic;

      this.logger.debug('Writing configuration', {
        ...this.debugInfo(),
        configTopic,
        configMessage,
      });

      assert(configTopic, 'Config topic not set');
      const ret = await this.mqtt.publishAsync(configTopic, JSON.stringify(configMessage));
      this.emitVoid('write-config', this, configMessage);
      return ret;
    } catch (e) {
      this.wroteConfiguration = false;
      this.logger.warn(`Failed to write configuration: ${e}`, this.debugInfo());
      throw e;
    }
  }

  async setAttributes(attributes: Record<string, unknown>) {
    const attributesTopic = this.attributesTopic;
    assert(attributesTopic, 'Attributes topic not set');
    this.logger.debug('Writing attributes', {
      ...this.debugInfo(),
      attributesTopic,
      attributes,
    });

    return this._state_helper(JSON.stringify(attributes), attributesTopic);
  }

  /**
   * This method will throw an error if the availability topic is not set
   * @param available
   */
  async setAvailability(available: boolean) {
    assert(this.availabilityTopic, 'Availability topic not set');
    this.logger.debug('Writing availability', {
      ...this.debugInfo(),
      available,
    });
    return this._state_helper(available ? 'online' : 'offline', this.availabilityTopic);
  }

  protected generateConfig() {
    const config = this.entity.modelDump();
    const topics = {
      state_topic: this.stateTopic,
      json_attributes_topic: this.attributesTopic,
      ...(this.availabilityTopic ? { availability_topic: this.availabilityTopic } : {}),
    };

    return {
      ...config,
      ...topics,
    };
  }

  protected async _state_helper(
    // FIXME: this type is wrong
    state: string | number | null | Buffer = null,
    topic: string | null = null,
    last_reset: string | null = null,
    retain: boolean = true,
  ) {
    if (!this.wroteConfiguration) {
      this.logger.debug('Writing sensor configuration', this.debugInfo());
      await this.writeConfig();
    }
    if (!topic) {
      this.logger.debug('No topic provided, using state topic', this.debugInfo());
      topic = this.stateTopic;
    }
    if (last_reset) {
      state = JSON.stringify({ state, last_reset });
    }
    this.logger.debug('Writing state', {
      ...this.debugInfo(),
      topic,
      state,
    });
    assert(topic, 'Topic is required');
    if (state instanceof Uint8Array) {
      return await this.mqtt.publishAsync(topic, state, { retain });
    }
    return await this.mqtt.publishAsync(topic, String(state), { retain });
  }

  protected initTopics() {
    this.entityTopic = `${this.entity.component}`;
    if (this.entity.device) {
      this.entityTopic += `/${cleanString(this.entity.device.name)}`;
    }
    this.entityTopic += `/${cleanString(this.entity.name)}`;

    this.configTopic = `${this.settings.mqttSettings.discoveryPrefix}/${this.entityTopic}/config`;
    this.stateTopic = `${this.settings.mqttSettings.statePrefix}/${this.entityTopic}/state`;
    this.attributesTopic = `${this.settings.mqttSettings.statePrefix}/${this.entityTopic}/attributes`;
    if (this.settings.manualAvailability) {
      this.availabilityTopic = `${this.settings.mqttSettings.statePrefix}/${this.entityTopic}/availability`;
    }
  }

  protected debugInfo() {
    return {
      type: this.constructor.name,
    };
  }
}
