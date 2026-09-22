import { z } from 'zod';
import { EntityInfo } from '../../entity-info';
import { PropertyMap } from '../../types/property-map';
import { Validate } from '../../validate';

/** MQTT discovery options. @see https://www.home-assistant.io/integrations/vacuum.mqtt/ */
export class VacuumInfo extends EntityInfo {
  @Validate(z.literal('vacuum'))
  readonly component = 'vacuum';

  @Validate(z.string().optional())
  cleanSegmentsCommandTemplate?: string;

  @Validate(z.string().optional())
  cleanSegmentsCommandTopic?: string;

  @Validate(z.string().optional())
  commandTopic?: string;

  @Validate(z.array(z.string()).optional())
  fanSpeedList?: string[];

  @Validate(z.string().optional())
  payloadCleanSpot?: string;

  @Validate(z.string().optional())
  payloadLocate?: string;

  @Validate(z.string().optional())
  payloadPause?: string;

  @Validate(z.string().optional())
  payloadReturnToBase?: string;

  @Validate(z.string().optional())
  payloadStart?: string;

  @Validate(z.string().optional())
  payloadStop?: string;

  @Validate(z.boolean().optional())
  retain?: boolean;

  @Validate(z.string().optional())
  sendCommandTopic?: string;

  @Validate(z.string().optional())
  setFanSpeedTopic?: string;

  @Validate(z.string().optional())
  stateTopic?: string;

  @Validate(z.array(z.string()).optional())
  supportedFeatures?: string[];

  @Validate(z.literal('state'))
  readonly schema = 'state';

  @Validate(z.string().optional())
  jsonAttributesTemplate?: string;

  @Validate(z.string().optional())
  jsonAttributesTopic?: string;

  protected propertyMap() {
    return {
      ...super.propertyMap(),
      cleanSegmentsCommandTemplate: 'clean_segments_command_template',
      cleanSegmentsCommandTopic: 'clean_segments_command_topic',
      commandTopic: 'command_topic',
      fanSpeedList: 'fan_speed_list',
      payloadCleanSpot: 'payload_clean_spot',
      payloadLocate: 'payload_locate',
      payloadPause: 'payload_pause',
      payloadReturnToBase: 'payload_return_to_base',
      payloadStart: 'payload_start',
      payloadStop: 'payload_stop',
      retain: 'retain',
      sendCommandTopic: 'send_command_topic',
      setFanSpeedTopic: 'set_fan_speed_topic',
      stateTopic: 'state_topic',
      supportedFeatures: 'supported_features',
      schema: 'schema',
      jsonAttributesTemplate: 'json_attributes_template',
      jsonAttributesTopic: 'json_attributes_topic',
    } as const satisfies PropertyMap<VacuumInfo>;
  }
}
