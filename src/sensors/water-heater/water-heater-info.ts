import { z } from 'zod';
import { EntityInfo } from '../../entity-info';
import { PropertyMap } from '../../types/property-map';
import { Validate } from '../../validate';

/** MQTT discovery options. @see https://www.home-assistant.io/integrations/water_heater.mqtt/ */
export class WaterHeaterInfo extends EntityInfo {
  @Validate(z.literal('water_heater'))
  readonly component = 'water_heater';

  @Validate(z.string().optional())
  currentTemperatureTemplate?: string;

  @Validate(z.string().optional())
  currentTemperatureTopic?: string;

  @Validate(z.number().int().optional())
  initial?: number;

  @Validate(z.number().finite().optional())
  maxTemp?: number;

  @Validate(z.number().finite().optional())
  minTemp?: number;

  @Validate(z.string().optional())
  modeCommandTemplate?: string;

  @Validate(z.string().optional())
  modeCommandTopic?: string;

  @Validate(z.string().optional())
  modeStateTemplate?: string;

  @Validate(z.string().optional())
  modeStateTopic?: string;

  @Validate(z.array(z.string()).optional())
  modes?: string[];

  @Validate(z.boolean().optional())
  optimistic?: boolean;

  @Validate(z.string().optional())
  payloadOff?: string;

  @Validate(z.string().optional())
  payloadOn?: string;

  @Validate(z.string().optional())
  powerCommandTemplate?: string;

  @Validate(z.string().optional())
  powerCommandTopic?: string;

  @Validate(z.union([z.literal(0.1), z.literal(0.5), z.literal(1)]).optional())
  precision?: 0.1 | 0.5 | 1;

  @Validate(z.boolean().optional())
  retain?: boolean;

  @Validate(z.string().optional())
  temperatureCommandTemplate?: string;

  @Validate(z.string().optional())
  temperatureCommandTopic?: string;

  @Validate(z.string().optional())
  temperatureStateTemplate?: string;

  @Validate(z.string().optional())
  temperatureStateTopic?: string;

  @Validate(z.enum(['C', 'F']).optional())
  temperatureUnit?: 'C' | 'F';

  @Validate(z.string().optional())
  valueTemplate?: string;

  @Validate(z.string().optional())
  jsonAttributesTemplate?: string;

  @Validate(z.string().optional())
  jsonAttributesTopic?: string;

  protected propertyMap() {
    return {
      ...super.propertyMap(),
      currentTemperatureTemplate: 'current_temperature_template',
      currentTemperatureTopic: 'current_temperature_topic',
      initial: 'initial',
      maxTemp: 'max_temp',
      minTemp: 'min_temp',
      modeCommandTemplate: 'mode_command_template',
      modeCommandTopic: 'mode_command_topic',
      modeStateTemplate: 'mode_state_template',
      modeStateTopic: 'mode_state_topic',
      modes: 'modes',
      optimistic: 'optimistic',
      payloadOff: 'payload_off',
      payloadOn: 'payload_on',
      powerCommandTemplate: 'power_command_template',
      powerCommandTopic: 'power_command_topic',
      precision: 'precision',
      retain: 'retain',
      temperatureCommandTemplate: 'temperature_command_template',
      temperatureCommandTopic: 'temperature_command_topic',
      temperatureStateTemplate: 'temperature_state_template',
      temperatureStateTopic: 'temperature_state_topic',
      temperatureUnit: 'temperature_unit',
      valueTemplate: 'value_template',
      jsonAttributesTemplate: 'json_attributes_template',
      jsonAttributesTopic: 'json_attributes_topic',
    } as const satisfies PropertyMap<WaterHeaterInfo>;
  }
}
