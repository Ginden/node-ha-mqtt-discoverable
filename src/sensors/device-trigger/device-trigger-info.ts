import { Validate } from '../../validate';
import { z } from 'zod';
import { EntityInfo } from '../../entity-info';
import { PropertyMap } from '../../types/property-map';

/**
 * Information about the device trigger
 */
export class DeviceTriggerInfo extends EntityInfo {
  @Validate(z.literal('device_automation'))
  readonly component = 'device_automation';

  /** The type of automation, must be ‘trigger’. */
  @Validate(z.literal('trigger'))
  readonly automationType = 'trigger';

  /** Optional payload to match the payload being sent over the topic. */
  @Validate(z.string().optional())
  payload?: string;

  /** The type of the trigger */
  @Validate(z.string())
  type: string;

  /** The subtype of the trigger */
  @Validate(z.string())
  subtype: string;

  /**
   * Mapping of class properties to MQTT payload keys.
   */
  protected propertyMap() {
    return {
      ...super.propertyMap(),
      component: 'component',
      automationType: 'automation_type',
      payload: 'payload',
      type: 'type',
      subtype: 'subtype',
      device: 'device',
    } as const satisfies PropertyMap<DeviceTriggerInfo>;
  }
}
