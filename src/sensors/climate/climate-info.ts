import { z } from 'zod';
import { EntityInfo } from '../../entity-info';
import { PropertyMap } from '../../types/property-map';
import { Validate } from '../../validate';

/** MQTT discovery options. @see https://www.home-assistant.io/integrations/climate.mqtt/ */
export class ClimateInfo extends EntityInfo {
  @Validate(z.literal('climate'))
  readonly component = 'climate';

  @Validate(z.string().optional())
  actionTemplate?: string;

  @Validate(z.string().optional())
  actionTopic?: string;

  @Validate(z.string().optional())
  currentHumidityTemplate?: string;

  @Validate(z.string().optional())
  currentHumidityTopic?: string;

  @Validate(z.string().optional())
  currentTemperatureTemplate?: string;

  @Validate(z.string().optional())
  currentTemperatureTopic?: string;

  @Validate(z.string().optional())
  fanModeCommandTemplate?: string;

  @Validate(z.string().optional())
  fanModeCommandTopic?: string;

  @Validate(z.string().optional())
  fanModeStateTemplate?: string;

  @Validate(z.string().optional())
  fanModeStateTopic?: string;

  @Validate(z.array(z.string()).optional())
  fanModes?: string[];

  @Validate(z.number().finite().optional())
  initial?: number;

  @Validate(z.number().finite().optional())
  maxHumidity?: number;

  @Validate(z.number().finite().optional())
  maxTemp?: number;

  @Validate(z.number().finite().optional())
  minHumidity?: number;

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

  @Validate(z.string().optional())
  presetModeCommandTemplate?: string;

  @Validate(z.string().optional())
  presetModeCommandTopic?: string;

  @Validate(z.string().optional())
  presetModeStateTopic?: string;

  @Validate(z.string().optional())
  presetModeValueTemplate?: string;

  @Validate(z.array(z.string()).optional())
  presetModes?: string[];

  @Validate(z.boolean().optional())
  retain?: boolean;

  @Validate(z.string().optional())
  swingHorizontalModeCommandTemplate?: string;

  @Validate(z.string().optional())
  swingHorizontalModeCommandTopic?: string;

  @Validate(z.string().optional())
  swingHorizontalModeStateTemplate?: string;

  @Validate(z.string().optional())
  swingHorizontalModeStateTopic?: string;

  @Validate(z.array(z.string()).optional())
  swingHorizontalModes?: string[];

  @Validate(z.string().optional())
  swingModeCommandTemplate?: string;

  @Validate(z.string().optional())
  swingModeCommandTopic?: string;

  @Validate(z.string().optional())
  swingModeStateTemplate?: string;

  @Validate(z.string().optional())
  swingModeStateTopic?: string;

  @Validate(z.array(z.string()).optional())
  swingModes?: string[];

  @Validate(z.string().optional())
  targetHumidityCommandTemplate?: string;

  @Validate(z.string().optional())
  targetHumidityCommandTopic?: string;

  @Validate(z.string().optional())
  targetHumidityStateTopic?: string;

  @Validate(z.string().optional())
  targetHumidityStateTemplate?: string;

  @Validate(z.string().optional())
  temperatureCommandTemplate?: string;

  @Validate(z.string().optional())
  temperatureCommandTopic?: string;

  @Validate(z.string().optional())
  temperatureHighCommandTemplate?: string;

  @Validate(z.string().optional())
  temperatureHighCommandTopic?: string;

  @Validate(z.string().optional())
  temperatureHighStateTemplate?: string;

  @Validate(z.string().optional())
  temperatureHighStateTopic?: string;

  @Validate(z.string().optional())
  temperatureLowCommandTemplate?: string;

  @Validate(z.string().optional())
  temperatureLowCommandTopic?: string;

  @Validate(z.string().optional())
  temperatureLowStateTemplate?: string;

  @Validate(z.string().optional())
  temperatureLowStateTopic?: string;

  @Validate(z.string().optional())
  temperatureStateTemplate?: string;

  @Validate(z.string().optional())
  temperatureStateTopic?: string;

  @Validate(z.enum(['C', 'F']).optional())
  temperatureUnit?: 'C' | 'F';

  @Validate(z.number().finite().optional())
  tempStep?: number;

  @Validate(z.string().optional())
  valueTemplate?: string;

  @Validate(z.string().optional())
  jsonAttributesTemplate?: string;

  @Validate(z.string().optional())
  jsonAttributesTopic?: string;

  protected propertyMap() {
    return {
      ...super.propertyMap(),
      actionTemplate: 'action_template',
      actionTopic: 'action_topic',
      currentHumidityTemplate: 'current_humidity_template',
      currentHumidityTopic: 'current_humidity_topic',
      currentTemperatureTemplate: 'current_temperature_template',
      currentTemperatureTopic: 'current_temperature_topic',
      fanModeCommandTemplate: 'fan_mode_command_template',
      fanModeCommandTopic: 'fan_mode_command_topic',
      fanModeStateTemplate: 'fan_mode_state_template',
      fanModeStateTopic: 'fan_mode_state_topic',
      fanModes: 'fan_modes',
      initial: 'initial',
      maxHumidity: 'max_humidity',
      maxTemp: 'max_temp',
      minHumidity: 'min_humidity',
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
      presetModeCommandTemplate: 'preset_mode_command_template',
      presetModeCommandTopic: 'preset_mode_command_topic',
      presetModeStateTopic: 'preset_mode_state_topic',
      presetModeValueTemplate: 'preset_mode_value_template',
      presetModes: 'preset_modes',
      retain: 'retain',
      swingHorizontalModeCommandTemplate: 'swing_horizontal_mode_command_template',
      swingHorizontalModeCommandTopic: 'swing_horizontal_mode_command_topic',
      swingHorizontalModeStateTemplate: 'swing_horizontal_mode_state_template',
      swingHorizontalModeStateTopic: 'swing_horizontal_mode_state_topic',
      swingHorizontalModes: 'swing_horizontal_modes',
      swingModeCommandTemplate: 'swing_mode_command_template',
      swingModeCommandTopic: 'swing_mode_command_topic',
      swingModeStateTemplate: 'swing_mode_state_template',
      swingModeStateTopic: 'swing_mode_state_topic',
      swingModes: 'swing_modes',
      targetHumidityCommandTemplate: 'target_humidity_command_template',
      targetHumidityCommandTopic: 'target_humidity_command_topic',
      targetHumidityStateTopic: 'target_humidity_state_topic',
      targetHumidityStateTemplate: 'target_humidity_state_template',
      temperatureCommandTemplate: 'temperature_command_template',
      temperatureCommandTopic: 'temperature_command_topic',
      temperatureHighCommandTemplate: 'temperature_high_command_template',
      temperatureHighCommandTopic: 'temperature_high_command_topic',
      temperatureHighStateTemplate: 'temperature_high_state_template',
      temperatureHighStateTopic: 'temperature_high_state_topic',
      temperatureLowCommandTemplate: 'temperature_low_command_template',
      temperatureLowCommandTopic: 'temperature_low_command_topic',
      temperatureLowStateTemplate: 'temperature_low_state_template',
      temperatureLowStateTopic: 'temperature_low_state_topic',
      temperatureStateTemplate: 'temperature_state_template',
      temperatureStateTopic: 'temperature_state_topic',
      temperatureUnit: 'temperature_unit',
      tempStep: 'temp_step',
      valueTemplate: 'value_template',
      jsonAttributesTemplate: 'json_attributes_template',
      jsonAttributesTopic: 'json_attributes_topic',
    } as const satisfies PropertyMap<ClimateInfo>;
  }
}
