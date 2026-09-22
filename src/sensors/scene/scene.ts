import { TopicSubscriber } from '../topic-entity';
import { SceneInfo } from './scene-info';

/** Home Assistant MQTT scene entity. */
export class Scene extends TopicSubscriber<SceneInfo> {
  protected get topicDefaults() {
    return { command_topic: 'command' };
  }
}
