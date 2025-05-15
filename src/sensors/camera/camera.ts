import { assert } from 'tsafe';
import { Subscriber } from '../../subscriber';
import { CameraInfo } from './camera-info';

/**
 * Implements an MQTT camera for Home Assistant discovery
 */
export class Camera extends Subscriber<CameraInfo> {
  /**
   * Update the camera state (image URL).
   */
  setTopic(imageTopic: string) {
    return this._state_helper(imageTopic);
  }

  /**
   * Update the camera availability status.
   */
  setAvailability(available: boolean) {
    assert(this.entity.availabilityTopic, 'Availability topic is not set');
    return this.publish(
      this.entity.availabilityTopic,
      available ? this.entity.payloadAvailable : this.entity.payloadNotAvailable,
    );
  }
}
