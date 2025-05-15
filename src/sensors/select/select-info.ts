import { Validate } from '../../validate';
import { z } from 'zod';
import { EntityInfo } from '../../entity-info';
import { PropertyMap } from '../../types/property-map';

/**
 * Select specific information
 */
export class SelectInfo extends EntityInfo {
  @Validate(z.literal('select'))
  readonly component = 'select';

  /**
   * Flag that defines if select works in optimistic mode.
   * Default: true if no state_topic defined, else false.
   */
  @Validate(z.boolean().optional())
  optimistic?: boolean;

  /** If the published message should have the retain flag on or not */
  @Validate(z.boolean().optional())
  retain?: boolean;

  /** The MQTT topic subscribed to receive state updates. */
  @Validate(z.string().optional())
  stateTopic?: string;

  /**
   * List of options that can be selected.
   * An empty list or a list with a single item is allowed.
   */
  @Validate(z.array(z.union([z.string(), z.number()])).optional())
  options?: (string | number)[];

  /**
   * Mapping of class properties to MQTT payload keys.
   */
  protected propertyMap() {
    return {
      ...super.propertyMap(),
      component: 'component',
      optimistic: 'optimistic',
      retain: 'retain',
      stateTopic: 'state_topic',
      options: 'options',
    } as const satisfies PropertyMap<SelectInfo>;
  }
}
