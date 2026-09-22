import { assert } from 'tsafe';
import { Discoverable } from '../discoverable';
import { EntityInfo } from '../entity-info';
import { HaDiscoverableManager } from '../settings';
import { Subscriber } from '../subscriber';

/** Build only the transport topics supported by the particular MQTT platform. */
function configureTopics(
  base: Record<string, unknown>,
  info: EntityInfo,
  defaults: Record<string, string>,
  stateTopic: string,
): Record<string, unknown> {
  delete base.state_topic;
  delete base.command_topic;
  return {
    ...base,
    ...Object.fromEntries(
      Object.entries(defaults).map(([key, suffix]) => [
        key,
        suffix ? `${stateTopic}/${suffix}` : stateTopic,
      ]),
    ),
    ...info.modelDump(),
  };
}

/** Shared topic plumbing for the MQTT platforms with named state channels. @internal */
export abstract class TopicEntity<E extends EntityInfo> extends Discoverable<E> {
  constructor(entity: E, settings: HaDiscoverableManager) {
    super(settings, entity);
  }

  protected get topicDefaults(): Record<string, string> {
    return { state_topic: '' };
  }

  generateConfig() {
    return configureTopics(
      super.generateConfig(),
      this.entity,
      this.topicDefaults,
      this.stateTopic,
    );
  }

  protected initTopics() {
    super.initTopics();
    const config = this.entity.modelDump();
    const stateTopic = config.state_topic ?? config.topic;
    if (typeof stateTopic === 'string') this.stateTopic = stateTopic;
    if (typeof config.json_attributes_topic === 'string')
      this.attributesTopic = config.json_attributes_topic;
  }

  protected publishState(key: string, payload: string | number, retain = true) {
    const topic = this.generateConfig()[key];
    assert(typeof topic === 'string', `${key} is not configured for ${this.entity.name}`);
    return this._state_helper(payload, topic, undefined, retain);
  }
}

/** Shared command routing for platforms with multiple MQTT command topics. @internal */
export abstract class TopicSubscriber<E extends EntityInfo, Command = string> extends Subscriber<
  E,
  Command
> {
  parseJson = false;

  public get commandTopic(): string {
    const config = this.generateConfig();
    const key = this.commandTopicKeys[0];
    return config[key] as string;
  }

  protected get topicDefaults(): Record<string, string> {
    return { state_topic: '', command_topic: 'command' };
  }

  protected get commandTopicKeys(): string[] {
    return ['command_topic'];
  }

  generateConfig(): Record<string, unknown> {
    // Skip Subscriber.generateConfig: commandTopic is derived from this configuration.
    const base = {
      json_attributes_topic: this.attributesTopic,
      ...(this.availabilityTopic ? { availability_topic: this.availabilityTopic } : {}),
    };
    return configureTopics(base, this.entity, this.topicDefaults, this.stateTopic);
  }

  async subscribe() {
    const config = this.generateConfig();
    const topics = new Set(this.commandTopicKeys.map((key) => config[key]));
    for (const topic of topics) {
      if (typeof topic === 'string') {
        this.settings.addCommandCallback(topic, this);
        await this.mqtt.subscribeAsync(topic, { qos: 1 });
      }
    }
  }

  protected initTopics() {
    super.initTopics();
    const config = this.entity.modelDump();
    const stateTopic = config.state_topic ?? config.topic;
    if (typeof stateTopic === 'string') this.stateTopic = stateTopic;
    if (typeof config.json_attributes_topic === 'string')
      this.attributesTopic = config.json_attributes_topic;
  }

  protected publishState(key: string, payload: string | number) {
    const config = this.generateConfig();
    const topic = config[key];
    assert(typeof topic === 'string', `${key} is not configured for ${this.entity.name}`);
    return this._state_helper(payload, topic, undefined, config.retain !== false);
  }
}
