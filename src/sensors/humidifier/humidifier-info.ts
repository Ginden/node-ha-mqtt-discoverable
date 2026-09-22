import { z } from 'zod';
import { EntityInfo } from '../../entity-info';
import { PropertyMap } from '../../types/property-map';
import { Validate } from '../../validate';

/** MQTT discovery options. @see https://www.home-assistant.io/integrations/humidifier.mqtt/ */
export class HumidifierInfo extends EntityInfo {
  static wholeValidation(obj: HumidifierInfo) {
    super.wholeValidation(obj);
    if ((obj.minHumidity ?? 0) > (obj.maxHumidity ?? 100))
      throw new RangeError('minHumidity must not exceed maxHumidity');
    if (obj.modes?.length && !obj.modeCommandTopic)
      throw new Error('modeCommandTopic is required when humidifier modes are configured');
  }

  @Validate(z.literal('humidifier'))
  readonly component = 'humidifier';

  @Validate(z.string().optional())
  actionTemplate?: string;

  @Validate(z.string().optional())
  actionTopic?: string;

  @Validate(z.string().optional())
  currentHumidityTemplate?: string;

  @Validate(z.string().optional())
  currentHumidityTopic?: string;

  @Validate(z.string().optional())
  commandTemplate?: string;

  @Validate(z.string().optional())
  commandTopic?: string;

  @Validate(z.number().finite().optional())
  maxHumidity?: number;

  @Validate(z.number().finite().optional())
  minHumidity?: number;

  @Validate(z.boolean().optional())
  optimistic?: boolean;

  @Validate(z.string().optional())
  payloadOff?: string;

  @Validate(z.string().optional())
  payloadOn?: string;

  @Validate(z.string().optional())
  payloadResetHumidity?: string;

  @Validate(z.string().optional())
  payloadResetMode?: string;

  @Validate(z.string().optional())
  targetHumidityCommandTemplate?: string;

  @Validate(z.string().optional())
  targetHumidityCommandTopic?: string;

  @Validate(z.string().optional())
  targetHumidityStateTopic?: string;

  @Validate(z.string().optional())
  targetHumidityStateTemplate?: string;

  @Validate(z.string().optional())
  modeCommandTemplate?: string;

  @Validate(z.string().optional())
  modeCommandTopic?: string;

  @Validate(z.string().optional())
  modeStateTopic?: string;

  @Validate(z.string().optional())
  modeStateTemplate?: string;

  @Validate(z.array(z.string()).optional())
  modes?: string[];

  @Validate(z.boolean().optional())
  retain?: boolean;

  @Validate(z.string().optional())
  stateTopic?: string;

  @Validate(z.string().optional())
  stateValueTemplate?: string;

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
      commandTemplate: 'command_template',
      commandTopic: 'command_topic',
      maxHumidity: 'max_humidity',
      minHumidity: 'min_humidity',
      optimistic: 'optimistic',
      payloadOff: 'payload_off',
      payloadOn: 'payload_on',
      payloadResetHumidity: 'payload_reset_humidity',
      payloadResetMode: 'payload_reset_mode',
      targetHumidityCommandTemplate: 'target_humidity_command_template',
      targetHumidityCommandTopic: 'target_humidity_command_topic',
      targetHumidityStateTopic: 'target_humidity_state_topic',
      targetHumidityStateTemplate: 'target_humidity_state_template',
      modeCommandTemplate: 'mode_command_template',
      modeCommandTopic: 'mode_command_topic',
      modeStateTopic: 'mode_state_topic',
      modeStateTemplate: 'mode_state_template',
      modes: 'modes',
      retain: 'retain',
      stateTopic: 'state_topic',
      stateValueTemplate: 'state_value_template',
      jsonAttributesTemplate: 'json_attributes_template',
      jsonAttributesTopic: 'json_attributes_topic',
    } as const satisfies PropertyMap<HumidifierInfo>;
  }
}
