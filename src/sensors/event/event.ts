import { TopicEntity } from '../topic-entity';
import { EventInfo } from './event-info';

/** Home Assistant MQTT event entity. */
export class MqttEvent extends TopicEntity<EventInfo> {
  trigger(eventType: string, attributes: Record<string, unknown> = {}) {
    if (!this.entity.eventTypes.includes(eventType)) {
      throw new RangeError(`Event type ${eventType} is not configured`);
    }
    return this.publishState(
      'state_topic',
      JSON.stringify({ ...attributes, event_type: eventType }),
      false,
    );
  }
}
