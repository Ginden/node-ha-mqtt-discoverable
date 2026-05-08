import { Validate } from '../../validate';
import { z } from 'zod';
import { EntityInfo } from '../../entity-info';
import { PropertyMap } from '../../types/property-map';

/**
 * Information about the `time` entity
 */
export class TimeInfo extends EntityInfo {
  @Validate(z.literal('time'))
  readonly component = 'time';

  /** Defines a template to generate the payload to send to command_topic. */
  @Validate(z.string().optional())
  commandTemplate?: string;

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
      commandTemplate: 'command_template',
      retain: 'retain',
      stateTopic: 'state_topic',
    } as const satisfies PropertyMap<TimeInfo>;
  }
}
