import { Discoverable } from '../../discoverable';
import { ImageInfo } from './image-info';

/**
 * Implements an MQTT image for Home Assistant discovery
 */
export class Image extends Discoverable<ImageInfo> {
  /** Update the image URL */
  setUrl(imageUrl: string) {
    return this._state_helper(imageUrl);
  }
}
