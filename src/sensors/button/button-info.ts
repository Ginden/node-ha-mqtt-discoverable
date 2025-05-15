import { z } from 'zod';
import { EntityInfo } from '../../entity-info';
import { Validate } from '../../validate';
import { PropertyMap } from '../../types/property-map';

/**
 * Button-specific information
 */
export class ButtonInfo extends EntityInfo {
  /** Component type for a button */
  @Validate(z.literal('button'))
  readonly component = 'button';

  /** The payload to send to trigger the button. */
  @Validate(z.string().optional())
  readonly payloadPress = 'PRESS';

  /** If the published message should have the retain flag on or not */
  @Validate(z.boolean().optional())
  retain?: boolean;

  /**
   * Mapping of class properties to MQTT payload keys.
   */
  protected propertyMap() {
    return {
      ...super.propertyMap(),
      component: 'component',
      payloadPress: 'payload_press',
      retain: 'retain',
    } as const satisfies PropertyMap<ButtonInfo>;
  }
}
