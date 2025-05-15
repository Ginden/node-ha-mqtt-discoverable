import { Validate } from '../../validate';
import { z } from 'zod';
import { EntityInfo } from '../../entity-info';
import { PropertyMap } from '../../types/property-map';

/**
 * Information about the 'image' entity.
 */
export class ImageInfo extends EntityInfo {
  /** The component type is 'image' for this entity. */
  @Validate(z.literal('image'))
  readonly component = 'image';

  /** The MQTT topic subscribed to publish the image availability. */
  @Validate(z.string().optional())
  availabilityTopic?: string;

  /** Payload to publish to indicate the image is online. */
  @Validate(z.string())
  payloadAvailable = 'online';

  /** Payload to publish to indicate the image is offline. */
  @Validate(z.string())
  payloadNotAvailable = 'offline';

  /**
   * The MQTT topic to subscribe to receive an image URL. A url_template option can extract the URL from the message.
   * The content_type will be derived from the image when downloaded.
   */
  @Validate(z.string().optional())
  urlTopic?: string;

  /** If the published message should have the retain flag on or not. */
  @Validate(z.boolean().optional())
  retain?: boolean;

  /**
   * Mapping of class properties to MQTT payload keys.
   */
  protected propertyMap() {
    return {
      ...super.propertyMap(),
      component: 'component',
      availabilityTopic: 'availability_topic',
      payloadAvailable: 'payload_available',
      payloadNotAvailable: 'payload_not_available',
      urlTopic: 'url_topic',
      retain: 'retain',
    } as const satisfies PropertyMap<ImageInfo>;
  }
}
