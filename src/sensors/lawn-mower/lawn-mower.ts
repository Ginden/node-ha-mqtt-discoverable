import { TopicSubscriber } from '../topic-entity';
import { LawnMowerInfo } from './lawn-mower-info';

export type LawnMowerActivity = 'mowing' | 'docked' | 'paused' | 'returning' | 'error';

/** Home Assistant MQTT lawn mower entity. */
export class LawnMower extends TopicSubscriber<LawnMowerInfo> {
  protected get topicDefaults() {
    return {
      activity_state_topic: '',
      dock_command_topic: 'dock/command',
      pause_command_topic: 'pause/command',
      start_mowing_command_topic: 'start/command',
    };
  }
  protected get commandTopicKeys() {
    return [
      'start_mowing_command_topic',
      'dock_command_topic',
      'pause_command_topic',
      'stop_command_topic',
    ];
  }
  setActivity(value: LawnMowerActivity) {
    return this.publishState('activity_state_topic', value);
  }
}
