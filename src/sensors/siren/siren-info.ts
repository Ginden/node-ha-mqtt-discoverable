import { z } from 'zod';
import { EntityInfo } from '../../entity-info';
import { PropertyMap } from '../../types/property-map';
import { Validate } from '../../validate';

/** MQTT discovery options. @see https://www.home-assistant.io/integrations/siren.mqtt/ */
export class SirenInfo extends EntityInfo {
  @Validate(z.literal('siren'))
  readonly component = 'siren';

  @Validate(z.array(z.union([z.string(), z.number()])).optional())
  availableTones?: (string | number)[];

  @Validate(z.string().optional())
  commandTemplate?: string;

  @Validate(z.string().optional())
  commandOffTemplate?: string;

  @Validate(z.string().optional())
  commandTopic?: string;

  @Validate(z.boolean().optional())
  optimistic?: boolean;

  @Validate(z.string().optional())
  payloadOff?: string;

  @Validate(z.string().optional())
  payloadOn?: string;

  @Validate(z.boolean().optional())
  retain?: boolean;

  @Validate(z.string().optional())
  stateOff?: string;

  @Validate(z.string().optional())
  stateOn?: string;

  @Validate(z.string().optional())
  stateTopic?: string;

  @Validate(z.string().optional())
  stateValueTemplate?: string;

  @Validate(z.boolean().optional())
  supportDuration?: boolean;

  @Validate(z.boolean().optional())
  supportVolumeSet?: boolean;

  @Validate(z.string().optional())
  jsonAttributesTemplate?: string;

  @Validate(z.string().optional())
  jsonAttributesTopic?: string;

  protected propertyMap() {
    return {
      ...super.propertyMap(),
      availableTones: 'available_tones',
      commandTemplate: 'command_template',
      commandOffTemplate: 'command_off_template',
      commandTopic: 'command_topic',
      optimistic: 'optimistic',
      payloadOff: 'payload_off',
      payloadOn: 'payload_on',
      retain: 'retain',
      stateOff: 'state_off',
      stateOn: 'state_on',
      stateTopic: 'state_topic',
      stateValueTemplate: 'state_value_template',
      supportDuration: 'support_duration',
      supportVolumeSet: 'support_volume_set',
      jsonAttributesTemplate: 'json_attributes_template',
      jsonAttributesTopic: 'json_attributes_topic',
    } as const satisfies PropertyMap<SirenInfo>;
  }
}
