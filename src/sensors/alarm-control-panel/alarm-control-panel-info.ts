import { z } from 'zod';
import { EntityInfo } from '../../entity-info';
import { PropertyMap } from '../../types/property-map';
import { Validate } from '../../validate';

/** MQTT discovery options. @see https://www.home-assistant.io/integrations/alarm_control_panel.mqtt/ */
export class AlarmControlPanelInfo extends EntityInfo {
  @Validate(z.literal('alarm_control_panel'))
  readonly component = 'alarm_control_panel';

  @Validate(z.string().optional())
  code?: string;

  @Validate(z.boolean().optional())
  codeArmRequired?: boolean;

  @Validate(z.boolean().optional())
  codeDisarmRequired?: boolean;

  @Validate(z.boolean().optional())
  codeTriggerRequired?: boolean;

  @Validate(z.string().optional())
  commandTemplate?: string;

  @Validate(z.string().optional())
  commandTopic?: string;

  @Validate(z.string().optional())
  payloadArmAway?: string;

  @Validate(z.string().optional())
  payloadArmHome?: string;

  @Validate(z.string().optional())
  payloadArmNight?: string;

  @Validate(z.string().optional())
  payloadArmVacation?: string;

  @Validate(z.string().optional())
  payloadArmCustomBypass?: string;

  @Validate(z.string().optional())
  payloadDisarm?: string;

  @Validate(z.string().optional())
  payloadTrigger?: string;

  @Validate(z.boolean().optional())
  retain?: boolean;

  @Validate(z.string().optional())
  stateTopic?: string;

  @Validate(z.array(z.string()).optional())
  supportedFeatures?: string[];

  @Validate(z.string().optional())
  valueTemplate?: string;

  @Validate(z.string().optional())
  jsonAttributesTemplate?: string;

  @Validate(z.string().optional())
  jsonAttributesTopic?: string;

  protected propertyMap() {
    return {
      ...super.propertyMap(),
      code: 'code',
      codeArmRequired: 'code_arm_required',
      codeDisarmRequired: 'code_disarm_required',
      codeTriggerRequired: 'code_trigger_required',
      commandTemplate: 'command_template',
      commandTopic: 'command_topic',
      payloadArmAway: 'payload_arm_away',
      payloadArmHome: 'payload_arm_home',
      payloadArmNight: 'payload_arm_night',
      payloadArmVacation: 'payload_arm_vacation',
      payloadArmCustomBypass: 'payload_arm_custom_bypass',
      payloadDisarm: 'payload_disarm',
      payloadTrigger: 'payload_trigger',
      retain: 'retain',
      stateTopic: 'state_topic',
      supportedFeatures: 'supported_features',
      valueTemplate: 'value_template',
      jsonAttributesTemplate: 'json_attributes_template',
      jsonAttributesTopic: 'json_attributes_topic',
    } as const satisfies PropertyMap<AlarmControlPanelInfo>;
  }
}
