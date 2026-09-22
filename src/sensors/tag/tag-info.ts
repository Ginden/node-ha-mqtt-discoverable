import { z } from 'zod';
import { EntityInfo } from '../../entity-info';
import { PropertyMap } from '../../types/property-map';
import { Validate } from '../../validate';

/** MQTT discovery options. @see https://www.home-assistant.io/integrations/tag.mqtt/ */
export class TagScannerInfo extends EntityInfo {
  @Validate(z.literal('tag'))
  readonly component = 'tag';

  @Validate(z.string().optional())
  topic?: string;

  @Validate(z.string().optional())
  valueTemplate?: string;

  protected propertyMap() {
    return {
      ...super.propertyMap(),
      topic: 'topic',
      valueTemplate: 'value_template',
    } as const satisfies PropertyMap<TagScannerInfo>;
  }
}
