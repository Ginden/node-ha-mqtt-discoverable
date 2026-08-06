import { z } from 'zod';
import { EntityInfo } from '../../entity-info';
import { PropertyMap } from '../../types/property-map';
import { Validate } from '../../validate';

/** Direction values supported by an MQTT fan. */
export type FanDirection = 'forward' | 'reverse';

/**
 * Fan-specific MQTT discovery information.
 */
export class FanInfo extends EntityInfo {
  @Validate(z.literal('fan'))
  readonly component = 'fan';

  /** Defines a template to generate the payload sent to the command topic. */
  @Validate(z.string().optional())
  commandTemplate?: string;

  @Validate(z.string().optional())
  directionCommandTemplate?: string;

  /** MQTT topic used by Home Assistant to change the fan direction. */
  @Validate(z.string().optional())
  directionCommandTopic?: string;

  /** MQTT topic that publishes fan direction updates. */
  @Validate(z.string().optional())
  directionStateTopic?: string;

  @Validate(z.string().optional())
  directionValueTemplate?: string;

  @Validate(z.boolean().optional())
  optimistic?: boolean;

  @Validate(z.string())
  payloadOff = 'OFF';

  @Validate(z.string())
  payloadOn = 'ON';

  @Validate(z.string())
  payloadOscillationOff = 'oscillate_off';

  @Validate(z.string())
  payloadOscillationOn = 'oscillate_on';

  @Validate(z.string().optional())
  payloadResetPercentage?: string;

  @Validate(z.string().optional())
  payloadResetPresetMode?: string;

  @Validate(z.string().optional())
  oscillationCommandTemplate?: string;

  /** MQTT topic used by Home Assistant to change oscillation. */
  @Validate(z.string().optional())
  oscillationCommandTopic?: string;

  /** MQTT topic that publishes oscillation state updates. */
  @Validate(z.string().optional())
  oscillationStateTopic?: string;

  @Validate(z.string().optional())
  oscillationValueTemplate?: string;

  @Validate(z.string().optional())
  percentageCommandTemplate?: string;

  /** MQTT topic used by Home Assistant to change fan speed. */
  @Validate(z.string().optional())
  percentageCommandTopic?: string;

  /** MQTT topic that publishes fan speed updates. */
  @Validate(z.string().optional())
  percentageStateTopic?: string;

  @Validate(z.string().optional())
  percentageValueTemplate?: string;

  @Validate(z.string().optional())
  presetModeCommandTemplate?: string;

  /** MQTT topic used by Home Assistant to select a preset mode. */
  @Validate(z.string().optional())
  presetModeCommandTopic?: string;

  /** MQTT topic that publishes preset mode updates. */
  @Validate(z.string().optional())
  presetModeStateTopic?: string;

  @Validate(z.string().optional())
  presetModeValueTemplate?: string;

  /** Preset modes supported by this fan. */
  @Validate(z.array(z.string()).optional())
  presetModes?: string[];

  /** If published state messages should be retained. */
  @Validate(z.boolean().optional())
  retain?: boolean;

  /** The maximum device speed, representing 100%. */
  @Validate(z.number().int().positive())
  speedRangeMax = 100;

  /** The minimum device speed. */
  @Validate(z.number().int().positive())
  speedRangeMin = 1;

  /** MQTT topic that publishes the on/off state. */
  @Validate(z.string().optional())
  stateTopic?: string;

  @Validate(z.string().optional())
  stateValueTemplate?: string;

  protected propertyMap() {
    return {
      ...super.propertyMap(),
      component: 'component',
      commandTemplate: 'command_template',
      directionCommandTemplate: 'direction_command_template',
      directionCommandTopic: 'direction_command_topic',
      directionStateTopic: 'direction_state_topic',
      directionValueTemplate: 'direction_value_template',
      optimistic: 'optimistic',
      payloadOff: 'payload_off',
      payloadOn: 'payload_on',
      payloadOscillationOff: 'payload_oscillation_off',
      payloadOscillationOn: 'payload_oscillation_on',
      payloadResetPercentage: 'payload_reset_percentage',
      payloadResetPresetMode: 'payload_reset_preset_mode',
      oscillationCommandTemplate: 'oscillation_command_template',
      oscillationCommandTopic: 'oscillation_command_topic',
      oscillationStateTopic: 'oscillation_state_topic',
      oscillationValueTemplate: 'oscillation_value_template',
      percentageCommandTemplate: 'percentage_command_template',
      percentageCommandTopic: 'percentage_command_topic',
      percentageStateTopic: 'percentage_state_topic',
      percentageValueTemplate: 'percentage_value_template',
      presetModeCommandTemplate: 'preset_mode_command_template',
      presetModeCommandTopic: 'preset_mode_command_topic',
      presetModeStateTopic: 'preset_mode_state_topic',
      presetModeValueTemplate: 'preset_mode_value_template',
      presetModes: 'preset_modes',
      retain: 'retain',
      speedRangeMax: 'speed_range_max',
      speedRangeMin: 'speed_range_min',
      stateTopic: 'state_topic',
      stateValueTemplate: 'state_value_template',
    } as const satisfies PropertyMap<FanInfo>;
  }
}
