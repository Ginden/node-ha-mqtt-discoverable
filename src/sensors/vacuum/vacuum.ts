import { TopicSubscriber } from '../topic-entity';
import { VacuumInfo } from './vacuum-info';

export interface VacuumState {
  [attribute: string]: unknown;
  state: 'cleaning' | 'docked' | 'paused' | 'idle' | 'returning' | 'error';
  battery_level?: number;
  fan_speed?: string;
  error?: string;
}

/** Home Assistant MQTT vacuum entity. */
export class Vacuum extends TopicSubscriber<VacuumInfo> {
  protected get commandTopicKeys() {
    return [
      'command_topic',
      'send_command_topic',
      'set_fan_speed_topic',
      'clean_segments_command_topic',
    ];
  }
  updateState(value: VacuumState) {
    return this.publishState('state_topic', JSON.stringify(value));
  }
}
