import { TopicSubscriber } from '../topic-entity';
import { HumidifierInfo } from './humidifier-info';

/** Home Assistant MQTT humidifier entity. */
export class Humidifier extends TopicSubscriber<HumidifierInfo> {
  protected get topicDefaults() {
    return {
      command_topic: 'command',
      state_topic: '',
      target_humidity_command_topic: 'humidity/command',
      target_humidity_state_topic: 'humidity',
    };
  }
  protected get commandTopicKeys() {
    return ['command_topic', 'target_humidity_command_topic', 'mode_command_topic'];
  }
  switchOn() {
    return this.publishState('state_topic', this.entity.payloadOn ?? 'ON');
  }
  switchOff() {
    return this.publishState('state_topic', this.entity.payloadOff ?? 'OFF');
  }
  setTargetHumidity(humidity: number) {
    if (
      !Number.isFinite(humidity) ||
      humidity < (this.entity.minHumidity ?? 0) ||
      humidity > (this.entity.maxHumidity ?? 100)
    ) {
      throw new RangeError('Target humidity is outside the configured range');
    }
    return this.publishState('target_humidity_state_topic', humidity);
  }
  setMode(mode: string) {
    if (!this.entity.modes?.includes(mode)) throw new RangeError(`Mode ${mode} is not configured`);
    return this.publishState('mode_state_topic', mode);
  }
  setCurrentHumidity(value: number) {
    return this.publishState('current_humidity_topic', value);
  }
  setAction(value: 'off' | 'idle' | 'drying' | 'humidifying') {
    return this.publishState('action_topic', value);
  }
}
