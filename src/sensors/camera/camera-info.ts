import { z } from 'zod';
import { EntityInfo } from '../../entity-info';
import { Validate } from '../../validate';
import { PropertyMap } from '../../types/property-map';

/**
 * Information about the 'camera' entity.
 */
export class CameraInfo extends EntityInfo {
  /** The component type is 'camera' for this entity. */
  @Validate(z.literal('camera'))
  readonly component = 'camera';

  /** The MQTT topic subscribed to publish the camera availability. */
  @Validate(z.string().optional())
  availabilityTopic?: string;

  /** Payload to publish to indicate the camera is online. */
  @Validate(z.string())
  readonly payloadAvailable = 'online';

  /** Payload to publish to indicate the camera is offline. */
  @Validate(z.string())
  readonly payloadNotAvailable = 'offline';

  /**
   * The MQTT topic to subscribe to receive an image URL. A url_template option can extract the URL from the message.
   * The content_type will be derived from the image when downloaded.
   */
  @Validate(z.string().optional())
  topic?: string;

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
      topic: 'topic',
      retain: 'retain',
    } as const satisfies PropertyMap<CameraInfo>;
  }
}
