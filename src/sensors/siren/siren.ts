import { TopicSubscriber } from '../topic-entity';
import { SirenInfo } from './siren-info';

/** Home Assistant MQTT siren entity. */
export class Siren extends TopicSubscriber<SirenInfo> {
  updateState(on: boolean) {
    return this.publishState(
      'state_topic',
      on
        ? (this.entity.stateOn ?? this.entity.payloadOn ?? 'ON')
        : (this.entity.stateOff ?? this.entity.payloadOff ?? 'OFF'),
    );
  }
  switchOn() {
    return this.updateState(true);
  }
  switchOff() {
    return this.updateState(false);
  }
}
