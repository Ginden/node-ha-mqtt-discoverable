import { z } from 'zod';
import { EntityInfo } from '../../entity-info';
import { PropertyMap } from '../../types/property-map';
import { Validate } from '../../validate';

/** MQTT discovery options. @see https://www.home-assistant.io/integrations/notify.mqtt/ */
export class NotifyInfo extends EntityInfo {
  @Validate(z.literal('notify'))
  readonly component = 'notify';

  @Validate(z.string().optional())
  commandTemplate?: string;

  @Validate(z.string().optional())
  commandTopic?: string;

  @Validate(z.boolean().optional())
  retain?: boolean;

  @Validate(z.string().optional())
  jsonAttributesTemplate?: string;

  @Validate(z.string().optional())
  jsonAttributesTopic?: string;

  protected propertyMap() {
    return {
      ...super.propertyMap(),
      commandTemplate: 'command_template',
      commandTopic: 'command_topic',
      retain: 'retain',
      jsonAttributesTemplate: 'json_attributes_template',
      jsonAttributesTopic: 'json_attributes_topic',
    } as const satisfies PropertyMap<NotifyInfo>;
  }
}
