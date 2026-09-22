import { TopicSubscriber } from '../topic-entity';
import { UpdateInfo } from './update-info';

export interface UpdateState {
  installed_version?: string;
  latest_version?: string;
  title?: string;
  release_summary?: string;
  release_url?: string;
  entity_picture?: string;
  in_progress?: boolean;
  update_percentage?: number | null;
}

/** Home Assistant MQTT update entity. */
export class Update extends TopicSubscriber<UpdateInfo> {
  updateState(value: string | UpdateState) {
    return this.publishState(
      'state_topic',
      typeof value === 'string' ? value : JSON.stringify(value),
    );
  }
  setLatestVersion(value: string) {
    return this.publishState('latest_version_topic', value);
  }
}
