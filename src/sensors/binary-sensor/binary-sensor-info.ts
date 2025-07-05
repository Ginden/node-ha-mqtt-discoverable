import { z } from 'zod';
import { Validate } from '../../validate';
import { EntityInfo } from '../../entity-info';
import { PropertyMap } from '../../types/property-map';
import { AutocompleteString } from '../../types';

/**
 *
 * battery: on means low, off means normal
 * battery_charging: on means charging, off means not charging
 * carbon_monoxide: on means carbon monoxide detected, off no carbon monoxide (clear)
 * cold: on means cold, off means normal
 * connectivity: on means connected, off means disconnected
 * door: on means open, off means closed
 * garage_door: on means open, off means closed
 * gas: on means gas detected, off means no gas (clear)
 * heat: on means hot, off means normal
 * light: on means light detected, off means no light
 * lock: on means open (unlocked), off means closed (locked)
 * moisture: on means moisture detected (wet), off means no moisture (dry)
 * motion: on means motion detected, off means no motion (clear)
 * moving: on means moving, off means not moving (stopped)
 * occupancy: on means occupied (detected), off means not occupied (clear)
 * opening: on means open, off means closed
 * plug: on means device is plugged in, off means device is unplugged
 * power: on means power detected, off means no power
 * presence: on means home, off means away
 * problem: on means problem detected, off means no problem (OK)
 * running: on means running, off means not running
 * safety: on means unsafe, off means safe
 * smoke: on means smoke detected, off means no smoke (clear)
 * sound: on means sound detected, off means no sound (clear)
 * tamper: on means tampering detected, off means no tampering (clear)
 * update: on means update available, off means up-to-date
 * vibration: on means vibration detected, off means no vibration (clear)
 * window: on means open, off means closed
 */

export type BinarySensorDeviceClass =
  | 'battery'
  | 'battery_charging'
  | 'cold'
  | 'connectivity'
  | 'door'
  | 'garage_door'
  | 'gas'
  | 'heat'
  | 'light'
  | 'lock'
  | 'moisture'
  | 'motion'
  | 'occupancy'
  | 'opening'
  | 'plug'
  | 'power'
  | 'presence'
  | 'problem'
  | 'running'
  | 'safety'
  | 'smoke'
  | 'sound'
  | 'vibration'
  | 'window';

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

  declare deviceClass?: AutocompleteString<BinarySensorDeviceClass>;

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
