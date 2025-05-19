import { Discoverable, DiscoverableEvents } from './discoverable';
import { EntityInfo } from './entity-info';
import { MessageDetails } from './settings/message-callback';
import { HaDiscoverableManager } from './settings';

export interface SubscriberEvents<CommandOptions, Sensor, EI extends EntityInfo>
  extends DiscoverableEvents {
  'command.json': [
    json: CommandOptions,
    sensor: Sensor,
    topic: string,
    details: MessageDetails<EI>,
  ];
  'command.string': [str: string, sensor: Sensor, topic: string, details: MessageDetails<EI>];
  'command.unparsable': [raw: Buffer, sensor: Sensor, topic: string, details: MessageDetails<EI>];
}

/**
 * Specialized subclass that listens to commands coming from an MQTT topic
 */
export abstract class Subscriber<
  E extends EntityInfo,
  CommandOptions = unknown,
  Sensor extends Discoverable<E> = Discoverable<E>,
  Events extends SubscriberEvents<CommandOptions, Sensor, E> = SubscriberEvents<
    CommandOptions,
    Sensor,
    E
  >,
> extends Discoverable<E, Events> {
  constructor(entityInfo: E, settings: HaDiscoverableManager) {
    super(settings, entityInfo, () => this.subscribe());
  }

  public get commandTopic(): string {
    return `${this.stateTopic}/command`;
  }

  public async subscribe() {
    this.settings.addCommandCallback(this.commandTopic, this);
    await this.mqtt.subscribeAsync(this.commandTopic, { qos: 1 });
  }

  public withCommand(cb: (...args: Events['command.json']) => unknown) {
    this.on('command.json', cb);
    return this;
  }

  /** Override base config to add the command topic of this switch */
  generateConfig() {
    return {
      ...super.generateConfig(),
      command_topic: this.commandTopic,
    };
  }

  protected publish(topic: string, payload: string | Buffer) {
    return this.mqtt.publishAsync(topic, payload);
  }
}
