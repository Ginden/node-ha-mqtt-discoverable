import { Discoverable } from './discoverable';
import { EntityInfo } from './entity-info';
import { MessageCallback } from './settings/message-callback';
import { HaDiscoverableManager } from './settings';

/**
 * Specialized subclass that listens to commands coming from an MQTT topic
 */
export abstract class Subscriber<
  E extends EntityInfo,
  CommandOptions = unknown,
  Sensor extends Discoverable<E> = Discoverable<E>,
> extends Discoverable<E> {
  constructor(
    entityInfo: E,
    settings: HaDiscoverableManager,
    private readonly commandCallback: MessageCallback<CommandOptions, Sensor, E>,
  ) {
    super(settings, entityInfo, () => this.subscribe());
  }

  protected get _commandTopic(): string {
    return `${this.settings.mqttSettings.statePrefix}/${this.stateTopic}/command`;
  }

  public async subscribe() {
    this.settings.addMessageCallback(
      this._commandTopic,
      this.commandCallback as MessageCallback,
      this,
    );
    await this.mqtt.subscribeAsync(this._commandTopic, { qos: 1 });
  }

  /** Override base config to add the command topic of this switch */
  generateConfig() {
    return {
      ...super.generateConfig(),
      command_topic: this._commandTopic,
    };
  }

  protected publish(topic: string, payload: string | Buffer) {
    return this.mqtt.publishAsync(topic, payload);
  }
}
