import { Discoverable, DiscoverableEvents } from './discoverable';
import { EntityInfo } from './entity-info';
import { MessageDetails } from './settings/message-callback';
import { HaDiscoverableManager } from './settings';
import {JsonValue} from "type-fest";

export interface SubscriberEvents<CommandOptions, Sensor, EI extends EntityInfo>
  extends DiscoverableEvents {
  // If parseJson is true, this will be emitted with the parsed JSON payload
  'command.json': [
    json: CommandOptions,
    sensor: Sensor,
    topic: string,
    details: MessageDetails<EI>,
  ];
  // If isBuffer is false, this will be emitted with the string payload
  'command.string': [str: string, sensor: Sensor, topic: string, details: MessageDetails<EI>];
  // This will be emitted if the payload is not valid JSON or (isBuffer && !parseJson)
  'command.raw': [raw: Buffer, sensor: Sensor, topic: string, details: MessageDetails<EI>];
}

/**
 * Specialized subclass that listens to commands coming from an MQTT topic
 */
export abstract class Subscriber<
  E extends EntityInfo,
  CommandOptions extends JsonValue | unknown = unknown,
  Sensor extends Discoverable<E> = Discoverable<E>,
  Events extends SubscriberEvents<CommandOptions, Sensor, E> = SubscriberEvents<
    CommandOptions,
    Sensor,
    E
  >,
> extends Discoverable<E, Events> {
  public parseJson = true;
  public isBuffer = false;
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
