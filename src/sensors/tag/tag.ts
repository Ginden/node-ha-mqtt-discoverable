import { TopicEntity } from '../topic-entity';
import { TagScannerInfo } from './tag-info';

/** Home Assistant MQTT tag entity. */
export class TagScanner extends TopicEntity<TagScannerInfo> {
  protected get topicDefaults() {
    return { topic: '' };
  }

  generateConfig() {
    const config = super.generateConfig();
    return {
      topic: config.topic,
      ...(this.entity.device ? { device: this.entity.device.modelDump() } : {}),
      ...(this.entity.qos === undefined ? {} : { qos: this.entity.qos }),
      ...(this.entity.valueTemplate === undefined
        ? {}
        : { value_template: this.entity.valueTemplate }),
    };
  }
  scan(tagId: string) {
    return this.publishState('topic', tagId, false);
  }
}
