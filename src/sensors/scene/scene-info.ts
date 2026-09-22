import { z } from 'zod';
import { EntityInfo } from '../../entity-info';
import { PropertyMap } from '../../types/property-map';
import { Validate } from '../../validate';

/** MQTT discovery options. @see https://www.home-assistant.io/integrations/scene.mqtt/ */
export class SceneInfo extends EntityInfo {
  @Validate(z.literal('scene'))
  readonly component = 'scene';

  @Validate(z.string().optional())
  commandTopic?: string;

  @Validate(z.string().optional())
  payloadOn?: string;

  @Validate(z.boolean().optional())
  retain?: boolean;

  @Validate(z.string().optional())
  jsonAttributesTemplate?: string;

  @Validate(z.string().optional())
  jsonAttributesTopic?: string;

  protected propertyMap() {
    return {
      ...super.propertyMap(),
      commandTopic: 'command_topic',
      payloadOn: 'payload_on',
      retain: 'retain',
      jsonAttributesTemplate: 'json_attributes_template',
      jsonAttributesTopic: 'json_attributes_topic',
    } as const satisfies PropertyMap<SceneInfo>;
  }
}
