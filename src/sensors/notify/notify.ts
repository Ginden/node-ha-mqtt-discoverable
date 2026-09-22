import { TopicSubscriber } from '../topic-entity';
import { NotifyInfo } from './notify-info';

/** Home Assistant MQTT notify entity. */
export class Notify extends TopicSubscriber<NotifyInfo> {
  protected get topicDefaults() {
    return { command_topic: 'command' };
  }
}
