import { Validate } from '../../validate';
import { z } from 'zod';
import { EntityInfo } from '../../entity-info';
import { PropertyMap } from '../../types/property-map';

/**
 * Information about the `text` entity
 */
export class TextInfo extends EntityInfo {
  @Validate(z.literal('text'))
  readonly component = 'text';

  /** The maximum size of a text being set or received (maximum is 255). */
  @Validate(z.number().optional())
  max: number = 255;

  /** The minimum size of a text being set or received. */
  @Validate(z.number().optional())
  min: number = 0;

  /** The mode off the text entity. Must be either text or password. */
  @Validate(z.string().optional())
  mode?: string;

  /** A valid regular expression the text being set or received must match with. */
  @Validate(z.string().optional())
  pattern?: string;

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
      max: 'max',
      min: 'min',
      mode: 'mode',
      pattern: 'pattern',
      retain: 'retain',
    } as const satisfies PropertyMap<TextInfo>;
  }
}
