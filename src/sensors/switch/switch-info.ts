import { Validate } from '../../validate';
import { z } from 'zod';
import { EntityInfo } from '../../entity-info';
import { PropertyMap } from '../../types/property-map';

/**
 * Switch specific information
 */
export class SwitchInfo extends EntityInfo {
  @Validate(z.literal('switch'))
  readonly component = 'switch';

  /**
   * Flag that defines if switch works in optimistic mode.
   * Default: true if no state_topic defined, else false.
   */
  @Validate(z.boolean().optional())
  optimistic?: boolean;

  /**
   * The payload that represents off state. If specified, will be used for
   * both comparing to the value in the state_topic (see value_template and
   * state_off for details) and sending as off command to the command_topic
   */
  @Validate(z.string().optional())
  payloadOff: string = 'OFF';

  /**
   * The payload that represents on state. If specified, will be used for both
   * comparing to the value in the state_topic (see value_template and state_on
   * for details) and sending as on command to the command_topic.
   */
  @Validate(z.string().optional())
  payloadOn: string = 'ON';

  /** If the published message should have the retain flag on or not */
  @Validate(z.boolean().optional())
  retain?: boolean;

  /** The MQTT topic subscribed to receive state updates. */
  @Validate(z.string().optional())
  stateTopic?: string;

  /**
   * Mapping of class properties to MQTT payload keys.
   */
  protected propertyMap() {
    return {
      ...super.propertyMap(),
      component: 'component',
      optimistic: 'optimistic',
      payloadOff: 'payload_off',
      payloadOn: 'payload_on',
      retain: 'retain',
      stateTopic: 'state_topic',
    } as const satisfies PropertyMap<SwitchInfo>;
  }
}
