import { z } from 'zod';
import { EntityInfo } from '../../entity-info';
import { PropertyMap } from '../../types/property-map';
import { Validate } from '../../validate';

/** MQTT discovery options. @see https://www.home-assistant.io/integrations/lawn_mower.mqtt/ */
export class LawnMowerInfo extends EntityInfo {
  @Validate(z.literal('lawn_mower'))
  readonly component = 'lawn_mower';

  @Validate(z.string().optional())
  activityStateTopic?: string;

  @Validate(z.string().optional())
  activityValueTemplate?: string;

  @Validate(z.string().optional())
  dockCommandTemplate?: string;

  @Validate(z.string().optional())
  dockCommandTopic?: string;

  @Validate(z.boolean().optional())
  optimistic?: boolean;

  @Validate(z.string().optional())
  pauseCommandTemplate?: string;

  @Validate(z.string().optional())
  pauseCommandTopic?: string;

  @Validate(z.string().optional())
  startMowingCommandTemplate?: string;

  @Validate(z.string().optional())
  startMowingCommandTopic?: string;

  @Validate(z.boolean().optional())
  retain?: boolean;

  @Validate(z.string().optional())
  jsonAttributesTemplate?: string;

  @Validate(z.string().optional())
  jsonAttributesTopic?: string;

  @Validate(z.string().optional())
  stopCommandTopic?: string;

  @Validate(z.string().optional())
  stopCommandTemplate?: string;

  protected propertyMap() {
    return {
      ...super.propertyMap(),
      stopCommandTopic: 'stop_command_topic',
      stopCommandTemplate: 'stop_command_template',
      activityStateTopic: 'activity_state_topic',
      activityValueTemplate: 'activity_value_template',
      dockCommandTemplate: 'dock_command_template',
      dockCommandTopic: 'dock_command_topic',
      optimistic: 'optimistic',
      pauseCommandTemplate: 'pause_command_template',
      pauseCommandTopic: 'pause_command_topic',
      startMowingCommandTemplate: 'start_mowing_command_template',
      startMowingCommandTopic: 'start_mowing_command_topic',
      retain: 'retain',
      jsonAttributesTemplate: 'json_attributes_template',
      jsonAttributesTopic: 'json_attributes_topic',
    } as const satisfies PropertyMap<LawnMowerInfo>;
  }
}
