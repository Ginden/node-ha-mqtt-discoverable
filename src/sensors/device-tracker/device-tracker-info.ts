import { z } from 'zod';
import { EntityInfo } from '../../entity-info';
import { PropertyMap } from '../../types/property-map';
import { Validate } from '../../validate';

/** MQTT discovery options. @see https://www.home-assistant.io/integrations/device_tracker.mqtt/ */
export class DeviceTrackerInfo extends EntityInfo {
  @Validate(z.literal('device_tracker'))
  readonly component = 'device_tracker';

  @Validate(z.string().optional())
  payloadHome?: string;

  @Validate(z.string().optional())
  payloadNotHome?: string;

  @Validate(z.string().optional())
  payloadReset?: string;

  @Validate(z.enum(['gps', 'router', 'bluetooth', 'bluetooth_le']).optional())
  sourceType?: 'gps' | 'router' | 'bluetooth' | 'bluetooth_le';

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
      payloadHome: 'payload_home',
      payloadNotHome: 'payload_not_home',
      payloadReset: 'payload_reset',
      sourceType: 'source_type',
      stateTopic: 'state_topic',
      valueTemplate: 'value_template',
      jsonAttributesTemplate: 'json_attributes_template',
      jsonAttributesTopic: 'json_attributes_topic',
    } as const satisfies PropertyMap<DeviceTrackerInfo>;
  }
}
