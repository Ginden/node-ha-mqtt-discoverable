import { z } from 'zod';
import { Validate } from '../../validate';
import { EntityInfo } from '../../entity-info';
import { PropertyMap } from '../../types/property-map';

/**
 * Binary sensor-specific information
 */
export class BinarySensorInfo extends EntityInfo {
  /** Component type for binary sensor */
  @Validate(z.literal('binary_sensor'))
  readonly component = 'binary_sensor';

  /**
   * For sensors that only send on state updates (like PIRs), this variable
   * sets a delay in seconds after which the sensor's state will be updated back
   * to off.
   */
  @Validate(z.number().int().optional())
  offDelay?: number;

  /** Payload to send for the OFF state */
  @Validate(z.string())
  readonly payloadOff = 'off';

  /** Payload to send for the ON state */
  @Validate(z.string())
  readonly payloadOn = 'on';

  /**
   * Mapping of class properties to MQTT payload keys.
   */
  protected propertyMap() {
    return {
      ...super.propertyMap(),
      component: 'component',
      offDelay: 'off_delay',
      payloadOff: 'payload_off',
      payloadOn: 'payload_on',
    } as const satisfies PropertyMap<BinarySensorInfo>;
  }
}
