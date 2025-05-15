import { Validate } from '../../validate';
import { z } from 'zod';
import { EntityInfo } from '../../entity-info';
import { PropertyMap } from '../../types/property-map';

/**
 * Information about the 'number' entity
 */
export class NumberInfo extends EntityInfo {
  @Validate(z.literal('number'))
  readonly component = 'number';

  /** The maximum value of the number (defaults to 100) */
  @Validate(z.number().optional())
  max: number = 100;

  /** The maximum value of the number (defaults to 1) */
  @Validate(z.number().optional())
  min: number = 1;

  /**
   * Control how the number should be displayed in the UI. Can be set to box
   * or slider to force a display mode.
   */
  @Validate(z.string().optional())
  mode?: string;

  /**
   * Flag that defines if switch works in optimistic mode.
   * Default: true if no state_topic defined, else false.
   */
  @Validate(z.boolean().optional())
  optimistic?: boolean;

  /**
   * A special payload that resets the state to None when received on the
   * state_topic.
   */
  @Validate(z.string().optional())
  payloadReset?: string;

  /** If the published message should have the retain flag on or not */
  @Validate(z.boolean().optional())
  retain?: boolean;

  /** The MQTT topic subscribed to receive state updates. */
  @Validate(z.string().optional())
  stateTopic?: string;

  /** Step value. Smallest acceptable value is 0.001. Defaults to 1.0. */
  @Validate(z.number().optional())
  step?: number;

  /**
   * Defines the unit of measurement of the sensor, if any. The
   * unit_of_measurement can be null.
   */
  @Validate(z.string().optional())
  unitOfMeasurement?: string;

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
      optimistic: 'optimistic',
      payloadReset: 'payload_reset',
      retain: 'retain',
      stateTopic: 'state_topic',
      step: 'step',
      unitOfMeasurement: 'unit_of_measurement',
    } as const satisfies PropertyMap<NumberInfo>;
  }
}
