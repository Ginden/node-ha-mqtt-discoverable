import type { IPublishPacket, MqttClient } from 'mqtt';
import type { EntityInfo } from '../entity-info';

export type MessageDetails<EI extends EntityInfo> = {
  raw: Buffer;
  client: MqttClient;
  entity: EI;
  packet: IPublishPacket;
};
