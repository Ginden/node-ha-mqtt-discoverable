import { EntityInfo } from '../../entity-info';
import { Validate } from '../../validate';
import { z } from 'zod';
import { PropertyMap } from '../../types/property-map';

/**
 * Sensor specific information
 */
export class SensorInfo extends EntityInfo {
  /** Sensor component type */
  @Validate(z.literal('sensor'))
  readonly component = 'sensor';

  /** Defines the units of measurement of the sensor, if any. */
  @Validate(z.string().optional())
  unitOfMeasurement?: string;

  /**
   * Defines the type of state.
   * If not None, the sensor is assumed to be numerical and will be displayed as a line-chart in the frontend instead of as discrete values.
   */
  @Validate(z.string().optional())
  stateClass?: string;

  /**
   * Defines a template to extract the value.
   * If the template throws an error, the current state will be used instead.
   */
  @Validate(z.string().optional())
  valueTemplate?: string;

  /**
   * Defines a template to extract the last_reset.
   * When last_reset_value_template is set, the state_class option must be total.
   * Available variables: entity_id.
   * The entity_id can be used to reference the entity’s attributes.
   */
  @Validate(z.string().optional())
  lastResetValueTemplate?: string;

  /** The number of decimals which should be used in the sensor’s state after rounding. */
  @Validate(z.number().int().min(0).optional())
  suggestedDisplayPrecision?: number;

  /** Mapping of class properties to MQTT payload keys */
  /**
   * Mapping of class properties to MQTT payload keys.
   */
  protected propertyMap() {
    return {
      ...super.propertyMap(),
      component: 'component',
      unitOfMeasurement: 'unit_of_measurement',
      stateClass: 'state_class',
      valueTemplate: 'value_template',
      lastResetValueTemplate: 'last_reset_value_template',
      suggestedDisplayPrecision: 'suggested_display_precision',
    } as const satisfies PropertyMap<SensorInfo>;
  }
}
