import type { IPublishPacket, MqttClient } from 'mqtt';
import type { EntityInfo } from '../entity-info';

export type MessageWrapper<T = unknown> =
  | {
      isJson: false;
      str: string;
      json: null;
    }
  | {
      isJson: true;
      str: string;
      json: T;
    };

export type MessageDetails<EI extends EntityInfo> = {
  raw: Buffer;
  client: MqttClient;
  entity: EI;
  packet: IPublishPacket;
};

export type MessageCallback<T = unknown, Sensor = unknown, EI extends EntityInfo = EntityInfo> = ((
  msg: MessageWrapper<T>,
  sensor: Sensor,
  topic: string,
  details: MessageDetails<EI>,
) => unknown) & {
  /**
   * If true, the message will be parsed as JSON and passed to the callback.
   * Default: `true`
   */
  parse?: boolean;
};
