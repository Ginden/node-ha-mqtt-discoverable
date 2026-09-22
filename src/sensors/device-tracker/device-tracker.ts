import { TopicEntity } from '../topic-entity';
import { DeviceTrackerInfo } from './device-tracker-info';

/** Home Assistant MQTT device tracker entity. */
export class DeviceTracker extends TopicEntity<DeviceTrackerInfo> {
  updateState(value: string) {
    return this.publishState('state_topic', value);
  }

  home() {
    return this.updateState(this.entity.payloadHome ?? 'home');
  }
  notHome() {
    return this.updateState(this.entity.payloadNotHome ?? 'not_home');
  }
  setLocation(latitude: number, longitude: number, gpsAccuracy?: number) {
    return this.setAttributes({
      latitude,
      longitude,
      ...(gpsAccuracy === undefined ? {} : { gps_accuracy: gpsAccuracy }),
    });
  }
}
