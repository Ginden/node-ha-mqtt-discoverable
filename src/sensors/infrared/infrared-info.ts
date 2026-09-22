import { z } from 'zod';
import { EntityInfo } from '../../entity-info';
import { PropertyMap } from '../../types/property-map';
import { Validate } from '../../validate';

/** MQTT infrared emitter discovery options. */
export class InfraredEmitterInfo extends EntityInfo {
  @Validate(z.literal('infrared'))
  readonly component = 'infrared';
  @Validate(z.literal('emitter'))
  readonly schema = 'emitter';
  @Validate(z.string().optional())
  commandTopic?: string;
  @Validate(z.string().optional())
  commandTemplate?: string;
  @Validate(z.boolean().optional())
  retain?: boolean;

  protected propertyMap() {
    return {
      ...super.propertyMap(),
      schema: 'schema',
      commandTopic: 'command_topic',
      commandTemplate: 'command_template',
      retain: 'retain',
    } as const satisfies PropertyMap<InfraredEmitterInfo>;
  }
}

/** MQTT infrared receiver discovery options. */
export class InfraredReceiverInfo extends EntityInfo {
  @Validate(z.literal('infrared'))
  readonly component = 'infrared';
  @Validate(z.literal('receiver'))
  readonly schema = 'receiver';
  @Validate(z.string().optional())
  stateTopic?: string;
  @Validate(z.string().optional())
  valueTemplate?: string;

  protected propertyMap() {
    return {
      ...super.propertyMap(),
      schema: 'schema',
      stateTopic: 'state_topic',
      valueTemplate: 'value_template',
    } as const satisfies PropertyMap<InfraredReceiverInfo>;
  }
}
