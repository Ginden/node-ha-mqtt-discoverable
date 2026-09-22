import { z } from 'zod';
import { EntityInfo } from '../../entity-info';
import { PropertyMap } from '../../types/property-map';
import { Validate } from '../../validate';

/** MQTT discovery options. @see https://www.home-assistant.io/integrations/event.mqtt/ */
export class EventInfo extends EntityInfo {
  @Validate(z.literal('event'))
  readonly component = 'event';

  @Validate(z.array(z.string()).min(1))
  eventTypes!: string[];

  @Validate(z.string().optional())
  stateTopic?: string;

  @Validate(z.string().optional())
  valueTemplate?: string;

  @Validate(z.string().optional())
  jsonAttributesTemplate?: string;

  @Validate(z.string().optional())
  jsonAttributesTopic?: string;

  protected propertyMap() {
    return {
      ...super.propertyMap(),
      eventTypes: 'event_types',
      stateTopic: 'state_topic',
      valueTemplate: 'value_template',
      jsonAttributesTemplate: 'json_attributes_template',
      jsonAttributesTopic: 'json_attributes_topic',
    } as const satisfies PropertyMap<EventInfo>;
  }
}
