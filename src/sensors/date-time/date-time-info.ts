import { Validate } from '../../validate';
import { z } from 'zod';
import { EntityInfo } from '../../entity-info';
import { PropertyMap } from '../../types/property-map';

/**
 * Information about the `datetime` entity
 */
export class DateTimeInfo extends EntityInfo {
  @Validate(z.literal('datetime'))
  readonly component = 'datetime';

  /** Defines a template to generate the payload to send to command_topic. */
  @Validate(z.string().optional())
  commandTemplate?: string;

  /** If the published message should have the retain flag on or not */
  @Validate(z.boolean().optional())
  retain?: boolean;

  /** The MQTT topic subscribed to receive state updates. */
  @Validate(z.string().optional())
  stateTopic?: string;

  /** IANA timezone identifier used when incoming state has no timezone. */
  @Validate(z.string().optional())
  timezone?: string;

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
      timezone: 'timezone',
    } as const satisfies PropertyMap<DateTimeInfo>;
  }
}
